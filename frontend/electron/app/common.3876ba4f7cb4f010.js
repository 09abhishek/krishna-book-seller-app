"use strict";(self.webpackChunkkrishna_book_seller=self.webpackChunkkrishna_book_seller||[]).push([[592],{605:(l,c,o)=>{o.d(c,{R:()=>a});var n=o(1223),d=o(9808);const t=function(e,i){return{"theme-ld":e,"lds-ring":i}};let a=(()=>{class e{constructor(){this.isTheme=!1}ngOnInit(){}}return e.\u0275fac=function(r){return new(r||e)},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-loader"]],inputs:{isTheme:"isTheme"},decls:5,vars:4,consts:[[3,"ngClass"]],template:function(r,s){1&r&&(n.TgZ(0,"div",0),n._UZ(1,"div")(2,"div")(3,"div")(4,"div"),n.qZA()),2&r&&n.Q6J("ngClass",n.WLB(1,t,!s.isTheme,s.isTheme))},dependencies:[d.mk],styles:[".lds-ring[_ngcontent-%COMP%]{display:inline-block;position:relative;width:34px;height:34px;margin-top:7px}.theme-ld[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{box-sizing:border-box;display:block;position:absolute;width:100px;height:100px;margin:6px;border:10px solid #a4a3e9;border-radius:50%!important;animation:lds-ring 1.2s cubic-bezier(.5,1,.5,1) infinite;border-color:#007bff transparent transparent transparent}.lds-ring[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{box-sizing:border-box;display:block;position:absolute;width:20px;height:20px;margin:6px;border:3px solid white;border-radius:50%!important;animation:lds-ring 1.2s cubic-bezier(.5,1,.5,1) infinite;border-color:white transparent transparent transparent}.lds-ring[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(1){animation-delay:-.45s}.lds-ring[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(2){animation-delay:-.3s}.lds-ring[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(3){animation-delay:-.15s}@keyframes lds-ring{0%{transform:rotate(0)}to{transform:rotate(360deg)}}"]}),e})()},3770:(l,c,o)=>{o.d(c,{p:()=>d});var n=o(1223);let d=(()=>{class t{constructor(e){this.el=e,this.regex={number:new RegExp(/^\d+$/),decimal:new RegExp(/^\d+[.,]?\d{0,2}$/g),letter:new RegExp(/^[a-z][a-z\s]*$/),range:new RegExp(/[0-5]/),alpha:new RegExp(/^[a-zA-Z\s]*$/),alphaNumeric:new RegExp(/^[a-zA-Z0-9]*$/),numberLetter:new RegExp(/^$|^[a-zA-Z0-9]+$/)},this.specialKeys={number:["Backspace","Tab","End","Home","ArrowLeft","ArrowRight"],decimal:["Backspace","Tab","End","Home","-","ArrowLeft","ArrowRight","Del","Delete"],letter:["Backspace","Tab","End","Home","ArrowLeft","ArrowRight","WhiteSpace"],range:["Backspace","Tab","End","Home","ArrowLeft","ArrowRight"],alpha:["Backspace","Tab","End","Home","ArrowLeft","ArrowRight"],alphaNumeric:["Backspace","Tab","End","Home","ArrowLeft","ArrowRight"]}}onKeyDown(e){if(-1!==this.specialKeys[this.numericType].indexOf(e.key)||-1!==[46,8,9,27,13,110,190].indexOf(e.keyCode)||65===e.keyCode&&(e.ctrlKey||e.metaKey)||67===e.keyCode&&(e.ctrlKey||e.metaKey)||86===e.keyCode&&(e.ctrlKey||e.metaKey)||88===e.keyCode&&(e.ctrlKey||e.metaKey)||e.keyCode>=35&&e.keyCode<=39)return;const r=this.el.nativeElement.value.concat(e.key);r&&!String(r).match(this.regex[this.numericType])&&e.preventDefault()}}return t.\u0275fac=function(e){return new(e||t)(n.Y36(n.SBq))},t.\u0275dir=n.lG2({type:t,selectors:[["","appOnlyNumber",""]],hostBindings:function(e,i){1&e&&n.NdJ("keydown",function(s){return i.onKeyDown(s)})},inputs:{numericType:"numericType"}}),t})()}}]);