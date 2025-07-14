import { useI18n } from '../../../i18n/mainI18n';
import CustomAdminTableTitle from '../../components/admin-table-title/CustomAdminTableTitle';
import ToggleAdminTabs from '../../components/toggle-admin-tabs/ToggleAdminTabs';
import { HelmetTitlePage } from '../../../components/HelmetTitlePage';
import '../../common/styles/adminTableStyle.scss';
import './adminClasses.scss';

const AdminClasses = () => {
    const i18n = useI18n((i18n) => {
        return {
            adminClassesTable: i18n.adminClassesTable,
            pagesTitles: i18n.pagesTitles,
        };
    });

    return (
        <>
            <HelmetTitlePage title={i18n.pagesTitles.adminClasses} />
            <div className="admin-table-container">
                <div className="classes-admin-table">
                    <CustomAdminTableTitle title={i18n.adminClassesTable.classes} />
                    <ToggleAdminTabs
                        tabOneText={i18n.adminClassesTable.mainClasses}
                        tabTwoText={i18n.adminClassesTable.studyGroups}
                        firstTabPath="/admin/classes/main-classes"
                        secondTabPath="/admin/classes/study-groups"
                    />
                </div>
            </div>
        </>
    );
};

export default AdminClasses;
