---
name: design-system-electronics-cars-fashion-collectibles-more
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Electronics, Cars, Fashion, Collectibles & More

## Mission
Deliver implementation-ready design-system guidance for Electronics, Cars, Fashion, Collectibles & More that can be applied consistently across e-commerce storefront interfaces.

## Brand
- Product/brand: Electronics, Cars, Fashion, Collectibles & More
- URL: https://www.ebay.com/
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Market Sans`, `font.family.stack=Market Sans, Arial, sans-serif`, `font.size.base=14px`, `font.weight.base=400`, `font.lineHeight.base=20.0004px`
- Typography scale: `font.size.xs=10px`, `font.size.sm=11px`, `font.size.md=12px`, `font.size.lg=13.33px`, `font.size.xl=14px`, `font.size.2xl=16px`, `font.size.3xl=18px`, `font.size.4xl=20px`
- Color palette: `color.text.primary=#191919`, `color.text.secondary=#707070`, `color.surface.base=#000000`, `color.text.inverse=#555555`, `color.surface.muted=#ffffff`, `color.surface.raised=color(srgb 1 1 1 / 0.9)`, `color.surface.strong=#fcdcec`
- Spacing scale: `space.1=1px`, `space.2=4px`, `space.3=5px`, `space.4=5.75px`, `space.5=6px`, `space.6=8px`, `space.7=10px`, `space.8=12px`
- Radius/shadow/motion tokens: `radius.xs=8px`, `radius.sm=16px`, `radius.md=44px`, `radius.lg=48px`, `radius.xl=50px`, `radius.2xl=15984px` | `shadow.1=rgba(0, 0, 0, 0.24) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 0px 2px 0px` | `motion.duration.instant=150ms`, `motion.duration.fast=200ms`, `motion.duration.normal=220ms`, `motion.duration.slow=450ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
