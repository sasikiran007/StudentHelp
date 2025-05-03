const filteredIndexes = showOnlyUnanswered
? questions.map((_, idx) => idx).filter(idx => answers[idx] === undefined)
: questions.map((_, idx) => idx);

const currentFilteredIndex = filteredIndexes.indexOf(currentIndex);
const nextUnansweredIndex = filteredIndexes[currentFilteredIndex + 1];
const prevUnansweredIndex = filteredIndexes[currentFilteredIndex - 1];

const question = questions[currentIndex];
const hasImage = question.image_url && !question.question_text.includes('<img');
const selectedAnswer = answers[currentIndex];

<div className="min-h-screen bg-slate-50">
<main className="max-w-6xl mx-auto p-4">
  <div className="bg-white rounded-lg shadow">
    <div className="border-b border-gray-200 p-3">
      <div className="flex items-center justify-between">
        <span className="font-medium text-lg">Question {currentIndex + 1} of {questions.length}</span>
        <button
          onClick={() => setShowOnlyUnanswered(!showOnlyUnanswered)}
          className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
        >
          {showOnlyUnanswered ? 'Show All' : 'Show Only Unanswered'}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-8 h-8 rounded-full text-sm font-semibold border flex items-center justify-center
              ${idx === currentIndex ? 'bg-blue-600 text-white border-blue-600'
                : marked[idx] ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                : answers[idx] !== undefined ? 'bg-green-100 text-green-700 border-green-300'
                : 'bg-gray-100 text-gray-500 border-gray-300'}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>

    <div className={`flex flex-col ${hasImage ? 'md:flex-row' : ''}`}>
      {hasImage && (
        <div className="w-full md:w-1/2 p-4 md:border-r border-gray-200">
          <div className="flex justify-center">
            <img
              src={`http://10.201.217.99:3001${question.image_url}`}
              alt="Question"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      )}

      <div className={`w-full ${hasImage ? 'md:w-1/2' : ''} p-6`}>
        <MathJax>
          <div
            className="text-gray-800 mb-8 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: question.question_text }}
          />
        </MathJax>

        <div className="space-y-4">
          {question.options.map((opt, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrect = question.correct_flags[i];
            const isAnswered = selectedAnswer !== undefined;

            return (
              <div
                key={i}
                className={`flex items-center p-3 rounded-lg border cursor-pointer
                  ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                onClick={() => handleSelect(i)}
              >
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3
                  ${isSelected ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-400'}`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <MathJax>
                  <div dangerouslySetInnerHTML={{ __html: opt }} className="text-gray-700" />
                </MathJax>
              </div>
            );
          })}

          <button
            onClick={handleMarkToggle}
            className="mt-4 px-3 py-1 text-sm border rounded text-yellow-600 border-yellow-300 hover:bg-yellow-50"
          >
            {marked[currentIndex] ? 'Unmark Review' : 'Mark for Review'}
          </button>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-200 p-3 flex justify-between">
      <button
        onClick={handleBack}
        disabled={currentIndex === 0}
        className="border border-blue-500 text-blue-500 px-4 py-1 rounded text-sm disabled:opacity-50"
      >
        ← Back
      </button>
      <span className="text-sm text-gray-600 self-center">Select one answer choice.</span>
      <button
        onClick={handleNext}
        className="bg-blue-500 text-white px-4 py-1 rounded text-sm"
      >
        {currentIndex === questions.length - 1 ? 'Finish' : 'Next →'}
      </button>
    </div>
  </div>
</main>
</div>
