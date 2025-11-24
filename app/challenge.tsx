import ChallengePopup, { ChallengePopupHandle } from '@/components/challenge-popup';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

export default function ChallengeScreen() {
	const sheetRef = useRef<ChallengePopupHandle>(null);

	useEffect(() => {
		const t = setTimeout(() => {
			sheetRef.current?.snapTo('peek');
		}, 5000);
		return () => clearTimeout(t);
	}, []);
	
  const player = useVideoPlayer(require('../assets/videos/challenge.mp4'), player => {
    player.loop = true;
		player.muted = true;
    player.play();
  });

  useEffect(() => { player.play(); }, [player]);

	return (
		<View style={styles.container}>
      <VideoView
				contentFit='cover'
				style={styles.video}
				player={player}
				allowsFullscreen
				allowsPictureInPicture />
			
			<ChallengePopup ref={sheetRef} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { width: '100%', height: '100%' },
	video: { width: '100%', height: '100%' },
});
