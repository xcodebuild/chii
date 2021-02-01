import{ParsedURL}from"./ParsedURL.js";import{ls}from"./UIString.js";export class ResourceType{constructor(e,t,s,r){this._name=e,this._title=t,this._category=s,this._isTextType=r}static fromMimeType(e){return e?e.startsWith("text/html")?resourceTypes.Document:e.startsWith("text/css")?resourceTypes.Stylesheet:e.startsWith("image/")?resourceTypes.Image:e.startsWith("text/")?resourceTypes.Script:e.includes("font")?resourceTypes.Font:e.includes("script")?resourceTypes.Script:e.includes("octet")?resourceTypes.Other:e.includes("application")?resourceTypes.Script:resourceTypes.Other:resourceTypes.Other}static fromURL(e){return _resourceTypeByExtension.get(ParsedURL.extractExtension(e))||null}static fromName(e){for(const t in resourceTypes){const s=resourceTypes[t];if(s.name()===e)return s}return null}static mimeFromURL(e){const t=ParsedURL.extractName(e);if(_mimeTypeByName.has(t))return _mimeTypeByName.get(t);const s=ParsedURL.extractExtension(e).toLowerCase();return _mimeTypeByExtension.get(s)}static mimeFromExtension(e){return _mimeTypeByExtension.get(e)}name(){return this._name}title(){return this._title}category(){return this._category}isTextType(){return this._isTextType}isScript(){return"script"===this._name||"sm-script"===this._name}hasScripts(){return this.isScript()||this.isDocument()}isStyleSheet(){return"stylesheet"===this._name||"sm-stylesheet"===this._name}isDocument(){return"document"===this._name}isDocumentOrScriptOrStyleSheet(){return this.isDocument()||this.isScript()||this.isStyleSheet()}isFromSourceMap(){return this._name.startsWith("sm-")}toString(){return this._name}canonicalMimeType(){return this.isDocument()?"text/html":this.isScript()?"text/javascript":this.isStyleSheet()?"text/css":""}}export class ResourceCategory{constructor(e,t){this.title=e,this.shortTitle=t}}export const resourceCategories={XHR:new ResourceCategory(ls`XHR and Fetch`,ls`XHR`),Script:new ResourceCategory(ls`Scripts`,ls`JS`),Stylesheet:new ResourceCategory(ls`Stylesheets`,ls`CSS`),Image:new ResourceCategory(ls`Images`,ls`Img`),Media:new ResourceCategory(ls`Media`,ls`Media`),Font:new ResourceCategory(ls`Fonts`,ls`Font`),Document:new ResourceCategory(ls`Documents`,ls`Doc`),WebSocket:new ResourceCategory(ls`WebSockets`,ls`WS`),Manifest:new ResourceCategory(ls`Manifest`,ls`Manifest`),Other:new ResourceCategory(ls`Other`,ls`Other`)};export const resourceTypes={XHR:new ResourceType("xhr",ls`XHR`,resourceCategories.XHR,!0),Fetch:new ResourceType("fetch",ls`Fetch`,resourceCategories.XHR,!0),EventSource:new ResourceType("eventsource",ls`EventSource`,resourceCategories.XHR,!0),Script:new ResourceType("script",ls`Script`,resourceCategories.Script,!0),Stylesheet:new ResourceType("stylesheet",ls`Stylesheet`,resourceCategories.Stylesheet,!0),Image:new ResourceType("image",ls`Image`,resourceCategories.Image,!1),Media:new ResourceType("media",ls`Media`,resourceCategories.Media,!1),Font:new ResourceType("font",ls`Font`,resourceCategories.Font,!1),Document:new ResourceType("document",ls`Document`,resourceCategories.Document,!0),TextTrack:new ResourceType("texttrack",ls`TextTrack`,resourceCategories.Other,!0),WebSocket:new ResourceType("websocket",ls`WebSocket`,resourceCategories.WebSocket,!1),Other:new ResourceType("other",ls`Other`,resourceCategories.Other,!1),SourceMapScript:new ResourceType("sm-script",ls`Script`,resourceCategories.Script,!0),SourceMapStyleSheet:new ResourceType("sm-stylesheet",ls`Stylesheet`,resourceCategories.Stylesheet,!0),Manifest:new ResourceType("manifest",ls`Manifest`,resourceCategories.Manifest,!0),SignedExchange:new ResourceType("signed-exchange",ls`SignedExchange`,resourceCategories.Other,!1)};export const _mimeTypeByName=new Map([["Cakefile","text/x-coffeescript"]]);export const _resourceTypeByExtension=new Map([["js",resourceTypes.Script],["mjs",resourceTypes.Script],["css",resourceTypes.Stylesheet],["xsl",resourceTypes.Stylesheet],["jpeg",resourceTypes.Image],["jpg",resourceTypes.Image],["svg",resourceTypes.Image],["gif",resourceTypes.Image],["png",resourceTypes.Image],["ico",resourceTypes.Image],["tiff",resourceTypes.Image],["tif",resourceTypes.Image],["bmp",resourceTypes.Image],["webp",resourceTypes.Media],["ttf",resourceTypes.Font],["otf",resourceTypes.Font],["ttc",resourceTypes.Font],["woff",resourceTypes.Font]]);export const _mimeTypeByExtension=new Map([["js","text/javascript"],["mjs","text/javascript"],["css","text/css"],["html","text/html"],["htm","text/html"],["xml","application/xml"],["xsl","application/xml"],["asp","application/x-aspx"],["aspx","application/x-aspx"],["jsp","application/x-jsp"],["c","text/x-c++src"],["cc","text/x-c++src"],["cpp","text/x-c++src"],["h","text/x-c++src"],["m","text/x-c++src"],["mm","text/x-c++src"],["coffee","text/x-coffeescript"],["dart","text/javascript"],["ts","text/typescript"],["tsx","text/typescript-jsx"],["json","application/json"],["gyp","application/json"],["gypi","application/json"],["cs","text/x-csharp"],["java","text/x-java"],["less","text/x-less"],["php","text/x-php"],["phtml","application/x-httpd-php"],["py","text/x-python"],["sh","text/x-sh"],["scss","text/x-scss"],["vtt","text/vtt"],["ls","text/x-livescript"],["md","text/markdown"],["cljs","text/x-clojure"],["cljc","text/x-clojure"],["cljx","text/x-clojure"],["styl","text/x-styl"],["jsx","text/jsx"],["jpeg","image/jpeg"],["jpg","image/jpeg"],["svg","image/svg+xml"],["gif","image/gif"],["webp","image/webp"],["png","image/png"],["ico","image/ico"],["tiff","image/tiff"],["tif","image/tif"],["bmp","image/bmp"],["ttf","font/opentype"],["otf","font/opentype"],["ttc","font/opentype"],["woff","application/font-woff"]]);