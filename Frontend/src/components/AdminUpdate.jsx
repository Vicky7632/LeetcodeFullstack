import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';

const AdminUpdate = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProblem, setEditingProblem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: '',
    tags: '',
    referenceSolution: [{ language: '', completeCode: '' }],
    visibleTestCases: [{ input: '', output: '', explanation: '' }],
    hiddenTestCases: [{ input: '', output: '' }],
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (problem) => {
    setEditingProblem(problem);
    setFormData({
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      tags: problem.tags,
      referenceSolution: problem.referenceSolution || [{ language: '', completeCode: '' }],
      visibleTestCases: problem.visibleTestCases || [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: problem.hiddenTestCases || [{ input: '', output: '' }],
    });
  };

  const handleChange = (e, index, field, type) => {
    if (!type) {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    } else if (type === 'reference') {
      const updated = [...formData.referenceSolution];
      updated[index][field] = e.target.value;
      setFormData(prev => ({ ...prev, referenceSolution: updated }));
    } else if (type === 'visible') {
      const updated = [...formData.visibleTestCases];
      updated[index][field] = e.target.value;
      setFormData(prev => ({ ...prev, visibleTestCases: updated }));
    } else if (type === 'hidden') {
      const updated = [...formData.hiddenTestCases];
      updated[index][field] = e.target.value;
      setFormData(prev => ({ ...prev, hiddenTestCases: updated }));
    }
  };

  const addField = (type) => {
    if (type === 'reference') setFormData(prev => ({ ...prev, referenceSolution: [...prev.referenceSolution, { language: '', completeCode: '' }] }));
    if (type === 'visible') setFormData(prev => ({ ...prev, visibleTestCases: [...prev.visibleTestCases, { input: '', output: '', explanation: '' }] }));
    if (type === 'hidden') setFormData(prev => ({ ...prev, hiddenTestCases: [...prev.hiddenTestCases, { input: '', output: '' }] }));
  };

  const handleSave = async () => {
    if (!editingProblem) return;
    try {
      const { data } = await axiosClient.put(`/problem/update/${editingProblem._id}`, formData);
      setProblems(problems.map(p => p._id === data._id ? data : p));
      setEditingProblem(null);
    } catch (err) {
      setError('Failed to update problem');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditingProblem(null);
  };

  if (loading) return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error) return <div className="alert alert-error shadow-lg my-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Update Problems</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr key={problem._id}>
                <th>{index + 1}</th>
                <td>{problem.title}</td>
                <td>
                  <span className={`badge ${
                    problem.difficulty === 'easy' ? 'badge-success' :
                    problem.difficulty === 'medium' ? 'badge-warning' : 'badge-error'
                  }`}>{problem.difficulty}</span>
                </td>
                <td><span className="badge badge-outline">{problem.tags}</span></td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={() => handleEditClick(problem)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProblem && (
        <div className="mt-6 p-4 border rounded-lg shadow-lg bg-base-200">
          <h2 className="text-2xl font-semibold mb-4">Editing: {editingProblem.title}</h2>
          <div className="flex flex-col space-y-3">
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="input input-bordered w-full" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="textarea textarea-bordered w-full" />
            <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="select select-bordered w-full">
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags" className="input input-bordered w-full" />

            {/* Reference Solution */}
            <h3 className="font-semibold mt-4">Reference Solution</h3>
            {formData.referenceSolution.map((sol, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <select value={sol.language} onChange={(e) => handleChange(e, i, 'language', 'reference')} className="select select-bordered w-full">
                  <option value="">Select Language</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
                <textarea value={sol.completeCode} onChange={(e) => handleChange(e, i, 'completeCode', 'reference')} placeholder="Code" className="textarea textarea-bordered w-full" />
              </div>
            ))}
            <button className="btn btn-sm btn-outline mt-2" onClick={() => addField('reference')}>Add Solution</button>

            {/* Visible Test Cases */}
            <h3 className="font-semibold mt-4">Visible Test Cases</h3>
            {formData.visibleTestCases.map((tc, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <input value={tc.input} onChange={(e) => handleChange(e, i, 'input', 'visible')} placeholder="Input" className="input input-bordered w-full" />
                <input value={tc.output} onChange={(e) => handleChange(e, i, 'output', 'visible')} placeholder="Output" className="input input-bordered w-full" />
                <input value={tc.explanation} onChange={(e) => handleChange(e, i, 'explanation', 'visible')} placeholder="Explanation" className="input input-bordered w-full" />
              </div>
            ))}
            <button className="btn btn-sm btn-outline mt-2" onClick={() => addField('visible')}>Add Visible Test Case</button>

            {/* Hidden Test Cases */}
            <h3 className="font-semibold mt-4">Hidden Test Cases</h3>
            {formData.hiddenTestCases.map((tc, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <input value={tc.input} onChange={(e) => handleChange(e, i, 'input', 'hidden')} placeholder="Input" className="input input-bordered w-full" />
                <input value={tc.output} onChange={(e) => handleChange(e, i, 'output', 'hidden')} placeholder="Output" className="input input-bordered w-full" />
              </div>
            ))}
            <button className="btn btn-sm btn-outline mt-2" onClick={() => addField('hidden')}>Add Hidden Test Case</button>

            <div className="flex space-x-2 mt-4">
              <button className="btn btn-success" onClick={handleSave}>Save</button>
              <button className="btn btn-warning" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpdate;
