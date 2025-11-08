// import { randomId } from "@mantine/hooks";
// import type { Edge, Node } from "@xyflow/react";
// import { fromDot } from "ts-graphviz";
// import graphData from "../graphdata";
// import type { TfVizResource } from "./tf-plan-parser";

// function parseTfGraph(nodes: Node[]) {
//   const graph = fromDot(graphData);
//   const graphEdges = graph.edges.map((e) => ({
//     source: e.targets[1].id,
//     target: e.targets[0].id,
//   }));

//   return parseEdges(graphEdges, nodes);
// }

// function parseEdges(
//   edges: { source: string; target: string }[],
//   nodes: Node<TfVizResource>[]
// ): Edge[] {
//   const parsed: Edge[] = [];
//   console.log("edges", edges);
//   for (const edge of edges) {
//     //console.log(edge);
//     const sourceNode = nodes.filter((x) => x.data.baseAddress === edge.source);
//     const targetNodes = nodes.filter((x) => x.data.baseAddress === edge.target);
//     for (const sn of sourceNode) {
//       for (const tn of targetNodes) {
//         if (sn.parentId !== undefined && tn.parentId !== undefined) {
//           if (sn.parentId != tn.parentId) {
//             console.log("continue 1", sn, tn);
//             continue;
//           }
//           parsed.push({
//             id: randomId(),
//             source: sn.id,
//             target: tn.id,
//             type: "step",
//           });
//           continue;
//         }

//         if (sn.data.index === undefined && tn.data.index === undefined) {
//           parsed.push({
//             id: randomId(),
//             source: sn.id,
//             target: tn.id,
//             type: "step",
//           });
//           continue;
//         }
//         if (sn.data.index != tn.data.index) {
//           if (sn.data.baseAddress.startsWith("module.")) {
//             parsed.push({
//               id: randomId(),
//               source: sn.parentId!,
//               target: tn.id,
//               type: "step",
//             });
//             continue;
//           }

//           if (tn.data.baseAddress.startsWith("module.")) {
//             parsed.push({
//               id: randomId(),
//               source: sn.id,
//               target: tn.parentId!,
//               type: "step",
//             });
//             continue;
//           }

//           console.log("continue 2", sn, tn);
//           continue;
//         }

//         parsed.push({
//           id: randomId(),
//           source: sn.id,
//           target: tn.id,
//           type: "step",
//         });
//       }
//     }
//   }

//   return parsed;
// }
// export { parseTfGraph };
