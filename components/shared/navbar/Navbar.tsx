import Link from "next/link";
import Image from "next/image";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import Theme from "@/components/shared/navbar/Theme";
import Mobile from "@/components/shared/navbar/Mobile";
import GlobalSearch from "@/components/shared/search/GlobalSearch";
import { Button } from "@/components/ui/button";
import Notification from "./Notification";
import UserAvailability from "./UserAvailability";

const Navbar = () => {
    return (
        <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
            <Link href="/home" className="flex items-center gap-1">
                <Image
                    src="/assets/images/site-logo.png"
                    width={23}
                    height={23}
                    alt="TheSkillGuru"
                />

                <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
                    The<span className="text-primary-500">SkillGuru</span>
                </p>
            </Link>

            <GlobalSearch />

            <div className="flex-between gap-5">
                <SignedOut>
                    <div className="flex flex-row gap-3">
                        <Link href="/sign-in">
                            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                                <Image
                                    src="/assets/icons/account.svg"
                                    alt="sign in"
                                    width={20}
                                    height={20}
                                    className="invert-colors lg:hidden"
                                />
                                <span className="primary-text-gradient max-lg:hidden">
                                    Log In
                                </span>
                            </Button>
                        </Link>

                        <Link href="/sign-up">
                            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                                <Image
                                    src="/assets/icons/sign-up.svg"
                                    alt="sign up"
                                    width={20}
                                    height={20}
                                    className="invert-colors lg:hidden"
                                />
                                <span className="max-lg:hidden">Sign Up</span>
                            </Button>
                        </Link>
                    </div>
                </SignedOut>

                <Theme />

                <SignedIn>
                    <Notification />
                    <UserAvailability />
                    <UserButton
                        afterSignOutUrl="/home"
                        appearance={{
                            elements: {
                                avatarBox: "h-10 w-10",
                            },
                            variables: {
                                colorPrimary: "#ff7000",
                            },
                        }}
                    />
                </SignedIn>
                <Mobile />
            </div>
        </nav>
    );
};

export default Navbar;
