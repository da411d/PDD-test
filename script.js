//USEFUL FUNCTIONS
;"document"in self&&("classList"in document.createElement("_")&&(!document.createElementNS||"classList"in document.createElementNS("http://www.w3.org/2000/svg","g"))||!function(t){"use strict";if("Element"in t){var e="classList",n="prototype",i=t.Element[n],s=Object,r=String[n].trim||function(){return this.replace(/^\s+|\s+$/g,"")},o=Array[n].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1},a=function(t,e){this.name=t,this.code=DOMException[t],this.message=e},c=function(t,e){if(""===e)throw new a("SYNTAX_ERR","An invalid or illegal string was specified");if(/\s/.test(e))throw new a("INVALID_CHARACTER_ERR","String contains an invalid character");return o.call(t,e)},l=function(t){for(var e=r.call(t.getAttribute("class")||""),n=e?e.split(/\s+/):[],i=0,s=n.length;s>i;i++)this.push(n[i]);this._updateClassName=function(){t.setAttribute("class",""+this)}},u=l[n]=[],h=function(){return new l(this)};if(a[n]=Error[n],u.item=function(t){return this[t]||null},u.contains=function(t){return t+="",-1!==c(this,t)},u.add=function(){var t,e=arguments,n=0,i=e.length,s=!1;do t=e[n]+"",-1===c(this,t)&&(this.push(t),s=!0);while(++n<i);s&&this._updateClassName()},u.remove=function(){var t,e,n=arguments,i=0,s=n.length,r=!1;do for(t=n[i]+"",e=c(this,t);-1!==e;)this.splice(e,1),r=!0,e=c(this,t);while(++i<s);r&&this._updateClassName()},u.toggle=function(t,e){t+="";var n=this.contains(t),i=n?e!==!0&&"remove":e!==!1&&"add";return i&&this[i](t),e===!0||e===!1?e:!n},u.toString=function(){return this.join(" ")},s.defineProperty){var f={get:h,enumerable:!0,configurable:!0};try{s.defineProperty(i,e,f)}catch(g){(void 0===g.number||-2146823252===g.number)&&(f.enumerable=!1,s.defineProperty(i,e,f))}}else s[n].__defineGetter__&&i.__defineGetter__(e,h)}}(self),function(){"use strict";var t=document.createElement("_");if(t.classList.add("c1","c2"),!t.classList.contains("c2")){var e=function(t){var e=DOMTokenList.prototype[t];DOMTokenList.prototype[t]=function(t){var n,i=arguments.length;for(n=0;i>n;n++)t=arguments[n],e.call(this,t)}};e("add"),e("remove")}if(t.classList.toggle("c3",!1),t.classList.contains("c3")){var n=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(t,e){return 1 in arguments&&!this.contains(t)==!e?e:n.call(this,t)}}t=null}());
function rand(mi, ma){return Math.floor(Math.random() * (ma - mi + 1) + mi);}
function randId(){return (new Date()-0).toString(36).replace(/[^a-z]+/g, "").substr(0,8) + "_" +rand(1000000, 9999999);}
function getScrollTop(){var o=0;return'number'==typeof window.pageYOffset?o=window.pageYOffset:document.body&&document.body.scrollTop?o=document.body.scrollTop:document.documentElement&&(document.documentElement.scrollLeft||document.documentElement.scrollTop)&&(o=document.documentElement.scrollTop),o}
function setScrollTop(o){window.scrollTo(0,o)}
function byId(id){return document.getElementById(id);}
function shuffle(t){for(var i=0;i<t.length;i++)t.sort(function(){return Math.random()<.5});return t};
function connect(u, f, p){
	t = (u+"").toString();
	if (t.match(/\?/)) {
		t += '&rand='+randId();
	} else {
		t += '?rand='+randId();
	}
	var xhr = new XMLHttpRequest();
	xhr.open('POST', t, 1);
	xhr.send(p?p:null);
	xhr.onreadystatechange = function(e){
		var xhr = e.target;
		if (xhr.readyState != 4) return;
		if (xhr.status != 200) {
			console.log(xhr.status + ': ' + xhr.statusText);
			return;
		}
		var data = xhr.responseText;
		return f(data);
	};
};
//папка, в якій всі питання
var DIR = "data/";

var PDDTest = {
	/*
		INIT: Скачуєм всі дані. Формуєм об'єкти тестів.
	*/
	init: function(){
		connect(DIR+"?_=ab", function(data){
			if(data == "%404%"){
				PDDTest.currentTest.AB = false;
				byId("abcd_ab").outerHTML = "";
				return;
			}
			data = JSON.parse(data);
			for(var i=0; i<data.length; i++){
				for(var j=0; j<data[i].length; j++){
					data[i][j] = new Question(data[i][j]);
				}
			}
			PDDTest.currentTest.AB = PDDTest.currentTest.AB.concat(data);
			PDDTest.currentTest.set("AB");
		});
		connect(DIR+"?_=cd", function(data){
			if(data == "%404%"){
				PDDTest.currentTest.CD = false;
				byId("abcd_cd").outerHTML = "";
				return;
			}
			data = JSON.parse(data);
			for(var i=0; i<data.length; i++){
				for(var j=0; j<data[i].length; j++){
					data[i][j] = new Question(data[i][j]);
				}
			}
			PDDTest.currentTest.CD = PDDTest.currentTest.CD.concat(data);
		});
		
		connect(DIR+"?_=ab&$=sbj", function(data){
			if(data == "%404%"){
				PDDTest.currentTest.subjectAB = false;
				byId("sbj").outerHTML = "";
				byId("sbjCD").outerHTML = "";
				byId("top100").style.width = "calc(25% - 8px)";
				byId("marafon").style.width = "calc(25% - 8px)";
				return;
			}
			data = JSON.parse(data);
			for(var i=0; i<data.length;i++){
				data[i] = {
					title: data[i][0],
					list: data[i][1]
				}
			}
			PDDTest.currentTest.subjectAB = data;
		});
		connect(DIR+"?_=cd&$=sbj", function(data){
			if(data == "%404%"){
				PDDTest.currentTest.subjectCD = false;
				byId("sbjs").style.display = "none";
				return;
			}
			data = JSON.parse(data);
			data = [{
				title: "Только CD вопросы",
				list: data
			}]
			PDDTest.currentTest.subjectCD = data;
		});
	}, 
	
	/*
		START: Починаєм тест
	*/
	start: function(mode, num = -1){
		PDDTest.currentTest.mode = mode;
		PDDTest.currentTest.startparam = num;
		var currentTest = PDDTest.currentTest.get();
		if(!currentTest || currentTest.length == 0){
			return;
		}
		var list = [];
		var info = "";
		switch(mode){
			case 0: //Екзамен
				for(var i=0; i < currentTest[0].length; i++){
					var index = ~~(Math.random()*currentTest.length);
					if(currentTest && currentTest[index] && currentTest[index][i]){
						list.push(currentTest[index][i]);
					}
				}
				var info = "Екзамен";
				break;
				
			case 1: //Білет по номеру
				list = currentTest[num-1];
				var info = num+"-й билет";
				break;
				
			case 2: //Білет по темі
				if(PDDTest.currentTest.current == "CD")num = 0;
				var subject = PDDTest.currentTest.getSubject()[num].list;
				for(var i=0; i<subject.length; i++){
					var s = subject[i];
					let n = s.substr(0, 2)-1;
					let m = s.substr(2, 2)-1;
					if(currentTest && currentTest[n] && currentTest[n][m]){
						list.push( PDDTest.currentTest.get()[n][m] );
					}
				}
				var info = PDDTest.currentTest.getSubject()[num].title;
				list = shuffle(list);
				break;
				
			case 3: //Кожне N-те
				for(var i=0; i < currentTest.length; i++){
					if(currentTest && currentTest[i] && currentTest[i][num-1]){
						list.push(currentTest[i][num-1]);
					}
				}
				var info = "Каждый "+num+"-й вопрос";
				break;
				
			case 4: //100 складних
				for(var i=0; i < currentTest.length; i++){
					for(var j=0; j < currentTest[i].length; j++){
						if(currentTest && currentTest[i] && currentTest[i][j]){
							if(currentTest[i][j].difficult){
								list.push(currentTest[i][j]);
							}
						}
					}
				}
				var info = "100 сложных";
				list = shuffle(list);
				break;
				
			case 5: //Марафон
				for(var i=0; i < currentTest.length; i++){
					for(var j=0; j < currentTest[i].length; j++){
						if(currentTest && currentTest[i] && currentTest[i][j]){
							list.push(currentTest[i][j]);
						}
					}
				}
				var info = "Марафон";
				list = shuffle(list);
				break;
				
			case 6: //Помилки
				var li = localStorage.getItem("PDDTest.mistakes")||"";
				var count = li.length / 6;
				for(var i=0; i<count; i++){
					var s = li.substr(i*6, 6);
					var abcd = s.substr(0, 2).toUpperCase();
					var m = s.substr(2, 2)-1;
					var n = s.substr(4, 2)-1;
					
					if(PDDTest.currentTest[abcd] && PDDTest.currentTest[abcd][m] && PDDTest.currentTest[abcd][m][n]){
						list.push( PDDTest.currentTest[abcd][m][n] );
					}
				}
				var info = "Ошибки";
				break;
		}
		
		var testHTML = "";
		var testnavHTML = "";
		for(var i=0; i<list.length; i++){
			testHTML += list[i].toHTML(i);
			testnavHTML += ('<a onclick="trigCard('+(i+1)+')" name="testnav" class="btn select w {ACTIVE}">'+(i+1)+'</a>').replace("{ACTIVE}", i==0 ? "active" : "");
		}
		testnavHTML += '</span>';
		byId("test").innerHTML = testHTML.length > 1 ? testHTML : "<h1>Вопросов не найдено</h1>";
		byId("testnav").innerHTML = testnavHTML;
		byId("currentinfo").innerText = info;
		PDDTest.currentTest.answers.init(list.length);
		PDDTest.stats.render();
		window.addEventListener("click", this.listener);
		byId("done").classList.remove("active");
		byId('clear').classList.add('hidden');
		updateInfo();
	},
	
	/*
		RESTART: Перезапускаєм тест
	*/
	restart: function(){
		PDDTest.stop();
		PDDTest.start(PDDTest.currentTest.mode, PDDTest.currentTest.startparam);
	},
	
	/*
		STOP: Завершуємо тест. Знімаєм всі лістенери, ще щось тут буде..
	*/
	stop: function(bad = false){
		//Обнуляєм
		window.removeEventListener("click", this.listener);
		byId("testnav").innerHTML = "";
		document.querySelectorAll("#question").forEach(function(e){
			e.classList.add("hidden");
		});
		
		//Виводим
		byId("done_true").innerText = PDDTest.currentTest.answers.true;
		byId("done_false").innerText = PDDTest.currentTest.answers.false;
		byId("done_total").innerText = PDDTest.currentTest.answers.total;
		byId("done_of").innerText = PDDTest.currentTest.answers.max;
		byId("done").classList.add("active");
		byId('restart').classList.remove('hidden');
		updateInfo(true);
		
		var tpl = [
			{//0 - екзамен
				good: "<h1>Поздравляем!</h1>Экзамен на категорию "+PDDTest.currentTest.current+" сдан без ошибок!",
				soso: "<h1>Тест завершен</h1>Предлагаем Вам потренироваться на решении \"Билетов\" в одной из следующих вкладок или подучить Правила на этом сайте",
				bad: "<h1>К сожалению, тест не сдан</h1>Предлагаем Вам потренироваться на решении \"Билетов\" в одной из следующих вкладок или подучить Правила на этом сайте"
			},
			{//1 - по номеру
				good: "<h1>Поздравляем!</h1>Тест сдан без ошибок!",
				soso: "<h1>Тест завершен</h1>Предлагаем Вам потренироваться на решении \"Билетов\" в одной из следующих вкладок или подучить Правила на этом сайте",
				bad: "<h1>К сожалению, тест не сдан</h1>Предлагаем Вам потренироваться на решении \"Билетов\" в одной из следующих вкладок или подучить Правила на этом сайте"
			},
			{//2 - по темі
				good: "<h1>Поздравляем!</h1>Тест сдан без ошибок!",
				soso: "<h1>Тест завершен</h1>Предлагаем Вам потренироваться на решении \"Билетов\" в одной из следующих вкладок или подучить Правила на этом сайте",
				bad: "<h1>К сожалению, тест не сдан</h1>Предлагаем Вам потренироваться на решении \"Билетов\" в одной из следующих вкладок или подучить Правила на этом сайте"
			},
			{//3 - кожне N-те
				good: "<h1>Поздравляем!</h1>Тест сдан без ошибок!",
				soso: "<h1>Тест завершен</h1>Предлагаем Вам потренироваться на решении \"Билетов\" в одной из следующих вкладок или подучить Правила на этом сайте",
				bad: "<h1>К сожалению, тест не сдан</h1>Предлагаем Вам потренироваться на решении \"Билетов\" в одной из следующих вкладок или подучить Правила на этом сайте"
			},
			{//4 - 100 складних
				good: "<h1>Поздравляем!</h1>Тест сдан без ошибок!",
				soso: "<h1>Тест завершен</h1>Предлагаем Вам потренироваться на решении \"Билетов\" в одной из следующих вкладок или подучить Правила на этом сайте",
				bad: "<h1>К сожалению, тест не сдан</h1>Предлагаем Вам потренироваться на решении \"Билетов\" в одной из следующих вкладок или подучить Правила на этом сайте"
			},
			{//5 - марафон
				good: "<h1>Поздравляем!</h1>Марафон пройден без ошибок!",
				soso: "<h1>Тест завершен</h1>Предлагаем Вам потренироваться на решении \"Билетов\" в одной из следующих вкладок или подучить Правила на этом сайте",
				bad: "<h1>К сожалению, тест не сдан</h1>Предлагаем Вам потренироваться на решении \"Билетов\" в одной из следующих вкладок или подучить Правила на этом сайте"
			},
			{//6 - помилки
				good: "<h1>Все ошибки исправлены!</h1>",
				soso: "<h1>Ошибки исправлены!</h1>Предлагаем Вам потренироваться на решении \"Билетов\" в одной из следующих вкладок или подучить Правила на этом сайте",
				bad: "<h1>Ошибки не исправлены!</h1>Предлагаем Вам потренироваться на решении \"Билетов\" в одной из следующих вкладок или подучить Правила на этом сайте"
			}
		];
		var param
		if(bad){
			param = "bad";
		}else if(PDDTest.currentTest.answers.false == 0){
			param = "good";
		}else if(PDDTest.currentTest.answers.true > 0){
			param = "soso";
		}else{
			param = "bad";
		}
		var txt = tpl[PDDTest.currentTest.mode][param];
		byId("donetitle").innerHTML = txt;
	}, 
	
	/*
		ADD - додати n питань до нашого теста
	*/
	add: function(data, n){
		var currentTest = PDDTest.currentTest.get();
		if(!currentTest || currentTest.length == 0){
			return;
		}
		var list = [];
		var current = data.substr(2, 2)-0;
		var num = data.substr(4, 2)-0;
		
		
		for(var i=0; i<currentTest.length; i++){
			if(currentTest[i][num-1].id.substr(2, 2)-0 == current-0){
				currentTest.splice(i, 1);
			}
		}
		list = shuffle(currentTest).splice(0, n);
		for(var i=0; i < n; i++){
			list[i] = list[i][num-1];
		}
		var testHTML = "";
		var testnavHTML = "";
		for(var i=0; i<list.length; i++){
			var m = PDDTest.currentTest.answers.max+i+1;
			testHTML += list[i].toHTML(m-1, 1);
			testnavHTML += '<button onclick="trigCard('+m+')" name="testnav" class="btn select y">'+m+'</button>';
		}
		byId("test").innerHTML += testHTML;
		byId("testnav").innerHTML += testnavHTML;
		
		PDDTest.currentTest.answers.max += n;
	},
	
	/*
		LISTENER: Він обробляє всі події
	*/
	listener: function(e){
		var target = e.target;
		if(target.id.indexOf("question") == -1)return; //Если не наш человек
		
		var root = target;
		while(root.id != "question"){
			root = root.parentElement;
		}
		
		if(target.id == "question_answer"){
			if(PDDTest.currentTest.mode == 0 && root.classList.contains("answered"))return;
			
			
			root.classList.add("answered");
			var status = target.getAttribute("data-true") == "true";
			root.classList.add(status ? "true" : "false");
			target.classList.add(status ? "true" : "false");
			PDDTest.currentTest.answers.add(status);
			document.querySelector("#testnav .btn:nth-child("+root.getAttribute("data-n")+")").className += status ? " g" : " r";
			
			var n = root.getAttribute("data-n")-0+1;
			if(n <= PDDTest.currentTest.answers.max && !PDDTest.currentTest.answers.finished){
				trigCard(n);
				document.querySelectorAll("#testnav .btn").forEach(function(e){
					e.classList.remove("active");
				});
				document.querySelector("#testnav .btn:nth-child("+n+")").classList.add("active");
			}
			
			if(status){
				PDDTest.stats.tryRemoveMistake(root.getAttribute("data-id"));
								
			}else{
				
				PDDTest.stats.addMistake(root.getAttribute("data-id"));
				if(PDDTest.currentTest.mode == 0){
					if(root.getAttribute("data-exam") == "true" || PDDTest.currentTest.answers.false >= 3){
						PDDTest.currentTest.answers.finished = true;
						PDDTest.stop(true);
						return;
					}
					PDDTest.add(root.getAttribute("data-id"), 5);
				}
			}
		}
	},
	
	/*
		currentTest
	*/
	currentTest: {
		current: false,
		AB: [],
		CD: [],
		subjectAB: [],
		subjectCD: [],
		mode: 0,
		startparam: 0,
		get: function(){
			return this[this.current] || this.AB;
		},
		getSubject: function(){
			return this["subject"+this.current] || this.subjectAB;
		},
		set: function(a){
			this.current = a||false;
			PDDTest.restart();
			
			if(this.current == "CD"){
				byId("sbj").style.display = "none";
				byId("sbjCD").style.display = "";
			}else{
				byId("sbj").style.display = "";
				byId("sbjCD").style.display = "none";
			}
			
			var list = PDDTest.currentTest.get();
			byId("num").innerHTML = '<option selected disabled>Билет по номеру</option>';
			for(l in list){
				let i = l-0+1;
				byId("num").innerHTML += '<option value="'+i+'">'+i+'-й билет</option>';
			}
			
			var list = PDDTest.currentTest.getSubject();
			byId("sbj").innerHTML = '<option selected disabled>Билет по теме</option>';
			for(var i=0; i<list.length; i++){
				var l = list[i];
				byId("sbj").innerHTML += '<option value="'+i+'">'+l.title+'</option>';
			}
		},
		answers:{
			true: 0,
			false: 0,
			total: 0,
			max: 0,
			finished: false,
			add: function(n){
				PDDTest.stats.add(n);
				if(n == 1){
					this.true++;
				}else{
					this.false++;
				}
				this.total++;
				if(this.total >= this.max){
					this.finished = true;
				}
				this.render();
			},
			init: function(n){
				this.true = 0;
				this.false = 0;
				this.total = 0;
				this.max = n;
				this.finished = false;
				this.render();
			},
			render: function(){
				byId("sidebar_true").innerText = this.true;
				byId("sidebar_false").innerText = this.false;
				byId("sidebar_total").innerText = this.total;
				byId("sidebar_of").innerText = this.max;
				
				if(this.finished){
					setTimeout(function(){
						PDDTest.stop();
					}, 2000);
				}
			}
		}
	},
	
	/*
		СТАТИСТИКА
	*/
	stats:{
		true: 0,
		false: 0,
		total: 0,
		add: function(n){
			var data = localStorage.getItem("PDDTest.stats") || "0:0:0";
			data = data.split(":");
			
			this.true = data[0]-0;
			this.false = data[1]-0;
			this.total = data[2]-0;
			
			if(n == 1){
				this.true++;
				
			}else if(n == -1){
				this.false--;
				this.total--;
				this.total--;
				
			}else{
				this.false++;
			}
			this.total++;
			
			var data = [
				this.true,
				this.false,
				this.total
			];
			localStorage.setItem("PDDTest.stats", data.join(":"));
			
			this.render();
		},
		render: function(){
			var data = localStorage.getItem("PDDTest.stats") || "0:0:0";
			data = data.split(":");
			
			this.true = data[0]-0;
			this.false = data[1]-0;
			this.total = data[2]-0;
			
			byId("stats_true").innerText = this.true;
			byId("stats_false").innerText = this.false;
			byId("stats_total").innerText = this.total;
		},
		clear: function(){
			localStorage.setItem("PDDTest.stats", "0:0:0");
			localStorage.setItem("PDDTest.mistakes", "");
			this.true = this.false = this.total = 0;
			this.render();
		},
		addMistake: function(t){
			var data = localStorage.getItem("PDDTest.mistakes") || "";
			if(data.indexOf(t) == -1){
				data += t;
				localStorage.setItem("PDDTest.mistakes", data);
			}else{
				PDDTest.stats.add(-1);
			}
		},
		tryRemoveMistake: function(t){
			var data = localStorage.getItem("PDDTest.mistakes") || "";
			if(data.indexOf(t) > -1){
				data = data.split(t).join("");
				PDDTest.stats.add(-1);
			}
			localStorage.setItem("PDDTest.mistakes", data);
		}
	}
};

PDDTest.init();

///////////
function Question(data = ""){
	var question = "", answers = [], tip = "";
	return {
		question: data.question||"",
		answers: data.answers||[],
		tip: data.tip||"",
		image: data.image||"",
		id: data.id||"",
		difficult: data.difficult||"",
		
		toHTML: function(i = 0, isExam=false){
			var wr = document.createElement("div");
			var container = document.createElement("div");
			container.id = "question";
			container.className = !!i ? " hidden" : "";
			container.setAttribute("data-n", i+1);
			container.setAttribute("data-id", this.id);
			if(isExam)container.setAttribute("data-exam", "true");
				var image = document.createElement("img");
				image.src = DIR+this.image;
				image.id = "question_image";
				container.appendChild(image);
				var question = document.createElement("span");
				question.innerText = this.question;
				question.id = "question_text";
				container.appendChild(question);
				var answers = document.createElement("ul");
				answers.id = "question_answers";
					var anss = this.answers;
					var ans = [];
					for(var i=0; i<anss.length; i++){
						var li = document.createElement("li");
						li.innerText = anss[i].substr(anss[i].indexOf(". ")+2);
						li.id = "question_answer";
						if(i==0)li.setAttribute("data-true", "true");
						ans[i] = li;
					}
					ans = shuffle(ans);;
					for(var i=0; i<ans.length; i++){
						answers.appendChild(ans[i]);
					}
				container.appendChild(answers);
				var tip = document.createElement("span");
				tip.innerText = this.tip;
				tip.id = "question_tip";
				tip.className = "hidden";
				container.appendChild(tip);
			wr.appendChild(container);
			return wr.innerHTML;
		}
	}
}

//Переключає зв'язані кольором кнопки
window.addEventListener("click", function(e){
	var target = e.target;
	
	if(target.classList.contains("select")){
		document.getElementsByName(target.name).forEach(function(e){
			e.classList.remove("active");
		});
		target.classList.add("active");
	}
});

//Переключає картку
function trigCard(i){
	document.querySelectorAll("#test #question").forEach(function(e){
		e.classList.add("hidden");
	});
	document.querySelector("#test #question:nth-of-type("+i+")").classList.remove("hidden");
	updateInfo();
}

//Оновлює інфу в жовтій панельці
function updateInfo(hideme = false){
	var id = document.querySelector("#test #question:not(.hidden)");
	if(hideme || !id){
		byId("currentinfo").style.display = "none";
		return;
	}
	var id = id.getAttribute("data-id");
	id = id.substr(0, 2) + " " + (id.substr(2, 2)-0) + "Б " + (id.substr(4, 2)-0) + "В";
	byId("currentinfo").setAttribute("data-text", id);
	byId("currentinfo").style.display = "";
}