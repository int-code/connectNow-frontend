"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AppFooter from "../components/AppFooter";
import ComponentHeader from "../components/ComponentHeader";
import Loader from "../components/Loader";


export default function Dashboard() {
  const [accessTokenExists, setAccessTokenExists] = useState<boolean>(true);
  useEffect(()=>{
    const access_token = sessionStorage.getItem("access_token");
    console.log(access_token);
    if(access_token === null){
      setAccessTokenExists(false);
    }
  });

  useEffect(()=>{
    if(!accessTokenExists){
      window.location.href = "/";
    }
  }, [accessTokenExists]);
  

  return (
    <div>
      <ComponentHeader route="dashboard" isLoggedIn={true}/>
      <div className="pt-16">
        Welcome
      </div>

      <AppFooter />
    </div>
  );
}
