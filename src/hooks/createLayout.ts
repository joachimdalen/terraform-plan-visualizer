import ELK from "elkjs/lib/elk.bundled.js";
const dir = "RIGHT";
//https://github.com/sylvainmarie/react-flow-test/blob/d41f0a2f73892a0e8738de21c3afe570e10deecd/src/app/components/ReactFlowContainer.tsx#L38
const createLayout = async (formattedNodes, formattedEdges) => {
  const elk = new ELK();

  const groupNode = formattedNodes.filter((node: Node) => {
    return node.type === "labelNode";
  });
  const noneGroupNode = formattedNodes.filter((node: Node) => {
    return node.type !== "labelNode";
  });

  let graphChildren: any[] = [];
  groupNode.forEach((group: Node) => {
    let children: any[] = [];
    noneGroupNode.forEach((node: Node) => {
      if (node.parentId === group.id) {
        children.push({
          id: node.id,
          width: node.style?.width || 250,
          height: node.style?.height || 65,
          layoutOptions: {
            "elk.direction": dir,
          },
          type: node.type,
          data: node.data,
        });
      } else {
        if (node.parentId === undefined) {
          graphChildren.push({
            id: node.id,
            width: node.style?.width || 250,
            height: node.style?.height || 65,
            layoutOptions: {
              "elk.direction": dir,
            },
            type: node.type,
            data: node.data,
          });
        }
      }
    });

    graphChildren.push({
      id: group.id,
      width: 250,
      height: 140,
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "DOWN",
        "elk.layered.spacing.nodeNodeBetweenLayers": "50",
        "elk.spacing.nodeNode": "40",
        //"elk.layered.nodePlacement.strategy": "SIMPLE",
      },
      children: children,
      type: group.type,
      data: group.data,
    });
  });

  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "RIGHT",
      "elk.layered.spacing.nodeNodeBetweenLayers": "150",
      "elk.layered.nodePlacement.strategy": "SIMPLE",
      "elk.spacing.nodeNode": "80",
      // "elk.edgeRouting": "SPINES",
    },
    children: graphChildren,
    edges: formattedEdges.map((edge: Edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  console.log(graph);

  const layout = await elk.layout(graph);
  console.log("layout", layout);
  if (layout.children) {
    const nodes = layout.children.reduce((result, current) => {
      //console.log(current);
      result.push({
        id: current.id,
        position: { x: current.x, y: current.y },
        data: current.data,
        style: { width: current.width, height: current.height },
        type: current.type,
      } as never);

      if (current.children) {
        current.children.forEach((child) =>
          result.push({
            id: child.id,
            position: { x: child.x, y: child.y + 30 },
            data: child.data,
            style: { width: child.width, height: child.height },
            extent: "parent",
            parentId: current.id,
            type: child.type,
          } as never)
        );
      }

      return result;
    }, []);

    return {
      nodes,
      edges: formattedEdges,
    };
  }
};
export default createLayout;
