import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Camera() {
	const [mode, setMode] = useState<'photo' | 'video'>('video');
	const [captured, setCaptured] = useState(false);

	const player = useVideoPlayer(require('../assets/videos/challenge.mp4'), player => {
		player.loop = true;
		player.muted = true;
		player.play();
	});

	useEffect(() => { player.play(); }, [player, captured]);


	const onCapture = () => {
		console.log('capture pressed', mode);
		setCaptured(true);
	};

	const onRetry = () => {
		setCaptured(false);
	};

	const seekBy = useCallback((deltaSeconds: number) => {
		if (!player) return;
		const current = player.currentTime ?? 0;
		const duration = player.duration ?? 0;
		const target = Math.min(Math.max(0, current + deltaSeconds), duration);
		try {
			player.currentTime = target;
		} catch {}
	}, [player]);

	const onRewind = useCallback(() => seekBy(-5), [seekBy]);
	const onForward = useCallback(() => seekBy(5), [seekBy]);

	return (
		<View style={styles.container}>
			<Image source={require('../assets/images/camera-background.png')} style={StyleSheet.absoluteFill} contentFit="cover" />
			{!captured && (
				<>
					<View style={styles.videoContainer}>
						<VideoView
							contentFit='cover'
							style={styles.video}
							player={player}
							nativeControls={false}
							allowsFullscreen
							allowsPictureInPicture />
						<Pressable onPress={onRewind} style={[styles.videoControls, { left: 6 }, { padding: 4 }]} testID="rewind-button">
							<FontAwesome name="undo" size={20} color="white" />
						</Pressable>
						<Pressable onPress={onForward} style={[styles.videoControls, { right: 6 }, { padding: 4 }]} testID="forward-button">
							<FontAwesome name="undo" size={20} color="white" style={{ transform: [{ rotateY: '180deg' }]}} />
						</Pressable>
					</View>
					<View style={styles.controlsBarContainer} pointerEvents="box-none">
						<View style={styles.controlsBar}>
							<View style={styles.controlContainer}>
								<View style={styles.leftGroup}>
									<Pressable onPress={() => setMode('photo')} style={[styles.modeButton, mode === 'photo' && styles.modeButtonActive]} testID="photo-mode-button">
										<Ionicons name="camera-outline" size={24} color={mode === 'photo' ? 'black' : 'white'} />
									</Pressable>
									<Pressable onPress={() => setMode('video')} style={[styles.modeButton, mode === 'video' && styles.modeButtonActive]} testID="video-mode-button">
										<Ionicons name="videocam-outline" size={24} color={mode === 'video' ? 'black' : 'white'} />
									</Pressable>
								</View>
							</View>
							<View style={styles.controlContainer}>
								<View style={styles.centerGroup}>
									<Pressable onPress={onCapture} style={styles.shutterOuter} testID="capture-button">
										<View style={[styles.shutterInner, mode === 'video' && styles.shutterInnerVideo]} />
									</Pressable>
								</View>
							</View>
							<View style={styles.controlContainer}>
								<View style={styles.rightGroup}>
									<View style={styles.rotateButton}>
										<Image source={require('../assets/images/rotate-icon.png')} style={styles.rotateIcon} contentFit="contain" />
									</View>
								</View>
							</View>
						</View>
					</View>
				</>
			)}

			{captured && (
				<View style={styles.confirmOverlay} pointerEvents="box-none">
					<View style={styles.confirmPanel} testID="capture-confirm-panel">
						<Text style={styles.confirmTitle}>Er du tilfreds?</Text>
						<View style={styles.confirmButtonsRow}>
							<Pressable onPress={onRetry} style={[styles.confirmButton, styles.retryButton]} testID="retry-button">
								<Text style={[styles.confirmButtonLabel, styles.retryButtonLabel]}>Prøv igen</Text>
							</Pressable>
							<Pressable onPress={() => router.push('/uploading')} style={[styles.confirmButton, styles.okButton]} testID="ok-button">
								<Text style={[styles.confirmButtonLabel, styles.okButtonLabel]}>Ja!</Text>
							</Pressable>
						</View>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { width: '100%', height: '100%', backgroundColor: '#000' },
	videoContainer: { width: '30%', position: 'absolute', top: 16, right: 16 },
	videoControls: { backgroundColor: 'rgba(0,0,0,0)', borderRadius: 24, padding: 6, position: 'absolute', bottom: 2, opacity: 0.7 },
	video: { width: '100%', aspectRatio: 9/16, borderRadius: 12, overflow: 'hidden' },
	controlsBarContainer: { position: 'absolute', left: 0, right: 0, bottom: 32 },
	controlsBar: { flex: 3, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
	controlContainer: { width: '33%', alignItems: 'center' },
	leftGroup: { flexDirection: 'row', gap: 4, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 24, padding: 2 },
	centerGroup: { alignItems: 'center', justifyContent: 'center' },
	rightGroup: { flexDirection: 'row' },
	modeButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
	modeButtonActive: { backgroundColor: 'rgba(255,255,255,0.9)' },
	modeIcon: { width: 24, height: 24 },
	rotateButton: { width: 52, height: 52, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
	rotateIcon: { width: 28, height: 28 },
	shutterOuter: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
	shutterInner: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#fff' },
	shutterInnerVideo: { backgroundColor: '#ff2d55' },
	modeLabel: { marginTop: 4, color: '#fff', fontSize: 14, fontWeight: '600' },
	confirmOverlay: { position: 'absolute', left: 0, right: 0, bottom: 48, alignItems: 'center' },
	confirmPanel: { width: '80%', backgroundColor: '#fff', borderRadius: 32, paddingVertical: 24, paddingHorizontal: 24, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
	confirmTitle: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 16, color: '#000' },
	confirmButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
	confirmButton: { flex: 1, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
	retryButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#b59dff' },
	okButton: { backgroundColor: '#d4c3ff' },
	confirmButtonLabel: { fontSize: 16, fontWeight: '600' },
	retryButtonLabel: { color: '#4a3e7f' },
	okButtonLabel: { color: '#3a2b63' },
});
