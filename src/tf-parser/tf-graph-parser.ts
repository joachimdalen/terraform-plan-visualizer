import { randomId } from "@mantine/hooks";
import type { Edge, Node } from "@xyflow/react";
import { fromDot } from "ts-graphviz";
import graphData from "../graphdata";
import type { TfVizResource } from "./tf-plan-parser";

function parseTfGraph(nodes: Node[]) {
  const graph = fromDot(graphData);
  const graphEdges = graph.edges.map((e) => ({
    source: e.targets[1].id,
    target: e.targets[0].id,
  }));

  return parseEdges(graphEdges, nodes);
}

function parseEdges(
  edges: { source: string; target: string }[],
  nodes: Node<TfVizResource>[]
): Edge[] {
  const parsed: Edge[] = [];
  console.log(edges, nodes);
  for (const edge of edges) {
    //console.log(edge);
    const sourceNode = nodes.filter((x) => x.data.baseAddress === edge.source);
    const targetNodes = nodes.filter((x) => x.data.baseAddress === edge.target);
    for (const sn of sourceNode) {
      for (const tn of targetNodes) {
        if (sn.parentId !== undefined && tn.parentId !== undefined) {
          if (sn.parentId != tn.parentId) {
            continue;
          }
          parsed.push({
            id: randomId(),
            source: sn.id,
            target: tn.id,
            type: "step",
          });
          continue;
        }

        if (sn.data.index === undefined && tn.data.index === undefined) {
          parsed.push({
            id: randomId(),
            source: sn.id,
            target: tn.id,
            type: "step",
          });
          continue;
        }
        if (sn.data.index != tn.data.index) {
          continue;
        }

        parsed.push({
          id: randomId(),
          source: sn.id,
          target: tn.id,
          type: "step",
        });
      }
    }
  }

  return parsed;
}
export { parseTfGraph };
