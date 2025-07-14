import { useGetAccessToken, useIsAuthenticated } from '@hilma/auth';
import { useQueryClient } from '@tanstack/react-query';
import { Dispatch, FC, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';
import { parseJwt } from '../functions/decodeToken';
import { UserInfoContextType } from './UserContext';

const socketUri =
    import.meta.env.MODE !== 'development' ? window.location.origin : import.meta.env.VITE_LOCAL_IP || 'localhost:8080';
export const socket = io(socketUri);
export type ReceivedGp = {
    gpId: number;
    schoolId: number;
};
type GpSocketContextType = {
    didReceiveMessage: boolean;
    setDidReceiveMessage: Dispatch<SetStateAction<boolean>>;
    messageReceived: ReceivedGp;
    differentSchoolId: number | null;
    setDifferentSchoolId: Dispatch<SetStateAction<number | null>>;
};
const gpSocketContext = createContext<GpSocketContextType>({
    didReceiveMessage: false,
    setDidReceiveMessage: () => {},
    messageReceived: { gpId: 0, schoolId: 0 },
    differentSchoolId: null,
    setDifferentSchoolId: () => {},
});

export const GpSocketContext: FC<PropsWithChildren> = ({ children }) => {
    const queryClient = useQueryClient();
    //meaning there is no logged in user yet
    const [messageReceived, setMessageReceived] = useState<ReceivedGp>({ gpId: 0, schoolId: 0 });
    const [didReceiveMessage, setDidReceiveMessage] = useState(false);
    const [differentSchoolId, setDifferentSchoolId] = useState<number | null>(null);
    const isAuthenticated = useIsAuthenticated();
    const getToken = useGetAccessToken();

    useEffect(() => {
        if (!isAuthenticated) {
            socket.removeAllListeners();
            return;
        }

        const token = getToken();
        if (!token) throw Error('problem with user cookies'); //meaning problem with cookies of current user
        //the current logged in user
        const user = parseJwt(token);
        socket.on(`received-message/${user.id}`, (data: ReceivedGp) => {
            //if the gp was sent from a different school , show appropriate message that the user is moved to a different school
            const contextSchoolId = queryClient.getQueryData<UserInfoContextType>(['get-user-data'], {
                type: 'all',
            })?.currSchoolId;
            if (data.schoolId != contextSchoolId) {
                setDifferentSchoolId(data.schoolId);
            }
            setDidReceiveMessage(true);
            setMessageReceived(data);

            //turn of the notification state after 2 seconds
            setTimeout(() => {
                setDidReceiveMessage(false);
            }, 2000);
        });
        return () => {
            socket.removeAllListeners();
        };
    }, [isAuthenticated]);

    useEffect(() => {
        //invalidate the received message
        queryClient.invalidateQueries(['teacher-received-gps']);
    }, [didReceiveMessage]);

    return (
        <gpSocketContext.Provider
            value={{
                didReceiveMessage,
                setDidReceiveMessage,
                messageReceived,
                differentSchoolId,
                setDifferentSchoolId,
            }}
        >
            {children}
            {<Outlet />}
        </gpSocketContext.Provider>
    );
};
export const useGpsSocket = () => useContext(gpSocketContext);
