import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "@masumdev";
  const description = searchParams.get("description") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(99,179,237,0.08) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(59,130,246,0.15)",
            border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: "999px",
            padding: "6px 16px",
            marginBottom: "24px",
          }}
        >
          <span style={{ fontSize: 20, color: "#93c5fd" }}>@masumdev</span>
        </div>
        {/* Title */}
        <div
          style={{
            fontSize: title.length > 30 ? 52 : 68,
            color: "white",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: description ? "20px" : "0",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>
        {/* Description */}
        {description && (
          <div
            style={{
              fontSize: 28,
              color: "#94a3b8",
              lineHeight: 1.4,
              maxWidth: "800px",
            }}
          >
            {description}
          </div>
        )}
        {/* Footer */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "80px",
            fontSize: 20,
            color: "#475569",
          }}
        >
          React Native &amp; Expo Libraries
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
