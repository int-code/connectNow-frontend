"use client";
import React from 'react';
import { Button, Navbar } from "flowbite-react";

type Props = {
  isLoggedIn: boolean,
  username?: string,
  route: string
}


const ComponentHeader: React.FC<Props> = (props: Props) => {

  return (
    <Navbar fluid rounded className='bg-slate-900 text-white fixed top-0 left-0 w-full z-50'>
      <Navbar.Brand href="https://flowbite-react.com">
        <img src="logo.png" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">ConnectNow</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {
          props.isLoggedIn? <Button href="/login">Log out</Button>:
          props.route == 'signup'? 
          <>
            <Button className='mr-4 border-white border'>Sign up</Button>
            <Button href="/login">Log in</Button>
          </>:
          props.route == 'login'?
          <>
            <Button href="/signup" >Sign up</Button>
            <Button className='mr-4 border-white border'>Log in</Button>
          </>:
          <>
          <Button href="/signup" >Sign up</Button>
          <Button href='/login'>Log in</Button>
        </>

        }
        
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        
        {
          props.route == ''?
          <Navbar.Link href="/" active>Home</Navbar.Link>:
          <Navbar.Link href="/">Home</Navbar.Link>
        }
        {
          props.route == 'about'?
          <Navbar.Link href="/about" active>About</Navbar.Link>:
          <Navbar.Link href="/about">About</Navbar.Link>
        }
        {
          props.route == 'project'?
          <Navbar.Link href="/project" active>Browse</Navbar.Link>:
          <Navbar.Link href="/project">Browse</Navbar.Link>
        }
        {
          props.route == 'contact'?
          <Navbar.Link href="/contact" active>Contact</Navbar.Link>:
          <Navbar.Link href="/contact">Contact</Navbar.Link>
        }
        
      </Navbar.Collapse>
    </Navbar>
  )
}

export default ComponentHeader;