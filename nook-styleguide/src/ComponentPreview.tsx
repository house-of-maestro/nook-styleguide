import {useEffect} from 'react';
import {Button,TextInput,Logo,Navigation,Footer,SectionHero,SectionQuote,SectionMonthBook,SectionWhat,SectionHow,SectionNewsletter} from './components';
const previews: Record<string, React.ReactNode> = {
 Navigation:<Navigation/>,Footer:<Footer/>,SectionHero:<SectionHero/>,SectionQuote:<SectionQuote/>,SectionMonthBook:<SectionMonthBook onReserve={()=>window.parent.postMessage({type:'nook-demo-action'},window.location.origin)}/>,SectionWhat:<SectionWhat/>,SectionHow:<SectionHow/>,SectionNewsletter:<SectionNewsletter/>,
 Button:<Button/>,Logo:<Logo/>,TextInput:<TextInput/>
};
export default function ComponentPreview(){
 const name=new URLSearchParams(location.search).get('component') || '';
 useEffect(()=>{const report=()=>window.parent.postMessage({type:'nook-preview-height',component:name,height:document.getElementById('component-root')?.getBoundingClientRect().height || 0},window.location.origin);const observer=new ResizeObserver(report);observer.observe(document.body);void document.fonts.ready.then(report);return()=>observer.disconnect();},[name]);
 return <div id="component-root">{previews[name] || <p>Component not found.</p>}</div>;
}
