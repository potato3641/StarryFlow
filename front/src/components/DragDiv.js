import './DragDiv.css';
import React, { useRef, useEffect } from 'react';

const DragDiv = () => {

  const divRef = useRef(null);
  const position = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const boundary = 300;
  const size = 150;

  useEffect(() => {
    if (divRef.current) {
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

    const centerX = window.innerWidth / 2 - 70;
    const centerY = window.innerHeight / 2 - 50;

    let newX = e.clientX - offset.current.x;
    let newY = e.clientY - offset.current.y;

    newX = Math.max(centerX - boundary, Math.min(centerX + boundary, newX));
    newY = Math.max(centerY - boundary, Math.min(centerY + boundary, newY));

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
    <div
      ref={divRef}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        background: "linear-gradient(120deg,rgb(255, 255, 129) 0%,rgb(128, 128, 128) 100%)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: `${size / 2}px`,
        cursor: "grab",
        userSelect: "none",
        fontWeight: "bold",
        fontSize: "16px",
        textTransform: "uppercase",
        letterSpacing: "1px",
        // filter: "drop-shadow(10px 10px 20px rgba(255, 255, 204, 0.5))",
        boxShadow: "10px 10px 20px rgba(255, 255, 204, 0.5), inset -3px -3px 8px rgba(255, 255, 204, 0.8)",
        transition: "transform 0.1s ease-out",
      }}
    >
      Drag me
    </div>
  );
};

export default DragDiv;