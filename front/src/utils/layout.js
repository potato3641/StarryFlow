import dagre from "dagre";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export function getLayoutedElements(nodes, edges, direction = "TB") {
  // const isHorizontal = direction === "LR" || direction === "RL";
  dagreGraph.setGraph({ rankdir: direction, marginx: 50, marginy: 50 });

  // 노드 크기 (원하는 사이즈로)
  const NODE_WIDTH = 172;
  const NODE_HEIGHT = 36;

  // 그래프에 노드 추가
  nodes.forEach((n) => {
    dagreGraph.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });
  // 그래프에 엣지 추가
  edges.forEach((e) => {
    dagreGraph.setEdge(e.source, e.target);
  });

  // 레이아웃 계산
  dagre.layout(dagreGraph);

  // 자리 배정된 좌표 업데이트
  const layoutedNodes = nodes.map((n) => {
    const { x, y } = dagreGraph.node(n.id);
    return {
      ...n,
      // dagre의 (x,y)는 노드 중심 기준이므로, React Flow 좌표로 바꿔줌
      position: {
        x: x - NODE_WIDTH / 2,
        y: y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
