import React from 'react';

interface CardInfo{
  project_name: string;
  description?: string;
  status: string;
  created_at: string;
  project_pic?: string;
}

const Card: React.FC<CardInfo> = (data) => {
  return (
    <div className='border-2 rounded p-4'>
      <div className='text-center font-bold'>
        {data.project_name}
      </div>
    </div>
  );
}
export default Card;