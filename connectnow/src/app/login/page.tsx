"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AppFooter from "../components/AppFooter";
import ComponentHeader from "../components/ComponentHeader";
import Loader from "../components/Loader";

interface formValues{
  username: string,
  password: string
}

interface FormErrors{
  username?: string,
  password?: string
}

export default function Login() {
  const [formValues, setFormValues] = useState<formValues>({
    username: '',
    password: ''
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const loader = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 animate-spin">
                    <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clip-rule="evenodd" />
                  </svg>`;


  const [formErrors, setFormErrors] = useState<FormErrors>({})                
  
  const validate = (values: formValues): FormErrors => {
    let errors: FormErrors = {};

    if (!values.username) {
      errors.username = 'Username is required';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
    }
  };

  useEffect(()=>{
    const access_token = sessionStorage.getItem("access_token");
    if(access_token){
      // alert("You are already logged in!");
      window.location.href="/dashboard";

    }
    const submitData = async ()=>{
      if(isSubmitting){
        var formStyleData = new FormData();
        formStyleData.append("username", formValues.username);
        formStyleData.append("password",formValues.password);
        try {
          const response = await fetch('http://127.0.0.1:8000/auth/token', {
            method: 'POST',
            body: formStyleData
          });

          const data = await response.json();
          console.log('Response:', data);
          if(response.status !== 200){
            let errors: FormErrors = {};
            if(data.detail == "UserNotExists"){
              errors.username = "User does not exist";
            }
            else if(data.detail == "PasswordIncorrect"){
              errors.password = "Password is Incorrect";
            }
            setFormErrors(errors);
          } else {
            console.log(data.access_token);
            sessionStorage.setItem("access_token", data.access_token);
            sessionStorage.setItem("refresh_token", data.refresh_token);
            window.location.href = "/dashboard";
          }
        } catch (error) {
          console.error('Error submitting form:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    submitData();
  });

  return (
    <div>
      <ComponentHeader route="signup" isLoggedIn={false} />
      <div className="flex flex-row bg-slate-900 text-white">
      <main className="flex w-1/2 min-h-screen flex-col items-center justify-center p-24 ">
        <div className="flex flex-row">  
          <div className="border bg-sky-50 bg-opacity-10 px-12 pt-4 pb-8 rounded">
            <form onSubmit={handleSubmit}>
              <div className="inknut-antiqua-bold text-7xl text-center text-sky-300">
                Login
              </div>
              <div className="flex flex-col mt-32 gap-2">
                <div>
                  <input type="text" placeholder="Enter username" className="bg-sky-100 text-black" name="username" onChange={handleChange}></input>
                  {formErrors.username && ( <div className="text-red-500 text-sm">{formErrors.username}</div>)}
                </div>

                <div>
                  <input type="text" placeholder="Enter password" className="bg-sky-100 text-black" name="password" onChange={handleChange}></input>
                  {formErrors.password && ( <div className="text-red-500 text-sm">{formErrors.password}</div>)}
                </div>
              </div>
              
              {/* <div className="mt-4 text-sm hover:text-sky-300 cursor-pointer">
                Forgot password?
              </div> */}
              <div className="text-sm">
                Already Have an account? <span className="hover:text-sky-300 cursor-pointer"><a href="/signup">Sign up</a></span>
              </div>
              <div className='flex w-full justify-center items-center mt-4'>
                <button
                  type='submit'
                  className='bg-sky-300 hover:shadow-lg text-white p-4 rounded'
                  disabled={isSubmitting}  // Disable button while submitting
                >
                  {isSubmitting ? <Loader htmlContent={loader} /> : 'Log in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <img src="pattern.svg" className="w-1/2 rounded"></img>
      </div>

      <AppFooter />
    </div>
  );
}
