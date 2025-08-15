import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabaseClient';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useUser();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true); // Set loading to true at the start of the data fetch
      const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
      if (error) console.error(error);
      setJob(data);

      if (user) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
        setProfile(prof);

        const { data: appl } = await supabase
          .from('applications')
          .select('id')
          .eq('job_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        setApplied(!!appl);
      }
      setLoading(false); // Set loading to false only after all data is fetched
    };
    load();
  }, [id, user]);

  const apply = async () => {
    if (profile?.role !== 'candidate') {
      return alert('Only candidates can apply for jobs.');
    }
    if (!user) return alert('Please sign in');

    const { error } = await supabase
      .from('applications')
      .insert({ job_id: id, user_id: user.id, cover_letter: 'Interested!' });
    if (error) return alert(error.message);
    setApplied(true);
  };

  if (loading) {
    return <div className="container mx-auto py-10 px-4 text-gray-800 dark:text-gray-200">Loading…</div>;
  }
  if (!job) {
    return <div className="container mx-auto py-10 px-4 text-gray-800 dark:text-gray-200">Job not found.</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{job.title}</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          {job.company} • {job.location} • {job.type}
        </p>

        <p className="mt-6 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
          {job.description}
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 md:items-center">
          <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
            Salary: ₹{job.salary_min}-{job.salary_max} LPA
          </span>
          {profile?.role === 'candidate' && !applied ? (
            <button
              className="inline-block bg-action-green text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-colors"
              onClick={apply}
            >
              Apply Now
            </button>
          ) : (
            applied && <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg">You have applied! ✅</span>
          )}
        </div>
      </div>
    </div>
  );
}