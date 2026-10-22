import {Navigation,Footer,SectionHero,SectionQuote,SectionMonthBook,SectionWhat,SectionHow,SectionNewsletter} from './components';

/** Composes the existing Code Connect components from Figma node 8017:4198. */
export function Homepage({onReserve}: {onReserve?: ()=>void}) {
 return <><Navigation/><main id="main"><SectionHero/><SectionQuote/><SectionMonthBook onReserve={onReserve}/><SectionWhat/><SectionHow/><SectionNewsletter/><div className="nook-book-exchange"><img src={`${import.meta.env.BASE_URL}assets/book-exchange.png`} alt="Hands passing a book across a café table" width="1440" height="357"/></div></main><Footer/></>;
}
