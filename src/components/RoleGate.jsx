import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabaseClient';

/**
 * Ensures the current user has a profile row with a role: 'employer' | 'candidate'.
 * If not, shows a simple selector once. Children render only after role is known.
 */
export default function RoleGate({ children, requiredRole }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      const uid = user.id;
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', uid)
        .maybeSingle();
      if (error && error.code !== 'PGRST116') console.error(error);
      if (!data) {
        setLoading(false);
        setRole(null);
      } else {
        setRole(data.role);
        setLoading(false);
      }
    };
    run();
  }, [user]);

  const saveRole = async (newRole) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, email: user.primaryEmailAddress.emailAddress, role: newRole });
    if (error) return alert(error.message);
    setRole(newRole);
  };

  if (loading) return <div className="container mx-auto py-10 px-4 text-gray-800 dark:text-gray-200">Loading…</div>;
  if (!role) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 text-center">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-50">Choose your role</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">Select how you want to use the portal.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-action-green text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-colors"
              onClick={() => saveRole('candidate')}
            >
              Candidate
            </button>
            <button
              className="bg-primary-blue text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
              onClick={() => saveRole('employer')}
            >
              Employer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- This is the corrected conditional logic ---
  // If a specific role is required, check for it.
  if (requiredRole && role === requiredRole) {
    return children;
  }
  // If no specific role is required, just check if the user has a role.
  if (!requiredRole && role) {
    return children;
  }
  
  // If the role does not match, show an error message
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 text-center">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-50">Access Denied</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">You do not have the required permissions to view this page.</p>
      </div>
    </div>
  );
}