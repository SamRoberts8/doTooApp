import React from 'react';

function PlusIcon() {
  return (
    <div className="relative w-5 h-5">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-0.5 h-3.5 bg-gray-500" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3.5 h-0.5 bg-gray-500" />
      </div>
    </div>
  );
}

export default PlusIcon;
