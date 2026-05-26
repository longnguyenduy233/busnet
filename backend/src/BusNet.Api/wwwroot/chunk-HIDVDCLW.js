import{a as j,b as z,c as I,d as F,e as Q}from"./chunk-VLMWZL2Q.js";import{e as K}from"./chunk-LESBXQDI.js";import{c as J}from"./chunk-FT6ZLJFS.js";import{a as X,b as Y,c as Z,d as tt}from"./chunk-AJPPCRDX.js";import"./chunk-SL5CPD74.js";import{D as V,L as H,e as B,ma as $,q as U,va as q,xa as W,ya as G}from"./chunk-OYCIHWOU.js";import{A as h,B as v,Ia as w,Jb as C,Kb as n,Lb as a,Mb as k,Vb as O,Yb as P,Zb as u,_b as T,ab as s,ac as D,bc as E,ea as M,hc as d,ia as m,ic as R,jc as l,kc as S,n as g,nb as c,ob as y,pb as _,pc as A,qc as L,rc as N,t as b,ua as x}from"./chunk-F7T5WLQZ.js";import"./chunk-MSLIVQHW.js";var it=["*",[["mat-toolbar-row"]]],lt=["*","mat-toolbar-row"],mt=(()=>{class t{static \u0275fac=function(e){return new(e||t)};static \u0275dir=_({type:t,selectors:[["mat-toolbar-row"]],hostAttrs:[1,"mat-toolbar-row"],exportAs:["matToolbarRow"]})}return t})(),et=(()=>{class t{_elementRef=m(w);_platform=m(H);_document=m(x);color;_toolbarRows;constructor(){}ngAfterViewInit(){this._platform.isBrowser&&(this._checkToolbarMixedModes(),this._toolbarRows.changes.subscribe(()=>this._checkToolbarMixedModes()))}_checkToolbarMixedModes(){this._toolbarRows.length}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=c({type:t,selectors:[["mat-toolbar"]],contentQueries:function(e,i,at){if(e&1&&T(at,mt,5),e&2){let f;D(f=E())&&(i._toolbarRows=f)}},hostAttrs:[1,"mat-toolbar"],hostVars:6,hostBindings:function(e,i){e&2&&(R(i.color?"mat-"+i.color:""),d("mat-toolbar-multiple-rows",i._toolbarRows.length>0)("mat-toolbar-single-row",i._toolbarRows.length===0))},inputs:{color:"color"},exportAs:["matToolbar"],ngContentSelectors:lt,decls:2,vars:0,template:function(e,i){e&1&&(P(it),u(0),u(1,1))},styles:[`.mat-toolbar {
  background: var(--mat-toolbar-container-background-color, var(--mat-sys-surface));
  color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));
}
.mat-toolbar, .mat-toolbar h1, .mat-toolbar h2, .mat-toolbar h3, .mat-toolbar h4, .mat-toolbar h5, .mat-toolbar h6 {
  font-family: var(--mat-toolbar-title-text-font, var(--mat-sys-title-large-font));
  font-size: var(--mat-toolbar-title-text-size, var(--mat-sys-title-large-size));
  line-height: var(--mat-toolbar-title-text-line-height, var(--mat-sys-title-large-line-height));
  font-weight: var(--mat-toolbar-title-text-weight, var(--mat-sys-title-large-weight));
  letter-spacing: var(--mat-toolbar-title-text-tracking, var(--mat-sys-title-large-tracking));
  margin: 0;
}
@media (forced-colors: active) {
  .mat-toolbar {
    outline: solid 1px;
  }
}
.mat-toolbar .mat-form-field-underline,
.mat-toolbar .mat-form-field-ripple,
.mat-toolbar .mat-focused .mat-form-field-ripple {
  background-color: currentColor;
}
.mat-toolbar .mat-form-field-label,
.mat-toolbar .mat-focused .mat-form-field-label,
.mat-toolbar .mat-select-value,
.mat-toolbar .mat-select-arrow,
.mat-toolbar .mat-form-field.mat-focused .mat-select-arrow {
  color: inherit;
}
.mat-toolbar .mat-input-element {
  caret-color: currentColor;
}
.mat-toolbar .mat-mdc-button-base.mat-mdc-button-base.mat-unthemed {
  --mat-button-text-label-text-color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));
  --mat-button-outlined-label-text-color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));
}

.mat-toolbar-row, .mat-toolbar-single-row {
  display: flex;
  box-sizing: border-box;
  padding: 0 16px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  height: var(--mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-row, .mat-toolbar-single-row {
    height: var(--mat-toolbar-mobile-height, 56px);
  }
}

.mat-toolbar-multiple-rows {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  min-height: var(--mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-multiple-rows {
    min-height: var(--mat-toolbar-mobile-height, 56px);
  }
}
`],encapsulation:2,changeDetection:0})}return t})();var ot=(()=>{class t{static \u0275fac=function(e){return new(e||t)};static \u0275mod=y({type:t});static \u0275inj=M({imports:[$]})}return t})();var ct=()=>({exact:!0});function p(t){let r=t.split(/[?#]/)[0];return r==="/tracking"||r.startsWith("/tracking/")}var nt=class t{store=m(V);router=m(I);isTrackingRoute=U(h(g(p(this.router.url)),this.router.events.pipe(v(r=>r instanceof j),b(r=>p(r.urlAfterRedirects)))),{initialValue:p(this.router.url)});displayName$=this.store.select(J);logout(){this.store.dispatch(K())}static \u0275fac=function(o){return new(o||t)};static \u0275cmp=c({type:t,selectors:[["app-shell"]],decls:23,vars:7,consts:[[1,"shell-frame"],["color","primary",1,"top-nav"],[1,"nav-left"],[1,"logo"],[1,"nav-center"],["mat-button","","routerLink","/home","routerLinkActive","active-link",3,"routerLinkActiveOptions"],["mat-button","","routerLink","/bus","routerLinkActive","active-link"],["mat-button","","routerLink","/route","routerLinkActive","active-link"],["mat-button","","routerLink","/tracking","routerLinkActive","active-link"],[1,"nav-right"],[1,"user-name"],["mat-icon-button","","matTooltip","Logout",3,"click"],[1,"shell-main"]],template:function(o,e){o&1&&(n(0,"div",0)(1,"mat-toolbar",1)(2,"div",2)(3,"span",3),l(4,"\u{1F68C} BusNet"),a()(),n(5,"div",4)(6,"button",5),l(7,"Home"),a(),n(8,"button",6),l(9,"Bus"),a(),n(10,"button",7),l(11,"Route"),a(),n(12,"button",8),l(13,"Tracking"),a()(),n(14,"div",9)(15,"span",10),l(16),L(17,"async"),a(),n(18,"button",11),O("click",function(){return e.logout()}),n(19,"mat-icon"),l(20,"logout"),a()()()(),n(21,"main",12),k(22,"router-outlet"),a()()),o&2&&(s(6),C("routerLinkActiveOptions",A(6,ct)),s(10),S(N(17,4,e.displayName$)),s(5),d("shell-main--tracking",e.isTrackingRoute()))},dependencies:[z,F,Q,ot,et,G,W,q,Y,X,tt,Z,B],styles:["[_nghost-%COMP%]{display:block;box-sizing:border-box;height:100vh;height:100dvh;max-height:100vh;max-height:100dvh;overflow:hidden}.shell-frame[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100%;min-height:0}.shell-main[_ngcontent-%COMP%]{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;overflow:auto}.shell-main.shell-main--tracking[_ngcontent-%COMP%]{overflow:hidden}.shell-main[_ngcontent-%COMP%] > [_ngcontent-%COMP%]:not(router-outlet){flex:1 1 auto;min-height:0;min-width:0}.top-nav[_ngcontent-%COMP%]{display:flex;justify-content:space-between}.top-nav[_ngcontent-%COMP%]   .nav-left[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{font-size:1.4rem;font-weight:700}.top-nav[_ngcontent-%COMP%]   .nav-center[_ngcontent-%COMP%]{display:flex;gap:4px;align-items:center}.top-nav[_ngcontent-%COMP%]   .nav-center[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{font-size:1rem}.top-nav[_ngcontent-%COMP%]   .nav-center[_ngcontent-%COMP%]   button.mat-mdc-button.active-link[_ngcontent-%COMP%]{background-color:transparent;font-weight:600;color:#343dff;--mat-button-text-label-text-color: #343dff;--mat-button-text-state-layer-color: #343dff}.top-nav[_ngcontent-%COMP%]   .nav-center[_ngcontent-%COMP%]   button.mat-mdc-button.active-link[_ngcontent-%COMP%]:hover{background-color:transparent}.top-nav[_ngcontent-%COMP%]   .nav-center[_ngcontent-%COMP%]   button.mat-mdc-button.active-link[_ngcontent-%COMP%]:focus-visible{outline:2px solid #343dff;outline-offset:3px}.top-nav[_ngcontent-%COMP%]   .nav-right[_ngcontent-%COMP%]{display:flex;align-items:center;gap:4px;flex-shrink:0;white-space:nowrap}.top-nav[_ngcontent-%COMP%]   .nav-right[_ngcontent-%COMP%]   .user-name[_ngcontent-%COMP%]{font-size:1rem;font-weight:500;overflow:hidden;text-overflow:ellipsis;max-width:160px}"],changeDetection:0})};export{nt as ShellComponent};
