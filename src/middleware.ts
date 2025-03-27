import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const pathname = request.nextUrl.pathname;

  // アクセストークンがない場合、操作画面 (/) にアクセス不可
  if (!accessToken && pathname === "/dashboard") {
    console.log("Redirecting to / because no accessToken");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // アクセストークンがある場合、ログイン画面 (/login) にはアクセス不可
  if (
    accessToken &&
    (pathname === "/login" ||
      pathname.startsWith("/login/registration") ||
      pathname === "/")
  ) {
    console.log("Redirecting to /dashboard because accessToken exists");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // その他のページは通常通りアクセス許可
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/login/registration", "/dashboard"],
};
