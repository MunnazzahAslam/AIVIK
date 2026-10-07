import {defineField, defineType} from 'sanity'

// The animated covers the website can draw (lib/blog-covers.ts in the website's code).
export const COVER_STYLES = [
  {title: 'Checklist: rows being ticked off', value: 'checklist'},
  {title: 'Bars: a rising bar chart', value: 'bars'},
  {title: 'Orbits: points circling a centre', value: 'orbits'},
  {title: 'Pipeline: steps passing data along', value: 'pipeline'},
  {title: 'Code: an editor writing lines', value: 'code'},
  {title: 'Signal: waves reaching a stack of messages', value: 'signal'},
]

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
    defineField({
      name: 'coverStyle',
      title: 'Cover',
      type: 'string',
      description:
        'The animated cover that articles in this category get. Each article gets its own variation of it. An article with an uploaded cover image uses that instead.',
      options: {list: COVER_STYLES, layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'titleEn', subtitle: 'coverStyle'},
  },
})
