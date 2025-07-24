import React from 'react';
import { isDesktop } from '../common/functions/isDesktop';
import { useI18n } from '../i18n/mainI18n';
import './loading.scss';
/** This component is the loading component. It is used to show the user that something is loading.
 *
 * @param force - If true, the loading will be shown even if the user is on desktop.
 */
function Loading({ force }: { force?: boolean }) {
    const i18n = useI18n((i18n) => i18n?.general);

    return !isDesktop() || force ? (
        <div className="loading-component">
            <img src={'/images/loading_heart.svg'} alt={i18n.loading} />
        </div>
    ) : null;
}
export default Loading;
