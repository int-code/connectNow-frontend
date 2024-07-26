'use client';
import React from 'react';
import { Button, Navbar } from "flowbite-react";
import { useState, useEffect } from "react";

type Props = {}

const Navigation = (props: Props) => {
  const [showNavigation, setShowNavigation] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const appHeaderHeight = document.getElementById("app-header")?.clientHeight;
      if (appHeaderHeight && window.scrollY > appHeaderHeight) {
        setShowNavigation(true);
      } else {
        setShowNavigation(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  if (!showNavigation){
    return (
      <></>
    )
  }
  return (
    <Navbar fluid rounded className='bg-slate-900 text-white fixed top-0 left-0 w-full z-50'>
      <Navbar.Brand href="https://flowbite-react.com">
        <img src="logo.png" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">ConnectNow</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button className='mr-4'>Sign in</Button>
        <Button href="/login">Log in</Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="/about">About</Navbar.Link>
        <Navbar.Link href="/project">Browse</Navbar.Link>
        <Navbar.Link href="/contact">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation;