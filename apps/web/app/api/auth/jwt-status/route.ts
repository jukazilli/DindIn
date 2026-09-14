export const dynamic = "force-dynamic";

/**
 * Safe smoke-test endpoint for Managed Better Auth JWT emission.
 *
 * The browser session remains HTTP-only. We forward the incoming cookies to
 * the local Managed Better Auth proxy, inspect the `set-auth-jwt` response
 * header on the server, and return only a boolean. The raw JWT is never
 * returned to the browser or logged.
 */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const cookie = request.headers.get("cookie");

  try {
    const headers = new Headers();
    if (cookie) headers.set("cookie", cookie);

    const sessionResponse = await fetch(`${origin}/api/auth/get-session`, {
      method: "GET",
      headers,
      cache: "no-store",
      redirect: "manual",
    });

    const jwt = sessionResponse.headers.get("set-auth-jwt");

    return Response.json(
      {
        jwtReady: Boolean(jwt),
        upstreamStatus: sessionResponse.status,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch {
    return Response.json(
      {
        jwtReady: false,
        upstreamStatus: null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }
}
