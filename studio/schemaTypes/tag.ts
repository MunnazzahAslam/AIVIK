import {defineField, defineType} from 'sanity'

/** Tags are picked from this list instead of typed freely, so "AI" and "ai" can't become two tags. */
export const tag = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    defineField({name: 'titleEn', title: 'Name (English)', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'titleDe',
      title: 'Name (German)',
      type: 'string',
      description: 'Left empty, the English name is shown on the German site.',
    }),
  ],
  preview: {
    select: {title: 'titleEn', subtitle: 'titleDe'},
  },
})
