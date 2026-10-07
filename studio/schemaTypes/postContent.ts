import {defineField, defineType} from 'sanity'

/** Everything an article says in one language. The post has one of these per language. */
export const postContent = defineType({
  name: 'postContent',
  title: 'Content',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (rule) => rule.max(90).warning('Search results cut headlines off at around 60 characters.'),
    }),
    defineField({
      name: 'description',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'One or two sentences. Shown on the card, under the headline and in Google.',
      validation: (rule) => rule.max(160).warning('Google shows about 155 characters.'),
    }),
    defineField({name: 'body', title: 'Article', type: 'body'}),
    defineField({
      name: 'seoTitle',
      title: 'Search title (optional)',
      type: 'string',
      description: 'Only if the title in Google should differ from the headline.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search description (optional)',
      type: 'text',
      rows: 2,
      description: 'Only if the text in Google should differ from the summary.',
    }),
  ],
})
