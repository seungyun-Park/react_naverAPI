import React, { useEffect } from 'react'
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps'

//npm install react-naver-maps
//https://colinch4.github.io/2021-06-07/navermap/
//https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html
const MyMap = () => {
    
    const navermaps = useNavermaps()

    return (
        <NaverMap
            defaultCenter={new navermaps.LatLng(37.3595704, 127.105399)}
            defaultZoom={10}
        >
            <Marker
                defaultPosition={new navermaps.LatLng(37.3595704, 127.105399)}
            />
        </NaverMap>
    )

}

export default MyMap;