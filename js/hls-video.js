// Generic HLS video fallback. Any <video> containing a
// <source type="application/x-mpegURL"> gets hls.js attached automatically
// on browsers without native HLS support (i.e. everything but Safari).
document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('video > source[type="application/x-mpegURL"]');

  videos.forEach((source) => {
    const video = source.closest('video');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('✅ Native HLS support detected');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.onload = () => {
      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(source.src);
        hls.attachMedia(video);
        console.log('✅ HLS.js loaded and attached');
      }
    };
    document.head.appendChild(script);
  });
});
