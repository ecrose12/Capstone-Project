import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
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
          borderRadius: 96,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            width: 340,
            height: 240,
            background: "#ffffff",
            borderRadius: 56,
          }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 16, background: "#0b5fb0" }} />
          <div style={{ width: 32, height: 32, borderRadius: 16, background: "#0b5fb0" }} />
          <div style={{ width: 32, height: 32, borderRadius: 16, background: "#0b5fb0" }} />
        </div>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "28px solid transparent",
            borderRight: "28px solid transparent",
            borderTop: "34px solid #ffffff",
            marginLeft: -110,
            marginTop: -6,
          }}
        />
      </div>
    ),
    { ...size }
  );
}