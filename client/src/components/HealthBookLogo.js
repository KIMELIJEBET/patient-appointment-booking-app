import React from 'react';

export default function HealthBookLogo({ size = 'medium', color = 'white' }) {
    const sizes = {
        small: { fontSize: '18px', padding: '4px 8px' },
        medium: { fontSize: '24px', padding: '6px 12px' },
        large: { fontSize: '32px', padding: '8px 16px' },
    };

    const logoStyle = {
        ...sizes[size],
        fontWeight: 'bold',
        color: color,
        backgroundColor: 'transparent',
        textDecoration: 'none',
        display: 'inline-block',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        letterSpacing: '-0.5px',
    };

    return (
        <span style={logoStyle}>
            <span style={{ color: color }}>♥</span> HealthBook
        </span>
    );
}
