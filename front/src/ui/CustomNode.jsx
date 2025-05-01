import React, { memo, useEffect } from 'react';
import { Handle, Position, useConnection } from '@xyflow/react';
import { activateFabGlowStyle, deactivateFabGlowStyle } from '../style';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedNode } from '../redux/flowSlice';
import { glowedColor } from '../utils/utils';
import './CustomNode.css';

const CustomNode = ({ data, id, selected }) => {
  const connection = useConnection();
  const isTarget = connection.inProgress && connection.fromNode.id !== id;
  const nowSelectedNode = useSelector((state) => state.flow.selectedNode);
  const defaultNodeAlign = useSelector((state) => state.flow.defaultNodeAlign);
  const defaultNodeColor = useSelector((state) => state.flow.defaultNodeColor);
  const dispatch = useDispatch();

  useEffect(() => {
    // selected Node가 있을때 id 등록
    // 이후 apply될때를 감지해서 fontsize랑 label갖고와서 적용해야함
    if (selected)
      dispatch(setSelectedNode(id));
    // selected Node가 없는데 id가 있으면 제거
    if (!selected && (nowSelectedNode === id))
      dispatch(setSelectedNode(false));
    // eslint-disable-next-line
  }, [dispatch, selected])

  return (
    <div
      className="customNode"
      style={{
        ...(selected ? activateFabGlowStyle : deactivateFabGlowStyle),
        background: selected ? glowedColor(defaultNodeColor) : defaultNodeColor,
        textAlign: defaultNodeAlign,
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
