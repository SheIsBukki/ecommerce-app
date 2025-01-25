import { defineField, defineType } from "sanity";

export const banner = defineType({
  name: "banner",
  title: "Banner",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "emoji_1", title: "Emoji_1", type: "string" }),
    defineField({ name: "emoji_2", title: "Emoji_2", type: "string" }),
    defineField({ name: "text_1", title: "Text_1", type: "string" }),
    defineField({ name: "text_2", title: "Text_2", type: "string" }),
    defineField({
      name: "expirationDate",
      title: "Expiration Date",
      type: "date",
    }),
    defineField({ name: "button", title: "Button", type: "string" }),
  ],
});
