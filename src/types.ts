import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type RenderItemParams<T> = {
  item: T;
  index: number;
};

export type RenderDotParams = {
  index: number;
  isActive: boolean;
};

export type CarouselProps<T> = {
  /** Data array to render */
  data: T[];
  /** Render function for each item */
  renderItem: (params: RenderItemParams<T>) => ReactNode;
  /** Items per page (stacked in scroll direction). Default: 1 */
  itemsPerPage?: number;
  /** Enable auto-advance. Default: false */
  autoPlay?: boolean;
  /** Auto-play interval in ms. Default: 5000 */
  autoPlayInterval?: number;
  /** Pause auto-play while user is dragging. Default: true */
  autoPlayPauseOnDrag?: boolean;
  /** Key extractor for list items. Default: index */
  keyExtractor?: (item: T, index: number) => string;
  /** Controlled current page index (use with onIndexChange) */
  index?: number;
  /** Initial page when uncontrolled. Default: 0 */
  defaultIndex?: number;
  /** Called when page index changes */
  onIndexChange?: (index: number) => void;
  /** Infinite loop (duplicates first/last). Default: false */
  loop?: boolean;
  /** Vertical scrolling. Default: false (horizontal) */
  vertical?: boolean;
  /** Snappy scroll. Default: "fast" */
  decelerationRate?: 'fast' | 'normal' | number;
  /** Outer container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** ScrollView content container style */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Each page wrapper style */
  pageStyle?: StyleProp<ViewStyle>;
  /** Show pagination dots. Default: true */
  showDots?: boolean;
  /** Custom dot renderer: (index, isActive) => ReactNode. Overrides dot styles when set */
  renderDot?: (params: RenderDotParams) => ReactNode;
  /** Dots container style */
  dotsContainerStyle?: StyleProp<ViewStyle>;
  /** Inactive dot style */
  dotStyle?: StyleProp<ViewStyle>;
  /** Active dot style */
  activeDotStyle?: StyleProp<ViewStyle>;
  /** Max number of pages to mount (active ± window). 0 = render all. Default: 0 */
  windowSize?: number;
  /** Accessibility label for the carousel */
  accessibilityLabel?: string;
  /** Accessibility label for pagination */
  dotsAccessibilityLabel?: string;
};

export type CarouselRef = {
  scrollToIndex: (index: number, animated?: boolean) => void;
  scrollToNext: (animated?: boolean) => void;
  scrollToPrev: (animated?: boolean) => void;
  getCurrentIndex: () => number;
};
