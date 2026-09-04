import React from 'react'

/**
 * National Emblem of India Vector Component
 * Matches Figma Page 1 Emblem specification
 */
export default function NationalEmblem({ size = 38, color = '#1e293b' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="national-emblem-svg"
    >
      {/* Outer Circle Ring */}
      <circle cx="32" cy="32" r="30" stroke={color} strokeWidth="1.5" fill="none" opacity="0.3" />
      {/* Base Pedestal */}
      <rect x="16" y="52" width="32" height="4" rx="1" fill={color} />
      <rect x="20" y="48" width="24" height="4" rx="0.5" fill={color} opacity="0.85" />
      {/* Ashoka Chakra Wheel */}
      <circle cx="32" cy="42" r="6" stroke={color} strokeWidth="1.5" fill="#ffffff" />
      <circle cx="32" cy="42" r="1.5" fill={color} />
      {/* Chakra Spokes */}
      <path
        d="M32 36V48M26 42H38M27.8 37.8L36.2 46.2M27.8 46.2L36.2 37.8"
        stroke={color}
        strokeWidth="1"
      />
      {/* Bull (Left) & Horse (Right) */}
      <path d="M21 44C19.5 44 18 45 18 46.5H24C24 45 22.5 44 21 44Z" fill={color} opacity="0.8" />
      <path d="M43 44C41.5 44 40 45 40 46.5H46C46 45 44.5 44 43 44Z" fill={color} opacity="0.8" />
      {/* Lion Capital Heads (Central, Left, Right) */}
      <path
        d="M32 8C28 8 25 11 25 15C25 20 28 25 32 32C36 25 39 20 39 15C39 11 36 8 32 8Z"
        fill={color}
      />
      <path
        d="M25 13C22 11 19 13 18 16.5C17 20 18.5 24 22 29C23.5 25 24.5 20 25 13Z"
        fill={color}
        opacity="0.95"
      />
      <path
        d="M39 13C42 11 45 13 46 16.5C47 20 45.5 24 42 29C40.5 25 39.5 20 39 13Z"
        fill={color}
        opacity="0.95"
      />
      {/* Crown Crest */}
      <path d="M32 5L29 8H35L32 5Z" fill={color} />
      <circle cx="32" cy="13" r="1" fill="#ffffff" />
      <circle cx="22" cy="17" r="0.8" fill="#ffffff" />
      <circle cx="42" cy="17" r="0.8" fill="#ffffff" />
    </svg>
  )
}
