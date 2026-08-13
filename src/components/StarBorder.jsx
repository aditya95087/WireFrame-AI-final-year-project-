import React from 'react';
import './StarBorder.css';

const StarBorder = ({
    as: Component = 'button',
    className = '',
    color = 'white',
    speed = '6s',
    thickness = 1,
    children,
    ...rest
}) => {
    return (
        <Component
            className={`star-border-container ${className}`}
            style={{
                padding: '1px', // Using 1px padding to show border by default if thickness not managed by CSS specifically
                ...rest.style
            }}
            {...rest}
        >
            <div
                className="border-gradient-bottom"
                style={{
                    background: `radial-gradient(circle, ${color}, transparent 10%)`,
                    animationDuration: speed
                }}
            ></div>
            <div
                className="border-gradient-top"
                style={{
                    background: `radial-gradient(circle, ${color}, transparent 10%)`,
                    animationDuration: speed
                }}
            ></div>
            <div className="inner-content">{children}</div>
        </Component>
    );
};

export default StarBorder;
