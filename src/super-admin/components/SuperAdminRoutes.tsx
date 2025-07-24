import { Route, Routes } from 'react-router-dom';
import AdminTopBarNavigation from '../../admin/components/admin-top-bar/AdminTopBarNavigation';
import PresetMessagesAdmin from '../../admin/pages/preset-messages-admin/PresetMessagesAdmin';
import { SuperAdminSchools } from './super-admin-schools/SuperAdminSchools';
import { SchoolInfo } from './super-admin-schools/SchoolInfo';
import { SuperAdminActions } from './super-admin-actions/SuperAdminActions';

/**routes for super admin  */
const SuperAdminRoutes = () => {
    return (
        <div>
            {/**top bar for super-admin */}
            <div className="top-bar-admin">
                <AdminTopBarNavigation isSuperAdmin={true} />
            </div>

            {/**routes for super-admin */}
            <Routes>
                <Route path="schools" element={<SuperAdminSchools />} />
                <Route path="schools/school-info" element={<SchoolInfo />} />
                <Route index element={<SuperAdminSchools />} />
                <Route path="preset-messages" element={<PresetMessagesAdmin />} />
                <Route path="actions" element={<SuperAdminActions />} />
            </Routes>
        </div>
    );
};

export default SuperAdminRoutes;
