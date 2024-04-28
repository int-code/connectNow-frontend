
export default function Login() {
  return (
    <div className="flex flex-row bg-slate-900 text-white">
    <main className="flex w-1/2 min-h-screen flex-col items-center justify-between p-24 ">
      <div className="flex flex-row">  
        <div className="border bg-sky-50 bg-opacity-10 px-12 pt-4 pb-8 rounded">
          <div className="inknut-antiqua-bold text-7xl text-center text-sky-300">
            Login
          </div>
          <div className="flex flex-col mt-32 gap-2">
            <div>
              <input type="text" placeholder="Enter email" className="bg-sky-100"></input>
            </div>
            <div>
              <input type="text" placeholder="Enter password" className="bg-sky-100"></input>
            </div>
          </div>
          <div className="mt-4 text-sm hover:text-sky-300 cursor-pointer">
            Forgot password?
          </div>
          <div className="text-sm">
            Already Have an account? <span className="hover:text-sky-300 cursor-pointer"><a href="/signup">Sign up</a></span>
          </div>
        </div>
      </div>
    </main>
    <img src="pattern.svg" className="w-1/2 rounded"></img>
    </div>
  );
}
