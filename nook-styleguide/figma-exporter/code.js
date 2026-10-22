figma.showUI(__html__,{width:400,height:340});
figma.ui.onmessage=async message=>{
 if(message.type!=='export')return;
 try{
  const collections=await figma.variables.getLocalVariableCollectionsAsync();
  const variables=await figma.variables.getLocalVariablesAsync();
  const styles=await figma.getLocalTextStylesAsync();
  const data={collections:collections.map(c=>({id:c.id,name:c.name,modes:c.modes,defaultModeId:c.defaultModeId})),variables:variables.map(v=>({id:v.id,name:v.name,type:v.resolvedType,collectionId:v.variableCollectionId,values:v.valuesByMode})),textStyles:styles.map(t=>({id:t.id,name:t.name,fontName:t.fontName,fontSize:t.fontSize,lineHeight:t.lineHeight,letterSpacing:t.letterSpacing}))};
  if(!data.variables.some(v=>v.name==='colors/color-highlight'))throw Error('Open the Nook source library before exporting.');
  figma.ui.postMessage({type:'exported',data});
 }catch(error){figma.ui.postMessage({type:'error',message:String(error.message || error)});}
};
