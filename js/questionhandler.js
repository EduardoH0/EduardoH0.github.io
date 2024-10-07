import { CT_QUESTIONS_PATH } from "./constants.js";

let currentQuestion = {};

export class QuestionHandler {
    constructor() {
        this.currentQuestion = {};
        this.quiz_container = document.getElementById('quiz-container');
        this.quizdiv = document.getElementById('quiz-div');
        this.inTheZoneDiv = document.getElementById('in-the-zone');
        this.in_the_zone = false;
    }

    async init() {
        // Load Questions
        this.questions = await this.loadQuestions();
    }

    initButtons(callback) {
        this.button0 = document.getElementById('answer-0');
        this.button1 = document.getElementById('answer-1');
        this.button2 = document.getElementById('answer-2');
        this.button0.addEventListener('click', () => {
            const isCorrect = this.checkAnswer(0);
            callback(isCorrect);
        });
        this.button1.addEventListener('click', () => {
            const isCorrect = this.checkAnswer(1);
            callback(isCorrect);
        });
        this.button2.addEventListener('click', () => {
            const isCorrect = this.checkAnswer(2);
            callback(isCorrect);
        });
        this.buttons = [this.button0, this.button1, this.button2]
    }

    async loadQuestions(){
        const response = await fetch('/assets/questions.json');
        const data = await response.json();
        return data.questions;
    }

    showquiz() {
        this._reset_animations();
        this.quiz_container.style.display = 'flex';
    }

    hidequiz() {
        this.quiz_container.style.display = 'none';
    }

    nextquestion() {
        const randomQuestion = this.pickRandomQuestion(this.questions);
        this.renderQuestion(randomQuestion);
        this.buttons.forEach(button => {button.disabled = false;})
    }

    // Pick a random question
    pickRandomQuestion(questions) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        return questions[randomIndex];
    }

    // Render question and answers
    renderQuestion(question) {
        currentQuestion = question;
        document.getElementById('question').textContent = question.question;
        this._shuffleArray(question.answers)

        const answerButtons = document.getElementsByClassName('answer');
        for (let i = 0; i < question.answers.length; i++) {
            answerButtons[i].textContent = question.answers[i].text;
        }
    }

    // Check answer
    checkAnswer(index) {
        this.buttons.forEach(button => {button.disabled = true;})

        let isCorrect = false;
        const selectedAnswer = currentQuestion.answers[index];
        this._reset_animations()

        if (selectedAnswer.isCorrect) {
            isCorrect = true;
        }

        setTimeout(() => {
            if (isCorrect) {
                this.quizdiv.classList.add('answer-correct');
                if (this.in_the_zone) {this.inTheZoneDiv.classList.add('in-the-zone-active');} 
                this.in_the_zone = true;
            } else {
                this.quizdiv.classList.add('answer-wrong');
                this.in_the_zone = false;
            }
        }, 10);
        return isCorrect
    }

    _reset_animations() {
        this.quizdiv.classList.remove('answer-correct');
        this.quizdiv.classList.remove('answer-wrong');
        this.inTheZoneDiv.classList.remove('in-the-zone-active');
    }

    _shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}