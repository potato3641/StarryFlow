import './DragDiv.css';
import React, { useRef, useEffect } from 'react';

const DragDiv = ({ data }) => {

  const divRef = useRef(null);
  const position = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  // const boundary = 300;
  const size = 150;

  useEffect(() => {
    if (divRef.current) { // 센터고정(삭제예정)
      const centerX = window.innerWidth / 2 - size / 2;
      const centerY = window.innerHeight / 2 - size / 2;
      divRef.current.style.transform = `translate(${centerX}px, ${centerY}px)`;
    }
  }, []);

  const handleMouseDown = (e) => {
    dragging.current = true;
    const rect = divRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;

    // const centerX = window.innerWidth / 2 - size / 2;
    // const centerY = window.innerHeight / 2 - size / 2;

    let newX = e.clientX - offset.current.x;
    let newY = e.clientY - offset.current.y;

    // newX = Math.max(centerX - boundary, Math.min(centerX + boundary, newX));
    // newY = Math.max(centerY - boundary, Math.min(centerY + boundary, newY));

    position.current = {
      x: newX,
      y: newY,
    };

    if (divRef.current) {
      divRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;
    }
  };

  const handleMouseUp = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="drag-div"
      ref={divRef}
      onMouseDown={handleMouseDown}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${size / 2}px`,
      }}
    >
      IDEA
    </div>
  );
};

export default DragDiv;