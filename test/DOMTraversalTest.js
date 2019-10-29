// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");
const DT = require("../src/DOMTraversal");
const {JSDOM} = require("jsdom");

let tree = new JSDOM(`<!DOCTYPE html>
<html class="html">
	<head class="head">
		<meta class="meta"></meta>
		<script class="script"></script>
	</head>
	<body class="body">
		<div class="a">
			<div class="aa">
				<div class="aaa">
				</div>
			</div>
			<div class="ab">
			</div>
		</div>
		<div class="b">
		</div>
		<div class="c">
			<div class="ca">
			</div>
			<div class="cb">
			</div>
			<div class="cc">
			</div>
		</div>
		<div class="d">
			<div class="da">
				<div class="daa">
				</div>
				<div class="dab">
					<div class="daba">
					</div>
				</div>
				<div class="dac">
				</div>
			</div>
		</div>
	</body>
</html>
`);
let window = tree.window;
let document = window.document;
let html = document.body.parentElement;
let body = document.body;
let head = document.head;

let nodes = {
	a: body.querySelector(".a"),
	aa: body.querySelector(".aa"),
	aaa: body.querySelector(".aaa"),
	ab: body.querySelector(".ab"),
	b: body.querySelector(".b"),
	c: body.querySelector(".c"),
	ca: body.querySelector(".ca"),
	cb: body.querySelector(".cb"),
	cc: body.querySelector(".cc"),
	d: body.querySelector(".d"),
	da: body.querySelector(".da"),
	daa: body.querySelector(".daa"),
	dab: body.querySelector(".dab"),
	daba: body.querySelector(".daba"),
	dac: body.querySelector(".dac")
};

describe("DOMTraversal",function(){
	it("available",function(){
		assert(DT);
	});

	it("#down",function(){
		assert.equal(DT.down(body),nodes.a);
		assert.equal(DT.down(nodes.a),nodes.aa);
		assert.equal(DT.down(nodes.aa),nodes.aaa);
		assert.equal(DT.down(nodes.aaa),null);
	});

	it("#downLast",function(){
		assert.equal(DT.downLast(body),nodes.d);
		assert.equal(DT.downLast(nodes.a),nodes.ab);
		assert.equal(DT.downLast(nodes.aa),nodes.aaa);
		assert.equal(DT.downLast(nodes.aaa),null);
		assert.equal(DT.downLast(nodes.c),nodes.cc);
	});

	it("#up",function(){
		assert.equal(DT.up(nodes.a),body);
		assert.equal(DT.up(nodes.aa),nodes.a);
		assert.equal(DT.up(nodes.aaa),nodes.aa);
	});

	it("#first",function(){
		assert.equal(DT.first(body),nodes.a);
		assert.equal(DT.first(nodes.a),nodes.aa);
		assert.equal(DT.first(nodes.b),null);
		assert.equal(DT.first(nodes.c),nodes.ca);
		assert.equal(DT.first(nodes.d),nodes.da);
	});

	it("#last",function(){
		assert.equal(DT.last(body),nodes.d);
		assert.equal(DT.last(nodes.a),nodes.ab);
		assert.equal(DT.last(nodes.b),null);
		assert.equal(DT.last(nodes.c),nodes.cc);
		assert.equal(DT.last(nodes.d),nodes.da);
	});

	it("#top",function(){
		assert.equal(DT.top(body),html);
		assert.equal(DT.top(nodes.aaa),html);
		assert.equal(DT.top(nodes.aa),html);
		assert.equal(DT.top(nodes.cb),html);
		assert.equal(DT.top(nodes.dac),html);
	});

	it("#bottom",function(){
		assert.equal(DT.bottom(body),nodes.aaa);
		assert.equal(DT.bottom(nodes.a),nodes.aaa);
		assert.equal(DT.bottom(nodes.b),nodes.b);
		assert.equal(DT.bottom(nodes.c),nodes.ca);
		assert.equal(DT.bottom(nodes.d),nodes.daa);
	});

	it("#bottomLast",function(){
		assert.equal(DT.bottomLast(body),nodes.dac);
		assert.equal(DT.bottomLast(nodes.a),nodes.ab);
		assert.equal(DT.bottomLast(nodes.b),nodes.b);
		assert.equal(DT.bottomLast(nodes.c),nodes.cc);
		assert.equal(DT.bottomLast(nodes.d),nodes.dac);
	});

	it("#next",function(){
		assert.equal(DT.next(body),nodes.a);
		assert.equal(DT.next(nodes.a),nodes.aa);
		assert.equal(DT.next(nodes.aa),nodes.aaa);
		assert.equal(DT.next(nodes.aaa),nodes.ab);
		assert.equal(DT.next(nodes.ab),nodes.b);
		assert.equal(DT.next(nodes.b),nodes.c);
		assert.equal(DT.next(nodes.c),nodes.ca);
		assert.equal(DT.next(nodes.ca),nodes.cb);
		assert.equal(DT.next(nodes.cb),nodes.cc);
		assert.equal(DT.next(nodes.cc),nodes.d);
		assert.equal(DT.next(nodes.d),nodes.da);
		assert.equal(DT.next(nodes.da),nodes.daa);
		assert.equal(DT.next(nodes.daa),nodes.dab);
		assert.equal(DT.next(nodes.dab),nodes.daba);
		assert.equal(DT.next(nodes.daba),nodes.dac);
		assert.equal(DT.next(nodes.dac),null);
	});

	it("#forward",function(){
		assert.equal(DT.forward(body),nodes.a);
		assert.equal(DT.forward(nodes.a),nodes.aa);
		assert.equal(DT.forward(nodes.aa),nodes.aaa);
		assert.equal(DT.forward(nodes.aaa),nodes.ab);
		assert.equal(DT.forward(nodes.ab),nodes.b);
		assert.equal(DT.forward(nodes.b),nodes.c);
		assert.equal(DT.forward(nodes.c),nodes.ca);
		assert.equal(DT.forward(nodes.ca),nodes.cb);
		assert.equal(DT.forward(nodes.cb),nodes.cc);
		assert.equal(DT.forward(nodes.cc),nodes.d);
		assert.equal(DT.forward(nodes.d),nodes.da);
		assert.equal(DT.forward(nodes.da),nodes.daa);
		assert.equal(DT.forward(nodes.daa),nodes.dab);
		assert.equal(DT.forward(nodes.dab),nodes.daba);
		assert.equal(DT.forward(nodes.daba),nodes.dac);
		assert.equal(DT.forward(nodes.dac),null);
	});

	it("#previous",function(){
		assert.equal(DT.previous(nodes.dac),nodes.daba);
		assert.equal(DT.previous(nodes.daba),nodes.dab);
		assert.equal(DT.previous(nodes.dab),nodes.daa);
		assert.equal(DT.previous(nodes.daa),nodes.da);
		assert.equal(DT.previous(nodes.da),nodes.d);
		assert.equal(DT.previous(nodes.d),nodes.cc);
		assert.equal(DT.previous(nodes.cc),nodes.cb);
		assert.equal(DT.previous(nodes.cb),nodes.ca);
		assert.equal(DT.previous(nodes.ca),nodes.c);
		assert.equal(DT.previous(nodes.c),nodes.b);
		assert.equal(DT.previous(nodes.b),nodes.ab);
		assert.equal(DT.previous(nodes.ab),nodes.aaa);
		assert.equal(DT.previous(nodes.aaa),nodes.aa);
		assert.equal(DT.previous(nodes.aa),nodes.a);
		assert.equal(DT.previous(nodes.a),body);
	});

	it("#backward",function(){
		assert.equal(DT.backward(nodes.dac),nodes.daba);
		assert.equal(DT.backward(nodes.daba),nodes.dab);
		assert.equal(DT.backward(nodes.dab),nodes.daa);
		assert.equal(DT.backward(nodes.daa),nodes.da);
		assert.equal(DT.backward(nodes.da),nodes.d);
		assert.equal(DT.backward(nodes.d),nodes.cc);
		assert.equal(DT.backward(nodes.cc),nodes.cb);
		assert.equal(DT.backward(nodes.cb),nodes.ca);
		assert.equal(DT.backward(nodes.ca),nodes.c);
		assert.equal(DT.backward(nodes.c),nodes.b);
		assert.equal(DT.backward(nodes.b),nodes.ab);
		assert.equal(DT.backward(nodes.ab),nodes.aaa);
		assert.equal(DT.backward(nodes.aaa),nodes.aa);
		assert.equal(DT.backward(nodes.aa),nodes.a);
		assert.equal(DT.backward(nodes.a),body);
	});

	it("#descendants",function(){
		assert.deepStrictEqual(DT.descendants(body),[nodes.a, nodes.aa, nodes.aaa, nodes.ab, nodes.b, nodes.c, nodes.ca, nodes.cb, nodes.cc, nodes.d, nodes.da, nodes.daa, nodes.dab, nodes.daba, nodes.dac]);
		assert.deepStrictEqual(DT.descendants(nodes.a),[nodes.aa, nodes.aaa, nodes.ab]);
	});

	it("#ancestors",function(){
		assert.deepStrictEqual(DT.ancestors(body),[html]);
		assert.deepStrictEqual(DT.ancestors(nodes.a),[body,html]);
		assert.deepStrictEqual(DT.ancestors(nodes.aa),[nodes.a,body,html]);
		assert.deepStrictEqual(DT.ancestors(nodes.aaa),[nodes.aa,nodes.a,body,html]);
		assert.deepStrictEqual(DT.ancestors(nodes.b),[body,html]);
		assert.deepStrictEqual(DT.ancestors(nodes.c),[body,html]);
		assert.deepStrictEqual(DT.ancestors(nodes.ca),[nodes.c,body,html]);
		assert.deepStrictEqual(DT.ancestors(nodes.cb),[nodes.c,body,html]);
		assert.deepStrictEqual(DT.ancestors(nodes.cc),[nodes.c,body,html]);
		assert.deepStrictEqual(DT.ancestors(nodes.d),[body,html]);
		assert.deepStrictEqual(DT.ancestors(nodes.da),[nodes.d,body,html]);
		assert.deepStrictEqual(DT.ancestors(nodes.daa),[nodes.da,nodes.d,body,html]);
		assert.deepStrictEqual(DT.ancestors(nodes.dab),[nodes.da,nodes.d,body,html]);
		assert.deepStrictEqual(DT.ancestors(nodes.daba),[nodes.dab,nodes.da,nodes.d,body,html]);
		assert.deepStrictEqual(DT.ancestors(nodes.dac),[nodes.da,nodes.d,body,html]);
	});

	it("#forwardList",function(){
		assert.deepStrictEqual(DT.forwardList(body),[nodes.a,nodes.aa,nodes.aaa,nodes.ab,nodes.b,nodes.c,nodes.ca,nodes.cb,nodes.cc,nodes.d,nodes.da,nodes.daa,nodes.dab,nodes.daba,nodes.dac]);
		assert.deepStrictEqual(DT.forwardList(nodes.a),[nodes.aa,nodes.aaa,nodes.ab]);
		assert.deepStrictEqual(DT.forwardList(nodes.c),[nodes.ca,nodes.cb,nodes.cc]);
		assert.deepStrictEqual(DT.forwardList(nodes.d),[nodes.da,nodes.daa,nodes.dab,nodes.daba,nodes.dac]);
	});

	it("#backwardList",function(){
		assert.deepStrictEqual(DT.backwardList(body),[nodes.dac,nodes.daba,nodes.dab,nodes.daa,nodes.da,nodes.d,nodes.cc,nodes.cb,nodes.ca,nodes.c,nodes.b,nodes.ab,nodes.aaa,nodes.aa,nodes.a]);
		assert.deepStrictEqual(DT.backwardList(nodes.a),[nodes.ab,nodes.aaa,nodes.aa]);
		assert.deepStrictEqual(DT.backwardList(nodes.c),[nodes.cc,nodes.cb,nodes.ca]);
		assert.deepStrictEqual(DT.backwardList(nodes.d),[nodes.dac,nodes.daba,nodes.dab,nodes.daa,nodes.da]);
	});




});
