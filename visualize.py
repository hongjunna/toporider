import requests
import folium
import webbrowser
import os

# 1. 브라이언이 만든 FastAPI 서버 호출
url = "http://localhost:8000/route"
params = {
    "point": ["37.517662844319,127.0075561669067", "37.51108575171066,126.99884631528225"], # 출발지, 도착지
    "profile": "bike"
}

print("API 호출 중...")
response = requests.get(url, params=params)
data = response.json()

# 2. 경로 좌표 가져오기
# (우리가 만든 decoded_points를 사용!)
path_coords = data["paths"][0]["decoded_points"]
start_point = path_coords[0]

# 3. 지도 그리기
m = folium.Map(location=start_point, zoom_start=15)

# 경로 선 그리기 (파란색)
folium.PolyLine(
    locations=path_coords,
    color="blue",
    weight=5,
    opacity=0.8
).add_to(m)

# 출발/도착 마커
folium.Marker(path_coords[0], popup="Start", icon=folium.Icon(color="green")).add_to(m)
folium.Marker(path_coords[-1], popup="End", icon=folium.Icon(color="red")).add_to(m)

# 4. 파일로 저장하고 열기
m.save("bike_route.html")
print("지도 생성 완료: bike_route.html")

# 자동으로 브라우저 열기 (Mac/Windows)
webbrowser.open('file://' + os.path.realpath("bike_route.html"))