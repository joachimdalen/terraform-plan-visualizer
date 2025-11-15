import { useComputedColorScheme } from "@mantine/core";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  getOutgoers,
  type Edge,
  type EdgeChange,
  type NodeMouseHandler,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { useCallback } from "react";
import DataNode from "./components/nodes/DataNode/DataNode";
import ModuleNode from "./components/nodes/ModuleNode/ModuleNode";
import ResourceNode from "./components/nodes/ResourceNode/ResourceNode";
import type { CustomNodeType } from "./components/nodes/types";
import { useTfVizContext } from "./context/TfVizContext";

type Props = {
  onNodeSelect: (node: CustomNodeType) => void;
};

const nodeTypes = {
  resourceNode: ResourceNode,
  moduleNode: ModuleNode,
  dataNode: DataNode,
};

function Vizualiser({ onNodeSelect }: Props) {
  const { nodes, edges, setNodes, setEdges } = useTfVizContext();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const highlightNodeDependencies = useCallback(
    (nodeId: string, isSelected: boolean) => {
      const nodeType = nodes.find((x) => x.id === nodeId)?.type;
      const outgoers = getOutgoers({ id: nodeId }, nodes, edges).map(
        (x) => x.id
      );
      const changedEdges: EdgeChange<Edge>[] = edges
        .filter((x) => x.source === nodeId && outgoers.includes(x.target))
        .map((e) => ({
          ...e,
          animated: isSelected,
          style: isSelected
            ? {
                stroke:
                  nodeType === "dataNode"
                    ? "var(--mantine-color-green-5)"
                    : "var(--mantine-color-blue-5)",
                strokeWidth: 2,
              }
            : {},
        }))
        .map((e) => {
          const change: EdgeChange<Edge> = {
            id: e.id,
            item: e,
            type: "replace",
          };
          return change;
        });
      return changedEdges;
    },
    [nodes, edges]
  );

  const onNodeDoubleClick = useCallback<NodeMouseHandler<CustomNodeType>>(
    (_, node) => {
      onNodeSelect(node);
    },
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [setEdges]
  );
  const onNodesChange: OnNodesChange<CustomNodeType> = useCallback(
    (changes) => {
      const selectedNodes = changes.filter((x) => x.type === "select");
      if (selectedNodes.length > 0) {
        const changedEdges = selectedNodes.flatMap((node) => {
          return highlightNodeDependencies(node.id, node.selected || false);
        });
        if (changedEdges.length > 0) {
          onEdgesChange(changedEdges);
        }
      }

      return setNodes((nodesSnapshot: CustomNodeType[]) =>
        applyNodeChanges(changes, nodesSnapshot)
      );
    },
    [highlightNodeDependencies, onEdgesChange, setNodes]
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
      onNodeDoubleClick={onNodeDoubleClick}
      fitView
      colorMode={computedColorScheme === "light" ? "light" : "dark"}
    >
      <Background variant={BackgroundVariant.Dots} />
      <Controls orientation="horizontal" />
    </ReactFlow>
  );
}

export default Vizualiser;
