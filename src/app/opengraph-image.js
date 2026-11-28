import { ImageResponse } from "next/og";

export const alt = "The Third Place — Not Home. Not Work. Just Right. | TRACE Expert City, Colombo 10";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1E5D54",
          color: "#F1EBDE",
          padding: "72px 84px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#F1EBDE",
            opacity: 0.85,
            fontFamily: "sans-serif",
          }}
        >
          <span>TRACE EXPERT CITY · COLOMBO 10</span>
          <span
            style={{
              backgroundColor: "#A95F32",
              padding: "8px 20px",
              borderRadius: 999,
              fontSize: 18,
            }}
          >
            077 220 1989
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 82, fontWeight: 700, lineHeight: 1.05 }}>
            The Third Place
          </div>
          <div style={{ fontSize: 40, fontStyle: "italic", color: "#F1EBDE" }}>
            Not Home. Not Work. Just Right.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(241,235,222,0.25)",
            paddingTop: 24,
            fontSize: 22,
            fontFamily: "sans-serif",
            color: "rgba(241,235,222,0.85)",
          }}
        >
          <span>Sip · Chat · Play · Read · Join In</span>
          <span>Colombo, Sri Lanka</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
