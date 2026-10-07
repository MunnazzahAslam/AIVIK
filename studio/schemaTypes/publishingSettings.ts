import {defineArrayMember, defineField, defineType} from 'sanity'
import {isApprover} from '../review'

/**
 * Who may publish. There is one of these, under an id that only signed-in
 * members can read (ids with a dot are private in a public dataset).
 */
export const publishingSettings = defineType({
  name: 'publishingSettings',
  title: 'Publishing settings',
  type: 'document',
  // Changes apply at once: there is nothing to review or publish here.
  liveEdit: true,
  fields: [
    defineField({
      name: 'approvers',
      title: 'People who can publish',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description:
        'The email addresses they sign in to Sanity with. Everyone else can write articles and mark them "Ready for review", but cannot publish, unpublish or delete them. Only the people on this list can change it.',
      // Until someone is named, anyone may fill it in.
      readOnly: ({currentUser, document}) => !isApprover(currentUser?.email, document?.approvers as string[] | undefined),
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .unique()
          .custom((emails: string[] | undefined) =>
            (emails ?? []).every((email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) || 'Each entry must be an email address.',
          ),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Publishing settings'}),
  },
})
