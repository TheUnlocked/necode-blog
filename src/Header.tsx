import { AppBar, Stack, Toolbar, useScrollTrigger } from '@mui/material';
import { Link } from './Link';
import NecodeCat from './NecodeCat';

export default function Header() {
    const shouldElevate = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0
    });

    return <AppBar elevation={shouldElevate ? 4 : 0} position="sticky">
        <Toolbar disableGutters sx={{ px: 2 }}>
            <Stack direction="row" justifyContent="space-between" width="100%">
                <Link href="/" variant="h6" noWrap underline="hover">Home</Link>
                <a href="https://www.necode.org" className="necode-cat-link" aria-label="link to necode"><NecodeCat height="32px" /></a>
            </Stack>
        </Toolbar>
    </AppBar>;
}