export const settingNodes = [
  { id: 'Notice', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Option' }, deletable: false },
  { id: 'A', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'On/Off' }, deletable: false },
  { id: 'B', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Align' }, deletable: false },
  { id: 'C', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Direction' }, deletable: false },
  { id: '1', type: 'custom', position: { x: 0, y: 0 }, data: { label: '미니맵' }, deletable: false },
  { id: '2', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Sort 이후 자동 FitView' }, deletable: false },
  { id: '3', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Cycle 형성 방지' }, deletable: false },
  { id: '4', type: 'custom', position: { x: 0, y: 0 }, data: { label: '줌아웃 시 작은 노드 블러처리' }, deletable: false },
  { id: '5', type: 'custom', position: { x: 0, y: 0 }, data: { label: '글자 정렬' }, deletable: false },
  { id: '6', type: 'custom', position: { x: 0, y: 0 }, data: { label: '노드 기본 값' }, deletable: false },
  { id: '7', type: 'custom', position: { x: 0, y: 0 }, data: { label: '노드 기본 색상' }, deletable: false },
  { id: '8', type: 'custom', position: { x: 0, y: 0 }, data: { label: '정렬 방향' }, deletable: false },
  { id: 'on', type: 'custom', position: { x: 0, y: 0 }, data: { label: '켜기' }, deletable: false },
  { id: 'off', type: 'custom', position: { x: 0, y: 0 }, data: { label: '끄기' }, deletable: false },
  { id: 'left', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'left' }, deletable: false },
  { id: 'center', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'center' }, deletable: false },
  { id: 'right', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'right' }, deletable: false },
  { id: 'value', type: 'custom', position: { x: 0, y: 0 }, data: { label: '0' }, deletable: false },
  { id: 'color', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'rgba(10, 10, 60, 0.85)' }, deletable: false },
  { id: 'lr', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Sort→' }, deletable: false },
  { id: 'tb', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Sort↓' }, deletable: false },
];

export const settingEdges = [
  {
    id: 'Notice->A',
    source: 'Notice',
    target: 'A',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: 'Notice->B',
    source: 'Notice',
    target: 'B',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: 'Notice->C',
    source: 'Notice',
    target: 'C',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: 'Notice->6',
    source: 'Notice',
    target: '6',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: 'Notice->7',
    source: 'Notice',
    target: '7',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: 'A->1',
    source: 'A',
    target: '1',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: 'A->2',
    source: 'A',
    target: '2',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: 'A->3',
    source: 'A',
    target: '3',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: 'A->4',
    source: 'A',
    target: '4',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: 'B->left',
    source: 'B',
    target: 'left',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: 'B->center',
    source: 'B',
    target: 'center',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: 'B->right',
    source: 'B',
    target: 'right',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: 'B->5',
    source: 'B',
    target: '5',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: 'C->lr',
    source: 'C',
    target: 'lr',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: 'C->tb',
    source: 'C',
    target: 'tb',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: 'C->8',
    source: 'C',
    target: '8',
    style: {
      strokeWidth: 0,
    },
    deletable: false,
  },
  {
    id: '1->on',
    source: '1',
    target: 'on',
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
  },
  {
    id: '2->on',
    source: '2',
    target: 'on',
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
  },
  {
    id: '3->on',
    source: '3',
    target: 'on',
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
  },
  {
    id: '4->off',
    source: '4',
    target: 'off',
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
  },
  {
    id: '5->center',
    source: '5',
    target: 'center',
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
  },
  {
    id: '6->value',
    source: '6',
    target: 'value',
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
    deletable: false,
  },
  {
    id: '7->color',
    source: '7',
    target: 'color',
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
    deletable: false,
  },
  {
    id: '8->lr',
    source: '8',
    target: 'lr',
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
  },
];