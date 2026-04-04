import { Routes, Route } from 'react-router';
import { Layout } from './components/Layout/Layout.js';
import { Home } from './pages/Home.js';

export const App: React.FC = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
            </Route>
        </Routes>
    );
};
