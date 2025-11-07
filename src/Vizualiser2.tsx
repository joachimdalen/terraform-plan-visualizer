import {
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import DataNode from "./components/nodes/DataNode/DataNode";
import LabeledGroupNode from "./components/nodes/LabeledGroupNode/LabeledGroupNode";
import ResourceNode from "./components/nodes/ResourceNode/ResourceNode";
import useLayoutedElements from "./hooks/getLayoutedElements";
import { buildEdges } from "./packages/node-builder/edge-builder";
import { getNodesFromPlan2 } from "./packages/node-builder/node-builder";
import { parseTfConfigPlan } from "./packages/tf-parser/tf-config-plan-parser";
import { parseTfPlan } from "./tf-parser/tf-plan-parser";

type Props = {
  onNodeSelect: (node: Node) => void;
  planFile?: string;
};

const nodeTypes = {
  resourceNode: ResourceNode,
  labelNode: LabeledGroupNode,
  dataNode: DataNode,
};

//const parsedPlan = parseTfPlan(demoData);
// const nodesFromPlan = getNodesFromPlan(parsedPlan);
// const edgesFromGraph = parseTfGraph(nodesFromPlan);

//console.group("Parsed plan");
// console.log(edgesFromGraph);
// console.log(nodesFromPlan);
//formatNodeCluster(nodesFromPlan, edgesFromGraph).then((d) => console.log(d));
//console.groupEnd();

// const parsedConfig = parseTfConfigPlan(demoData);
// const nodesFromPlanAndConfig = getNodesFromPlan2(parsedPlan, parsedConfig);
// const nodeEdges = buildEdges(parsedConfig, nodesFromPlanAndConfig);
// console.group("Parsed configuration");
// console.log(parsedPlan);
// console.log(parsedConfig);
// console.log(nodesFromPlanAndConfig);
// console.log(nodeEdges);
// console.groupEnd();

function Vizualiser2({ onNodeSelect, planFile }: Props) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (planFile === undefined) return;

    const jsonPlanFile = JSON.parse(planFile);
    const parsedJsonPlan = parseTfPlan(jsonPlanFile);
    const parsedJsonConfig = parseTfConfigPlan(jsonPlanFile);
    const nodesFromPlanAndConfig = getNodesFromPlan2(
      parsedJsonPlan,
      parsedJsonConfig
    );
    const nodeEdges = buildEdges(parsedJsonConfig, nodesFromPlanAndConfig);
    // console.group("Parsed configuration");
    // console.log(parsedPlan);
    // console.log(parsedConfig);
    // console.log(nodesFromPlanAndConfig);
    // console.log(nodeEdges);
    // console.groupEnd();

    setNodes(nodesFromPlanAndConfig);
    setEdges(nodeEdges);
  }, [planFile]);

  // useEffect(() => {
  //   createLayout(nodesFromPlanAndConfig, nodeEdges).then((res) => {
  //     setNodes(res?.nodes);
  //     setEdges(res?.edges);
  //   });
  // }, []);

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
