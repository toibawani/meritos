import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/** Liveness probe for uptime checks, load balancers and deploy smoke tests. */
export async function GET() {
  let commit = process.env.VERCEL_GIT_COMMIT_SHA || process.env.COMMIT_SHA || "unknown";
  let version = process.env.npm_package_version || "1.0.0";

  try {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8"));
    if (pkg?.version) version = pkg.version;
  } catch {
    // package.json is guaranteed in the standalone bundle; keep safe defaults.
  }

  return NextResponse.json(
    { status: "ok", version, commit },
    { headers: { "Cache-Control": "no-store" } }
  );
}
