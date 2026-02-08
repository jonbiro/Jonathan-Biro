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
        let targetX = -100;
        let targetY = -100;
        let frameId = 0;

        const applyPointerPosition = () => {
            frameId = 0;
            innerX.set(targetX - 8);
            innerY.set(targetY - 8);
            outerX.set(targetX - 16);
            outerY.set(targetY - 16);
        };

        const schedulePointerUpdate = () => {
            if (frameId) {
                return;
            }
            frameId = window.requestAnimationFrame(applyPointerPosition);
        };

        const updatePointerPosition = (event) => {
            targetX = event.clientX;
            targetY = event.clientY;
            schedulePointerUpdate();
        };

        const handlePointerOver = (event) => {
            if (!(event.target instanceof Element)) {
                return;
            }

            const isInteractive = Boolean(
                event.target.closest("a,button,[role='button'],input,textarea,select,label")
            );

            if (isInteractive) {
                innerScale.set(1.5);
                outerScale.set(2.5);
            } else {
                innerScale.set(1);
                outerScale.set(1);
            }
        };

        window.addEventListener("pointermove", updatePointerPosition, { passive: true });
        window.addEventListener("pointerover", handlePointerOver, { passive: true });

        return () => {
            if (frameId) {
                window.cancelAnimationFrame(frameId);
            }
            window.removeEventListener("pointermove", updatePointerPosition);
            window.removeEventListener("pointerover", handlePointerOver);
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
