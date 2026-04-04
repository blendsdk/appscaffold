import * as React from 'react';
import { Outlet } from 'react-router';
import { makeStyles, tokens, Title3 } from '@fluentui/react-components';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalXL}`,
        backgroundColor: tokens.colorBrandBackground,
        color: tokens.colorNeutralForegroundOnBrand,
    },
    main: {
        flex: 1,
        padding: tokens.spacingHorizontalXL,
    },
});

export const Layout: React.FC = () => {
    const styles = useStyles();

    return (
        <div className={styles.root}>
            <header className={styles.header}>
                <Title3>{{PROJECT_NAME}}</Title3>
            </header>
            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
};
