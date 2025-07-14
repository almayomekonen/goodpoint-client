import { SchoolGrades } from '../enums';
import { ClassList, StarredStudyGroup } from './UserContext.type';

export type MyClassesData = { classes: ClassList[]; grades: SchoolGrades[]; studyGroups: StudyGroup[] };
export type StudyGroup = StarredStudyGroup & { grades: SchoolGrades[] };

export type DefaultGradeFilter = 'DEFAULT';
export type ChosenGradeFilter = SchoolGrades | DefaultGradeFilter;
