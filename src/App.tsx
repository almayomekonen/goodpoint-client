import { Navigate, Route, Routes } from 'react-router-dom';
import { FirebaseAuthProvider, useFirebaseAuth } from './common/contexts/FirebaseAuthContext';
import { FirebasePrivateRoute } from './common/components/FirebasePrivateRoute';
import { FirebaseHomeRoute } from './common/components/FirebaseHomeRoute';
import { RTL } from '@hilma/forms';
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

import { queryClient } from './lib/react-query/config/queryConfig';
//scss
import './App.scss';
import './common/styles/fonts.scss';

function App() {
    const dir = useDirection();
    const { isAuthenticated } = useFirebaseAuth();
    const isInDesktop = isDesktop();
    useWindowResize();

    return (
        <RTL active={dir === 'rtl'}>
            <Notification />
            <GoogleAnalytics />

            <PWAReloadPrompt />

            {!isInDesktop && <AddToHomePagePopup />}
            <Routes>
                <Route path="s/:gpLinkHash" element={<NewGpNotification />} />
                <Route path="/unsubscribe-success/:type" element={<UnsubscribeSuccess />} />

                <Route
                    path={'/changePassword'}
                    element={isInDesktop ? <LoginDesktop resetPassword /> : <LoginMobile resetPassword />}
                />

                <Route element={isInDesktop && isAuthenticated ? <DesktopContainer /> : undefined}>
                    {/* ADD TOP-LEVEL SEND-GP-CHAT ROUTE WITH PROPER DESKTOP LAYOUT */}
                    <Route
                        path="/send-gp-chat"
                        element={
                            <FirebasePrivateRoute
                                component={
                                    isInDesktop ? (
                                        <DesktopInnerContainer navigationBar divider width="large">
                                            <SendGP />
                                        </DesktopInnerContainer>
                                    ) : (
                                        <SendGP />
                                    )
                                }
                                redirectPath="/"
                            />
                        }
                    />

                    {!isInDesktop && (
                        <>
                            <Route element={<GroupMessageContext />}>
                                <Route
                                    path="/send-gp-chat-group"
                                    element={<FirebasePrivateRoute component={<SendGroupGP />} redirectPath="/" />}
                                />
                                <Route
                                    path="/send-gp-chat"
                                    element={<FirebasePrivateRoute component={<SendGP />} redirectPath="/" />}
                                />
                                <Route
                                    index
                                    path="/send-gp"
                                    element={<FirebasePrivateRoute component={<SendGpMobile />} redirectPath="/" />}
                                />
                            </Route>
                            <Route
                                path="/personalized-area"
                                element={<FirebasePrivateRoute component={<PersonalizedArea />} redirectPath="/" />}
                            />
                            <Route
                                path="/send-gp-chat-teachers"
                                element={<FirebasePrivateRoute component={<SendGPToTeachers />} redirectPath="/" />}
                            />
                            <Route path="/gp-sent" element={<GoodpointSent />} />
                        </>
                    )}

                    <Route element={<LanguageToggleLoginProvider />}>
                        {isInDesktop ? (
                            <Route
                                path="/*"
                                element={
                                    <FirebaseHomeRoute
                                        redirectComponent={<LoginDesktop />}
                                        components={{
                                            MyClasses: () => (
                                                <DesktopInnerContainer navigationBar divider width="small">
                                                    <MyClasses />
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
                                    element={<FirebasePrivateRoute component={<SendGroupGP />} redirectPath="/" />}
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
                                        <FirebaseHomeRoute
                                            redirectComponent={<LoginMobile />}
                                            components={{ MyClasses }}
                                        />
                                    }
                                />
                                <Route
                                    path="/teachers-room"
                                    element={
                                        <FirebasePrivateRoute
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
                        path="/teachers-room"
                        element={
                            <FirebasePrivateRoute
                                component={
                                    isInDesktop ? (
                                        <DesktopInnerContainer navigationBar divider width="small">
                                            <TeachersList />
                                        </DesktopInnerContainer>
                                    ) : (
                                        <>
                                            <TeachersList />
                                            <BottomNavbar source={SourceNavbar.TEACHERS} />
                                        </>
                                    )
                                }
                                redirectPath="/"
                            />
                        }
                    />

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
                        path="/students-by-class/:grade/:classIndex/*"
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
                        path="/students-by-study-group/:id/:name/*"
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

                    <Route element={<TeacherActivityContainer />} path="/teacher-activity/*">
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
                        element={<FirebasePrivateRoute component={<PresetMessagesBank />} redirectPath="/" />}
                    />
                </Route>

                <Route
                    path="/admin/*"
                    element={<FirebasePrivateRoute component={<AdminRoutes />} redirectPath="/" />}
                />

                <Route
                    path="/super-admin/*"
                    element={<FirebasePrivateRoute component={<SuperAdminRoutes />} redirectPath="/" />}
                />
            </Routes>
        </RTL>
    );
}

const AppWithProviders = () => (
    <FirebaseAuthProvider>
        <I18nProvider router={false}>
            <QueryClientProvider client={queryClient}>
                <UserProvider>
                    <KeyboardOpenProvider>
                        <GpSocketContext>
                            <AlertProvider>
                                <AdminAlertProvider>
                                    <PopupProvider>
                                        <StudentListQueryProvider>
                                            <MenuContextProvider>
                                                <App />
                                            </MenuContextProvider>
                                        </StudentListQueryProvider>
                                    </PopupProvider>
                                </AdminAlertProvider>
                            </AlertProvider>
                        </GpSocketContext>
                    </KeyboardOpenProvider>
                </UserProvider>
            </QueryClientProvider>
        </I18nProvider>
    </FirebaseAuthProvider>
);

export default AppWithProviders;
