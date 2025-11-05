import { randomId } from "@mantine/hooks";
import type { Node } from "@xyflow/react";
import type { TfVizPlan } from "../tf-parser/tf-plan-parser";

const moduleNode = "labelNode";
const resourceNode = "resourceNode";

function getNodesFromPlan(plan: TfVizPlan): Node[] {
  const resourceNodes = plan.resources.map((res, i) => {
    const node: Node = {
      id: randomId(),
      type: resourceNode,
      position: { x: 10, y: (i + 1) * 100 },
      data: res,
    };
    return node;
  });

  const moduleNodesAndResources = plan.modules.flatMap(
    ({ resources, ...modRest }, mi) => {
      const modId = randomId();

      const moduleResources = resources.map((res, ri) => {
        const node: Node = {
          id: randomId(),
          type: resourceNode,
          position: { x: 10, y: (ri + 1) * 75 },
          parentId: modId,
          extent: "parent",
          data: res,
        };
        return node;
      });

      console.log("mod", modRest);
      const group: Node = {
        id: modId,
        position: { x: mi * 350 + 325, y: 200 },
        data: modRest,
        width: 250 + 20 * moduleResources.length,
        height: 125 * moduleResources.length,
        type: moduleNode,
      };
      return [group, ...moduleResources];
    }
  );

  return [...resourceNodes, ...moduleNodesAndResources];
}
export { getNodesFromPlan };
