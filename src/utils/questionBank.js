// Singapore context
const sgNames = ['Mia','Raju','Wei Ming','Priya','Ahmad','Siti','Ming','Kavya','Jason','Lin'];
const femaleNames = ['Mia','Priya','Siti','Kavya','Lin'];
const sgSettings = ['playground','classroom','hawker centre','void deck','provision shop'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pronoun(name) { return femaleNames.includes(name) ? 'her' : 'him'; }

function genOptions(correct, part1, part2) {
  const c = parseInt(correct);
  const distractors = new Set();
  // Always include plausible wrong answers
  const candidates = [
    c + 1, c - 1, c + 2, c - 2,
    Math.abs(part1 - part2),    // common mistake: subtract instead of add
    Math.max(part1, part2),     // common mistake: pick the bigger number
  ];
  candidates.filter(d => d > 0 && d !== c).forEach(d => {
    if (distractors.size < 3) distractors.add(d);
  });
  // Fill remaining if needed
  let att = 0;
  while (distractors.size < 3 && att < 30) {
    const off = Math.ceil(Math.random() * 4) * (Math.random() > 0.5 ? 1 : -1);
    const d = c + off;
    if (d > 0 && d !== c) distractors.add(d);
    att++;
  }
  return shuffle([c, ...[...distractors].slice(0, 3)]).map(String);
}

// ====== 10 WORD PROBLEM TYPES × 10 Questions = 100 ======

// TYPE 1: "Altogether" word problem
function genQ1(id, diff) {
  const pairs = diff === 1 ? [[2,3],[4,2],[1,5],[3,3]] : diff === 2 ? [[5,6],[7,4],[6,8],[8,3]] : [[9,8],[7,9]];
  const [p1, p2] = pick(pairs);
  const total = p1 + p2;
  const name = pick(sgNames);
  const obj = pick(['apples','stickers','marbles','crayons','balloons','erasers']);
  return {
    id, type: 'word_problem_altogether', difficulty: diff,
    questionText: `${name} has ${p1} ${obj}. ${pick(sgNames)} gives ${pronoun(name)} ${p2} more ${obj}. How many ${obj} does ${name} have altogether?`,
    emoji: '🍎', visualType: 'number_bond', part1: p1, part2: p2, whole: total,
    equation: `${p1} + ${p2} = ?`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
    hint1: 'The word "altogether" is an addition keyword — it means ADD!',
    hint2: `Number bond: ${p1} + ${p2} = ?`,
    explanation: `This is an addition word problem. "${name} has ${p1}" is the first part. "Gets ${p2} more" is the second part. ${p1} + ${p2} = ${total}.`,
    keyWords: ['altogether', 'more'],
  };
}

// TYPE 2: "In all" word problem
function genQ2(id, diff) {
  const pairs = diff === 1 ? [[3,4],[2,5],[4,3],[1,6]] : diff === 2 ? [[5,7],[6,6],[8,4]] : [[7,8],[9,6],[8,7]];
  const [p1, p2] = pick(pairs);
  const total = p1 + p2;
  const g1 = pick(['boys','girls','cats','red balloons','kittens']);
  const g2 = pick(['girls','boys','dogs','blue balloons','puppies']);
  const place = pick(sgSettings);
  return {
    id, type: 'word_problem_in_all', difficulty: diff,
    questionText: `There are ${p1} ${g1} and ${p2} ${g2} at the ${place}. How many are there in all?`,
    emoji: '👧', visualType: 'story_scene', part1: p1, part2: p2, whole: total,
    equation: `${p1} + ${p2} = ?`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
    hint1: '"In all" is an addition keyword — it means you need to ADD the two groups together!',
    hint2: `First group: ${p1}. Second group: ${p2}. Add them: ${p1} + ${p2} = ?`,
    explanation: `Word problem clue: "in all" means addition. ${p1} ${g1} + ${p2} ${g2} = ${total} in all.`,
    keyWords: ['in all'],
  };
}

// TYPE 3: "How many now?" joining word problem (within 10)
function genQ3(id, diff) {
  const pairs = diff === 1 ? [[1,2],[2,3],[1,4],[3,2],[2,2]] : diff === 2 ? [[3,4],[4,3],[2,5]] : [[4,5],[5,4]];
  const [p1, p2] = pick(pairs);
  const total = p1 + p2;
  const name = pick(sgNames);
  const giver = pick(sgNames.filter(n => n !== name));
  const obj = pick(['stickers','sweets','pencils','erasers','toys','beads']);
  return {
    id, type: 'word_problem_how_many_now', difficulty: diff,
    questionText: `${name} has ${p1} ${obj}. ${giver} gives ${pronoun(name)} ${p2} more ${obj}. How many ${obj} does ${name} have now?`,
    emoji: '⭐', visualType: 'number_bond', part1: p1, part2: p2, whole: total,
    equation: `${p1} + ${p2} = ?`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
    hint1: '"Gives more" is a clue that this is an addition word problem!',
    hint2: `Start with ${p1}, then add ${p2} more. Count on: ${p1} + ${p2} = ?`,
    explanation: `Word problem clue: "gives more" means addition. ${name} starts with ${p1} ${obj}, gets ${p2} more. ${p1} + ${p2} = ${total}.`,
    keyWords: ['more', 'how many', 'now'],
  };
}

// TYPE 4: Bigger numbers word problem (1-digit + 2-digit, within 100)
function genQ4(id, diff) {
  const p1 = diff === 1 ? pick([11,12,13]) : diff === 2 ? pick([14,21,23]) : pick([35,42,56]);
  const p2 = diff === 1 ? pick([2,3,4]) : diff === 2 ? pick([5,6,7]) : pick([8,9]);
  const total = p1 + p2;
  const name = pick(sgNames);
  const obj = pick(['marbles','books','coins','cards','shells','stamps']);
  return {
    id, type: 'word_problem_bigger_numbers', difficulty: diff,
    questionText: `${name} collects ${obj}. ${name} already has ${p1} ${obj}. A friend gives ${pronoun(name)} ${p2} more ${obj}. How many ${obj} does ${name} have now?`,
    emoji: '🔮', visualType: 'bar_model', part1: p1, part2: p2, whole: total,
    equation: `${p1} + ${p2} = ?`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
    hint1: 'This word problem says "gives more" — that means ADD!',
    hint2: `Use a bar model: Part 1 = ${p1}, Part 2 = ${p2}. Whole = ${p1} + ${p2} = ?`,
    explanation: `Word problem: "gives more" = addition. ${p1} + ${p2} = ${total}. ${name} now has ${total} ${obj}.`,
    keyWords: ['more', 'how many'],
  };
}

// TYPE 5: "Added to" word problem (2-digit + 1-digit, within 100)
function genQ5(id, diff) {
  const p1 = diff === 1 ? pick([20,21,22]) : diff === 2 ? pick([23,31,34]) : pick([45,67,78]);
  const p2 = diff === 1 ? pick([3,4,5]) : diff === 2 ? pick([5,6,7]) : pick([7,8,9]);
  const total = p1 + p2;
  const obj = pick(['books','toys','flowers','stamps','shells','beads']);
  const place = pick(sgSettings);
  return {
    id, type: 'word_problem_added_to', difficulty: diff,
    questionText: `There are ${p1} ${obj} on the shelf at the ${place}. The teacher puts ${p2} more ${obj} on the shelf. How many ${obj} are on the shelf now?`,
    emoji: '📚', visualType: 'bar_model', part1: p1, part2: p2, whole: total,
    equation: `${p1} + ${p2} = ?`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
    hint1: '"Puts more" is a word problem clue — it means ADD!',
    hint2: `Bar model: [${p1}] + [${p2}] = [?]`,
    explanation: `Word problem clue: "puts more" = addition. ${p1} + ${p2} = ${total} ${obj} on the shelf.`,
    keyWords: ['more', 'how many', 'now'],
  };
}

// TYPE 6: "Received / got" word problem (within 20)
function genQ6(id, diff) {
  const pairs = diff === 1 ? [[3,4],[4,5],[2,6],[5,3]] : diff === 2 ? [[6,5],[7,6],[5,8],[8,4]] : [[8,7],[9,8]];
  const [p1, p2] = pick(pairs);
  const total = p1 + p2;
  const name = pick(sgNames);
  const giver = pick(sgNames.filter(n => n !== name));
  const obj = pick(['ribbons','stickers','sweets','flowers','stamps','stars']);
  return {
    id, type: 'word_problem_received', difficulty: diff,
    questionText: `${name} had ${p1} ${obj} in the morning. In the afternoon, ${giver} gave ${pronoun(name)} ${p2} more ${obj}. How many ${obj} does ${name} have at the end of the day?`,
    emoji: '🎀', visualType: 'story_scene', part1: p1, part2: p2, whole: total,
    equation: `${p1} + ${p2} = ?`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
    hint1: '"Gave more" is an addition keyword in word problems!',
    hint2: `Morning: ${p1}. Afternoon: got ${p2} more. Total = ${p1} + ${p2} = ?`,
    explanation: `Word problem: "gave more" = addition. Started with ${p1}, received ${p2} more. ${p1} + ${p2} = ${total}.`,
    keyWords: ['gave', 'more', 'how many'],
  };
}

// TYPE 7: "Total cost" word problem (within 100)
function genQ7(id, diff) {
  const p1 = diff === 1 ? pick([10,15,20]) : diff === 2 ? pick([25,30,35]) : pick([40,45,50]);
  const p2 = diff === 1 ? pick([5,10,15]) : diff === 2 ? pick([20,25,30]) : pick([25,35,45]);
  const total = p1 + p2;
  const item1 = pick(['mango','pencil','eraser','ruler','notebook']);
  const item2 = pick(['banana','pen','sharpener','glue stick','bookmark']);
  return {
    id, type: 'word_problem_total_cost', difficulty: diff,
    questionText: `At the provision shop, a ${item1} costs ${p1} cents and a ${item2} costs ${p2} cents. What is the total cost of both items?`,
    emoji: '💰', visualType: 'bar_model', part1: p1, part2: p2, whole: total,
    equation: `${p1} + ${p2} = ?`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
    hint1: '"Total cost" is a word problem clue that means ADD the two prices!',
    hint2: `Price of ${item1}: ${p1}¢. Price of ${item2}: ${p2}¢. Total = ${p1} + ${p2} = ?`,
    explanation: `Word problem: "total cost" = addition. ${p1}¢ + ${p2}¢ = ${total}¢.`,
    keyWords: ['total', 'cost'],
  };
}

// TYPE 8: "Combined / total length" word problem (within 20)
function genQ8(id, diff) {
  const pairs = diff === 1 ? [[3,4],[2,5],[4,3],[5,2]] : diff === 2 ? [[5,6],[6,5],[7,4],[4,8]] : [[8,7],[9,6]];
  const [p1, p2] = pick(pairs);
  const total = p1 + p2;
  const obj1 = pick(['red ribbon','blue pencil','yellow stick','green string']);
  const obj2 = pick(['white rope','orange tape','purple crayon','brown straw']);
  return {
    id, type: 'word_problem_total_length', difficulty: diff,
    questionText: `A ${obj1} is ${p1} cm long. A ${obj2} is ${p2} cm long. If you place them end to end, what is the total length?`,
    emoji: '📏', visualType: 'number_line', part1: p1, part2: p2, whole: total,
    equation: `${p1} + ${p2} = ?`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
    hint1: '"Total length" is a word problem clue — ADD the two lengths!',
    hint2: `Length 1: ${p1} cm. Length 2: ${p2} cm. Total = ${p1} + ${p2} = ?`,
    explanation: `Word problem: "total length" = addition. ${p1} cm + ${p2} cm = ${total} cm.`,
    keyWords: ['total', 'length'],
  };
}

// TYPE 9: Number bond missing part word problem (within 20)
function genQ9(id, diff) {
  const wholeVal = diff === 1 ? pick([7,8,9,10]) : diff === 2 ? pick([11,13,15,16]) : pick([17,18,19]);
  const p1 = diff === 1 ? pick([3,4,5]) : diff === 2 ? pick([5,6,7]) : pick([8,9]);
  const p2 = wholeVal - p1;
  if (p2 <= 0) return genQ9(id, diff);
  const name = pick(sgNames);
  const obj = pick(['apples','oranges','cookies','sweets','beads','stars']);
  return {
    id, type: 'word_problem_missing_part', difficulty: diff,
    questionText: `${name} wants to collect ${wholeVal} ${obj} in total. ${name} already has ${p1} ${obj}. How many more ${obj} does ${name} need?`,
    emoji: '🔢', visualType: 'number_bond', part1: p1, part2: p2, whole: wholeVal,
    equation: `${p1} + ? = ${wholeVal}`,
    options: genOptions(p2, p1, p2), correctAnswer: String(p2),
    hint1: 'This word problem asks "how many more?" — find the missing part!',
    hint2: `Number bond: [${p1}] + [?] = [${wholeVal}]. What plus ${p1} makes ${wholeVal}?`,
    explanation: `Word problem: "how many more" = find missing addend. ${p1} + ? = ${wholeVal}. The answer is ${p2} because ${p1} + ${p2} = ${wholeVal}.`,
    keyWords: ['how many more', 'need'],
  };
}

// TYPE 10: Two-part story word problem (within 100)
function genQ10(id, diff) {
  const p1 = diff === 1 ? pick([5,8,10]) : diff === 2 ? pick([12,15,18]) : pick([23,34,45]);
  const p2 = diff === 1 ? pick([3,4,5]) : diff === 2 ? pick([7,8,12]) : pick([15,21,27]);
  const total = p1 + p2;
  const color1 = pick(['red','blue','yellow','green','pink']);
  const color2 = pick(['orange','purple','white','black','brown']);
  const obj = pick(['balloons','flowers','buttons','ribbons','pencils','beads']);
  const place = pick(sgSettings);
  return {
    id, type: 'word_problem_two_part_story', difficulty: diff,
    questionText: `At the ${place}, there are ${p1} ${color1} ${obj} and ${p2} ${color2} ${obj}. How many ${obj} are there in all?`,
    emoji: '🎈', visualType: 'bar_model', part1: p1, part2: p2, whole: total,
    equation: `${p1} + ${p2} = ?`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
    hint1: '"In all" is the addition keyword — ADD both groups of ${obj}!',
    hint2: `Group 1: ${p1} ${color1} ${obj}. Group 2: ${p2} ${color2} ${obj}. Total = ${p1} + ${p2} = ?`,
    explanation: `Word problem: "in all" = addition. ${p1} ${color1} + ${p2} ${color2} = ${total} ${obj} in all.`,
    keyWords: ['in all', 'how many'],
  };
}

const generators = [genQ1, genQ2, genQ3, genQ4, genQ5, genQ6, genQ7, genQ8, genQ9, genQ10];
const diffDist = [1,1,1,1,2,2,2,2,3,3]; // 4 easy, 4 med, 2 hard per type

export function generateQuestionBank() {
  const bank = [];
  let qid = 1;
  generators.forEach((gen, gi) => {
    diffDist.forEach(diff => {
      bank.push(gen(`WP_Q${gi + 1}_${String(qid).padStart(3, '0')}`, diff));
      qid++;
    });
  });
  return shuffle(bank);
}

export function generatePracticeSet() {
  const practice = [];
  let qid = 1;
  generators.forEach((gen, gi) => {
    practice.push(gen(`WP_P${gi + 1}_${String(qid).padStart(3, '0')}`, 1));
    qid++;
  });
  return shuffle(practice);
}

export { shuffle, sgNames };
