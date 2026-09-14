# kimoji-ui

Shared shadcn-style UI component library for the Kimoji / Relay / Ohayo sites.
React 19 + Tailwind CSS v4 + Radix primitives. Full component set: forms,
overlays, navigation, data display, feedback, layout, charts, plus a
class-based (`.dark`) light/dark theme system with `ThemeToggle`.

Consumed via git dependency (`git+ssh://git@github.com/wdcodecn/kimoji-ui.git`);
source `.tsx` is compiled by each site's Vite build, no build step here.

Usage in a site:

```tsx
import { Button, Card, ThemeToggle, ThemeInitScript } from "@kimoji/ui";
import "@kimoji/ui/styles.css";
```
