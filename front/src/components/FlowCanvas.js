import React, { useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '../base/CustomNode';
import { getLayoutedElements } from "../utils/layout";

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes = [
  {
    id: '0',
    type: 'custom',
    position: { x: 0, y: 50 },
    data: { label: '0' },
    animated: true,
  },
];

let id = 1;
const getId = () => `${id++}`;
const nodeOrigin = [0.5, 0];

const FlowCanvas = ({ setAdjustLayoutRef }) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        const id = getId();
        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;

        const bounds = reactFlowWrapper.current.getBoundingClientRect();
        const flowPos = screenToFlowPosition({
          x: clientX - bounds.left,
          y: clientY - bounds.top,
        });
        const newNode = {
          id,
          type: 'custom',
          position: flowPos,
          data: { label: `${id}` },
          origin: [0.5, 0.0],
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectionState.fromNode.id, target: id }),
        );
      }
    },
    [screenToFlowPosition],
  );

  const onEdgeClick = useCallback(
    (event, edge) => {
      event.stopPropagation();
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    },
    [setEdges]
  );

  const adjustLayout = useCallback(() => {
    const { nodes: ln, edges: le } = getLayoutedElements(nodes, edges, "LR");
    setNodes(ln);
    setEdges(le);
  }, [nodes, edges]);

  useEffect(() => {
    if (setAdjustLayoutRef) {
      setAdjustLayoutRef.current = adjustLayout;
    }
  }, [adjustLayout, setAdjustLayoutRef]);

  return (
    <div className="wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onEdgeClick={onEdgeClick}
        fitView
        nodeOrigin={nodeOrigin}
      />
    </div>
  );
};

export default FlowCanvas;