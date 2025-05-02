import { getStraightPath, useInternalNode } from '@xyflow/react';

import { getEdgeParams } from '../utils/utils';

function CustomEdge({ id, source, target, markerEnd, style, data }) {

  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const points = data?.points ?? [];
  const path = [
    `M ${sx} ${sy}`,
    ...points.map((p) => `L ${Math.round(p.x)} ${Math.round(p.y)}`),
    `L ${tx} ${ty}`
  ].join(' ');

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
      path={path}
    />
  );
}

export default CustomEdge;