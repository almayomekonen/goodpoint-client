import React from 'react';
import { useI18n } from '../../i18n/mainI18n';
import { HelmetTitlePage } from '../../components/HelmetTitlePage';
export const SuperAdminHome = () => {
    const i18n = useI18n((i18n) => i18n.pagesTitles);

    return (
        <>
            <HelmetTitlePage title={i18n.superAdminHome} />
            <div>SuperAdminHome</div>
        </>
    );
};
