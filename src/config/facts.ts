/**
 * facts.ts — curated GTA VI tiles (data/gta-6/facts.json), the four GTA VI
 * section pages, and the id → URL map that keeps old prediction and October
 * anchors working after /gta-vi/confirmed, /predictions, /trailers, /music
 * and /income were folded into Facts, Media and Economy.
 */
import factsData from "../../data/gta-6/facts.json";

export type FactTier = "confirmed" | "reported" | "predicted";

export interface FactTileData {
  id: string;
  title: string;
  headline: string;
  line: string;
  tier: FactTier;
  confidence?: number;
  from: string[];
  image: string;
  basis: string;
  source: string;
  chart?: { label: string; href: string };
  economy?: boolean;
}

export const FACTS = factsData.facts as FactTileData[];
export const LAUNCH_PREDICTIONS = factsData.launch_predictions as FactTileData[];
export const MONEY_PREDICTIONS = factsData.money_predictions as FactTileData[];
export const ECONOMY_FACTS = FACTS.filter((f) => f.economy);

export const GTA_VI_PAGES = [
  { href: "/gta-vi",         label: "Overview",            icon: "intel",   sub: "Countdown · latest · start here",
    match: ["/gta-vi"] },
  { href: "/gta-vi/facts",   label: "Facts & Predictions", icon: "star",    sub: `${FACTS.length} facts · ${LAUNCH_PREDICTIONS.length} predictions · cast · places`,
    match: ["/gta-vi/facts"] },
  { href: "/gta-vi/media",   label: "Music & Video",       icon: "trailer", sub: "Trailers · radio stations · album",
    match: ["/gta-vi/media", "/gta-vi/launch-trailer", "/gta-vi/extended-look"] },
  { href: "/gta-vi/economy", label: "Economy",             icon: "economy", sub: `Why no Online at launch · ${MONEY_PREDICTIONS.length} money predictions`,
    match: ["/gta-vi/economy"] },
] as const;

export function normalisePath(path: string): string {
  return path.replace(/\/+$/, "") || "/";
}

/** The GTA VI section page a path belongs to, or null (e.g. /gta-vi/buy). */
export function gtaViPageFor(path: string) {
  const p = normalisePath(path);
  return GTA_VI_PAGES.find((pg) => (pg.match as readonly string[]).includes(p)) ?? null;
}

const ECONOMY_IDS = new Set(["pred-launch-price", "pred-real-price-advantage", "pred-vi-gta-rpp"]);

const ANCHOR_MAP: Record<string, string> = {};
for (const t of [...FACTS, ...LAUNCH_PREDICTIONS]) {
  for (const id of t.from) ANCHOR_MAP[id] = `/gta-vi/facts#${t.id}`;
}
for (const t of MONEY_PREDICTIONS) {
  for (const id of t.from) ANCHOR_MAP[id] = `/gta-vi/economy#${t.id}`;
}

/** Where a predictions.json or October id lives now. */
export function factHref(id: string): string {
  if (ANCHOR_MAP[id]) return ANCHOR_MAP[id];
  if (ECONOMY_IDS.has(id)) return "/gta-vi/economy";
  return "/gta-vi/facts";
}

/**
 * Hash → new URL for the retired pages. Ids missing here fall back to the
 * redirect page's default; income-pred-* anchors are handled by prefix.
 */
export const REDIRECT_MAP: Record<string, string> = {
  ...ANCHOR_MAP,
  "pred-launch-price":          "/gta-vi/economy",
  "pred-real-price-advantage":  "/gta-vi/economy",
  "pred-vi-gta-rpp":            "/gta-vi/economy",
  "section-predictions":        "/gta-vi/facts#section-launch-predictions",
  "section-cast":               "/gta-vi/facts#section-cast",
  "section-locations":          "/gta-vi/facts#section-locations",
  "section-vi-faq":             "/gta-vi/facts#section-vi-faq",
  "oct-lucia-liberty-city":     "/gta-vi/facts#section-cast",
  "oct-raul-mentor":            "/gta-vi/facts#section-cast",
  "oct-protagonists":           "/gta-vi/facts#section-cast",
  "section-rdr2":               "/gta-vi/economy#section-rdr2",
  "section-income-predictions": "/gta-vi/economy#section-income-predictions",
  "section-music":              "/gta-vi/media#section-music",
  "section-soundtrack":         "/gta-vi/media#section-soundtrack",
  "oct-radio-hosts":            "/gta-vi/media#section-music",
  "oct-album-score":            "/gta-vi/media#section-music",
  "oct-podcasts-earbuds":       "/gta-vi/media#section-music",
  "section-trailers":           "/gta-vi/media#section-trailers",
  "section-other-videos":       "/gta-vi/media#section-other-videos",
  "oct-launch-trailer-ps5":     "/gta-vi/media#section-trailers",
};
