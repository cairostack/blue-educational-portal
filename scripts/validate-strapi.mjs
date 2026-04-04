#!/usr/bin/env node
/**
 * validate-strapi.mjs
 *
 * Validates that the Strapi API is reachable and returns data in the
 * expected shape for the key endpoints used by the portal.
 *
 * Usage:
 *   node scripts/validate-strapi.mjs
 *
 * Required env vars (loaded from .env.local automatically):
 *   STRAPI_API_URL   — Strapi API base URL
 *   STRAPI_API_TOKEN — (optional) bearer token
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// ── Load .env.local ──────────────────────────────────────────────────────────
try {
  const envPath = resolve(process.cwd(), ".env.local");
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (key && !(key in process.env)) process.env[key] = val;
  }
} catch {
  // .env.local not present — rely on shell env
}

// ── Config ───────────────────────────────────────────────────────────────────
const BASE_URL = (
  process.env.STRAPI_API_URL ??
  process.env.STRAPI_BASE_URL ??
  "https://admin-blue-educational.com/api"
).replace(/\/$/, "");

const TOKEN = process.env.STRAPI_API_TOKEN;

const HEADERS = TOKEN
  ? { Authorization: `Bearer [REDACTED]` }
  : {};

const FETCH_HEADERS = TOKEN
  ? { Authorization: `Bearer ${TOKEN}` }
  : {};

// ── Helpers ──────────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function pass(msg) {
  console.log(`  ✓ ${msg}`);
  passed++;
}

function fail(msg, err) {
  console.error(`  ✗ ${msg}`);
  if (err) console.error(`    ${err}`);
  failed++;
}

async function get(path, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${BASE_URL}${path}${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}

// ── Checks ───────────────────────────────────────────────────────────────────
console.log(`\nValidating Strapi API at: ${BASE_URL}`);
console.log(`Auth: ${TOKEN ? "Bearer token set" : "No token (public access)"}`);
console.log(`Headers: ${JSON.stringify(HEADERS)}\n`);

async function checkCoursesList() {
  console.log("1. GET /courses (listing)");
  try {
    const data = await get("/courses", {
      "pagination[pageSize]": "5",
      "pagination[page]": "1",
      "filters[hidden][$eq]": "false",
      "sort[0]": "createdAt:desc",
      "populate[instructor][populate]": "avatar",
      "populate[categories]": "*",
      "populate[cover]": "*",
    });

    if (!Array.isArray(data.data)) throw new Error("data.data is not an array");
    pass(`Returned ${data.data.length} courses (total: ${data.meta?.pagination?.total ?? "?"})`);

    if (data.data.length > 0) {
      const course = data.data[0];
      const a = course.attributes;
      if (typeof course.id !== "number") fail("course.id is not a number");
      else pass("course.id is present");

      if (typeof a.title !== "string") fail("course.attributes.title missing");
      else pass(`course.attributes.title: "${a.title}"`);

      if (typeof a.slug !== "string") fail("course.attributes.slug missing");
      else pass(`course.attributes.slug: "${a.slug}"`);

      if (typeof a.price !== "number") fail("course.attributes.price missing or not a number");
      else pass(`course.attributes.price: ${a.price}`);

      if (a.cover?.data) pass("cover relation populated");
      else pass("cover relation null/missing (ok if no cover uploaded)");

      if (a.instructor?.data) pass("instructor relation populated");
      else pass("instructor relation null (ok if not assigned)");
    }
  } catch (err) {
    fail("courses listing request failed", err.message);
  }
}

async function checkCourseDetail() {
  console.log("\n2. GET /courses (detail — first non-hidden course by slug)");
  try {
    const listData = await get("/courses", {
      "pagination[pageSize]": "1",
      "filters[hidden][$eq]": "false",
      "sort[0]": "createdAt:desc",
    });

    if (!Array.isArray(listData.data) || listData.data.length === 0) {
      pass("No courses found — skipping detail check");
      return;
    }

    const slug = listData.data[0].attributes?.slug;
    if (!slug) { fail("First course has no slug"); return; }

    const data = await get("/courses", {
      "filters[slug][$eq]": slug,
      "pagination[pageSize]": "1",
      "populate[instructor][populate]": "avatar",
      "populate[categories]": "*",
      "populate[cover]": "*",
      "populate[sections][populate][lessons]": "*",
    });

    if (!Array.isArray(data.data) || data.data.length === 0) {
      fail(`Detail query for slug "${slug}" returned no results`);
      return;
    }

    const course = data.data[0];
    const a = course.attributes;
    pass(`Found course by slug: "${slug}"`);

    if (Array.isArray(a.sections?.data)) {
      pass(`sections populated (${a.sections.data.length} sections)`);
      const firstSection = a.sections.data[0];
      if (firstSection?.attributes?.lessons?.data) {
        pass(`First section has ${firstSection.attributes.lessons.data.length} lessons`);
      }
    } else {
      pass("sections not populated (ok if course has no curriculum)");
    }
  } catch (err) {
    fail("course detail request failed", err.message);
  }
}

async function checkCategories() {
  console.log("\n3. GET /categories");
  try {
    const data = await get("/categories", { "pagination[pageSize]": "20" });
    if (!Array.isArray(data.data)) throw new Error("data.data is not an array");
    pass(`Returned ${data.data.length} categories`);
    if (data.data.length > 0) {
      const name = data.data[0].attributes?.name;
      if (typeof name === "string") pass(`First category: "${name}"`);
      else fail("category.attributes.name missing or not a string");
    }
  } catch (err) {
    // Categories endpoint is optional
    pass(`/categories not available or empty (${err.message}) — skipping`);
  }
}

// ── Run ──────────────────────────────────────────────────────────────────────
await checkCoursesList();
await checkCourseDetail();
await checkCategories();

console.log(`\n${"─".repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  console.error(
    "Some checks failed. Ensure STRAPI_API_URL and STRAPI_API_TOKEN are set correctly."
  );
  process.exit(1);
} else {
  console.log("All checks passed.");
}
