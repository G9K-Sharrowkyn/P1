import React, { useState, useEffect, useRef } from 'react';
import { addItem } from '../../actions/todolist.actions.js'
import { connect } from 'react-redux';
import TaskListContaier from './TaskListContainer.js';

function DraggableTodoList( { addItem } ) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const draggableArea = useRef(null);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const inputRef = useRef();

  const addTask = (e) => {
    const newTask = inputRef.current.value;

    addItem(newTask);
  };


  const dragStart = (e) => {
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };
  
  const dragging = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };
  
  const dragEnd = () => {
    setIsDragging(false);
    setOffset(position);
  };

  useEffect(() => {
    if (draggableArea.current) {
      draggableArea.current.style.top = `${position.y}px`;
      draggableArea.current.style.left = `${position.x}px`;
    }
  }, [position]);

  return (
    <div
      onMouseDown={dragStart}
      onMouseMove={dragging}
      onMouseUp={dragEnd}
      onMouseLeave={dragEnd}
      style={{position: "fixed", height: "100vh", width: "100vw"}}
    >
      <div
        ref={draggableArea}
        style={{ cursor: 'move', position: 'absolute', top: '0', left: '0' }}
      >
        <div className="todo-container">
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
            />
          </div>
          <div className="button-container">
            <button className="btn" onClick={addTask}>Dodaj zadanie</button>
          </div>
      
          <TaskListContaier />
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  addItem,
}

export default connect(null, mapDispatchToProps)(DraggableTodoList)
