import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';
import type { CarouselProps, CarouselRef } from './types';

function CarouselInner<T>(
  {
    data,
    renderItem,
    itemsPerPage = 1,
    autoPlay = false,
    autoPlayInterval = 5000,
    autoPlayPauseOnDrag = true,
    keyExtractor,
    index: controlledIndex,
    defaultIndex = 0,
    onIndexChange,
    loop = false,
    vertical = false,
    decelerationRate = 'fast',
    containerStyle,
    contentContainerStyle,
    pageStyle,
    showDots = true,
    renderDot,
    dotsContainerStyle,
    dotStyle,
    activeDotStyle,
    windowSize = 0,
    accessibilityLabel = 'Carousel',
    dotsAccessibilityLabel = 'Page indicator',
  }: CarouselProps<T>,
  ref: React.Ref<CarouselRef>
) {
  const scrollRef = useRef<ScrollView>(null);
  const pageSizeRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const [pageSize, setPageSize] = useState(0);
  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultIndex);

  const isControlled = controlledIndex !== undefined;
  const activeIndex = isControlled ? controlledIndex : uncontrolledIndex;
  const setActiveIndex = useCallback(
    (next: number | ((prev: number) => number)) => {
      if (isControlled) return;
      setUncontrolledIndex(next);
    },
    [isControlled]
  );

  const pages = useMemo(() => {
    if (!data?.length) return [] as T[][];
    const out: T[][] = [];
    for (let i = 0; i < data.length; i += itemsPerPage) {
      out.push(data.slice(i, i + itemsPerPage));
    }
    return out;
  }, [data, itemsPerPage]);

  const pageCount = pages.length;
  const extendedPages = useMemo(() => {
    if (!loop || pageCount <= 1) return pages;
    return [pages[pageCount - 1], ...pages, pages[0]];
  }, [loop, pages, pageCount]);

  const extendedLength = extendedPages.length;

  const logicalFromExtended = useCallback(
    (extendedIndex: number): number => {
      if (!loop) return extendedIndex;
      if (extendedIndex <= 0) return pageCount - 1;
      if (extendedIndex >= extendedLength - 1) return 0;
      return extendedIndex - 1;
    },
    [loop, pageCount, extendedLength]
  );

  const extendedFromLogical = useCallback(
    (logical: number): number => {
      if (!loop) return logical;
      return logical + 1;
    },
    [loop]
  );

  const startIndex = isControlled ? (controlledIndex ?? 0) : defaultIndex;
  const initialExtendedIndex = useMemo(() => {
    const safe = Math.min(Math.max(0, startIndex), Math.max(0, pageCount - 1));
    return loop && pageCount > 0 ? extendedFromLogical(safe) : safe;
  }, [loop, startIndex, pageCount, extendedFromLogical]);

  const scrollToExtended = useCallback(
    (extendedIndex: number, animated = true) => {
      const size = pageSizeRef.current;
      if (size <= 0 || !scrollRef.current) return;
      const offset = vertical ? extendedIndex * size : extendedIndex * size;
      scrollRef.current.scrollTo(
        vertical ? { y: offset, animated } : { x: offset, animated }
      );
    },
    [vertical]
  );

  const scrollToLogical = useCallback(
    (logicalIndex: number, animated = true) => {
      const ext = extendedFromLogical(logicalIndex);
      scrollToExtended(ext, animated);
    },
    [extendedFromLogical, scrollToExtended]
  );

  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (idx: number, animated = true) => {
        const clamped = Math.max(0, Math.min(idx, pageCount - 1));
        scrollToLogical(clamped, animated);
        setActiveIndex(clamped);
        onIndexChange?.(clamped);
      },
      scrollToNext: (animated = true) => {
        const next = (activeIndex + 1) % pageCount;
        scrollToLogical(next, animated);
        setActiveIndex(next);
        onIndexChange?.(next);
      },
      scrollToPrev: (animated = true) => {
        const prev = (activeIndex - 1 + pageCount) % pageCount;
        scrollToLogical(prev, animated);
        setActiveIndex(prev);
        onIndexChange?.(prev);
      },
      getCurrentIndex: () => activeIndex,
    }),
    [
      activeIndex,
      pageCount,
      scrollToLogical,
      setActiveIndex,
      onIndexChange,
    ]
  );

  useEffect(() => {
    if (pageCount === 0) return;
    if (activeIndex >= pageCount) {
      const safe = 0;
      setActiveIndex(safe);
      onIndexChange?.(safe);
    }
  }, [activeIndex, pageCount, setActiveIndex, onIndexChange]);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const size = vertical ? height : width;
    if (size > 0) {
      pageSizeRef.current = size;
      setPageSize(size);
    }
  }, [vertical]);

  const syncIndexFromOffset = useCallback(
    (offset: number) => {
      const size = pageSizeRef.current;
      if (size <= 0) return;
      const extendedIndex = Math.round(offset / size);
      const logical = logicalFromExtended(extendedIndex);
      if (logical !== activeIndex) {
        setActiveIndex(logical);
        onIndexChange?.(logical);
      }
    },
    [activeIndex, logicalFromExtended, setActiveIndex, onIndexChange]
  );

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement } = e.nativeEvent;
      const size = vertical ? layoutMeasurement.height : layoutMeasurement.width;
      const offset = vertical ? contentOffset.y : contentOffset.x;
      pageSizeRef.current = size;
      syncIndexFromOffset(offset);
    },
    [vertical, syncIndexFromOffset]
  );

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset } = e.nativeEvent;
      const offset = vertical ? contentOffset.y : contentOffset.x;
      const size = pageSizeRef.current;
      if (size <= 0 || !loop) {
        syncIndexFromOffset(offset);
        return;
      }
      const extendedIndex = Math.round(offset / size);
      if (extendedIndex <= 0) {
        scrollToExtended(extendedLength - 2, false);
        setActiveIndex(pageCount - 1);
        onIndexChange?.(pageCount - 1);
      } else if (extendedIndex >= extendedLength - 1) {
        scrollToExtended(1, false);
        setActiveIndex(0);
        onIndexChange?.(0);
      } else {
        syncIndexFromOffset(offset);
      }
    },
    [
      loop,
      vertical,
      extendedLength,
      pageCount,
      scrollToExtended,
      setActiveIndex,
      onIndexChange,
      syncIndexFromOffset,
    ]
  );

  const handleScrollBeginDrag = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const handleScrollEndDrag = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    if (!autoPlay || pageCount <= 1) return;
    const interval = setInterval(() => {
      if (autoPlayPauseOnDrag && isDraggingRef.current) return;
      const next = (activeIndex + 1) % pageCount;
      scrollToLogical(next, true);
      setActiveIndex(next);
      onIndexChange?.(next);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [
    autoPlay,
    autoPlayInterval,
    autoPlayPauseOnDrag,
    pageCount,
    activeIndex,
    scrollToLogical,
    setActiveIndex,
    onIndexChange,
  ]);

  const initialScrollRef = useRef(false);
  useEffect(() => {
    if (pageSize <= 0 || initialScrollRef.current) return;
    initialScrollRef.current = true;
    scrollToExtended(initialExtendedIndex, false);
  }, [pageSize, initialExtendedIndex, scrollToExtended]);

  const extendedCenter = extendedFromLogical(activeIndex);
  const shouldRenderPage = useCallback(
    (extendedIndex: number): boolean => {
      if (windowSize <= 0) return true;
      return Math.abs(extendedIndex - extendedCenter) <= windowSize;
    },
    [windowSize, extendedCenter]
  );

  if (!data?.length) return null;

  const sizeKey = vertical ? 'height' : 'width';
  const pageSizeStyle = pageSize > 0 ? { [sizeKey]: pageSize } : undefined;

  return (
    <View
      style={containerStyle}
      onLayout={handleLayout}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="adjustable"
    >
      <ScrollView
        ref={scrollRef}
        horizontal={!vertical}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate={decelerationRate}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        contentContainerStyle={contentContainerStyle}
        accessibilityLabel={accessibilityLabel}
      >
        {extendedPages.map((page, extendedIndex) => {
          const visible = shouldRenderPage(extendedIndex);
          return (
            <View
              key={`page-${extendedIndex}`}
              style={[pageStyle, pageSizeStyle]}
              collapsable={false}
            >
              {visible
                ? page.map((item, itemIndex) => {
                    const logicalPage = logicalFromExtended(extendedIndex);
                    const globalIndex = logicalPage * itemsPerPage + itemIndex;
                    const key = keyExtractor
                      ? keyExtractor(item, globalIndex)
                      : `item-${extendedIndex}-${itemIndex}`;
                    return (
                      <React.Fragment key={key}>
                        {renderItem({ item, index: globalIndex })}
                      </React.Fragment>
                    );
                  })
                : null}
            </View>
          );
        })}
      </ScrollView>

      {showDots && pageCount > 1 && (
        <View
          style={dotsContainerStyle}
          accessibilityLabel={dotsAccessibilityLabel}
          accessibilityRole="adjustable"
        >
          {pages.map((_, i) =>
            renderDot ? (
              <React.Fragment key={i}>
                {renderDot({ index: i, isActive: i === activeIndex })}
              </React.Fragment>
            ) : (
              <View
                key={i}
                style={[dotStyle, i === activeIndex && activeDotStyle]}
                accessibilityState={{ selected: i === activeIndex }}
                accessibilityLabel={`Page ${i + 1} of ${pageCount}`}
              />
            )
          )}
        </View>
      )}
    </View>
  );
}

const Carousel = forwardRef(CarouselInner) as <T>(
  props: CarouselProps<T> & { ref?: React.Ref<CarouselRef> }
) => React.ReactElement;

export default Carousel;
