// === Глобальные переменные ===
let currentDepositTask = {};
let currentAnnuityTask = {};
let currentDiffTask = {};
let currentInvestTask = {};
let currentEgeTask = {};
let score = 0;
let totalTasks = 0;
let answeredDeposit = false;
let answeredAnnuity = false;
let answeredDiff = false;
let answeredInvest = false;
let answeredEge = false;
let currentLevel = 'basic'; // 'basic' или 'advanced'
let egeTasksCompleted = 0;
let egeTotalScore = 0;

// === Вспомогательные функции ===
function formatNumber(num) {
    return new Intl.NumberFormat('ru-RU').format(Math.round(num));
}

function getYearWord(years) {
    const lastDigit = years % 10;
    const lastTwoDigits = years % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'лет';
    if (lastDigit === 1) return 'год';
    if (lastDigit >= 2 && lastDigit <= 4) return 'года';
    return 'лет';
}

// === Создание анимированного фона ===
function createBubbles() {
    const container = document.getElementById('bubbles-container');
    if (!container) return;
    container.innerHTML = '';
    const colors = [
        'rgba(0, 242, 255, 0.1)',
        'rgba(180, 0, 255, 0.1)',
        'rgba(255, 0, 195, 0.1)'
    ];
    for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('neon-bubble');
        const size = Math.random() * 200 + 50;
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const duration = Math.random() * 30 + 20;
        const delay = Math.random() * -20;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = 500 + Math.random() * 500;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        bubble.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${posX}px;
            top: ${posY}px;
            background: ${color};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            --tx: ${tx}px;
            --ty: ${ty}px;
        `;
        container.appendChild(bubble);
    }
}

// === Управление табами ===
function openTab(event, tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    const tabButtons = document.getElementsByClassName('tab-btn');

    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.add('hidden');
        tabContents[i].classList.remove('active');
    }

    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('tab-active');
        tabButtons[i].classList.add('tab-inactive');
    }

    document.getElementById(tabName).classList.remove('hidden');
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.remove('tab-inactive');
    event.currentTarget.classList.add('tab-active');

    // Генерация задач при переключении вкладок
    if (tabName === 'deposit') generateDepositTask();
    if (tabName === 'annuity') generateAnnuityTask();
    if (tabName === 'diff') generateDiffTask();
    if (tabName === 'invest') generateInvestTask();
    if (tabName === 'ege') generateEgeTask();
}

// === Переключение уровня сложности ===
function changeLevel(level) {
    currentLevel = level;
    document.getElementById('basic-tab').className = level === 'basic' ? 'level-tab active' : 'level-tab inactive';
    document.getElementById('advanced-tab').className = level === 'advanced' ? 'level-tab active' : 'level-tab inactive';

    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        const tabId = activeTab.id;
        if (tabId === 'deposit') generateDepositTask();
        if (tabId === 'annuity') generateAnnuityTask();
        if (tabId === 'diff') generateDiffTask();
        if (tabId === 'invest') generateInvestTask();
        if (tabId === 'ege') generateEgeTask();
    }
}

// === Обновление прогресса ===
function updateProgress() {
    let totalCorrect = 0;
    let totalTasksCount = 0;
    ['deposit', 'annuity', 'diff', 'invest', 'ege'].forEach(type => {
        totalCorrect += parseInt(document.getElementById(`${type}-score`).textContent);
        totalTasksCount += parseInt(document.getElementById(`${type}-total`).textContent);
    });
    const progress = totalTasksCount > 0 ? Math.round((totalCorrect / totalTasksCount) * 100) : 0;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('total-score').textContent = `${progress}%`;
}

// === Задачи по вкладам ===
function generateDepositTask() {
    let principal, rate, years, isCompound;
    if (currentLevel === 'basic') {
        principal = Math.floor(Math.random() * 90000) + 10000;
        rate = Math.floor(Math.random() * 11) + 5;
        years = Math.floor(Math.random() * 5) + 1;
        isCompound = Math.random() > 0.5;
    } else {
        principal = Math.floor(Math.random() * 900000) + 100000;
        rate = Math.floor(Math.random() * 15) + 5;
        years = Math.floor(Math.random() * 10) + 1;
        isCompound = true;
        if (Math.random() < 0.3) {
            const monthlyRate = rate / 12;
            const months = years * 12;
            currentDepositTask = {
                correct: principal * Math.pow(1 + monthlyRate / 100, months),
                question: `Вклад ${formatNumber(principal)} руб. под ${rate}% годовых на ${years} ${getYearWord(years)} с ежемесячной капитализацией. Сколько получит клиент?`
            };
            document.getElementById('deposit-question').textContent = currentDepositTask.question;
            document.getElementById('deposit-answer').value = '';
            document.getElementById('deposit-result').classList.add('hidden');
            document.getElementById('deposit-alert').classList.add('hidden');
            answeredDeposit = false;
            return;
        }
    }

    if (isCompound) {
        currentDepositTask = {
            correct: principal * Math.pow(1 + rate / 100, years),
            question: `Вклад ${formatNumber(principal)} руб. под ${rate}% годовых на ${years} ${getYearWord(years)} с капитализацией. Сколько получит клиент?`
        };
    } else {
        currentDepositTask = {
            correct: principal * (1 + rate / 100 * years),
            question: `Вклад ${formatNumber(principal)} руб. под ${rate}% годовых на ${years} ${getYearWord(years)} без капитализации. Сколько получит клиент?`
        };
    }

    document.getElementById('deposit-question').textContent = currentDepositTask.question;
    document.getElementById('deposit-answer').value = '';
    document.getElementById('deposit-result').classList.add('hidden');
    document.getElementById('deposit-alert').classList.add('hidden');
    document.getElementById('deposit-answer').disabled = false;
    answeredDeposit = false;
}

function checkDepositAnswer() {
    const alertDiv = document.getElementById('deposit-alert');
    const answerInput = document.getElementById('deposit-answer');
    const resultDiv = document.getElementById('deposit-result');

    if (answeredDeposit) {
        resultDiv.textContent = "Вы уже ответили! Нажмите 'Новая задача'.";
        resultDiv.className = 'bg-yellow-900/20 text-yellow-400 neon-border';
        resultDiv.classList.remove('hidden');
        return;
    }

    const userInput = answerInput.value;
    const userAnswer = parseFloat(userInput);

    if (isNaN(userAnswer)) {
        alertDiv.textContent = 'Пожалуйста, введите корректное число';
        alertDiv.classList.remove('hidden');
        return;
    }

    answeredDeposit = true;
    totalTasks++;
    const roundedAnswer = Math.round(userAnswer * 100) / 100;
    const isCorrect = Math.abs(roundedAnswer - currentDepositTask.correct) < 0.01;

    if (isCorrect) {
        resultDiv.textContent = `✅ Правильно! Ответ: ${currentDepositTask.correct.toLocaleString('ru-RU')} руб.`;
        resultDiv.className = 'bg-green-900/20 text-green-400 neon-border';
        score++;
    } else {
        resultDiv.textContent = `❌ Неправильно. Правильный ответ: ${currentDepositTask.correct.toLocaleString('ru-RU')} руб.`;
        resultDiv.className = 'bg-red-900/20 text-red-400 neon-border';
    }

    resultDiv.classList.remove('hidden');
    answerInput.disabled = true;

    const scoreSpan = document.getElementById('deposit-score');
    scoreSpan.textContent = parseInt(scoreSpan.textContent) + (isCorrect ? 1 : 0);
    const totalSpan = document.getElementById('deposit-total');
    totalSpan.textContent = parseInt(totalSpan.textContent) + 1;

    updateProgress();
}

// === Аннуитетный кредит ===
function generateAnnuityTask() {
    let principal, rate, years;
    if (currentLevel === 'basic') {
        principal = Math.floor(Math.random() * 900000) + 100000;
        rate = Math.floor(Math.random() * 11) + 10;
        years = Math.floor(Math.random() * 5) + 1;
    } else {
        principal = Math.floor(Math.random() * 5000000) + 1000000;
        rate = Math.floor(Math.random() * 15) + 10;
        years = Math.floor(Math.random() * 10) + 1;
        if (Math.random() < 0.3) {
            const commission = Math.floor(Math.random() * 5) + 1;
            const months = years * 12;
            const monthlyRate = rate / 100 / 12;
            const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
                            (Math.pow(1 + monthlyRate, months) - 1);
            currentAnnuityTask = {
                correct: payment + (principal * commission / 100 / 12),
                question: `Кредит ${formatNumber(principal)} руб. под ${rate}% годовых на ${years} ${getYearWord(years)} с аннуитетными платежами. Банк берёт ${commission}% от суммы кредита в качестве ежемесячной комиссии. Какой будет ежемесячный платёж?`
            };
            document.getElementById('annuity-question').textContent = currentAnnuityTask.question;
            document.getElementById('annuity-answer').value = '';
            document.getElementById('annuity-result').classList.add('hidden');
            document.getElementById('annuity-alert').classList.add('hidden');
            answeredAnnuity = false;
            return;
        }
    }

    const months = years * 12;
    const monthlyRate = rate / 100 / 12;
    currentAnnuityTask = {
        correct: principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
                  (Math.pow(1 + monthlyRate, months) - 1),
        question: `Кредит ${formatNumber(principal)} руб. под ${rate}% годовых на ${years} ${getYearWord(years)} с аннуитетными платежами. Какой будет ежемесячный платёж?`
    };

    document.getElementById('annuity-question').textContent = currentAnnuityTask.question;
    document.getElementById('annuity-answer').value = '';
    document.getElementById('annuity-result').classList.add('hidden');
    document.getElementById('annuity-alert').classList.add('hidden');
    answeredAnnuity = false;
}

function checkAnnuityAnswer() {
    const alertDiv = document.getElementById('annuity-alert');
    const answerInput = document.getElementById('annuity-answer');
    const resultDiv = document.getElementById('annuity-result');

    if (answeredAnnuity) {
        resultDiv.textContent = "Вы уже ответили! Нажмите 'Новая задача'.";
        resultDiv.className = 'bg-yellow-900/20 text-yellow-400 neon-border';
        resultDiv.classList.remove('hidden');
        return;
    }

    const userInput = answerInput.value;
    const userAnswer = parseFloat(userInput);

    if (isNaN(userAnswer)) {
        alertDiv.textContent = 'Пожалуйста, введите корректное число';
        alertDiv.classList.remove('hidden');
        return;
    }

    answeredAnnuity = true;
    totalTasks++;
    const roundedAnswer = Math.round(userAnswer * 100) / 100;
    const isCorrect = Math.abs(roundedAnswer - currentAnnuityTask.correct) < 0.01;

    if (isCorrect) {
        resultDiv.textContent = `✅ Правильно! Ответ: ${currentAnnuityTask.correct.toLocaleString('ru-RU')} руб.`;
        resultDiv.className = 'bg-green-900/20 text-green-400 neon-border';
        score++;
    } else {
        resultDiv.textContent = `❌ Неправильно. Правильный ответ: ${currentAnnuityTask.correct.toLocaleString('ru-RU')} руб.`;
        resultDiv.className = 'bg-red-900/20 text-red-400 neon-border';
    }

    resultDiv.classList.remove('hidden');
    answerInput.disabled = true;

    const scoreSpan = document.getElementById('annuity-score');
    scoreSpan.textContent = parseInt(scoreSpan.textContent) + (isCorrect ? 1 : 0);
    const totalSpan = document.getElementById('annuity-total');
    totalSpan.textContent = parseInt(totalSpan.textContent) + 1;

    updateProgress();
}

// === Дифференцированный кредит ===
function generateDiffTask() {
    let principal, rate, years;
    if (currentLevel === 'basic') {
        principal = Math.floor(Math.random() * 900000) + 100000;
        rate = Math.floor(Math.random() * 11) + 10;
        years = Math.floor(Math.random() * 5) + 1;
    } else {
        principal = Math.floor(Math.random() * 5000000) + 1000000;
        rate = Math.floor(Math.random() * 15) + 10;
        years = Math.floor(Math.random() * 10) + 1;
        if (Math.random() < 0.3) {
            const commission = Math.floor(Math.random() * 5) + 1;
            const months = years * 12;
            const monthlyPrincipal = principal / months;
            const firstPayment = monthlyPrincipal + principal * (rate / 100 / 12) + (principal * commission / 100);
            const lastPayment = monthlyPrincipal + monthlyPrincipal * (rate / 100 / 12) + (monthlyPrincipal * commission / 100);
            currentDiffTask = {
                firstPayment: firstPayment,
                lastPayment: lastPayment,
                question: `Кредит ${formatNumber(principal)} руб. под ${rate}% годовых на ${years} ${getYearWord(years)} с дифференцированными платежами. Банк берёт ${commission}% от остатка долга в качестве ежемесячной комиссии. Какой будет первый и последний платежи? (введите через пробел)`
            };
            document.getElementById('diff-question').textContent = currentDiffTask.question;
            document.getElementById('diff-answer').value = '';
            document.getElementById('diff-result').classList.add('hidden');
            document.getElementById('diff-alert').classList.add('hidden');
            answeredDiff = false;
            return;
        }
    }

    const months = years * 12;
    const monthlyPrincipal = principal / months;
    currentDiffTask = {
        firstPayment: monthlyPrincipal + principal * (rate / 100 / 12),
        lastPayment: monthlyPrincipal + monthlyPrincipal * (rate / 100 / 12),
        question: `Кредит ${formatNumber(principal)} руб. под ${rate}% годовых на ${years} ${getYearWord(years)} с дифференцированными платежами. Какой будет первый и последний платежи? (введите через пробел)`
    };

    document.getElementById('diff-question').textContent = currentDiffTask.question;
    document.getElementById('diff-answer').value = '';
    document.getElementById('diff-result').classList.add('hidden');
    document.getElementById('diff-answer').disabled = false;
    document.getElementById('diff-alert').classList.add('hidden');
    answeredDiff = false;
}

function checkDiffAnswer() {
    const alertDiv = document.getElementById('diff-alert');
    const answerInput = document.getElementById('diff-answer');
    const resultDiv = document.getElementById('diff-result');

    if (answeredDiff) {
        resultDiv.textContent = "Вы уже ответили! Нажмите 'Новая задача'.";
        resultDiv.className = 'bg-yellow-900/20 text-yellow-400 neon-border';
        resultDiv.classList.remove('hidden');
        return;
    }

    const userInput = answerInput.value.trim().split(/\s+/);
    if (userInput.length !== 2 || isNaN(userInput[0]) || isNaN(userInput[1])) {
        alertDiv.textContent = 'Пожалуйста, введите два числа через пробел';
        alertDiv.classList.remove('hidden');
        return;
    }

    answeredDiff = true;
    totalTasks++;
    const userAnswer1 = parseFloat(userInput[0]);
    const userAnswer2 = parseFloat(userInput[1]);

    const isCorrect = Math.abs(userAnswer1 - currentDiffTask.firstPayment) < 0.01 &&
                     Math.abs(userAnswer2 - currentDiffTask.lastPayment) < 0.01;

    if (isCorrect) {
        resultDiv.textContent = `✅ Правильно! Ответ: ${currentDiffTask.firstPayment.toLocaleString('ru-RU')} руб. и ${currentDiffTask.lastPayment.toLocaleString('ru-RU')} руб.`;
        resultDiv.className = 'bg-green-900/20 text-green-400 neon-border';
        score++;
    } else {
        resultDiv.textContent = `❌ Неправильно. Правильный ответ: ${currentDiffTask.firstPayment.toLocaleString('ru-RU')} руб. и ${currentDiffTask.lastPayment.toLocaleString('ru-RU')} руб.`;
        resultDiv.className = 'bg-red-900/20 text-red-400 neon-border';
    }

    resultDiv.classList.remove('hidden');
    answerInput.disabled = true;

    const scoreSpan = document.getElementById('diff-score');
    scoreSpan.textContent = parseInt(scoreSpan.textContent) + (isCorrect ? 1 : 0);
    const totalSpan = document.getElementById('diff-total');
    totalSpan.textContent = parseInt(totalSpan.textContent) + 1;

    updateProgress();
}

// === Инвестиции ===
function generateInvestTask() {
    let target, rate, years;
    if (currentLevel === 'basic') {
        target = Math.floor(Math.random() * 9000000) + 1000000;
        rate = Math.floor(Math.random() * 8) + 5;
        years = Math.floor(Math.random() * 15) + 5;
        currentInvestTask = {
            correct: target / Math.pow(1 + rate / 100, years),
            question: `Какую сумму вам нужно инвестировать сегодня под ${rate}% годовых, чтобы через ${years} ${getYearWord(years)} получить ${formatNumber(target)} руб.?`
        };
    } else {
        target = Math.floor(Math.random() * 90000000) + 10000000;
        rate = Math.floor(Math.random() * 15) + 5;
        years = Math.floor(Math.random() * 30) + 10;
        if (Math.random() < 0.3) {
            const monthlyPayment = Math.floor(Math.random() * 50000) + 10000;
            const monthlyRate = rate / 12 / 100;
            const months = years * 12;
            const futureValue = monthlyPayment * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
            currentInvestTask = {
                correct: futureValue,
                question: `Вы планируете ежемесячно вносить ${formatNumber(monthlyPayment)} руб. на инвестиционный счёт под ${rate}% годовых с ежемесячной капитализацией. Какую сумму вы накопите через ${years} ${getYearWord(years)}?`
            };
            document.getElementById('invest-question').textContent = currentInvestTask.question;
            document.getElementById('invest-answer').value = '';
            document.getElementById('invest-result').classList.add('hidden');
            document.getElementById('invest-alert').classList.add('hidden');
            answeredInvest = false;
            return;
        }
    }

    currentInvestTask = {
        correct: target / Math.pow(1 + rate / 100, years),
        question: `Какую сумму вам нужно инвестировать сегодня под ${rate}% годовых, чтобы через ${years} ${getYearWord(years)} получить ${formatNumber(target)} руб.?`
    };

    document.getElementById('invest-question').textContent = currentInvestTask.question;
    document.getElementById('invest-answer').value = '';
    document.getElementById('invest-result').classList.add('hidden');
    document.getElementById('invest-answer').disabled = false;
    document.getElementById('invest-alert').classList.add('hidden');
    answeredInvest = false;
}

function checkInvestAnswer() {
    const alertDiv = document.getElementById('invest-alert');
    const answerInput = document.getElementById('invest-answer');
    const resultDiv = document.getElementById('invest-result');

    if (answeredInvest) {
        resultDiv.textContent = "Вы уже ответили! Нажмите 'Новая задача'.";
        resultDiv.className = 'bg-yellow-900/20 text-yellow-400 neon-border';
        resultDiv.classList.remove('hidden');
        return;
    }

    const userAnswer = parseFloat(answerInput.value);
    if (isNaN(userAnswer)) {
        alertDiv.textContent = 'Пожалуйста, введите корректное число';
        alertDiv.classList.remove('hidden');
        return;
    }

    answeredInvest = true;
    totalTasks++;
    const roundedAnswer = Math.round(userAnswer * 100) / 100;
    const isCorrect = Math.abs(roundedAnswer - currentInvestTask.correct) < 0.01;

    if (isCorrect) {
        resultDiv.textContent = `✅ Правильно! Ответ: ${currentInvestTask.correct.toLocaleString('ru-RU')} руб.`;
        resultDiv.className = 'bg-green-900/20 text-green-400 neon-border';
        score++;
    } else {
        resultDiv.textContent = `❌ Неправильно. Правильный ответ: ${currentInvestTask.correct.toLocaleString('ru-RU')} руб.`;
        resultDiv.className = 'bg-red-900/20 text-red-400 neon-border';
    }

    resultDiv.classList.remove('hidden');
    answerInput.disabled = true;

    const scoreSpan = document.getElementById('invest-score');
    scoreSpan.textContent = parseInt(scoreSpan.textContent) + (isCorrect ? 1 : 0);
    const totalSpan = document.getElementById('invest-total');
    totalSpan.textContent = parseInt(totalSpan.textContent) + 1;

    updateProgress();
}

// === ЕГЭ задачи ===
function setEgeLevel(level) {
    currentLevel = level;
    document.getElementById('ege-basic-btn').className = level === 'basic' ?
        'px-4 py-2 rounded-l-lg font-medium bg-red-900/50 text-white border border-red-500' :
        'px-4 py-2 rounded-l-lg font-medium bg-gray-800/50 text-white/70 border border-gray-700';

    document.getElementById('ege-advanced-btn').className = level === 'advanced' ?
        'px-4 py-2 rounded-r-lg font-medium bg-red-900/50 text-white border border-red-500' :
        'px-4 py-2 rounded-r-lg font-medium bg-gray-800/50 text-white/70 border border-gray-700';

    egeTasksCompleted = 0;
    egeTotalScore = 0;
    document.getElementById('ege-score').textContent = '0';
    document.getElementById('ege-tasks').textContent = '0/10';
    document.getElementById('ege-new-task-btn').disabled = false;

    generateEgeTask();
}

function generateEgeTask() {
    if (egeTasksCompleted >= 10) {
        document.getElementById('ege-question').textContent = "Вы уже решили 10 задач. Максимальное количество задач достигнуто.";
        document.getElementById('ege-answer').disabled = true;
        document.getElementById('ege-new-task-btn').disabled = true;
        return;
    }

    if (currentLevel === 'basic') generateBasicEgeTask();
    else generateAdvancedEgeTask();
}

function generateBasicEgeTask() {
    const taskTypes = ['deposit', 'credit', 'discount'];
    const type = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    let question, correct, solution;

    const amount = Math.round((10000 + Math.random() * 90000) / 1000) * 1000;
    const years = 1 + Math.floor(Math.random() * 5);
    const rate = 5 + Math.floor(Math.random() * 16);

    switch (type) {
        case 'deposit':
            const capitalization = ['ежегодно', 'ежеквартально', 'ежемесячно'][Math.floor(Math.random() * 3)];
            let periodsPerYear, totalPeriods;
            if (capitalization === 'ежегодно') {
                periodsPerYear = 1;
                totalPeriods = years;
            } else if (capitalization === 'ежеквартально') {
                periodsPerYear = 4;
                totalPeriods = years * 4;
            } else {
                periodsPerYear = 12;
                totalPeriods = years * 12;
            }
            const periodRate = rate / periodsPerYear / 100;
            const finalAmount = Math.round(amount * Math.pow(1 + periodRate, totalPeriods));
            question = `Вклад ${amount.toLocaleString('ru-RU')} рублей под ${rate}% годовых с капитализацией ${capitalization}. Какая сумма будет на счету через ${years} ${getYearWord(years)}?`;
            correct = finalAmount.toString();
            solution = `Используем формулу сложных процентов: S = P × (1 + r)^n = ${amount} × (1 + ${periodRate.toFixed(4)})^{${totalPeriods}} ≈ ${finalAmount} руб.`;
            break;

        case 'credit':
            const months = years * 12;
            const monthlyRate = rate / 12 / 100;
            const annuityPayment = Math.round(amount * monthlyRate * Math.pow(1 + monthlyRate, months) /
                                   (Math.pow(1 + monthlyRate, months) - 1));
            question = `Кредит в ${amount.toLocaleString('ru-RU')} рублей выдан под ${rate}% годовых на ${years} ${getYearWord(years)} с аннуитетными платежами. Найдите ежемесячный платеж.`;
            correct = annuityPayment.toString();
            solution = `Месячная ставка: ${rate}%/12 = ${(rate / 12).toFixed(2)}%. Количество месяцев: ${months}. Платёж = (${amount}×${monthlyRate.toFixed(4)}×(1+${monthlyRate.toFixed(4)})^{${months}})/((1+${monthlyRate.toFixed(4)})^{${months}}-1) ≈ ${annuityPayment} руб.`;
            break;

        case 'discount':
            const futureAmount = Math.round((amount * (1 + 0.1 * Math.random())) / 1000) * 1000;
            const discountRate = 5 + Math.floor(Math.random() * 11);
            const presentValue = Math.round(futureAmount / Math.pow(1 + discountRate / 100, years));
            question = `Какую сумму нужно положить в банк под ${discountRate}% годовых с ежегодной капитализацией, чтобы через ${years} ${getYearWord(years)} получить ${futureAmount.toLocaleString('ru-RU')} рублей?`;
            correct = presentValue.toString();
            solution = `Используем формулу дисконтирования: P = S / (1 + r)^n = ${futureAmount} / (1 + ${discountRate / 100})^{${years}} ≈ ${presentValue} руб.`;
            break;
    }

    currentEgeTask = { correct, question, solution };
    document.getElementById('ege-question').textContent = currentEgeTask.question;
    document.getElementById('ege-answer').value = '';
    document.getElementById('ege-result').classList.add('hidden');
    document.getElementById('ege-answer').disabled = false;
    document.getElementById('ege-alert').classList.add('hidden');
    answeredEge = false;
}

function generateAdvancedEgeTask() {
    const taskTypes = ['two-payments', 'equal-reduction', 'varying-payments', 'deposit-additions'];
    const type = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    let question, correct, solution;

    const amount = Math.round((1000000 + Math.random() * 9000000) / 100000) * 100000;
    const years = 2 + Math.floor(Math.random() * 4);
    const rate = 10 + Math.floor(Math.random() * 21);

    switch (type) {
        case 'two-payments':
            const totalAmount = amount * Math.pow(1 + rate / 100, 2);
            const payment = Math.round(totalAmount / (1 + (1 + rate / 100)));
            question = `31 декабря заемщик взял ${(amount / 1000000).toLocaleString('ru-RU')} млн руб. под ${rate}% годовых на ${years} ${getYearWord(years)}. Какой должен быть X, чтобы долг был погашен двумя равными платежами?`;
            correct = payment.toString();
            solution = `После первого года долг: ${amount} × 1.${rate} = ${Math.round(amount * (1 + rate / 100))}. Осталось: ${Math.round(amount * (1 + rate / 100))} - X. На второй год: (${Math.round(amount * (1 + rate / 100))} - X) × 1.${rate} - X = 0 ⇒ X = ${payment} руб.`;
            break;

        case 'equal-reduction':
            const months = years * 12;
            const totalPayment = Math.round(amount * (1 + 0.3 + 0.1 * Math.random()));
            const r = Math.round((totalPayment / amount - 1) * 10 * 100) / 100;
            question = `15 января планируется взять кредит на ${months} мес. Условия: рост долга на r%, выплаты. Известно, что общая сумма выплат на ${Math.round((totalPayment / amount - 1) * 100)}% больше, чем сумма кредита. Найдите r.`;
            correct = r.toString();
            solution = `Долг уменьшается равномерно: каждый месяц на ${amount}/${months}. Проценты: ${amount} × (${months + 1}/2) × r/100 = ${(months + 1)/200 * amount * r} руб. Итого: ${amount} + ${(months + 1)/200 * amount * r} = ${totalPayment} ⇒ r = ${r}`;
            break;

        case 'varying-payments':
            const annualPayment = Math.round(amount / years);
            const totalInterest = annualPayment * rate / 100 * (years + 1) / 2;
            const totalPaymentVar = amount + totalInterest;
            question = `Взят кредит на ${(amount / 1000000).toLocaleString('ru-RU')} млн руб. на ${years} ${getYearWord(years)} под ${rate}% годовых. Сколько всего составят выплаты?`;
            correct = Math.round(totalPaymentVar).toString();
            solution = `Ежегодное уменьшение долга: ${annualPayment} руб. Проценты: ${amount} × ${(years + 1)/2} × ${rate / 100} = ${totalInterest} руб. Итого: ${amount} + ${totalInterest} = ${Math.round(totalPaymentVar)} руб.`;
            break;

        case 'deposit-additions':
            const additions = Math.round((100000 + Math.random() * 400000) / 10000) * 10000;
            const finalAmount = Math.round(amount * Math.pow(1 + rate / 100, 5) +
                                 additions * (Math.pow(1 + rate / 100, 4) + Math.pow(1 + rate / 100, 3) + Math.pow(1 + rate / 100, 2) + (1 + rate / 100));
            question = `В банк положено ${(amount / 1000000).toLocaleString('ru-RU')} млн руб. под ${rate}% годовых. Каждый из первых четырех лет добавляют ${additions.toLocaleString('ru-RU')} руб. Какая сумма будет через 5 лет?`;
            correct = finalAmount.toString();
            solution = `Через 5 лет: ${amount} × 1.${rate}^5 + ${additions} × (1.${rate}^4 + 1.${rate}^3 + 1.${rate}^2 + 1.${rate}) ≈ ${finalAmount} руб.`;
            break;
    }

    currentEgeTask = { correct, question, solution };
    document.getElementById('ege-question').textContent = currentEgeTask.question;
    document.getElementById('ege-answer').value = '';
    document.getElementById('ege-result').classList.add('hidden');
    document.getElementById('ege-answer').disabled = false;
    document.getElementById('ege-alert').classList.add('hidden');
    answeredEge = false;
}

function checkEgeAnswer() {
    const alertDiv = document.getElementById('ege-alert');
    const answerInput = document.getElementById('ege-answer');
    const resultDiv = document.getElementById('ege-result');

    if (answeredEge) {
        resultDiv.innerHTML = `<div class="flex items-start"><div class="mr-2">⚠️</div><div>Вы уже ответили! Нажмите 'Новая задача'</div></div>`;
        resultDiv.className = 'result-container bg-yellow-900/20 text-yellow-400 neon-border';
        resultDiv.classList.remove('hidden');
        return;
    }

    const userInput = answerInput.value.trim();
    if (!userInput) {
        alertDiv.textContent = 'Пожалуйста, введите ответ';
        alertDiv.classList.remove('hidden');
        return;
    }

    answeredEge = true;
    totalTasks++;
    egeTasksCompleted++;

    const isCorrect = userInput === currentEgeTask.correct;
    const pointsEarned = currentLevel === 'basic' ? 1 : 2;

    if (isCorrect) {
        egeTotalScore += pointsEarned;
        resultDiv.innerHTML = `
            <div class="flex items-start text-sm">
                <div class="mr-2 mt-1">✅</div>
                <div>
                    <p class="font-bold text-green-400">Правильно! +${pointsEarned} балл${pointsEarned > 1 ? 'а' : ''}</p>
                    <p class="mt-1">Ответ: <span class="font-mono">${currentEgeTask.correct}</span></p>
                    <details class="mt-1 text-gray-300">
                        <summary class="cursor-pointer hover:text-white">Показать решение</summary>
                        <div class="mt-1 bg-gray-900/50 p-2 rounded">${currentEgeTask.solution}</div>
                    </details>
                </div>
            </div>
        `;
        resultDiv.className = 'result-container bg-green-900/10 neon-border';
    } else {
        resultDiv.innerHTML = `
            <div class="flex items-start text-sm">
                <div class="mr-2 mt-1">❌</div>
                <div>
                    <p class="font-bold text-red-400">Неправильно</p>
                    <p class="mt-1">Правильный ответ: <span class="font-mono">${currentEgeTask.correct}</span></p>
                    <details class="mt-1 text-gray-300" open>
                        <summary class="cursor-pointer hover:text-white">Решение</summary>
                        <div class="mt-1 bg-gray-900/50 p-2 rounded">${currentEgeTask.solution}</div>
                    </details>
                </div>
            </div>
        `;
        resultDiv.className = 'result-container bg-red-900/10 neon-border';
    }

    resultDiv.classList.remove('hidden');
    answerInput.disabled = true;

    document.getElementById('ege-score').textContent = egeTotalScore;
    document.getElementById('ege-tasks').textContent = `${egeTasksCompleted}/10`;

    if (egeTasksCompleted >= 10) {
        const maxPossible = currentLevel === 'basic' ? 10 : 20;
        resultDiv.innerHTML += `<br><strong>Тест завершен!</strong> Вы набрали ${egeTotalScore} баллов из ${maxPossible} возможных.`;
        document.getElementById('ege-answer').disabled = true;
        document.getElementById('ege-new-task-btn').disabled = true;
    }

    updateProgress();
}

// === Инициализация ===
document.addEventListener('DOMContentLoaded', function () {
    createBubbles();
    generateDepositTask();
});
<script>
  document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    // Проверяем, открыт ли документ в iframe
    if (window.self !== window.top) {
      // Если да — не перенаправляем
      if (!user) {
        switchTab('login');
        createBubbles();
      }
    } else {
      // Если нет (открыт напрямую), то можно перенаправить
      if (error || !user) {
        switchTab('login');
        createBubbles();
      } else {
        window.location.href = 'index.html';
      }
    }
  } catch {
    if (window.self === window.top) {
      window.location.href = 'index.html';
    } else {
      switchTab('login');
      createBubbles();
    }
  }
});

  function openAuth() {
    document.getElementById('auth-container').classList.remove('hidden');
    const iframe = document.getElementById('auth-iframe');
    iframe.contentWindow.openLogin(); // вызов функции openLogin() внутри login.html
  }

  function openStats() {
    alert("Просмотр статистики");
  }

  function openTop() {
    alert("Таблица лидеров");
  }
</script>
