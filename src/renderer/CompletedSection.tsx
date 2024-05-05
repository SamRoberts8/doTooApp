import React from 'react';
import { format, parseISO, compareDesc } from 'date-fns';
import { Todo } from './types';
import { Dot } from 'lucide-react';

interface CompletedSectionProps {
  completedTodos: Todo[];
}

const groupTodosByCompletedDate = (todos: Todo[]) => {
  const groupedTodos: { [key: string]: Todo[] } = {};

  todos.forEach((todo) => {
    if (!todo.completedAt) return;

    const completedAtDate = todo.completedAt
      ? parseISO(todo.completedAt.toString())
      : null;

    const dateKey = completedAtDate
      ? `${format(completedAtDate, 'MMM d')} · ${format(
          completedAtDate,
          'EEEE',
        )}`
      : 'No Date';

    if (!groupedTodos[dateKey]) {
      groupedTodos[dateKey] = [];
    }
    groupedTodos[dateKey].push(todo);
  });

  return groupedTodos;
};

function CompletedSection({ completedTodos }: CompletedSectionProps) {
  const safeCompletedTodos = completedTodos || [];
  const groupedTodos = groupTodosByCompletedDate(safeCompletedTodos);

  // Sort the grouped todos by date in descending order
  const sortedDates = Object.keys(groupedTodos).sort((a, b) => {
    if (a === 'No Date') return 1;
    if (b === 'No Date') return -1;
    // Use compareDesc for descending order
    return compareDesc(
      parseISO(groupedTodos[a][0].completedAt!),
      parseISO(groupedTodos[b][0].completedAt!),
    );
  });

  return (
    <div className="mx-7 mt-4 flex flex-col h-full justify-between overflow-auto">
      {sortedDates.map((date) => {
        const todos = groupedTodos[date];
        const todosLength = todos.length;

        return (
          <div key={date}>
            <div className="font-bold dark:text-gray-100">{date}</div>
            <div className="text-xs  text-gray-500 mt-1 dark:text-gray-100">
              {todosLength} completed
              <div className="mt-2 mb-4  border-b  border-gray-800 opacity-10 dark:border-gray-100" />
            </div>
            {todos.map((todo) => (
              <div key={todo.id} className="rounded-md p-2 overflow-hidden ">
                <div className="flex flex-col  justify-start dark:text-gray-100">
                  <div>{todo.title}</div>
                  {todo.completedSubTasks &&
                    todo.completedSubTasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center mt-2">
                        <Dot size={24} className="mr-2" />
                        <div>{subtask.title}</div>
                      </div>
                    ))}
                  {todo.subTasks &&
                    todo.subTasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center mt-2">
                        <Dot size={24} className="mr-2" />
                        <div>{subtask.title}</div>
                      </div>
                    ))}
                  <div className="text-xs  text-gray-500 mt-2 dark:text-gray-300">
                    {todo.completedAt
                      ? format(parseISO(todo.completedAt.toString()), 'p')
                      : ''}
                  </div>
                  <div className="mt-2 mb-2  border-b  border-gray-800 opacity-10 dark:border-gray-100" />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default CompletedSection;
