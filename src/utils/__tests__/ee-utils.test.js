import { chunkFeaturesBySize, retryOn502 } from '../ee-utils.js'

const makeFeature = (padKB = 0) => ({
    id: 'abc123',
    geometry: { type: 'Point', coordinates: [0, 0] },
    properties: { name: 'Test', _pad: 'x'.repeat(padKB * 1024) },
})

describe('retryOn502', () => {
    it('resolves immediately when fn succeeds first time', async () => {
        const fn = jest.fn().mockResolvedValue('ok')
        await expect(retryOn502(fn, 3, 0)).resolves.toBe('ok')
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('retries on 502 and resolves when fn eventually succeeds', async () => {
        const fn = jest
            .fn()
            .mockRejectedValueOnce('502 Bad Gateway')
            .mockRejectedValueOnce('502 Bad Gateway')
            .mockResolvedValue('ok')
        await expect(retryOn502(fn, 3, 0)).resolves.toBe('ok')
        expect(fn).toHaveBeenCalledTimes(3)
    })

    it('throws after exhausting all retries', async () => {
        const fn = jest.fn().mockRejectedValue('502 Bad Gateway')
        await expect(retryOn502(fn, 3, 0)).rejects.toBe('502 Bad Gateway')
        expect(fn).toHaveBeenCalledTimes(4) // initial + 3 retries
    })

    it('does not retry on non-502 errors', async () => {
        const fn = jest.fn().mockRejectedValue('some other error')
        await expect(retryOn502(fn, 3, 0)).rejects.toBe('some other error')
        expect(fn).toHaveBeenCalledTimes(1)
    })
})

describe('chunkFeaturesBySize', () => {
    it('returns a single chunk when features fit within the limit', () => {
        const features = [makeFeature(1), makeFeature(1)]
        expect(chunkFeaturesBySize(features)).toHaveLength(1)
    })

    it('returns all features in one chunk when input is empty', () => {
        expect(chunkFeaturesBySize([])).toHaveLength(0)
    })

    it('splits into multiple chunks when payload exceeds limit', () => {
        // 10 features × 250KB each = ~2.5MB > 2MB limit
        const features = Array.from({ length: 10 }, () => makeFeature(250))
        const chunks = chunkFeaturesBySize(features)
        expect(chunks.length).toBeGreaterThan(1)
    })

    it('preserves all features across chunks with no duplicates or gaps', () => {
        const features = Array.from({ length: 10 }, (_, i) => ({
            ...makeFeature(250),
            id: `ou${i}`,
        }))
        const chunks = chunkFeaturesBySize(features)
        const flattened = chunks.flat()
        expect(flattened).toHaveLength(features.length)
        expect(flattened.map((f) => f.id)).toEqual(features.map((f) => f.id))
    })

    it('puts an oversized single feature in its own chunk', () => {
        // First feature alone exceeds the 2MB limit
        const features = [makeFeature(2100), makeFeature(1)]
        const chunks = chunkFeaturesBySize(features)
        expect(chunks[0]).toHaveLength(1)
        expect(chunks[0][0].id).toBe(features[0].id)
        expect(chunks[1]).toHaveLength(1)
    })

    it('keeps features together when they fit cumulatively', () => {
        // 4 features × 100KB = ~400KB, well under 2MB limit
        const features = Array.from({ length: 4 }, () => makeFeature(100))
        const chunks = chunkFeaturesBySize(features)
        expect(chunks).toHaveLength(1)
    })
})
