import React, { useState, useEffect, useRef } from 'react';
import '../../assets/css/General.css';

function DraggableTodoList() {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);
  const [newTask, setNewTask] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const draggableArea = useRef(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask) {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, idx) => idx !== index);
    setTasks(newTasks);
  };

  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
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
      ref={draggableArea}
      onMouseDown={dragStart}
      onMouseMove={dragging}
      onMouseUp={dragEnd}
      onMouseLeave={dragEnd}
      style={{ cursor: 'move', position: 'absolute', top: '0', left: '0' }}
    >
      <div className="todo-container">
        <div className="input-container">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button onClick={addTask}>Dodaj zadanie</button>
        </div>
    
        <div className="task-container">
             <ul>
              {tasks.map((task, index) => (
                  <li key={index} className="task-item">
                    {task} <button className="button4" onClick={() => deleteTask(index)}>Usuń</button>
                  </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
}

export default DraggableTodoList;
