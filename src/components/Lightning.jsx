import React, { useRef, useEffect } from 'react';

const Lightning = ({
    hue = 220,
    xOffset = 0,
    speed = 1,
    intensity = 1,
    size = 1
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        class Bolt {
            constructor() {
                this.init();
            }

            init() {
                this.x = Math.random() * canvas.width;
                this.y = 0; // Start from top
                this.segments = [];
                this.maxLength = canvas.height + 100;
                this.currentLength = 0;
                this.life = 0;
                this.maxLife = Math.random() * 20 + 10; // Frames to live
                this.dead = false;

                // Varied starting position based on xOffset
                if (xOffset !== 0) {
                    this.x += xOffset;
                }

                this.createSegments();
            }

            createSegments() {
                let currentX = this.x;
                let currentY = this.y;

                while (currentY < this.maxLength) {
                    const segmentLength = (Math.random() * 10 + 10) * size;
                    const angle = (Math.random() * Math.PI / 4) + Math.PI / 2 - Math.PI / 8; // Mostly down

                    const nextX = currentX + Math.cos(angle) * segmentLength * (Math.random() > 0.5 ? 1 : -1) * 20;
                    const nextY = currentY + Math.sin(angle) * segmentLength;

                    this.segments.push({ x1: currentX, y1: currentY, x2: nextX, y2: nextY });

                    currentX = nextX;
                    currentY = nextY;
                }
            }

            draw() {
                if (this.dead) return;

                this.life++;
                if (this.life > this.maxLife) {
                    this.dead = true;
                    return;
                }

                const alpha = 1 - (this.life / this.maxLife);
                ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${alpha * intensity})`;
                ctx.lineWidth = 2 * size;
                ctx.beginPath();

                for (let segment of this.segments) {
                    ctx.moveTo(segment.x1, segment.y1);
                    ctx.lineTo(segment.x2, segment.y2);
                }

                ctx.stroke();

                // Glow effect
                ctx.strokeStyle = `hsla(${hue}, 100%, 80%, ${alpha * intensity * 0.5})`;
                ctx.lineWidth = 6 * size;
                ctx.stroke();
            }
        }

        let bolts = [];
        let frameCount = 0;

        const animate = () => {
            // Fade out
            ctx.fillStyle = `rgba(0, 0, 0, ${0.1 * speed})`;
            // Note: We might want a transparent clear if it's an overlay, 
            // but for a background effect that builds up, fade is good. 
            // However, the user wants it as a background. 
            // Standard canvas generic wipe:
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Randomly add bolts based on speed/intensity
            if (Math.random() < 0.02 * speed * intensity) {
                bolts.push(new Bolt());
            }

            // Draw bolts
            for (let i = bolts.length - 1; i >= 0; i--) {
                bolts[i].draw();
                if (bolts[i].dead) {
                    bolts.splice(i, 1);
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [hue, xOffset, speed, intensity, size]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full block"
            style={{ position: 'absolute', top: 0, left: 0 }}
        />
    );
};

export default Lightning;
