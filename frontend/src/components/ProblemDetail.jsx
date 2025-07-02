import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProblemDetail.css';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);


  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const [probRes, tcRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/problem/${id}`),
          axios.get(`http://localhost:5000/api/testcase/problem/${id}`)
        ]);
        setProblem(probRes.data);
        setTestCases(tcRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    try {
      const res = await axios.post("http://localhost:8081/run", {
        code,
        language,
      });
      setOutput(res.data.output);
    } catch (err) {
      console.error(err);
      setOutput(
        err.response?.data?.stderr ||
        err.response?.data?.error ||
        'Execution failed.'
      );
    } finally {
      setIsRunning(false);
    }
  }

if (loading) return <div className="loading">Loading...</div>;
if (!problem) return <div className="error">Problem not found</div>;

return (
  <div className="problem-detail-container">
    <div className="left-panel">
      <div className="problem-header">
        <h2>{problem.title}</h2>
        <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
      </div>

      <div className="section problem-description">
        <h4>Description</h4>
        <p>{problem.description}</p>
      </div>

      <div className="section problem-constraints">
        <h4>Input Format</h4>
        <p>{problem.inputFormat}</p>
        <h4>Output Format</h4>
        <p>{problem.outputFormat}</p>
      </div>

      <div className="section problem-examples">
        <h4>Sample Test Cases</h4>
        {testCases.filter(tc => tc.isSample).map((tc, idx) => (
          <div key={idx} className="example-block">
            <p><strong>Input:</strong> {tc.input}</p>
            <p><strong>Output:</strong> {tc.expectedOutput}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="right-panel">
      <div className="code-toolbar">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        <button onClick={handleRun} disabled={isRunning}>{isRunning ? 'Running..' : 'Run'}</button>
        <button>Submit</button>
      </div>
      <textarea
        className="code-editor"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="// Write your code here..."
      ></textarea>
       {output !== '' && (
          <div className="output-box">
            <h4>Output:</h4>
            <pre>{output}</pre>
          </div>
        )}

    </div>
  </div>
);
};

export default ProblemDetail;
