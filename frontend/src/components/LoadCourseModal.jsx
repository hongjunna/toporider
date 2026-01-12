import React, { useState } from 'react';
import { deleteCourse, updateCourse } from '../api/courseApi';

const LoadCourseModal = ({ isOpen, onClose, courseList, onLoad, onRefresh }) => {
    const [editingId, setEditingId] = useState(null); // 현재 수정 중인 코스 ID
    const [editTitle, setEditTitle] = useState("");   // 수정 중인 제목 텍스트

    if (!isOpen) return null;

    // 삭제 핸들러
    const handleDelete = async (id) => {
        if (window.confirm("정말 이 코스를 삭제하시겠습니까?")) {
            try {
                await deleteCourse(id);
                alert("삭제되었습니다.");
                onRefresh(); // 목록 새로고침 (App.jsx에서 전달받음)
            } catch (e) {
                alert("삭제 실패");
            }
        }
    };

    // 수정 모드 진입
    const startEdit = (course) => {
        setEditingId(course.id);
        setEditTitle(course.title);
    };

    // 수정 취소
    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
    };

    // 수정 저장
    const saveEdit = async (id) => {
        if (!editTitle.trim()) return alert("제목을 입력해주세요.");
        try {
            await updateCourse(id, editTitle);
            setEditingId(null);
            alert("수정이 완료되었습니다.")
            onRefresh(); // 목록 새로고침
        } catch (e) {
            alert("수정에 실패하였습니다. 관리자에게 문의해 주세요");
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                backgroundColor: 'white',
                color: '#333', // ⚡ [수정] 글자색을 검정색(#333)으로 강제 지정!
                padding: '20px', borderRadius: '12px',
                width: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    {/* ⚡ color 상속받아 이제 잘 보일 겁니다 */}
                    <h2 style={{ margin: 0 }}>📂 저장된 코스 목록</h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#333' }}>✖</button>
                </div>

                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {courseList.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888' }}>저장된 코스가 없습니다.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {courseList.map(course => (
                                <li key={course.id} style={{
                                    borderBottom: '1px solid #eee', padding: '12px 0',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    {editingId === course.id ? (
                                        // --- 수정 모드 ---
                                        <div style={{ display: 'flex', gap: '5px', flex: 1, marginRight: '10px' }}>
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                // ⚡ 입력창 글씨도 잘 보이게 색상 지정
                                                style={{ flex: 1, padding: '5px', color: '#000', backgroundColor: '#fff', border: '1px solid #ccc' }}
                                            />
                                            <button onClick={() => saveEdit(course.id)} style={btnStyle('green')}>확인</button>
                                            <button onClick={cancelEdit} style={btnStyle('#888')}>취소</button>
                                        </div>
                                    ) : (
                                        // --- 일반 모드 ---
                                        <div style={{ flex: 1 }}>
                                            {/* ⚡ color 상속받아 잘 보임 */}
                                            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{course.title}</span>
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                {new Date(course.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    )}

                                    {/* 버튼 그룹 */}
                                    {editingId !== course.id && (
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button onClick={() => onLoad(course)} style={btnStyle('#3b82f6')}>불러오기</button>
                                            <button onClick={() => startEdit(course)} style={btnStyle('#f59e0b')}>코스명 수정</button>
                                            <button onClick={() => handleDelete(course.id)} style={btnStyle('#ef4444')}>삭제</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};
// 간단한 버튼 스타일 함수
const btnStyle = (color) => ({
    backgroundColor: color, color: 'white', border: 'none',
    padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
});

export default LoadCourseModal;