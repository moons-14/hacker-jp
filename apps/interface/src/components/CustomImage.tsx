"use client";

import React, { useState } from "react";

export const CustomImage = ({
  src,
  alt,
  fallbackSrc,
  ...props
}: {
  src: string;
  alt: string;
  fallbackSrc: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    console.error("Error loading image");
    setImgSrc(fallbackSrc);
  };

  // biome-ignore lint/a11y/useAltText: <explanation>
  return <img src={imgSrc} alt={alt} onError={handleError} {...props} />;
};
