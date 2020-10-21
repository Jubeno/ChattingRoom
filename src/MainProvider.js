import React from 'react';
import { Provider as WorkSpaceProvider } from './contexts/WorkSpace/WorkSpaceContext';

export const MainProvider = ({ children }) => {
    const ListProvider = [
        WorkSpaceProvider
    ].reduce(
        (PreProvider, CurrentProvider) => ({ children }) => (
            <PreProvider>
                <CurrentProvider>
                    {children}
                </CurrentProvider>
            </PreProvider>
        ), 
        ({children}) => <>{children}</>
    )

    return <ListProvider>{children}</ListProvider>
}