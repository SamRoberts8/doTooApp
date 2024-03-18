/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

import { CirclePlus } from 'lucide-react';

interface AddTaskButtonProps {
  addTodo: (todo: string) => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ addTodo }) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const messageHandler = () => {
      setIsInputVisible(true);
    };

    ipcRenderer.on('global-shortcut', messageHandler);

    return () => {
      ipcRenderer.removeListener('global-shortcut', messageHandler);
    };
  }, []);

  const handleButtonClick = () => {
    setIsInputVisible(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = () => {
    if (inputValue.trim() !== '') {
      addTodo(inputValue);
      setInputValue('');
      setIsInputVisible(false);
    }
  };

  const handleInputCancel = () => {
    setInputValue('');
    setIsInputVisible(false);
  };

  if (isInputVisible) {
    return (
      <div className="mt-4  mx-7 pt-4 pb-6 flex flex-col gap-4 items-center rounded-md sticky bottom-0 right-0">
        <input
          className="rounded-md text-gray-900 w-full  border-gray-800 bg-opacity-30 p-3 outline-none"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleInputSubmit();
            }
          }}
          autoFocus
          placeholder="Task name"
        />
        <div className="flex w-full justify-between gap-2">
          <button
            className="w-full px-4 py-3 border border-gray-600 text-gray-900 rounded-md flex-grow"
            type="button"
            onClick={handleInputCancel}
          >
            Cancel
          </button>
          <button
            className="w-full px-4 py-3 bg-gray-900 text-white rounded-md flex-grow"
            type="button"
            onClick={handleInputSubmit}
          >
            Add
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 w-screen  z-0  border-t  border-gray-800 border-opacity-10 ">
      <div className="p-2">
        <div
          className=" mx-7 p-2 flex gap-4 items-center cursor-pointer rounded-md"
          onClick={handleButtonClick}
          role="button"
          tabIndex={0}
          aria-label="Add new todo"
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              handleButtonClick();
            }
          }}
        >
          <div>
            <CirclePlus color="#374151" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Add task</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskButton;
