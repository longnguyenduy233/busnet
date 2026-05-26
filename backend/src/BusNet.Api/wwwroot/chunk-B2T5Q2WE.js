import{a as at}from"./chunk-LESBXQDI.js";import{a as Y,b as Z}from"./chunk-C7BURL3T.js";import{d as O,e as B}from"./chunk-FT6ZLJFS.js";import{A as tt,B as et,b as G,d as y,f as V,g as q,j as H,m as R,n as $,q as X,r as U,s as J,t as K,w as Q,x as W}from"./chunk-R5HQ3SO4.js";import{D as L,e as j,ma as N,xa as k,ya as z}from"./chunk-OYCIHWOU.js";import{Cb as m,Db as I,Eb as l,Jb as M,Kb as i,Lb as n,Mb as h,Nb as A,Ob as F,Vb as E,Yb as x,Zb as u,ab as c,ea as D,ga as w,hc as T,ia as s,jc as o,kc as P,nb as p,ob as S,pb as v,qc as b,rc as C}from"./chunk-F7T5WLQZ.js";import"./chunk-MSLIVQHW.js";var st=["*"];var pt=[[["","mat-card-avatar",""],["","matCardAvatar",""]],[["mat-card-title"],["mat-card-subtitle"],["","mat-card-title",""],["","mat-card-subtitle",""],["","matCardTitle",""],["","matCardSubtitle",""]],"*"],ut=["[mat-card-avatar], [matCardAvatar]",`mat-card-title, mat-card-subtitle,
      [mat-card-title], [mat-card-subtitle],
      [matCardTitle], [matCardSubtitle]`,"*"],gt=new w("MAT_CARD_CONFIG"),nt=(()=>{class t{appearance;constructor(){let a=s(gt,{optional:!0});this.appearance=a?.appearance||"raised"}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=p({type:t,selectors:[["mat-card"]],hostAttrs:[1,"mat-mdc-card","mdc-card"],hostVars:8,hostBindings:function(e,r){e&2&&T("mat-mdc-card-outlined",r.appearance==="outlined")("mdc-card--outlined",r.appearance==="outlined")("mat-mdc-card-filled",r.appearance==="filled")("mdc-card--filled",r.appearance==="filled")},inputs:{appearance:"appearance"},exportAs:["matCard"],ngContentSelectors:st,decls:1,vars:0,template:function(e,r){e&1&&(x(),u(0))},styles:[`.mat-mdc-card {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  border-style: solid;
  border-width: 0;
  background-color: var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));
  border-color: var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));
  border-radius: var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));
  box-shadow: var(--mat-card-elevated-container-elevation, var(--mat-sys-level1));
}
.mat-mdc-card::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: solid 1px transparent;
  content: "";
  display: block;
  pointer-events: none;
  box-sizing: border-box;
  border-radius: var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));
}

.mat-mdc-card-outlined {
  background-color: var(--mat-card-outlined-container-color, var(--mat-sys-surface));
  border-radius: var(--mat-card-outlined-container-shape, var(--mat-sys-corner-medium));
  border-width: var(--mat-card-outlined-outline-width, 1px);
  border-color: var(--mat-card-outlined-outline-color, var(--mat-sys-outline-variant));
  box-shadow: var(--mat-card-outlined-container-elevation, var(--mat-sys-level0));
}
.mat-mdc-card-outlined::after {
  border: none;
}

.mat-mdc-card-filled {
  background-color: var(--mat-card-filled-container-color, var(--mat-sys-surface-container-highest));
  border-radius: var(--mat-card-filled-container-shape, var(--mat-sys-corner-medium));
  box-shadow: var(--mat-card-filled-container-elevation, var(--mat-sys-level0));
}

.mdc-card__media {
  position: relative;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.mdc-card__media::before {
  display: block;
  content: "";
}
.mdc-card__media:first-child {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}
.mdc-card__media:last-child {
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

.mat-mdc-card-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  min-height: 52px;
  padding: 8px;
}

.mat-mdc-card-title {
  font-family: var(--mat-card-title-text-font, var(--mat-sys-title-large-font));
  line-height: var(--mat-card-title-text-line-height, var(--mat-sys-title-large-line-height));
  font-size: var(--mat-card-title-text-size, var(--mat-sys-title-large-size));
  letter-spacing: var(--mat-card-title-text-tracking, var(--mat-sys-title-large-tracking));
  font-weight: var(--mat-card-title-text-weight, var(--mat-sys-title-large-weight));
}

.mat-mdc-card-subtitle {
  color: var(--mat-card-subtitle-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-card-subtitle-text-font, var(--mat-sys-title-medium-font));
  line-height: var(--mat-card-subtitle-text-line-height, var(--mat-sys-title-medium-line-height));
  font-size: var(--mat-card-subtitle-text-size, var(--mat-sys-title-medium-size));
  letter-spacing: var(--mat-card-subtitle-text-tracking, var(--mat-sys-title-medium-tracking));
  font-weight: var(--mat-card-subtitle-text-weight, var(--mat-sys-title-medium-weight));
}

.mat-mdc-card-title,
.mat-mdc-card-subtitle {
  display: block;
  margin: 0;
}
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-title,
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-subtitle {
  padding: 16px 16px 0;
}

.mat-mdc-card-header {
  display: flex;
  padding: 16px 16px 0;
}

.mat-mdc-card-content {
  display: block;
  padding: 0 16px;
}
.mat-mdc-card-content:first-child {
  padding-top: 16px;
}
.mat-mdc-card-content:last-child {
  padding-bottom: 16px;
}

.mat-mdc-card-title-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.mat-mdc-card-avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-bottom: 16px;
  object-fit: cover;
}
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-subtitle,
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-title {
  line-height: normal;
}

.mat-mdc-card-sm-image {
  width: 80px;
  height: 80px;
}

.mat-mdc-card-md-image {
  width: 112px;
  height: 112px;
}

.mat-mdc-card-lg-image {
  width: 152px;
  height: 152px;
}

.mat-mdc-card-xl-image {
  width: 240px;
  height: 240px;
}

.mat-mdc-card-subtitle ~ .mat-mdc-card-title,
.mat-mdc-card-title ~ .mat-mdc-card-subtitle,
.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-title,
.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-subtitle,
.mat-mdc-card-title-group .mat-mdc-card-title,
.mat-mdc-card-title-group .mat-mdc-card-subtitle {
  padding-top: 0;
}

.mat-mdc-card-content > :last-child:not(.mat-mdc-card-footer) {
  margin-bottom: 0;
}

.mat-mdc-card-actions-align-end {
  justify-content: flex-end;
}
`],encapsulation:2,changeDetection:0})}return t})(),rt=(()=>{class t{static \u0275fac=function(e){return new(e||t)};static \u0275dir=v({type:t,selectors:[["mat-card-title"],["","mat-card-title",""],["","matCardTitle",""]],hostAttrs:[1,"mat-mdc-card-title"]})}return t})();var it=(()=>{class t{static \u0275fac=function(e){return new(e||t)};static \u0275dir=v({type:t,selectors:[["mat-card-content"]],hostAttrs:[1,"mat-mdc-card-content"]})}return t})(),ot=(()=>{class t{static \u0275fac=function(e){return new(e||t)};static \u0275dir=v({type:t,selectors:[["mat-card-subtitle"],["","mat-card-subtitle",""],["","matCardSubtitle",""]],hostAttrs:[1,"mat-mdc-card-subtitle"]})}return t})();var dt=(()=>{class t{static \u0275fac=function(e){return new(e||t)};static \u0275cmp=p({type:t,selectors:[["mat-card-header"]],hostAttrs:[1,"mat-mdc-card-header"],ngContentSelectors:ut,decls:4,vars:0,consts:[[1,"mat-mdc-card-header-text"]],template:function(e,r){e&1&&(x(pt),u(0),A(1,"div",0),u(2,1),F(),u(3,2))},encapsulation:2,changeDetection:0})}return t})();var ct=(()=>{class t{static \u0275fac=function(e){return new(e||t)};static \u0275mod=S({type:t});static \u0275inj=D({imports:[N]})}return t})();function vt(t,d){t&1&&(i(0,"mat-error"),o(1,"Username is required"),n())}function ht(t,d){t&1&&(i(0,"mat-error"),o(1,"Password is required"),n())}function bt(t,d){t&1&&(i(0,"mat-error"),o(1,"Password must be at least 6 characters"),n())}function Ct(t,d){t&1&&(i(0,"div",8),o(1),n()),t&2&&(c(),P(d))}function yt(t,d){t&1&&h(0,"mat-spinner",10)}function Mt(t,d){t&1&&o(0," Sign In ")}var mt=class t{store=s(L);fb=s(X);form=this.fb.group({userName:["",y.required],password:["",[y.required,y.minLength(6)]]});loading$=this.store.select(O);error$=this.store.select(B);submit(){if(this.form.valid){let{userName:d,password:a}=this.form.value;this.store.dispatch(at({userName:d,password:a}))}}static \u0275fac=function(a){return new(a||t)};static \u0275cmp=p({type:t,selectors:[["app-login"]],decls:31,vars:13,consts:[[1,"login-container"],[1,"login-card"],[1,"login-title"],[1,"bus-icon"],[3,"ngSubmit","formGroup"],["appearance","outline",1,"full-width"],["matInput","","formControlName","userName","autocomplete","username"],["matInput","","type","password","formControlName","password","autocomplete","current-password"],[1,"error-message"],["mat-raised-button","","color","primary","type","submit",1,"full-width","login-btn",3,"disabled"],["diameter","20"]],template:function(a,e){if(a&1&&(i(0,"div",0)(1,"mat-card",1)(2,"mat-card-header")(3,"mat-card-title")(4,"div",2)(5,"span",3),o(6,"\u{1F68C}"),n(),i(7,"span"),o(8,"BusNet"),n()()(),i(9,"mat-card-subtitle"),o(10,"School Bus Management System"),n()(),i(11,"mat-card-content")(12,"form",4),E("ngSubmit",function(){return e.submit()}),i(13,"mat-form-field",5)(14,"mat-label"),o(15,"Username"),n(),h(16,"input",6),m(17,vt,2,0,"mat-error"),n(),i(18,"mat-form-field",5)(19,"mat-label"),o(20,"Password"),n(),h(21,"input",7),m(22,ht,2,0,"mat-error"),m(23,bt,2,0,"mat-error"),n(),m(24,Ct,2,1,"div",8),b(25,"async"),i(26,"button",9),b(27,"async"),m(28,yt,1,0,"mat-spinner",10),b(29,"async"),I(30,Mt,1,0),n()()()()()),a&2){let r,g,f,_;c(12),M("formGroup",e.form),c(5),l((r=e.form.get("userName"))!=null&&r.hasError("required")&&((r=e.form.get("userName"))!=null&&r.touched)?17:-1),c(5),l((g=e.form.get("password"))!=null&&g.hasError("required")&&((g=e.form.get("password"))!=null&&g.touched)?22:-1),c(),l((f=e.form.get("password"))!=null&&f.hasError("minlength")&&((f=e.form.get("password"))!=null&&f.touched)?23:-1),c(),l((_=C(25,7,e.error$))?24:-1,_),c(2),M("disabled",e.form.invalid||C(27,9,e.loading$)),c(2),l(C(29,11,e.loading$)?28:30)}},dependencies:[U,H,G,V,q,$,R,ct,nt,it,dt,ot,rt,W,Q,J,K,Z,Y,z,k,et,tt,j],styles:[".login-container[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#1565c0,#0d47a1)}.login-card[_ngcontent-%COMP%]{width:100%;max-width:420px;padding:16px;box-shadow:0 8px 32px #0000004d!important}.login-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]{padding-bottom:24px}.login-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]{padding-top:8px}.login-title[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;font-size:1.8rem;font-weight:700;color:#1565c0;margin-bottom:12px}.login-title[_ngcontent-%COMP%]   .bus-icon[_ngcontent-%COMP%]{font-size:2rem}.full-width[_ngcontent-%COMP%]{width:100%}mat-form-field[_ngcontent-%COMP%]{margin-bottom:8px}.error-message[_ngcontent-%COMP%]{color:#f44336;font-size:.875rem;margin-bottom:12px;padding:8px 12px;background:#ffebee;border-radius:4px;border-left:3px solid #f44336}.login-btn[_ngcontent-%COMP%]{height:48px;font-size:1rem;margin-top:8px;display:flex;align-items:center;justify-content:center}"],changeDetection:0})};export{mt as LoginComponent};
