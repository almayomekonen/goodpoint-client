import { QueryClient } from '@tanstack/query-core';
import { adminQueryKeysWithPrefix } from '../consts/adminTableQueryKeys';

/**
 * Synchronizes the react query cashes of the admin students tables based on the provided data.
 * @param {Object} data - The data containing information about the moved target and source classes.
 * @returns {Promise<void>} A promise that resolves when the synchronization is complete.
 * @throws {Error} If an error occurs during data syncing.
 */
export const syncAdminStudentsTables = async (
    data: { movedTarget: number; srcClasses: number[] },
    queryClient: QueryClient,
) => {
    const { srcClasses, movedTarget } = data;

    try {
        // Invalidate queries for students admin
        queryClient.invalidateQueries([adminQueryKeysWithPrefix.student, '/api/schools/get-students-of-school-admin']);

        // Invalidate query for student itself
        queryClient.invalidateQueries(['get-student-by-id']);

        if (srcClasses.length > 1) {
            // Reset all class queries
            queryClient.invalidateQueries([adminQueryKeysWithPrefix.student]);
        } else {
            const [originalClass] = srcClasses;

            // Invalidate query for target class
            queryClient.invalidateQueries([
                adminQueryKeysWithPrefix.student,
                `/api/student/get-admin-students-by-class/${String(movedTarget)}`,
            ]);

            // Invalidate query for original class
            queryClient.invalidateQueries([
                adminQueryKeysWithPrefix.student,
                `/api/student/get-admin-students-by-class/${String(originalClass)}`,
            ]);
        }
    } catch (error) {
        console.error('Data syncing error:', error);
    }
};
