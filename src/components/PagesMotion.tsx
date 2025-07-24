import { motion } from 'framer-motion';

interface MotionProps {
    children?: React.ReactNode;
}

function PagesMotion({ children }: MotionProps) {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit={{ type: 'out', dur: 0.8 }}
            variants={{
                initial: {
                    opacity: 0,
                },
                in: {
                    opacity: 1,
                    dur: 0.3,
                },
                out: {
                    opacity: 0,
                    dur: 0.3,
                },
            }}
            transition={{
                type: 'spring',
                damping: 10,
                stiffness: 50,
                duration: 1,
            }}
        >
            {children}
        </motion.div>
    );
}

export default PagesMotion;
