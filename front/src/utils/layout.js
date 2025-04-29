import dagre from "dagre";
import { Position } from "@xyflow/react";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export default function sortLayoutedElements(nodes, edges, direction) {
  // 전처리
  // const nodesSnapshot = nodes.map(n => ({ id: n.id, type: n.type }));
  // console.log('nodesSnapshot:', nodesSnapshot);
  const isVertical = direction === 'TB';
  dagreGraph.setGraph({ rankdir: direction });

  // 노드 크기 (원하는 사이즈로)
  const NODE_WIDTH = 172;
  const NODE_HEIGHT = 36;

  // 그래프에 노드 추가
  nodes?.forEach((n) => {
    dagreGraph.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });
  // 그래프에 엣지 추가
  edges?.forEach((e) => {
    dagreGraph.setEdge(e.source, e.target);
  });

  // 레이아웃 계산
  dagre.layout(dagreGraph);

  // 자리 배정된 좌표 업데이트
  const layoutedNodes = nodes?.map((n) => {
    const { x, y } = dagreGraph.node(n.id);
    return {
      ...n,
      position: {
        x: x - NODE_WIDTH / 2,
        y: y - NODE_HEIGHT / 2,
      },
    };
  });
  const layoutedEdges = edges.map((e) => ({
    ...e,
    sourceHandle: `${e.source}-source`,
    targetHandle: `${e.target}-target`,
    sourcePosition: isVertical ? Position.Bottom : Position.Right,
    targetPosition: isVertical ? Position.Top : Position.Left,
  }));

  // const nodesSnapshot2 = layoutedNodes.map(n => ({ id: n.id, type: n.type }));
  // console.log('nodesSnapshot:', nodesSnapshot2);
  // console.log('origin node', layoutedNodes)
  return { nodes: layoutedNodes || [], edges: layoutedEdges || [] };
}
