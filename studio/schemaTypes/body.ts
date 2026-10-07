import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * The text of an article. Only the blocks the website knows how to draw are
 * offered here, so an article can't break the page's layout.
 */
export const body = defineType({
  name: 'body',
  title: 'Article',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      // The headline comes from the title field, so sections start at H2.
      styles: [
        {title: 'Text', value: 'normal'},
        {title: 'Section heading', value: 'h2'},
        {title: 'Sub-heading', value: 'h3'},
        {title: 'Quote or note', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullets', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
          {title: 'Code', value: 'code'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Address',
                type: 'url',
                description:
                  'A full address (https://…) for other sites, which open in a new tab. For our own pages, the path for that language: /use-cases/… in English, /de/anwendungsfaelle/… in German.',
                validation: (rule) =>
                  rule.required().uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      name: 'figure',
      title: 'Image',
      type: 'image',
      options: {hotspot: true, accept: 'image/png,image/jpeg,image/webp'},
      fields: [
        defineField({
          name: 'alt',
          title: 'What the image shows',
          type: 'string',
          description: 'Read aloud by screen readers and used by search engines.',
          validation: (rule) => rule.required(),
        }),
        defineField({name: 'caption', title: 'Caption', type: 'string'}),
      ],
    }),
    defineArrayMember({type: 'table', title: 'Table'}),
  ],
})
