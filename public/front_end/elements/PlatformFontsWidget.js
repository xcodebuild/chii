import*as Common from"../common/common.js";import*as SDK from"../sdk/sdk.js";import*as UI from"../ui/ui.js";import{ComputedStyleModel,Events}from"./ComputedStyleModel.js";export class PlatformFontsWidget extends UI.ThrottledWidget.ThrottledWidget{constructor(t){super(!0),this.registerRequiredCSS("elements/platformFontsWidget.css"),this._sharedModel=t,this._sharedModel.addEventListener(Events.ComputedStyleChanged,this.update,this),this._sectionTitle=createElementWithClass("div","title"),this.contentElement.classList.add("platform-fonts"),this.contentElement.appendChild(this._sectionTitle),this._sectionTitle.textContent=Common.UIString.UIString("Rendered Fonts"),this._fontStatsSection=this.contentElement.createChild("div","stats-section")}doUpdate(){const t=this._sharedModel.cssModel(),e=this._sharedModel.node();return e&&t?t.platformFontsPromise(e.id).then(this._refreshUI.bind(this,e)):Promise.resolve()}_refreshUI(t,e){if(this._sharedModel.node()!==t)return;this._fontStatsSection.removeChildren();const o=!e||!e.length;if(this._sectionTitle.classList.toggle("hidden",o),!o){e.sort((function(t,e){return e.glyphCount-t.glyphCount}));for(let t=0;t<e.length;++t){const o=this._fontStatsSection.createChild("div","font-stats-item");o.createChild("span","font-name").textContent=e[t].familyName;o.createChild("span","font-delimeter").textContent="—";o.createChild("span").textContent=e[t].isCustomFont?Common.UIString.UIString("Network resource"):Common.UIString.UIString("Local file");const n=o.createChild("span","font-usage"),s=e[t].glyphCount;n.textContent=1===s?Common.UIString.UIString("(%d glyph)",s):Common.UIString.UIString("(%d glyphs)",s)}}}}