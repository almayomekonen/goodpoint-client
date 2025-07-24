import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { Box, Fade } from '@mui/material';
import { FC, ReactElement, RefObject, useEffect, useState } from 'react';
import { isDesktop } from '../../common/functions/isDesktop';
import { scrollTo } from '../../common/functions/scrollTo';
import './scrollable.scss';

interface props {
    children: ReactElement;
    containerRef: RefObject<HTMLDivElement>;
    dir: 'topToBottom' | 'bottomToTop';
}

export const Scrollable: FC<props> = ({ children, containerRef, dir }) => {
    const [toggleArrowUp, setToggleArrowUp] = useState(false);
    //scroll to top incase the component didn't render at the top
    useEffect(() => {
        if (containerRef?.current && dir === 'topToBottom') scrollTo('top', 'auto', containerRef);
    }, []);

    useEffect(() => {
        containerRef.current?.addEventListener('scroll', handleScroll);
        return () => containerRef?.current?.removeEventListener('scroll', handleScroll);
    }, []);

    function handleScroll() {
        if (!containerRef?.current) return;
        if (dir === 'topToBottom') {
            if (containerRef.current.scrollTop > 300) {
                setToggleArrowUp(true);
            } else setToggleArrowUp(false);
        } else {
            //dir==='bottomToTop'
            if (containerRef.current.scrollTop < -300) setToggleArrowUp(true);
            else setToggleArrowUp(false);
        }
    }

    function handleScrollTo() {
        if (!containerRef?.current) return;
        if (dir === 'topToBottom') scrollTo('top', 'smooth', containerRef);
        else scrollTo('bottom', 'smooth', containerRef);
    }

    return (
        <Box height={'100%'} width={'100%'}>
            {children}
            <Fade in={toggleArrowUp} timeout={{ enter: 700, exit: 400 }}>
                <Box
                    position={isDesktop() ? 'absolute' : 'fixed'}
                    className={dir === 'bottomToTop' ? 'arrow-down-container' : 'arrow-up-container'}
                    onClick={handleScrollTo}
                >
                    {dir === 'topToBottom' ? (
                        <ArrowUpward className="arrow-scroll-icon" />
                    ) : (
                        <ArrowDownward className="arrow-scroll-icon" />
                    )}
                </Box>
            </Fade>
        </Box>
    );
};
