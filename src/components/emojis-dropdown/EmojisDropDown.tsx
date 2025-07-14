import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useReactionModal } from '../../common/contexts/ReactionModalContext';
import { useOutsideClick } from '../../common/hooks/use-outside-click';
import { Reactions } from '../reactions/Reactions';

export const EmojisDropDown = () => {
    const { isOpen, setIsOpen, pos, setPos } = useReactionModal();

    const screenWidth = window.document.body.clientWidth;
    const screenHeight = window.document.body.clientHeight;
    const ref = useRef<HTMLElement>(null);

    useOutsideClick(ref, () => {
        setIsOpen(false);
    });

    useEffect(() => {
        if (ref.current) {
            const bottom = ref.current.getBoundingClientRect().bottom;

            if (bottom > screenHeight) {
                setPos((prev) => {
                    return { ...prev, y: screenHeight - (ref.current?.getBoundingClientRect().height ?? 0) * 1.1 };
                });
            }
        }
    }, [ref.current, pos]);

    return (
        <Box
            sx={{
                position: 'absolute',
                top: (pos.y / screenHeight) * 100 - 4 + '%',
                right: (pos.x / screenWidth) * 100 + '%',
                zIndex: 1000,
                fontSize: '0.7rem',
                width: '18vw',
            }}
            ref={ref}
            className="fade-in"
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{
                            scale: 0,
                            transformOrigin: '80% 0%',
                        }}
                        animate={{
                            scale: 1,
                            transformOrigin: '80% 0%',
                        }}
                        transition={{
                            duration: 0.15,
                        }}
                        exit={{
                            scale: 0,
                            transition: {
                                duration: 0.15,
                            },
                        }}
                    >
                        <Reactions />
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};
