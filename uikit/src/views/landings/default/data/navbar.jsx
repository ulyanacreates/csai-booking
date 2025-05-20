// @project
'use client';
import { landingMegamenu, pagesMegamenu } from '../../common-data';
import SvgIcon from '@/components/SvgIcon';
import { SECTION_PATH, ADMIN_PATH, PAGE_PATH, DOCS_URL, FREEBIES_URL, CUSTOMER_PATH, BUSINESS_PATH } from '@/path';

/***************************  DEFAULT - NAVBAR  ***************************/

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };
export const getNavbar = () => {
  let user = null;
  try{
    user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
  } catch(e){
    console.error('Invalid user data in localStorage:', e);
    user = null;
  }
  if (user){
    
  }
  return {
    customization: true,
    secondaryBtn: user
    ? {
        children: user.user_name, 
        href: '#',
        sx: {
          pointerEvents: 'none',
          color: 'text.primary',
          fontWeight: 500,
          textTransform: 'none',
        },
      }
    : null,

    primaryBtn: user
      ? { children: 'Logout', href: '#', onClick: () => { localStorage.removeItem('user'); location.reload(); } }
      : { children: 'Log in', href: PAGE_PATH.login },
    navItems: user 
      ? [ { id: 'home', title: 'Home', link: '/' },
          { id: 'components', title: 'Make a Reservation', link: CUSTOMER_PATH },
          { id: 'components', title: "Previous Reservations", link: SECTION_PATH},
        ]
      : [
          { id: 'home', title: 'Home', link: '/' },
          landingMegamenu,
          { id: 'components', title: 'User-Side Preview', link: SECTION_PATH },
          // { id: 'dashboard', title: 'Dashboard', link: ADMIN_PATH, ...linkProps },
          { id: 'components', title: 'Business View', link: BUSINESS_PATH },
          pagesMegamenu,
          { id: 'docs', title: 'Docs', link: DOCS_URL, ...linkProps, icon: 'tabler-pin-invoke' }
        ],
  };
};
