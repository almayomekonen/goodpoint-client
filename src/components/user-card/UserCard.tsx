import React from 'react';

import Favorite from '@mui/icons-material/Favorite';
import { Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { EmojiPaths } from '../../common/consts';
import { formatDateTime } from '../../common/functions/format-date-time';
import { isNow } from '../../common/functions/isToday';
import { UserCardProps } from '../../common/interfaces/card-types-interfaces';
import { useI18n } from '../../i18n/mainI18n';
import { CheckBox } from '../checkbox/CheckBox';
import { EmojisBar } from '../emojis/EmojisBar';
import { BookMarkIcon } from './BookMarkIcon';

import { ReactToGp } from './ReactToGp';
import './user-card.scss';

/** The user card component is a card that displays a user information , it can be used in different places in the app,
 * like user activity, received good points , the send gp list , the study group list , the class list , the user list,
 * the user list in the admin panel , the user list in the teacher panel , the user list in the class panel , the user list in the study group panel, etc...
 * @param cardType the type of the card , the card type is used to determine the card content
 */
export const UserCard: React.FC<UserCardProps> = (props) => {
    const [isHovering, setIsHovering] = React.useState(false);
    const i18n = useI18n((i) => ({
        grades: i.schoolGrades.gradesList,
        goodPoints: i.general.goodPoints,
        classRoom: i.sendingGoodPointList.classRoom,
        now: i.general.now,
    }));

    const theme = useTheme();

    //getting the card description depending on the card type
    const getDescription = () => {
        switch (props.cardType) {
            case 'class': //meaning this is a class card ,then is has no description
            case 'user-name': //meaning this is just a name card
                return null;
            case 'user-gpCount': //only display gpCount
                if (props.isHeader) {
                    return (
                        <Typography className="flex-center " color="#678691" fontSize="1em">
                            <Favorite htmlColor={theme.customColors.blue} className="header-user-card-heart-icon" />
                            {props.gpCount + ' ' + i18n.goodPoints}
                        </Typography>
                    );
                }
                return null;
            case 'user-class-gpCount':
            case 'user-class':
                return (
                    //display grade,class index and gpCount
                    <Box color={props.checkbox ? '#081D5A' : '#154754'} className="user-card-description">
                        {props.classRoom && (
                            <Box className="flex-center" gap="0.2em">
                                <Typography fontSize="1.2em">
                                    {props.classRoom && i18n.grades[props.classRoom?.grade] + ' '}
                                </Typography>
                                <Typography fontSize="1.2em">{props.classRoom.classIndex}</Typography>
                            </Box>
                        )}
                    </Box>
                );

            case 'user-activity-teachers':
            case 'user-activity':
                return (
                    <Typography color={theme.customColors.blue} className="user-card-description">
                        {props.description}
                    </Typography>
                );

            case 'received-good-points':
                return (
                    <Typography color="#678691" className="received-good-points-description">
                        {props.description}
                    </Typography>
                );
        }
    };

    //header text depending on the card type
    const getHeaderText = () => {
        switch (props.cardType) {
            case 'study-group':
                return props.name;
            case 'class':
                return i18n.classRoom + ' ' + i18n.grades[props.classRoom.grade] + ' ' + props.classRoom.classIndex;
            default:
                return (props.firstName ?? '') + ' ' + (props.lastName ?? '');
        }
    };

    //handle bookmark in case of class card
    const handleBookMark = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (props.cardType === 'class' || props.cardType === 'study-group') {
            //mutation of card is expected here
            props.handleBookMark();
        }
    };
    const headerText = getHeaderText();
    const description = getDescription();

    let circleColor = '';
    if (props.cardType === 'class' || props.cardType === 'user-class-gpCount') {
        circleColor = `grade-${props.classRoom?.grade}-color`;
    } else if (props.cardType === 'user-gpCount' || props.cardType === 'user-name') {
        circleColor = `grade-${props?.grade}-color`;
    }

    return (
        <Box
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`card-container`}
        >
            {/**react with emojis to received gp */}
            {props.cardType === 'received-good-points' && props.gpId && (
                <ReactToGp currentEmoji={props.reaction} gpId={props.gpId} isHovering={isHovering} />
            )}

            <div
                data-date={
                    (props.cardType == 'received-good-points' || props.cardType == 'user-activity') &&
                    formatDateTime(props.date, 'date')
                }
                className={clsx(
                    'user-card-container',
                    props.isHeader && 'header-user-card-container',
                    props.className,
                    props.checkbox && 'editing-user-card-container',
                    (props.cardType === 'class' || props.cardType === 'study-group') &&
                        'user-card-class-type-container',
                    props.cardType + '-container',
                )}
                style={{
                    background: props.highlight ? theme.customColors.light_blue2 : undefined,
                }}
            >
                {/**reaction image in case of received gps card type */}
                <AnimatePresence>
                    {(props.cardType === 'received-good-points' || props.cardType === 'user-activity-teachers') &&
                        props.reaction && (
                            <motion.img
                                exit={{
                                    scale: 0,
                                    transition: {
                                        duration: 0.13,
                                    },
                                }}
                                initial={{
                                    scale: 0,
                                }}
                                animate={{
                                    scale: 1,
                                    transition: {
                                        duration: 0.13,
                                    },
                                }}
                                className="received-gp-reaction"
                                src={`/images/${EmojiPaths[props.reaction]}`}
                            />
                        )}
                </AnimatePresence>

                {/* user card icon or checkbox */}
                {props.cardType !== 'received-good-points' &&
                    props.cardType !== 'class' &&
                    props.cardType != 'study-group' &&
                    (props.checkbox && props.onCheckBoxChange ? (
                        <CheckBox onCheck={props.onCheckBoxChange} isChecked={!!props.isChecked} />
                    ) : (
                        <Box className={clsx('user-card-profile-icon-wrapper', circleColor)}>
                            <Box className={clsx('user-card-profile-icon', circleColor)}>
                                <Typography className="user-card-profile-icon-text">
                                    {(props.firstName ? props.firstName[0] : '') +
                                        (props.lastName ? props.lastName[0] : '')}
                                </Typography>
                            </Box>
                        </Box>
                    ))}

                <Box className="user-card-text">
                    <Typography
                        className={clsx(
                            'user-card-header',
                            (props.cardType === 'class' || props.cardType === 'study-group') &&
                                'user-card-class-type-header-text',
                        )}
                        sx={{
                            color:
                                props.checkbox || props.cardType === 'user-activity'
                                    ? '#081D5A'
                                    : theme.customColors.dark_blue1,
                        }}
                    >
                        {headerText}
                    </Typography>
                    {description}
                </Box>

                {/*bookmark icon in case of a class or study-group type */}
                {(props.cardType === 'class' || props.cardType === 'study-group') && (
                    <BookMarkIcon setClicked={handleBookMark} isClicked={!!props.isBookedMarked} />
                )}

                {/**gp count in case of  user-class-gpCount*/}
                {(props.cardType === 'user-class-gpCount' || props.cardType === 'user-gpCount') && !props.isHeader && (
                    <Box className="flex-center" gap="0.1rem" marginLeft="auto" marginRight="0.5rem">
                        <Typography color="#678691" fontSize="1em">
                            {props.gpCount ? props.gpCount : ' '}
                        </Typography>
                        <Favorite
                            htmlColor={props.checkbox ? theme.customColors.light_blue1 : '#F9B7A9'}
                            className="user-card-heart-icon"
                        />
                    </Box>
                )}

                {props.cardType === 'user-name' && props.reaction && (
                    <Box
                        className="user-card-reaction-emoji"
                        component="img"
                        src={`/images/${EmojiPaths[props.reaction]}`}
                    />
                )}
            </div>
            {(props.cardType === 'received-good-points' ||
                props.cardType === 'user-activity' ||
                props.cardType === 'user-activity-teachers') && (
                <Box className="card-footer-description-container">
                    {props.cardType === 'user-activity' ? (
                        <Box>
                            {props.reactions && (
                                <EmojisBar
                                    receiver={{ ...props.receiver }}
                                    maxNumberOfEmojis={2}
                                    reactions={props.reactions}
                                />
                            )}
                        </Box>
                    ) : (
                        //invisible div to push date to the left
                        <div></div>
                    )}

                    {isNow(new Date(props.date)) ? (
                        <Typography color={'#909090'}>{i18n.now}</Typography>
                    ) : (
                        <Typography className="card-footer-date-today">
                            {formatDateTime(props.date, 'hours')}
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};
