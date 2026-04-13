import maritimeImg from "../assets/service-maritime.png";
import landImg from "../assets/service-land.png";
import supplyImg from "../assets/service-supply.png";
import p1Img from "../assets/project-1.png";
import p2Img from "../assets/project-2.png";

/** Pôles métiers officiels (alignés sur la communication GTTs). */
export const SITE_SERVICE_IDS = [
  "clearance",
  "logistics",
  "transit",
  "customs",
  "documents",
] as const;

export type SiteServiceId = (typeof SITE_SERVICE_IDS)[number];

export const siteServiceImages: Record<SiteServiceId, string> = {
  clearance: maritimeImg,
  logistics: supplyImg,
  transit: landImg,
  customs: p1Img,
  documents: p2Img,
};
