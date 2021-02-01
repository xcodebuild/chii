import*as Common from"../common/common.js";import{ContextFlavorListener}from"./ContextFlavorListener.js";export class Context{constructor(){this._flavors=new Map,this._eventDispatchers=new Map}setFlavor(e,t){(this._flavors.get(e)||null)!==t&&(t?this._flavors.set(e,t):this._flavors.delete(e),this._dispatchFlavorChange(e,t))}_dispatchFlavorChange(e,t){for(const s of self.runtime.extensions(ContextFlavorListener))s.hasContextType(e)&&s.instance().then(e=>e.flavorChanged(t));const s=this._eventDispatchers.get(e);s&&s.dispatchEventToListeners(Events.FlavorChanged,t)}addFlavorChangeListener(e,t,s){let n=this._eventDispatchers.get(e);n||(n=new Common.ObjectWrapper.ObjectWrapper,this._eventDispatchers.set(e,n)),n.addEventListener(Events.FlavorChanged,t,s)}removeFlavorChangeListener(e,t,s){const n=this._eventDispatchers.get(e);n&&(n.removeEventListener(Events.FlavorChanged,t,s),n.hasEventListeners(Events.FlavorChanged)||this._eventDispatchers.delete(e))}flavor(e){return this._flavors.get(e)||null}flavors(){return new Set(this._flavors.keys())}applicableExtensions(e){const t=new Set,s=this.flavors();return e.forEach((function(e){self.runtime.isExtensionApplicableToContextTypes(e,s)&&t.add(e)})),t}}const Events={FlavorChanged:Symbol("FlavorChanged")};