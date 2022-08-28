import { IssueClosedIcon, IssueOpenedIcon, SkipIcon } from '@primer/octicons-react';
import { Link } from 'src/Link';
import { useStaticFetch } from 'src/useStaticFetch';

export interface IssueProps {
    repo?: string;
    id: number;
}

export default function Issue({ repo, id }: IssueProps) {
    const {
        title = '',
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

    return <>
        {icon}
        <Link className="gh-issue-reference" sx={{ ml: 0.5 }} href={html_url}>
            <span style={{ fontWeight: 600 }}>{title} </span>
            <span style={{ color: 'var(--mui-palette-text)' }}>#{id}</span>
        </Link>
    </>;
}