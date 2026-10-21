import {useState, type FormEvent} from 'react';
import {Button} from './Button';
import {TextInput} from './TextInput';
export function SectionNewsletter({onSubscribe}: {onSubscribe?: (email: string)=>Promise<void> | void}) {
 const [status,setStatus]=useState(''); const [busy,setBusy]=useState(false);
 async function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();const form=event.currentTarget; const email=String(new FormData(form).get('email') || '');
  if(!onSubscribe){setStatus('Preview only — no email has been saved or sent.');return;}
  setBusy(true);setStatus('');try{await onSubscribe(email);setStatus('You’re on the list. See you at Nook!');form.reset();}catch{setStatus('We couldn’t subscribe you. Please try again.');}finally{setBusy(false);}
 }
 return <section id="newsletter" className="nook-section nook-newsletter"><h2>Stay in the loop</h2><p>Get the next book announcement, venue, and RSVP link before places fill.</p><form onSubmit={submit}><TextInput name="email" type="email" autoComplete="email" required/><Button type="submit" disabled={busy}>{busy ? 'Submitting…' : 'Reserve your spot'}</Button></form><p className="nook-form-status" role="status">{status}</p></section>;
}
