# react-native-carousel-lite

> Lightweight, zero-dependency React Native carousel component. Fast, customizable slider with autoplay, infinite loop, and pagination—built with ScrollView for iOS and Android.

[![npm version](https://img.shields.io/npm/v/react-native-carousel-lite.svg)](https://www.npmjs.com/package/react-native-carousel-lite)
[![license](https://img.shields.io/npm/l/react-native-carousel-lite.svg)](https://github.com/garganshul9200/react-native-carousel-lite/blob/main/LICENSE)
<!-- [![Hire me](https://img.shields.io/badge/Hire%20the%20developer-Portfolio-6C5CE7?style=flat)](https://yourportfolio.com) -->

**react-native-carousel-lite** is a minimal, high-performance carousel for React Native with no third-party dependencies. Use it as a lightweight alternative to heavier carousel libraries when you need a simple, fast slider or image carousel with snap scrolling, optional autoplay, and full TypeScript support.

---

## Table of contents

- [Preview](#-preview)
- [Why this carousel?](#why-this-carousel)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Props](#-props)
- [FAQ](#-frequently-asked-questions)
<!-- - [Hire the developer](#-hire-the-developer) -->
- [License](#-license)

---

![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)
![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)

## ✨ Preview

![react-native-carousel-lite horizontal carousel demo on iOS and Android](assets/carousel-demo.png)

![react-native-carousel-lite carousel with image slides and pagination](assets/carousel-demo2.png)

---

## Why this carousel?

**Best React Native carousel for small bundles.** Many carousels depend on reanimated, gesture handlers, or native modules. This one uses only the built-in `ScrollView` with `pagingEnabled`, so you get a **zero-dependency carousel** that stays fast and predictable on iOS and Android. Ideal when you need a **lightweight carousel** or **snap carousel** without extra native setup.

---

## ⚡ Features

- **Zero dependencies** — Pure React Native; no carousel or gesture libraries
- **High performance** — ScrollView-based; no reanimated or native modules
- **Smooth snap scrolling** — Page-by-page with configurable deceleration
- **Autoplay & infinite loop** — Configurable interval; optional looping
- **Cross-platform** — Works on iOS and Android
- **Fully customizable** — Styles and custom dot renderer for pagination
- **Controlled or uncontrolled** — `index` / `onIndexChange` or internal state
- **Ref API** — `scrollToIndex`, `scrollToNext`, `scrollToPrev`, `getCurrentIndex`
- **Accessibility** — Configurable labels and roles
- **Windowed rendering** — Optional `windowSize` for large lists

---

## 📦 Installation

Install the package from npm:

```bash
npm install react-native-carousel-lite
```

Or with Yarn:

```bash
yarn add react-native-carousel-lite
```

**Peer dependencies:** React `>=17.0.0`, React Native `>=0.64.0`. No native linking required.

---

## 🚀 Usage

### Basic carousel

Import the carousel, pass your data and `renderItem`. Pagination dots are shown by default.

```tsx
import { Carousel } from 'react-native-carousel-lite';
import { Text, View } from 'react-native';

const data = [{ id: '1', title: 'Slide 1' }, { id: '2', title: 'Slide 2' }];

<Carousel
  data={data}
  renderItem={({ item }) => <Text>{item.title}</Text>}
  keyExtractor={(item) => item.id}
  itemsPerPage={2}
  autoPlay
  autoPlayInterval={3000}
  loop
  onIndexChange={(index) => console.log(index)}
/>
```

### Scroll control with ref

Use a ref to scroll to a specific slide or next/prev (e.g. from buttons).

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

Control the current page from parent state (e.g. sync with tabs or URL).

```tsx
const [index, setIndex] = useState(0);
<Carousel
  data={data}
  index={index}
  onIndexChange={setIndex}
  renderItem={...}
/>
```

### Vertical carousel and custom dots

Use `vertical` for vertical scrolling and `renderDot` for custom pagination UI.

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
| `data` | `T[]` | required | Array of items to display in the carousel. |
| `renderItem` | `(params) => ReactNode` | required | Renders each item; receives `{ item, index }`. |
| `itemsPerPage` | `number` | `1` | Number of items per page (stacked in scroll direction). |
| `autoPlay` | `boolean` | `false` | When true, advances to the next page at `autoPlayInterval`. |
| `autoPlayInterval` | `number` | `5000` | Auto-advance interval in milliseconds. |
| `autoPlayPauseOnDrag` | `boolean` | `true` | Pauses autoplay while the user is dragging. |
| `keyExtractor` | `(item, index) => string` | index | Returns a stable key for each item. |
| `index` | `number` | — | Controlled current page index (use with `onIndexChange`). |
| `defaultIndex` | `number` | `0` | Initial page when using uncontrolled mode. |
| `onIndexChange` | `(index) => void` | — | Called when the visible page index changes. |
| `loop` | `boolean` | `false` | Enables infinite looping (duplicates first/last page). |
| `vertical` | `boolean` | `false` | When true, scrolls vertically instead of horizontally. |
| `decelerationRate` | `'fast' \| 'normal' \| number` | `'fast'` | Scroll deceleration for snappier feel. |
| `containerStyle` | `ViewStyle` | — | Style for the outer container. |
| `contentContainerStyle` | `ViewStyle` | — | Style for the ScrollView content container. |
| `pageStyle` | `ViewStyle` | — | Style for each page wrapper. |
| `showDots` | `boolean` | `true` | Whether to show pagination dots. |
| `renderDot` | `({ index, isActive }) => ReactNode` | — | Custom dot renderer; overrides default dot styles when set. |
| `dotsContainerStyle` | `ViewStyle` | — | Style for the dots container. |
| `dotStyle` | `ViewStyle` | — | Style for inactive dots. |
| `activeDotStyle` | `ViewStyle` | — | Style for the active dot. |
| `windowSize` | `number` | `0` | Render only pages within active ± N (0 = render all). Use for large lists. |
| `accessibilityLabel` | `string` | `'Carousel'` | Accessibility label for the carousel. |
| `dotsAccessibilityLabel` | `string` | `'Page indicator'` | Accessibility label for the pagination. |

---

## ❓ Frequently asked questions

**How do I install a carousel in React Native?**  
Run `npm install react-native-carousel-lite`, then import `Carousel` and pass `data` and `renderItem`. No native linking or extra setup.

**Is this carousel zero dependency?**  
Yes. It only uses React Native’s built-in `ScrollView`. No reanimated, gesture handler, or other carousel libraries.

**Does it work on iOS and Android?**  
Yes. It’s built with core React Native components and works on both platforms.

**Can I use it as an alternative to other similar carousel libraries?**  
Yes. If you want a lighter, ScrollView-based carousel without extra native modules, this is a good fit. Use the ref API for programmatic scrolling and the props table above for full options.

---

<!--
## 💼 Hire the developer

Like this library? I'm available for hire. Check out my portfolio to see more of my work and get in touch for your next project.

**[View my portfolio →](https://yourportfolio.com)**

*Replace `https://yourportfolio.com` with your personal portfolio, LinkedIn, or hiring page.*
-->

---

## 📄 License

MIT © [Anshul Thakur](https://github.com/garganshul9200)

- **npm:** [react-native-carousel-lite](https://www.npmjs.com/package/react-native-carousel-lite)
- **GitHub:** [garganshul9200/react-native-carousel-lite](https://github.com/garganshul9200/react-native-carousel-lite)
