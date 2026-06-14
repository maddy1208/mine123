import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "fs9dbbsw",
  dataset: "production",
  useCdn: true,
  apiVersion: "2025-01-01",
});
