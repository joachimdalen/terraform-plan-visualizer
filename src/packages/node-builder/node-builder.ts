import type { Node } from "@xyflow/react";
import type {
  CustomNodeType,
  DataNode,
  ModuleNode,
  ResourceNode,
} from "../../components/nodes/types";
import { getDataId } from "../ids";
import type { TfVizPlan, TfVizResource } from "../tf-parser/tf-plan-parser";
import type {
  ChangeType,
  TfVizConfigPlan,
  TfVizConfigResource,
} from "../tf-parser/types";

const moduleNode = "moduleNode";
const resourceNode = "resourceNode";
const dataNode = "dataNode";

function buildResourceNode(
  resource: TfVizResource,
  idx: number,
  actions: Map<string, ChangeType>
) {
  const node: Node<TfVizResource> = {
    id: resource.id,
    position: { x: 10, y: 100 * idx },
    data: { ...resource, changeType: actions.get(resource.address) },
    type: resourceNode,
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
    type: dataNode,
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

function getNodesFromPlan2(
  plan: TfVizPlan,
  config: TfVizConfigPlan,
  actions: Map<string, ChangeType>
): CustomNodeType[] {
  const resourceNodes = plan.resources.map((r, i) =>
    buildResourceNode(r, i, actions)
  );
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
          type: resourceNode,
          position: { x: 10, y: (ri + 1) * 75 },
          parentId: modRest.id,
          extent: "parent",
          data: {
            ...res,
            changeType: actions.get(res.address),
          },
        };
        return node;
      });

      let moduleData: DataNode[] = [];
      const configModule = config.modules.find((x) => x.name === tempName);
      console.log("configModule", configModule, name);
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
        type: moduleNode,
      };
      return [group, ...moduleResources, ...moduleData];
    }
  );

  return [...resourceNodes, ...dataNodes, ...moduleNodesAndResources];
}
export { getNodesFromPlan2 };
