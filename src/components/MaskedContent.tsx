import React from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/ui';

const MaskedContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'rounded-md bg-muted-foreground text-muted flex justify-center items-center text-sm px-2 cursor-pointer',
            className,
          )}
          {...props}
        >
          Content masked
        </div>
      </PopoverTrigger>
      <PopoverContent className="text-sm">
        This content is masked because you do not have permission to view it.
      </PopoverContent>
    </Popover>
  );
};

export { MaskedContent };
