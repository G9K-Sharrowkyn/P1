import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
// import SnakeGame from './components/Snake/SnakeGame.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ReactDOM.render(
//   <React.StrictMode>
//     <h1>react-simple-snake</h1>
//     <div className="textWrapper">
//       <p className="subTitle">
//       <a href="https://www.npmjs.com/package/react-simple-snake" target="_blank" rel="noopener noreferrer">NPM</a> -
//       <a href="https://github.com/MaelDrapier/react-simple-snake" target="_blank" rel="noopener noreferrer"> Github</a>
//       </p>
//       <p id="instructions">Use the arrow keys or W/A/S/D to play</p>
//       <p className="subTitle">A simple snake game created with the
//       <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer"> React </a>
//       JavaScript library</p>
//     </div>
//     <SnakeGame />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
