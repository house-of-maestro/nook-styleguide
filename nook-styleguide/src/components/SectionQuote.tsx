export function SectionQuote({eyebrow = 'Why Nook', children = 'Digital distraction can make it hard to focus or finish a book. Nook creates a little room for attention, conversation and the pleasure of discovering something worth reading.'}: {eyebrow?: string; children?: React.ReactNode}) {
 return <section className="nook-section nook-quote"><p className="nook-eyebrow">{eyebrow}</p><p className="nook-quote-text">{children}</p></section>;
}
