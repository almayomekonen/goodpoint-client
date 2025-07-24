import { FC } from 'react';

import { DefaultGradeFilter } from '../../common/consts/MyClasses.consts';
import { SchoolGrades } from '../../common/enums/school-grade.enum';
import { ChosenGradeFilter } from '../../common/types/MyClasses.types';

import { useI18n } from '../../i18n/mainI18n';
import { GradeFilterButton } from './GradeFilterButton';

interface GradeFilterProps {
    gradeFilter: SchoolGrades[];
    chosenGradeFilter: ChosenGradeFilter;
    onClick: (value: ChosenGradeFilter) => void;
}

export const GradesFilter: FC<GradeFilterProps> = ({ gradeFilter, chosenGradeFilter, onClick }) => {
    const i18n = useI18n((i18n) => i18n.schoolGrades);

    return (
        <div className="filter-grades-wrapper section">
            <GradeFilterButton
                selected={chosenGradeFilter === DefaultGradeFilter}
                value={DefaultGradeFilter}
                onChange={() => onClick(DefaultGradeFilter)}
                key="k-default"
            >
                {i18n.myClasses}
            </GradeFilterButton>

            {gradeFilter.map((grade, index) => (
                <GradeFilterButton
                    selected={chosenGradeFilter === grade}
                    value={grade}
                    onChange={() => onClick(grade)}
                    key={`g${index}`}
                >
                    {`${i18n.grade} ${i18n.gradesList[grade]}`}
                </GradeFilterButton>
            ))}
        </div>
    );
};
