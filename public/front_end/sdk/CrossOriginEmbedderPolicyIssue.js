import{ls}from"../common/common.js";import{Issue,IssueCategory,IssueDescription,IssueKind}from"./Issue.js";function toCamelCase(e){return e.replace(/-\p{ASCII}/gu,e=>e.substr(1).toUpperCase()).replace(/^./,e=>e.toUpperCase())}export class CrossOriginEmbedderPolicyIssue extends Issue{constructor(e,s){super("CrossOriginEmbedderPolicy::"+toCamelCase(e)),this._affectedRequest={requestId:s}}requests(){return[this._affectedRequest]}getCategory(){return IssueCategory.CrossOriginEmbedderPolicy}getDescription(){const e=issueDescriptions.get(this.code());return e||null}}function CorpNotSameOriginAfterDefaultedToSameOriginByCoepMessage(){const e=createElementWithClass("div","message");e.textContent=ls`The resource is not a same-origin resource, and the response headers for the resource did not specify any cross-origin resource policy.
     The cross-origin resource policy was defaulted to same-origin, because the resource was used in a context that enables the cross-origin embedder policy.
     To use this resource from a different origin, the server needs to specify a cross-origin resource policy in the response headers:`;const s=createElementWithClass("div","example");s.createChild("code").textContent="Cross-Origin-Resource-Policy: same-site",s.createChild("span","comment").textContent=ls`Choose this option if the resource and the document are served from the same site.`,e.appendChild(s);const o=createElementWithClass("div","example");return o.createChild("code").textContent="Cross-Origin-Resource-Policy: cross-origin",o.createChild("span","comment").textContent=ls`Only choose this option if an arbitrary website including this resource does not impose a security risk.`,e.appendChild(o),e}function CoepFrameResourceNeedsCoepHeaderMessage(){const e=createElementWithClass("div","message");e.textContent=ls`An iframe was emdbedded on a site which enables the cross-origin embedder policy, but the response headers for the document of the iframe did not specify a cross-origin embedder policy, which causes the iframe to get blocked.
  To allow embedding of the iframe, the response needs to enable the cross-origin embedder policy for the iframe by specifying the following response header:`;const s=createElementWithClass("div","example");return s.createChild("code").textContent="Cross-Origin-Embedder-Policy: require-corp",e.appendChild(s),e}function CorpNotSameSiteMessage(){const e=createElementWithClass("div","message");e.textContent=ls`The resource was loaded in a context that is not same-site and that enables the cross-origin embedder policy. The resource specified a cross-origin resource policy that allows only same-site usage, and was hence blocked.
  To allow usage of the resource from a different site, the server may relax the cross-origin resource policy response header:`;const s=createElementWithClass("div","example");return s.createChild("code").textContent="Cross-Origin-Resource-Policy: cross-origin",s.createChild("span","comment").textContent=ls`Only choose this option if an arbitrary website including this resource does not impose a security risk.`,e.appendChild(s),e}function CorpNotSameOriginMessage(){const e=createElementWithClass("div","message");e.textContent=ls`The resource was loaded in a context that is not same-origin and that enables the cross-origin embedder policy. The resource specified a cross-origin resource policy that allows only same-origin usage, and was hence blocked.
  To use this resource from a different origin, the server may relax the cross-origin resource policy response header:`;const s=createElementWithClass("div","example");s.createChild("code").textContent="Cross-Origin-Resource-Policy: same-site",s.createChild("span","comment").textContent=ls`Choose this option if the resource and the document are served from the same site.`,e.appendChild(s);const o=createElementWithClass("div","example");return o.createChild("code").textContent="Cross-Origin-Resource-Policy: cross-origin",o.createChild("span","comment").textContent=ls`Only choose this option if an arbitrary website including this resource does not impose a security risk.`,e.appendChild(o),e}function textOnlyMessage(e){const s=createElementWithClass("div","message");return s.textContent=e,s}const issueDescriptions=new Map([["CrossOriginEmbedderPolicy::CorpNotSameOriginAfterDefaultedToSameOriginByCoep",{title:ls`A resource was blocked because it is missing a cross-origin resource policy`,message:CorpNotSameOriginAfterDefaultedToSameOriginByCoepMessage,issueKind:IssueKind.BreakingChange,link:ls`https://web.dev/coop-coep/`,linkTitle:ls`Enable powerful features with COOP and COEP`}],["CrossOriginEmbedderPolicy::CoepFrameResourceNeedsCoepHeader",{title:ls`An iframe was blocked because it did not specify a cross-origin embedder policy`,message:CoepFrameResourceNeedsCoepHeaderMessage,issueKind:IssueKind.BreakingChange,link:ls`https://web.dev/coop-coep/`,linkTitle:ls`Enable powerful features with COOP and COEP`}],["CrossOriginEmbedderPolicy::CoopSandboxedIframeCannotNavigateToCoopPage",{title:ls`An iframe navigation to a document with a cross-origin opener policy was blocked`,message:()=>textOnlyMessage(ls`A document was blocked from loading in an iframe with a sandbox attribute because the document specified a cross-origin opener policy.`),issueKind:IssueKind.BreakingChange,link:ls`https://web.dev/coop-coep/`,linkTitle:ls`Enable powerful features with COOP and COEP`}],["CrossOriginEmbedderPolicy::CorpNotSameSite",{title:ls`A resource was blocked because its cross-origin resource policy only allows same-site usage`,message:CorpNotSameSiteMessage,issueKind:IssueKind.BreakingChange,link:ls`https://web.dev/coop-coep/`,linkTitle:ls`Enable powerful features with COOP and COEP`}],["CrossOriginEmbedderPolicy::CorpNotSameOrigin",{title:ls`A resource was blocked because its cross-origin resource policy only allows same-origin usage`,message:CorpNotSameOriginMessage,issueKind:IssueKind.BreakingChange,link:ls`https://web.dev/coop-coep/`,linkTitle:ls`Enable powerful features with COOP and COEP`}]]);