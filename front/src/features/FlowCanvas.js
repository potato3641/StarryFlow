import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedNode, setSelectedNode, setsLabel, setsFontSize, clearsLabel, clearsFontSize, deactivateApplyFlag } from '../redux/flowSlice';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  // useReactFlow,
  MarkerType,
  addEdge,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '../ui/CustomNode';
import CustomEdge from '../ui/CustomEdge';
import CustomLine from '../ui/CustomLine';
import NodePanel from './NodePanel'

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
}

const connectionLineStyle = {
  stroke: '#b1b1b7',
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
    resizable: true,
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 250, y: 320 },
    data: { label: '0' },
    resizable: true,
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 40, y: 300 },
    data: { label: '0' },
    resizable: true,
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 300, y: 0 },
    data: { label: '0' },
    resizable: true,
  },
];

const FlowCanvas = () => {
  // REDUX
  const dispatch = useDispatch();
  const existSelectedNode = useSelector((state) => state.flow.selectedNode) || false;
  const applyFlag = useSelector((state) => state.flow.applyFlag);
  const id = useSelector((state) => state.flow.selectedNode)
  const fontSize = useSelector((state) => state.flow.sFontSize)
  const label = useSelector((state) => state.flow.sLabel)
  // REACT
  const [nodes, setLocalNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState([]);
  // const { fitView } = useReactFlow();

  useEffect(() => {
    if (applyFlag) {
      const updateNodes = nodes.map((node) =>
        node.id === id ? {
          ...node,
          data: {
            ...node.data,
            label,
            fontSize: fontSize,
          }
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

  const onConnect = useCallback((params) => {
    setLocalEdges((eds) => addEdge(params, eds))
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

  return (
    <div className="wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.2}
        maxZoom={4}
        connectionLineComponent={CustomLine}
        connectionLineStyle={connectionLineStyle}
        defaultEdgeOptions={defaultEdgeOptions}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodesDelete={onNodesDelete}
        onEdgesChange={onEdgesChange}
        selectNodesOnDrag={false} // 드래그 시 select되는 기능 false
        fitView
      >
        {existSelectedNode && (<NodePanel />)}
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;