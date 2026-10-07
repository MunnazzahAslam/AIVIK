import {defineArrayMember, defineField, defineType} from 'sanity'

const API_VERSION = '2025-02-19'

type Content = {title?: string; description?: string; body?: unknown[]}

const LANGUAGES = [
  {field: 'en', name: 'English'},
  {field: 'de', name: 'German'},
] as const

const started = (content?: Content) => Boolean(content?.title || content?.description || content?.body?.length)

// A language is either left empty (the article is then not listed in it) or complete.
const completeOrEmpty = (name: string) => (content?: Content) => {
  if (!started(content)) return true
  const missing = [
    !content?.title && 'a headline',
    !content?.description && 'a summary',
    !content?.body?.length && 'the article text',
  ].filter(Boolean)
  return missing.length === 0 || `The ${name} version still needs ${missing.join(' and ')}.`
}

/**
 * A blog article. One document holds both languages, because they share the
 * address, the date, the category and the tags: /blog/<slug> and /de/blog/<slug>.
 */
export const post = defineType({
  name: 'post',
  title: 'Article',
  type: 'document',
  groups: [
    {name: 'en', title: 'English', default: true},
    {name: 'de', title: 'Deutsch'},
    {name: 'details', title: 'Details'},
    {name: 'search', title: 'Search engines'},
  ],
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'postContent',
      group: 'en',
      validation: (rule) => rule.custom(completeOrEmpty('English')),
    }),
    defineField({
      name: 'de',
      title: 'Deutsch',
      type: 'postContent',
      group: 'de',
      description: 'Left empty, the article is listed on the English site only.',
      validation: (rule) => rule.custom(completeOrEmpty('German')),
    }),
    defineField({
      name: 'slug',
      title: 'Address',
      type: 'slug',
      group: 'details',
      description:
        'The end of the link in both languages: aivik.eu/blog/<address>. It can\'t be changed once the article is published, because links to it would break.',
      options: {
        source: (doc) => (doc.en as Content | undefined)?.title || (doc.de as Content | undefined)?.title || '',
        maxLength: 80,
      },
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return true
          if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug.current)) {
            return 'Use lowercase letters, numbers and hyphens only.'
          }
          const id = context.document?._id.replace(/^(drafts\.|versions\.[^.]+\.)/, '')
          if (!id) return true
          const live = await context
            .getClient({apiVersion: API_VERSION})
            .fetch<string | null>('*[_id == $id][0].slug.current', {id}, {perspective: 'published'})
          return !live || live === slug.current || `This article is already published at "${live}". Change the address back.`
        }),
    }),
    defineField({
      name: 'date',
      title: 'Publication date',
      type: 'date',
      group: 'details',
      description: 'Newest articles are listed first. With a date in the future, the article appears on that day.',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updated',
      title: 'Revised on',
      type: 'date',
      group: 'details',
      description: 'Only when a published article was changed in substance.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'tag'}]})],
      group: 'details',
      validation: (rule) => rule.unique().max(3).warning('Up to three tags read best on the card.'),
    }),
    defineField({name: 'author', title: 'Author', type: 'reference', to: [{type: 'author'}], group: 'details'}),
    defineField({
      name: 'cover',
      title: 'Cover image (optional)',
      type: 'image',
      group: 'details',
      description:
        'Without one, the article gets the AIVIK cover. Landscape, at least 1600 × 900, with the subject in the middle: the article page crops it to a wide strip.',
      options: {hotspot: true, accept: 'image/png,image/jpeg,image/webp'},
    }),
    defineField({
      name: 'featured',
      title: 'Show first on the blog page',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      name: 'noindex',
      title: 'Hide from search engines',
      type: 'boolean',
      group: 'search',
      initialValue: false,
    }),
    defineField({
      name: 'canonical',
      title: 'Original address',
      type: 'url',
      group: 'search',
      description: 'Only for articles first published somewhere else: the link to the original.',
    }),
  ],
  validation: (rule) =>
    rule.custom((doc) =>
      LANGUAGES.some(({field}) => started(doc?.[field] as Content | undefined))
        ? true
        : 'Write the article in at least one language.',
    ),
  orderings: [
    {title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]},
    {title: 'Oldest first', name: 'dateAsc', by: [{field: 'date', direction: 'asc'}]},
  ],
  preview: {
    select: {en: 'en.title', de: 'de.title', date: 'date', media: 'cover'},
    prepare: ({en, de, date, media}) => ({
      title: en || de || 'Untitled',
      subtitle: [date, [en && 'EN', de && 'DE'].filter(Boolean).join(' + ')].filter(Boolean).join(' · '),
      media,
    }),
  },
})
