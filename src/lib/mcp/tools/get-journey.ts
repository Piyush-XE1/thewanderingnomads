import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { loadJourneySummaries } from "./list-journeys";

export default defineTool({
  name: "get_journey",
  title: "Get journey details",
  description:
    "Fetch full details for a single current journey by its slug (e.g. 'chandratal-manali-kasol', 'valley-of-flowers', 'meghalaya', 'dev-deepawali-varanasi').",
  inputSchema: {
    slug: z
      .string()
      .min(1)
      .describe("Journey slug, lowercase and hyphenated (e.g. 'valley-of-flowers')."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ slug }) => {
    const journeys = await loadJourneySummaries();
    const journey = journeys.find((j) => j.slug === slug.toLowerCase().trim());
    if (!journey) {
      return {
        content: [
          {
            type: "text",
            text: `No journey found for slug "${slug}". Available slugs: ${journeys
              .map((j) => j.slug)
              .join(", ")}.`,
          },
        ],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(journey, null, 2) }],
      structuredContent: { journey },
    };
  },
});
