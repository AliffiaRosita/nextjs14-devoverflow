import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <div className="flex">
        <section className="flex h-screen flex-1">
          <div className="mx-auto size-full">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default Layout;
