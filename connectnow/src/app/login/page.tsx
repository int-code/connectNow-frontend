"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AppFooter from "../components/AppFooter";
import ComponentHeader from "../components/ComponentHeader";
import Loader from "../components/Loader";

interface formValues {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

export default function Login() {
  const [formValues, setFormValues] = useState<formValues>({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>('');
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isVerificationStep, setIsVerificationStep] = useState<boolean>(false);

  const loader = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 animate-spin">
                    <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clip-rule="evenodd" />
                  </svg>`;

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
    }
  };

  const handleForgotPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForgotPasswordEmail(e.target.value);
  };

  const handleForgotPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail) {
      setForgotPasswordError("Email is required");
      return;
    }

    try {
      const response = await fetch('https://connectnow-backend-fwe9.onrender.com//auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: forgotPasswordEmail })
      });

      const data = await response.json();
      if (response.status === 200) {
        setForgotPasswordSuccess("Password reset email sent successfully.");
        setIsVerificationStep(true); // Proceed to verification step
        setForgotPasswordError(null);
      } else {
        setForgotPasswordError(data.detail || "An error occurred");
        setForgotPasswordSuccess(null);
      }
    } catch (error) {
      console.error('Error submitting forgot password form:', error);
      setForgotPasswordError("An error occurred");
      setForgotPasswordSuccess(null);
    }
  };

  const handleVerificationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
  };

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleVerificationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || !newPassword) {
      setForgotPasswordError("Both verification code and new password are required");
      return;
    }

    try {
      const response = await fetch('https://connectnow-backend-fwe9.onrender.com//auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          user_email: forgotPasswordEmail, 
          code: verificationCode, 
          new_password: newPassword })
      });

      const data = await response.json();
      if (response.status === 200) {
        setForgotPasswordSuccess("Password reset successfully.");
        setForgotPasswordEmail('');
        setVerificationCode('');
        setNewPassword('');
        setIsVerificationStep(false); // Reset to login
        setIsForgotPassword(false);
        setForgotPasswordError(null);
      } else {
        setForgotPasswordError(data.detail || "An error occurred");
        setForgotPasswordSuccess(null);
      }
    } catch (error) {
      console.error('Error verifying reset code:', error);
      setForgotPasswordError("An error occurred");
      setForgotPasswordSuccess(null);
    }
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setIsVerificationStep(false); // Reset verification step on toggle
  };

  useEffect(() => {
    const access_token = sessionStorage.getItem("access_token");
    if (access_token) {
      window.location.href = "/dashboard";
    }
    const submitData = async () => {
      if (isSubmitting) {
        const formStyleData = new FormData();
        formStyleData.append("username", formValues.username);
        formStyleData.append("password", formValues.password);
        try {
          const response = await fetch('https://connectnow-backend-fwe9.onrender.com//auth/token', {
            method: 'POST',
            body: formStyleData
          });

          const data = await response.json();
          if (response.status !== 200) {
            let errors: FormErrors = {};
            if (data.detail === "UserNotExists") {
              errors.username = "User does not exist";
            } else if (data.detail === "PasswordIncorrect") {
              errors.password = "Password is Incorrect";
            }
            setFormErrors(errors);
          } else {
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
  }, [isSubmitting, formValues]);

  return (
    <div>
      <div className="flex flex-row bg-slate-900 text-white">
        <main className="flex w-full min-h-screen flex-col items-center justify-center p-6 mx-auto bg-slate-900 rounded-lg shadow-lg">
          <div className="w-1/2">
            {!isForgotPassword ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-4xl text-center text-sky-300 font-bold">
                  Login
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Enter username"
                      className="w-full bg-sky-100 text-black p-3 rounded"
                      name="username"
                      onChange={handleChange}
                    />
                    {formErrors.username && (
                      <div className="text-red-500 text-sm">{formErrors.username}</div>
                    )}
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Enter password"
                      className="w-full bg-sky-100 text-black p-3 rounded"
                      name="password"
                      onChange={handleChange}
                    />
                    {formErrors.password && (
                      <div className="text-red-500 text-sm">{formErrors.password}</div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-center mt-2">
                  <button
                    type="button"
                    className="text-sky-300 hover:underline"
                    onClick={toggleForgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="text-sm text-center">
                  Already Have an account?{' '}
                  <a href="/signup" className="text-sky-300 hover:underline">
                    Sign up
                  </a>
                </div>
                <div className="flex w-full justify-center items-center mt-4">
                  <button
                    type="submit"
                    className="bg-sky-300 hover:shadow-lg text-white p-4 rounded"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader htmlContent={loader} /> : 'Log in'}
                  </button>
                </div>
              </form>
            ) : isVerificationStep ? (
              <form onSubmit={handleVerificationSubmit} className="space-y-6">
                <div className="text-4xl text-center text-sky-300 font-bold">
                  Verify Code
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Enter verification code"
                      className="w-full bg-sky-100 text-black p-3 rounded"
                      value={verificationCode}
                      onChange={handleVerificationChange}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full bg-sky-100 text-black p-3 rounded"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                    />
                  </div>
                  {forgotPasswordError && (
                    <div className="text-red-500 text-sm">{forgotPasswordError}</div>
                  )}
                  {forgotPasswordSuccess && (
                    <div className="text-green-500 text-sm">{forgotPasswordSuccess}</div>
                  )}
                </div>
                <div className="flex w-full justify-center items-center mt-4">
                  <button
                    type="submit"
                    className="bg-sky-300 hover:shadow-lg text-white p-4 rounded"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader htmlContent={loader} /> : 'Reset Password'}
                  </button>
                </div>
                <div className="mt-4 text-sm text-center">
                  <button
                    type="button"
                    className="text-sky-300 hover:underline"
                    onClick={toggleForgotPassword}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                <div className="text-4xl text-center text-sky-300 font-bold">
                  Forgot Password
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full bg-sky-100 text-black p-3 rounded"
                      value={forgotPasswordEmail}
                      onChange={handleForgotPasswordChange}
                    />
                    {forgotPasswordError && (
                      <div className="text-red-500 text-sm">{forgotPasswordError}</div>
                    )}
                    {forgotPasswordSuccess && (
                      <div className="text-green-500 text-sm">{forgotPasswordSuccess}</div>
                    )}
                  </div>
                </div>
                <div className="flex w-full justify-center items-center mt-4">
                  <button
                    type="submit"
                    className="bg-sky-300 hover:shadow-lg text-white p-4 rounded"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader htmlContent={loader} /> : 'Send Reset Email'}
                  </button>
                </div>
                <div className="mt-4 text-sm text-center">
                  <button
                    type="button"
                    className="text-sky-300 hover:underline"
                    onClick={toggleForgotPassword}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
        <img src="pattern.svg" className="w-1/2 rounded-lg" />
      </div>
      <AppFooter />
    </div>
  );
}
