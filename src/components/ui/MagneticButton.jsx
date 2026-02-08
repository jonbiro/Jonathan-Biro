import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const MagneticButton = ({ children, className = "", strength = 30, enabled = true }) => {
    const ref = useRef(null);
    const offsetX = useMotionValue(0);
    const offsetY = useMotionValue(0);
    const smoothX = useSpring(offsetX, { stiffness: 260, damping: 22, mass: 0.25 });
    const smoothY = useSpring(offsetY, { stiffness: 260, damping: 22, mass: 0.25 });

    if (!enabled) {
        return <div className={className}>{children}</div>;
    }

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();

        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        offsetX.set(x / strength);
        offsetY.set(y / strength);
    };

    const reset = () => {
        offsetX.set(0);
        offsetY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            style={{ x: smoothX, y: smoothY }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default MagneticButton;
