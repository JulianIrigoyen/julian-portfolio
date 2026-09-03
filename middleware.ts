// Password gate for /console.
//
// The INSTRUMENT console is not public. This runs at the edge, before any page
// or asset is served, so an unauthenticated request never reaches the bundle.
//
// The password lives in CONSOLE_PASSWORD on the Vercel project, never in the
// repo. If it is unset the gate denies everything — a missing env var must not
// quietly open the door.

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const REALM = "supersolid-console"

// Any username is accepted; only the password is checked. One secret to share
// beats two, and the username adds nothing over HTTPS.
function passwordFrom(header: string | null): string | null {
  if (!header || !header.startsWith("Basic ")) return null
  try {
    const decoded = atob(header.slice(6))
    const i = decoded.indexOf(":")
    return i === -1 ? null : decoded.slice(i + 1)
  } catch {
    return null
  }
}

// The edge runtime has no crypto.timingSafeEqual. Compare every byte whatever
// happens, so a near-miss and a first-character miss cost the same.
function matches(given: string, expected: string): boolean {
  const enc = new TextEncoder()
  const a = enc.encode(given)
  const b = enc.encode(expected)
  let diff = a.length ^ b.length
  const n = Math.max(a.length, b.length)
  for (let i = 0; i < n; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0)
  return diff === 0
}

function deny(): Response {
  return new Response("Authentication required.\n", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}

export function middleware(request: NextRequest) {
  const expected = process.env.CONSOLE_PASSWORD
  if (!expected) return deny()
  const given = passwordFrom(request.headers.get("authorization"))
  if (given === null || !matches(given, expected)) return deny()
  return NextResponse.next()
}

export const config = {
  matcher: ["/console", "/console/:path*"],
}
