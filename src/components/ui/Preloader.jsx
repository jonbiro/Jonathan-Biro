import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Preloader = ({ onComplete }) => {
    const [text, setText] = useState("Initializing...");

    useEffect(() => {
        const timer = setTimeout(() => {
            setText("Welcome.");
            setTimeout(() => {
                onComplete();
            }, 800);
        }, 1500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark"
        >
            <div className="relative flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mb-8 p-4 border border-white/10 rounded-full bg-white/5 backdrop-blur-md relative"
                >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-20 blur-xl animate-pulse" />
                    <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        JB
                    </span>
                </motion.div>

                <motion.div
                    className="h-1 w-48 bg-white/10 rounded-full overflow-hidden"
                >
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
                    />
                </motion.div>

                <p className="mt-4 text-sm text-gray-400 font-mono">
                    {text}
                </p>
            </div>
        </motion.div>
    );
};

export default Preloader;
