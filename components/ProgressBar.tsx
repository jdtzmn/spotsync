import React from 'react';

interface ProgressProps {
  percent: number,
  color?: string,
  height?: number
}

const ProgressDefaults = {
  color: '#403EBE',
  height: 2
}

const Progress = ({ percent, color, height, ...otherProps }: ProgressProps) => {
  const defaultStyles = {
    backgroundColor: color || ProgressDefaults.color,
    height: height || ProgressDefaults.height,
    width: percent ? `${percent}%` : 0
  }

  return (
    <div {...otherProps} style={defaultStyles} />
  )
}

export default Progress
