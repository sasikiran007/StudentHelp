import { MathJax, MathJaxContext } from 'better-react-mathjax';

const MathText = ({ latex }) => (
  <MathJaxContext config={{ loader: { load: ['input/tex', 'output/chtml'] } }}>
    <MathJax inline dynamic>{`\\(${latex}\\)`}</MathJax>
  </MathJaxContext>
);

export default MathText;
