// filepath: /home/ulyanacreates/dev/soa-cs/frontend/uikit/src/app/sections/business/page.jsx
import dynamic from 'next/dynamic';

// @project
import { PAGE_PATH } from '@/path'; // PAGE_PATH.business should now be /sections/business
import { SEO_CONTENT } from '@/metadata'; // Assuming you have SEO content defined

const BusinessView = dynamic(() => import('@/views/sections/Business'));

/***************************  METADATA - BUSINESS SECTION  ***************************/

// Adjust metadata as needed for this section page
export const metadata = { 
  title: 'Business Section | AI Customer Service',
  description: 'Business management and analytics section.',
  // Example using SEO_CONTENT if you have a 'businessSection' entry
  // ...SEO_CONTENT.businessSection, 
  // openGraph: { ...SEO_CONTENT.businessSection, url: PAGE_PATH.business }
};

/***************************  PAGE - BUSINESS SECTION  ***************************/

export default function BusinessSectionPage() {
  return <BusinessView />;
}