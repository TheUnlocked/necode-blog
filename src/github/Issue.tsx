import { IssueClosedIcon, IssueOpenedIcon, SkipIcon } from '@primer/octicons-react';
import { Link } from 'src/Link';
import { useStaticFetch } from 'src/useStaticFetch';
import reactStringReplace from 'react-string-replace';
import { useMemo } from 'react';

export interface IssueProps {
    repo?: string;
    id: number;
    short?: boolean
}

export default function Issue({ repo, id, short }: IssueProps) {
    const {
        title: titleRaw = '',
        state = 'open',
        state_reason = null,
        html_url = `https://github.com/${repo ?? 'TheUnlocked/Necode'}/issues/${id}`,
    } = useStaticFetch<{
        title: string,
        state: 'open' | 'closed',
        state_reason: 'not_planned' | null,
        html_url: string,
    }>(`https://api.github.com/repos/${repo ?? 'TheUnlocked/Necode'}/issues/${id}`, {
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: process.env.GITHUB_TOKEN!
        }
    }) ?? {};

    const icon = state === 'open'
        ? <IssueOpenedIcon fill="var(--gh-color-open-fg)" verticalAlign="text-top" />
        : state_reason === 'not_planned'
        ? <SkipIcon fill="var(--gh-color-fg-muted)" verticalAlign="text-top" />
        : <IssueClosedIcon fill="var(--gh-color-done-fg)" verticalAlign="text-top" />

    if (short) {
        return <Link className="gh-issue-reference" href={html_url} title={titleRaw}>
            <span style={{ color: 'var(--mui-palette-text)' }}>#{id}</span>
        </Link>;
    }

    const title = reactStringReplace(
        titleRaw,
        /(`[^`]+`)/,
        (match, i) => <code key={i}>{match.slice(1, -1)}</code>
    );

    return <>
        {icon}
        <Link className="gh-issue-reference" sx={{ ml: 0.5 }} href={html_url} title={titleRaw}>
            <span style={{ fontWeight: 600 }}>{title} </span>
            <span style={{ color: 'var(--mui-palette-text)' }}>#{id}</span>
        </Link>
    </>;
}