import { randomId } from "@mantine/hooks";
import {
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import { fromDot } from "ts-graphviz";
import LabeledGroupNode from "./components/nodes/LabeledGroupNode/LabeledGroupNode";
import ResourceNode from "./components/nodes/ResourceNode/ResourceNode";
import { parseEdges, parseModules, parseResources } from "./dataparser";
import graphData from "./graphdata";
import createLayout from "./hooks/createLayout";
import useLayoutedElements from "./hooks/getLayoutedElements";
import demoData from "./templatedata";

const references = demoData.configuration.root_module.resources.map((x) => {
  const id = x.address;
  const expKeys = Object.keys(x.expressions);
  const refs = expKeys
    .map((ek) => x.expressions[ek].references)
    .filter((x) => x != undefined);
  return {
    id,
    refs,
  };
});

const roots = demoData.planned_values.root_module.resources.map((x, i) => ({
  id: x.address,
  type: "resourceNode",
  position: { x: 10, y: (i + 1) * 100 },
  data: {
    index: x.index,
    name: x.name,
    type: x.type,
    provider: x.provider_name.replace("registry.terraform.io/", ""),
  },
}));
const childrenMods = demoData.planned_values.root_module.child_modules.flatMap(
  (x, dx) => {
    const groupId = x.address;

    const childRes = x.resources.map((y, i) => ({
      id: y.address,
      type: "resourceNode",
      position: { x: 10, y: i * 100 + 50 },
      parentId: groupId,
      extent: "parent",
      data: {
        index: y.index,
        name: y.name,
        type: y.type,
        provider: y.provider_name.replace("registry.terraform.io/", ""),
      },
    }));
    const group = {
      id: groupId,
      position: { x: dx * 325 + 325, y: 200 },
      data: { name: x.address, index: x.index },
      width: 250 + 20, //* childRes.length,
      height: 115 * childRes.length,
      type: "labelNode",
    };
    return [group, ...childRes];
  }
);
const initialNodes = [...roots, ...childrenMods];
const nodeTypes = {
  resourceNode: ResourceNode,
  labelNode: LabeledGroupNode,
};
const graph = fromDot(graphData);
const connections = graph.edges
  .flatMap((e) => {
    const targetId = e.targets[0].id;
    const sourceId = e.targets[1].id;
    // if (sourceId.startsWith("module") && !targetId.startsWith("module")) {
    //   console.log("nm", sourceId, targetId);
    //   return null;
    // }
    // if (targetId.startsWith("module") && !sourceId.startsWith("module"))
    //   return null;
    const sourceNode = initialNodes.filter(
      (x) => x.id.replace(/\[\".+\"\]/, "") === sourceId
      //`${x.data.type}.${x.data.name}` === sourceId
    );
    const targetNodes = initialNodes.filter(
      (x) => x.id.replace(/\[\".+\"\]/, "") === targetId
      //`${x.data.type}.${x.data.name}` === targetId
    );
    console.log(sourceId, sourceNode, targetId, targetNodes);
    return sourceNode.flatMap((sn) => {
      return targetNodes.flatMap((tn) => {
        if (sn.parentId !== undefined && tn.parentId !== undefined) {
          if (sn.parentId != tn.parentId) return null;
          return {
            id: randomId(),
            source: sn.id,
            target: tn.id,
            type: "step",
          };
        }

        if (sn.data.index === undefined && tn.data.index === undefined)
          return {
            id: randomId(),
            source: sn.id,
            target: tn.id,
            type: "step",
          };
        if (sn.data.index != tn.data.index) return null;

        return {
          id: randomId(),
          source: sn.id,
          target: tn.id,
          type: "step",
        };
      });
    });
  })
  .filter((x) => x !== null);

const nds = [
  ...parseResources(demoData.planned_values.root_module.resources),
  ...parseModules(demoData.planned_values.root_module.child_modules),
];
const data = {
  nodes: nds,
  edges: parseEdges(
    graph.edges.map((e) => ({
      source: e.targets[0].id,
      target: e.targets[1].id,
    })),
    nds
  ),
};

function Vizualiser() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    console.log("dta", initialNodes, connections);
    createLayout(nds, connections).then((res) => {
      console.log("res", res);
      setNodes(res?.nodes);
      setEdges(res?.edges);
    });
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

export default Vizualiser;
