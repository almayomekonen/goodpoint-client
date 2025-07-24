import { Helmet } from 'react-helmet';
import { TFunction } from '../common/types/function.type';

type WindowWithDataLayer = Window & {
    gtag: TFunction;
};

declare const window: WindowWithDataLayer;

export const GoogleAnalytics = () => {
    return (
        <Helmet>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-M0TSLVCJTV"></script>
            <script>
                {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-M0TSLVCJTV')`}
            </script>
        </Helmet>
    );
};

export function savingEvents(eventName: string, extraParam?: object) {
    window.gtag('event', eventName, extraParam);
}
