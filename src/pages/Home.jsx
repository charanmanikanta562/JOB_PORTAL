import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="container mx-auto py-16 px-4">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-gray-50">
            Find your next role or hire talent faster.
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Simple job portal with authentication, real-time job postings, and easy applications.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link 
              to="/jobs" 
              className="inline-block text-center bg-action-green text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-colors"
            >
              Browse Jobs
            </Link>
            <Link 
              to="/post-job" 
              className="inline-block text-center bg-primary-blue text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
            >
              Post a Job
            </Link>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <ul className="list-disc pl-6 text-gray-800 dark:text-gray-200">
            <li className="mb-2">React + Tailwind UI</li>
            <li className="mb-2">Clerk authentication</li>
            <li>Supabase database & real-time</li>
          </ul>
        </div>
      </div>
    </section>
  );
}