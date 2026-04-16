import { SiteRenderer, type SiteData } from "@/components/site-renderer";
import siteData from "@/data/site.json";

export default function HomePage() {
  return <SiteRenderer data={siteData as unknown as SiteData} />;
}
