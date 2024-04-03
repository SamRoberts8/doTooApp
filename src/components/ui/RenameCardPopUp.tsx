import * as React from 'react';
import { useState } from 'react';

import { Button } from './button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
import { Input } from './input';
import { Label } from './label';

interface RenameCardPopUpProps {
  setShowCard: (value: boolean) => void;
  listName: string;
  listId: string;
  renameTodoList: (listId: string, name: string) => void;
}

function RenameCardPopUp({
  setShowCard,
  renameTodoList,
  listName,
  listId,
}: RenameCardPopUpProps) {
  const [inputValue, setInputValue] = useState(listName);

  const onRenameList = () => {
    if (inputValue.trim() !== '') {
      // Check if the input is not just whitespace
      setShowCard(false);
      renameTodoList(listId, inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onRenameList();
    }
  };

  return (
    // Overlay that fills the entire screen and centers content
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[350px] bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Rename {listName}</CardTitle>
          <CardDescription>
            Rename your list to help make your life easier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                id="name"
                placeholder="Name of your List"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => setShowCard(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={onRenameList}>Rename List</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default RenameCardPopUp;
