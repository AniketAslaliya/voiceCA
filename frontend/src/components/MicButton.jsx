export default function MicButton({ state, onClick }) {
  const isRecording = state === "recording";
  const isProcessing = state === "processing";

  return (
    <div
      style={{
        position: "relative",
        width: 132,
        height: 132,
        display: "grid",
        placeItems: "center",
      }}
    >
      {isRecording && (
        <>
          <span
            style={{
              position: "absolute",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "var(--accent)",
              animation: "pulse-ring 1.2s ease-out infinite",
            }}
          />
          <span
            style={{
              position: "absolute",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "var(--accent)",
              animation: "pulse-ring-2 1.2s ease-out infinite",
              animationDelay: "0.4s",
            }}
          />
        </>
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={isProcessing}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
        style={{
          position: "relative",
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          background: isRecording ? "var(--error)" : "var(--accent)",
          color: "#050505",
          fontSize: 32,
          display: "grid",
          placeItems: "center",
          boxShadow: "0 0 42px rgba(34, 197, 94, 0.32)",
          transition: "transform 0.2s, background 0.2s",
        }}
      >
        {isProcessing ? (
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: "3px solid rgba(0, 0, 0, 0.25)",
              borderTopColor: "#000",
              animation: "spin 0.75s linear infinite",
            }}
          />
        ) : (
          "🎙️"
        )}
      </button>
    </div>
  );
}
