import React from 'react';
export default function bindLifecycle<P = any>(Component: React.ComponentClass<P>): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<{}>> & {
    contextType: React.Context<any> | undefined;
    getDerivedStateFromError: React.GetDerivedStateFromError<P, any> | undefined;
};
