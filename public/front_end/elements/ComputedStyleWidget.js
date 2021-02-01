import*as Common from"../common/common.js";import*as Components from"../components/components.js";import*as InlineEditor from"../inline_editor/inline_editor.js";import*as SDK from"../sdk/sdk.js";import*as UI from"../ui/ui.js";import{ComputedStyle,ComputedStyleModel,Events}from"./ComputedStyleModel.js";import{ImagePreviewPopover}from"./ImagePreviewPopover.js";import{PlatformFontsWidget}from"./PlatformFontsWidget.js";import{StylePropertiesSection,StylesSidebarPane,StylesSidebarPropertyRenderer}from"./StylesSidebarPane.js";export class ComputedStyleWidget extends UI.ThrottledWidget.ThrottledWidget{constructor(){super(!0),this.registerRequiredCSS("elements/computedStyleSidebarPane.css"),this._alwaysShowComputedProperties={display:!0,height:!0,width:!0},this._computedStyleModel=new ComputedStyleModel,this._computedStyleModel.addEventListener(Events.ComputedStyleChanged,this.update,this),this._showInheritedComputedStylePropertiesSetting=Common.Settings.Settings.instance().createSetting("showInheritedComputedStyleProperties",!1),this._showInheritedComputedStylePropertiesSetting.addChangeListener(this._showInheritedComputedStyleChanged.bind(this));const e=this.contentElement.createChild("div","hbox styles-sidebar-pane-toolbar"),t=e.createChild("div","styles-sidebar-pane-filter-box"),o=StylesSidebarPane.createPropertyFilterElement(ls`Filter`,e,function(e){this._filterRegex=e,this._updateFilter(e)}.bind(this));UI.ARIAUtils.setAccessibleName(o,Common.UIString.UIString("Filter Computed Styles")),t.appendChild(o),this.setDefaultFocusedElement(o);new UI.Toolbar.Toolbar("styles-pane-toolbar",e).appendToolbarItem(new UI.Toolbar.ToolbarSettingCheckbox(this._showInheritedComputedStylePropertiesSetting,void 0,Common.UIString.UIString("Show all"))),this._noMatchesElement=this.contentElement.createChild("div","gray-info-message"),this._noMatchesElement.textContent=ls`No matching property`,this._propertiesOutline=new UI.TreeOutline.TreeOutlineInShadow,this._propertiesOutline.hideOverflow(),this._propertiesOutline.setShowSelectionOnKeyboardFocus(!0),this._propertiesOutline.setFocusable(!0),this._propertiesOutline.registerRequiredCSS("elements/computedStyleWidgetTree.css"),this._propertiesOutline.element.classList.add("monospace","computed-properties"),this.contentElement.appendChild(this._propertiesOutline.element),this._linkifier=new Components.Linkifier.Linkifier(_maxLinkLength),this._imagePreviewPopover=new ImagePreviewPopover(this.contentElement,e=>{const t=e.composedPath()[0];return t instanceof Element?t:null},()=>this._computedStyleModel.node());new PlatformFontsWidget(this._computedStyleModel).show(this.contentElement)}onResize(){const e=this.contentElement.offsetWidth<260;this._propertiesOutline.contentElement.classList.toggle("computed-narrow",e)}_showInheritedComputedStyleChanged(){this.update()}async doUpdate(){const e=[this._computedStyleModel.fetchComputedStyle(),this._fetchMatchedCascade()],[t,o]=await Promise.all(e);this._innerRebuildUpdate(t,o)}_fetchMatchedCascade(){const e=this._computedStyleModel.node();return e&&this._computedStyleModel.cssModel()?this._computedStyleModel.cssModel().cachedMatchedCascadeForNode(e).then(function(e){return e&&e.node()===this._computedStyleModel.node()?e:null}.bind(this)):Promise.resolve(null)}_processColor(e){const t=Common.Color.Color.parse(e);if(!t)return createTextNode(e);const o=InlineEditor.ColorSwatch.ColorSwatch.create();return o.setColor(t),o.setFormat(Common.Settings.detectColorFormat(t)),o}_innerRebuildUpdate(e,t){const o=new Set;for(const e of this._propertiesOutline.rootElement().children()){if(!e.expanded)continue;const t=e[_propertySymbol].name;o.add(t)}const n=this._propertiesOutline.element.hasFocus();this._imagePreviewPopover.hide(),this._propertiesOutline.removeChildren(),this._linkifier.reset();const s=this._computedStyleModel.cssModel();if(!e||!t||!s)return void this._noMatchesElement.classList.remove("hidden");const i=[...e.computedStyle.keys()];i.sort((function(e,t){if(e.startsWith("--")^t.startsWith("--"))return e.startsWith("--")?1:-1;if(e.startsWith("-webkit")^t.startsWith("-webkit"))return e.startsWith("-webkit")?1:-1;const o=SDK.CSSMetadata.cssMetadata().canonicalPropertyName(e),n=SDK.CSSMetadata.cssMetadata().canonicalPropertyName(t);return o.compareTo(n)}));const r=this._computePropertyTraces(t),l=this._computeInheritedProperties(t),a=this._showInheritedComputedStylePropertiesSetting.get();for(let c=0;c<i.length;++c){const p=i[c],m=e.computedStyle.get(p),h=SDK.CSSMetadata.cssMetadata().canonicalPropertyName(p),u=!l.has(h);if(!a&&u&&!(p in this._alwaysShowComputedProperties))continue;if(!a&&p.startsWith("--"))continue;if(p!==h&&m===e.computedStyle.get(h))continue;const S=createElement("div");S.classList.add("computed-style-property"),S.classList.toggle("computed-style-property-inherited",u);const y=new StylesSidebarPropertyRenderer(null,e.node,p,m);y.setColorHandler(this._processColor.bind(this));const C=y.renderName();C.classList.add("property-name"),S.appendChild(C);const _=createElementWithClass("span","delimeter");_.textContent=": ",C.appendChild(_);const g=S.createChild("span","property-value"),f=y.renderValue();f.classList.add("property-value-text"),g.appendChild(f);const v=createElementWithClass("span","delimeter");v.textContent=";",g.appendChild(v);const w=new UI.TreeOutline.TreeElement;w.title=S,w[_propertySymbol]={name:p,value:m};const I=this._propertiesOutline.rootElement().children().length%2==0;w.listItemElement.classList.toggle("odd-row",I),this._propertiesOutline.appendChild(w),this._propertiesOutline.selectedTreeElement||w.select(!n);const P=r.get(p);if(P){const n=this._renderPropertyTrace(s,t,e.node,w,P);w.listItemElement.addEventListener("mousedown",e=>e.consume(),!1),w.listItemElement.addEventListener("dblclick",e=>e.consume(),!1),w.listItemElement.addEventListener("click",d.bind(null,w),!1),w.listItemElement.addEventListener("contextmenu",this._handleContextMenuEvent.bind(this,t,n));const i=UI.Icon.Icon.create("mediumicon-arrow-in-circle","goto-source-icon");i.addEventListener("click",this._navigateToSource.bind(this,n)),g.appendChild(i),o.has(p)&&w.expand()}}function d(e,t){e.expanded?e.collapse():e.expand(),t.consume()}this._updateFilter(this._filterRegex)}_navigateToSource(e,t){Common.Revealer.reveal(e),t.consume(!0)}_renderPropertyTrace(e,t,o,n,s){let i=null;for(const e of s){const s=createElement("div");s.classList.add("property-trace"),t.propertyState(e)===SDK.CSSMatchedStyles.PropertyState.Overloaded?s.classList.add("property-trace-inactive"):i=e;const r=new StylesSidebarPropertyRenderer(null,o,e.name,e.value);r.setColorHandler(this._processColor.bind(this));const l=r.renderValue();l.classList.add("property-trace-value"),l.addEventListener("click",this._navigateToSource.bind(this,e),!1);const a=UI.Icon.Icon.create("mediumicon-arrow-in-circle","goto-source-icon");a.addEventListener("click",this._navigateToSource.bind(this,e)),l.insertBefore(a,l.firstChild),s.appendChild(l);const d=e.ownerStyle.parentRule,c=s.createChild("span","property-trace-selector");if(c.textContent=d?d.selectorText():"element.style",c.title=c.textContent,d){s.createChild("span","trace-link").appendChild(StylePropertiesSection.createRuleOriginNode(t,this._linkifier,d))}const p=new UI.TreeOutline.TreeElement;p.title=s,p.listItemElement.addEventListener("contextmenu",this._handleContextMenuEvent.bind(this,t,e)),n.appendChild(p)}return i}_handleContextMenuEvent(e,t,o){const n=new UI.ContextMenu.ContextMenu(o),s=t.ownerStyle.parentRule;if(s){const t=s.styleSheetId?e.cssModel().styleSheetHeaderForId(s.styleSheetId):null;t&&!t.isAnonymousInlineStyleSheet()&&n.defaultSection().appendItem(ls`Navigate to selector source`,()=>{StylePropertiesSection.tryNavigateToRuleLocation(e,s)})}n.defaultSection().appendItem(ls`Navigate to style`,()=>Common.Revealer.reveal(t)),n.show()}_computePropertyTraces(e){const t=new Map;for(const o of e.nodeStyles()){const n=o.allProperties();for(const o of n)o.activeInStyle()&&e.propertyState(o)&&(t.has(o.name)||t.set(o.name,[]),t.get(o.name).push(o))}return t}_computeInheritedProperties(e){const t=new Set;for(const o of e.nodeStyles())for(const n of o.allProperties())e.propertyState(n)&&t.add(SDK.CSSMetadata.cssMetadata().canonicalPropertyName(n.name));return t}_updateFilter(e){const t=this._propertiesOutline.rootElement().children();let o=!1;for(const n of t){const t=n[_propertySymbol],s=!e||e.test(t.name)||e.test(t.value);n.hidden=!s,o|=s}this._noMatchesElement.classList.toggle("hidden",!!o)}}const _maxLinkLength=30,_propertySymbol=Symbol("property");ComputedStyleWidget._propertySymbol=_propertySymbol;