import {useEffect, useState} from 'react'
import {
  useClient,
  useCurrentUser,
  useDocumentOperation,
  type DocumentActionComponent,
  type DocumentActionsResolver,
} from 'sanity'

/**
 * The review step for articles: anyone can write and mark an article "Ready
 * for review", but only the people named in Publishing settings can publish,
 * unpublish or delete one.
 *
 * This is enforced by the Studio, not by Sanity's own permissions (those need
 * a paid plan): it stops accidents, not someone determined to go around it.
 */

export const SETTINGS_ID = 'settings.publishing'
const API_VERSION = '2025-02-19'
const GATED = ['publish', 'unpublish', 'delete']

/** With nobody named yet, everyone may publish. */
export const isApprover = (email: string | undefined, approvers: string[] | null | undefined) =>
  !approvers?.length || (!!email && approvers.some((approver) => approver.trim().toLowerCase() === email.toLowerCase()))

/** undefined while the list is loading. */
function useCanPublish(): boolean | undefined {
  const client = useClient({apiVersion: API_VERSION})
  const user = useCurrentUser()
  const [approvers, setApprovers] = useState<string[] | null>()

  useEffect(() => {
    let current = true
    const load = () =>
      client
        .fetch<string[] | null>('*[_id == $id][0].approvers', {id: SETTINGS_ID})
        .then((list) => current && setApprovers(list ?? null))
        // If the list can't be read, stay locked rather than open.
        .catch(() => current && setApprovers(['']))
    load()
    const changes = client.listen('*[_id == $id]', {id: SETTINGS_ID}, {visibility: 'query'}).subscribe(load)
    return () => {
      current = false
      changes.unsubscribe()
    }
  }, [client])

  return approvers === undefined ? undefined : isApprover(user?.email, approvers)
}

function gated(original: DocumentActionComponent): DocumentActionComponent {
  const Action: DocumentActionComponent = (props) => {
    const result = original(props)
    const allowed = useCanPublish()
    const {patch} = useDocumentOperation(props.id, props.type)
    if (!result) return result

    if (!allowed) {
      return {
        ...result,
        disabled: true,
        title:
          allowed === undefined
            ? 'Checking who can publish…'
            : 'Only approvers can do this. Switch on "Ready for review" and an approver will take it from there.',
      }
    }
    if (original.action !== 'publish') return result
    return {
      ...result,
      onHandle: () => {
        // Published means reviewed: the next round of changes starts unmarked.
        if (props.draft?.readyForReview) patch.execute([{unset: ['readyForReview']}])
        result.onHandle?.()
      },
    }
  }
  Action.action = original.action
  Action.displayName = `Reviewed(${original.displayName ?? original.action})`
  return Action
}

export const reviewActions: DocumentActionsResolver = (prev, {schemaType}) =>
  schemaType === 'post' ? prev.map((action) => (action.action && GATED.includes(action.action) ? gated(action) : action)) : prev
