// src/app/components/Layout.tsx
"use client"; // Ensure Layout is a client component

import React, { ReactNode } from 'react';
import { UserProvider } from '../context/UserContext';
import ComponentHeader from './ComponentHeader'; // Assuming ComponentHeader should be used here
import { usePathname } from 'next/navigation';


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  const pathname = usePathname();
  console.log(pathname);

  return (
    <UserProvider>
      <ComponentHeader route={pathname} /> {/* Pass the route prop dynamically if needed */}
      <main>{children}</main>
    </UserProvider>
  );
};

export default Layout;
