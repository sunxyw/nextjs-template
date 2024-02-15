'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

import BrandLogo from '@/components/BrandLogo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Link } from '@/libs/i18nNavigation';
import { cn } from '@/utils/ui';

type SingleNavigationItem = {
  // single
  type?: 'card' | 'standard';
  title: string;
  href: string;
  className?: string;
  content?: string;
};

type DropdownNavigationItem = {
  title: string;
  className?: string;
  children: SingleNavigationItem[];
};

type NavigationItemDefinition = SingleNavigationItem | DropdownNavigationItem;

const navigations: NavigationItemDefinition[] = [
  {
    title: 'navigation.home',
    href: '/',
  },
  {
    title: 'navigation.group_resource',
    className:
      'grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]',
    children: [
      {
        title: 'navigation.event_list',
        href: '/events',
        type: 'card',
        content: 'navigation.event_list_desc',
      },
      {
        title: 'navigation.dictionary',
        href: '/dictionary',
        content: 'navigation.dictionary_desc',
      },
      {
        title: 'navigation.game_list',
        href: '/games',
        content: 'navigation.game_list_desc',
      },
      {
        title: 'navigation.rule_list',
        href: '/rules',
        content: 'navigation.rule_list_desc',
      },
    ],
  },
  {
    title: 'navigation.group_about_us',
    children: [
      {
        title: 'navigation.member_list',
        href: '/members',
        content: 'navigation.member_list_desc',
      },
      {
        title: 'navigation.chronicle',
        href: '/chronicle',
        content: 'navigation.chronicle_desc',
      },
      {
        title: 'navigation.contact_us',
        href: '/contacts',
        content: 'navigation.contact_us_desc',
      },
      {
        title: 'navigation.acknowledgements',
        href: '/acknowledgements',
        content: 'navigation.acknowledgements_desc',
      },
    ],
  },
];

function translateNavigationItem<T extends NavigationItemDefinition>(
  navigationItem: T,
  translationProvider: (key: string) => string,
): T {
  if ('children' in navigationItem) {
    return {
      title: translationProvider(navigationItem.title),
      className: navigationItem.className,
      children: navigationItem.children.map((child) =>
        translateNavigationItem(child, translationProvider),
      ),
    } as T;
  }

  return {
    ...navigationItem,
    title: translationProvider(navigationItem.title),
    content: navigationItem.content
      ? translationProvider(navigationItem.content)
      : undefined,
  };
}

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = useTranslations('Header.theme_toggle');

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={t('prompt', { target_theme: mounted ? otherTheme : 'other' })}
      className="group fill-accent stroke-accent-foreground md:rounded-full"
      onClick={() => setTheme(otherTheme)}
    >
      <Sun className="h-5 w-5 transition ease-out dark:hidden" />
      <Moon className="hidden h-5 w-5 transition ease-out dark:block" />
    </Button>
  );
};

const listItemLinkStyle =
  'w-full block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground';

const ListItemLink = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <Link
      className={cn(listItemLinkStyle, className)}
      ref={ref}
      href={href || '#'}
      {...props}
    >
      <div className="text-sm font-medium leading-none">{title}</div>
      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
        {children}
      </p>
    </Link>
  );
});
ListItemLink.displayName = 'ListItemLink';

const MobileNavigation = ({
  navigationItems,
}: {
  navigationItems: NavigationItemDefinition[];
}) => {
  const t = useTranslations('Header');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden" variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>{t('navigations')}</SheetTitle>
        </SheetHeader>

        <Accordion type="single" collapsible>
          {navigationItems.map((navigation) =>
            'children' in navigation ? (
              <AccordionItem value={navigation.title} key={navigation.title}>
                <AccordionTrigger
                  className={cn(
                    listItemLinkStyle,
                    'flex items-center justify-between px-4',
                  )}
                >
                  {navigation.title}
                </AccordionTrigger>
                <AccordionContent>
                  {navigation.children.map((child) => (
                    <ListItemLink
                      key={child.title}
                      title={child.title}
                      href={child.href}
                      className="px-6"
                    >
                      {child.content}
                    </ListItemLink>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ) : (
              <ListItemLink
                key={navigation.title}
                title={navigation.title}
                href={navigation.href}
                className="px-4"
              >
                {navigation.content}
              </ListItemLink>
            ),
          )}
        </Accordion>

        <Card>
          <CardContent className="flex items-center justify-between py-2">
            <span>{t('theme_toggle.title')}</span>
            <ThemeToggle />
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  );
};

const StandardListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>((props, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <ListItemLink {...props} ref={ref} />
      </NavigationMenuLink>
    </li>
  );
});
StandardListItem.displayName = 'StandardListItem';

const CardListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li className="row-span-3">
      <NavigationMenuLink asChild>
        <Link
          className={cn(
            'flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md',
            className,
          )}
          ref={ref}
          href={href || '#'}
          {...props}
        >
          <BrandLogo className="h-6 w-6" height={24} width={24} />
          <div className="mb-2 mt-4 text-lg font-medium">{title}</div>
          <p className="text-sm leading-tight text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
CardListItem.displayName = 'CardListItem';

const ItemStyleComponents: Record<string, typeof StandardListItem> = {
  card: CardListItem,
  standard: StandardListItem,
};

const DelegatedListItem = ({ item }: { item: SingleNavigationItem }) => {
  const style = item.type || 'standard';
  const component = ItemStyleComponents[style];

  if (!component) {
    return null;
  }

  return React.createElement(
    component,
    { title: item.title, href: item.href },
    item.content,
  );
};
DelegatedListItem.displayName = 'DelegatedListItem';

const DesktopNavigation = ({
  navigationItems,
}: {
  navigationItems: NavigationItemDefinition[];
}) => {
  return (
    <NavigationMenu className="hidden text-foreground md:flex">
      <NavigationMenuList>
        {navigationItems.map((navigation) => {
          if ('children' in navigation) {
            return (
              <NavigationMenuItem key={navigation.title}>
                <NavigationMenuTrigger>
                  {navigation.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul
                    className={cn(
                      'grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]',
                      navigation.className,
                    )}
                  >
                    {navigation.children &&
                      navigation.children.map((child) => (
                        <DelegatedListItem key={child.title} item={child} />
                      ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={navigation.title}>
              <Link href={navigation.href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {navigation.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default function Header() {
  const t = useTranslations('Header');

  const navigationItems = navigations.map((navigation) =>
    translateNavigationItem(navigation, (key: string) => t(key as any)),
  );

  return (
    <header className="border-rainbow z-30 border-b-2 bg-background shadow-md">
      <div
        aria-label={t('navbar')}
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
      >
        <div className="flex items-center gap-x-8">
          <Link className="-m-1.5 p-1.5" href="/">
            <span className="sr-only">
              {useTranslations('Common')('brand_full')}
            </span>
            <BrandLogo className="h-8 w-auto" width={32} height={32} />
          </Link>
          <DesktopNavigation navigationItems={navigationItems} />
        </div>
        <div className="flex gap-x-4">
          <SignedIn>
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserButton />
            </Button>
          </SignedIn>
          <SignedOut>
            <Button variant="outline" className="md:rounded-full" asChild>
              <SignInButton mode="modal" />
            </Button>
          </SignedOut>
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>
          <MobileNavigation navigationItems={navigationItems} />
        </div>
      </div>
    </header>
  );
}
