import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Issue } from '../types';
import 'leaflet/dist/leaflet.css';

// Note: react-leaflet v4 handles default icons differently. We provide custom icons via getMarkerIcon below.

// Status-based marker colors
const getMarkerIcon = (status: Issue['status']) => {
  const colors = {
    submitted: '#f59e0b', // yellow
    acknowledged: '#3b82f6', // blue  
    assigned: '#8b5cf6', // purple
    resolved: '#10b981' // green
  };

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5C0 19.404 12.5 41 12.5 41S25 19.404 25 12.5C25 5.596 19.404 0 12.5 0Z" fill="${colors[status]}"/>
        <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      </svg>
    `)}`,
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

interface MapProps {
  issues: Issue[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMarkerClick?: (issue: Issue) => void;
}

const Map: React.FC<MapProps> = ({ 
  issues, 
  center = [23.0225, 72.5714], 
  zoom = 12, 
  height = '400px',
  onMarkerClick 
}) => {
  return (
    <div style={{ height }} className="rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.location.lat, issue.location.lng]}
            icon={getMarkerIcon(issue.status)}
            eventHandlers={{
              click: () => onMarkerClick?.(issue)
            }}
          >
            <Popup>
              <div className="min-w-64">
                <h4 className="font-semibold text-gray-900 mb-2">{issue.title}</h4>
                <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">{issue.category}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    issue.status === 'assigned' ? 'bg-purple-100 text-purple-800' :
                    issue.status === 'acknowledged' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {issue.status}
                  </span>
                </div>
                
                {issue.photos.length > 0 && (
                  <img 
                    src={issue.photos[0]} 
                    alt={issue.title}
                    className="w-full h-32 object-cover rounded mt-2"
                  />
                )}
                
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Upvotes: {issue.upvotes}</span>
                  <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;