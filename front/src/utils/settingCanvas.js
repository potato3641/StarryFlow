export const settingNodes = (defaultvalue, defaultnodecolor, defaultedgecolor) => [
  // dummy
  { id: 'Notice', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Option' }, deletable: false, style: { opacity: 0, pointerEvent: 'none' } },
  { id: 'A', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'On/Off' }, deletable: false, style: { opacity: 0, pointerEvent: 'none' } },
  { id: 'B', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Align' }, deletable: false, style: { opacity: 0, pointerEvent: 'none' } },
  { id: 'C', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Direction' }, deletable: false, style: { opacity: 0, pointerEvent: 'none' } },
  // options
  { id: '1', type: 'custom', position: { x: 0, y: 0 }, data: { label: '미니맵' }, deletable: false },
  { id: '2', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Sort 이후 자동 FitView' }, deletable: false },
  { id: '3', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Cycle 형성 방지' }, deletable: false },
  { id: '4', type: 'custom', position: { x: 0, y: 0 }, data: { label: '줌아웃 시 작은 노드 블러처리' }, deletable: false },
  { id: '5', type: 'custom', position: { x: 0, y: 0 }, data: { label: '글자 정렬' }, deletable: false },
  { id: '6', type: 'custom', position: { x: 0, y: 0 }, data: { label: '노드 기본 값' }, deletable: false },
  { id: '7', type: 'custom', position: { x: 0, y: 0 }, data: { label: '노드 기본 색상' }, deletable: false },
  { id: '8', type: 'custom', position: { x: 0, y: 0 }, data: { label: '정렬 방향' }, deletable: false },
  { id: '9', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Turbo Flow' }, deletable: false },
  { id: '10', type: 'custom', position: { x: 0, y: 0 }, data: { label: '간선 기본 색상' }, deletable: false },
  // option values
  { id: 'on', type: 'custom', position: { x: 0, y: 0 }, data: { label: '켜기' }, deletable: false },
  { id: 'off', type: 'custom', position: { x: 0, y: 0 }, data: { label: '끄기' }, deletable: false },
  { id: 'left', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'left' }, deletable: false },
  { id: 'center', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'center' }, deletable: false },
  { id: 'right', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'right' }, deletable: false },
  { id: 'value', type: 'custom', position: { x: 0, y: 0 }, data: { label: `${defaultvalue}` }, deletable: false },
  { id: 'nodecolor', type: 'custom', position: { x: 0, y: 0 }, data: { label: `${defaultnodecolor}` }, deletable: false },
  { id: 'edgecolor', type: 'custom', position: { x: 0, y: 0 }, data: { label: `${defaultedgecolor}` }, deletable: false },
  { id: 'lr', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Sort→' }, deletable: false },
  { id: 'tb', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Sort↓' }, deletable: false },
];

export const settingEdges = (defaultalign, directionflag, fitflag, mapflag, cycleflag, blurflag, turboflag) => [
  {
    id: 'xy-edge__Notice-A',
    source: 'Notice',
    target: 'A',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__Notice-B',
    source: 'Notice',
    target: 'B',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__Notice-C',
    source: 'Notice',
    target: 'C',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__Notice-6',
    source: 'Notice',
    target: '6',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__Notice-7',
    source: 'Notice',
    target: '7',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__Notice-10',
    source: 'Notice',
    target: '10',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__A-1',
    source: 'A',
    target: '1',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__A-2',
    source: 'A',
    target: '2',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__A-3',
    source: 'A',
    target: '3',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__A-4',
    source: 'A',
    target: '4',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__B-left',
    source: 'B',
    target: 'left',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__B-center',
    source: 'B',
    target: 'center',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__B-right',
    source: 'B',
    target: 'right',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__B-5',
    source: 'B',
    target: '5',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__C-lr',
    source: 'C',
    target: 'lr',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__C-tb',
    source: 'C',
    target: 'tb',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__C-8',
    source: 'C',
    target: '8',
    style: {
      strokeWidth: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    deletable: false,
  },
  {
    id: `xy-edge__1-${mapflag ? 'on' : 'off'}`,
    source: '1',
    target: `${mapflag ? 'on' : 'off'}`,
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
  },
  {
    id: `xy-edge__2-${fitflag ? 'on' : 'off'}`,
    source: '2',
    target: `${fitflag ? 'on' : 'off'}`,
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
  },
  {
    id: `xy-edge__3-${cycleflag ? 'on' : 'off'}`,
    source: '3',
    target: `${cycleflag ? 'on' : 'off'}`,
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
  },
  {
    id: `xy-edge__4-${blurflag ? 'on' : 'off'}`,
    source: '4',
    target: `${blurflag ? 'on' : 'off'}`,
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
  },
  {
    id: `xy-edge__5-${defaultalign}`,
    source: '5',
    target: `${defaultalign}`,
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
  },
  {
    id: 'xy-edge__6-value',
    source: '6',
    target: 'value',
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
    deletable: false,
  },
  {
    id: 'xy-edge__7-nodecolor',
    source: '7',
    target: 'nodecolor',
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
    deletable: false,
  },
  {
    id: `xy-edge__8-${directionflag ? 'tb' : 'lr'}`,
    source: '8',
    target: `${directionflag ? 'tb' : 'lr'}`,
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
  },
  {
    id: `xy-edge__9-${turboflag ? 'on' : 'off'}`,
    source: '9',
    target: `${turboflag ? 'on' : 'off'}`,
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
  },
  {
    id: 'xy-edge__10-edgecolor',
    source: '10',
    target: 'edgecolor',
    style: {
      strokeWidth: 4,
      stroke: '#A6FFFA',
    },
    deletable: false,
  },
];