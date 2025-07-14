import { FC, PropsWithChildren, createContext, useContext, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Updater, useImmer } from 'use-immer';

import { useIsAuthenticated } from '@hilma/auth';
import { DEFAULT_LANG } from '../../i18n/i18n-consts';
import { Language } from '../../i18n/init-i18n';
import { useChangeLanguage } from '../../i18n/mainI18n';
import { sortObjBy } from '../functions';

import { ClassList, StarredStudyGroup } from '../types/UserContext.type';

import Loading from '../../components/Loading';

export type UserInfoContextType = {
    starred: { classes: ClassList[]; studyGroups: StarredStudyGroup[] };
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    preferredLanguage: Language;
    systemNotifications: boolean;
    goodPointsCount: string;
    schools: { schoolId: number; schoolName: string }[];
    currSchoolId: number;
    unreadGps: number;
    idmUser: boolean;
};

const initialValues: UserInfoContextType = {
    starred: { classes: [], studyGroups: [] },
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    preferredLanguage: DEFAULT_LANG,
    systemNotifications: true,
    goodPointsCount: '',
    schools: [],
    currSchoolId: 0,
    unreadGps: 0,
    idmUser: false,
};

const UserContext = createContext<{ user: UserInfoContextType; setUser: Updater<UserInfoContextType> }>({
    user: initialValues,
    setUser: () => {},
});

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useImmer<UserInfoContextType>(initialValues);
    const isAuthenticated = useIsAuthenticated();
    const changeLang = useChangeLanguage();

    const { isLoading, data, error } = useQuery(
        ['get-user-data'],
        async () => {
            const { data } = await axios.get<UserInfoContextType>('/api/staff/get-user-data');
            return data;
        },
        {
            enabled: isAuthenticated,
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    );

    useEffect(() => {
        if (data) {
            // יצירת עותק של הנתונים כדי לא לשנות את המקור
            const processedData = {
                ...data,
                starred: {
                    classes: [...data.starred.classes].sort((a, b) => sortObjBy(a, b, ['grade', 'classIndex'])),
                    studyGroups: [...data.starred.studyGroups].sort((a, b) => sortObjBy(a, b, 'name')),
                },
            };

            setUser(processedData);
            changeLang(processedData.preferredLanguage);
        }
    }, [data, setUser, changeLang]);

    if (error) {
        console.error('Error fetching user data:', error);
    }

    return isLoading && isAuthenticated ? (
        <Loading force />
    ) : (
        <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
