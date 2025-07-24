import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useState } from 'react';
type SendGpContextType = {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};
const sendGpModalContext = createContext<SendGpContextType>({ isModalOpen: false, setIsModalOpen: () => {} });

/** This context is used to control the send gp modal that allows the user to send a gp to another user
 */
export const SendGpModalContext: FC<PropsWithChildren> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <sendGpModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>{children}</sendGpModalContext.Provider>
    );
};

export const useSendGpModal = () => useContext(sendGpModalContext);
