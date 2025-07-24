import React from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import TopBarAdmin from '../components/admin-top-bar/AdminTopBar';

import AdminClassTable from '../pages/admin-classes/AdminClassPage';
import AdminClasses from '../pages/admin-classes/AdminClasses';
import PresetMessagesAdmin from '../pages/preset-messages-admin/PresetMessagesAdmin';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { useI18n } from '../../i18n/mainI18n';
import AdminClassesStudents from '../pages/admin-classes/AdminClassesStudentsTable';
import AdminClassPage from '../pages/admin-classes/AdminClassesTable';
import AdminStudyGroup from '../pages/admin-classes/AdminStudyGroupsTable';
import TeacherPage from '../pages/teacher/TeacherPage';
import TeachersAdminTable from '../pages/teacher/TeachersAdminTable';
import { motion } from 'framer-motion';
import '../common/styles/isRequired.scss';
import StudentsPage from '../pages/student/StudentsTablePage';
import StudentPage from '../pages/student/StudentPage';
import Statistics from '../pages/admin-classes/Statistics';

/**
 * The AdminRoutes component defines the routing configuration for the admin section of the application.
 * @returns a routes component from the`react-router-dom` library to set up routing.
 * ErrorBoundary is wrapped around all the routes it catches any react errors
 */

const AdminRoutes: React.FC = () => {
    // Use useI18n hook to retrieve translated strings and store them in variables
    const error_i18n = useI18n((i18n) => i18n.errors);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TopBarAdmin />
            <ErrorBoundary fallback={<div>{error_i18n.somethingWentWrong}</div>}>
                <Routes>
                    <Route path="/" element={<Navigate to="/admin/students" replace />} />
                    <Route path="/students" element={<StudentsPage />} />
                    <Route path="/students/:id" element={<StudentPage />} />
                    <Route path="/preset-messages" element={<PresetMessagesAdmin />} />
                    <Route path="/teachers" element={<TeachersAdminTable />} />
                    <Route path="/teachers/:id" element={<TeacherPage />} />
                    <Route path="/classes" element={<AdminClasses />}>
                        <Route index element={<AdminClassPage />}></Route>
                        <Route path="main-classes" element={<AdminClassPage />} />
                        <Route path="study-groups" element={<AdminStudyGroup />} />
                    </Route>
                    <Route path="/classes/main-classes/:id" element={<AdminClassTable classType="class" />}>
                        <Route path="students" element={<AdminClassesStudents classType="class" />} />
                        <Route path="statistics" element={<Statistics />} />
                    </Route>
                    <Route path="/classes/study-groups/:id" element={<AdminClassTable classType="studyGroup" />}>
                        <Route path="students" element={<AdminClassesStudents classType="studyGroup" />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/admin/" replace />} />
                </Routes>
            </ErrorBoundary>
            <ReactQueryDevtools initialIsOpen={false} />
        </motion.div>
    );
};
export default AdminRoutes;
