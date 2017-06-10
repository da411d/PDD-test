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
			
			byId("num").innerHTML = '<button onclick="PDTest.start(1, -1);" class="btn">Случайный</button>';
			var list = PDTest.currentTest[PDTest.currentTest.current];
			for(l in list){
				let i = l-0+1;
				byId("num").innerHTML += '<button onclick="PDTest.start(1, '+i+');" class="btn">'+i+'</button>';
			}
			
			//Зразу стартуєм
			PDTest.start(0, 0);
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
	}, 
	
	/*
		START: Починаєм тест
	*/
	start: function(mode, n){
		var currentTest = PDTest.currentTest.get();
		if(!currentTest || currentTest.length == 0){
			byId("h1").innerText = "Ошибка! Билеты не найдено!";
			return;
		}
		var list = [];
		switch(mode){
			case 0: //Екзамен
				var list = [];
				for(var i=0; i < currentTest[0].length; i++){
					var index = ~~(Math.random()*currentTest.length);
					list.push(currentTest[index][i]);
				}
				byId("h1").innerText = "Екзамен";
				break;
				
			case 1: //Білет по номеру
				var index = n > 0 ? n-1 : ~~(Math.random()*currentTest.length);
				list = currentTest[index];
				byId("h1").innerText = "Билет №"+(index+1);
				break;
				
			case 2: //Білет по темі
				alert("Футкція в розробці");
				break;
				
			case 3: //Кожне N-те
				var list = [];
				for(var i=0; i < currentTest.length; i++){
					list.push(currentTest[i][n-1]);
				}
				byId("h1").innerText = "Каждый "+n+"-й вопрос";
				break;
				
			case 4: //100 складних
				for(var i=0; i < currentTest.length; i++){
					for(var n=0; n < currentTest[i].length; n++){
						if(currentTest[i][n].difficult){
							list.push(currentTest[i][n]);
						}
					}
				}
				byId("h1").innerText = "100 сложных";
				break;
				
			case 5: //Марафон
				var list = [];
				for(var i=0; i < currentTest.length; i++){
					for(var n=0; n < currentTest[i].length; n++){
						list.push(currentTest[i][n]);
					}
				}
				byId("h1").innerText = "Марафон";
				break;
		}
		
		byId("test").innerHTML = "";
		list = shuffle(list);
		for(var i=0; i<list.length; i++){
			byId("test").appendChild(list[i].toHTML());
		}
		
		PDTest.currentTest.stats.init(list.length);
		window.addEventListener("click", this.listener);
		//window.location.hash = "";
		console.log("THE TEST HAS STARTED");
	},
	
	/*
		STOP: Завершуємо тест. Знімаєм всі лістенери, ще щось тут буде..
	*/
	stop: function(){
		window.removeEventListener("click", this.listener);
		document.querySelectorAll("#question").forEach(function(e){
			e.className += " hidden";
			setTimeout(function(){
				e.outerHTML = "";
			}, 1000);
		});
		byId("h1").innerText = "Тест завершено!";
		byId("done_true").innerText = PDTest.currentTest.stats.true;
		byId("done_false").innerText = PDTest.currentTest.stats.false;
		byId("done_total").innerText = PDTest.currentTest.stats.total;
		byId("done_of").innerText = PDTest.currentTest.stats.max;
		console.log("THE TEST HAS STOPPED");
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
		
		if(target.id == "question_answer" && root.className.indexOf("answered")==-1){
			root.className = "answered";
			if(target.getAttribute("data-true") == "true"){//Правильна відповідь
				root.className += " true";
				target.className += " true";
				PDTest.currentTest.stats.add(1);
			}else{
				root.className += " false";
				target.className += " false";
				PDTest.currentTest.stats.add(0);
			}
			if(PDTest.currentTest.stats.finished){
				byId("donebtn").className = byId("donebtn").className.split("hidden").join("");
			}
		}
	},
	
	/*
		currentTest: Ще має бути тест BC, але тут треба щось зробити.. Може генерувати все на стороні сервера
	*/
	currentTest: {
		current: false,
		AB: [],
		CD: [],
		get: function(){
			return this[this.current] || this.AB;
		},
		set: function(a){
			this.current = a||false;
		},
		stats:{
			true: 0,
			false: 0,
			total: 0,
			max: 0,
			finished: false,
			add: function(n){
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
				this.render();
			},
			render: function(){
				byId("sidebar_true").innerText = this.true;
				byId("sidebar_false").innerText = this.false;
				byId("sidebar_total").innerText = this.total;
				byId("sidebar_of").innerText = this.max;
			}
		}
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
		difficult: data.difficult||"",
		
		toHTML: function(){
			var container = document.createElement("div");
			container.id = "question";
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
			return container;
		}
	}
}

window.addEventListener("click", function(e){
	var target = e.target;
	
	if(target.parentElement.className.indexOf("select") > -1){
		target.parentElement.querySelectorAll(".btn").forEach(function(e){
			e.className = e.className.split("active").join("");
		});
		target.className += " active";
	}
	
	if(target.id.indexOf("abcd") == 0){
		var list = PDTest.currentTest.get();
		
		byId("num").innerHTML = '<button onclick="PDTest.start(1, -1);" class="btn">Случайный</button>';
		for(l in list){
			let i = l-0+1;
			byId("num").innerHTML += '<button onclick="PDTest.start(1, '+i+');" class="btn">'+i+'</button>';
		}
	}
});