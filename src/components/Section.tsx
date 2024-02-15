import * as React from 'react';

import { cn } from '@/utils/ui';

export function Section({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'section'>) {
  return (
    <section
      className={cn('px-6 py-12 sm:py-20 lg:px-8', className)}
      {...props}
    >
      {children}
    </section>
  );
}

export function SectionContent({
  children,
  className,
}: React.ComponentPropsWithoutRef<'div'>): React.ReactNode {
  return (
    <div className={cn('mx-auto max-w-7xl space-y-6', className)}>
      {children}
    </div>
  );
}

export function SectionHeader({
  className,
  children,
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('sm:mx-auto sm:max-w-xl lg:max-w-3xl', className)}>
      {children}
    </div>
  );
}

export function SectionTagline({ children }: React.PropsWithChildren) {
  return (
    <h3 className="text-base font-semibold uppercase tracking-wide text-primary">
      {children}
    </h3>
  );
}

export function SectionTitle({ children }: React.PropsWithChildren) {
  return (
    <h2 className="text-wrap text-3xl font-extrabold tracking-tight sm:text-4xl">
      {children}
    </h2>
  );
}

export function SectionDescription({ children }: React.PropsWithChildren) {
  return (
    <p className="mt-2 text-pretty text-xl text-muted-foreground">{children}</p>
  );
}
