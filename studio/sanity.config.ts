import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {table} from '@sanity/table'
import {reviewActions, SETTINGS_ID} from './review'
import {schemaTypes} from './schemaTypes'

// The website the preview opens on. For a local site: SANITY_STUDIO_SITE_URL=http://localhost:3000
const SITE_URL = process.env.SANITY_STUDIO_SITE_URL || 'https://aivik.eu'

export default defineConfig({
  name: 'default',
  title: 'AIVIK',

  projectId: 'qs3r3e0a',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Blog')
          .items([
            S.documentTypeListItem('post').title('Articles'),
            // Marked by their writers and waiting for someone who can publish.
            S.listItem()
              .title('Ready for review')
              .id('ready-for-review')
              .child(
                S.documentList()
                  .title('Ready for review')
                  .apiVersion('2025-02-19')
                  .schemaType('post')
                  .filter('_type == "post" && readyForReview == true'),
              ),
            S.divider(),
            S.documentTypeListItem('category').title('Categories'),
            S.documentTypeListItem('tag').title('Tags'),
            S.documentTypeListItem('author').title('Authors'),
            S.divider(),
            S.listItem()
              .title('Publishing settings')
              .id('publishing-settings')
              .child(S.document().schemaType('publishingSettings').documentId(SETTINGS_ID)),
          ]),
    }),
    // Tables inside an article.
    table(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // There is one Publishing settings document; it isn't offered under "new".
    templates: (templates) => templates.filter((template) => template.schemaType !== 'publishingSettings'),
  },

  document: {
    // Publish, unpublish and delete on articles are for approvers (review.ts).
    actions: reviewActions,
    // "Open preview" in an article's menu (⋯) shows it on the website with
    // unpublished changes. The link carries a one-time secret that is stored
    // under a private id, which the website checks before switching to preview.
    productionUrl: async (prev, {document, getClient, currentUser}) => {
      const slug = (document.slug as {current?: string} | undefined)?.current
      if (document._type !== 'post' || !slug || !currentUser) return prev

      const secret = crypto.randomUUID()
      await getClient({apiVersion: '2025-02-19'}).createOrReplace({
        _id: `preview.${currentUser.id}`,
        _type: 'previewSecret',
        secret,
      })
      const locale = (document.en as {title?: string} | undefined)?.title ? 'en' : 'de'
      return `${SITE_URL}/api/draft?${new URLSearchParams({secret, slug, locale})}`
    },
  },
})
