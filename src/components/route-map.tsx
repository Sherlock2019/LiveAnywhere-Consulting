"use client";

import { useEffect, useMemo, useState } from "react";
import Map, { Layer, Marker, NavigationControl, Source } from "react-map-gl/maplibre";
import { MapPin, Plane } from "lucide-react";
import { countryById } from "@/data/countries";

type RouteMapProps = {
  originId: string;
  destinationId: string;
  onCountryClick?: (countryId: string) => void;
  compact?: boolean;
};

function routeCoordinates(originId: string, destinationId: string) {
  const origin = countryById(originId).center;
  const destination = countryById(destinationId).center;
  let endLongitude = destination[0];
  if (destination[0] - origin[0] > 180) endLongitude -= 360;
  if (destination[0] - origin[0] < -180) endLongitude += 360;

  return Array.from({ length: 81 }, (_, index) => {
    const t = index / 80;
    const longitude = origin[0] + (endLongitude - origin[0]) * t;
    const latitude = origin[1] + (destination[1] - origin[1]) * t + Math.sin(Math.PI * t) * 28;
    return [longitude, latitude] as [number, number];
  });
}

export default function RouteMap({ originId, destinationId, onCountryClick, compact = false }: RouteMapProps) {
  const origin = countryById(originId);
  const destination = countryById(destinationId);
  const points = useMemo(() => routeCoordinates(originId, destinationId), [originId, destinationId]);
  const [progress, setProgress] = useState(0.58);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let frame = 0;
    const started = performance.now();
    const animate = (now: number) => {
      setProgress(((now - started) % 7000) / 7000);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [originId, destinationId]);

  const route = {
    type: "Feature" as const,
    properties: {},
    geometry: { type: "LineString" as const, coordinates: points },
  };
  const planePoint = points[Math.min(points.length - 1, Math.floor(progress * points.length))];
  const normalizedPlaneLongitude = ((planePoint[0] + 540) % 360) - 180;

  return (
    <div className={`route-map ${compact ? "route-map--compact" : ""}`}>
      <Map
        key={`${originId}-${destinationId}`}
        initialViewState={{ longitude: -168, latitude: 29, zoom: compact ? 0.85 : 1.2 }}
        minZoom={0.7}
        maxZoom={7}
        mapStyle="https://demotiles.maplibre.org/style.json"
        attributionControl={{ compact: true }}
        cooperativeGestures
      >
        <NavigationControl position="bottom-right" showCompass={false} />
        <Source id="move-route" type="geojson" data={route}>
          <Layer id="move-route-shadow" type="line" paint={{ "line-color": "#102A43", "line-opacity": 0.16, "line-width": 8 }} />
          <Layer id="move-route-line" type="line" paint={{ "line-color": "#D99A3D", "line-width": 3, "line-dasharray": [2, 2] }} />
        </Source>
        <Marker longitude={origin.center[0]} latitude={origin.center[1]} anchor="bottom">
          <button className="map-marker map-marker--origin" onClick={() => onCountryClick?.(origin.id)} aria-label={`${origin.name}, selected origin`}>
            <MapPin aria-hidden="true" /><span>{origin.flag} {origin.shortName}</span>
          </button>
        </Marker>
        <Marker longitude={destination.center[0]} latitude={destination.center[1]} anchor="bottom">
          <button className="map-marker map-marker--destination" onClick={() => onCountryClick?.(destination.id)} aria-label={`${destination.name}, selected destination`}>
            <MapPin aria-hidden="true" /><span>{destination.flag} {destination.shortName}</span>
          </button>
        </Marker>
        <Marker longitude={normalizedPlaneLongitude} latitude={planePoint[1]} anchor="center">
          <span className="map-plane" aria-hidden="true"><Plane /></span>
        </Marker>
      </Map>
      <div className="map-route-label">
        <span>{origin.flag} {origin.shortName}</span>
        <span className="map-route-label__line" aria-hidden="true" />
        <span>{destination.flag} {destination.shortName}</span>
      </div>
    </div>
  );
}
