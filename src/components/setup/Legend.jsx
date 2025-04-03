import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'

const Legend = ({ name, description, items }) => (
    <table>
        <caption>
            {i18n.t('Legend: "{{-name}}"', { name, nsSeparator: ';' })}
            {description && <p>{description}</p>}
        </caption>
        <thead>
            <tr>
                <th>{i18n.t('Name')}</th>
                <th>{i18n.t('Start value')}</th>
                <th>{i18n.t('End value')}</th>
                <th colSpan="2">{i18n.t('Color')}</th>
            </tr>
        </thead>
        <tbody>
            {items.map(({ name, from, to, hexColor }) => (
                <tr key={hexColor}>
                    <td>{name}</td>
                    <td>{from}</td>
                    <td>{to}</td>
                    <td>{hexColor}</td>
                    <td
                        style={{
                            backgroundColor: hexColor,
                            width: 50,
                        }}
                    ></td>
                </tr>
            ))}
        </tbody>
    </table>
)

Legend.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    items: PropTypes.array,
}

export default Legend
