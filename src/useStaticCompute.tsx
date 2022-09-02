import { createContext, PropsWithChildren, useCallback, useContext, useId, useMemo, useRef } from 'react';

export type StaticComputeRunner = (computeId: string, callback: () => Promise<any>) => any;

interface StaticComputeContextValue {
    computeRunner: StaticComputeRunner;
    getComputeIdFromReactId(reactId: string): string;
}

const StaticComputeContext = createContext<StaticComputeContextValue>({ computeRunner: () => {}, getComputeIdFromReactId: () => '' });

export function StaticComputeProvider({ computeRunner, children }: PropsWithChildren<{ computeRunner: StaticComputeRunner }>) {
    const idRef = useRef(0);
    const reactIdMapRef = useRef<{ [reactId: string]: number }>({});

    // React.useId is stable, but depends on parent component structure.
    // Because static computation is gathered from rendering only a subset of the virtual DOM,
    // these IDs are not consistent between computation gathering and actual rendering.
    // Incrementing IDs do have this consistency, but they encounter issues during hydration,
    // where a component might be created twice, thus incrementing the ID multiple times.
    // useId does not have that issue since it's based on VDOM structure, so I use
    // incrementing IDs for the actual ID and useId to detect if we've seen an element before
    // and should reuse its incrementing ID.
    const getComputeIdFromReactId = useCallback((reactId: string) => {
        if (!(reactId in reactIdMapRef.current)) {
            reactIdMapRef.current[reactId] = idRef.current++;
        }
        return reactIdMapRef.current[reactId].toString();
    }, []);
    return <StaticComputeContext.Provider value={{ computeRunner, getComputeIdFromReactId }}>
        {children}
    </StaticComputeContext.Provider>;
}

export function useStaticCompute<T>(callback: () => Promise<T>): T | undefined {
    const { computeRunner, getComputeIdFromReactId } = useContext(StaticComputeContext);
    const reactId = useId();
    const computeId = useMemo(() => getComputeIdFromReactId(reactId), [reactId, getComputeIdFromReactId]);
    return useMemo(() => computeRunner(computeId, callback), [computeId, computeRunner, callback]);
}