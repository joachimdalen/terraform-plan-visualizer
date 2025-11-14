import { type Edge } from "@xyflow/react";
import type {
  CustomNodeType,
  ModuleNode,
  ResourceNode,
} from "../../components/nodes/types";
import { getEdgeId } from "../ids";
import type { TfVizConfigPlan, TfVizConfigResource } from "../tf-parser/types";

const edgeType = "smoothstep";

function buildEdges(config: TfVizConfigPlan, nodes: CustomNodeType[]) {
  console.log(nodes, config);
  let edges: Edge[] = [];
  for (const node of nodes) {
    if (node.id.startsWith("res-") && node.parentId === undefined) {
      const builtEdges = buildRootResourceEdge(
        node as ResourceNode,
        config,
        nodes
      );
      if (builtEdges === undefined) continue;

      edges = edges.concat(builtEdges);
      continue;
    }

    if (node.id.startsWith("mod-")) {
      const builtEdges = buildModuleEdge(node as ModuleNode, config, nodes);
      if (builtEdges === undefined) continue;

      edges = edges.concat(builtEdges);
      continue;
    }

    if (node.id.startsWith("res-") && node.parentId !== undefined) {
      const builtEdges = buildModuleResourceEdge(
        node as ResourceNode,
        config,
        nodes
      );
      if (builtEdges === undefined) continue;

      edges = edges.concat(builtEdges);
      continue;
    }
    if (node.id.startsWith("data-") && node.parentId === undefined) {
      const builtEdges = buildRootResourceEdge(
        node as ResourceNode,
        config,
        nodes
      );
      if (builtEdges === undefined) continue;

      edges = edges.concat(builtEdges);
      continue;
    }
  }

  //   const edge: Edge = {
  //     id: getEdgeId(),
  //     source: sn.id,
  //     target: tn.id,
  //     type: "step",
  //   };
  //   return edge;
  return edges;
}

function buildRootResourceEdge(
  node: ResourceNode,
  config: TfVizConfigPlan,
  nodes: CustomNodeType[]
): Edge[] | undefined {
  const edges: Edge[] = [];
  // The node is not in a module or indexed
  if (node.data.module === undefined && node.data.index === undefined) {
    const nodeId = node.data.address;
    const configResource = config.resources.find((x) => x.address === nodeId);

    if (configResource === undefined) return undefined;
    if (configResource.dependsOn.length === 0) return undefined;

    for (const dependency of configResource.dependsOn) {
      const relatedNodes = nodes.filter(
        (x) => x.id != node.id && x.data.address === dependency
      );

      for (const relatedNode of relatedNodes) {
        edges.push({
          id: getEdgeId(),
          source: relatedNode.id,
          target: node.id,
          type: edgeType,
        });
      }
    }

    return edges;
  }

  // The node is not in a module and is used in for_each
  if (node.data.module === undefined && node.data.index) {
    const configResource = config.resources.find(
      (x) => x.address === node.data.baseAddress
    );

    if (configResource === undefined) return undefined;
    if (configResource.dependsOn.length === 0) return undefined;

    for (const dependency of configResource.dependsOn) {
      const dependencyResource = getDependencyFromPlan(dependency, config);
      const relatedNodes = nodes.filter((x) =>
        dependencyResource?.isLooped
          ? x.id != node.id &&
            x.data.baseAddress === dependency &&
            x.data.index === node.data.index
          : x.id != node.id && x.data.address === dependency
      );
      // const relatedNodes = nodes.filter(
      //   (x) =>
      //     x.id != node.id &&
      //     x.data.baseAddress === dependency &&
      //     x.data.index === node.data.index
      // );

      for (const relatedNode of relatedNodes) {
        edges.push({
          id: getEdgeId(),
          source: relatedNode.id,
          target: node.id,
          type: edgeType,
          data: {
            label: dependency,
          },
        });
      }
    }
  }
  return edges;
}
function buildModuleResourceEdge(
  node: ResourceNode,
  config: TfVizConfigPlan,
  nodes: CustomNodeType[]
): Edge[] | undefined {
  const edges: Edge[] = [];
  const parent = nodes.find((x) => x.id === node.parentId);
  if (parent === undefined) return undefined;
  const module = config.modules.find(
    (x) => x.name === parent.data.baseAddress.replace("module.", "")
  );
  if (module === undefined) return undefined;
  const configResource = module.resources.find(
    (x) =>
      x.address === node.data.baseAddress.replace(`module.${module.name}.`, "")
  );
  if (configResource === undefined) return undefined;
  for (const dependency of configResource.dependsOn) {
    const relatedNodes = nodes.filter(
      (x) =>
        x.parentId === node.parentId &&
        x.id != node.id &&
        (x.data.baseAddress?.replace(`module.${module.name}.`, "") ||
          x.data.address) === dependency
    );

    for (const relatedNode of relatedNodes) {
      edges.push({
        id: getEdgeId(),
        source: relatedNode.id,
        target: node.id,
        type: edgeType,
      });
    }
  }
  return edges;
}

function buildModuleEdge(
  node: ModuleNode,
  config: TfVizConfigPlan,
  nodes: CustomNodeType[]
): Edge[] | undefined {
  const edges: Edge[] = [];
  // if (node.data.index === undefined) {
  //   console.log("not indexed");
  //   return undefined;
  // }
  const module = config.modules.find(
    (x) => x.name === node.data.baseAddress.replace("module.", "")
  );
  if (module === undefined) return undefined;
  if (module.dependsOn.length === 0) return undefined;

  for (const dependency of module.dependsOn) {
    const dependencyResource = getDependencyFromPlan(dependency, config);
    const relatedNodes = nodes.filter((x) =>
      dependencyResource?.isLooped
        ? x.id != node.id &&
          x.data.baseAddress === dependency &&
          x.data.index === node.data.index
        : x.id != node.id && x.data.baseAddress === dependency
    );
    console.log(node.data.name, dependency, relatedNodes);
    for (const relatedNode of relatedNodes) {
      edges.push({
        id: getEdgeId(),
        source: relatedNode.id,
        target: node.id,
        type: edgeType,
      });
    }
  }
  return edges;
}

function getDependencyFromPlan(
  dependency: string,
  config: TfVizConfigPlan
): TfVizConfigResource | undefined {
  const item = config.resources.find((x) => x.address === dependency);
  if (item !== undefined) return item;
  for (const mod of config.modules) {
    const modItem = mod.resources.find((x) => x.address === dependency);
    if (modItem !== undefined) return modItem;
  }
  return undefined;
}

export { buildEdges };
