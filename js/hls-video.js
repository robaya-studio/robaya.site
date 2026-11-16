// HLS video fallback. Any <video> containing a <source type="application/x-mpegURL"> gets hls.js
// attached on browsers without native HLS (everything but Safari). The library is served from
// this site (js/vendor/), pinned to one version, and loaded only when a page needs it.
document.addEventListener('DOMContentLoaded', () => {
  const sources = document.querySelectorAll('video > source[type="application/x-mpegURL"]');
  if (sources.length === 0) {
    return;
  }

  const pending = Array.from(sources).filter((source) => {
    return !source.closest('video').canPlayType('application/vnd.apple.mpegurl');
  });
  if (pending.length === 0) {
    return;
  }

  const base = window.location.pathname.includes('/games/') ? '../../' : '';
  const script = document.createElement('script');
  script.src = `${base}js/vendor/hls-1.5.20.min.js`;
  script.onload = () => {
    if (!window.Hls || !window.Hls.isSupported()) {
      return;
    }
    pending.forEach((source) => {
      const hls = new window.Hls();
      hls.loadSource(source.src);
      hls.attachMedia(source.closest('video'));
    });
  };
  document.head.appendChild(script);
});
