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

  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState([]); // sample test results
  const [verdicts, setVerdicts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setVerdicts([]); // clear old verdicts
    const hidden = testCases.filter(tc => !tc.isSample);
    const results = [];
    let totalTime = 0;
    for (const tc of hidden) {
      try {
        const res = await axios.post("http://localhost:8081/run", {
          code,
          language,
          input: tc.input
        });
        const { output, time } = res.data;
        const actual = output.trim();
        const expected = tc.expectedOutput.trim();
        results.push({ input: tc.input, expected, actual, passed: actual === expected, time });
        totalTime += time;
      }
      catch (err) {
        const errTime = err.response?.data?.time || 0;      // fallback
        results.push({
          input: tc.input,
          expected: tc.expectedOutput.trim(),
          actual: err.response?.data?.stderr || err.message,
          passed: false,
          time: errTime
        });
        totalTime += errTime;
      }
    }
    setVerdicts(results);
    setIsSubmitting(false);
    const overall = results.every(v => v.passed)
      ? 'Accepted'
      : 'Wrong Answer';

    await axios.post('http://localhost:5000/api/submission/create', {
      problemId: id,
      code,
      language,
      verdict: overall,
      executionTime: totalTime
    }, { withCredentials: true });

  };




  const handleRun = async () => {
    setIsRunning(true);
    setRunResults([]);
    const samples = testCases.filter(tc => tc.isSample);
    const results = [];
    for (const tc of samples) {
      try {
        const res = await axios.post("http://localhost:8081/run", {
          code,
          language,
          input: tc.input
        });
        const { output, time } = res.data;           // grab the time
        const actual = output.trim();
        const expected = tc.expectedOutput.trim();
        results.push({ input: tc.input, expected, actual, passed: actual === expected, time });
      } catch (err) {
        const errTime = err.response?.data?.time || 0;
        results.push({
          input: tc.input,
          expected: tc.expectedOutput.trim(),
          actual: err.response?.data?.stderr || err.message,
          passed: false,
          time: errTime
        });
      }
    } setRunResults(results);
    setIsRunning(false);
  };


  if (loading) return <div className="loading">Loading...</div>;
  if (!problem) return <div className="problem-error">Problem not found</div>;

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
          <button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</button>
        </div>
        <div className="code-area">
          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Write your code here..."
            spellCheck="false"  //to remove red underline under some spell which browser doesnot understand
          />
          {/* Sample Test Results */}
          {runResults.length > 0 && (
            <div className="output-box">
              <h4>Sample Results:</h4>
              {runResults.map((v, i) => (
                <div key={i} className={v.passed ? 'passed' : 'failed'}>
                  <p><strong>Input:</strong> {v.input}</p>

                  <p><strong>Actual:</strong> {v.actual}</p>
                  <p><strong>Status:</strong> {v.passed ? '✅ Passed' : '❌ Failed'}</p>
                  <hr />
                </div>
              ))}
            </div>
          )}

          {/* Hidden Test Verdicts */}
          {verdicts.length > 0 && (
            <div className="output-box">
              <h4>Verdicts:</h4>
              {(() => {
                const wrongs = verdicts.filter(v => !v.passed);
                if (wrongs.length) {
                  return wrongs.map((v, i) => (
                    <div key={i} className='failed'>
                      <p><strong>Input:</strong> {v.input}</p>
                      <p><strong>Expected:</strong> {v.expected}</p>
                      <p><strong>Actual:</strong> {v.actual}</p>
                      <p><strong>Status:</strong> {v.passed ? '✅ Passed' : '❌ Failed'}</p>
                      <hr />
                    </div>
                  ));
                } else {
                  return (
                    <div>
                      <p className="passed">All hidden test cases passed ✅</p>
                      <p><strong>Total Time:</strong> {verdicts.reduce((acc, v) => acc + v.time, 0)} ms</p>
                    </div>
                  );
                }
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default ProblemDetail;
