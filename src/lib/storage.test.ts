import { afterEach, describe, expect, it } from 'vitest'
import { clear } from 'idb-keyval'
import { addStamp, deleteStamp, getStamp, listStamps } from './storage'

afterEach(async () => {
  await clear()
})

function makeBlob(text = 'fake-image-bytes'): Blob {
  return new Blob([text], { type: 'image/jpeg' })
}

describe('storage', () => {
  it('returns an empty list when nothing stored', async () => {
    const stamps = await listStamps()
    expect(stamps).toEqual([])
  })

  it('persists a stamp and returns it from listStamps', async () => {
    const stamp = await addStamp(makeBlob())
    const stamps = await listStamps()

    expect(stamps).toHaveLength(1)
    expect(stamps[0].id).toBe(stamp.id)
    expect(stamps[0].blob).toBeDefined()
    expect(typeof stamps[0].createdAt).toBe('number')
  })

  it('lists stamps newest first', async () => {
    const first = await addStamp(makeBlob('a'))
    await new Promise((r) => setTimeout(r, 5))
    const second = await addStamp(makeBlob('b'))

    const stamps = await listStamps()
    expect(stamps.map((s) => s.id)).toEqual([second.id, first.id])
  })

  it('retrieves a single stamp by id', async () => {
    const stamp = await addStamp(makeBlob('one'))
    const fetched = await getStamp(stamp.id)
    expect(fetched?.id).toBe(stamp.id)
  })

  it('returns undefined for unknown id', async () => {
    const fetched = await getStamp('does-not-exist')
    expect(fetched).toBeUndefined()
  })

  it('deletes a stamp', async () => {
    const stamp = await addStamp(makeBlob())
    await deleteStamp(stamp.id)

    expect(await getStamp(stamp.id)).toBeUndefined()
    expect(await listStamps()).toEqual([])
  })

  it('generates unique ids for each stamp', async () => {
    const a = await addStamp(makeBlob('a'))
    const b = await addStamp(makeBlob('b'))
    expect(a.id).not.toBe(b.id)
  })
})
