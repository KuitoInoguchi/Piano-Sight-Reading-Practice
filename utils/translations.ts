import { Language } from '../types';

interface TranslationData {
  title: string;
  subtitle: string;
  score: string;
  combo: string;
  settings: string;
  mode: string;
  difficulty: string;
  clef: string;
  keySig: string;
  language: string;
  help: string;
  waitingSingle: string;
  waitingChord: string;
  correct: string;
  incorrect: string;
  hardModeActive: string;
  instruction: string;
  modes: {
    single: string;
    chord: string;
    challenge: string;
  };
  diffs: {
    normal: string;
    hard: string;
  };
  clefs: {
    treble: string;
    bass: string;
    auto: string;
  };
  docs: {
    title: string;
    intro: string;
    staffTitle: string;
    staffBody: string;
    clefTitle: string;
    clefBody: string;
    notesTitle: string;
    notesBody: string;
    accTitle: string;
    accBody: string;
    tipsTitle: string;
    tipsBody: string;
    close: string;
  };
  challenge: {
    start: string;
    desc: string;
    timeLeft: string;
    gameOver: string;
    finalScore: string;
    history: string;
    noHistory: string;
    playAgain: string;
    date: string;
  }
}

export const TRANSLATIONS: Record<Language, TranslationData> = {
  en: {
    title: "Piano Sight Reader",
    subtitle: "Master the keys",
    score: "Score",
    combo: "Combo",
    settings: "Config",
    mode: "Mode",
    difficulty: "Range",
    clef: "Clef",
    keySig: "Key Sig",
    language: "Language",
    help: "Guide",
    waitingSingle: "Identify the note",
    waitingChord: "Identify all notes",
    correct: "Excellent!",
    incorrect: "Missed! Streak reset.",
    hardModeActive: "Hard Mode: Extended Range!",
    instruction: "Select the matching note on the piano below. Use scroll for lower/higher octaves.",
    modes: { single: "Single", chord: "Chord", challenge: "Challenge" },
    diffs: { normal: "Normal", hard: "Hard" },
    clefs: { treble: "Treble", bass: "Bass", auto: "Auto" },
    docs: {
      title: "Music Theory Basics",
      intro: "Learn the fundamentals of reading sheet music to improve your sight-reading skills.",
      staffTitle: "The Staff",
      staffBody: "Music is written on a set of 5 lines and 4 spaces called the **Staff**. Notes can be placed on a line or in a space. The higher the note is on the staff, the higher the pitch.",
      clefTitle: "Clefs",
      clefBody: "The symbol at the start of the staff is the Clef.\n\n**Treble Clef (G Clef):** Used for higher notes (Right hand). The spiral circles the line G.\n**Bass Clef (F Clef):** Used for lower notes (Left hand). The two dots surround the line F.",
      notesTitle: "Notes & Ledger Lines",
      notesBody: "The musical alphabet goes from A to G. After G, it goes back to A.\nNotes that go above or below the 5 main lines are written on short extra lines called **Ledger Lines**.\n\n**Middle C** is typically found on the first ledger line below the Treble staff or above the Bass staff.",
      accTitle: "Key Signatures & Accidentals",
      accBody: "Symbols placed next to the clef (Key Signature) or next to a note (Accidental) change the pitch.\n\n**# (Sharp):** Raises the note by a half step (play the next key to the right).\n**b (Flat):** Lowers the note by a half step (play the next key to the left).\n**Natural:** Cancels a sharp or flat.",
      tipsTitle: "Practice Tips",
      tipsBody: "1. Start with 'Normal' difficulty and C Major.\n2. Look for 'Landmark Notes' like Middle C, Treble G (2nd line), and Bass F (4th line) to orient yourself.\n3. In this app, use the scrollbar to reach very high or very low notes in Hard mode.",
      close: "Close Guide"
    },
    challenge: {
      start: "Start Challenge",
      desc: "60 seconds. As many notes as you can.",
      timeLeft: "Time",
      gameOver: "Time's Up!",
      finalScore: "Final Score",
      history: "History",
      noHistory: "No challenges played yet.",
      playAgain: "Play Again",
      date: "Date"
    }
  },
  'zh-CN': {
    title: "钢琴视奏练习",
    subtitle: "掌握五线谱与键盘",
    score: "得分",
    combo: "连击",
    settings: "设置",
    mode: "模式",
    difficulty: "难度/范围",
    clef: "谱号",
    keySig: "调号",
    language: "语言",
    help: "教程",
    waitingSingle: "请找出该音符",
    waitingChord: "请找出所有音符",
    correct: "太棒了！",
    incorrect: "错误！连击中断。",
    hardModeActive: "困难模式：音域已扩展！",
    instruction: "在下方的钢琴键盘上点击对应的按键。左右滚动可显示更高或更低的八度。",
    modes: { single: "单音", chord: "和弦", challenge: "1分钟挑战" },
    diffs: { normal: "普通", hard: "困难" },
    clefs: { treble: "高音", bass: "低音", auto: "自动" },
    docs: {
      title: "五线谱基础知识",
      intro: "学习阅读五线谱的基本规则，快速提升视奏能力。",
      staffTitle: "五线谱 (Staff)",
      staffBody: "五线谱由 **5条线** 和 **4个间** 组成。音符可以记在线上，也可以记在间里。音符在谱表上的位置越高，音高就越高。",
      clefTitle: "谱号 (Clefs)",
      clefBody: "谱表左端的符号叫做谱号，用来确定音符的音高。\n\n**高音谱号 (Treble/G谱号):** 这里的音通常对应钢琴的右侧（高音区）。谱号的螺旋中心围绕着 G 线。\n**低音谱号 (Bass/F谱号):** 这里的音通常对应钢琴的左侧（低音区）。两点之间包围着 F 线。",
      notesTitle: "音名与加线",
      notesBody: "音乐的字母表循环使用 A 到 G (A B C D E F G)。\n当音符超出五根线的范围时，会使用短小的横线来记录，这叫 **加线 (Ledger Lines)**。\n\n**中央C (Middle C)** 位于高音谱表的下加一线，或低音谱表的上加一线。",
      accTitle: "调号与变音记号",
      accBody: "谱号旁边的符号（调号）或音符旁边的符号（变音记号）会改变音高。\n\n**# (升号 Sharp):** 将音升高半音（向右弹奏相邻的键）。\n**b (降号 Flat):** 将音降低半音（向左弹奏相邻的键）。\n**还原号 (Natural):** 取消之前的升降效果。",
      tipsTitle: "练习技巧",
      tipsBody: "1. 从“普通”难度和 C 大调开始练习。\n2. 寻找“地标音”，例如中央C、高音谱表的G（第二线）和低音谱表的F（第四线）来快速定位。\n3. 在本应用中，如果是困难模式，记得左右滑动键盘来寻找超高或超低音。",
      close: "关闭教程"
    },
    challenge: {
      start: "开始挑战",
      desc: "60秒倒计时，尽可能多地识谱。",
      timeLeft: "剩余时间",
      gameOver: "时间到！",
      finalScore: "最终得分",
      history: "历史记录",
      noHistory: "暂无挑战记录",
      playAgain: "再玩一次",
      date: "日期"
    }
  },
  'zh-TW': {
    title: "鋼琴視奏練習",
    subtitle: "掌握五線譜與鍵盤",
    score: "得分",
    combo: "連擊",
    settings: "設置",
    mode: "模式",
    difficulty: "難度/範圍",
    clef: "譜號",
    keySig: "調號",
    language: "語言",
    help: "教程",
    waitingSingle: "請找出該音符",
    waitingChord: "請找出所有音符",
    correct: "太棒了！",
    incorrect: "錯誤！連擊中斷。",
    hardModeActive: "困難模式：音域已擴展！",
    instruction: "在下方的鋼琴鍵盤上點擊對應的按鍵。左右滾動可顯示更高或更低的八度。",
    modes: { single: "單音", chord: "和弦", challenge: "1分鐘挑戰" },
    diffs: { normal: "普通", hard: "困難" },
    clefs: { treble: "高音", bass: "低音", auto: "自動" },
    docs: {
      title: "五線譜基礎知識",
      intro: "學習閱讀五線譜的基本規則，快速提升視奏能力。",
      staffTitle: "五線譜 (Staff)",
      staffBody: "五線譜由 **5條線** 和 **4個間** 組成。音符可以記在線上，也可以記在間裡。音符在譜表上的位置越高，音高就越高。",
      clefTitle: "譜號 (Clefs)",
      clefBody: "譜表左端的符號叫做譜號，用來確定音符的音高。\n\n**高音譜號 (Treble/G譜號):** 這裡的音通常對應鋼琴的右側（高音區）。譜號的螺旋中心圍繞著 G 線。\n**低音譜號 (Bass/F譜號):** 這裡的音通常對應鋼琴的左側（低音區）。兩點之間包圍著 F 線。",
      notesTitle: "音名與加線",
      notesBody: "音樂的字母表循環使用 A 到 G (A B C D E F G)。\n當音符超出五根線的範圍時，會使用短小的橫線來記錄，這叫 **加線 (Ledger Lines)**。\n\n**中央C (Middle C)** 位於高音譜表的下加一線，或低音譜表的上加一線。",
      accTitle: "調號與變音記號",
      accBody: "譜號旁邊的符號（調號）或音符旁邊的符號（變音記號）會改變音高。\n\n**# (升號 Sharp):** 將音升高半音（向右彈奏相鄰的鍵）。\n**b (降號 Flat):** 將音降低半音（向左彈奏相鄰的鍵）。\n**還原號 (Natural):** 取消之前的升降效果。",
      tipsTitle: "練習技巧",
      tipsBody: "1. 從「普通」難度和 C 大調開始練習。\n2. 尋找「地標音」，例如中央C、高音譜表的G（第二線）和低音譜表的F（第四線）來快速定位。\n3. 在本應用中，如果是困難模式，記得左右滑動鍵盤來尋找超高或超低音。",
      close: "關閉教程"
    },
    challenge: {
      start: "開始挑戰",
      desc: "60秒倒計時，盡可能多地識譜。",
      timeLeft: "剩餘時間",
      gameOver: "時間到！",
      finalScore: "最終得分",
      history: "歷史記錄",
      noHistory: "暫無挑戰記錄",
      playAgain: "再玩一次",
      date: "日期"
    }
  },
  'ja': {
    title: "ピアノ初見練習",
    subtitle: "譜読み力を鍛えよう",
    score: "スコア",
    combo: "コンボ",
    settings: "設定",
    mode: "モード",
    difficulty: "難易度",
    clef: "音部記号",
    keySig: "調号",
    language: "言語",
    help: "ヘルプ",
    waitingSingle: "音符を弾いてください",
    waitingChord: "和音を弾いてください",
    correct: "正解！",
    incorrect: "ミス！",
    hardModeActive: "ハードモード：音域拡大中",
    instruction: "下のピアノ鍵盤で正解の音を弾いてください。スクロールで高い音や低い音を表示できます。",
    modes: { single: "単音", chord: "和音", challenge: "1分間チャレンジ" },
    diffs: { normal: "普通", hard: "難しい" },
    clefs: { treble: "ト音", bass: "ヘ音", auto: "自動" },
    docs: {
      title: "楽譜の基礎知識",
      intro: "楽譜の読み方を学び、初見演奏のスキルを向上させましょう。",
      staffTitle: "五線譜 (Staff)",
      staffBody: "楽譜は5本の線（五線）と、その間のスペースに書かれます。音符が上にあるほど音は高くなり、下にあるほど音は低くなります。",
      clefTitle: "音部記号 (Clefs)",
      clefBody: "五線の左端にある記号です。\n\n**ト音記号 (Treble Clef):** 高い音（ピアノの右側）を表します。渦巻きの中心が「ソ(G)」の線です。\n**ヘ音記号 (Bass Clef):** 低い音（ピアノの左側）を表します。2つの点の間が「ファ(F)」の線です。",
      notesTitle: "音名と加線",
      notesBody: "音楽のアルファベットは A から G まで (ラシドレミファソ) を繰り返します。\n五線に収まりきらない高い音や低い音は、**加線**という短い線を引いて書き表します。\n\n**真ん中のド (Middle C)** は、ト音記号の下の加線、またはヘ音記号の上の加線に位置します。",
      accTitle: "調号と臨時記号",
      accBody: "音部記号の横（調号）や音符の横（臨時記号）にある記号は、音の高さを変えます。\n\n**# (シャープ):** 半音上げる（右隣の鍵盤を弾く）。\n**b (フラット):** 半音下げる（左隣の鍵盤を弾く）。\n**ナチュラル:** シャープやフラットを取り消す。",
      tipsTitle: "練習のコツ",
      tipsBody: "1. まずは「普通」難易度とハ長調(C Major)から始めましょう。\n2. 「真ん中のド」、ト音記号の「ソ(G)」、ヘ音記号の「ファ(F)」などの基準となる音を覚えましょう。\n3. このアプリのハードモードでは、スクロールして非常に高い音や低い音を探してください。",
      close: "閉じる"
    },
    challenge: {
      start: "スタート",
      desc: "60秒でできるだけ多くの音符を読んでください。",
      timeLeft: "残り時間",
      gameOver: "終了！",
      finalScore: "最終スコア",
      history: "履歴",
      noHistory: "履歴がありません",
      playAgain: "もう一度",
      date: "日付"
    }
  }
};