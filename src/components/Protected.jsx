import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';

export default function Protected({ children }) {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <div className="container mx-auto py-16 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 text-center">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-50">Sign in required</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">You must be signed in to view this page.</p>
            <SignInButton mode="modal">
              <button className="bg-primary-blue text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </>
  );
}