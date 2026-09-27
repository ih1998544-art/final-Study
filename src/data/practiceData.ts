import { PracticeQuestion, PracticeMode, PracticeTestSummary } from '../types/practice';

export const SAMPLE_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // 1. MCQ
  {
    id: 'q-mcq-1',
    type: 'mcq',
    question: 'In Linear Algebra, what is the geometric significance of an eigenvector v corresponding to an eigenvalue λ under a transformation matrix A?',
    marks: 2,
    topicName: 'Eigenvalues & Linear Transformations',
    subjectName: 'Mathematics',
    difficulty: 'Intermediate',
    options: [
      'The vector v rotates by 90 degrees in the plane',
      'The direction of vector v remains invariant, only its magnitude is scaled by factor λ',
      'The vector v becomes orthogonal to the nullspace of matrix A',
      'The length of vector v is guaranteed to shrink to zero',
    ],
    correctIndex: 1,
    explanation: 'By definition, Av = λv. The linear transformation maps vector v onto a scalar multiple of itself. Its span (direction line) remains invariant while its magnitude is scaled by λ.',
    hint: 'Look closely at the definition Av = λv.',
  },

  // 2. TRUE/FALSE
  {
    id: 'q-tf-1',
    type: 'true_false',
    question: 'In classical thermodynamics, the total entropy of an isolated system can decrease during a spontaneous irreversible process.',
    marks: 1,
    topicName: 'Laws of Thermodynamics & Entropy',
    subjectName: 'Physics',
    difficulty: 'Beginner',
    options: ['True', 'False'],
    correctIndex: 1, // False
    explanation: 'False. The Second Law of Thermodynamics dictates that for any spontaneous process in an isolated system, the total entropy must either increase (ΔS > 0 for irreversible) or remain constant (ΔS = 0 for reversible). It can never decrease.',
    hint: 'Recall the statement of the Second Law of Thermodynamics for isolated systems.',
  },

  // 3. NUMERICAL PROBLEM
  {
    id: 'q-num-1',
    type: 'numerical',
    question: 'A mass of 2.5 kg moves in a horizontal circle of radius 0.80 m with an angular velocity of 4.0 rad/s. Calculate the magnitude of the required centripetal force (in Newtons).',
    marks: 3,
    topicName: 'Rotational Dynamics & Circular Motion',
    subjectName: 'Physics',
    difficulty: 'Intermediate',
    correctNumber: 32,
    unit: 'N',
    tolerance: 0.5,
    formula: 'F_c = m · r · ω²',
    explanation: 'Using the centripetal force formula F = m · r · ω²: F = 2.5 kg × 0.80 m × (4.0 rad/s)² = 2.5 × 0.80 × 16 = 32.0 N.',
    hint: 'The formula linking mass, radius, and angular speed is F = m · r · ω².',
  },

  // 4. SHORT QUESTION
  {
    id: 'q-short-1',
    type: 'short_question',
    question: 'State the two mandatory indeterminate form preconditions required before applying L\'Hôpital\'s Rule to evaluate a limit lim (x→c) [f(x) / g(x)].',
    marks: 2,
    topicName: 'Limits & L\'Hôpital\'s Rule',
    subjectName: 'Mathematics',
    difficulty: 'Beginner',
    modelAnswer: 'The limit must produce an indeterminate quotient form of either [0/0] or [±∞/±∞], and both f(x) and g(x) must be differentiable on an open interval around c (with g\'(x) ≠ 0 near c).',
    keyRubricPoints: [
      'Must produce indeterminate quotient form: 0/0 or ±∞/±∞.',
      'Functions f and g must be differentiable on an open interval containing c (except possibly at c).',
      'The derivative of the denominator g\'(x) must not equal 0 near c.',
    ],
    explanation: 'L\'Hôpital\'s rule cannot be applied to determinable quotients (e.g. 0/1 or 1/0). Applying it without verifying the 0/0 or ∞/∞ condition results in catastrophic calculation errors.',
    hint: 'Think of the two standard indeterminate quotient fraction formats.',
  },

  // 5. CODING PROBLEM
  {
    id: 'q-code-1',
    type: 'coding',
    question: 'Write a function `isPalindrome(s: string): boolean` that determines if a given string is a palindrome, considering only alphanumeric characters and ignoring cases.',
    marks: 5,
    topicName: 'Strings & Two-Pointer Algorithms',
    subjectName: 'Computer Science',
    difficulty: 'Intermediate',
    language: 'typescript',
    starterCode: `function isPalindrome(s: string): boolean {\n  // Implement two-pointer check\n  \n  return false;\n}`,
    solutionCode: `function isPalindrome(s: string): boolean {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let left = 0;\n  let right = clean.length - 1;\n  while (left < right) {\n    if (clean[left] !== clean[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}`,
    testCases: [
      { input: '\"A man, a plan, a canal: Panama\"', expectedOutput: 'true', explanation: 'Reads \"amanaplanacanalpanama\" forward and backward.' },
      { input: '\"race a car\"', expectedOutput: 'false', explanation: '\"raceacar\" is not a palindrome.' },
      { input: '\" \"', expectedOutput: 'true', explanation: 'An empty string after non-alphanumeric strip is trivially a palindrome.' },
    ],
    explanation: 'The optimal approach utilizes two pointers moving from opposite ends toward the center, achieving O(N) time complexity and O(1) auxiliary space.',
    hint: 'Filter non-alphanumeric characters, convert to lowercase, and check mirror characters from both ends.',
  },

  // 6. LONG QUESTION
  {
    id: 'q-long-1',
    type: 'long_question',
    question: 'Evaluate the structural trade-offs between Monolithic architectures and Microservices architectures in large-scale cloud systems. Address scalability, deployment complexity, latency, and fault isolation.',
    marks: 6,
    topicName: 'Distributed Systems & Software Architecture',
    subjectName: 'Software Engineering',
    difficulty: 'Advanced',
    modelAnswer: 'Monoliths offer low initial deployment complexity, zero inter-process network latency, and simple transactional ACID guarantees, but suffer from single-point failure bottlenecks and difficult independent scaling. Microservices enable independent team deployment, technology heterogeneity, and granular horizontal scaling at the cost of distributed data consistency (eventual consistency), network latency, operational overhead, and complex telemetry requirements.',
    rubricCriteria: [
      { criterion: 'Clear contrast of scalability and deployment pipelines (Monolith vs Microservices)', marks: 2 },
      { criterion: 'Analysis of network overhead, latency, and inter-service communication (REST/gRPC/Kafka)', marks: 2 },
      { criterion: 'Discussion of fault isolation, blast radius, and data consistency models (ACID vs BASE)', marks: 2 },
    ],
    explanation: 'High-scoring answers balance architectural benefits against operational complexity. Neither pattern is universally superior; selection is dictated by team organization (Conway\'s Law) and domain bounded contexts.',
    hint: 'Structure your answer around the 4 prompt pillars: Scalability, Deployment, Latency, and Fault Isolation.',
  },

  // 7. MCQ 2 (Chemistry)
  {
    id: 'q-mcq-2',
    type: 'mcq',
    question: 'Which of the following factors favored the SN2 mechanism over the SN1 mechanism in nucleophilic substitution?',
    marks: 2,
    topicName: 'Organic Reaction Mechanisms',
    subjectName: 'Chemistry',
    difficulty: 'Intermediate',
    options: [
      'Tertiary alkyl halide substrate and protic polar solvent',
      'Primary alkyl halide substrate, strong nucleophile, and aprotic polar solvent',
      'Stable carbocation intermediate formation',
      'High steric hindrance around the alpha carbon',
    ],
    correctIndex: 1,
    explanation: 'SN2 proceeds via a single-step concerted backside attack. It requires minimal steric hindrance (primary > secondary >> tertiary), a strong nucleophile, and polar aprotic solvents (like DMSO or acetone) that do not solvate and deactivate the nucleophile.',
    hint: 'Consider steric hindrance and whether the mechanism is concerted or stepwise.',
  },

  // 8. TRUE/FALSE 2 (Economics)
  {
    id: 'q-tf-2',
    type: 'true_false',
    question: 'In a purely competitive market in long-run equilibrium, firms earn zero economic profit (accounting profit equals the opportunity cost of capital).',
    marks: 1,
    topicName: 'Market Structures & Equilibrium',
    subjectName: 'Economics',
    difficulty: 'Beginner',
    options: ['True', 'False'],
    correctIndex: 0, // True
    explanation: 'True. Free entry and exit drive economic profit to zero in long-run competitive equilibrium. If economic profits were positive, new entrants would increase market supply, driving price down to minimum average total cost.',
    hint: 'Remember that economic profit accounts for both explicit costs and implicit opportunity costs.',
  },

  // 9. NUMERICAL 2 (Chemistry)
  {
    id: 'q-num-2',
    type: 'numerical',
    question: 'Calculate the pH of a 0.010 M strong hydrochloric acid (HCl) solution at 25°C. Express your answer to two decimal places.',
    marks: 2,
    topicName: 'Acids, Bases & Aqueous Equilibria',
    subjectName: 'Chemistry',
    difficulty: 'Beginner',
    correctNumber: 2.0,
    unit: 'pH',
    tolerance: 0.05,
    formula: 'pH = -log₁₀[H⁺]',
    explanation: 'Since HCl is a monoprotic strong acid that completely dissociates: [H⁺] = 0.010 M = 10⁻² M. pH = -log₁₀(10⁻²) = 2.00.',
    hint: 'Use pH = -log₁₀[H⁺] for fully dissociated strong acids.',
  },
];

export const PRECONFIGURED_TESTS: PracticeTestSummary[] = [
  {
    id: 'test-topic-math',
    title: 'Linear Algebra & Eigenvalue Mastery Drill',
    subjectName: 'Mathematics',
    mode: 'topic_practice',
    questionCount: 5,
    durationMinutes: 10,
    difficulty: 'Intermediate',
    xpReward: 50,
    completedBefore: true,
    lastScorePercentage: 80,
  },
  {
    id: 'test-chap-physics',
    title: 'Chapter 2 Test: Rotational Dynamics & Conservation Laws',
    subjectName: 'Physics',
    mode: 'chapter_test',
    questionCount: 8,
    durationMinutes: 15,
    difficulty: 'Intermediate',
    xpReward: 80,
    completedBefore: false,
  },
  {
    id: 'test-subj-cs',
    title: 'Computer Science Comprehensive Midterm Simulation',
    subjectName: 'Computer Science',
    mode: 'subject_test',
    questionCount: 12,
    durationMinutes: 25,
    difficulty: 'Advanced',
    xpReward: 120,
    completedBefore: true,
    lastScorePercentage: 92,
  },
  {
    id: 'test-mock-exam',
    title: 'All-Subject High-Yield University Mock Exam',
    subjectName: 'Exam Preparation',
    mode: 'mock_exam',
    questionCount: 15,
    durationMinutes: 35,
    difficulty: 'Advanced',
    xpReward: 200,
    completedBefore: false,
  },
  {
    id: 'test-blitz-chem',
    title: 'Rapid Timed Blitz: Acids, Bases & Reaction Kinetics',
    subjectName: 'Chemistry',
    mode: 'timed_quiz',
    questionCount: 6,
    durationMinutes: 6,
    difficulty: 'Intermediate',
    xpReward: 65,
    completedBefore: false,
  },
];

/**
 * Dynamically builds a calibrated test session for any subject and mode.
 */
export function buildPracticeTest(
  subjectName: string,
  mode: PracticeMode,
  customQuestions?: PracticeQuestion[]
): {
  id: string;
  title: string;
  subjectName: string;
  mode: PracticeMode;
  questions: PracticeQuestion[];
  durationMinutes: number;
} {
  const filtered = SAMPLE_PRACTICE_QUESTIONS.filter(
    (q) => q.subjectName.toLowerCase() === subjectName.toLowerCase()
  );

  const basePool = filtered.length >= 3 ? filtered : SAMPLE_PRACTICE_QUESTIONS;

  let testQuestions = customQuestions || basePool;
  let duration = 15;
  let title = `${subjectName} ${mode.replace('_', ' ').toUpperCase()}`;

  if (mode === 'topic_practice') {
    duration = 10;
    title = `${subjectName}: Targeted Topic Practice Drill`;
    testQuestions = testQuestions.slice(0, 5);
  } else if (mode === 'chapter_test') {
    duration = 15;
    title = `${subjectName}: Chapter Assessment & Diagnostic Check`;
    testQuestions = testQuestions.slice(0, 7);
  } else if (mode === 'subject_test') {
    duration = 25;
    title = `${subjectName}: Comprehensive Subject Mastery Test`;
    testQuestions = testQuestions.slice(0, 9);
  } else if (mode === 'mock_exam') {
    duration = 35;
    title = `${subjectName}: Full-Length Rubric Mock Examination`;
    testQuestions = testQuestions;
  } else if (mode === 'timed_quiz') {
    duration = 5;
    title = `${subjectName}: Rapid Timed Active-Recall Blitz`;
    testQuestions = testQuestions.slice(0, 5);
  }

  return {
    id: `session-${Date.now()}`,
    title,
    subjectName,
    mode,
    questions: testQuestions,
    durationMinutes: duration,
  };
}
