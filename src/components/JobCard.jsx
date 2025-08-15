import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabaseClient';

// The component now accepts new props for bookmarking
export default function JobCard({ job, appCount, isBookmarked, onBookmarkToggle }) {
  const { user } = useUser();
  
  const handleBookmarkToggle = async () => {
    if (!user) return alert('Please sign in to save jobs.');
    onBookmarkToggle(job.id, isBookmarked);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">{job.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{job.company} • {job.location}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <span className="text-xs rounded-full px-3 py-1 font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {job.type}
            </span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {appCount} {appCount === 1 ? 'applicant' : 'applicants'}
            </span>
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-gray-700 dark:text-gray-300">{job.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          ₹{job.salary_min} - ₹{job.salary_max} LPA
        </span>
        <div className="flex items-center gap-2">
          {/* Bookmark button */}
          <button 
            onClick={handleBookmarkToggle} 
            className={`p-2 rounded-lg text-sm transition-colors ${isBookmarked ? 'bg-primary-blue text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          >
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
          {/* View button */}
          <Link
            to={`/jobs/${job.id}`}
            className="inline-block bg-primary-blue text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}