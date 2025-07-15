import { useGetAccessToken, useIsAuthenticated } from '@hilma/auth';
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
    const socketUri = 'https://goodpoint-client.vercel.app/';

    console.log('🔌 Socket Configuration:');
    console.log('   MODE:', import.meta.env.MODE);
    console.log('   VITE_SOCKET_URL:', import.meta.env.VITE_SOCKET_URL);
    console.log('   VITE_SERVER_URL:', import.meta.env.VITE_SERVER_URL);
    console.log('   VITE_LOCAL_IP:', import.meta.env.VITE_LOCAL_IP);
    console.log('   Final Socket URI:', socketUri);

    return socketUri;
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

    // יצירת Socket רק פעם אחת
    useEffect(() => {
        const socketUri = getSocketUri();

        if (!socketRef.current) {
            console.log('🚀 Creating new socket connection to:', socketUri);
            socketRef.current = io(socketUri, {
                transports: ['websocket', 'polling'],
                timeout: 20000,
            });

            // Event listeners לבדיקת חיבור
            socketRef.current.on('connect', () => {
                console.log('✅ Socket connected successfully');
                setIsConnected(true);
            });

            socketRef.current.on('disconnect', (reason) => {
                console.log('❌ Socket disconnected:', reason);
                setIsConnected(false);
            });

            socketRef.current.on('connect_error', (error) => {
                console.error('🔥 Socket connection error:', error);
                setIsConnected(false);
            });
        }

        return () => {
            if (socketRef.current) {
                console.log('🧹 Cleaning up socket connection');
                socketRef.current.disconnect();
                socketRef.current = null;
                setIsConnected(false);
            }
        };
    }, []);

    // התנהלות של authentication ו-listeners
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket || !isAuthenticated) {
            console.log('🚫 Removing all listeners - not authenticated or no socket');
            socket?.removeAllListeners('received-message');
            return;
        }

        const token = getToken();
        if (!token) {
            console.error('🔐 Problem with user cookies');
            throw Error('problem with user cookies');
        }

        const user = parseJwt(token);
        const eventName = `received-message/${user.id}`;

        console.log('👂 Setting up listener for:', eventName);

        const messageHandler = (data: ReceivedGp) => {
            console.log('📨 Received message:', data);

            const contextSchoolId = queryClient.getQueryData<UserInfoContextType>(['get-user-data'], {
                type: 'all',
            })?.currSchoolId;

            if (data.schoolId != contextSchoolId) {
                console.log('🏫 Different school detected:', data.schoolId, 'vs', contextSchoolId);
                setDifferentSchoolId(data.schoolId);
            }

            setDidReceiveMessage(true);
            setMessageReceived(data);

            // כיבוי ההודעה אחרי 2 שניות
            setTimeout(() => {
                setDidReceiveMessage(false);
            }, 2000);
        };

        socket.on(eventName, messageHandler);

        return () => {
            console.log('🧹 Removing listener for:', eventName);
            socket.off(eventName, messageHandler);
        };
    }, [isAuthenticated, getToken, queryClient]);

    // Invalidate queries כשמתקבלת הודעה
    useEffect(() => {
        if (didReceiveMessage) {
            console.log('🔄 Invalidating teacher-received-gps queries');
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
