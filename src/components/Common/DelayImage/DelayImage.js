import React, { useState, useEffect } from 'react';

const DelayImage = React.memo(({ src, alt = "", className = "" }) => {
  const [loading, setLoading] = useState(true);
  const [currentSrc, updateSrc] = useState(src);

  useEffect(() => {
    const imageToLoad = new Image();
    imageToLoad.src = src;
    imageToLoad.onload = () => {
      setLoading(false);
      updateSrc(src);
    }
  }, [src])

  return (
    <img
      className={className}
      src={currentSrc}
      style={{
        opacity: loading ? 0.3 : 1,
        filter: loading ? "blur(1px)" : "blur(0px)",
        transition: "opacity .3s linear"
      }}
      alt={alt}
    />
  )
});

export default DelayImage;