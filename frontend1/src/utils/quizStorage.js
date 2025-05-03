// src/utils/quizStorage.js

const QUIZ_KEY = 'studentHelp_quizProgress';

export const saveQuizProgress = (data) => {
  localStorage.setItem(QUIZ_KEY, JSON.stringify(data));
};

export const loadQuizProgress = () => {
  const saved = localStorage.getItem(QUIZ_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const clearQuizProgress = () => {
  localStorage.removeItem(QUIZ_KEY);
};
