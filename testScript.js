const {ipcRenderer} = require('electron');

var commonInfo = {};
var currentQuestionNumber = 0;
var studentsAnswers = [];
var testTitle = document.getElementById('testTitle');
var imageDiv = document.getElementById('imageDiv');
var shiftLeft = document.getElementById('shiftLeft');
var shiftRight = document.getElementById('shiftRight');
var questionArea = document.getElementById('questionArea');
var answersArea = document.getElementById('answersArea');
var dCurrentQuestionNumber = document.getElementById('dCurrentQuestionNumber');
var dAllQuestionNumber = document.getElementById('dAllQuestionNumber');

var answerBuffer = [];

function setAllQuestionNumber() {
    dAllQuestionNumber.innterHTML = studentsAnswers.length;
}

function setCurrentQuestionNumber() {
    dCurrentQuestionNumber.innterHTML = currentQuestionNumber;
}

function drawSelectedAnswers() {
	if (typeof(studentsAnswers[currentQuestionNumber]) == 'undefined') {
		console.log('nothing to draw');
	} else {
                    
    }
}

function addordeleteAnswer(element) {
	//console.log(element.value);
    var index = answerBuffer.indexOf(element.value);
    if (index > -1) {
        answerBuffer.splice(index, 1);
        element.setAttribute("class", "bg-success"); 
    } else {
        answerBuffer.push(element.value); 
        element.setAttribute("class", "bg-light"); 
    } 
    studentsAnswers[currentQuestionNumber] = answerBuffer;
    console.log(answerBuffer);
}

function clearAnswers() {
	while(answersArea.firstChild)
		answersArea.firstChild.remove();
}

function setTestTitle() {
    testTitle.innerHTML = "Test " + commonInfo.correctTest.test_name + " Your name is " + commonInfo.name + " class/group " + commonInfo.classNum;
}

function showTest(questionNumber) {
	questionArea.innerHTML = commonInfo.correctTest.questions[questionNumber].question;
    questionArea.setAttribute('class', 'col-lg-8 font-weight-bold text-center');	
    studentsAnswers.length = commonInfo.correctTest.questions.length;
	answerBuffer.length = commonInfo.correctTest.questions[questionNumber].answers.length;
	for (var i = 1; i < commonInfo.correctTest.questions[questionNumber].answers.length + 1; i++) {
		var divAnswer = document.createElement('div');
		divAnswer.value = i;
		divAnswer.setAttribute('onclick', 'addordeleteAnswer(this)');
	    divAnswer.setAttribute('class', 'col-lg-8 text-left');	
        divAnswer.innerHTML = commonInfo.correctTest.questions[questionNumber].answers[i-1];
		answersArea.appendChild(divAnswer);
	}
}

ipcRenderer.send('asynchronous-message', 3);
ipcRenderer.on('asynchronous-reply', (event, arg) => {
    commonInfo = arg;
    setTestTitle();
    showTest(currentQuestionNumber);
    setAllQuestionNumber();
                //drawSelectedAnswers();
});


shiftLeft.onclick = () => {
    if(currentQuestionNumber > 0) {
        --currentQuestionNumber;
        clearAnswers();
        showTest(currentQuestionNumber);
        setCurrentQuestionNumber();
        drawSelectedAnswers();
    }
};

shiftRight.onclick = () => {
    if(currentQuestionNumber < commonInfo.correctTest.questions.length-1) {
        ++currentQuestionNumber;
        clearAnswers();
        showTest(currentQuestionNumber);
        setCurrentQuestionNumber();
        drawSelectedAnswers()
    }
};
