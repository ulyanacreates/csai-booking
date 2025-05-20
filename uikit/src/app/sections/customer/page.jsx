'use client';
import dynamic from 'next/dynamic';

// @project
import { PAGE_PATH } from '@/path';
import { SEO_CONTENT } from '@/metadata';
import SectionsLayout from '@/views/sections/layout'
import { getNavbar } from '@/views/landings/default/data';
const Customer = dynamic(() => import('@/views/sections/Customer'));

/***************************  METADATA - CLIENTELE  ***************************/

// export const metadata = { ...SEO_CONTENT.clientele, openGraph: { ...SEO_CONTENT.clientele, url: PAGE_PATH.clientele } };

/***************************  PAGE - CLIENTELE  ***************************/

export default function ClientelePage() {
    return (
      <Customer />
  );
}
