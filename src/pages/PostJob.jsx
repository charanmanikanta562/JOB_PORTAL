import Protected from '../components/Protected';
import RoleGate from '../components/RoleGate';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabaseClient';

export default function PostJob() {
  const { user } = useUser();
  const [form, setForm] = useState({ title: '', company: '', location: '', type: 'Full-time', salary_min: 5, salary_max: 10, description: '' });

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from('jobs').insert({
      title: form.title,
      company: form.company,
      location: form.location,
      type: form.type,
      salary_min: Number(form.salary_min),
      salary_max: Number(form.salary_max),
      description: form.description,
      posted_by: user.id
    });
    if (error) return alert(error.message);
    alert('Job posted!');
    setForm({ title: '', company: '', location: '', type: 'Full-time', salary_min: 5, salary_max: 10, description: '' });
  };

  const inputClass = "w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50 rounded-lg py-3 px-4 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-blue";

  return (
    <Protected>
      {/* This is the corrected line */}
      <RoleGate requiredRole="employer">
        <div className="container mx-auto py-10 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-gray-50">Post a Job</h2>
            <form onSubmit={submit} className="grid gap-6">
              <input className={inputClass} placeholder="Job title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <input className={inputClass} placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} required />
              <input className={inputClass} placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
              <select className={inputClass} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
              
              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Min Salary (LPA)
                  <input className="mt-1 input" type="number" min="1" step="1" placeholder="Min LPA" value={form.salary_min} onChange={e => setForm({ ...form, salary_min: e.target.value })} />
                </label>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Max Salary (LPA)
                  <input className="mt-1 input" type="number" min="1" step="1" placeholder="Max LPA" value={form.salary_max} onChange={e => setForm({ ...form, salary_max: e.target.value })} />
                </label>
              </div>
              
              <textarea className={`${inputClass} resize-none`} rows="6" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
              <button className="bg-primary-blue text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-colors w-fit" type="submit">
                Publish
              </button>
            </form>
          </div>
        </div>
      </RoleGate>
    </Protected>
  );
}