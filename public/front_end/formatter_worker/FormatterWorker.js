import*as Platform from"../platform/platform.js";import{AcornTokenizer}from"./AcornTokenizer.js";import{CSSFormatter}from"./CSSFormatter.js";import{parseCSS}from"./CSSRuleParser.js";import{ESTreeWalker}from"./ESTreeWalker.js";import{FormattedContentBuilder}from"./FormattedContentBuilder.js";import{HTMLFormatter}from"./HTMLFormatter.js";import{IdentityFormatter}from"./IdentityFormatter.js";import{JavaScriptFormatter}from"./JavaScriptFormatter.js";import{javaScriptOutline}from"./JavaScriptOutline.js";import{RelaxedJSONParser}from"./RelaxedJSONParser.js";export function createTokenizer(e){const t=CodeMirror.getMode({indentUnit:2},e),r=CodeMirror.startState(t);return function(e,n){const o=new CodeMirror.StringStream(e);for(;!o.eol();){const e=t.token(o,r),a=o.current();if(n(a,e,o.start,o.start+a.length)===AbortTokenization)return;o.start=o.pos}}}export const AbortTokenization={};self.onmessage=function(e){const t=e.data.method,r=e.data.params;if(t)switch(t){case"format":format(r.mimeType,r.content,r.indentString);break;case"parseCSS":parseCSS(r.content);break;case"parseSCSS":FormatterWorkerContentParser.parse(r.content,"text/x-scss");break;case"javaScriptOutline":javaScriptOutline(r.content);break;case"javaScriptIdentifiers":javaScriptIdentifiers(r.content);break;case"evaluatableJavaScriptSubstring":evaluatableJavaScriptSubstring(r.content);break;case"parseJSONRelaxed":parseJSONRelaxed(r.content);break;case"findLastExpression":postMessage(findLastExpression(r.content));break;case"findLastFunctionCall":postMessage(findLastFunctionCall(r.content));break;case"argumentsList":postMessage(argumentsList(r.content));break;default:console.error("Unsupport method name: "+t)}};export function parseJSONRelaxed(e){postMessage(RelaxedJSONParser.parse(e))}export function evaluatableJavaScriptSubstring(e){const t=acorn.tokenizer(e,{});let r="";try{let n=t.getToken();for(;n.type!==acorn.tokTypes.eof&&AcornTokenizer.punctuator(n);)n=t.getToken();const o=n.start;let a=n.end,s=0;for(;n.type!==acorn.tokTypes.eof;){const e=AcornTokenizer.identifier(n),r=AcornTokenizer.keyword(n,"this"),o=n.type===acorn.tokTypes.string;if(!r&&!e&&!o)break;for(a=n.end,n=t.getToken();AcornTokenizer.punctuator(n,".[]");)AcornTokenizer.punctuator(n,"[")&&s++,AcornTokenizer.punctuator(n,"]")&&(a=s>0?n.end:a,s--),n=t.getToken()}r=e.substring(o,a)}catch(e){console.error(e)}postMessage(r)}export function javaScriptIdentifiers(e){let t=null;try{t=acorn.parse(e,{ranges:!1})}catch(e){}const r=[],n=new ESTreeWalker((function(e){if(o(e))return e.id&&r.push(e.id),ESTreeWalker.SkipSubtree;if("Identifier"!==e.type)return;if(e.parent&&"MemberExpression"===e.parent.type&&e.parent.property===e&&!e.parent.computed)return;r.push(e)}));function o(e){return"FunctionDeclaration"===e.type||"FunctionExpression"===e.type||"ArrowFunctionExpression"===e.type}if(!t||"Program"!==t.type||1!==t.body.length||!o(t.body[0]))return void postMessage([]);const a=t.body[0];for(const e of a.params)n.walk(e);n.walk(a.body);const s=r.map(e=>({name:e.name,offset:e.start}));postMessage(s)}export function format(e,t,r){const n={},o=new FormattedContentBuilder(r=r||"    "),a=Platform.StringUtilities.findLineEndingIndexes(t);try{switch(e){case"text/html":new HTMLFormatter(o).format(t,a);break;case"text/css":new CSSFormatter(o).format(t,a,0,t.length);break;case"text/javascript":new JavaScriptFormatter(o).format(t,a,0,t.length);break;default:new IdentityFormatter(o).format(t,a,0,t.length)}n.mapping=o.mapping(),n.content=o.content()}catch(e){console.error(e),n.mapping={original:[0],formatted:[0]},n.content=t}postMessage(n)}export function findLastFunctionCall(e){if(e.length>1e4)return null;try{const t=acorn.tokenizer(e,{});for(;t.getToken().type!==acorn.tokTypes.eof;);}catch(e){return null}const t=_lastCompleteExpression(e,"000)",new Set(["CallExpression","NewExpression"]));if(!t)return null;const r=t.baseNode.callee;let n="";const o="Identifier"===r.type?r:r.property;o&&("Identifier"===o.type?n=o.name:"Literal"===o.type&&(n=o.value));const a=t.baseNode.arguments.length-1,s=`(${t.baseExpression.substring(r.start-t.baseNode.start,r.end-t.baseNode.start)})`;let i="(function(){return this})()";if("MemberExpression"===r.type){const e=r.object;i=t.baseExpression.substring(e.start-t.baseNode.start,e.end-t.baseNode.start)}return{baseExpression:s,receiver:i,argumentIndex:a,functionName:n}}export function argumentsList(e){if(e.length>1e4)return[];let t=null;try{t=acorn.parse(`(${e})`,{})}catch(e){}if(!t)try{t=acorn.parse(`({${e}})`,{})}catch(e){}if(!(t&&t.body&&t.body[0]&&t.body[0].expression))return[];const r=t.body[0].expression;let n=null;switch(r.type){case"ClassExpression":{if(!r.body.body)break;const e=r.body.body.find(e=>"constructor"===e.kind);e&&(n=e.value.params);break}case"ObjectExpression":if(!r.properties[0]||!r.properties[0].value)break;n=r.properties[0].value.params;break;case"FunctionExpression":case"ArrowFunctionExpression":n=r.params}return n?n.map((function e(t){switch(t.type){case"Identifier":return t.name;case"AssignmentPattern":return"?"+e(t.left);case"ObjectPattern":return"obj";case"ArrayPattern":return"arr";case"RestElement":return"..."+e(t.argument)}return"?"})):[]}export function findLastExpression(e){if(e.length>1e4)return null;try{const t=acorn.tokenizer(e,{});for(;t.getToken().type!==acorn.tokTypes.eof;);}catch(e){return null}try{acorn.parse(e+".DEVTOOLS",{})}catch(t){if(t.message.startsWith("Unexpected token")&&t.pos===e.length)return null}const t=_lastCompleteExpression(e,".DEVTOOLS",new Set(["MemberExpression","Identifier"]));return t?t.baseExpression:null}export function _lastCompleteExpression(e,t,r){let n,o="";for(let r=0;r<e.length;r++)try{o="{"===e[r]?`(${e.substring(r)})${t}`:`${e.substring(r)}${t}`,n=acorn.parse(o,{});break}catch(e){}if(!n)return null;let a=null;if(new ESTreeWalker(e=>{if(a||e.end<n.end)return ESTreeWalker.SkipSubtree;r.has(e.type)&&(a=e)}).walk(n),!a)return null;let s=o.substring(a.start,o.length-t.length);return s.startsWith("{")&&(s=`(${s})`),{baseNode:a,baseExpression:s}}export class FormatterWorkerContentParser{parse(e){}}FormatterWorkerContentParser.parse=function(e,t){const r=self.runtime.extensions(FormatterWorkerContentParser).find((function(e){return e.descriptor().mimeType===t}));console.assert(r),r.instance().then(t=>t.parse(e)).catch(e=>{console.error(e)}).then(postMessage)},Root.Runtime.queryParam("test")&&(console.error=()=>{});