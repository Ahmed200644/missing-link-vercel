import { Suspense } from 'react';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { BrowseContent } from './BrowseContent';

// Shell page: wraps the client component that uses useSearchParams() in Suspense.
// Required by Next.js 14 App Router — useSearchParams() must be inside a Suspense boundary.
export default function BrowsePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <BrowseContent />
    </Suspense>
  );
}
