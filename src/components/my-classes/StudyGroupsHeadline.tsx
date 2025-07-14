import { FC } from 'react';
import { useI18n } from '../../i18n/mainI18n';

interface StudyGroupsHeadlineProps {
    groupExists: boolean;
    type: 'myClasses' | 'filtered';
}

export const StudyGroupsHeadline: FC<StudyGroupsHeadlineProps> = ({ groupExists, type }) => {
    const general = useI18n((i18n) => i18n.general);

    //Don't show divider in myClasses if there are no study-groups.
    if (!groupExists && type === 'myClasses') return null;

    return (
        <div className="study-group-main-wrapper">
            <div className="study-group-headline">
                {groupExists ? (
                    <span className="group-headline-name">{general.studyGroups}</span>
                ) : (
                    <span className="group-headline-name no-groups">{general.noStudyGroups}</span>
                )}
            </div>
        </div>
    );
};
