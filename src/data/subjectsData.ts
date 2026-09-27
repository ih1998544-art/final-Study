import { SubjectItem, Chapter, Topic, Lesson, SubjectCategory } from '../types';

/**
 * Builds realistic, rich chapters and lessons for any academic subject.
 */
function createCurriculumForSubject(
  subjectId: string,
  subjectName: string,
  chapterSpecs: {
    number: number;
    title: string;
    description: string;
    topics: {
      title: string;
      description: string;
      lessonTitle: string;
      durationMinutes: number;
      overview: string;
      explanation: string;
      keyTakeaways: string[];
      exampleTitle: string;
      exampleDetail: string;
      formulaOrCode?: string;
      checkQuestion: {
        question: string;
        options: string[];
        correctIndex: number;
        explanation: string;
      };
    }[];
  }[]
): Chapter[] {
  return chapterSpecs.map((chSpec, chIdx) => {
    const chId = `${subjectId}-ch${chSpec.number}`;
    const topics: Topic[] = chSpec.topics.map((tSpec, tIdx) => {
      const topId = `${chId}-top${tIdx + 1}`;
      const lessonId = `${topId}-les1`;

      const lesson: Lesson = {
        id: lessonId,
        title: tSpec.lessonTitle,
        durationMinutes: tSpec.durationMinutes,
        summary: tSpec.overview,
        completed: chIdx === 0 && tIdx === 0, // first lesson completed as sample progress
        xp: 35,
        content: {
          overview: tSpec.overview,
          explanation: tSpec.explanation,
          keyTakeaways: tSpec.keyTakeaways,
          examples: [
            {
              title: tSpec.exampleTitle,
              detail: tSpec.exampleDetail,
            },
          ],
          formulaOrCodeSnippet: tSpec.formulaOrCode,
          checkQuestion: tSpec.checkQuestion,
        },
      };

      return {
        id: topId,
        title: tSpec.title,
        description: tSpec.description,
        progressPercentage: chIdx === 0 && tIdx === 0 ? 100 : 0,
        status: chIdx === 0 && tIdx === 0 ? 'completed' : tIdx === 0 ? 'in_progress' : 'locked',
        lessons: [lesson],
      };
    });

    const completedTopics = topics.filter((t) => t.progressPercentage === 100).length;
    const progressPercentage = Math.round((completedTopics / topics.length) * 100);

    return {
      id: chId,
      number: chSpec.number,
      title: chSpec.title,
      description: chSpec.description,
      progressPercentage,
      topics,
    };
  });
}

// 1. Mathematics
const mathChapters = createCurriculumForSubject('subj-math', 'Mathematics', [
  {
    number: 1,
    title: 'Differential Calculus & Real Analysis',
    description: 'Epsilon-delta limits, instantaneous rates of change, and optimization.',
    topics: [
      {
        title: 'Limits & Asymptotics',
        description: 'Behavior of functions approaching indeterminate boundaries.',
        lessonTitle: 'The Epsilon-Delta Definition of Limit',
        durationMinutes: 18,
        overview: 'Formalizing how f(x) gets arbitrarily close to L as x approaches c.',
        explanation: 'For every ε > 0, there exists a δ > 0 such that if 0 < |x - c| < δ, then |f(x) - L| < ε.',
        keyTakeaways: [
          'Guarantees continuity when lim_{x->c} f(x) = f(c).',
          'Eliminates hand-wavy infinitesimal reasoning.',
          'Underpins derivatives and integrals in analysis.'
        ],
        exampleTitle: 'Linear Function Limit',
        exampleDetail: 'Proving lim_{x->3} (2x + 1) = 7 by selecting δ = ε / 2.',
        formulaOrCode: '∀ε > 0, ∃δ > 0: 0 < |x - c| < δ ⟹ |f(x) - L| < ε',
        checkQuestion: {
          question: 'If lim_{x->2} f(x) = 5 and f(2) = 5, what can be concluded about f at x = 2?',
          options: ['f is continuous at x = 2', 'f is differentiable at x = 2', 'f has a vertical asymptote', 'f is strictly increasing'],
          correctIndex: 0,
          explanation: 'When the limit equals the function value at a point, the function is by definition continuous at that point.'
        }
      },
      {
        title: 'Derivatives & Chain Rule',
        description: 'Instantaneous rate of change and composite function differentiation.',
        lessonTitle: 'Composite Differentiation & The Chain Rule',
        durationMinutes: 20,
        overview: 'Differentiating nested functions f(g(x)).',
        explanation: 'd/dx [f(g(x))] = f’(g(x)) · g’(x). Rates of change multiply sequentially across dependent variables.',
        keyTakeaways: [
          'Outer derivative evaluated at inner function multiplied by inner derivative.',
          'Essential in neural network backpropagation gradient updates.',
          'Applies iteratively to arbitrarily nested functions.'
        ],
        exampleTitle: 'Trigonometric Composite',
        exampleDetail: 'd/dx [sin(x²)] = cos(x²) · (2x) = 2x cos(x²).',
        formulaOrCode: 'd/dx [f(g(x))] = f\'(g(x)) · g\'(x)',
        checkQuestion: {
          question: 'What is the derivative of h(x) = (3x² + 1)⁴?',
          options: ['24x(3x² + 1)³', '4(3x² + 1)³', '12x(3x² + 1)³', '24x²(3x² + 1)³'],
          correctIndex: 0,
          explanation: 'By the chain rule: 4(3x² + 1)³ · d/dx[3x² + 1] = 4(3x² + 1)³ · (6x) = 24x(3x² + 1)³.'
        }
      }
    ]
  },
  {
    number: 2,
    title: 'Linear Algebra & Vector Spaces',
    description: 'Matrices, linear transformations, eigenvalues, and spectral decomposition.',
    topics: [
      {
        title: 'Eigenvalues & Eigenvectors',
        description: 'Invariant directions of linear transformations in n-dimensional space.',
        lessonTitle: 'Characteristic Equations & Diagonalization',
        durationMinutes: 22,
        overview: 'Vectors whose directions are preserved under matrix multiplication.',
        explanation: 'A vector v is an eigenvector of A with eigenvalue λ if A v = λ v. Solved via det(A - λI) = 0.',
        keyTakeaways: [
          'Eigenvectors identify the principal axes of transformation.',
          'Diagonalizing A = P D P⁻¹ dramatically speeds up matrix exponentiation.',
          'Used in Google PageRank, PCA dimensionality reduction, and quantum states.'
        ],
        exampleTitle: '2x2 Diagonal Matrix',
        exampleDetail: 'For A = [[3, 0], [0, 5]], eigenvectors are standard basis vectors with eigenvalues 3 and 5.',
        formulaOrCode: 'A v = λ v  ⟺  det(A - λ I) = 0',
        checkQuestion: {
          question: 'What is the trace of a square matrix equal to in terms of its eigenvalues?',
          options: ['The sum of its eigenvalues', 'The product of its eigenvalues', 'The difference of eigenvalues', 'Zero'],
          correctIndex: 0,
          explanation: 'The trace (sum of diagonal entries) of a matrix always equals the sum of its eigenvalues counted with algebraic multiplicity.'
        }
      }
    ]
  }
]);

// 2. Physics
const physicsChapters = createCurriculumForSubject('subj-physics', 'Physics', [
  {
    number: 1,
    title: 'Classical Mechanics & Dynamics',
    description: 'Kinematics, Newton’s laws, momentum conservation, and energy fields.',
    topics: [
      {
        title: "Newton's Laws of Motion",
        description: 'Inertia, fundamental force equations, and reciprocal action-reaction.',
        lessonTitle: "Second Law: Force & Momentum Rate",
        durationMinutes: 20,
        overview: "The central dynamical law of classical physics: F_net = ma.",
        explanation: 'Net external force acting on a body equals the time rate of change of its momentum: F = dp/dt = m(dv/dt) = ma.',
        keyTakeaways: [
          'Acceleration is proportional to net force and inverse to mass.',
          'Units: 1 Newton = 1 kg·m/s².',
          'Force and acceleration vectors are strictly collinear.'
        ],
        exampleTitle: 'Inclined Plane Acceleration',
        exampleDetail: 'A block sliding down a frictionless ramp of angle θ accelerates at a = g sin(θ).',
        formulaOrCode: 'F_net = ΣF = m · a\np = m · v ⟹ F = dp / dt',
        checkQuestion: {
          question: 'If the net force on an object is zero, which of the following MUST be true?',
          options: ['Its acceleration is zero', 'Its velocity is zero', 'Its kinetic energy is zero', 'It is at absolute rest'],
          correctIndex: 0,
          explanation: 'By Newton’s First and Second Laws, zero net force implies zero acceleration (constant velocity, which may or may not be zero).'
        }
      },
      {
        title: 'Work & Energy Conservation',
        description: 'Work-energy theorem, conservative force fields, and potential energy.',
        lessonTitle: 'The Work-Kinetic Energy Theorem',
        durationMinutes: 18,
        overview: 'Relating mechanical work done by forces to change in kinetic energy.',
        explanation: 'Work is the line integral of force along a path: W = ∫ F · dr. Net work done on a particle equals ΔKE = (1/2)m v_f² - (1/2)m v_i².',
        keyTakeaways: [
          'Work is a scalar quantity measured in Joules (N·m).',
          'Only forces parallel to motion perform non-zero work.',
          'Conservative forces have zero net work along any closed loop.'
        ],
        exampleTitle: 'Automobile Braking Distance',
        exampleDetail: 'Braking work W = -f_k · d = 0 - (1/2)mv², showing stopping distance scales with the square of speed.',
        formulaOrCode: 'W_net = ΔKE = (1/2)m v_f² - (1/2)m v_i²',
        checkQuestion: {
          question: 'If you double the speed of a car, by what factor does its kinetic energy increase?',
          options: ['4 times', '2 times', 'Square root of 2', '8 times'],
          correctIndex: 0,
          explanation: 'Since KE = (1/2)mv², doubling velocity quadruples kinetic energy (2² = 4).'
        }
      }
    ]
  },
  {
    number: 2,
    title: 'Electromagnetism & Wave Physics',
    description: 'Maxwell equations, electromagnetic radiation, and wave-particle duality.',
    topics: [
      {
        title: 'Gauss’s Law & Electric Fields',
        description: 'Flux of electric fields through closed Gaussian surfaces.',
        lessonTitle: 'Electric Flux and Enclosed Charge',
        durationMinutes: 22,
        overview: 'Relating the distribution of electric charge to the resulting electric field.',
        explanation: 'The total electric flux through any closed Gaussian surface equals the net enclosed charge divided by permittivity of free space: ∮ E · dA = Q_enc / ε₀.',
        keyTakeaways: [
          'Simplifies field calculations for spherical, cylindrical, and planar symmetries.',
          'Electric field inside a hollow charged conductor is identically zero.',
          'One of the four Maxwell equations foundational to modern telecommunications.'
        ],
        exampleTitle: 'Charged Conducting Sphere',
        exampleDetail: 'Outside the sphere (r > R), the field behaves identically to a point charge: E = kQ / r².',
        formulaOrCode: 'Φ_E = ∮ E · dA = Q_enclosed / ε₀',
        checkQuestion: {
          question: 'What is the electric field inside an electrostatic conductor in equilibrium?',
          options: ['Zero everywhere inside', 'Uniform and infinite', 'Dependent on the shape', 'Opposite to outer charge'],
          correctIndex: 0,
          explanation: 'Charges redistribute exclusively to the outer surface until the internal electric field completely cancels out to zero.'
        }
      }
    ]
  }
]);

// 3. Chemistry
const chemistryChapters = createCurriculumForSubject('subj-chemistry', 'Chemistry', [
  {
    number: 1,
    title: 'Organic Reaction Mechanisms',
    description: 'Nucleophilic substitution, elimination reactions, and carbonyl chemistry.',
    topics: [
      {
        title: 'SN1 vs SN2 Mechanisms',
        description: 'Kinetics, stereochemistry, carbocation intermediates, and solvent effects.',
        lessonTitle: 'Bimolecular Nucleophilic Substitution (SN2)',
        durationMinutes: 20,
        overview: 'Single-step backside attack causing inversion of stereochemical configuration.',
        explanation: 'SN2 proceeds via a concerted transition state with second-order kinetics: Rate = k[Substrate][Nucleophile]. Steric hindrance governs reactivity (Methyl > 1° > 2° >> 3°).',
        keyTakeaways: [
          'Causes Walden inversion (stereochemical flip from R to S or vice versa).',
          'Favored by strong nucleophiles and polar aprotic solvents (DMSO, Acetone).',
          'Tertiary substrates do not undergo SN2 due to severe steric congestion.'
        ],
        exampleTitle: 'Bromoethane to Ethanol',
        exampleDetail: 'Hydroxide ion attacks primary ethyl bromide from the rear, displacing bromide in a single concerted step.',
        formulaOrCode: 'Rate = k · [Alkyl Halide] · [Nucleophile]',
        checkQuestion: {
          question: 'Which substrate reacts fastest in an SN2 substitution mechanism?',
          options: ['Chloromethane (Methyl)', '2-Chloropropane (Secondary)', '2-Chloro-2-methylpropane (Tertiary)', 'Chlorobenzene'],
          correctIndex: 0,
          explanation: 'Methyl halides have minimal steric hindrance, allowing unhindered nucleophilic backside attack.'
        }
      }
    ]
  }
]);

// 4. Biology
const biologyChapters = createCurriculumForSubject('subj-biology', 'Biology', [
  {
    number: 1,
    title: 'Cellular Biology & Genetics',
    description: 'Cell division, DNA replication, gene expression, and Mendelian inheritance.',
    topics: [
      {
        title: 'Mitosis vs Meiosis',
        description: 'Somatic cell replication versus gamete production with genetic recombination.',
        lessonTitle: 'The Stages of Mitotic Division',
        durationMinutes: 16,
        overview: 'Prophase, Metaphase, Anaphase, and Telophase producing identical diploid daughter cells.',
        explanation: 'Mitosis duplicates chromosomes and segregates chromatids to yield two genetically identical cells (2n). Essential for organism growth, tissue repair, and asexual reproduction.',
        keyTakeaways: [
          'Metaphase: Chromosomes align along the equatorial metaphase plate.',
          'Anaphase: Kinetochore microtubules shorten, separating sister chromatids.',
          'Checkpoints (G1, G2, M) strictly regulate genomic integrity.'
        ],
        exampleTitle: 'Skin Epithelial Renewal',
        exampleDetail: 'Human epidermis completely renews every 28 days via active mitotic division in the basal layer.',
        formulaOrCode: 'Cell Cycle: G1 ⟹ S (Replication) ⟹ G2 ⟹ M (Mitosis) ⟹ Cytokinesis',
        checkQuestion: {
          question: 'During which mitotic phase do sister chromatids pull apart toward opposite spindle poles?',
          options: ['Anaphase', 'Metaphase', 'Prophase', 'Telophase'],
          correctIndex: 0,
          explanation: 'In anaphase, cohesin proteins cleave, allowing spindle fibers to pull sister chromatids to opposite poles.'
        }
      }
    ]
  }
]);

// 5. Computer Science
const csChapters = createCurriculumForSubject('subj-cs', 'Computer Science', [
  {
    number: 1,
    title: 'Data Structures & Algorithms',
    description: 'Asymptotic analysis, trees, dynamic arrays, and graph traversals.',
    topics: [
      {
        title: 'Trees & Balanced Search Trees',
        description: 'Binary search tree invariants, rotations, and AVL balancing.',
        lessonTitle: 'Binary Search Tree Lookups and Insertion',
        durationMinutes: 20,
        overview: 'Hierarchical node storage enforcing left < node < right ordering.',
        explanation: 'BST maintains invariant: all keys in left subtree are strictly less than parent, and right are strictly greater. Lookup runtime is O(h) where h is height.',
        keyTakeaways: [
          'In-order traversal visits elements in strictly sorted ascending order.',
          'Balanced BSTs (AVL, Red-Black) guarantee O(log n) worst-case time.',
          'Skewed degenerate trees degrade to O(n) linked lists.'
        ],
        exampleTitle: 'Dictionary Lookup',
        exampleDetail: 'Searching 1,000,000 words in a balanced BST takes at most ~20 comparisons (log2(10^6) ≈ 20).',
        formulaOrCode: 'Lookup/Insert/Delete:\nAverage: O(log n)\nWorst: O(n)\nBalanced Tree Height: h = floor(log2 n)',
        checkQuestion: {
          question: 'Which tree traversal yields keys in sorted order for a binary search tree?',
          options: ['In-order traversal', 'Pre-order traversal', 'Post-order traversal', 'Breadth-first search'],
          correctIndex: 0,
          explanation: 'In-order traversal visits (Left, Root, Right), which naturally outputs keys in ascending sorted order.'
        }
      }
    ]
  }
]);

// 6. Programming
const programmingChapters = createCurriculumForSubject('subj-programming', 'Programming', [
  {
    number: 1,
    title: 'Modern TypeScript & Systems Architecture',
    description: 'Static typing, generics, asynchronous event loops, and clean modular code.',
    topics: [
      {
        title: 'Generics & Type Invariants',
        description: 'Creating reusable, type-safe functions, classes, and interfaces.',
        lessonTitle: 'Generic Constraints & Utility Types',
        durationMinutes: 18,
        overview: 'Parameterizing types to achieve compile-time safety without duplicating logic.',
        explanation: 'Generics capture type relationships between function arguments and return types. The "extends" keyword restricts generic parameters to specific shapes.',
        keyTakeaways: [
          'Eliminates dangerous "any" casts while maintaining flexibility.',
          'Utility types like Partial<T>, Pick<T, K>, and Record<K, V> transform structures.',
          'Zero runtime overhead—types are completely erased during compilation.'
        ],
        exampleTitle: 'Type-Safe Identity Function',
        exampleDetail: 'function identity<T>(arg: T): T { return arg; } preserves the exact argument type.',
        formulaOrCode: 'type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };',
        checkQuestion: {
          question: 'What does the TypeScript utility type "Partial<T>" do?',
          options: [
            'Makes all properties in T optional',
            'Makes all properties in T readonly',
            'Deletes half of the properties in T',
            'Converts all properties to strings'
          ],
          correctIndex: 0,
          explanation: 'Partial<T> wraps every property of type T in an optional flag (key?: T[key]).'
        }
      }
    ]
  }
]);

// 7. Software Engineering
const sweChapters = createCurriculumForSubject('subj-swe', 'Software Engineering', [
  {
    number: 1,
    title: 'Scalable System Design',
    description: 'Microservices, message queues, caching strategies, and horizontal scaling.',
    topics: [
      {
        title: 'CAP Theorem & Distributed Consensus',
        description: 'Trade-offs between Consistency, Availability, and Partition Tolerance.',
        lessonTitle: 'The Fundamental CAP Dilemma',
        durationMinutes: 20,
        overview: 'In any distributed data store, you can only simultaneously guarantee two of three properties.',
        explanation: 'When a network partition (P) inevitably occurs between nodes, the system must choose between returning consistent errors/stale data (CP) or allowing writes with eventual consistency (AP).',
        keyTakeaways: [
          'Network partitions (P) are unavoidable in physical networks.',
          'CP Systems (RDBMS, ZooKeeper) prioritize correctness over 100% uptime.',
          'AP Systems (Cassandra, DynamoDB) prioritize availability and use eventual consistency.'
        ],
        exampleTitle: 'ATM Cash Withdrawal',
        exampleDetail: 'If the central banking network disconnects, the ATM can either deny withdrawal (CP) or allow a capped withdrawal with later reconciliation (AP).',
        formulaOrCode: 'Trade-off: Network Partition ⟹ Choose (Consistency XOR Availability)',
        checkQuestion: {
          question: 'Under the CAP theorem, why can a distributed system not choose "CA" during a network partition?',
          options: [
            'Because partitions in real networks cannot be prevented',
            'Because consistency is mathematically impossible',
            'Because databases do not support replication',
            'Because CAP only applies to single-core CPUs'
          ],
          correctIndex: 0,
          explanation: 'Network partitions are physical realities (dropped packets, hardware faults), meaning systems must be Partition Tolerant (P).'
        }
      }
    ]
  }
]);

// 8. Database Systems
const dbsChapters = createCurriculumForSubject('subj-dbs', 'Database Systems', [
  {
    number: 1,
    title: 'Relational Schema & Query Optimization',
    description: 'B-tree index mechanics, ACID guarantees, and SQL execution plans.',
    topics: [
      {
        title: 'B-Tree Indexing Internals',
        description: 'How databases locate records in millions of rows in sub-millisecond time.',
        lessonTitle: 'Index Scans vs Sequential Scans',
        durationMinutes: 18,
        overview: 'Self-balancing multi-way search trees optimized for disk and page block reads.',
        explanation: 'B-Trees keep keys sorted with wide fan-out (hundreds of keys per node), reducing disk I/O depth to 3-4 seeks even for billions of records.',
        keyTakeaways: [
          'Enables logarithmic O(log n) point queries and efficient range scans.',
          'Composite indexes follow the Leftmost Prefix Rule.',
          'Excessive indexes degrade INSERT and UPDATE throughput.'
        ],
        exampleTitle: 'Postgres EXPLAIN ANALYZE',
        exampleDetail: 'Adding an index on user_id turns an expensive Sequential Table Scan into a lightning-fast Index Scan.',
        formulaOrCode: 'CREATE INDEX idx_users_email ON users(email);\nEXPLAIN ANALYZE SELECT * FROM users WHERE email = \'test@example.com\';',
        checkQuestion: {
          question: 'Why does adding an index on a table slow down INSERT queries?',
          options: [
            'The database must also update the index tree structure for every new row',
            'Indexes lock the entire database file during writes',
            'Indexes delete cached queries',
            'Indexes reduce available RAM to zero'
          ],
          correctIndex: 0,
          explanation: 'Every INSERT must write both the raw row and insert the key into the corresponding B-Tree nodes, incurring extra I/O.'
        }
      }
    ]
  }
]);

// 9. Artificial Intelligence
const aiChapters = createCurriculumForSubject('subj-ai', 'Artificial Intelligence', [
  {
    number: 1,
    title: 'Deep Learning & Attention Mechanisms',
    description: 'Backpropagation, transformers, self-attention, and LLM scaling laws.',
    topics: [
      {
        title: 'The Transformer Architecture',
        description: 'Scaled dot-product self-attention replacing recurrent architectures.',
        lessonTitle: 'Self-Attention Mechanics (Q, K, V)',
        durationMinutes: 24,
        overview: 'How neural networks compute contextual relationships between all words in parallel.',
        explanation: 'Each token is projected into Query (Q), Key (K), and Value (V) matrices. Attention weights are computed as Attention(Q,K,V) = softmax(QK^T / √d_k) · V.',
        keyTakeaways: [
          'Overcomes RNN sequential bottleneck, enabling massive parallel GPU pre-training.',
          'Captures long-range dependencies regardless of distance in text.',
          'Forms the foundation of modern LLMs (GPT, Gemini, Claude, LLaMA).'
        ],
        exampleTitle: 'Pronoun Disambiguation',
        exampleDetail: 'In "The animal didn’t cross the street because it was tired", self-attention links "it" strongly to "animal".',
        formulaOrCode: 'Attention(Q, K, V) = softmax( (Q · K^T) / sqrt(d_k) ) · V',
        checkQuestion: {
          question: 'What is the purpose of dividing by √d_k in the scaled dot-product attention formula?',
          options: [
            'To prevent dot products from growing excessively large, avoiding vanishing gradients in softmax',
            'To make the matrix symmetric',
            'To convert the output into integer counts',
            'To double the training speed'
          ],
          correctIndex: 0,
          explanation: 'For large projection dimensions d_k, dot products grow large, pushing the softmax function into regions with extremely small gradients.'
        }
      }
    ]
  }
]);

// 10. English
const englishChapters = createCurriculumForSubject('subj-english', 'English', [
  {
    number: 1,
    title: 'Rhetorical Analysis & Composition',
    description: 'Ethos, pathos, logos, argumentative structure, and stylistic voice.',
    topics: [
      {
        title: 'Aristotelian Rhetorical Appeals',
        description: 'Balancing credibility, emotional resonance, and logical reasoning.',
        lessonTitle: 'Constructing Persuasive Claims',
        durationMinutes: 15,
        overview: 'Mastering the triad of persuasion: Ethos (authority), Pathos (empathy), and Logos (evidence).',
        explanation: 'Compelling essays avoid emotional manipulation by anchoring emotional appeals (Pathos) in verifiable data (Logos) delivered through an authoritative academic voice (Ethos).',
        keyTakeaways: [
          'Every strong argument pairs a clear thesis with counterargument refutation.',
          'Avoid logical fallacies: ad hominem, straw man, and false dichotomy.',
          'Vary sentence syntax (periodic vs cumulative) to establish rhetorical cadence.'
        ],
        exampleTitle: 'Martin Luther King Jr. "Letter from Birmingham Jail"',
        exampleDetail: 'Seamlessly weaves constitutional law (Logos) with moral urgency (Ethos and Pathos).',
        formulaOrCode: 'Argument = Claim + Warrant (Evidence) + Impact - Counterargument Refutation',
        checkQuestion: {
          question: 'Which rhetorical appeal relies primarily on statistical evidence and syllogistic logic?',
          options: ['Logos', 'Ethos', 'Pathos', 'Kairos'],
          correctIndex: 0,
          explanation: 'Logos appeals directly to the reader’s rational intellect through deductive and inductive evidence.'
        }
      }
    ]
  }
]);

// 11. Urdu
const urduChapters = createCurriculumForSubject('subj-urdu', 'Urdu', [
  {
    number: 1,
    title: 'Classical Urdu Literature & Poetics',
    description: 'Ghazal structures, Radif, Qafia, Matla, Maqta, and classical masters.',
    topics: [
      {
        title: 'Structure of the Urdu Ghazal',
        description: 'Meter (Behr), rhyming patterns (Qafia), and refrain (Radif).',
        lessonTitle: 'The Anatomy of a Sher & Ghazal',
        durationMinutes: 18,
        overview: 'Each couplet (Sher) is an independent, autonomous poetic universe bound by metric harmony.',
        explanation: 'The opening couplet is the Matla (both lines share Radif and Qafia). The final couplet is the Maqta, in which the poet introduces their Takhallus (pen name).',
        keyTakeaways: [
          'Radif is the exact repeating refrain at the end of each misra.',
          'Qafia is the rhyming word immediately preceding the Radif.',
          'Mir Taqi Mir and Mirza Ghalib defined the golden era of Urdu Ghazal.'
        ],
        exampleTitle: 'Ghalib’s Iconic Couplet',
        exampleDetail: '"Dil-e-nadan tujhe hua kya hai / Aakhir is dard ki dawa kya hai" — here "kya hai" is Radif, and "hua / dawa" are Qafia.',
        formulaOrCode: 'Structure: [Misra-e-Ula] ⟹ [Misra-e-Sani with Qafia + Radif]',
        checkQuestion: {
          question: 'What is the concluding couplet of a Ghazal containing the poet’s pen name called?',
          options: ['Maqta', 'Matla', 'Husn-e-Matla', 'Behr'],
          correctIndex: 0,
          explanation: 'The final couplet featuring the poet’s signature or pen name is called the Maqta.'
        }
      }
    ]
  }
]);

// 12. World Languages
const languagesChapters = createCurriculumForSubject('subj-languages', 'Languages', [
  {
    number: 1,
    title: 'Linguistics & Comparative Grammar',
    description: 'Phonetics, morphology, syntax trees, and language acquisition.',
    topics: [
      {
        title: 'Morphology & Word Formation',
        description: 'Morphemes, affixes, inflection, and compounding across language families.',
        lessonTitle: 'Free vs Bound Morphemes',
        durationMinutes: 16,
        overview: 'Breaking words into their smallest units of semantic meaning.',
        explanation: 'A free morpheme can stand alone as a word (e.g. "cat", "walk"). A bound morpheme must attach to a host (e.g. "-ed", "un-", "-s").',
        keyTakeaways: [
          'Inflectional morphemes alter grammatical tense or number without changing word class.',
          'Derivational morphemes create brand-new words or shift grammatical category (e.g. dark ⟹ darkness).',
          'Universal across all human linguistic families.'
        ],
        exampleTitle: 'The Word "Unbreakable"',
        exampleDetail: 'Contains 3 morphemes: prefix "un-" (bound) + root "break" (free) + suffix "-able" (bound).',
        formulaOrCode: 'Word = [Prefix] + [Root] + [Suffix]',
        checkQuestion: {
          question: 'In the word "reopening", how many morphemes are present?',
          options: ['3 (re- + open + -ing)', '2 (re- + opening)', '1 (reopening)', '4'],
          correctIndex: 0,
          explanation: '"re-" (prefix), "open" (free root), and "-ing" (suffix) make exactly 3 morphemes.'
        }
      }
    ]
  }
]);

// 13. History
const historyChapters = createCurriculumForSubject('subj-history', 'History', [
  {
    number: 1,
    title: 'The Modern Era & Geopolitics',
    description: 'The Enlightenment, Industrial Revolution, World Wars, and Cold War dynamics.',
    topics: [
      {
        title: 'The Industrial Revolution & Global Transformation',
        description: 'Steam power, mechanization, urbanization, and the rise of modern capitalism.',
        lessonTitle: 'The First Industrial Revolution (1760-1840)',
        durationMinutes: 20,
        overview: 'The shift from agrarian handicraft economies to machine-driven manufacturing.',
        explanation: 'Beginning in Great Britain with steam engines and mechanized textile looms, the Industrial Revolution triggered rapid urbanization and transformed global trade.',
        keyTakeaways: [
          'James Watt’s steam engine decoupled industry from geographical water-wheel constraints.',
          'Shifted demographic populations from rural agrarian farming into dense industrial cities.',
          'Catalyzed the development of labor unions, public education, and modern economic theory.'
        ],
        exampleTitle: 'Textile Mechanization in Manchester',
        exampleDetail: 'The Spinning Jenny and power loom increased cotton textile productivity by over 1,000% within decades.',
        formulaOrCode: 'Agrarian Cottage System ⟹ Steam & Coal ⟹ Factory Urbanization',
        checkQuestion: {
          question: 'In which nation did the First Industrial Revolution originate?',
          options: ['Great Britain', 'United States', 'Germany', 'France'],
          correctIndex: 0,
          explanation: 'Great Britain possessed the ideal convergence of coal reserves, iron ore, commercial capital, and patent protections.'
        }
      }
    ]
  }
]);

// 14. Geography
const geographyChapters = createCurriculumForSubject('subj-geography', 'Geography', [
  {
    number: 1,
    title: 'Physical Landforms & Earth Systems',
    description: 'Plate tectonics, volcanism, geomorphology, and climate zones.',
    topics: [
      {
        title: 'Plate Tectonics & Seismic Activity',
        description: 'Convergent, divergent, and transform boundaries shaping Earth’s crust.',
        lessonTitle: 'Tectonic Boundaries and Continental Drift',
        durationMinutes: 18,
        overview: 'The lithosphere is divided into rigid plates floating atop the semi-fluid asthenosphere.',
        explanation: 'Convection currents in the Earth’s mantle drive plate motion. Convergent boundaries form mountain belts and subduction trenches; divergent boundaries create mid-ocean ridges.',
        keyTakeaways: [
          'Subduction zones generate explosive stratovolcanoes and deep ocean trenches.',
          'The Pacific "Ring of Fire" accounts for over 75% of global volcanic activity.',
          'Transform boundaries (e.g. San Andreas Fault) produce severe shallow-focus earthquakes.'
        ],
        exampleTitle: 'Himalayan Orogeny',
        exampleDetail: 'The collision between the Indian Plate and Eurasian Plate continues pushing Mount Everest upward by ~4mm per year.',
        formulaOrCode: 'Mantle Convection ⟹ Plate Motion (2 - 10 cm/yr) ⟹ Orogeny / Seafloor Spreading',
        checkQuestion: {
          question: 'What geological feature is formed when two oceanic plates diverge?',
          options: ['Mid-ocean ridge and rift valley', 'Deep ocean trench', 'Fold mountain range', 'Volcanic island arc'],
          correctIndex: 0,
          explanation: 'Divergent oceanic boundaries allow magma to well up from the mantle, creating underwater volcanic mountain ranges called mid-ocean ridges.'
        }
      }
    ]
  }
]);

// 15. Economics
const economicsChapters = createCurriculumForSubject('subj-economics', 'Economics', [
  {
    number: 1,
    title: 'Microeconomic Market Theory',
    description: 'Supply and demand, price elasticity, market structures, and externalities.',
    topics: [
      {
        title: 'Market Equilibrium & Elasticity',
        description: 'Price discovery, surplus, shortages, and consumer sensitivity to price shifts.',
        lessonTitle: 'Price Elasticity of Demand (PED)',
        durationMinutes: 19,
        overview: 'Measuring how responsive quantity demanded is to changes in product price.',
        explanation: 'PED = (% change in Q_d) / (% change in Price). When |PED| > 1, demand is elastic; when |PED| < 1, demand is inelastic.',
        keyTakeaways: [
          'Necessities (insulin, electricity) exhibit highly inelastic demand (|PED| < 1).',
          'Goods with close substitutes exhibit highly elastic demand.',
          'Total revenue is maximized at unitary elasticity (|PED| = 1).'
        ],
        exampleTitle: 'Gasoline Short-Run vs Long-Run',
        exampleDetail: 'In the short run, drivers must commute (inelastic); in the long run, they buy electric vehicles or carpool (elastic).',
        formulaOrCode: 'PED = (ΔQ / Q_avg) / (ΔP / P_avg)',
        checkQuestion: {
          question: 'If a 10% price increase results in a 25% drop in quantity demanded, demand is:',
          options: ['Elastic (|PED| = 2.5)', 'Inelastic (|PED| = 0.4)', 'Unitary (|PED| = 1.0)', 'Perfectively inelastic'],
          correctIndex: 0,
          explanation: 'PED = -25% / 10% = -2.5. Since the magnitude is greater than 1, demand is elastic.'
        }
      }
    ]
  }
]);

// 16. Accounting
const accountingChapters = createCurriculumForSubject('subj-accounting', 'Accounting', [
  {
    number: 1,
    title: 'Financial Statements & Double-Entry',
    description: 'Balance sheets, income statements, cash flows, and accrual accounting.',
    topics: [
      {
        title: 'The Fundamental Accounting Equation',
        description: 'Assets = Liabilities + Equity maintained across all business transactions.',
        lessonTitle: 'Debits, Credits and The Balance Sheet',
        durationMinutes: 17,
        overview: 'Every transaction affects at least two accounts to keep the balance sheet in equilibrium.',
        explanation: 'Assets increase with Debits (Dr) and decrease with Credits (Cr). Liabilities and Equity increase with Credits and decrease with Debits.',
        keyTakeaways: [
          'Total Debits must always equal Total Credits in every journal entry.',
          'Accrual accounting recognizes revenue when earned, not when cash is received.',
          'The Income Statement flows into Retained Earnings on the Balance Sheet.'
        ],
        exampleTitle: 'Purchasing Equipment with Cash',
        exampleDetail: 'Debit Equipment (Asset increases) $10,000; Credit Cash (Asset decreases) $10,000. Net change in total assets is zero.',
        formulaOrCode: 'Assets = Liabilities + Owner\'s Equity\nNet Income = Revenue - Expenses',
        checkQuestion: {
          question: 'Which account increases when debited?',
          options: ['Cash (Asset)', 'Accounts Payable (Liability)', 'Sales Revenue (Revenue)', 'Common Stock (Equity)'],
          correctIndex: 0,
          explanation: 'Asset accounts (like Cash and Equipment) increase with a debit entry.'
        }
      }
    ]
  }
]);

// 17. Business
const businessChapters = createCurriculumForSubject('subj-business', 'Business', [
  {
    number: 1,
    title: 'Strategic Management & Leadership',
    description: 'Competitive advantage, Porter’s Five Forces, and operational excellence.',
    topics: [
      {
        title: 'Porter’s Five Forces Framework',
        description: 'Analyzing the competitive intensity and profitability of an industry.',
        lessonTitle: 'Evaluating Industry Attractiveness',
        durationMinutes: 18,
        overview: 'Assessing supplier power, buyer power, competitive rivalry, threat of substitution, and barrier to entry.',
        explanation: 'Profit margins are dictated not merely by management skill, but by the structural power dynamics of the industry ecosystem.',
        keyTakeaways: [
          'High barriers to entry protect incumbent margins from newcomer erosion.',
          'Commoditized products give buyers extreme leverage to force price wars.',
          'Directs whether a firm should pursue cost leadership or differentiated premium branding.'
        ],
        exampleTitle: 'Commercial Airline Industry',
        exampleDetail: 'Historically low profit margins due to intense rivalry, high supplier power (Boeing/Airbus), and price-sensitive buyers.',
        formulaOrCode: 'Industry Profitability = f(Buyer Power, Supplier Power, Rivalry, Entry Barriers, Substitutes)',
        checkQuestion: {
          question: 'What effect does high buyer power typically have on industry pricing?',
          options: [
            'Drives prices and industry profits downward',
            'Allows sellers to arbitrarily increase prices',
            'Prevents new competitors from entering',
            'Eliminates the need for advertising'
          ],
          correctIndex: 0,
          explanation: 'When buyers have many alternatives and low switching costs, they force firms to compete aggressively on price.'
        }
      }
    ]
  }
]);

// 18. Entrepreneurship
const entrepreneurshipChapters = createCurriculumForSubject('subj-entrepreneurship', 'Entrepreneurship', [
  {
    number: 1,
    title: 'Venture Creation & Lean Startup',
    description: 'Customer discovery, MVP development, unit economics, and venture pitching.',
    topics: [
      {
        title: 'Product-Market Fit & Unit Economics',
        description: 'Validating CAC, LTV, churn, and sustainable monetization loops.',
        lessonTitle: 'The LTV to CAC Ratio',
        durationMinutes: 19,
        overview: 'Measuring whether the lifetime value of a customer profitably exceeds acquisition cost.',
        explanation: 'Customer Acquisition Cost (CAC) must be amortized over the Customer Lifetime Value (LTV). A healthy venture generally requires an LTV:CAC ratio ≥ 3:1.',
        keyTakeaways: [
          'CAC = Total Sales & Marketing Spend / Number of New Customers Acquired.',
          'LTV = (Average Revenue Per User × Gross Margin) / Churn Rate.',
          'High churn destroys LTV, rendering growth unsustainable regardless of ad spend.'
        ],
        exampleTitle: 'SaaS Subscription Model',
        exampleDetail: 'If a subscriber pays $50/mo with 2% monthly churn, their expected lifetime is 50 months, producing $2,500 LTV.',
        formulaOrCode: 'LTV / CAC ≥ 3.0\nCAC Payback Period = CAC / (Monthly ARPU × Gross Margin) < 12 months',
        checkQuestion: {
          question: 'If a startup spends $10,000 on marketing and acquires 100 paying users, what is its CAC?',
          options: ['$100', '$1,000', '$10', '$50'],
          correctIndex: 0,
          explanation: 'CAC = $10,000 / 100 = $100 per acquired customer.'
        }
      }
    ]
  }
]);

// 19. Civics
const civicsChapters = createCurriculumForSubject('subj-civics', 'Civics', [
  {
    number: 1,
    title: 'Constitutional Governance & Rights',
    description: 'Separation of powers, checks and balances, and civil liberties.',
    topics: [
      {
        title: 'Separation of Powers & Checks',
        description: 'Dividing state sovereignty between Legislative, Executive, and Judicial branches.',
        lessonTitle: 'Preventing Autocracy via Institutional Checks',
        durationMinutes: 16,
        overview: 'Montesquieu’s doctrine preventing concentration of arbitrary power.',
        explanation: 'The Legislature enacts laws, the Executive administers laws, and the Judiciary interprets laws. Each branch possesses constitutional vetoes over the others.',
        keyTakeaways: [
          'Executive veto can be overridden by legislative supermajorities.',
          'Judicial review invalidates unconstitutional executive and legislative actions.',
          'Preserves individual liberties through institutional friction.'
        ],
        exampleTitle: 'Marbury v. Madison (1803)',
        exampleDetail: 'Established the principle of Judicial Review, empowering courts to strike down statutes violating the Constitution.',
        formulaOrCode: 'Governance = Legislative (Make) + Executive (Enforce) + Judicial (Interpret)',
        checkQuestion: {
          question: 'What constitutional power allows courts to declare legislative acts void?',
          options: ['Judicial Review', 'Executive Privilege', 'Filibuster', 'Impeachment'],
          correctIndex: 0,
          explanation: 'Judicial review is the power of courts to assess the constitutionality of legislative statutes.'
        }
      }
    ]
  }
]);

// 20. Literature
const literatureChapters = createCurriculumForSubject('subj-literature', 'Literature', [
  {
    number: 1,
    title: 'Narrative Theory & Critical Analysis',
    description: 'Plot arcs, character motivations, motifs, and literary lenses.',
    topics: [
      {
        title: 'Structural Narrative Arcs',
        description: 'Freytag’s Pyramid, exposition, rising action, climax, and denouement.',
        lessonTitle: 'The Dramatic Climax & Catharsis',
        durationMinutes: 18,
        overview: 'The turning point of highest emotional and thematic tension in literature.',
        explanation: 'Aristotle’s Poetics observed that tragedy resolves through Catharsis—the purging of pity and fear induced in the audience by the protagonist’s Hamartia (fatal flaw).',
        keyTakeaways: [
          'The climax directly addresses the central dramatic question.',
          'Falling action deals with consequences and thematic reckonings.',
          'Theme is demonstrated through choices made under extreme crisis.'
        ],
        exampleTitle: 'Sophocles’ Oedipus Rex',
        exampleDetail: 'The horrific realization of fulfilled prophecy leads to profound tragic catharsis.',
        formulaOrCode: 'Arc: Exposition ⟹ Inciting Incident ⟹ Rising Action ⟹ Climax ⟹ Denouement',
        checkQuestion: {
          question: 'What term describes the emotional release of pity and fear experienced by the audience in classical tragedy?',
          options: ['Catharsis', 'Hamartia', 'Hubris', 'Anagnorisis'],
          correctIndex: 0,
          explanation: 'Catharsis is the emotional purification or purging of emotional tension achieved through dramatic art.'
        }
      }
    ]
  }
]);

// 21. General Knowledge
const gkChapters = createCurriculumForSubject('subj-gk', 'General Knowledge', [
  {
    number: 1,
    title: 'International Institutions & Global Treaties',
    description: 'United Nations bodies, Bretton Woods agreements, and climate protocols.',
    topics: [
      {
        title: 'The United Nations & Global Security',
        description: 'The Security Council, General Assembly, and International Court of Justice.',
        lessonTitle: 'The Structure of the UN Security Council',
        durationMinutes: 15,
        overview: 'Charged with the maintenance of international peace and security.',
        explanation: 'Composed of 15 members: 5 permanent members (P5: US, UK, France, Russia, China) with veto power, and 10 non-permanent members elected for two-year terms.',
        keyTakeaways: [
          'Substantive resolutions require 9 affirmative votes with zero P5 vetoes.',
          'Can authorize economic sanctions, peacekeeping missions, and military interventions.',
          'Established in 1945 following the failure of the League of Nations.'
        ],
        exampleTitle: 'The 1945 San Francisco Conference',
        exampleDetail: 'Representatives of 50 nations met to draft and sign the historic United Nations Charter.',
        formulaOrCode: 'UN Security Council = 5 Permanent Veto Members + 10 Rotational Members',
        checkQuestion: {
          question: 'How many permanent members with veto power sit on the UN Security Council?',
          options: ['5 (US, UK, France, Russia, China)', '10', '15', '7'],
          correctIndex: 0,
          explanation: 'The P5 consists of the United States, United Kingdom, France, Russia, and China.'
        }
      }
    ]
  }
]);

// 22. Exam Preparation
const examPrepChapters = createCurriculumForSubject('subj-exam-prep', 'Exam Preparation', [
  {
    number: 1,
    title: 'High-Stakes Standardized Testing Strategy',
    description: 'Pacing algorithms, process of elimination, and trap-answer diagnosis.',
    topics: [
      {
        title: 'Systematic Distractor Elimination',
        description: 'How test makers construct plausible wrong answers in SAT, GRE, and MCAT.',
        lessonTitle: 'Eliminating Extreme and Out-of-Scope Distractors',
        durationMinutes: 18,
        overview: 'Standardized tests test critical discipline as much as raw content knowledge.',
        explanation: 'Correct answers are rigorously defended by evidence. Incorrect distractors commonly use absolute words ("always", "never", "entirely") or introduce extraneous concepts.',
        keyTakeaways: [
          'If 10% of an answer choice is false, the entire answer choice is 100% wrong.',
          'Pacing: Never spend more than 90 seconds on a single multiple-choice question on first pass.',
          'Flag ambiguous questions and return after completing all high-confidence points.'
        ],
        exampleTitle: 'Reading Comprehension Traps',
        exampleDetail: 'Distractor choices often state a true real-world fact that is completely unsupported by the provided passage.',
        formulaOrCode: 'Correct Choice = Evidence-grounded + Moderate qualifier ("may", "suggests", "indicates")',
        checkQuestion: {
          question: 'Why are answer choices with extreme modifiers like "exclusively" or "invariably" often incorrect on reading tests?',
          options: [
            'They are difficult to prove and rarely supported by moderate textual evidence',
            'Test writers are not allowed to use adverbs',
            'Because short answers are always correct',
            'Because questions only have one word answers'
          ],
          correctIndex: 0,
          explanation: 'Extreme words create narrow, absolutist claims that are easily falsified and rarely justified by passage arguments.'
        }
      }
    ]
  }
]);

// 23. Professional Skills
const professionalSkillsChapters = createCurriculumForSubject('subj-skills', 'Professional Skills', [
  {
    number: 1,
    title: 'Executive Communication & Problem Solving',
    description: 'The Minto Pyramid Principle, stakeholder negotiation, and structured thinking.',
    topics: [
      {
        title: 'The Minto Pyramid Principle',
        description: 'Structuring executive briefings: Answer First, followed by supporting pillars.',
        lessonTitle: 'Top-Down Communication for Leaders',
        durationMinutes: 17,
        overview: 'Start with the governing recommendation, then group arguments logically (MECE).',
        explanation: 'Executives have zero patience for detective-story briefings. State the conclusion upfront, followed by mutually exclusive, collectively exhaustive (MECE) supporting rationale.',
        keyTakeaways: [
          'BLUF: Bottom Line Up Front saves time and prevents misunderstandings.',
          'MECE ensures no overlaps and no gaps in your business case.',
          'Increases presentation impact and decision velocity.'
        ],
        exampleTitle: 'McKinsey Strategy Recommendation',
        exampleDetail: '"We recommend divesting Division B to liberate $50M capital for high-margin cloud expansion."',
        formulaOrCode: 'Executive Pyramid = Core Recommendation ⟹ 3 MECE Reasons ⟹ Supporting Data',
        checkQuestion: {
          question: 'What does the acronym MECE stand for in structured problem solving?',
          options: [
            'Mutually Exclusive, Collectively Exhaustive',
            'Most Effective Commercial Enterprise',
            'Minimal Effort, Critical Execution',
            'Maximum Efficiency, Constant Evolution'
          ],
          correctIndex: 0,
          explanation: 'MECE stands for Mutually Exclusive (no overlaps) and Collectively Exhaustive (no gaps).'
        }
      }
    ]
  }
]);

// Combine all 23 defined subjects with realistic data
export const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: 'subj-math',
    name: 'Mathematics',
    slug: 'mathematics',
    category: 'STEM',
    description: 'Rigorous foundations across Calculus, Linear Algebra, Multivariable Analysis, and Real Analysis.',
    chapterCount: 16,
    topicsCount: 84,
    difficulty: 'Intermediate',
    estimatedHours: 54,
    overallProgress: 45,
    enrolled: true,
    lastStudied: 'Yesterday',
    chapters: mathChapters,
  },
  {
    id: 'subj-physics',
    name: 'Physics',
    slug: 'physics',
    category: 'STEM',
    description: 'Master the fundamental laws governing motion, energy, gravity, and electromagnetic waves.',
    chapterCount: 14,
    topicsCount: 72,
    difficulty: 'Advanced',
    estimatedHours: 48,
    overallProgress: 50,
    enrolled: true,
    lastStudied: 'Today at 4:15 PM',
    chapters: physicsChapters,
  },
  {
    id: 'subj-chemistry',
    name: 'Chemistry',
    slug: 'chemistry',
    category: 'STEM',
    description: 'Organic reaction mechanisms, atomic orbitals, chemical kinetics, and thermodynamics.',
    chapterCount: 12,
    topicsCount: 65,
    difficulty: 'Intermediate',
    estimatedHours: 42,
    overallProgress: 25,
    enrolled: true,
    lastStudied: '2 days ago',
    chapters: chemistryChapters,
  },
  {
    id: 'subj-biology',
    name: 'Biology',
    slug: 'biology',
    category: 'STEM',
    description: 'Cellular division, molecular genetics, evolutionary adaptations, and physiology.',
    chapterCount: 15,
    topicsCount: 78,
    difficulty: 'Beginner',
    estimatedHours: 40,
    overallProgress: 20,
    enrolled: false,
    chapters: biologyChapters,
  },
  {
    id: 'subj-cs',
    name: 'Computer Science',
    slug: 'computer-science',
    category: 'Computing & Tech',
    description: 'Fundamental data structures, algorithmic complexity, operating systems, and computer architectures.',
    chapterCount: 18,
    topicsCount: 96,
    difficulty: 'Intermediate',
    estimatedHours: 60,
    overallProgress: 35,
    enrolled: true,
    lastStudied: '3 days ago',
    chapters: csChapters,
  },
  {
    id: 'subj-programming',
    name: 'Programming',
    slug: 'programming',
    category: 'Computing & Tech',
    description: 'Modern software construction using TypeScript, Python, C++, and memory management.',
    chapterCount: 20,
    topicsCount: 110,
    difficulty: 'Beginner',
    estimatedHours: 52,
    overallProgress: 40,
    enrolled: true,
    lastStudied: '4 days ago',
    chapters: programmingChapters,
  },
  {
    id: 'subj-swe',
    name: 'Software Engineering',
    slug: 'software-engineering',
    category: 'Computing & Tech',
    description: 'Large-scale system design, microservices, testing paradigms, and CI/CD pipelines.',
    chapterCount: 12,
    topicsCount: 60,
    difficulty: 'Advanced',
    estimatedHours: 45,
    overallProgress: 15,
    enrolled: false,
    chapters: sweChapters,
  },
  {
    id: 'subj-dbs',
    name: 'Database Systems',
    slug: 'database-systems',
    category: 'Computing & Tech',
    description: 'Relational algebra, SQL query optimization, B-tree indexes, ACID transactions, and distributed NoSQL.',
    chapterCount: 10,
    topicsCount: 52,
    difficulty: 'Intermediate',
    estimatedHours: 36,
    overallProgress: 10,
    enrolled: false,
    chapters: dbsChapters,
  },
  {
    id: 'subj-ai',
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    category: 'Computing & Tech',
    description: 'Deep neural networks, backpropagation, transformers, reinforcement learning, and LLM architectures.',
    chapterCount: 15,
    topicsCount: 88,
    difficulty: 'Advanced',
    estimatedHours: 56,
    overallProgress: 25,
    enrolled: true,
    chapters: aiChapters,
  },
  {
    id: 'subj-english',
    name: 'English',
    slug: 'english',
    category: 'Humanities',
    description: 'Rhetorical synthesis, argumentative clarity, stylistic precision, and essay crafting.',
    chapterCount: 11,
    topicsCount: 48,
    difficulty: 'Beginner',
    estimatedHours: 30,
    overallProgress: 10,
    enrolled: false,
    chapters: englishChapters,
  },
  {
    id: 'subj-urdu',
    name: 'Urdu',
    slug: 'urdu',
    category: 'Languages',
    description: 'Classical poetry (Ghazal & Nazm), prose analysis, grammar (Qawaid), and linguistic history.',
    chapterCount: 10,
    topicsCount: 44,
    difficulty: 'Intermediate',
    estimatedHours: 32,
    overallProgress: 15,
    enrolled: false,
    chapters: urduChapters,
  },
  {
    id: 'subj-languages',
    name: 'Languages',
    slug: 'languages',
    category: 'Languages',
    description: 'Linguistic morphology, conversational fluency, phonetics, and grammatical frameworks.',
    chapterCount: 14,
    topicsCount: 64,
    difficulty: 'Beginner',
    estimatedHours: 38,
    overallProgress: 10,
    enrolled: false,
    chapters: languagesChapters,
  },
  {
    id: 'subj-history',
    name: 'History',
    slug: 'history',
    category: 'Humanities',
    description: 'Global geopolitical shifts, ancient civilizations, the Industrial Revolution, and modern conflicts.',
    chapterCount: 14,
    topicsCount: 70,
    difficulty: 'Intermediate',
    estimatedHours: 44,
    overallProgress: 10,
    enrolled: false,
    chapters: historyChapters,
  },
  {
    id: 'subj-geography',
    name: 'Geography',
    slug: 'geography',
    category: 'Humanities',
    description: 'Physical geomorphology, climate ecosystems, demographic migrations, and spatial analysis.',
    chapterCount: 9,
    topicsCount: 45,
    difficulty: 'Beginner',
    estimatedHours: 28,
    overallProgress: 10,
    enrolled: false,
    chapters: geographyChapters,
  },
  {
    id: 'subj-economics',
    name: 'Economics',
    slug: 'economics',
    category: 'Business & Economics',
    description: 'Microeconomic market equilibria, fiscal policy, macroeconomic indicators, and trade models.',
    chapterCount: 13,
    topicsCount: 66,
    difficulty: 'Intermediate',
    estimatedHours: 42,
    overallProgress: 20,
    enrolled: true,
    chapters: economicsChapters,
  },
  {
    id: 'subj-accounting',
    name: 'Accounting',
    slug: 'accounting',
    category: 'Business & Economics',
    description: 'Financial ledger systems, double-entry bookkeeping, cash flow analysis, and corporate auditing.',
    chapterCount: 12,
    topicsCount: 58,
    difficulty: 'Intermediate',
    estimatedHours: 38,
    overallProgress: 10,
    enrolled: false,
    chapters: accountingChapters,
  },
  {
    id: 'subj-business',
    name: 'Business',
    slug: 'business',
    category: 'Business & Economics',
    description: 'Strategic leadership, operational logistics, brand positioning, and corporate governance.',
    chapterCount: 11,
    topicsCount: 50,
    difficulty: 'Beginner',
    estimatedHours: 34,
    overallProgress: 10,
    enrolled: false,
    chapters: businessChapters,
  },
  {
    id: 'subj-entrepreneurship',
    name: 'Entrepreneurship',
    slug: 'entrepreneurship',
    category: 'Business & Economics',
    description: 'Venture ideation, customer development, unit economics, term sheets, and scaling strategies.',
    chapterCount: 10,
    topicsCount: 46,
    difficulty: 'Beginner',
    estimatedHours: 30,
    overallProgress: 10,
    enrolled: false,
    chapters: entrepreneurshipChapters,
  },
  {
    id: 'subj-civics',
    name: 'Civics',
    slug: 'civics',
    category: 'Humanities',
    description: 'Constitutional jurisprudence, separation of powers, citizen participation, and judicial review.',
    chapterCount: 8,
    topicsCount: 38,
    difficulty: 'Beginner',
    estimatedHours: 24,
    overallProgress: 10,
    enrolled: false,
    chapters: civicsChapters,
  },
  {
    id: 'subj-literature',
    name: 'Literature',
    slug: 'literature',
    category: 'Humanities',
    description: 'Narratological structures, literary critique, poetical devices, and classic text analysis.',
    chapterCount: 10,
    topicsCount: 52,
    difficulty: 'Intermediate',
    estimatedHours: 32,
    overallProgress: 10,
    enrolled: false,
    chapters: literatureChapters,
  },
  {
    id: 'subj-gk',
    name: 'General Knowledge',
    slug: 'general-knowledge',
    category: 'Professional Skills',
    description: 'International treaties, scientific milestones, global summits, and geopolitical literacy.',
    chapterCount: 12,
    topicsCount: 90,
    difficulty: 'Beginner',
    estimatedHours: 26,
    overallProgress: 10,
    enrolled: false,
    chapters: gkChapters,
  },
  {
    id: 'subj-exam-prep',
    name: 'Exam Preparation',
    slug: 'exam-prep',
    category: 'Professional Skills',
    description: 'Standardized testing strategies, diagnostic timing drills, and mock exam simulations.',
    chapterCount: 16,
    topicsCount: 120,
    difficulty: 'Advanced',
    estimatedHours: 64,
    overallProgress: 20,
    enrolled: true,
    chapters: examPrepChapters,
  },
  {
    id: 'subj-skills',
    name: 'Professional Skills',
    slug: 'professional-skills',
    category: 'Professional Skills',
    description: 'Executive written communication, strategic decision-making, negotiations, and presentation design.',
    chapterCount: 10,
    topicsCount: 42,
    difficulty: 'Beginner',
    estimatedHours: 25,
    overallProgress: 10,
    enrolled: false,
    chapters: professionalSkillsChapters,
  }
];

/**
 * Dynamically synthesizes an authentic academic curriculum for "Any Subject" entered by a student.
 */
export function generateCustomSubject(subjectTitle: string): SubjectItem {
  const cleanTitle = subjectTitle.trim();
  const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const id = `custom-${slug}-${Date.now().toString(36)}`;

  const customChapters = createCurriculumForSubject(id, cleanTitle, [
    {
      number: 1,
      title: `Foundations & Core Principles of ${cleanTitle}`,
      description: `Fundamental definitions, first principles, taxonomy, and operational boundaries.`,
      topics: [
        {
          title: `First Principles & Key Terminology`,
          description: `Defining the foundational vocabulary and operational framework of ${cleanTitle}.`,
          lessonTitle: `Introduction to ${cleanTitle}`,
          durationMinutes: 15,
          overview: `A structured introduction to ${cleanTitle} broken down from first principles.`,
          explanation: `In ${cleanTitle}, mastering the foundational premises enables solving complex problems without reliance on rote memorization or surface-level analogy.`,
          keyTakeaways: [
            `Understand the scope and core objectives of ${cleanTitle}.`,
            `Identify the key variables and systemic interactions.`,
            `Apply diagnostic reasoning to baseline problems.`
          ],
          exampleTitle: 'Baseline Application',
          exampleDetail: `Analyzing standard scenarios in ${cleanTitle} under ordinary operating conditions.`,
          formulaOrCode: `System Function: F(${cleanTitle}) = f(Inputs, Principles, Context)`,
          checkQuestion: {
            question: `What is the most effective approach to mastering ${cleanTitle}?`,
            options: [
              'Deriving principles from fundamental truths rather than analogies',
              'Memorizing test answers without comprehension',
              'Skipping foundational chapters directly to advanced problems',
              'Relying solely on intuition'
            ],
            correctIndex: 0,
            explanation: 'First-principles learning builds durable mental models that adapt to novel questions.'
          }
        },
        {
          title: `Historical Evolution & Paradigms`,
          description: `How modern frameworks in ${cleanTitle} developed.`,
          lessonTitle: `Evolution of Thought in ${cleanTitle}`,
          durationMinutes: 18,
          overview: `Tracing key historical breakthroughs and paradigm shifts.`,
          explanation: `Major discoveries in ${cleanTitle} developed through continuous debate, empirical experimentation, and theoretical refinement.`,
          keyTakeaways: [
            'Historical context explains why current models are structured as they are.',
            'Major paradigm shifts resolved previous edge cases.',
            'Contemporary trends continue expanding this domain.'
          ],
          exampleTitle: 'The Landmark Breakthrough',
          exampleDetail: `How early theorists solved the primary bottleneck in ${cleanTitle}.`,
          checkQuestion: {
            question: `Why is understanding the evolution of ${cleanTitle} valuable?`,
            options: [
              'It provides context for why modern methodologies were adopted',
              'It guarantees immediate certification',
              'It replaces the need for practical application',
              'It eliminates the need for mathematical rigor'
            ],
            correctIndex: 0,
            explanation: 'Historical context illuminates the problem space that gave rise to contemporary frameworks.'
          }
        }
      ]
    },
    {
      number: 2,
      title: `Analytical Models & Methodology`,
      description: `Step-by-step frameworks, quantitative methods, and diagnostic trees.`,
      topics: [
        {
          title: `Systematic Problem Solving`,
          description: `Applying rigorous tools to evaluate scenarios in ${cleanTitle}.`,
          lessonTitle: `Analytical Frameworks in Practice`,
          durationMinutes: 20,
          overview: `Structured algorithms for tackling complex challenges.`,
          explanation: `Effective analysis in ${cleanTitle} requires decomposing high-level problems into mutually exclusive, collectively exhaustive subcomponents.`,
          keyTakeaways: [
            'Deconstruct complex questions into atomic variables.',
            'Verify boundary conditions and sanity checks.',
            'Document step-by-step reasoning clearly.'
          ],
          exampleTitle: 'Case Study Simulation',
          exampleDetail: `Step-by-step evaluation of an authentic case in ${cleanTitle}.`,
          checkQuestion: {
            question: 'When analyzing a complex challenge, what is the recommended first step?',
            options: [
              'Decompose the challenge into fundamental components and verify constraints',
              'Guess the final answer immediately',
              'Apply unrelated formulas',
              'Assume all variables are constant'
            ],
            correctIndex: 0,
            explanation: 'Decomposition and constraint verification ensure a methodical, error-free solution.'
          }
        }
      ]
    },
    {
      number: 3,
      title: `Capstone Mastery & Comprehensive Exam`,
      description: `Cross-disciplinary synthesis and multi-format exam preparation.`,
      topics: [
        {
          title: `Capstone Assessment`,
          description: `Comprehensive evaluation testing end-to-end retention and critical thinking.`,
          lessonTitle: `Final Capstone Assessment`,
          durationMinutes: 25,
          overview: `Review key concepts and complete the mastery test.`,
          explanation: `The capstone assessment synthesizes theory, problem solving, and analytical methods mastered throughout the course.`,
          keyTakeaways: [
            'Test end-to-end understanding under simulated exam conditions.',
            'Identify and remediate remaining weak areas.',
            'Achieve verified mastery in the subject.'
          ],
          exampleTitle: 'Synthesis Evaluation',
          exampleDetail: `Comprehensive synthesis problem testing multiple concepts concurrently.`,
          checkQuestion: {
            question: `What indicates true mastery of ${cleanTitle}?`,
            options: [
              'The ability to explain concepts simply and apply them to novel problems',
              'Rote memorization of flashcards',
              'Completing a lesson without reading',
              'Knowing only the definitions'
            ],
            correctIndex: 0,
            explanation: 'True mastery is demonstrated by intuitive explanation and agile problem solving on unfamiliar scenarios.'
          }
        }
      ]
    }
  ]);

  return {
    id,
    name: cleanTitle,
    slug,
    category: 'Custom',
    description: `A customized AI-synthesized curriculum for ${cleanTitle}, with modular chapters, progressive lessons, and adaptive quizzes.`,
    chapterCount: 3,
    topicsCount: 9,
    difficulty: 'Intermediate',
    estimatedHours: 18,
    overallProgress: 0,
    enrolled: true,
    isCustom: true,
    lastStudied: 'Just created',
    chapters: customChapters,
  };
}
