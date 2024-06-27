import React from "react";

import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/shared/navbar/Navbar";

import StreamVideoProvider from "@/context/StreamClientProvider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <section className="flex min-h-screen flex-1 flex-col px-4 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto size-full">
            <StreamVideoProvider>{children}</StreamVideoProvider>
          </div>
        </section>
      </div>

      <Toaster />
    </main>
  );
};

export default Layout;
