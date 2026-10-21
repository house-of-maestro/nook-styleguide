import {Logo} from './Logo';
export function Footer({tagline = 'A book club for people who want to read more'}: {tagline?: string}) {
 return <footer className="nook-footer"><a href="#home" aria-label="Nook home"><Logo tone="light" size="footer"/></a><p>{tagline}</p></footer>;
}
