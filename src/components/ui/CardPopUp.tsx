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

interface CardPopUpProps {
  setShowCard: (value: boolean) => void;
  addTodoListAndSetActive: (name: string) => void;
}

function CardPopUp({ setShowCard, addTodoListAndSetActive }: CardPopUpProps) {
  const [inputValue, setInputValue] = useState('');

  const onAddList = () => {
    if (inputValue.trim() !== '') {
      // Check if the input is not just whitespace
      addTodoListAndSetActive(inputValue);
      setShowCard(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAddList();
    }
  };

  return (
    // Overlay that fills the entire screen and centers content
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[350px] bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Create List</CardTitle>
          <CardDescription>
            Create a new list to help make your life easier
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
          <Button onClick={onAddList}>Add List</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CardPopUp;
