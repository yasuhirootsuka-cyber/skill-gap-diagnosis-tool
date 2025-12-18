// 状態管理
let currentQuestion = 0;
let answers = {};
let selectedCareer = '';
let currentSkills = {};
let targetSkills = {};
let skillResults = null;

// 質問定義
const questions = [
    {
        id: 1,
        question: "目指すキャリアの方向性は？",
        type: 'radio',
        options: [
            { text: "金融スペシャリスト", value: "finance" },
            { text: "コンサルタント", value: "consulting" },
            { text: "IT・エンジニア", value: "it" },
            { text: "事業会社の経営幹部", value: "general" }
        ]
    },
    {
        id: 2,
        question: "現在のあなたのスキルを5段階で評価してください",
        type: "skill_rating",
        isTarget: false
    },
    {
        id: 3,
        question: "目標ポジションで求められるスキルレベルは？",
        type: "skill_rating",
        isTarget: true
    }
];

// 診断開始
function startDiagnosis() {
    document.getElementById('page-start').classList.remove('active');
    document.getElementById('page-questions').classList.add('active');
    showQuestion(0);
}

// 質問表示
function showQuestion(index) {
    currentQuestion = index;
    const question = questions[index];
    const container = document.getElementById('questionContainer');
    
    let html = `<div class="question-container">
        <div class="question-title">Q${index + 1}. ${question.question}</div>`;
    
    if (question.type === 'skill_rating') {
        // スキル一覧を取得
        const skills = selectedCareer ? skillCategories[selectedCareer] : [];
        
        if (skills.length === 0) {
            html += '<p style="color: #e74c3c;">まずキャリアの方向性を選択してください。</p>';
        } else {
            // レベル定義の表示
            html += '<div class="level-guide">';
            html += '<h4>📊 レベル評価基準</h4>';
            html += '<div class="level-guide-items">';
            for (let level = 1; level <= 5; level++) {
                const def = skillLevelDefinitions[level];
                html += `<div class="level-guide-item">
                    <span class="level-number">${level}</span>
                    <span class="level-label">${def.label}</span>
                    <span class="level-desc">${def.description}</span>
                </div>`;
            }
            html += '</div></div>';
            
            html += '<div class="skill-rating">';
            skills.forEach((skill, i) => {
                const savedRating = question.isTarget ? targetSkills[skill] : currentSkills[skill];
                const criteria = skillEvaluationCriteria[selectedCareer] ? skillEvaluationCriteria[selectedCareer][skill] : null;
                
                html += `
                    <div class="skill-item">
                        <div class="skill-name">${skill}
                            ${criteria ? '<button class="skill-info-btn" onclick="toggleSkillInfo(event, ' + i + ')">?</button>' : ''}
                        </div>
                        ${criteria ? '<div class="skill-criteria" id="criteria_' + i + '" style="display: none;"></div>' : ''}
                        <div class="rating-buttons" id="rating_${i}">
                            ${[1, 2, 3, 4, 5].map(rating => {
                                const criteriaText = criteria && criteria[rating] ? criteria[rating] : '';
                                return `<button class="rating-btn ${savedRating === rating ? 'selected' : ''}" 
                                        onclick="setRating('${skill}', ${rating}, ${i}, ${question.isTarget})"
                                        title="${criteriaText}">
                                    ${rating}
                                </button>`;
                            }).join('')}
                        </div>
                    </div>`;
            });
            html += '</div>';
        }
    } else if (question.type === 'radio') {
        html += '<div class="options">';
        question.options.forEach((option, i) => {
            const checked = answers[question.id] === option.value ? 'checked' : '';
            const selected = answers[question.id] === option.value ? 'selected' : '';
            html += `
                <div class="option ${selected}" onclick="selectRadioOption(${question.id}, '${option.value}', this)">
                    <input type="radio" 
                           id="q${question.id}_${i}" 
                           name="q${question.id}" 
                           value="${option.value}"
                           ${checked}>
                    <label for="q${question.id}_${i}">${option.text}</label>
                </div>`;
        });
        html += '</div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    updateProgress();
    updateNavigationButtons();
}

// ラジオボタン選択
function selectRadioOption(questionId, value, element) {
    answers[questionId] = value;
    
    if (questionId === 1) {
        selectedCareer = value;
    }
    
    // 見た目の更新
    const options = element.parentElement.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    
    // ラジオボタン本体もチェック
    const radio = element.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
}

// スキル評価設定
function setRating(skill, rating, index, isTarget) {
    if (isTarget) {
        targetSkills[skill] = rating;
    } else {
        currentSkills[skill] = rating;
    }
    
    // ボタンの見た目を更新
    const buttons = document.querySelectorAll(`#rating_${index} .rating-btn`);
    buttons.forEach((btn, i) => {
        if (i + 1 === rating) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

// スキル基準情報の表示切り替え
function toggleSkillInfo(event, index) {
    event.preventDefault();
    event.stopPropagation();
    
    const criteriaDiv = document.getElementById(`criteria_${index}`);
    if (!criteriaDiv) return;
    
    if (criteriaDiv.style.display === 'none') {
        // 基準情報を表示
        const skills = selectedCareer ? skillCategories[selectedCareer] : [];
        const skill = skills[index];
        const criteria = skillEvaluationCriteria[selectedCareer] ? skillEvaluationCriteria[selectedCareer][skill] : null;
        
        if (criteria) {
            let html = '<div class="criteria-content">';
            html += `<h5>${skill}の評価基準</h5>`;
            for (let level = 1; level <= 5; level++) {
                html += `<div class="criteria-item">
                    <span class="criteria-level">Lv${level}</span>
                    <span class="criteria-text">${criteria[level]}</span>
                </div>`;
            }
            html += '</div>';
            criteriaDiv.innerHTML = html;
        }
        criteriaDiv.style.display = 'block';
    } else {
        criteriaDiv.style.display = 'none';
    }
}

// プログレスバー更新
function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `質問 ${currentQuestion + 1} / ${questions.length}`;
}

// ナビゲーションボタン更新
function updateNavigationButtons() {
    document.getElementById('prevBtn').disabled = currentQuestion === 0;
    
    const nextBtn = document.getElementById('nextBtn');
    if (currentQuestion === questions.length - 1) {
        nextBtn.textContent = '診断結果を見る';
    } else {
        nextBtn.textContent = '次へ';
    }
}

// 前の質問へ
function prevQuestion() {
    if (currentQuestion > 0) {
        showQuestion(currentQuestion - 1);
    }
}

// 次の質問へ
function nextQuestion() {
    // バリデーション
    if (!validateCurrentQuestion()) {
        return;
    }

    if (currentQuestion < questions.length - 1) {
        showQuestion(currentQuestion + 1);
    } else {
        // 質問完了後、直接結果表示
        calculateResults();
        showDetailedResults();
    }
}

// バリデーション
function validateCurrentQuestion() {
    const question = questions[currentQuestion];
    
    if (question.type === 'radio') {
        if (!answers[question.id]) {
            alert('選択肢を選んでください');
            return false;
        }
    } else if (question.type === 'skill_rating') {
        const skills = selectedCareer ? skillCategories[selectedCareer] : [];
        const targetObj = question.isTarget ? targetSkills : currentSkills;
        
        for (let skill of skills) {
            if (!targetObj[skill]) {
                alert('すべてのスキルを評価してください');
                return false;
            }
        }
    }
    
    return true;
}

// 結果計算
function calculateResults() {
    const skills = selectedCareer ? skillCategories[selectedCareer] : [];
    let totalCurrent = 0;
    let totalTarget = 0;
    let totalGap = 0;
    
    skills.forEach(skill => {
        const current = currentSkills[skill] || 0;
        const target = targetSkills[skill] || 0;
        totalCurrent += current;
        totalTarget += target;
        totalGap += Math.max(0, target - current);
    });
    
    const avgCurrent = totalCurrent / skills.length;
    const avgTarget = totalTarget / skills.length;
    const avgGap = totalGap / skills.length;
    
    skillResults = {
        avgCurrent: avgCurrent.toFixed(1),
        avgTarget: avgTarget.toFixed(1),
        avgGap: avgGap.toFixed(1),
        totalGap: totalGap,
        skills: skills,
        career: selectedCareer
    };
    
    console.log('Calculated results:', skillResults);
}

// プレビュー表示
// メール入力画面は削除されたため、showPreview, submitEmail, saveDiagnosticData は不要

// 詳細結果表示
function showDetailedResults() {
    const results = skillResults;
    const skills = results.skills;
    const career = results.career;
    
    // スキルギャップ分析
    const gaps = analyzeSkillGap(currentSkills, targetSkills, career);
    const overallLevel = calculateOverallLevel(currentSkills, career);
    const priorities = determineLearningPriority(gaps, career);
    
    // サマリーセクション表示
    displayReportSummary(results, career);
    
    // レーダーチャート作成
    createRadarChart(skills);
    
    // ギャップ分析の表示
    displayGapAnalysis(gaps);
    
    // 優先スキルの表示
    displayPrioritySkills(priorities);
    
    // 学習ロードマップの表示
    displayLearningRoadmap(priorities, career);
    
    // 学習方法の表示
    displayLearningMethods(priorities);
    
    // キャリアアドバイスの表示
    displayCareerAdvice(gaps, overallLevel, career);
    
    // マッチング求人の表示
    displayMatchingJobs(overallLevel, career);
    
    // 次のアクションの表示
    displayNextActions(results, career);
    
    // ページ切り替え
    document.getElementById('page-questions').classList.remove('active');
    document.getElementById('page-results').classList.add('active');
}

// レポートサマリー表示
function displayReportSummary(results, career) {
    const careerNames = {
        finance: '金融スペシャリスト',
        consulting: 'コンサルタント',
        it: 'IT・エンジニア',
        general: '事業会社の経営幹部'
    };
    
    document.getElementById('summaryCareer').textContent = careerNames[career] || career;
    document.getElementById('summaryCurrentLevel').textContent = `${results.avgCurrent} / 5.0`;
    document.getElementById('summaryTargetLevel').textContent = `${results.avgTarget} / 5.0`;
    document.getElementById('summaryGap').textContent = `${results.avgGap}レベル`;
    
    // サマリーメッセージを生成
    const message = generateDiagnosisMessage(
        parseFloat(results.avgCurrent),
        parseFloat(results.avgGap),
        career
    );
    document.getElementById('summaryMessage').textContent = message;
}

// レーダーチャート作成
function createRadarChart(skills) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    const currentData = skills.map(skill => currentSkills[skill] || 0);
    const targetData = skills.map(skill => targetSkills[skill] || 0);
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: skills,
            datasets: [
                {
                    label: '現在のスキル',
                    data: currentData,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
                },
                {
                    label: '目標スキルレベル',
                    data: targetData,
                    backgroundColor: 'rgba(67, 233, 123, 0.2)',
                    borderColor: 'rgba(67, 233, 123, 1)',
                    pointBackgroundColor: 'rgba(67, 233, 123, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(67, 233, 123, 1)'
                }
            ]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}

// ギャップ分析の表示
function displayGapAnalysis(gaps) {
    let gapHtml = '';
    
    gaps.forEach(item => {
        if (item.gap > 0) {
            gapHtml += `
                <div class="gap-item">
                    <h4>${item.skill}</h4>
                    <div class="gap-bars">
                        <div class="gap-bar">
                            <div class="gap-bar-label">現在: ${item.current}</div>
                            <div class="gap-bar-bg">
                                <div class="gap-bar-fill current" style="width: ${(item.current / 5) * 100}%"></div>
                            </div>
                        </div>
                        <div class="gap-bar">
                            <div class="gap-bar-label">目標: ${item.target}</div>
                            <div class="gap-bar-bg">
                                <div class="gap-bar-fill required" style="width: ${(item.target / 5) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                    <p style="color: #e74c3c; font-weight: 600; margin-top: 10px;">
                        ギャップ: ${item.gap} レベル
                    </p>
                </div>`;
        }
    });
    
    if (gapHtml === '') {
        gapHtml = '<p style="text-align: center; color: #27ae60; font-weight: 600;">すべてのスキルで目標レベルに到達しています！</p>';
    }
    
    document.getElementById('gapAnalysis').innerHTML = gapHtml;
}

// 優先スキルの表示
function displayPrioritySkills(priorities) {
    const topPriorities = priorities.slice(0, 3);
    
    if (topPriorities.length === 0) {
        document.getElementById('prioritySkills').innerHTML = '<li>すべてのスキルが目標レベルに達しています</li>';
        return;
    }
    
    const priorityHtml = topPriorities.map(item => 
        `<li>${item.skill}（ギャップ: ${item.gap}レベル、優先度: ${item.urgency.toFixed(1)}）</li>`
    ).join('');
    
    document.getElementById('prioritySkills').innerHTML = priorityHtml;
}

// 学習方法の表示
function displayLearningMethods(priorities) {
    const career = skillResults.career;
    const overallLevel = calculateOverallLevel(currentSkills, career);
    const advice = generateAdvice(analyzeSkillGap(currentSkills, targetSkills, career), overallLevel, career);
    
    // 一般的な学習方法
    const generalMethods = [
        'オンライン講座（Udemy、Courseraなど）で体系的に学習',
        '実務プロジェクトでの実践経験を積む',
        '業界セミナー・カンファレンスに参加して最新トレンドをキャッチアップ',
        'メンター・コーチングを受けて効率的にスキルアップ',
        '資格取得を目指して専門知識を深める'
    ];
    
    // 優先スキル別の具体的な学習方法を追加
    let specificMethods = [];
    if (priorities.length > 0) {
        const topSkill = priorities[0];
        specificMethods = topSkill.resources.slice(0, 3);
    }
    
    const allMethods = [...specificMethods, ...generalMethods].slice(0, 5);
    const methodsHtml = allMethods.map(m => `<li>${m}</li>`).join('');
    
    document.getElementById('learningMethods').innerHTML = methodsHtml;
}

// マッチング求人の表示
function displayMatchingJobs(overallLevel, career) {
    const matchingJobs = getMatchingJobs(overallLevel, career);
    
    if (matchingJobs.length === 0) {
        // デフォルトの求人を表示
        const defaultJobs = [
            '大手コンサルティングファーム（スキル研修充実・メンター制度あり）',
            '金融機関の専門職（OJTで実践的スキル習得可能）',
            'IT企業のプロジェクトリーダー（最新技術に触れられる環境）',
            '事業会社の経営企画（幅広いビジネススキルが身につく）'
        ];
        const jobsHtml = defaultJobs.map(j => `<li>${j}</li>`).join('');
        document.getElementById('matchingJobs').innerHTML = jobsHtml;
    } else {
        const jobsHtml = matchingJobs.map(job => 
            `<li><strong>${job.title}</strong><br>${job.description}</li>`
        ).join('');
        document.getElementById('matchingJobs').innerHTML = jobsHtml;
    }
}

// 学習ロードマップの表示
function displayLearningRoadmap(priorities, career) {
    if (priorities.length === 0) {
        document.getElementById('learningRoadmap').innerHTML = '<p style="text-align: center; color: #27ae60;">すべてのスキルが目標レベルに達しています！</p>';
        return;
    }
    
    let roadmapHtml = '';
    const topPriorities = priorities.slice(0, 3);
    
    topPriorities.forEach((priority, index) => {
        const skill = priority.skill;
        const gap = priority.gap;
        const resources = priority.resources || [];
        
        roadmapHtml += `
            <div class="learning-roadmap-item">
                <h5>📌 優先度${index + 1}: ${skill}（ギャップ: ${gap}レベル）</h5>
                <div class="learning-timeline">`;
        
        // 学習ステップを生成
        if (gap >= 3) {
            roadmapHtml += `
                <div class="timeline-step">
                    <div class="timeline-marker">1</div>
                    <div class="timeline-content">
                        <div class="timeline-title">基礎固め（1〜3ヶ月）</div>
                        <div class="timeline-desc">${resources[0] || 'オンライン講座で基礎を学習'}</div>
                    </div>
                </div>
                <div class="timeline-step">
                    <div class="timeline-marker">2</div>
                    <div class="timeline-content">
                        <div class="timeline-title">実践経験（3〜6ヶ月）</div>
                        <div class="timeline-desc">${resources[1] || '実務プロジェクトで経験を積む'}</div>
                    </div>
                </div>
                <div class="timeline-step">
                    <div class="timeline-marker">3</div>
                    <div class="timeline-content">
                        <div class="timeline-title">スキル定着（6ヶ月以降）</div>
                        <div class="timeline-desc">${resources[2] || '継続的な実践と応用'}</div>
                    </div>
                </div>`;
        } else if (gap >= 2) {
            roadmapHtml += `
                <div class="timeline-step">
                    <div class="timeline-marker">1</div>
                    <div class="timeline-content">
                        <div class="timeline-title">スキル強化（1〜2ヶ月）</div>
                        <div class="timeline-desc">${resources[0] || '専門的な学習と実践'}</div>
                    </div>
                </div>
                <div class="timeline-step">
                    <div class="timeline-marker">2</div>
                    <div class="timeline-content">
                        <div class="timeline-title">応用力向上（2〜4ヶ月）</div>
                        <div class="timeline-desc">${resources[1] || '複雑な課題への挑戦'}</div>
                    </div>
                </div>`;
        } else {
            roadmapHtml += `
                <div class="timeline-step">
                    <div class="timeline-marker">1</div>
                    <div class="timeline-content">
                        <div class="timeline-title">短期集中（1ヶ月）</div>
                        <div class="timeline-desc">${resources[0] || 'ピンポイントでスキルアップ'}</div>
                    </div>
                </div>`;
        }
        
        roadmapHtml += `
                </div>
            </div>`;
    });
    
    document.getElementById('learningRoadmap').innerHTML = roadmapHtml;
}

// キャリアアドバイスの表示
function displayCareerAdvice(gaps, overallLevel, career) {
    const advice = generateAdvice(gaps, overallLevel, career);
    const adviceHtml = advice.map(item => `<p>• ${item}</p>`).join('');
    document.getElementById('careerAdvice').innerHTML = adviceHtml;
}

// 次のアクションの表示
function displayNextActions(results, career) {
    const gap = parseFloat(results.avgGap);
    let actions = [];
    
    if (gap > 2.0) {
        actions = [
            '<strong>今すぐ始めるべきこと：</strong>',
            '1. 最も重要なスキルから学習を開始する',
            '2. オンライン講座や書籍で基礎知識を固める',
            '3. 小規模なプロジェクトで実践経験を積む',
            '4. 3ヶ月後に再度スキル診断を行い、進捗を確認する'
        ];
    } else if (gap > 1.0) {
        actions = [
            '<strong>ステップアップのために：</strong>',
            '1. 実務での応用力を高める',
            '2. より高度なプロジェクトに挑戦する',
            '3. 専門資格の取得を検討する',
            '4. 業界のネットワーキングイベントに参加する'
        ];
    } else {
        actions = [
            '<strong>さらなる成長のために：</strong>',
            '1. リーダーシップやマネジメントスキルを磨く',
            '2. 他者への指導・メンタリングに挑戦する',
            '3. 業界でのプレゼンスを高める活動をする',
            '4. より高いポジションへの転職を検討する'
        ];
    }
    
    // キャリア別の具体的なアクション追加
    if (career === 'finance') {
        actions.push('5. 金融資格（CFA、FRM等）の取得計画を立てる');
    } else if (career === 'consulting') {
        actions.push('5. ケーススタディコンペティションに参加する');
    } else if (career === 'it') {
        actions.push('5. 最新技術のハッカソンやOSS活動に参加する');
    } else if (career === 'general') {
        actions.push('5. MBA取得や経営塾への参加を検討する');
    }
    
    const actionsHtml = actions.map(item => `<p>${item}</p>`).join('');
    document.getElementById('nextActions').innerHTML = actionsHtml;
}

// PDFダウンロード機能
function downloadPDF() {
    // ブラウザの印刷ダイアログを開く
    // ユーザーは「PDFとして保存」を選択できる
    
    // 案内メッセージ
    const message = `
📄 PDFダウンロード方法

1. 印刷ダイアログが開きます
2. 「送信先」または「プリンター」で「PDFに保存」を選択
3. 「保存」をクリック

※ Chromeの場合：送信先 → PDFに保存
※ Safariの場合：PDFとして保存
※ Edgeの場合：Microsoft Print to PDF
    `.trim();
    
    // 確認ダイアログ
    if (confirm(message + '\n\nOKを押すと印刷ダイアログが開きます。')) {
        // 印刷ダイアログを開く
        window.print();
    }
}

// 進捗更新関数
function updateProgress(percent) {
    const progressBar = document.getElementById('pdfProgress');
    if (progressBar) {
        progressBar.style.width = percent + '%';
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('スキルギャップ診断 initialized');
});
