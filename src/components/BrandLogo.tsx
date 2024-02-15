import type { ImageProps } from '@unpic/react';
import { Image } from '@unpic/react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import React from 'react';

import { dal } from '@/utils/ui';

export default function BrandLogo(
  props: Required<Pick<ImageProps, 'height' | 'width' | 'className'>>,
) {
  const { resolvedTheme } = useTheme();

  return (
    <Image
      alt={useTranslations('Common')('brand_full')}
      src={dal(`images/logo-${resolvedTheme ?? 'light'}.png`)}
      {...props}
    />
  );
}
