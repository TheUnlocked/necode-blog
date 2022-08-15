import { getInitColorSchemeScript } from '@mui/material';
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    // Default theme is dark, will be overridden if JS is enabled
    return <Html data-mui-color-scheme="dark">
        <Head>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
            {getInitColorSchemeScript({ enableSystem: true })}
            <Main />
            <NextScript />
        </body>
    </Html>;
}
