import NextLink from 'next/link';
import { Link as MuiLink } from '@mui/material';
import { PropsWithChildren } from 'react';
import { UrlObject } from 'url';

export function Link(props: PropsWithChildren<Omit<Parameters<typeof MuiLink>[0], 'href'> & { href?: string | UrlObject }>) {
    return <NextLink href={props.href ?? '#'} passHref>
        <MuiLink {...props} color="inherit">{props.children}</MuiLink>
    </NextLink>;
}