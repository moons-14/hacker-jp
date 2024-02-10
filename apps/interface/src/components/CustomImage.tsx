"use client";

import React from "react";

export const CustomImage = ({
  src,
  alt,
  ...props
}: {
  src: string;
  alt: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
}) => {
  // biome-ignore lint/a11y/useAltText: <explanation>
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  return <img src={src} alt={""} onError={(e) => (e.currentTarget.src = "/ogp.jpg")} {...props} />;
};
