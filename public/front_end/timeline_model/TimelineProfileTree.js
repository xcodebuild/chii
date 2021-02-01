import*as SDK from"../sdk/sdk.js";import{TimelineJSProfileProcessor}from"./TimelineJSProfile.js";import{RecordType,TimelineData,TimelineModelImpl}from"./TimelineModel.js";import{TimelineModelFilter}from"./TimelineModelFilter.js";export class Node{constructor(e,t){this.totalTime=0,this.selfTime=0,this.id=e,this.event=t,this.parent,this._groupId="",this._isGroupNode=!1}isGroupNode(){return this._isGroupNode}hasChildren(){throw"Not implemented"}children(){throw"Not implemented"}searchTree(e,t){t=t||[],this.event&&e(this.event)&&t.push(this);for(const i of this.children().values())i.searchTree(e,t);return t}}export class TopDownNode extends Node{constructor(e,t,i){super(e,t),this._root=i&&i._root,this._hasChildren=!1,this._children=null,this.parent=i}hasChildren(){return this._hasChildren}children(){return this._children||this._buildChildren()}_buildChildren(){const e=[];for(let t=this;t.parent&&!t._isGroupNode;t=t.parent)e.push(t);e.reverse();const t=new Map,i=this,r=this._root,n=r._startTime,s=r._endTime,o=r._doNotAggregate?function(t){++d,a===e.length&&d<=e.length+2&&p(t,0);--d}:void 0,h=r._doNotAggregate?void 0:_eventId,l=r._eventGroupIdCallback;let d=0,a=0,c=null;function p(r,n){if(d===e.length+2)return c._hasChildren=!0,void(c.selfTime-=n);let s,o="";h?(s=h(r),o=l?l(r):"",o&&(s+="/"+o)):s=Symbol("uniqueId");let a=t.get(s);a||(a=new TopDownNode(s,r,i),a._groupId=o,t.set(s,a)),a.selfTime+=n,a.totalTime+=n,c=a}return TimelineModelImpl.forEachEvent(r._events,(function(t){if(++d,d>e.length+2)return;if(!function(t){if(a===e.length)return!0;if(a!==d-1)return!1;if(!t.endTime)return!1;if(!h)return t===e[a].event&&++a,!1;let i=h(t);const r=l?l(t):"";r&&(i+="/"+r);i===e[a].id&&++a;return!1}(t))return;const i=Math.min(s,t.endTime)-Math.max(n,t.startTime);i<0&&console.error("Negative event duration");p(t,i)}),(function(e){--d,a>d&&(a=d)}),o,n,s,r._filter),this._children=t,t}}export class TopDownRootNode extends TopDownNode{constructor(e,t,i,r,n,s){super("",null,null),this._root=this,this._events=e,this._filter=e=>t.every(t=>t.accept(e)),this._startTime=i,this._endTime=r,this._eventGroupIdCallback=s,this._doNotAggregate=n,this.totalTime=r-i,this.selfTime=this.totalTime}children(){return this._children||this._grouppedTopNodes()}_grouppedTopNodes(){const e=super.children();for(const t of e.values())this.selfTime-=t.totalTime;if(!this._eventGroupIdCallback)return e;const t=new Map;for(const i of e.values()){const e=this._eventGroupIdCallback(i.event);let r=t.get(e);r||(r=new GroupNode(e,this,i.event),t.set(e,r)),r.addChild(i,i.selfTime,i.totalTime)}return this._children=t,t}}export class BottomUpRootNode extends Node{constructor(e,t,i,r,n,s){super("",null),this._children=null,this._events=e,this._textFilter=t,this._filter=e=>i.every(t=>t.accept(e)),this._startTime=r,this._endTime=n,this._eventGroupIdCallback=s,this.totalTime=n-r}hasChildren(){return!0}_filterChildren(e){for(const[t,i]of e)i.event&&!this._textFilter.accept(i.event)&&e.delete(t);return e}children(){return this._children||(this._children=this._filterChildren(this._grouppedTopNodes())),this._children}_ungrouppedTopNodes(){const e=this,t=this._startTime,i=this._endTime,r=new Map,n=[i-t],s=[],o=new Map;TimelineModelImpl.forEachEvent(this._events,(function(e){const r=Math.min(e.endTime,i)-Math.max(e.startTime,t);n[n.length-1]-=r,n.push(r);const h=_eventId(e),l=!o.has(h);l&&o.set(h,r);s.push(l)}),(function(t){const i=_eventId(t);let h=r.get(i);h||(h=new BottomUpNode(e,i,t,!1,e),r.set(i,h));h.selfTime+=n.pop(),s.pop()&&(h.totalTime+=o.get(i),o.delete(i));s.length&&h.setHasChildren()}),void 0,t,i,this._filter),this.selfTime=n.pop();for(const e of r)e[1].selfTime<=0&&r.delete(e[0]);return r}_grouppedTopNodes(){const e=this._ungrouppedTopNodes();if(!this._eventGroupIdCallback)return e;const t=new Map;for(const i of e.values()){const e=this._eventGroupIdCallback(i.event);let r=t.get(e);r||(r=new GroupNode(e,this,i.event),t.set(e,r)),r.addChild(i,i.selfTime,i.selfTime)}return t}}export class GroupNode extends Node{constructor(e,t,i){super(e,i),this._children=new Map,this.parent=t,this._isGroupNode=!0}addChild(e,t,i){this._children.set(e.id,e),this.selfTime+=t,this.totalTime+=i,e.parent=this}hasChildren(){return!0}children(){return this._children}}export class BottomUpNode extends Node{constructor(e,t,i,r,n){super(t,i),this.parent=n,this._root=e,this._depth=(n._depth||0)+1,this._cachedChildren=null,this._hasChildren=r}setHasChildren(){this._hasChildren=!0}hasChildren(){return this._hasChildren}children(){if(this._cachedChildren)return this._cachedChildren;const e=[0],t=[],i=[],r=new Map,n=this._root._startTime,s=this._root._endTime;let o=n;const h=this;return TimelineModelImpl.forEachEvent(this._root._events,(function(r){const o=Math.min(r.endTime,s)-Math.max(r.startTime,n);o<0&&console.assert(!1,"Negative duration of an event");e[e.length-1]-=o,e.push(o);const h=_eventId(r);t.push(h),i.push(r)}),(function(n){const l=e.pop(),d=t.pop();let a;for(i.pop(),a=h;a._depth>1;a=a.parent)if(a.id!==t[t.length+1-a._depth])return;if(a.id!==d||t.length<h._depth)return;const c=t[t.length-h._depth];if(a=r.get(c),!a){const e=i[i.length-h._depth],t=i.length>h._depth;a=new BottomUpNode(h._root,c,e,t,h),r.set(c,a)}const p=Math.min(n.endTime,s)-Math.max(n.startTime,o);a.selfTime+=l,a.totalTime+=p,o=Math.min(n.endTime,s)}),void 0,n,s,this._root._filter),this._cachedChildren=this._root._filterChildren(r),this._cachedChildren}searchTree(e,t){return t=t||[],this.event&&e(this.event)&&t.push(this),t}}export function eventURL(e){const t=e.args.data||e.args.beginData;if(t&&t.url)return t.url;let i=eventStackFrame(e);for(;i;){const e=i.url;if(e)return e;i=i.parent}return null}export function eventStackFrame(e){return e.name===RecordType.JSFrame?e.args.data||null:TimelineData.forEvent(e).topFrame()}export function _eventId(e){if(e.name===RecordType.TimeStamp)return`${e.name}:${e.args.data.message}`;if(e.name!==RecordType.JSFrame)return e.name;const t=e.args.data,i=t.scriptId||t.url||"",r=t.functionName;return`f:${TimelineJSProfileProcessor.isNativeRuntimeFrame(t)?TimelineJSProfileProcessor.nativeGroup(r)||r:`${r}:${t.lineNumber}:${t.columnNumber}`}@${i}`}export let ChildrenCache;