import { FirebasePrivateRoute } from '../common/components/FirebasePrivateRoute';
import { isDesktop } from '../common/functions/isDesktop';

interface MobileOrDesktopProps {
    componentName: string;
    mobile: JSX.Element;
    desktop: JSX.Element;
}

export function MobileOrDesktop({ componentName, desktop, mobile }: MobileOrDesktopProps) {
    if (isDesktop()) return <FirebasePrivateRoute component={desktop} redirectPath="/" />;
    else return <FirebasePrivateRoute component={mobile} redirectPath="/" />;
}
