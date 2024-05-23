import React from 'react';
import { connect } from 'react-redux';
import { removeItemByIndex } from '../../actions/todolist.actions.js'

function TaskListContainer( { todoList, removeItemByIndex } ) {

  const deleteTask = (e) => {
    const index = e.currentTarget.dataset.index;
    removeItemByIndex(index);
  };

  return (
    <div className="task-container">
         <ul>
          {todoList.map((task, index) => (
              <li key={index} className="task-item">
                {task} <button className="button4" data-index={index} onClick={deleteTask}>Usuń</button>
                <div className="clearfix"></div>
              </li>
            ))}
        </ul>
    </div>
  );
}

export default connect(state => {
  return {
    todoList: state.todoList.list
  }
}, {
  removeItemByIndex
})(TaskListContainer)
