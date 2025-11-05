import { Flex, Loader } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Node,
  type NodeMouseHandler,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import LabeledGroupNode from "./components/nodes/LabeledGroupNode/LabeledGroupNode";
import ResourceNode from "./components/nodes/ResourceNode/ResourceNode";
import { formatNodeCluster } from "./node-builder/getLayoutNodes";
import demoData from "./templatedata";
import { parseTfGraph } from "./tf-parser/tf-graph-parser";
import { parseTfPlan } from "./tf-parser/tf-plan-parser";

const nodeTypes = {
  resourceNode: ResourceNode,
  labelNode: LabeledGroupNode,
};

const parsedPlan = parseTfPlan(demoData);
const nodesFromPlan = parsedPlan.modules[0].resources.map((res, ri) => {
  const node: Node = {
    id: randomId(),
    type: "resourceNode",
    position: { x: 10, y: (ri + 1) * 75 },

    data: res,
  };
  return node;
});
//  getNodesFromPlan(parsedPlan);
const edgesFromGraph = parseTfGraph(nodesFromPlan).filter((x) =>
  nodesFromPlan.some((y) => x.source === y.id || x.target === y.id)
);

console.group("Parsed plan");
console.log(parsedPlan);
console.log(nodesFromPlan);
console.log(edgesFromGraph);

console.groupEnd();

function Vizualiser3() {
  const [loading, setLoading] = useState<boolean>(false);
  const [nodes, setNodes] = useState<Node[]>(nodesFromPlan);
  const [edges, setEdges] = useState(edgesFromGraph);

  useEffect(() => {
    formatNodeCluster(nodesFromPlan, edgesFromGraph).then((d) => {
      console.log("Setting nodes", d);
      setNodes((prev) =>
        prev.map((nde) => {
          const nde2 = d.children.find((x) => x.id === nde.id);
          console.log(nde2);
          return {
            ...nde,
            position: {
              x: nde2?.x,
              y: nde2?.y,
            },
          };
        })
      );
    });
  }, []);

  const handleNodeClick = useCallback<NodeMouseHandler>((_, node) => {
    console.log(node);
  }, []);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  if (loading) {
    return (
      <Flex justify="center" flex={1} align="center">
        <Loader />
      </Flex>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={handleNodeClick}
      fitView
    >
      <Background color="black" variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
}

export default Vizualiser3;
