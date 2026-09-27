/**
 * Study Zone - Production In-Memory Database Store & Repository
 * Thread-safe collections with comprehensive pre-seeded academic data.
 */

import type {
  UserRecord,
  AuthSessionRecord,
  SubjectRecord,
  ChapterRecord,
  TopicRecord,
  LessonRecord,
  QuestionRecord,
  QuizRecord,
  QuizResultRecord,
  ProgressMetricsRecord,
  NoteRecord,
  FlashcardDeckRecord,
  StudyPlanRecord,
  AIConversationRecord,
  SavedResourceRecord,
  SubscriptionRecord,
} from './schema.ts';

class DatabaseStore {
  // Collections
  users: Map<string, UserRecord> = new Map();
  sessions: Map<string, AuthSessionRecord> = new Map();
  subjects: Map<string, SubjectRecord> = new Map();
  lessons: Map<string, LessonRecord> = new Map();
  questions: Map<string, QuestionRecord> = new Map();
  quizzes: Map<string, QuizRecord> = new Map();
  quizResults: QuizResultRecord[] = [];
  progressMetrics: Map<string, ProgressMetricsRecord> = new Map();
  notes: NoteRecord[] = [];
  flashcardDecks: FlashcardDeckRecord[] = [];
  studyPlans: Map<string, StudyPlanRecord> = new Map();
  conversations: Map<string, AIConversationRecord> = new Map();
  savedResources: SavedResourceRecord[] = [];
  subscriptions: Map<string, SubscriptionRecord> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    const defaultUserId = 'usr_849201';

    // 1. Seed Default User
    const defaultUser: UserRecord = {
      id: defaultUserId,
      email: 'irshad.hussain@studyzone.edu',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$simulated_secure_hash_v1',
      name: 'Irshad Hussain',
      academicLevel: 'Undergraduate (College)',
      universityOrSchool: 'Stanford University · Department of Computer Science & Mathematics',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      createdAt: '2026-08-15',
      updatedAt: '2026-09-27',
    };
    this.users.set(defaultUser.id, defaultUser);
    this.users.set(defaultUser.email.toLowerCase(), defaultUser);

    // Seed session token
    this.sessions.set('sz_jwt_demo_session_token', {
      token: 'sz_jwt_demo_session_token',
      userId: defaultUserId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    });

    // 2. Seed Subjects, Chapters, Topics, Lessons
    const defaultSubjects: SubjectRecord[] = [
      {
        id: 'math',
        name: 'Mathematics & Linear Algebra',
        category: 'STEM',
        code: 'MATH-201',
        iconName: 'Calculator',
        accentColor: 'emerald',
        description: 'Rigorous vector spaces, eigenvalues, matrix decompositions, and multivariable optimization.',
        academicLevel: 'College / Advanced Prep',
        totalChapters: 3,
        completedChapters: 1,
        totalLessons: 12,
        completedLessons: 6,
        overallMasteryPercentage: 78,
        chapters: [
          {
            id: 'math-ch-1',
            subjectId: 'math',
            number: 1,
            title: 'Linear Systems & Invertible Matrix Theorem',
            description: 'Row reduction, Gaussian elimination, pivot positions, and nullspaces.',
            estimatedMinutes: 120,
            isUnlocked: true,
            isCompleted: true,
            topics: [
              { id: 'math-top-1', title: 'Gaussian Elimination & Echelon Forms', estimatedMinutes: 40, completed: true, masteryScore: 92 },
              { id: 'math-top-2', title: 'Matrix Inverses & Determinant Criteria', estimatedMinutes: 40, completed: true, masteryScore: 88 },
              { id: 'math-top-3', title: 'Vector Spans & Subspace Basis', estimatedMinutes: 40, completed: true, masteryScore: 85 },
            ],
          },
          {
            id: 'math-ch-2',
            subjectId: 'math',
            number: 2,
            title: 'Eigenvalues, Eigenvectors & Diagonalization',
            description: 'Characteristic polynomials, geometric multiplicity, and Jordan normal form.',
            estimatedMinutes: 150,
            isUnlocked: true,
            isCompleted: false,
            topics: [
              { id: 'math-top-4', title: 'Characteristic Polynomial det(A - λI) = 0', estimatedMinutes: 50, completed: true, masteryScore: 78 },
              { id: 'math-top-5', title: 'Eigenspaces and Multiplicity Theorems', estimatedMinutes: 50, completed: false },
              { id: 'math-top-6', title: 'Matrix Diagonalization P D P⁻¹', estimatedMinutes: 50, completed: false },
            ],
          },
          {
            id: 'math-ch-3',
            subjectId: 'math',
            number: 3,
            title: 'Orthogonality & Singular Value Decomposition (SVD)',
            description: 'Gram-Schmidt orthonormalization, projection matrices, and low-rank approximation.',
            estimatedMinutes: 180,
            isUnlocked: false,
            isCompleted: false,
            topics: [
              { id: 'math-top-7', title: 'Gram-Schmidt Process & QR Factorization', estimatedMinutes: 60, completed: false },
              { id: 'math-top-8', title: 'Orthogonal Projections & Least Squares', estimatedMinutes: 60, completed: false },
              { id: 'math-top-9', title: 'Singular Value Decomposition (SVD)', estimatedMinutes: 60, completed: false },
            ],
          },
        ],
      },
      {
        id: 'physics',
        name: 'Physics: Mechanics & Thermodynamics',
        category: 'STEM',
        code: 'PHYS-101',
        iconName: 'Zap',
        accentColor: 'indigo',
        description: 'Classical Newtonian dynamics, rotational inertia, conservation laws, and heat engines.',
        academicLevel: 'Undergraduate / AP Physics C',
        totalChapters: 3,
        completedChapters: 1,
        totalLessons: 10,
        completedLessons: 5,
        overallMasteryPercentage: 82,
        chapters: [
          {
            id: 'phys-ch-1',
            subjectId: 'physics',
            number: 1,
            title: 'Kinematics & Work-Energy Theorem',
            description: 'Vector trajectories, conservative forces, and potential energy functions.',
            estimatedMinutes: 110,
            isUnlocked: true,
            isCompleted: true,
            topics: [
              { id: 'phys-top-1', title: 'Differential Kinematics', estimatedMinutes: 35, completed: true, masteryScore: 94 },
              { id: 'phys-top-2', title: 'Conservative Forces & Potential Wells', estimatedMinutes: 40, completed: true, masteryScore: 90 },
              { id: 'phys-top-3', title: 'Work-Energy Integration', estimatedMinutes: 35, completed: true, masteryScore: 86 },
            ],
          },
          {
            id: 'phys-ch-2',
            subjectId: 'physics',
            number: 2,
            title: 'Rotational Dynamics & Angular Momentum',
            description: 'Torque cross products, moment of inertia tensors, and gyroscope precession.',
            estimatedMinutes: 140,
            isUnlocked: true,
            isCompleted: false,
            topics: [
              { id: 'phys-top-4', title: 'Torque & Angular Acceleration τ = Iα', estimatedMinutes: 45, completed: true, masteryScore: 84 },
              { id: 'phys-top-5', title: 'Parallel Axis Theorem & Inertia Integrals', estimatedMinutes: 45, completed: false },
              { id: 'phys-top-6', title: 'Conservation of Angular Momentum', estimatedMinutes: 50, completed: false },
            ],
          },
          {
            id: 'phys-ch-3',
            subjectId: 'physics',
            number: 3,
            title: 'Carnot Heat Engines & Second Law of Thermodynamics',
            description: 'Entropy state variables, reversible adiabatic expansion, and Clausius theorem.',
            estimatedMinutes: 130,
            isUnlocked: false,
            isCompleted: false,
            topics: [
              { id: 'phys-top-7', title: 'Carnot Cycle P-V and T-S Diagrams', estimatedMinutes: 45, completed: false },
              { id: 'phys-top-8', title: 'Clausius Inequality and Microstate Entropy', estimatedMinutes: 45, completed: false },
              { id: 'phys-top-9', title: 'Heat Engine Thermal Efficiency Limits', estimatedMinutes: 40, completed: false },
            ],
          },
        ],
      },
      {
        id: 'cs',
        name: 'Computer Science: Algorithms & Systems',
        category: 'Computer Science',
        code: 'CS-106',
        iconName: 'Code',
        accentColor: 'sky',
        description: 'Asymptotic complexity, dynamic programming, balanced search trees, and graph algorithms.',
        academicLevel: 'College Core',
        totalChapters: 3,
        completedChapters: 2,
        totalLessons: 12,
        completedLessons: 9,
        overallMasteryPercentage: 91,
        chapters: [
          {
            id: 'cs-ch-1',
            subjectId: 'cs',
            number: 1,
            title: 'Asymptotic Complexity & Data Structures',
            description: 'Big-O bounds, amortized dynamic arrays, and self-balancing AVL trees.',
            estimatedMinutes: 120,
            isUnlocked: true,
            isCompleted: true,
            topics: [
              { id: 'cs-top-1', title: 'Master Theorem for Divide & Conquer', estimatedMinutes: 40, completed: true, masteryScore: 98 },
              { id: 'cs-top-2', title: 'AVL Tree Balancing & Rotations', estimatedMinutes: 40, completed: true, masteryScore: 92 },
              { id: 'cs-top-3', title: 'Amortized Analysis of Hash Tables', estimatedMinutes: 40, completed: true, masteryScore: 95 },
            ],
          },
          {
            id: 'cs-ch-2',
            subjectId: 'cs',
            number: 2,
            title: 'Graph Traversal & Shortest Path Algorithms',
            description: 'Breadth-first search, Dijkstra min-heap optimization, and topological sort.',
            estimatedMinutes: 130,
            isUnlocked: true,
            isCompleted: true,
            topics: [
              { id: 'cs-top-4', title: 'BFS vs DFS Traversal Invariants', estimatedMinutes: 40, completed: true, masteryScore: 96 },
              { id: 'cs-top-5', title: 'Dijkstra Shortest Path O((V+E)log V)', estimatedMinutes: 45, completed: true, masteryScore: 90 },
              { id: 'cs-top-6', title: 'Topological Sort & DAG Cycle Detection', estimatedMinutes: 45, completed: true, masteryScore: 88 },
            ],
          },
          {
            id: 'cs-ch-3',
            subjectId: 'cs',
            number: 3,
            title: 'Dynamic Programming & State Transitions',
            description: 'Optimal substructure, 0/1 Knapsack, memoization vs bottom-up tabulation.',
            estimatedMinutes: 150,
            isUnlocked: true,
            isCompleted: false,
            topics: [
              { id: 'cs-top-7', title: 'Memoization vs Iterative Tabulation', estimatedMinutes: 50, completed: true, masteryScore: 84 },
              { id: 'cs-top-8', title: '2D Matrix Compression in Knapsack', estimatedMinutes: 50, completed: false },
              { id: 'cs-top-9', title: 'Longest Common Subsequence & Edit Distance', estimatedMinutes: 50, completed: false },
            ],
          },
        ],
      },
    ];

    defaultSubjects.forEach((sub) => this.subjects.set(sub.id, sub));

    // Seed Lessons
    const defaultLessons: LessonRecord[] = [
      {
        id: 'lesson-math-1',
        title: 'Gaussian Elimination and Matrix Invertibility',
        chapterId: 'math-ch-1',
        subjectId: 'math',
        orderIndex: 1,
        durationMinutes: 45,
        contentMarkdown: '# Gaussian Elimination\n\nGaussian elimination is an algorithm for solving systems of linear equations. It operates via elementary row operations:\n1. Swapping two rows\n2. Multiplying a row by a non-zero scalar\n3. Adding a multiple of one row to another',
        keyTakeaways: ['Row echelon form has pivot entries', 'Unique solution occurs when every column has a pivot', 'det(A) ≠ 0 implies full rank'],
        formulaBlocks: ['Ax = b', 'det(A) \\neq 0'],
        isCompleted: true,
      },
      {
        id: 'lesson-cs-1',
        title: 'Dynamic Programming: Tabulation vs Memoization',
        chapterId: 'cs-ch-3',
        subjectId: 'cs',
        orderIndex: 1,
        durationMinutes: 50,
        contentMarkdown: '# Dynamic Programming Principles\n\nDP breaks complex problems into overlapping subproblems with optimal substructure.',
        keyTakeaways: ['Memoization uses top-down recursion with cache', 'Tabulation uses bottom-up iterative table filling', 'Space can often be reduced to O(1) or O(W)'],
        formulaBlocks: ['dp[i][w] = \\max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i])'],
        isCompleted: true,
      },
    ];
    defaultLessons.forEach((l) => this.lessons.set(l.id, l));

    // 3. Seed Questions & Quizzes
    const defaultQuestions: QuestionRecord[] = [
      {
        id: 'q-math-1',
        quizId: 'quiz-math-1',
        subjectId: 'math',
        chapterId: 'math-ch-2',
        prompt: 'In linear algebra, if matrix A has characteristic equation det(A - λI) = 0 with distinct real roots, what is guaranteed?',
        options: [
          'A is always symmetric and positive definite',
          'A is diagonalizable since eigenspaces span ℝⁿ',
          'det(A) must equal 0',
          'A cannot be inverted',
        ],
        correctOptionIndex: 1,
        explanation: 'When an n x n matrix has n distinct eigenvalues, each has algebraic and geometric multiplicity 1, guaranteeing that eigenvectors form a basis of ℝⁿ and A is diagonalizable.',
        difficulty: 'medium',
        topicTag: 'Eigenvalues & Diagonalization',
      },
      {
        id: 'q-cs-1',
        quizId: 'quiz-cs-1',
        subjectId: 'cs',
        chapterId: 'cs-ch-2',
        prompt: 'What is the optimal asymptotic time complexity of Dijkstra algorithm using a Fibonacci heap or Min-Heap?',
        options: [
          'O(V²)',
          'O((V + E) log V)',
          'O(V · E)',
          'O(V log V)',
        ],
        correctOptionIndex: 1,
        explanation: 'With a binary min-heap priority queue, each vertex is extracted once (O(V log V)) and each edge relaxation requires at most one heap decrease-key (O(E log V)), yielding O((V + E) log V).',
        difficulty: 'medium',
        topicTag: 'Graph Algorithms',
      },
    ];
    defaultQuestions.forEach((q) => this.questions.set(q.id, q));

    const defaultQuiz: QuizRecord = {
      id: 'quiz-math-1',
      subjectId: 'math',
      chapterId: 'math-ch-2',
      title: 'Eigenvalues & Matrix Diagonalization Diagnostic',
      description: 'Test your understanding of characteristic polynomials, algebraic vs geometric multiplicity, and matrix Jordan forms.',
      timeLimitMinutes: 20,
      questions: defaultQuestions.filter((q) => q.subjectId === 'math'),
    };
    this.quizzes.set(defaultQuiz.id, defaultQuiz);

    // 4. Seed Quiz Results
    this.quizResults = [
      {
        id: 'res_1',
        quizId: 'quiz-math-1',
        userId: defaultUserId,
        subject: 'Mathematics & Linear Algebra',
        chapterTitle: 'Eigenvalues, Eigenvectors & Diagonalization',
        timestamp: 'Yesterday',
        totalQuestions: 5,
        correctAnswers: 4,
        scorePercentage: 80,
        timeTakenSeconds: 320,
        weakTopicsIdentified: ['Multiplicity Theorems'],
      },
      {
        id: 'res_2',
        quizId: 'quiz-cs-1',
        userId: defaultUserId,
        subject: 'Computer Science: Algorithms & Systems',
        chapterTitle: 'Graph Traversal & Shortest Path Algorithms',
        timestamp: '2 days ago',
        totalQuestions: 6,
        correctAnswers: 6,
        scorePercentage: 100,
        timeTakenSeconds: 240,
        weakTopicsIdentified: [],
      },
    ];

    // 5. Seed Progress Metrics
    const defaultMetrics: ProgressMetricsRecord = {
      userId: defaultUserId,
      totalStudyHours: 118.5,
      currentStreakDays: 7,
      longestStreakDays: 19,
      completedLessonsCount: 42,
      totalQuizzesTaken: 28,
      overallAccuracyPercentage: 88.4,
      xpPoints: 3420,
      scholarLevel: 'Senior Scholar (Level 4)',
      weeklyStudyMinutes: [
        { day: 'Mon', minutes: 145 },
        { day: 'Tue', minutes: 160 },
        { day: 'Wed', minutes: 130 },
        { day: 'Thu', minutes: 180 },
        { day: 'Fri', minutes: 155 },
        { day: 'Sat', minutes: 190 },
        { day: 'Sun', minutes: 148 },
      ],
      weakTopics: [
        { id: 'wt-1', topic: 'Matrix Diagonalization & Multiplicity', subject: 'Mathematics', errorRatePercentage: 38 },
        { id: 'wt-2', topic: 'SN1/SN2 Polar Aprotic Solvent Criteria', subject: 'Chemistry', errorRatePercentage: 34 },
        { id: 'wt-3', topic: 'Parallel Axis Theorem Moment of Inertia', subject: 'Physics', errorRatePercentage: 29 },
      ],
    };
    this.progressMetrics.set(defaultUserId, defaultMetrics);

    // 6. Seed Notes
    this.notes = [
      {
        id: 'note-1',
        userId: defaultUserId,
        title: 'Cornell Notes: Linear Algebra Eigenvalues & Diagonalization',
        subject: 'Mathematics',
        tags: ['Linear Algebra', 'Eigenvalues', 'Diagonalization', 'Cornell Format'],
        createdAt: '2026-09-24',
        updatedAt: '2026-09-26',
        isAiGenerated: true,
        aiToolSource: 'AI Notes Generator',
        isPinned: true,
        cues: [
          'What is characteristic polynomial?',
          'How to compute det(A - λI) = 0?',
          'Geometric vs algebraic multiplicity?',
          'When is matrix A diagonalizable?',
        ],
        summary: 'Eigenvalues λ satisfy Av = λv. The characteristic equation det(A - λI) = 0 yields the roots. A matrix is diagonalizable if and only if algebraic multiplicity equals geometric multiplicity for every distinct eigenvalue.',
        content: '### 1. Fundamental Eigenvalue Equation\nGiven an n x n matrix A, a scalar λ is an eigenvalue if there exists a non-zero eigenvector v such that:\n$$Av = \\lambda v \\iff (A - \\lambda I)v = 0$$\n\n### 2. Characteristic Equation\n$$\\det(A - \\lambda I) = 0$$\n\n### 3. Diagonalization\n$D = P^{-1}AP$ where columns of P are eigenvectors.',
      },
      {
        id: 'note-2',
        userId: defaultUserId,
        title: 'Executive Brief: SN1 vs SN2 Nucleophilic Substitution Mechanisms',
        subject: 'Chemistry',
        tags: ['Organic Chemistry', 'SN1', 'SN2', 'Kinetics'],
        createdAt: '2026-09-23',
        updatedAt: '2026-09-25',
        isAiGenerated: true,
        aiToolSource: 'AI Summarizer',
        isPinned: false,
        cues: [
          'Unimolecular vs Bimolecular kinetics?',
          'Why do tertiary substrates prefer SN1?',
          'Role of polar aprotic solvents in SN2?',
        ],
        summary: 'SN1 reactions proceed through a two-step mechanism via a planar carbocation intermediate yielding racemization. SN2 reactions occur in a single concerted backside attack resulting in 100% Walden inversion.',
        content: '### Kinetics\n- SN1: Rate = k[Substrate]\n- SN2: Rate = k[Substrate][Nucleophile]',
      },
    ];

    // 7. Seed Flashcard Decks
    this.flashcardDecks = [
      {
        id: 'deck-1',
        userId: defaultUserId,
        title: 'Linear Algebra & Vector Spaces Mastery',
        subject: 'Mathematics',
        description: 'High-yield flashcards targeting eigenvalues, eigenspaces, linear transformations, and matrix inversions.',
        badgeColor: 'emerald',
        createdAt: '2026-09-22',
        updatedAt: '2026-09-26',
        cards: [
          {
            id: 'c1-1',
            deckId: 'deck-1',
            front: 'What is the characteristic equation used to solve for eigenvalues of matrix A?',
            back: 'det(A - λI) = 0. The roots of this polynomial equation correspond directly to the eigenvalues λ.',
            hint: 'Recall the condition for non-trivial nullspace of (A - λI).',
            status: 'known',
            reviewCount: 4,
          },
          {
            id: 'c1-2',
            deckId: 'deck-1',
            front: 'What does the Invertible Matrix Theorem state regarding det(A)?',
            back: 'A square matrix A is invertible if and only if det(A) ≠ 0.',
            hint: 'A zero determinant indicates linear dependence between rows/columns.',
            status: 'known',
            reviewCount: 3,
          },
          {
            id: 'c1-3',
            deckId: 'deck-1',
            front: 'What is the distinction between algebraic and geometric multiplicity?',
            back: 'Algebraic multiplicity is the number of times root λ appears in det(A - λI)=0. Geometric multiplicity is the dimension of the corresponding eigenspace null(A - λI).',
            hint: 'Geometric multiplicity is always ≤ algebraic multiplicity.',
            status: 'difficult',
            reviewCount: 5,
          },
        ],
      },
      {
        id: 'deck-2',
        userId: defaultUserId,
        title: 'Algorithms & Computational Complexity',
        subject: 'Computer Science',
        description: 'Asymptotic notation, graph theory invariants, and dynamic programming state transitions.',
        badgeColor: 'sky',
        createdAt: '2026-09-21',
        updatedAt: '2026-09-25',
        cards: [
          {
            id: 'c2-1',
            deckId: 'deck-2',
            front: 'What is the Master Theorem formula for T(n) = aT(n/b) + f(n)?',
            back: 'Compares f(n) with n^(log_b a). If f(n) = O(n^(log_b a - ε)), T(n) = Θ(n^(log_b a)). If f(n) = Θ(n^(log_b a)), T(n) = Θ(n^(log_b a) log n).',
            hint: 'Check critical exponent log_b(a).',
            status: 'known',
            reviewCount: 3,
          },
          {
            id: 'c2-2',
            deckId: 'deck-2',
            front: 'What differentiates BFS and DFS in terms of memory complexity on deep trees?',
            back: 'BFS requires O(B^D) memory (Queue stores all frontier nodes at depth D). DFS requires O(D) memory (Call stack only stores the current branch).',
            hint: 'Consider queue width vs call stack depth.',
            status: 'known',
            reviewCount: 4,
          },
        ],
      },
    ];

    // 8. Seed Study Plan
    const defaultStudyPlan: StudyPlanRecord = {
      id: 'plan_active_1',
      userId: defaultUserId,
      title: 'Midterm Term Finals Mastery Roadmap',
      generatedDate: '2026-09-26',
      examDate: '2026-10-15',
      dailyTargetMinutes: 120,
      scheduleDays: [
        {
          date: '2026-09-27',
          dayOfWeek: 'Sunday',
          targetMinutes: 120,
          completedMinutes: 45,
          tasks: [
            {
              id: 'st-1',
              time: '10:00 AM',
              subject: 'Mathematics',
              activity: 'Eigenvalues & Multiplicity Theorems Drill',
              durationMinutes: 45,
              type: 'deep_work',
              completed: true,
            },
            {
              id: 'st-2',
              time: '02:00 PM',
              subject: 'Computer Science',
              activity: 'Dynamic Programming Tabulation Practice',
              durationMinutes: 45,
              type: 'practice',
              completed: false,
            },
            {
              id: 'st-3',
              time: '07:30 PM',
              subject: 'Physics',
              activity: 'Rotational Dynamics Flashcards Review',
              durationMinutes: 30,
              type: 'review',
              completed: false,
            },
          ],
        },
        {
          date: '2026-09-28',
          dayOfWeek: 'Monday',
          targetMinutes: 120,
          completedMinutes: 0,
          tasks: [
            {
              id: 'st-4',
              time: '09:00 AM',
              subject: 'Mathematics',
              activity: 'Orthogonality & Gram-Schmidt Orthogonalization',
              durationMinutes: 60,
              type: 'concept',
              completed: false,
            },
            {
              id: 'st-5',
              time: '04:00 PM',
              subject: 'Computer Science',
              activity: 'Dijkstra Min-Heap Shortest Path Problems',
              durationMinutes: 60,
              type: 'practice',
              completed: false,
            },
          ],
        },
      ],
    };
    this.studyPlans.set(defaultStudyPlan.id, defaultStudyPlan);

    // 9. Seed AI Conversations
    const defaultConversation: AIConversationRecord = {
      id: 'conv_1',
      userId: defaultUserId,
      title: 'Eigenvalues Socratic Inquiry',
      subject: 'Mathematics',
      pedagogyStyle: 'Socratic',
      createdAt: '2026-09-27T08:00:00Z',
      updatedAt: '2026-09-27T08:15:00Z',
      messages: [
        {
          id: 'msg_1',
          conversationId: 'conv_1',
          role: 'user',
          content: 'Why does det(A - λI) = 0 guarantee a non-trivial eigenvector?',
          timestamp: '8:00 AM',
        },
        {
          id: 'msg_2',
          conversationId: 'conv_1',
          role: 'assistant',
          content: 'Let us consider the equation $(A - \\lambda I)v = 0$.\n\nIf $(A - \\lambda I)$ were an invertible matrix with $\\det(A - \\lambda I) \\neq 0$, what would happen when you multiply both sides by $(A - \\lambda I)^{-1}$?',
          timestamp: '8:01 AM',
          formulaBlocks: ['(A - \\lambda I)v = 0', '\\det(A - \\lambda I) = 0'],
          actionPromptSuggestions: [
            'It would force v to be the zero vector',
            'Explain geometric multiplicity next',
            'Give a 2x2 numerical example',
          ],
        },
      ],
    };
    this.conversations.set(defaultConversation.id, defaultConversation);

    // 10. Seed Saved Content / Resources
    this.savedResources = [
      {
        id: 'res-1',
        userId: defaultUserId,
        title: 'MIT OpenCourseWare: Linear Algebra Lecture Notes (Strang)',
        type: 'pdf',
        subject: 'Mathematics',
        description: 'Comprehensive 18-page reference syllabus covering vector spaces, nullspaces, and projection matrices.',
        fileSizeOrFormat: '2.4 MB · PDF',
        url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/',
        tags: ['Linear Algebra', 'MIT OCW', 'Textbook', 'Syllabus'],
        isBookmarked: true,
        dateAdded: '2026-09-18',
      },
      {
        id: 'res-2',
        userId: defaultUserId,
        title: 'Stanford CS161: Algorithm Design & Asymptotic Cheat Sheet',
        type: 'study_material',
        subject: 'Computer Science',
        description: 'Concise Big-O recurrence relations, Master Theorem trees, and graph traversal comparison charts.',
        fileSizeOrFormat: '1.1 MB · PDF',
        url: 'https://web.stanford.edu/class/cs161/',
        tags: ['Algorithms', 'Stanford CS', 'Cheat Sheet'],
        isBookmarked: true,
        dateAdded: '2026-09-20',
      },
    ];

    // 11. Seed Subscription
    const defaultSubscription: SubscriptionRecord = {
      userId: defaultUserId,
      planId: 'student',
      billingCycle: 'monthly',
      status: 'active',
      activatedAt: '2026-09-01',
      renewsAt: '2026-10-01',
      cancelAtPeriodEnd: false,
    };
    this.subscriptions.set(defaultUserId, defaultSubscription);
  }
}

export const db = new DatabaseStore();
