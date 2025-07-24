import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { isDesktop } from '../../common/functions/isDesktop';
import { Favorite } from '@mui/icons-material';
import { Button } from '@mui/material';
import EastRoundedIcon from '@mui/icons-material/EastRounded';
import './innerTopBar.scss';

interface InnerTopBarProps {
    studyGroupName?: string;
    classIndex?: `${number}`;
    gradeString?: string;
    countGp: number;
}

/**
 * Represents the inner top bar component used in the students list by class / study group.
 *
 * @component
 * @param {string} [studyGroupName] - The name of the study group.
 * @param {string} [gradeString] - The grade string.
 * @param {string} [classIndex] - The class index.
 * @param {number} countGp - The count of good points.
 * @returns {JSX.Element} - The InnerTopBar component.
 */

export const InnerTopBar: FC<InnerTopBarProps> = ({ studyGroupName, gradeString, classIndex, countGp }) => {
    const navigate = useNavigate();

    return (
        <div className="inner-top-bar">
            <div className="arrow-and-title-container">
                <Button
                    onClick={() => {
                        if (document.location.pathname.includes('/gp-sent')) {
                            navigate(-2);
                        } else {
                            navigate(-1);
                        }
                    }}
                >
                    <EastRoundedIcon className="prev" />
                </Button>
                <div className="title">{studyGroupName || gradeString + ' ' + classIndex}</div>
            </div>
            <div className="heart">
                <div className="number">{countGp}</div>
                <Favorite className={clsx('heart-icon', isDesktop() && 'desktop')} />
            </div>
        </div>
    );
};
