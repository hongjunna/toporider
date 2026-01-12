// src/App.jsx
import { useState, useCallback, useRef, useEffect } from 'react';
import { Map, MapMarker, Polyline } from 'react-kakao-maps-sdk';
import ElevationChart from './ElevationChart';

import { ICONS } from './constants';
import { useHistoryState } from './hooks/useHistoryState';
import { fetchRoutePath, saveCourse, getCourseList, downloadTCX, updateCourse } from './api/courseApi';
import ControlPanel from './components/ControlPanel';
import LoadCourseModal from './components/LoadCourseModal';
import GradientLegend from './components/GradientLegend';

// ⚡ 테마 색상 가져오기
import { COLORS } from './styles/theme';

function App() {
  const [center, setCenter] = useState({ lat: 37.521285, lng: 126.999852 });
  const [map, setMap] = useState(null);

  const { currentState, pushState, undo, redo, reset, canUndo, canRedo } = useHistoryState({ markers: [], polylines: [] });
  const { markers: currentMarkers, polylines: currentPolylines } = currentState;

  const [courseList, setCourseList] = useState([]);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(true);
  const [isAutoRouting, setIsAutoRouting] = useState(true);

  const [currentTitle, setCurrentTitle] = useState("새 코스");
  const [isModified, setIsModified] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const hoverMarkerRef = useRef(null);

  useEffect(() => {
    if (!map) return;
    map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.BICYCLE);
    const markerImage = new window.kakao.maps.MarkerImage(
      ICONS.HOVER_TARGET,
      new window.kakao.maps.Size(24, 24),
      { offset: new window.kakao.maps.Point(12, 12) }
    );
    const marker = new window.kakao.maps.Marker({ position: map.getCenter(), image: markerImage, zIndex: 100 });
    marker.setMap(map);
    marker.setVisible(false);
    hoverMarkerRef.current = marker;
  }, [map]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isModified) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isModified]);

  const handleMapClick = async (_target, mouseEvent) => {
    const lat = mouseEvent.latLng.getLat();
    const lng = mouseEvent.latLng.getLng();
    const newPoint = { lat, lng };
    let nextMarkers = [...currentMarkers, newPoint];
    let nextPolylines = [...currentPolylines];

    if (nextMarkers.length > 1) {
      const lastPoint = nextMarkers[nextMarkers.length - 2];
      const mode = isAutoRouting ? 'turn-by-turn' : 'straight';

      try {
        const newPathSegment = await fetchRoutePath(lastPoint, newPoint, mode);

        if (newPathSegment) {
          nextPolylines.push(newPathSegment);
        } else {
          nextPolylines.push([
            { lat: lastPoint.lat, lng: lastPoint.lng, ele: 0 },
            { lat: newPoint.lat, lng: newPoint.lng, ele: 0 }
          ]);
        }
      } catch (error) {
        console.error("경로 생성 에러:", error);
      }
    }

    pushState({ markers: nextMarkers, polylines: nextPolylines });
    setIsChartOpen(true);
    setIsModified(true);
  };

  const handleSave = async () => {
    if (currentMarkers.length < 2) return alert("저장할 코스가 없어요!");

    if (currentId) {
      if (window.confirm(`수정된 내용이 있습니다.\n기존 코스 [${currentTitle}]에 덮어쓰시겠습니까?\n('취소'를 누르면 새 이름으로 저장합니다.)`)) {
        try {
          await updateCourse(currentId, currentTitle, currentMarkers, currentPolylines);
          alert("✅ 저장 완료!");
          setIsModified(false);
          return;
        } catch (e) {
          alert("저장 실패");
          return;
        }
      }
    }

    const title = prompt("새 코스로 저장합니다. 이름을 입력하세요:", currentTitle !== "새 코스" ? currentTitle : "나의 주말 라이딩");
    if (!title) return;

    try {
      const response = await saveCourse(title, currentMarkers, currentPolylines);
      if (response.data.status === 'success') {
        alert(`✅ 저장 완료!`);
        setCurrentTitle(title);
        setCurrentId(response.data.course_id);
        setIsModified(false);
      }
    } catch (error) { alert("저장 실패"); }
  };

  const handleFetchList = async () => {
    try {
      const response = await getCourseList();
      setCourseList(response.data);
      setIsLoadModalOpen(true);
    } catch (e) { alert("목록 로드 실패"); }
  };

  const handleLoadCourse = (course) => {
    if (isModified) {
      if (!window.confirm("수정 중인 내용이 사라집니다. 불러오시겠습니까?")) return;
    }

    try {
      const loadedMarkers = JSON.parse(course.markers_json);
      const loadedPolylines = JSON.parse(course.polylines_json);
      reset({ markers: loadedMarkers, polylines: loadedPolylines });
      if (loadedMarkers.length > 0) setCenter(loadedMarkers[0]);
      setIsLoadModalOpen(false);
      setIsChartOpen(true);

      setCurrentTitle(course.title);
      setCurrentId(course.id);
      setIsModified(false);
    } catch (e) { alert("데이터 오류"); }
  };

  const handleDownload = async () => {
    if (currentPolylines.length === 0) return alert("경로가 없습니다.");
    try {
      const response = await downloadTCX(currentPolylines);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `toporider_${Date.now()}.tcx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) { alert("TCX 생성 실패"); }
  };

  const handleResetApp = () => {
    if (isModified && !window.confirm("수정 중인 내용이 사라집니다. 초기화 하시겠습니까?")) return;

    if (window.confirm("지도가 초기화됩니다.")) {
      reset({ markers: [], polylines: [] });
      if (hoverMarkerRef.current) hoverMarkerRef.current.setVisible(false);

      setCurrentTitle("새 코스");
      setCurrentId(null);
      setIsModified(false);
    }
  };

  const updateHoverMarker = useCallback((coord) => {
    const marker = hoverMarkerRef.current;
    if (!marker) return;
    if (coord) {
      marker.setPosition(new window.kakao.maps.LatLng(coord.lat, coord.lng));
      marker.setVisible(true);
    } else {
      marker.setVisible(false);
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <Map center={center} style={{ width: '100%', height: '100%' }} level={5} onClick={handleMapClick} onCreate={setMap}>
          {currentMarkers.map((pos, idx) => {
            let imageSrc = ICONS.WAYPOINT;
            if (idx === 0) imageSrc = ICONS.START;
            else if (idx === currentMarkers.length - 1) imageSrc = ICONS.END;
            return <MapMarker key={`m-${idx}`} position={pos} image={{ src: imageSrc, size: { width: 20, height: 20 }, options: { offset: { x: 8, y: 8 } } }} />;
          })}
          {currentPolylines.map((path, idx) => (
            // ⚡ 경로 색상을 브랜드 컬러 Lime(Accent)로 변경하여 지도 위에서 돋보이게 함
            <Polyline key={`l-${idx}`} path={path} strokeWeight={6} strokeColor={COLORS.accent} strokeOpacity={0.9} strokeStyle={"solid"} />
          ))}
        </Map>
        <ControlPanel
          markerCount={currentMarkers.length}
          polylineCount={currentPolylines.length}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onSave={handleSave}
          onList={handleFetchList}
          onDownload={handleDownload}
          onReset={handleResetApp}
          isAutoRouting={isAutoRouting}
          onToggleAutoRouting={setIsAutoRouting}
          currentTitle={currentTitle}
          isModified={isModified}
        />
      </div>

      {currentPolylines.length > 0 && (
        <div style={{ position: 'relative', zIndex: 20 }}>
          <button
            onClick={() => setIsChartOpen(!isChartOpen)}
            style={{
              position: 'absolute', top: '-30px', right: '20px', height: '30px',
              backgroundColor: COLORS.white,
              border: `1px solid ${COLORS.border}`, borderBottom: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer',
              padding: '0 15px', fontSize: '13px', fontWeight: 'bold', color: COLORS.primary,
              boxShadow: '0 -3px 5px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {isChartOpen ? '▼ 고도 차트 닫기' : '▲ 고도 차트 보기'}
          </button>
          <div style={{
            height: isChartOpen ? '220px' : '0px', transition: 'height 0.3s ease-in-out', overflow: 'hidden',
            backgroundColor: COLORS.white, borderTop: `1px solid ${COLORS.border}`, display: 'flex', flexDirection: 'row'
          }}>
            <div style={{ flex: 1, position: 'relative', padding: '10px' }}>
              <ElevationChart polylines={currentPolylines} onHoverPoint={updateHoverMarker} />
            </div>
            <GradientLegend />
          </div>
        </div>
      )}

      <LoadCourseModal
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        courseList={courseList}
        onLoad={handleLoadCourse}
        onRefresh={handleFetchList}
      />
    </div>
  );
}

export default App;