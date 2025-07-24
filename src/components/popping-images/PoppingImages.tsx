import { Box } from '@mui/material';
import clsx from 'clsx';
import { FC } from 'react';
import { isDesktop } from '../../common/functions/isDesktop';
interface Props {
    imgSrc: string;
    isActive: boolean;
}

/**
 * This component displays a spray of images coming from the center of the screen and popping out to random directions using a sass animation
 * @param imgSrc - the image source
 * @param isActive - is the image active
 */
export const PoppingImages: FC<Props> = ({ imgSrc, isActive }) => {
    const isInDesktop = isDesktop();
    return (
        <div className="popping-images-container">
            {isActive &&
                [...Array(isInDesktop ? 40 : 30)].map((_, index) => {
                    return (
                        <div
                            key={index}
                            className={clsx('popping-image-container', `popping-image-container-${index}`)}
                        >
                            <Box className="popping-image" component={'img'} src={imgSrc} />
                        </div>
                    );
                })}
        </div>
    );
};
