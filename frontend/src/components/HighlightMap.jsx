import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], 13);
    }, [lat, lng, map]);
    return null;
};

const HighlightMap = ({ highlight, destinationName }) => {
    // If coords are provided by backend, use them. 
    // Otherwise we could fallback to 0,0 or show error.
    const hasCoordinates = highlight?.geo_coordinates?.lat && highlight?.geo_coordinates?.lng;

    // Default to provided coords or a safe fallback (though map won't show much without real coords)
    const lat = hasCoordinates ? highlight.geo_coordinates.lat : 0;
    const lng = hasCoordinates ? highlight.geo_coordinates.lng : 0;

    if (!hasCoordinates) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-muted/20 rounded-lg p-6 text-center">
                <AlertCircle className="text-muted-foreground mb-2 opacity-20" size={48} />
                <p className="text-muted-foreground font-medium">Location data unavailable</p>
                <p className="text-xs text-muted-foreground mt-1">We couldn't get the exact coordinates for this spot.</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full rounded-lg overflow-hidden border border-border relative z-0">
            <MapContainer
                center={[lat, lng]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                    <Popup>
                        <div className="text-sm">
                            <strong className="block text-base">{highlight?.name}</strong>
                            <span className="text-muted-foreground">{destinationName}</span>
                        </div>
                    </Popup>
                </Marker>
                {/* Dynamically recenter when highlight changes */}
                <RecenterMap lat={lat} lng={lng} />
            </MapContainer>
        </div>
    );
};

export default HighlightMap;
