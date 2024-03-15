import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu.tsx';
import DropDownIcon from '../../renderer/icons/DropDownIcon.tsx';

import { Plus, ChevronDown, ScrollText } from 'lucide-react';

interface ListDropDownProps {
  isHovered: boolean;
  setIsHovered: (isHovered: boolean) => void;
}

function ListDropDown(props: ListDropDownProps) {
  const { isHovered, setIsHovered } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="outline-none p-3 cursor-pointer "
        style={{ opacity: isHovered || isOpen ? 1 : 0 }}
      >
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background">
        <DropdownMenuLabel>Lists</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ScrollText className="mr-2 h-4 w-4" />
          doToo List
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus className="mr-2 h-4 w-4" /> Create new List
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ListDropDown;
