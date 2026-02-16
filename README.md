# react-native-carousel-lite

🚀 Lightweight, fast, and zero-dependency carousel for React Native.  
Built using only core components (ScrollView) for maximum performance.

---

## ✨ Preview

<!-- Add GIF here -->
<!-- This is VERY important for adoption -->

---

## ⚡ Features

- 🔥 Zero dependencies (pure React Native)
- ⚡ High performance (core ScrollView-based)
- 🎯 Smooth scrolling & snapping
- 🔁 Optional autoplay & looping
- 📱 Works on iOS & Android
- 🎨 Fully customizable
- 🧠 Minimal and clean API

---

## 📦 Installation

```bash
npm install react-native-carousel-lite
```

Or with Yarn:

```bash
yarn add react-native-carousel-lite
```

---

## 🚀 Usage

```tsx
import { Carousel } from 'react-native-carousel-lite';
import { Text, View } from 'react-native';

const data = [{ id: '1', title: 'Slide 1' }, { id: '2', title: 'Slide 2' }];

<Carousel
  data={data}
  renderItem={({ item }) => <Text>{item.title}</Text>}
  keyExtractor={(item) => item.id}
  autoPlay
  loop
  onIndexChange={(index) => console.log(index)}
/>
```

### With ref (scroll control)

```tsx
const ref = useRef<CarouselRef>(null);

<Carousel ref={ref} data={data} renderItem={...} />

// Later:
ref.current?.scrollToIndex(2, true);
ref.current?.scrollToNext(true);
ref.current?.scrollToPrev(true);
ref.current?.getCurrentIndex();
```

### Controlled index

```tsx
const [index, setIndex] = useState(0);
<Carousel
  data={data}
  index={index}
  onIndexChange={setIndex}
  renderItem={...}
/>
```

### Vertical + custom dots

```tsx
<Carousel
  data={data}
  vertical
  renderItem={...}
  renderDot={({ index, isActive }) => (
    <View style={[styles.dot, isActive && styles.dotActive]} />
  )}
/>
```

---

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | required | Data array |
| `renderItem` | `(params) => ReactNode` | required | Render each item |
| `itemsPerPage` | `number` | `1` | Items per page (stacked) |
| `autoPlay` | `boolean` | `false` | Auto-advance |
| `autoPlayInterval` | `number` | `5000` | Interval in ms |
| `autoPlayPauseOnDrag` | `boolean` | `true` | Pause auto while user drags |
| `keyExtractor` | `(item, index) => string` | index | Item key |
| `index` | `number` | - | Controlled current page |
| `defaultIndex` | `number` | `0` | Initial page (uncontrolled) |
| `onIndexChange` | `(index) => void` | - | Page change callback |
| `loop` | `boolean` | `false` | Infinite loop |
| `vertical` | `boolean` | `false` | Vertical scrolling |
| `decelerationRate` | `'fast' \| 'normal' \| number` | `'fast'` | Scroll deceleration |
| `containerStyle` | `ViewStyle` | - | Outer container |
| `contentContainerStyle` | `ViewStyle` | - | ScrollView content |
| `pageStyle` | `ViewStyle` | - | Each page wrapper |
| `showDots` | `boolean` | `true` | Show pagination dots |
| `renderDot` | `({ index, isActive }) => ReactNode` | - | Custom dot (overrides styles) |
| `dotsContainerStyle` | `ViewStyle` | - | Dots container |
| `dotStyle` | `ViewStyle` | - | Inactive dot |
| `activeDotStyle` | `ViewStyle` | - | Active dot |
| `windowSize` | `number` | `0` | Render only active ± N pages (0 = all) |
| `accessibilityLabel` | `string` | `'Carousel'` | A11y label |
| `dotsAccessibilityLabel` | `string` | `'Page indicator'` | Dots a11y label |

---

## 🔧 Ref API

- `scrollToIndex(index, animated?)`
- `scrollToNext(animated?)`
- `scrollToPrev(animated?)`
- `getCurrentIndex()`

---

## 📄 License

MIT
