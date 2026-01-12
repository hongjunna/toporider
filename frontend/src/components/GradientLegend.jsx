// src/components/GradientLegend.jsx
import React from 'react';
import { COLORS } from '../styles/theme';

const LEGEND_ITEMS = [
    { label: 'Warm Up (0~2%)', color: '#4A90E2', desc: '몸을 푸는 구간' },
    { label: 'Tempo (2~7%)', color: COLORS.accent, desc: '지형을 느끼는 구간' }, // Lime
    { label: 'Threshold (7~12%)', color: COLORS.secondary, desc: '지구력 싸움' }, // Brown
    { label: 'VO2 Max (12%+)', color: COLORS.danger, desc: '한계 돌파' },   // Red
];

const GradientLegend = () => {
    return (
        <div style={{
            width: '180px',
            padding: '16px',
            backgroundColor: COLORS.white,
            borderLeft: `1px solid ${COLORS.border}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: COLORS.textMain
        }}>
            <h4 style={{
                margin: '0 0 12px 0',
                fontSize: '13px',
                color: COLORS.primary,
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                Training Zones
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {LEGEND_ITEMS.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: item.color,
                            borderRadius: '4px',
                            flexShrink: 0
                        }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '700', fontSize: '12px', color: COLORS.textMain }}>
                                {item.label}
                            </span>
                            <span style={{ fontSize: '10px', color: COLORS.textSub }}>
                                {item.desc}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GradientLegend;