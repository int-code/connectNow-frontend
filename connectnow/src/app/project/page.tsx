"use client";
import React, { useEffect, useState } from 'react';
import ComponentHeader from '../components/ComponentHeader';
import AppFooter from '../components/AppFooter';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import { Dropdown } from 'flowbite-react';


type Props = {}

const Project = (props: Props) => {
  const [isOpened, setIsOpened] = useState(false);

  function setOpened() {
    setIsOpened(wasOpened => !wasOpened);
  }

  useEffect(()=>{

  });

  return (
    <div className='bg-slate-900'>
      <div className='pt-20 mb-4 '>
        <div>
          <div className='flex flex-row items-center justify-center gap-2'>
          <Dropdown label="Dropdown button" dismissOnClick={false}>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
            <input type='text' placeholder='Search' className='w-1/2 m-4'/>
            <div onClick={setOpened}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" className="w-6 h-6 cursor-pointer">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-4 gap-4 my-4 mx-8'>
          <ProjectCard projectId={0} img={''} name={''} description={''} />
          <ProjectCard projectId={0} img={''} name={''} description={''} />
          <ProjectCard projectId={0} img={''} name={''} description={''} />
          <ProjectCard projectId={0} img={''} name={''} description={''} />


        </div>
      </div>
      <AppFooter />
      
      {isOpened && (
        <Modal onClose={setOpened}>
          <div className='flex flex-col'>
            <div className='flex flex-row justify-between'>
              <div className='inknut-antiqua-medium text-3xl' >Filters</div>
              <button onClick={setOpened}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600 hover:text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Project