import i18n from '@dhis2/d2-i18n'
import { Tooltip, IconLocation24, IconEmptyFrame24 } from '@dhis2/ui'
import PropTypes from 'prop-types'

const OrgUntType = ({ type }) => (
    <Tooltip
        content={
            type === 'Point'
                ? i18n.t('Data for a location')
                : i18n.t('Data for an area')
        }
        placement="right"
    >
        {type === 'Point' && <IconLocation24 />}
        {(type === 'Polygon' || type === 'MultiPolygon') && (
            <IconEmptyFrame24 />
        )}
    </Tooltip>
)

OrgUntType.propTypes = {
    type: PropTypes.string,
}

export default OrgUntType
