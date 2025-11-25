import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

export type CameraMode = 'photo' | 'video';

type CameraProps = {
	mode: CameraMode;
	onModeChange: (mode: CameraMode) => void;
	onCapture: () => void;
	showControls?: boolean;
	style?: StyleProp<ViewStyle>;
	captured?: boolean;
	onRetry?: () => void;
	onConfirm?: () => void;
};

const Camera = ({ mode, onModeChange, onCapture, showControls = true, style, captured = false, onRetry, onConfirm }: CameraProps) => {
	const handleModePress = (nextMode: CameraMode) => () => {
		if (nextMode === mode) return;
		onModeChange(nextMode);
	};

	return (
		<View style={[styles.container, style]}>
			<Image source={require('../assets/images/camera-background.png')} style={StyleSheet.absoluteFill} contentFit="cover" />
			{showControls && (
				<View style={styles.controlsBarContainer} pointerEvents="box-none">
					<View style={styles.controlsBar}>
						<View style={styles.controlContainer}>
							<View style={styles.leftGroup}>
								<Pressable
									onPress={handleModePress('photo')}
									style={[styles.modeButton, mode === 'photo' && styles.modeButtonActive]}
									testID="photo-mode-button"
								>
									<Ionicons name="camera-outline" size={24} color={mode === 'photo' ? 'black' : 'white'} />
								</Pressable>
								<Pressable
									onPress={handleModePress('video')}
									style={[styles.modeButton, mode === 'video' && styles.modeButtonActive]}
									testID="video-mode-button"
								>
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
			)}
			{captured && (
				<View style={styles.confirmOverlay} pointerEvents="box-none">
					<View style={styles.confirmPanel} testID="capture-confirm-panel">
						<Text style={styles.confirmTitle}>Er du tilfreds?</Text>
						<View style={styles.confirmButtonsRow}>
							<Pressable onPress={onRetry} style={[styles.confirmButton, styles.retryButton]} testID="retry-button">
								<Text style={[styles.confirmButtonLabel, styles.retryButtonLabel]}>Prøv igen</Text>
							</Pressable>
							<Pressable onPress={onConfirm} style={[styles.confirmButton, styles.okButton]} testID="ok-button">
								<Text style={[styles.confirmButtonLabel, styles.okButtonLabel]}>Ja!</Text>
							</Pressable>
						</View>
					</View>
				</View>
			)}
		</View>
	);
};

export default Camera;

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: 'black' },
	controlsBarContainer: { position: 'absolute', left: 0, right: 0, bottom: 32 },
	controlsBar: { flex: 3, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
	controlContainer: { width: '33%', alignItems: 'center' },
	leftGroup: { flexDirection: 'row', gap: 4, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 24, padding: 2 },
	centerGroup: { alignItems: 'center', justifyContent: 'center' },
	rightGroup: { flexDirection: 'row' },
	modeButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
	modeButtonActive: { backgroundColor: 'rgba(255,255,255,0.9)' },
	rotateButton: { width: 52, height: 52, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
	rotateIcon: { width: 28, height: 28 },
	shutterOuter: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
	shutterInner: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#fff' },
	shutterInnerVideo: { backgroundColor: '#ff2d55' },
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
