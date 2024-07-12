import React from "react";

import { ClerkProvider } from "@clerk/nextjs";

// eslint-disable-next-line camelcase
import { Inter, Space_Grotesk } from "next/font/google";

import { ThemeProvider } from "@/context/ThemeProvider";

import type { Metadata } from "next";

import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-spaceGrotesk",
});

export const metadata: Metadata = {
	title: "TheSkillGuru",
	description:
		"At The Skill Guru, students can engage with Gurus through various mediums like chat, recordings, photos, and video calls. Whether you're seeking academic support, guidance on personal development, or simply a mentor to discuss challenges with, our platform provides a supportive environment for growth and learning.",
	icons: {
		icon: "/assets/images/site-logo.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${inter.variable} ${spaceGrotesk.variable}`}>
				<ClerkProvider
					appearance={{
						elements: {
							formButtonPrimary: "primary-gradient",
							footerActionLink:
								"primary-text-gradient hover:text-primary-500",
						},
					}}
				>
					<ThemeProvider>{children}</ThemeProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
