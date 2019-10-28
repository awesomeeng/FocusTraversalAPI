// (c) 2018-present, The Awesome Engineering Company, https://awesomeneg.com

import {ZephComponents,html,css,attribute,bind,bindAt,onAdd} from "./zeph.min.js";

ZephComponents.define("focus-example",()=>{
	html("./focus-example.html");
	css("./focus-example.css");

	attribute("label","");

	bind("@label","label","$");
	bind("$","input","@value");
	bind("@value",".",".value");
	bindAt("input",".value",".","@value");

	onAdd((element,children)=>{
		let target = children.querySelector("input");
		focusManager.proxy(element,target);
	});
});
