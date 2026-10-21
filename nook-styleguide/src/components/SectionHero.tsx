export function SectionHero({title = 'Make room for reading', description = 'A free monthly book club in Berlin. Intimate gatherings, thoughtfully chosen books, and no pressure to have read it.', image = `${import.meta.env.BASE_URL}assets/hero.png`}: {title?: string; description?: string; image?: string}) {
 return <section className="nook-hero" aria-labelledby="hero-title"><img className="nook-hero-image" src={image} alt=""/><div className="nook-hero-shade"/><div className="nook-hero-copy"><h1 id="hero-title">{title}</h1><p>{description}</p></div></section>;
}
