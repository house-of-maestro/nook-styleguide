export function Logo({tone = 'dark', size = 'large'}: {tone?: 'dark' | 'light'; size?: 'large' | 'nav' | 'footer'}) {
 return <span className={`nook-logo nook-logo--${tone} nook-logo--${size}`} role="img" aria-label="Nook"><img src={`${import.meta.env.BASE_URL}assets/${tone === 'light' ? 'symbolLight' : 'symbol'}.svg`} alt=""/><span>nook</span></span>;
}
