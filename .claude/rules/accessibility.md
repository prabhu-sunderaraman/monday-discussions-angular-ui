# Accessibility Rules

- Comply with **WCAG 2.1 Level AA** for all HTML elements wherever applicable.

## Key requirements

- **Semantic HTML** — use the correct native element for its purpose (`button`, `nav`, `main`, `header`, `footer`, headings in order). Add ARIA only to fill gaps native semantics don't cover.
- **Text alternatives** — meaningful `alt` text on images; empty `alt=""` for decorative images.
- **Color contrast** — minimum 4.5:1 for normal text and 3:1 for large text and UI/graphical elements.
- **Do not rely on color alone** to convey information, state, or errors.
- **Keyboard accessible** — every interactive element is reachable and operable by keyboard, with a logical focus order and no keyboard traps.
- **Visible focus** — a clear, visible focus indicator on all focusable elements.
- **Labels** — every form control has an associated `<label>` (or `aria-label` / `aria-labelledby`); errors are programmatically associated with their fields.
- **Names, roles, values** — custom/interactive components expose correct name, role, and state via ARIA.
- **Resize & reflow** — content remains usable at 200% zoom without loss of content or function.
- **Headings & landmarks** — use landmark regions and a logical heading structure for navigation.
- **Language** — set the page language via the `lang` attribute.
