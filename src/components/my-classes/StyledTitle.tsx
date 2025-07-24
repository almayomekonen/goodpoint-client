import React, { FC, ReactNode } from 'react';
import { useUser } from '../../common/contexts/UserContext';
import { useI18n } from '../../i18n/mainI18n';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './styledTitle.scss';

interface StyledTitleProps {
    children?: ReactNode;
}

export const StyledMyClassesHeadline: FC<StyledTitleProps> = ({ children }) => {
    const { user } = useUser();
    const { general } = useI18n((i18n) => ({ general: i18n.general, errors: i18n.errors }));

    return (
        <div className="styled-headline-container">
            <div className={'content-wrapper'}>
                <h1 className="name">
                    {`${general.hello}, ${user.firstName || general.user} ${user.lastName || ''}`}{' '}
                </h1>
                {Number(general.goodPoints) ? (
                    <h2 className="status">{`${general.youHave} ${user.goodPointsCount} ${general.goodPoints}`}</h2>
                ) : (
                    <h2 className="status flex-center">
                        {' '}
                        <FavoriteIcon className="favoriteIcon" />{' '}
                        {user.goodPointsCount
                            ? ` ${general.youSent} ${user.goodPointsCount} ${general.goodPoints} `
                            : general.hasntSentGoodPoints}{' '}
                    </h2>
                )}
                <div className="left-invisible-div"></div>
                <div className="children">{children}</div>
            </div>
        </div>
    );
};
