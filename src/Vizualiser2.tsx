import {
  Background,
  BackgroundVariant,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type NodeMouseHandler,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { useCallback } from "react";
import DataNode from "./components/nodes/DataNode/DataNode";
import LabeledGroupNode from "./components/nodes/LabeledGroupNode/LabeledGroupNode";
import ResourceNode from "./components/nodes/ResourceNode/ResourceNode";
import type { CustomNodeType } from "./components/nodes/types";
import { useTfVizContext } from "./context/TfVizContext";

type Props = {
  onNodeSelect: (node: CustomNodeType) => void;
};

const nodeTypes = {
  resourceNode: ResourceNode,
  labelNode: LabeledGroupNode,
  dataNode: DataNode,
};

function Vizualiser2({ onNodeSelect }: Props) {
  const { nodes, edges, setNodes, setEdges } = useTfVizContext();

  const handleNodeClick = useCallback<NodeMouseHandler<CustomNodeType>>(
    (_, node) => {
      onNodeSelect(node);
    },
    []
  );

  const onNodesChange: OnNodesChange<CustomNodeType> = useCallback(
    (changes) =>
      setNodes((nodesSnapshot: CustomNodeType[]) =>
        applyNodeChanges(changes, nodesSnapshot)
      ),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges]
  );
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDoubleClick={handleNodeClick}
      fitView
    >
      <Background color="black" variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
}

export default Vizualiser2;
