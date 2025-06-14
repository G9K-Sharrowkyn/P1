import React from 'react';

const ArchivePage = ({ onBackToMenu }) => (
  <div className="flex flex-col items-center justify-center w-full p-4 text-white">
    <button className="mb-4 px-4 py-2 bg-gray-700 rounded" onClick={onBackToMenu}>
      ← Back
    </button>
    <div className="text-xl">Archived games will appear here.</div>
  </div>
);

export default ArchivePage;
