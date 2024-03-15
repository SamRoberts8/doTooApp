import React from 'react';

function NavBar() {
  return (
    <nav
      className="w-full h-12 draggable"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    />
  );
}

export default NavBar;
