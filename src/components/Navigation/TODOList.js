import React, { useState, useEffect, useRef } from 'react';
import '../../assets/css/General.css';

function DraggableTodoList() {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const draggableArea = useRef(null);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const inputRef = useRef();

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const newTask = inputRef.current.value;

    setTasks([...tasks, newTask]);
  };

  const deleteTask = (e) => {
    const index = e.currentTarget.dataset.index;

    const newTasks = tasks.filter((_, idx) => idx != index);
    setTasks(newTasks);
  };

  const dragStart = (e) => {
    console.log('dragStart');
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };
  
  const dragging = (e) => {
    if (isDragging) {
    console.log('dragging');
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };
  
  const dragEnd = () => {
    console.log('dragEnd');
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
            <button onClick={addTask}>Dodaj zadanie</button>
          </div>
      
          <div className="task-container">
               <ul>
                {tasks.map((task, index) => (
                    <li key={index} className="task-item">
                      {task} <button className="button4" data-index={index} onClick={deleteTask}>Usuń</button>
                      <div className="clearfix"></div>
                    </li>
                  ))}
              </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DraggableTodoList;
