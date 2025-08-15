import { Link, NavLink } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';

export default function Navbar() {
  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-primary-blue text-white shadow-md'
        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;
    
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link to="/" className="text-xl font-bold text-gray-900 dark:text-gray-50">
          JobPortal
        </Link>
        <div className="flex items-center gap-2">
          <NavLink className={navLinkClass} to="/jobs">
            Jobs
          </NavLink>
          <SignedIn>
            <NavLink className={navLinkClass} to="/post-job">
              Post Job
            </NavLink>
            <NavLink className={navLinkClass} to="/dashboard">
              Dashboard
            </NavLink>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-primary-blue text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}