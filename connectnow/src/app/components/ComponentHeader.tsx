// src/app/components/ComponentHeader.tsx
"use client";
import React from 'react';
import { Button, Navbar } from "flowbite-react";
import { useUser } from '../context/UserContext';

type Props = {
  route: string;
}

const ComponentHeader: React.FC<Props> = ({ route }) => {
  const { user } = useUser();
  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <Navbar fluid rounded className='bg-slate-800 text-white w-full z-50 rounded-none py-4'>
      <Navbar.Brand href="/" className="flex items-center">
        <img src="/logo.png" className="mr-3 h-8 sm:h-12" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-2xl font-semibold text-white">ConnectNow</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {user ? (
          <div className='flex flex-row items-center gap-4'>
            <a href="/user">
              <img src={user.profile_pic} alt="Profile" className="h-10 w-10 rounded-full" />
            </a>
            <Button onClick={handleLogout} className="text-white font-medium text-lg px-6 py-2 ml-4">
              Log out
            </Button>
          </div>
        ) : (
          route === '/signup' ? (
            <>
              <Button className='mr-4 border-white border text-white font-medium text-lg px-6 py-2'>Sign up</Button>
              <Button href="/login" className="text-white font-medium text-lg px-6 py-2">Log in</Button>
            </>
          ) : route === '/login' ? (
            <>
              <Button href="/signup" className="text-white font-medium text-lg px-6 py-2">Sign up</Button>
              <Button className='ml-4 border-white border text-white font-medium text-lg px-6 py-2'>Log in</Button>
            </>
          ) : (
            <>
              <Button href="/signup" className="text-white font-medium text-lg px-6 py-2">Sign up</Button>
              <Button href='/login' className="ml-4 text-white font-medium text-lg px-6 py-2">Log in</Button>
            </>
          )
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {['', 'about', 'project', 'contact', 'dashboard'].map((item) => (
          <Navbar.Link
            key={item}
            href={item === '' ? '/' : `/${item}`}
            active={route === item}
            className={`text-lg font-medium ${route === '/'+item ? 'text-blue-500' : 'text-white'} hover:text-blue-400`}
          >
            {item === '' ? 'Home' : item === 'project' ? "Browse" : item.charAt(0).toUpperCase() + item.slice(1)}
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default ComponentHeader;
