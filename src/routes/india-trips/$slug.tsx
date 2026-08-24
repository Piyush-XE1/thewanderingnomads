import { createFileRoute } from "@tanstack/react-router";

import { DestinationPage } from "@/components/site/DestinationPage";
import { destinationHead } from "@/lib/destinations";

export const Route = createFileRoute("/india-trips/$slug")({
  head: ({ params }) => destinationHead(params.slug, "india"),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  return <DestinationPage slug={slug} region="india" />;
}
