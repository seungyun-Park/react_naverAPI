import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { NavermapsProvider } from 'react-naver-maps';
import { Container as MapDiv, NaverMap, Marker } from 'react-naver-maps';

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 10vh;
  background-color: rgb(140, 3, 39);
  padding: 40px;
`;

const Title = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 45px;
  font-weight: 550;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #ffffff;
`;

const Line = styled.div`
  width: 100%;
  text-align: center;
  border-bottom: 4px solid #D6CDBE;
  line-height: 0.2em;
  margin: 15px 0 15px;
`;

const RedLine = styled.div`
  width: 85%;
  text-align: center;
  border-bottom: 4px solid rgb(140, 3, 39);
  line-height: 0.2em;
  margin: 30px auto 15px;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const DistanceInfo = styled.div`
  font-size: 16px;
  margin-top: 10px;
  text-align: center;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 0 10px;
  width: 200px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
`;

const InfoContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
`;

const InfoItem = styled.p`
  margin: 10px 0;
  font-size: 16px;
`;

// 하버사인 공식으로 두 좌표 사이의 거리 계산
function calculateDistance(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180; // 각도를 라디안으로 변환
  const R = 6371; // 지구 반지름 (km)

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 거리(km)
}

function MapPage() {
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { naver } = window;
    if (!map && naver && mapRef.current) {
      const newMap = new naver.maps.Map(mapRef.current, {
        center: new naver.maps.LatLng(36.604528, 127.298399),
        zoom: 17,
      });
      setMap(newMap);
    }
  }, [map]);

  const fetchDirections = async () => {
    const [startLat, startLng] = start.split(',');
    const [endLat, endLng] = end.split(',');
    console.log(startLat,startLng, endLat,endLng);
  
    // URL을 상대 경로로 변경
    const url = `/api/map-direction/v1/driving?start=${startLng},${startLat}&goal=${endLng},${endLat}&option=trafast`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': process.env.REACT_APP_NAVER_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': process.env.REACT_APP_NAVER_CLIENT_SECRET,
        }
      });
      console.log(response);
      const data = await response.json();
      
      if (data.route && data.route.trafast && data.route.trafast[0]) {
        const route = data.route.trafast[0];
        setRouteInfo({
          distance: route.summary.distance,
          duration: route.summary.duration,
          tollFare: route.summary.tollFare,
          fuelPrice: route.summary.fuelPrice,
        });
        setPath(route.path.map(coord => new naver.maps.LatLng(coord[1], coord[0])));

        // 지도 중심과 줌 레벨 조정
        const bounds = route.bbox;
        const newBounds = new naver.maps.LatLngBounds(
          new naver.maps.LatLng(bounds[1], bounds[0]),
          new naver.maps.LatLng(bounds[3], bounds[2])
        );
        map.fitBounds(newBounds);
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  useEffect(() => {
    if (map) {
      fetchDirections();
    }
  }, []);

  return (
    <>
      <Header />
      <TitleContainer>
        <Line />
        <Title>지도</Title>
        <Line />
      </TitleContainer>
      <RedLine />
      <InputContainer>
        <Input
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="출발지 (위도,경도)"
        />
        <Input
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="도착지 (위도,경도)"
        />
        <Button onClick={fetchDirections}>경로 검색</Button>
      </InputContainer>
      <Container>
        <NavermapsProvider
          ncpClientId={process.env.MY_CLIENT_ID} // 여기에 클라이언트 아이디를 입력하세요
          error={<p>Maps Load Error</p>}
          loading={<p>Maps Loading...</p>}
        >
          <MapDiv style={{ width: '70%', height: '70vh', display: 'flex', justifyContent: 'center' }}>
            <MapContainer ref={mapRef} id="map">
              <NaverMap
                id="react-naver-maps-introduction"
                style={{ width: '100%', height: '100vh' }}
                center={{ lat: 36.604528, lng: 127.298399 }}
                zoom={17}
              >
                <Marker
                  position={{ lat: 36.604528, lng: 127.298399 }}
                  onClick={() => {
                    alert('마커 클릭됨!');
                  }}
                />
              </NaverMap>
            </MapContainer>
          </MapDiv>
        </NavermapsProvider>
      </Container>
      {routeInfo && (
        <InfoContainer>
          <InfoItem>거리: {(routeInfo.distance / 1000).toFixed(2)} km</InfoItem>
          <InfoItem>예상 소요 시간: {Math.round(routeInfo.duration / 60)} 분</InfoItem>
          <InfoItem>통행료: {routeInfo.tollFare} 원</InfoItem>
          <InfoItem>예상 연료비: {routeInfo.fuelPrice} 원</InfoItem>
        </InfoContainer>
      )}
    </>
  );
}

export default MapPage;