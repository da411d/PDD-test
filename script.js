//USEFUL FUNCTIONS
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

var DIR = "data/";

var PDTest = {
	/*
		INIT: Скачуєм всі тести і список картинок. Формуєм об'єкти тестів.
	*/
	init: function(){
		connect(DIR+"?_=ab", function(data){
			if(data == "%404%"){
				PDTest.currentTest.AB = false;
				byId("abcd_ab").outerHTML = "";
				return;
			}
			data = JSON.parse(data);
			for(var i=0; i<data.length; i++){
				for(var j=0; j<data[i].length; j++){
					data[i][j] = new Question(data[i][j]);
				}
			}
			PDTest.currentTest.AB = PDTest.currentTest.AB.concat(data);
			PDTest.currentTest.set("AB");
		});
		connect(DIR+"?_=cd", function(data){
			if(data == "%404%"){
				PDTest.currentTest.CD = false;
				byId("abcd_cd").outerHTML = "";
				return;
			}
			data = JSON.parse(data);
			for(var i=0; i<data.length; i++){
				for(var j=0; j<data[i].length; j++){
					data[i][j] = new Question(data[i][j]);
				}
			}
			PDTest.currentTest.CD = PDTest.currentTest.CD.concat(data);
		});
		
		connect(DIR+"?_=ab&$=sbj", function(data){
			if(data == "%404%"){
				PDTest.currentTest.subjectAB = false;
				return;
			}
			data = JSON.parse(data);
			for(var i=0; i<data.length;i++){
				data[i] = {
					title: data[i][0],
					list: data[i][1]
				}
			}
			PDTest.currentTest.subjectAB = data;
		});
		connect(DIR+"?_=cd&$=sbj", function(data){
			if(data == "%404%"){
				PDTest.currentTest.subjectCD = false;
				return;
			}
			data = JSON.parse(data);
			for(var i=0; i<data.length;i++){
				data[i] = {
					title: data[i][0],
					list: data[i][1]
				}
			}
			PDTest.currentTest.subjectCD = data;
		});
	}, 
	
	/*
		START: Починаєм тест
	*/
	start: function(mode, n){
		PDTest.mode = mode;
		PDTest.startparam = n;
		var currentTest = PDTest.currentTest.get();
		if(!currentTest || currentTest.length == 0){
			return;
		}
		var list = [];
		switch(mode){
			case 0: //Екзамен
				for(var i=0; i < currentTest[0].length; i++){
					var index = ~~(Math.random()*currentTest.length);
					list.push(currentTest[index][i]);
				}
				break;
				
			case 1: //Білет по номеру
				var index = n > 0 ? n-1 : ~~(Math.random()*currentTest.length);
				list = currentTest[index];
				break;
				
			case 2: //Білет по темі
				var subject = PDTest.currentTest.getSubject()[n].list;
				for(var i=0; i<subject.length; i++){
					var s = subject[i];
					var n = s.substr(0, 2)-1;
					var m = s.substr(2, 2)-1;
					list.push( PDTest.currentTest.get()[n][m] );
				}
				break;
				
			case 3: //Кожне N-те
				for(var i=0; i < currentTest.length; i++){
					list.push(currentTest[i][n-1]);
				}
				break;
				
			case 4: //100 складних
				for(var i=0; i < currentTest.length; i++){
					for(var n=0; n < currentTest[i].length; n++){
						if(currentTest[i][n].difficult){
							list.push(currentTest[i][n]);
						}
					}
				}
				break;
				
			case 5: //Марафон
				for(var i=0; i < currentTest.length; i++){
					for(var n=0; n < currentTest[i].length; n++){
						list.push(currentTest[i][n]);
					}
				}
				break;
				
			case 6: //Помилки
				var li = localStorage.getItem("PDTest.mistakes").split(",");
				for(var i=0; i<li.length; i++){
					var s = li[i];
					var abcd = s.substr(0, 2).toUpperCase();
					var n = s.substr(2, 2)-1;
					var m = s.substr(4, 2)-1;
					list.push( PDTest.currentTest[abcd][n][m] );
				}
				break;
		}
		
		list = shuffle(list);
		var testHTML = "";
		var testnavHTML = ""
		for(var i=0; i<list.length; i++){
			testHTML += list[i].toHTML(i);
			testnavHTML += '<button onclick="trigCard('+(i+1)+')" name="testnav" class="btn select w">'+(i+1)+'</button>';
		}
		byId("test").innerHTML = testHTML;
		byId("testnav").innerHTML = testnavHTML;
		
		PDTest.currentTest.answers.init(list.length);
		PDTest.stats.render();
		window.addEventListener("click", this.listener);
		byId("done").className = byId("done").className.split(" active").join("");
	},
	
	/*
		RESTART: Перезапускаєм тест
	*/
	restart: function(){
		PDTest.stop();
		PDTest.start(PDTest.currentTest.mode, PDTest.currentTest.startparam);
	},
	
	/*
		STOP: Завершуємо тест. Знімаєм всі лістенери, ще щось тут буде..
	*/
	stop: function(){
		//Обнуляєм
		window.removeEventListener("click", this.listener);
		byId("testnav").innerHTML = "";
		document.querySelectorAll("#question").forEach(function(e){
			e.className += " hidden";
		});
		
		//Виводим
		byId("done_true").innerText = PDTest.currentTest.answers.true;
		byId("done_false").innerText = PDTest.currentTest.answers.false;
		byId("done_total").innerText = PDTest.currentTest.answers.total;
		byId("done_of").innerText = PDTest.currentTest.answers.max;
		byId("done").classList += " active";
	}, 
	
	/*
		ADD
	*/
	add: function(current, n){
		var currentTest = PDTest.currentTest.get();
		if(!currentTest || currentTest.length == 0){
			return;
		}
		var list = [];
		
		for(var i=0; i < n; i++){
			var index = ~~(Math.random()*currentTest.length);
			list.push(currentTest[index][current-1]);
		}
		var testHTML = "";
		var testnavHTML = ""
		for(var i=0; i<list.length; i++){
			var m = PDTest.currentTest.answers.max+i+1;
			testHTML += list[i].toHTML(m-1, 1);
			testnavHTML += '<button onclick="trigCard('+m+')" name="testnav" class="btn select d">'+m+'</button>';
		}
		byId("test").innerHTML += testHTML;
		byId("testnav").innerHTML += testnavHTML;
		
		PDTest.currentTest.answers.max += n;
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
			if(PDTest.mode == 0 && root.className.indexOf("answered")!=-1)return;
			
			
			root.className = "answered";
			var status = target.getAttribute("data-true") == "true";
			root.className += status ? " true" : " false";
			target.className += status ? " true" : " false";
			PDTest.currentTest.answers.add(status);
			document.querySelector("#testnav button:nth-of-type("+root.getAttribute("data-n")+")").className += status ? " g" : " r";
			if(PDTest.currentTest.answers.finished){
				byId("donebtn").className = byId("donebtn").className.split("hidden").join("");
			}
			
			if(PDTest.settings.get("autoContinue") == "true"){
				setTimeout(function(){
					var n = root.getAttribute("data-n")-0+1;
					if(n >= PDTest.currentTest.answers.max || PDTest.currentTest.answers.finished)return;
					trigCard(n);
					document.querySelectorAll("#testnav button").forEach(function(e){
						e.className = e.className.split(" active").join("");
					});
					document.querySelector("#testnav button:nth-of-type("+n+")").className += " active";
				}, 1000);
			}
			
			if(status == false){
				PDTest.stats.addMistake(PDTest.currentTest.current, root.getAttribute("data-id"));
				if(PDTest.mode == 0){
					if(root.getAttribute("data-exam") == "true" || PDTest.currentTest.answers.false >= 3){
						PDTest.currentTest.answers.finished = true;
						PDTest.stop(false);
						return;
					}
					
					PDTest.add(root.getAttribute("data-n"), 5);
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
			PDTest.restart();
			
			var list = PDTest.currentTest.get();
			byId("num").innerHTML = '<button onclick="PDTest.start(1, -1);" class="btn select active" name="menu2lvl">Случайный</button>';
			for(l in list){
				let i = l-0+1;
				byId("num").innerHTML += '<button onclick="PDTest.start(1, '+i+');" class="btn select" name="menu2lvl">'+i+'</button>';
			}
			
			var list = PDTest.currentTest.getSubject();
			byId("sbj").innerHTML = '';
			for(var i=0; i<list.length; i++){
				var l = list[i];
				byId("sbj").innerHTML += '<button onclick="PDTest.start(2, '+i+');" class="btn select" name="menu2lvl">'+l.title+'</button>';
			}
		},
		answers:{
			true: 0,
			false: 0,
			total: 0,
			max: 0,
			finished: false,
			add: function(n){
				PDTest.stats.add(n);
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
						PDTest.stop();
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
			var data = localStorage.getItem("PDTest.stats") || "0:0:0";
			data = data.split(":");
			
			this.true = data[0]-0;
			this.false = data[1]-0;
			this.total = data[2]-0;
			
			if(n == 1){
				this.true++;
			}else{
				this.false++;
			}
			this.total++;
			
			var data = [
				this.true,
				this.false,
				this.total
			];
			localStorage.setItem("PDTest.stats", data.join(":"));
			
			this.render();
		},
		render: function(){
			var data = localStorage.getItem("PDTest.stats") || "0:0:0";
			data = data.split(":");
			
			this.true = data[0]-0;
			this.false = data[1]-0;
			this.total = data[2]-0;
			
			byId("stats_true").innerText = this.true;
			byId("stats_false").innerText = this.false;
			byId("stats_total").innerText = this.total;
		},
		clear: function(){
			localStorage.setItem("PDTest.stats", "0:0:0");
			localStorage.setItem("PDTest.mistakes", "");
			this.true = this.false = this.total = 0;
			this.render();
		},
		addMistake: function(i, t){
			var data = localStorage.getItem("PDTest.mistakes") || "";
			if(data.indexOf(t) == -1){
				data = data.split(",");
				data.push(i.toUpperCase()+t);
				data = data.join(",");
				if(data[0] == ",")data = data.substr(1);
				localStorage.setItem("PDTest.mistakes", data);
			}
		}
	},
	
	/*
		SETTINGS
	*/
	settings:{
		get: function(n){
			var data = localStorage.getItem("PDTest.settings."+n) || false;
			return data;
		},
		set: function(n, t){
			localStorage.setItem("PDTest.settings."+n, t);
		},
		
	}
};

PDTest.init();

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
					ans.sort(function(){return Math.random()<0.5});
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

window.addEventListener("click", function(e){
	var target = e.target;
	
	if(target.className.indexOf("select") > -1){
		document.getElementsByName(target.name).forEach(function(e){
			e.className = e.className.split("active").join("").split("  ").join(" ");
		});
		target.className += " active";
	}
	
	if(target.id.indexOf("abcd") == 0){
		var list = PDTest.currentTest.get();
		
		byId("num").innerHTML = '<button onclick="PDTest.start(1, -1);" class="btn select active" name="menu2lvl">Случайный</button>';
		for(l in list){
			let i = l-0+1;
			byId("num").innerHTML += '<button onclick="PDTest.start(1, '+i+');" class="btn select" name="menu2lvl">'+i+'</button>';
		}
	}
	
	if(target.className.indexOf("trigger") > -1){
		event.preventDefault();
		document.querySelectorAll(".spoiler").forEach(function(e){
			e.className = e.className.split(" active").join("");
		});
		if(target.href.split("#")[1] && byId(target.href.split("#")[1])){
			byId(target.href.split("#")[1]).className += " active";
		}
	}
});

function trigCard(i){
	document.querySelectorAll("#test #question").forEach(function(e){
		e.className = e.className.split(" hidden").join("") + " hidden";
	});
	document.querySelectorAll("#test #question:nth-of-type("+i+")").forEach(function(e){
		e.className = e.className.split(" hidden").join("");
	});
}