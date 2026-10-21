const defaultSteps = [
 {title:'One book, each month',description:'We choose a book together — you help shape the shortlist, we make the final call.'},
 {title:'Ten people, one table',description:'Every meeting is limited to ten people so the conversation stays real.'},
 {title:'A different venue',description:'We meet at cafés, galleries, bookshops, and other spots across Berlin.'}
];
export function SectionHow({heading='How it works',steps=defaultSteps}: {heading?: string; steps?: typeof defaultSteps}) {
 return <section className="nook-section nook-how"><h2>{heading}</h2><ol>{steps.map((step,index)=><li key={step.title}><span className="nook-step-number">{String(index+1).padStart(2,'0')}</span><img src={`${import.meta.env.BASE_URL}assets/rule.svg`} alt="" width="72" height="4"/><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol></section>;
}
