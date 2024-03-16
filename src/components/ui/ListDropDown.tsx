import React, { useEffect, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

import { Todos } from '../types';

interface ListDropDownProps {
  isHovered: boolean;
  todoLists: Todos[];
  changeActiveList: (id: string) => void;
  addTodoListAndSetActive: (name: string) => void;
  currentListId: string;
}

// eslint-disable-next-line react/function-component-definition
const ListDropDown: React.FC<ListDropDownProps> = ({
  isHovered,
  todoLists,
  changeActiveList,
  addTodoListAndSetActive,
  currentListId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [inputValue, setInputValue] = useState(''); // Track input value

  const currentList = todoLists.find((list) => list.id === currentListId);

  console.log('currentList', currentListId);
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
        <Command>
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
            <CommandList>
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
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ListDropDown;
