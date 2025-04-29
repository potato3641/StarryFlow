import React, { memo, useEffect } from 'react';
import { Handle, Position, useConnection } from '@xyflow/react';
import { activateFabGlowStyle, deactivateFabGlowStyle } from '../style';
import { useDispatch } from 'react-redux';
import { setSelectedNode } from '../redux/flowSlice';
import './CustomNode.css';

const CustomNode = ({ data, id, selected }) => {
  const connection = useConnection();
  const isTarget = connection.inProgress && connection.fromNode.id !== id;
  const dispatch = useDispatch();
  // apply될떄를 감지해서 fontsize랑 label갖고와서 적용해야함
  useEffect(() => {
    if (selected) {
      dispatch(setSelectedNode(id));
    }
  }, [dispatch, id, selected])

  return (
    <div
      className="customNode"
      style={{
        ...(selected ? activateFabGlowStyle : deactivateFabGlowStyle),
      }}
    >
      <div className="customNodeBody" style={{ fontSize: `${data.fontSize}px` }}>
        {!connection.inProgress && (
          <Handle
            className="customHandle"
            position={Position.Right}
            type="source"
          />
        )}
        {(!connection.inProgress || isTarget) && (
          <Handle
            className="customHandle"
            position={Position.Left}
            type="target"
            isConnectableStart={false} />
        )}
        {data.label}
      </div>
    </div>
  );
};

export default memo(CustomNode);
