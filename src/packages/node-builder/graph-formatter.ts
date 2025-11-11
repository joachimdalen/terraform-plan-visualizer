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

export type GraphFormatterOptions = {
  direction: string;
  moduleDirection: string;
  layerSpacing: number;
  nodeSpacing: number;
};
export const defaultGraphOptions: GraphFormatterOptions = {
  direction: "RIGHT",
  moduleDirection: "DOWN",
  layerSpacing: 100,
  nodeSpacing: 40,
};

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
  edges: Edge[],
  options: GraphFormatterOptions
): Promise<CustomNodeType[]> {
  const elk = new ELK();
  const grouped = groupBy(nodes, (n) => n.parentId);
  const nodePositions = new Map<string, NodeLayoutPosition>();
  const nodeSizes = new Map<string, NodeLayoutSize>();

  const baseOptions: LayoutOptions = {
    "elk.algorithm": "layered",
    "elk.direction": options.direction,
    "elk.layered.spacing.nodeNodeBetweenLayers":
      options.layerSpacing.toString(),
    "elk.layered.nodePlacement.strategy": "SIMPLE",
    "elk.spacing.nodeNode": options.nodeSpacing.toString(),
    "elk.edgeRouting": "SPINES",
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
      layoutOptions: {
        ...baseOptions,
        "elk.direction": options.moduleDirection,
      },
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
      x: layout.x || 500,
      y: layout.y || 500,
    });
    nodeSizes.set(moduleKey, {
      width: layout.width || 100,
      height: (layout.height || 0) + ModuleNodeExtraHeight,
    });

    for (const child of layout.children) {
      nodePositions.set(child.id, {
        x: child.x || 100,
        y: (child.y || 0) + ModuleNodeOffsetY,
      });
      nodeSizes.set(child.id, {
        width: child.width || 100,
        height: child.height || 100,
      });
    }
  }

  const rootNodes = grouped.get("root");
  if (rootNodes === undefined) {
    throw Error("Failed to get root node");
  }
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
        x: child.x || 100,
        y: child.y || 100,
      });
      nodeSizes.set(child.id, {
        width: child.width || 100,
        height: child.height || 100,
      });
    }
  }

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

function getEdgesForNodes(edges: Edge[], nodeIds: string[]): Edge[] {
  return edges.filter(
    (x) => nodeIds.includes(x.source) || nodeIds.includes(x.target)
  );
}

export { formatGraph };
