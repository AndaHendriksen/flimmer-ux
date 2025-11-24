import { Image } from 'expo-image';
import React, { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const OFFSCREEN = SCREEN_HEIGHT * 2;

export type ChallengePopupSnap = 'hidden' | 'peek' | 'expanded';

export type ChallengePopupProps = {
  onClose?: () => void;
  onPrimary?: () => void;
};

export type ChallengePopupHandle = {
  snapTo: (state: ChallengePopupSnap) => void;
};

const ChallengePopup = React.forwardRef<ChallengePopupHandle, ChallengePopupProps>(function ChallengePopup({
  onClose,
  onPrimary,
}: ChallengePopupProps, ref) {
  const [measuredHeight, setMeasuredHeight] = useState(SCREEN_HEIGHT);
  const [headerPeekHeight, setHeaderPeekHeight] = useState<number>(1000);
  const [ready, setReady] = useState(false);
  const translateY = useSharedValue(OFFSCREEN);
  const startY = useSharedValue(0);
  const current = useSharedValue<ChallengePopupSnap>('hidden');
  const figureProgress = useSharedValue(0);
  const stickerSize = useSharedValue(0);
  const [overlayActive, setOverlayActive] = useState(false);

  const snapPoints = useMemo(() => {
    const hidden = measuredHeight + 32;
    const peek = Math.max(measuredHeight - headerPeekHeight, 0);
    const targetTop = Math.max((SCREEN_HEIGHT - measuredHeight) / 2, 24);
    const expanded = measuredHeight + targetTop - SCREEN_HEIGHT;
    return { hidden, peek, expanded };
  }, [measuredHeight, headerPeekHeight]);

  const snapTo = useCallback(
    (state: ChallengePopupSnap) => {
      current.value = state;
      const to = snapPoints[state];
      translateY.value = withSpring(to, { damping: 18, stiffness: 180 });
      figureProgress.value = withSpring(state === 'hidden' ? 0 : 1, { damping: 16, stiffness: 220 });
    },
    [snapPoints, translateY, current, figureProgress]
  );

  useImperativeHandle(ref, () => ({ snapTo }), [snapTo]);

  useLayoutEffect(() => {
    current.value = 'hidden';
    translateY.value = snapPoints.hidden;
    requestAnimationFrame(() => setReady(true));
  }, [snapPoints, translateY, current]);

  useEffect(() => {
    translateY.value = snapPoints[current.value];
  }, [snapPoints, current, translateY]);

  // Bridge shared value 'current' to React state to control overlay pointer events
  useAnimatedReaction(
    () => current.value,
    (cur, prev) => {
      if (cur !== prev) {
        runOnJS(setOverlayActive)(cur !== 'hidden');
      }
    }
  );

  const pan = Gesture.Pan()
    .onStart(() => { startY.value = translateY.value; })
    .onUpdate((e) => {
      const min = snapPoints.expanded;
      const max = snapPoints.hidden;
      const next = Math.min(Math.max(startY.value + e.translationY, min), max);
      translateY.value = next;
    })
    .onEnd((e) => {
      const vy = e.velocityY;
      const snapTargets: { key: ChallengePopupSnap; val: number }[] = current.value === 'expanded'
        ? [
            { key: 'expanded', val: snapPoints.expanded },
            { key: 'hidden', val: snapPoints.hidden },
          ]
        : [
            { key: 'expanded', val: snapPoints.expanded },
            { key: 'peek', val: snapPoints.peek },
            { key: 'hidden', val: snapPoints.hidden },
          ];

      if (vy > 800) {
        snapTo('hidden');
        if (onClose) scheduleOnRN(onClose);
        return;
      }
      if (vy < -800) {
        snapTo('expanded');
        return;
      }

      const cur = translateY.value;
      let closest = snapTargets[0];
      let minDist = Math.abs(cur - snapTargets[0].val);
      for (let i = 1; i < snapTargets.length; i++) {
        const d = Math.abs(cur - snapTargets[i].val);
        if (d < minDist) {
          minDist = d;
          closest = snapTargets[i];
        }
      }
      snapTo(closest.key);
      if (closest.key === 'hidden' && onClose) scheduleOnRN(onClose);
    });

  const popupStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  const overlayStyle = useAnimatedStyle(() => {
    const t = translateY.value;
    const opacity = interpolate(
      t,
      [snapPoints.expanded, snapPoints.peek, snapPoints.hidden],
      [0.75, 0.2, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const onHeaderPress = useCallback(() => {
    if (current.value === 'peek') snapTo('expanded');
  }, [snapTo, current]);

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <DimOverlay
        ready={ready}
        animatedStyle={overlayStyle}
        active={overlayActive}
        onPress={() => { snapTo('hidden'); onClose && onClose(); }}
      />
      <GestureDetector gesture={pan}>
        <Animated.View
          pointerEvents={ready ? 'auto' : 'none'}
          style={[styles.container, popupStyle, !ready && { opacity: 0 }]}
          onLayout={(e) => setMeasuredHeight(e.nativeEvent.layout.height)}
        >
          <Pressable onPress={onHeaderPress} style={styles.headerTouch}>
            <View style={styles.card}>
              <StickerFigure stickerSize={stickerSize} figureProgress={figureProgress} />
              <PopupHeader
                onClose={onClose}
                snapTo={snapTo}
                current={current}
                setHeaderPeekHeight={(h) => setHeaderPeekHeight(h)}
              />
              <PopupContent onPrimary={onPrimary} />
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

const DimOverlay: React.FC<{ ready: boolean; animatedStyle: any; active: boolean; onPress: () => void }> = React.memo(({ ready, animatedStyle, active, onPress }) => (
  <Pressable
    style={StyleSheet.absoluteFill}
    pointerEvents={active ? 'auto' : 'none'}
    onPress={active ? onPress : undefined}
  >
    <Animated.View pointerEvents="none" style={[styles.overlay, ready ? animatedStyle : { opacity: 0 }]} />
  </Pressable>
));

const StickerFigure: React.FC<{ stickerSize: SharedValue<number>; figureProgress: SharedValue<number> }> = ({ stickerSize, figureProgress }) => {
  const liftStyle = useAnimatedStyle(() => {
    const size = stickerSize.value;
    const lift = size > 0 ? -0.5 * size * figureProgress.value : 0;
    return { transform: [{ translateY: lift }] };
  });
  return (
    <View style={styles.stickerParent} onLayout={(e) => { stickerSize.value = e.nativeEvent.layout.width; }}>
      <Animated.View style={[styles.stickerContainer, liftStyle]}>
        <Image
          source={require('../assets/images/cta-figure.png')}
          style={styles.sticker}
          contentFit="contain"
          contentPosition="left"
        />
      </Animated.View>
    </View>
  );
};

const PopupHeader: React.FC<{
  onClose?: () => void;
  snapTo: (s: ChallengePopupSnap) => void;
  current: SharedValue<ChallengePopupSnap>;
  setHeaderPeekHeight: (h: number) => void;
}> = ({ onClose, snapTo, current, setHeaderPeekHeight }) => (
  <View
    onLayout={(e) => setHeaderPeekHeight(e.nativeEvent.layout.height)}
    style={styles.peekHeader}
  >
    <View style={styles.headerRow}>
      <Text style={styles.title}>Udfordring!</Text>
      <View style={{ position: 'absolute', right: 0, top: 0 }}>
        <Pressable onPress={() => { snapTo('hidden'); onClose && onClose(); }}>
          <Text style={styles.close}>×</Text>
        </Pressable>
      </View>
    </View>
  </View>
);

const PopupContent: React.FC<{ onPrimary?: () => void }> = ({ onPrimary }) => (
  <View style={styles.content}>
    <Text style={styles.headline}>Hvor mange gange kan du sjippe?</Text>
    <Pressable onPress={() => (onPrimary && onPrimary())} style={styles.cta}>
      <Text style={styles.ctaText}>Prøv!</Text>
      <View style={styles.ctaIcon}>
        <Image
          source={require('../assets/images/arrow-white.png')}
          contentFit="contain"
          contentPosition="center"
          style={{ width: 16, height: 16 }}
        />
        {/* <Text style={styles.ctaIconText}>→</Text> */}
      </View>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerTouch: { paddingBottom: 24 },
  card: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    // shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    // elevation for Android
    elevation: 8,
		position: 'relative',
  },
  stickerParent: { 
		position: 'absolute',
		top: '0%',
		left: '0%',
		width: '50%',
		paddingBottom: '50%',
	},
	stickerContainer: {
		position: 'absolute',
		top: '0%',
		left: '-10%',
		width: '100%',
		height: '100%',
	},
  sticker: { 
		width: '100%',
		height: '100%',
	},
  peekHeader: {
    // isolates the visible header portion for peek state
    // no extra styles needed now but reserved for future (e.g., gradient mask)
  },
  content: { flex: 1 },
  headerRow: {
		paddingTop: 16,
		paddingBottom: 48,
		textAlign: 'center',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
  },
  title: { fontSize: 18, fontWeight: '700' },
  close: { fontSize: 22, lineHeight: 22, paddingHorizontal: 8, position: 'absolute', right: 0, top: 0 },
  headline: { fontSize: 20, fontWeight: '800', marginTop: 32, marginBottom: 56 },
  cta: {
    backgroundColor: '#ffb3ab',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaText: { fontSize: 18, fontWeight: '800' },
  ctaIcon: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a8cff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaIconText: { color: '#fff', fontSize: 20, fontWeight: '900' },
});

export default ChallengePopup;
