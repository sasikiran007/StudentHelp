import React from "react";
import { useNavigate } from "react-router-dom";

const LoginLaunchPage = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/background.jpg')", // Make sure you add a nice image in public/background.jpg
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="bg-white/80 backdrop-blur-md flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center h-20 px-8">
          <div className="flex items-center space-x-2">
            <span className="w-9 h-9 rounded-full bg-white border flex items-center justify-center">
              {/* Avatar Icon */}
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#F6F6F6"/><circle cx="12" cy="10" r="4.5" stroke="#222" strokeWidth="1.2"/><path d="M3.5 20c.99-3.47 4.02-6 8.5-6s7.51 2.53 8.5 6" stroke="#222" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </span>
            <span className="text-2xl font-semibold text-blue-500 tracking-tight animate-fade-in">
              evertutor
            </span>
          </div>
        </header>

        {/* Promo Section */}
        <div className="flex flex-col items-center mt-4 animate-fade-in-up">
          <div className="bg-blue-50 text-blue-700 px-6 py-4 rounded-xl font-medium text-lg leading-snug shadow-md">
            Explore AI features for <span className="font-bold">FAST</span> GRE Prep
          </div>
        </div>

        {/* Main Section */}
        <main className="flex flex-col items-center justify-center mt-14 mx-2 flex-1">
          <h1 className="text-4xl font-bold tracking-tight text-black text-center animate-fade-in-down">
            Sign up now for fast, effective GRE prep!
          </h1>
          <p className="mt-3 text-gray-600 text-lg text-center animate-fade-in-up">
            Unlock personalized, efficient prep tailored just for you!
          </p>

          {/* Auth Buttons */}
          <div className="mt-10 space-y-4 w-full max-w-sm flex flex-col items-center">
            <button
              onClick={handleContinue}
              className="flex items-center justify-center w-full h-14 px-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg transition-transform transform hover:scale-105 shadow-lg"
            >
              Continue with Google
            </button>
            <button
              onClick={handleContinue}
              className="flex items-center justify-center w-full h-14 rounded-xl bg-white text-gray-700 text-lg font-medium border border-gray-300 hover:bg-gray-50 transition-transform transform hover:scale-105 shadow-lg"
            >
              Continue with Email
            </button>
          </div>

          {/* Small Print */}
          <div className="mt-10 text-center text-gray-700 text-base animate-fade-in-up">
            Sign up to unlock EverTutor's <span className="text-blue-500 font-medium">AI-powered</span> features
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginLaunchPage;
