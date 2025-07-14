import { StudyGroup } from '../types/MyClasses.types';
import { ClassList } from '../types/UserContext.type';

export function compareClassLists(a: ClassList, b: ClassList) {
    if (a.grade > b.grade) return true;
    if (a.grade < b.grade) return false;
    if (a.classIndex > b.classIndex) return true;
    if (a.classIndex < b.classIndex) return false;

    return true;
}

export function compareStudyGroups(a: StudyGroup, b: StudyGroup) {
    if (a.name > b.name) return true;
    if (a.name < b.name) return false;

    return true;
}
