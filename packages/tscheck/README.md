# @masumdev/tscheck

A React Native & Expo library for tscheck.

## Installation

```bash
# Using bun
bun add @masumdev/tscheck

# Using npm
npm install @masumdev/tscheck

# Using yarn
yarn add @masumdev/tscheck
```

## Basic Usage

```tsx
import React from 'react';
import { View } from 'react-native';
import { Tscheck } from '@masumdev/tscheck';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Tscheck title="Hello World" />
    </View>
  );
}
```

## License

MIT © [Ma'sum](https://github.com/masumrpg)
