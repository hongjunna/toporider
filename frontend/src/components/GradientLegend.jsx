import React from 'react';

const LEGEND_ITEMS = [
    { label: '평지 (0~2%)', color: 'rgb(54, 162, 235)', desc: '편안함' },
    { label: '완만 (2~5%)', color: 'rgb(75, 192, 192)', desc: '워밍업' },
    { label: '힘듦 (5~10%)', color: 'rgb(255, 206, 86)', desc: '업힐/다운힐 시작' },
    { label: '극한 (10%+)', color: 'rgb(255, 99, 132)', desc: '죽음의 구간' },
];

const GradientLegend = () => {
    return (
        <div style={{
            width: '160px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderLeft: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#555'
        }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>📊 경사도 범례</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {LEGEND_ITEMS.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: item.color,
                            borderRadius: '3px',
                            flexShrink: 0
                        }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 'bold', color: '#333' }}>{item.label}</span>
                            <span style={{ fontSize: '11px', color: '#888' }}>{item.desc}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GradientLegend;