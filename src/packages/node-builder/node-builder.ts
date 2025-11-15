import type { Node } from "@xyflow/react";
import type {
  CustomNodeType,
  DataNode,
  ModuleNode,
  ResourceNode,
} from "../../components/nodes/types";
import { getDataId } from "../ids";
import type { TfVizPlan, TfVizResource } from "../tf-parser/tf-plan-parser";
import type { TfVizConfigPlan, TfVizConfigResource } from "../tf-parser/types";
import {
  dataNodeName,
  moduleNodeName,
  resourceNodeName,
} from "./graphConstants";

function buildResourceNode(resource: TfVizResource, idx: number) {
  const node: Node<TfVizResource> = {
    id: resource.id,
    position: { x: 10, y: 100 * idx },
    data: resource,
    type: resourceNodeName,
  };
  return node;
}
function buildDataNode(
  resource: TfVizConfigResource,
  idx: number,
  parentId?: string
): DataNode {
  const node: DataNode = {
    id: getDataId(),
    position: { x: 10, y: 150 * idx },
    data: {
      id: resource.id,
      address: resource.address,
      name: resource.name,
      type: resource.type,
      provider: resource.provider,
    },
    type: dataNodeName,
  };

  if (parentId) {
    return {
      ...node,
      parentId: parentId!,
      extent: "parent",
    };
  }

  return node;
}

function getNodesFromPlan(
  plan: TfVizPlan,
  config: TfVizConfigPlan
): CustomNodeType[] {
  const resourceNodes = plan.resources.map((r, i) => buildResourceNode(r, i));
  const dataNodes = config.resources
    .filter((x) => x.mode === "data")
    .map((dn, i) => buildDataNode(dn, i));

  const moduleNodesAndResources = plan.modules.flatMap(
    ({ resources, baseAddress, ...modRest }, mi) => {
      const tempName = baseAddress.split(".")[1];
      //const modId = getModuleId();

      const moduleResources = resources.map((res, ri) => {
        const node: ResourceNode = {
          id: res.id,
          type: resourceNodeName,
          position: { x: 10, y: (ri + 1) * 75 },
          parentId: modRest.id,
          extent: "parent",
          data: res,
        };
        return node;
      });

      let moduleData: DataNode[] = [];
      const configModule = config.modules.find((x) => x.name === tempName);
      if (configModule) {
        moduleData = configModule.resources
          .filter((x) => x.mode === "data")
          .map((dn, i) => buildDataNode(dn, i, modRest.id));
      }

      const group: ModuleNode = {
        id: modRest.id,
        position: { x: 350, y: 525 * mi },
        data: {
          ...modRest,
          baseAddress,
        },
        width: 500,
        height: 500,
        type: moduleNodeName,
      };
      return [group, ...moduleResources, ...moduleData];
    }
  );

  return [...resourceNodes, ...dataNodes, ...moduleNodesAndResources];
}
export { getNodesFromPlan };
