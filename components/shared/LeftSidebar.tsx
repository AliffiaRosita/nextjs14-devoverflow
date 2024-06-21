"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useAuth } from "@clerk/nextjs";

import { sidebarLinks } from "@/constants";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const LeftSidebar = () => {
    const { userId } = useAuth();
    const pathname = usePathname();

    return (
        <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
            <div className="flex flex-1 flex-col gap-6">
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
                            key={link.route}
                            href={link.route}
                            className={`${
                                isActive
                                    ? "primary-gradient rounded-lg text-light-900"
                                    : "text-dark300_light900"
                            } flex items-center justify-start gap-4 bg-transparent p-4`}
                        >
                            <Image
                                src={link.imgURL}
                                alt={link.label}
                                width={20}
                                height={20}
                                className={`${isActive ? "" : "invert-colors"}`}
                            />
                            <p
                                className={`${
                                    isActive ? "base-bold" : "base-medium"
                                } max-lg:hidden`}
                            >
                                {link.label}
                            </p>
                        </Link>
                    );
                })}
                <Link href="/" className="bottom-0 mt-auto">
                    <Button className="paragraph-medium bg-green-500 text-white min-h-[46px] min-w-[175px] px-4 py-3">
                        <FontAwesomeIcon icon={faWhatsapp} className="mr-2" />{" "}
                        Help & Support
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default LeftSidebar;
