import React, { FC } from 'react';
import { useOutlet } from 'react-router-dom';
import { DefaultPlaceholderDesktop } from './DefaultPlaceholderDesktop';
import './desktopInnerContainer.scss';
import NavbarDesktop from './navbar/NavbarDesktop';

interface DesktopInnerContainerProps {
    children: React.ReactNode;
    divider?: boolean;
    width: 'small' | 'large';
    img?: string;
    navigationBar?: boolean;
}

export const DesktopInnerContainer: FC<DesktopInnerContainerProps> = ({
    children,
    divider,
    width,
    img,
    navigationBar,
}) => {
    const outlet = useOutlet();

    return (
        <div className={`generic-home-wrapper ${divider ? 'divider' : ''}`}>
            <div className={`main-container ${width}`}>
                {navigationBar && <NavbarDesktop />}
                {children}
            </div>
            <div className="sub-container">
                {img ? <img src={img} className="image" alt="" /> : outlet ?? <DefaultPlaceholderDesktop />}
            </div>
        </div>
    );
};
