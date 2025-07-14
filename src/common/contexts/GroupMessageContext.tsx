import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSessionStorageState } from '../hooks/useSessionStorageState';
import { GroupMessageReceiver } from '../types/group-message-receiver.type';

type contextType = {
    isGroupSending: boolean;
    setIsGroupSending: Dispatch<SetStateAction<boolean>>;
    groupMessageReceivers: GroupMessageReceiver[] | null;
    setGroupMessageReceivers: Dispatch<SetStateAction<GroupMessageReceiver[] | null>>;
};
const groupMessageContext = createContext<contextType>({
    isGroupSending: false,
    setIsGroupSending: () => {},
    groupMessageReceivers: null,
    setGroupMessageReceivers: () => {},
});
export const GroupMessageContext: FC<{ children?: ReactNode }> = ({ children }) => {
    const [groupMessageReceivers, setGroupMessageReceivers] =
        useSessionStorageState<GroupMessageReceiver[]>('groupMessageReceivers');
    const [isGroupSending, setIsGroupSending] = useState(false);
    return (
        <groupMessageContext.Provider
            value={{ isGroupSending, setIsGroupSending, groupMessageReceivers, setGroupMessageReceivers }}
        >
            {children ?? <Outlet />}
        </groupMessageContext.Provider>
    );
};

export const useGroupMessage = () => useContext(groupMessageContext);
