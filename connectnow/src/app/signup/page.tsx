"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import AppFooter from "../components/AppFooter";
import ComponentHeader from "../components/ComponentHeader";
import Loader from '../components/Loader';

type Props = {};

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode?: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  verificationCode?: string;
}

const Signup: React.FC<Props> = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
  });

  const [signupText, setSignupText] = useState<string>("Sign up");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSignupComplete, setIsSignupComplete] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const validate = (values: FormValues): FormErrors => {
    let errors: FormErrors = {};

    if (!values.username) {
      errors.username = 'Username is required';
    }

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Passwords must match';
    }

    if (isVerifying && !values.verificationCode) {
      errors.verificationCode = 'Verification code is required';
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      if (!isSignupComplete) {
        setIsSubmitting(true);
      } else {
        setIsVerifying(true);
      }
    }
  };

  useEffect(() => {
    const access_token = sessionStorage.getItem("access_token");
    if (access_token) {
      alert("You are already logged in");
      window.location.href = "/dashboard";
    }
  }, []);

  useEffect(() => {
    const submitData = async () => {
      if (isSubmitting) {
        setSignupText(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 animate-spin">
          <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clip-rule="evenodd" />
        </svg>`);
        try {
          const response = await fetch('http://127.0.0.1:8000/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formValues.email,
              username: formValues.username,
              password: formValues.password
            }),
          });

          const data = await response.json();
          if (response.status !== 200) {
            let errors: FormErrors = {};
            if (data.detail === "UserAlreadyExists") {
              errors.email = "Email already Registered. Please Log in";
            } else if (data.detail === "UserNameTaken") {
              errors.username = "Username Taken. Please choose another";
            }
            setFormErrors(errors);
            alert("Sign up failed");
            setSignupText("Sign up");
          } else {
            setIsSignupComplete(true);
          }
        } catch (error) {
          console.error('Error submitting form:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    submitData();
  }, [isSubmitting, formValues]);

  useEffect(() => {
    const verifyCode = async () => {
      if (isVerifying) {
        try {
          const response = await fetch('http://127.0.0.1:8000/auth/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formValues.email,
              code: formValues.verificationCode,
              password: formValues.password,
              username: formValues.username
            }),
          });

          const data = await response.json();
          if (response.status !== 200) {
            let errors: FormErrors = {};
            errors.verificationCode = "Invalid verification code";
            setFormErrors(errors);
            alert("Verification failed");
          } else {
            window.location.href = "/login";
          }
        } catch (error) {
          console.error('Error verifying code:', error);
        } finally {
          setIsVerifying(false);
        }
      }
    };

    verifyCode();
  }, [isVerifying, formValues]);

  const handleCheck = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/checkUsername', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formValues.username
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        let errors: FormErrors = {};
        if (data.detail === "UsernameTaken") {
          errors.username = "Username taken, please choose another";
          setFormErrors(errors);
        }
      } else {
        let errors: FormErrors = {};
        errors.username = "Username available!";
        setFormErrors(errors);
      }
    } catch (error) {
      console.error('Error checking username:', error);
    }
  };

  return (
    <div>
      <div className="flex flex-row bg-slate-900 text-white">
        <img src="pattern.svg" className="w-1/2 rounded" alt="Pattern" />
        <main className="flex w-1/2 min-h-screen flex-col items-center justify-center p-6 mx-auto bg-slate-900 rounded-lg shadow-lg">
          <div className="w-full max-w-md">
            <div className="text-4xl text-center text-sky-300 font-bold mb-8">
              {isSignupComplete ? 'Verify Email' : 'Sign Up'}
            </div>
            {!isSignupComplete ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="w-full bg-sky-100 text-black p-3 rounded"
                    onChange={handleChange}
                    value={formValues.email}
                    name="email"
                  />
                  {formErrors.email && (
                    <div className="text-red-500 text-sm mt-1">{formErrors.email}</div>
                  )}
                </div>
                <div>
                  <div className='flex items-center'>
                    <input
                      type="text"
                      placeholder="Enter username"
                      className="bg-sky-100 text-black p-3 rounded w-4/5"
                      onChange={handleChange}
                      value={formValues.username}
                      name="username"
                    />
                    <button
                      className='bg-sky-300 rounded p-3 w-1/5 ml-2 text-white'
                      onClick={handleCheck}
                    >
                      Check
                    </button>
                  </div>
                  {formErrors.username && (
                    <div className="text-red-500 text-sm mt-1">{formErrors.username}</div>
                  )}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full bg-sky-100 text-black p-3 rounded"
                    onChange={handleChange}
                    value={formValues.password}
                    name="password"
                  />
                  {formErrors.password && (
                    <div className="text-red-500 text-sm mt-1">{formErrors.password}</div>
                  )}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    className="w-full bg-sky-100 text-black p-3 rounded"
                    onChange={handleChange}
                    value={formValues.confirmPassword}
                    name="confirmPassword"
                  />
                  {formErrors.confirmPassword && (
                    <div className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</div>
                  )}
                </div>
                <div className="flex w-full justify-center items-center mt-6">
                  <button
                    type='submit'
                    className='bg-sky-300 hover:shadow-lg text-white p-4 rounded'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader htmlContent={signupText} /> : 'Sign Up'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Enter verification code"
                    className="w-full bg-sky-100 text-black p-3 rounded"
                    onChange={handleChange}
                    value={formValues.verificationCode}
                    name="verificationCode"
                  />
                  {formErrors.verificationCode && (
                    <div className="text-red-500 text-sm mt-1">{formErrors.verificationCode}</div>
                  )}
                </div>
                <div className="flex w-full justify-center items-center mt-6">
                  <button
                    type='submit'
                    className='bg-sky-300 hover:shadow-lg text-white p-4 rounded'
                    disabled={isVerifying}
                  >
                    {isVerifying ? <Loader htmlContent={"Verifying..."} /> : 'Verify'}
                  </button>
                </div>
              </form>
            )}
            <div className="text-sm text-center mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-sky-300 hover:underline">
                Log in
              </a>
            </div>
          </div>
        </main>
      </div>
      <AppFooter />
    </div>
  );
};

export default Signup;
