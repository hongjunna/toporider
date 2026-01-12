// src/constants.js

// --- SVG Icons ---
export const ICONS = {
    WAYPOINT: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='8' fill='%23FF3399' stroke='white' stroke-width='3'/%3E%3C/svg%3E",
    START: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='8' fill='%2300E676' stroke='white' stroke-width='3'/%3E%3C/svg%3E",
    END: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='8' fill='%23FF0000' stroke='white' stroke-width='3'/%3E%3C/svg%3E",
    HOVER_TARGET: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='8' fill='black' stroke='white' stroke-width='3'/%3E%3C/svg%3E",
};

// --- Common Styles ---
export const STYLES = {
    baseBtn: {
        padding: '10px',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
    },
    controlPanel: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
        width: '220px',
    },
};