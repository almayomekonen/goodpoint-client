import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import { GroupMessageContext } from '../../common/contexts/GroupMessageContext';
import { SendGpModalContext } from '../../common/contexts/SendGpModalContext';
import { animationPathNameException, fromPathNameException } from '../../common/consts/pageAnimation.consts';
import { fadeIn } from '../../common/functions/pageFadeIn';
import DesktopSideBar from '../desktop-side-bar/DesktopSideBar';
import DesktopTopBar from '../desktop-top-bar/DesktopTopBar';
import { SendGpDesktop } from '../send-gp-desktop/SendGpDesktop';

import { useEffect, useRef } from 'react';

import './desktop-container.scss';

const DesktopContainer = () => {
    const outlet = useOutlet();
    const { pathname } = useLocation();

    const prevPathName = useRef<string | null>(null);
    const outletContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const isAnimationPathNameException = animationPathNameException.some((pathNameException) =>
            pathname.startsWith(pathNameException),
        );
        const isComingFromException =
            fromPathNameException.some((pathNameException) => prevPathName.current?.startsWith(pathNameException)) &&
            pathname == '/';

        if (!isAnimationPathNameException && !isComingFromException && outletContainerRef.current)
            fadeIn(outletContainerRef.current);

        prevPathName.current = pathname;
    }, [outlet]);

    return (
        <SendGpModalContext>
            <GroupMessageContext>
                <div className="desktop-container">
                    <SendGpDesktop />
                    <DesktopTopBar />
                    <DesktopSideBar />
                    <div className="content-container" ref={outletContainerRef}>
                        <Outlet />
                    </div>
                </div>
            </GroupMessageContext>
        </SendGpModalContext>
    );
};

export default DesktopContainer;
