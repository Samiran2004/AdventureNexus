import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import L from 'leaflet';

// Fix for default Leaflet marker icon not showing
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to update map center when coords change
const RecenterMap = ({ lat, lng, points }) => {
    const map = useMap();
    useEffect(() => {
        if (points && points.length > 0) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (lat !== undefined && lng !== undefined && lat !== 0 && lng !== 0) {
            map.setView([lat, lng], 13);
        }
    }, [lat, lng, points, map]);
    return null;
};

const HighlightMap = ({ highlight, highlights, routeCoordinates, destinationName, isSatellite = true }) => {
    // Determine markers to show
    const markers = highlights || (highlight ? [highlight] : []);

    // Check if any markers have coordinates
    const validMarkers = markers.filter(m => m?.geo_coordinates?.lat && m?.geo_coordinates?.lng);
    const hasData = validMarkers.length > 0;

    // Default center
    const centerLat = highlight?.geo_coordinates?.lat || validMarkers[0]?.geo_coordinates?.lat || 0;
    const centerLng = highlight?.geo_coordinates?.lng || validMarkers[0]?.geo_coordinates?.lng || 0;

    // Collect all points for bounds fitting
    const allPoints = [
        ...validMarkers.map(m => [m.geo_coordinates.lat, m.geo_coordinates.lng]),
        ...(routeCoordinates || [])
    ];

    if (!hasData) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-muted/20 rounded-lg p-6 text-center">
                <AlertCircle className="text-muted-foreground mb-2 opacity-20" size={48} />
                <p className="text-muted-foreground font-medium">Location data unavailable</p>
                <p className="text-xs text-muted-foreground mt-1">We couldn't get the exact coordinates for this area.</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full rounded-lg overflow-hidden border border-border relative z-0">
            <MapContainer
                center={[centerLat, centerLng]}
                zoom={14}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                {isSatellite ? (
                    <>
                        <TileLayer
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                        <TileLayer
                            attribution='Labels &copy; Esri'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                            opacity={0.7}
                        />
                    </>
                ) : (
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                )}

                {validMarkers.map((m, idx) => (
                    <Marker key={idx} position={[m.geo_coordinates.lat, m.geo_coordinates.lng]}>
                        <Popup>
                            <div className="text-sm">
                                <strong className="block text-base">{m.name}</strong>
                                {m.description && <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>}
                                <span className="text-[10px] uppercase font-bold text-primary mt-2 block">{destinationName}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {routeCoordinates && routeCoordinates.length > 1 && (
                    <Polyline
                        positions={routeCoordinates}
                        pathOptions={{
                            color: '#3b82f6',
                            weight: 5,
                            opacity: 0.8,
                            lineJoin: 'round'
                        }}
                    />
                )}

                <RecenterMap
                    lat={highlight?.geo_coordinates?.lat}
                    lng={highlight?.geo_coordinates?.lng}
                    points={allPoints.length > 1 ? allPoints : null}
                />
            </MapContainer>
        </div>
    );
};

export default HighlightMap;
