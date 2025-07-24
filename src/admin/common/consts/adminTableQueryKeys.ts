export const TABLE_LOAD_PREFIX = 'table-load-';

export const adminQueryKeys = {
    tableGoodPoints: 'tableGoodPoints',
    studentsTable: 'studentsTable',
    teachersTable: 'teachersTable',
    classesTable: 'classesTable',
    studyGroupsTable: 'StudyGroupsTable',
    PMTable: 'PMTable',
    adminsTable: 'AdminsTable',
    schoolsTable: 'SchoolsTable',
} as const;

export const adminQueryKeysWithPrefix = {
    goodPoint: TABLE_LOAD_PREFIX + adminQueryKeys.tableGoodPoints,
    student: TABLE_LOAD_PREFIX + adminQueryKeys.studentsTable,
    teacher: TABLE_LOAD_PREFIX + adminQueryKeys.teachersTable,
    classes: TABLE_LOAD_PREFIX + adminQueryKeys.classesTable,
    studyGroups: TABLE_LOAD_PREFIX + adminQueryKeys.studyGroupsTable,
    PMTable: TABLE_LOAD_PREFIX + adminQueryKeys.PMTable,
    adminsTable: TABLE_LOAD_PREFIX + adminQueryKeys.adminsTable,
    schoolsTable: TABLE_LOAD_PREFIX + adminQueryKeys.schoolsTable,
};

export type AdminQueryKeys = keyof typeof adminQueryKeys;
