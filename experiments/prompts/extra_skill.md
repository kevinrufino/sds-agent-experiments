
Condition notes:
- Do not use any Figma tools.
- Do not run type checking, linting, builds or tests. Stop once the code is written.

Design-system skill (SDS, concise):
- Import only from the aliases "primitives", "layout", "compositions", "icons", "hooks". Never import react-aria-components or @react-aria directly.
- Page/section text: `TextContentTitle` (title, subtitle) for the page heading; `TextHeading` or `TextContentHeading` (heading, subheading) for sections; `Text`, `TextSmall`, `TextStrong` for body copy.
- Forms: `Form`/`FormBox`, `Fieldset` + `Legend`; fields are `InputField`, `SelectField` + `SelectItem` (id, children), `SwitchField`, `CheckboxField`, `RadioGroup`. Fields take `label`, `description` (help text) and `errorMessage`; show errors with `isInvalid` + `errorMessage`, not custom error markup. Disable with `isDisabled`. Group switches in `SwitchGroup`.
- Buttons: `Button` variant "primary" | "neutral" | "subtle", size "medium" | "small", `isDisabled`. `Button` does NOT accept danger variants; destructive actions use `ButtonDanger` (variant "danger-primary" | "danger-subtle"). Put related actions in `ButtonGroup` (align "start" | "end" | "center" | "justify" | "stack").
- People: `AvatarBlock` (title, description, children = `<Avatar initials="A" />`; single-letter initials).
- Feedback: `Notification` variant "alert" (errors) | "message" (confirmations), optional `icon`.
- Layout: use `Section` and `Flex` (direction, gap="200".."1600", wrap, alignPrimary/alignSecondary) and `useMediaQuery()` from "hooks" (isMobile) instead of custom flex/grid CSS. Use `var(--sds-*)` tokens if any CSS is unavoidable.
- Feature-specific pieces (e.g. a member row) stay local to the page file; do not add new design-system primitives.
