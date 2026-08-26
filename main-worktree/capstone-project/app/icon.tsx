// app/icon.tsx  (change the size to something smaller for the tab)
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };   // ← better for browser tabs
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b5fb0",
          borderRadius: 6,          // scaled down
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            width: 22,
            height: 15,
            background: "#ffffff",
            borderRadius: 4,
          }}
        >
          <div style={{ width: 2, height: 2, borderRadius: 1, background: "#0b5fb0" }} />
          <div style={{ width: 2, height: 2, borderRadius: 1, background: "#0b5fb0" }} />
          <div style={{ width: 2, height: 2, borderRadius: 1, background: "#0b5fb0" }} />
        </div>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "2px solid transparent",
            borderRight: "2px solid transparent",
            borderTop: "2.5px solid #ffffff",
            marginLeft: -7,
            marginTop: -0.5,
          }}
        />
      </div>
    ),
    { ...size }
  );
}