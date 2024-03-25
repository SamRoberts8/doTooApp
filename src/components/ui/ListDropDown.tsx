import React, { useEffect, useState } from 'react';
import { ChevronDown, Check, PlusCircle } from 'lucide-react';

import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './command';

import CardPopUp from './CardPopUp';

import { Popover, PopoverContent, PopoverTrigger } from './popover';

import { Todos } from '../types';

interface ListDropDownProps {
  isHovered: boolean;
  todoLists: Todos[];
  changeActiveList: (id: string) => void;
  addTodoListAndSetActive: (name: string) => void;
  currentListId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

// eslint-disable-next-line react/function-component-definition
const ListDropDown: React.FC<ListDropDownProps> = ({
  isHovered,
  todoLists,
  changeActiveList,
  addTodoListAndSetActive,
  currentListId,
  open,
  setOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [value, setValue] = useState('');
  const [inputValue, setInputValue] = useState(''); // Track input value
  const [showCard, setShowCard] = useState(false);

  const currentList = todoLists.find((list) => list.id === currentListId);
  const listName = currentList ? currentList.name : '';

  const createNewList = () => {
    addTodoListAndSetActive(inputValue);
    setOpen(false);
    setInputValue('');
    setValue('');
  };

  useEffect(() => {
    setValue(listName);
  }, [listName]);

  if (showCard) {
    return (
      <CardPopUp
        setShowCard={setShowCard}
        addTodoListAndSetActive={addTodoListAndSetActive}
      />
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          style={{ opacity: isHovered || isOpen ? 1 : 0 }}
        >
          <ChevronDown className=" shrink-0 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command className="  h-full">
          <CommandInput
            placeholder="Search Lists..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty>
            <button type="button" onClick={() => createNewList()}>
              Create New List
            </button>
          </CommandEmpty>
          <CommandGroup>
            <CommandList className="max-h-60  overflow-y-auto overflow-x-hidden">
              {todoLists.length > 0 ? (
                todoLists.map((list) => (
                  <CommandItem
                    key={list.id}
                    value={list.name}
                    onSelect={() => {
                      changeActiveList(list.id);
                      setOpen(false);
                      setInputValue('');
                      setValue('');
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === list.name ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    {list.name}
                  </CommandItem>
                ))
              ) : (
                <div>No lists found.</div>
              )}
            </CommandList>
            <CommandSeparator />
            <CommandItem
              onSelect={() => {
                setOpen(false);
                setShowCard(true);
              }}
              className="mt-1"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Create New List</span>
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ListDropDown;
