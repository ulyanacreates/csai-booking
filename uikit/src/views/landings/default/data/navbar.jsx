// @project
'use client';
import { landingMegamenu, pagesMegamenu } from '../../common-data';
import SvgIcon from '@/components/SvgIcon';
import { SECTION_PATH, ADMIN_PATH, PAGE_PATH, DOCS_URL, FREEBIES_URL, CUSTOMER_PATH, BUSINESS_PATH, RESERVATION_PATH } from '@/path';

/***************************  DEFAULT - NAVBAR  ***************************/

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };
export const getNavbar = () => {
  let user = null;
  try{
    user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
    console.log('User data from localStorage:', user);
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
      ? { children: 'Logout', href: PAGE_PATH.login, onClick: () => { localStorage.removeItem('user'); router.push("/")} }
      : { children: 'Log in', href: PAGE_PATH.login },
    navItems: user.user_type === 'customer'
      ? [ { id: 'home', title: 'Home', link: '/' },
          { id: 'components', title: 'Make a Reservation', link: CUSTOMER_PATH },
          { id: 'components', title: "Previous Reservations", link: RESERVATION_PATH},
        ]
      : [
          { id: 'home', title: 'Home', link: '/' },
          // landingMegamenu,
          // { id: 'components', title: 'User-Side Preview', link: CUSTOMER_PATH },
          // // { id: 'dashboard', title: 'Dashboard', link: ADMIN_PATH, ...linkProps },
          { id: 'components', title: 'Business View', link: BUSINESS_PATH },
          // pagesMegamenu,
          // { id: 'docs', title: 'Docs', link: DOCS_URL, ...linkProps, icon: 'tabler-pin-invoke' }
        ],
  };
};
