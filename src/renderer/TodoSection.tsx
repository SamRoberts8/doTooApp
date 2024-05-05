/* eslint-disable react/function-component-definition */
// TodoSection.tsx
import React from 'react';
import ToDoList from './ToDoList';
import AddTaskButton from './AddTaskButton';
import { Todo } from './types'; // Assuming you have a types file for Todo, if not, define it here.

interface TodoSectionProps {
  todos: Todo[];
  addTodo: (todo: string, index: number) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, newTask: string) => void;
  deleteTodo: (id: string) => void;
  renameTodo: (id: string, newName: string) => void;
  sortIndividualTodo: (todoToSort: Todo) => void;
  showAddTaskButton: boolean;
  searchQuery: string;
  isSearching: boolean;
  addSubTaskToTodo: (title: string, todoId: string) => void;
  showAddSubtask: boolean;
  setShowAddSubtask: (show: boolean) => void;
  addingSubtaskParentId: string;
  setAddingSubtaskParentId: (id: string) => void;
}

const TodoSection: React.FC<TodoSectionProps> = ({
  todos,
  addTodo,
  toggleTodo,
  updateTodo,
  deleteTodo,
  renameTodo,
  sortIndividualTodo,
  showAddTaskButton,
  searchQuery,
  isSearching,
  addSubTaskToTodo,
  showAddSubtask,
  setShowAddSubtask,
  addingSubtaskParentId,
  setAddingSubtaskParentId,
}) => {
  console.log(showAddSubtask);
  return (
    <div className="  flex flex-col h-full justify-between overflow-auto ">
      <ToDoList
        todos={todos}
        updateTodo={updateTodo}
        deleteTodo={deleteTodo}
        toggleTodo={toggleTodo}
        renameTodo={renameTodo}
        sortIndividualTodo={sortIndividualTodo}
        searchQuery={searchQuery}
        isSearching={isSearching}
        setShowAddSubtask={setShowAddSubtask}
        addSubTaskToTodo={addSubTaskToTodo}
        setAddingSubtaskParentId={setAddingSubtaskParentId}
      />
      {(showAddTaskButton && (
        <AddTaskButton
          addTodo={addTodo}
          addSubTaskToTodo={addSubTaskToTodo}
          addingSubtaskParentId={addingSubtaskParentId}
          setAddingSubtaskParentId={setAddingSubtaskParentId}
        />
      )) ||
        (showAddSubtask && (
          <AddTaskButton
            addTodo={addTodo}
            addSubTaskToTodo={addSubTaskToTodo}
            addingSubtaskParentId={addingSubtaskParentId}
            setAddingSubtaskParentId={setAddingSubtaskParentId}
          />
        ))}
    </div>
  );
};

export default TodoSection;
