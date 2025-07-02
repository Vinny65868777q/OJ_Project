import React,{useState} from 'react';
import axios from 'axios';
import './AddProblem.css';
import {useNavigate} from 'react-router-dom';

const AddProblem = () =>{
    const [formData,setFormData] = useState({
        title: '',
        description: '',
        inputFormat: '',
        outputFormat: '',
        difficulty:'medium',
    });
  const navigate = useNavigate();

const [message, setMessage] = useState('');

   const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/problem/create', formData, {
        withCredentials: true
      });
      const problemId = res.data.problemId;
      setMessage('Problem created successfully!');
      setTimeout(() => navigate(`/admin/problem/${problemId}/add-testcases`), 1500);
      console.log('Saved Problem ID:', problemId);
    } catch (err) {
  const data = err.response?.data;
  if (Array.isArray(data) && data.length) {
    setMessage(data[0].msg);
  } else if (data?.message) {
    setMessage(data.message);
  } else {
    setMessage('Failed to create problem.');
  }
}

  };


    return (
    <div className="add-problem-container">
      <h2>Add a New Problem</h2>
      {message && <p className="message">{message}</p>}
      <div className="form-scroll-area"> {/* Scrollable wrapper */}
      <form onSubmit={handleSubmit} noValidate>
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="text" name="inputFormat" placeholder="Input Format" value={formData.inputFormat} onChange={handleChange} required />
        <input type="text" name="outputFormat" placeholder="Output Format" value={formData.outputFormat} onChange={handleChange} required />
        <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="difficult">Difficult</option>
        </select>
        <button type="submit">Create Problem</button>
      </form>
      </div>
    </div>
  );
};

export default AddProblem;

