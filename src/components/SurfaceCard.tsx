import { View, type ViewProps } from 'react-native';
import { radii, surfaceStyle } from '../constants/theme';

interface SurfaceCardProps extends ViewProps {
  children: React.ReactNode;
  padded?: boolean;
}

export function SurfaceCard({ children, style, padded = true, ...rest }: SurfaceCardProps) {
  return (
    <View
      style={[
        surfaceStyle,
        { borderRadius: radii.lg, padding: padded ? 16 : 0, overflow: 'hidden' },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
