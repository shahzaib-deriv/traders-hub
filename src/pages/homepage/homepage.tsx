import { useEffect } from 'react';
import { Fragment } from 'react/jsx-runtime';
import Cookies from 'js-cookie';

import { useAuthData } from '@deriv-com/api-hooks';
import { useDevice } from '@deriv-com/ui';

import { AppContainer, TradersHubDesktopContent, TradersHubHeader, TradersHubMobileContent } from '@/components';
import { Modals } from '@/modals/Modals';

export const Homepage = () => {
    const { isDesktop } = useDevice();
    const { activeLoginid, isAuthorized } = useAuthData();

    const setLoginCookie = (token: string) => {
        if (import.meta.env.MODE === 'production') {
            return Cookies.set('authToken', token, { domain: 'deriv.com', path: '/' });
        }
        Cookies.set('authToken', token);
    };

    useEffect(() => {
        if (isAuthorized && activeLoginid) {
            const clientAccounts = JSON.parse(localStorage.getItem('client.account_list') ?? '[]');

            const activeAccount = clientAccounts.find(
                (account: { loginid: string; token: string }) => account.loginid === activeLoginid
            );

            setLoginCookie(activeAccount.token);
        }
    }, [isAuthorized, activeLoginid]);

    return (
        <Fragment>
            <AppContainer>
                <div className='space-y-24 pt-48'>
                    <div className='flex justify-between flex-wrap items-center'>
                        <TradersHubHeader />
                    </div>
                    {!isDesktop ? <TradersHubMobileContent /> : <TradersHubDesktopContent />}
                </div>
            </AppContainer>
            <Modals />
        </Fragment>
    );
};
