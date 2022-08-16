import NextLink from 'next/link';
import { Link as MuiLink } from '@mui/material';
import React, { ForwardedRef, PropsWithChildren } from 'react';
import { UrlObject } from 'url';

export const Link = React.forwardRef(function Link (props: PropsWithChildren<Omit<Parameters<typeof MuiLink>[0], 'href'> & { href?: string | UrlObject }>, ref: ForwardedRef<HTMLAnchorElement>) {
    return <NextLink ref={ref} href={props.href ?? '#'} passHref>
        <MuiLink {...props} href={props.href?.toString()} color="inherit">{props.children}</MuiLink>
    </NextLink>;
});
