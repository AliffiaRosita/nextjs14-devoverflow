"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useAuth } from "@clerk/nextjs";

import { sidebarLinks } from "@/constants";

const MobileFooter = () => {
    const { userId } = useAuth();
    const pathname = usePathname();

    return (
        <footer className="background-light900_dark200 light-border custom-scrollbar fixed bottom-0 left-0 flex w-full justify-around border-t p-4 shadow-light-300 dark:shadow-none lg:hidden">
            <div className="flex w-full justify-between items-center">
                {sidebarLinks.map((link) => {
                    const isActive =
                        (pathname.includes(link.route) &&
                            link.route.length > 1) ||
                        pathname === link.route;

                    if (link.route === "/profile") {
                        if (userId) {
                            link.route = `${link.route}/${userId}`;
                        } else {
                            return null;
                        }
                    }

                    return (
                        <Link
                            prefetch={false}
                            key={link.route}
                            href={link.route}
                            className={`flex items-center justify-center p-2 ${
                                isActive
                                    ? "primary-gradient rounded-lg text-light-900"
                                    : "text-dark300_light900"
                            }`}
                        >
                            <Image
                                src={link.imgURL}
                                alt={link.label}
                                width={24}
                                height={24}
                                className={`${isActive ? "" : "invert-colors"}`}
                            />
                        </Link>
                    );
                })}
                {/* <Link
                    href="https://wa.me/919560695530"
                    className="flex-center"
                >
                    <Button className="paragraph-medium min-h-[46px] min-w-[175px] bg-green-500 px-4 py-3 text-white">
                        <FontAwesomeIcon icon={faWhatsapp} />
                    </Button>
                </Link> */}
            </div>
        </footer>
    );
};

export default MobileFooter;
