import React, { ReactNode, MouseEventHandler } from 'react'

type Props = {
  children: ReactNode,
  onClose: MouseEventHandler<HTMLButtonElement>
}

const Modal = (props: Props) => {
  
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
        {props.children}
      </div>
    </div>
  );
}

export default Modal