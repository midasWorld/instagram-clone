import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET_NAME,
  useCdn: false,
  apiVersion: "2023-04-16",
  token: process.env.SANITY_SECRET_TOKEN,
});
