export default function ZoomControls() {
  const handleZoomIn = () => {
    // Dispatch a custom event the map can listen to
    window.dispatchEvent(new CustomEvent('map-zoom', { detail: 1 }));
  };

  const handleZoomOut = () => {
    window.dispatchEvent(new CustomEvent('map-zoom', { detail: -1 }));
  };

  const handleReset = () => {
    window.dispatchEvent(new CustomEvent('map-reset'));
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-lg backdrop-blur-xl">
      <button
        onClick={handleZoomIn}
        className="flex h-9 w-9 items-center justify-center text-lg text-white/70 transition-colors hover:bg-white/15 hover:text-white"
        title="Zoom in"
      >
        +
      </button>
      <div className="mx-auto h-px w-5 bg-white/10" />
      <button
        onClick={handleZoomOut}
        className="flex h-9 w-9 items-center justify-center text-lg text-white/70 transition-colors hover:bg-white/15 hover:text-white"
        title="Zoom out"
      >
        −
      </button>
      <div className="mx-auto h-px w-5 bg-white/10" />
      <button
        onClick={handleReset}
        className="flex h-9 w-9 items-center justify-center text-xs text-white/70 transition-colors hover:bg-white/15 hover:text-white"
        title="Reset view"
      >
        ⌂
      </button>
    </div>
  );
}
