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
  { key: "home", label: "Home", href: "/customer" },
  { key: "references", label: "References", href: "/customer/references" },
  { key: "prices", label: "Prices", href: "/customer/prices" },
  { key: "blog", label: "Blog", href: "/customer/blog" },
  { key: "catalog", label: "Catalog", href: "/customer/catalog" },
];

