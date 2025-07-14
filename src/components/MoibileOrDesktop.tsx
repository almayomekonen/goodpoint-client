import { PrivateRoute } from '@hilma/auth';
import { isDesktop } from '../common/functions/isDesktop';

interface MobileOrDesktopProps {
    componentName: string;
    mobile: JSX.Element;
    desktop: JSX.Element;
}

/** This component is used to show a different component on mobile and desktop.
 *
 * @param componentName - The name of the component. This is used for the PrivateRoute component.
 * @param mobile - The component to show on mobile.
 * @param desktop - The component to show on desktop.
 *
 */
export function MobileOrDesktop({ componentName, desktop, mobile }: MobileOrDesktopProps) {
    if (isDesktop()) return <PrivateRoute component={desktop} componentName={componentName} redirectPath="/" />;
    else return <PrivateRoute component={mobile} componentName={componentName} redirectPath="/" />;
}
