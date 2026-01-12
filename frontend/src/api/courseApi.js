import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchRoutePath = async (start, end, mode = 'turn-by-turn') => {
    try {
        const params = new URLSearchParams();
        params.append('point', `${start.lat},${start.lng}`);
        params.append('point', `${end.lat},${end.lng}`);
        params.append('profile', 'bike');
        params.append('mode', mode);

        const response = await axios.get(`${BASE_URL}/route`, { params });

        if (response.data.paths && response.data.paths.length > 0) {
            const pathData = response.data.paths[0].decoded_points;
            return pathData.map(pt => ({
                lat: pt[0],
                lng: pt[1],
                ele: pt[2] || 0
            }));
        }
        return null;
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};

export const saveCourse = async (title, markers, polylines) => {
    return await axios.post(`${BASE_URL}/courses`, { title, markers, polylines });
};

export const getCourseList = async () => {
    return await axios.get(`${BASE_URL}/courses`);
};

export const downloadTCX = async (polylines) => {
    let flatPoints = [];
    polylines.forEach(segment => {
        flatPoints = [...flatPoints, ...segment];
    });

    return await axios.post(`${BASE_URL}/export/tcx`,
        { trackPoints: flatPoints },
        { responseType: 'blob' }
    );
};

export const deleteCourse = async (courseId) => {
    return await axios.delete(`${BASE_URL}/courses/${courseId}`);
};

// ⚡ [수정] 제목뿐만 아니라 경로 데이터도 함께 업데이트 가능하도록 변경
export const updateCourse = async (courseId, title, markers, polylines) => {
    return await axios.put(`${BASE_URL}/courses/${courseId}`, {
        title,
        markers,
        polylines
    });
};