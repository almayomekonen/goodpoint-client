import { PrivateRoute } from '@hilma/auth';
import { isDesktop } from '../common/functions/isDesktop';

interface MobileOrDesktopProps {
    componentName: string;
    mobile: JSX.Element;
    desktop: JSX.Element;
}

export function MobileOrDesktop({ componentName, desktop, mobile }: MobileOrDesktopProps) {
    if (isDesktop()) return <PrivateRoute component={desktop} componentName={componentName} redirectPath="/" />;
    else return <PrivateRoute component={mobile} componentName={componentName} redirectPath="/" />;
}
