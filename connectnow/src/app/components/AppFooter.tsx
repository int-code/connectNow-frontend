import React from 'react';
import { Footer, FooterCopyright, FooterLink, FooterLinkGroup } from "flowbite-react";

type Props = {}

const AppFooter = (props: Props) => {
  return (
    <Footer container className='bg-slate-900 text-white rounded-none'>
      <FooterCopyright href="#" by="ConnectNow™" year={2024} />
      <FooterLinkGroup>
        <FooterLink href="#">About</FooterLink>
        <FooterLink href="https://linkedin.com/in/pubali-basak">Creator Linkedin</FooterLink>
        <FooterLink href="https://github.com/int-code">Creator Github</FooterLink>
        <FooterLink href="#">Contact</FooterLink>
      </FooterLinkGroup>
    </Footer>
  )
}

export default AppFooter