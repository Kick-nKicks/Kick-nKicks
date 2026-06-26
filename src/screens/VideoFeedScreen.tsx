import { FlatList, ViewToken } from 'react-native';
import { useCallback, useRef, useState } from 'react';
import type { TabScreenProps, VideoPost } from '../types';
import { VideoPlayer } from '../components/VideoPlayer';

const MOCK_VIDEOS: VideoPost[] = [
  {
    id: 'v1',
    userId: 'u1',
    username: '@sneakerflip',
    caption: 'Just copped these 🔥 Jordan 4s',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    likes: 1240,
  },
  {
    id: 'v2',
    userId: 'u2',
    username: '@restorepro',
    caption: 'Before & after restoration',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    likes: 892,
  },
];

export function VideoFeedScreen(_props: TabScreenProps<'VideosTab'>) {
  const [activeId, setActiveId] = useState(MOCK_VIDEOS[0]?.id);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0]?.item as VideoPost | undefined;
      if (first) setActiveId(first.id);
    },
    [],
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

  return (
    <FlatList
      data={MOCK_VIDEOS}
      keyExtractor={(item) => item.id}
      style={{ flex: 1, backgroundColor: '#000000' }}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      renderItem={({ item }) => (
        <VideoPlayer post={item} isActive={item.id === activeId} />
      )}
    />
  );
}
