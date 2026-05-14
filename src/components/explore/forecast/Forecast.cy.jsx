import React from 'react'
import exploreStore from '../../../store/exploreStore.js'
import Forecast from './Forecast.jsx'

const miami = {
    id: 'miami',
    displayName: 'Miami, Florida',
    geometry: {
        type: 'Point',
        coordinates: [-80.1918, 25.7617],
    },
}

const dubai = {
    id: 'dubai',
    displayName: 'Dubai',
    geometry: {
        type: 'Point',
        coordinates: [55.2708, 25.2048],
    },
}

const singapore = {
    id: 'singapore',
    displayName: 'Singapore',
    geometry: {
        type: 'Point',
        coordinates: [103.8198, 1.3521],
    },
}

const honolulu = {
    id: 'honolulu',
    displayName: 'Honolulu, Hawaii',
    geometry: {
        type: 'Point',
        coordinates: [-157.8583, 21.3069],
    },
}

const tromso = {
    id: 'tromso',
    displayName: 'Tromsø, Norway',
    geometry: {
        type: 'Point',
        coordinates: [18.9553, 69.6492],
    },
}

// Pacific Ocean — tzlookup returns null here, triggering browser timezone fallback
const pacificOcean = {
    id: 'ocean',
    displayName: 'Pacific Ocean',
    geometry: {
        type: 'Point',
        coordinates: [-160, 0],
    },
}

describe('Forecast', () => {
    describe('America/New_York timezone (Miami, Florida, ~8am local)', () => {
        beforeEach(() => {
            cy.intercept(
                'GET',
                'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=25.7617&lon=-80.1918',
                { fixture: 'metMiami_20260514T1151Z.json' }
            ).as('getForecast')

            exploreStore.setState({ orgUnit: miami })
        })

        it('shows the location timezone message', () => {
            cy.mount(<Forecast />)
            cy.wait('@getForecast')
            cy.contains(
                'The forecast is using the "America/New_York" time zone based on the location of your org unit.'
            ).should('be.visible')
        })

        it('renders forecast rows for the correct local dates', () => {
            cy.mount(<Forecast />)
            cy.wait('@getForecast')
            // 2026-05-14T11:00Z = 2026-05-14 07:00 America/New_York → Thu May 14 row visible
            cy.contains('Thu May 14').should('exist')
            cy.contains('Fri May 15').should('exist')
        })

        it('shows a day symbol in the 12-18 column of the first row', () => {
            cy.mount(<Forecast />)
            cy.wait('@getForecast')
            cy.get('tbody tr')
                .first()
                .find('td')
                .eq(3)
                .find('img')
                .should('have.attr', 'src')
                .and('match', /d\.png$/)
        })
    })

    describe('Asia/Dubai timezone (Dubai, ~4pm local)', () => {
        beforeEach(() => {
            cy.intercept(
                'GET',
                'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=25.2048&lon=55.2708',
                { fixture: 'metDubai_20260514T1151Z.json' }
            ).as('getForecast')

            exploreStore.setState({ orgUnit: dubai })
        })

        it('shows the location timezone message', () => {
            cy.mount(<Forecast />)
            cy.wait('@getForecast')
            cy.contains(
                'The forecast is using the "Asia/Dubai" time zone based on the location of your org unit.'
            ).should('be.visible')
        })

        it('renders forecast rows for the correct local dates', () => {
            cy.mount(<Forecast />)
            cy.wait('@getForecast')
            // 2026-05-14T11:00Z = 2026-05-14 15:00 Asia/Dubai → Thu May 14 row visible
            cy.contains('Thu May 14').should('exist')
            cy.contains('Fri May 15').should('exist')
        })

        it('shows a day symbol in the 12-18 column of the first row', () => {
            cy.mount(<Forecast />)
            cy.wait('@getForecast')
            cy.get('tbody tr')
                .first()
                .find('td')
                .eq(3)
                .find('img')
                .should('have.attr', 'src')
                .and('match', /d\.png$/)
        })
    })

    describe('Asia/Singapore timezone (Singapore, ~8pm local)', () => {
        beforeEach(() => {
            cy.intercept(
                'GET',
                'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=1.3521&lon=103.8198',
                { fixture: 'metSingapore_20260514T1151Z.json' }
            ).as('getForecast')

            exploreStore.setState({ orgUnit: singapore })
        })

        it('shows the location timezone message', () => {
            cy.mount(<Forecast />)
            cy.wait('@getForecast')
            cy.contains(
                'The forecast is using the "Asia/Singapore" time zone based on the location of your org unit.'
            ).should('be.visible')
        })

        it('renders forecast rows for the correct local dates', () => {
            cy.mount(<Forecast />)
            cy.wait('@getForecast')
            // 2026-05-14T11:00Z = 2026-05-14 19:00 Asia/Singapore → Thu May 14 row visible
            cy.contains('Thu May 14').should('exist')
            cy.contains('Fri May 15').should('exist')
        })

        it('shows no symbol in the 12-18 column of the first row', () => {
            cy.mount(<Forecast />)
            cy.wait('@getForecast')
            // 2026-05-14T11:00Z = 19:00 local — 12-18 has already passed, no data
            cy.get('tbody tr')
                .first()
                .find('td')
                .eq(3)
                .find('img')
                .should('not.exist')
        })
    })

    describe('Pacific/Honolulu timezone (Honolulu, ~2am local)', () => {
        beforeEach(() => {
            cy.intercept(
                'GET',
                'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=21.3069&lon=-157.8583',
                { fixture: 'metHonolulu_20260514T1151Z.json' }
            ).as('getForecast')

            exploreStore.setState({ orgUnit: honolulu })
        })

        it('shows the location timezone message', () => {
            cy.mount(<Forecast />)
            cy.wait('@getForecast')
            cy.contains(
                'The forecast is using the "Pacific/Honolulu" time zone based on the location of your org unit.'
            ).should('be.visible')
        })

        it('renders forecast rows for the correct local dates', () => {
            cy.mount(<Forecast />)
            cy.wait('@getForecast')
            // 2026-05-14T11:00Z = 2026-05-14 01:00 Pacific/Honolulu → Thu May 14 row visible
            cy.contains('Thu May 14').should('exist')
            cy.contains('Fri May 15').should('exist')
        })

        it('shows a night symbol in the 00-06 column of the first row', () => {
            cy.mount(<Forecast />)
            cy.wait('@getForecast')
            // first entry at 01:00 local — mid-block ('01' !== '00'), uses next_1_hours → night
            cy.get('tbody tr')
                .first()
                .find('td')
                .eq(1)
                .find('img')
                .should('have.attr', 'src')
                .and('match', /n\.png$/)
        })
    })

    describe('Europe/Oslo timezone (Tromsø, Norway, ~2pm local — midnight sun)', () => {
        beforeEach(() => {
            cy.intercept(
                'GET',
                'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=69.6492&lon=18.9553',
                { fixture: 'metTromso_20260514T1151Z.json' }
            ).as('getForecast')

            exploreStore.setState({ orgUnit: tromso })
        })

        it('shows the location timezone message', () => {
            cy.mount(<Forecast />)
            cy.wait('@getForecast')
            cy.contains(
                'The forecast is using the "Europe/Oslo" time zone based on the location of your org unit.'
            ).should('be.visible')
        })

        it('renders forecast rows for the correct local dates', () => {
            cy.mount(<Forecast />)
            cy.wait('@getForecast')
            // 2026-05-14T11:00Z = 2026-05-14 13:00 Europe/Oslo → Thu May 14 row visible
            cy.contains('Thu May 14').should('exist')
            cy.contains('Fri May 15').should('exist')
        })
    })

    describe.skip('browser timezone fallback (ocean coordinates)', () => {
        beforeEach(() => {
            cy.intercept(
                'GET',
                'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=0&lon=-160',
                { fixture: 'metMahosot.json' }
            ).as('getForecast')

            exploreStore.setState({ orgUnit: pacificOcean })
        })

        it('shows the browser timezone fallback message', () => {
            cy.mount(<Forecast />)
            cy.wait('@getForecast')
            cy.contains(
                'The forecast is using the time zone of your browser'
            ).should('be.visible')
        })
    })
})
