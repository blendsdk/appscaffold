import * as React from 'react';
import { makeStyles, tokens, Title1, Body1, Button } from '@fluentui/react-components';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalL,
        padding: tokens.spacingVerticalXXL,
    },
});

export const Home: React.FC = () => {
    const styles = useStyles();

    return (
        <div className={styles.container}>
            <Title1>Welcome to {{PROJECT_NAME}}</Title1>
            <Body1>Your application is running successfully.</Body1>
            <Button appearance="primary">Get Started</Button>
        </div>
    );
};
