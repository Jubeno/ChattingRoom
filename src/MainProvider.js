import React from 'react';
import { Provider as WorkSpaceProvider } from './contexts/WorkSpace/WorkSpaceContext';
import { Provider as UserProfileProvider } from './contexts/UserProfile/UserProfileContext';
import { Provider as ChannelProvider } from './contexts/Channel/ChannelContext';
import { Provider as GeneralProvider } from './contexts/General/GeneralContext';

export const MainProvider = ({ children }) => {
    const ListProvider = [
        WorkSpaceProvider,
        UserProfileProvider,
        ChannelProvider,
        GeneralProvider
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