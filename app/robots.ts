import type { MetadataRoute } from "next";
import { CONSOLE_ENABLED } from "./console/visibility";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // the console is an internal view; keep it out of crawlers even on the
      // builds where it is switched on
      disallow: CONSOLE_ENABLED ? ["/console"] : [],
    },
  };
}
