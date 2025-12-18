// スキル評価レベルの定義
const skillLevelDefinitions = {
    1: { label: '初級', description: '基本的な知識がある・学習中' },
    2: { label: '初級+', description: '基本を理解し、指導のもとで実践できる' },
    3: { label: '中級', description: '独力で実務をこなせる・一般的なタスクは問題なし' },
    4: { label: '上級', description: '専門的知識があり、他者を指導できる' },
    5: { label: 'エキスパート', description: '業界トップレベル・組織を牽引できる' }
};

// スキルカテゴリー定義
const skillCategories = {
    finance: ['財務分析', 'バリュエーション', '会計知識', 'リスク管理', '金融商品知識'],
    consulting: ['戦略立案', '問題解決', 'プロジェクトマネジメント', 'データ分析', 'プレゼンテーション'],
    it: ['プログラミング', 'システム設計', 'データベース', 'クラウド技術', 'セキュリティ'],
    general: ['リーダーシップ', 'コミュニケーション', '論理的思考', '英語力', 'ビジネス理解']
};

// スキル別の評価基準（具体例）
const skillEvaluationCriteria = {
    finance: {
        '財務分析': {
            1: '財務諸表の基本項目を理解している',
            2: '簡単な財務比率分析ができる',
            3: '企業の財務状況を独力で分析できる',
            4: 'DCF法などの高度な分析手法を使いこなせる',
            5: '業界トップ企業の財務戦略を評価・助言できる'
        },
        'バリュエーション': {
            1: '企業価値評価の基本概念を知っている',
            2: 'マルチプル法の基本を理解している',
            3: 'DCF法を用いた企業価値評価ができる',
            4: '複雑なM&A案件の評価を主導できる',
            5: '業界標準となる評価モデルを構築できる'
        },
        '会計知識': {
            1: '簿記3級レベルの知識がある',
            2: '財務三表の関係性を理解している',
            3: 'IFRSなど国際基準を実務で活用できる',
            4: '複雑な会計処理の判断ができる',
            5: '会計基準の策定に関与できるレベル'
        },
        'リスク管理': {
            1: 'リスクの種類と基本概念を知っている',
            2: '基本的なリスク指標を理解している',
            3: 'VaRなどのリスク評価手法を使える',
            4: 'リスク管理体制の構築・運用ができる',
            5: '組織全体のリスク戦略を策定できる'
        },
        '金融商品知識': {
            1: '株式・債券の基本を理解している',
            2: 'デリバティブの基本的な仕組みを知っている',
            3: '複雑な金融商品の設計・評価ができる',
            4: '新しい金融商品を開発できる',
            5: '市場に影響を与える金融イノベーションを主導できる'
        }
    },
    consulting: {
        '戦略立案': {
            1: 'ビジネスフレームワークの基本を知っている',
            2: '既存の戦略を理解し説明できる',
            3: '部門レベルの戦略を立案できる',
            4: '全社戦略の立案をリードできる',
            5: '業界を変革する戦略を描ける'
        },
        '問題解決': {
            1: 'ロジカルシンキングの基本を知っている',
            2: '構造化して問題を整理できる',
            3: '複雑な課題を分解し解決策を提案できる',
            4: '組織横断的な課題解決をリードできる',
            5: '前例のない難題に革新的解決策を生み出せる'
        },
        'プロジェクトマネジメント': {
            1: 'PMの基本用語と概念を理解している',
            2: '小規模プロジェクトのメンバーとして貢献できる',
            3: 'プロジェクト全体の管理・推進ができる',
            4: '複数の大規模プロジェクトを統括できる',
            5: '組織のPM標準を確立し、PMOを率いられる'
        },
        'データ分析': {
            1: 'Excel等で基本的な集計ができる',
            2: 'SQL、統計の基礎を使える',
            3: 'Python/Rで高度な分析ができる',
            4: '機械学習モデルを構築し実務適用できる',
            5: 'AI/データサイエンス戦略を主導できる'
        },
        'プレゼンテーション': {
            1: '基本的な資料作成ができる',
            2: '明確に情報を伝えられる',
            3: '説得力のあるストーリーを構築できる',
            4: '経営層への提案で意思決定を動かせる',
            5: '大規模な講演で聴衆を魅了できる'
        }
    },
    it: {
        'プログラミング': {
            1: '基本的な文法を理解している',
            2: '簡単なプログラムを書ける',
            3: '実務で品質の高いコードを書ける',
            4: 'アーキテクチャ設計とコードレビューができる',
            5: '技術コミュニティをリードし、業界標準を作れる'
        },
        'システム設計': {
            1: 'システム構成の基本を理解している',
            2: '小規模システムの設計に参加できる',
            3: 'エンドツーエンドのシステム設計ができる',
            4: '大規模分散システムを設計できる',
            5: '業界を代表するアーキテクチャを生み出せる'
        },
        'データベース': {
            1: 'SQL基本文を書ける',
            2: 'テーブル設計とクエリ最適化の基本がわかる',
            3: 'DB設計・パフォーマンスチューニングができる',
            4: '大規模DBの運用・最適化を主導できる',
            5: 'DB技術の研究開発・新製品開発ができる'
        },
        'クラウド技術': {
            1: 'クラウドの基本概念を理解している',
            2: 'AWS/Azure等の基本サービスを使える',
            3: 'クラウドネイティブなシステムを構築できる',
            4: 'マルチクラウド戦略を設計・実装できる',
            5: 'クラウドアーキテクチャの業界標準を確立できる'
        },
        'セキュリティ': {
            1: 'セキュリティの基本概念を知っている',
            2: '基本的な脆弱性対策ができる',
            3: 'セキュアな設計・実装ができる',
            4: 'セキュリティ監査・ペネトレーションテストができる',
            5: '組織のセキュリティ戦略を統括できる'
        }
    },
    general: {
        'リーダーシップ': {
            1: 'チームの一員として協力できる',
            2: '小規模チームをまとめられる',
            3: '部門を率いて成果を出せる',
            4: '組織変革をリードできる',
            5: '業界・社会に影響を与えるリーダーシップを発揮できる'
        },
        'コミュニケーション': {
            1: '基本的な報告・連絡・相談ができる',
            2: 'チーム内で円滑に意思疎通できる',
            3: '多様なステークホルダーと効果的に対話できる',
            4: '複雑な利害調整をファシリテートできる',
            5: '組織内外で影響力を持ち、変革を推進できる'
        },
        '論理的思考': {
            1: '物事を整理して考えられる',
            2: 'フレームワークを使って分析できる',
            3: '複雑な問題を構造化して解決できる',
            4: '新しい思考モデルを構築できる',
            5: '業界の思考様式を変える洞察を生み出せる'
        },
        '英語力': {
            1: '基本的な読み書きができる（TOEIC 500-600）',
            2: 'ビジネスメールや簡単な会議ができる（TOEIC 700-800）',
            3: '英語で業務を問題なく遂行できる（TOEIC 850-900）',
            4: 'ネイティブレベルで交渉・プレゼンできる（TOEIC 950+）',
            5: 'グローバルで影響力を持つコミュニケーションができる'
        },
        'ビジネス理解': {
            1: '自社のビジネスモデルを理解している',
            2: '業界動向と競合を把握している',
            3: '事業戦略を立案・実行できる',
            4: '新規事業を立ち上げ成功させられる',
            5: '業界を変革するビジネスモデルを創造できる'
        }
    }
};

// キャリアパス定義
const careerPaths = {
    finance: {
        name: '金融スペシャリスト',
        description: '金融業界での専門性を高め、高度な金融知識とスキルを活かすキャリア',
        targetLevel: 4.0,
        requiredSkills: {
            '財務分析': 5,
            'バリュエーション': 5,
            '会計知識': 4,
            'リスク管理': 4,
            '金融商品知識': 5
        }
    },
    consulting: {
        name: 'コンサルタント',
        description: '企業の課題解決をリードし、戦略立案から実行支援まで担うキャリア',
        targetLevel: 4.2,
        requiredSkills: {
            '戦略立案': 5,
            '問題解決': 5,
            'プロジェクトマネジメント': 4,
            'データ分析': 4,
            'プレゼンテーション': 5
        }
    },
    it: {
        name: 'IT・エンジニア',
        description: '最新技術を活用したシステム開発・設計のプロフェッショナル',
        targetLevel: 4.0,
        requiredSkills: {
            'プログラミング': 5,
            'システム設計': 5,
            'データベース': 4,
            'クラウド技術': 4,
            'セキュリティ': 4
        }
    },
    general: {
        name: '事業会社の経営幹部',
        description: '幅広いビジネススキルで組織をリードする経営層を目指すキャリア',
        targetLevel: 4.5,
        requiredSkills: {
            'リーダーシップ': 5,
            'コミュニケーション': 5,
            '論理的思考': 4,
            '英語力': 4,
            'ビジネス理解': 5
        }
    }
};

// 学習リソース定義
const learningResources = {
    finance: {
        '財務分析': [
            'CFA（公認証券アナリスト）資格取得プログラム',
            'グロービス「ファイナンス基礎」オンライン講座',
            '実務でのM&A案件への参画'
        ],
        'バリュエーション': [
            'DCF法・マルチプル法の実践トレーニング',
            'Bloomberg・Refinitivなどのツール習得',
            '企業価値評価の実務経験'
        ],
        '会計知識': [
            '公認会計士試験科目の学習',
            'IFRS（国際会計基準）の理解',
            '財務諸表分析の実践'
        ],
        'リスク管理': [
            'FRM（金融リスクマネージャー）資格',
            'リスク管理システムの構築経験',
            'ストレステスト・シナリオ分析の実施'
        ],
        '金融商品知識': [
            'デリバティブ取引の実務経験',
            '証券外務員資格の取得',
            '最新金融商品のリサーチ'
        ]
    },
    consulting: {
        '戦略立案': [
            'MBA取得またはビジネススクール受講',
            '戦略コンサルティングファームでの実務',
            'ケーススタディの徹底的な練習'
        ],
        '問題解決': [
            'ロジカルシンキング研修',
            'イシューツリー・MECE法の実践',
            '複雑な課題解決プロジェクトへの参画'
        ],
        'プロジェクトマネジメント': [
            'PMP（プロジェクトマネジメントプロフェッショナル）資格',
            '大規模プロジェクトのリード経験',
            'アジャイル・スクラム手法の習得'
        ],
        'データ分析': [
            'Python・R言語でのデータ分析スキル',
            'SQL・Tableau等のツール習得',
            'ビッグデータ分析プロジェクトへの参加'
        ],
        'プレゼンテーション': [
            'エグゼクティブプレゼンテーション研修',
            'ストーリーテリング技法の習得',
            '経営層への提案経験'
        ]
    },
    it: {
        'プログラミング': [
            '最新言語・フレームワークの習得',
            'LeetCode・競技プログラミングでの練習',
            'オープンソースプロジェクトへの貢献'
        ],
        'システム設計': [
            'マイクロサービスアーキテクチャの実践',
            'デザインパターンの理解と適用',
            '大規模システムの設計経験'
        ],
        'データベース': [
            'データベーススペシャリスト資格',
            'NoSQL・NewSQL技術の習得',
            'データベース最適化の実務経験'
        ],
        'クラウド技術': [
            'AWS・Azure・GCP認定資格',
            'クラウドネイティブアーキテクチャの構築',
            'Infrastructure as Codeの実践'
        ],
        'セキュリティ': [
            '情報処理安全確保支援士資格',
            'ペネトレーションテストの実施',
            'セキュアコーディングの習得'
        ]
    },
    general: {
        'リーダーシップ': [
            'エグゼクティブコーチングの受講',
            'チームマネジメント経験の蓄積',
            '組織変革プロジェクトのリード'
        ],
        'コミュニケーション': [
            'ファシリテーション研修',
            'ステークホルダーマネジメントの実践',
            'クロスファンクショナルチームでの協業'
        ],
        '論理的思考': [
            'ビジネスフレームワークの活用',
            'クリティカルシンキング研修',
            '複雑な意思決定の経験'
        ],
        '英語力': [
            'ビジネス英語研修・TOEIC 900点以上',
            'グローバルプロジェクトへの参加',
            '海外拠点での勤務経験'
        ],
        'ビジネス理解': [
            'MBA取得または経営戦略講座',
            '事業計画の策定経験',
            '複数事業部門での経験'
        ]
    }
};

// 求人マッチング情報
const jobRecommendations = {
    finance: [
        {
            title: '外資系投資銀行 M&Aアドバイザリー',
            description: '高度な財務分析・バリュエーションスキルを活かせるポジション',
            requiredLevel: 4.2
        },
        {
            title: 'プライベートエクイティファンド 投資担当',
            description: '企業価値評価とリスク管理の専門性が求められる',
            requiredLevel: 4.0
        },
        {
            title: '金融コンサルティングファーム シニアコンサルタント',
            description: '金融機関の課題解決をリードする役割',
            requiredLevel: 3.8
        }
    ],
    consulting: [
        {
            title: '戦略コンサルティングファーム コンサルタント',
            description: '経営戦略立案から実行支援まで幅広く担当',
            requiredLevel: 4.3
        },
        {
            title: 'ITコンサルティング プロジェクトマネージャー',
            description: 'DX推進プロジェクトをリード',
            requiredLevel: 4.0
        },
        {
            title: '組織・人事コンサルタント',
            description: '組織変革・人材育成の専門家',
            requiredLevel: 3.8
        }
    ],
    it: [
        {
            title: 'テックカンパニー シニアエンジニア',
            description: '最新技術を活用したサービス開発',
            requiredLevel: 4.2
        },
        {
            title: 'クラウドアーキテクト',
            description: '大規模システムのクラウド移行・設計',
            requiredLevel: 4.0
        },
        {
            title: 'テックリード・エンジニアリングマネージャー',
            description: '技術戦略立案とチームマネジメント',
            requiredLevel: 4.5
        }
    ],
    general: [
        {
            title: '事業会社 経営企画マネージャー',
            description: '中長期戦略立案と事業推進',
            requiredLevel: 4.3
        },
        {
            title: 'スタートアップ COO候補',
            description: '事業全体の運営と組織づくり',
            requiredLevel: 4.5
        },
        {
            title: '大手企業 新規事業開発責任者',
            description: 'ゼロイチでの事業立ち上げ',
            requiredLevel: 4.2
        }
    ]
};

// スキルギャップ分析
function analyzeSkillGap(currentSkills, targetSkills, career) {
    const skills = skillCategories[career];
    const gaps = [];
    
    skills.forEach(skill => {
        const current = currentSkills[skill] || 0;
        const target = targetSkills[skill] || 0;
        const gap = target - current;
        
        gaps.push({
            skill: skill,
            current: current,
            target: target,
            gap: gap,
            gapPercentage: target > 0 ? (gap / target) * 100 : 0
        });
    });
    
    // ギャップが大きい順にソート
    gaps.sort((a, b) => b.gap - a.gap);
    
    return gaps;
}

// 総合スキルレベル計算
function calculateOverallLevel(skills, career) {
    const skillList = skillCategories[career];
    let total = 0;
    let count = 0;
    
    skillList.forEach(skill => {
        if (skills[skill]) {
            total += skills[skill];
            count++;
        }
    });
    
    return count > 0 ? total / count : 0;
}

// 学習優先度の決定
function determineLearningPriority(gaps, career) {
    const careerPath = careerPaths[career];
    const priorities = [];
    
    gaps.forEach(gap => {
        if (gap.gap > 0) {
            const requiredLevel = careerPath.requiredSkills[gap.skill] || 4;
            const urgency = gap.gap * (requiredLevel / 5); // 重要度を加味した緊急度
            
            priorities.push({
                skill: gap.skill,
                gap: gap.gap,
                urgency: urgency,
                resources: learningResources[career][gap.skill] || []
            });
        }
    });
    
    // 緊急度の高い順にソート
    priorities.sort((a, b) => b.urgency - a.urgency);
    
    return priorities;
}

// マッチング求人の取得
function getMatchingJobs(overallLevel, career) {
    const jobs = jobRecommendations[career] || [];
    
    return jobs.filter(job => {
        // 現在のレベルの±0.5の範囲内の求人を表示
        return Math.abs(job.requiredLevel - overallLevel) <= 0.5;
    });
}

// キャリアパス別の診断完了メッセージ
const careerDiagnosisMessages = {
    finance: {
        high: {
            excellent: '素晴らしい！金融スペシャリストとして即戦力レベルのスキルをお持ちです',
            good: '金融スペシャリストとして高いスキルレベルに到達しています',
            almostThere: '金融スペシャリストへの道が見えています。あと一歩です'
        },
        medium: {
            excellent: '金融分野での実務スキルは十分です。専門性を深めましょう',
            good: '金融スキルの基礎は固まっています。実践経験を積む段階です',
            almostThere: '金融分野でのキャリアに向けて、着実にスキルを積み上げていきましょう'
        },
        low: {
            excellent: '金融の基礎を学び始めています。計画的な学習で成長できます',
            good: '金融スペシャリストを目指すスタート地点です。体系的な学習が必要です',
            almostThere: '金融知識の習得から始めましょう。資格取得も視野に入れると良いでしょう'
        }
    },
    consulting: {
        high: {
            excellent: '素晴らしい！コンサルタントとしてトップレベルのスキルを持っています',
            good: 'コンサルタントとして高度な問題解決能力をお持ちです',
            almostThere: 'コンサルタントとして活躍できるレベルに近づいています'
        },
        medium: {
            excellent: 'コンサルティングの実務スキルは十分です。専門領域を確立しましょう',
            good: 'コンサルタントとしての基本スキルは身についています',
            almostThere: 'コンサルティング分野でのキャリアに向けて順調に成長しています'
        },
        low: {
            excellent: 'コンサルタントを目指す基礎ができています。ケーススタディから始めましょう',
            good: 'コンサルティングスキルの習得はこれからです。論理的思考力を磨きましょう',
            almostThere: 'コンサルタントへの道のりは長いですが、計画的な学習で到達できます'
        }
    },
    it: {
        high: {
            excellent: '素晴らしい！ITエンジニアとしてエキスパートレベルのスキルです',
            good: 'ITエンジニアとして高度な技術力をお持ちです',
            almostThere: 'ITエンジニアとしてシニアレベルに到達しつつあります'
        },
        medium: {
            excellent: 'ITエンジニアとして実務レベルのスキルは十分です',
            good: 'IT技術の基礎は固まっています。実装経験を積む段階です',
            almostThere: 'ITエンジニアとして着実にスキルを伸ばしています'
        },
        low: {
            excellent: 'IT技術の学習を始めています。基礎固めに集中しましょう',
            good: 'ITエンジニアを目指すスタート地点です。プログラミング学習から始めましょう',
            almostThere: 'IT技術の習得には時間がかかりますが、継続的な学習が重要です'
        }
    },
    general: {
        high: {
            excellent: '素晴らしい！経営幹部として十分なスキルとリーダーシップをお持ちです',
            good: '経営幹部候補として高い能力を持っています',
            almostThere: '経営層を目指せるレベルに近づいています'
        },
        medium: {
            excellent: 'マネージャーとして十分なスキルがあります。経営視点を磨きましょう',
            good: 'ビジネススキルの基礎は固まっています。リーダーシップを強化しましょう',
            almostThere: '経営幹部を目指して、幅広いスキルを積み上げています'
        },
        low: {
            excellent: 'ビジネスの基礎を学んでいます。実務経験を積みましょう',
            good: '経営幹部を目指すにはまだ経験が必要です。多様な業務に挑戦しましょう',
            almostThere: '経営スキルの習得は長期戦です。計画的にキャリアを積み上げましょう'
        }
    }
};

// 診断完了メッセージの生成
function generateDiagnosisMessage(avgCurrent, avgGap, career) {
    console.log('generateDiagnosisMessage called with:', { avgCurrent, avgGap, career });
    
    const messages = careerDiagnosisMessages[career];
    console.log('Messages for career:', messages);
    
    if (!messages) {
        console.warn('No messages found for career:', career);
        return '診断が完了しました。';
    }
    
    // スキルレベルの判定
    let levelKey;
    if (avgCurrent >= 4) {
        levelKey = 'high';
    } else if (avgCurrent >= 3) {
        levelKey = 'medium';
    } else {
        levelKey = 'low';
    }
    
    // ギャップの判定
    let gapKey;
    if (avgGap <= 0.5) {
        gapKey = 'excellent';
    } else if (avgGap <= 1.5) {
        gapKey = 'good';
    } else {
        gapKey = 'almostThere';
    }
    
    console.log('Selected keys:', { levelKey, gapKey });
    const finalMessage = messages[levelKey][gapKey];
    console.log('Final message:', finalMessage);
    
    return finalMessage;
}

// グローバルスコープに明示的に公開
window.generateDiagnosisMessage = generateDiagnosisMessage;

// アドバイス生成
function generateAdvice(gaps, overallLevel, career) {
    const advice = [];
    const careerPath = careerPaths[career];
    const levelDiff = careerPath.targetLevel - overallLevel;
    
    // 全体的な評価
    if (overallLevel >= careerPath.targetLevel) {
        advice.push(`素晴らしい！${careerPath.name}として求められるスキルレベルに達しています`);
    } else if (levelDiff <= 0.5) {
        advice.push(`あと少しで目標達成です！平均${levelDiff.toFixed(1)}レベルの向上で目標に到達できます`);
    } else if (levelDiff <= 1.0) {
        advice.push(`目標まで平均${levelDiff.toFixed(1)}レベル必要です。計画的なスキルアップで達成可能です`);
    } else {
        advice.push(`目標達成には集中的な学習が必要です。優先スキルから着実に伸ばしていきましょう`);
    }
    
    // 最もギャップの大きいスキルへのアドバイス
    const topGaps = gaps.filter(g => g.gap > 0).slice(0, 3);
    if (topGaps.length > 0) {
        topGaps.forEach(gap => {
            advice.push(`「${gap.skill}」のスキルアップが特に重要です（ギャップ：${gap.gap}レベル）`);
        });
    }
    
    // キャリアパス別の具体的アドバイス
    if (career === 'finance') {
        advice.push('金融資格（CFA、CMA等）の取得がキャリアアップに直結します');
        advice.push('実務での案件経験とツール活用スキルの両方を磨きましょう');
    } else if (career === 'consulting') {
        advice.push('ケーススタディと実プロジェクトで問題解決力を鍛えましょう');
        advice.push('論理的思考とコミュニケーション力が成功の鍵です');
    } else if (career === 'it') {
        advice.push('最新技術のキャッチアップと認定資格取得を並行して進めましょう');
        advice.push('実装経験とアーキテクチャ理解の両方が重要です');
    } else if (career === 'general') {
        advice.push('幅広いビジネス経験とリーダーシップ実績が評価されます');
        advice.push('経営視点とグローバル対応力を意識的に磨きましょう');
    }
    
    return advice;
}