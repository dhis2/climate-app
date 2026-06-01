import { chunkFeaturesBySize } from '../ee-utils.js'

const makeFeature = (padKB = 0) => ({
    id: 'abc123',
    geometry: { type: 'Point', coordinates: [0, 0] },
    properties: { name: 'Test', _pad: 'x'.repeat(padKB * 1024) },
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
        // 10 features × 100KB each = ~1MB > 0.5MB limit
        const features = Array.from({ length: 10 }, () => makeFeature(100))
        const chunks = chunkFeaturesBySize(features)
        expect(chunks.length).toBeGreaterThan(1)
    })

    it('preserves all features across chunks with no duplicates or gaps', () => {
        const features = Array.from({ length: 10 }, (_, i) => ({
            ...makeFeature(100),
            id: `ou${i}`,
        }))
        const chunks = chunkFeaturesBySize(features)
        const flattened = chunks.flat()
        expect(flattened).toHaveLength(features.length)
        expect(flattened.map((f) => f.id)).toEqual(features.map((f) => f.id))
    })

    it('puts an oversized single feature in its own chunk', () => {
        // First feature alone exceeds the 0.5MB limit
        const features = [makeFeature(600), makeFeature(1)]
        const chunks = chunkFeaturesBySize(features)
        expect(chunks[0]).toHaveLength(1)
        expect(chunks[0][0].id).toBe(features[0].id)
        expect(chunks[1]).toHaveLength(1)
    })

    it('keeps features together when they fit cumulatively', () => {
        // 4 features × 100KB = ~400KB, just under 0.5MB limit
        const features = Array.from({ length: 4 }, () => makeFeature(100))
        const chunks = chunkFeaturesBySize(features)
        expect(chunks).toHaveLength(1)
    })
})
