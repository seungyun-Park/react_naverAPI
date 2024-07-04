import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { NavermapsProvider,  } from 'react-naver-maps';
import { Container as MapDiv, NaverMap, Marker, InfoWindow } from 'react-naver-maps';


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

function MapPage() {
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [infoWindowPosition, setInfoWindowPosition] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const { naver } = window;
    const mapOptions = {
      center: new naver.maps.LatLng(37.52133, 126.9522),
      zoom: 17,
    };

    if (naver && mapRef.current) {
      const map = new naver.maps.Map(mapRef.current, mapOptions);
      console.log(map);
    }
  }, []);

  const handleMarkerClick = (position) => {
    setInfoWindowPosition(position);
    if(!infoWindowOpen)
      setInfoWindowOpen(true);
    else 
      setInfoWindowOpen(false);
  };

  return (
    <>
      <Header />
      <TitleContainer>
        <Line />
        <Title>지도</Title>
        <Line />
      </TitleContainer>
      <RedLine />
      <Container>
        <NavermapsProvider
          ncpClientId={process.env.MY_CLIENT_ID}
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
                  onClick={() => handleMarkerClick({ lat: 36.604528, lng: 127.298399 })}
                />
                {infoWindowOpen && (
                  // alert("hi")
                  <InfoWindow
                    position={infoWindowPosition}
                    onCloseClick={() => setInfoWindowOpen(false)}
                  >
                    <div>
                      <h4>마커 정보</h4>
                      <p>이곳은 특정 위치입니다.</p>
                    </div>
                  </InfoWindow>
                )}
              </NaverMap>
            </MapContainer>
          </MapDiv>
        </NavermapsProvider>
      </Container>
    </>
  );
}

export default MapPage;
