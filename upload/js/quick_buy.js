/**
 * http://ecshop.runphp.net
 * @author heui
 * @qq 83308224
 */
function getQuickBuySelectedAttributes(d) {
	var a = new Array();
	var b = 0;
	for (i = 0; i < d.elements.length; i++) {
		var c = d.elements[i].name.substr(0, 15);
		if (c == "quick_buy_spec_"
				&& (((d.elements[i].type == "radio" || d.elements[i].type == "checkbox") && d.elements[i].checked) || d.elements[i].tagName == "SELECT")) {
			a[b] = d.elements[i].value;
			b++
		}
	}
	return a
}
function quickBuyChangePrice() {
	var c = getQuickBuySelectedAttributes(document.forms.ECS_FORMQUICKBUY);
	var h = document.forms.ECS_FORMQUICKBUY.elements.quickBuyNumber.value;
	var g = document.getElementsByName("country")[0].value;
	var b = document.getElementsByName("province")[0].value;
	var f = document.getElementsByName("city")[0].value;
	var e = document.getElementsByName("district")[0].value;
	var d = document.getElementsByName("shipping")[0].value;
	var a = document.getElementsByName("payment")[0].value;
	Ajax.call("quick_buy.php", "act=price&id=" + goodsId + "&attr=" + c
			+ "&number=" + h + "&consignee=" + g + "," + b + "," + f + "," + e
			+ "&shipping=" + d + "&payment=" + a, quickBuyChangePriceResponse,
			"GET", "JSON")
}
function quickBuyChangePriceResponse(a) {
	if (a.err_msg.length > 0) {
		alert(a.err_msg)
	}
	document.forms.ECS_FORMQUICKBUY.elements.quickBuyNumber.value = a.qty;
	if (document.getElementById("ECS_GOODS_QUICKBUY_AMOUNT")) {
		document.getElementById("ECS_GOODS_QUICKBUY_AMOUNT").innerHTML = a.result
		document.getElementById("ECS_GOODS_AMOUNT").innerHTML = a.result
	}
	orderSelectedResponse(a)
}
var region = new Object();
region.isAdmin = false;
region.loadRegions = function(b, a, c) {
	Ajax.call(region.getFileName(), "type=" + a + "&target=" + c + "&parent="
			+ b, region.response, "GET", "JSON")
};
region.loadProvinces = function(c, a) {
	var b = (typeof a == "undefined") ? "selProvinces" : a;
	region.loadRegions(c, 1, b)
};
region.loadCities = function(a, b) {
	var c = (typeof b == "undefined") ? "selCities" : b;
	region.loadRegions(a, 2, c)
};
region.loadDistricts = function(c, a) {
	var b = (typeof a == "undefined") ? "selDistricts" : a;
	region.loadRegions(c, 3, b)
};
region.changed = function(f, g, d) {
	if (4 == g) {
		var b = document.getElementsByName("country")[0].value;
		var c = document.getElementsByName("province")[0].value;
		var e = document.getElementsByName("city")[0].value;
		var j = document.getElementsByName("district")[0].value;
		var a = document.getElementsByName("shipping")[0].value;
		Ajax
				.call(
						"quick_buy.php?step=select_district",
						"consignee="
								+ b
								+ ","
								+ c
								+ ","
								+ e
								+ ","
								+ j
								+ "&shipping="
								+ a
								+ "&goods_id="
								+ goodsId
								+ "&number="
								+ document.getElementById("quickBuyNumber").value
								+ "&spec="
								+ getQuickBuySelectedAttributes(document.forms.ECS_FORMQUICKBUY),
						districtSelectedResponse, "GET", "JSON")
	} else {
		var h = f.options[f.selectedIndex].value;
		region.loadRegions(h, g, d)
	}
};
region.response = function(a, d) {
	var e = document.getElementById(a.target);
	e.length = 1;
	e.selectedIndex = 0;
	e.style.display = (a.regions.length == 0 && !region.isAdmin && a.type + 0 == 3) ? "none"
			: "";
	if (document.all) {
		e.fireEvent("onchange")
	} else {
		var b = document.createEvent("HTMLEvents");
		b.initEvent("change", true, true);
		e.dispatchEvent(b)
	}
	if (a.regions) {
		for (i = 0; i < a.regions.length; i++) {
			var c = document.createElement("OPTION");
			c.value = a.regions[i].region_id;
			c.text = a.regions[i].region_name;
			e.options.add(c)
		}
	}
};
region.getFileName = function() {
	if (region.isAdmin) {
		return "../region.php"
	} else {
		return "region.php"
	}
};
function selectShipping(c) {
	var e = document.getElementsByName("country")[0].value;
	var a = document.getElementsByName("province")[0].value;
	var d = document.getElementsByName("city")[0].value;
	var b = document.getElementsByName("district")[0].value;
	if (0 == e || 0 == a || 0 == d || 0 == b) {
	} else {
		Ajax
				.call(
						"quick_buy.php?step=select_shipping",
						"shipping="
								+ c.options[c.selectedIndex].value
								+ "&consignee="
								+ e
								+ ","
								+ a
								+ ","
								+ d
								+ ","
								+ b
								+ "&goods_id="
								+ goodsId
								+ "&number="
								+ document.getElementById("quickBuyNumber").value
								+ "&spec="
								+ getQuickBuySelectedAttributes(document.forms.ECS_FORMQUICKBUY),
						orderShippingSelectedResponse, "GET", "JSON")
	}
}
function clickShipping() {
	var b = document.forms.ECS_FORMQUICKBUY;
	var c = new Array();
	var a = false;
	if (b.elements.country && b.elements.country.value == 0) {
		c.push(country_not_null);
		a = true
	}
	if (b.elements.province && b.elements.province.value == 0
			&& b.elements.province.length > 1) {
		a = true;
		c.push(province_not_null)
	}
	if (b.elements.city && b.elements.city.value == 0
			&& b.elements.city.length > 1) {
		a = true;
		c.push(city_not_null)
	}
	if (b.elements.district && b.elements.district.length > 1) {
		if (b.elements.district.value == 0) {
			a = true;
			c.push(district_not_null)
		}
	}
	if (a) {
		message = c.join("\n");
		alert(message);
		return
	}
}
function orderShippingSelectedResponse(a) {
	sel = document.getElementsByName("payment")[0];
	sel.length = 1;
	sel.selectedIndex = 0;
	if (document.all) {
		sel.fireEvent("onchange")
	} else {
		var b = document.createEvent("HTMLEvents");
		b.initEvent("change", true, true);
		sel.dispatchEvent(b)
	}
	if (a.payment_list) {
		for (i = 0; i < a.payment_list.length; i++) {
			var c = document.createElement("OPTION");
			c.value = a.payment_list[i].pay_id;
			if (a.payment_list[i].color) {
				c.setAttribute("style", a.payment_list[i].color)
			}
			c.text = a.payment_list[i].pay_name;
			sel.options.add(c)
		}
	}
	orderSelectedResponse(a)
}
function districtSelected() {
	var e = document.getElementsByName("country")[0].value;
	var a = document.getElementsByName("province")[0].value;
	var d = document.getElementsByName("city")[0].value;
	var c = document.getElementsByName("district")[0].value;
	var b = document.getElementsByName("shipping")[0].value;
	Ajax.call("quick_buy.php?step=select_district", "consignee=" + e + "," + a
			+ "," + d + "," + c + "&shipping=" + b + "&goods_id=" + goodsId
			+ "&number=" + document.getElementById("quickBuyNumber").value
			+ "&spec="
			+ getQuickBuySelectedAttributes(document.forms.ECS_FORMQUICKBUY),
			districtSelectedResponse, "GET", "JSON")
}
function districtSelectedResponse(a) {
	var d = document.getElementsByName("shipping")[0];
	d.length = 1;
	d.selectedIndex = 0;
	if (document.all) {
		d.fireEvent("onchange")
	} else {
		var b = document.createEvent("HTMLEvents");
		b.initEvent("change", true, true);
		d.dispatchEvent(b)
	}
	if (a.shipping_list) {
		for (i = 0; i < a.shipping_list.length; i++) {
			var c = document.createElement("OPTION");
			c.value = a.shipping_list[i].shipping_id;
			c.text = a.shipping_list[i].shipping_name;
			d.options.add(c)
		}
	}
	d = document.getElementsByName("payment")[0];
	d.length = 1;
	d.selectedIndex = 0;
	if (document.all) {
		d.fireEvent("onchange")
	} else {
		var b = document.createEvent("HTMLEvents");
		b.initEvent("change", true, true);
		d.dispatchEvent(b)
	}
	if (a.payment_list) {
		for (i = 0; i < a.payment_list.length; i++) {
			var c = document.createElement("OPTION");
			c.value = a.payment_list[i].pay_id;
			if (a.payment_list[i].color) {
				c.setAttribute("style", a.payment_list[i].color)
			}
			c.text = a.payment_list[i].pay_name;
			d.options.add(c)
		}
	}
	orderSelectedResponse(a)
}
function selectPayment(d) {
	var f = document.getElementsByName("country")[0].value;
	var a = document.getElementsByName("province")[0].value;
	var e = document.getElementsByName("city")[0].value;
	var c = document.getElementsByName("district")[0].value;
	var b = document.getElementsByName("shipping")[0].value;
	if (0 == f || 0 == a || 0 == e || 0 == c) {
	} else {
		Ajax
				.call(
						"quick_buy.php?step=select_payment",
						"shipping="
								+ b
								+ "&payment="
								+ d.options[d.selectedIndex].value
								+ "&consignee="
								+ f
								+ ","
								+ a
								+ ","
								+ e
								+ ","
								+ c
								+ "&goods_id="
								+ document.getElementById("goods_id").value
								+ "&number="
								+ document.getElementById("quickBuyNumber").value
								+ "&spec="
								+ getQuickBuySelectedAttributes(document.forms.ECS_FORMQUICKBUY),
						orderSelectedResponse, "GET", "JSON")
	}
}
function orderSelectedResponse(a) {
	if (a.error) {
		alert(a.error);
		location.href = "./"
	}
	try {
		var d = document.getElementById("ECS_ORDERTOTAL");
		d.innerHTML = (typeof a == "object") ? a.content : a;
		if (a.payment != undefined) {
			var c = document.forms.theForm.elements.surplus;
			if (c != undefined) {
				c.disabled = a.pay_code == "balance"
			}
		}
	} catch (b) {
	}
}
function checkConsignee() {
	var b = document.forms.ECS_FORMQUICKBUY;
	var c = new Array();
	var a = false;
	if (0 == document.getElementsByName("shipping")[0].value) {
		c.push(flow_no_shipping);
		a = true
	}
	if (0 == document.getElementsByName("payment")[0].value) {
		c.push(flow_no_payment);
		a = true
	}
	if (b.elements.country && b.elements.country.value == 0) {
		c.push(country_not_null);
		a = true
	}
	if (b.elements.province && b.elements.province.value == 0
			&& b.elements.province.length > 1) {
		a = true;
		c.push(province_not_null)
	}
	if (b.elements.city && b.elements.city.value == 0
			&& b.elements.city.length > 1) {
		a = true;
		c.push(city_not_null)
	}
	if (b.elements.district && b.elements.district.length > 1) {
		if (b.elements.district.value == 0) {
			a = true;
			c.push(district_not_null)
		}
	}
	if (Utils.isEmpty(b.elements.consignee.value)) {
		a = true;
		c.push(consignee_not_null)
	}
	if (b.elements.email && b.elements.email.value.length > 0
			&& (!Utils.isEmail(b.elements.email.value))) {
		a = true;
		c.push(mobile_invaild)
	}
	if (b.elements.address && Utils.isEmpty(b.elements.address.value)) {
		a = true;
		c.push(address_not_null)
	}
	if (b.elements.zipcode && b.elements.zipcode.value.length > 0
			&& (!Utils.isNumber(b.elements.zipcode.value))) {
		a = true;
		c.push(zip_not_num)
	}
	if (Utils.isEmpty(b.elements.tel.value)) {
		a = true;
		c.push(tele_not_null)
	} else {
		if (!Utils.isTel(b.elements.tel.value)) {
			a = true;
			c.push(tele_invaild)
		}
	}
	if (b.elements.mobile && b.elements.mobile.value.length > 0
			&& (!Utils.isTel(b.elements.mobile.value))) {
		a = true;
		c.push(mobile_invaild)
	}
	if (a) {
		message = c.join("\n");
		alert(message);
		return
	}
	Ajax.call("quick_buy.php?step=is_login", "", openLoginDiv, "POST", "JSON")
}
function openLoginDiv(d) {
	if (d.userid) {
		var f = document.forms.ECS_FORMQUICKBUY;
		f.submit();
		return
	}
	var c = "loginDiv";
	var a = "mask";
	if (docEle(c)) {
		document.removeChild(docEle(c))
	}
	if (docEle(a)) {
		document.removeChild(docEle(a))
	}
	var h;
	if (typeof window.pageYOffset != "undefined") {
		h = window.pageYOffset
	} else {
		if (typeof document.compatMode != "undefined"
				&& document.compatMode != "BackCompat") {
			h = document.documentElement.scrollTop
		} else {
			if (typeof document.body != "undefined") {
				h = document.body.scrollTop
			}
		}
	}
	var b = document.createElement("div");
	b.id = c;
	b.style.position = "absolute";
	b.style.zIndex = "10000";
	b.style.width = "300px";
	b.style.height = "145px";
	b.style.top = (parseInt(h + 200)) + "px";
	b.style.left = (parseInt(document.body.offsetWidth) - 200) / 2 + "px";
	b.style.overflow = "auto";
	b.style.background = "#FFF";
	b.style.border = "3px solid #59B0FF";
	b.style.padding = "5px";
	b.innerHTML = '<h4 style="font-size:14; margin:15 0 0 15;">会员登录</h4>';
	b.innerHTML += '<div><table width="100%" cellspacing="5" cellpadding="3" border="0" align="left"><tr><td width="15%" align="right">用户名</td><td width="85%"><input type="text" class="inputBg" size="25" name="username"></td></tr><tr><td align="right">密码</td><td><input type="password" class="inputBg" size="15" name="password"></td></tr><tr><td colspan="2" align="center">[<a href="javascript:login_div()" class="f6" >登录</a>]&nbsp;&nbsp;[<a href="javascript:cancel_login_div()" class="f6">不登录</a>]&nbsp;&nbsp;[<a href="javascript:remove_login_div()" class="f6">关闭</a>]</td><tr></table></div>';
	document.body.appendChild(b);
	var e = document.createElement("iframe");
	e.id = "newIframe";
	e.style.position = "absolute";
	e.style.zIndex = "9999";
	e.style.width = "300px";
	e.style.height = "145px";
	e.style.top = (parseInt(h + 200)) + "px";
	e.style.left = (parseInt(document.body.offsetWidth) - 200) / 2 + "px";
	e.style.background = "#FFF";
	e.style.filter = "alpha(opacity=30)";
	e.style.opacity = "0.40";
	document.body.appendChild(e);
	var g = document.createElement("div");
	g.id = a;
	g.style.position = "absolute";
	g.style.zIndex = "9999";
	g.style.width = document.body.scrollWidth + "px";
	g.style.height = document.body.scrollHeight + "px";
	g.style.top = "0px";
	g.style.left = "0px";
	g.style.background = "#FFF";
	g.style.filter = "alpha(opacity=30)";
	g.style.opacity = "0.40";
	document.body.appendChild(g)
}
function login_div() {
	var b = document.getElementsByName("username")[0].value;
	var a = document.getElementsByName("password")[0].value;
	if (Utils.isEmpty(b) || Utils.isEmpty(a)) {
		alert("用户名或密码为空！")
	} else {
		Ajax.call("user.php?act=signin", "username=" + b + "&password=" + a,
				loginDivResponse, "POST", "JSON")
	}
}
function loginDivResponse(a) {
	if (a.error) {
		alert(a.content)
	} else {
		document.body.removeChild(docEle("loginDiv"));
		document.body.removeChild(docEle("mask"));
		var b = document.forms.ECS_FORMQUICKBUY;
		b.submit()
	}
}
function cancel_login_div() {
	remove_login_div();
	var a = document.forms.ECS_FORMQUICKBUY;
	a.submit()
}
function remove_login_div() {
	document.body.removeChild(docEle("loginDiv"));
	document.body.removeChild(docEle("newIframe"));
	document.body.removeChild(docEle("mask"))
};