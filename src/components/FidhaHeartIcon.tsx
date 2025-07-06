import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS } from '../constants/theme';

const FidhaHeartIcon = ({ size = 160 }) => (
  <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
    {/* Heart outline */}
    <Path
      d="M80 140s-48-34-48-68C32 44.8 55.2 32 80 52c24.8-20 48 8.8 48 20 0 34-48 68-48 68z"
      stroke={COLORS.primaryLight}
      strokeWidth={8}
      fill={COLORS.primaryLight}
      fillOpacity={0.18}
      strokeLinejoin="round"
    />
    {/* Smile/wave inside heart */}
    <Path
      d="M60 105c8 12 32 12 40 0"
      stroke={COLORS.primaryDark}
      strokeWidth={6}
      strokeLinecap="round"
      fill="none"
    />
    {/* Accent dots */}
    <Circle cx="45" cy="90" r="7" fill={COLORS.primaryLight} fillOpacity={0.7} />
    <Circle cx="115" cy="90" r="7" fill={COLORS.primaryLight} fillOpacity={0.7} />
  </Svg>
);

export default FidhaHeartIcon; 