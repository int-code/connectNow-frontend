"use client";

import AppFooter from "../components/AppFooter";
import ComponentHeader from "../components/ComponentHeader";
import PageLoader from "../components/PageLoader";

export default function User() {
  return(
    <div>
      <ComponentHeader isLoggedIn={true} route={"/user"} />
      <div className="pt-16">
        
      </div>
      <AppFooter />
    </div>
  )
}