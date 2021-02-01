import*as Common from"../common/common.js";import{InspectorFrontendHostInstance}from"./InspectorFrontendHost.js";export class UserMetrics{constructor(){this._panelChangedSinceLaunch=!1,this._firedLaunchHistogram=!1,this._launchPanelName=""}panelShown(e){const o=PanelCodes[e]||0,t=Object.keys(PanelCodes).length+1;InspectorFrontendHostInstance.recordEnumeratedHistogram("DevTools.PanelShown",o,t),Common.EventTarget.fireEvent("DevTools.PanelShown",{value:o}),this._panelChangedSinceLaunch=!0}drawerShown(e){this.panelShown("drawer-"+e)}settingsPanelShown(e){this.panelShown("settings-"+e)}actionTaken(e){const o=Object.keys(Action).length+1;InspectorFrontendHostInstance.recordEnumeratedHistogram("DevTools.ActionTaken",e,o),Common.EventTarget.fireEvent("DevTools.ActionTaken",{value:e})}panelLoaded(e,o){this._firedLaunchHistogram||e!==this._launchPanelName||(this._firedLaunchHistogram=!0,requestAnimationFrame(()=>{setTimeout(()=>{performance.mark(o),this._panelChangedSinceLaunch||(InspectorFrontendHostInstance.recordPerformanceHistogram(o,performance.now()),Common.EventTarget.fireEvent("DevTools.PanelLoaded",{value:{panelName:e,histogramName:o}}))},0)}))}setLaunchPanel(e){this._launchPanelName=e}keyboardShortcutFired(e){const o=Object.keys(KeyboardShortcutAction).length+1,t=KeyboardShortcutAction[e]||KeyboardShortcutAction.OtherShortcut;InspectorFrontendHostInstance.recordEnumeratedHistogram("DevTools.KeyboardShortcutFired",t,o),Common.EventTarget.fireEvent("DevTools.KeyboardShortcutFired",{value:t})}}export const Action={WindowDocked:1,WindowUndocked:2,ScriptsBreakpointSet:3,TimelineStarted:4,ProfilesCPUProfileTaken:5,ProfilesHeapProfileTaken:6,"LegacyAuditsStarted-deprecated":7,ConsoleEvaluated:8,FileSavedInWorkspace:9,DeviceModeEnabled:10,AnimationsPlaybackRateChanged:11,RevisionApplied:12,FileSystemDirectoryContentReceived:13,StyleRuleEdited:14,CommandEvaluatedInConsolePanel:15,DOMPropertiesExpanded:16,ResizedViewInResponsiveMode:17,TimelinePageReloadStarted:18,ConnectToNodeJSFromFrontend:19,ConnectToNodeJSDirectly:20,CpuThrottlingEnabled:21,CpuProfileNodeFocused:22,CpuProfileNodeExcluded:23,SelectFileFromFilePicker:24,SelectCommandFromCommandMenu:25,ChangeInspectedNodeInElementsPanel:26,StyleRuleCopied:27,CoverageStarted:28,LighthouseStarted:29,LighthouseFinished:30,ShowedThirdPartyBadges:31,LighthouseViewTrace:32,FilmStripStartedRecording:33,CoverageReportFiltered:34,CoverageStartedPerBlock:35,SettingsOpenedFromGear:36,SettingsOpenedFromMenu:37,SettingsOpenedFromCommandMenu:38};export const PanelCodes={elements:1,resources:2,network:3,sources:4,timeline:5,heap_profiler:6,"legacy-audits-deprecated":7,console:8,layers:9,"drawer-console-view":10,"drawer-animations":11,"drawer-network.config":12,"drawer-rendering":13,"drawer-sensors":14,"drawer-sources.search":15,security:16,js_profiler:17,lighthouse:18,"drawer-coverage":19,"drawer-protocol-monitor":20,"drawer-remote-devices":21,"drawer-web-audio":22,"drawer-changes.changes":23,"drawer-performance.monitor":24,"drawer-release-note":25,"drawer-live_heap_profile":26,"drawer-sources.quick":27,"drawer-network.blocked-urls":28,"settings-preferences":29,"settings-workspace":30,"settings-experiments":31,"settings-blackbox":32,"settings-devices":33,"settings-throttling-conditions":34,"settings-emulation-geolocations":35,"settings-shortcuts":36,"drawer-issues-pane":37};export const KeyboardShortcutAction={OtherShortcut:0,"commandMenu.show":1,"console.clear":2,"console.show":3,"debugger.step":4,"debugger.step-into":5,"debugger.step-out":6,"debugger.step-over":7,"debugger.toggle-breakpoint":8,"debugger.toggle-breakpoint-enabled":9,"debugger.toggle-pause":10,"elements.edit-as-html":11,"elements.hide-element":12,"elements.redo":13,"elements.toggle-element-search":14,"elements.undo":15,"main.search-in-panel.find":16,"main.toggle-drawer":17,"network.hide-request-details":18,"network.search":19,"network.toggle-recording":20,"quickOpen.show":21,"settings.show":22,"sources.search":23};