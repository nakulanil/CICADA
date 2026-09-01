import React from 'react'

/**
 * Rank Insignia Badge Component
 * Renders stars, chevrons, and rank borders based on Indian Police hierarchy
 */
export default function RankInsigniaBadge({ rankId, insignia, insigniaDesc }) {
  const getBadgeStyle = () => {
    switch (rankId) {
      case 'sho':
        return { bg: '#800000', border: '#c5a059', color: '#ffd700' }
      case 'si':
        return { bg: '#13315c', border: '#c5a059', color: '#ffd700' }
      case 'asi':
        return { bg: '#2d3748', border: '#c5a059', color: '#ffd700' }
      case 'hc':
        return { bg: '#374151', border: '#cbd5e1', color: '#ffffff' }
      case 'pc':
      default:
        return { bg: '#4b5563', border: '#9ca3af', color: '#f3f4f6' }
    }
  }

  const style = getBadgeStyle()

  return (
    <div
      className="rank-insignia-badge"
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
        color: style.color,
      }}
      title={insigniaDesc}
      aria-label={insigniaDesc}
    >
      <span className="insignia-symbols">{insignia}</span>
    </div>
  )
}

