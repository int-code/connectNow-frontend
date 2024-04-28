import React from 'react';
import { Carousel } from "flowbite-react";


type Props = {}

const MainPageCaraousal = (props: Props) => {
  return (
    <div className="h-56 sm:h-64 lg:h-96 bg-slate-900">
      <Carousel className=''>
        <img src="handshake.svg" alt="..." />
        <img src="puzzle.svg" alt="..." />
        <img src="teamwork.svg" alt="..." />
        <img src="lightbulb.svg" alt="..." />
      </Carousel>
    </div>
  );
};

export default MainPageCaraousal;