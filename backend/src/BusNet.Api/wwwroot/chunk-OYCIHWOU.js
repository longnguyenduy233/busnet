import{$ as nr,Aa as or,B as Ye,Ba as K,Bb as zt,Ca as Nt,Da as xe,Dc as $t,E as Zn,Ea as sr,Ec as Tr,F as Xe,Fa as kt,G as Yn,Ga as Lt,Gc as Ir,Hc as ge,Ia as z,Ic as Mr,J as qe,Ja as Pt,Ka as ar,Kc as Sr,L as Xn,La as Q,Ma as cr,Na as se,Nb as wr,Oa as ur,Ob as Ar,Pa as ae,Pb as fe,Qa as Qe,R as qn,Ra as ce,S as Jn,Sa as ue,Ta as dr,Ua as lr,V as Je,Va as fr,W as Qn,Wa as mr,X as er,Xa as hr,Y as oe,Ya as pr,Yb as rt,Za as gr,Zb as me,_ as tr,_a as $,a as Vn,aa as D,bb as de,c as P,cb as br,da as d,db as et,e as T,ea as I,eb as yr,f as ie,ga as l,gb as le,ha as h,hb as Bt,hc as he,i as Hn,ia as a,ib as jt,ic as Cr,ja as Se,jb as vr,ka as Ft,l as Gn,ma as rr,n as Me,na as Re,nb as B,oa as ir,ob as M,pb as j,qb as _r,sb as tt,t as x,ta as A,u as Wn,ua as y,uc as pe,va as Fe,vb as nt,vc as it,wb as Dr,x as Kn,xa as xt,xb as Er,ya as E,za as Ot,zb as Ut}from"./chunk-F7T5WLQZ.js";import{a as b,b as W}from"./chunk-MSLIVQHW.js";var Rr=null;function V(){return Rr}function Vt(t){Rr??=t}var Oe=class{},be=(()=>{class t{historyGo(e){throw new Error("")}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:()=>a(Fr),providedIn:"platform"})}return t})();var Fr=(()=>{class t extends be{_location;_history;_doc=a(y);constructor(){super(),this._location=window.location,this._history=window.history}getBaseHrefFromDOM(){return V().getBaseHref(this._doc)}onPopState(e){let n=V().getGlobalEventTarget(this._doc,"window");return n.addEventListener("popstate",e,!1),()=>n.removeEventListener("popstate",e)}onHashChange(e){let n=V().getGlobalEventTarget(this._doc,"window");return n.addEventListener("hashchange",e,!1),()=>n.removeEventListener("hashchange",e)}get href(){return this._location.href}get protocol(){return this._location.protocol}get hostname(){return this._location.hostname}get port(){return this._location.port}get pathname(){return this._location.pathname}get search(){return this._location.search}get hash(){return this._location.hash}set pathname(e){this._location.pathname=e}pushState(e,n,i){this._history.pushState(e,n,i)}replaceState(e,n,i){this._history.replaceState(e,n,i)}forward(){this._history.forward()}back(){this._history.back()}historyGo(e=0){this._history.go(e)}getState(){return this._history.state}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:()=>new t,providedIn:"platform"})}return t})();function Nr(t,r){return t?r?t.endsWith("/")?r.startsWith("/")?t+r.slice(1):t+r:r.startsWith("/")?t+r:`${t}/${r}`:t:r}function xr(t){let r=t.search(/#|\?|$/);return t[r-1]==="/"?t.slice(0,r-1)+t.slice(r):t}function Z(t){return t&&t[0]!=="?"?`?${t}`:t}var ot=(()=>{class t{historyGo(e){throw new Error("")}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:()=>a(lo),providedIn:"root"})}return t})(),uo=new l(""),lo=(()=>{class t extends ot{_platformLocation;_baseHref;_removeListenerFns=[];constructor(e,n){super(),this._platformLocation=e,this._baseHref=n??this._platformLocation.getBaseHrefFromDOM()??a(y).location?.origin??""}ngOnDestroy(){for(;this._removeListenerFns.length;)this._removeListenerFns.pop()()}onPopState(e){this._removeListenerFns.push(this._platformLocation.onPopState(e),this._platformLocation.onHashChange(e))}getBaseHref(){return this._baseHref}prepareExternalUrl(e){return Nr(this._baseHref,e)}path(e=!1){let n=this._platformLocation.pathname+Z(this._platformLocation.search),i=this._platformLocation.hash;return i&&e?`${n}${i}`:n}pushState(e,n,i,o){let s=this.prepareExternalUrl(i+Z(o));this._platformLocation.pushState(e,n,s)}replaceState(e,n,i,o){let s=this.prepareExternalUrl(i+Z(o));this._platformLocation.replaceState(e,n,s)}forward(){this._platformLocation.forward()}back(){this._platformLocation.back()}getState(){return this._platformLocation.getState()}historyGo(e=0){this._platformLocation.historyGo?.(e)}static \u0275fac=function(n){return new(n||t)(h(be),h(uo,8))};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var kr=(()=>{class t{_subject=new T;_basePath;_locationStrategy;_urlChangeListeners=[];_urlChangeSubscription=null;constructor(e){this._locationStrategy=e;let n=this._locationStrategy.getBaseHref();this._basePath=ho(xr(Or(n))),this._locationStrategy.onPopState(i=>{this._subject.next({url:this.path(!0),pop:!0,state:i.state,type:i.type})})}ngOnDestroy(){this._urlChangeSubscription?.unsubscribe(),this._urlChangeListeners=[]}path(e=!1){return this.normalize(this._locationStrategy.path(e))}getState(){return this._locationStrategy.getState()}isCurrentPathEqualTo(e,n=""){return this.path()==this.normalize(e+Z(n))}normalize(e){return t.stripTrailingSlash(mo(this._basePath,Or(e)))}prepareExternalUrl(e){return e&&e[0]!=="/"&&(e="/"+e),this._locationStrategy.prepareExternalUrl(e)}go(e,n="",i=null){this._locationStrategy.pushState(i,"",e,n),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+Z(n)),i)}replaceState(e,n="",i=null){this._locationStrategy.replaceState(i,"",e,n),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+Z(n)),i)}forward(){this._locationStrategy.forward()}back(){this._locationStrategy.back()}historyGo(e=0){this._locationStrategy.historyGo?.(e)}onUrlChange(e){return this._urlChangeListeners.push(e),this._urlChangeSubscription??=this.subscribe(n=>{this._notifyUrlChangeListeners(n.url,n.state)}),()=>{let n=this._urlChangeListeners.indexOf(e);this._urlChangeListeners.splice(n,1),this._urlChangeListeners.length===0&&(this._urlChangeSubscription?.unsubscribe(),this._urlChangeSubscription=null)}}_notifyUrlChangeListeners(e="",n){this._urlChangeListeners.forEach(i=>i(e,n))}subscribe(e,n,i){return this._subject.subscribe({next:e,error:n??void 0,complete:i??void 0})}static normalizeQueryParams=Z;static joinWithSlash=Nr;static stripTrailingSlash=xr;static \u0275fac=function(n){return new(n||t)(h(ot))};static \u0275prov=d({token:t,factory:()=>fo(),providedIn:"root"})}return t})();function fo(){return new kr(h(ot))}function mo(t,r){if(!t||!r.startsWith(t))return r;let e=r.substring(t.length);return e===""||["/",";","?","#"].includes(e[0])?e:r}function Or(t){return t.replace(/\/index.html$/,"")}function ho(t){if(new RegExp("^(https?:)?//").test(t)){let[,e]=t.split(/\/\/[^\/]+/);return e}return t}var po=(()=>{class t{_viewContainerRef;_viewRef=null;ngTemplateOutletContext=null;ngTemplateOutlet=null;ngTemplateOutletInjector=null;injector=a(A);constructor(e){this._viewContainerRef=e}ngOnChanges(e){if(this._shouldRecreateView(e)){let n=this._viewContainerRef;if(this._viewRef&&n.remove(n.indexOf(this._viewRef)),!this.ngTemplateOutlet){this._viewRef=null;return}let i=this._createContextForwardProxy();this._viewRef=n.createEmbeddedView(this.ngTemplateOutlet,i,{injector:this._getInjector()})}}_getInjector(){return this.ngTemplateOutletInjector==="outlet"?this.injector:this.ngTemplateOutletInjector??void 0}_shouldRecreateView(e){return!!e.ngTemplateOutlet||!!e.ngTemplateOutletInjector}_createContextForwardProxy(){return new Proxy({},{set:(e,n,i)=>this.ngTemplateOutletContext?Reflect.set(this.ngTemplateOutletContext,n,i):!1,get:(e,n,i)=>{if(this.ngTemplateOutletContext)return Reflect.get(this.ngTemplateOutletContext,n,i)}})}static \u0275fac=function(n){return new(n||t)(jt(vr))};static \u0275dir=j({type:t,selectors:[["","ngTemplateOutlet",""]],inputs:{ngTemplateOutletContext:"ngTemplateOutletContext",ngTemplateOutlet:"ngTemplateOutlet",ngTemplateOutletInjector:"ngTemplateOutletInjector"},features:[kt]})}return t})();function go(t,r){return new D(2100,!1)}var Ht=class{createSubscription(r,e,n){return pe(()=>r.subscribe({next:e,error:n}))}dispose(r){pe(()=>r.unsubscribe())}},Gt=class{createSubscription(r,e,n){return r.then(i=>e?.(i),i=>n?.(i)),{unsubscribe:()=>{e=null,n=null}}}dispose(r){r.unsubscribe()}},bo=new Gt,yo=new Ht,vo=(()=>{class t{_ref;_latestValue=null;markForCheckOnValueUpdate=!0;_subscription=null;_obj=null;_strategy=null;applicationErrorHandler=a(or);constructor(e){this._ref=e}ngOnDestroy(){this._subscription&&this._dispose(),this._ref=null}transform(e){if(!this._obj){if(e)try{this.markForCheckOnValueUpdate=!1,this._subscribe(e)}finally{this.markForCheckOnValueUpdate=!0}return this._latestValue}return e!==this._obj?(this._dispose(),this.transform(e)):this._latestValue}_subscribe(e){this._obj=e,this._strategy=this._selectStrategy(e),this._subscription=this._strategy.createSubscription(e,n=>this._updateLatestValue(e,n),n=>this.applicationErrorHandler(n))}_selectStrategy(e){if(Dr(e))return bo;if(Er(e))return yo;throw go(t,e)}_dispose(){this._strategy.dispose(this._subscription),this._latestValue=null,this._subscription=null,this._obj=null}_updateLatestValue(e,n){e===this._obj&&(this._latestValue=n,this.markForCheckOnValueUpdate&&this._ref?.markForCheck())}static \u0275fac=function(n){return new(n||t)(jt(Tr,16))};static \u0275pipe=_r({name:"async",type:t,pure:!1})}return t})();function Ne(t,r){r=encodeURIComponent(r);for(let e of t.split(";")){let n=e.indexOf("="),[i,o]=n==-1?[e,""]:[e.slice(0,n),e.slice(n+1)];if(i.trim()===r)return decodeURIComponent(o)}return null}var ee=class{};var Wt="browser";function Pr(t){return t===Wt}var ke=class{_doc;constructor(r){this._doc=r}manager},st=(()=>{class t extends ke{constructor(e){super(e)}supports(e){return!0}addEventListener(e,n,i,o){return e.addEventListener(n,i,o),()=>this.removeEventListener(e,n,i,o)}removeEventListener(e,n,i,o){return e.removeEventListener(n,i,o)}static \u0275fac=function(n){return new(n||t)(h(y))};static \u0275prov=d({token:t,factory:t.\u0275fac})}return t})(),ut=new l(""),Xt=(()=>{class t{_zone;_plugins;_eventNameToPlugin=new Map;constructor(e,n){this._zone=n,e.forEach(s=>{s.manager=this});let i=e.filter(s=>!(s instanceof st));this._plugins=i.slice().reverse();let o=e.find(s=>s instanceof st);o&&this._plugins.push(o)}addEventListener(e,n,i,o){return this._findPluginFor(n).addEventListener(e,n,i,o)}getZone(){return this._zone}_findPluginFor(e){let n=this._eventNameToPlugin.get(e);if(n)return n;if(n=this._plugins.find(o=>o.supports(e)),!n)throw new D(5101,!1);return this._eventNameToPlugin.set(e,n),n}static \u0275fac=function(n){return new(n||t)(h(ut),h(E))};static \u0275prov=d({token:t,factory:t.\u0275fac})}return t})(),Kt="ng-app-id";function Br(t){for(let r of t)r.remove()}function jr(t,r){let e=r.createElement("style");return e.textContent=t,e}function Eo(t,r,e,n){let i=t.head?.querySelectorAll(`style[${Kt}="${r}"],link[${Kt}="${r}"]`);if(i)for(let o of i)o.removeAttribute(Kt),o instanceof HTMLLinkElement?n.set(o.href.slice(o.href.lastIndexOf("/")+1),{usage:0,elements:[o]}):o.textContent&&e.set(o.textContent,{usage:0,elements:[o]})}function Yt(t,r){let e=r.createElement("link");return e.setAttribute("rel","stylesheet"),e.setAttribute("href",t),e}var qt=(()=>{class t{doc;appId;nonce;inline=new Map;external=new Map;hosts=new Set;constructor(e,n,i,o={}){this.doc=e,this.appId=n,this.nonce=i,Eo(e,n,this.inline,this.external),this.hosts.add(e.head)}addStyles(e,n){for(let i of e)this.addUsage(i,this.inline,jr);n?.forEach(i=>this.addUsage(i,this.external,Yt))}removeStyles(e,n){for(let i of e)this.removeUsage(i,this.inline);n?.forEach(i=>this.removeUsage(i,this.external))}addUsage(e,n,i){let o=n.get(e);o?o.usage++:n.set(e,{usage:1,elements:[...this.hosts].map(s=>this.addElement(s,i(e,this.doc)))})}removeUsage(e,n){let i=n.get(e);i&&(i.usage--,i.usage<=0&&(Br(i.elements),n.delete(e)))}ngOnDestroy(){for(let[,{elements:e}]of[...this.inline,...this.external])Br(e);this.hosts.clear()}addHost(e){this.hosts.add(e);for(let[n,{elements:i}]of this.inline)i.push(this.addElement(e,jr(n,this.doc)));for(let[n,{elements:i}]of this.external)i.push(this.addElement(e,Yt(n,this.doc)))}removeHost(e){this.hosts.delete(e)}addElement(e,n){return this.nonce&&n.setAttribute("nonce",this.nonce),e.appendChild(n)}static \u0275fac=function(n){return new(n||t)(h(y),h(Q),h(ae,8),h(se))};static \u0275prov=d({token:t,factory:t.\u0275fac})}return t})(),Zt={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/",math:"http://www.w3.org/1998/Math/MathML"},Jt=/%COMP%/g;var zr="%COMP%",wo=`_nghost-${zr}`,Ao=`_ngcontent-${zr}`,Co=!0,To=new l("",{factory:()=>Co});function Io(t){return Ao.replace(Jt,t)}function Mo(t){return wo.replace(Jt,t)}function $r(t,r){return r.map(e=>e.replace(Jt,t))}var Qt=(()=>{class t{eventManager;sharedStylesHost;appId;removeStylesOnCompDestroy;doc;ngZone;nonce;tracingService;rendererByCompId=new Map;defaultRenderer;constructor(e,n,i,o,s,u,c=null,m=null){this.eventManager=e,this.sharedStylesHost=n,this.appId=i,this.removeStylesOnCompDestroy=o,this.doc=s,this.ngZone=u,this.nonce=c,this.tracingService=m,this.defaultRenderer=new Le(e,s,u,this.tracingService)}createRenderer(e,n){if(!e||!n)return this.defaultRenderer;let i=this.getOrCreateRenderer(e,n);return i instanceof ct?i.applyToHost(e):i instanceof Pe&&i.applyStyles(),i}getOrCreateRenderer(e,n){let i=this.rendererByCompId,o=i.get(n.id);if(!o){let s=this.doc,u=this.ngZone,c=this.eventManager,m=this.sharedStylesHost,f=this.removeStylesOnCompDestroy,p=this.tracingService;switch(n.encapsulation){case Qe.Emulated:o=new ct(c,m,n,this.appId,f,s,u,p);break;case Qe.ShadowDom:return new at(c,e,n,s,u,this.nonce,p,m);case Qe.ExperimentalIsolatedShadowDom:return new at(c,e,n,s,u,this.nonce,p);default:o=new Pe(c,m,n,f,s,u,p);break}i.set(n.id,o)}return o}ngOnDestroy(){this.rendererByCompId.clear()}componentReplaced(e){this.rendererByCompId.delete(e)}static \u0275fac=function(n){return new(n||t)(h(Xt),h(qt),h(Q),h(To),h(y),h(E),h(ae),h(et,8))};static \u0275prov=d({token:t,factory:t.\u0275fac})}return t})(),Le=class{eventManager;doc;ngZone;tracingService;data=Object.create(null);throwOnSyntheticProps=!0;constructor(r,e,n,i){this.eventManager=r,this.doc=e,this.ngZone=n,this.tracingService=i}destroy(){}destroyNode=null;createElement(r,e){return e?this.doc.createElementNS(Zt[e]||e,r):this.doc.createElement(r)}createComment(r){return this.doc.createComment(r)}createText(r){return this.doc.createTextNode(r)}appendChild(r,e){(Ur(r)?r.content:r).appendChild(e)}insertBefore(r,e,n){r&&(Ur(r)?r.content:r).insertBefore(e,n)}removeChild(r,e){e.remove()}selectRootElement(r,e){let n=typeof r=="string"?this.doc.querySelector(r):r;if(!n)throw new D(-5104,!1);return e||(n.textContent=""),n}parentNode(r){return r.parentNode}nextSibling(r){return r.nextSibling}setAttribute(r,e,n,i){if(i){e=i+":"+e;let o=Zt[i];o?r.setAttributeNS(o,e,n):r.setAttribute(e,n)}else r.setAttribute(e,n)}removeAttribute(r,e,n){if(n){let i=Zt[n];i?r.removeAttributeNS(i,e):r.removeAttribute(`${n}:${e}`)}else r.removeAttribute(e)}addClass(r,e){r.classList.add(e)}removeClass(r,e){r.classList.remove(e)}setStyle(r,e,n,i){i&(de.DashCase|de.Important)?r.style.setProperty(e,n,i&de.Important?"important":""):r.style[e]=n}removeStyle(r,e,n){n&de.DashCase?r.style.removeProperty(e):r.style[e]=""}setProperty(r,e,n){r!=null&&(r[e]=n)}setValue(r,e){r.nodeValue=e}listen(r,e,n,i){if(typeof r=="string"&&(r=V().getGlobalEventTarget(this.doc,r),!r))throw new D(5102,!1);let o=this.decoratePreventDefault(n);return this.tracingService?.wrapEventListener&&(o=this.tracingService.wrapEventListener(r,e,o)),this.eventManager.addEventListener(r,e,o,i)}decoratePreventDefault(r){return e=>{if(e==="__ngUnwrap__")return r;r(e)===!1&&e.preventDefault()}}};function Ur(t){return t.tagName==="TEMPLATE"&&t.content!==void 0}var at=class extends Le{hostEl;sharedStylesHost;shadowRoot;constructor(r,e,n,i,o,s,u,c){super(r,i,o,u),this.hostEl=e,this.sharedStylesHost=c,this.shadowRoot=e.attachShadow({mode:"open"}),this.sharedStylesHost&&this.sharedStylesHost.addHost(this.shadowRoot);let m=n.styles;m=$r(n.id,m);for(let p of m){let C=document.createElement("style");s&&C.setAttribute("nonce",s),C.textContent=p,this.shadowRoot.appendChild(C)}let f=n.getExternalStyles?.();if(f)for(let p of f){let C=Yt(p,i);s&&C.setAttribute("nonce",s),this.shadowRoot.appendChild(C)}}nodeOrShadowRoot(r){return r===this.hostEl?this.shadowRoot:r}appendChild(r,e){return super.appendChild(this.nodeOrShadowRoot(r),e)}insertBefore(r,e,n){return super.insertBefore(this.nodeOrShadowRoot(r),e,n)}removeChild(r,e){return super.removeChild(null,e)}parentNode(r){return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(r)))}destroy(){this.sharedStylesHost&&this.sharedStylesHost.removeHost(this.shadowRoot)}},Pe=class extends Le{sharedStylesHost;removeStylesOnCompDestroy;styles;styleUrls;constructor(r,e,n,i,o,s,u,c){super(r,o,s,u),this.sharedStylesHost=e,this.removeStylesOnCompDestroy=i;let m=n.styles;this.styles=c?$r(c,m):m,this.styleUrls=n.getExternalStyles?.(c)}applyStyles(){this.sharedStylesHost.addStyles(this.styles,this.styleUrls)}destroy(){this.removeStylesOnCompDestroy&&br.size===0&&this.sharedStylesHost.removeStyles(this.styles,this.styleUrls)}},ct=class extends Pe{contentAttr;hostAttr;constructor(r,e,n,i,o,s,u,c){let m=i+"-"+n.id;super(r,e,n,o,s,u,c,m),this.contentAttr=Io(m),this.hostAttr=Mo(m)}applyToHost(r){this.applyStyles(),this.setAttribute(r,this.hostAttr,"")}createElement(r,e){let n=super.createElement(r,e);return super.setAttribute(n,this.contentAttr,""),n}};var dt=class t extends Oe{supportsDOMEvents=!0;static makeCurrent(){Vt(new t)}onAndCancel(r,e,n,i){return r.addEventListener(e,n,i),()=>{r.removeEventListener(e,n,i)}}dispatchEvent(r,e){r.dispatchEvent(e)}remove(r){r.remove()}createElement(r,e){return e=e||this.getDefaultDocument(),e.createElement(r)}createHtmlDocument(){return document.implementation.createHTMLDocument("fakeTitle")}getDefaultDocument(){return document}isElementNode(r){return r.nodeType===Node.ELEMENT_NODE}isShadowRoot(r){return r instanceof DocumentFragment}getGlobalEventTarget(r,e){return e==="window"?window:e==="document"?r:e==="body"?r.body:null}getBaseHref(r){let e=Ro();return e==null?null:Fo(e)}resetBaseElement(){Be=null}getUserAgent(){return window.navigator.userAgent}getCookie(r){return Ne(document.cookie,r)}},Be=null;function Ro(){return Be=Be||document.head.querySelector("base"),Be?Be.getAttribute("href"):null}function Fo(t){return new URL(t,document.baseURI).pathname}var xo=(()=>{class t{build(){return new XMLHttpRequest}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac})}return t})(),Vr=["alt","control","meta","shift"],Oo={"\b":"Backspace","	":"Tab","\x7F":"Delete","\x1B":"Escape",Del:"Delete",Esc:"Escape",Left:"ArrowLeft",Right:"ArrowRight",Up:"ArrowUp",Down:"ArrowDown",Menu:"ContextMenu",Scroll:"ScrollLock",Win:"OS"},No={alt:t=>t.altKey,control:t=>t.ctrlKey,meta:t=>t.metaKey,shift:t=>t.shiftKey},Hr=(()=>{class t extends ke{constructor(e){super(e)}supports(e){return t.parseEventName(e)!=null}addEventListener(e,n,i,o){let s=t.parseEventName(n),u=t.eventCallback(s.fullKey,i,this.manager.getZone());return this.manager.getZone().runOutsideAngular(()=>V().onAndCancel(e,s.domEventName,u,o))}static parseEventName(e){let n=e.toLowerCase().split("."),i=n.shift();if(n.length===0||!(i==="keydown"||i==="keyup"))return null;let o=t._normalizeKey(n.pop()),s="",u=n.indexOf("code");if(u>-1&&(n.splice(u,1),s="code."),Vr.forEach(m=>{let f=n.indexOf(m);f>-1&&(n.splice(f,1),s+=m+".")}),s+=o,n.length!=0||o.length===0)return null;let c={};return c.domEventName=i,c.fullKey=s,c}static matchEventFullKeyCode(e,n){let i=Oo[e.key]||e.key,o="";return n.indexOf("code.")>-1&&(i=e.code,o="code."),i==null||!i?!1:(i=i.toLowerCase(),i===" "?i="space":i==="."&&(i="dot"),Vr.forEach(s=>{if(s!==i){let u=No[s];u(e)&&(o+=s+".")}}),o+=i,o===n)}static eventCallback(e,n,i){return o=>{t.matchEventFullKeyCode(o,e)&&i.runGuarded(()=>n(o))}}static _normalizeKey(e){return e==="esc"?"escape":e}static \u0275fac=function(n){return new(n||t)(h(y))};static \u0275prov=d({token:t,factory:t.\u0275fac})}return t})();async function ko(t,r,e){let n=b({rootComponent:t},Lo(r,e));return Ir(n)}function Lo(t,r){return{platformRef:r?.platformRef,appProviders:[...zo,...t?.providers??[]],platformProviders:Uo}}function Po(){dt.makeCurrent()}function Bo(){return new Ot}function jo(){return ar(document),document}var Uo=[{provide:se,useValue:Wt},{provide:cr,useValue:Po,multi:!0},{provide:y,useFactory:jo}];var zo=[{provide:rr,useValue:"root"},{provide:Ot,useFactory:Bo},{provide:ut,useClass:st,multi:!0},{provide:ut,useClass:Hr,multi:!0},Qt,qt,Xt,{provide:le,useExisting:Qt},{provide:ee,useClass:xo},[]];var Y=class t{headers;normalizedNames=new Map;lazyInit;lazyUpdate=null;constructor(r){r?typeof r=="string"?this.lazyInit=()=>{this.headers=new Map,r.split(`
`).forEach(e=>{let n=e.indexOf(":");if(n>0){let i=e.slice(0,n),o=e.slice(n+1).trim();this.addHeaderEntry(i,o)}})}:typeof Headers<"u"&&r instanceof Headers?(this.headers=new Map,r.forEach((e,n)=>{this.addHeaderEntry(n,e)})):this.lazyInit=()=>{this.headers=new Map,Object.entries(r).forEach(([e,n])=>{this.setHeaderEntries(e,n)})}:this.headers=new Map}has(r){return this.init(),this.headers.has(r.toLowerCase())}get(r){this.init();let e=this.headers.get(r.toLowerCase());return e&&e.length>0?e[0]:null}keys(){return this.init(),Array.from(this.normalizedNames.values())}getAll(r){return this.init(),this.headers.get(r.toLowerCase())||null}append(r,e){return this.clone({name:r,value:e,op:"a"})}set(r,e){return this.clone({name:r,value:e,op:"s"})}delete(r,e){return this.clone({name:r,value:e,op:"d"})}maybeSetNormalizedName(r,e){this.normalizedNames.has(e)||this.normalizedNames.set(e,r)}init(){this.lazyInit&&(this.lazyInit instanceof t?this.copyFrom(this.lazyInit):this.lazyInit(),this.lazyInit=null,this.lazyUpdate&&(this.lazyUpdate.forEach(r=>this.applyUpdate(r)),this.lazyUpdate=null))}copyFrom(r){r.init(),Array.from(r.headers.keys()).forEach(e=>{this.headers.set(e,r.headers.get(e)),this.normalizedNames.set(e,r.normalizedNames.get(e))})}clone(r){let e=new t;return e.lazyInit=this.lazyInit&&this.lazyInit instanceof t?this.lazyInit:this,e.lazyUpdate=(this.lazyUpdate||[]).concat([r]),e}applyUpdate(r){let e=r.name.toLowerCase();switch(r.op){case"a":case"s":let n=r.value;if(typeof n=="string"&&(n=[n]),n.length===0)return;this.maybeSetNormalizedName(r.name,e);let i=(r.op==="a"?this.headers.get(e):void 0)||[];i.push(...n),this.headers.set(e,i);break;case"d":let o=r.value;if(!o)this.headers.delete(e),this.normalizedNames.delete(e);else{let s=this.headers.get(e);if(!s)return;s=s.filter(u=>o.indexOf(u)===-1),s.length===0?(this.headers.delete(e),this.normalizedNames.delete(e)):this.headers.set(e,s)}break}}addHeaderEntry(r,e){let n=r.toLowerCase();this.maybeSetNormalizedName(r,n),this.headers.has(n)?this.headers.get(n).push(e):this.headers.set(n,[e])}setHeaderEntries(r,e){let n=(Array.isArray(e)?e:[e]).map(o=>o.toString()),i=r.toLowerCase();this.headers.set(i,n),this.maybeSetNormalizedName(r,i)}forEach(r){this.init(),Array.from(this.normalizedNames.keys()).forEach(e=>r(this.normalizedNames.get(e),this.headers.get(e)))}};var tn=class{defaultValue;constructor(r){this.defaultValue=r}},ft=class{map=new Map;set(r,e){return this.map.set(r,e),this}get(r){return this.map.has(r)||this.map.set(r,r.defaultValue()),this.map.get(r)}delete(r){return this.map.delete(r),this}has(r){return this.map.has(r)}keys(){return this.map.keys()}},mt=class{encodeKey(r){return Gr(r)}encodeValue(r){return Gr(r)}decodeKey(r){return decodeURIComponent(r)}decodeValue(r){return decodeURIComponent(r)}};function $o(t,r){let e=new Map;return t.length>0&&t.replace(/^\?/,"").split("&").forEach(i=>{let o=i.indexOf("="),[s,u]=o==-1?[r.decodeKey(i),""]:[r.decodeKey(i.slice(0,o)),r.decodeValue(i.slice(o+1))],c=e.get(s)||[];c.push(u),e.set(s,c)}),e}var Vo=/%(\d[a-f0-9])/gi,Ho={40:"@","3A":":",24:"$","2C":",","3B":";","3D":"=","3F":"?","2F":"/"};function Gr(t){return encodeURIComponent(t).replace(Vo,(r,e)=>Ho[e]??r)}function lt(t){return`${t}`}var H=class t{map;encoder;updates=null;cloneFrom=null;constructor(r={}){if(this.encoder=r.encoder||new mt,r.fromString){if(r.fromObject)throw new D(2805,!1);this.map=$o(r.fromString,this.encoder)}else r.fromObject?(this.map=new Map,Object.keys(r.fromObject).forEach(e=>{let n=r.fromObject[e],i=Array.isArray(n)?n.map(lt):[lt(n)];this.map.set(e,i)})):this.map=null}has(r){return this.init(),this.map.has(r)}get(r){this.init();let e=this.map.get(r);return e?e[0]:null}getAll(r){return this.init(),this.map.get(r)||null}keys(){return this.init(),Array.from(this.map.keys())}append(r,e){return this.clone({param:r,value:e,op:"a"})}appendAll(r){let e=[];return Object.keys(r).forEach(n=>{let i=r[n];Array.isArray(i)?i.forEach(o=>{e.push({param:n,value:o,op:"a"})}):e.push({param:n,value:i,op:"a"})}),this.clone(e)}set(r,e){return this.clone({param:r,value:e,op:"s"})}delete(r,e){return this.clone({param:r,value:e,op:"d"})}toString(){return this.init(),this.keys().map(r=>{let e=this.encoder.encodeKey(r);return this.map.get(r).map(n=>e+"="+this.encoder.encodeValue(n)).join("&")}).filter(r=>r!=="").join("&")}clone(r){let e=new t({encoder:this.encoder});return e.cloneFrom=this.cloneFrom||this,e.updates=(this.updates||[]).concat(r),e}init(){this.map===null&&(this.map=new Map),this.cloneFrom!==null&&(this.cloneFrom.init(),this.cloneFrom.keys().forEach(r=>this.map.set(r,this.cloneFrom.map.get(r))),this.updates.forEach(r=>{switch(r.op){case"a":case"s":let e=(r.op==="a"?this.map.get(r.param):void 0)||[];e.push(lt(r.value)),this.map.set(r.param,e);break;case"d":if(r.value!==void 0){let n=this.map.get(r.param)||[],i=n.indexOf(lt(r.value));i!==-1&&n.splice(i,1),n.length>0?this.map.set(r.param,n):this.map.delete(r.param)}else{this.map.delete(r.param);break}}}),this.cloneFrom=this.updates=null)}};function Go(t){switch(t){case"DELETE":case"GET":case"HEAD":case"OPTIONS":case"JSONP":return!1;default:return!0}}function Wr(t){return typeof ArrayBuffer<"u"&&t instanceof ArrayBuffer}function Kr(t){return typeof Blob<"u"&&t instanceof Blob}function Zr(t){return typeof FormData<"u"&&t instanceof FormData}function Wo(t){return typeof URLSearchParams<"u"&&t instanceof URLSearchParams}var Yr="Content-Type",Xr="Accept",qr="text/plain",Jr="application/json",Ko=`${Jr}, ${qr}, */*`,ye=class t{url;body=null;headers;context;reportProgress=!1;withCredentials=!1;credentials;keepalive=!1;cache;priority;mode;redirect;referrer;integrity;referrerPolicy;responseType="json";method;params;urlWithParams;transferCache;timeout;constructor(r,e,n,i){this.url=e,this.method=r.toUpperCase();let o;if(Go(this.method)||i?(this.body=n!==void 0?n:null,o=i):o=n,o){if(this.reportProgress=!!o.reportProgress,this.withCredentials=!!o.withCredentials,this.keepalive=!!o.keepalive,o.responseType&&(this.responseType=o.responseType),o.headers&&(this.headers=o.headers),o.context&&(this.context=o.context),o.params&&(this.params=o.params),o.priority&&(this.priority=o.priority),o.cache&&(this.cache=o.cache),o.credentials&&(this.credentials=o.credentials),typeof o.timeout=="number"){if(o.timeout<1||!Number.isInteger(o.timeout))throw new D(2822,"");this.timeout=o.timeout}o.mode&&(this.mode=o.mode),o.redirect&&(this.redirect=o.redirect),o.integrity&&(this.integrity=o.integrity),o.referrer&&(this.referrer=o.referrer),o.referrerPolicy&&(this.referrerPolicy=o.referrerPolicy),this.transferCache=o.transferCache}if(this.headers??=new Y,this.context??=new ft,!this.params)this.params=new H,this.urlWithParams=e;else{let s=this.params.toString();if(s.length===0)this.urlWithParams=e;else{let u=e.indexOf("?"),c=u===-1?"?":u<e.length-1?"&":"";this.urlWithParams=e+c+s}}}serializeBody(){return this.body===null?null:typeof this.body=="string"||Wr(this.body)||Kr(this.body)||Zr(this.body)||Wo(this.body)?this.body:this.body instanceof H?this.body.toString():typeof this.body=="object"||typeof this.body=="boolean"||Array.isArray(this.body)?JSON.stringify(this.body):this.body.toString()}detectContentTypeHeader(){return this.body===null||Zr(this.body)?null:Kr(this.body)?this.body.type||null:Wr(this.body)?null:typeof this.body=="string"?qr:this.body instanceof H?"application/x-www-form-urlencoded;charset=UTF-8":typeof this.body=="object"||typeof this.body=="number"||typeof this.body=="boolean"?Jr:null}clone(r={}){let e=r.method||this.method,n=r.url||this.url,i=r.responseType||this.responseType,o=r.keepalive??this.keepalive,s=r.priority||this.priority,u=r.cache||this.cache,c=r.mode||this.mode,m=r.redirect||this.redirect,f=r.credentials||this.credentials,p=r.referrer||this.referrer,C=r.integrity||this.integrity,L=r.referrerPolicy||this.referrerPolicy,N=r.transferCache??this.transferCache,F=r.timeout??this.timeout,g=r.body!==void 0?r.body:this.body,v=r.withCredentials??this.withCredentials,R=r.reportProgress??this.reportProgress,U=r.headers||this.headers,w=r.params||this.params,Te=r.context??this.context;return r.setHeaders!==void 0&&(U=Object.keys(r.setHeaders).reduce((Ie,J)=>Ie.set(J,r.setHeaders[J]),U)),r.setParams&&(w=Object.keys(r.setParams).reduce((Ie,J)=>Ie.set(J,r.setParams[J]),w)),new t(e,n,g,{params:w,headers:U,context:Te,reportProgress:R,responseType:i,withCredentials:v,transferCache:N,keepalive:o,cache:u,priority:s,timeout:F,mode:c,redirect:m,credentials:f,referrer:p,integrity:C,referrerPolicy:L})}},te=(function(t){return t[t.Sent=0]="Sent",t[t.UploadProgress=1]="UploadProgress",t[t.ResponseHeader=2]="ResponseHeader",t[t.DownloadProgress=3]="DownloadProgress",t[t.Response=4]="Response",t[t.User=5]="User",t})(te||{}),_e=class{headers;status;statusText;url;ok;type;redirected;responseType;constructor(r,e=200,n="OK"){this.headers=r.headers||new Y,this.status=r.status!==void 0?r.status:e,this.statusText=r.statusText||n,this.url=r.url||null,this.redirected=r.redirected,this.responseType=r.responseType,this.ok=this.status>=200&&this.status<300}},ht=class t extends _e{constructor(r={}){super(r)}type=te.ResponseHeader;clone(r={}){return new t({headers:r.headers||this.headers,status:r.status!==void 0?r.status:this.status,statusText:r.statusText||this.statusText,url:r.url||this.url||void 0})}},je=class t extends _e{body;constructor(r={}){super(r),this.body=r.body!==void 0?r.body:null}type=te.Response;clone(r={}){return new t({body:r.body!==void 0?r.body:this.body,headers:r.headers||this.headers,status:r.status!==void 0?r.status:this.status,statusText:r.statusText||this.statusText,url:r.url||this.url||void 0,redirected:r.redirected??this.redirected,responseType:r.responseType??this.responseType})}},ve=class extends _e{name="HttpErrorResponse";message;error;ok=!1;constructor(r){super(r,0,"Unknown Error"),this.status>=200&&this.status<300?this.message=`Http failure during parsing for ${r.url||"(unknown url)"}`:this.message=`Http failure response for ${r.url||"(unknown url)"}: ${r.status} ${r.statusText}`,this.error=r.error||null}},Zo=200,Yo=204;var Xo=new l("");var qo=/^\)\]\}',?\n/;var nn=(()=>{class t{xhrFactory;tracingService=a(et,{optional:!0});constructor(e){this.xhrFactory=e}maybePropagateTrace(e){return this.tracingService?.propagate?this.tracingService.propagate(e):e}handle(e){if(e.method==="JSONP")throw new D(-2800,!1);let n=this.xhrFactory;return Me(null).pipe(er(()=>new P(o=>{let s=n.build();if(s.open(e.method,e.urlWithParams),e.withCredentials&&(s.withCredentials=!0),e.headers.forEach((g,v)=>s.setRequestHeader(g,v.join(","))),e.headers.has(Xr)||s.setRequestHeader(Xr,Ko),!e.headers.has(Yr)){let g=e.detectContentTypeHeader();g!==null&&s.setRequestHeader(Yr,g)}if(e.timeout&&(s.timeout=e.timeout),e.responseType){let g=e.responseType.toLowerCase();s.responseType=g!=="json"?g:"text"}let u=e.serializeBody(),c=null,m=()=>{if(c!==null)return c;let g=s.statusText||"OK",v=new Y(s.getAllResponseHeaders()),R=s.responseURL||e.url;return c=new ht({headers:v,status:s.status,statusText:g,url:R}),c},f=this.maybePropagateTrace(()=>{let{headers:g,status:v,statusText:R,url:U}=m(),w=null;v!==Yo&&(w=typeof s.response>"u"?s.responseText:s.response),v===0&&(v=w?Zo:0);let Te=v>=200&&v<300;if(e.responseType==="json"&&typeof w=="string"){let Ie=w;w=w.replace(qo,"");try{w=w!==""?JSON.parse(w):null}catch(J){w=Ie,Te&&(Te=!1,w={error:J,text:w})}}Te?(o.next(new je({body:w,headers:g,status:v,statusText:R,url:U||void 0})),o.complete()):o.error(new ve({error:w,headers:g,status:v,statusText:R,url:U||void 0}))}),p=this.maybePropagateTrace(g=>{let{url:v}=m(),R=new ve({error:g,status:s.status||0,statusText:s.statusText||"Unknown Error",url:v||void 0});o.error(R)}),C=p;e.timeout&&(C=this.maybePropagateTrace(g=>{let{url:v}=m(),R=new ve({error:new DOMException("Request timed out","TimeoutError"),status:s.status||0,statusText:s.statusText||"Request timeout",url:v||void 0});o.error(R)}));let L=!1,N=this.maybePropagateTrace(g=>{L||(o.next(m()),L=!0);let v={type:te.DownloadProgress,loaded:g.loaded};g.lengthComputable&&(v.total=g.total),e.responseType==="text"&&s.responseText&&(v.partialText=s.responseText),o.next(v)}),F=this.maybePropagateTrace(g=>{let v={type:te.UploadProgress,loaded:g.loaded};g.lengthComputable&&(v.total=g.total),o.next(v)});return s.addEventListener("load",f),s.addEventListener("error",p),s.addEventListener("timeout",C),s.addEventListener("abort",p),e.reportProgress&&(s.addEventListener("progress",N),u!==null&&s.upload&&s.upload.addEventListener("progress",F)),s.send(u),o.next({type:te.Sent}),()=>{s.removeEventListener("error",p),s.removeEventListener("abort",p),s.removeEventListener("load",f),s.removeEventListener("timeout",C),e.reportProgress&&(s.removeEventListener("progress",N),u!==null&&s.upload&&s.upload.removeEventListener("progress",F)),s.readyState!==s.DONE&&s.abort()}})))}static \u0275fac=function(n){return new(n||t)(h(ee))};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();function Jo(t,r){return r(t)}function Qo(t,r,e){return(n,i)=>ir(e,()=>r(n,o=>t(o,i)))}var rn=new l("",{factory:()=>[]}),Qr=new l(""),ei=new l("",{factory:()=>!0});var on=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:function(n){let i=null;return n?i=new(n||t):i=h(nn),i},providedIn:"root"})}return t})();var pt=(()=>{class t{backend;injector;chain=null;pendingTasks=a(Nt);contributeToStability=a(ei);constructor(e,n){this.backend=e,this.injector=n}handle(e){if(this.chain===null){let n=Array.from(new Set([...this.injector.get(rn),...this.injector.get(Qr,[])]));this.chain=n.reduceRight((i,o)=>Qo(i,o,this.injector),Jo)}if(this.contributeToStability){let n=this.pendingTasks.add();return this.chain(e,i=>this.backend.handle(i)).pipe(Xn(n))}else return this.chain(e,n=>this.backend.handle(n))}static \u0275fac=function(n){return new(n||t)(h(on),h(Re))};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),sn=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:function(n){let i=null;return n?i=new(n||t):i=h(pt),i},providedIn:"root"})}return t})();function en(t,r){return{body:r,headers:t.headers,context:t.context,observe:t.observe,params:t.params,reportProgress:t.reportProgress,responseType:t.responseType,withCredentials:t.withCredentials,credentials:t.credentials,transferCache:t.transferCache,timeout:t.timeout,keepalive:t.keepalive,priority:t.priority,cache:t.cache,mode:t.mode,redirect:t.redirect,integrity:t.integrity,referrer:t.referrer,referrerPolicy:t.referrerPolicy}}var ti=(()=>{class t{handler;constructor(e){this.handler=e}request(e,n,i={}){let o;if(e instanceof ye)o=e;else{let c;i.headers instanceof Y?c=i.headers:c=new Y(i.headers);let m;i.params&&(i.params instanceof H?m=i.params:m=new H({fromObject:i.params})),o=new ye(e,n,i.body!==void 0?i.body:null,{headers:c,context:i.context,params:m,reportProgress:i.reportProgress,responseType:i.responseType||"json",withCredentials:i.withCredentials,transferCache:i.transferCache,keepalive:i.keepalive,priority:i.priority,cache:i.cache,mode:i.mode,redirect:i.redirect,credentials:i.credentials,referrer:i.referrer,referrerPolicy:i.referrerPolicy,integrity:i.integrity,timeout:i.timeout})}let s=Me(o).pipe(Zn(c=>this.handler.handle(c)));if(e instanceof ye||i.observe==="events")return s;let u=s.pipe(Ye(c=>c instanceof je));switch(i.observe||"body"){case"body":switch(o.responseType){case"arraybuffer":return u.pipe(x(c=>{if(c.body!==null&&!(c.body instanceof ArrayBuffer))throw new D(2806,!1);return c.body}));case"blob":return u.pipe(x(c=>{if(c.body!==null&&!(c.body instanceof Blob))throw new D(2807,!1);return c.body}));case"text":return u.pipe(x(c=>{if(c.body!==null&&typeof c.body!="string")throw new D(2808,!1);return c.body}));default:return u.pipe(x(c=>c.body))}case"response":return u;default:throw new D(2809,!1)}}delete(e,n={}){return this.request("DELETE",e,n)}get(e,n={}){return this.request("GET",e,n)}head(e,n={}){return this.request("HEAD",e,n)}jsonp(e,n){return this.request("JSONP",e,{params:new H().append(n,"JSONP_CALLBACK"),observe:"body",responseType:"json"})}options(e,n={}){return this.request("OPTIONS",e,n)}patch(e,n,i={}){return this.request("PATCH",e,en(i,n))}post(e,n,i={}){return this.request("POST",e,en(i,n))}put(e,n,i={}){return this.request("PUT",e,en(i,n))}static \u0275fac=function(n){return new(n||t)(h(sn))};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var es=new l("",{factory:()=>!0}),ts="XSRF-TOKEN",ns=new l("",{factory:()=>ts}),rs="X-XSRF-TOKEN",is=new l("",{factory:()=>rs}),os=(()=>{class t{cookieName=a(ns);doc=a(y);lastCookieString="";lastToken=null;parseCount=0;getToken(){let e=this.doc.cookie||"";return e!==this.lastCookieString&&(this.parseCount++,this.lastToken=Ne(e,this.cookieName),this.lastCookieString=e),this.lastToken}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),ni=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:function(n){let i=null;return n?i=new(n||t):i=h(os),i},providedIn:"root"})}return t})();function ss(t,r){if(!a(es)||t.method==="GET"||t.method==="HEAD")return r(t);try{let i=a(be).href,{origin:o}=new URL(i),{origin:s}=new URL(t.url,o);if(o!==s)return r(t)}catch{return r(t)}let e=a(ni).getToken(),n=a(is);return e!=null&&!t.headers.has(n)&&(t=t.clone({headers:t.headers.set(n,e)})),r(t)}var an=(function(t){return t[t.Interceptors=0]="Interceptors",t[t.LegacyInterceptors=1]="LegacyInterceptors",t[t.CustomXsrfConfiguration=2]="CustomXsrfConfiguration",t[t.NoXsrfProtection=3]="NoXsrfProtection",t[t.JsonpSupport=4]="JsonpSupport",t[t.RequestsMadeViaParent=5]="RequestsMadeViaParent",t[t.Fetch=6]="Fetch",t})(an||{});function as(t,r){return{\u0275kind:t,\u0275providers:r}}function cs(...t){let r=[ti,pt,{provide:sn,useExisting:pt},{provide:on,useFactory:()=>a(Xo,{optional:!0})??a(nn)},{provide:rn,useValue:ss,multi:!0}];for(let e of t)r.push(...e.\u0275providers);return Se(r)}function us(t){return as(an.Interceptors,t.map(r=>({provide:rn,useValue:r,multi:!0})))}var ml=(()=>{class t{_doc;constructor(e){this._doc=e}getTitle(){return this._doc.title}setTitle(e){this._doc.title=e||""}static \u0275fac=function(n){return new(n||t)(h(y))};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var cn=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:function(n){let i=null;return n?i=new(n||t):i=h(ds),i},providedIn:"root"})}return t})(),ds=(()=>{class t extends cn{_doc;constructor(e){super(),this._doc=e}sanitize(e,n){if(n==null)return null;switch(e){case $.NONE:return n;case $.HTML:return ue(n,"HTML")?ce(n):gr(this._doc,String(n)).toString();case $.STYLE:return ue(n,"Style")?ce(n):n;case $.SCRIPT:if(ue(n,"Script"))return ce(n);throw new D(5200,!1);case $.URL:return ue(n,"URL")?ce(n):pr(String(n));case $.RESOURCE_URL:if(ue(n,"ResourceURL"))return ce(n);throw new D(5201,!1);default:throw new D(5202,!1)}}bypassSecurityTrustHtml(e){return dr(e)}bypassSecurityTrustStyle(e){return lr(e)}bypassSecurityTrustScript(e){return fr(e)}bypassSecurityTrustUrl(e){return mr(e)}bypassSecurityTrustResourceUrl(e){return hr(e)}static \u0275fac=function(n){return new(n||t)(h(y))};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();function Tl(t){t||(t=a(Fe));let r=new P(e=>{if(t.destroyed){e.next();return}return t.onDestroy(e.next.bind(e))});return e=>e.pipe(oe(r))}function ri(t,r){let n=!r?.manualCleanup?r?.injector?.get(Fe)??a(Fe):null,i=ls(r?.equal),o;r?.requireSync?o=K({kind:0},{equal:i}):o=K({kind:1,value:r?.initialValue},{equal:i});let s,u=t.subscribe({next:c=>o.set({kind:1,value:c}),error:c=>{o.set({kind:2,error:c}),s?.()},complete:()=>{s?.()}});if(r?.requireSync&&o().kind===0)throw new D(601,!1);return s=n?.onDestroy(u.unsubscribe.bind(u)),it(()=>{let c=o();switch(c.kind){case 1:return c.value;case 2:throw c.error;case 0:throw new D(601,!1)}},{equal:r?.equal})}function ls(t=Object.is){return(r,e)=>r.kind===1&&e.kind===1&&t(r.value,e.value)}var ln={};function Ll(t,r){if(ln[t]=(ln[t]||0)+1,typeof r=="function")return un(t,(...n)=>W(b({},r(...n)),{type:t}));switch(r?r._as:"empty"){case"empty":return un(t,()=>({type:t}));case"props":return un(t,n=>W(b({},n),{type:t}));default:throw new Error("Unexpected config.")}}function Pl(){return{_as:"props",_p:void 0}}function un(t,r){return Object.defineProperty(r,"type",{value:t,writable:!1})}function fs(t,r){if(t==null)throw new Error(`${r} must be defined.`)}var bi="@ngrx/store/init",De=(()=>{class t extends ie{constructor(){super({type:bi})}next(e){if(typeof e=="function")throw new TypeError(`
        Dispatch expected an object, instead it received a function.
        If you're using the createAction function, make sure to invoke the function
        before dispatching the action. For example, someAction should be someAction().`);if(typeof e>"u")throw new TypeError("Actions must be objects");if(typeof e.type>"u")throw new TypeError("Actions must have a type property");super.next(e)}complete(){}ngOnDestroy(){super.complete()}static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275prov=d({token:t,factory:t.\u0275fac})}}return t})(),ms=[De],yi=new l("@ngrx/store Internal Root Guard"),ii=new l("@ngrx/store Internal Initial State"),gn=new l("@ngrx/store Initial State"),vi=new l("@ngrx/store Reducer Factory"),oi=new l("@ngrx/store Internal Reducer Factory Provider"),_i=new l("@ngrx/store Initial Reducers"),dn=new l("@ngrx/store Internal Initial Reducers");var si=new l("@ngrx/store Internal Store Reducers");var hs=new l("@ngrx/store Internal Store Features");var ps=new l("@ngrx/store Feature Reducers"),ai=new l("@ngrx/store User Provided Meta Reducers"),gt=new l("@ngrx/store Meta Reducers"),ci=new l("@ngrx/store Internal Resolved Meta Reducers"),ui=new l("@ngrx/store User Runtime Checks Config"),di=new l("@ngrx/store Internal User Runtime Checks Config"),Ue=new l("@ngrx/store Internal Runtime Checks"),bn=new l("@ngrx/store Check if Action types are unique"),fn=new l("@ngrx/store Root Store Provider"),li=new l("@ngrx/store Feature State Provider");function gs(t,r={}){let e=Object.keys(t),n={};for(let o=0;o<e.length;o++){let s=e[o];typeof t[s]=="function"&&(n[s]=t[s])}let i=Object.keys(n);return function(s,u){s=s===void 0?r:s;let c=!1,m={};for(let f=0;f<i.length;f++){let p=i[f],C=n[p],L=s[p],N=C(L,u);m[p]=N,c=c||N!==L}return c?m:s}}function bs(t,r){return Object.keys(t).filter(e=>e!==r).reduce((e,n)=>Object.assign(e,{[n]:t[n]}),{})}function Di(...t){return function(r){if(t.length===0)return r;let e=t[t.length-1];return t.slice(0,-1).reduceRight((i,o)=>o(i),e(r))}}function Ei(t,r){return Array.isArray(r)&&r.length>0&&(t=Di.apply(null,[...r,t])),(e,n)=>{let i=t(e);return(o,s)=>(o=o===void 0?n:o,i(o,s))}}function ys(t){let r=Array.isArray(t)&&t.length>0?Di(...t):e=>e;return(e,n)=>(e=r(e),(i,o)=>(i=i===void 0?n:i,e(i,o)))}var ze=class extends P{},bt=class extends De{},vs="@ngrx/store/update-reducers",yt=(()=>{class t extends ie{get currentReducers(){return this.reducers}constructor(e,n,i,o){super(o(i,n)),this.dispatcher=e,this.initialState=n,this.reducers=i,this.reducerFactory=o}addFeature(e){this.addFeatures([e])}addFeatures(e){let n=e.reduce((i,{reducers:o,reducerFactory:s,metaReducers:u,initialState:c,key:m})=>{let f=typeof o=="function"?ys(u)(o,c):Ei(s,u)(o,c);return i[m]=f,i},{});this.addReducers(n)}removeFeature(e){this.removeFeatures([e])}removeFeatures(e){this.removeReducers(e.map(n=>n.key))}addReducer(e,n){this.addReducers({[e]:n})}addReducers(e){this.reducers=b(b({},this.reducers),e),this.updateReducers(Object.keys(e))}removeReducer(e){this.removeReducers([e])}removeReducers(e){e.forEach(n=>{this.reducers=bs(this.reducers,n)}),this.updateReducers(e)}updateReducers(e){this.next(this.reducerFactory(this.reducers,this.initialState)),this.dispatcher.next({type:vs,features:e})}ngOnDestroy(){this.complete()}static{this.\u0275fac=function(n){return new(n||t)(h(bt),h(gn),h(_i),h(vi))}}static{this.\u0275prov=d({token:t,factory:t.\u0275fac})}}return t})(),_s=[yt,{provide:ze,useExisting:yt},{provide:bt,useExisting:De}],yn=(()=>{class t extends T{ngOnDestroy(){this.complete()}static{this.\u0275fac=(()=>{let e;return function(i){return(e||(e=Lt(t)))(i||t)}})()}static{this.\u0275prov=d({token:t,factory:t.\u0275fac})}}return t})(),Ds=[yn],vt=class extends P{},fi=(()=>{class t extends ie{static{this.INIT=bi}constructor(e,n,i,o){super(o);let u=e.pipe(Gn(Hn)).pipe(nr(n)),c={state:o},m=u.pipe(Jn(Es,c));this.stateSubscription=m.subscribe(({state:f,action:p})=>{this.next(f),i.next(p)}),this.state=ri(this,{manualCleanup:!0,requireSync:!0})}ngOnDestroy(){this.stateSubscription.unsubscribe(),this.complete()}static{this.\u0275fac=function(n){return new(n||t)(h(De),h(ze),h(yn),h(gn))}}static{this.\u0275prov=d({token:t,factory:t.\u0275fac})}}return t})();function Es(t={state:void 0},[r,e]){let{state:n}=t;return{state:e(n,r),action:r}}var ws=[fi,{provide:vt,useExisting:fi}],vn=(()=>{class t extends P{constructor(e,n,i,o){super(),this.actionsObserver=n,this.reducerManager=i,this.injector=o,this.source=e,this.state=e.state}select(e,...n){return Cs.call(null,e,...n)(this)}selectSignal(e,n){return it(()=>e(this.state()),n)}lift(e){let n=new t(this,this.actionsObserver,this.reducerManager);return n.operator=e,n}dispatch(e,n){if(typeof e=="function")return this.processDispatchFn(e,n);this.actionsObserver.next(e)}next(e){this.actionsObserver.next(e)}error(e){this.actionsObserver.error(e)}complete(){this.actionsObserver.complete()}addReducer(e,n){this.reducerManager.addReducer(e,n)}removeReducer(e){this.reducerManager.removeReducer(e)}processDispatchFn(e,n){fs(this.injector,"Store Injector");let i=n?.injector??Ts()??this.injector;return xe(()=>{let o=e();pe(()=>this.dispatch(o))},{injector:i})}static{this.\u0275fac=function(n){return new(n||t)(h(vt),h(De),h(yt),h(A))}}static{this.\u0275prov=d({token:t,factory:t.\u0275fac})}}return t})(),As=[vn];function Cs(t,r,...e){return function(i){let o;if(typeof t=="string"){let s=[r,...e].filter(Boolean);o=i.pipe(qn(t,...s))}else if(typeof t=="function")o=i.pipe(x(s=>t(s,r)));else throw new TypeError(`Unexpected type '${typeof t}' in select operator, expected 'string' or 'function'`);return o.pipe(qe())}}function Ts(){try{return a(A)}catch{return}}var _n="https://ngrx.io/guide/store/configuration/runtime-checks";function mi(t){return t===void 0}function hi(t){return t===null}function wi(t){return Array.isArray(t)}function Is(t){return typeof t=="string"}function Ms(t){return typeof t=="boolean"}function Ss(t){return typeof t=="number"}function Ai(t){return typeof t=="object"&&t!==null}function Rs(t){return Ai(t)&&!wi(t)}function Fs(t){if(!Rs(t))return!1;let r=Object.getPrototypeOf(t);return r===Object.prototype||r===null}function mn(t){return typeof t=="function"}function xs(t){return mn(t)&&t.hasOwnProperty("\u0275cmp")}function Os(t,r){return Object.prototype.hasOwnProperty.call(t,r)}var Ns=!1;function ks(){return Ns}function pi(t,r){return t===r}function Ls(t,r,e){for(let n=0;n<t.length;n++)if(!e(t[n],r[n]))return!0;return!1}function Ci(t,r=pi,e=pi){let n=null,i=null,o;function s(){n=null,i=null}function u(f=void 0){o={result:f}}function c(){o=void 0}function m(){if(o!==void 0)return o.result;if(!n)return i=t.apply(null,arguments),n=arguments,i;if(!Ls(arguments,n,r))return i;let f=t.apply(null,arguments);return n=arguments,e(i,f)?i:(i=f,f)}return{memoized:m,reset:s,setResult:u,clearResult:c}}function Ps(...t){return js(Ci)(...t)}function Bs(t,r,e,n){if(e===void 0){let o=r.map(s=>s(t));return n.memoized.apply(null,o)}let i=r.map(o=>o(t,e));return n.memoized.apply(null,[...i,e])}function js(t,r={stateFn:Bs}){return function(...e){let n=e;if(Array.isArray(n[0])){let[f,...p]=n;n=[...f,...p]}else n.length===1&&Us(n[0])&&(n=zs(n[0]));let i=n.slice(0,n.length-1),o=n[n.length-1],s=i.filter(f=>f.release&&typeof f.release=="function"),u=t(function(...f){return o.apply(null,f)}),c=Ci(function(f,p){return r.stateFn.apply(null,[f,i,p,u])});function m(){c.reset(),u.reset(),s.forEach(f=>f.release())}return Object.assign(c.memoized,{release:m,projector:u.memoized,setResult:c.setResult,clearResult:c.clearResult})}}function Bl(t){return Ps(r=>{let e=r[t];return!ks()&&$t()&&!(t in r)&&console.warn(`@ngrx/store: The feature name "${t}" does not exist in the state, therefore createFeatureSelector cannot access it.  Be sure it is imported in a loaded module using StoreModule.forRoot('${t}', ...) or StoreModule.forFeature('${t}', ...).  If the default state is intended to be undefined, as is the case with router state, this development-only warning message can be ignored.`),e},r=>r)}function Us(t){return!!t&&typeof t=="object"&&Object.values(t).every(r=>typeof r=="function")}function zs(t){let r=Object.values(t),e=Object.keys(t),n=(...i)=>e.reduce((o,s,u)=>W(b({},o),{[s]:i[u]}),{});return[...r,n]}function $s(t){return t instanceof l?a(t):t}function Ti(t){return typeof t=="function"?t():t}function Vs(t,r){return t.concat(r)}function Hs(){if(a(vn,{optional:!0,skipSelf:!0}))throw new TypeError("The root Store has been provided more than once. Feature modules should provide feature states instead.");return"guarded"}function Gs(t,r){return function(e,n){let i=r.action(n)?hn(n):n,o=t(e,i);return r.state()?hn(o):o}}function hn(t){Object.freeze(t);let r=mn(t);return Object.getOwnPropertyNames(t).forEach(e=>{if(!e.startsWith("\u0275")&&Os(t,e)&&(!r||e!=="caller"&&e!=="callee"&&e!=="arguments")){let n=t[e];(Ai(n)||mn(n))&&!Object.isFrozen(n)&&hn(n)}}),t}function Ws(t,r){return function(e,n){if(r.action(n)){let o=pn(n);gi(o,"action")}let i=t(e,n);if(r.state()){let o=pn(i);gi(o,"state")}return i}}function pn(t,r=[]){return(mi(t)||hi(t))&&r.length===0?{path:["root"],value:t}:Object.keys(t).reduce((n,i)=>{if(n)return n;let o=t[i];return xs(o)?n:mi(o)||hi(o)||Ss(o)||Ms(o)||Is(o)||wi(o)?!1:Fs(o)?pn(o,[...r,i]):{path:[...r,i],value:o}},!1)}function gi(t,r){if(t===!1)return;let e=t.path.join("."),n=new Error(`Detected unserializable ${r} at "${e}". ${_n}#strict${r}serializability`);throw n.value=t.value,n.unserializablePath=e,n}function Ks(t,r){return function(e,n){if(r.action(n)&&!E.isInAngularZone())throw new Error(`Action '${n.type}' running outside NgZone. ${_n}#strictactionwithinngzone`);return t(e,n)}}function Zs(t){return $t()?b({strictStateSerializability:!1,strictActionSerializability:!1,strictStateImmutability:!0,strictActionImmutability:!0,strictActionWithinNgZone:!1,strictActionTypeUniqueness:!1},t):{strictStateSerializability:!1,strictActionSerializability:!1,strictStateImmutability:!1,strictActionImmutability:!1,strictActionWithinNgZone:!1,strictActionTypeUniqueness:!1}}function Ys({strictActionSerializability:t,strictStateSerializability:r}){return e=>t||r?Ws(e,{action:n=>t&&!Dn(n),state:()=>r}):e}function Xs({strictActionImmutability:t,strictStateImmutability:r}){return e=>t||r?Gs(e,{action:n=>t&&!Dn(n),state:()=>r}):e}function Dn(t){return t.type.startsWith("@ngrx")}function qs({strictActionWithinNgZone:t}){return r=>t?Ks(r,{action:e=>t&&!Dn(e)}):r}function Js(t){return[{provide:di,useValue:t},{provide:ui,useFactory:ea,deps:[di]},{provide:Ue,deps:[ui],useFactory:Zs},{provide:gt,multi:!0,deps:[Ue],useFactory:Xs},{provide:gt,multi:!0,deps:[Ue],useFactory:Ys},{provide:gt,multi:!0,deps:[Ue],useFactory:qs}]}function Qs(){return[{provide:bn,multi:!0,deps:[Ue],useFactory:ta}]}function ea(t){return t}function ta(t){if(!t.strictActionTypeUniqueness)return;let r=Object.entries(ln).filter(([,e])=>e>1).map(([e])=>e);if(r.length)throw new Error(`Action types are registered more than once, ${r.map(e=>`"${e}"`).join(", ")}. ${_n}#strictactiontypeuniqueness`)}function na(t={},r={}){return[{provide:yi,useFactory:Hs},{provide:ii,useValue:r.initialState},{provide:gn,useFactory:Ti,deps:[ii]},{provide:dn,useValue:t},{provide:si,useExisting:t instanceof l?t:dn},{provide:_i,deps:[dn,[new sr(si)]],useFactory:$s},{provide:ai,useValue:r.metaReducers?r.metaReducers:[]},{provide:ci,deps:[gt,ai],useFactory:Vs},{provide:oi,useValue:r.reducerFactory?r.reducerFactory:gs},{provide:vi,deps:[oi,ci],useFactory:Ei},ms,_s,Ds,ws,As,Js(r.runtimeChecks),Qs()]}function ra(){a(De),a(ze),a(yn),a(vn),a(yi,{optional:!0}),a(bn,{optional:!0})}var ia=[{provide:fn,useFactory:ra},Ft(()=>a(fn))];function jl(t,r){return Se([...na(t,r),ia])}function oa(){a(fn);let t=a(hs),r=a(ps),e=a(yt);a(bn,{optional:!0});let n=t.map((i,o)=>{let u=r.shift()[o];return W(b({},i),{reducers:u,initialState:Ti(i.initialState)})});e.addFeatures(n)}var Ul=[{provide:li,useFactory:oa},Ft(()=>a(li))];function zl(...t){let r=t.pop(),e=t.map(n=>n.type);return{reducer:r,types:e}}function $l(t,...r){let e=new Map;for(let n of r)for(let i of n.types){let o=e.get(i);if(o){let s=(u,c)=>n.reducer(o(u,c),c);e.set(i,s)}else e.set(i,n.reducer)}return function(n=t,i){let o=e.get(i.type);return o?o(n,i):n}}function $e(t){return t.buttons===0||t.detail===0}function Ve(t){let r=t.touches&&t.touches[0]||t.changedTouches&&t.changedTouches[0];return!!r&&r.identifier===-1&&(r.radiusX==null||r.radiusX===1)&&(r.radiusY==null||r.radiusY===1)}var En;function Ii(){if(En==null){let t=typeof document<"u"?document.head:null;En=!!(t&&(t.createShadowRoot||t.attachShadow))}return En}function wn(t){if(Ii()){let r=t.getRootNode?t.getRootNode():null;if(typeof ShadowRoot<"u"&&ShadowRoot&&r instanceof ShadowRoot)return r}return null}function sa(){let t=typeof document<"u"&&document?document.activeElement:null;for(;t&&t.shadowRoot;){let r=t.shadowRoot.activeElement;if(r===t)break;t=r}return t}function k(t){return t.composedPath?t.composedPath()[0]:t.target}var An;try{An=typeof Intl<"u"&&Intl.v8BreakIterator}catch{An=!1}var S=(()=>{class t{_platformId=a(se);isBrowser=this._platformId?Pr(this._platformId):typeof document=="object"&&!!document;EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent);TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent);BLINK=this.isBrowser&&!!(window.chrome||An)&&typeof CSS<"u"&&!this.EDGE&&!this.TRIDENT;WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT;IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window);FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent);ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT;SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT;constructor(){}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var He;function Mi(){if(He==null&&typeof window<"u")try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:()=>He=!0}))}finally{He=He||!1}return He}function Ee(t){return Mi()?t:!!t.capture}function aa(t,r=0){return Si(t)?Number(t):arguments.length===2?r:0}function Si(t){return!isNaN(parseFloat(t))&&!isNaN(Number(t))}function X(t){return t instanceof z?t.nativeElement:t}var Ri=new l("cdk-input-modality-detector-options"),Fi={ignoreKeys:[18,17,224,91,16]},xi=650,Cn={passive:!0,capture:!0},Oi=(()=>{class t{_platform=a(S);_listenerCleanups;modalityDetected;modalityChanged;get mostRecentModality(){return this._modality.value}_mostRecentTarget=null;_modality=new ie(null);_options;_lastTouchMs=0;_onKeydown=e=>{this._options?.ignoreKeys?.some(n=>n===e.keyCode)||(this._modality.next("keyboard"),this._mostRecentTarget=k(e))};_onMousedown=e=>{Date.now()-this._lastTouchMs<xi||(this._modality.next($e(e)?"keyboard":"mouse"),this._mostRecentTarget=k(e))};_onTouchstart=e=>{if(Ve(e)){this._modality.next("keyboard");return}this._lastTouchMs=Date.now(),this._modality.next("touch"),this._mostRecentTarget=k(e)};constructor(){let e=a(E),n=a(y),i=a(Ri,{optional:!0});if(this._options=b(b({},Fi),i),this.modalityDetected=this._modality.pipe(Je(1)),this.modalityChanged=this.modalityDetected.pipe(qe()),this._platform.isBrowser){let o=a(le).createRenderer(null,null);this._listenerCleanups=e.runOutsideAngular(()=>[o.listen(n,"keydown",this._onKeydown,Cn),o.listen(n,"mousedown",this._onMousedown,Cn),o.listen(n,"touchstart",this._onTouchstart,Cn)])}}ngOnDestroy(){this._modality.complete(),this._listenerCleanups?.forEach(e=>e())}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),Ge=(function(t){return t[t.IMMEDIATE=0]="IMMEDIATE",t[t.EVENTUAL=1]="EVENTUAL",t})(Ge||{}),Ni=new l("cdk-focus-monitor-default-options"),_t=Ee({passive:!0,capture:!0}),Tn=(()=>{class t{_ngZone=a(E);_platform=a(S);_inputModalityDetector=a(Oi);_origin=null;_lastFocusOrigin=null;_windowFocused=!1;_windowFocusTimeoutId;_originTimeoutId;_originFromTouchInteraction=!1;_elementInfo=new Map;_monitoredElementCount=0;_rootNodeFocusListenerCount=new Map;_detectionMode;_windowFocusListener=()=>{this._windowFocused=!0,this._windowFocusTimeoutId=setTimeout(()=>this._windowFocused=!1)};_document=a(y);_stopInputModalityDetector=new T;constructor(){let e=a(Ni,{optional:!0});this._detectionMode=e?.detectionMode||Ge.IMMEDIATE}_rootNodeFocusAndBlurListener=e=>{let n=k(e);for(let i=n;i;i=i.parentElement)e.type==="focus"?this._onFocus(e,i):this._onBlur(e,i)};monitor(e,n=!1){let i=X(e);if(!this._platform.isBrowser||i.nodeType!==1)return Me();let o=wn(i)||this._document,s=this._elementInfo.get(i);if(s)return n&&(s.checkChildren=!0),s.subject;let u={checkChildren:n,subject:new T,rootNode:o};return this._elementInfo.set(i,u),this._registerGlobalListeners(u),u.subject}stopMonitoring(e){let n=X(e),i=this._elementInfo.get(n);i&&(i.subject.complete(),this._setClasses(n),this._elementInfo.delete(n),this._removeGlobalListeners(i))}focusVia(e,n,i){let o=X(e),s=this._document.activeElement;o===s?this._getClosestElementsInfo(o).forEach(([u,c])=>this._originChanged(u,n,c)):(this._setOrigin(n),typeof o.focus=="function"&&o.focus(i))}ngOnDestroy(){this._elementInfo.forEach((e,n)=>this.stopMonitoring(n))}_getWindow(){return this._document.defaultView||window}_getFocusOrigin(e){return this._origin?this._originFromTouchInteraction?this._shouldBeAttributedToTouch(e)?"touch":"program":this._origin:this._windowFocused&&this._lastFocusOrigin?this._lastFocusOrigin:e&&this._isLastInteractionFromInputLabel(e)?"mouse":"program"}_shouldBeAttributedToTouch(e){return this._detectionMode===Ge.EVENTUAL||!!e?.contains(this._inputModalityDetector._mostRecentTarget)}_setClasses(e,n){e.classList.toggle("cdk-focused",!!n),e.classList.toggle("cdk-touch-focused",n==="touch"),e.classList.toggle("cdk-keyboard-focused",n==="keyboard"),e.classList.toggle("cdk-mouse-focused",n==="mouse"),e.classList.toggle("cdk-program-focused",n==="program")}_setOrigin(e,n=!1){this._ngZone.runOutsideAngular(()=>{if(this._origin=e,this._originFromTouchInteraction=e==="touch"&&n,this._detectionMode===Ge.IMMEDIATE){clearTimeout(this._originTimeoutId);let i=this._originFromTouchInteraction?xi:1;this._originTimeoutId=setTimeout(()=>this._origin=null,i)}})}_onFocus(e,n){let i=this._elementInfo.get(n),o=k(e);!i||!i.checkChildren&&n!==o||this._originChanged(n,this._getFocusOrigin(o),i)}_onBlur(e,n){let i=this._elementInfo.get(n);!i||i.checkChildren&&e.relatedTarget instanceof Node&&n.contains(e.relatedTarget)||(this._setClasses(n),this._emitOrigin(i,null))}_emitOrigin(e,n){e.subject.observers.length&&this._ngZone.run(()=>e.subject.next(n))}_registerGlobalListeners(e){if(!this._platform.isBrowser)return;let n=e.rootNode,i=this._rootNodeFocusListenerCount.get(n)||0;i||this._ngZone.runOutsideAngular(()=>{n.addEventListener("focus",this._rootNodeFocusAndBlurListener,_t),n.addEventListener("blur",this._rootNodeFocusAndBlurListener,_t)}),this._rootNodeFocusListenerCount.set(n,i+1),++this._monitoredElementCount===1&&(this._ngZone.runOutsideAngular(()=>{this._getWindow().addEventListener("focus",this._windowFocusListener)}),this._inputModalityDetector.modalityDetected.pipe(oe(this._stopInputModalityDetector)).subscribe(o=>{this._setOrigin(o,!0)}))}_removeGlobalListeners(e){let n=e.rootNode;if(this._rootNodeFocusListenerCount.has(n)){let i=this._rootNodeFocusListenerCount.get(n);i>1?this._rootNodeFocusListenerCount.set(n,i-1):(n.removeEventListener("focus",this._rootNodeFocusAndBlurListener,_t),n.removeEventListener("blur",this._rootNodeFocusAndBlurListener,_t),this._rootNodeFocusListenerCount.delete(n))}--this._monitoredElementCount||(this._getWindow().removeEventListener("focus",this._windowFocusListener),this._stopInputModalityDetector.next(),clearTimeout(this._windowFocusTimeoutId),clearTimeout(this._originTimeoutId))}_originChanged(e,n,i){this._setClasses(e,n),this._emitOrigin(i,n),this._lastFocusOrigin=n}_getClosestElementsInfo(e){let n=[];return this._elementInfo.forEach((i,o)=>{(o===e||i.checkChildren&&o.contains(e))&&n.push([o,i])}),n}_isLastInteractionFromInputLabel(e){let{_mostRecentTarget:n,mostRecentModality:i}=this._inputModalityDetector;if(i!=="mouse"||!n||n===e||e.nodeName!=="INPUT"&&e.nodeName!=="TEXTAREA"||e.disabled)return!1;let o=e.labels;if(o){for(let s=0;s<o.length;s++)if(o[s].contains(n))return!0}return!1}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var Dt=new WeakMap,G=(()=>{class t{_appRef;_injector=a(A);_environmentInjector=a(Re);load(e){let n=this._appRef=this._appRef||this._injector.get(Ut),i=Dt.get(n);i||(i={loaders:new Set,refs:[]},Dt.set(n,i),n.onDestroy(()=>{Dt.get(n)?.refs.forEach(o=>o.destroy()),Dt.delete(n)})),i.loaders.has(e)||(i.loaders.add(e),i.refs.push(Sr(e,{environmentInjector:this._environmentInjector})))}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var wt=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275cmp=B({type:t,selectors:[["ng-component"]],exportAs:["cdkVisuallyHidden"],decls:0,vars:0,template:function(n,i){},styles:[`.cdk-visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
  outline: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  left: 0;
}
[dir=rtl] .cdk-visually-hidden {
  left: auto;
  right: 0;
}
`],encapsulation:2,changeDetection:0})}return t})(),Et;function ca(){if(Et===void 0&&(Et=null,typeof window<"u")){let t=window;t.trustedTypes!==void 0&&(Et=t.trustedTypes.createPolicy("angular#components",{createHTML:r=>r}))}return Et}function ua(t){return ca()?.createHTML(t)||t}function ki(t,r,e){let n=e.sanitize($.HTML,r);t.innerHTML=ua(n||"")}function In(t){return Array.isArray(t)?t:[t]}var Li=new Set,ne,At=(()=>{class t{_platform=a(S);_nonce=a(ae,{optional:!0});_matchMedia;constructor(){this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):la}matchMedia(e){return(this._platform.WEBKIT||this._platform.BLINK)&&da(e,this._nonce),this._matchMedia(e)}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();function da(t,r){if(!Li.has(t))try{ne||(ne=document.createElement("style"),r&&ne.setAttribute("nonce",r),ne.setAttribute("type","text/css"),document.head.appendChild(ne)),ne.sheet&&(ne.sheet.insertRule(`@media ${t} {body{ }}`,0),Li.add(t))}catch(e){console.error(e)}}function la(t){return{matches:t==="all"||t==="",media:t,addListener:()=>{},removeListener:()=>{}}}var Mn=(()=>{class t{_mediaMatcher=a(At);_zone=a(E);_queries=new Map;_destroySubject=new T;constructor(){}ngOnDestroy(){this._destroySubject.next(),this._destroySubject.complete()}isMatched(e){return Pi(In(e)).some(i=>this._registerQuery(i).mql.matches)}observe(e){let i=Pi(In(e)).map(s=>this._registerQuery(s).observable),o=Wn(i);return o=Kn(o.pipe(Yn(1)),o.pipe(Je(1),Xe(0))),o.pipe(x(s=>{let u={matches:!1,breakpoints:{}};return s.forEach(({matches:c,query:m})=>{u.matches=u.matches||c,u.breakpoints[m]=c}),u}))}_registerQuery(e){if(this._queries.has(e))return this._queries.get(e);let n=this._mediaMatcher.matchMedia(e),o={observable:new P(s=>{let u=c=>this._zone.run(()=>s.next(c));return n.addListener(u),()=>{n.removeListener(u)}}).pipe(Qn(n),x(({matches:s})=>({query:e,matches:s})),oe(this._destroySubject)),mql:n};return this._queries.set(e,o),o}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();function Pi(t){return t.map(r=>r.split(",")).reduce((r,e)=>r.concat(e)).map(r=>r.trim())}var fa=(()=>{class t{create(e){return typeof MutationObserver>"u"?null:new MutationObserver(e)}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var Bi=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=M({type:t});static \u0275inj=I({providers:[fa]})}return t})();var ma=(()=>{class t{_platform=a(S);constructor(){}isDisabled(e){return e.hasAttribute("disabled")}isVisible(e){return pa(e)&&getComputedStyle(e).visibility==="visible"}isTabbable(e){if(!this._platform.isBrowser)return!1;let n=ha(wa(e));if(n&&(ji(n)===-1||!this.isVisible(n)))return!1;let i=e.nodeName.toLowerCase(),o=ji(e);return e.hasAttribute("contenteditable")?o!==-1:i==="iframe"||i==="object"||this._platform.WEBKIT&&this._platform.IOS&&!Da(e)?!1:i==="audio"?e.hasAttribute("controls")?o!==-1:!1:i==="video"?o===-1?!1:o!==null?!0:this._platform.FIREFOX||e.hasAttribute("controls"):e.tabIndex>=0}isFocusable(e,n){return Ea(e)&&!this.isDisabled(e)&&(n?.ignoreVisibility||this.isVisible(e))}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();function ha(t){try{return t.frameElement}catch{return null}}function pa(t){return!!(t.offsetWidth||t.offsetHeight||typeof t.getClientRects=="function"&&t.getClientRects().length)}function ga(t){let r=t.nodeName.toLowerCase();return r==="input"||r==="select"||r==="button"||r==="textarea"}function ba(t){return va(t)&&t.type=="hidden"}function ya(t){return _a(t)&&t.hasAttribute("href")}function va(t){return t.nodeName.toLowerCase()=="input"}function _a(t){return t.nodeName.toLowerCase()=="a"}function $i(t){if(!t.hasAttribute("tabindex")||t.tabIndex===void 0)return!1;let r=t.getAttribute("tabindex");return!!(r&&!isNaN(parseInt(r,10)))}function ji(t){if(!$i(t))return null;let r=parseInt(t.getAttribute("tabindex")||"",10);return isNaN(r)?-1:r}function Da(t){let r=t.nodeName.toLowerCase(),e=r==="input"&&t.type;return e==="text"||e==="password"||r==="select"||r==="textarea"}function Ea(t){return ba(t)?!1:ga(t)||ya(t)||t.hasAttribute("contenteditable")||$i(t)}function wa(t){return t.ownerDocument&&t.ownerDocument.defaultView||window}var Rn=class{_element;_checker;_ngZone;_document;_injector;_startAnchor=null;_endAnchor=null;_hasAttached=!1;startAnchorListener=()=>this.focusLastTabbableElement();endAnchorListener=()=>this.focusFirstTabbableElement();get enabled(){return this._enabled}set enabled(r){this._enabled=r,this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(r,this._startAnchor),this._toggleAnchorTabIndex(r,this._endAnchor))}_enabled=!0;constructor(r,e,n,i,o=!1,s){this._element=r,this._checker=e,this._ngZone=n,this._document=i,this._injector=s,o||this.attachAnchors()}destroy(){let r=this._startAnchor,e=this._endAnchor;r&&(r.removeEventListener("focus",this.startAnchorListener),r.remove()),e&&(e.removeEventListener("focus",this.endAnchorListener),e.remove()),this._startAnchor=this._endAnchor=null,this._hasAttached=!1}attachAnchors(){return this._hasAttached?!0:(this._ngZone.runOutsideAngular(()=>{this._startAnchor||(this._startAnchor=this._createAnchor(),this._startAnchor.addEventListener("focus",this.startAnchorListener)),this._endAnchor||(this._endAnchor=this._createAnchor(),this._endAnchor.addEventListener("focus",this.endAnchorListener))}),this._element.parentNode&&(this._element.parentNode.insertBefore(this._startAnchor,this._element),this._element.parentNode.insertBefore(this._endAnchor,this._element.nextSibling),this._hasAttached=!0),this._hasAttached)}focusInitialElementWhenReady(r){return new Promise(e=>{this._executeOnStable(()=>e(this.focusInitialElement(r)))})}focusFirstTabbableElementWhenReady(r){return new Promise(e=>{this._executeOnStable(()=>e(this.focusFirstTabbableElement(r)))})}focusLastTabbableElementWhenReady(r){return new Promise(e=>{this._executeOnStable(()=>e(this.focusLastTabbableElement(r)))})}_getRegionBoundary(r){let e=this._element.querySelectorAll(`[cdk-focus-region-${r}], [cdkFocusRegion${r}], [cdk-focus-${r}]`);return r=="start"?e.length?e[0]:this._getFirstTabbableElement(this._element):e.length?e[e.length-1]:this._getLastTabbableElement(this._element)}focusInitialElement(r){let e=this._element.querySelector("[cdk-focus-initial], [cdkFocusInitial]");if(e){if(!this._checker.isFocusable(e)){let n=this._getFirstTabbableElement(e);return n?.focus(r),!!n}return e.focus(r),!0}return this.focusFirstTabbableElement(r)}focusFirstTabbableElement(r){let e=this._getRegionBoundary("start");return e&&e.focus(r),!!e}focusLastTabbableElement(r){let e=this._getRegionBoundary("end");return e&&e.focus(r),!!e}hasAttached(){return this._hasAttached}_getFirstTabbableElement(r){if(this._checker.isFocusable(r)&&this._checker.isTabbable(r))return r;let e=r.children;for(let n=0;n<e.length;n++){let i=e[n].nodeType===this._document.ELEMENT_NODE?this._getFirstTabbableElement(e[n]):null;if(i)return i}return null}_getLastTabbableElement(r){if(this._checker.isFocusable(r)&&this._checker.isTabbable(r))return r;let e=r.children;for(let n=e.length-1;n>=0;n--){let i=e[n].nodeType===this._document.ELEMENT_NODE?this._getLastTabbableElement(e[n]):null;if(i)return i}return null}_createAnchor(){let r=this._document.createElement("div");return this._toggleAnchorTabIndex(this._enabled,r),r.classList.add("cdk-visually-hidden"),r.classList.add("cdk-focus-trap-anchor"),r.setAttribute("aria-hidden","true"),r}_toggleAnchorTabIndex(r,e){r?e.setAttribute("tabindex","0"):e.removeAttribute("tabindex")}toggleAnchors(r){this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(r,this._startAnchor),this._toggleAnchorTabIndex(r,this._endAnchor))}_executeOnStable(r){this._injector?yr(r,{injector:this._injector}):setTimeout(r)}},Aa=(()=>{class t{_checker=a(ma);_ngZone=a(E);_document=a(y);_injector=a(A);constructor(){a(G).load(wt)}create(e,n=!1){return new Rn(e,this._checker,this._ngZone,this._document,n,this._injector)}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var Vi=new l("liveAnnouncerElement",{providedIn:"root",factory:()=>null}),Hi=new l("LIVE_ANNOUNCER_DEFAULT_OPTIONS"),Ca=0,Ta=(()=>{class t{_ngZone=a(E);_defaultOptions=a(Hi,{optional:!0});_liveElement;_document=a(y);_sanitizer=a(cn);_previousTimeout;_currentPromise;_currentResolve;constructor(){let e=a(Vi,{optional:!0});this._liveElement=e||this._createLiveElement()}announce(e,...n){let i=this._defaultOptions,o,s;return n.length===1&&typeof n[0]=="number"?s=n[0]:[o,s]=n,this.clear(),clearTimeout(this._previousTimeout),o||(o=i&&i.politeness?i.politeness:"polite"),s==null&&i&&(s=i.duration),this._liveElement.setAttribute("aria-live",o),this._liveElement.id&&this._exposeAnnouncerToModals(this._liveElement.id),this._ngZone.runOutsideAngular(()=>(this._currentPromise||(this._currentPromise=new Promise(u=>this._currentResolve=u)),clearTimeout(this._previousTimeout),this._previousTimeout=setTimeout(()=>{!e||typeof e=="string"?this._liveElement.textContent=e:ki(this._liveElement,e,this._sanitizer),typeof s=="number"&&(this._previousTimeout=setTimeout(()=>this.clear(),s)),this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0},100),this._currentPromise))}clear(){this._liveElement&&(this._liveElement.textContent="")}ngOnDestroy(){clearTimeout(this._previousTimeout),this._liveElement?.remove(),this._liveElement=null,this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0}_createLiveElement(){let e="cdk-live-announcer-element",n=this._document.getElementsByClassName(e),i=this._document.createElement("div");for(let o=0;o<n.length;o++)n[o].remove();return i.classList.add(e),i.classList.add("cdk-visually-hidden"),i.setAttribute("aria-atomic","true"),i.setAttribute("aria-live","polite"),i.id=`cdk-live-announcer-${Ca++}`,this._document.body.appendChild(i),i}_exposeAnnouncerToModals(e){let n=this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');for(let i=0;i<n.length;i++){let o=n[i],s=o.getAttribute("aria-owns");s?s.indexOf(e)===-1&&o.setAttribute("aria-owns",s+" "+e):o.setAttribute("aria-owns",e)}}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var q=(function(t){return t[t.NONE=0]="NONE",t[t.BLACK_ON_WHITE=1]="BLACK_ON_WHITE",t[t.WHITE_ON_BLACK=2]="WHITE_ON_BLACK",t})(q||{}),Ui="cdk-high-contrast-black-on-white",zi="cdk-high-contrast-white-on-black",Sn="cdk-high-contrast-active",Gi=(()=>{class t{_platform=a(S);_hasCheckedHighContrastMode=!1;_document=a(y);_breakpointSubscription;constructor(){this._breakpointSubscription=a(Mn).observe("(forced-colors: active)").subscribe(()=>{this._hasCheckedHighContrastMode&&(this._hasCheckedHighContrastMode=!1,this._applyBodyHighContrastModeCssClasses())})}getHighContrastMode(){if(!this._platform.isBrowser)return q.NONE;let e=this._document.createElement("div");e.style.backgroundColor="rgb(1,2,3)",e.style.position="absolute",this._document.body.appendChild(e);let n=this._document.defaultView||window,i=n&&n.getComputedStyle?n.getComputedStyle(e):null,o=(i&&i.backgroundColor||"").replace(/ /g,"");switch(e.remove(),o){case"rgb(0,0,0)":case"rgb(45,50,54)":case"rgb(32,32,32)":return q.WHITE_ON_BLACK;case"rgb(255,255,255)":case"rgb(255,250,239)":return q.BLACK_ON_WHITE}return q.NONE}ngOnDestroy(){this._breakpointSubscription.unsubscribe()}_applyBodyHighContrastModeCssClasses(){if(!this._hasCheckedHighContrastMode&&this._platform.isBrowser&&this._document.body){let e=this._document.body.classList;e.remove(Sn,Ui,zi),this._hasCheckedHighContrastMode=!0;let n=this.getHighContrastMode();n===q.BLACK_ON_WHITE?e.add(Sn,Ui):n===q.WHITE_ON_BLACK&&e.add(Sn,zi)}}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),Ia=(()=>{class t{constructor(){a(Gi)._applyBodyHighContrastModeCssClasses()}static \u0275fac=function(n){return new(n||t)};static \u0275mod=M({type:t});static \u0275inj=I({imports:[Bi]})}return t})();var Ma=200,Ct=class{_letterKeyStream=new T;_items=[];_selectedItemIndex=-1;_pressedLetters=[];_skipPredicateFn;_selectedItem=new T;selectedItem=this._selectedItem;constructor(r,e){let n=typeof e?.debounceInterval=="number"?e.debounceInterval:Ma;e?.skipPredicate&&(this._skipPredicateFn=e.skipPredicate),this.setItems(r),this._setupKeyHandler(n)}destroy(){this._pressedLetters=[],this._letterKeyStream.complete(),this._selectedItem.complete()}setCurrentSelectedItemIndex(r){this._selectedItemIndex=r}setItems(r){this._items=r}handleKey(r){let e=r.keyCode;r.key&&r.key.length===1?this._letterKeyStream.next(r.key.toLocaleUpperCase()):(e>=65&&e<=90||e>=48&&e<=57)&&this._letterKeyStream.next(String.fromCharCode(e))}isTyping(){return this._pressedLetters.length>0}reset(){this._pressedLetters=[]}_setupKeyHandler(r){this._letterKeyStream.pipe(tr(e=>this._pressedLetters.push(e)),Xe(r),Ye(()=>this._pressedLetters.length>0),x(()=>this._pressedLetters.join("").toLocaleUpperCase())).subscribe(e=>{for(let n=1;n<this._items.length+1;n++){let i=(this._selectedItemIndex+n)%this._items.length,o=this._items[i];if(!this._skipPredicateFn?.(o)&&o.getLabel?.().toLocaleUpperCase().trim().indexOf(e)===0){this._selectedItem.next(o);break}}this._pressedLetters=[]})}};function Wi(t,...r){return r.length?r.some(e=>t[e]):t.altKey||t.shiftKey||t.ctrlKey||t.metaKey}var we=class{_items;_activeItemIndex=K(-1);_activeItem=K(null);_wrap=!1;_typeaheadSubscription=Vn.EMPTY;_itemChangesSubscription;_vertical=!0;_horizontal=null;_allowedModifierKeys=[];_homeAndEnd=!1;_pageUpAndDown={enabled:!1,delta:10};_effectRef;_typeahead;_skipPredicateFn=r=>r.disabled;constructor(r,e){this._items=r,r instanceof Pt?this._itemChangesSubscription=r.changes.subscribe(n=>this._itemsChanged(n.toArray())):nt(r)&&(this._effectRef=xe(()=>this._itemsChanged(r()),{injector:e}))}tabOut=new T;change=new T;skipPredicate(r){return this._skipPredicateFn=r,this}withWrap(r=!0){return this._wrap=r,this}withVerticalOrientation(r=!0){return this._vertical=r,this}withHorizontalOrientation(r){return this._horizontal=r,this}withAllowedModifierKeys(r){return this._allowedModifierKeys=r,this}withTypeAhead(r=200){this._typeaheadSubscription.unsubscribe();let e=this._getItemsArray();return this._typeahead=new Ct(e,{debounceInterval:typeof r=="number"?r:void 0,skipPredicate:n=>this._skipPredicateFn(n)}),this._typeaheadSubscription=this._typeahead.selectedItem.subscribe(n=>{this.setActiveItem(n)}),this}cancelTypeahead(){return this._typeahead?.reset(),this}withHomeAndEnd(r=!0){return this._homeAndEnd=r,this}withPageUpDown(r=!0,e=10){return this._pageUpAndDown={enabled:r,delta:e},this}setActiveItem(r){let e=this._activeItem();this.updateActiveItem(r),this._activeItem()!==e&&this.change.next(this._activeItemIndex())}onKeydown(r){let e=r.keyCode,i=["altKey","ctrlKey","metaKey","shiftKey"].every(o=>!r[o]||this._allowedModifierKeys.indexOf(o)>-1);switch(e){case 9:this.tabOut.next();return;case 40:if(this._vertical&&i){this.setNextItemActive();break}else return;case 38:if(this._vertical&&i){this.setPreviousItemActive();break}else return;case 39:if(this._horizontal&&i){this._horizontal==="rtl"?this.setPreviousItemActive():this.setNextItemActive();break}else return;case 37:if(this._horizontal&&i){this._horizontal==="rtl"?this.setNextItemActive():this.setPreviousItemActive();break}else return;case 36:if(this._homeAndEnd&&i){this.setFirstItemActive();break}else return;case 35:if(this._homeAndEnd&&i){this.setLastItemActive();break}else return;case 33:if(this._pageUpAndDown.enabled&&i){let o=this._activeItemIndex()-this._pageUpAndDown.delta;this._setActiveItemByIndex(o>0?o:0,1);break}else return;case 34:if(this._pageUpAndDown.enabled&&i){let o=this._activeItemIndex()+this._pageUpAndDown.delta,s=this._getItemsArray().length;this._setActiveItemByIndex(o<s?o:s-1,-1);break}else return;default:(i||Wi(r,"shiftKey"))&&this._typeahead?.handleKey(r);return}this._typeahead?.reset(),r.preventDefault()}get activeItemIndex(){return this._activeItemIndex()}get activeItem(){return this._activeItem()}isTyping(){return!!this._typeahead&&this._typeahead.isTyping()}setFirstItemActive(){this._setActiveItemByIndex(0,1)}setLastItemActive(){this._setActiveItemByIndex(this._getItemsArray().length-1,-1)}setNextItemActive(){this._activeItemIndex()<0?this.setFirstItemActive():this._setActiveItemByDelta(1)}setPreviousItemActive(){this._activeItemIndex()<0&&this._wrap?this.setLastItemActive():this._setActiveItemByDelta(-1)}updateActiveItem(r){let e=this._getItemsArray(),n=typeof r=="number"?r:e.indexOf(r),i=e[n];this._activeItem.set(i??null),this._activeItemIndex.set(n),this._typeahead?.setCurrentSelectedItemIndex(n)}destroy(){this._typeaheadSubscription.unsubscribe(),this._itemChangesSubscription?.unsubscribe(),this._effectRef?.destroy(),this._typeahead?.destroy(),this.tabOut.complete(),this.change.complete()}_setActiveItemByDelta(r){this._wrap?this._setActiveInWrapMode(r):this._setActiveInDefaultMode(r)}_setActiveInWrapMode(r){let e=this._getItemsArray();for(let n=1;n<=e.length;n++){let i=(this._activeItemIndex()+r*n+e.length)%e.length,o=e[i];if(!this._skipPredicateFn(o)){this.setActiveItem(i);return}}}_setActiveInDefaultMode(r){this._setActiveItemByIndex(this._activeItemIndex()+r,r)}_setActiveItemByIndex(r,e){let n=this._getItemsArray();if(n[r]){for(;this._skipPredicateFn(n[r]);)if(r+=e,!n[r])return;this.setActiveItem(r)}}_getItemsArray(){return nt(this._items)?this._items():this._items instanceof Pt?this._items.toArray():this._items}_itemsChanged(r){this._typeahead?.setItems(r);let e=this._activeItem();if(e){let n=r.indexOf(e);n>-1&&n!==this._activeItemIndex()&&(this._activeItemIndex.set(n),this._typeahead?.setCurrentSelectedItemIndex(n))}}};var Fn=class extends we{setActiveItem(r){this.activeItem&&this.activeItem.setInactiveStyles(),super.setActiveItem(r),this.activeItem&&this.activeItem.setActiveStyles()}};var xn=class extends we{_origin="program";setFocusOrigin(r){return this._origin=r,this}setActiveItem(r){super.setActiveItem(r),this.activeItem&&this.activeItem.focus(this._origin)}};var On={},Nn=class t{_appId=a(Q);static _infix=`a${Math.floor(Math.random()*1e5).toString()}`;getId(r,e=!1){return this._appId!=="ng"&&(r+=this._appId),On.hasOwnProperty(r)||(On[r]=0),`${r}${e?t._infix+"-":""}${On[r]++}`}static \u0275fac=function(e){return new(e||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})};var Zi=" ";function Sa(t,r,e){let n=It(t,r);e=e.trim(),!n.some(i=>i.trim()===e)&&(n.push(e),t.setAttribute(r,n.join(Zi)))}function Ra(t,r,e){let n=It(t,r);e=e.trim();let i=n.filter(o=>o!==e);i.length?t.setAttribute(r,i.join(Zi)):t.removeAttribute(r)}function It(t,r){return t.getAttribute(r)?.match(/\S+/g)??[]}var Yi="cdk-describedby-message",Tt="cdk-describedby-host",Ln=0,Nm=(()=>{class t{_platform=a(S);_document=a(y);_messageRegistry=new Map;_messagesContainer=null;_id=`${Ln++}`;constructor(){a(G).load(wt),this._id=a(Q)+"-"+Ln++}describe(e,n,i){if(!this._canBeDescribed(e,n))return;let o=kn(n,i);typeof n!="string"?(Ki(n,this._id),this._messageRegistry.set(o,{messageElement:n,referenceCount:0})):this._messageRegistry.has(o)||this._createMessageElement(n,i),this._isElementDescribedByMessage(e,o)||this._addMessageReference(e,o)}removeDescription(e,n,i){if(!n||!this._isElementNode(e))return;let o=kn(n,i);if(this._isElementDescribedByMessage(e,o)&&this._removeMessageReference(e,o),typeof n=="string"){let s=this._messageRegistry.get(o);s&&s.referenceCount===0&&this._deleteMessageElement(o)}this._messagesContainer?.childNodes.length===0&&(this._messagesContainer.remove(),this._messagesContainer=null)}ngOnDestroy(){let e=this._document.querySelectorAll(`[${Tt}="${this._id}"]`);for(let n=0;n<e.length;n++)this._removeCdkDescribedByReferenceIds(e[n]),e[n].removeAttribute(Tt);this._messagesContainer?.remove(),this._messagesContainer=null,this._messageRegistry.clear()}_createMessageElement(e,n){let i=this._document.createElement("div");Ki(i,this._id),i.textContent=e,n&&i.setAttribute("role",n),this._createMessagesContainer(),this._messagesContainer.appendChild(i),this._messageRegistry.set(kn(e,n),{messageElement:i,referenceCount:0})}_deleteMessageElement(e){this._messageRegistry.get(e)?.messageElement?.remove(),this._messageRegistry.delete(e)}_createMessagesContainer(){if(this._messagesContainer)return;let e="cdk-describedby-message-container",n=this._document.querySelectorAll(`.${e}[platform="server"]`);for(let o=0;o<n.length;o++)n[o].remove();let i=this._document.createElement("div");i.style.visibility="hidden",i.classList.add(e),i.classList.add("cdk-visually-hidden"),this._platform.isBrowser||i.setAttribute("platform","server"),this._document.body.appendChild(i),this._messagesContainer=i}_removeCdkDescribedByReferenceIds(e){let n=It(e,"aria-describedby").filter(i=>i.indexOf(Yi)!=0);e.setAttribute("aria-describedby",n.join(" "))}_addMessageReference(e,n){let i=this._messageRegistry.get(n);Sa(e,"aria-describedby",i.messageElement.id),e.setAttribute(Tt,this._id),i.referenceCount++}_removeMessageReference(e,n){let i=this._messageRegistry.get(n);i.referenceCount--,Ra(e,"aria-describedby",i.messageElement.id),e.removeAttribute(Tt)}_isElementDescribedByMessage(e,n){let i=It(e,"aria-describedby"),o=this._messageRegistry.get(n),s=o&&o.messageElement.id;return!!s&&i.indexOf(s)!=-1}_canBeDescribed(e,n){if(!this._isElementNode(e))return!1;if(n&&typeof n=="object")return!0;let i=n==null?"":`${n}`.trim(),o=e.getAttribute("aria-label");return i?!o||o.trim()!==i:!1}_isElementNode(e){return e.nodeType===this._document.ELEMENT_NODE}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();function kn(t,r){return typeof t=="string"?`${r||""}/${t}`:t}function Ki(t,r){t.id||(t.id=`${Yi}-${r}-${Ln++}`)}var We=(function(t){return t[t.NORMAL=0]="NORMAL",t[t.NEGATED=1]="NEGATED",t[t.INVERTED=2]="INVERTED",t})(We||{}),Mt,re;function $m(){if(re==null){if(typeof document!="object"||!document||typeof Element!="function"||!Element)return re=!1,re;if(document.documentElement?.style&&"scrollBehavior"in document.documentElement.style)re=!0;else{let t=Element.prototype.scrollTo;t?re=!/\{\s*\[native code\]\s*\}/.test(t.toString()):re=!1}}return re}function Vm(){if(typeof document!="object"||!document)return We.NORMAL;if(Mt==null){let t=document.createElement("div"),r=t.style;t.dir="rtl",r.width="1px",r.overflow="auto",r.visibility="hidden",r.pointerEvents="none",r.position="absolute";let e=document.createElement("div"),n=e.style;n.width="2px",n.height="1px",t.appendChild(e),document.body.appendChild(t),Mt=We.NORMAL,t.scrollLeft===0&&(t.scrollLeft=1,Mt=t.scrollLeft===0?We.NEGATED:We.INVERTED),t.remove()}return Mt}function Gm(){return typeof __karma__<"u"&&!!__karma__||typeof jasmine<"u"&&!!jasmine||typeof jest<"u"&&!!jest||typeof Mocha<"u"&&!!Mocha}var Ae,Xi=["color","button","checkbox","date","datetime-local","email","file","hidden","image","month","number","password","radio","range","reset","search","submit","tel","text","time","url","week"];function Km(){if(Ae)return Ae;if(typeof document!="object"||!document)return Ae=new Set(Xi),Ae;let t=document.createElement("input");return Ae=new Set(Xi.filter(r=>(t.setAttribute("type",r),t.type===r))),Ae}var Jm={XSmall:"(max-width: 599.98px)",Small:"(min-width: 600px) and (max-width: 959.98px)",Medium:"(min-width: 960px) and (max-width: 1279.98px)",Large:"(min-width: 1280px) and (max-width: 1919.98px)",XLarge:"(min-width: 1920px)",Handset:"(max-width: 599.98px) and (orientation: portrait), (max-width: 959.98px) and (orientation: landscape)",Tablet:"(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait), (min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",Web:"(min-width: 840px) and (orientation: portrait), (min-width: 1280px) and (orientation: landscape)",HandsetPortrait:"(max-width: 599.98px) and (orientation: portrait)",TabletPortrait:"(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait)",WebPortrait:"(min-width: 840px) and (orientation: portrait)",HandsetLandscape:"(max-width: 959.98px) and (orientation: landscape)",TabletLandscape:"(min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",WebLandscape:"(min-width: 1280px) and (orientation: landscape)"};var Fa=new l("MATERIAL_ANIMATIONS"),qi=null;function xa(){return a(Fa,{optional:!0})?.animationsDisabled||a(ur,{optional:!0})==="NoopAnimations"?"di-disabled":(qi??=a(At).matchMedia("(prefers-reduced-motion)").matches,qi?"reduced-motion":"enabled")}function Ce(){return xa()!=="enabled"}function ih(t){return t==null?"":typeof t=="string"?t:`${t}px`}function sh(t){return t!=null&&`${t}`!="false"}var O=(function(t){return t[t.FADING_IN=0]="FADING_IN",t[t.VISIBLE=1]="VISIBLE",t[t.FADING_OUT=2]="FADING_OUT",t[t.HIDDEN=3]="HIDDEN",t})(O||{}),Pn=class{_renderer;element;config;_animationForciblyDisabledThroughCss;state=O.HIDDEN;constructor(r,e,n,i=!1){this._renderer=r,this.element=e,this.config=n,this._animationForciblyDisabledThroughCss=i}fadeOut(){this._renderer.fadeOutRipple(this)}},Ji=Ee({passive:!0,capture:!0}),Bn=class{_events=new Map;addHandler(r,e,n,i){let o=this._events.get(e);if(o){let s=o.get(n);s?s.add(i):o.set(n,new Set([i]))}else this._events.set(e,new Map([[n,new Set([i])]])),r.runOutsideAngular(()=>{document.addEventListener(e,this._delegateEventHandler,Ji)})}removeHandler(r,e,n){let i=this._events.get(r);if(!i)return;let o=i.get(e);o&&(o.delete(n),o.size===0&&i.delete(e),i.size===0&&(this._events.delete(r),document.removeEventListener(r,this._delegateEventHandler,Ji)))}_delegateEventHandler=r=>{let e=k(r);e&&this._events.get(r.type)?.forEach((n,i)=>{(i===e||i.contains(e))&&n.forEach(o=>o.handleEvent(r))})}},Ke={enterDuration:225,exitDuration:150},Oa=800,Qi=Ee({passive:!0,capture:!0}),eo=["mousedown","touchstart"],to=["mouseup","mouseleave","touchend","touchcancel"],Na=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275cmp=B({type:t,selectors:[["ng-component"]],hostAttrs:["mat-ripple-style-loader",""],decls:0,vars:0,template:function(n,i){},styles:[`.mat-ripple {
  overflow: hidden;
  position: relative;
}
.mat-ripple:not(:empty) {
  transform: translateZ(0);
}

.mat-ripple.mat-ripple-unbounded {
  overflow: visible;
}

.mat-ripple-element {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1);
  transform: scale3d(0, 0, 0);
  background-color: var(--mat-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent));
}
@media (forced-colors: active) {
  .mat-ripple-element {
    display: none;
  }
}
.cdk-drag-preview .mat-ripple-element, .cdk-drag-placeholder .mat-ripple-element {
  display: none;
}
`],encapsulation:2,changeDetection:0})}return t})(),Ze=class t{_target;_ngZone;_platform;_containerElement;_triggerElement=null;_isPointerDown=!1;_activeRipples=new Map;_mostRecentTransientRipple=null;_lastTouchStartEvent;_pointerUpEventsRegistered=!1;_containerRect=null;static _eventManager=new Bn;constructor(r,e,n,i,o){this._target=r,this._ngZone=e,this._platform=i,i.isBrowser&&(this._containerElement=X(n)),o&&o.get(G).load(Na)}fadeInRipple(r,e,n={}){let i=this._containerRect=this._containerRect||this._containerElement.getBoundingClientRect(),o=b(b({},Ke),n.animation);n.centered&&(r=i.left+i.width/2,e=i.top+i.height/2);let s=n.radius||ka(r,e,i),u=r-i.left,c=e-i.top,m=o.enterDuration,f=document.createElement("div");f.classList.add("mat-ripple-element"),f.style.left=`${u-s}px`,f.style.top=`${c-s}px`,f.style.height=`${s*2}px`,f.style.width=`${s*2}px`,n.color!=null&&(f.style.backgroundColor=n.color),f.style.transitionDuration=`${m}ms`,this._containerElement.appendChild(f);let p=window.getComputedStyle(f),C=p.transitionProperty,L=p.transitionDuration,N=C==="none"||L==="0s"||L==="0s, 0s"||i.width===0&&i.height===0,F=new Pn(this,f,n,N);f.style.transform="scale3d(1, 1, 1)",F.state=O.FADING_IN,n.persistent||(this._mostRecentTransientRipple=F);let g=null;return!N&&(m||o.exitDuration)&&this._ngZone.runOutsideAngular(()=>{let v=()=>{g&&(g.fallbackTimer=null),clearTimeout(U),this._finishRippleTransition(F)},R=()=>this._destroyRipple(F),U=setTimeout(R,m+100);f.addEventListener("transitionend",v),f.addEventListener("transitioncancel",R),g={onTransitionEnd:v,onTransitionCancel:R,fallbackTimer:U}}),this._activeRipples.set(F,g),(N||!m)&&this._finishRippleTransition(F),F}fadeOutRipple(r){if(r.state===O.FADING_OUT||r.state===O.HIDDEN)return;let e=r.element,n=b(b({},Ke),r.config.animation);e.style.transitionDuration=`${n.exitDuration}ms`,e.style.opacity="0",r.state=O.FADING_OUT,(r._animationForciblyDisabledThroughCss||!n.exitDuration)&&this._finishRippleTransition(r)}fadeOutAll(){this._getActiveRipples().forEach(r=>r.fadeOut())}fadeOutAllNonPersistent(){this._getActiveRipples().forEach(r=>{r.config.persistent||r.fadeOut()})}setupTriggerEvents(r){let e=X(r);!this._platform.isBrowser||!e||e===this._triggerElement||(this._removeTriggerEvents(),this._triggerElement=e,eo.forEach(n=>{t._eventManager.addHandler(this._ngZone,n,e,this)}))}handleEvent(r){r.type==="mousedown"?this._onMousedown(r):r.type==="touchstart"?this._onTouchStart(r):this._onPointerUp(),this._pointerUpEventsRegistered||(this._ngZone.runOutsideAngular(()=>{to.forEach(e=>{this._triggerElement.addEventListener(e,this,Qi)})}),this._pointerUpEventsRegistered=!0)}_finishRippleTransition(r){r.state===O.FADING_IN?this._startFadeOutTransition(r):r.state===O.FADING_OUT&&this._destroyRipple(r)}_startFadeOutTransition(r){let e=r===this._mostRecentTransientRipple,{persistent:n}=r.config;r.state=O.VISIBLE,!n&&(!e||!this._isPointerDown)&&r.fadeOut()}_destroyRipple(r){let e=this._activeRipples.get(r)??null;this._activeRipples.delete(r),this._activeRipples.size||(this._containerRect=null),r===this._mostRecentTransientRipple&&(this._mostRecentTransientRipple=null),r.state=O.HIDDEN,e!==null&&(r.element.removeEventListener("transitionend",e.onTransitionEnd),r.element.removeEventListener("transitioncancel",e.onTransitionCancel),e.fallbackTimer!==null&&clearTimeout(e.fallbackTimer)),r.element.remove()}_onMousedown(r){let e=$e(r),n=this._lastTouchStartEvent&&Date.now()<this._lastTouchStartEvent+Oa;!this._target.rippleDisabled&&!e&&!n&&(this._isPointerDown=!0,this.fadeInRipple(r.clientX,r.clientY,this._target.rippleConfig))}_onTouchStart(r){if(!this._target.rippleDisabled&&!Ve(r)){this._lastTouchStartEvent=Date.now(),this._isPointerDown=!0;let e=r.changedTouches;if(e)for(let n=0;n<e.length;n++)this.fadeInRipple(e[n].clientX,e[n].clientY,this._target.rippleConfig)}}_onPointerUp(){this._isPointerDown&&(this._isPointerDown=!1,this._getActiveRipples().forEach(r=>{let e=r.state===O.VISIBLE||r.config.terminateOnPointerUp&&r.state===O.FADING_IN;!r.config.persistent&&e&&r.fadeOut()}))}_getActiveRipples(){return Array.from(this._activeRipples.keys())}_removeTriggerEvents(){let r=this._triggerElement;r&&(eo.forEach(e=>t._eventManager.removeHandler(e,r,this)),this._pointerUpEventsRegistered&&(to.forEach(e=>r.removeEventListener(e,this,Qi)),this._pointerUpEventsRegistered=!1))}};function ka(t,r,e){let n=Math.max(Math.abs(t-e.left),Math.abs(t-e.right)),i=Math.max(Math.abs(r-e.top),Math.abs(r-e.bottom));return Math.sqrt(n*n+i*i)}var jn=new l("mat-ripple-global-options"),_h=(()=>{class t{_elementRef=a(z);_animationsDisabled=Ce();color;unbounded=!1;centered=!1;radius=0;animation;get disabled(){return this._disabled}set disabled(e){e&&this.fadeOutAllNonPersistent(),this._disabled=e,this._setupTriggerEventsIfEnabled()}_disabled=!1;get trigger(){return this._trigger||this._elementRef.nativeElement}set trigger(e){this._trigger=e,this._setupTriggerEventsIfEnabled()}_trigger;_rippleRenderer;_globalOptions;_isInitialized=!1;constructor(){let e=a(E),n=a(S),i=a(jn,{optional:!0}),o=a(A);this._globalOptions=i||{},this._rippleRenderer=new Ze(this,e,this._elementRef,n,o)}ngOnInit(){this._isInitialized=!0,this._setupTriggerEventsIfEnabled()}ngOnDestroy(){this._rippleRenderer._removeTriggerEvents()}fadeOutAll(){this._rippleRenderer.fadeOutAll()}fadeOutAllNonPersistent(){this._rippleRenderer.fadeOutAllNonPersistent()}get rippleConfig(){return{centered:this.centered,radius:this.radius,color:this.color,animation:b(b(b({},this._globalOptions.animation),this._animationsDisabled?{enterDuration:0,exitDuration:0}:{}),this.animation),terminateOnPointerUp:this._globalOptions.terminateOnPointerUp}}get rippleDisabled(){return this.disabled||!!this._globalOptions.disabled}_setupTriggerEventsIfEnabled(){!this.disabled&&this._isInitialized&&this._rippleRenderer.setupTriggerEvents(this.trigger)}launch(e,n=0,i){return typeof e=="number"?this._rippleRenderer.fadeInRipple(e,n,b(b({},this.rippleConfig),i)):this._rippleRenderer.fadeInRipple(0,0,b(b({},this.rippleConfig),e))}static \u0275fac=function(n){return new(n||t)};static \u0275dir=j({type:t,selectors:[["","mat-ripple",""],["","matRipple",""]],hostAttrs:[1,"mat-ripple"],hostVars:2,hostBindings:function(n,i){n&2&&he("mat-ripple-unbounded",i.unbounded)},inputs:{color:[0,"matRippleColor","color"],unbounded:[0,"matRippleUnbounded","unbounded"],centered:[0,"matRippleCentered","centered"],radius:[0,"matRippleRadius","radius"],animation:[0,"matRippleAnimation","animation"],disabled:[0,"matRippleDisabled","disabled"],trigger:[0,"matRippleTrigger","trigger"]},exportAs:["matRipple"]})}return t})();var La={capture:!0},Pa=["focus","mousedown","mouseenter","touchstart"],Un="mat-ripple-loader-uninitialized",zn="mat-ripple-loader-class-name",no="mat-ripple-loader-centered",St="mat-ripple-loader-disabled",ro=(()=>{class t{_document=a(y);_animationsDisabled=Ce();_globalRippleOptions=a(jn,{optional:!0});_platform=a(S);_ngZone=a(E);_injector=a(A);_eventCleanups;_hosts=new Map;constructor(){let e=a(le).createRenderer(null,null);this._eventCleanups=this._ngZone.runOutsideAngular(()=>Pa.map(n=>e.listen(this._document,n,this._onInteraction,La)))}ngOnDestroy(){let e=this._hosts.keys();for(let n of e)this.destroyRipple(n);this._eventCleanups.forEach(n=>n())}configureRipple(e,n){e.setAttribute(Un,this._globalRippleOptions?.namespace??""),(n.className||!e.hasAttribute(zn))&&e.setAttribute(zn,n.className||""),n.centered&&e.setAttribute(no,""),n.disabled&&e.setAttribute(St,"")}setDisabled(e,n){let i=this._hosts.get(e);i?(i.target.rippleDisabled=n,!n&&!i.hasSetUpEvents&&(i.hasSetUpEvents=!0,i.renderer.setupTriggerEvents(e))):n?e.setAttribute(St,""):e.removeAttribute(St)}_onInteraction=e=>{let n=k(e);if(n instanceof HTMLElement){let i=n.closest(`[${Un}="${this._globalRippleOptions?.namespace??""}"]`);i&&this._createRipple(i)}};_createRipple(e){if(!this._document||this._hosts.has(e))return;e.querySelector(".mat-ripple")?.remove();let n=this._document.createElement("span");n.classList.add("mat-ripple",e.getAttribute(zn)),e.append(n);let i=this._globalRippleOptions,o=this._animationsDisabled?0:i?.animation?.enterDuration??Ke.enterDuration,s=this._animationsDisabled?0:i?.animation?.exitDuration??Ke.exitDuration,u={rippleDisabled:this._animationsDisabled||i?.disabled||e.hasAttribute(St),rippleConfig:{centered:e.hasAttribute(no),terminateOnPointerUp:i?.terminateOnPointerUp,animation:{enterDuration:o,exitDuration:s}}},c=new Ze(u,this._ngZone,n,this._platform,this._injector),m=!u.rippleDisabled;m&&c.setupTriggerEvents(e),this._hosts.set(e,{target:u,renderer:c,hasSetUpEvents:m}),e.removeAttribute(Un)}destroyRipple(e){let n=this._hosts.get(e);n&&(n.renderer._removeTriggerEvents(),this._hosts.delete(e))}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var io=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275cmp=B({type:t,selectors:[["structural-styles"]],decls:0,vars:0,template:function(n,i){},styles:[`.mat-focus-indicator {
  position: relative;
}
.mat-focus-indicator::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  box-sizing: border-box;
  pointer-events: none;
  display: var(--mat-focus-indicator-display, none);
  border-width: var(--mat-focus-indicator-border-width, 3px);
  border-style: var(--mat-focus-indicator-border-style, solid);
  border-color: var(--mat-focus-indicator-border-color, transparent);
  border-radius: var(--mat-focus-indicator-border-radius, 4px);
}
.mat-focus-indicator:focus-visible::before {
  content: "";
}

@media (forced-colors: active) {
  html {
    --mat-focus-indicator-display: block;
  }
}
`],encapsulation:2,changeDetection:0})}return t})();var Ba=["mat-icon-button",""],ja=["*"],Ua=new l("MAT_BUTTON_CONFIG");function oo(t){return t==null?void 0:Mr(t)}var $n=(()=>{class t{_elementRef=a(z);_ngZone=a(E);_animationsDisabled=Ce();_config=a(Ua,{optional:!0});_focusMonitor=a(Tn);_cleanupClick;_renderer=a(Bt);_rippleLoader=a(ro);_isAnchor;_isFab=!1;color;get disableRipple(){return this._disableRipple}set disableRipple(e){this._disableRipple=e,this._updateRippleDisabled()}_disableRipple=!1;get disabled(){return this._disabled}set disabled(e){this._disabled=e,this._updateRippleDisabled()}_disabled=!1;ariaDisabled;disabledInteractive;tabIndex;set _tabindex(e){this.tabIndex=e}constructor(){a(G).load(io);let e=this._elementRef.nativeElement;this._isAnchor=e.tagName==="A",this.disabledInteractive=this._config?.disabledInteractive??!1,this.color=this._config?.color??null,this._rippleLoader?.configureRipple(e,{className:"mat-mdc-button-ripple"})}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0),this._isAnchor&&this._setupAsAnchor()}ngOnDestroy(){this._cleanupClick?.(),this._focusMonitor.stopMonitoring(this._elementRef),this._rippleLoader?.destroyRipple(this._elementRef.nativeElement)}focus(e="program",n){e?this._focusMonitor.focusVia(this._elementRef.nativeElement,e,n):this._elementRef.nativeElement.focus(n)}_getAriaDisabled(){return this.ariaDisabled!=null?this.ariaDisabled:this._isAnchor?this.disabled||null:this.disabled&&this.disabledInteractive?!0:null}_getDisabledAttribute(){return this.disabledInteractive||!this.disabled?null:!0}_updateRippleDisabled(){this._rippleLoader?.setDisabled(this._elementRef.nativeElement,this.disableRipple||this.disabled)}_getTabIndex(){return this._isAnchor?this.disabled&&!this.disabledInteractive?-1:this.tabIndex:this.tabIndex}_setupAsAnchor(){this._cleanupClick=this._ngZone.runOutsideAngular(()=>this._renderer.listen(this._elementRef.nativeElement,"click",e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}))}static \u0275fac=function(n){return new(n||t)};static \u0275dir=j({type:t,hostAttrs:[1,"mat-mdc-button-base"],hostVars:13,hostBindings:function(n,i){n&2&&(zt("disabled",i._getDisabledAttribute())("aria-disabled",i._getAriaDisabled())("tabindex",i._getTabIndex()),Cr(i.color?"mat-"+i.color:""),he("mat-mdc-button-disabled",i.disabled)("mat-mdc-button-disabled-interactive",i.disabledInteractive)("mat-unthemed",!i.color)("_mat-animation-noopable",i._animationsDisabled))},inputs:{color:"color",disableRipple:[2,"disableRipple","disableRipple",ge],disabled:[2,"disabled","disabled",ge],ariaDisabled:[2,"aria-disabled","ariaDisabled",ge],disabledInteractive:[2,"disabledInteractive","disabledInteractive",ge],tabIndex:[2,"tabIndex","tabIndex",oo],_tabindex:[2,"tabindex","_tabindex",oo]}})}return t})(),za=(()=>{class t extends $n{constructor(){super(),this._rippleLoader.configureRipple(this._elementRef.nativeElement,{centered:!0})}static \u0275fac=function(n){return new(n||t)};static \u0275cmp=B({type:t,selectors:[["button","mat-icon-button",""],["a","mat-icon-button",""],["button","matIconButton",""],["a","matIconButton",""]],hostAttrs:[1,"mdc-icon-button","mat-mdc-icon-button"],exportAs:["matButton","matAnchor"],features:[tt],attrs:Ba,ngContentSelectors:ja,decls:4,vars:0,consts:[[1,"mat-mdc-button-persistent-ripple","mdc-icon-button__ripple"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(n,i){n&1&&(rt(),fe(0,"span",0),me(1),fe(2,"span",1)(3,"span",2))},styles:[`.mat-mdc-icon-button {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: transparent;
  fill: currentColor;
  text-decoration: none;
  cursor: pointer;
  z-index: 0;
  overflow: visible;
  border-radius: var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%));
  flex-shrink: 0;
  text-align: center;
  width: var(--mat-icon-button-state-layer-size, 40px);
  height: var(--mat-icon-button-state-layer-size, 40px);
  padding: calc(calc(var(--mat-icon-button-state-layer-size, 40px) - var(--mat-icon-button-icon-size, 24px)) / 2);
  font-size: var(--mat-icon-button-icon-size, 24px);
  color: var(--mat-icon-button-icon-color, var(--mat-sys-on-surface-variant));
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-icon-button .mat-mdc-button-ripple,
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}
.mat-mdc-icon-button .mat-mdc-button-ripple {
  overflow: hidden;
}
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {
  content: "";
  opacity: 0;
}
.mat-mdc-icon-button .mdc-button__label,
.mat-mdc-icon-button .mat-icon {
  z-index: 1;
  position: relative;
}
.mat-mdc-icon-button .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
}
.mat-mdc-icon-button:focus-visible > .mat-focus-indicator::before {
  content: "";
  border-radius: inherit;
}
.mat-mdc-icon-button .mat-ripple-element {
  background-color: var(--mat-icon-button-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface-variant) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-icon-button-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-icon-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-icon-button-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-icon-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-icon-button-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-icon-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-icon-button-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-icon-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-icon-button-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-icon-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-icon-button-touch-target-size, 48px);
  display: var(--mat-icon-button-touch-target-display, block);
  left: 50%;
  width: var(--mat-icon-button-touch-target-size, 48px);
  transform: translate(-50%, -50%);
}
.mat-mdc-icon-button._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-icon-button[disabled], .mat-mdc-icon-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-icon-button-disabled-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-icon-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-icon-button img,
.mat-mdc-icon-button svg {
  width: var(--mat-icon-button-icon-size, 24px);
  height: var(--mat-icon-button-icon-size, 24px);
  vertical-align: baseline;
}
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple {
  border-radius: var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%));
}
.mat-mdc-icon-button[hidden] {
  display: none;
}
.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before {
  background: transparent;
  opacity: 1;
}
`,`@media (forced-colors: active) {
  .mat-mdc-button:not(.mdc-button--outlined),
  .mat-mdc-unelevated-button:not(.mdc-button--outlined),
  .mat-mdc-raised-button:not(.mdc-button--outlined),
  .mat-mdc-outlined-button:not(.mdc-button--outlined),
  .mat-mdc-button-base.mat-tonal-button,
  .mat-mdc-icon-button.mat-mdc-icon-button,
  .mat-mdc-outlined-button .mdc-button__ripple {
    outline: solid 1px;
  }
}
`],encapsulation:2,changeDetection:0})}return t})();var $a=new l("cdk-dir-doc",{providedIn:"root",factory:()=>a(y)}),Va=/^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;function so(t){let r=t?.toLowerCase()||"";return r==="auto"&&typeof navigator<"u"&&navigator?.language?Va.test(navigator.language)?"rtl":"ltr":r==="rtl"?"rtl":"ltr"}var Ha=(()=>{class t{get value(){return this.valueSignal()}valueSignal=K("ltr");change=new xt;constructor(){let e=a($a,{optional:!0});if(e){let n=e.body?e.body.dir:null,i=e.documentElement?e.documentElement.dir:null;this.valueSignal.set(so(n||i||"ltr"))}}ngOnDestroy(){this.change.complete()}static \u0275fac=function(n){return new(n||t)};static \u0275prov=d({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var Rt=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=M({type:t});static \u0275inj=I({})}return t})();var ao=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=M({type:t});static \u0275inj=I({imports:[Rt]})}return t})();var Ga=["matButton",""],Wa=[[["",8,"material-icons",3,"iconPositionEnd",""],["mat-icon",3,"iconPositionEnd",""],["","matButtonIcon","",3,"iconPositionEnd",""]],"*",[["","iconPositionEnd","",8,"material-icons"],["mat-icon","iconPositionEnd",""],["","matButtonIcon","","iconPositionEnd",""]]],Ka=[".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])","*",".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"];var co=new Map([["text",["mat-mdc-button"]],["filled",["mdc-button--unelevated","mat-mdc-unelevated-button"]],["elevated",["mdc-button--raised","mat-mdc-raised-button"]],["outlined",["mdc-button--outlined","mat-mdc-outlined-button"]],["tonal",["mat-tonal-button"]]]),Qh=(()=>{class t extends $n{get appearance(){return this._appearance}set appearance(e){this.setAppearance(e||this._config?.defaultAppearance||"text")}_appearance=null;constructor(){super();let e=Za(this._elementRef.nativeElement);e&&this.setAppearance(e)}setAppearance(e){if(e===this._appearance)return;let n=this._elementRef.nativeElement.classList,i=this._appearance?co.get(this._appearance):null,o=co.get(e);i&&n.remove(...i),n.add(...o),this._appearance=e}static \u0275fac=function(n){return new(n||t)};static \u0275cmp=B({type:t,selectors:[["button","matButton",""],["a","matButton",""],["button","mat-button",""],["button","mat-raised-button",""],["button","mat-flat-button",""],["button","mat-stroked-button",""],["a","mat-button",""],["a","mat-raised-button",""],["a","mat-flat-button",""],["a","mat-stroked-button",""]],hostAttrs:[1,"mdc-button"],inputs:{appearance:[0,"matButton","appearance"]},exportAs:["matButton","matAnchor"],features:[tt],attrs:Ga,ngContentSelectors:Ka,decls:7,vars:4,consts:[[1,"mat-mdc-button-persistent-ripple"],[1,"mdc-button__label"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(n,i){n&1&&(rt(Wa),fe(0,"span",0),me(1),wr(2,"span",1),me(3,1),Ar(),me(4,2),fe(5,"span",2)(6,"span",3)),n&2&&he("mdc-button__ripple",!i._isFab)("mdc-fab__ripple",i._isFab)},styles:[`.mat-mdc-button-base {
  text-decoration: none;
}
.mat-mdc-button-base .mat-icon {
  min-height: fit-content;
  flex-shrink: 0;
}
@media (hover: none) {
  .mat-mdc-button-base:hover > span.mat-mdc-button-persistent-ripple::before {
    opacity: 0;
  }
}

.mdc-button {
  -webkit-user-select: none;
  user-select: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 64px;
  border: none;
  outline: none;
  line-height: inherit;
  -webkit-appearance: none;
  overflow: visible;
  vertical-align: middle;
  background: transparent;
  padding: 0 8px;
}
.mdc-button::-moz-focus-inner {
  padding: 0;
  border: 0;
}
.mdc-button:active {
  outline: none;
}
.mdc-button:hover {
  cursor: pointer;
}
.mdc-button:disabled {
  cursor: default;
  pointer-events: none;
}
.mdc-button[hidden] {
  display: none;
}
.mdc-button .mdc-button__label {
  position: relative;
}

.mat-mdc-button {
  padding: 0 var(--mat-button-text-horizontal-padding, 12px);
  height: var(--mat-button-text-container-height, 40px);
  font-family: var(--mat-button-text-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-text-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-text-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-text-label-text-transform);
  font-weight: var(--mat-button-text-label-text-weight, var(--mat-sys-label-large-weight));
}
.mat-mdc-button, .mat-mdc-button .mdc-button__ripple {
  border-radius: var(--mat-button-text-container-shape, var(--mat-sys-corner-full));
}
.mat-mdc-button:not(:disabled) {
  color: var(--mat-button-text-label-text-color, var(--mat-sys-primary));
}
.mat-mdc-button[disabled], .mat-mdc-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-text-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-button:has(.material-icons, mat-icon, [matButtonIcon]) {
  padding: 0 var(--mat-button-text-with-icon-horizontal-padding, 16px);
}
.mat-mdc-button > .mat-icon {
  margin-right: var(--mat-button-text-icon-spacing, 8px);
  margin-left: var(--mat-button-text-icon-offset, -4px);
}
[dir=rtl] .mat-mdc-button > .mat-icon {
  margin-right: var(--mat-button-text-icon-offset, -4px);
  margin-left: var(--mat-button-text-icon-spacing, 8px);
}
.mat-mdc-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-text-icon-offset, -4px);
  margin-left: var(--mat-button-text-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-text-icon-spacing, 8px);
  margin-left: var(--mat-button-text-icon-offset, -4px);
}
.mat-mdc-button .mat-ripple-element {
  background-color: var(--mat-button-text-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-text-state-layer-color, var(--mat-sys-primary));
}
.mat-mdc-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-text-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-text-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-text-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-text-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-text-touch-target-size, 48px);
  display: var(--mat-button-text-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.mat-mdc-unelevated-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--mat-button-filled-container-height, 40px);
  font-family: var(--mat-button-filled-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-filled-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-filled-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-filled-label-text-transform);
  font-weight: var(--mat-button-filled-label-text-weight, var(--mat-sys-label-large-weight));
  padding: 0 var(--mat-button-filled-horizontal-padding, 24px);
}
.mat-mdc-unelevated-button > .mat-icon {
  margin-right: var(--mat-button-filled-icon-spacing, 8px);
  margin-left: var(--mat-button-filled-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-unelevated-button > .mat-icon {
  margin-right: var(--mat-button-filled-icon-offset, -8px);
  margin-left: var(--mat-button-filled-icon-spacing, 8px);
}
.mat-mdc-unelevated-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-filled-icon-offset, -8px);
  margin-left: var(--mat-button-filled-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-unelevated-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-filled-icon-spacing, 8px);
  margin-left: var(--mat-button-filled-icon-offset, -8px);
}
.mat-mdc-unelevated-button .mat-ripple-element {
  background-color: var(--mat-button-filled-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-filled-state-layer-color, var(--mat-sys-on-primary));
}
.mat-mdc-unelevated-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-filled-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-unelevated-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-filled-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-unelevated-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-filled-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-unelevated-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-filled-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-unelevated-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-filled-touch-target-size, 48px);
  display: var(--mat-button-filled-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-unelevated-button:not(:disabled) {
  color: var(--mat-button-filled-label-text-color, var(--mat-sys-on-primary));
  background-color: var(--mat-button-filled-container-color, var(--mat-sys-primary));
}
.mat-mdc-unelevated-button, .mat-mdc-unelevated-button .mdc-button__ripple {
  border-radius: var(--mat-button-filled-container-shape, var(--mat-sys-corner-full));
}
.mat-mdc-unelevated-button[disabled], .mat-mdc-unelevated-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-raised-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--mat-button-protected-container-elevation-shadow, var(--mat-sys-level1));
  height: var(--mat-button-protected-container-height, 40px);
  font-family: var(--mat-button-protected-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-protected-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-protected-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-protected-label-text-transform);
  font-weight: var(--mat-button-protected-label-text-weight, var(--mat-sys-label-large-weight));
  padding: 0 var(--mat-button-protected-horizontal-padding, 24px);
}
.mat-mdc-raised-button > .mat-icon {
  margin-right: var(--mat-button-protected-icon-spacing, 8px);
  margin-left: var(--mat-button-protected-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-raised-button > .mat-icon {
  margin-right: var(--mat-button-protected-icon-offset, -8px);
  margin-left: var(--mat-button-protected-icon-spacing, 8px);
}
.mat-mdc-raised-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-protected-icon-offset, -8px);
  margin-left: var(--mat-button-protected-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-raised-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-protected-icon-spacing, 8px);
  margin-left: var(--mat-button-protected-icon-offset, -8px);
}
.mat-mdc-raised-button .mat-ripple-element {
  background-color: var(--mat-button-protected-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-protected-state-layer-color, var(--mat-sys-primary));
}
.mat-mdc-raised-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-protected-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-raised-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-protected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-raised-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-protected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-raised-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-protected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-raised-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-protected-touch-target-size, 48px);
  display: var(--mat-button-protected-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-raised-button:not(:disabled) {
  color: var(--mat-button-protected-label-text-color, var(--mat-sys-primary));
  background-color: var(--mat-button-protected-container-color, var(--mat-sys-surface));
}
.mat-mdc-raised-button, .mat-mdc-raised-button .mdc-button__ripple {
  border-radius: var(--mat-button-protected-container-shape, var(--mat-sys-corner-full));
}
@media (hover: hover) {
  .mat-mdc-raised-button:hover {
    box-shadow: var(--mat-button-protected-hover-container-elevation-shadow, var(--mat-sys-level2));
  }
}
.mat-mdc-raised-button:focus {
  box-shadow: var(--mat-button-protected-focus-container-elevation-shadow, var(--mat-sys-level1));
}
.mat-mdc-raised-button:active, .mat-mdc-raised-button:focus:active {
  box-shadow: var(--mat-button-protected-pressed-container-elevation-shadow, var(--mat-sys-level1));
}
.mat-mdc-raised-button[disabled], .mat-mdc-raised-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-protected-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-protected-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-raised-button[disabled].mat-mdc-button-disabled, .mat-mdc-raised-button.mat-mdc-button-disabled.mat-mdc-button-disabled {
  box-shadow: var(--mat-button-protected-disabled-container-elevation-shadow, var(--mat-sys-level0));
}
.mat-mdc-raised-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-outlined-button {
  border-style: solid;
  transition: border 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--mat-button-outlined-container-height, 40px);
  font-family: var(--mat-button-outlined-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-outlined-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-outlined-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-outlined-label-text-transform);
  font-weight: var(--mat-button-outlined-label-text-weight, var(--mat-sys-label-large-weight));
  border-radius: var(--mat-button-outlined-container-shape, var(--mat-sys-corner-full));
  border-width: var(--mat-button-outlined-outline-width, 1px);
  padding: 0 var(--mat-button-outlined-horizontal-padding, 24px);
}
.mat-mdc-outlined-button > .mat-icon {
  margin-right: var(--mat-button-outlined-icon-spacing, 8px);
  margin-left: var(--mat-button-outlined-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-outlined-button > .mat-icon {
  margin-right: var(--mat-button-outlined-icon-offset, -8px);
  margin-left: var(--mat-button-outlined-icon-spacing, 8px);
}
.mat-mdc-outlined-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-outlined-icon-offset, -8px);
  margin-left: var(--mat-button-outlined-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-outlined-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-outlined-icon-spacing, 8px);
  margin-left: var(--mat-button-outlined-icon-offset, -8px);
}
.mat-mdc-outlined-button .mat-ripple-element {
  background-color: var(--mat-button-outlined-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-outlined-state-layer-color, var(--mat-sys-primary));
}
.mat-mdc-outlined-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-outlined-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-outlined-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-outlined-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-outlined-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-outlined-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-outlined-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-outlined-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-outlined-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-outlined-touch-target-size, 48px);
  display: var(--mat-button-outlined-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-outlined-button:not(:disabled) {
  color: var(--mat-button-outlined-label-text-color, var(--mat-sys-primary));
  border-color: var(--mat-button-outlined-outline-color, var(--mat-sys-outline));
}
.mat-mdc-outlined-button[disabled], .mat-mdc-outlined-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  border-color: var(--mat-button-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-tonal-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--mat-button-tonal-container-height, 40px);
  font-family: var(--mat-button-tonal-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-tonal-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-tonal-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-tonal-label-text-transform);
  font-weight: var(--mat-button-tonal-label-text-weight, var(--mat-sys-label-large-weight));
  padding: 0 var(--mat-button-tonal-horizontal-padding, 24px);
}
.mat-tonal-button:not(:disabled) {
  color: var(--mat-button-tonal-label-text-color, var(--mat-sys-on-secondary-container));
  background-color: var(--mat-button-tonal-container-color, var(--mat-sys-secondary-container));
}
.mat-tonal-button, .mat-tonal-button .mdc-button__ripple {
  border-radius: var(--mat-button-tonal-container-shape, var(--mat-sys-corner-full));
}
.mat-tonal-button[disabled], .mat-tonal-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-tonal-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-tonal-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-tonal-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-tonal-button > .mat-icon {
  margin-right: var(--mat-button-tonal-icon-spacing, 8px);
  margin-left: var(--mat-button-tonal-icon-offset, -8px);
}
[dir=rtl] .mat-tonal-button > .mat-icon {
  margin-right: var(--mat-button-tonal-icon-offset, -8px);
  margin-left: var(--mat-button-tonal-icon-spacing, 8px);
}
.mat-tonal-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-tonal-icon-offset, -8px);
  margin-left: var(--mat-button-tonal-icon-spacing, 8px);
}
[dir=rtl] .mat-tonal-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-tonal-icon-spacing, 8px);
  margin-left: var(--mat-button-tonal-icon-offset, -8px);
}
.mat-tonal-button .mat-ripple-element {
  background-color: var(--mat-button-tonal-ripple-color, color-mix(in srgb, var(--mat-sys-on-secondary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-tonal-state-layer-color, var(--mat-sys-on-secondary-container));
}
.mat-tonal-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-tonal-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-tonal-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-tonal-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-tonal-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-tonal-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-tonal-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-tonal-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-tonal-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-tonal-touch-target-size, 48px);
  display: var(--mat-button-tonal-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.mat-mdc-button,
.mat-mdc-unelevated-button,
.mat-mdc-raised-button,
.mat-mdc-outlined-button,
.mat-tonal-button {
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-button .mat-mdc-button-ripple,
.mat-mdc-button .mat-mdc-button-persistent-ripple,
.mat-mdc-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-unelevated-button .mat-mdc-button-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-raised-button .mat-mdc-button-ripple,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,
.mat-tonal-button .mat-mdc-button-ripple,
.mat-tonal-button .mat-mdc-button-persistent-ripple,
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}
.mat-mdc-button .mat-mdc-button-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-ripple,
.mat-mdc-raised-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-tonal-button .mat-mdc-button-ripple {
  overflow: hidden;
}
.mat-mdc-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  content: "";
  opacity: 0;
}
.mat-mdc-button .mdc-button__label,
.mat-mdc-button .mat-icon,
.mat-mdc-unelevated-button .mdc-button__label,
.mat-mdc-unelevated-button .mat-icon,
.mat-mdc-raised-button .mdc-button__label,
.mat-mdc-raised-button .mat-icon,
.mat-mdc-outlined-button .mdc-button__label,
.mat-mdc-outlined-button .mat-icon,
.mat-tonal-button .mdc-button__label,
.mat-tonal-button .mat-icon {
  z-index: 1;
  position: relative;
}
.mat-mdc-button .mat-focus-indicator,
.mat-mdc-unelevated-button .mat-focus-indicator,
.mat-mdc-raised-button .mat-focus-indicator,
.mat-mdc-outlined-button .mat-focus-indicator,
.mat-tonal-button .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
}
.mat-mdc-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-unelevated-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-raised-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-outlined-button:focus-visible > .mat-focus-indicator::before,
.mat-tonal-button:focus-visible > .mat-focus-indicator::before {
  content: "";
  border-radius: inherit;
}
.mat-mdc-button._mat-animation-noopable,
.mat-mdc-unelevated-button._mat-animation-noopable,
.mat-mdc-raised-button._mat-animation-noopable,
.mat-mdc-outlined-button._mat-animation-noopable,
.mat-tonal-button._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-button > .mat-icon,
.mat-mdc-unelevated-button > .mat-icon,
.mat-mdc-raised-button > .mat-icon,
.mat-mdc-outlined-button > .mat-icon,
.mat-tonal-button > .mat-icon {
  display: inline-block;
  position: relative;
  vertical-align: top;
  font-size: 1.125rem;
  height: 1.125rem;
  width: 1.125rem;
}

.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mdc-button__ripple {
  top: -1px;
  left: -1px;
  bottom: -1px;
  right: -1px;
}

.mat-mdc-unelevated-button .mat-focus-indicator::before,
.mat-tonal-button .mat-focus-indicator::before,
.mat-mdc-raised-button .mat-focus-indicator::before {
  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);
}

.mat-mdc-outlined-button .mat-focus-indicator::before {
  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 3px) * -1);
}
`,`@media (forced-colors: active) {
  .mat-mdc-button:not(.mdc-button--outlined),
  .mat-mdc-unelevated-button:not(.mdc-button--outlined),
  .mat-mdc-raised-button:not(.mdc-button--outlined),
  .mat-mdc-outlined-button:not(.mdc-button--outlined),
  .mat-mdc-button-base.mat-tonal-button,
  .mat-mdc-icon-button.mat-mdc-icon-button,
  .mat-mdc-outlined-button .mdc-button__ripple {
    outline: solid 1px;
  }
}
`],encapsulation:2,changeDetection:0})}return t})();function Za(t){return t.hasAttribute("mat-raised-button")?"elevated":t.hasAttribute("mat-stroked-button")?"outlined":t.hasAttribute("mat-flat-button")?"filled":t.hasAttribute("mat-button")?"text":null}var ep=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=M({type:t});static \u0275inj=I({imports:[ao,Rt]})}return t})();export{V as a,ot as b,kr as c,po as d,vo as e,ko as f,tn as g,H as h,ve as i,on as j,ti as k,cs as l,us as m,ml as n,cn as o,Tl as p,ri as q,Ll as r,Pl as s,bi as t,De as u,gn as v,fn as w,li as x,ze as y,bt as z,vs as A,yn as B,vt as C,vn as D,Ps as E,Bl as F,jl as G,zl as H,$l as I,sa as J,k as K,S as L,aa as M,X as N,Tn as O,G as P,wt as Q,ua as R,In as S,At as T,Mn as U,Bi as V,ma as W,Aa as X,Ta as Y,Ia as Z,Wi as _,Fn as $,xn as aa,Nn as ba,Sa as ca,Ra as da,Nm as ea,Jm as fa,Gm as ga,ih as ha,Ha as ia,We as ja,$m as ka,Vm as la,Rt as ma,Km as na,xa as oa,Ce as pa,sh as qa,jn as ra,_h as sa,ro as ta,io as ua,za as va,ao as wa,Qh as xa,ep as ya};
