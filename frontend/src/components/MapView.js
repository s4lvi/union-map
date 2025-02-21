// frontend/src/components/MapView.js
import React, { useEffect, useState, useContext } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AuthContext } from "../context/AuthContext";
import AddUnionModal from "./AddUnionModal";

import markerIconRed from "../assets/markers/marker-icon-red.png";
import markerIconGreen from "../assets/markers/marker-icon-green.png";
import markerIconBlue from "../assets/markers/marker-icon-blue.png";
import markerIconOrange from "../assets/markers/marker-icon-orange.png";
import markerIconGrey from "../assets/markers/marker-icon-grey.png";
import markerShadow from "../assets/markers/marker-shadow.png";

// Fix for default marker icon issues with webpack
delete L.Icon.Default.prototype._getIconUrl;

// Define custom icons
const redIcon = new L.Icon({
  iconUrl: markerIconRed,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41], // size of the shadow
});

const greenIcon = new L.Icon({
  iconUrl: markerIconGreen,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: markerIconBlue,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const orangeIcon = new L.Icon({
  iconUrl: markerIconOrange,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greyIcon = new L.Icon({
  iconUrl: markerIconGrey,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Mapping of sector to icon
const sectorIcons = {
  Manufacturing: redIcon,
  Agriculture: greenIcon,
  Healthcare: blueIcon,
  Service: orangeIcon,
  Other: greyIcon,
};

// Default icon if sector doesn't match any predefined sectors
const defaultIcon = greyIcon;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function AddMarker({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function MapView({ center, zoomLevel, unions, setUnions }) {
  const { auth } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);

  const handleMapClick = (latlng) => {
    if (auth.user && auth.user.role === "admin") {
      setClickPosition(latlng);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setClickPosition(null);
  };

  const handleAddUnion = (newUnion) => {
    setUnions([...unions, newUnion]);
  };

  return (
    <>
      <MapContainer
        center={center}
        zoom={zoomLevel}
        style={{ height: "80vh", width: "100%" }}
      >
        <AddMarker onMapClick={handleMapClick} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {unions.map((union) => (
          <Marker
            key={union._id}
            position={[
              union.location.coordinates[1],
              union.location.coordinates[0],
            ]}
            icon={sectorIcons[union.sector] || defaultIcon}
          >
            <Popup>
              <strong>{union.name}</strong>
              <br />
              Type: {union.designation_name} {union.designation_number}
              <br />
              {union.site && (
                <>
                  <a
                    href={union.site}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Website
                  </a>
                  <br />
                </>
              )}
              {union.info}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Add Union Modal */}
      <AddUnionModal
        open={modalOpen}
        handleClose={handleCloseModal}
        position={clickPosition}
        onAdd={handleAddUnion}
      />
    </>
  );
}

export default MapView;
