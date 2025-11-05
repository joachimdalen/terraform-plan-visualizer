import {
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type NodeMouseHandler,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import LabeledGroupNode from "./components/nodes/LabeledGroupNode/LabeledGroupNode";
import ResourceNode from "./components/nodes/ResourceNode/ResourceNode";
import createLayout from "./hooks/createLayout";
import useLayoutedElements from "./hooks/getLayoutedElements";
import { getNodesFromPlan } from "./node-builder/getNodesFromPlan";
import demoData from "./templatedata";
import { parseTfGraph } from "./tf-parser/tf-graph-parser";
import { parseTfPlan } from "./tf-parser/tf-plan-parser";

const nodeTypes = {
  resourceNode: ResourceNode,
  labelNode: LabeledGroupNode,
};

const parsedPlan = parseTfPlan(demoData);
const nodesFromPlan = getNodesFromPlan(parsedPlan);
const edgesFromGraph = parseTfGraph(nodesFromPlan);

console.group("Parsed plan");
console.log(parsedPlan);
console.log(edgesFromGraph);
console.log(nodesFromPlan);
//formatNodeCluster(nodesFromPlan, edgesFromGraph).then((d) => console.log(d));
console.groupEnd();

function Vizualiser2({ onNodeSelect }) {
  const [nodes, setNodes] = useState(nodesFromPlan);
  const [edges, setEdges] = useState(edgesFromGraph);

  useEffect(() => {
    createLayout(nodesFromPlan, edgesFromGraph).then((res) => {
      setNodes(res?.nodes);
      setEdges(res?.edges);
    });
  }, []);

  const handleNodeClick = useCallback<NodeMouseHandler>((_, node) => {
    console.log(node);
    onNodeSelect(node.data);
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
  const { getLayoutedElements } = useLayoutedElements();
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
      <Panel position="top-right">
        <button
          onClick={() =>
            getLayoutedElements({
              "elk.algorithm": "layered",
              "elk.direction": "DOWN",
            })
          }
        >
          vertical layout
        </button>
        <button
          onClick={() =>
            getLayoutedElements({
              "elk.algorithm": "layered",
              "elk.direction": "RIGHT",
            })
          }
        >
          horizontal layout
        </button>
        <button
          onClick={() =>
            getLayoutedElements({
              "elk.algorithm": "org.eclipse.elk.radial",
            })
          }
        >
          radial layout
        </button>
        <button
          onClick={() =>
            getLayoutedElements({
              "elk.algorithm": "org.eclipse.elk.force",
            })
          }
        >
          force layout
        </button>
      </Panel>
      <Background color="black" variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
}

export default Vizualiser2;
