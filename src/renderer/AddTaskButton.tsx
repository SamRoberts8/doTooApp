/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '../components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuShortcut,
  DropdownMenuItem,
} from '../components/ui/dropdown-menu';

import { PlusIcon, CirclePlus, ChevronUp } from 'lucide-react';

interface AddTaskButtonProps {
  addTodo: (todo: string, index: number) => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ addTodo }) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const handleDarkModeChange = (event: MediaQueryListEvent) => {
      setIsDarkModeEnabled(event.matches);
    };

    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );

    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, []);

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

  const handleInputSubmit = (index: number) => {
    if (inputValue.trim() !== '') {
      addTodo(inputValue, index);
      setInputValue('');
      setIsInputVisible(false);
    }
  };

  const handleInputCancel = () => {
    setInputValue('');
    setIsInputVisible(false);
  };

  return (
    <AnimatePresence mode="wait">
      {isInputVisible && (
        <motion.div
          key="inputField" // Assign a unique key
          className="  mx-7  mb-4 flex flex-col gap-4 items-center rounded-md "
          initial={{ opacity: 0, y: 20 }} // Start from opacity 0 and 20px down
          animate={{ opacity: 1, y: 0 }} // Animate to full opacity and original position
        >
          <input
            className="rounded-md text-gray-900  w-full  border-gray-800 bg-opacity-30 p-3 outline-none dark:text-white "
            type="text"
            spellCheck="true"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.metaKey && !event.altKey) {
                handleInputSubmit(0);
              }

              if (event.key === 'Enter' && event.metaKey && !event.altKey) {
                handleInputSubmit(1);
              }

              if (event.key === 'Enter' && event.metaKey && event.altKey) {
                handleInputSubmit(4);
              }

              if (event.key === 'Escape') {
                handleInputCancel();
              }
            }}
            autoFocus
            placeholder="Task name"
          />
          <div className="flex w-full justify-between gap-2">
            <button
              className="w-full  border border-gray-600 text-gray-900 rounded-md flex-grow dark:text-gray-100 dark:border-gray-100"
              type="button"
              onClick={handleInputCancel}
            >
              Cancel
            </button>
            <div className="w-full flex-grow flex justify-center bg-gray-900 text-white rounded-md  dark:bg-gray-200 dark:text-gray-800">
              <button
                className="w-full px-4 py-3 "
                type="button"
                onClick={() => handleInputSubmit(0)}
              >
                Add
              </button>
              <Separator orientation="vertical" className="bg-gray-400" />

              <div className="bg-gray-900 dark:bg-gray-200 basis-1/3 rounded-md">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-2 shadow-none w-full h-full">
                      <ChevronUp
                        olor={isDarkModeEnabled ? '#F3F4F6' : '#374151'}
                        className="h-4 w-4 m-auto"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    alignOffset={-5}
                    className="w-[200px]"
                    forceMount
                  >
                    <DropdownMenuItem onClick={() => handleInputSubmit(0)}>
                      Do now (top)
                      <DropdownMenuShortcut>⏎</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleInputSubmit(1)}>
                      Do soon (second)
                      <DropdownMenuShortcut>⌘⏎</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleInputSubmit(4)}>
                      Do later (fifth)
                      <DropdownMenuShortcut>⌥⌘⏎</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </motion.div>
      )}{' '}
      {!isInputVisible && (
        <motion.div
          className=" w-screen  z-0  border-t  border-gray-800 border-opacity-10 flex-none dark:border-gray-500 "
          key="inputField2" // Assign a unique key
          initial={{ opacity: 0, y: 10 }} // Start from opacity 0 and 20px down
          animate={{ opacity: 1, y: 0 }} // Animate to full opacity and original position
        >
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
              <motion.div
                whileHover={{ scale: [null, 1.2, 1.1] }}
                transition={{ duration: 0.3 }}
              >
                <CirclePlus color={isDarkModeEnabled ? '#F3F4F6' : '#374151'} />
              </motion.div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-200">
                  Add task
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddTaskButton;
