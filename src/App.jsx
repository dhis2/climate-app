import { DataSourcesProvider } from './components/DataSourcesProvider.jsx'
import Routes from './components/Routes.jsx'

import './locales/index.js'

const App = () => (
    <DataSourcesProvider>
        <Routes />
    </DataSourcesProvider>
)

export default App
