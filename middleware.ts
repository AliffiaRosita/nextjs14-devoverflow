// import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
// export default authMiddleware({
// 	publicRoutes: ["/home", "/api/webhook/clerk", "/api/rapidapi"],
// 	ignoredRoutes: [
// 		"/terms-of-service",
// 		"/privacy-policy",
// 		"/api/webhook/clerk",
// 		"/api/openai",
// 		"/api/rapidapi",
// 	],
// 	afterAuth(auth, req, evt) {
// 		if (!auth.userId && !auth.isPublicRoute) {
// 			return redirectToSignIn({ returnBackUrl: req.url });
// 		}
// 	},
// });

const protectedRoutes = createRouteMatcher([
	"/api/rapidapi",
	"/api/chat",
	"/question/:id",
	"/skills(.*)",
	"/profile(.*)",
	"/community",
	"/referral",
	"/jobs",
	"/post-problem",
	"/onboarding",
	"/message",
	"/call(.*)",
	"/collection",
]);

export default clerkMiddleware((auth, req) => {
	if (protectedRoutes(req)) auth().protect();
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
