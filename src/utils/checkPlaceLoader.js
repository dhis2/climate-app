import { findLocation } from '../data/locations.js'

const checkPlaceLoader = async ({ params }) => {
    const location = findLocation(params.placeId)

    return {
        ...location,
        properties: {
            name: location.displayName,
        },
    }
}

export default checkPlaceLoader
