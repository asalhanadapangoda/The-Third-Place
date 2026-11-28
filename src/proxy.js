import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { sanitizeRedirectPath } from "@/lib/security/permissions";

export async function proxy(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  if (!url || !anonKey) {
    if (isAdminRoute && !isAdminLogin) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("setup", "required");
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  const isProd = process.env.NODE_ENV === "production";

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, {
            ...options,
            sameSite: options?.sameSite || "lax",
            secure: isProd ? true : Boolean(options?.secure),
          })
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminRoute && !isAdminLogin && !user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", sanitizeRedirectPath(pathname));
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminLogin && user) {
    const nextParam = sanitizeRedirectPath(
      request.nextUrl.searchParams.get("next") || "/admin/dashboard"
    );
    return NextResponse.redirect(new URL(nextParam, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/upload/:path*"],
};
