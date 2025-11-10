const startBtn = document.querySelector(".start-btn");
const popInfo = document.querySelector(".popInfo");
const main = document.querySelector(".main");
const exitBtn = document.querySelector(".exit-btn");
const continueBtn = document.querySelector(".continue-btn");
const homeQuiz = document.querySelector(".homeQuiz");
const quizContainer = document.querySelector(".quizContainer");
const nextBtn = document.querySelector(".next-btn");
const optionList = document.querySelector(".optionList");
const home = document.querySelector(".home-btn");
const progressContainer = document.querySelector(".progress-container");
const tryAgain = document.querySelector(".tryAgain");
const bar = document.querySelector(".bar")
const navbar = document.querySelector(".navbar")
const barclose = document.querySelector(".barclose")

if(sessionStorage.getItem("data") !== "true"){
    window.location.href = '../index.html'
}

window.addEventListener("DOMContentLoaded", ()=>{
    const userData = JSON.parse(localStorage.getItem("quiz")) ;

    if(userData){
        questionCount = Math.min(userData.questionCount, questions.length -1);
        scoreCounter = Math.min(userData.scoreCounter, questions.length);
        scoreValue = Math.min(userData.scoreValue, questions.length);

        allOptionSelected = userData.allOptionSelected || {};

        homeQuiz.classList.add("active")
        popInfo.classList.remove("active")
        main.classList.remove("active")
        quizContainer.classList.add("active")

        showQuestion(questionCount)
        questionCounter(scoreCounter)
        showScore(scoreValue)
    }
})

let questionCount = 0;
let scoreCounter = 1;
let scoreValue = 0;

let allOptionSelected = {};

let counter;
let starter = 15;

if(bar){
    bar.addEventListener("click", ()=>{
        navbar.classList.add("active")
    })
}

if(barclose){
    barclose.addEventListener("click", ()=>{
        navbar.classList.remove("active")
    })
}

startBtn.addEventListener("click", ()=>{
    popInfo.classList.add("active")
    main.classList.add("active")
})

exitBtn.addEventListener("click", ()=>{
    popInfo.classList.remove("active")
    main.classList.remove("active")
})

continueBtn.addEventListener("click", ()=>{
    homeQuiz.classList.add("active")
    popInfo.classList.remove("active")
    main.classList.remove("active")
    quizContainer.classList.add("active")

    allOptionSelected = {}
    saveStorage()

    showQuestion(0)
    questionCounter(1)
    showScore()
})

nextBtn.addEventListener("click", ()=>{
    if(questionCount < questions.length -1){
        questionCount++;
        scoreCounter++;
        saveStorage()

        showQuestion(questionCount)
        questionCounter(scoreCounter)
    }else{
        showProgress()
    }
    nextBtn.classList.remove("active")
})

home.addEventListener("click", ()=>{
    homeQuiz.classList.remove("active")
    progressContainer.classList.remove("active")

    questionCount = 0;
    scoreCounter = 1;
    scoreValue = 0;

    allOptionSelected = {}
    localStorage.removeItem("quiz")

    showQuestion(questionCount)
    questionCounter(scoreCounter)
    showScore()
})

tryAgain.addEventListener("click", ()=>{
    progressContainer.classList.remove("active")
    quizContainer.classList.add("active")

    questionCount = 0;
    scoreCounter = 1;
    scoreValue = 0;

    allOptionSelected = {}
    saveStorage()

    showQuestion(questionCount)
    questionCounter(scoreCounter)
    showScore()
})

function saveStorage(){
    localStorage.setItem("quiz", JSON.stringify({
        questionCount,
        scoreCounter,
        scoreValue,
        allOptionSelected
    }))
}

function showQuestion(index){
    clearInterval(counter)
    quizTimer(starter)

    const quizQuest = document.querySelector(".quizQuest");
    quizQuest.textContent = `${questions[index].numb}. ${questions[index].question}`

    const optionTag =  questions[index].option.map((option)=> `
        <div class="option"><span>${option}</span></div>
    `).join(" ")

    optionList.innerHTML = optionTag;

    const options = document.querySelectorAll(".option");
    options.forEach(option =>{
        option.setAttribute("onclick", "optionSelected(this)")
    })

    const answer = allOptionSelected[index]

    if(answer){
        options.forEach((option)=>{
            const opt = option.textContent.trim();
            option.classList.add("disabled");

            if(opt === questions[index].answer.trim()){
                option.classList.add("correct")
            }else if(opt === answer.userAnswer){
                option.classList.add("incorrect")
            }
        })
    }
    nextBtn.classList.add("active")

}

function optionSelected(answer){
    const userAnswer = answer.textContent.trim();
    const correctAnswer = questions[questionCount].answer.trim();
    const allOption = optionList.children.length;
    clearInterval(counter)
    
    if(userAnswer === correctAnswer){
        answer.classList.add("correct")
        scoreValue++;

        showScore()
    }else{
        answer.classList.add("incorrect")

        for(let i = 0; i < allOption; i++){
            if(optionList.children[i].textContent.trim() === correctAnswer){
                optionList.children[i].classList.add("correct")
            }
        }
    }

    for(let i = 0; i < allOption; i++){
        optionList.children[i].classList.add("disabled")
    }
    nextBtn.classList.add("active")

    allOptionSelected[questionCount] = {userAnswer}
    saveStorage()
}

function questionCounter(index){
    const footerValue = document.querySelector(".footerValue");
    footerValue.textContent = `${index} / ${questions.length} Questions`
}

function showScore(){
    const headerBtn = document.querySelector(".header-btn");
    headerBtn.textContent = `Score: ${scoreValue} / ${questions.length}`
}

function autoSelect(){
    const correctAnswer = questions[questionCount].answer.trim();
    const allOption = optionList.children;

    for(let i = 0; i < allOption.length; i++){
        const optionsList = allOption[i].textContent.trim();

        if(optionsList === correctAnswer){
            allOption[i].classList.add("correct", "disabled")
        }else{
            allOption[i].classList.add("disabled")
        }
    }
    nextBtn.classList.add("active")
    allOptionSelected[questionCount] = {userAnswer : null}
    saveStorage()
}

function quizTimer(time){
    const quizTime = document.querySelector(".quizTime");
    quizTime.textContent = `Time Left: -${time}s`;
    time--;

    counter = setInterval(()=>{
        quizTime.textContent = `Time Left: -${time}s`;
        time--;

        if(time < 0){
            clearInterval(counter)
            autoSelect()
        }
    }, 1000)
}

function showProgress(){
    progressContainer.classList.add("active")
    quizContainer.classList.remove("active");

    const progressText = document.querySelector(".progress-text");
    progressText.textContent = `Your Score ${scoreValue} out of ${questions.length}`

    let progressStart = -1;
    let progressEnd = Math.round((scoreValue / questions.length) * 100);
    let speed = 20;
    const progressCircular = document.querySelector(".progress-circular");
    const progressValue = document.querySelector(".progress-value");

    let progress = setInterval(()=> {
        progressStart++;

        progressCircular.style.background = `conic-gradient(#c40094 ${3.6 * progressStart}deg, rgba(255, 255, 255, .2) 0deg)`
        progressValue.textContent = `${progressStart}%`

        if(progressStart === progressEnd){
            clearInterval(progress)
        }
    }, speed)
}