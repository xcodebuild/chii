import*as Components from"../components/components.js";import*as SDK from"../sdk/sdk.js";import*as UI from"../ui/ui.js";export class ImagePreviewPopover{constructor(e,o,t){this._getLinkElement=o,this._getDOMNode=t,this._popover=new UI.PopoverHelper.PopoverHelper(e,this._handleRequest.bind(this)),this._popover.setHasPadding(!0),this._popover.setTimeout(0,100)}_handleRequest(e){const o=this._getLinkElement(e);return o&&o[HrefSymbol]?{box:o.boxInWindow(),hide:void 0,show:async e=>{const t=this._getDOMNode(o);if(!t)return!1;const r=await Components.ImagePreview.ImagePreview.loadDimensionsForNode(t),s=await Components.ImagePreview.ImagePreview.build(t.domModel().target(),o[HrefSymbol],!0,{precomputedFeatures:r});return s&&e.contentElement.appendChild(s),!!s}}:null}hide(){this._popover.hidePopover()}static setImageUrl(e,o){return e[HrefSymbol]=o,e}}export const HrefSymbol=Symbol("ImagePreviewPopover.Href");