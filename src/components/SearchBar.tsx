import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';
import { colors, surfaceStyle } from '../constants/theme';

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  onPress?: () => void;
  placeholder?: string;
  editable?: boolean;
  variant?: 'light' | 'dark';
}

export function SearchBar({
  value = '',
  onChangeText,
  onSubmit,
  onPress,
  placeholder = 'Search sneakers, brands, sizes…',
  editable = true,
  variant = 'light',
}: SearchBarProps) {
  const isDark = variant === 'dark';

  const content = (
    <View
      className="flex-row items-center rounded-xl px-3"
      style={
        isDark
          ? { backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }
          : { ...surfaceStyle, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 0 }
      }
    >
      <Ionicons name="search" size={20} color={isDark ? '#FFFFFF' : colors.textMuted} />
      <TextInput
        className={`flex-1 py-3 px-2 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        onPressIn={onPress && !editable ? onPress : undefined}
        placeholder={placeholder}
        placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : colors.textMuted}
        returnKeyType="search"
        editable={editable}
        pointerEvents={editable ? 'auto' : 'none'}
      />
      {editable && value.length > 0 && (
        <Pressable onPress={() => onChangeText?.('')}>
          <Ionicons name="close-circle" size={20} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );

  if (onPress && !editable) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {content}
      </Pressable>
    );
  }

  return content;
}
