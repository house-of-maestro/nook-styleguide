import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {generate,normalize} from './sync-tokens.mjs';
const source=JSON.parse(await readFile(new URL('../design/figma-variables.json',import.meta.url),'utf8'));
const inventory=JSON.parse(await readFile(new URL('../src/design-system.json',import.meta.url),'utf8'));
const clone=()=>structuredClone(source);
const named=(data,name)=>data.variables.find(v=>v.name===name);
test('new Figma values update website aliases and the styleguide together',()=>{
 const data=clone();named(data,'colors/color-highlight').values['1:1']={r:0,g:0,b:1,a:1};named(data,'radius/radius').values['1:1']=12;data.textStyles.find(t=>t.name==='headline-2').fontSize=48;
 const out=generate(data,inventory);assert.match(out.css,/--colors-color-highlight: #0000ff/);assert.match(out.css,/--nook-highlight: var\(--colors-color-highlight\)/);assert.match(out.css,/--radius-radius: 12px/);assert.match(out.css,/--text-headline-2-size: 48px/);assert.equal(out.inventory.components.length,11);assert.equal(out.inventory.variables.find(v=>v.name==='colors/color-highlight').values['1:1'].b,1);
});
test('sync is deterministic',()=>assert.deepEqual(generate(source,inventory),generate(source,inventory)));
test('aliases resolve using the target collection selected mode',()=>{
 const data=clone();data.collections.push({id:'second',name:'Second',modes:[{name:'Light',modeId:'other'}],defaultModeId:'other'});data.variables.push({id:'blue',name:'colors/blue',type:'COLOR',collectionId:'second',values:{other:{r:0,g:0,b:1,a:.5}}});named(data,'colors/color-highlight').values['1:1']={type:'VARIABLE_ALIAS',id:'blue'};const out=generate(data,inventory);assert.match(out.css,/--colors-color-highlight: rgb\(0 0 255 \/ 0.5\)/);assert.equal(out.inventory.variables.find(v=>v.name==='colors/color-highlight').values['1:1'].b,1);
});
test('invalid exports fail before producing outputs',()=>{
 const scenarios=[
 data=>{named(data,'colors/color-highlight').values['1:1']={r:2,g:0,b:0};},
 data=>{data.variables=data.variables.filter(v=>v.name!=='colors/color-highlight');},
 data=>{named(data,'radius/radius').values['1:1']=-10;},
 data=>{const v=named(data,'colors/color-highlight');v.values['1:1']={type:'VARIABLE_ALIAS',id:v.id};},
 data=>{named(data,'typography/font-family-1').values['1:1']='Uninstalled Font';},
 data=>{data.variables.push({...data.variables[0],id:'duplicate'});},
 data=>{data.textStyles=[];}
 ];for(const change of scenarios){const data=clone();change(data);assert.throws(()=>generate(data,inventory));}
});
test('REST imports preserve text styles while normalizing local variables',()=>{
 const v=named(source,'colors/color-highlight');const normalized=normalize({meta:{variables:{[v.id]:{...v,resolvedType:v.type,variableCollectionId:v.collectionId,valuesByMode:v.values}},variableCollections:{[source.collections[0].id]:source.collections[0]}}},source);assert.equal(normalized.variables[0].name,v.name);assert.equal(normalized.textStyles.length,9);
});
