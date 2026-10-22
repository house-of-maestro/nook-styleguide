import {StrictMode,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Button,TextInput,Logo} from './components';
import './styles.css';
import {Homepage} from './Homepage';
function App(){
 const showLibrary = new URLSearchParams(window.location.search).has('library');
 const [view,setView]=useState<'page'|'components'>('page'); const dialog=useRef<HTMLDialogElement>(null);
 return <>{showLibrary && <div className="preview-toolbar"><span>Nook <small>Component library</small></span><div role="group" aria-label="Preview mode"><button aria-pressed={view==='page'} onClick={()=>setView('page')}>Page preview</button><button aria-pressed={view==='components'} onClick={()=>setView('components')}>Components</button></div></div>}<a className="skip-link" href="#main">Skip to content</a><div id="home"/>{view==='page'?<Homepage onReserve={()=>dialog.current?.showModal()}/>:<main id="main" className="component-gallery"><h1>Nook components</h1><p>Your Figma library, ready to use on the web.</p><section><h2>Logo</h2><Logo/></section><section><h2>Buttons</h2><div className="gallery-row"><Button onClick={()=>dialog.current?.showModal()}/><Button variant="secondary" onClick={()=>dialog.current?.showModal()}/><Button disabled>Disabled</Button></div></section><section className="gallery-dark"><h2>Text input</h2><TextInput type="email"/><TextInput label="Email with error" error="Please enter a valid email address." defaultValue="example"/></section><h2>Page sections</h2><p>Switch to Page preview to explore the navigation, hero, quote, featured book, about, steps, newsletter and footer together.</p></main>}<dialog ref={dialog} className="nook-dialog"><h2>Make room for reading</h2><p>This is a component preview. Reservations are not yet connected to a booking service.</p><Button onClick={()=>dialog.current?.close()}>Back to Nook</Button></dialog></>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
