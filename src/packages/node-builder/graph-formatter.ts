import type { Edge } from "@xyflow/react";
import ELK, {
  type ElkNode,
  type LayoutOptions,
} from "elkjs/lib/elk.bundled.js";
import {
  ModuleNodeExtraHeight,
  ModuleNodeOffsetY,
  type CustomNodeType,
} from "../../components/nodes/types";
const dir = "RIGHT";

type NodeLayoutPosition = {
  x: number;
  y: number;
};
type NodeLayoutSize = {
  width: number;
  height: number;
};

function groupBy(
  list: CustomNodeType[],
  keyGetter: (item: CustomNodeType) => string | undefined
) {
  const map = new Map<string, CustomNodeType[]>();
  list.forEach((item) => {
    const key = keyGetter(item) ?? "root";
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

async function formatGraph(
  nodes: CustomNodeType[],
  edges: Edge[]
): Promise<CustomNodeType[]> {
  const elk = new ELK();
  const grouped = groupBy(nodes, (n) => n.parentId);
  const nodePositions = new Map<string, NodeLayoutPosition>();
  const nodeSizes = new Map<string, NodeLayoutSize>();

  const baseOptions: LayoutOptions = {
    "elk.algorithm": "layered",
    "elk.direction": dir,
    "elk.layered.spacing.nodeNodeBetweenLayers": "100",
    "elk.layered.nodePlacement.strategy": "SIMPLE",
    "elk.spacing.nodeNode": "40",
    // "elk.edgeRouting": "SPINES",
  };

  const keys = Array.from(grouped.keys());
  const moduleKeys = keys.filter((x) => x.startsWith("mod-"));

  for (const moduleKey of moduleKeys) {
    const nodes = grouped.get(moduleKey);
    if (nodes === undefined) continue;

    const nodeIds = nodes.map((x) => x.id);
    const edgesForResources = getEdgesForNodes(edges, nodeIds);

    const elkNodes: ElkNode[] = nodes.map((en) => ({
      id: en.id,
      width: en.measured?.width,
      height: en.measured?.height,
    }));

    const graph: ElkNode = {
      id: "root",
      layoutOptions: baseOptions,
      children: elkNodes,
      edges: edgesForResources.map((edge: Edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };
    const layout = await elk.layout(graph);

    if (!layout.children) continue;

    nodePositions.set(moduleKey, {
      x: layout.x,
      y: layout.y,
    });
    nodeSizes.set(moduleKey, {
      width: layout.width,
      height: (layout.height || 0) + ModuleNodeExtraHeight,
    });

    for (const child of layout.children) {
      nodePositions.set(child.id, {
        x: child.x,
        y: (child.y || 0) + ModuleNodeOffsetY,
      });
      nodeSizes.set(child.id, {
        width: child.width,
        height: child.height,
      });
    }
  }

  const rootNodes = grouped.get("root");
  const nodeIds = rootNodes.map((x) => x.id);
  const edgesForResources = getEdgesForNodes(edges, nodeIds);

  const elkNodes: ElkNode[] = rootNodes!.map((en) => {
    if (en.id.startsWith("mod-")) {
      const moduleSize = nodeSizes.get(en.id);
      return {
        id: en.id,
        width: moduleSize?.width,
        height: moduleSize?.height,
      };
    }

    return {
      id: en.id,
      width: en.measured?.width,
      height: en.measured?.height,
    };
  });

  const graph: ElkNode = {
    id: "root",
    layoutOptions: baseOptions,
    children: elkNodes,
    edges: edgesForResources.map((edge: Edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };
  const layout = await elk.layout(graph);

  if (layout.children) {
    for (const child of layout.children) {
      nodePositions.set(child.id, {
        x: child.x,
        y: child.y,
      });
      nodeSizes.set(child.id, {
        width: child.width,
        height: child.height,
      });
    }
  }

  // Format resources in modules
  // Set size of module node (+ offsets)
  // Format root module
  // Report back size and position

  console.log(grouped, nodePositions, nodeSizes);

  return nodes.map((n) => {
    const pos = nodePositions.get(n.id);
    const size = nodeSizes.get(n.id);

    console.log(n.id, pos, size);

    return {
      ...n,
      width: size?.width,
      height: size?.height,
      position: {
        x: pos?.x || n.position.x,
        y: pos?.y || n.position.y,
      },
    };
  });
}

function getEdgesForSubSection(edges: Edge[], currentId: string): Edge[] {
  return edges.filter((x) => x.source === currentId || x.target === currentId);
}
function getEdgesForNodes(edges: Edge[], nodeIds: string[]): Edge[] {
  return edges.filter(
    (x) => nodeIds.includes(x.source) || nodeIds.includes(x.target)
  );
}

//function formatCluster() {}

export { formatGraph };
