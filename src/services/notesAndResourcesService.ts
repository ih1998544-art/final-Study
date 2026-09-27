/**
 * Study Zone - Notes, Flashcards & Academic Resources Service
 * Persistent storage and management engine for student notes,
 * spaced-repetition flashcard decks, and library resources.
 */

import { StudyNote, FlashcardDeck, AcademicResourceItem } from '../types/notesAndResources';

const NOTES_KEY = 'sz_study_notes_v1';
const DECKS_KEY = 'sz_flashcard_decks_v1';
const RESOURCES_KEY = 'sz_academic_resources_v1';

export const INITIAL_NOTES: StudyNote[] = [
  {
    id: 'note-1',
    title: 'Cornell Notes: Linear Algebra Eigenvalues & Diagonalization',
    subject: 'Mathematics',
    category: 'STEM',
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
    summary:
      'Eigenvalues λ satisfy Av = λv. The characteristic equation det(A - λI) = 0 yields the roots. A matrix is diagonalizable if and only if algebraic multiplicity equals geometric multiplicity for every distinct eigenvalue.',
    content: `### 1. The Fundamental Eigenvalue Equation
Given an $n \\times n$ matrix $A$, a scalar $\\lambda$ is an eigenvalue if there exists a non-zero eigenvector $v$ such that:
$$Av = \\lambda v \\iff (A - \\lambda I)v = 0$$

### 2. Characteristic Equation
For non-trivial solutions ($v \\neq 0$), the transformation matrix $(A - \\lambda I)$ must be singular (non-invertible):
$$\\det(A - \\lambda I) = 0$$

### 3. Step-by-Step Diagonalization Process
1. Compute the determinant $\\det(A - \\lambda I)$ to produce the characteristic polynomial of degree $n$.
2. Solve the polynomial roots to find distinct eigenvalues $\\lambda_1, \\lambda_2, \\dots, \\lambda_k$.
3. For each eigenvalue $\\lambda_i$, find nullspace basis vectors by solving $(A - \\lambda_i I)v = 0$.
4. Construct matrix $P = [v_1 \\ v_2 \\ \\dots \\ v_n]$. If $P$ is invertible, then $D = P^{-1}AP$ is a diagonal matrix containing eigenvalues along the main diagonal.

### 4. Common Examination Pitfalls
- **Zero Eigenvalue**: An eigenvalue can be $0$ (this simply implies $\\det(A) = 0$). However, an eigenvector can never be the zero vector!
- **Defective Matrices**: If geometric multiplicity $< $ algebraic multiplicity, $A$ cannot be diagonalized; Jordan normal form must be utilized instead.`,
  },
  {
    id: 'note-2',
    title: 'Executive Brief: SN1 vs SN2 Nucleophilic Substitution Mechanisms',
    subject: 'Chemistry',
    category: 'STEM',
    tags: ['Organic Chemistry', 'SN1', 'SN2', 'Kinetics', 'Stereochemistry'],
    createdAt: '2026-09-23',
    updatedAt: '2026-09-25',
    isAiGenerated: true,
    aiToolSource: 'AI Summarizer',
    isPinned: true,
    summary:
      'SN1 is unimolecular, two-step via carbocation intermediate, favors tertiary substrates and polar protic solvents, leading to racemization. SN2 is bimolecular, concerted one-step backside attack, favors primary substrates and polar aprotic solvents, causing complete Walden inversion.',
    content: `### Comparative Diagnostic Matrix: SN1 vs SN2

| Characteristic | $S_N1$ (Unimolecular Substitution) | $S_N2$ (Bimolecular Substitution) |
| :--- | :--- | :--- |
| **Kinetics** | Rate = $k[R-X]$ (First Order) | Rate = $k[R-X][Nu^-]$ (Second Order) |
| **Reaction Mechanism** | 2 Steps: Carbocation intermediate | 1 Step: Concerted backside attack |
| **Substrate Preference** | $3^\\circ > 2^\\circ \\gg 1^\\circ$ (Carbocation stability) | $1^\\circ > 2^\\circ \\gg 3^\\circ$ (Steric hindrance) |
| **Nucleophile Strength** | Weak nucleophiles work ($H_2O, ROH$) | Requires strong, charged nucleophiles ($OH^-, CN^-, I^-$) |
| **Solvent Type** | Polar Protic (stabilizes ions: $H_2O, EtOH$) | Polar Aprotic (leaves nucleophile naked: $DMSO, DMF$) |
| **Stereochemistry** | Racemization (retention + inversion) | 100% Walden Stereochemical Inversion |
| **Rearrangements** | Possible (Hydride / Methyl shifts) | Impossible (No intermediate exists) |

### Key Exam Rule of Thumb
- Tertiary alkyl halide + weak base/nucleophile + water/alcohol $\\rightarrow$ **$S_N1$**
- Primary alkyl halide + strong nucleophile + acetone/DMSO $\\rightarrow$ **$S_N2$**`,
  },
  {
    id: 'note-3',
    title: 'Dynamic Programming: Bottom-Up Tabulation & State Transitions',
    subject: 'Computer Science',
    category: 'Tech',
    tags: ['Algorithms', 'Dynamic Programming', 'Memoization', 'Optimization'],
    createdAt: '2026-09-21',
    updatedAt: '2026-09-26',
    isAiGenerated: false,
    summary:
      'Overlapping subproblems + optimal substructure. Bottom-up tabulation eliminates recursion stack overhead and guarantees O(N) or O(N*W) polynomial runtime.',
    content: `### 1. Identifying Dynamic Programming Problems
A problem requires Dynamic Programming when two properties hold:
1. **Optimal Substructure**: An optimal solution to the problem contains optimal solutions to subproblems.
2. **Overlapping Subproblems**: The recursive algorithm solves identical subproblems repeatedly rather than generating new ones.

### 2. 0/1 Knapsack Tabulation Pattern
Given $N$ items with weights $w_i$ and values $v_i$, and maximum capacity $W$:
$$\\text{dp}[i][c] = \\max(\\text{dp}[i-1][c], \\ v_i + \\text{dp}[i-1][c - w_i])$$

\`\`\`typescript
function knapsack(weights: number[], values: number[], W: number): number {
  const n = weights.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const w = weights[i - 1];
    const v = values[i - 1];
    for (let c = 0; c <= W; c++) {
      if (w <= c) {
        dp[i][c] = Math.max(dp[i - 1][c], v + dp[i - 1][c - w]);
      } else {
        dp[i][c] = dp[i - 1][c];
      }
    }
  }
  return dp[n][W];
}
\`\`\`

### 3. Space Optimization Trick
Since row $i$ only depends on row $i-1$, we can compress the 2D matrix into a 1D array by iterating backward from $W$ down to $w_i$. Space complexity drops from $O(N \\times W)$ to $O(W)$!`,
  },
  {
    id: 'note-4',
    title: 'Keynesian Liquidity Trap & IS-LM Monetary Transmission',
    subject: 'Economics',
    category: 'Business & Economics',
    tags: ['Macroeconomics', 'IS-LM', 'Monetary Policy', 'Liquidity Trap'],
    createdAt: '2026-09-20',
    updatedAt: '2026-09-22',
    isAiGenerated: true,
    aiToolSource: 'AI Tutor',
    summary:
      'In a liquidity trap, nominal interest rates hit the Zero Lower Bound (ZLB). The LM curve becomes completely horizontal. Monetary expansion fails to stimulate aggregate demand; fiscal policy becomes fully effective with zero crowding out.',
    content: `### The Liquidity Trap Mechanics
1. **Zero Lower Bound (ZLB)**: Nominal interest rates approach zero ($i \\approx 0$).
2. **Infinite Elasticity of Money Demand**: Investors believe interest rates cannot drop any further (bond prices cannot rise). People hold any cash injected by the central bank as idle cash balances rather than purchasing securities.
3. **Horizontal LM Curve**: Shifting the money supply curve outward ($M/P \\uparrow$) fails to depress interest rates further.
4. **Fiscal Multiplier Maximization**: Government expenditure ($G \\uparrow$) shifts the IS curve rightward without increasing interest rates. Result: Zero crowding out of private investment ($I$).`,
  },
  {
    id: 'note-5',
    title: 'Thermodynamics: Carnot Heat Engines, Entropy & Second Law',
    subject: 'Physics',
    category: 'STEM',
    tags: ['Thermodynamics', 'Carnot', 'Entropy', 'Second Law'],
    createdAt: '2026-09-18',
    updatedAt: '2026-09-24',
    isAiGenerated: false,
    summary:
      'Carnot theorem establishes theoretical maximum efficiency between hot and cold reservoirs: eta = 1 - Tc/Th. Clausius theorem proves cyclic integral of dQ/T <= 0.',
    content: `### 1. Carnot Cycle Stages
The Carnot engine operates via 4 reversible thermodynamic strokes:
1. **Reversible Isothermal Expansion** at $T_h$: Heat $Q_h$ absorbed from hot reservoir.
2. **Reversible Adiabatic Expansion**: Gas cools from $T_h$ down to $T_c$; $Q = 0$.
3. **Reversible Isothermal Compression** at $T_c$: Heat $Q_c$ rejected to cold sink.
4. **Reversible Adiabatic Compression**: Gas warms from $T_c$ back up to $T_h$; $Q = 0$.

### 2. Efficiency Equation
$$\\eta_{\\text{carnot}} = 1 - \\frac{T_c}{T_h} = \\frac{W_{\\text{net}}}{Q_h}$$
*Note: Reservoir temperatures MUST be expressed in Kelvin (K)!*`,
  },
];

export const INITIAL_FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-1',
    title: 'Mathematics: Linear Algebra & Vector Calculus',
    subject: 'Mathematics',
    description: 'High-yield theorems, eigenvalues, characteristic equations, and multivariable operators.',
    badgeColor: 'emerald',
    createdAt: '2026-09-20',
    updatedAt: '2026-09-26',
    totalCards: 6,
    knownCount: 4,
    difficultCount: 2,
    cards: [
      {
        id: 'c-1',
        front: 'What is the characteristic equation used to solve for matrix eigenvalues?',
        back: 'det(A - λI) = 0, where A is the n×n square matrix, λ is the scalar eigenvalue, and I is the identity matrix.',
        hint: 'Think about when (A - λI)v = 0 has a non-zero eigenvector v.',
        status: 'known',
        reviewCount: 5,
        lastReviewed: 'Yesterday',
      },
      {
        id: 'c-2',
        front: 'What condition guarantees that an n×n matrix A is diagonalizable?',
        back: 'A has n linearly independent eigenvectors, or equivalently, the geometric multiplicity of each eigenvalue equals its algebraic multiplicity.',
        hint: 'Recall matrix P such that P⁻¹AP = D.',
        status: 'difficult',
        reviewCount: 6,
        lastReviewed: 'Yesterday',
      },
      {
        id: 'c-3',
        front: 'What does the gradient vector ∇f(x, y) geometrically represent?',
        back: 'The gradient vector points in the direction of greatest rate of increase of the scalar function f, and its magnitude equals this maximum rate.',
        hint: 'Perpendicular to level curves.',
        status: 'known',
        reviewCount: 4,
        lastReviewed: '2 days ago',
      },
      {
        id: 'c-4',
        front: 'State the Lagrange Multipliers equation for finding extrema of f(x,y) subject to constraint g(x,y) = k.',
        back: '∇f = λ ∇g, together with the constraint equation g(x, y) = k.',
        hint: 'Gradient vectors must be parallel at constrained extrema.',
        status: 'known',
        reviewCount: 3,
        lastReviewed: '3 days ago',
      },
      {
        id: 'c-5',
        front: 'What is a defective matrix?',
        back: 'A square matrix that does not have a complete basis of eigenvectors (its geometric multiplicity is strictly less than its algebraic multiplicity for at least one eigenvalue).',
        hint: 'Cannot be diagonalized.',
        status: 'difficult',
        reviewCount: 4,
        lastReviewed: 'Yesterday',
      },
      {
        id: 'c-6',
        front: 'What is the trace of a square matrix A in terms of its eigenvalues?',
        back: 'The trace of A (sum of diagonal entries) equals the sum of all its eigenvalues: Tr(A) = Σ λᵢ.',
        hint: 'Also det(A) = Π λᵢ.',
        status: 'known',
        reviewCount: 4,
        lastReviewed: '3 days ago',
      },
    ],
  },
  {
    id: 'deck-2',
    title: 'Chemistry: Organic Reaction Mechanisms & Stereochemistry',
    subject: 'Chemistry',
    description: 'SN1, SN2, E1, E2, Markovnikov addition, carbocation stability, and chiral centers.',
    badgeColor: 'amber',
    createdAt: '2026-09-21',
    updatedAt: '2026-09-25',
    totalCards: 5,
    knownCount: 3,
    difficultCount: 2,
    cards: [
      {
        id: 'c-7',
        front: 'What stereochemical outcome occurs in an SN2 reaction?',
        back: '100% Walden Inversion (complete inversion of configuration at the stereocenter) due to backside attack.',
        hint: 'Like an umbrella flipping inside out in strong wind.',
        status: 'known',
        reviewCount: 4,
        lastReviewed: 'Sep 24',
      },
      {
        id: 'c-8',
        front: 'Why does an SN1 reaction lead to partial or complete racemization?',
        back: 'Because the carbocation intermediate is planar (sp² hybridized) and achiral; the nucleophile can attack from either face with equal probability.',
        hint: 'Trigonal planar geometry.',
        status: 'known',
        reviewCount: 5,
        lastReviewed: 'Sep 24',
      },
      {
        id: 'c-9',
        front: 'What is Markovnikov’s Rule in electrophilic additions across an alkene?',
        back: 'The electrophile (usually hydrogen H⁺) adds to the carbon with the greater number of hydrogens, generating the more stable carbocation intermediate.',
        hint: 'The rich get richer in hydrogen.',
        status: 'known',
        reviewCount: 3,
        lastReviewed: 'Sep 23',
      },
      {
        id: 'c-10',
        front: 'Which solvent type favors SN2 reactions over SN1 reactions?',
        back: 'Polar Aprotic solvents (such as DMSO, DMF, Acetone, Acetonitrile). They do not hydrogen bond to the nucleophile, leaving it highly reactive ("naked").',
        hint: 'No hydrogen bonding with anions.',
        status: 'difficult',
        reviewCount: 5,
        lastReviewed: 'Yesterday',
      },
      {
        id: 'c-11',
        front: 'What is the rate law for an E2 elimination reaction?',
        back: 'Rate = k [Substrate] [Base]. It is a concerted, bimolecular second-order process requiring periplanar geometry.',
        hint: 'Bimolecular like SN2.',
        status: 'difficult',
        reviewCount: 4,
        lastReviewed: 'Sep 24',
      },
    ],
  },
  {
    id: 'deck-3',
    title: 'Physics: Classical Mechanics & Rotational Dynamics',
    subject: 'Physics',
    description: 'Angular momentum, torque, moment of inertia, Carnot engines, and oscillations.',
    badgeColor: 'purple',
    createdAt: '2026-09-19',
    updatedAt: '2026-09-24',
    totalCards: 5,
    knownCount: 4,
    difficultCount: 1,
    cards: [
      {
        id: 'c-12',
        front: 'What is the rotational analogue of Newton\'s Second Law F = ma?',
        back: 'τ_net = I α (or τ_net = dL/dt), where τ is torque, I is moment of inertia, α is angular acceleration, and L is angular momentum.',
        hint: 'Moment of inertia replaces mass.',
        status: 'known',
        reviewCount: 4,
        lastReviewed: 'Sep 25',
      },
      {
        id: 'c-13',
        front: 'Under what condition is total angular momentum L conserved for a system?',
        back: 'When the net external torque acting on the system is zero (Σ τ_ext = 0).',
        hint: 'dL/dt = τ_ext.',
        status: 'known',
        reviewCount: 5,
        lastReviewed: 'Sep 25',
      },
      {
        id: 'c-14',
        front: 'What is the formula for the maximum theoretical efficiency of a Carnot heat engine?',
        back: 'η = 1 - (T_cold / T_hot), where temperatures are expressed in Kelvin.',
        hint: 'Depends solely on reservoir temperatures.',
        status: 'known',
        reviewCount: 6,
        lastReviewed: 'Sep 26',
      },
      {
        id: 'c-15',
        front: 'What is the Parallel Axis Theorem for moment of inertia?',
        back: 'I = I_cm + M d², where I_cm is moment of inertia about the center of mass, M is total mass, and d is perpendicular distance between the two parallel axes.',
        hint: 'Shifting axes always increases moment of inertia.',
        status: 'known',
        reviewCount: 3,
        lastReviewed: 'Sep 22',
      },
      {
        id: 'c-16',
        front: 'How is torque defined vectorially?',
        back: 'τ = r × F, where r is the position vector from the pivot to the point of force application, and F is the applied force vector. Magnitude: |τ| = r F sin(θ).',
        hint: 'Cross product of position and force.',
        status: 'difficult',
        reviewCount: 4,
        lastReviewed: 'Sep 24',
      },
    ],
  },
  {
    id: 'deck-4',
    title: 'Computer Science: Algorithms & Complexity',
    subject: 'Computer Science',
    description: 'Big-O bounds, graph traversal, dynamic programming patterns, and memory trees.',
    badgeColor: 'sky',
    createdAt: '2026-09-18',
    updatedAt: '2026-09-25',
    totalCards: 5,
    knownCount: 4,
    difficultCount: 1,
    cards: [
      {
        id: 'c-17',
        front: 'What is the time complexity of Dijkstra’s Algorithm using a min-heap priority queue?',
        back: 'O((V + E) log V), where V is the number of vertices and E is the number of edges.',
        hint: 'Logarithmic decrease-key operations.',
        status: 'known',
        reviewCount: 5,
        lastReviewed: 'Sep 25',
      },
      {
        id: 'c-18',
        front: 'What are the two necessary properties required to apply Dynamic Programming?',
        back: '1. Optimal Substructure (optimal solution contains optimal sub-solutions).\n2. Overlapping Subproblems (subproblems recur repeatedly).',
        hint: 'Bellman\'s Principle of Optimality.',
        status: 'known',
        reviewCount: 6,
        lastReviewed: 'Sep 25',
      },
      {
        id: 'c-19',
        front: 'What is the difference between Memoization (Top-Down) and Tabulation (Bottom-Up)?',
        back: 'Memoization is recursive and caches results on demand as needed. Tabulation is iterative, fills an array/table in topological order, and avoids recursion call-stack overhead.',
        hint: 'Recursive vs Iterative table filling.',
        status: 'known',
        reviewCount: 4,
        lastReviewed: 'Sep 24',
      },
      {
        id: 'c-20',
        front: 'Why cannot Dijkstra’s algorithm handle graphs with negative edge weights?',
        back: 'Dijkstra greedily assumes that once a vertex is marked visited with the lowest distance, its distance is final. A negative edge encountered later could produce a shorter path, violating the greedy invariant.',
        hint: 'Use Bellman-Ford instead.',
        status: 'difficult',
        reviewCount: 5,
        lastReviewed: 'Sep 23',
      },
      {
        id: 'c-21',
        front: 'What is the height of an AVL self-balancing binary search tree with n nodes?',
        back: 'O(log n). The balance factor of every node (height of left subtree minus height of right subtree) is strictly kept within {-1, 0, +1} using tree rotations.',
        hint: 'Rigorous balance guarantee.',
        status: 'known',
        reviewCount: 4,
        lastReviewed: 'Sep 22',
      },
    ],
  },
];

export const INITIAL_ACADEMIC_RESOURCES: AcademicResourceItem[] = [
  // PDFs
  {
    id: 'res-pdf-1',
    title: 'University Term Past Examination Paper & Formal Mark Scheme',
    type: 'pdf',
    subject: 'Mathematics',
    description: 'Complete official past paper containing 12 analytical free-response questions with step-by-step mark allocations and grading guidelines.',
    dateAdded: '2026-09-24',
    fileSizeOrFormat: '2.8 MB PDF',
    tags: ['Past Paper', 'Exam', 'Mark Scheme', 'Calculus'],
    isBookmarked: true,
    previewContent: 'Section A: Matrix Diagonalization (25 marks)\nSection B: Multivariable Optimization & Boundary Conditions (35 marks)\nSection C: Differential Equation Systems (40 marks)',
  },
  {
    id: 'res-pdf-2',
    title: 'Comprehensive Physical Formulas, Constants & SI Dimensions Guide',
    type: 'pdf',
    subject: 'Physics',
    description: 'Condensed formula reference approved for university exams covering classical mechanics, thermodynamics, electromagnetism, and modern optics.',
    dateAdded: '2026-09-23',
    fileSizeOrFormat: '1.4 MB PDF',
    tags: ['Formula Sheet', 'Constants', 'Mechanics', 'Thermodynamics'],
    isBookmarked: true,
    previewContent: 'Kinematics: v = v₀ + at, x = x₀ + v₀t + ½at²\nTorque: τ = r × F, L = Iω\nThermodynamics: dU = dQ - dW, η = 1 - Tc/Th',
  },
  {
    id: 'res-pdf-3',
    title: 'Organic Chemistry Reaction Pathways & Reagents Reference Matrix',
    type: 'pdf',
    subject: 'Chemistry',
    description: 'High-density synthesis roadmap mapping functional group transformations across alkenes, alkynes, alcohols, halides, and carbonyls.',
    dateAdded: '2026-09-22',
    fileSizeOrFormat: '3.1 MB PDF',
    tags: ['Organic Chemistry', 'Reactions', 'Reagents', 'Synthesis'],
    isBookmarked: false,
    previewContent: 'Alkene to Alkyl Halide: HX via Markovnikov carbocation\nAlcohol to Alkene: H₂SO₄ heat (Zaitsev elimination)\nPrimary Alcohol to Carboxylic Acid: Jones reagent (CrO₃, H₂SO₄)',
  },
  {
    id: 'res-pdf-4',
    title: 'Algorithms, Data Structures & Asymptotic Complexities Field Guide',
    type: 'pdf',
    subject: 'Computer Science',
    description: 'Complete Big-O reference sheet for sorting, search, balanced trees, graph traversal, and amortized hash table complexities.',
    dateAdded: '2026-09-20',
    fileSizeOrFormat: '940 KB PDF',
    tags: ['Algorithms', 'Big-O', 'Data Structures', 'Cheat Sheet'],
    isBookmarked: false,
    previewContent: 'Sorting: QuickSort avg O(n log n), MergeSort O(n log n) stable\nGraphs: Dijkstra O((V+E)log V), Floyd-Warshall O(V³)\nTrees: Red-Black O(log n) search/insert/delete',
  },

  // Saved Lessons
  {
    id: 'res-lesson-1',
    title: 'Linear Systems & Matrix Inverses (Mathematics Chapter 1)',
    type: 'saved_lesson',
    subject: 'Mathematics',
    description: 'Complete interactive curriculum unit on Gaussian elimination, row echelon forms, and invertible matrix theorems.',
    dateAdded: '2026-09-25',
    fileSizeOrFormat: 'Interactive Lesson',
    tags: ['Lesson', 'Matrix', 'Gaussian Elimination'],
    isBookmarked: true,
    previewContent: 'Key Lesson Takeaway: A square matrix A is invertible if and only if det(A) ≠ 0 and row reduction yields the identity matrix I.',
  },
  {
    id: 'res-lesson-2',
    title: 'Angular Momentum & Torque Derivations (Physics Chapter 2)',
    type: 'saved_lesson',
    subject: 'Physics',
    description: 'Mastery module analyzing cross products, conservation of angular momentum in central force fields, and gyroscope precession.',
    dateAdded: '2026-09-24',
    fileSizeOrFormat: 'Interactive Lesson',
    tags: ['Lesson', 'Rotational Dynamics', 'Torque'],
    isBookmarked: true,
    previewContent: 'Key Lesson Takeaway: When no external torque acts, I₁ω₁ = I₂ω₂. Decreasing moment of inertia causes instantaneous angular velocity acceleration.',
  },
  {
    id: 'res-lesson-3',
    title: 'Electrophilic Addition & Markovnikov Rule (Chemistry Chapter 2)',
    type: 'saved_lesson',
    subject: 'Chemistry',
    description: 'Step-by-step mechanism analysis for hydrohalogenation, hydration, and carbocation rearrangement stability.',
    dateAdded: '2026-09-21',
    fileSizeOrFormat: 'Interactive Lesson',
    tags: ['Lesson', 'Mechanisms', 'Alkenes'],
    isBookmarked: false,
    previewContent: 'Key Lesson Takeaway: Carbocation stability order: 3° > 2° > 1° > methyl. Hydride shifts occur rapidly when adjacent tertiary carbon exists.',
  },

  // Saved AI Responses
  {
    id: 'res-ai-1',
    title: 'Socratic Explanation: Why det(A - λI) = 0 Yields Eigenvalues',
    type: 'saved_ai_response',
    subject: 'Mathematics',
    description: 'AI Tutor guided dialogue proving why singular transformations are necessary for non-zero eigenvector existence.',
    dateAdded: '2026-09-26',
    fileSizeOrFormat: 'Saved AI Dialogue',
    tags: ['AI Tutor', 'Proof', 'Eigenvalues'],
    isBookmarked: true,
    previewContent: 'AI Tutor: "If det(A - λI) were non-zero, then (A - λI) would be invertible. Multiplying by its inverse would force v = (A - λI)⁻¹(0) = 0. But by definition, an eigenvector cannot be 0!"',
  },
  {
    id: 'res-ai-2',
    title: 'Feynman Visual Analogy: Entropy as Microstate Combinatorics',
    type: 'saved_ai_response',
    subject: 'Physics',
    description: 'Concept Explainer breakdown using shuffled decks of cards and ink drops in water to build intuitive grasp of Boltzmann entropy S = k ln W.',
    dateAdded: '2026-09-25',
    fileSizeOrFormat: 'Saved AI Explanation',
    tags: ['Concept Explainer', 'Entropy', 'Boltzmann'],
    isBookmarked: false,
    previewContent: 'AI Explainer: "There is only 1 microstate where a brand-new card deck is perfectly ordered by suit, but 52! (~8×10⁶⁷) disordered microstates. Entropy increases simply because disorder is overwhelmingly more probable."',
  },

  // Study Materials
  {
    id: 'res-material-1',
    title: 'Top 10 Deadly Pitfalls & Anti-Trap Diagnostic Rubric 2026',
    type: 'study_material',
    subject: 'General Academic',
    description: 'Curated list of the most frequent examination errors identified across college midterms with verified counter-strategies.',
    dateAdded: '2026-09-24',
    fileSizeOrFormat: 'Strategy Document',
    tags: ['Exam Prep', 'Pitfalls', 'Examiner Traps'],
    isBookmarked: true,
    previewContent: 'Trap 1: Omitting +C in indefinite integrals.\nTrap 2: Forgetting to convert temperatures into Kelvin for thermodynamics.\nTrap 3: Inverting inequality when multiplying by unknown variable.',
  },

  // Important Links
  {
    id: 'res-link-1',
    title: 'MIT OpenCourseWare: Mathematics & Linear Algebra Archive',
    type: 'important_link',
    subject: 'Mathematics',
    description: 'Complete lecture videos, problem sets with solutions, and final exams from Professor Gilbert Strang\'s famous 18.06 course.',
    dateAdded: '2026-09-20',
    fileSizeOrFormat: 'External Course Library',
    url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/',
    externalLinkText: 'Visit MIT OCW 18.06',
    tags: ['MIT', 'Video Lectures', 'Problem Sets'],
    isBookmarked: true,
  },
  {
    id: 'res-link-2',
    title: 'Desmos Advanced Graphing Calculator & Matrix Sandbox',
    type: 'important_link',
    subject: 'Mathematics',
    description: 'Interactive computational graphing calculator with live slider animations for function extrema and vector fields.',
    dateAdded: '2026-09-18',
    fileSizeOrFormat: 'Web Computation Tool',
    url: 'https://www.desmos.com/calculator',
    externalLinkText: 'Launch Desmos Calculator',
    tags: ['Graphing', 'Calculus', 'Visualization'],
    isBookmarked: true,
  },
  {
    id: 'res-link-3',
    title: 'WolframAlpha Computational Intelligence Engine',
    type: 'important_link',
    subject: 'STEM',
    description: 'Authoritative algebraic step-by-step derivations, integration steps, and chemical reaction balancing solver.',
    dateAdded: '2026-09-15',
    fileSizeOrFormat: 'Symbolic Solver',
    url: 'https://www.wolframalpha.com',
    externalLinkText: 'Open WolframAlpha',
    tags: ['Solver', 'Step-by-Step', 'STEM'],
    isBookmarked: false,
  },
];

class NotesAndResourcesService {
  // NOTES MANAGEMENT
  getNotes(): StudyNote[] {
    try {
      const stored = localStorage.getItem(NOTES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_NOTES;
  }

  saveNotes(notes: StudyNote[]): void {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) {
      console.warn('Failed to save notes', e);
    }
  }

  createNote(noteData: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>): StudyNote {
    const notes = this.getNotes();
    const today = new Date().toISOString().split('T')[0];
    const newNote: StudyNote = {
      ...noteData,
      id: `note_${Date.now()}`,
      createdAt: today,
      updatedAt: today,
    };
    notes.unshift(newNote);
    this.saveNotes(notes);

    // Sync to backend API
    fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote),
    }).catch(() => {});

    return newNote;
  }

  updateNote(noteId: string, updates: Partial<StudyNote>): StudyNote | null {
    const notes = this.getNotes();
    const index = notes.findIndex((n) => n.id === noteId);
    if (index === -1) return null;

    const updatedNote: StudyNote = {
      ...notes[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    notes[index] = updatedNote;
    this.saveNotes(notes);

    // Sync to backend API
    fetch(`/api/notes/${noteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(() => {});

    return updatedNote;
  }

  deleteNote(noteId: string): boolean {
    const notes = this.getNotes();
    const filtered = notes.filter((n) => n.id !== noteId);
    if (filtered.length !== notes.length) {
      this.saveNotes(filtered);
      // Sync to backend API
      fetch(`/api/notes/${noteId}`, { method: 'DELETE' }).catch(() => {});
      return true;
    }
    return false;
  }

  // FLASHCARDS MANAGEMENT
  getDecks(): FlashcardDeck[] {
    try {
      const stored = localStorage.getItem(DECKS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_FLASHCARD_DECKS;
  }

  saveDecks(decks: FlashcardDeck[]): void {
    try {
      localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
    } catch (e) {
      console.warn('Failed to save decks', e);
    }
  }

  createDeck(deckData: { title: string; subject: string; description: string; badgeColor?: string }): FlashcardDeck {
    const decks = this.getDecks();
    const today = new Date().toISOString().split('T')[0];
    const newDeck: FlashcardDeck = {
      id: `deck_${Date.now()}`,
      title: deckData.title,
      subject: deckData.subject,
      description: deckData.description,
      badgeColor: deckData.badgeColor || 'emerald',
      cards: [],
      totalCards: 0,
      knownCount: 0,
      difficultCount: 0,
      createdAt: today,
      updatedAt: today,
    };
    decks.unshift(newDeck);
    this.saveDecks(decks);

    // Sync to backend API
    fetch('/api/flashcards/decks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDeck),
    }).catch(() => {});

    return newDeck;
  }

  addCardToDeck(deckId: string, cardData: { front: string; back: string; hint?: string }): FlashcardDeck | null {
    const decks = this.getDecks();
    const deck = decks.find((d) => d.id === deckId);
    if (!deck) return null;

    const newCard = {
      id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      front: cardData.front,
      back: cardData.back,
      hint: cardData.hint,
      status: 'unseen' as const,
      reviewCount: 0,
    };
    deck.cards.push(newCard);
    deck.totalCards = deck.cards.length;
    deck.updatedAt = new Date().toISOString().split('T')[0];
    this.saveDecks(decks);

    // Sync to backend API
    fetch(`/api/flashcards/decks/${deckId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cards: deck.cards }),
    }).catch(() => {});

    return deck;
  }

  updateCardStatus(deckId: string, cardId: string, status: 'known' | 'difficult'): FlashcardDeck | null {
    const decks = this.getDecks();
    const deck = decks.find((d) => d.id === deckId);
    if (!deck) return null;

    const card = deck.cards.find((c) => c.id === cardId);
    if (!card) return null;

    card.status = status;
    card.reviewCount += 1;
    card.lastReviewed = 'Today';

    // Recalculate deck counts
    deck.knownCount = deck.cards.filter((c) => c.status === 'known').length;
    deck.difficultCount = deck.cards.filter((c) => c.status === 'difficult').length;
    deck.updatedAt = new Date().toISOString().split('T')[0];

    this.saveDecks(decks);

    // Sync to backend API
    fetch(`/api/flashcards/decks/${deckId}/cards/${cardId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});

    return deck;
  }

  deleteDeck(deckId: string): boolean {
    const decks = this.getDecks();
    const filtered = decks.filter((d) => d.id !== deckId);
    if (filtered.length !== decks.length) {
      this.saveDecks(filtered);
      // Sync to backend API
      fetch(`/api/flashcards/decks/${deckId}`, { method: 'DELETE' }).catch(() => {});
      return true;
    }
    return false;
  }

  // RESOURCES MANAGEMENT
  getResources(): AcademicResourceItem[] {
    try {
      const stored = localStorage.getItem(RESOURCES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_ACADEMIC_RESOURCES;
  }

  saveResources(resources: AcademicResourceItem[]): void {
    try {
      localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources));
    } catch (e) {
      console.warn('Failed to save resources', e);
    }
  }

  addResource(item: Omit<AcademicResourceItem, 'id' | 'dateAdded'>): AcademicResourceItem {
    const resources = this.getResources();
    const today = new Date().toISOString().split('T')[0];
    const newRes: AcademicResourceItem = {
      ...item,
      id: `res_${Date.now()}`,
      dateAdded: today,
    };
    resources.unshift(newRes);
    this.saveResources(resources);

    // Sync to backend API
    fetch('/api/saved-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRes),
    }).catch(() => {});

    return newRes;
  }

  toggleBookmark(resourceId: string): AcademicResourceItem | null {
    const resources = this.getResources();
    const item = resources.find((r) => r.id === resourceId);
    if (!item) return null;

    item.isBookmarked = !item.isBookmarked;
    this.saveResources(resources);

    // Sync to backend API
    fetch(`/api/saved-content/${resourceId}/bookmark`, { method: 'PUT' }).catch(() => {});

    return item;
  }

  deleteResource(resourceId: string): boolean {
    const resources = this.getResources();
    const filtered = resources.filter((r) => r.id !== resourceId);
    if (filtered.length !== resources.length) {
      this.saveResources(filtered);
      // Sync to backend API
      fetch(`/api/saved-content/${resourceId}`, { method: 'DELETE' }).catch(() => {});
      return true;
    }
    return false;
  }
}

export const notesAndResourcesService = new NotesAndResourcesService();
