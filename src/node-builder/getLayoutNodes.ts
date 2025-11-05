import type { Edge, Node } from "@xyflow/react";
import ELK, { type ElkNode } from "elkjs/lib/elk.bundled.js";
const dir = "RIGHT";

const nodeWidth = 250;
const nodeHeight = 65;

async function getLayoutNodes(nodes: Node[], edges: Edge[]) {}

async function formatNodeCluster(nodes: Node[], edges: Edge[]) {
  const elk = new ELK();
  const elkNodes = nodes.map(getElkNode);
  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": dir,
      "elk.layered.spacing.nodeNodeBetweenLayers": "150",
      "elk.layered.nodePlacement.strategy": "SIMPLE",
      "elk.spacing.nodeNode": "80",
    },
    children: elkNodes,
    edges: edges.map((edge: Edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };
  const formattedNodes = await elk.layout(graph);
  return formattedNodes;
}

function getElkNode(node: Node) {
  const elkNode: ElkNode = {
    id: node.id,
    width: nodeWidth,
    height: nodeHeight,
  };
  return elkNode;
}
export { formatNodeCluster, getElkNode, getLayoutNodes };
