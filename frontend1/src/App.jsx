// import React from 'react';   // <-- VERY IMPORTANT!
// import AppRouter from './router'; // If you have router.jsx
// import './index.css'; // if you need base styles (optional)
// // import { Link } from 'react-router-dom';



// function App() {
//   return (
//     <div className="flex h-screen">
//       {/* Sidebar here (we'll add soon) */}
//       <div className="w-64 bg-white shadow-md p-4">
//         <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
//         <nav className="flex flex-col space-y-3">
//           <a href="/" className="hover:text-blue-500">Dashboard</a>
//           <a href="/chapters" className="hover:text-blue-500">Chapters</a>
//           <a href="/concepts" className="hover:text-blue-500">Concepts</a>
//           <a href="/questions" className="hover:text-blue-500">Questions</a>
//           <a href="/test" className="hover:text-blue-500">Test</a>
//           <a href="/StudentQuizStatic" className="hover:text-blue-500">StudentQuizStatic</a>
//           <a href="/StudentQuizDynamic" className="hover:text-blue-500">StudentQuizDynamic</a>
//         </nav>
//       </div>

//       {/* Main content area */}
//       <div className="flex-1 bg-gray-100 overflow-auto">
//         <AppRouter />
//       </div>
//     </div>
//   );
// }

                                                            

// App.jsx
import React from 'react';
import AppRoutes from './AppRoutes';

export default function App() {
  return <AppRoutes />;
}
