import { useMemo } from 'react';

import { OnMountDropdownFilter, SelectOption } from '@hilma/forms';
import { useI18n } from '../../../i18n/mainI18n';
import { useClassesList } from './useClassesList';
import { CustomFilters } from '../../../admin/common/types/customFilters';

export interface SelectOptionAC extends SelectOption {
    value: string;
}

/**
A custom hook to fetch grades data and return the dropdown filters for a grade admin table.
@returns {OnMountDropdownFilter<StudentRow>[]} dropdownFilters - The array of dropdown filters for the grade table.
*/
//todo- add error handling if there is no grades
export const useGradeTableDropDownFilters = <T extends Record<string, any>>(
    configDropdownFilters: Omit<Partial<OnMountDropdownFilter<T>>, 'columnKey'> & Record<'columnKey', keyof T>,
    customFilters: Partial<Record<CustomFilters, boolean>> = { floatingStudents: false },
): OnMountDropdownFilter<T>[] => {
    const { data: allSchoolClasses, isLoading } = useClassesList();
    const { studentsTable, general, gradesList } = useI18n((i18n) => {
        return {
            studentsTable: i18n.studentsTable,
            error_i18n: i18n.errors,
            general: i18n.general,
            gradesList: i18n.schoolGrades.gradesList,
        };
    });

    const dropdownFilters = useMemo(() => {
        if (isLoading)
            return [
                {
                    ...configDropdownFilters,
                    options: [{ optionKey: 'loading', content: general.loading, filter: () => false }],
                },
            ] as OnMountDropdownFilter<T>[];

        const sortedGrades = allSchoolClasses?.grades?.sort((a, b) => Number(a) - Number(b));

        const memorizedClassesArr =
            sortedGrades?.map((classItem) => {
                return {
                    optionKey: classItem,
                    content: `${studentsTable.grade} ${gradesList[classItem]}`,
                    filter: (
                        columnFilter:
                            | T[(typeof configDropdownFilters)['columnKey']]
                            | T[(typeof configDropdownFilters)['columnKey']][]
                            | undefined,
                    ) => {
                        if (Array.isArray(columnFilter))
                            // assuming its an array of classes
                            return columnFilter.some((ArrayItem) => ArrayItem.grade === String(classItem));
                        if (typeof columnFilter === 'function') return false;
                        if (typeof columnFilter === 'object') return columnFilter?.grade === String(classItem);
                        // it must be the columnFilter itself
                        return columnFilter === String(classItem);
                    },
                };
            }) || [];

        const withoutClassesFilter = {
            optionKey: 'WITHOUT',
            content: `${studentsTable.withoutClassesFilter}`,
            filter: (
                columnFilter:
                    | T[(typeof configDropdownFilters)['columnKey']]
                    | T[(typeof configDropdownFilters)['columnKey']][]
                    | undefined,
            ) => {
                if (Array.isArray(columnFilter))
                    // assuming its an array of classes if its an empty array
                    return (
                        columnFilter.length === 0 || columnFilter.some((ArrayItem) => ArrayItem?.classes?.length === 0)
                    );
                if (typeof columnFilter === 'function') return false;
                if (typeof columnFilter === 'object') return columnFilter?.grade === undefined;
                // it must be the columnFilter itself
                return columnFilter === undefined;
            },
        };

        const optionsArray: OnMountDropdownFilter<T>['options'] = [...memorizedClassesArr];
        if (customFilters?.floatingStudents) {
            optionsArray.push(withoutClassesFilter);
        }

        return [
            {
                ...configDropdownFilters,
                options: optionsArray,
            },
        ] as OnMountDropdownFilter<T>[];
    }, [allSchoolClasses]);

    return dropdownFilters;
};
/**
  A custom hook to fetch grades data and return the dropdown options for a grade drop down selector.
  @returns {SelectOptionAC[]} memorizedClassesArr - The array of dropdown options for the grade drop down selector.
  */
//todo- add error handling if there is no grades
export const useGradeDropDownFilters = (): SelectOptionAC[] => {
    const { data: allSchoolClasses } = useClassesList();

    // Use useI18n hook to retrieve translated strings and store them in variables
    const { studentsTable, alphabet } = useI18n((i18n) => {
        return {
            studentsTable: i18n.studentsTable,
            alphabet: i18n.alphabet,
        };
    });

    // Map over the classes array to create an array of options for the dropdown filter
    const memorizedClassesArr: SelectOptionAC[] = useMemo(() => {
        return (
            allSchoolClasses?.grades?.map((classItem) => {
                return {
                    value: classItem.toString(),
                    content: `${studentsTable.grade} ${alphabet[classItem]}`,
                };
            }) ?? [{ value: 'loading', content: 'loading' }]
        );
    }, [allSchoolClasses]);

    return memorizedClassesArr;
};
/*
A custom hook to fetch grades data and return the dropdown options for a grade drop down selector.
@returns {SelectOption[]} memorizedClassesArr - The array of dropdown options for the grade drop down selector.
*/
//todo- add error handling if there is no grades
export const useClassesDropDownFilters = (): SelectOptionAC[] => {
    const { data: allSchoolClasses, isLoading } = useClassesList();

    // Use useI18n hook to retrieve translated strings and store them in variables
    const { gradesList, general } = useI18n((i18n) => {
        return {
            gradesList: i18n.schoolGrades.gradesList,
            general: i18n.general,
        };
    });

    // Map over the classes array to create an array of options for the dropdown filter
    const memorizedClassesArr: SelectOptionAC[] = useMemo(() => {
        if (isLoading)
            return [
                {
                    value: 'loading',
                    content: `${general.loading}`,
                },
            ];

        const sortedClasses = allSchoolClasses?.classes?.sort((a, b) => {
            // Sort by grade
            const gradeDiff = Number(a.grade) - Number(b.grade);
            if (gradeDiff !== 0) {
                return gradeDiff;
            }

            // Sort by classIndex if grades are the same
            return a.classIndex - b.classIndex;
        });

        return (
            sortedClasses?.map((classItem) => {
                return {
                    value: JSON.stringify({ grade: classItem.grade, classIndex: classItem.classIndex }),
                    content: `${gradesList[classItem.grade] ?? ''}${classItem.classIndex ?? ''}`,
                };
            }) ?? [{ value: 'loading', content: `${general.loading}` }]
        );
    }, [allSchoolClasses, isLoading]);

    return memorizedClassesArr;
};
