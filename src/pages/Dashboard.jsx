import Protected from '../components/Protected';
import RoleGate from '../components/RoleGate';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [myBookmarks, setMyBookmarks] = useState([]); // New state for bookmarks
  const [jobApplications, setJobApplications] = useState({});

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      const { error } = await supabase.from('jobs').delete().eq('id', jobId);
      if (error) {
        alert('Error deleting job: ' + error.message);
      } else {
        setMyJobs(myJobs.filter(j => j.id !== jobId));
      }
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      setProfile(prof || null);

      if (prof?.role === 'employer') {
        const { data: jobsData } = await supabase.from('jobs').select('*').eq('posted_by', user.id).order('created_at', { ascending: false });
        setMyJobs(jobsData || []);

        if (jobsData && jobsData.length > 0) {
          const jobIds = jobsData.map(job => job.id);
          const { data: appsData } = await supabase
            .from('applications')
            .select('id, created_at, cover_letter, job_id, profiles(full_name, email)')
            .in('job_id', jobIds)
            .order('created_at', { ascending: false });
          
          const appsByJob = (appsData || []).reduce((acc, app) => {
            const jobId = app.job_id;
            (acc[jobId] = acc[jobId] || []).push(app);
            return acc;
          }, {});
          setJobApplications(appsByJob);
        }
      } else if (prof?.role === 'candidate') {
        const { data: appsData } = await supabase
          .from('applications')
          .select('id, created_at, job:jobs(title, company, location)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setMyApps(appsData || []);

        // --- New code to fetch bookmarks for a candidate ---
        const { data: bookmarksData } = await supabase
          .from('bookmarks')
          .select('job:jobs(title, company, location, id)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setMyBookmarks(bookmarksData || []);
      }
    };
    load();
  }, [user]);

  return (
    <Protected>
      <RoleGate>
        <div className="container mx-auto py-10 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-gray-50">Dashboard</h2>
            {!profile && <p className="text-gray-600 dark:text-gray-400">Loading…</p>}
            {profile?.role === 'employer' && (
              <div>
                <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Your Posted Jobs</h3>
                <ul className="space-y-4">
                  {myJobs.map(j => (
                    <li key={j.id} className="border rounded-lg p-4 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-50">{j.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{j.company} • {j.location}</div>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <h4 className="font-semibold mt-2">Applicants: {jobApplications[j.id]?.length || 0}</h4>
                          <ul className="list-disc pl-5">
                            {(jobApplications[j.id] || []).map(app => (
                              <li key={app.id}>
                                {app.profiles?.full_name || app.profiles?.email} - {new Date(app.created_at).toLocaleDateString()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <button onClick={() => deleteJob(j.id)} className="text-red-500 hover:text-red-700 font-medium ml-4">Delete</button>
                    </li>
                  ))}
                  {myJobs.length === 0 && (
                    <div className="text-gray-500 dark:text-gray-400">
                      <p className="mb-4">No jobs yet. Post your first one!</p>
                      <Link to="/post-job" className="inline-block bg-primary-blue text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                        Post a New Job
                      </Link>
                    </div>
                  )}
                </ul>
              </div>
            )}
            {profile?.role === 'candidate' && (
              <div>
                <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Your Applications</h3>
                <ul className="space-y-4">
                  {myApps.map(a => (
                    <li key={a.id} className="border rounded-lg p-4 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="font-semibold text-gray-900 dark:text-gray-50">{a.job?.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{a.job?.company} • {a.job?.location}</div>
                    </li>
                  ))}
                  {myApps.length === 0 && (
                    <div className="text-gray-500 dark:text-gray-400">
                      <p className="mb-4">No applications yet. Start exploring jobs today!</p>
                      <Link to="/jobs" className="inline-block bg-action-green text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-colors">
                        Explore Jobs
                      </Link>
                    </div>
                  )}
                </ul>
                
                {/* New section to display saved jobs */}
                <h3 className="font-semibold text-lg mb-4 mt-8 text-gray-800 dark:text-gray-200">Your Saved Jobs</h3>
                <ul className="space-y-4">
                  {myBookmarks.map(b => (
                    <li key={b.job.id} className="border rounded-lg p-4 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="font-semibold text-gray-900 dark:text-gray-50">{b.job.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{b.job.company} • {b.job.location}</div>
                    </li>
                  ))}
                  {myBookmarks.length === 0 && (
                    <div className="text-gray-500 dark:text-gray-400">
                      <p className="mb-4">No jobs saved yet. Look for some and save them!</p>
                    </div>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </RoleGate>
    </Protected>
  );
}