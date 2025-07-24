import { useGetAccessToken, useIsAuthenticated } from '../hooks/useFirebaseAuthHooks';
import { useQueryClient } from '@tanstack/react-query';
import {
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
    useRef,
} from 'react';
import { Outlet } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { parseJwt } from '../functions/decodeToken';
import { UserInfoContextType } from './UserContext';

const getSocketUri = () => {
    if (import.meta.env.MODE === 'development') {
        return window.location.origin;
    }

    return (
        import.meta.env.VITE_SOCKET_URL ||
        import.meta.env.VITE_SERVER_URL ||
        window.location.origin ||
        'http://localhost:8080'
    );
};

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
    isConnected: boolean;
};

const gpSocketContext = createContext<GpSocketContextType>({
    didReceiveMessage: false,
    setDidReceiveMessage: () => {},
    messageReceived: { gpId: 0, schoolId: 0 },
    differentSchoolId: null,
    setDifferentSchoolId: () => {},
    isConnected: false,
});

export const GpSocketContext: FC<PropsWithChildren> = ({ children }) => {
    const queryClient = useQueryClient();
    const [messageReceived, setMessageReceived] = useState<ReceivedGp>({ gpId: 0, schoolId: 0 });
    const [didReceiveMessage, setDidReceiveMessage] = useState(false);
    const [differentSchoolId, setDifferentSchoolId] = useState<number | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const getToken = useGetAccessToken();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socketUri = getSocketUri();

        if (!socketRef.current) {
            socketRef.current = io(socketUri, {
                transports: ['websocket', 'polling'],
                timeout: 20000,
            });

            socketRef.current.on('connect', () => {
                setIsConnected(true);
            });

            socketRef.current.on('disconnect', () => {
                setIsConnected(false);
            });

            socketRef.current.on('connect_error', () => {
                setIsConnected(false);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setIsConnected(false);
            }
        };
    }, []);

    useEffect(() => {
        const setupSocket = async () => {
            const socket = socketRef.current;
            if (!socket || !isAuthenticated) {
                socket?.removeAllListeners('received-message');
                return;
            }

            try {
                const token = await getToken();
                if (!token) {
                    throw Error('problem with user token');
                }

                const user = parseJwt(token);
                const userId = user.user_id || user.sub || user.id;
                const eventName = `received-message/${userId}`;

                const messageHandler = (data: ReceivedGp) => {
                    const contextSchoolId = queryClient.getQueryData<UserInfoContextType>(['get-user-data'], {
                        type: 'all',
                    })?.currSchoolId;

                    if (data.schoolId != contextSchoolId) {
                        setDifferentSchoolId(data.schoolId);
                    }

                    setDidReceiveMessage(true);
                    setMessageReceived(data);

                    setTimeout(() => {
                        setDidReceiveMessage(false);
                    }, 2000);
                };

                socket.on(eventName, messageHandler);

                return () => {
                    socket.off(eventName, messageHandler);
                };
            } catch (error) {
                console.log(error);
            }
        };

        setupSocket();
    }, [isAuthenticated, getToken, queryClient]);

    useEffect(() => {
        if (didReceiveMessage) {
            queryClient.invalidateQueries(['teacher-received-gps']);
        }
    }, [didReceiveMessage, queryClient]);

    return (
        <gpSocketContext.Provider
            value={{
                didReceiveMessage,
                setDidReceiveMessage,
                messageReceived,
                differentSchoolId,
                setDifferentSchoolId,
                isConnected,
            }}
        >
            {children}
            <Outlet />
        </gpSocketContext.Provider>
    );
};

export const useGpsSocket = () => useContext(gpSocketContext);
