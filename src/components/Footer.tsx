import { SiDiscord } from '@icons-pack/react-simple-icons';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

const socialLinks = [
  {
    name: 'Discord',
    href: 'https://discord.gg/example',
    icon: SiDiscord,
  },
];

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="mx-auto max-w-7xl p-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {socialLinks.map((link) => (
            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label={link.name}
              key={link.name}
            >
              <Link href={link.href} target="_blank">
                <link.icon className="h-6 w-6" />
              </Link>
            </Button>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-sm">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
