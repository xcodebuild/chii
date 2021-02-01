import*as SDK from"../sdk/sdk.js";export class SecurityModel extends SDK.SDKModel.SDKModel{constructor(e){super(e),this._dispatcher=new SecurityDispatcher(this),this._securityAgent=e.securityAgent(),e.registerSecurityDispatcher(this._dispatcher),this._securityAgent.enable()}resourceTreeModel(){return this.target().model(SDK.ResourceTreeModel.ResourceTreeModel)}networkManager(){return this.target().model(SDK.NetworkManager.NetworkManager)}static SecurityStateComparator(e,t){let i;if(SecurityModel._symbolicToNumericSecurityState)i=SecurityModel._symbolicToNumericSecurityState;else{i=new Map;const e=[Protocol.Security.SecurityState.Info,Protocol.Security.SecurityState.InsecureBroken,Protocol.Security.SecurityState.Insecure,Protocol.Security.SecurityState.Neutral,Protocol.Security.SecurityState.Secure,Protocol.Security.SecurityState.Unknown];for(let t=0;t<e.length;t++)i.set(e[t],t+1);SecurityModel._symbolicToNumericSecurityState=i}return(i.get(e)||0)-(i.get(t)||0)}}SDK.SDKModel.SDKModel.register(SecurityModel,SDK.SDKModel.Capability.Security,!1);export const Events={SecurityStateChanged:Symbol("SecurityStateChanged"),VisibleSecurityStateChanged:Symbol("VisibleSecurityStateChanged")};export const SummaryMessages={[Protocol.Security.SecurityState.Unknown]:ls`The security of this page is unknown.`,[Protocol.Security.SecurityState.Insecure]:ls`This page is not secure.`,[Protocol.Security.SecurityState.Neutral]:ls`This page is not secure.`,[Protocol.Security.SecurityState.Secure]:ls`This page is secure (valid HTTPS).`,[Protocol.Security.SecurityState.InsecureBroken]:ls`This page is not secure (broken HTTPS).`};export class PageSecurityState{constructor(e,t,i){this.securityState=e,this.explanations=t,this.summary=i}}export class PageVisibleSecurityState{constructor(e,t,i,r){this.securityState=e,this.certificateSecurityState=t?new CertificateSecurityState(t):null,this.safetyTipInfo=i?new SafetyTipInfo(i):null,this.securityStateIssueIds=r}}export class CertificateSecurityState{constructor(e){this.protocol=e.protocol,this.keyExchange=e.keyExchange,this.keyExchangeGroup=e.keyExchangeGroup||null,this.cipher=e.cipher,this.mac=e.mac||null,this.certificate=e.certificate,this.subjectName=e.subjectName,this.issuer=e.issuer,this.validFrom=e.validFrom,this.validTo=e.validTo,this.certificateNetworkError=e.certificateNetworkError||null,this.certificateHasWeakSignature=e.certificateHasWeakSignature,this.certificateHasSha1Signature=e.certificateHasSha1Signature,this.modernSSL=e.modernSSL,this.obsoleteSslProtocol=e.obsoleteSslProtocol,this.obsoleteSslKeyExchange=e.obsoleteSslKeyExchange,this.obsoleteSslCipher=e.obsoleteSslCipher,this.obsoleteSslSignature=e.obsoleteSslSignature}isCertificateExpiringSoon(){const e=new Date(1e3*this.validTo);return e<new Date(Date.now()).setHours(48)&&e>Date.now()}getKeyExchangeName(){return this.keyExchangeGroup?this.keyExchange?ls`${this.keyExchange} with ${this.keyExchangeGroup}`:this.keyExchangeGroup:this.keyExchange}getCipherFullName(){return this.mac?ls`${this.cipher} with ${this.mac}`:this.cipher}}class SafetyTipInfo{constructor(e){this.safetyTipStatus=e.safetyTipStatus,this.safeUrl=e.safeUrl||null}}export class SecurityStyleExplanation{constructor(e,t,i,r,s=[],c=Protocol.Security.MixedContentType.None,o=[]){this.securityState=e,this.title=t,this.summary=i,this.description=r,this.certificate=s,this.mixedContentType=c,this.recommendations=o}}class SecurityDispatcher{constructor(e){this._model=e}securityStateChanged(e,t,i,r,s){const c=new PageSecurityState(e,i,s||null);this._model.dispatchEventToListeners(Events.SecurityStateChanged,c)}visibleSecurityStateChanged(e){const t=new PageVisibleSecurityState(e.securityState,e.certificateSecurityState||null,e.safetyTipInfo||null,e.securityStateIssueIds);this._model.dispatchEventToListeners(Events.VisibleSecurityStateChanged,t)}certificateError(e,t,i){}}