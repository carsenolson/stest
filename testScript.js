const {ipcRenderer} = require('electron');

var commonInfo = {};
var currentQuestionNumber = 0;
var testTitle = document.getElementById('testTitle');
var imageDiv = document.getElementById('imageDiv');
var shiftLeft = document.getElementById('shiftLeft');
var shiftRight = document.getElementById('shiftRight');
var questionArea = document.getElementById('questionArea');
var answersArea = document.getElementById('answersArea');
var imageArea = document.getElementById('imageDiv');
var finishBut = document.getElementById('finishBut');
var dAllQuestionNumber = document.getElementById('dAllQuestionNumber');
var dTimer = document.getElementById('dTimer');

var studentsAnswers = [];
var config;
var finishInfo = {
	name: "",
	className: "",
	right: 0,
	wrong: 0,
	total: 0	
}

function initAnswerBuffer() {
	for (var i = 0; i < commonInfo.correctTest.questions.length; i++) {
		var obj = {questionNumber: i, answers: []};	
		studentsAnswers.push(obj);
	}
}

function drawCurrentQuestionNumber() {
	dAllQuestionNumber.innerHTML = currentQuestionNumber + 1 + "/" + 
				commonInfo.correctTest.questions.length;	
}

function finishTest() {
	console.log("test finished");
	document.body.innerHTML = ''; //clear all body content
	var jumpotron = document.createElement('div');
	var container = document.createElement('div');
	var h1 = document.createElement('h1');
	var p1 = document.createElement('p');	
	var p2 = document.createElement('p');
	var p3 = document.createElement('p');
		
	document.body.appendChild(container);	
	container.setAttribute('class', 'containter');		
	
	p1.setAttribute('class', 'lead');	
	p2.setAttribute('class', 'lead');		
	p3.setAttribute('class', 'lead');	
	
	container.appendChild(h1);
	container.appendChild(p1);
	container.appendChild(p2);
	container.appendChild(p3);			

	h1.innerHTML = "Congratulations! You've passed the test. See your results below";

	var right = 0;		
	var mistake = 0;	
	for (let i = 0; i < studentsAnswers.length; i++) {
		for (answer of studentsAnswers[i].answers) {	
			var index = commonInfo.correctTest.questions[i].rightansw.indexOf(answer);
			if (index != -1) {
				right++;
			} else {
				mistake++;
			}
		}	
	}

	/* Count all right answers */		
	var allRightAnswers = 0;	
	var total = 0;	
	for (let i = 0; i < studentsAnswers.length; i++) {
		allRightAnswers += commonInfo.correctTest.questions[i].rightansw.length;
		total += commonInfo.correctTest.questions[i].answers.length;
	}
		
	console.log(right + ' ' + mistake + ' ' + studentsAnswers.length + ' ' + total);
	/*
	 * TODO: Implement algorithm for counting percent of right answers.
	 * 		Work with style of finish page.
	 */
	p1.innerHTML = "right answers: " + right;
	p2.innerHTML = "wrong answers: " + mistake;
	p3.innerHTML = "total number of possible answers: " + total;
		
	finishInfo.name = commonInfo.name;
	finishInfo.className = commonInfo.classNum;
	finishInfo.right = right;
	finishInfo.wrong = mistake;
	finishInfo.total = total;
	/*
	 * TODO: Implement sending to firebase results of test into 'results' direction.
	 */
}

finishBut.onclick = finishTest;

function drawSelectedAnswers() {
	if (!studentsAnswers[currentQuestionNumber].answers.length) {
		console.log("there is nothing to draw");
	} else {
		//get children from answerArea
		elements = answersArea.getElementsByTagName("*");		
		for (elem of elements) {
			if (studentsAnswers[currentQuestionNumber].answers.indexOf(elem.value) > -1) {
				elem.setAttribute('class', 'bg-success');
			}
		}
	}
}

function addordeleteAnswer(element) {
	for (let i = 0; i < studentsAnswers.length; i++) {
		if (studentsAnswers[i].questionNumber == currentQuestionNumber) {
			console.log(studentsAnswers[i]);
			var index = studentsAnswers[i].answers.indexOf(element.value);
			if (index == -1) {
       			element.setAttribute('class', 'bg-success'); 
   				studentsAnswers[i].answers.push(element.value) 
			} else if (index > -1) {
				studentsAnswers[i].answers.splice(index, 1);
      			element.setAttribute('class', 'bg-light'); 
    		}	
		}
	}	
}

function clearAnswers() {
	while(answersArea.firstChild)
		answersArea.firstChild.remove();
}

function setTestTitle() {
    testTitle.innerHTML = 'Test: ' + commonInfo.correctTest.name + ' Your name is: ' + 
		commonInfo.name + ' class/group: ' + commonInfo.classNum + ' given time: ' + 
		commonInfo.correctTest.tm + ' min';
}

function showTest(questionNumber) {
	questionArea.innerHTML = commonInfo.correctTest.questions[questionNumber].question;
    questionArea.setAttribute('class', 'font-weight-bold text-center');	
	imgURL = commonInfo.correctTest.questions[questionNumber].link;				

	if (imgURL.length) {
		console.log("this question contains an image");	
		questionImg = document.createElement('img');
		questionImg.setAttribute('src', imgURL);
		questionImg.setAttribute('width', "90%");
		questionImg.setAttribute('height', "auto");
		imageArea.append(questionImg);	
	} else {
		imageArea.removeChild(questionImg);
	}
	
	for	(var i = 1; i < commonInfo.correctTest.questions[questionNumber].answers.length + 1; i++) {
		var divAnswer = document.createElement('div');
		divAnswer.value = i;
		divAnswer.setAttribute('onclick', 'addordeleteAnswer(this)');
	    divAnswer.setAttribute('class', 'col-lg-8 text-left');	
        divAnswer.innerHTML = commonInfo.correctTest.questions[questionNumber].answers[i-1];
		answersArea.appendChild(divAnswer);
	}
}

var firebaseOptions;
var myApp;

ipcRenderer.send('asynchronous-message', 3);
ipcRenderer.on('asynchronous-reply', (event, arg) => {
	console.log(arg); 
	commonInfo = arg;
   	setTestTitle();
   	showTest(currentQuestionNumber);
  	//drawSelectedAnswers();
	setTimeout(finishTest, commonInfo.correctTest.tm * 1000 * 60);	
	drawCurrentQuestionNumber();
	initAnswerBuffer();
});

function shiftProcedure() {
	 	
	clearAnswers();
	showTest(currentQuestionNumber);
	drawSelectedAnswers();
	drawCurrentQuestionNumber();
}

shiftLeft.onclick = () => {
    if(currentQuestionNumber > 0) {
        --currentQuestionNumber;
		shiftProcedure();	
	}
};

shiftRight.onclick = () => {
    if(currentQuestionNumber < commonInfo.correctTest.questions.length-1) {
        ++currentQuestionNumber;
		shiftProcedure();	
	}
};
