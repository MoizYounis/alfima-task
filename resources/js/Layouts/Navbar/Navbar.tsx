import { Link } from "@inertiajs/react";
import { Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { websiteHeaderLinks } from "@/Layouts/data";

type NavbarProps = {
  active?: string;
};

export function Navbar({ active }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-white/95 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-[160px] items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/alfima_logo.png"
                alt="alfima"
                className="h-7 w-auto"
              />
            </Link>
          </div>

          <div className="hidden items-center justify-center gap-8 lg:flex">
            {websiteHeaderLinks.map((item) => (
              <Button
                key={item.key}
                asChild
                variant="ghost"
                className={[
                  "h-auto rounded-none px-0 py-0 text-sm font-medium transition-colors",
                  active === item.key ? "text-primary" : "text-foreground",
                ].join(" ")}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </div>

          <div className="flex min-w-[160px] items-center justify-end lg:hidden">
            <button
              type="button"
              aria-label="Open navigation menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background/90 text-foreground"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className="min-w-[160px] hidden lg:block" />
        </div>

        {mobileMenuOpen ? (
          <div className="pb-4 lg:hidden">
            <div className="mt-2 flex flex-col gap-2">
              {websiteHeaderLinks.map((item) => (
                <Button
                  key={item.key}
                  asChild
                  variant="ghost"
                  className={[
                    "h-auto justify-start rounded-none px-0 py-0 text-sm font-medium transition-colors",
                    active === item.key
                      ? "text-primary"
                      : "text-foreground hover:text-primary",
                  ].join(" ")}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}

