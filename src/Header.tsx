import { AppBar, IconButton, Stack, Toolbar, useColorScheme, useScrollTrigger } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { Link } from './Link';
import NecodeCat from './NecodeCat';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import useHydrated from './useHydrated';

function ThemeToggleButton() {
    const { systemMode, mode, setMode } = useColorScheme();

    const hydrated = useHydrated();

    const updateMode = useCallback(() => {
        setMode(({
            system: 'light',
            light: 'dark',
            dark: 'system',
        } as const)[mode!]);
    }, [mode, setMode]);

    const icon = useMemo(() => {
        switch (mode) {
            case 'system':
                return systemMode === 'light'
                    ? <LightModeOutlinedIcon aria-label="system light theme" />
                    : <DarkModeOutlinedIcon aria-label="system dark theme" />;
            case 'light':
                return <LightModeIcon aria-label="light theme" />;
            case 'dark':
                return <DarkModeIcon aria-label="dark theme" />;
        }
    }, [mode, systemMode]);

    if (!hydrated) {
        return <></>;
    }

    return <IconButton color="inherit" onClick={updateMode} aria-label="toggle color theme">{icon}</IconButton>;
}

export default function Header() {
    const shouldElevate = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0
    });

    return <AppBar elevation={shouldElevate ? 4 : 0} position="sticky">
        <Toolbar disableGutters sx={{ px: 2 }}>
            <Stack direction="row" justifyContent="space-between" width="100%">
                <Link href="/" variant="h6" noWrap underline="hover">Home</Link>
                <Stack direction="row" alignItems="center" columnGap="1em">
                    <ThemeToggleButton />
                    <a href="https://www.necode.org" className="necode-cat-link" style={{ lineHeight: 0 }} aria-label="link to necode"><NecodeCat height="32px" /></a>
                </Stack>
            </Stack>
        </Toolbar>
    </AppBar>;
}