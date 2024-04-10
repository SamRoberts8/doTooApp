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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuItem,
} from './dropdown-menu';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from './alert-dialog';

import CreateCardPopUp from './CreateCardPopUp';

import { Popover, PopoverContent, PopoverTrigger } from './popover';

import { Todos } from '../types';

import RenameCardPopUp from './RenameCardPopUp';
import DeleteCardPopUp from './DeleteCardPopUp';

interface ListDropDownProps {
  isHovered: boolean;
  todoLists: Todos[];
  changeActiveList: (id: string) => void;
  addTodoListAndSetActive: (name: string) => void;
  currentListId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  renameTodoList: (listId: string, name: string) => void;
  deleteTodoList: (listId: string) => void;
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
  renameTodoList,
  deleteTodoList,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [value, setValue] = useState('');
  const [inputValue, setInputValue] = useState(''); // Track input value
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showRenameCard, setShowRenameCard] = useState(false);
  const [renameList, setRenameList] = useState('');
  const [renameListId, setRenameListId] = useState('');
  const [showDeleteCard, setShowDeleteCard] = useState(false);
  const [deleteList, setDeleteList] = useState('');
  const [deleteListId, setDeleteListId] = useState('');

  const currentList = todoLists.find((list) => list.id === currentListId);
  const listName = currentList ? currentList.name : '';

  useEffect(() => {
    setValue(listName);
  }, [listName]);

  if (showCreateCard) {
    return (
      <CreateCardPopUp
        setShowCard={setShowCreateCard}
        addTodoListAndSetActive={addTodoListAndSetActive}
      />
    );
  }

  if (showRenameCard) {
    return (
      <RenameCardPopUp
        setShowCard={setShowRenameCard}
        listName={renameList}
        listId={renameListId}
        renameTodoList={renameTodoList}
      />
    );
  }

  if (showDeleteCard) {
    return (
      <DeleteCardPopUp
        setShowCard={setShowDeleteCard}
        listName={deleteList}
        listId={deleteListId}
        deleteTodoList={deleteTodoList}
      />
    );
  }

  const isDarkModeEnabled = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="outline-none">
        <Button
          // variant="destructive"
          className="bg-gray-100 dark:bg-neutral-700"
          role="combobox"
          aria-expanded={open}
          style={{ opacity: isHovered || open ? 1 : 0 }}
        >
          <ChevronDown
            color={isDarkModeEnabled ? 'white' : 'black'}
            className=" shrink-0 "
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuLabel>My Lists</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {todoLists.map((list) => (
          <div key={list.id}>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger
                key={list.id}
                className="flex items-center m-2"
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    value === list.name ? 'opacity-100' : 'opacity-0'
                  } `}
                />
                <span
                  onSelect={() => {
                    changeActiveList(list.id);
                    setOpen(false);
                    setInputValue('');
                    setValue('');
                  }}
                >
                  {list.name}
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  className="m-2 text-sm outline-none select-none"
                  onSelect={() => {
                    changeActiveList(list.id);
                    setOpen(false);
                    setInputValue('');
                    setValue('');
                  }}
                >
                  <span>Use List</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setShowRenameCard(true);
                    setRenameList(list.name);
                    setRenameListId(list.id);
                  }}
                  className="m-2 text-sm outline-none select-none"
                >
                  <span>Rename List</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="m-2 text-sm text-red-500 outline-none select-none"
                  onSelect={() => {
                    setShowDeleteCard(true);
                    setDeleteList(list.name);
                    setDeleteListId(list.id);
                    setOpen(false);
                  }}
                >
                  <span>Delete List</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </div>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            setOpen(false);
            setShowCreateCard(true);
          }}
          className="flex items-center m-2 outline-none select-none cursor-pointer"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          <span>Create New List</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListDropDown;
