import {
  withMiddlewareAuthRequired,
  getSession,
} from "@auth0/nextjs-auth0/edge";
import { NextResponse } from "next/server";

export default withMiddlewareAuthRequired({
  // returnTo: "/",
  // Custom middleware is provided with the `middleware` config option
  async middleware(req) {
    return NextResponse.next();
  },
});

// export const config = {
//   matcher: ["/((?!_next/static|favicon.ico|login|).*)"],
// };
export const config = {
  matcher: ["/", "/items", "/categories", "/locations", "/user"],
};
