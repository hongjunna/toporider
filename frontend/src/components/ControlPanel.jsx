import React, { useState } from 'react';
import { STYLES } from '../constants';

const ControlPanel = ({
    markerCount,
    polylineCount,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onSave,
    onList,
    onDownload,
    onReset,
    isAutoRouting,
    onToggleAutoRouting,
    // ⚡ [신규] 부모에서 받을 제목과 수정 상태
    currentTitle = "새 코스",
    isModified = false
}) => {
    const [isOpen, setIsOpen] = useState(true);

    const actionBtnStyle = {
        ...STYLES.baseBtn,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
    };

    const iconBtnStyle = (disabled) => ({
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        border: '1px solid #eee',
        backgroundColor: disabled ? '#f5f5f5' : 'white',
        color: disabled ? '#ccc' : '#333',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        transition: 'all 0.2s',
        boxShadow: disabled ? 'none' : '0 1px 3px rgba(0,0,0,0.1)'
    });

    const contentStyle = {
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        maxHeight: isOpen ? '450px' : '0px', // 높이 살짝 늘림
        opacity: isOpen ? 1 : 0,
        marginTop: isOpen ? '15px' : '0px',
    };

    const arrowStyle = {
        display: 'inline-block',
        transition: 'transform 0.3s ease',
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        color: '#666',
        fontSize: '14px'
    }

    return (
        <div style={{ ...STYLES.controlPanel, display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}>

            {/* 헤더 */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderBottom: isOpen ? '1px solid #eee' : 'none',
                    paddingBottom: isOpen ? '10px' : '0px',
                    transition: 'all 0.3s ease'
                }}
            >
                <h3 style={{ margin: 0, fontSize: '20px', color: '#222' }}>⛰️ TopoRider</h3>
                <span style={arrowStyle}>▼</span>
            </div>

            {/* 내용물 */}
            <div style={contentStyle}>

                {/* ⚡ 상태바 + 도구 모음 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginBottom: '15px',
                    backgroundColor: '#f8f9fa',
                    padding: '10px',
                    borderRadius: '8px'
                }}>
                    {/* ⚡ 0행: 코스 제목 표시 (신규 추가됨) */}
                    <div style={{
                        textAlign: 'center',
                        paddingBottom: '8px',
                        borderBottom: '1px dashed #ddd',
                        marginBottom: '2px'
                    }}>
                        <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#333' }}>
                            {currentTitle}
                        </span>
                        {isModified && (
                            <span style={{
                                fontSize: '12px',
                                color: '#f59e0b', // 주황색 (수정중 느낌)
                                marginLeft: '6px',
                                fontWeight: 'normal',
                                animation: 'pulse 2s infinite' // (선택) 깜빡이는 효과를 원하면 CSS 추가 필요
                            }}>
                                (수정중)
                            </span>
                        )}
                    </div>

                    {/* 1행: 상태 정보 + Undo/Redo */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>
                            📍 WP: {markerCount} <br />
                            📏 Seg: {polylineCount}
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={onUndo} disabled={!canUndo} style={iconBtnStyle(!canUndo)} title="실행 취소">↩️</button>
                            <button onClick={onRedo} disabled={!canRedo} style={iconBtnStyle(!canRedo)} title="다시 실행">↪️</button>
                        </div>
                    </div>

                    {/* 2행: 자동 경로 완성 스위치 */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid #e0e0e0',
                        paddingTop: '8px'
                    }}>
                        <span style={{ fontSize: '13px', color: '#333', fontWeight: '600' }}>⚡ 자동 경로 완성</span>
                        <label style={{ position: 'relative', display: 'inline-block', width: '34px', height: '20px' }}>
                            <input
                                type="checkbox"
                                checked={isAutoRouting}
                                onChange={(e) => onToggleAutoRouting(e.target.checked)}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: isAutoRouting ? '#2196F3' : '#ccc',
                                transition: '.4s', borderRadius: '34px'
                            }}>
                                <span style={{
                                    position: 'absolute', content: '""', height: '14px', width: '14px',
                                    left: isAutoRouting ? '16px' : '4px', bottom: '3px',
                                    backgroundColor: 'white', transition: '.4s', borderRadius: '50%'
                                }}></span>
                            </span>
                        </label>
                    </div>
                </div>

                {/* 메인 액션 버튼들 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={onSave} style={{ ...actionBtnStyle, background: '#2196F3', width: '45%' }}>☁️ 저장</button>
                        <button onClick={onList} style={{ ...actionBtnStyle, background: '#673AB7', width: '55%' }}>📂 불러오기</button>
                    </div>
                    <button onClick={onDownload} style={{ ...actionBtnStyle, background: '#4CAF50' }}>💾 TCX 내보내기</button>
                    <button onClick={onReset} style={{ ...actionBtnStyle, background: '#FF5A5A' }}>🗑️ 초기화</button>
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;