import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AddTestCases.css';

const AddTestCases = () => {
  const { problemId } = useParams(); // problemId from URL
  const navigate = useNavigate();

  const [sampleTestCases, setSampleTestCases] = useState([{ input: '', expectedOutput: '' }]);
  const [hiddenTestCases, setHiddenTestCases] = useState([{ input: '', expectedOutput: '' }]);
  const [message, setMessage] = useState('');

  const handleChange = (index, field, value, type) => {
    const setter = type === 'sample' ? setSampleTestCases : setHiddenTestCases;
    const cases = [...(type === 'sample' ? sampleTestCases : hiddenTestCases)];
    cases[index][field] = value;
    setter(cases);
  };

  const addField = (type) => {
    const setter = type === 'sample' ? setSampleTestCases : setHiddenTestCases;
    setter((prev) => [...prev, { input: '', expectedOutput: '' }]);
  };

  const removeField = (index, type) => {
    const setter = type === 'sample' ? setSampleTestCases : setHiddenTestCases;
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const allCases = [
    ...sampleTestCases.map(tc => ({ ...tc, isSample: true })),
    ...hiddenTestCases.map(tc => ({ ...tc, isSample: false }))
  ];

  const errors = [];

  // Loop through each test case separately
  for (let i = 0; i < allCases.length; i++) {
    const testCase = allCases[i];
    try {
      await axios.post(
       `${import.meta.env.VITE_BACKEND_URL}/api/testcase/create`,
        { ...testCase, problemId },
        { withCredentials: true }
      );
    } catch (err) {
      // Normalize backend error response
      const data = err.response?.data;
      let msg;
      if (Array.isArray(data) && data.length) {
        msg = data[0].msg;
      } else if (typeof data === 'string') {
        msg = data;
      } else if (data?.message) {
        msg = data.message;
      } else {
        msg = err.message;
      }
      errors.push(`Test case ${i + 1}: ${msg}`);
    }
  }
 if (errors.length > 0) {
    // to Show only the first error 
    setMessage(errors[0]);
  } else {
    setMessage('✅ All test cases saved!');
    setTimeout(() => navigate('/admin'), 2000);
  }
};
  return (
    <div className="page-bg">
    <div className="testcase-form">
      <h2>Add Test Cases for Problem</h2>
      {message && <p className="msg">{message}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <h3>Sample Test Cases</h3>
        {sampleTestCases.map((tc, idx) => (
          <div key={idx} className="tc-block">
            <input value={tc.input} onChange={e => handleChange(idx, 'input', e.target.value, 'sample')} placeholder="Input" required />
            <input value={tc.expectedOutput} onChange={e => handleChange(idx, 'expectedOutput', e.target.value, 'sample')} placeholder="Expected Output" required />
            {sampleTestCases.length > 1 && <button type="button" onClick={() => removeField(idx, 'sample')}>Remove</button>}
          </div>
        ))}
        <button type="button" onClick={() => addField('sample')}>➕ Add Sample</button>

        <h3>Hidden Test Cases</h3>
        {hiddenTestCases.map((tc, idx) => (
          <div key={idx} className="tc-block">
            <input value={tc.input} onChange={e => handleChange(idx, 'input', e.target.value, 'hidden')} placeholder="Input" required />
            <input value={tc.expectedOutput} onChange={e => handleChange(idx, 'expectedOutput', e.target.value, 'hidden')} placeholder="Expected Output" required />
            {hiddenTestCases.length > 1 && <button type="button" onClick={() => removeField(idx, 'hidden')}>Remove</button>}
          </div>
        ))}
        <button type="button" onClick={() => addField('hidden')}>➕ Add Hidden</button>

        <br /><br />
        <button type="submit">Save Test Cases</button>
      </form>
    </div>
    </div>
  );
};

export default AddTestCases;
