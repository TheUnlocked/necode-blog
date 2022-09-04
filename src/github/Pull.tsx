import { GitMergeIcon, GitPullRequestClosedIcon, GitPullRequestDraftIcon, GitPullRequestIcon } from '@primer/octicons-react';
import { Link } from 'src/Link';
import { useStaticFetch } from 'src/useStaticFetch';
import reactStringReplace from 'react-string-replace';

export interface PullProps {
    repo?: string;
    id: number;
    short?: boolean;
}

export default function Pull({ repo, id, short }: PullProps) {
    const {
        title: titleRaw = '',
        state = 'open',
        draft = false,
        merged = false,
        html_url = `https://github.com/${repo ?? 'TheUnlocked/Necode'}/pulls/${id}`,
    } = useStaticFetch<{
        title: string,
        state: 'open' | 'closed',
        draft: boolean,
        merged: boolean,
        html_url: string,
    }>(`https://api.github.com/repos/${repo ?? 'TheUnlocked/Necode'}/pulls/${id}`, {
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: process.env.GITHUB_TOKEN!
        }
    }) ?? {};

    const icon = state === 'open'
        ? draft
            ? <GitPullRequestDraftIcon fill="var(--gh-color-fg-muted)" />
            : <GitPullRequestIcon fill="var(--gh-color-open-fg)" verticalAlign="text-top" />
        : merged
            ? <GitMergeIcon fill="var(--gh-color-done-fg)" verticalAlign="text-top" />
            : <GitPullRequestClosedIcon fill="var(--gh-color-closed-fg)" verticalAlign="text-top" />

    if (short) {
        return <Link className="gh-pull-reference" href={html_url} title={titleRaw}>
            {repo}
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
        <Link className="gh-pull-reference" sx={{ ml: 0.5 }} href={html_url} title={titleRaw}>
            <span style={{ fontWeight: 600 }}>{title} </span>
            {repo}
            <span style={{ color: 'var(--mui-palette-text)' }}>#{id}</span>
        </Link>
    </>;
}