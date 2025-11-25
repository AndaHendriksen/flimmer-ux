import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useCallback, useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type ChallengeVideoProps = {
	challengeStarted: boolean;
	captured: boolean;
};

export default function ChallengeVideo({ challengeStarted, captured }: ChallengeVideoProps) {
	const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
	const TARGET_WIDTH = SCREEN_WIDTH * 0.3;
	const TARGET_MARGIN = 16;
	const TARGET_RADIUS = 16;
	const ASPECT_RATIO = SCREEN_HEIGHT / SCREEN_WIDTH;

	const videoPosition = useSharedValue(0);

	const player = useVideoPlayer(require('../assets/videos/challenge.mp4'), playerInstance => {
		playerInstance.loop = true;
		playerInstance.muted = true;
		playerInstance.play();
	});

	useEffect(() => {
		videoPosition.value = withSpring(challengeStarted ? 1 : 0, challengeStarted
			? { damping: 40, stiffness: 220 }
			: { damping: 18, stiffness: 220 });
	}, [challengeStarted, videoPosition]);

	useEffect(() => {
		if (captured) {
			try {
				player.pause();
			} catch {}
			return;
		}

		try {
			player.play();
		} catch {}
	}, [captured, player]);

	const seekBy = useCallback((deltaSeconds: number) => {
		const current = player.currentTime ?? 0;
		const duration = player.duration ?? 0;
		const target = Math.min(Math.max(0, current + deltaSeconds), duration);
		try {
			player.currentTime = target;
		} catch {}
	}, [player]);

	const onRewind = useCallback(() => seekBy(-5), [seekBy]);
	const onForward = useCallback(() => seekBy(5), [seekBy]);

	const videoAnimatedStyle = useAnimatedStyle(() => {
		const width = SCREEN_WIDTH - (SCREEN_WIDTH - TARGET_WIDTH) * videoPosition.value;
		const height = width * ASPECT_RATIO;
		return {
			width,
			height,
			top: TARGET_MARGIN * videoPosition.value,
			right: TARGET_MARGIN * videoPosition.value,
			borderRadius: TARGET_RADIUS * videoPosition.value,
		};
	});

	if (captured) {
		return null;
	}

	return (
		<Animated.View style={[styles.videoContainer, videoAnimatedStyle]}>
			<VideoView
				contentFit="cover"
				style={styles.video}
				player={player}
				nativeControls={false}
				allowsFullscreen
				allowsPictureInPicture
			/>
			{challengeStarted && (
				<>
					<Pressable onPress={onRewind} style={[styles.controlButton, styles.controlLeft]} testID="rewind-button">
						<FontAwesome name="undo" size={20} color="white" />
					</Pressable>
					<Pressable onPress={onForward} style={[styles.controlButton, styles.controlRight]} testID="forward-button">
						<FontAwesome name="undo" size={20} color="white" style={{ transform: [{ rotateY: '180deg' }] }} />
					</Pressable>
				</>
			)}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	videoContainer: { zIndex: 100, position: 'absolute', overflow: 'hidden', backgroundColor: 'black' },
	video: { width: '100%', height: '100%' },
	controlButton: { backgroundColor: 'transparent', borderRadius: 24, padding: 4, position: 'absolute', bottom: 2, opacity: 0.7 },
	controlLeft: { left: 6 },
	controlRight: { right: 6 },
});
