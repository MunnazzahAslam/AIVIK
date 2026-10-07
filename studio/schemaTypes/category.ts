import {defineField, defineType} from 'sanity'

/** An article has exactly one category. It is a managed list, so names stay consistent. */
export const category = defineType({
  name: 'category',
  title: 'Category',
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
