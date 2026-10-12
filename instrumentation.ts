// Runs once when the Next.js server starts, before it accepts requests.
// Initialising Payload here makes it connect immediately, which in production
// applies any pending migrations (`prodMigrations` in payload.config.ts) at
// boot instead of on the first request — and a failing migration stops the
// container from starting, like the old `payload migrate && next start`.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NODE_ENV !== "production") return;

  const { getPayload } = await import("payload");
  const { default: config } = await import("@payload-config");
  await getPayload({ config });
}
