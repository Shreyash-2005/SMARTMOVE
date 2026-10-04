import { useEffect, useState } from "react";
import useLiveLocation from "../../hooks/useLiveLocation";

export default function LiveLocationButton({
  onLocationChange,
}) {
  const [enabled, setEnabled] = useState(false);

  const {
    location,
    error,
  } = useLiveLocation(enabled);

  useEffect(() => {
    if (location) {
      onLocationChange?.(location);
    }
  }, [location, onLocationChange]);

  const toggleLocation = () => {
    setEnabled((current) => !current);
  };

  return (
    <div>
      <button
        type="button"
        onClick={toggleLocation}
        style={{
          padding: "10px 16px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          background: enabled ? "#16a34a" : "#2563eb",
          color: "white",
          fontWeight: "600",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        📍{" "}
        {enabled
          ? "Live Location ON"
          : "Enable Live Location"}
      </button>

      {error && (
        <div
          style={{
            marginTop: "8px",
            background: "white",
            padding: "8px",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#dc2626",
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}