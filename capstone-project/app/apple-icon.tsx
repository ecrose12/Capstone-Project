import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: 120,
            height: 84,
            background: "#ffffff",
            borderRadius: 20,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#0b5fb0" }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#0b5fb0" }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#0b5fb0" }} />
        </div>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "12px solid #ffffff",
            marginLeft: -40,
            marginTop: -2,
          }}
        />
      </div>
    ),
    { ...size }
  );
}