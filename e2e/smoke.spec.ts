import { test, expect } from "@playwright/test";

/**
 * Smoke tests for the highest-value routes. These assert that shipped,
 * user-facing behavior works end to end (not implementation internals).
 */
test.describe("MeritOS smoke", () => {
  test("home (/) renders the Competence Passport", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Merit/i);
    // Profile hero for the default persona
    await expect(page.getByText("Toiba Wani", { exact: false }).first()).toBeVisible();
  });

  test("profile (/p/elena_rostova) switches persona", async ({ page }) => {
    await page.goto("/p/elena_rostova");
    await expect(page.getByText("Elena Rostova", { exact: false }).first()).toBeVisible();
  });

  test("verify (/verify) renders the audit sandbox", async ({ page }) => {
    await page.goto("/verify");
    await expect(
      page.getByRole("button", { name: /audit credential authenticity/i })
    ).toBeVisible();
    await expect(page.getByPlaceholder(/paste meritos json-ld receipt/i)).toBeVisible();
  });

  test("badge API returns SVG", async ({ request }) => {
    const res = await request.get("/api/badge/toibawani");
    expect(res.ok()).toBeTruthy();
    expect(res.headers()["content-type"]).toContain("image/svg+xml");
    const body = await res.text();
    expect(body).toContain("<svg");
    expect(body).toContain("MeritOS");
  });

  test("DID API returns a valid did:merit document", async ({ request }) => {
    const res = await request.get("/api/did/toibawani");
    expect(res.ok()).toBeTruthy();
    const doc = await res.json();
    expect(doc.id).toMatch(/^did:merit:/);
    expect(Array.isArray(doc["@context"])).toBe(true);
    expect(Array.isArray(doc.verificationMethod)).toBe(true);
    expect(doc.verificationMethod[0].type).toBe("Ed25519VerificationKey2020");
    expect(Array.isArray(doc.authentication)).toBe(true);
  });

  test("health API reports status, version and commit", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(typeof body.version).toBe("string");
    expect(typeof body.commit).toBe("string");
  });
});
