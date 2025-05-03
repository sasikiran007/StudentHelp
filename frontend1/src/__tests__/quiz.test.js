    // src/__tests__/quiz.test.js
import { calculateScore } from '../pages/StudentQuizDynamic';

describe('calculateScore', () => {
  const questions = [
    {
      correct_flags: [false, true, false, false],
    },
    {
      correct_flags: [false, false, true, false],
    },
    {
      correct_flags: [true, false, false, false],
    },
  ];

  it('returns 0 for all incorrect answers', () => {
    const answers = { 0: 0, 1: 0, 2: 1 };
    expect(calculateScore(questions, answers)).toBe(0);
  });

  it('returns correct score for mixed answers', () => {
    const answers = { 0: 1, 1: 0, 2: 0 };
    expect(calculateScore(questions, answers)).toBe(2);
  });

  it('returns full score for all correct answers', () => {
    const answers = { 0: 1, 1: 2, 2: 0 };
    expect(calculateScore(questions, answers)).toBe(3);
  });
});
