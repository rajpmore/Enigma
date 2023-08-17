const apiUrl ='https://opentdb.com/api.php?amount=50&difficulty=medium&type=multiple';

const startBtn= document.querySelector('.start-btn');
const popupInfo= document.querySelector('.popup-info');
const exitBtn= document.querySelector('.exit-btn');
const main= document.querySelector('.main');
const continueBtn= document.querySelector('.continue-btn');
const quizSection= document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const resultBox= document.querySelector('.result-box');
const tryAgainBtn= document.querySelector('.tryAgain-btn');
const goHomeBtn= document.querySelector('.goHome-btn');
const nextBtn= document.querySelector('.next-btn');
const optionList= document.querySelector('.option-list');

let questionNumb=1;
let userScore=0;

const q={};

startBtn.onclick = () => {
    popupInfo.classList.add('active');
    main.classList.add('active');
}

exitBtn.onclick = () => {
    popupInfo.classList.remove('active');
    main.classList.remove('active');
}

continueBtn.onclick = () => {
    quizSection.classList.add('active');
    popupInfo.classList.remove('active');
    main.classList.remove('active');
    quizBox.classList.add('active');
    showQuestions();
    questionCounter(questionNumb);
    headerScore();
}

tryAgainBtn.onclick = () => {
    quizBox.classList.add('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');
    questionNumb=1;
    userScore=0;
    showQuestions();
    questionCounter(questionNumb);
    headerScore();
}

goHomeBtn.onclick = () => {
    quizSection.classList.remove('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');
    questionNumb=1;
    userScore=0;
    showQuestions();
    questionCounter(questionNumb);    
}

nextBtn.onclick = () => {
    if(questionNumb<5)
    {
        questionNumb++;
        showQuestions();
        questionCounter(questionNumb);
        nextBtn.classList.remove('active');
    }
    else
    {
        showResultBox();
    }
}

function shuffleArray(array) 
{
    return array.sort(() => Math.random() - 0.5);
}

function questionCounter(questionNumb)
{
    const questionTotal= document.querySelector('.question-total');
    questionTotal.textContent=`${questionNumb} of 5 Questions`;
}

function headerScore()
{
    const headerScoreText=document.querySelector('.header-score');
    headerScoreText.textContent= `Score: ${userScore} / 5`;
}

async function fetchQuestion() 
{
    await fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const questionData = data.results[0];
            q.question = questionData.question;
            q.answer = questionData.correct_answer;
            const allOptions = [...questionData.incorrect_answers, questionData.correct_answer];
            const shuffledOptions = shuffleArray(allOptions);
            q.options=shuffledOptions;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    console.log(q.question);
    console.log(q.answer);
    console.log(q.options);
}

async function showQuestions()
{
    console.log("before");
    const a = await fetchQuestion();
    console.log("after");
    const questionText= document.querySelector('.question-text');
    questionText.textContent= `${questionNumb}. ${q.question}`;

    let optionTag= `<div class="option"><span>${q.options[0]}</span></div>
                    <div class="option"><span>${q.options[1]}</span></div>
                    <div class="option"><span>${q.options[2]}</span></div>
                    <div class="option"><span>${q.options[3]}</span></div>`;
    optionList.innerHTML=optionTag;
    const option=document.querySelectorAll('.option');
    for(let i=0;i<option.length;i++)
    {
        option[i].setAttribute('onclick','optionSelected(this)');
    }
}

function optionSelected(answer)
{
    let userAnswer=answer.textContent;
    console.log(q.answer);
    let correctAnswer= q.answer;
    let allOptions=optionList.children.length;
    if(userAnswer==correctAnswer)
    {
        answer.classList.add('correct');
        userScore+=1;
        headerScore();
    }
    else
    {
        answer.classList.add('incorrect');
        for(let i=0;i<allOptions;i++)
        {
            if(optionList.children[i].textContent== correctAnswer){
                optionList.children[i].setAttribute('class','option correct');
            }
        }   
    }

    for(let i=0;i<allOptions;i++)
    {
        optionList.children[i].classList.add('disabled');
    }
    nextBtn.classList.add('active');
}

function showResultBox()
{
    quizBox.classList.remove('active');
    resultBox.classList.add('active');
    const scoreText = document.querySelector('.score-text');
    scoreText.textContent= `Your Score ${userScore} out of 5`;
    const circularProgress = document.querySelector('.circular-progress');
    const progressValue = document.querySelector('.progress-value');
    let progressStartValue=-1;
    let progressEndValue=(userScore/5)*100;
    let speed=20;
    let progress= setInterval(() => {
        progressStartValue++;
        progressValue.textContent=`${progressStartValue}%`;
        circularProgress.style.background=`conic-gradient(#c40094 ${progressStartValue*3.6}deg, rgba(255, 255, 255, .1) 0deg)`;
        if(progressStartValue==progressEndValue){
            clearInterval(progress);
        }
    },speed);
}
