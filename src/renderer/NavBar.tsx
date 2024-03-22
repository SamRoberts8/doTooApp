import React from 'react';

interface NavBarProps {
  title: string;
  height: string;
  marginTop: string;
}

function NavBar({ title, height, marginTop }: NavBarProps) {
  return (
    <nav
      className={`w-full draggable ${height}`}
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {title !== '' ? (
        <p className={`${marginTop} ml-8 font-bold text-lg`}>{title}</p>
      ) : null}
    </nav>
  );
}

export default NavBar;
