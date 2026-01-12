// src/components/ui/Button.jsx
import React, { useState } from 'react';
import { COLORS, SHADOWS } from '../../styles/theme';

const Button = ({
    children,
    onClick,
    variant = 'primary', // primary, secondary, danger, accent
    size = 'medium',     // small, medium, large
    disabled = false,
    style = {},
    title = ''
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // 1. 브랜드 컬러 매핑
    const getBrandColor = () => {
        if (disabled) return COLORS.disabled;
        switch (variant) {
            case 'primary': return COLORS.primary;   // Teal
            case 'secondary': return COLORS.secondary; // Brown
            case 'danger': return COLORS.danger;     // Red
            case 'accent': return COLORS.accent;     // Lime
            case 'outline': return COLORS.textSub;   // Gray
            default: return COLORS.primary;
        }
    };

    const targetColor = getBrandColor();

    // 2. 배경색 결정 (기본: 흰색, 호버 시: 브랜드 컬러)
    const getBackgroundColor = () => {
        if (disabled) return COLORS.white;
        // Hover 되었거나, 'outline' 타입이 아닐 경우(강제 filled가 필요할 때 등) 로직 확장 가능
        // 현재 요청: 기본은 흰 배경 -> 호버 시 채움
        return isHovered ? targetColor : COLORS.white;
    };

    // 3. 글자색 결정
    const getTextColor = () => {
        if (disabled) return COLORS.disabledText;
        if (isHovered) {
            // Lime 색상(Accent) 위에는 흰 글씨가 안 보이므로 짙은 Teal색 사용
            if (variant === 'accent') return COLORS.primary;
            return COLORS.white;
        }
        // 평소에는 테두리 색과 동일한 글자색 (단, Lime은 가독성 위해 Teal 사용)
        if (variant === 'accent') return COLORS.primary;
        return targetColor;
    };

    // 4. 테두리 결정
    const getBorder = () => {
        if (disabled) return `1px solid ${COLORS.border}`;
        // 평소에도 테두리는 보여야 함
        return `1px solid ${targetColor}`;
    };

    const getPadding = () => {
        switch (size) {
            case 'small': return '6px 12px';
            case 'large': return '12px 24px';
            default: return '10px 16px'; // medium (조금 더 넉넉하게 수정)
        }
    };

    const baseStyle = {
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
        border: getBorder(),
        padding: getPadding(),
        borderRadius: '8px', // 조금 더 둥글게
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: size === 'small' ? '12px' : '14px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        // 그림자: 평소엔 약하게, 호버 시 없음(플랫하게)
        boxShadow: (disabled || isHovered) ? 'none' : SHADOWS.button,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        ...style,
    };

    return (
        <button
            onClick={disabled ? undefined : onClick}
            style={baseStyle}
            disabled={disabled}
            title={title}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </button>
    );
};

export default Button;