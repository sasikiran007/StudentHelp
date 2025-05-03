// src/router.jsx
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import React from 'react';  

import Dashboard from './pages/Dashboard';
import Chapters from './pages/Chapters';
import Concepts from './pages/Concepts';
import Questions from './pages/Questions';
import Test from './pages/Test'
import StudentQuizStatic from './pages/StudentQuizStatic';
import StudentQuizDynamic from './pages/StudentQuizDynamic';


function AppRouter() {
  return (
    // <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chapters" element={<Chapters />} />
        <Route path="/concepts" element={<Concepts />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/test" element={<Test/>} />
        <Route path="/StudentQuizStatic" element={<StudentQuizStatic />} />
        <Route path="/StudentQuizDynamic" element={<StudentQuizDynamic />} />
      </Routes>
    // </BrowserRouter>
  );
}

export default AppRouter;
