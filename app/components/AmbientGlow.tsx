export default function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "-10%",
        left: "-10%",
        width: "50%",
        height: "70%",
        background: "radial-gradient(circle, rgba(37,99,235,0.16), transparent 65%)",
        filter: "blur(20px)",
        pointerEvents: "none",
      }}
    />
  );
}
