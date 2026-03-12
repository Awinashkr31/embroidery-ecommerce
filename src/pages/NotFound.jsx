import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." />
      <div className="text-center max-w-md">
        {/* Large 404 */}
        <h1 className="text-8xl md:text-9xl font-heading font-bold text-stone-200 select-none leading-none">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-heading text-stone-800 mt-4 mb-3">
          Page Not Found
        </h2>
        <p className="text-stone-500 text-sm md:text-base mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-900 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-rose-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-100 text-stone-700 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-stone-200 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
