import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, HomeRoute, PrivateRoute, useIsAuthenticated } from '@hilma/auth';
import { RTL } from '@hilma/forms';
import { provide } from '@hilma/tools';
import { QueryClientProvider } from '@tanstack/react-query';
import { pagesImgSrc } from './common/consts/pagesImagesSrc.const';
import { isDesktop } from './common/functions/isDesktop';
import { useWindowResize } from './common/hooks/use-window-resize.hook';
import { GoogleAnalytics } from './components/GoogleAnalytics';
//providers
import { AlertProvider as AdminAlertProvider } from '@hilma/forms';
import { AlertProvider } from './common/contexts/AlertContext';
import { GpSocketContext } from './common/contexts/GpSocketContext';
import { GroupMessageContext } from './common/contexts/GroupMessageContext';
import { KeyboardOpenProvider } from './common/contexts/KeyboardOpenContext';
import { MenuContextProvider } from './common/contexts/MenuContext';
import PopupProvider from './common/contexts/PopUpProvider';
import { StudentListQueryProvider } from './common/contexts/StudentListQueryContext';
import { UserProvider } from './common/contexts/UserContext';
import { SourceNavbar } from './common/enums';
import { I18nProvider, useDirection } from './i18n/mainI18n';
//components
import AdminRoutes from './admin/routes/AdminRoutes';
import { LanguageToggleLoginProvider } from './common/contexts/LanguageToggleLoginContext';
import { DefaultPlaceholderDesktop } from './components/DefaultPlaceholderDesktop';
import { DesktopInnerContainer } from './components/DesktopInnerContainer';
import { MobileOrDesktop } from './components/MoibileOrDesktop';
import PWAReloadPrompt from './components/pwa-reload-prompt/PWAReloadPrompt';
import DesktopContainer from './components/desktop-container/DesktopContainer';
import { Notification } from './components/gp-notificatoin-snackbar/Notification';
import AddToHomePagePopup from './components/home-page-popup/AddToHomePagePopup';
import BottomNavbar from './components/navbar/BottomNavbar';
import { ReceivedGoodPointsDesktop } from './components/received-good-points-desktop/ReceivedGoodPointsDesktop';
import { TeacherActivityContainer } from './components/teacher-activity-container/TeacherActivityContainer';
import { TeacherActivityDesktop } from './components/teacher-activity-desktop/TeacherActivityDesktop';
import { GoodpointSent } from './pages/GoodpointSent';
import { LoginDesktop } from './pages/LoginDesktop';
import { LoginMobile } from './pages/LoginMobile';
import { MyClasses } from './pages/MyClasses';
import { SendGP } from './pages/SendGpChat';
import { SendGPToTeachers } from './pages/SendGpChatTeachers';
import { SendGroupGP } from './pages/SendGroupGP';
import { StudentsListByStudyGroup } from './pages/StudentByStudyGroup';
import { StudentsListByClass } from './pages/StudentsByClass';
import { TeacherActivityMobile } from './pages/TeacherActivityMobile';
import TeachersList from './pages/TeachersList';
import { ExportReport } from './pages/export-report/ExportReport';
import { NewGpNotification } from './pages/new-gp-notification/NewGpNotification';
import PersonalizedArea from './pages/personalized-area/PersonalizedArea';
import PresetMessagesBank from './pages/preset-messages-bank/PresetMessagesBank';
import { ReceivedGoodPointsMobile } from './pages/received-good-points-mobile/ReceivedGoodPointsMobile';
import { SendGpMobile } from './pages/send-gp-mobile/SendGpMobile';
import { UnsubscribeSuccess } from './pages/unsubscribe-success/UnsubscribeSuccess';
import SuperAdminRoutes from './super-admin/components/SuperAdminRoutes';
//consts
import { ACCESS_TOKEN_NAME } from './common/consts/auth-storage.consts';
import { queryClient } from './lib/react-query/config/queryConfig';
//scss
import './App.scss';
import './common/styles/fonts.scss';

function App() {
    const dir = useDirection();
    const isAuthenticated = useIsAuthenticated();
    const isInDesktop = isDesktop();
    useWindowResize();

    return (
        <RTL active={dir === 'rtl'}>
            <Notification />
            <GoogleAnalytics />
            {/* <ReactQueryDevtools /> */}
            <PWAReloadPrompt />

            {!isInDesktop && <AddToHomePagePopup />}
            <Routes>
                {/**route for sms notification on a new gp */}
                <Route path="s/:gpLinkHash" element={<NewGpNotification />} />
                <Route path="/unsubscribe-success/:type" element={<UnsubscribeSuccess />} />

                <Route
                    path={'/changePassword'}
                    element={isInDesktop ? <LoginDesktop resetPassword /> : <LoginMobile resetPassword />}
                />

                <Route element={isInDesktop && isAuthenticated ? <DesktopContainer /> : undefined}>
                    {!isInDesktop && (
                        <>
                            <Route element={<GroupMessageContext />}>
                                <Route
                                    path="/send-gp-chat-group"
                                    element={
                                        <PrivateRoute
                                            component={SendGroupGP}
                                            componentName="SendGroupGP"
                                            redirectPath="/"
                                        />
                                    }
                                />
                                <Route
                                    path="/send-gp-chat"
                                    element={
                                        <PrivateRoute component={SendGP} componentName="SendGpChat" redirectPath="/" />
                                    }
                                />
                                <Route
                                    index
                                    path="/send-gp"
                                    element={
                                        <PrivateRoute
                                            component={SendGpMobile}
                                            componentName="SendingGoodPointList"
                                            redirectPath="/"
                                        />
                                    }
                                />
                            </Route>
                            <Route
                                path="/personalized-area"
                                element={
                                    <PrivateRoute
                                        component={<PersonalizedArea />}
                                        componentName="PersonalizedArea"
                                        redirectPath="/"
                                    />
                                }
                            />
                            <Route
                                path="/send-gp-chat-teachers"
                                element={
                                    <PrivateRoute
                                        component={SendGPToTeachers}
                                        componentName="SendGPTeachers"
                                        redirectPath="/"
                                    />
                                }
                            />
                            <Route path="/gp-sent" element={<GoodpointSent />} />
                        </>
                    )}

                    <Route element={<LanguageToggleLoginProvider />}>
                        {isInDesktop ? (
                            <Route
                                path="/*"
                                element={
                                    <HomeRoute
                                        redirectComponent={<LoginDesktop />}
                                        components={{
                                            MyClasses: () => (
                                                <DesktopInnerContainer navigationBar divider width="small">
                                                    <Routes>
                                                        <Route path="/*" element={<MyClasses />} />
                                                        <Route path="/teachers-room/*" element={<TeachersList />} />
                                                    </Routes>
                                                </DesktopInnerContainer>
                                            ),
                                            SuperAdminHome: () => <Navigate to={'/super-admin/schools'} />,
                                        }}
                                    />
                                }
                            >
                                <Route index element={<DefaultPlaceholderDesktop />} />
                                <Route path="send-gp-chat" element={<SendGP />} />
                                <Route path="send-gp-chat/gp-sent" element={<GoodpointSent />} />
                                <Route
                                    path="send-gp-chat-group"
                                    element={
                                        <PrivateRoute
                                            component={SendGroupGP}
                                            componentName="SendGroupGP"
                                            redirectPath="/"
                                        />
                                    }
                                />
                                <Route path="send-gp-chat-group/gp-sent" element={<GoodpointSent />} />
                                <Route path="teachers-room/send-gp-chat-teachers" element={<SendGPToTeachers />} />
                                <Route path="teachers-room/send-gp-chat-teachers/gp-sent" element={<GoodpointSent />} />
                            </Route>
                        ) : (
                            <>
                                <Route
                                    path={'/'}
                                    element={
                                        <HomeRoute redirectComponent={<LoginMobile />} components={{ MyClasses }} />
                                    }
                                />
                                <Route
                                    path="/teachers-room"
                                    element={
                                        <PrivateRoute
                                            componentName="TeachersList"
                                            component={
                                                <>
                                                    <TeachersList />
                                                    <BottomNavbar source={SourceNavbar.TEACHERS} />
                                                </>
                                            }
                                        />
                                    }
                                ></Route>
                            </>
                        )}
                    </Route>

                    <Route
                        path="/grade-classes/:grade"
                        element={MobileOrDesktop({
                            componentName: 'StudentsListByClass',
                            mobile: <MyClasses />,
                            desktop: (
                                <DesktopInnerContainer navigationBar divider width="small">
                                    <MyClasses />
                                </DesktopInnerContainer>
                            ),
                        })}
                    />

                    <Route
                        path="/students-by-class/:grade/:classIndex"
                        element={MobileOrDesktop({
                            componentName: 'StudentsListByClass',
                            mobile: <StudentsListByClass />,
                            desktop: (
                                <DesktopInnerContainer navigationBar divider width="small">
                                    <StudentsListByClass />
                                </DesktopInnerContainer>
                            ),
                        })}
                    >
                        <Route index element={<DefaultPlaceholderDesktop />} />
                        <Route path="send-gp-chat" element={<SendGP />} />
                        <Route path="send-gp-chat/gp-sent" element={<GoodpointSent />} />
                    </Route>

                    <Route
                        path="/students-by-study-group/:id/:name"
                        element={MobileOrDesktop({
                            componentName: 'StudentsListByStudyGroup',
                            mobile: <StudentsListByStudyGroup />,
                            desktop: (
                                <DesktopInnerContainer navigationBar divider width="small">
                                    <StudentsListByStudyGroup />
                                </DesktopInnerContainer>
                            ),
                        })}
                    >
                        <Route index element={<DefaultPlaceholderDesktop />} />
                        <Route path="send-gp-chat" element={<SendGP />} />
                        <Route path="send-gp-chat/gp-sent" element={<GoodpointSent />} />
                    </Route>

                    <Route element={<TeacherActivityContainer />} path="/teacher-activity">
                        {/**default route  i students*/}
                        <Route
                            index
                            element={MobileOrDesktop({
                                componentName: 'TeacherActivity',
                                mobile: <TeacherActivityMobile listType="teacher-activity-students" />,
                                desktop: <TeacherActivityDesktop listType="teacher-activity-students" />,
                            })}
                        />

                        <Route
                            index
                            path="students"
                            element={MobileOrDesktop({
                                componentName: 'TeacherActivity',
                                mobile: <TeacherActivityMobile listType="teacher-activity-students" />,
                                desktop: <TeacherActivityDesktop listType="teacher-activity-students" />,
                            })}
                        />
                        <Route
                            path="teachers"
                            element={MobileOrDesktop({
                                componentName: 'TeacherActivity',
                                mobile: <TeacherActivityMobile listType="teacher-activity-teachers" />,
                                desktop: <TeacherActivityDesktop listType="teacher-activity-teachers" />,
                            })}
                        />
                    </Route>
                    <Route
                        path="/export-report"
                        element={MobileOrDesktop({
                            componentName: 'ExportReport',
                            mobile: <ExportReport />,
                            desktop: (
                                <DesktopInnerContainer img={pagesImgSrc.exportReport} width="large">
                                    <ExportReport />
                                </DesktopInnerContainer>
                            ),
                        })}
                    ></Route>
                    <Route
                        path="/received-good-points"
                        element={MobileOrDesktop({
                            desktop: <ReceivedGoodPointsDesktop />,
                            mobile: <ReceivedGoodPointsMobile />,
                            componentName: 'ReceivedGoodPoints',
                        })}
                    />

                    <Route
                        path="/preset-messages"
                        element={
                            <PrivateRoute
                                component={<PresetMessagesBank />}
                                componentName="PresetMessagesBank"
                                redirectPath="/"
                            />
                        }
                    />
                    {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
                </Route>

                {/**routes for admin */}
                <Route
                    path="/admin/*"
                    element={<PrivateRoute component={<AdminRoutes />} componentName="AdminRoutes" redirectPath="/" />}
                />

                {/**routes for super admin */}
                <Route
                    path="/super-admin/*"
                    element={
                        <PrivateRoute
                            component={<SuperAdminRoutes />}
                            componentName="SuperAdminRoutes"
                            redirectPath="/"
                        />
                    }
                />
            </Routes>
        </RTL>
    );
}

export default provide(
    [AuthProvider, { logoutOnUnauthorized: true, accessTokenCookie: ACCESS_TOKEN_NAME }],
    [I18nProvider, { router: false }],
    [QueryClientProvider, { client: queryClient }],
    UserProvider,
    KeyboardOpenProvider,
    GpSocketContext,
    AlertProvider,
    AdminAlertProvider,
    PopupProvider,
    StudentListQueryProvider,
    MenuContextProvider,
)(App);
