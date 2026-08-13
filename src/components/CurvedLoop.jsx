import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion';

const CurvedLoop = ({
    speed = 1,
    curveAmount = 200,
    direction = "right",
    interactive = false,
    className = ""
}) => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const baseX = useMotionValue(0);

    const marqueeText = " Turn-Ideas-Into-WireFrames !";

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useAnimationFrame((t, delta) => {
        let moveBy = direction === "right" ? -speed : speed;
        moveBy = (moveBy * delta) / 10;

        if (direction === "right") {
            if (baseX.get() <= -100) baseX.set(0);
        } else {
            if (baseX.get() >= 100) baseX.set(0);
        }

        baseX.set(baseX.get() + moveBy);
    });

    const pathD = `M 0 ${dimensions.height / 2} Q ${dimensions.width / 2} ${dimensions.height / 2 + curveAmount} ${dimensions.width} ${dimensions.height / 2}`;

    return (
        <div
            ref={containerRef}
            className={`w-full h-full overflow-hidden absolute inset-0 pointer-events-none ${interactive ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : ''}`}
            style={{ userSelect: 'none' }}
        >
            <svg className="w-full h-full" viewBox={`0 0 ${dimensions.width || 100} ${dimensions.height || 100}`} preserveAspectRatio="none">
                <path id="curve-path" d={pathD} fill="transparent" />

                <text className={className} width={dimensions.width}>
                    <textPath
                        href="#curve-path"
                        startOffset="0%"
                        style={{ fill: "currentColor" }}
                    >
                        {Array(10).fill(marqueeText).join("   ")}

                        <animate
                            attributeName="startOffset"
                            from={direction === "right" ? "0%" : "100%"}
                            to={direction === "right" ? "-100%" : "0%"}
                            dur={`${20 / speed}s`}
                            repeatCount="indefinite"
                        />
                    </textPath>
                </text>
            </svg>
        </div>
    );
};

export default CurvedLoop;
