import { FC } from 'react';

import { DefaultGradeFilter } from '../common/consts/MyClasses.consts';
import { SchoolGrades } from '../common/enums/school-grade.enum';
import { ChosenGradeFilter } from '../common/types/MyClasses.types';

import { useI18n } from '../i18n/mainI18n';
import { GradeFilterButton } from './my-classes/GradeFilterButton';

interface GradeFilterProps {
    gradeFilter: SchoolGrades[];
    chosenGradeFilter: ChosenGradeFilter;
    onClick: (value: ChosenGradeFilter) => void;
}

/**
 * Component for rendering the grade filter buttons.
 * Displays a list of grade filter buttons based on the provided grade filter options.
 * Allows selecting a grade filter and invokes the onClick function when a button is clicked.
 */
export const GradesFilter: FC<GradeFilterProps> = ({ gradeFilter, chosenGradeFilter, onClick }) => {
    const i18n = useI18n((i18n) => i18n.schoolGrades);

    return (
        <>
            {/**background div for shadow on the left */}
            <div className={`${gradeFilter.length >= 3 && 'class-grades-gradient-div-left'}`} />
            <div className={`${gradeFilter.length >= 3 && 'class-grades-gradient-div-right'}`} />

            <div className="filter-grades-wrapper section">
                <GradeFilterButton
                    selected={chosenGradeFilter === DefaultGradeFilter}
                    value={DefaultGradeFilter}
                    onChange={() => onClick(DefaultGradeFilter)}
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
        </>
    );
};
