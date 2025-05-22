import dynamic from 'next/dynamic';

// @project
import { PAGE_PATH } from '@/path';
import { SEO_CONTENT } from '@/metadata';

const Reservation = dynamic(() => import('@/views/sections/Reservation'));

/***************************  METADATA - PROCESS  ***************************/

export const metadata = { ...SEO_CONTENT.process, openGraph: { ...SEO_CONTENT.process, url: PAGE_PATH.process } };

/***************************  PAGE - PROCESS  ***************************/

export default function ProcessPage() {
  return <Reservation />;
}
