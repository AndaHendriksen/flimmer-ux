import Camera, { CameraMode } from '@/components/camera';
import ChallengePopup, { ChallengePopupHandle } from '@/components/challenge-popup';
import ChallengeVideo from '@/components/video';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function VideoAndCameraScreen() {
	const sheetRef = useRef<ChallengePopupHandle>(null);
	const [mode, setMode] = useState<CameraMode>('video');
	const [captured, setCaptured] = useState(false);
	const [challengeStarted, setChallengeStarted] = useState(false);
	
	useEffect(() => {
		const t = setTimeout(() => {
			sheetRef.current?.snapTo('peek');
		}, 3000);
		return () => clearTimeout(t);
	}, []);

	const onCapture = () => {
		setCaptured(true);
	};

	const onRetry = useCallback(() => {
		setCaptured(false);
	}, []);

	const onChallengeStart = useCallback(() => {
		setChallengeStarted(true);
		sheetRef.current?.snapTo('hidden');
	}, []);

	const onConfirm = useCallback(() => {
		router.push('/uploading');
	}, []);

	return (
		<View style={styles.container}>
			<ChallengePopup ref={sheetRef} onPrimaryAction={onChallengeStart} />
			
			<ChallengeVideo challengeStarted={challengeStarted} captured={captured} />

			<Camera
				mode={mode}
				onModeChange={setMode}
				onCapture={onCapture}
				showControls={!captured}
				captured={captured}
				onRetry={onRetry}
				onConfirm={onConfirm}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: 'black' },
});
