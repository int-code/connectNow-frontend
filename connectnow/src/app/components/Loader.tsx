// SignupLoader.tsx
import React from 'react';

interface SignupLoaderProps {
  htmlContent: string;
}

const Loader: React.FC<SignupLoaderProps> = ({ htmlContent }) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default Loader;