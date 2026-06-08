"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

interface KakaoMouseEvent {
  latLng: KakaoLatLng;
}

interface KakaoAddressResult {
  road_address: { address_name: string } | null;
  address: { address_name: string };
}

interface KakaoKeywordResult {
  x: string;
  y: string;
  place_name: string;
  road_address_name: string;
  address_name: string;
}

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: object) => object;
        Marker: new (options: object) => {
          setMap: (map: object | null) => void;
          setPosition: (latlng: object) => void;
        };
        LatLng: new (lat: number, lng: number) => object;
        event: {
          addListener: (
            target: object,
            type: string,
            handler: (e: KakaoMouseEvent) => void,
          ) => void;
        };
        services: {
          Geocoder: new () => {
            coord2Address: (
              lng: number,
              lat: number,
              callback: (result: KakaoAddressResult[], status: string) => void,
            ) => void;
          };
          Places: new () => {
            keywordSearch: (
              keyword: string,
              callback: (result: KakaoKeywordResult[], status: string) => void,
            ) => void;
          };
          Status: {
            OK: string;
          };
        };
      };
    };
  }
}

export default function MapPicker({ onLocationSelect }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<{ setCenter: (latlng: object) => void } | null>(
    null,
  );
  const markerRef = useRef<{
    setMap: (map: object | null) => void;
    setPosition: (latlng: object) => void;
  } | null>(null);
  const isMapLoadedRef = useRef(false);

  const [address, setAddress] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const initMap = () => {
    if (!mapRef.current) return;

    if (loadingRef.current) {
      loadingRef.current.style.display = "none";
    }

    const initialLatLng = new window.kakao.maps.LatLng(37.4979, 127.0276);

    const options = {
      center: initialLatLng,
      level: 3,
    };

    const map = new window.kakao.maps.Map(mapRef.current, options);
    mapInstanceRef.current = map as { setCenter: (latlng: object) => void };
    isMapLoadedRef.current = true;

    const marker = new window.kakao.maps.Marker({
      position: initialLatLng,
      map: map,
    });
    markerRef.current = marker;

    // 초기 위치 주소 설정
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(127.0276, 37.4979, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const addr = result[0].road_address
          ? result[0].road_address.address_name
          : result[0].address.address_name;
        setAddress(addr);
        onLocationSelect(37.4979, 127.0276, addr);
      }
    });

    // 지도 클릭 이벤트
    window.kakao.maps.event.addListener(
      map,
      "click",
      (mouseEvent: KakaoMouseEvent) => {
        const latlng = mouseEvent.latLng;
        const lat = latlng.getLat();
        const lng = latlng.getLng();

        marker.setPosition(new window.kakao.maps.LatLng(lat, lng));

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(lng, lat, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const addr = result[0].road_address
              ? result[0].road_address.address_name
              : result[0].address.address_name;
            setAddress(addr);
            onLocationSelect(lat, lng, addr);
          }
        });
      },
    );
  };

  useEffect(() => {
    const existingScript = document.querySelector(
      `script[src*="dapi.kakao.com"]`,
    );

    if (existingScript) {
      window.kakao.maps.load(() => {
        initMap();
      });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        initMap();
      });
    };
    script.onerror = (e) => {
      console.error("스크립트 로드 실패:", e);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleSearch = () => {
    if (!searchInput.trim() || !isMapLoadedRef.current) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchInput, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const lat = Number(result[0].y);
        const lng = Number(result[0].x);
        const addr = result[0].road_address_name || result[0].address_name;

        const latlng = new window.kakao.maps.LatLng(lat, lng);
        mapInstanceRef.current?.setCenter(latlng);
        markerRef.current?.setPosition(latlng);

        setAddress(addr);
        onLocationSelect(lat, lng, addr);
      } else {
        alert("장소를 찾을 수 없습니다. 다시 시도해주세요.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 키워드 검색 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="장소를 검색하세요. (예: 강남역, 스타벅스 강남)"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#538752]/30"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2 bg-[#538752] text-white text-sm rounded-lg hover:bg-[#2B6340] transition-colors"
        >
          검색
        </button>
      </div>

      {/* 지도 컨테이너 */}
      <div className="relative w-full h-64">
        <div
          ref={mapRef}
          className="absolute inset-0 rounded-lg overflow-hidden border border-gray-300"
        />
        <div
          ref={loadingRef}
          className="absolute inset-0 rounded-lg border border-gray-300 flex items-center justify-center text-gray-400 text-sm bg-white"
        >
          지도 로딩 중...
        </div>
      </div>

      {/* 선택된 주소 */}
      {address && (
        <p className="text-xs text-gray-500">📍 선택된 위치: {address}</p>
      )}
    </div>
  );
}
