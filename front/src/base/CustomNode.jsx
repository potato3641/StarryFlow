import React from 'react';
import { Handle, Position } from '@xyflow/react';

const CustomNode = ({ data, id }) => {
  return (
    <div style={{
      padding: '12px 24px',
      background: 'rgba(10, 10, 60, 0.85)',         // 더 진하고 어두운 블루톤
      border: '1px solid rgba(255, 255, 255, 0.4)',  // 선명한 흰 테두리
      borderRadius: '12px',
      color: '#f5f5f5',                              // 거의 순백에 가까운 텍스트
      backdropFilter: 'blur(8px)',                   // 살짝 더 흐림
      boxShadow: '0 0 12px rgba(255, 255, 255, 0.2)', // 은은하지만 확실한 글로우
      maxWidth: '200px',
      textAlign: 'center',
      fontSize: '14px',
    }}>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{
          background: 'rgba(255, 255, 255, 0.6)',      // 별빛 같은 흰 반투명
          width: 1,
          height: 1,
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.8)',
        }}
      />
      {data.label}
      <Handle
        type="target"
        position={Position.Left}
        id="b"
        style={{
          background: 'rgba(255, 255, 255, 0.6)',      // 별빛 같은 흰 반투명
          width: 1,
          height: 1,
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.8)',
        }}
      />
    </div>
  );
};

export default CustomNode;
