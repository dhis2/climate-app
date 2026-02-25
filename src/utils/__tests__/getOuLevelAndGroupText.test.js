import { getOuLevelAndGroupText } from '../getOuLevelAndGroupText.js'

describe('getOuLevelAndGroupText', () => {
    it('should handle empty items array', () => {
        expect(getOuLevelAndGroupText([])).toBe('')
    })

    it('should handle only org unit collections', () => {
        const items = [
            { id: 'ou1', name: 'District 1' },
            { id: 'ou2', name: 'District 2' },
        ]
        expect(getOuLevelAndGroupText(items)).toBe('')
    })

    it('should handle single level', () => {
        const items = [{ id: 'LEVEL-2', name: 'Region' }]
        expect(getOuLevelAndGroupText(items)).toBe('Region levels')
    })

    it('should handle single group', () => {
        const items = [{ id: 'OU_GROUP-1', name: 'Urban' }]
        expect(getOuLevelAndGroupText(items)).toBe('Urban groups')
    })

    it('should handle multiple levels with "and" conjunction', () => {
        const items = [
            { id: 'LEVEL-2', name: 'Region' },
            { id: 'LEVEL-3', name: 'District' },
        ]
        expect(getOuLevelAndGroupText(items)).toBe('Region and District levels')
    })

    it('should handle multiple groups with "and" conjunction', () => {
        const items = [
            { id: 'OU_GROUP-1', name: 'Urban' },
            { id: 'OU_GROUP-2', name: 'Rural' },
        ]
        expect(getOuLevelAndGroupText(items)).toBe('Urban and Rural groups')
    })

    it('should handle three levels with "and" for the last item', () => {
        const items = [
            { id: 'LEVEL-1', name: 'National' },
            { id: 'LEVEL-2', name: 'Region' },
            { id: 'LEVEL-3', name: 'District' },
        ]
        expect(getOuLevelAndGroupText(items)).toBe(
            'National, Region and District levels'
        )
    })

    it('should handle levels in an org unit', () => {
        const items = [
            { id: 'LEVEL-2', name: 'Region' },
            { id: 'ou1', name: 'Country A' },
        ]
        expect(getOuLevelAndGroupText(items)).toBe('Region levels in Country A')
    })

    it('should handle groups in an org unit', () => {
        const items = [
            { id: 'OU_GROUP-1', name: 'Urban' },
            { id: 'ou1', name: 'Country A' },
        ]
        expect(getOuLevelAndGroupText(items)).toBe('Urban groups in Country A')
    })

    it('should handle level in multiple org units', () => {
        const items = [
            { id: 'LEVEL-2', name: 'Region' },
            { id: 'ou1', name: 'Country A' },
            { id: 'ou2', name: 'Country B' },
        ]
        expect(getOuLevelAndGroupText(items)).toBe(
            'Region levels in Country A, Country B'
        )
    })

    it('should handle both levels and groups', () => {
        const items = [
            { id: 'LEVEL-2', name: 'Region' },
            { id: 'OU_GROUP-1', name: 'Urban' },
        ]
        const result = getOuLevelAndGroupText(items)
        expect(result).toContain('Urban groups')
        expect(result).toContain('Region levels')
        expect(result).toContain(' - ')
    })

    it('should handle levels and groups in an org unit', () => {
        const items = [
            { id: 'LEVEL-2', name: 'Region' },
            { id: 'OU_GROUP-1', name: 'Urban' },
            { id: 'ou1', name: 'Country A' },
        ]
        const result = getOuLevelAndGroupText(items)
        expect(result).toContain(
            'Urban groups in Country A - Region levels in Country A'
        )
    })

    it('should handle multiple levels and groups', () => {
        const items = [
            { id: 'LEVEL-2', name: 'Region' },
            { id: 'LEVEL-3', name: 'District' },
            { id: 'OU_GROUP-1', name: 'Urban' },
            { id: 'OU_GROUP-2', name: 'Rural' },
            { id: 'ou1', name: 'Country A' },
        ]
        const result = getOuLevelAndGroupText(items)
        expect(result).toContain(
            'Urban and Rural groups in Country A - Region and District levels in Country A'
        )
    })

    it('should handle special characters in names', () => {
        const items = [
            { id: 'LEVEL-2', name: 'Region & District' },
            { id: 'ou1', name: 'Country (A)' },
        ]
        expect(getOuLevelAndGroupText(items)).toBe(
            'Region & District levels in Country (A)'
        )
    })

    it('should respect order: groups first, then levels', () => {
        const items = [
            { id: 'LEVEL-2', name: 'Region' },
            { id: 'OU_GROUP-1', name: 'Urban' },
        ]
        const result = getOuLevelAndGroupText(items)
        const groupIndex = result.indexOf('Urban')
        const levelIndex = result.indexOf('Region')
        expect(groupIndex).toBeLessThan(levelIndex)
    })
})
