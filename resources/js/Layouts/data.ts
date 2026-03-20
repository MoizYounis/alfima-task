import type { DashboardNavItem, WebsiteNavItem } from "./types";

export const dashboardNavItems: DashboardNavItem[] = [
  {
    title: "Tracking Codes",
    link: "/dashboard/tracking-codes",
  },
  {
    title: "Settings",
    link: "/dashboard/settings",
  },
];

export const websiteHeaderLinks: WebsiteNavItem[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "references", label: "References", href: "/references" },
  { key: "prices", label: "Prices", href: "/prices" },
  { key: "blog", label: "Blog", href: "/blog" },
  { key: "catalog", label: "Catalog", href: "/catalog" },
];

