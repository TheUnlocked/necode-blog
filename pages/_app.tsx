import '../styles/global.css';
import '../styles/prism-theme.css';
import '../styles/prism-plus.css';
import '../styles/prism-plus-extras.css';
import type { AppProps } from 'next/app'
import { AppBar, CssBaseline, Toolbar, useScrollTrigger } from '@mui/material';
import { Experimental_CssVarsProvider as CssVarsProvider, experimental_extendTheme as extendTheme } from '@mui/material/styles';
import { Link } from '../src/Link';

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
      sup: true;
    }
  }

const theme = extendTheme({
    components: {
        MuiTypography: {
            styleOverrides: {
                h1: ({ theme: { typography: { h3 } } }) => ({
                    ...h3,
                    fontWeight: 500,
                }),
                h2: ({ theme: { typography: { h4 } } }) => ({
                    ...h4,
                }),
                h3: ({ theme: { typography: { h5 } } }) => ({
                    ...h5,
                }),
                h4: ({ theme: { typography: { h6 } } }) => ({
                    ...h6,
                }),
                h5: ({ theme: { typography: { h6 } } }) => ({
                    ...h6,
                }),
            },
            variants: [
                {
                    props: { variant: 'sup' },
                    style: ({ theme: { typography: { caption } } }) => ({
                        ...caption,
                        verticalAlign: 'top',
                    })
                }
            ]
        },
    }
});

export default function MyApp({ Component, pageProps }: AppProps) {
    const shouldElevate = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0
    });

    return <CssVarsProvider defaultMode="system" enableColorScheme theme={theme}>
        <CssBaseline />
        <AppBar elevation={shouldElevate ? 4 : 0} position="sticky">
            <Toolbar disableGutters sx={{ px: 2 }}>
                <Link href="/" variant="h6" noWrap underline="hover">Home</Link>
            </Toolbar>
        </AppBar>
        <Component {...pageProps} />
    </CssVarsProvider>;
}

