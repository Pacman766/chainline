import { CollectionAfterChangeHook } from 'payload'

export const afterChange: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  console.log(`[Products] ${operation}: ${doc?.name} (id: ${doc?.id})`)
}
