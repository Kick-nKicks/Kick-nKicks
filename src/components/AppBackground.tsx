import { Image, StyleSheet, View, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/theme';

const topPattern = require('../../assets/sneaker-skin-top.png');
const midPattern = require('../../assets/sneaker-skin-mid.png');
const bottomPattern = require('../../assets/sneaker-skin-bottom.png');

interface AppBackgroundProps extends ViewProps {
  children: React.ReactNode;
}

export function AppBackground({ children, style, ...rest }: AppBackgroundProps) {
  return (
    <View style={[styles.root, style]} {...rest}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none" accessibilityElementsHidden>
        <Image source={topPattern} style={styles.topPattern} resizeMode="cover" />
        <Image source={midPattern} style={styles.midPattern} resizeMode="stretch" />
        <Image source={bottomPattern} style={styles.bottomPattern} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(255, 253, 245, 0.15)', 'rgba(255, 253, 245, 0.55)', 'rgba(255, 253, 245, 0.35)']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '44%',
    opacity: 0.62,
  },
  midPattern: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    height: '22%',
    opacity: 0.55,
  },
  bottomPattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '44%',
    opacity: 0.62,
  },
});
