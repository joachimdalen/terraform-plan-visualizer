import { randomId } from "@mantine/hooks";
import type { Edge, Node } from "@xyflow/react";

type TfResource = {
  address: string;
  mode: string;
  type: string;
  name: string;
  provider_name: string;
  index?: string;
};

export type ResourceNodeData = {
  index?: string;
  name: string;
  type: string;
  provider: string;
  module?: {
    name: string;
    address: string;
    index?: string;
  };
};

function parseResources(resources: TfResource[]): Node[] {
  const parsed: Node[] = [];
  let index = 0;
  for (const node of resources) {
    const isInModule = node.address.startsWith("module.");
    const parsedNode: Node<ResourceNodeData> = {
      id: node.address,
      type: "resourceNode",
      position: { x: isInModule ? 10 : 0, y: (index + 1) * 100 },
      data: {
        index: node.index,
        name: node.name,
        type: node.type,
        provider: node.provider_name.replace("registry.terraform.io/", ""),
        module: isInModule
          ? {
              address: getModuleAddress(node.address),
              name: getModuleName(node.address),
              index: getModuleIndex(node.address),
            }
          : undefined,
      },
    };
    parsed.push(parsedNode);
    index++;
  }

  return parsed;
}
function parseModules(modules: { address: string; resources: TfResource[] }[]) {
  const parsed: Node[] = [];
  let index = 0;
  for (const module of modules) {
    const groupId = module.address;
    const group: Node = {
      id: groupId,
      position: { x: index * 350 + 325, y: 200 },
      data: { name: module.address, index: module.index },
      width: 250 + 20 * module.resources.length,
      height: 115 * module.resources.length,
      type: "moduleNode",
    };

    const resourceNodes: Node[] = parseResources(module.resources).map((x) => ({
      ...x,
      parentId: groupId,
      extent: "parent",
    }));
    parsed.push(group);
    parsed.push(...resourceNodes);
    index++;
  }

  return parsed;
}

function parseEdges(
  edges: { source: string; target: string }[],
  nodes: Node[]
): Edge[] {
  const parsed: Edge[] = [];
  console.log(edges);
  for (const edge of edges) {
    //console.log(edge);
    const sourceNode = nodes.filter(
      (x) => x.id.replace(/\[\".+\"\]/, "") === edge.source
    );
    const targetNodes = nodes.filter(
      (x) => x.id.replace(/\[\".+\"\]/, "") === edge.target
    );
    for (const sn of sourceNode) {
      for (const tn of targetNodes) {
        if (sn.parentId !== undefined && tn.parentId !== undefined) {
          if (sn.parentId != tn.parentId) {
            continue;
          }
          parsed.push({
            id: randomId(),
            source: sn.id,
            target: tn.id,
            type: "step",
          });
          continue;
        }

        if (sn.data.index === undefined && tn.data.index === undefined) {
          parsed.push({
            id: randomId(),
            source: sn.id,
            target: tn.id,
            type: "step",
          });
          continue;
        }
        if (sn.data.index != tn.data.index) {
          continue;
        }

        parsed.push({
          id: randomId(),
          source: sn.id,
          target: tn.id,
          type: "step",
        });
      }
    }
  }

  return parsed;
}

function getModuleAddress(address: string): string {
  const name = getModuleName(address);
  return name.replace(/\[\".+\"\]/, "");
}
function getModuleName(address: string): string {
  const parts = address.split(".");
  //if (parts.length < 2) return null;
  return parts[1];
}
function getModuleIndex(address: string): string | undefined {
  const name = getModuleName(address);
  const regex = /\[\\"(?<index>.+)\\"\]/gm;
  const res = regex.exec(name);
  if (res?.groups?.index) {
    return res.groups.index;
  }
  return undefined;
}

export { parseEdges, parseModules, parseResources };
