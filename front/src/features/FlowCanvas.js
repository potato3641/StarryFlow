// react
import React, { useCallback, useState, useEffect } from 'react';
// redux
import { useDispatch, useSelector } from 'react-redux';
import {
  clearSelectedNode,
  setSelectedNode,
  setsLabel,
  setsFontSize,
  clearsLabel,
  clearsFontSize,
  deactivateApplyFlag,
  activateSetModeFlag,
  deactivateSetModeFlag,
  activateMapFlag,
  deactivateMapFlag,
  activateAutoFitViewFlag,
  deactivateAutoFitViewFlag,
  activateCycleValidateFlag,
  deactivateCycleValidateFlag,
  setDefaultNodeAlign,
  TBSortDirectionFlag,
  LRSortDirectionFlag,
  activateZoomOutBlurFlag,
  deactivateZoomOutBlurFlag,
  activateTurboFlag,
  deactivateTurboFlag,
} from '../redux/flowSlice';
// flow
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  addEdge,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  MiniMap,
} from '@xyflow/react';
import CustomNode from '../ui/CustomNode';
import CustomEdge from '../ui/CustomEdge';
import CustomLine from '../ui/CustomLine';
import NodePanel from './NodePanel';
import NavDial from '../features/NavDial';
import { layoutWithElk } from '../utils/layout';
import { settingNodes, settingEdges } from '../utils/settingCanvas';
// ui
import '@xyflow/react/dist/style.css';
import './FlowCanvas.css';

const flowKey = '1q2w3e4r'

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
}

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: { label: '0' },
  },
];

const rerender_key = 2;

const getNodeId = () => `randomnode_${+new Date()}`;

const FlowCanvas = () => {
  // REDUX
  const dispatch = useDispatch();
  const existSelectedNode = useSelector((state) => state.flow.selectedNode) || false;
  const id = useSelector((state) => state.flow.selectedNode);
  const fontSize = useSelector((state) => state.flow.sFontSize);
  const label = useSelector((state) => state.flow.sLabel);
  // REDUX FLAG
  const applyFlag = useSelector((state) => state.flow.applyFlag);
  // SETTINGS
  const defaultNodeValue = useSelector((state) => state.flow.defaultNodeValue);
  const defaultNodeColor = useSelector((state) => state.flow.defaultNodeColor);
  const defaultNodeAlign = useSelector((state) => state.flow.defaultNodeAlign);
  const sortDirectionFlag = useSelector((state) => state.flow.sortDirectionFlag);
  const autoFitViewFlag = useSelector((state) => state.flow.autoFitViewFlag);
  const mapFlag = useSelector((state) => state.flow.mapFlag);
  const cycleValidateFlag = useSelector((state) => state.flow.cycleValidateFlag);
  const zoomOutBlurFlag = useSelector((state) => state.flow.zoomOutBlurFlag);
  const setModeFlag = useSelector((state) => state.flow.setModeFlag);
  const turboFlag = useSelector((state) => state.flow.turboFlag);
  // REACT
  const [renderCnt, setRenderCnt] = useState(rerender_key);
  const [nodes, setLocalNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport, fitView, getNodes, getEdges, screenToFlowPosition, getViewport } = useReactFlow();
  const connectionLineStyle = {
    stroke: turboFlag ? `url(#edge-gradient)` : '#b1b1b7',
    strokeWidth: 3,
    strokeOpacity: 0.75,
  };

  const defaultEdgeOptions = {
    type: 'custom',
    markerEnd:
      turboFlag ? 'edge-circle' : {
        type: MarkerType.ArrowClosed,
        color: '#b1b1b7',
      },
    style: {
      ...(turboFlag && { stroke: `url(#edge-gradient)`, strokeOpacity: 0.75 }),
      strokeWidth: 3,
    }
  };

  useEffect(() => {
    if (applyFlag) {
      const updateNodes = nodes.map((node) =>
        node.id === id ? {
          ...node,
          data: {
            ...node.data,
            label,
            fontSize: fontSize,
          },
        } : node
      );
      setLocalNodes(updateNodes);
      dispatch(clearsLabel())
      dispatch(clearsFontSize())
      dispatch(clearSelectedNode())
      dispatch(deactivateApplyFlag())
    }
    // eslint-disable-next-line
  }, [applyFlag])

  const isValidConnection = useCallback(
    (connection) => {
      const edges = getEdges();
      const sourceNodeId = connection.source;
      const outgoingEdges = edges.filter((e) => e.source === sourceNodeId);
      const setModeValid = setModeFlag && outgoingEdges.length > 0;
      if (cycleValidateFlag) {
        const nodes = getNodes();
        const target = nodes.find((node) => node.id === connection.target);
        const hasCycle = (node, visited = new Set()) => {
          if (visited.has(node.id)) return false;

          visited.add(node.id);

          for (const outgoer of getOutgoers(node, nodes, edges)) {
            if (outgoer.id === connection.source) return true;
            if (hasCycle(outgoer, visited)) return true;
          }
        };

        if (target.id === connection.source) return false;
        return !setModeValid && !hasCycle(target);
      }
      return !setModeValid
    },
    [getNodes, getEdges, cycleValidateFlag, setModeFlag],
  );

  const onConnect = useCallback((params) => {
    setLocalEdges((eds) => addEdge({ ...params, style: { ...params.style, strokeWidth: 3 } }, eds))
    if (setModeFlag)
      switch (params.source) {
        case "1": // 1 minimap on / off flag ->  mapFlag
          (params.target === "on") && dispatch(activateMapFlag());
          (params.target === "off") && dispatch(deactivateMapFlag());
          break;
        case "2": // 2 정렬 후 자동 Fitview on / off flag ->  autoFitViewFlag
          (params.target === "on") && dispatch(activateAutoFitViewFlag());
          (params.target === "off") && dispatch(deactivateAutoFitViewFlag());
          break;
        case "3": // 3 cycle 형성 방제 on / off flag ->  cycleValidateFlag
          (params.target === "on") && dispatch(activateCycleValidateFlag());
          (params.target === "off") && dispatch(deactivateCycleValidateFlag());
          break;
        case "4": // 4 blur node value at min - zoom flag
          (params.target === "on") && dispatch(activateZoomOutBlurFlag());
          (params.target === "off") && dispatch(deactivateZoomOutBlurFlag());
          break;
        case "5": // 5 node 왼쪽정렬 / 가운데정렬 / 오른쪽정렬(선택박스) ->  defaultNodeAlign
          (["left", "center", "right"].includes(params.target)) && dispatch(setDefaultNodeAlign(params.target));
          break;
        case "6": // 6 node default value 변경 -> 실시간 적용을 위해 NodePanel로 이관
          break;
        case "7": // 7 node color 팔레트 -> 실시간 적용을 위해 NodePanel로 이관
          break;
        case "8": // 8 sort 방향 flag ->  sortDirectionFlag
          (["lr", "tb"].includes(params.target)) && dispatch(params.target === "tb" ? TBSortDirectionFlag() : LRSortDirectionFlag());
          break;
        case "9": // 9 turbo flow flag ->  turboFlag
          (params.target === "on") && dispatch(activateTurboFlag());
          (params.target === "off") && dispatch(deactivateTurboFlag());
          break;
        default:
          console.error("Unauthorized Access")
      }
  }, [dispatch, setLocalEdges, setModeFlag]);

  const onNodesDelete = useCallback(
    (deleted) => {
      setLocalEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge),
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
              style: { strokeWidth: 3 },
            })),
          );

          return [...remainingEdges, ...createdEdges];
        }, edges),
      );
    },
    [setLocalEdges, nodes, edges],
  );

  const onNodeClick = useCallback((e, node) => {
    const target = nodes.filter((n) => n.id === node.id)[0]
    const label = target.data?.label || ''
    const fontSize = target.data?.fontSize || 14;
    dispatch(setSelectedNode(node.id));
    dispatch(setsLabel(label));
    dispatch(setsFontSize(fontSize));
  }, [dispatch, nodes]);

  const onPaneClick = () => {
    dispatch(clearSelectedNode());
    dispatch(clearsLabel());
    dispatch(clearsFontSize());
  }

  const onAdd = useCallback(() => {
    const randomScreenX = Math.random() * (window.innerWidth - 140);
    const randomScreenY = Math.random() * (window.innerHeight - 80);
    const flowPosition = screenToFlowPosition({ x: randomScreenX, y: randomScreenY });
    const newNode = {
      id: getNodeId(),
      type: 'custom',
      data: { label: `${defaultNodeValue}` },
      position: {
        x: flowPosition.x,
        y: flowPosition.y,
      },
    };
    setLocalNodes([...nodes, newNode]);
  }, [setLocalNodes, nodes, screenToFlowPosition, defaultNodeValue]);

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance])

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));
      if (flow) {
        const { x, y, zoom } = flow.viewport || { x: 0, y: 0, zoom: 1 };
        setLocalNodes(flow.nodes || []);
        setLocalEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };
    restoreFlow();
  }, [setLocalNodes, setLocalEdges, setViewport])

  const handleLayout = useCallback(async (targetNodes = nodes, targetEdges = edges) => {
    const { nodes: newNodes, edges: newEdges } = await layoutWithElk(targetNodes, targetEdges, sortDirectionFlag ? 'DOWN' : 'RIGHT');
    setLocalNodes(newNodes);
    setLocalEdges(newEdges);
    if (autoFitViewFlag)
      setTimeout(() => {
        fitView({ padding: 0.2 });
      }, 50);
  }, [setLocalNodes, setLocalEdges, nodes, edges, fitView, sortDirectionFlag, autoFitViewFlag]);

  const handleFitView = () => {
    fitView({ padding: 0.2 });
  }

  const zoomOut = useCallback((targetZoom = 0.1, duration = 800) => {
    return new Promise((resolve) => {
      const { x: startX, y: startY, zoom: startZoom } = getViewport();
      const startTime = performance.now();
      function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const newZoom = startZoom + (targetZoom - startZoom) * progress;

        setViewport({ x: startX, y: startY, zoom: newZoom });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(animate);
    });
  }, [getViewport, setViewport])

  const handleSettings = useCallback(async () => {
    setRenderCnt(rerender_key);
    onSave();
    await zoomOut();
    setLocalNodes(settingNodes(defaultNodeValue, defaultNodeColor));
    setLocalEdges(settingEdges(defaultNodeAlign, sortDirectionFlag, autoFitViewFlag, mapFlag, cycleValidateFlag, zoomOutBlurFlag, turboFlag));
    dispatch(activateSetModeFlag());
  }, [
    dispatch,
    zoomOut,
    setLocalEdges,
    setLocalNodes,
    onSave,
    defaultNodeValue,
    defaultNodeColor,
    defaultNodeAlign,
    sortDirectionFlag,
    autoFitViewFlag,
    mapFlag,
    cycleValidateFlag,
    zoomOutBlurFlag,
    turboFlag,
  ]);

  useEffect(() => {
    if (setModeFlag && renderCnt && nodes.filter((e) => e.id === 'Notice')) {
      handleLayout(nodes, edges);
      setRenderCnt(renderCnt - 1);
    }
    // eslint-disable-next-line
  }, [setModeFlag, handleLayout, edges, nodes])

  const handleSaveSettings = useCallback(() => {
    setRenderCnt(rerender_key);
    onRestore();
    dispatch(deactivateSetModeFlag());
  }, [dispatch, onRestore])

  return (
    <div className={`wrapper ${turboFlag ? 'turbo' : ''}`}>
      <ReactFlow
        nodes={nodes} // node data
        edges={edges} // edge data
        nodeTypes={nodeTypes} // node 컴포넌트
        edgeTypes={edgeTypes} // edge 컴포넌트
        minZoom={0.1} // 최소 줌
        maxZoom={4} // 최대 줌
        connectionLineComponent={CustomLine} // cunnect 라인 컴포넌트
        connectionLineStyle={connectionLineStyle} // connect 라인 스타일
        defaultEdgeOptions={defaultEdgeOptions} // edge 기본설정
        onConnect={onConnect} // 연결
        onNodesChange={onNodesChange} // 노드 수정
        onNodeClick={onNodeClick} // 노드클릭
        onPaneClick={onPaneClick} // 노드외 클릭
        onNodesDelete={onNodesDelete} // 노드 삭제 시 edge 병합
        onEdgesChange={onEdgesChange} // edge 병합 작업용
        {...((cycleValidateFlag || setModeFlag) && { isValidConnection: isValidConnection })} // 싸이클방지
        onInit={setRfInstance} // ref for save/restore
        selectNodesOnDrag={false} // 드래그 시 select되는 기능 false
        deleteKeyCode={['Delete', 'Backspace']} // 삭제 키 동작 설정
        fitView
      >
        {!(setModeFlag && !(id === 'value' || id === 'color')) && existSelectedNode && (<NodePanel />)}
        {!setModeFlag && mapFlag && (<MiniMap nodeStrokeWidth={3} position={'top-right'} nodeColor={'#b0b0b0'} />)}
        <svg>
          <defs>
            <linearGradient id="edge-gradient">
              <stop offset="0%" stopColor="#ae53ba" />
              <stop offset="100%" stopColor="#2a8af6" />
            </linearGradient>

            <marker
              id="edge-circle"
              viewBox="-5 -5 10 10"
              refX="0"
              refY="0"
              markerUnits="strokeWidth"
              markerWidth="10"
              markerHeight="10"
              orient="auto"
            >
              <circle stroke="#2a8af6" strokeOpacity="0.75" r="2" cx="0" cy="0" />
            </marker>
          </defs>
        </svg>
      </ReactFlow>
      <NavDial
        onAdd={onAdd}
        onRestore={onRestore}
        onFit={handleFitView}
        onSort={handleLayout}
        goSet={handleSettings}
        onSave={onSave}
        goCanvas={handleSaveSettings}
      />
    </div>
  );
};

export default FlowCanvas;