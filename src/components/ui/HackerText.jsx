import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

const getRandomCharacter = () => letters[Math.floor(Math.random() * letters.length)];

const buildScrambledText = (text, iteration) =>
    text
        .split("")
        .map((_, index) => (index < iteration ? text[index] : getRandomCharacter()))
        .join("");

const HackerText = ({ text, className, as: Component = "span", animate = true, interactive = true }) => {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef(null);

    const scrambleText = useCallback(() => {
        let iteration = 0;

        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplayText(buildScrambledText(text, iteration));

            if (iteration >= text.length) {
                clearInterval(intervalRef.current);
            }

            iteration += 1 / 3;
        }, 30);
    }, [text]);

    useEffect(() => {
        clearInterval(intervalRef.current);

        if (animate) {
            scrambleText();
        }

        return () => clearInterval(intervalRef.current);
    }, [animate, scrambleText]);

    const MotionComponent = motion[Component] || motion.span;
    const renderedText = animate ? displayText : text;

    return (
        <MotionComponent
            className={className}
            onMouseEnter={interactive && animate ? scrambleText : undefined}
        >
            {renderedText}
        </MotionComponent>
    );
};

export default HackerText;
