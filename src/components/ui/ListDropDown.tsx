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

interface ListDropDownProps {
  isHovered: boolean;
  setIsHovered: (isHovered: boolean) => void;
  cleanTodoListNames: string[];
  setListName: (listName: string) => void;
  listName: string;
}

// eslint-disable-next-line react/function-component-definition
const ListDropDown: React.FC<ListDropDownProps> = ({
  isHovered,
  cleanTodoListNames,
  setListName,
  listName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [inputValue, setInputValue] = useState(''); // Track input value

  const createNewList = () => {
    setListName(inputValue);
  };

  useEffect(() => {
    setValue(listName);
  }, [listName]);

  const filteredLists = cleanTodoListNames.filter((list) =>
    list.toLowerCase().includes(inputValue.toLowerCase()),
  );

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
              {filteredLists.length > 0 ? (
                filteredLists.map((list) => (
                  <CommandItem
                    key={list}
                    value={list}
                    onSelect={(currentValue) => {
                      setListName(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === list ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    {list}
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
