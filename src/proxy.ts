import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // every path except Next's internals, the API and anything with a file
  // extension (favicon, models, draco, fonts...)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
