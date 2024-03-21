import React from 'react';

interface NavBarProps {
  title: string;
}

function NavBar({ title }: NavBarProps) {
  return (
    <nav
      className="w-full h-12 draggable"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {title !== '' ? (
        <p className="mt-4 ml-8 font-bold text-lg">{title}</p>
      ) : null}
    </nav>
  );
}

export default NavBar;
