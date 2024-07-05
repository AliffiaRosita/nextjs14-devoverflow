import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
	publicRoutes: [
		"/home",
		"/api/webhook/clerk",
		"/api/rapidapi",
		"/question/:id",
		"/skills",
		"/skills/:id",
		"/profile/:id",
		"/community",
		"/jobs",
		"/post-problem",
		"/onboarding",
		"/message",
		"/call/:id",
	],
	ignoredRoutes: [
		"/terms-of-service",
		"/privacy-policy",
		"/api/webhook/clerk",
		"/api/openai",
		"/api/rapidapi",
	],
	afterAuth(auth, req, evt) {
		const url = req.url;

		const parts = url.split("/");

		const lastPart = parts[parts.length - 1];
		if (!auth.userId && lastPart !== "home") {
			return redirectToSignIn({ returnBackUrl: req.url });
		}
	},
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
