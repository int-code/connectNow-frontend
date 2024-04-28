import React from 'react'

type Props = {}

const Signup = (props: Props) => {
  return (
    <div className="flex flex-row bg-slate-900 text-white">
      <img src="pattern.svg" className="w-1/2 rounded"></img>
      <main className="flex w-1/2 min-h-screen flex-col items-center justify-between p-24 ">
        <div className="flex flex-row">  
          <div className="border bg-sky-50 bg-opacity-10 px-12 pt-4 pb-8 rounded">
            <div className="inknut-antiqua-bold text-7xl text-center text-sky-300">
              Sign up
            </div>
            <div className="flex flex-col mt-28 gap-2">
              <div>
                <input type="text" placeholder="Enter email" className="bg-sky-100"></input>
              </div>
              <div>
                <input type="text" placeholder="Enter password" className="bg-sky-100"></input>
              </div>
              <div>
                <input type="text" placeholder="Re enter password" className="bg-sky-100"></input>
              </div>
            </div>
            <div className="text-sm mt-4">
              Already Have an account? <span className="hover:text-sky-300 cursor-pointer"><a href="/login">Log in</a></span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Signup