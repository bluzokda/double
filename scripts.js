// Проверяем, авторизован ли пользователь
const authData = JSON.parse(localStorage.getItem('auth')) || {};
if (!authData?.isAuthenticated) {
  window.location.href = 'login.html';
}

// Если пользователь - учитель, добавляем функционал
if (authData?.role === 'teacher') {
  document.addEventListener('DOMContentLoaded', function () {
    addTeacherFeatures();
  });
}

// Инициализация пузырей при загрузке
document.addEventListener('DOMContentLoaded', function () {
  createBubbles();
  generateDepositTask();
  setEgeLevel('basic');
});

// ================== Функции задач ==================

// Генерация задачи по вкладам
function generateDepositTask() {
  const principal = Math.floor(Math.random() * 100000) + 50000;
  const rate = (Math.random() * 5 + 3).toFixed(2);
  const years = Math.floor(Math.random() * 3) + 2;

  let correct;
  let question;

  if (Math.random() > 0.5) {
    correct = principal * (1 + rate / 100 * years);
    question = `Вы положили ${formatNumber(principal)} руб. под простые ${rate}% годовых на ${years} ${getYearWord(years)}. Сколько денег будет?`;
  } else {
    correct = principal * Math.pow(1 + rate / 100, years);
    question = `Вы положили ${formatNumber(principal)} руб. под сложные ${rate}% годовых на ${years} ${getYearWord(years)}. Сколько денег будет?`;
  }

  currentDepositTask = {
    question,
    correct: parseFloat(correct.toFixed(2))
  };

  const depositQuestion = document.getElementById('deposit-question');
  const depositAnswerInput = document.getElementById('deposit-answer');
  const depositResult = document.getElementById('deposit-result');
  const depositAlert = document.getElementById('deposit-alert');

  if (depositQuestion) depositQuestion.textContent = question;
  if (depositAnswerInput) {
    depositAnswerInput.value = '';
    depositAnswerInput.disabled = false;
  }
  if (depositResult) depositResult.classList.add('hidden');
  if (depositAlert) depositAlert.classList.add('hidden');

  answeredDeposit = false;
}

// Проверка ответа по вкладам
function checkDepositAnswer() {
  const alertDiv = document.getElementById('deposit-alert');
  const answerInput = document.getElementById('deposit-answer');
  const resultDiv = document.getElementById('deposit-result');

  if (!alertDiv || !answerInput || !resultDiv) {
    console.error("Элементы формы не найдены");
    return;
  }

  if (answeredDeposit) {
    resultDiv.textContent = "Вы уже ответили! Нажмите 'Новая задача'";
    resultDiv.className = 'result-container bg-yellow-900/20 text-yellow-400 neon-border';
    resultDiv.classList.remove('hidden');
    return;
  }

  const userInput = answerInput.value.trim();
  const userAnswer = parseFloat(userInput);

  if (isNaN(userAnswer)) {
    alertDiv.textContent = 'Пожалуйста, введите корректное число';
    alertDiv.classList.remove('hidden');
    return;
  }

  const roundedAnswer = Math.round(userAnswer * 100) / 100;
  const isCorrect = Math.abs(roundedAnswer - currentDepositTask.correct) < 0.01;

  if (isCorrect) {
    resultDiv.textContent = `✅ Правильно! Ответ: ${currentDepositTask.correct.toLocaleString('ru-RU')} руб.`;
    resultDiv.className = 'result-container bg-green-900/20 text-green-400 neon-border';
    score++;
  } else {
    resultDiv.textContent = `❌ Неправильно. Правильный ответ: ${currentDepositTask.correct.toLocaleString('ru-RU')} руб.`;
    resultDiv.className = 'result-container bg-red-900/20 text-red-400 neon-border';
  }

  resultDiv.classList.remove('hidden');
  answerInput.disabled = true;

  const scoreSpan = document.getElementById('deposit-score');
  const totalSpan = document.getElementById('deposit-total');

  if (scoreSpan) scoreSpan.textContent = parseInt(scoreSpan.textContent) + (isCorrect ? 1 : 0);
  if (totalSpan) totalSpan.textContent = parseInt(totalSpan.textContent) + 1;

  totalTasks++;
  answeredDeposit = true;

  updateProgress();

  // Сохраняем ответ в Supabase
  saveResponseToSupabase(
    'deposit',
    roundedAnswer,
    isCorrect,
    currentDepositTask.correct,
    currentDepositTask.question
  );
}

// ================== Вспомогательные функции ==================
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

// ================== Прогресс обучения ==================
function updateProgress() {
  const progressPercent = totalTasks > 0 ? Math.round((score / totalTasks) * 100) : 0;

  const progressBar = document.getElementById('progress-bar');
  const totalScore = document.getElementById('total-score');

  if (progressBar) progressBar.style.width = `${progressPercent}%`;
  if (totalScore) totalScore.textContent = `${progressPercent}%`;

  saveUserProgress(progressPercent, score, totalTasks);
}

async function saveUserProgress(progress, correctAnswers, totalAnswers) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const userId = user.id;

    const { error } = await supabase.from('user_progress').upsert({
      user_id: userId,
      progress,
      correct_answers: correctAnswers,
      total_answers: totalAnswers,
      last_updated: new Date().toISOString()
    });

    if (error) throw error;

    console.log('Прогресс пользователя успешно сохранён');
  } catch (err) {
    console.error('Ошибка сохранения прогресса:', err.message);
  }
}

// ================== Получение ID пользователя ==================
async function getUserId() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user.id;
  } catch (err) {
    console.error('Ошибка получения ID пользователя:', err.message);
    return null;
  }
}

// ================== Сохранение ответа в Supabase ==================
async function saveResponseToSupabase(taskType, userAnswer, isCorrect, correctAnswer, questionText) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return;

    const response = {
      block: taskType,
      user_answer: userAnswer.toString(),
      is_correct: isCorrect,
      correct_answer: correctAnswer.toString(),
      question_text: questionText,
      level: currentLevel,
      response_time: new Date().toISOString()
    };

    if (user) {
      response.user_id = user.id;
    }

    const { error } = await supabase.from('user_responses').insert([response]);

    if (error) throw error;

    console.log('Ответ пользователя успешно сохранён в Supabase');
  } catch (err) {
    console.error('Не удалось сохранить ответ в Supabase:', err.message);
  }
}

// ================== Добавление функционала учителя ==================
function addTeacherFeatures() {
  const tabsContainer = document.querySelector('.flex.flex-wrap.gap-3.mb-8');
  if (!tabsContainer) return;

  const teacherTab = document.createElement('button');
  teacherTab.className = 'tab-btn tab-inactive px-5 py-3 rounded-full font-medium flex items-center';
  teacherTab.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    Ответы учеников
  `;
  teacherTab.onclick = () => openTeacherView();

  tabsContainer.appendChild(teacherTab);
}

async function openTeacherView() {
  try {
    const { data, error } = await supabase
      .from('user_responses')
      .select('*')
      .order('response_time', { ascending: false });

    if (error) throw error;

    showTeacherModal(data);
  } catch (err) {
    console.error('Ошибка получения данных:', err.message);
    alert('Не удалось загрузить ответы учеников');
  }
}

function showTeacherModal(responses) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
  modal.innerHTML = `
    <div class="neon-card neon-border rounded-2xl overflow-hidden w-full max-w-4xl max-h-[80vh] flex flex-col">
      <div class="p-6 border-b border-white/10">
        <h2 class="text-2xl font-bold">Ответы учеников</h2>
        <button onclick="this.closest('div').remove()" class="absolute top-4 right-4 text-white/70 hover:text-white">
          ✕
        </button>
      </div>
      <div class="overflow-y-auto p-6 flex-grow">
        <table class="w-full text-left">
          <thead class="border-b border-white/20">
            <tr>
              <th class="py-3 pr-6">ID</th>
              <th class="py-3 pr-6">Тип задачи</th>
              <th class="py-3 pr-6">Вопрос</th>
              <th class="py-3 pr-6">Ответ ученика</th>
              <th class="py-3 pr-6">Правильный ответ</th>
              <th class="py-3">Время</th>
            </tr>
          </thead>
          <tbody id="responsesTableBody">
            ${responses.map(resp => `
              <tr class="border-b border-white/10">
                <td class="py-3 pr-6">${resp.user_id || 'Гость'}</td>
                <td class="py-3 pr-6">${resp.block}</td>
                <td class="py-3 pr-6 max-w-xs truncate">${resp.question_text}</td>
                <td class="py-3 pr-6">${resp.user_answer}</td>
                <td class="py-3 pr-6">${resp.correct_answer}</td>
                <td class="py-3">${new Date(resp.response_time).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

// ================== Анимированные пузыри на фоне ==================
function createBubbles() {
  const container = document.getElementById('bubbles-container');
  if (!container) return;

  container.innerHTML = '';
  const colors = ['rgba(0, 242, 255, 0.1)', 'rgba(180, 0, 255, 0.1)', 'rgba(255, 0, 195, 0.1)'];

  for (let i = 0; i < 20; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('neon-bubble');
    const size = Math.random() * 20 + 10;
    const posX = Math.random() * window.innerWidth;
    const posY = Math.random() * window.innerHeight;
    const duration = Math.random() * 10 + 5;
    const delay = Math.random() * 5;
    const angle = Math.random() * Math.PI * 2;
    const distance = 500 + Math.random() * 500;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    bubble.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${posX}px;
      top: ${posY}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      --tx: ${tx}px;
      --ty: ${ty}px;
    `;

    container.appendChild(bubble);
  }
}
