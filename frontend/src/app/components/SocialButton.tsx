import React from "react";

interface SocialButtonProps {
  src: string;
  alt: string;
}

export default function SocialButton({ src, alt }: SocialButtonProps) {
  return (
    <button type="button" className="social-button">
      <img src={src} alt={alt} className="social-logo" />
    </button>
  );
}