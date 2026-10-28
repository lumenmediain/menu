import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
const singletonTypes = new Set([
  "cafeSettings",
  "todaysSpecial",
  "menuSettings",
]);
export default defineConfig({
  name: "folio",
  title: "Aurelle Café · Menu studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "unconfigured",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Your café")
          .items([
            S.listItem()
              .title("Café information")
              .child(
                S.document()
                  .schemaType("cafeSettings")
                  .documentId("cafeSettings"),
              ),
            S.listItem()
              .title("Today’s special")
              .child(
                S.document()
                  .schemaType("todaysSpecial")
                  .documentId("todaysSpecial"),
              ),
            S.listItem()
              .title("Design & features")
              .child(
                S.document()
                  .schemaType("menuSettings")
                  .documentId("menuSettings"),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !singletonTypes.has(item.getId() || ""),
            ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((t) => !singletonTypes.has(t.schemaType)),
  },
  document: {
    actions: (actions, context) =>
      singletonTypes.has(context.schemaType)
        ? actions.filter(
            (a) =>
              !["delete", "duplicate", "unpublish"].includes(a.action || ""),
          )
        : actions,
  },
});
