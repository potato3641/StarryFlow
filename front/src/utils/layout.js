import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

export async function layoutWithElk(nodes, edges, direction = 'RIGHT') {
  const elkNodes = nodes.map((node) => ({
    id: node.id,
    width: node.measured?.width || 140,
    height: node.measured?.height || 80,
  }));

  const elkEdges = edges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));

  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': direction,
      'elk.layered.considerModelOrder': 'true',
      'elk.layered.nodePlacement.bk.fixedAlignment': 'LEFT',
      'elk.layered.nodePlacement.strategy': 'LINEAR',
      'elk.layered.edgeRouting': 'ORTHOGONAL',
      'elk.spacing.nodeNode': '50',
    },
    children: elkNodes,
    edges: elkEdges,
  };

  const layout = await elk.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const layoutNode = layout.children.find((n) => n.id === node.id);
    return {
      ...node,
      position: {
        x: Math.round(layoutNode.x),
        y: Math.round(layoutNode.y),
      },
    };
  });

  const layoutedEdges = edges.map((edge) => {
    const layoutEdge = layout.edges.find((e) => e.id === edge.id);
    return {
      ...edge,
      data: {
        ...edge.data,
        points: layoutEdge.sections[0].bendPoints ?? [],
      },
    };
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
}
