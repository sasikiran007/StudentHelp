// App.jsx
import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';


const TestPreview = () => {
  return (
    <MathJaxContext>
      <div className="p-6">
        <p>Velocity vector:</p>
        <p>
          <MathJax dynamic inline>{"\\( \\overrightarrow{v} = \\frac{s}{t_2 - t_1} \\)"}</MathJax>
        </p>
      </div>
    </MathJaxContext>
  );
};

export default TestPreview;
