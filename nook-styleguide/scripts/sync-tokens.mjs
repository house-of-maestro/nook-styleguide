import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const selectedModes={Primitives:'Value'};
const required=['colors/color-headline','colors/color-body','colors/color-highlight','colors/color-surface','colors/color-brand','colors/color-brand-dark','typography/font-family-1','typography/font-family-2','typography/font-weight-700','radius/radius','layout/section-x','layout/section-y','spacing/space-6'];
const supportedFonts=new Set(['Besley','Mona Sans','Young Serif']);
export const cssName=name=>'--'+name.replace(/[^a-zA-Z0-9_-]/g,'-');
const fail=message=>{throw new Error(message);};
const number=(v,label)=>typeof v==='number'&&Number.isFinite(v)?v:fail(`${label} must be a finite number`);
export function normalize(payload,previous){
 if(payload.meta?.variables){return {collections:Object.values(payload.meta.variableCollections).map(c=>({id:c.id,name:c.name,modes:c.modes,defaultModeId:c.defaultModeId})),variables:Object.values(payload.meta.variables).filter(v=>!v.remote).map(v=>({id:v.id,name:v.name,type:v.resolvedType,collectionId:v.variableCollectionId,values:v.valuesByMode})),textStyles:previous.textStyles};}
 return payload;
}
export function generate(source,previous){
 if(!Array.isArray(source.collections)||!Array.isArray(source.variables)||!Array.isArray(source.textStyles))fail('Export must include collections, variables and textStyles arrays.');
 const collections=new Map(source.collections.map(c=>[c.id,c]));const variables=new Map(source.variables.map(v=>[v.id,v]));const names=new Set();const cssNames=new Set();
 for(const v of source.variables){if(!v.name||names.has(v.name)||cssNames.has(cssName(v.name)))fail(`Duplicate or invalid variable name: ${v.name}`);names.add(v.name);cssNames.add(cssName(v.name));}
 for(const name of required){if(!names.has(name))fail(`Missing required Nook variable: ${name}. Restore it in Figma or update the mapping before syncing.`);const actual=source.variables.find(v=>v.name===name).type;const expected=name.startsWith('colors/')?'COLOR':name.includes('font-family')?'STRING':'FLOAT';if(actual!==expected)fail(`Wrong type for ${name}: expected ${expected}.`);}
 function resolve(v,stack=[]){
  if(stack.includes(v.id))fail(`Circular variable alias: ${v.name}`);
  const collection=collections.get(v.collectionId);if(!collection)fail(`Missing collection for ${v.name}`);
  const selection=selectedModes[collection.name];const mode=selection?collection.modes.find(m=>m.name===selection):collection.modes.find(m=>m.modeId===collection.defaultModeId);
  if(!mode)fail(`Cannot find selected mode for ${collection.name}. Update selectedModes in scripts/sync-tokens.mjs.`);
  const value=v.values?.[mode.modeId];if(value===undefined)fail(`Missing value for ${v.name}`);
  if(value?.type==='VARIABLE_ALIAS'){const target=variables.get(value.id);if(!target)fail(`Unresolved alias for ${v.name}. Export its local source collection too.`);if(target.type!==v.type)fail(`Alias type mismatch for ${v.name}`);return resolve(target,[...stack,v.id]);}
  return value;
 }
 function cssValue(v){const value=resolve(v);
  if(v.type==='COLOR'){const rgba=['r','g','b'].map(k=>number(value?.[k],v.name));const alpha=value.a===undefined?1:number(value.a,v.name);if([...rgba,alpha].some(n=>n<0||n>1))fail(`Invalid color channel for ${v.name}`);const hex=rgba.map(n=>Math.round(n*255).toString(16).padStart(2,'0')).join('');return alpha===1?'#'+hex:`rgb(${rgba.map(n=>Math.round(n*255)).join(' ')} / ${alpha})`;}
  if(v.type==='FLOAT'){const n=number(value,v.name);if(n<0)fail(`Negative value for ${v.name}`);return String(n)+(/^(spacing|radius|layout)\//.test(v.name)||v.name.includes('font-size')?'px':'');}
  if(v.type==='BOOLEAN'){if(typeof value!=='boolean')fail(`Invalid boolean: ${v.name}`);return value?'1':'0';}
  if(v.type==='STRING'){if(typeof value!=='string'||/[\n\r\0]/.test(value))fail(`Invalid string: ${v.name}`);if(v.name.includes('font-family')&&!supportedFonts.has(value))fail(`Font ${value} is not installed in the website. Add its font files before syncing.`);return JSON.stringify(value);}
  fail(`Unsupported variable type: ${v.type}`);
 }
 let css='/* Generated from design/figma-variables.json. Edit values in Figma, then export and sync. */\n:root {\n';
 const resolved=source.variables.map(v=>({...v,values:{'1:1':resolve(v)},cssVariable:cssName(v.name)}));
 for(const v of source.variables)css+=`  ${cssName(v.name)}: ${cssValue(v)};\n`;
 const aliases={'nook-brand':'colors/color-brand','nook-dark':'colors/color-brand-dark','nook-highlight':'colors/color-highlight','nook-cream':'colors/color-body','nook-heading':'typography/font-family-1','nook-body':'typography/font-family-2'};
 for(const [alias,name] of Object.entries(aliases))css+=`  --${alias}: var(${cssName(name)});\n`;
 const usedStyles=new Set();const styles=source.textStyles.map(t=>{
  if(!/^[a-zA-Z0-9_-]+$/.test(t.name)||usedStyles.has(t.name))fail(`Invalid or duplicate text style name: ${t.name}`);usedStyles.add(t.name);
  if(!supportedFonts.has(t.fontName?.family))fail(`Text style ${t.name} uses an uninstalled font.`);
  const size=number(t.fontSize,t.name);if(size<=0)fail(`Invalid font size: ${t.name}`);
  const weight=t.fontName.variationSettings?.wght ?? ({Regular:400,Medium:500,Bold:700}[t.fontName.style]);if(!weight||weight<1||weight>1000)fail(`Unsupported font weight for ${t.name}`);
  const line=t.lineHeight.unit==='AUTO'?'normal':t.lineHeight.unit==='PERCENT'?String(number(t.lineHeight.value,t.name)/100):t.lineHeight.unit==='PIXELS'?number(t.lineHeight.value,t.name)+'px':fail(`Invalid line height for ${t.name}`);
  const tracking=number(t.letterSpacing.value,t.name)+(t.letterSpacing.unit==='PERCENT'?'%':'px');
  const spacing=t.letterSpacing.unit==='PERCENT'?number(t.letterSpacing.value,t.name)/100+'em':tracking;
  const family=t.fontName.family==='Besley'?'var(--nook-heading)':t.fontName.family==='Mona Sans'?'var(--nook-body)':JSON.stringify(t.fontName.family);
  css+=`  --text-${t.name}-size: ${size}px;\n  --text-${t.name}-weight: ${weight};\n  --text-${t.name}-line-height: ${line};\n  --text-${t.name}-tracking: ${spacing};\n  --text-${t.name}-family: ${family};\n`;
  return {...t,cssClass:'nook-text-'+t.name};
 });
 for(const name of ['headline-hero','headline-2','headline-3','headline-4','body-text','body-text_small','body-text_large','quote','eyebrow'])if(!usedStyles.has(name))fail(`Missing website text style: ${name}`);
 css+='}\n';for(const t of styles)css+=`.${t.cssClass} { font-family:var(--text-${t.name}-family);font-size:var(--text-${t.name}-size);font-weight:var(--text-${t.name}-weight);line-height:var(--text-${t.name}-line-height);letter-spacing:var(--text-${t.name}-tracking); }\n`;
 return {css,inventory:{...previous,collections:source.collections,variables:resolved,textStyles:styles}};
}
export async function sync({api=false,check=false}={}){
 const sourcePath=path.join(root,'design/figma-variables.json');const previous=JSON.parse(await readFile(path.join(root,'src/design-system.json'),'utf8'));let source=JSON.parse(await readFile(sourcePath,'utf8'));
 if(api){const token=process.env.FIGMA_ACCESS_TOKEN;if(!token)fail('Set FIGMA_ACCESS_TOKEN with file_variables:read. Direct Variables API access requires a Figma Enterprise Full seat.');const res=await fetch('https://api.figma.com/v1/files/7Hoa2r20HBX8DgbunRgqHl/variables/local',{headers:{'X-Figma-Token':token},signal:AbortSignal.timeout(30000)});if(!res.ok)fail(`Figma returned ${res.status}. Check Enterprise eligibility, token scope and file access. Export with the included Figma plugin if the API is unavailable.`);source=normalize(await res.json(),source);}
 const output=generate(source,previous); // Validate everything before writing any outputs.
 const files=[[path.join(root,'src/tokens.css'),output.css],[path.join(root,'src/design-system.json'),JSON.stringify(output.inventory,null,2)+'\n']];
 if(api)files.push([sourcePath,JSON.stringify(source,null,2)+'\n']);
 for(const [file,content] of files){const current=await readFile(file,'utf8').catch(()=>null);if(current!==content){if(check)fail(`${path.relative(root,file)} is out of date. Run npm run tokens:sync.`);await writeFile(file,content);}}
 console.log(`Synced ${source.variables.length} Figma variables and ${source.textStyles.length} text styles${check?' (checked)':''}.`);
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url))sync({api:process.argv.includes('--api'),check:process.argv.includes('--check')}).catch(e=>{console.error('Token sync failed: '+e.message);process.exitCode=1;});
