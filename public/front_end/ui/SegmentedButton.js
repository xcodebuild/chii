import{HBox}from"./Widget.js";export class SegmentedButton extends HBox{constructor(){super(!0),this._buttons=new Map,this._selected=null,this.registerRequiredCSS("ui/segmentedButton.css"),this.contentElement.classList.add("segmented-button")}addSegment(t,e,s){const n=this.contentElement.createChild("button","segmented-button-segment");n.textContent=t,n.title=s,this._buttons.set(e,n),n.addEventListener("click",()=>this.select(e))}select(t){if(this._selected!==t){this._selected=t;for(const t of this._buttons.keys())this._buttons.get(t).classList.toggle("segmented-button-segment-selected",t===this._selected)}}selected(){return this._selected}}