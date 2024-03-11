/* eslint-disable react/function-component-definition */
// SortSection.tsx
import React from 'react';
import { Todo } from './types'; // Reuse the Todo type

interface SortSectionProps {
  sortingTodo: Todo | undefined;
  todos: Todo[];
  comparingTodo: Todo | undefined;
  handleSortClick: (beforeOrAfter: string) => void;
  setMode: (mode: string) => void;
}

const SortSection: React.FC<SortSectionProps> = ({
  sortingTodo,
  todos,
  comparingTodo,
  handleSortClick,
}) => {
  if (!comparingTodo || !sortingTodo) {
    return <p>Nothing to compare</p>;
  }

  return (
    <div className="my-4  mx-8">
      <div>
        <p className="text-sm text-gray-400">Sorting</p>
        <p className="text-lg font-semibold text-gray-900">
          {sortingTodo.title}
        </p>
      </div>
      <div className="my-4 w-80 break-all">
        <p className="text-sm text-gray-400">Do after or before than...</p>
        <p className="text-lg font-semibold text-gray-900 ">
          {comparingTodo.title}
        </p>
      </div>
      <div className="flex w-full justify-between gap-2">
        <button
          className="w-full px-4 py-3 border border-gray-600 text-gray-900 rounded-md flex-grow"
          type="button"
          onClick={() => handleSortClick('after')}
        >
          After
        </button>
        <button
          className="w-full px-4 py-3 bg-gray-900 text-white rounded-md flex-grow"
          type="button"
          onClick={() => handleSortClick('before')}
        >
          Before
        </button>
      </div>
    </div>
  );
};

export default SortSection;
