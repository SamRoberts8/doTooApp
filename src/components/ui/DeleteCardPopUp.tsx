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

interface DeleteCardPopUpProps {
  setShowCard: (value: boolean) => void;
  listName: string;
  listId: string;
  deleteTodoList: (listId: string) => void;
}

function DeleteCardPopUp({
  setShowCard,
  deleteTodoList,
  listName,
  listId,
}: DeleteCardPopUpProps) {
  const onDeleteList = () => {
    setShowCard(false);
    deleteTodoList(listId);
  };

  return (
    // Overlay that fills the entire screen and centers content
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[350px] bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Delete {listName}</CardTitle>
          <CardDescription className="pt-2">
            <p>Delete this list and all its tasks permanently. </p>
            <p className="pt-1 font-bold">
              Warning, this action cannot be undone.
            </p>
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex justify-between">
          <Button onClick={() => setShowCard(false)} variant="outline">
            Cancel
          </Button>
          <Button className="bg-red-500 " onClick={onDeleteList}>
            Delete List
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default DeleteCardPopUp;
