import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'social';
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = ""
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return `
        bg-[#1B6F09]
        text-[#E2F67E]
        hover:bg-[#bef264]
        hover:text-[#1B6F09]
        font-[var(--font-baloo-bhaijaan)]
        font-bold
        text-xl
        py-[10px]
        px-[20px]
        rounded-full
        transition-all
        duration-200
  `;


      case 'secondary':
        return `
        bg-[#4d7c0f]
        text-[#ecfccb]
        hover:bg-[#3f621c]
        hover:text-[#E2F67E]
        font-[var(--font-baloo-bhaijaan)]
        font-bold
        text-lg
        py-[8px]
        px-[16px]
        rounded-full
        transition-all
        duration-200
        border-2
        border-[#4d7c0f]
    `;
      default:
        return `
          bg-[#E2F67E]
          text-[#1b6f09]
          hover:bg-[#bef264]
          py-3
          px-8
          text-lg
          font-[var(--font-baloo-bhaijaan)]
          rounded-full
        `;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getVariantStyles()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}