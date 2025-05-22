import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  // State variables
  const [currentTab, setCurrentTab] = useState('deposit');
  const [currentLevel, setCurrentLevel] = useState('basic');
  const [egeLevel, setEgeLevel] = useState('basic');
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [egeTasksCompleted, setEgeTasksCompleted] = useState(0);
  const [egeTotalScore, setEgeTotalScore] = useState(0);

  // Task states
  const [depositTask, setDepositTask] = useState({});
  const [annuityTask, setAnnuityTask] = useState({});
  const [diffTask, setDiffTask] = useState({});
  const [investTask, setInvestTask] = useState({});
  const [egeTask, setEgeTask] = useState({});

  // Answer states
  const [depositAnswer, setDepositAnswer] = useState('');
  const [annuityAnswer, setAnnuityAnswer] = useState('');
  const [diffAnswer, setDiffAnswer] = useState('');
  const [investAnswer, setInvestAnswer] = useState('');
  const [egeAnswer, setEgeAnswer] = useState('');

  // Result visibility and alerts
  const [showDepositResult, setShowDepositResult] = useState(false);
  const [showAnnuityResult, setShowAnnuityResult] = useState(false);
  const [showDiffResult, setShowDiffResult] = useState(false);
  const [showInvestResult, setShowInvestResult] = useState(false);
  const [showEgeResult, setShowEgeResult] = useState(false);

  const [depositAlert, setDepositAlert] = useState(false);
  const [annuityAlert, setAnnuityAlert] = useState(false);
  const [diffAlert, setDiffAlert] = useState(false);
  const [investAlert, setInvestAlert] = useState(false);
  const [egeAlert, setEgeAlert] = useState(false);

  // Track if answered already
  const [answeredDeposit, setAnsweredDeposit] = useState(false);
  const [answeredAnnuity, setAnsweredAnnuity] = useState(false);
  const [answeredDiff, setAnsweredDiff] = useState(false);
  const [answeredInvest, setAnsweredInvest] = useState(false);
  const [answeredEge, setAnsweredEge] = useState(false);

  // Refs for bubble animation
  const bubblesContainerRef = useRef(null);

  // Format numbers with commas
  const formatNumber = (num) =>
    new Intl.NumberFormat('ru-RU').format(Math.round(num));

  // Get year word (год/года/лет)
  const getYearWord = (years) => {
    const lastDigit = years % 10;
    const lastTwoDigits = years % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'лет';
    if (lastDigit === 1) return 'год';
    if (lastDigit >= 2 && lastDigit <= 4) return 'года';
    return 'лет';
  };

  // Generate deposit task
  const generateDepositTask = () => {
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
        const correct = principal * Math.pow(1 + monthlyRate / 100, months);
        const question = `Вклад ${formatNumber(principal)} руб. под ${rate}% годовых на ${years} ${getYearWord(years)} с ежемесячной капитализацией. Сколько получит клиент?`;
        setDepositTask({ correct, question });
        setAnsweredDeposit(false);
        setDepositAnswer('');
        setDepositAlert(false);
        setShowDepositResult(false);
        return;
      }
    }

    if (isCompound) {
      const correct = principal * Math.pow(1 + rate / 100, years);
      const question = `Вклад ${formatNumber(principal)} руб. под ${rate}% годовых на ${years} ${getYearWord(years)} с капитализацией. Сколько получит клиент?`;
      setDepositTask({ correct, question });
    } else {
      const correct = principal * (1 + rate / 100 * years);
      const question = `Вклад ${formatNumber(principal)} руб. под ${rate}% годовых на ${years} ${getYearWord(years)} без капитализации. Сколько получит клиент?`;
      setDepositTask({ correct, question });
    }

    setAnsweredDeposit(false);
    setDepositAnswer('');
    setDepositAlert(false);
    setShowDepositResult(false);
  };

  // Check deposit answer
  const checkDepositAnswer = () => {
    if (answeredDeposit) {
      setDepositTask((prev) => ({
        ...prev,
        result: "Вы уже ответили! Нажмите 'Новая задача'.",
        type: 'warning',
      }));
      setShowDepositResult(true);
      return;
    }

    const userAnswer = parseFloat(depositAnswer);
    if (isNaN(userAnswer)) {
      setDepositAlert(true);
      return;
    }

    setAnsweredDeposit(true);
    setTotalTasks(totalTasks + 1);

    const roundedAnswer = Math.round(userAnswer * 100) / 100;
    const isCorrect =
      Math.abs(roundedAnswer - depositTask.correct) < 0.01;

    setDepositTask((prev) => ({
      ...prev,
      result: isCorrect
        ? `✅ Правильно! Ответ: ${formatNumber(prev.correct)} руб.`
        : `❌ Неправильно. Правильный ответ: ${formatNumber(prev.correct)} руб.`,
      type: isCorrect ? 'success' : 'error',
    }));

    setDepositAlert(false);
    setDepositAnswer('');
    setShowDepositResult(true);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  // Generate annuity task
  const generateAnnuityTask = () => {
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
        const payment =
          principal *
            monthlyRate *
            Math.pow(1 + monthlyRate, months) /
            (Math.pow(1 + monthlyRate, months) - 1) +
          (principal * commission) / 100 / 12;
        const question = `Кредит ${formatNumber(principal)} руб. под ${rate}% годовых на ${years} ${getYearWord(
          years
        )} с аннуитетными платежами. Банк берёт ${commission}% от суммы кредита в качестве ежемесячной комиссии. Какой будет ежемесячный платёж?`;
        setAnnuityTask({ correct: payment, question });
        setAnsweredAnnuity(false);
        setAnnuityAnswer('');
        setAnnuityAlert(false);
        setShowAnnuityResult(false);
        return;
      }
    }

    const months = years * 12;
    const monthlyRate = rate / 100 / 12;
    const correct =
      principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, months) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const question = `Кредит ${formatNumber(principal)} руб. под ${rate}% годовых на ${years} ${getYearWord(
      years
    )} с аннуитетными платежами. Какой будет ежемесячный платёж?`;

    setAnnuityTask({ correct, question });
    setAnsweredAnnuity(false);
    setAnnuityAnswer('');
    setAnnuityAlert(false);
    setShowAnnuityResult(false);
  };

  // Check annuity answer
  const checkAnnuityAnswer = () => {
    if (answeredAnnuity) {
      setAnnuityTask((prev) => ({
        ...prev,
        result: "Вы уже ответили! Нажмите 'Новая задача'.",
        type: 'warning',
      }));
      setShowAnnuityResult(true);
      return;
    }

    const userAnswer = parseFloat(annuityAnswer);
    if (isNaN(userAnswer)) {
      setAnnuityAlert(true);
      return;
    }

    setAnsweredAnnuity(true);
    setTotalTasks(totalTasks + 1);

    const roundedAnswer = Math.round(userAnswer * 100) / 100;
    const isCorrect =
      Math.abs(roundedAnswer - annuityTask.correct) < 0.01;

    setAnnuityTask((prev) => ({
      ...prev,
      result: isCorrect
        ? `✅ Правильно! Ответ: ${formatNumber(prev.correct)} руб.`
        : `❌ Неправильно. Правильный ответ: ${formatNumber(prev.correct)} руб.`,
      type: isCorrect ? 'success' : 'error',
    }));

    setAnnuityAlert(false);
    setAnnuityAnswer('');
    setShowAnnuityResult(true);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  // Generate differentiated credit task
  const generateDiffTask = () => {
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
        const firstPayment =
          monthlyPrincipal +
          principal * (rate / 100 / 12) +
          (principal * commission) / 100;
        const lastPayment =
          monthlyPrincipal +
          monthlyPrincipal * (rate / 100 / 12) +
          (monthlyPrincipal * commission) / 100;
        const question = `Кредит ${formatNumber(principal)} руб. под ${rate}% годовых на ${years} ${getYearWord(
          years
        )} с дифференцированными платежами. Банк берёт ${commission}% от остатка долга в качестве ежемесячной комиссии. Какой будет первый и последний платежи? (введите через пробел)`;
        setDiffTask({
          firstPayment,
          lastPayment,
          question,
        });
        setAnsweredDiff(false);
        setDiffAnswer('');
        setDiffAlert(false);
        setShowDiffResult(false);
        return;
      }
    }

    const months = years * 12;
    const monthlyPrincipal = principal / months;
    const firstPayment =
      monthlyPrincipal + principal * (rate / 100 / 12);
    const lastPayment =
      monthlyPrincipal + monthlyPrincipal * (rate / 100 / 12);

    setDiffTask({
      firstPayment,
      lastPayment,
      question: `Кредит ${formatNumber(principal)} руб. под ${rate}% годовых на ${years} ${getYearWord(
        years
      )} с дифференцированными платежами. Какой будет первый и последний платежи? (введите через пробел)`,
    });

    setAnsweredDiff(false);
    setDiffAnswer('');
    setDiffAlert(false);
    setShowDiffResult(false);
  };

  // Check diff answer
  const checkDiffAnswer = () => {
    if (answeredDiff) {
      setDiffTask((prev) => ({
        ...prev,
        result: "Вы уже ответили! Нажмите 'Новая задача'.",
        type: 'warning',
      }));
      setShowDiffResult(true);
      return;
    }

    const parts = diffAnswer.trim().split(/\s+/);
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
      setDiffAlert(true);
      return;
    }

    setAnsweredDiff(true);
    setTotalTasks(totalTasks + 1);

    const userAnswer1 = parseFloat(parts[0]);
    const userAnswer2 = parseFloat(parts[1]);

    const isCorrect =
      Math.abs(userAnswer1 - diffTask.firstPayment) < 0.01 &&
      Math.abs(userAnswer2 - diffTask.lastPayment) < 0.01;

    setDiffTask((prev) => ({
      ...prev,
      result: isCorrect
        ? `✅ Правильно! Ответ: ${formatNumber(prev.firstPayment)} руб. и ${formatNumber(
            prev.lastPayment
          )} руб.`
        : `❌ Неправильно. Правильный ответ: ${formatNumber(prev.firstPayment)} руб. и ${formatNumber(
            prev.lastPayment
          )} руб.`,
      type: isCorrect ? 'success' : 'error',
    }));

    setDiffAlert(false);
    setDiffAnswer('');
    setShowDiffResult(true);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  // Generate investment task
  const generateInvestTask = () => {
    let target, rate, years;
    if (currentLevel === 'basic') {
      target = Math.floor(Math.random() * 9000000) + 1000000;
      rate = Math.floor(Math.random() * 8) + 5;
      years = Math.floor(Math.random() * 15) + 5;
      const correct = target / Math.pow(1 + rate / 100, years);
      const question = `Какую сумму вам нужно инвестировать сегодня под ${rate}% годовых, чтобы через ${years} ${getYearWord(
        years
      )} получить ${formatNumber(target)} руб.?`;
      setInvestTask({ correct, question });
    } else {
      target = Math.floor(Math.random() * 90000000) + 10000000;
      rate = Math.floor(Math.random() * 15) + 5;
      years = Math.floor(Math.random() * 30) + 10;
      if (Math.random() < 0.3) {
        const monthlyPayment = Math.floor(Math.random() * 50000) + 10000;
        const monthlyRate = rate / 12 / 100;
        const months = years * 12;
        const futureValue =
          monthlyPayment *
          (Math.pow(1 + monthlyRate, months) - 1) /
          monthlyRate;
        const question = `Вы планируете ежемесячно вносить ${formatNumber(monthlyPayment)} руб. на инвестиционный счёт под ${rate}% годовых с ежемесячной капитализацией. Какую сумму вы накопите через ${years} ${getYearWord(
          years
        )}?`;
        setInvestTask({ correct: futureValue, question });
      } else {
        const correct = target / Math.pow(1 + rate / 100, years);
        const question = `Какую сумму вам нужно инвестировать сегодня под ${rate}% годовых, чтобы через ${years} ${getYearWord(
          years
        )} получить ${formatNumber(target)} руб.?`;
        setInvestTask({ correct, question });
      }
    }

    setAnsweredInvest(false);
    setInvestAnswer('');
    setInvestAlert(false);
    setShowInvestResult(false);
  };

  // Check invest answer
  const checkInvestAnswer = () => {
    if (answeredInvest) {
      setInvestTask((prev) => ({
        ...prev,
        result: "Вы уже ответили! Нажмите 'Новая задача'.",
        type: 'warning',
      }));
      setShowInvestResult(true);
      return;
    }

    const userAnswer = parseFloat(investAnswer);
    if (isNaN(userAnswer)) {
      setInvestAlert(true);
      return;
    }

    setAnsweredInvest(true);
    setTotalTasks(totalTasks + 1);

    const roundedAnswer = Math.round(userAnswer * 100) / 100;
    const isCorrect =
      Math.abs(roundedAnswer - investTask.correct) < 0.01;

    setInvestTask((prev) => ({
      ...prev,
      result: isCorrect
        ? `✅ Правильно! Ответ: ${formatNumber(prev.correct)} руб.`
        : `❌ Неправильно. Правильный ответ: ${formatNumber(prev.correct)} руб.`,
      type: isCorrect ? 'success' : 'error',
    }));

    setInvestAlert(false);
    setInvestAnswer('');
    setShowInvestResult(true);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  // Generate EGE task
  const generateEgeTask = () => {
    if (egeTasksCompleted >= 10) {
      setEgeTask({
        question:
          'Вы уже решили 10 задач. Максимальное количество задач достигнуто.',
        correct: '',
        solution: '',
      });
      setEgeAnswer('');
      return;
    }

    if (egeLevel === 'basic') {
      const taskTypes = ['deposit', 'credit', 'discount'];
      const type = taskTypes[Math.floor(Math.random() * taskTypes.length)];
      const amount = Math.round((10000 + Math.random() * 90000) / 1000) * 1000;
      const years = 1 + Math.floor(Math.random() * 5);
      const rate = 5 + Math.floor(Math.random() * 16);

      switch (type) {
        case 'deposit':
          const capitalization = ['ежегодно', 'ежеквартально', 'ежемесячно'][
            Math.floor(Math.random() * 3)
          ];
          const periodsPerYear =
            capitalization === 'ежегодно'
              ? 1
              : capitalization === 'ежеквартально'
              ? 4
              : 12;
          const totalPeriods =
            capitalization === 'ежегодно'
              ? years
              : capitalization === 'ежеквартально'
              ? years * 4
              : years * 12;
          const periodRate = rate / periodsPerYear / 100;
          const finalAmount = Math.round(
            amount * Math.pow(1 + periodRate, totalPeriods)
          );
          const question = `Вкладчик положил в банк ${amount.toLocaleString(
            'ru-RU'
          )} рублей под ${rate}% годовых с капитализацией ${capitalization}. Какая сумма будет на счету через ${years} ${getYearWord(
            years
          )}?`;
          const correct = finalAmount.toString();
          const solution = `Используем формулу сложных процентов: S = P × (1 + r)^n = ${amount} × (1 + ${periodRate.toFixed(
            4
          )})^(${totalPeriods}) ≈ ${finalAmount} руб.`;
          setEgeTask({ correct, question, solution });
          break;
        case 'credit':
          const months = years * 12;
          const monthlyRate = rate / 12 / 100;
          const annuityPayment = Math.round(
            (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
              (Math.pow(1 + monthlyRate, months) - 1)
          );
          const question2 = `Кредит в ${amount.toLocaleString(
            'ru-RU'
          )} рублей выдан под ${rate}% годовых на ${years} ${getYearWord(
            years
          )} с аннуитетными платежами. Найдите ежемесячный платеж.`;
          const correct2 = annuityPayment.toString();
          const solution2 = `Месячная ставка: ${rate}%/12 = ${(rate / 12).toFixed(
            2
          )}%. Количество месяцев: ${months}. Платёж = (${amount}×${monthlyRate.toFixed(
            4
          )}×(1+${monthlyRate.toFixed(4)})^(${months})) / ((1+${monthlyRate.toFixed(
            4
          )})^(${months})-1) ≈ ${annuityPayment} руб.`;
          setEgeTask({ correct: correct2, question: question2, solution: solution2 });
          break;
        case 'discount':
          const futureAmount = Math.round((amount * (1 + 0.1 * Math.random())) / 1000) * 1000;
          const discountRate = 5 + Math.floor(Math.random() * 11);
          const presentValue = Math.round(futureAmount / Math.pow(1 + discountRate / 100, years));
          const question3 = `Какую сумму нужно положить в банк под ${discountRate}% годовых с ежегодной капитализацией, чтобы через ${years} ${getYearWord(
            years
          )} получить ${futureAmount.toLocaleString('ru-RU')} рублей?`;
          const correct3 = presentValue.toString();
          const solution3 = `Используем формулу дисконтирования: P = S / (1 + r)^n = ${futureAmount} / (1 + ${discountRate / 100})^(${years}) ≈ ${presentValue} руб.`;
          setEgeTask({ correct: correct3, question: question3, solution: solution3 });
          break;
      }
    } else {
      const taskTypes = [
        'two-payments',
        'equal-reduction',
        'varying-payments',
        'deposit-additions',
      ];
      const type = taskTypes[Math.floor(Math.random() * taskTypes.length)];
      const amount = Math.round((1000000 + Math.random() * 9000000) / 100000) * 100000;
      const years = 2 + Math.floor(Math.random() * 4);
      const rate = 10 + Math.floor(Math.random() * 21);

      switch (type) {
        case 'two-payments':
          const totalAmount = amount * Math.pow(1 + rate / 100, 2);
          const payment = Math.round(totalAmount / (1 + (1 + rate / 100));
          const question = `31 декабря 2024 года заемщик взял в банке ${(amount / 1000000).toLocaleString(
            'ru-RU'
          )} млн рублей в кредит под ${rate}% годовых. Схема выплаты кредита следующая — 31 декабря каждого следующего года банк начисляет проценты на оставшуюся сумму долга, затем заемщик переводит в банк X рублей. Какой должна быть сумма X, чтобы заемщик выплатил долг двумя равными платежами?`;
          const correct = payment.toString();
          const solution = `После первого года долг составит: ${amount} × 1.${rate} = ${Math.round(
            amount * (1 + rate / 100)
          )}. После выплаты X руб. останется: ${Math.round(
            amount * (1 + rate / 100)
          )} - X. На второй год остаток увеличивается на ${rate}%: (${Math.round(
            amount * (1 + rate / 100)
          )} - X) × 1.${rate}. После второй выплаты X руб. долг должен быть погашен: (${Math.round(
            amount * (1 + rate / 100)
          )} - X) × 1.${rate} - X = 0. Решая уравнение, получаем X = ${payment} руб.`;
          setEgeTask({ correct, question, solution });
          break;
        case 'equal-reduction':
          const months = years * 12;
          const totalPayment = Math.round(amount * (1 + 0.3 + 0.1 * Math.random()));
          const r = Math.round(
            ((totalPayment / amount - 1) * 10 * 100) / 100
          );
          const question2 = `15 января планируется взять кредит в банке на ${months} месяцев. Условия его возврата таковы: 1-го числа каждого месяца долг возрастает на r% по сравнению с концом предыдущего месяца; со 2-го по 14-е число каждого месяца необходимо выплатить часть долга; 15-го числа каждого месяца долг должен быть на одну и ту же сумму меньше долга на 15-е число предыдущего месяца. Известно, что общая сумма выплат после полного погашения кредита на ${Math.round(
            (totalPayment / amount - 1) * 100
          )}% больше суммы, взятой в кредит. Найдите r.`;
          const correct2 = r.toString();
          const solution2 = `Пусть сумма кредита S. По условию, долг уменьшается равномерно: каждый месяц на S/${months}. Проценты: (S + (S - S/${months}) + (S - 2S/${months}) + ... + S/${months}) × r/100 = S × (${months + 1}/2) × r/100 = ${(
            (months + 1) /
            200
          ).toFixed(2)}S × r. Итого выплаты: S + ${((months + 1) / 200).toFixed(
            2
          )}S × r = ${totalPayment / amount}S ⇒ ${((months + 1) / 200).toFixed(
            2
          )} × r = ${totalPayment / amount - 1} ⇒ r = ${correct2}.`;
          setEgeTask({ correct: correct2, question: question2, solution: solution2 });
          break;
        case 'varying-payments':
          const annualPayment = Math.round(amount / years);
          const totalInterest =
            annualPayment * (rate / 100) * (years + 1) / 2;
          const totalPaymentVar = amount + totalInterest;
          const question3 = `В июле планируется взять кредит на сумму ${(amount / 1000000).toLocaleString(
            'ru-RU'
          )} млн рублей на ${years} ${getYearWord(years)} с ежегодным уменьшением долга. Условия возврата: каждый январь долг возрастает на ${rate}% по сравнению с концом предыдущего года; с февраля по июнь каждого года необходимо выплатить часть долга; в июле каждого года долг должен быть на одну и ту же сумму меньше долга на июль предыдущего года. Сколько рублей составит общая сумма выплат?`;
          const correct3 = Math.round(totalPaymentVar).toString();
          const solution3 = `Ежегодное уменьшение долга: ${amount} / ${years} = ${annualPayment} руб. Проценты: (${amount} + ${amount - annualPayment} + ${
            amount - 2 * annualPayment
          } + ... + ${annualPayment}) × ${rate / 100} = ${amount} × ${(
            (years + 1) /
            2
          )} × ${rate / 100} = ${totalInterest} руб. Общая сумма выплат: ${amount} + ${totalInterest} = ${Math.round(
            totalPaymentVar
          )} руб.`;
          setEgeTask({ correct: correct3, question: question3, solution: solution3 });
          break;
        case 'deposit-additions':
          const additions = Math.round((100000 + Math.random() * 400000) / 10000) * 10000;
          const finalAmount = Math.round(
            amount * Math.pow(1 + rate / 100, 5) +
              additions *
                (Math.pow(1 + rate / 100, 4) +
                  Math.pow(1 + rate / 100, 3) +
                  Math.pow(1 + rate / 100, 2) +
                  (1 + rate / 100))
          );
          const question4 = `В банк помещена сумма ${(amount / 1000000).toLocaleString(
            'ru-RU'
          )} млн рублей под ${rate}% годовых. В конце каждого из первых четырех лет хранения после начисления процентов вкладчик дополнительно вносил на счет ${additions.toLocaleString(
            'ru-RU'
          )} рублей. Какая сумма будет на счету к концу пятого года?`;
          const correct4 = finalAmount.toString();
          const solution4 = `Через 5 лет основная сумма составит: ${amount} × 1.${rate}^5 ≈ ${Math.round(
            amount * Math.pow(1 + rate / 100, 5)
          )} руб. Добавки с процентами: ${additions} × (1.${rate}^4 + 1.${rate}^3 + 1.${rate}^2 + 1.${rate}) ≈ ${Math.round(
            additions *
              (Math.pow(1 + rate / 100, 4) +
                Math.pow(1 + rate / 100, 3) +
                Math.pow(1 + rate / 100, 2) +
                (1 + rate / 100))
          )} руб. Итого: ${Math.round(
            amount * Math.pow(1 + rate / 100, 5)
          )} + ${Math.round(
            additions *
              (Math.pow(1 + rate / 100, 4) +
                Math.pow(1 + rate / 100, 3) +
                Math.pow(1 + rate / 100, 2) +
                (1 + rate / 100))
          )} ≈ ${finalAmount} руб.`;
          setEgeTask({ correct: correct4, question: question4, solution: solution4 });
          break;
      }
    }

    setAnsweredEge(false);
    setEgeAnswer('');
    setEgeAlert(false);
    setShowEgeResult(false);
  };

  // Check EGE answer
  const checkEgeAnswer = () => {
    if (answeredEge) {
      setEgeTask((prev) => ({
        ...prev,
        result: (
          <div className="flex items-start">
            <div className="mr-2">⚠️</div>
            <div>Вы уже ответили! Нажмите 'Новая задача'.</div>
          </div>
        ),
        type: 'warning',
      }));
      setShowEgeResult(true);
      return;
    }

    const userInput = egeAnswer.trim();
    if (!userInput) {
      setEgeAlert(true);
      return;
    }

    setAnsweredEge(true);
    setTotalTasks(totalTasks + 1);
    setEgeTasksCompleted(egeTasksCompleted + 1);

    const isCorrect = userInput === egeTask.correct;
    const pointsEarned = egeLevel === 'basic' ? 1 : 2;

    if (isCorrect) {
      setEgeTotalScore(egeTotalScore + pointsEarned);
      setEgeTask((prev) => ({
        ...prev,
        result: (
          <div className="flex items-start text-sm">
            <div className="mr-2 mt-1">✅</div>
            <div>
              <p className="font-bold text-green-400">Правильно! +{pointsEarned} балл{pointsEarned > 1 ? 'а' : ''}</p>
              <p className="mt-1">Ответ: <span className="font-mono">{prev.correct}</span></p>
              <details className="mt-1 text-gray-300">
                <summary className="cursor-pointer hover:text-white">
                  Показать решение
                </summary>
                <div className="mt-1 bg-gray-900/50 p-2 rounded">{prev.solution}</div>
              </details>
            </div>
          </div>
        ),
        type: 'success',
      }));
    } else {
      setEgeTask((prev) => ({
        ...prev,
        result: (
          <div className="flex items-start text-sm">
            <div className="mr-2 mt-1">❌</div>
            <div>
              <p className="font-bold text-red-400">Неправильно</p>
              <p className="mt-1">Правильный ответ: <span className="font-mono">{prev.correct}</span></p>
              <details className="mt-1 text-gray-300" open>
                <summary className="cursor-pointer hover:text-white">
                  Решение
                </summary>
                <div className="mt-1 bg-gray-900/50 p-2 rounded">{prev.solution}</div>
              </details>
            </div>
          </div>
        ),
        type: 'error',
      }));
    }

    setEgeAlert(false);
    setEgeAnswer('');
    setShowEgeResult(true);

    if (egeTasksCompleted + 1 >= 10) {
      setEgeTask((prev) => ({
        ...prev,
        result: (
          <div>
            {prev.result}
            <br />
            <br />
            <strong>Тест завершен!</strong> Вы набрали {egeTotalScore} баллов из{' '}
            {egeLevel === 'basic' ? 10 : 20} возможных.
          </div>
        ),
      }));
    }
  };

  // Update progress
  const updateProgress = () => {
    let totalCorrect = 0;
    let totalAnswers = 0;
    Object.entries({
      deposit: { score: depositScore, total: depositTotal },
      annuity: { score: annuityScore, total: annuityTotal },
      diff: { score: diffScore, total: diffTotal },
      invest: { score: investScore, total: investTotal },
      ege: { score: egeTotalScore, total: egeTasksCompleted },
    }).forEach(([key, val]) => {
      totalCorrect += val.score;
      totalAnswers += val.total;
    });

    const progressPercent = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;
    setProgress(progressPercent);
  };

  // Generate basic tasks on tab change
  useEffect(() => {
    if (currentTab === 'deposit') generateDepositTask();
    if (currentTab === 'annuity') generateAnnuityTask();
    if (currentTab === 'diff') generateDiffTask();
    if (currentTab === 'invest') generateInvestTask();
    if (currentTab === 'ege') generateEgeTask();
    if (currentTab === 'theory') return;
  }, [currentTab]);

  // Update progress when any score changes
  useEffect(() => {
    updateProgress();
  }, [score, totalTasks]);

  // Create animated background bubbles
  useEffect(() => {
    createBubbles();
    function createBubbles() {
      const container = bubblesContainerRef.current;
      if (!container) return;

      container.innerHTML = '';
      const colors = [
        'rgba(0, 242, 255, 0.1)',
        'rgba(180, 0, 255, 0.1)',
        'rgba(255, 0, 195, 0.1)',
      ];

      for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'neon-bubble';
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
  }, []);

  // Deposit state
  const [depositScore, setDepositScore] = useState(0);
  const [depositTotal, setDepositTotal] = useState(0);

  // Annuity state
  const [annuityScore, setAnnuityScore] = useState(0);
  const [annuityTotal, setAnnuityTotal] = useState(0);

  // Diff state
  const [diffScore, setDiffScore] = useState(0);
  const [diffTotal, setDiffTotal] = useState(0);

  // Invest state
  const [investScore, setInvestScore] = useState(0);
  const [investTotal, setInvestTotal] = useState(0);

  // EGE state
  const [egeScore, setEgeScore] = useState(0);
  const [egeTotal, setEgeTotal] = useState(0);

  return (
    <div className="antialiased">
      {/* Animated background bubbles */}
      <div id="bubbles-container" ref={bubblesContainerRef}></div>

      {/* Header */}
      <header className="relative overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30 opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 neon-text animate__animated animate__fadeInDown">
              Финансовый тренажёр
            </h1>
            <p className="text-xl text-white/80 animate__animated animate__fadeIn animate__delay-1s">
              Освойте проценты, вклады и кредиты на практике
            </p>
            <div className="mt-8 animate__animated animate__fadeIn animate__delay-2s">
              <div className="inline-block p-1 rounded-full bg-white/10 backdrop-blur-sm">
                <div className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  Подготовка к ЕГЭ
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-20">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="neon-card neon-border rounded-2xl overflow-hidden mb-8">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold glow-text">ФИНАНСОВЫЙ ТРЕНАЖЁР</h2>
              </div>

              {/* Level tabs */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setCurrentLevel('basic')}
                  className={`level-tab ${currentLevel === 'basic' ? 'active' : 'inactive'}`}
                >
                  Базовый уровень
                </button>
                <button
                  onClick={() => setCurrentLevel('advanced')}
                  className={`level-tab ${currentLevel === 'advanced' ? 'active' : 'inactive'}`}
                >
                  Повышенный уровень
                </button>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  onClick={() => setCurrentTab('deposit')}
                  className={`tab-btn ${currentTab === 'deposit' ? 'tab-active' : 'tab-inactive'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.11 0-2.08.402-2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 01-18 0 9 9 0 019-11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                  Вклады
                </button>
                <button
                  onClick={() => setCurrentTab('annuity')}
                  className={`tab-btn ${currentTab === 'annuity' ? 'tab-active' : 'tab-inactive'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                    />
                  </svg>
                  Аннуитетный кредит
                </button>
                <button
                  onClick={() => setCurrentTab('diff')}
                  className={`tab-btn ${currentTab === 'diff' ? 'tab-active' : 'tab-inactive'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  Дифференцированный кредит
                </button>
                <button
                  onClick={() => setCurrentTab('invest')}
                  className={`tab-btn ${currentTab === 'invest' ? 'tab-active' : 'tab-inactive'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Инвестиции
                </button>
                <button
                  onClick={() => setCurrentTab('ege')}
                  className={`tab-btn ${currentTab === 'ege' ? 'tab-active' : 'tab-inactive'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 013 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  ЕГЭ
                </button>
                <button
                  onClick={() => setCurrentTab('theory')}
                  className={`tab-btn ${currentTab === 'theory' ? 'tab-active' : 'tab-inactive'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253M3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Теория
                </button>
              </div>

              {/* Tab content */}
              <div id="deposit" className={`${currentTab === 'deposit' ? 'block' : 'hidden'}`}>
                <div className="bg-blue-900/20 rounded-xl p-6 mb-6 neon-border">
                  <div className="flex items-start">
                    <div className="bg-blue-900/30 p-3 rounded-lg mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-neon-blue"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.11 0-2.08.402-2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 01-18 0 9 9 0 01-8.618 3.04A12.02 12.02 0 013 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-neon-blue mb-3">
                        ЗАДАЧА НА ВКЛАДЫ
                      </h3>
                      <p id="deposit-question" className="mb-4 text-white/80">
                        {depositTask.question || ''}
                      </p>
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                        <div className="w-full md:w-auto flex-1">
                          <label className="block text-sm font-medium text-neon-blue mb-1">
                            Ваш ответ (руб.):
                          </label>
                          <input
                            type="number"
                            id="deposit-answer"
                            placeholder="Введите сумму"
                            value={depositAnswer}
                            onChange={(e) => setDepositAnswer(e.target.value)}
                            disabled={answeredDeposit}
                            className="w-full px-4 py-3 rounded-lg input-neon focus:outline-none focus:ring-2 focus:ring-neon-blue"
                          />
                          {depositAlert && (
                            <div className="hidden text-sm mt-1 text-neon-pink">
                              Пожалуйста, введите корректное число
                            </div>
                          )}
                        </div>
                        <button
                          onClick={checkDepositAnswer}
                          className="btn-neon px-6 py-3 rounded-lg neon-pulse"
                        >
                          Проверить ответ
                        </button>
                      </div>
                      {showDepositResult && (
                        <div
                          className={`mt-4 p-4 rounded-lg neon-border ${
                            depositTask.type === 'success'
                              ? 'bg-green-900/20 text-green-400'
                              : depositTask.type === 'error'
                              ? 'bg-red-900/20 text-red-400'
                              : 'bg-yellow-900/20 text-yellow-400'
                          }`}
                        >
                          {depositTask.result || ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={generateDepositTask}
                    className="btn-neon px-6 py-3 rounded-lg flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Новая задача
                  </button>
                  <div className="text-sm text-white/60 bg-black/30 px-4 py-2 rounded-full neon-border">
                    <span className="font-medium text-neon-blue">
                      {depositScore}
                    </span>{' '}
                    из <span className="font-medium">{depositTotal}</span> верно
                  </div>
                </div>
              </div>

              {/* Annuity tab */}
              <div id="annuity" className={`${currentTab === 'annuity' ? 'block' : 'hidden'}`}>
                <div className="bg-purple-900/20 rounded-xl p-6 mb-6 neon-border">
                  <div className="flex items-start">
                    <div className="bg-purple-900/30 p-3 rounded-lg mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-neon-purple"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-neon-purple mb-3">
                        ЗАДАЧА НА АННУИТЕТНЫЙ КРЕДИТ
                      </h3>
                      <p id="annuity-question" className="mb-4 text-white/80">
                        {annuityTask.question || ''}
                      </p>
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                        <div className="w-full md:w-auto flex-1">
                          <label className="block text-sm font-medium text-neon-purple mb-1">
                            Ваш ответ (руб.):
                          </label>
                          <input
                            type="number"
                            id="annuity-answer"
                            placeholder="Введите сумму"
                            value={annuityAnswer}
                            onChange={(e) => setAnnuityAnswer(e.target.value)}
                            disabled={answeredAnnuity}
                            className="w-full px-4 py-3 rounded-lg input-neon focus:outline-none focus:ring-2 focus:ring-neon-purple"
                          />
                          {annuityAlert && (
                            <div className="hidden text-sm mt-1 text-neon-pink">
                              Пожалуйста, введите корректное число
                            </div>
                          )}
                        </div>
                        <button
                          onClick={checkAnnuityAnswer}
                          className="btn-neon px-6 py-3 rounded-lg neon-pulse"
                        >
                          Проверить ответ
                        </button>
                      </div>
                      {showAnnuityResult && (
                        <div
                          className={`mt-4 p-4 rounded-lg neon-border ${
                            annuityTask.type === 'success'
                              ? 'bg-green-900/20 text-green-400'
                              : annuityTask.type === 'error'
                              ? 'bg-red-900/20 text-red-400'
                              : 'bg-yellow-900/20 text-yellow-400'
                          }`}
                        >
                          {annuityTask.result || ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={generateAnnuityTask}
                    className="btn-neon px-6 py-3 rounded-lg flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Новая задача
                  </button>
                  <div className="text-sm text-white/60 bg-black/30 px-4 py-2 rounded-full neon-border">
                    <span className="font-medium text-neon-purple">
                      {annuityScore}
                    </span>{' '}
                    из <span className="font-medium">{annuityTotal}</span> верно
                  </div>
                </div>
              </div>

              {/* Differentiated tab */}
              <div id="diff" className={`${currentTab === 'diff' ? 'block' : 'hidden'}`}>
                <div className="bg-indigo-900/20 rounded-xl p-6 mb-6 neon-border">
                  <div className="flex items-start">
                    <div className="bg-indigo-900/30 p-3 rounded-lg mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-neon-indigo"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-neon-indigo mb-3">
                        ЗАДАЧА НА ДИФФФЕРЕНЦИРОВАННЫЙ КРЕДИТ
                      </h3>
                      <p id="diff-question" className="mb-4 text-white/80">
                        {diffTask.question || ''}
                      </p>
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                        <div className="w-full md:w-auto flex-1">
                          <label className="block text-sm font-medium text-neon-indigo mb-1">
                            Ваш ответ (руб.):
                          </label>
                          <input
                            type="text"
                            id="diff-answer"
                            placeholder="Введите два числа через пробел"
                            value={diffAnswer}
                            onChange={(e) => setDiffAnswer(e.target.value)}
                            disabled={answeredDiff}
                            className="w-full px-4 py-3 rounded-lg input-neon focus:outline-none focus:ring-2 focus:ring-neon-indigo"
                          />
                          {diffAlert && (
                            <div className="hidden text-sm mt-1 text-neon-pink">
                              Пожалуйста, введите два числа через пробел
                            </div>
                          )}
                        </div>
                        <button
                          onClick={checkDiffAnswer}
                          className="btn-neon px-6 py-3 rounded-lg neon-pulse"
                        >
                          Проверить ответ
                        </button>
                      </div>
                      {showDiffResult && (
                        <div
                          className={`mt-4 p-4 rounded-lg neon-border ${
                            diffTask.type === 'success'
                              ? 'bg-green-900/20 text-green-400'
                              : diffTask.type === 'error'
                              ? 'bg-red-900/20 text-red-400'
                              : 'bg-yellow-900/20 text-yellow-400'
                          }`}
                        >
                          {diffTask.result || ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={generateDiffTask}
                    className="btn-neon px-6 py-3 rounded-lg flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Новая задача
                  </button>
                  <div className="text-sm text-white/60 bg-black/30 px-4 py-2 rounded-full neon-border">
                    <span className="font-medium text-neon-indigo">
                      {diffScore}
                    </span>{' '}
                    из <span className="font-medium">{diffTotal}</span> верно
                  </div>
                </div>
              </div>

              {/* Investment tab */}
              <div id="invest" className={`${currentTab === 'invest' ? 'block' : 'hidden'}`}>
                <div className="bg-green-900/20 rounded-xl p-6 mb-6 neon-border">
                  <div className="flex items-start">
                    <div className="bg-green-900/30 p-3 rounded-lg mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-neon-green"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-neon-green mb-3">
                        ЗАДАЧА НА ИНВЕСТИЦИИ
                      </h3>
                      <p id="invest-question" className="mb-4 text-white/80">
                        {investTask.question || ''}
                      </p>
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                        <div className="w-full md:w-auto flex-1">
                          <label className="block text-sm font-medium text-neon-green mb-1">
                            Ваш ответ (руб.):
                          </label>
                          <input
                            type="number"
                            id="invest-answer"
                            placeholder="Введите сумму"
                            value={investAnswer}
                            onChange={(e) => setInvestAnswer(e.target.value)}
                            disabled={answeredInvest}
                            className="w-full px-4 py-3 rounded-lg input-neon focus:outline-none focus:ring-2 focus:ring-neon-green"
                          />
                          {investAlert && (
                            <div className="hidden text-sm mt-1 text-neon-pink">
                              Пожалуйста, введите корректное число
                            </div>
                          )}
                        </div>
                        <button
                          onClick={checkInvestAnswer}
                          className="btn-neon px-6 py-3 rounded-lg neon-pulse"
                        >
                          Проверить ответ
                        </button>
                      </div>
                      {showInvestResult && (
                        <div
                          className={`mt-4 p-4 rounded-lg neon-border ${
                            investTask.type === 'success'
                              ? 'bg-green-900/20 text-green-400'
                              : investTask.type === 'error'
                              ? 'bg-red-900/20 text-red-400'
                              : 'bg-yellow-900/20 text-yellow-400'
                          }`}
                        >
                          {investTask.result || ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={generateInvestTask}
                    className="btn-neon px-6 py-3 rounded-lg flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Новая задача
                  </button>
                  <div className="text-sm text-white/60 bg-black/30 px-4 py-2 rounded-full neon-border">
                    <span className="font-medium text-neon-green">
                      {investScore}
                    </span>{' '}
                    из <span className="font-medium">{investTotal}</span> верно
                  </div>
                </div>
              </div>

              {/* EGE tab */}
              <div id="ege" className={`${currentTab === 'ege' ? 'block' : 'hidden'}`}>
                <div className="bg-red-900/20 rounded-xl p-6 mb-6 neon-border">
                  <div className="flex items-start">
                    <div className="bg-red-900/30 p-3 rounded-lg mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-red-500 mb-3">
                    ЗАДАЧА ДЛЯ ПОДГОТОВКИ К ЕГЭ
                  </h3>
                  <div className="flex mb-4">
                    <button
                      onClick={() => setEgeLevel('basic')}
                      id="ege-basic-btn"
                      className={`px-4 py-2 rounded-l-lg font-medium ${
                        egeLevel === 'basic'
                          ? 'bg-red-900/50 text-white border border-red-500'
                          : 'bg-gray-800/50 text-white/70 border border-gray-700'
                      }`}
                    >
                      Базовый уровень (№15)
                    </button>
                    <button
                      onClick={() => setEgeLevel('advanced')}
                      id="ege-advanced-btn"
                      className={`px-4 py-2 rounded-r-lg font-medium ${
                        egeLevel === 'advanced'
                          ? 'bg-red-900/50 text-white border border-red-500'
                          : 'bg-gray-800/50 text-white/70 border border-gray-700'
                      }`}
                    >
                      Повышенный уровень (№17)
                    </button>
                  </div>
                  <p id="ege-question" className="mb-4 text-white/80">
                    {egeTask.question || ''}
                  </p>
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                    <div className="w-full md:w-auto flex-1">
                      <label className="block text-sm font-medium text-red-500 mb-1">
                        Ваш ответ:
                      </label>
                      <input
                        type="text"
                        id="ege-answer"
                        placeholder="Введите ответ"
                        value={egeAnswer}
                        onChange={(e) => setEgeAnswer(e.target.value)}
                        disabled={answeredEge}
                        className="w-full px-4 py-3 rounded-lg input-neon focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      {egeAlert && (
                        <div id="ege-alert" className="hidden text-sm mt-1 text-neon-pink">
                          Пожалуйста, введите ответ
                        </div>
                      )}
                    </div>
                    <button
                      onClick={checkEgeAnswer}
                      className="btn-neon px-6 py-3 rounded-lg neon-pulse"
                    >
                      Проверить ответ
                    </button>
                  </div>
                  {showEgeResult && (
                    <div
                      id="ege-result"
                      className={`result-container hidden neon-border ${
                        egeTask.type === 'success'
                          ? 'bg-green-900/10 text-green-400'
                          : egeTask.type === 'error'
                          ? 'bg-red-900/10 text-red-400'
                          : 'bg-yellow-900/20 text-yellow-400'
                      }`}
                    >
                      {egeTask.result || ''}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={generateEgeTask}
                  id="ege-new-task-btn"
                  className="btn-neon px-6 py-3 rounded-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Новая задача
                </button>
                <div className="text-sm text-white/60 bg-black/30 px-4 py-2 rounded-full neon-border">
                  <span className="font-medium text-red-500">{egeTotalScore}</span> баллов |{' '}
                  <span className="font-medium text-red-500">{egeTasksCompleted}/10</span> задач
                </div>
              </div>
            </div>

            {/* Theory tab */}
            <div id="theory" className={`${currentTab === 'theory' ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="theory-card rounded-lg p-6 neon-border">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-900/30 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-neon-blue"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-neon-blue">
                      ПРОСТЫЕ ПРОЦЕНТЫ
                    </h3>
                  </div>
                  <p className="mb-3 text-white/80">
                    <span className="font-medium">Формула:</span>{' '}
                    <span className="formula">
                      S = P × (1 + r × t)
                    </span>
                  </p>
                  <p className="text-white/80 mb-4">
                    Где: S - итоговая сумма, P - начальная сумма, r - процентная ставка (в десятичной форме), t - время в годах.
                  </p>
                  <div className="bg-blue-900/20 p-4 rounded-lg neon-border">
                    <p className="font-medium text-neon-blue mb-2">
                      Пример:
                    </p>
                    <p className="text-white/80 mb-2">
                      Вклад 10 000 руб. под 5% годовых на 3 года без капитализации:
                    </p>
                    <p className="formula">
                      10 000 × (1 + 0.05 × 3) = 11 500 руб.
                    </p>
                  </div>
                </div>

                <div className="theory-card rounded-lg p-6 neon-border">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-900/30 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-neon-purple"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 11H5m14 0a2 2 0 002-2v6a2 2 0 00-2H5a2 2 0 00-2v-6a2 2 0 00-2-2H6a2 2 0 00-2v-2m0 0V5a2 2 0 00-2-2H6a2 2 0 00-2V5m0 0V21a2 2 0 00V5"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-neon-purple">
                      СЛОЖНЫЕ ПРОЦЕНТЫ
                    </h3>
                  </div>
                  <p className="mb-3 text-white/80">
                    <span className="font-medium">Формула:</span>{' '}
                    <span className="formula">
                      S = P × (1 + r)
                      <sup>t</sup>
                    </span>
                  </p>
                  <p className="text-white/80 mb-4">
                    При капитализации проценты начисляются на проценты, поэтому сумма растёт быстрее.
                  </p>
                  <div className="bg-purple-900/20 p-4 rounded-lg neon-border">
                    <p className="font-medium text-neon-purple mb-2">
                      Пример:
                    </p>
                    <p className="text-white/80 mb-2">
                      Вклад 10 000 руб. под 5% годовых на 3 года с капитализацией:
                    </p>
                    <p className="formula">
                      10 000 × (1 + 0.05)
                      <sup>3</sup> ≈ 11 576,25 руб.
                    </p>
                  </div>
                </div>

                <div className="theory-card rounded-lg p-6 neon-border">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-900/30 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-neon-blue"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.11 0-2.08.402-2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 01-18 0 9 9 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-neon-blue mb-3">
                      АННУИТЕТНЫЙ ПЛАТЁЖ
                    </h3>
                  </div>
                  <p className="mb-3 text-white/80">
                    <span className="font-medium">Формула:</span>{' '}
                    <span className="formula">
                      Платёж = (P × r × (1 + r)
                      <sup>n</sup>) / ((1 + r)
                      <sup>n</sup> - 1)
                    </span>
                  </p>
                  <p className="text-white/80 mb-4">
                    Где: P - сумма кредита, r - месячная ставка, n - количество месяцев.
                  </p>
                  <div className="bg-blue-900/20 p-4 rounded-lg neon-border">
                    <p className="font-medium text-neon-blue mb-2">Пример:</p>
                    <p className="text-white/80 mb-2">
                      Кредит 100 000 руб. на 1 год под 12% годовых:
                    </p>
                    <p className="text-white/80 mb-2">
                      Месячная ставка: 12%/12 = 1% = 0.01
                    </p>
                    <p className="formula">
                      Платёж = (100000×0.01×(1+0.01)
                      <sup>12</sup> / ((1+0.01)
                      <sup>12</sup> - 1) ≈ 8 885 руб.
                    </p>
                  </div>
                </div>

                <div className="theory-card rounded-lg p-6 neon-border">
                  <div className="flex items-center mb-4">
                    <div className="bg-pink-900/30 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-neon-pink"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7h8m0 0v8m0-8l-8-8-4 4-6 6"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-neon-pink">
                      ДИФФЕРЕНЦИРОВАННЫЙ ПЛАТЁЖ
                    </h3>
                  </div>
                  <p className="mb-3 text-white/80">
                    <span className="font-medium">Формула:</span>{' '}
                    <span className="formula">
                      Платёж = (P / n) + (P - (P/n)×(m-1)) × r
                    </span>
                  </p>
                  <p className="text-white/80 mb-4">
                    Где: n - общее число месяцев, m - текущий месяц, r - месячная ставка.
                  </p>
                  <div className="bg-pink-900/20 p-4 rounded-lg neon-border">
                    <p className="font-medium text-neon-pink mb-2">Пример:</p>
                    <p className="text-white/80 mb-2">
                      Кредит 100 000 руб. на 1 год под 12% годовых:
                    </p>
                    <p className="text-white/80 mb-2">
                      Основной платёж: 100000/12 ≈ 8 333 руб.
                    </p>
                    <p className="formula">
                      Первый платёж: 8 333 + (100000 × 0.01) ≈ 9 333 руб.
                    </p>
                    <p className="formula">
                      Последний платёж: 8 333 + (8 333 × 0.01) ≈ 8 416 руб.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white/80">
                  ВАШ ПРОГРЕСС ОБУЧЕНИЯ
                </h3>
                <span className="text-sm font-medium text-neon-blue">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
                <div
                  id="progress-bar"
                  className="h-3 rounded-full progress-gradient"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-white/50">
                <span>НАЧИНАЮЩИЙ</span>
                <span>ЭКСПЕРТ</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center">
        <div className="inline-block p-1 rounded-full bg-white/10 backdrop-blur-sm shadow-lg">
          <div className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 008.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <span>Финансовая грамотность — ключ к успеху!</span>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-white/50">© 2025 Финансовый тренажёр</p>
            </footer>
          </div>
        );
      };
      
      export default App;
      ```
