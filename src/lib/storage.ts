import { entries, set, del, get } from 'idb-keyval'

export interface Stamp {
  id: string
  blob: Blob
  createdAt: number
}

export async function listStamps(): Promise<Stamp[]> {
  const all = await entries<string, Stamp>()
  return all
    .map(([, value]) => value)
    .sort((a, b) => b.createdAt - a.createdAt)
}

export async function addStamp(blob: Blob): Promise<Stamp> {
  const stamp: Stamp = {
    id: crypto.randomUUID(),
    blob,
    createdAt: Date.now(),
  }
  await set(stamp.id, stamp)
  return stamp
}

export async function getStamp(id: string): Promise<Stamp | undefined> {
  return get<Stamp>(id)
}

export async function deleteStamp(id: string): Promise<void> {
  await del(id)
}
