import { toGeoJson } from '../toGeoJson.js'

describe('toGeoJson', () => {
    it('should convert a Point organisation unit to GeoJSON', () => {
        const organisationUnits = [
            {
                id: 'ou1',
                na: 'Org Unit 1',
                co: '[10.5, 20.5]',
                ty: 1,
                le: 3,
                hcd: true,
                hcu: false,
                pg: '/grandparentId/parentId',
                pi: 'parentId',
                pn: 'Parent name',
            },
        ]

        const result = toGeoJson(organisationUnits)

        expect(result).toHaveLength(1)
        expect(result[0]).toEqual({
            type: 'Feature',
            id: 'ou1',
            geometry: {
                type: 'Point',
                coordinates: [10.5, 20.5],
            },
            properties: {
                type: 'Point',
                id: 'ou1',
                name: 'Org Unit 1',
                hasCoordinatesDown: true,
                hasCoordinatesUp: false,
                level: 3,
                grandParentParentGraph: '',
                grandParentId: 'grandparentId',
                parentGraph: '/grandparentId/parentId',
                parentId: 'parentId',
                parentName: 'Parent name',
                dimensions: undefined,
            },
        })
    })

    it('should convert a Polygon organisation unit to GeoJSON', () => {
        const organisationUnits = [
            {
                id: 'ou2',
                na: 'Org Unit 2',
                co: '[[[10, 20], [15, 25], [10, 30], [10, 20]]]',
                ty: 2,
                le: 2,
                hcd: false,
                hcu: true,
                pg: '/root',
                pi: 'root',
                pn: 'Root',
            },
        ]

        const result = toGeoJson(organisationUnits)

        expect(result).toHaveLength(1)
        expect(result[0].geometry.type).toBe('Polygon')
        expect(result[0].properties.type).toBe('Polygon')
        expect(result[0].geometry.coordinates).toEqual([
            [
                [10, 20],
                [15, 25],
                [10, 30],
                [10, 20],
            ],
        ])
    })

    it('should convert a MultiPolygon organisation unit to GeoJSON', () => {
        const organisationUnits = [
            {
                id: 'ou3',
                na: 'Org Unit 3',
                co: '[[[[10, 20], [15, 25], [10, 30], [10, 20]]]]',
                ty: 2,
                le: 1,
                hcd: true,
                hcu: true,
                pg: '',
                pi: '',
                pn: '',
            },
        ]

        const result = toGeoJson(organisationUnits)

        expect(result).toHaveLength(1)
        expect(result[0].geometry.type).toBe('MultiPolygon')
        expect(result[0].properties.type).toBe('MultiPolygon')
    })

    it('should sort organisation units by level', () => {
        const organisationUnits = [
            {
                id: 'ou3',
                na: 'Level 3',
                co: '[10, 20]',
                ty: 1,
                le: 3,
                pg: '',
            },
            {
                id: 'ou1',
                na: 'Level 1',
                co: '[10, 20]',
                ty: 1,
                le: 1,
                pg: '',
            },
            {
                id: 'ou2',
                na: 'Level 2',
                co: '[10, 20]',
                ty: 1,
                le: 2,
                pg: '',
            },
        ]

        const result = toGeoJson(organisationUnits)

        expect(result).toHaveLength(3)
        expect(result[0].id).toBe('ou1')
        expect(result[1].id).toBe('ou2')
        expect(result[2].id).toBe('ou3')
    })

    it('should extract grandParentId when parent graph has multiple levels', () => {
        const organisationUnits = [
            {
                id: 'ou1',
                na: 'Org Unit',
                co: '[10, 20]',
                ty: 1,
                le: 4,
                pg: '/gp1/gp2/parent',
                pi: 'parent',
                pn: 'Parent',
            },
        ]

        const result = toGeoJson(organisationUnits)

        expect(result[0].properties.grandParentId).toBe('gp2')
        expect(result[0].properties.grandParentParentGraph).toBe('/gp1')
    })

    it('should handle empty grandParentParentGraph when only grandparent exists', () => {
        const organisationUnits = [
            {
                id: 'ou1',
                na: 'Org Unit',
                co: '[10, 20]',
                ty: 1,
                le: 3,
                pg: '/gp/parent',
                pi: 'parent',
                pn: 'Parent',
            },
        ]

        const result = toGeoJson(organisationUnits)

        expect(result[0].properties.grandParentId).toBe('gp')
        expect(result[0].properties.grandParentParentGraph).toBe('')
    })

    it('should handle empty parent graph', () => {
        const organisationUnits = [
            {
                id: 'ou1',
                na: 'Org Unit',
                co: '[10, 20]',
                ty: 1,
                le: 1,
                pg: '',
                pi: '',
                pn: '',
            },
        ]

        const result = toGeoJson(organisationUnits)

        expect(result[0].properties.grandParentId).toBe('')
        expect(result[0].properties.grandParentParentGraph).toBe('')
    })

    it('should filter out organisation units with empty coordinates', () => {
        const organisationUnits = [
            {
                id: 'ou1',
                na: 'Valid Unit',
                co: '[10, 20]',
                ty: 1,
                le: 1,
                pg: '',
            },
            {
                id: 'ou2',
                na: 'Invalid Unit',
                co: '[]',
                ty: 1,
                le: 2,
                pg: '',
            },
        ]

        const result = toGeoJson(organisationUnits)

        expect(result).toHaveLength(1)
        expect(result[0].id).toBe('ou1')
    })

    it('should filter out organisation units with non-array coordinates', () => {
        const organisationUnits = [
            {
                id: 'ou1',
                na: 'Valid Unit',
                co: '[10, 20]',
                ty: 1,
                le: 1,
                pg: '',
            },
            {
                id: 'ou2',
                na: 'Invalid Unit',
                co: 'null',
                ty: 1,
                le: 2,
                pg: '',
            },
        ]

        const result = toGeoJson(organisationUnits)

        expect(result).toHaveLength(1)
        expect(result[0].id).toBe('ou1')
    })

    it('should include dimensions property if present', () => {
        const organisationUnits = [
            {
                id: 'ou1',
                na: 'Org Unit',
                co: '[10, 20]',
                ty: 1,
                le: 1,
                pg: '',
                dimensions: {
                    dx: ['indicator1'],
                    pe: ['202101'],
                },
            },
        ]

        const result = toGeoJson(organisationUnits)

        expect(result[0].properties.dimensions).toEqual({
            dx: ['indicator1'],
            pe: ['202101'],
        })
    })

    it('should handle multiple organisation units', () => {
        const organisationUnits = [
            {
                id: 'ou1',
                na: 'Unit 1',
                co: '[10, 20]',
                ty: 1,
                le: 1,
                pg: '',
            },
            {
                id: 'ou2',
                na: 'Unit 2',
                co: '[30, 40]',
                ty: 1,
                le: 2,
                pg: '/ou1',
            },
            {
                id: 'ou3',
                na: 'Unit 3',
                co: '[[[[50, 60], [55, 65], [50, 70], [50, 60]]]]',
                ty: 2,
                le: 3,
                pg: '/ou1/ou2',
            },
        ]

        const result = toGeoJson(organisationUnits)

        expect(result).toHaveLength(3)
        expect(result[0].id).toBe('ou1')
        expect(result[1].id).toBe('ou2')
        expect(result[2].id).toBe('ou3')
        expect(result[2].geometry.type).toBe('MultiPolygon')
    })
})
