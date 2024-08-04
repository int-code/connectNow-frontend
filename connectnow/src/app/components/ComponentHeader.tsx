"use client";
import React from 'react';
import { Button, Navbar } from "flowbite-react";

type Props = {
  isLoggedIn: boolean,
  username?: string,
  route: string
}

const ComponentHeader: React.FC<Props> = (props: Props) => {

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    sessionStorage.clear();
    window.location.href="/";
  }
  return (
    <Navbar fluid rounded className='bg-slate-900 text-white fixed top-0 left-0 w-full z-50 rounded-none py-4'>
      <Navbar.Brand href="/" className="flex items-center">
        <img src="\logo.png" className="mr-3 h-8 sm:h-12" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-2xl font-semibold text-white">ConnectNow</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {
          props.isLoggedIn ? <Button onClick={handleLogout} className="text-white bg-blue-600 hover:bg-blue-700 font-medium text-lg px-6 py-2">Log out</Button> :
          props.route == 'signup' ? 
          <>
            <Button className='mr-4 border-white border text-white font-medium text-lg px-6 py-2'>Sign up</Button>
            <Button href="/login" className="text-white bg-blue-600 hover:bg-blue-700 font-medium text-lg px-6 py-2">Log in</Button>
          </> :
          props.route == 'login' ?
          <>
            <Button href="/signup" className="text-white bg-blue-600 hover:bg-blue-700 font-medium text-lg px-6 py-2">Sign up</Button>
            <Button className='ml-4 border-white border text-white font-medium text-lg px-6 py-2'>Log in</Button>
          </> :
          <>
            <Button href="/signup" className="text-white bg-blue-600 hover:bg-blue-700 font-medium text-lg px-6 py-2">Sign up</Button>
            <Button href='/login' className="ml-4 text-white bg-blue-600 hover:bg-blue-700 font-medium text-lg px-6 py-2">Log in</Button>
          </>
          
        }
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {['', 'about', 'project', 'contact', 'dashboard'].map((item) => (
          <Navbar.Link 
            key={item}
            href={item === '' ? '/' : `/${item}`}
            active={props.route === item}
            className={`text-lg font-medium ${props.route === item ? 'text-blue-500' : 'text-white'} hover:text-blue-400`}
          >
            {item === '' ? 'Home' : 
            item === 'project'? "Browse": item.charAt(0).toUpperCase() + item.slice(1)}
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default ComponentHeader;