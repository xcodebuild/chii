import*as Common from"../common/common.js";import{EventPayload}from"./TracingManager.js";export class TracingModel{constructor(e){this._backingStorage=e,this._firstWritePending=!0,this._processById=new Map,this._processByName=new Map,this._minimumRecordTime=0,this._maximumRecordTime=0,this._devToolsMetadataEvents=[],this._asyncEvents=[],this._openAsyncEvents=new Map,this._openNestableAsyncEvents=new Map,this._profileGroups=new Map,this._parsedCategories=new Map}static isNestableAsyncPhase(e){return"b"===e||"e"===e||"n"===e}static isAsyncBeginPhase(e){return"S"===e||"b"===e}static isAsyncPhase(e){return TracingModel.isNestableAsyncPhase(e)||"S"===e||"T"===e||"F"===e||"p"===e}static isFlowPhase(e){return"s"===e||"t"===e||"f"===e}static isTopLevelEvent(e){return e.hasCategory(DevToolsTimelineEventCategory)&&"RunTask"===e.name||e.hasCategory(LegacyTopLevelEventCategory)||e.hasCategory(DevToolsMetadataEventCategory)&&"Program"===e.name}static _extractId(e){const t=e.scope||"";if(void 0===e.id2)return t&&e.id?`${t}@${e.id}`:e.id;const s=e.id2;if("object"==typeof s&&"global"in s!="local"in s)return void 0!==s.global?`:${t}:${s.global}`:`:${t}:${e.pid}:${s.local}`;console.error(`Unexpected id2 field at ${e.ts/1e3}, one and only one of 'local' and 'global' should be present.`)}static browserMainThread(e){const t=e.sortedProcesses();if(!t.length)return null;const s=[],n=[];for(const e of t)e.name().toLowerCase().endsWith("browser")&&s.push(e),n.push(...e.sortedThreads().filter(e=>"CrBrowserMain"===e.name()));if(1===n.length)return n[0];if(1===s.length)return s[0].threadByName("CrBrowserMain");const a=e.devToolsMetadataEvents().filter(e=>"TracingStartedInBrowser"===e.name);return 1===a.length?a[0].thread:(Common.Console.Console.instance().error("Failed to find browser main thread in trace, some timeline features may be unavailable"),null)}devToolsMetadataEvents(){return this._devToolsMetadataEvents}addEvents(e){for(let t=0;t<e.length;++t)this._addEvent(e[t])}tracingComplete(){this._processPendingAsyncEvents(),this._backingStorage.appendString(this._firstWritePending?"[]":"]"),this._backingStorage.finishWriting(),this._firstWritePending=!1;for(const e of this._processById.values())for(const t of e._threads.values())t.tracingComplete()}dispose(){this._firstWritePending||this._backingStorage.reset()}adjustTime(e){this._minimumRecordTime+=e,this._maximumRecordTime+=e;for(const t of this._processById.values())for(const s of t._threads.values()){for(const t of s.events())t.startTime+=e,"number"==typeof t.endTime&&(t.endTime+=e);for(const t of s.asyncEvents())t.startTime+=e,"number"==typeof t.endTime&&(t.endTime+=e)}}_addEvent(e){let t=this._processById.get(e.pid);t||(t=new Process(this,e.pid),this._processById.set(e.pid,t));const s=Phase;this._backingStorage.appendString(this._firstWritePending?"[":",\n"),this._firstWritePending=!1;const n=JSON.stringify(e);let a=null;e.ph===s.SnapshotObject&&n.length>1e4?a=this._backingStorage.appendAccessibleString(n):this._backingStorage.appendString(n);const r=e.ts/1e3;!r||this._minimumRecordTime&&!(r<this._minimumRecordTime)||e.ph!==s.Begin&&e.ph!==s.Complete&&e.ph!==s.Instant||(this._minimumRecordTime=r);const i=(e.ts+(e.dur||0))/1e3;this._maximumRecordTime=Math.max(this._maximumRecordTime,i);const o=t._addEvent(e);if(o)if(e.ph!==s.Sample){if(TracingModel.isAsyncPhase(e.ph)&&this._asyncEvents.push(o),o._setBackingStorage(a),o.hasCategory(DevToolsMetadataEventCategory)&&this._devToolsMetadataEvents.push(o),e.ph===s.Metadata)switch(e.name){case MetadataEvent.ProcessSortIndex:t._setSortIndex(e.args.sort_index);break;case MetadataEvent.ProcessName:{const s=e.args.name;t._setName(s),this._processByName.set(s,t);break}case MetadataEvent.ThreadSortIndex:t.threadById(e.tid)._setSortIndex(e.args.sort_index);break;case MetadataEvent.ThreadName:t.threadById(e.tid)._setName(e.args.name)}}else this._addSampleEvent(o)}_addSampleEvent(e){const t=`${e.thread.process().id()}:${e.id}`,s=this._profileGroups.get(t);s?s._addChild(e):this._profileGroups.set(t,new ProfileEventsGroup(e))}profileGroup(e){return this._profileGroups.get(`${e.thread.process().id()}:${e.id}`)||null}minimumRecordTime(){return this._minimumRecordTime}maximumRecordTime(){return this._maximumRecordTime}sortedProcesses(){return NamedObject._sort([...this._processById.values()])}processByName(e){return this._processByName.get(e)}processById(e){return this._processById.get(e)||null}threadByName(e,t){const s=this.processByName(e);return s&&s.threadByName(t)}extractEventsFromThreadByName(e,t,s){const n=this.threadByName(e,t);return n?n.removeEventsByName(s):[]}_processPendingAsyncEvents(){this._asyncEvents.sort(Event.compareStartTime);for(let e=0;e<this._asyncEvents.length;++e){const t=this._asyncEvents[e];TracingModel.isNestableAsyncPhase(t.phase)?this._addNestableAsyncEvent(t):this._addAsyncEvent(t)}this._asyncEvents=[],this._closeOpenAsyncEvents()}_closeOpenAsyncEvents(){for(const e of this._openAsyncEvents.values())e.setEndTime(this._maximumRecordTime),e.steps[0].setEndTime(this._maximumRecordTime);this._openAsyncEvents.clear();for(const e of this._openNestableAsyncEvents.values())for(;e.length;)e.pop().setEndTime(this._maximumRecordTime);this._openNestableAsyncEvents.clear()}_addNestableAsyncEvent(e){const t=Phase,s=e.categoriesString+"."+e.id;let n=this._openNestableAsyncEvents.get(s);switch(e.phase){case t.NestableAsyncBegin:{n||(n=[],this._openNestableAsyncEvents.set(s,n));const t=new AsyncEvent(e);n.push(t),e.thread._addAsyncEvent(t);break}case t.NestableAsyncInstant:n&&n.length&&n.peekLast()._addStep(e);break;case t.NestableAsyncEnd:{if(!n||!n.length)break;const t=n.pop();if(t.name!==e.name){console.error(`Begin/end event mismatch for nestable async event, ${t.name} vs. ${e.name}, key: ${s}`);break}t._addStep(e)}}}_addAsyncEvent(e){const t=Phase,s=e.categoriesString+"."+e.name+"."+e.id;let n=this._openAsyncEvents.get(s);if(e.phase===t.AsyncBegin)return n?void console.error(`Event ${e.name} has already been started`):(n=new AsyncEvent(e),this._openAsyncEvents.set(s,n),void e.thread._addAsyncEvent(n));if(n){if(e.phase===t.AsyncEnd)return n._addStep(e),void this._openAsyncEvents.delete(s);if(e.phase===t.AsyncStepInto||e.phase===t.AsyncStepPast){const s=n.steps.peekLast();return s.phase!==t.AsyncBegin&&s.phase!==e.phase?void console.assert(!1,"Async event step phase mismatch: "+s.phase+" at "+s.startTime+" vs. "+e.phase+" at "+e.startTime):void n._addStep(e)}console.assert(!1,"Invalid async event phase")}}backingStorage(){return this._backingStorage}_parsedCategoriesForString(e){let t=this._parsedCategories.get(e);return t||(t=new Set(e?e.split(","):[]),this._parsedCategories.set(e,t)),t}}export const Phase={Begin:"B",End:"E",Complete:"X",Instant:"I",AsyncBegin:"S",AsyncStepInto:"T",AsyncStepPast:"p",AsyncEnd:"F",NestableAsyncBegin:"b",NestableAsyncEnd:"e",NestableAsyncInstant:"n",FlowBegin:"s",FlowStep:"t",FlowEnd:"f",Metadata:"M",Counter:"C",Sample:"P",CreateObject:"N",SnapshotObject:"O",DeleteObject:"D"};export const MetadataEvent={ProcessSortIndex:"process_sort_index",ProcessName:"process_name",ThreadSortIndex:"thread_sort_index",ThreadName:"thread_name"};export const LegacyTopLevelEventCategory="toplevel";export const DevToolsMetadataEventCategory="disabled-by-default-devtools.timeline";export const DevToolsTimelineEventCategory="disabled-by-default-devtools.timeline";export class BackingStorage{appendString(e){}appendAccessibleString(e){}finishWriting(){}reset(){}}export class Event{constructor(e,t,s,n,a){this.categoriesString=e||"",this._parsedCategories=a._model._parsedCategoriesForString(this.categoriesString),this.name=t,this.phase=s,this.startTime=n,this.thread=a,this.args={},this.selfTime=0}static fromPayload(e,t){const s=new Event(e.cat,e.name,e.ph,e.ts/1e3,t);e.args&&s.addArgs(e.args),"number"==typeof e.dur&&s.setEndTime((e.ts+e.dur)/1e3);const n=TracingModel._extractId(e);return void 0!==n&&(s.id=n),e.bind_id&&(s.bind_id=e.bind_id),s}static compareStartTime(e,t){return e&&t?e.startTime-t.startTime:0}static orderedCompareStartTime(e,t){return e.startTime-t.startTime||e.ordinal-t.ordinal||-1}hasCategory(e){return this._parsedCategories.has(e)}setEndTime(e){e<this.startTime?console.assert(!1,"Event out of order: "+this.name):(this.endTime=e,this.duration=e-this.startTime)}addArgs(e){for(const t in e)t in this.args&&console.error("Same argument name ("+t+") is used for begin and end phases of "+this.name),this.args[t]=e[t]}_complete(e){e.args?this.addArgs(e.args):console.error("Missing mandatory event argument 'args' at "+e.startTime),this.setEndTime(e.startTime)}_setBackingStorage(e){}}export class ObjectSnapshot extends Event{constructor(e,t,s,n){super(e,t,Phase.SnapshotObject,s,n),this._backingStorage=null,this.id,this._objectPromise=null}static fromPayload(e,t){const s=new ObjectSnapshot(e.cat,e.name,e.ts/1e3,t),n=TracingModel._extractId(e);return void 0!==n&&(s.id=n),e.args&&e.args.snapshot?(e.args&&s.addArgs(e.args),s):(console.error("Missing mandatory 'snapshot' argument at "+e.ts/1e3),s)}requestObject(e){const t=this.args.snapshot;t?e(t):this._backingStorage().then((function(t){if(!t)return void e(null);try{const s=JSON.parse(t);e(s.args.snapshot)}catch(t){Common.Console.Console.instance().error("Malformed event data in backing storage"),e(null)}}),e.bind(null,null))}objectPromise(){return this._objectPromise||(this._objectPromise=new Promise(this.requestObject.bind(this))),this._objectPromise}_setBackingStorage(e){e&&(this._backingStorage=e,this.args={})}}export class AsyncEvent extends Event{constructor(e){super(e.categoriesString,e.name,e.phase,e.startTime,e.thread),this.addArgs(e.args),this.steps=[e]}_addStep(e){this.steps.push(e),e.phase!==Phase.AsyncEnd&&e.phase!==Phase.NestableAsyncEnd||(this.setEndTime(e.startTime),this.steps[0].setEndTime(e.startTime))}}class ProfileEventsGroup{constructor(e){this.children=[e]}_addChild(e){this.children.push(e)}}class NamedObject{constructor(e,t){this._model=e,this._id=t,this._name="",this._sortIndex=0}static _sort(e){return e.sort((function(e,t){return e._sortIndex!==t._sortIndex?e._sortIndex-t._sortIndex:e.name().localeCompare(t.name())}))}_setName(e){this._name=e}name(){return this._name}_setSortIndex(e){this._sortIndex=e}}export class Process extends NamedObject{constructor(e,t){super(e,t),this._threads=new Map,this._threadByName=new Map}id(){return this._id}threadById(e){let t=this._threads.get(e);return t||(t=new Thread(this,e),this._threads.set(e,t)),t}threadByName(e){return this._threadByName.get(e)||null}_setThreadByName(e,t){this._threadByName.set(e,t)}_addEvent(e){return this.threadById(e.tid)._addEvent(e)}sortedThreads(){return NamedObject._sort([...this._threads.values()])}}export class Thread extends NamedObject{constructor(e,t){super(e._model,t),this._process=e,this._events=[],this._asyncEvents=[],this._lastTopLevelEvent=null}tracingComplete(){this._asyncEvents.sort(Event.compareStartTime),this._events.sort(Event.compareStartTime);const e=Phase,t=[];for(let s=0;s<this._events.length;++s){const n=this._events[s];switch(n.ordinal=s,n.phase){case e.End:{if(this._events[s]=null,!t.length)continue;const e=t.pop();e.name!==n.name||e.categoriesString!==n.categoriesString?console.error("B/E events mismatch at "+e.startTime+" ("+e.name+") vs. "+n.startTime+" ("+n.name+")"):e._complete(n);break}case e.Begin:t.push(n)}}for(;t.length;)t.pop().setEndTime(this._model.maximumRecordTime());this._events=this._events.filter(e=>null!==e)}_addEvent(e){const t=e.ph===Phase.SnapshotObject?ObjectSnapshot.fromPayload(e,this):Event.fromPayload(e,this);if(TracingModel.isTopLevelEvent(t)){if(this._lastTopLevelEvent&&this._lastTopLevelEvent.endTime>t.startTime)return null;this._lastTopLevelEvent=t}return this._events.push(t),t}_addAsyncEvent(e){this._asyncEvents.push(e)}_setName(e){super._setName(e),this._process._setThreadByName(e,this)}id(){return this._id}process(){return this._process}events(){return this._events}asyncEvents(){return this._asyncEvents}removeEventsByName(e){const t=[];return this._events=this._events.filter(s=>!!s&&(s.name!==e||(t.push(s),!1))),t}}