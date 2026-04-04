import { createRoot } from 'react-dom/client';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { BrowserRouter } from 'react-router';
import { App } from './App.js';
import './styles/global.css';

const container = document.getElementById('root');
const root = createRoot(container as HTMLDivElement);

root.render(
    <FluentProvider theme={webLightTheme}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </FluentProvider>,
);
