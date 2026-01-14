import { Suspense } from 'react';
import HomeClient from './HomeClient';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomeClient />
    </Suspense>
  );
}
