import React, { useState } from 'react';
import { MiniMaple } from './miniMaple.js';
import { MiniMapleGraph } from './miniMapleGraph.js';

import './App.css';


function App() {
  const [expression, setExpression] = useState('-x^2+1');
  const [variable, setVariable] = useState('x');
  const [result, setResult] = useState({ derivative: '', integral: '' });

  const maple = new MiniMaple();
  const maplegr = new MiniMapleGraph();
  const handleClick = () => {
    let res = '';
    let res2 = '';
    if (!variable.match(/[a-z]/)) {
      res = 'Error';
    } else {
      res = maple.derivative(expression, variable);
      res2 = maple.integral(expression, variable);
      maplegr.graph(expression, variable);
    }

    setResult({ derivative: res, integral: res2 });
  };

  return (
    <div className='App'>
      <form>
      <h1>Write your expression:</h1>
      <label htmlFor="expression">Expression:</label>
      <input
        id="expression"
        type="text"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
      />
      <br />
      <label htmlFor="variable">Variable:</label>
      <input
        id="variable"
        type="text"
        value={variable}
        onChange={(e) => setVariable(e.target.value)}
      />

      <br />
      <button type="button" id="calculate" onClick={handleClick}>
        Calculate
      </button>

      <div id="answer">
        <p>Производная: {result.derivative}</p>
        <p>Интеграл: {result.integral}</p>
      </div>
      <div>
        <svg id="graph"></svg>
      </div>
      </form>
    </div>
  );
}

export default App;
