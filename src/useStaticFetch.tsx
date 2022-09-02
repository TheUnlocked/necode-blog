import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

export type StaticFetcherType = (url: string, init?: RequestInit | undefined) => Promise<Response>;

const StaticFetchContext = createContext<(...args: Parameters<StaticFetcherType>) => any | Promise<any>>(() => {});

export function StaticFetchProvider(props: PropsWithChildren<{ fetch: (...args: Parameters<StaticFetcherType>) => Promise<any> }>) {
    return <StaticFetchContext.Provider value={props.fetch}>{props.children}</StaticFetchContext.Provider>;
}

export function useStaticFetch<T>(...args: Parameters<StaticFetcherType>): T | undefined {
    const fetcher = useContext(StaticFetchContext);
    const data = useMemo(() => fetcher(...args), [fetcher, args]);
    const [result, setResult] = useState(data instanceof Promise ? undefined : data);

    useEffect(() => {
        if (data instanceof Promise) {
            data.then(setResult);
        }
        else {
            setResult(data);
        }
    }, [data])

    return result;
}