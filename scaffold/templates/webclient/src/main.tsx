import { createRoot } from 'react-dom/client';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { BrowserRouter } from 'react-router';
{{GLOBALLOADER_IMPORT}}
{{I18N_PROVIDER_IMPORT}}
import { App } from './App.js';
import './styles/global.css';

const container = document.getElementById('root');
const root = createRoot(container as HTMLDivElement);

root.render(
    <FluentProvider theme={webLightTheme}>
{{GLOBALLOADER_OPEN}}
{{I18N_PROVIDER_OPEN}}
            <BrowserRouter>
                <App />
            </BrowserRouter>
{{I18N_PROVIDER_CLOSE}}
{{GLOBALLOADER_CLOSE}}
    </FluentProvider>,
);
