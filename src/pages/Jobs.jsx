import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import JobCard from '../components/JobCard';
import { useUser } from '@clerk/clerk-react'; // Import useUser

export default function Jobs() {
  const { user } = useUser(); // Get the current user
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [bookmarks, setBookmarks] = useState([]); // New state for bookmarks

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, applications(count)')
        .order('created_at', { ascending: false });
      if (error) console.error(error);
      setJobs(data ? data.map(job => ({ ...job, applications: job.applications[0] })) : []);
    };
    fetchJobs();

    const fetchBookmarks = async () => {
      if (!user) {
        setBookmarks([]);
        return;
      }
      const { data } = await supabase
        .from('bookmarks')
        .select('job_id')
        .eq('user_id', user.id);
      setBookmarks(data ? data.map(b => b.job_id) : []);
    };
    fetchBookmarks();

    const channel = supabase
      .channel('jobs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => fetchJobs())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    const ll = location.toLowerCase();
    return jobs.filter(j =>
      (!q || j.title.toLowerCase().includes(ql) || j.company.toLowerCase().includes(ql)) &&
      (!location || j.location.toLowerCase().includes(ll))
    );
  }, [jobs, q, location]);

  const handleBookmarkToggle = async (jobId, isBookmarked) => {
    if (!user) return alert('Please sign in to save jobs.');

    if (isBookmarked) {
      const { error } = await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('job_id', jobId);
      if (error) return alert('Error removing bookmark: ' + error.message);
      setBookmarks(bookmarks.filter(id => id !== jobId));
    } else {
      const { error } = await supabase.from('bookmarks').insert({ user_id: user.id, job_id: jobId });
      if (error) return alert('Error adding bookmark: ' + error.message);
      setBookmarks([...bookmarks, jobId]);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 grid md:grid-cols-3 gap-4 items-center">
        <input 
          className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50 rounded-lg py-2 px-4 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-blue" 
          placeholder="Search title or company" 
          value={q} 
          onChange={e => setQ(e.target.value)} 
        />
        <input 
          className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50 rounded-lg py-2 px-4 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-blue" 
          placeholder="Filter by location" 
          value={location} 
          onChange={e => setLocation(e.target.value)} 
        />
        <div className="text-gray-600 dark:text-gray-400 font-medium">
          {filtered.length} {filtered.length === 1 ? 'job' : 'jobs'} found
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(job => (
          <JobCard 
            key={job.id} 
            job={job} 
            appCount={job.applications.count} 
            isBookmarked={bookmarks.includes(job.id)}
            onBookmarkToggle={handleBookmarkToggle}
          />
        ))}
        {filtered.length === 0 && <div className="text-gray-500 dark:text-gray-400 text-center">No jobs found that match your search.</div>}
      </div>
    </div>
  );
}