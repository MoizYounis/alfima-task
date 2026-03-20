import type { FC, ReactNode } from "react";

import CookiesBanner from "@/Common/Components/CookiesBanner";
import { Navbar } from "@/Layouts/Navbar/Navbar";

type MarketingPageProps = {
  activeKey: string;
  title: string;
  bannerContent?: ReactNode;
  children?: ReactNode;
};

const MarketingPage: FC<MarketingPageProps> = ({
  activeKey,
  title,
  bannerContent,
  children,
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar active={activeKey} />
      <section className="flex h-[360px] items-center justify-center bg-gradient-to-r from-primary/30 via-primary to-primary/30 px-6 sm:h-[420px]">
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-primary-foreground sm:text-5xl">
            {title}
          </h1>
          {bannerContent ? <div className="mt-8">{bannerContent}</div> : null}
        </div>
      </section>
      {children ? <main>{children}</main> : null}
      <CookiesBanner />
    </div>
  );
};

export default MarketingPage;

