import{a as St}from"./chunk-47PK5L5Q.js";import{j as O,k as ft,l as _t,m as P,n as bt,q as kt,u as vt,w as gt,z as Rt}from"./chunk-SL5CPD74.js";import{E as u,F as st,H as S,I as ct,L as lt,U as dt,Y as mt,ba as ut,fa as pt,ma as ht,pa as j,r as s,s as c,xa as yt,ya as xt}from"./chunk-OYCIHWOU.js";import{$b as it,Bb as Y,Cb as tt,Eb as et,Ec as rt,Ia as X,Kb as x,Lb as v,Mb as nt,Tb as at,Vb as w,Xb as M,Y as V,ab as k,ac as E,bc as T,da as q,e as h,ea as U,eb as C,fb as G,ga as B,hc as ot,ia as r,jc as I,lc as F,n as N,nb as D,ob as K,pa as H,pb as y,qa as Q,sb as $,ta as b,tb as J,ua as Z,ya as W}from"./chunk-F7T5WLQZ.js";import{a as m,b as R}from"./chunk-MSLIVQHW.js";var At=s("[Route] Load Routes",c()),Bt=s("[Route] Load Routes Success",c()),Ct=s("[Route] Load Routes Failure",c()),Qt=s("[Route] Create Route",c()),Zt=s("[Route] Create Route Success",c()),Wt=s("[Route] Create Route Failure",c()),Xt=s("[Route] Update Route",c()),Gt=s("[Route] Update Route Success",c()),Kt=s("[Route] Update Route Failure",c()),$t=s("[Route] Delete Route",c()),Jt=s("[Route] Delete Route Success",c()),Yt=s("[Route] Delete Route Failure",c());var A=St(),Tt=A.getInitialState({loading:!1,error:null,total:0,page:1,pageSize:10,sortBy:"name",sortDir:"asc"}),re=ct(Tt,S(At,(n,{page:l,pageSize:t,sortBy:e,sortDir:a})=>R(m({},n),{loading:!0,error:null,page:l,pageSize:t,sortBy:e,sortDir:a})),S(Bt,(n,{routes:l,total:t,page:e,pageSize:a,sortBy:i,sortDir:o})=>A.setAll(l,R(m({},n),{loading:!1,total:t,page:e,pageSize:a,sortBy:i,sortDir:o}))),S(Ct,(n,{error:l})=>R(m({},n),{loading:!1,error:l})));var p=st("routes"),{selectAll:It}=A.getSelectors(),ue=u(p,It),pe=u(p,n=>n.loading),he=u(p,n=>n.error),fe=u(p,n=>n.total),_e=u(p,n=>n.page),be=u(p,n=>n.pageSize),ke=u(p,n=>n.sortBy),ve=u(p,n=>n.sortDir),ge=u(p,n=>({page:n.page,pageSize:n.pageSize,sortBy:n.sortBy,sortDir:n.sortDir}));function Ft(n,l){if(n&1){let t=at();x(0,"div",1)(1,"button",2),w("click",function(){H(t);let a=M();return Q(a.action())}),I(2),v()()}if(n&2){let t=M();k(2),F(" ",t.data.action," ")}}var Ot=["label"];function Pt(n,l){}var jt=Math.pow(2,31)-1,g=class{_overlayRef;instance;containerInstance;_afterDismissed=new h;_afterOpened=new h;_onAction=new h;_durationTimeoutId;_dismissedByAction=!1;constructor(l,t){this._overlayRef=t,this.containerInstance=l,l._onExit.subscribe(()=>this._finishDismiss())}dismiss(){this._afterDismissed.closed||this.containerInstance.exit(),clearTimeout(this._durationTimeoutId)}dismissWithAction(){this._onAction.closed||(this._dismissedByAction=!0,this._onAction.next(),this._onAction.complete(),this.dismiss()),clearTimeout(this._durationTimeoutId)}closeWithAction(){this.dismissWithAction()}_dismissAfter(l){this._durationTimeoutId=setTimeout(()=>this.dismiss(),Math.min(l,jt))}_open(){this._afterOpened.closed||(this._afterOpened.next(),this._afterOpened.complete())}_finishDismiss(){this._overlayRef.dispose(),this._onAction.closed||this._onAction.complete(),this._afterDismissed.next({dismissedByAction:this._dismissedByAction}),this._afterDismissed.complete(),this._dismissedByAction=!1}afterDismissed(){return this._afterDismissed}afterOpened(){return this.containerInstance._onEnter}onAction(){return this._onAction}},Dt=new B("MatSnackBarData"),f=class{politeness="polite";announcementMessage="";viewContainerRef;duration=0;panelClass;direction;data=null;horizontalPosition="center";verticalPosition="bottom"},zt=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275dir=y({type:n,selectors:[["","matSnackBarLabel",""]],hostAttrs:[1,"mat-mdc-snack-bar-label","mdc-snackbar__label"]})}return n})(),Lt=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275dir=y({type:n,selectors:[["","matSnackBarActions",""]],hostAttrs:[1,"mat-mdc-snack-bar-actions","mdc-snackbar__actions"]})}return n})(),Nt=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275dir=y({type:n,selectors:[["","matSnackBarAction",""]],hostAttrs:[1,"mat-mdc-snack-bar-action","mdc-snackbar__action"]})}return n})(),wt=(()=>{class n{snackBarRef=r(g);data=r(Dt);constructor(){}action(){this.snackBarRef.dismissWithAction()}get hasAction(){return!!this.data.action}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=D({type:n,selectors:[["simple-snack-bar"]],hostAttrs:[1,"mat-mdc-simple-snack-bar"],exportAs:["matSnackBar"],decls:3,vars:2,consts:[["matSnackBarLabel",""],["matSnackBarActions",""],["matButton","","matSnackBarAction","",3,"click"]],template:function(e,a){e&1&&(x(0,"div",0),I(1),v(),tt(2,Ft,3,1,"div",1)),e&2&&(k(),F(" ",a.data.message,`
`),k(),et(a.hasAction?2:-1))},dependencies:[yt,zt,Lt,Nt],styles:[`.mat-mdc-simple-snack-bar {
  display: flex;
}
.mat-mdc-simple-snack-bar .mat-mdc-snack-bar-label {
  max-height: 50vh;
  overflow: auto;
}
`],encapsulation:2,changeDetection:0})}return n})(),z="_mat-snack-bar-enter",L="_mat-snack-bar-exit",Vt=(()=>{class n extends _t{_ngZone=r(W);_elementRef=r(X);_changeDetectorRef=r(rt);_platform=r(lt);_animationsDisabled=j();snackBarConfig=r(f);_document=r(Z);_trackedModals=new Set;_enterFallback;_exitFallback;_injector=r(b);_announceDelay=150;_announceTimeoutId;_destroyed=!1;_portalOutlet;_onAnnounce=new h;_onExit=new h;_onEnter=new h;_animationState="void";_live;_label;_role;_liveElementId=r(ut).getId("mat-snack-bar-container-live-");constructor(){super();let t=this.snackBarConfig;t.politeness==="assertive"&&!t.announcementMessage?this._live="assertive":t.politeness==="off"?this._live="off":this._live="polite",this._platform.FIREFOX&&(this._live==="polite"&&(this._role="status"),this._live==="assertive"&&(this._role="alert"))}attachComponentPortal(t){this._assertNotAttached();let e=this._portalOutlet.attachComponentPortal(t);return this._afterPortalAttached(),e}attachTemplatePortal(t){this._assertNotAttached();let e=this._portalOutlet.attachTemplatePortal(t);return this._afterPortalAttached(),e}attachDomPortal=t=>{this._assertNotAttached();let e=this._portalOutlet.attachDomPortal(t);return this._afterPortalAttached(),e};onAnimationEnd(t){t===L?this._completeExit():t===z&&(clearTimeout(this._enterFallback),this._ngZone.run(()=>{this._onEnter.next(),this._onEnter.complete()}))}enter(){this._destroyed||(this._animationState="visible",this._changeDetectorRef.markForCheck(),this._changeDetectorRef.detectChanges(),this._screenReaderAnnounce(),this._animationsDisabled?C(()=>{this._ngZone.run(()=>queueMicrotask(()=>this.onAnimationEnd(z)))},{injector:this._injector}):(clearTimeout(this._enterFallback),this._enterFallback=setTimeout(()=>{this._elementRef.nativeElement.classList.add("mat-snack-bar-fallback-visible"),this.onAnimationEnd(z)},200)))}exit(){return this._destroyed?N(void 0):(this._ngZone.run(()=>{this._animationState="hidden",this._changeDetectorRef.markForCheck(),this._elementRef.nativeElement.setAttribute("mat-exit",""),clearTimeout(this._announceTimeoutId),this._animationsDisabled?C(()=>{this._ngZone.run(()=>queueMicrotask(()=>this.onAnimationEnd(L)))},{injector:this._injector}):(clearTimeout(this._exitFallback),this._exitFallback=setTimeout(()=>this.onAnimationEnd(L),200))}),this._onExit)}ngOnDestroy(){this._destroyed=!0,this._clearFromModals(),this._completeExit()}_completeExit(){clearTimeout(this._exitFallback),queueMicrotask(()=>{this._onExit.next(),this._onExit.complete()})}_afterPortalAttached(){let t=this._elementRef.nativeElement,e=this.snackBarConfig.panelClass;e&&(Array.isArray(e)?e.forEach(o=>t.classList.add(o)):t.classList.add(e)),this._exposeToModals();let a=this._label.nativeElement,i="mdc-snackbar__label";a.classList.toggle(i,!a.querySelector(`.${i}`))}_exposeToModals(){let t=this._liveElementId,e=this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');for(let a=0;a<e.length;a++){let i=e[a],o=i.getAttribute("aria-owns");this._trackedModals.add(i),o?o.indexOf(t)===-1&&i.setAttribute("aria-owns",o+" "+t):i.setAttribute("aria-owns",t)}}_clearFromModals(){this._trackedModals.forEach(t=>{let e=t.getAttribute("aria-owns");if(e){let a=e.replace(this._liveElementId,"").trim();a.length>0?t.setAttribute("aria-owns",a):t.removeAttribute("aria-owns")}}),this._trackedModals.clear()}_assertNotAttached(){this._portalOutlet.hasAttached()}_screenReaderAnnounce(){this._announceTimeoutId||this._ngZone.runOutsideAngular(()=>{this._announceTimeoutId=setTimeout(()=>{if(this._destroyed)return;let t=this._elementRef.nativeElement,e=t.querySelector("[aria-hidden]"),a=t.querySelector("[aria-live]");if(e&&a){let i=null;this._platform.isBrowser&&document.activeElement instanceof HTMLElement&&e.contains(document.activeElement)&&(i=document.activeElement),e.removeAttribute("aria-hidden"),a.appendChild(e),i?.focus(),this._onAnnounce.next(),this._onAnnounce.complete()}},this._announceDelay)})}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=D({type:n,selectors:[["mat-snack-bar-container"]],viewQuery:function(e,a){if(e&1&&it(P,7)(Ot,7),e&2){let i;E(i=T())&&(a._portalOutlet=i.first),E(i=T())&&(a._label=i.first)}},hostAttrs:[1,"mdc-snackbar","mat-mdc-snack-bar-container"],hostVars:6,hostBindings:function(e,a){e&1&&w("animationend",function(o){return a.onAnimationEnd(o.animationName)})("animationcancel",function(o){return a.onAnimationEnd(o.animationName)}),e&2&&ot("mat-snack-bar-container-enter",a._animationState==="visible")("mat-snack-bar-container-exit",a._animationState==="hidden")("mat-snack-bar-container-animations-enabled",!a._animationsDisabled)},features:[$],decls:6,vars:3,consts:[["label",""],[1,"mdc-snackbar__surface","mat-mdc-snackbar-surface"],[1,"mat-mdc-snack-bar-label"],["aria-hidden","true"],["cdkPortalOutlet",""]],template:function(e,a){e&1&&(x(0,"div",1)(1,"div",2,0)(3,"div",3),J(4,Pt,0,0,"ng-template",4),v(),nt(5,"div"),v()()),e&2&&(k(5),Y("aria-live",a._live)("role",a._role)("id",a._liveElementId))},dependencies:[P],styles:[`@keyframes _mat-snack-bar-enter {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes _mat-snack-bar-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-snack-bar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  margin: 8px;
}
.mat-mdc-snack-bar-handset .mat-mdc-snack-bar-container {
  width: 100vw;
}

.mat-snack-bar-container-animations-enabled {
  opacity: 0;
}
.mat-snack-bar-container-animations-enabled.mat-snack-bar-fallback-visible {
  opacity: 1;
}
.mat-snack-bar-container-animations-enabled.mat-snack-bar-container-enter {
  animation: _mat-snack-bar-enter 150ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
.mat-snack-bar-container-animations-enabled.mat-snack-bar-container-exit {
  animation: _mat-snack-bar-exit 75ms cubic-bezier(0.4, 0, 1, 1) forwards;
}

.mat-mdc-snackbar-surface {
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 8px;
}
[dir=rtl] .mat-mdc-snackbar-surface {
  padding-right: 0;
  padding-left: 8px;
}
.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface {
  min-width: 344px;
  max-width: 672px;
}
.mat-mdc-snack-bar-handset .mat-mdc-snackbar-surface {
  width: 100%;
  min-width: 0;
}
@media (forced-colors: active) {
  .mat-mdc-snackbar-surface {
    outline: solid 1px;
  }
}
.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface {
  color: var(--mat-snack-bar-supporting-text-color, var(--mat-sys-inverse-on-surface));
  border-radius: var(--mat-snack-bar-container-shape, var(--mat-sys-corner-extra-small));
  background-color: var(--mat-snack-bar-container-color, var(--mat-sys-inverse-surface));
}

.mdc-snackbar__label {
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  margin: 0;
  padding: 14px 8px 14px 16px;
}
[dir=rtl] .mdc-snackbar__label {
  padding-left: 8px;
  padding-right: 16px;
}
.mat-mdc-snack-bar-container .mdc-snackbar__label {
  font-family: var(--mat-snack-bar-supporting-text-font, var(--mat-sys-body-medium-font));
  font-size: var(--mat-snack-bar-supporting-text-size, var(--mat-sys-body-medium-size));
  font-weight: var(--mat-snack-bar-supporting-text-weight, var(--mat-sys-body-medium-weight));
  line-height: var(--mat-snack-bar-supporting-text-line-height, var(--mat-sys-body-medium-line-height));
}

.mat-mdc-snack-bar-actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  box-sizing: border-box;
}

.mat-mdc-snack-bar-handset,
.mat-mdc-snack-bar-container,
.mat-mdc-snack-bar-label {
  flex: 1 1 auto;
}

.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled).mat-unthemed {
  color: var(--mat-snack-bar-button-color, var(--mat-sys-inverse-primary));
}
.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) {
  --mat-button-text-state-layer-color: currentColor;
  --mat-button-text-ripple-color: currentColor;
}
.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) .mat-ripple-element {
  opacity: 0.1;
}
`],encapsulation:2})}return n})(),qt=new B("mat-snack-bar-default-options",{providedIn:"root",factory:()=>new f}),Ut=(()=>{class n{_live=r(mt);_injector=r(b);_breakpointObserver=r(dt);_parentSnackBar=r(n,{optional:!0,skipSelf:!0});_defaultConfig=r(qt);_animationsDisabled=j();_snackBarRefAtThisLevel=null;simpleSnackBarComponent=wt;snackBarContainerComponent=Vt;handsetCssClass="mat-mdc-snack-bar-handset";get _openedSnackBarRef(){let t=this._parentSnackBar;return t?t._openedSnackBarRef:this._snackBarRefAtThisLevel}set _openedSnackBarRef(t){this._parentSnackBar?this._parentSnackBar._openedSnackBarRef=t:this._snackBarRefAtThisLevel=t}constructor(){}openFromComponent(t,e){return this._attach(t,e)}openFromTemplate(t,e){return this._attach(t,e)}open(t,e="",a){let i=m(m({},this._defaultConfig),a);return i.data={message:t,action:e},i.announcementMessage===t&&(i.announcementMessage=void 0),this.openFromComponent(this.simpleSnackBarComponent,i)}dismiss(){this._openedSnackBarRef&&this._openedSnackBarRef.dismiss()}ngOnDestroy(){this._snackBarRefAtThisLevel&&this._snackBarRefAtThisLevel.dismiss()}_attachSnackBarContainer(t,e){let a=e&&e.viewContainerRef&&e.viewContainerRef.injector,i=b.create({parent:a||this._injector,providers:[{provide:f,useValue:e}]}),o=new O(this.snackBarContainerComponent,e.viewContainerRef,i),d=t.attach(o);return d.instance.snackBarConfig=e,d.instance}_attach(t,e){let a=m(m(m({},new f),this._defaultConfig),e),i=this._createOverlay(a),o=this._attachSnackBarContainer(i,a),d=new g(o,i);if(t instanceof G){let _=new ft(t,null,{$implicit:a.data,snackBarRef:d});d.instance=o.attachTemplatePortal(_)}else{let _=this._createInjector(a,d),Mt=new O(t,void 0,_),Et=o.attachComponentPortal(Mt);d.instance=Et.instance}return this._breakpointObserver.observe(pt.HandsetPortrait).pipe(V(i.detachments())).subscribe(_=>{i.overlayElement.classList.toggle(this.handsetCssClass,_.matches)}),a.announcementMessage&&o._onAnnounce.subscribe(()=>{this._live.announce(a.announcementMessage,a.politeness)}),this._animateSnackBar(d,a),this._openedSnackBarRef=d,this._openedSnackBarRef}_animateSnackBar(t,e){t.afterDismissed().subscribe(()=>{this._openedSnackBarRef==t&&(this._openedSnackBarRef=null),e.announcementMessage&&this._live.clear()}),e.duration&&e.duration>0&&t.afterOpened().subscribe(()=>t._dismissAfter(e.duration)),this._openedSnackBarRef?(this._openedSnackBarRef.afterDismissed().subscribe(()=>{t.containerInstance.enter()}),this._openedSnackBarRef.dismiss()):t.containerInstance.enter()}_createOverlay(t){let e=new kt;e.direction=t.direction;let a=vt(this._injector),i=t.direction==="rtl",o=t.horizontalPosition==="left"||t.horizontalPosition==="start"&&!i||t.horizontalPosition==="end"&&i,d=!o&&t.horizontalPosition!=="center";return o?a.left("0"):d?a.right("0"):a.centerHorizontally(),t.verticalPosition==="top"?a.top("0"):a.bottom("0"),e.positionStrategy=a,e.disableAnimations=this._animationsDisabled,gt(this._injector,e)}_createInjector(t,e){let a=t&&t.viewContainerRef&&t.viewContainerRef.injector;return b.create({parent:a||this._injector,providers:[{provide:g,useValue:e},{provide:Dt,useValue:t.data}]})}static \u0275fac=function(e){return new(e||n)};static \u0275prov=q({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();var Ve=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=K({type:n});static \u0275inj=U({providers:[Ut],imports:[Rt,bt,xt,wt,ht]})}return n})();export{Ut as a,Ve as b,At as c,Bt as d,Ct as e,Qt as f,Zt as g,Wt as h,Xt as i,Gt as j,Kt as k,$t as l,Jt as m,Yt as n,re as o,ue as p,pe as q,he as r,fe as s,_e as t,be as u,ke as v,ve as w,ge as x};
