import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../theme';
import { Text } from './Text';
import { renderIcon, type RenderIcon } from './types';
import { AspectRatio } from './AspectRatio';

export type AttachmentLayout = 'card' | 'row';

export interface AttachmentProps {
  /**
   * Layout style of the attachment.
   * - 'card': A square card layout, ideal for grid-like previews of images.
   * - 'row': A full-width horizontal row, ideal for document/file listings.
   * Defaults to 'row'.
   */
  layout?: AttachmentLayout;
  /**
   * Name of the file, e.g., 'workspace.png'.
   */
  name: string;
  /**
   * Description or metadata, e.g., 'PNG • 820 KB' or 'Uploading • 64%'.
   */
  description?: string;
  /**
   * Pluggable icon/thumbnail for the attachment.
   * Can be a URI string (rendered as Image), a ReactNode, or a RenderIcon function.
   */
  thumbnail?: string | RenderIcon;
  /**
   * If true, shows a loading spinner in the thumbnail slot.
   */
  loading?: boolean;
  /**
   * Callback triggered when the remove button is pressed.
   * Shows a close button on the right side if defined.
   */
  onRemove?: () => void;
  /**
   * Pluggable close/remove icon.
   */
  closeIcon?: RenderIcon;
  /**
   * Callback triggered when pressing the entire attachment card/row.
   */
  onPress?: () => void;
  /**
   * Style overrides for the root container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style overrides for the name text.
   */
  nameStyle?: StyleProp<TextStyle>;
  /**
   * Style overrides for the description text.
   */
  descriptionStyle?: StyleProp<TextStyle>;
}

export function Attachment({
  layout = 'row',
  name,
  description,
  thumbnail,
  loading = false,
  onRemove,
  closeIcon,
  onPress,
  style,
  nameStyle,
  descriptionStyle,
  ...props
}: AttachmentProps) {
  const { colors, radii, spacing } = useTheme();

  // Smart styling helper: If description contains 'Uploading', use info (blue) tone.
  const isUploading = description?.toLowerCase().includes('uploading');
  const descColor = isUploading ? colors.info : colors.textMuted;

  // Render close/remove button
  const renderRemoveButton = (size: number) => {
    if (!onRemove) return null;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Remove attachment"
        onPress={onRemove}
        style={({ pressed }) => ({
          padding: spacing.xxs,
          opacity: pressed ? 0.6 : 1,
          justifyContent: 'center',
          alignItems: 'center',
        })}
      >
        {closeIcon ? (
          renderIcon(closeIcon, colors.textMuted, size)
        ) : (
          <Text variant="bodySmall" style={{ color: colors.textMuted, fontWeight: '600' }}>
            ×
          </Text>
        )}
      </Pressable>
    );
  };

  // Render thumbnail content (Image, Icon, or Spinner)
  const renderThumbnail = (containerSize: number) => {
    if (loading) {
      return (
        <View style={[styles.thumbnailPlaceholder, { backgroundColor: colors.backgroundMuted, width: containerSize, height: containerSize, borderRadius: radii.md }]}>
          <ActivityIndicator size="small" color={colors.textMuted} />
        </View>
      );
    }

    if (typeof thumbnail === 'string') {
      return (
        <View style={{ width: containerSize, height: containerSize, overflow: 'hidden', borderRadius: radii.md }}>
          <Image
            source={{ uri: thumbnail }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        </View>
      );
    }

    if (thumbnail) {
      return (
        <View style={[styles.thumbnailPlaceholder, { backgroundColor: colors.backgroundMuted, width: containerSize, height: containerSize, borderRadius: radii.md }]}>
          {renderIcon(thumbnail, colors.textMuted, containerSize * 0.5)}
        </View>
      );
    }

    // Default file icon fallback
    return (
      <View style={[styles.thumbnailPlaceholder, { backgroundColor: colors.backgroundMuted, width: containerSize, height: containerSize, borderRadius: radii.md }]}>
        {/* Render a simple CSS/Text representation of a document sheet */}
        <Text variant="label" style={{ color: colors.textMuted, fontSize: containerSize * 0.4 }}>
          📄
        </Text>
      </View>
    );
  };

  if (layout === 'card') {
    // Card Layout (usually fixed width preview, e.g. for grid views)
    const cardStyle: ViewStyle = {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1.25,
      borderRadius: radii.xl,
      padding: spacing.sm,
      width: 120,
      gap: spacing.xs,
    };

    return (
      <Pressable
        disabled={!onPress}
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          { opacity: pressed ? 0.8 : 1 },
          style,
        ]}
        {...props}
      >
        {/* AspectRatio 1:1 for the top image preview */}
        <AspectRatio ratio={1} radius="md">
          {renderThumbnail(104)}
        </AspectRatio>

        <View style={styles.textContainer}>
          <Text
            variant="labelSmall"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[{ color: colors.text }, nameStyle]}
          >
            {name}
          </Text>
          {description && (
            <Text
              variant="caption"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[{ color: descColor }, descriptionStyle]}
            >
              {description}
            </Text>
          )}
        </View>
      </Pressable>
    );
  }

  // Default Row Layout
  const rowStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.25,
    borderRadius: radii.xl,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  };

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        rowStyle,
        { opacity: pressed ? 0.85 : 1 },
        style,
      ]}
      {...props}
    >
      {renderThumbnail(40)}

      <View style={[styles.textContainer, { flex: 1 }]}>
        <Text
          variant="label"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[{ color: colors.text }, nameStyle]}
        >
          {name}
        </Text>
        {description && (
          <Text
            variant="bodySmall"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[{ color: descColor }, descriptionStyle]}
          >
            {description}
          </Text>
        )}
      </View>

      {renderRemoveButton(16)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  thumbnailPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
  },
});
