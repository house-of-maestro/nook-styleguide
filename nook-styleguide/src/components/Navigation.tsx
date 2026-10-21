import {useState} from 'react';
import {Logo} from './Logo';
export function Navigation() {
 const [open,setOpen] = useState(false);
 return <header className="nook-navigation"><a href="#home" aria-label="Nook home"><Logo tone="light" size="nav"/></a><button className="nook-menu" aria-expanded={open} aria-controls="nook-navigation-links" onClick={()=>setOpen(!open)}>{open ? 'Close' : 'Menu'}</button><nav id="nook-navigation-links" className={open ? 'is-open' : ''} aria-label="Main navigation">{[['Next session','#next-session'],['About','#about'],['Join our community','#newsletter']].map(([label,href])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}</a>)}</nav></header>;
}
