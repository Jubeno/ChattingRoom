import React from 'react';
import { Provider as WorkSpaceProvider } from './contexts/WorkSpace/WorkSpaceContext';
import { Provider as UserProfileProvider } from './contexts/UserProfile/UserProfileContext';
import { Provider as ChannelProvider } from './contexts/Channel/ChannelContext';

export const MainProvider = ({ children }) => {
    const ListProvider = [
        WorkSpaceProvider,
        UserProfileProvider,
        ChannelProvider
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