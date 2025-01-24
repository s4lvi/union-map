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
import { Tooltip } from "@mui/material";

// Fix for default marker icon issues with webpack
delete L.Icon.Default.prototype._getIconUrl;
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
          >
            <Popup>
              <strong>{union.name}</strong>
              <br />
              Type: {union.type}
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
