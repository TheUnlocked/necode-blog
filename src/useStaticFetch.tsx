import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

const StaticFetchContext = createContext<(...args: Parameters<typeof fetch>) => any | Promise<any>>(() => {});

export function StaticFetchProvider(props: PropsWithChildren<{ fetch: (...args: Parameters<typeof fetch>) => Promise<any> }>) {
    return <StaticFetchContext.Provider value={props.fetch}>{props.children}</StaticFetchContext.Provider>;
}

export function useStaticFetch<T>(...args: Parameters<typeof fetch>): T | undefined {
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