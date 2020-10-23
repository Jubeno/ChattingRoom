import React from 'react';
import { Provider as WorkSpaceProvider } from './contexts/WorkSpace/WorkSpaceContext';
import { Provider as UserProfileProvider } from './contexts/UserProfile/UserProfileContext';

export const MainProvider = ({ children }) => {
    const ListProvider = [
        WorkSpaceProvider,
        UserProfileProvider
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