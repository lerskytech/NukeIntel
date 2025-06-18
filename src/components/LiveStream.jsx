import React from 'react';

export default function LiveStream({ src, title }) {
  return (
    <div className="w-full max-w-2xl mx-auto aspect-video bg-black rounded-2xl shadow-2xl my-6 overflow-hidden">
      <iframe
        className="w-full h-full"
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        frameBorder="0"
        aria-label={title}
      />
    </div>
  );
}
