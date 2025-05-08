// react
import React, { useCallback, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  setDefaultNodeValue,
  setDefaultNodeColor,
  setSortDirectionFlag,
  setAutoFitViewFlag,
  setMapFlag,
  setCycleValidateFlag,
  setZoomOutBlurFlag,
  setTurboFlag,
  setDefaultEdgeColor,
} from '../redux/flowSlice';
// flow
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  useReactFlow,
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
import { decodeFlowFromUrlParam, encodeFlowToUrlParam, rgbastr2hex } from '../utils/utils';
import '@xyflow/react/dist/style.css';
import './FlowCanvas.css';
// hook
import { useWebSocket } from '../hooks/useWebSocket';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
}

const rerender_key = 2;

const getNodeId = () => `randomnode_${+new Date()}`;

const FlowCanvas = ({ roomId }) => {
  const flowKey = `${roomId || 'local'}-key`
  const flowSet = `${roomId || 'local'}-set`
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
  const defaultEdgeColor = useSelector((state) => state.flow.defaultEdgeColor);
  const defaultNodeAlign = useSelector((state) => state.flow.defaultNodeAlign);
  const sortDirectionFlag = useSelector((state) => state.flow.sortDirectionFlag);
  const autoFitViewFlag = useSelector((state) => state.flow.autoFitViewFlag);
  const mapFlag = useSelector((state) => state.flow.mapFlag);
  const cycleValidateFlag = useSelector((state) => state.flow.cycleValidateFlag);
  const zoomOutBlurFlag = useSelector((state) => state.flow.zoomOutBlurFlag);
  const turboFlag = useSelector((state) => state.flow.turboFlag);
  const setModeFlag = useSelector((state) => state.flow.setModeFlag);
  // REACT
  const [prevNodeId, setPrevNodeId] = useState(null);
  const [tempRef, setTempRef] = useState(null);
  const [renderCnt, setRenderCnt] = useState(rerender_key);
  const [nodes, setLocalNodes, onNodesChange] = useNodesState([]);
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const location = useLocation();
  const [flowData, setFlowData] = useState(null);
  const { setViewport, fitView, getNodes, getEdges, getViewport, screenToFlowPosition } = useReactFlow();
  // 소켓
  const { sendMessage, connected } = useWebSocket(roomId, (msg) => {
    // 메시지 타입에 따라 처리
    // if (msg.type === 'node_add') {
    // 노드 추가 처리
    // }
  });

  /**
   * 간선이 되지 않은 connect 과정의 선 스타일
   */
  const connectionLineStyle = {
    stroke: turboFlag ? `url(#edge-gradient)` : rgbastr2hex(defaultEdgeColor),
    strokeWidth: 3,
    strokeOpacity: 0.75,
  };

  /**
   * 기본 간선 스타일
   */
  const defaultEdgeOptions = {
    type: 'custom',
    markerEnd:
      turboFlag ? 'edge-circle' : 'edge-arrow',
    style: {
      ...(turboFlag ? { stroke: `url(#edge-gradient)`, strokeOpacity: 0.75 } : { stroke: rgbastr2hex(defaultEdgeColor) }),
      strokeWidth: 3,
    }
  };

  //URL 변경을 감지하여 데이터를 등록
  useEffect(() => {
    const hash = location.hash;
    const match = hash.match(/data=([^&]+)/);
    if (match && match[1]) {
      const decoded = decodeFlowFromUrlParam(match[1]);
      setFlowData(decoded);
    }
  }, [location.hash]);

  // URL데이터 등록을 감지하여 로컬에 이관
  useEffect(() => {
    const flow = flowData?.flow;
    const settings = flowData?.settings;
    if (flow) {
      localStorage.setItem(flowKey, JSON.stringify(flow));
      const { x, y, zoom } = flow.viewport || { x: 0, y: 0, zoom: 1 };
      setLocalNodes(flow.nodes || []);
      setLocalEdges(flow.edges || []);
      setViewport({ x, y, zoom });
    }
    if (settings) {
      localStorage.setItem(flowSet, JSON.stringify(settings));
      dispatch(setDefaultNodeValue(settings.defaultNodeValue));
      dispatch(setDefaultNodeColor(settings.defaultNodeColor));
      dispatch(setDefaultEdgeColor(settings.defaultEdgeColor));
      dispatch(setDefaultNodeAlign(settings.defaultNodeAlign));
      dispatch(setSortDirectionFlag(settings.sortDirectionFlag));
      dispatch(setAutoFitViewFlag(settings.autoFitViewFlag));
      dispatch(setMapFlag(settings.mapFlag));
      dispatch(setCycleValidateFlag(settings.cycleValidateFlag));
      dispatch(setZoomOutBlurFlag(settings.zoomOutBlurFlag));
      dispatch(setTurboFlag(settings.turboFlag));
    }
    if (flow && settings)
      window.history.replaceState(null, '', window.location.pathname)
    // eslint-disable-next-line
  }, [flowData, dispatch]);

  // 최초 혹은 재접속시 로컬에 등록된 데이터 가져오기
  useEffect(() => {
    // local data loading
    if (roomId === 'local') {
      const flow = JSON.parse(localStorage.getItem(flowKey));
      if (flow) {
        const { x, y, zoom } = flow.viewport || { x: 0, y: 0, zoom: 1 };
        setLocalNodes(flow.nodes || []);
        setLocalEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
      const settings = JSON.parse(localStorage.getItem(flowSet));
      if (settings) {
        dispatch(setDefaultNodeValue(settings.defaultNodeValue));
        dispatch(setDefaultNodeColor(settings.defaultNodeColor));
        dispatch(setDefaultEdgeColor(settings.defaultEdgeColor));
        dispatch(setDefaultNodeAlign(settings.defaultNodeAlign));
        dispatch(setSortDirectionFlag(settings.sortDirectionFlag));
        dispatch(setAutoFitViewFlag(settings.autoFitViewFlag));
        dispatch(setMapFlag(settings.mapFlag));
        dispatch(setCycleValidateFlag(settings.cycleValidateFlag));
        dispatch(setZoomOutBlurFlag(settings.zoomOutBlurFlag));
        dispatch(setTurboFlag(settings.turboFlag));
      }
    } else {
      const { x, y, zoom } = { x: 0, y: 0, zoom: 1 };
      setLocalNodes([]) // 가져와야함 서버에서
      setLocalEdges([]) // 가져와야함 서버에서
      setViewport({ x, y, zoom }) // 가져와야함 서버에서
    }
    // eslint-disable-next-line
  }, [])

  // 노드 수정 판넬 플래그를 감지하여 노드 수정 완료처리
  useEffect(() => {
    if (applyFlag) {
      const updateNodes = nodes.map((node) =>
        node.id === id ? {
          ...node,
          data: {
            ...node.data,
            label: label,
            fontSize: fontSize,
          },
        } : node
      );
      setLocalNodes(updateNodes);
      if (connected) {
        sendMessage({
          type: "node_update",
          payload: {
            id: id,
            label: label,
            fontSize: fontSize,
          }
        });
      }
      dispatch(clearsLabel())
      dispatch(clearsFontSize())
      dispatch(clearSelectedNode())
      dispatch(deactivateApplyFlag())
    }
    // eslint-disable-next-line
  }, [applyFlag])

  /**
   * 노드 연결 완료 이전 동작 : 
   * settings 모드에 진입할 경우 간선을 1개로 제한하고 cycle 방지 플래그가 활성화됐을 경우 간선 연결을 제한
   */
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

  /**
   * 노드 연결 완료 동작 : 
   * 노드 간의 간선을 추가한다. settings 모드에 진입 시 유효한 값에 연결했을 경우 settings를 변경한다.
   */
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

  /**
   * 노드 삭제 이후 동작 : 
   * 삭제된 노드에 연결되었던 간선을 노드가 없었을 때의 연결된 간선으로 대체
   */
  const onNodesDelete = useCallback((deleted) => {
    dispatch(clearSelectedNode());
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
            style: {
              ...(turboFlag ? { stroke: `url(#edge-gradient)`, strokeOpacity: 0.75 } : { stroke: rgbastr2hex(defaultEdgeColor) }),
              strokeWidth: 3
            },
          })),
        );

        if (connected) {
          sendMessage({
            type: "node_delete",
            payload: {
              id: node.id,
            }
          });
        }

        return [...remainingEdges, ...createdEdges];
      }, edges),
    );
  }, [dispatch, setLocalEdges, nodes, edges, turboFlag, defaultEdgeColor, connected, sendMessage]);

  /**
   * 노드 클릭 이후 동작 : 
   * 선택한 노드에 대한 값을 REDUX에 등록
   */
  const onNodeClick = useCallback((e, node) => {
    const target = nodes.find((n) => n.id === node.id)
    const label = target.data?.label || ''
    const fontSize = target.data?.fontSize || 14;
    dispatch(setSelectedNode(node.id));
    dispatch(setsLabel(label));
    dispatch(setsFontSize(fontSize));
  }, [dispatch, nodes]);

  /**
   * flow 클릭 이후 동작 : 
   * 선택한 노드가 없다는 의미이므로 REDUX에 등록된 선택한 노드 값을 초기화
   */
  const onPaneClick = () => {
    dispatch(clearSelectedNode());
    dispatch(clearsLabel());
    dispatch(clearsFontSize());
  }

  /**
   * [Dial] 새 노드 추가 함수 : 
   * 노드 기본 값을 가진 새 노드 생성. 이전 노드 값을 기억하여 이전 노드 Position의 20, 20 추가된 위치에 새 노드를 생성한다
   */
  const onAdd = useCallback(() => {
    const id = getNodeId();
    const prevNode = getNodes()?.find(node => node.id === prevNodeId);
    const screen = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const x = typeof prevNode?.position?.x === 'number' ? prevNode.position.x + 20 : screen.x - getNodes()[0] ? getNodes()[0].measured.width / 2 : 0;
    const y = typeof prevNode?.position?.x === 'number' ? prevNode.position.y + 20 : screen.y - getNodes()[0] ? getNodes()[0].measured.height / 2 : 0;
    const newNode = {
      id,
      type: 'custom',
      data: { label: `${defaultNodeValue}` },
      position: {
        x,
        y,
      },
    };
    setLocalNodes([...nodes, newNode]);
    if (connected) {
      sendMessage({
        type: "node_add",
        payload: {
          id: id,
          position: {
            x: x,
            y: y,
          },
        }
      });
    }
    setPrevNodeId(id);
  }, [setLocalNodes, nodes, defaultNodeValue, getNodes, screenToFlowPosition, prevNodeId, connected, sendMessage]);

  /**
   * settings에서 설정한 값 반환
   */
  const flowSettings = useCallback(() => {
    return {
      defaultNodeValue,
      defaultNodeColor,
      defaultEdgeColor,
      defaultNodeAlign,
      sortDirectionFlag,
      autoFitViewFlag,
      mapFlag,
      cycleValidateFlag,
      zoomOutBlurFlag,
      turboFlag
    };
  }, [
    defaultNodeValue,
    defaultNodeColor,
    defaultEdgeColor,
    defaultNodeAlign,
    sortDirectionFlag,
    autoFitViewFlag,
    mapFlag,
    cycleValidateFlag,
    zoomOutBlurFlag,
    turboFlag
  ])

  /**
   * [Dial] 현재 flow를 JSON으로 변환하여 로컬스토리지에 저장
   */
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
      const settings = flowSettings();
      localStorage.setItem(flowSet, JSON.stringify(settings))
    }
  }, [rfInstance, flowSettings, flowKey, flowSet])

  /**
   * [Dial] 로컬 스토리지에 저장된 flow를 등록
   */
  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));
      const settings = JSON.parse(localStorage.getItem(flowSet));
      if (flow) {
        const { x, y, zoom } = flow.viewport || { x: 0, y: 0, zoom: 1 };
        setLocalNodes(flow.nodes || []);
        setLocalEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
      if (settings) { // DANGER 3회 사용이므로 따로 함수로 정리할 것
        dispatch(setDefaultNodeValue(settings.defaultNodeValue));
        dispatch(setDefaultNodeColor(settings.defaultNodeColor));
        dispatch(setDefaultEdgeColor(settings.defaultEdgeColor));
        dispatch(setDefaultNodeAlign(settings.defaultNodeAlign));
        dispatch(setSortDirectionFlag(settings.sortDirectionFlag));
        dispatch(setAutoFitViewFlag(settings.autoFitViewFlag));
        dispatch(setMapFlag(settings.mapFlag));
        dispatch(setCycleValidateFlag(settings.cycleValidateFlag));
        dispatch(setZoomOutBlurFlag(settings.zoomOutBlurFlag));
        dispatch(setTurboFlag(settings.turboFlag));
      }
    };
    restoreFlow();
  }, [dispatch, setLocalNodes, setLocalEdges, setViewport, flowKey, flowSet])

  /**
     * [Dial] FitView를 실행하는 함수
     */
  const handleFitView = () => {
    fitView({ padding: 0.2 });
  }

  /**
   * [Dial] 레이아웃 정렬 함수 : 
   * Elkjs로 레이아웃을 계산하고 결과를 등록, 이후 자동 FitView 플래그에 따라 FitView 실행
   */
  const handleLayout = useCallback(async (targetNodes = nodes, targetEdges = edges, algorithm = 'mrtree') => {
    const { nodes: newNodes, edges: newEdges } = await layoutWithElk(targetNodes, targetEdges, sortDirectionFlag ? 'DOWN' : 'RIGHT', algorithm);
    setLocalNodes(newNodes);
    setLocalEdges(newEdges);
    if (connected) {
      sendMessage({
        type: "elk_layout",
        payload: {},
      });
    }
    if (autoFitViewFlag)
      setTimeout(() => {
        fitView({ padding: 0.2 }); // dependency 문제로 직접 실행
      }, 50);
  }, [setLocalNodes, setLocalEdges, nodes, edges, fitView, sortDirectionFlag, autoFitViewFlag, connected, sendMessage]);

  /**
   * settings에 진입하는 애니메이션을 위한 함수 :
   * 비동기 함수이므로 이 동작이 끝난 이후 다음 코드를 실행함
   * @param {number} duration - 기본값 0.8초, 지정된 시간 동안 줌아웃을 실행
   */
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

  /**
   * [Dial] settings 모드로 진입하는 함수 : 
   * 비동기 함수이며 줌아웃 이후 지정된 settings nodes와 edges를 가져와 settings 모드로 진입한다.
   */
  const handleSettings = useCallback(async () => {
    setRenderCnt(rerender_key);
    if (rfInstance)
      setTempRef(JSON.stringify(rfInstance.toObject()));
    await zoomOut();
    dispatch(activateSetModeFlag());
    setLocalNodes(
      turboFlag ?
        settingNodes(defaultNodeValue, defaultNodeColor, defaultEdgeColor).filter(node => !['7', '10', 'nodecolor', 'edgecolor'].includes(node.id)) :
        settingNodes(defaultNodeValue, defaultNodeColor, defaultEdgeColor));
    setLocalEdges(
      turboFlag ?
        settingEdges(defaultNodeAlign, sortDirectionFlag, autoFitViewFlag, mapFlag, cycleValidateFlag, zoomOutBlurFlag, turboFlag).filter(edge => !['Notice->7', '7->nodecolor', 'Notice->10', '10->edgecolor'].includes(edge.id)) :
        settingEdges(defaultNodeAlign, sortDirectionFlag, autoFitViewFlag, mapFlag, cycleValidateFlag, zoomOutBlurFlag, turboFlag));
  }, [
    dispatch,
    zoomOut,
    setLocalEdges,
    setLocalNodes,
    defaultNodeValue,
    defaultEdgeColor,
    defaultNodeColor,
    defaultNodeAlign,
    sortDirectionFlag,
    autoFitViewFlag,
    mapFlag,
    cycleValidateFlag,
    zoomOutBlurFlag,
    turboFlag,
    rfInstance,
  ]);

  // settings 모드 진입을 감지하며 고치지 못한 버그로 인해 레이아웃 정렬을 renderCnt만큼 실행한다
  useEffect(() => {
    if (setModeFlag && renderCnt && nodes.filter((e) => e.id === 'Notice')) {
      handleLayout(nodes, edges, 'layered'); // settings는 layered로
      setRenderCnt(renderCnt - 1);
    }
    // eslint-disable-next-line
  }, [setModeFlag, handleLayout, edges, nodes])

  /**
   * [Dial] settings 모드에서 이탈 시 실행하는 함수 : 
   * settings 모드 진입 이전 상태로 되돌리며, settings에서 설정한 값을 반영한다.
   */
  const handleSaveSettings = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(tempRef);
      if (flow) {
        const { x, y, zoom } = flow.viewport || { x: 0, y: 0, zoom: 1 };
        setLocalNodes(flow.nodes || []);
        if (!turboFlag && flow.edges) {
          const prevEdges = flow.edges.map((edge) => {
            return {
              ...edge,
              style: {
                ...edge.style,
                stroke: rgbastr2hex(defaultEdgeColor),
              }
            }
          })
          setLocalEdges(prevEdges || []);
        } else
          setLocalEdges(flow.edges);
        setViewport({ x, y, zoom });
      }
    };
    setRenderCnt(rerender_key);
    restoreFlow();
    dispatch(deactivateSetModeFlag());
  }, [dispatch, setLocalEdges, setLocalNodes, setViewport, tempRef, turboFlag, defaultEdgeColor]);

  /**
   * [Dial] 현재 데이터를 URL로 변환하여 클립보드에 복사하는 함수
   */
  const urlCopy = useCallback(() => {
    const data = {
      flow: rfInstance.toObject(),
      settings: flowSettings(),
    }
    const encoded = encodeFlowToUrlParam(data);
    const url = `${window.location.origin}/StarryFlow/main#data=${encoded}`;

    navigator.clipboard.writeText(url)
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  }, [rfInstance, flowSettings])

  /**
   * [Dial] 현재 flow의 모든 데이터 제거
   */
  const onReset = useCallback(() => {
    setLocalEdges([]);
    setLocalNodes([]);
    dispatch(clearSelectedNode());
  }, [dispatch, setLocalEdges, setLocalNodes])

  /**
   * [socket] node move event handler
   */
  const onNodeDragStop = useCallback((e, node) => {
    if (connected) {
      sendMessage({
        type: "node_move",
        payload: {
          id: node.id,
          position: node.position,
        }
      });
    }
  }, [connected, sendMessage])

  /**
   * [socket] edge delete event handler
   */
  const onEdgesDelete = useCallback((deletedEdges) => {
    if (connected) {
      deletedEdges.forEach((edge) => {
        sendMessage({
          type: "edge_delete",
          payload: {
            id: edge.id,
          }
        });
      });
    }
  }, [connected, sendMessage])

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
        onNodeDragStop={onNodeDragStop} // [socket] 노드 drop시 동작
        onEdgesDelete={onEdgesDelete} // [socket] 엣지 delete시 동작
        fitView
      >
        {!(setModeFlag && !(id === 'value' || id === 'nodecolor' || id === 'edgecolor')) && existSelectedNode && (<NodePanel />)}
        {!setModeFlag && mapFlag && (<MiniMap nodeStrokeWidth={3} position={'top-right'} nodeColor={'#b0b0b0'} />)}
        <svg>
          <defs>
            <linearGradient id="edge-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
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
            <marker
              id="edge-arrow"
              viewBox="0 0 20 20"
              refX="13"
              refY="10"
              markerWidth="10"
              markerHeight="10"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path
                d="M2,2 L18,10 L2,18 C4,12 4,8 2,2 Z"
                fill={rgbastr2hex(defaultEdgeColor)}
                fillOpacity="1"
              />
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
        onShare={urlCopy}
        onReset={onReset}
      />
    </div>
  );
};

export default FlowCanvas;