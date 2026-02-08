import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
    const innerX = useMotionValue(-100);
    const innerY = useMotionValue(-100);
    const outerX = useMotionValue(-100);
    const outerY = useMotionValue(-100);
    const innerScale = useMotionValue(1);
    const outerScale = useMotionValue(1);

    const smoothInnerX = useSpring(innerX, { stiffness: 700, damping: 42, mass: 0.2 });
    const smoothInnerY = useSpring(innerY, { stiffness: 700, damping: 42, mass: 0.2 });
    const smoothOuterX = useSpring(outerX, { stiffness: 350, damping: 34, mass: 0.5 });
    const smoothOuterY = useSpring(outerY, { stiffness: 350, damping: 34, mass: 0.5 });
    const smoothInnerScale = useSpring(innerScale, { stiffness: 400, damping: 28 });
    const smoothOuterScale = useSpring(outerScale, { stiffness: 320, damping: 26 });

    useEffect(() => {
        const updateMousePosition = (e) => {
            innerX.set(e.clientX - 8);
            innerY.set(e.clientY - 8);
            outerX.set(e.clientX - 16);
            outerY.set(e.clientY - 16);
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                innerScale.set(1.5);
                outerScale.set(2.5);
            } else {
                innerScale.set(1);
                outerScale.set(1);
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [innerScale, innerX, innerY, outerScale, outerX, outerY]);

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-50 mix-blend-difference"
                style={{ x: smoothInnerX, y: smoothInnerY, scale: smoothInnerScale }}
            />
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-50 mix-blend-difference"
                style={{ x: smoothOuterX, y: smoothOuterY, scale: smoothOuterScale }}
            />
        </>
    );
};

export default CustomCursor;
