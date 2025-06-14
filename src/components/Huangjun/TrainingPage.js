import React, { useState } from 'react';
import HuangjunGame from './HuangjunGame';

const TrainingPage = ({ onBackToMenu, onShowArchive }) => {
  const [training, setTraining] = useState(false);

  return (
    <div className="flex flex-col items-center w-full p-4 text-white">
      <div className="mb-4 space-x-4">
        <button
          className="px-4 py-2 bg-gray-700 rounded"
          onClick={onBackToMenu}
        >
          ← Back
        </button>
        <button
          className="px-4 py-2 bg-blue-600 rounded"
          onClick={() => setTraining(true)}
        >
          Start Training
        </button>
        <button
          className="px-4 py-2 bg-green-600 rounded"
          onClick={onShowArchive}
        >
          Archived Games
        </button>
      </div>
      {training && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <HuangjunGame aiVsAi={true} showPanel={false} />
        </div>
      )}
    </div>
  );
};

export default TrainingPage;
