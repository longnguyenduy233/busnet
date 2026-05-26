import{a as Zt,b as Xt,c as it,f as Gi,i as ji,l as qi,p as Qi,q as $i,r as Ki,s as Wi,t as Ui,u as Zi,v as Xi,w as Ji,x as Yi}from"./chunk-DE2ZJ3JT.js";import{a as gi,b as vi,c as fi,d as yi,e as bi,f as Ci,g as wi,h as xi,i as Hi}from"./chunk-FFZDC3CH.js";import{a as hi,b as mi}from"./chunk-C7BURL3T.js";import{d as ki,e as Ii,f as Mi,g as Si,h as Di,i as Ei,j as Ri,k as Fi,l as Ai,m as Ti,n as Pi,o as Bi,p as Oi,q as Li,r as Ni,s as zi,t as Vi}from"./chunk-F52SNRVK.js";import"./chunk-47PK5L5Q.js";import{A as ui,B as _i,b as Jt,d as I,f as Yt,g as ti,j as ii,k as ei,m as ni,n as ai,q as oi,r as ci,s as ri,t as si,w as di,x as li,y as pi}from"./chunk-R5HQ3SO4.js";import{a as X,b as J,c as Y,d as tt}from"./chunk-AJPPCRDX.js";import"./chunk-SL5CPD74.js";import{D as zt,O as Vt,P as mt,Q as Ht,aa as Gt,ba as jt,e as Lt,ia as qt,ma as Qt,p as Nt,pa as $t,ra as Kt,ta as Wt,ua as ut,va as W,wa as Ut,xa as U,ya as Z}from"./chunk-OYCIHWOU.js";import{$b as At,A as ot,B as G,Bb as E,Cb as C,Db as It,Eb as w,Ec as z,Fb as Mt,Ga as Ct,Hb as St,Hc as R,Ia as q,Ib as Dt,Ic as ht,Ja as wt,Jb as f,Kb as c,Lb as o,Mb as m,Nb as Et,Ob as Rt,Qb as Q,Rb as $,Tb as F,Ub as Ft,Vb as h,W as j,X as gt,Xb as u,Y as P,Yb as st,Zb as O,_b as dt,ab as p,ac as _,bc as g,e as H,ea as vt,fc as lt,ga as S,hc as K,ia as l,ic as Tt,jc as d,kc as L,lc as N,mc as Pt,nb as D,ob as xt,oc as Bt,pa as y,pb as rt,pc as pt,qa as b,qc as x,rc as k,sb as kt,ta as ft,tb as B,ua as yt,xa as ct,ya as bt,yc as Ot}from"./chunk-F7T5WLQZ.js";import{a as A,b as T}from"./chunk-MSLIVQHW.js";var me=["*",[["mat-chip-avatar"],["","matChipAvatar",""]],[["mat-chip-trailing-icon"],["","matChipRemove",""],["","matChipTrailingIcon",""]]],ue=["*","mat-chip-avatar, [matChipAvatar]","mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]"];function _e(n,a){n&1&&(c(0,"span",3),O(1,1),o())}function ge(n,a){n&1&&(c(0,"span",6),O(1,2),o())}var ve=["*"];var fe=new S("mat-chips-default-options",{providedIn:"root",factory:()=>({separatorKeyCodes:[13]})}),te=new S("MatChipAvatar"),ie=new S("MatChipTrailingIcon"),ee=new S("MatChipEdit"),ne=new S("MatChipRemove"),ce=new S("MatChip"),re=(()=>{class n{_elementRef=l(q);_parentChip=l(ce);_isPrimary=!0;_isLeading=!1;get disabled(){return this._disabled||this._parentChip?.disabled||!1}set disabled(t){this._disabled=t}_disabled=!1;tabIndex=-1;_allowFocusWhenDisabled=!1;_getDisabledAttribute(){return this.disabled&&!this._allowFocusWhenDisabled?"":null}constructor(){l(mt).load(ut),this._elementRef.nativeElement.nodeName==="BUTTON"&&this._elementRef.nativeElement.setAttribute("type","button")}focus(){this._elementRef.nativeElement.focus()}static \u0275fac=function(e){return new(e||n)};static \u0275dir=rt({type:n,selectors:[["","matChipContent",""]],hostAttrs:[1,"mat-mdc-chip-action","mdc-evolution-chip__action","mdc-evolution-chip__action--presentational"],hostVars:8,hostBindings:function(e,i){e&2&&(E("disabled",i._getDisabledAttribute())("aria-disabled",i.disabled),K("mdc-evolution-chip__action--primary",i._isPrimary)("mdc-evolution-chip__action--secondary",!i._isPrimary)("mdc-evolution-chip__action--trailing",!i._isPrimary&&!i._isLeading))},inputs:{disabled:[2,"disabled","disabled",R],tabIndex:[2,"tabIndex","tabIndex",t=>t==null?-1:ht(t)],_allowFocusWhenDisabled:"_allowFocusWhenDisabled"}})}return n})(),ye=(()=>{class n extends re{_getTabindex(){return this.disabled&&!this._allowFocusWhenDisabled?null:this.tabIndex.toString()}_handleClick(t){!this.disabled&&this._isPrimary&&(t.preventDefault(),this._parentChip._handlePrimaryActionInteraction())}_handleKeydown(t){(t.keyCode===13||t.keyCode===32)&&!this.disabled&&this._isPrimary&&!this._parentChip._isEditing&&(t.preventDefault(),this._parentChip._handlePrimaryActionInteraction())}static \u0275fac=(()=>{let t;return function(i){return(t||(t=Ct(n)))(i||n)}})();static \u0275dir=rt({type:n,selectors:[["","matChipAction",""]],hostVars:3,hostBindings:function(e,i){e&1&&h("click",function(r){return i._handleClick(r)})("keydown",function(r){return i._handleKeydown(r)}),e&2&&(E("tabindex",i._getTabindex()),K("mdc-evolution-chip__action--presentational",!1))},features:[kt]})}return n})();var _t=(()=>{class n{_changeDetectorRef=l(z);_elementRef=l(q);_tagName=l(Ot);_ngZone=l(bt);_focusMonitor=l(Vt);_globalRippleOptions=l(Kt,{optional:!0});_document=l(yt);_onFocus=new H;_onBlur=new H;_isBasicChip=!1;role=null;_hasFocusInternal=!1;_pendingFocus=!1;_actionChanges;_animationsDisabled=$t();_allLeadingIcons;_allTrailingIcons;_allEditIcons;_allRemoveIcons;_hasFocus(){return this._hasFocusInternal}id=l(jt).getId("mat-mdc-chip-");ariaLabel=null;ariaDescription=null;_chipListDisabled=!1;_hadFocusOnRemove=!1;_textElement;get value(){return this._value!==void 0?this._value:this._textElement.textContent.trim()}set value(t){this._value=t}_value;color;removable=!0;highlighted=!1;disableRipple=!1;get disabled(){return this._disabled||this._chipListDisabled}set disabled(t){this._disabled=t}_disabled=!1;removed=new ct;destroyed=new ct;basicChipAttrName="mat-basic-chip";leadingIcon;editIcon;trailingIcon;removeIcon;primaryAction;_rippleLoader=l(Wt);_injector=l(ft);constructor(){let t=l(mt);t.load(ut),t.load(Ht),this._monitorFocus(),this._rippleLoader?.configureRipple(this._elementRef.nativeElement,{className:"mat-mdc-chip-ripple",disabled:this._isRippleDisabled()})}ngOnInit(){this._isBasicChip=this._elementRef.nativeElement.hasAttribute(this.basicChipAttrName)||this._tagName.toLowerCase()===this.basicChipAttrName}ngAfterViewInit(){this._textElement=this._elementRef.nativeElement.querySelector(".mat-mdc-chip-action-label"),this._pendingFocus&&(this._pendingFocus=!1,this.focus())}ngAfterContentInit(){this._actionChanges=ot(this._allLeadingIcons.changes,this._allTrailingIcons.changes,this._allEditIcons.changes,this._allRemoveIcons.changes).subscribe(()=>this._changeDetectorRef.markForCheck())}ngDoCheck(){this._rippleLoader.setDisabled(this._elementRef.nativeElement,this._isRippleDisabled())}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef),this._rippleLoader?.destroyRipple(this._elementRef.nativeElement),this._actionChanges?.unsubscribe(),this.destroyed.emit({chip:this}),this.destroyed.complete()}remove(){this.removable&&(this._hadFocusOnRemove=this._hasFocus(),this.removed.emit({chip:this}))}_isRippleDisabled(){return this.disabled||this.disableRipple||this._animationsDisabled||this._isBasicChip||!this._hasInteractiveActions()||!!this._globalRippleOptions?.disabled}_hasTrailingIcon(){return!!(this.trailingIcon||this.removeIcon)}_handleKeydown(t){(t.keyCode===8&&!t.repeat||t.keyCode===46)&&(t.preventDefault(),this.remove())}focus(){this.disabled||(this.primaryAction?this.primaryAction.focus():this._pendingFocus=!0)}_getSourceAction(t){return this._getActions().find(e=>{let i=e._elementRef.nativeElement;return i===t||i.contains(t)})}_getActions(){let t=[];return this.editIcon&&t.push(this.editIcon),this.primaryAction&&t.push(this.primaryAction),this.removeIcon&&t.push(this.removeIcon),t}_handlePrimaryActionInteraction(){}_hasInteractiveActions(){return this._getActions().length>0}_edit(t){}_monitorFocus(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(t=>{let e=t!==null;e!==this._hasFocusInternal&&(this._hasFocusInternal=e,e?this._onFocus.next({chip:this}):(this._changeDetectorRef.markForCheck(),setTimeout(()=>this._ngZone.run(()=>this._onBlur.next({chip:this})))))})}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=D({type:n,selectors:[["mat-basic-chip"],["","mat-basic-chip",""],["mat-chip"],["","mat-chip",""]],contentQueries:function(e,i,s){if(e&1&&dt(s,te,5)(s,ee,5)(s,ie,5)(s,ne,5)(s,te,5)(s,ie,5)(s,ee,5)(s,ne,5),e&2){let r;_(r=g())&&(i.leadingIcon=r.first),_(r=g())&&(i.editIcon=r.first),_(r=g())&&(i.trailingIcon=r.first),_(r=g())&&(i.removeIcon=r.first),_(r=g())&&(i._allLeadingIcons=r),_(r=g())&&(i._allTrailingIcons=r),_(r=g())&&(i._allEditIcons=r),_(r=g())&&(i._allRemoveIcons=r)}},viewQuery:function(e,i){if(e&1&&At(ye,5),e&2){let s;_(s=g())&&(i.primaryAction=s.first)}},hostAttrs:[1,"mat-mdc-chip"],hostVars:31,hostBindings:function(e,i){e&1&&h("keydown",function(r){return i._handleKeydown(r)}),e&2&&(Ft("id",i.id),E("role",i.role)("aria-label",i.ariaLabel),Tt("mat-"+(i.color||"primary")),K("mdc-evolution-chip",!i._isBasicChip)("mdc-evolution-chip--disabled",i.disabled)("mdc-evolution-chip--with-trailing-action",i._hasTrailingIcon())("mdc-evolution-chip--with-primary-graphic",i.leadingIcon)("mdc-evolution-chip--with-primary-icon",i.leadingIcon)("mdc-evolution-chip--with-avatar",i.leadingIcon)("mat-mdc-chip-with-avatar",i.leadingIcon)("mat-mdc-chip-highlighted",i.highlighted)("mat-mdc-chip-disabled",i.disabled)("mat-mdc-basic-chip",i._isBasicChip)("mat-mdc-standard-chip",!i._isBasicChip)("mat-mdc-chip-with-trailing-icon",i._hasTrailingIcon())("_mat-animation-noopable",i._animationsDisabled))},inputs:{role:"role",id:"id",ariaLabel:[0,"aria-label","ariaLabel"],ariaDescription:[0,"aria-description","ariaDescription"],value:"value",color:"color",removable:[2,"removable","removable",R],highlighted:[2,"highlighted","highlighted",R],disableRipple:[2,"disableRipple","disableRipple",R],disabled:[2,"disabled","disabled",R]},outputs:{removed:"removed",destroyed:"destroyed"},exportAs:["matChip"],features:[Bt([{provide:ce,useExisting:n}])],ngContentSelectors:ue,decls:8,vars:2,consts:[[1,"mat-mdc-chip-focus-overlay"],[1,"mdc-evolution-chip__cell","mdc-evolution-chip__cell--primary"],["matChipContent",""],[1,"mdc-evolution-chip__graphic","mat-mdc-chip-graphic"],[1,"mdc-evolution-chip__text-label","mat-mdc-chip-action-label"],[1,"mat-mdc-chip-primary-focus-indicator","mat-focus-indicator"],[1,"mdc-evolution-chip__cell","mdc-evolution-chip__cell--trailing"]],template:function(e,i){e&1&&(st(me),m(0,"span",0),c(1,"span",1)(2,"span",2),C(3,_e,2,0,"span",3),c(4,"span",4),O(5),m(6,"span",5),o()()(),C(7,ge,2,0,"span",6)),e&2&&(p(3),w(i.leadingIcon?3:-1),p(4),w(i._hasTrailingIcon()?7:-1))},dependencies:[re],styles:[`.mdc-evolution-chip,
.mdc-evolution-chip__cell,
.mdc-evolution-chip__action {
  display: inline-flex;
  align-items: center;
}

.mdc-evolution-chip {
  position: relative;
  max-width: 100%;
}

.mdc-evolution-chip__cell,
.mdc-evolution-chip__action {
  height: 100%;
}

.mdc-evolution-chip__cell--primary {
  flex-basis: 100%;
  overflow-x: hidden;
}

.mdc-evolution-chip__cell--trailing {
  flex: 1 0 auto;
}

.mdc-evolution-chip__action {
  align-items: center;
  background: none;
  border: none;
  box-sizing: content-box;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  outline: none;
  padding: 0;
  text-decoration: none;
  color: inherit;
}

.mdc-evolution-chip__action--presentational {
  cursor: auto;
}

.mdc-evolution-chip--disabled,
.mdc-evolution-chip__action:disabled {
  pointer-events: none;
}
@media (forced-colors: active) {
  .mdc-evolution-chip--disabled,
  .mdc-evolution-chip__action:disabled {
    forced-color-adjust: none;
  }
}

.mdc-evolution-chip__action--primary {
  font: inherit;
  letter-spacing: inherit;
  white-space: inherit;
  overflow-x: hidden;
}
.mat-mdc-standard-chip .mdc-evolution-chip__action--primary::before {
  border-width: var(--mat-chip-outline-width, 1px);
  border-radius: var(--mat-chip-container-shape-radius, 8px);
  box-sizing: border-box;
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  pointer-events: none;
  top: 0;
  width: 100%;
  z-index: 1;
  border-style: solid;
}
.mat-mdc-standard-chip .mdc-evolution-chip__action--primary {
  padding-left: 12px;
  padding-right: 12px;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 12px;
}
[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary {
  padding-left: 12px;
  padding-right: 0;
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--primary::before {
  border-color: var(--mat-chip-outline-color, var(--mat-sys-outline));
}
.mdc-evolution-chip__action--primary:not(.mdc-evolution-chip__action--presentational):not(.mdc-ripple-upgraded):focus::before {
  border-color: var(--mat-chip-focus-outline-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--primary::before {
  border-color: var(--mat-chip-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary::before {
  border-width: var(--mat-chip-flat-selected-outline-width, 0);
}
.mat-mdc-basic-chip .mdc-evolution-chip__action--primary {
  font: inherit;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 12px;
}
[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary {
  padding-left: 12px;
  padding-right: 0;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 12px;
  padding-right: 0;
}
[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 12px;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 0;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 0;
}
[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 0;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 12px;
}
[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary {
  padding-left: 12px;
  padding-right: 0;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 0;
}
[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 0;
}

.mdc-evolution-chip__action--secondary {
  position: relative;
  overflow: visible;
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--secondary {
  color: var(--mat-chip-with-trailing-icon-trailing-icon-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--secondary {
  color: var(--mat-chip-with-trailing-icon-disabled-trailing-icon-color, var(--mat-sys-on-surface));
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary {
  padding-left: 8px;
  padding-right: 8px;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary {
  padding-left: 8px;
  padding-right: 8px;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary {
  padding-left: 8px;
  padding-right: 8px;
}
[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary {
  padding-left: 8px;
  padding-right: 8px;
}

.mdc-evolution-chip__text-label {
  -webkit-user-select: none;
  user-select: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.mat-mdc-standard-chip .mdc-evolution-chip__text-label {
  font-family: var(--mat-chip-label-text-font, var(--mat-sys-label-large-font));
  line-height: var(--mat-chip-label-text-line-height, var(--mat-sys-label-large-line-height));
  font-size: var(--mat-chip-label-text-size, var(--mat-sys-label-large-size));
  font-weight: var(--mat-chip-label-text-weight, var(--mat-sys-label-large-weight));
  letter-spacing: var(--mat-chip-label-text-tracking, var(--mat-sys-label-large-tracking));
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label {
  color: var(--mat-chip-label-text-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label {
  color: var(--mat-chip-selected-label-text-color, var(--mat-sys-on-secondary-container));
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label, .mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label {
  color: var(--mat-chip-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mdc-evolution-chip__graphic {
  align-items: center;
  display: inline-flex;
  justify-content: center;
  overflow: hidden;
  pointer-events: none;
  position: relative;
  flex: 1 0 auto;
}
.mat-mdc-standard-chip .mdc-evolution-chip__graphic {
  width: var(--mat-chip-with-avatar-avatar-size, 24px);
  height: var(--mat-chip-with-avatar-avatar-size, 24px);
  font-size: var(--mat-chip-with-avatar-avatar-size, 24px);
}
.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic {
  transition: width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic {
  width: 0;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic {
  padding-left: 6px;
  padding-right: 6px;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic {
  padding-left: 4px;
  padding-right: 8px;
}
[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic {
  padding-left: 8px;
  padding-right: 4px;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic {
  padding-left: 6px;
  padding-right: 6px;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic {
  padding-left: 4px;
  padding-right: 8px;
}
[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic {
  padding-left: 8px;
  padding-right: 4px;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__graphic {
  padding-left: 0;
}

.mdc-evolution-chip__checkmark {
  position: absolute;
  opacity: 0;
  top: 50%;
  left: 50%;
  height: 20px;
  width: 20px;
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark {
  color: var(--mat-chip-with-icon-selected-icon-color, var(--mat-sys-on-secondary-container));
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark {
  color: var(--mat-chip-with-icon-disabled-icon-color, var(--mat-sys-on-surface));
}
.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark {
  transition: transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate(-75%, -50%);
}
.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark {
  transform: translate(-50%, -50%);
  opacity: 1;
}

.mdc-evolution-chip__checkmark-svg {
  display: block;
}

.mdc-evolution-chip__checkmark-path {
  stroke-width: 2px;
  stroke-dasharray: 29.7833385;
  stroke-dashoffset: 29.7833385;
  stroke: currentColor;
}
.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path {
  transition: stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path {
  stroke-dashoffset: 0;
}
@media (forced-colors: active) {
  .mdc-evolution-chip__checkmark-path {
    stroke: CanvasText !important;
  }
}

.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing {
  height: 18px;
  width: 18px;
  font-size: 18px;
}
.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove {
  opacity: calc(var(--mat-chip-trailing-action-opacity, 1) * var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38));
}
.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove:focus {
  opacity: calc(var(--mat-chip-trailing-action-focus-opacity, 1) * var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38));
}

.mat-mdc-standard-chip {
  border-radius: var(--mat-chip-container-shape-radius, 8px);
  height: var(--mat-chip-container-height, 32px);
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) {
  background-color: var(--mat-chip-elevated-container-color, transparent);
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled {
  background-color: var(--mat-chip-elevated-disabled-container-color);
}
.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled) {
  background-color: var(--mat-chip-elevated-selected-container-color, var(--mat-sys-secondary-container));
}
.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled {
  background-color: var(--mat-chip-flat-disabled-selected-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
@media (forced-colors: active) {
  .mat-mdc-standard-chip {
    outline: solid 1px;
  }
}

.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary {
  border-radius: var(--mat-chip-with-avatar-avatar-shape-radius, 24px);
  width: var(--mat-chip-with-icon-icon-size, 18px);
  height: var(--mat-chip-with-icon-icon-size, 18px);
  font-size: var(--mat-chip-with-icon-icon-size, 18px);
}
.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary {
  opacity: 0;
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary {
  color: var(--mat-chip-with-icon-icon-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary {
  color: var(--mat-chip-with-icon-disabled-icon-color, var(--mat-sys-on-surface));
}

.mat-mdc-chip-highlighted {
  --mat-chip-with-icon-icon-color: var(--mat-chip-with-icon-selected-icon-color, var(--mat-sys-on-secondary-container));
  --mat-chip-elevated-container-color: var(--mat-chip-elevated-selected-container-color, var(--mat-sys-secondary-container));
  --mat-chip-label-text-color: var(--mat-chip-selected-label-text-color, var(--mat-sys-on-secondary-container));
  --mat-chip-outline-width: var(--mat-chip-flat-selected-outline-width, 0);
}

.mat-mdc-chip-focus-overlay {
  background: var(--mat-chip-focus-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-chip-selected .mat-mdc-chip-focus-overlay, .mat-mdc-chip-highlighted .mat-mdc-chip-focus-overlay {
  background: var(--mat-chip-selected-focus-state-layer-color, var(--mat-sys-on-secondary-container));
}
.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay {
  background: var(--mat-chip-hover-state-layer-color, var(--mat-sys-on-surface-variant));
  opacity: var(--mat-chip-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-chip-focus-overlay .mat-mdc-chip-selected:hover, .mat-mdc-chip-highlighted:hover .mat-mdc-chip-focus-overlay {
  background: var(--mat-chip-selected-hover-state-layer-color, var(--mat-sys-on-secondary-container));
  opacity: var(--mat-chip-selected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay {
  background: var(--mat-chip-focus-state-layer-color, var(--mat-sys-on-surface-variant));
  opacity: var(--mat-chip-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-chip-selected.cdk-focused .mat-mdc-chip-focus-overlay, .mat-mdc-chip-highlighted.cdk-focused .mat-mdc-chip-focus-overlay {
  background: var(--mat-chip-selected-focus-state-layer-color, var(--mat-sys-on-secondary-container));
  opacity: var(--mat-chip-selected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}

.mdc-evolution-chip--disabled:not(.mdc-evolution-chip--selected) .mat-mdc-chip-avatar {
  opacity: var(--mat-chip-with-avatar-disabled-avatar-opacity, 0.38);
}

.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing {
  opacity: var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38);
}

.mdc-evolution-chip--disabled.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark {
  opacity: var(--mat-chip-with-icon-disabled-icon-opacity, 0.38);
}

.mat-mdc-standard-chip.mdc-evolution-chip--disabled {
  opacity: var(--mat-chip-disabled-container-opacity, 1);
}
.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__icon--trailing, .mat-mdc-standard-chip.mat-mdc-chip-highlighted .mdc-evolution-chip__icon--trailing {
  color: var(--mat-chip-selected-trailing-icon-color, var(--mat-sys-on-secondary-container));
}
.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing, .mat-mdc-standard-chip.mat-mdc-chip-highlighted.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing {
  color: var(--mat-chip-selected-disabled-trailing-icon-color, var(--mat-sys-on-surface));
}

.mat-mdc-chip-edit, .mat-mdc-chip-remove {
  opacity: var(--mat-chip-trailing-action-opacity, 1);
}
.mat-mdc-chip-edit:focus, .mat-mdc-chip-remove:focus {
  opacity: var(--mat-chip-trailing-action-focus-opacity, 1);
}
.mat-mdc-chip-edit::after, .mat-mdc-chip-remove::after {
  background-color: var(--mat-chip-trailing-action-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-chip-edit:hover::after, .mat-mdc-chip-remove:hover::after {
  opacity: calc(var(--mat-chip-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity)) + var(--mat-chip-trailing-action-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity)));
}
.mat-mdc-chip-edit:focus::after, .mat-mdc-chip-remove:focus::after {
  opacity: calc(var(--mat-chip-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity)) + var(--mat-chip-trailing-action-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity)));
}

.mat-mdc-chip-selected .mat-mdc-chip-remove::after,
.mat-mdc-chip-highlighted .mat-mdc-chip-remove::after {
  background-color: var(--mat-chip-selected-trailing-action-state-layer-color, var(--mat-sys-on-secondary-container));
}

.mat-mdc-chip.cdk-focused .mat-mdc-chip-edit:focus::after, .mat-mdc-chip.cdk-focused .mat-mdc-chip-remove:focus::after {
  opacity: calc(var(--mat-chip-selected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity)) + var(--mat-chip-trailing-action-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity)));
}
.mat-mdc-chip.cdk-focused .mat-mdc-chip-edit:hover::after, .mat-mdc-chip.cdk-focused .mat-mdc-chip-remove:hover::after {
  opacity: calc(var(--mat-chip-selected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity)) + var(--mat-chip-trailing-action-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity)));
}

.mat-mdc-standard-chip {
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-standard-chip .mat-mdc-chip-graphic,
.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon {
  box-sizing: content-box;
}
.mat-mdc-standard-chip._mat-animation-noopable,
.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,
.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,
.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path {
  transition-duration: 1ms;
  animation-duration: 1ms;
}

.mat-mdc-chip-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  opacity: 0;
  border-radius: inherit;
  transition: opacity 150ms linear;
}
._mat-animation-noopable .mat-mdc-chip-focus-overlay {
  transition: none;
}
.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay {
  display: none;
}

.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}

.mat-mdc-chip-avatar {
  text-align: center;
  line-height: 1;
  color: var(--mat-chip-with-icon-icon-color, currentColor);
}

.mat-mdc-chip {
  position: relative;
  z-index: 0;
}

.mat-mdc-chip-action-label {
  text-align: left;
  z-index: 1;
}
[dir=rtl] .mat-mdc-chip-action-label {
  text-align: right;
}
.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label {
  position: relative;
}
.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
}
.mat-mdc-chip-action-label .mat-focus-indicator::before {
  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);
}

.mat-mdc-chip-edit::before, .mat-mdc-chip-remove::before {
  margin: calc(var(--mat-focus-indicator-border-width, 3px) * -1);
  left: 8px;
  right: 8px;
}
.mat-mdc-chip-edit::after, .mat-mdc-chip-remove::after {
  content: "";
  display: block;
  opacity: 0;
  position: absolute;
  top: -3px;
  bottom: -3px;
  left: 5px;
  right: 5px;
  border-radius: 50%;
  box-sizing: border-box;
  padding: 12px;
  margin: -12px;
  background-clip: content-box;
}
.mat-mdc-chip-edit .mat-icon, .mat-mdc-chip-remove .mat-icon {
  width: 18px;
  height: 18px;
  font-size: 18px;
  box-sizing: content-box;
}

.mat-chip-edit-input {
  cursor: text;
  display: inline-block;
  color: inherit;
  outline: 0;
}

@media (forced-colors: active) {
  .mat-mdc-chip-selected:not(.mat-mdc-chip-multiple) {
    outline-width: 3px;
  }
}

.mat-mdc-chip-action:focus-visible .mat-focus-indicator::before {
  content: "";
}

.mdc-evolution-chip__icon, .mat-mdc-chip-edit .mat-icon, .mat-mdc-chip-remove .mat-icon {
  min-height: fit-content;
}

img.mdc-evolution-chip__icon {
  min-height: 0;
}
`],encapsulation:2,changeDetection:0})}return n})();var se=(()=>{class n{_elementRef=l(q);_changeDetectorRef=l(z);_dir=l(qt,{optional:!0});_lastDestroyedFocusedChipIndex=null;_keyManager;_destroyed=new H;_defaultRole="presentation";get chipFocusChanges(){return this._getChipStream(t=>t._onFocus)}get chipDestroyedChanges(){return this._getChipStream(t=>t.destroyed)}get chipRemovedChanges(){return this._getChipStream(t=>t.removed)}get disabled(){return this._disabled}set disabled(t){this._disabled=t,this._syncChipsState()}_disabled=!1;get empty(){return!this._chips||this._chips.length===0}get role(){return this._explicitRole?this._explicitRole:this.empty?null:this._defaultRole}tabIndex=0;set role(t){this._explicitRole=t}_explicitRole=null;get focused(){return this._hasFocusedChip()}_chips;_chipActions=new wt;constructor(){}ngAfterViewInit(){this._setUpFocusManagement(),this._trackChipSetChanges(),this._trackDestroyedFocusedChip()}ngOnDestroy(){this._keyManager?.destroy(),this._chipActions.destroy(),this._destroyed.next(),this._destroyed.complete()}_hasFocusedChip(){return this._chips&&this._chips.some(t=>t._hasFocus())}_syncChipsState(){this._chips?.forEach(t=>{t._chipListDisabled=this._disabled,t._changeDetectorRef.markForCheck()})}focus(){}_handleKeydown(t){this._originatesFromChip(t)&&this._keyManager.onKeydown(t)}_isValidIndex(t){return t>=0&&t<this._chips.length}_allowFocusEscape(){let t=this._elementRef.nativeElement.tabIndex;t!==-1&&(this._elementRef.nativeElement.tabIndex=-1,setTimeout(()=>this._elementRef.nativeElement.tabIndex=t))}_getChipStream(t){return this._chips.changes.pipe(j(null),gt(()=>ot(...this._chips.map(t))))}_originatesFromChip(t){let e=t.target;for(;e&&e!==this._elementRef.nativeElement;){if(e.classList.contains("mat-mdc-chip"))return!0;e=e.parentElement}return!1}_setUpFocusManagement(){this._chips.changes.pipe(j(this._chips)).subscribe(t=>{let e=[];t.forEach(i=>i._getActions().forEach(s=>e.push(s))),this._chipActions.reset(e),this._chipActions.notifyOnChanges()}),this._keyManager=new Gt(this._chipActions).withVerticalOrientation().withHorizontalOrientation(this._dir?this._dir.value:"ltr").withHomeAndEnd().skipPredicate(t=>this._skipPredicate(t)),this.chipFocusChanges.pipe(P(this._destroyed)).subscribe(({chip:t})=>{let e=t._getSourceAction(document.activeElement);e&&this._keyManager.updateActiveItem(e)}),this._dir?.change.pipe(P(this._destroyed)).subscribe(t=>this._keyManager.withHorizontalOrientation(t))}_skipPredicate(t){return t.disabled}_trackChipSetChanges(){this._chips.changes.pipe(j(null),P(this._destroyed)).subscribe(()=>{this.disabled&&Promise.resolve().then(()=>this._syncChipsState()),this._redirectDestroyedChipFocus()})}_trackDestroyedFocusedChip(){this.chipDestroyedChanges.pipe(P(this._destroyed)).subscribe(t=>{let i=this._chips.toArray().indexOf(t.chip),s=t.chip._hasFocus(),r=t.chip._hadFocusOnRemove&&this._keyManager.activeItem&&t.chip._getActions().includes(this._keyManager.activeItem),M=s||r;this._isValidIndex(i)&&M&&(this._lastDestroyedFocusedChipIndex=i)})}_redirectDestroyedChipFocus(){if(this._lastDestroyedFocusedChipIndex!=null){if(this._chips.length){let t=Math.min(this._lastDestroyedFocusedChipIndex,this._chips.length-1),e=this._chips.toArray()[t];e.disabled?this._chips.length===1?this.focus():this._keyManager.setPreviousItemActive():e.focus()}else this.focus();this._lastDestroyedFocusedChipIndex=null}}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=D({type:n,selectors:[["mat-chip-set"]],contentQueries:function(e,i,s){if(e&1&&dt(s,_t,5),e&2){let r;_(r=g())&&(i._chips=r)}},hostAttrs:[1,"mat-mdc-chip-set","mdc-evolution-chip-set"],hostVars:1,hostBindings:function(e,i){e&1&&h("keydown",function(r){return i._handleKeydown(r)}),e&2&&E("role",i.role)},inputs:{disabled:[2,"disabled","disabled",R],role:"role",tabIndex:[2,"tabIndex","tabIndex",t=>t==null?0:ht(t)]},ngContentSelectors:ve,decls:2,vars:0,consts:[["role","presentation",1,"mdc-evolution-chip-set__chips"]],template:function(e,i){e&1&&(st(),Et(0,"div",0),O(1),Rt())},styles:[`.mat-mdc-chip-set {
  display: flex;
}
.mat-mdc-chip-set:focus {
  outline: none;
}
.mat-mdc-chip-set .mdc-evolution-chip-set__chips {
  min-width: 100%;
  margin-left: -8px;
  margin-right: 0;
}
.mat-mdc-chip-set .mdc-evolution-chip {
  margin: 4px 0 4px 8px;
}
[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip-set__chips {
  margin-left: 0;
  margin-right: -8px;
}
[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip {
  margin-left: 0;
  margin-right: 8px;
}

.mdc-evolution-chip-set__chips {
  display: flex;
  flex-flow: wrap;
  min-width: 0;
}

.mat-mdc-chip-set-stacked {
  flex-direction: column;
  align-items: flex-start;
}
.mat-mdc-chip-set-stacked .mat-mdc-chip {
  width: 100%;
}
.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic {
  flex-grow: 0;
}
.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary {
  flex-basis: 100%;
  justify-content: start;
}

input.mat-mdc-chip-input {
  flex: 1 0 150px;
  margin-left: 8px;
}
[dir=rtl] input.mat-mdc-chip-input {
  margin-left: 0;
  margin-right: 8px;
}
.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::placeholder {
  opacity: 1;
}
.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-moz-placeholder {
  opacity: 1;
}
.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-webkit-input-placeholder {
  opacity: 1;
}
.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input:-ms-input-placeholder {
  opacity: 1;
}
.mat-mdc-chip-set + input.mat-mdc-chip-input {
  margin-left: 0;
  margin-right: 0;
}
`],encapsulation:2,changeDetection:0})}return n})();var de=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=xt({type:n});static \u0275inj=vt({providers:[pi,{provide:fe,useValue:{separatorKeyCodes:[13]}}],imports:[Ut,Qt]})}return n})();function le(n){return n.split(",").map(a=>a.trim().replace(/^"|"$/g,""))}function Ce(n,a){return Number.isFinite(n)&&Number.isFinite(a)&&n>=-90&&n<=90&&a>=-180&&a<=180}function pe(n){let a=n.trim();a.charCodeAt(0)===65279&&(a=a.slice(1));let t=a.split(/\r?\n/).map(v=>v.trim()).filter(v=>v.length>0);if(t.length===0)return{ok:!1,error:"CSV is empty."};let e=0,i=le(t[0]);if(i.length<2)return{ok:!1,error:"Each row must have at least two columns (latitude, longitude)."};let s=Number(i[0]),r=Number(i[1]);if((Number.isNaN(s)||Number.isNaN(r))&&(e=1),e>=t.length)return{ok:!1,error:"No data rows found after the header."};let M=[];for(let v=e;v<t.length;v++){let et=le(t[v]);if(et.length<2)return{ok:!1,error:`Row ${v+1}: need two columns (latitude, longitude).`};let nt=Number(et[0]),at=Number(et[1]);if(Number.isNaN(nt)||Number.isNaN(at))return{ok:!1,error:`Row ${v+1}: latitude and longitude must be numbers.`};if(!Ce(nt,at))return{ok:!1,error:`Row ${v+1}: invalid latitude (-90..90) or longitude (-180..180).`};M.push({latitude:nt,longitude:at})}return M.length===0?{ok:!1,error:"No route points parsed."}:{ok:!0,points:M}}function Me(n,a){n&1&&(c(0,"mat-error"),d(1,"Name is required"),o())}function Se(n,a){if(n&1){let t=F();c(0,"div",14)(1,"span",19),d(2),o(),c(3,"mat-form-field",20)(4,"mat-label"),d(5,"Latitude"),o(),m(6,"input",21),o(),c(7,"mat-form-field",20)(8,"mat-label"),d(9,"Longitude"),o(),m(10,"input",22),o(),c(11,"button",23),h("click",function(){let i=y(t).$index,s=u();return b(s.removePoint(i))}),c(12,"mat-icon"),d(13,"remove_circle_outline"),o()()()}if(n&2){let t=a.$implicit,e=a.$index,i=u();f("formGroup",i.asGroup(t)),p(2),L(e+1)}}function De(n,a){n&1&&(c(0,"p",15),d(1,"No points added yet."),o())}var V=class n{fb=l(oi);dialogRef=l(gi);snack=l(Zt);cdr=l(z);data=l(vi,{optional:!0})??{};form=this.fb.group({name:[this.data?.route?.name??"",[I.required,I.maxLength(100)]],points:this.fb.array((this.data?.route?.points??[]).map(a=>this.makePointGroup(a.latitude,a.longitude)))});get pointsArray(){return this.form.get("points")}asGroup(a){return a}addPoint(){this.pointsArray.push(this.makePointGroup())}removePoint(a){this.pointsArray.removeAt(a)}onCsvFileSelected(a,t){let e=a.target.files?.[0];if(t.value="",!e)return;let i=new FileReader;i.onload=()=>{let s=typeof i.result=="string"?i.result:"",r=pe(s);if(!r.ok){this.snack.open(r.error,"Dismiss",{duration:8e3}),this.cdr.markForCheck();return}this.replaceAllPoints(r.points),this.snack.open(`Imported ${r.points.length} points.`,void 0,{duration:3e3}),this.cdr.markForCheck()},i.onerror=()=>{this.snack.open("Could not read the CSV file.","Dismiss",{duration:5e3}),this.cdr.markForCheck()},i.readAsText(e,"UTF-8")}replaceAllPoints(a){for(;this.pointsArray.length>0;)this.pointsArray.removeAt(0);for(let t of a)this.pointsArray.push(this.makePointGroup(t.latitude,t.longitude))}submit(){if(this.form.invalid)return;let a=this.form.value;this.dialogRef.close({name:a.name,points:a.points.map((t,e)=>T(A({},t),{order:e}))})}makePointGroup(a=0,t=0){return this.fb.group({latitude:[a,[I.required,I.min(-90),I.max(90)]],longitude:[t,[I.required,I.min(-180),I.max(180)]]})}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=D({type:n,selectors:[["app-route-form-dialog"]],decls:37,vars:7,consts:[["csvFileInput",""],["mat-dialog-title",""],[1,"route-dialog-content"],[3,"formGroup"],["appearance","outline",1,"full-width"],["matInput","","formControlName","name"],[1,"points-section"],[1,"points-header"],[1,"points-label"],[1,"points-actions"],["type","file","accept",".csv,text/csv,text/plain",1,"csv-file-input",3,"change"],["mat-button","","type","button","matTooltip","Replace all points. Two columns: latitude, longitude (decimal .). Optional header row.",3,"click"],["mat-button","","type","button",3,"click"],[1,"csv-hint"],[1,"point-row",3,"formGroup"],[1,"no-points"],["align","end"],["mat-button","","mat-dialog-close",""],["mat-raised-button","","color","primary",3,"click","disabled"],[1,"point-index"],["appearance","outline",1,"coord-field"],["matInput","","type","number","formControlName","latitude","step","0.000001"],["matInput","","type","number","formControlName","longitude","step","0.000001"],["mat-icon-button","","type","button","color","warn","matTooltip","Remove point",3,"click"]],template:function(t,e){if(t&1){let i=F();c(0,"h2",1),d(1),o(),c(2,"mat-dialog-content",2)(3,"form",3)(4,"mat-form-field",4)(5,"mat-label"),d(6,"Route Name"),o(),m(7,"input",5),C(8,Me,2,0,"mat-error"),o(),c(9,"div",6)(10,"div",7)(11,"span",8),d(12),o(),c(13,"span",9)(14,"input",10,0),h("change",function(r){y(i);let M=lt(15);return b(e.onCsvFileSelected(r,M))}),o(),c(16,"button",11),h("click",function(){y(i);let r=lt(15);return b(r.click())}),c(17,"mat-icon"),d(18,"upload_file"),o(),d(19," Import CSV "),o(),c(20,"button",12),h("click",function(){return e.addPoint()}),c(21,"mat-icon"),d(22,"add"),o(),d(23," Add Point "),o()()(),c(24,"p",13),d(25,"CSV format: "),c(26,"code"),d(27,"latitude,longitude"),o(),d(28," per line."),o(),St(29,Se,14,2,"div",14,Mt),C(31,De,2,0,"p",15),o()()(),c(32,"mat-dialog-actions",16)(33,"button",17),d(34,"Cancel"),o(),c(35,"button",18),h("click",function(){return e.submit()}),d(36),o()()}if(t&2){let i;p(),L(e.data.route?"Edit Route":"New Route"),p(2),f("formGroup",e.form),p(5),w((i=e.form.get("name"))!=null&&i.invalid&&((i=e.form.get("name"))!=null&&i.touched)?8:-1),p(4),N("Route Points (",e.pointsArray.length,")"),p(17),Dt(e.pointsArray.controls),p(2),w(e.pointsArray.length===0?31:-1),p(4),f("disabled",e.form.invalid),p(),N(" ",e.data.route?"Save":"Create"," ")}},dependencies:[ci,ii,Jt,ei,Yt,ti,ai,ni,xi,yi,bi,wi,Ci,li,di,ri,si,mi,hi,Z,U,W,J,X,tt,Y,Xt],styles:[".route-dialog-content[_ngcontent-%COMP%]{min-width:480px;max-height:60vh}.route-dialog-content.mat-mdc-dialog-content[_ngcontent-%COMP%]{padding-top:8px}.full-width[_ngcontent-%COMP%]{width:100%}.points-section[_ngcontent-%COMP%]{margin-top:8px}.points-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px}.points-label[_ngcontent-%COMP%]{font-weight:500;color:#0009;font-size:.875rem}.points-actions[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;align-items:center;gap:4px}.csv-file-input[_ngcontent-%COMP%]{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.csv-hint[_ngcontent-%COMP%]{margin:4px 0 8px;font-size:.75rem;color:#00000073}.csv-hint[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{font-size:.7rem;background:#0000000f;padding:1px 4px;border-radius:2px}.point-row[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;margin-bottom:4px}.point-index[_ngcontent-%COMP%]{min-width:24px;font-size:.8rem;color:#888;text-align:center}.coord-field[_ngcontent-%COMP%]{flex:1}.no-points[_ngcontent-%COMP%]{color:#aaa;font-size:.875rem;text-align:center;padding:16px 0}"],changeDetection:0})};var Ee=()=>[],Re=()=>[5,10,25,50];function Fe(n,a){n&1&&(c(0,"div",1)(1,"mat-icon"),d(2,"error_outline"),o(),d(3),o()),n&2&&(p(3),N(" ",a," "))}function Ae(n,a){n&1&&(c(0,"div",4),m(1,"mat-spinner",5),o())}function Te(n,a){n&1&&(c(0,"th",18),d(1,"Name"),o())}function Pe(n,a){if(n&1&&(c(0,"td",19),d(1),o()),n&2){let t=a.$implicit;p(),L(t.name)}}function Be(n,a){n&1&&(c(0,"th",20),d(1,"Points"),o())}function Oe(n,a){if(n&1&&(c(0,"td",19)(1,"mat-chip-set")(2,"mat-chip"),d(3),o()()()),n&2){let t=a.$implicit;p(3),Pt("",t.points.length," point",t.points.length!==1?"s":"")}}function Le(n,a){n&1&&m(0,"th",20)}function Ne(n,a){if(n&1){let t=F();c(0,"td",21)(1,"button",22),h("click",function(){let i=y(t).$implicit,s=u(2);return b(s.openEdit(i))}),c(2,"mat-icon"),d(3,"edit"),o()(),c(4,"button",23),h("click",function(){let i=y(t).$implicit,s=u(2);return b(s.confirmDelete(i))}),c(5,"mat-icon"),d(6,"delete"),o()()()}}function ze(n,a){n&1&&m(0,"tr",24)}function Ve(n,a){n&1&&m(0,"tr",25)}function He(n,a){if(n&1&&(c(0,"tr",26)(1,"td",27),d(2,' No routes found. Click "New Route" to add one. '),o()()),n&2){let t=u(2);p(),E("colspan",t.displayedColumns.length)}}function Ge(n,a){if(n&1){let t=F();c(0,"table",6),x(1,"async"),x(2,"async"),x(3,"async"),h("matSortChange",function(i){y(t);let s=u();return b(s.onSortChange(i))}),Q(4,7),B(5,Te,2,0,"th",8)(6,Pe,2,1,"td",9),$(),Q(7,10),B(8,Be,2,0,"th",11)(9,Oe,4,2,"td",9),$(),Q(10,12),B(11,Le,1,0,"th",11)(12,Ne,7,0,"td",13),$(),B(13,ze,1,0,"tr",14)(14,Ve,1,0,"tr",15)(15,He,3,1,"tr",16),o(),c(16,"mat-paginator",17),x(17,"async"),x(18,"async"),x(19,"async"),h("page",function(i){y(t);let s=u();return b(s.onPageChange(i))}),o()}if(n&2){let t=u();f("dataSource",k(1,9,t.routes$)??pt(21,Ee))("matSortActive",k(2,11,t.sortBy$)??"name")("matSortDirection",k(3,13,t.sortDir$)??"asc"),p(13),f("matHeaderRowDef",t.displayedColumns),p(),f("matRowDefColumns",t.displayedColumns),p(2),f("length",k(17,15,t.total$))("pageIndex",(k(18,17,t.page$)??1)-1)("pageSize",k(19,19,t.pageSize$)??10)("pageSizeOptions",pt(22,Re))}}var he=class n{store=l(zt);dialog=l(fi);loading$=this.store.select($i);error$=this.store.select(Ki);routes$=this.store.select(Qi);total$=this.store.select(Wi);page$=this.store.select(Ui);pageSize$=this.store.select(Zi);sortBy$=this.store.select(Xi);sortDir$=this.store.select(Ji);displayedColumns=["name","pointCount","actions"];currentParams={page:1,pageSize:10,sortBy:"name",sortDir:"asc"};constructor(){this.store.select(Yi).pipe(Nt()).subscribe(a=>{this.currentParams=a})}ngOnInit(){this.store.dispatch(it(this.currentParams))}onSortChange(a){this.store.dispatch(it(T(A({},this.currentParams),{page:1,sortBy:a.active||"name",sortDir:a.direction||"asc"})))}onPageChange(a){this.store.dispatch(it(T(A({},this.currentParams),{page:a.pageIndex+1,pageSize:a.pageSize})))}openCreate(){this.dialog.open(V,{data:{}}).afterClosed().pipe(G(Boolean)).subscribe(a=>this.store.dispatch(Gi({dto:a})))}openEdit(a){this.dialog.open(V,{data:{route:a}}).afterClosed().pipe(G(Boolean)).subscribe(t=>this.store.dispatch(ji({id:a.id,dto:t})))}confirmDelete(a){this.dialog.open(Hi,{data:{message:`Delete route "${a.name}"?`}}).afterClosed().pipe(G(Boolean)).subscribe(()=>this.store.dispatch(qi({id:a.id})))}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=D({type:n,selectors:[["app-route"]],decls:13,vars:6,consts:[[1,"page-container"],["role","alert",1,"error-banner"],[1,"page-header"],["mat-raised-button","","color","primary",3,"click"],[1,"spinner-container"],["diameter","48"],["mat-table","","matSort","",1,"mat-elevation-z2","full-width",3,"matSortChange","dataSource","matSortActive","matSortDirection"],["matColumnDef","name"],["mat-header-cell","","mat-sort-header","",4,"matHeaderCellDef"],["mat-cell","",4,"matCellDef"],["matColumnDef","pointCount"],["mat-header-cell","",4,"matHeaderCellDef"],["matColumnDef","actions"],["mat-cell","","class","actions-cell",4,"matCellDef"],["mat-header-row","",4,"matHeaderRowDef"],["mat-row","",4,"matRowDef","matRowDefColumns"],["class","mat-row",4,"matNoDataRow"],["showFirstLastButtons","","aria-label","Select page of routes",3,"page","length","pageIndex","pageSize","pageSizeOptions"],["mat-header-cell","","mat-sort-header",""],["mat-cell",""],["mat-header-cell",""],["mat-cell","",1,"actions-cell"],["mat-icon-button","","matTooltip","Edit",3,"click"],["mat-icon-button","","matTooltip","Delete","color","warn",3,"click"],["mat-header-row",""],["mat-row",""],[1,"mat-row"],[1,"mat-cell","no-data"]],template:function(t,e){if(t&1&&(c(0,"div",0),C(1,Fe,4,1,"div",1),x(2,"async"),c(3,"div",2)(4,"h1"),d(5,"Route Management"),o(),c(6,"button",3),h("click",function(){return e.openCreate()}),c(7,"mat-icon"),d(8,"add"),o(),d(9," New Route "),o()(),C(10,Ae,2,0,"div",4),x(11,"async"),It(12,Ge,20,23),o()),t&2){let i;p(),w((i=k(2,2,e.error$))?1:-1,i),p(9),w(k(11,4,e.loading$)?10:12)}},dependencies:[Vi,Ei,Fi,Bi,Ai,Ri,Oi,Ti,Pi,Li,Ni,zi,Di,Mi,Si,Ii,ki,Z,U,W,J,X,_i,ui,tt,Y,de,_t,se,Lt],styles:[".page-container[_ngcontent-%COMP%]{padding:24px;max-width:900px;margin:0 auto}.page-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{margin:0;font-size:1.5rem;font-weight:600}.full-width[_ngcontent-%COMP%]{width:100%}.spinner-container[_ngcontent-%COMP%]{display:flex;justify-content:center;padding:48px}.actions-cell[_ngcontent-%COMP%]{white-space:nowrap}.no-data[_ngcontent-%COMP%]{text-align:center;padding:32px;color:#888}"],changeDetection:0})};export{he as RouteComponent};
