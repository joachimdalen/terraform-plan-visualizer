import { type Edge } from "@xyflow/react";
import type {
  CustomNodeType,
  ModuleNode,
  ResourceNode,
} from "../../components/nodes/types";
import { getEdgeId } from "../ids";
import type { TfVizConfigPlan, TfVizConfigResource } from "../tf-parser/types";
import { dataNodeName, edgeType } from "./graphConstants";

function buildEdges(config: TfVizConfigPlan, nodes: CustomNodeType[]) {
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
      const relatedNodes = nodes.filter((x) => {
        if (!dependencyResource?.isLooped || x.type === dataNodeName) {
          return x.id != node.id && x.data.address === dependency;
        }
        const y = x as ResourceNode;
        return (
          y.id != node.id &&
          y.data.baseAddress === dependency &&
          y.data.index === node.data.index
        );
      });

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
  const parent = nodes.find((x) => x.id === node.parentId) as ModuleNode;
  if (parent === undefined) return undefined;
  const module = config.modules.find(
    (x) => x.name === parent.data.baseAddress.replace("module.", "")
  );
  if (module === undefined) return undefined;
  const configResource = module.resources.find(
    (x) => x.address === trimModuleName(node.data.baseAddress, module.name)
  );
  if (configResource === undefined) return undefined;
  for (const dependency of configResource.dependsOn) {
    const dependencyResource = getDependencyFromPlan(dependency, config);
    const relatedNodes = nodes.filter((x) => {
      if (x.type === dataNodeName) {
        return (
          x.parentId === node.parentId &&
          x.id != node.id &&
          x.data.address === dependency
        );
      }
      const y = x as ResourceNode;
      if (dependencyResource?.isLooped) {
        return (
          y.parentId === node.parentId &&
          y.id != node.id &&
          (trimModuleName(y.data.baseAddress, module.name) ||
            y.data.address) === dependency &&
          y.data.index === node.data.index
        );
      }

      return (
        y.parentId === node.parentId &&
        y.id != node.id &&
        (trimModuleName(y.data.baseAddress, module.name) || y.data.address) ===
          dependency
      );
    });

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

  const module = config.modules.find(
    (x) => x.name === node.data.baseAddress.replace("module.", "")
  );
  if (module === undefined) return undefined;
  if (module.dependsOn.length === 0) return undefined;

  for (const dependency of module.dependsOn) {
    const dependencyResource = getDependencyFromPlan(dependency, config);

    const relatedNodes = nodes.filter((x) => {
      if (x.type === dataNodeName) {
        return x.id != node.id && x.data.address === dependency;
      }
      const y = x as ResourceNode;
      if (dependencyResource?.isLooped) {
        return (
          y.id != node.id &&
          y.data.baseAddress === dependency &&
          y.data.index === node.data.index
        );
      }

      return y.id != node.id && y.data.baseAddress === dependency;
    });

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
    const modItem = mod.resources.find(
      (x) => trimModuleName(x.address) === dependency
    );
    if (modItem !== undefined) return modItem;
  }
  return undefined;
}

function trimModuleName(address: string, name?: string) {
  if (name) return address.replace(`module.${name}.`, "");
  const parts = address.split(".");
  return parts.slice(0, 2).join(".");
}

export { buildEdges };
