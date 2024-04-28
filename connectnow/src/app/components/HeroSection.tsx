import React from 'react';

type Props = {}

const HeroSection = (props: Props) => {
  return (
    <div className="bg-slate-900 text-white container w-full flex px-5 py-24 items-center justify-center flex-col">
       <div className="text-center lg:w-5/12 w-full">
         <h1 className="my-4 text-5xl font-bold leading-tight">
           Turn your ideas into reality
         </h1>
         <p className="text-2xl mb-8">
           Find your next creative soulmate right here!
         </p>
         <div className="flex justify-center mx-auto">
           <button
             className="hover:underline bg-white text-gray-800 font-bold rounded-full  py-4 px-8">
             View Projects
           </button>
           <button
             className="ml-4 hover:underline bg-white text-gray-800 font-bold rounded-full  py-4 px-8">
             Get Started
           </button>
         </div>
       </div>
     </div>
  )
}

export default HeroSection;