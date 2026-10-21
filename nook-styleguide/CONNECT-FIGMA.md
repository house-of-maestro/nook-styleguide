# Connect Nook in Figma

Open your Nook Library → Dev Mode → file menu → Library → Connect components to code. In Settings, connect the house-of-maestro/nook-styleguide repository. Select each file below and enter its component name.

| Figma component | Repository file | Component name |
| --- | --- | --- |
| [button](https://www.figma.com/design/7Hoa2r20HBX8DgbunRgqHl/Nook-Library?node-id=8052-4534) | `src/components/Button.tsx` | `Button` |
| [input-text](https://www.figma.com/design/7Hoa2r20HBX8DgbunRgqHl/Nook-Library?node-id=8013-2256) | `src/components/TextInput.tsx` | `TextInput` |
| [logo](https://www.figma.com/design/7Hoa2r20HBX8DgbunRgqHl/Nook-Library?node-id=8012-1285) | `src/components/Logo.tsx` | `Logo` |
| [navigation](https://www.figma.com/design/7Hoa2r20HBX8DgbunRgqHl/Nook-Library?node-id=8016-3790) | `src/components/Navigation.tsx` | `Navigation` |
| [footer](https://www.figma.com/design/7Hoa2r20HBX8DgbunRgqHl/Nook-Library?node-id=8017-4286) | `src/components/Footer.tsx` | `Footer` |
| [section-hero](https://www.figma.com/design/7Hoa2r20HBX8DgbunRgqHl/Nook-Library?node-id=8016-3886) | `src/components/SectionHero.tsx` | `SectionHero` |
| [section-quote](https://www.figma.com/design/7Hoa2r20HBX8DgbunRgqHl/Nook-Library?node-id=8016-3779) | `src/components/SectionQuote.tsx` | `SectionQuote` |
| [section-month-book](https://www.figma.com/design/7Hoa2r20HBX8DgbunRgqHl/Nook-Library?node-id=8016-3824) | `src/components/SectionMonthBook.tsx` | `SectionMonthBook` |
| [section-what](https://www.figma.com/design/7Hoa2r20HBX8DgbunRgqHl/Nook-Library?node-id=8016-3834) | `src/components/SectionWhat.tsx` | `SectionWhat` |
| [section-how](https://www.figma.com/design/7Hoa2r20HBX8DgbunRgqHl/Nook-Library?node-id=8016-3858) | `src/components/SectionHow.tsx` | `SectionHow` |
| [section-newsletter](https://www.figma.com/design/7Hoa2r20HBX8DgbunRgqHl/Nook-Library?node-id=8016-3874) | `src/components/SectionNewsletter.tsx` | `SectionNewsletter` |

## Suggested instructions for MCP

Reuse the existing Nook React components and src/styles.css. Import components from src/components. Use Button variant="primary" or variant="secondary" to match the Figma button type. Keep button HTML type separate from its visual variant. Use TextInput with an accessible label and native input attributes. Pass onReserve to SectionMonthBook and an asynchronous onSubscribe(email) to SectionNewsletter when connecting real services. Do not report a successful subscription without a real successful service response. Static content and dates in the preview reproduce the Figma reference and must be replaced with current event details before launch.

These are UI mappings to source files. No Code Connect CLI templates have been published.
