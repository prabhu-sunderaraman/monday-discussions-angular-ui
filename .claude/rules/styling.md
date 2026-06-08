# Styling & Theming Rules

- Use **SCSS** for theming.
- Separate concerns into **different files**: primitives, semantic combinations, and themes each live in their own file.
- A **`ThemeService`** is responsible for theme toggling (light ⇄ dark).

## Layering

### 1. Primitives (own file)

Raw, context-free values. Named by what they are, not where they're used.

```scss
--primary--blue: #324324;
--primary--green: #DE4324; // just an example
```

### 2. Semantic combinations (own file)

Map primitives to roles. Light theme is the default.

```scss
--header-background: var(--primary--blue);
--footer-background: var(--primary--green);
```

### 3. Themes (own file)

Each theme overrides the semantic tokens.

```scss
// dark theme
.dark {
  --header-background: var(--dark-blue);
}
```

## ThemeService

- Handles the toggle operation of switching between **light** and **dark** themes.
- Applies the active theme by setting the `light` / `dark` class on the `body` element.
