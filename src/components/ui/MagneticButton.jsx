import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const MagneticButton = ({ children, className = "", strength = 30, enabled = true }) => {
    const ref = useRef(null);
    const boundsRef = useRef(null);
    const pointerRef = useRef({ clientX: 0, clientY: 0 });
    const animationFrameRef = useRef(0);
    const offsetX = useMotionValue(0);
    const offsetY = useMotionValue(0);
    const smoothX = useSpring(offsetX, { stiffness: 260, damping: 22, mass: 0.25 });
    const smoothY = useSpring(offsetY, { stiffness: 260, damping: 22, mass: 0.25 });
    useEffect(() => () => window.cancelAnimationFrame(animationFrameRef.current), []);

    if (!enabled) {
        return <div className={className}>{children}</div>;
    }

    const updateOffset = () => {
        animationFrameRef.current = 0;
        const bounds = boundsRef.current || ref.current?.getBoundingClientRect();
        if (!bounds) return;

        const { clientX, clientY } = pointerRef.current;
        const { height, width, left, top } = bounds;

        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        offsetX.set(x / strength);
        offsetY.set(y / strength);
    };

    const handleMouse = ({ clientX, clientY }) => {
        pointerRef.current = { clientX, clientY };
        if (!animationFrameRef.current) {
            animationFrameRef.current = window.requestAnimationFrame(updateOffset);
        }
    };

    const handleMouseEnter = (event) => {
        boundsRef.current = ref.current?.getBoundingClientRect() || null;
        handleMouse(event);
    };

    const reset = () => {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = 0;
        boundsRef.current = null;
        offsetX.set(0);
        offsetY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseEnter={handleMouseEnter}
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
