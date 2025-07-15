import { useState } from 'react';
import axios from 'axios';
import './AddContest.css';

export default function AddContest() {

    const emptyCase = { input: '', expectedOutput: '', isSample: true };
    const emptyProb = {
        title: '', description: '', inputFormat: '', outputFormat: '',
        difficulty: 'easy', testCases: [{ ...emptyCase }, { ...emptyCase, isSample: false }]
    };

    const [title, setTitle] = useState('');
    const [description, setDesc] = useState('');
    const [startAt, setStart] = useState('');
    const [endAt, setEnd] = useState('');
    const [problems, setProblems] = useState([emptyProb]);
    const [openPanel, setOpenPanel] = useState(null);
    const [msg, setMsg] = useState('');


    const addRow = () => setProblems(p => [...p, emptyProb]);
    const removeRow = i => setProblems(p => p.filter((_, idx) => idx !== i));
    const updateRow = (i, field, val) =>
        setProblems(p => p.map((row, idx) => idx === i ? { ...row, [field]: val } : row));
    const togglePanel = i => setOpenPanel(openPanel === i ? null : i);

    const addCase = i =>
        setProblems(p => p.map((prob, idx) => idx === i
            ? { ...prob, testCases: [...prob.testCases, emptyCase] }
            : prob));

    const updateCase = (pi, ci, field, val) =>
        setProblems(p => p.map((prob, idx) => idx === pi
            ? {
                ...prob,
                testCases: prob.testCases.map((tc, j) => j === ci ? { ...tc, [field]: val } : tc)
            }
            : prob));

    const removeCase = (pi, ci) =>
        setProblems(p => p.map((prob, idx) => idx === pi
            ? { ...prob, testCases: prob.testCases.filter((_, j) => j !== ci) }
            : prob));

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contests/with-problems`,
                { title, description, startAt, endAt, problems },
                { withCredentials: true });
            setMsg('Contest created with problems ✅');
            setTitle(''); setDesc(''); setStart(''); setEnd('');
            setProblems([emptyProb]);
            setOpenPanel(null);
        } catch (err) {
            setMsg(err.response?.data?.error || 'Error');
        }
    };


    return (
        <div className="admin-form">
            <h2>New Contest</h2>
            {msg && <p>{msg}</p>}

            <form onSubmit={handleSubmit}>
                {/* contest meta */}
                <input placeholder="Contest title" value={title}
                    onChange={e => setTitle(e.target.value)} required />
                <textarea placeholder="Description" value={description}
                    onChange={e => setDesc(e.target.value)} />

                <input type="datetime-local" value={startAt}
                    onChange={e => setStart(e.target.value)} required />
                <input type="datetime-local" value={endAt}
                    onChange={e => setEnd(e.target.value)} required />

                {/* problems */}
                <h3>Problems</h3>
                {problems.map((p, i) => (
           <>       
                    <div key={i} className="prob-card">
                        {/* main row */}
                        
                            <input className="prob-title" placeholder="Title" value={p.title}
                                onChange={e => updateRow(i, 'title', e.target.value)} required />
                            <select className="prob-diff" value={p.difficulty}
                                onChange={e => updateRow(i, 'difficulty', e.target.value)}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="difficult">Hard</option>
                            </select>
                            <textarea  className="prob-desc" placeholder="Full description"
                                value={p.description}
                                onChange={e => updateRow(i, 'description', e.target.value)} required />
                            <input className="prob-in" placeholder="Input format" value={p.inputFormat}
                                onChange={e => updateRow(i, 'inputFormat', e.target.value)} required />

                            <input className="prob-out" placeholder="Output format" value={p.outputFormat}
                                onChange={e => updateRow(i, 'outputFormat', e.target.value)} required />
                            <button className="prob-trash" type="button" onClick={() => removeRow(i)}>🗑</button>
                        
</div>
                        {/* toggle + panel */}
                        <button type="button" className="add-prob-btn"
                            onClick={() => togglePanel(i)}>Test Cases</button>

                        {openPanel === i && (
                            <div className="case-panel">
                                {p.testCases.map((tc, j) => (
                                    <div key={j} className="case-row">
                                        <textarea placeholder="stdin"
                                            value={tc.input}
                                            onChange={e => updateCase(i, j, 'input', e.target.value)} />
                                        <textarea placeholder="expected stdout"
                                            value={tc.expectedOutput}
                                            onChange={e => updateCase(i, j, 'expectedOutput', e.target.value)} />
                                        <label className="sample-check">
                                            <input type="checkbox"
                                                checked={tc.isSample}
                                                onChange={e => updateCase(i, j, 'isSample', e.target.checked)} />
                                            sample
                                        </label>
                                        <button type="button" onClick={() => removeCase(i, j)}>🗑</button>
                                    </div>
                                ))}
                                <button type="button" className="add-prob-btn" onClick={() => addCase(i)}>
                                    + Add case
                                </button>
                            </div>
                        )}
                    </>  
                ))}

                <button type="button" className="add-prob-btn" onClick={addRow}>+ Add Problem</button>

                <button className="btn-primary" type="submit">Create Contest</button>
            </form>
        </div>
    );
}
