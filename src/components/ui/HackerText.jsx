import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

const getRandomCharacter = () => letters[Math.floor(Math.random() * letters.length)];

const buildScrambledText = (text, iteration) =>
    text
        .split("")
        .map((_, index) => (index < iteration ? text[index] : getRandomCharacter()))
        .join("");

const HackerText = ({ text, className, as: Component = "span", animate = true, interactive = true }) => {
    const [displayText, setDisplayText] = useState(text);
    const [isScrambling, setIsScrambling] = useState(false);
    const intervalRef = useRef(null);

    const scrambleText = useCallback(() => {
        let iteration = 0;

        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsScrambling(true);

        intervalRef.current = setInterval(() => {
            setDisplayText(buildScrambledText(text, iteration));

            if (iteration >= text.length) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setIsScrambling(false);
            }

            iteration += 1 / 3;
        }, 30);
    }, [text]);

    useEffect(() => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        const resetFrame = window.requestAnimationFrame(() => setIsScrambling(false));

        return () => {
            window.cancelAnimationFrame(resetFrame);
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
    }, [animate, text]);

    const MotionComponent = motion[Component] || motion.span;
    const renderedText = animate && isScrambling ? displayText : text;

    return (
        <MotionComponent
            className={className}
            onMouseEnter={interactive && animate ? scrambleText : undefined}
            aria-label={text}
        >
            <span aria-hidden="true">{renderedText}</span>
        </MotionComponent>
    );
};

export default HackerText;
