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
import NodePanel from './NodePanel'
import NavDial from '../features/NavDial'
import { layoutWithElk } from '../utils/layout'
// ui
import '@xyflow/react/dist/style.css';

const flowKey = '1q2w3e4r'

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
}

const connectionLineStyle = {
  stroke: '#b1b1b7',
  strokeWidth: 2,
};

const defaultEdgeOptions = {
  type: 'custom',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#b1b1b7',
  },
};

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: { label: '0' },
  },
];

const getNodeId = () => `randomnode_${+new Date()}`;

const FlowCanvas = () => {
  // REDUX
  const dispatch = useDispatch();
  const existSelectedNode = useSelector((state) => state.flow.selectedNode) || false;
  const id = useSelector((state) => state.flow.selectedNode);
  const fontSize = useSelector((state) => state.flow.sFontSize);
  const label = useSelector((state) => state.flow.sLabel);
  const defaultNodeValue = useSelector((state) => state.flow.defaultNodeValue);
  const applyFlag = useSelector((state) => state.flow.applyFlag);
  const sortDirectionFlag = useSelector((state) => state.flow.sortDirectionFlag);
  const autoFitViewFlag = useSelector((state) => state.flow.autoFitViewFlag);
  const mapFlag = useSelector((state) => state.flow.mapFlag);
  const cycleValidateFlag = useSelector((state) => state.flow.cycleValidateFlag)
  // REACT
  const [nodes, setLocalNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport, fitView, getNodes, getEdges, screenToFlowPosition } = useReactFlow();

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
      const nodes = getNodes();
      const edges = getEdges();
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
      return !hasCycle(target);
    },
    [getNodes, getEdges],
  );

  const onConnect = useCallback((params) => {
    setLocalEdges((eds) => addEdge({ ...params, style: { ...params.style, strokeWidth: 2 } }, eds))
  }, [setLocalEdges]);

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

  const handleLayout = useCallback(async () => {
    const { nodes: newNodes, edges: newEdges } = await layoutWithElk(nodes, edges, sortDirectionFlag ? 'DOWN' : 'RIGHT');
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

  return (
    <div className="wrapper">
      <ReactFlow
        nodes={nodes} // node data
        edges={edges} // edge data
        nodeTypes={nodeTypes} // node 컴포넌트
        edgeTypes={edgeTypes} // edge 컴포넌트
        minZoom={0.2} // 최소 줌
        maxZoom={3} // 최대 줌
        connectionLineComponent={CustomLine} // cunnect 라인 컴포넌트
        connectionLineStyle={connectionLineStyle} // connect 라인 스타일
        defaultEdgeOptions={defaultEdgeOptions} // edge 기본설정
        onConnect={onConnect} // 연결
        onNodesChange={onNodesChange} // 노드 수정
        onNodeClick={onNodeClick} // 노드클릭
        onPaneClick={onPaneClick} // 노드외 클릭
        onNodesDelete={onNodesDelete} // 노드 삭제 시 edge 병합
        onEdgesChange={onEdgesChange} // edge 병합 작업용
        {...(cycleValidateFlag && { isValidConnection: isValidConnection })} // 싸이클방지
        onInit={setRfInstance} // ref for save/restore
        selectNodesOnDrag={false} // 드래그 시 select되는 기능 false
        fitView
      >
        {existSelectedNode && (<NodePanel />)}
        {mapFlag && (<MiniMap nodeStrokeWidth={3} position={'top-right'} nodeColor={'#b0b0b0'} />)}
      </ReactFlow>
      <NavDial
        onAdd={onAdd}
        onSave={onSave}
        onRestore={onRestore}
        onFit={handleFitView}
        onSort={handleLayout} />
    </div>
  );
};

export default FlowCanvas;