import { Image } from '@unpic/react';

import { dal } from '@/utils/ui';

const Loading = () => (
  <div className="fixed inset-0 z-50 h-screen overflow-hidden bg-muted">
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex items-center justify-center">
        <span
          id="loading-text"
          className="sr-only"
          aria-live="polite"
          aria-busy="true"
        >
          The page is loading
        </span>
        <Image
          src={dal('images/loading.gif')}
          className="h-64 w-auto"
          aria-describedby="loading-text"
          width={500}
          height={500}
          alt=""
          priority
        />
      </div>
    </div>
  </div>
);

export default Loading;
