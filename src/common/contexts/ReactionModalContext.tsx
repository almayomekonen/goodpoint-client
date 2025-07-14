import React, { Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useState } from 'react';
import { Reaction } from '../types/reaction.type';
type modalContextType = {
    reactions: Reaction[];
    setReactions: Dispatch<SetStateAction<Reaction[]>>;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    receiverName: string;
    setReceiverName: Dispatch<SetStateAction<string>>;
    pos: {
        x: number;
        y: number;
    };
    setPos: Dispatch<SetStateAction<{ x: number; y: number }>>;
};
const ModalContext = React.createContext<modalContextType>({
    reactions: [],
    setReactions: () => {},
    isOpen: false,
    setIsOpen: () => {},
    receiverName: ' ',
    setReceiverName: () => {},
    pos: { x: 0, y: 0 },
    setPos: () => {},
});

export const ReactionModalContext: FC<PropsWithChildren> = ({ children }) => {
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [receiverName, setReceiverName] = useState<string>(' ');
    return (
        <ModalContext.Provider
            value={{ reactions, setReactions, isOpen, setIsOpen, receiverName, setReceiverName, pos, setPos }}
        >
            {children}
        </ModalContext.Provider>
    );
};

export const useReactionModal = () => useContext(ModalContext);
