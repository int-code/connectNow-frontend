import React from 'react'

type Props = {}

const AppHeader = (props: Props) => {
  return (
    <div>
      <header className="fixed md:hidden top-0 left-0 w-full z-50 bg-slate-900 py-4 px-10" id="second-header">
        <div className="flex items-center justify-between">
          <div>
            <img src="logo.png" className="h-20" alt="Logo"></img>
          </div>
          <div>
            <div className="text-3xl text-white font-bold">ConnectNow</div>
          </div>
        </div>
      </header>
      <main className="flex flex-col items-center justify-between pt-4 bg-slate-900" id="app-header">
        <div className="flex items-center w-full">
          <div className="m-6">
            <img src="logo.png" className="h-28" alt="Logo"></img>
          </div>
          <div className="flex flex-col justify-end">
            <div className="text-7xl text-white font-bold mb-4 inknut-antiqua-bold">ConnectNow</div>
          </div>
          <div className="flex-grow"></div>
          <div className="w-80"><img src="headerImage.png" alt="Header Image"></img></div>
        </div>
      </main>
    </div>
  )
}

export default AppHeader;