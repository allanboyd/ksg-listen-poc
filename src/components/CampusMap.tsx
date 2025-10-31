"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import type { Campus } from "@/data/mockData";

type LatLng = google.maps.LatLngLiteral;

export type CampusMapProps = {
  campuses: Campus[];
  height?: string | number;
  selectedCampusId?: string;
  origin?: LatLng | string; // if string, will be geocoded
};

const containerStyle: google.maps.MapOptions = {
  disableDefaultUI: false,
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
};

export default function CampusMap({ campuses, height = 420, selectedCampusId, origin }: CampusMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const [center, setCenter] = useState<LatLng>({ lat: -0.5, lng: 37.0 });
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const selectedCampus = useMemo(() => campuses.find(c => c.id === selectedCampusId) || campuses[0], [campuses, selectedCampusId]);

  useEffect(() => {
    if (selectedCampus) setCenter({ lat: selectedCampus.lat, lng: selectedCampus.lng });
  }, [selectedCampus]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    // Fit to all campus markers
    const bounds = new google.maps.LatLngBounds();
    campuses.forEach(c => bounds.extend({ lat: c.lat, lng: c.lng }));
    map.fitBounds(bounds);
  }, [campuses]);

  const requestDirections = useCallback(async () => {
    if (!selectedCampus || !origin) { setDirections(null); return; }
    const svc = new google.maps.DirectionsService();
    const originValue: any = typeof origin === "string" ? origin : origin;
    const destination: LatLng = { lat: selectedCampus.lat, lng: selectedCampus.lng };
    const result = await svc.route({ origin: originValue, destination, travelMode: google.maps.TravelMode.DRIVING });
    setDirections(result);
    if (mapRef.current) {
      const renderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
      renderer.setMap(mapRef.current);
      renderer.setDirections(result);
    }
  }, [origin, selectedCampus]);

  useEffect(() => { requestDirections().catch(() => setDirections(null)); }, [requestDirections]);

  const mapCenter = useMemo(() => center, [center]);

  return (
    <LoadScript googleMapsApiKey={apiKey} loadingElement={<div style={{ height }} />}>
      <GoogleMap mapContainerStyle={{ width: "100%", height }} center={mapCenter} zoom={6} options={containerStyle} onLoad={onLoad}>
        {campuses.map(c => (
          <Marker key={c.id} position={{ lat: c.lat, lng: c.lng }} title={`${c.name}${c.address ? ` — ${c.address}` : ""}`} />
        ))}
        {directions && (
          <DirectionsRenderer directions={directions} options={{ suppressMarkers: true, polylineOptions: { strokeColor: "#7F632C", strokeWeight: 5 } }} />
        )}
      </GoogleMap>
    </LoadScript>
  );
}




