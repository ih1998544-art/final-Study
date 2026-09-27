import {
  MultiDepthExplanation,
  PracticeExerciseItem,
  DiagnosticAssessmentQuestion,
  RapidRevisionSheet,
  WeakAreaReport,
} from '../types/learning';

class LearningContentService {
  /**
   * Generates rich 5-level multi-depth pedagogical explanations for ANY subject and lesson.
   */
  getMultiDepthExplanation(
    subjectName: string,
    lessonTitle: string,
    baseExplanation: string,
    keyTakeaways: string[] = []
  ): MultiDepthExplanation {
    const isSTEM =
      subjectName.includes('Math') ||
      subjectName.includes('Physics') ||
      subjectName.includes('Chemistry') ||
      subjectName.includes('Computer') ||
      subjectName.includes('Engineering');

    return {
      simple: {
        summary: `Think of ${lessonTitle} as a set of rules that keeps a system working smoothly and predictably without any guesswork.`,
        analogy: isSTEM
          ? `Imagine you are balancing a playground seesaw. If you add weight to one side, you must either move the fulcrum or add an equal balancing weight on the opposite side. That is the fundamental intuition here.`
          : `Imagine a busy traffic roundabout. Instead of everyone rushing in at random, a simple set of priority rules ensures everyone reaches their destination safely and efficiently.`,
        keyPoints: [
          `No need for complex jargon: it's simply cause and effect.`,
          `When parameter A changes, component B adjusts automatically to maintain balance.`,
          `You encounter this principle every day in nature, technology, and society.`,
        ],
      },
      normal: {
        overview: baseExplanation || `This lesson covers the primary mechanisms and theoretical underpinnings of ${lessonTitle} within the standard ${subjectName} curriculum.`,
        explanation: baseExplanation
          ? `${baseExplanation}\n\nUnderstanding how these variables interact enables students to systematically model systems, predict outcomes under varying constraints, and solve standard curriculum problems.`
          : `In ${subjectName}, ${lessonTitle} describes the quantitative and qualitative relationships between fundamental system variables. By formalizing these behaviors into standard laws, we eliminate ambiguity and establish repeatable results.`,
        keyTakeaways: keyTakeaways.length > 0
          ? keyTakeaways
          : [
              `Core principles establish the baseline rules of operation.`,
              `Changes propagate through direct and inverse relationships.`,
              `Boundary constraints dictate when the model remains valid.`,
            ],
      },
      detailed: {
        theoreticalBasis: `Rigorous analysis of ${lessonTitle} requires establishing formal axioms, identifying invariant conservation properties, and examining asymptotic behavior as inputs approach boundary limits.`,
        formalDerivationOrProof: isSTEM
          ? `Let the state vector be denoted by S(t) ∈ ℝⁿ governed by the differential relation dS/dt = f(S, t; θ). By taking the partial derivatives with respect to state parameters ∂f/∂S and applying the chain rule across continuous limits, we verify that the Jacobian matrix is strictly negative semi-definite, guaranteeing Lyapunov asymptotic stability.`
          : `From a socio-structural perspective, this phenomenon represents an institutional equilibrium. Applying game-theoretic minimax criteria demonstrates that deviations from this protocol incur asymmetric penalties, rendering the system self-reinforcing.`,
        advancedImplications: [
          `Eliminates reliance on first-order linear approximations in nonlinear regimes.`,
          `Establishes mathematical bounds for error propagation and numerical stability.`,
          `Directly interfaces with higher-order graduate literature and industrial simulation models.`,
        ],
      },
      exam: {
        rubricRequirements: [
          `Award 1 Mark: State the exact formal textbook definition in the opening sentence.`,
          `Award 2 Marks: Write the governing formula or primary theorem with explicit units and domain limits.`,
          `Award 2 Marks: Show complete intermediate algebraic or logical working; do not skip substitution steps.`,
          `Award 1 Mark: Conclude with a real-world physical or contextual interpretation.`,
        ],
        highYieldKeywords: [
          `Equilibrium`,
          `Conservation Law`,
          `Rate of Change`,
          `Boundary Constraints`,
          `Asymptotic Stability`,
          `Proportionality Constant`,
        ],
        modelAnswerSnippet: `\"In accordance with the governing principle of ${lessonTitle}, the rate of change is directly proportional to the applied potential gradient, assuming steady-state conditions. Therefore, substituting initial parameters into the governing equation yields the verified value within accepted experimental tolerance.\"`,
        commonExaminerTraps: [
          `Trap 1: Omitting units or dimensions in the final calculated answer (costs 1 mark automatically).`,
          `Trap 2: Forgetting to explicitly write out foundational assumptions (e.g. \"Assuming standard temperature and pressure\" or \"Assuming frictionless surface\").`,
          `Trap 3: Prematurely rounding intermediate numbers in multi-step questions, leading to compounding rounding errors.`,
        ],
      },
      stepByStep: {
        steps: [
          {
            stepNumber: 1,
            title: 'Identify Knowns, Variables & Given Parameters',
            instruction: 'Extract all given data points from the problem statement and convert them into standardized SI or canonical units.',
            reasoning: 'Prevents unit mismatch errors and clarifies what equation connects the knowns to the target unknown.',
          },
          {
            stepNumber: 2,
            title: 'Select the Governing Equation / Principle',
            instruction: `State the general formula for ${lessonTitle} before plugging in any specific numerical values.`,
            reasoning: 'Secures method marks on exam rubrics even if an arithmetic calculation error occurs later.',
          },
          {
            stepNumber: 3,
            title: 'Substitute & Isolate the Target Variable',
            instruction: 'Rearrange the expression algebraically to isolate the desired output on the left-hand side before calculation.',
            reasoning: 'Reduces cognitive load and allows immediate sanity checking of the algebraic dimensions.',
          },
          {
            stepNumber: 4,
            title: 'Sanity Check & Boundary Verification',
            instruction: 'Check limiting cases (e.g. what happens if x = 0 or x → ∞) to ensure physical plausibility.',
            reasoning: 'Eliminates unrealistic answers like negative masses, probabilities > 1, or inverted rates.',
          },
        ],
        verificationCheck: 'Confirm that dimensions on both sides of the final equality match identically [L·T⁻¹ = L·T⁻¹].',
      },
    };
  }

  /**
   * Generates interactive practice exercises with tiered hints.
   */
  getPracticeExercises(subjectName: string, lessonTitle: string): PracticeExerciseItem[] {
    return [
      {
        id: 'prac-1',
        question: `Applying ${lessonTitle}: If the primary input variable is doubled while system resistance remains constant, what is the resulting effect on total system throughput?`,
        hints: [
          'Recall the direct proportionality relation established in the core formula.',
          'Consider what happens mathematically when you multiply the numerator by 2.',
          'If output = k · input / resistance, substituting 2 · input doubles the entire fraction.',
        ],
        options: [
          'Throughput decreases by 50%',
          'Throughput remains unchanged',
          'Throughput doubles (increases by 100%)',
          'Throughput quadruples (increases by 300%)',
        ],
        correctOptionIndex: 2,
        solutionWalkthrough: `By the direct linear relation output ∝ input, doubling the numerator while keeping the denominator constant results in an exact 2x factor increase (doubles throughput).`,
      },
      {
        id: 'prac-2',
        question: `Boundary Case Challenge: What happens to the governing relationship of ${lessonTitle} when operating at extreme limits (e.g. absolute zero, near-light speed, or zero inventory)?`,
        hints: [
          'Most classical models assume ideal linear conditions that break down at extreme limits.',
          'Look for asymptotic ceilings or quantum/relativistic thresholds.',
        ],
        options: [
          'The classical linear model continues indefinitely without deviation',
          'Non-linear effects dominate, requiring higher-order corrections or relativistic frameworks',
          'The system output drops instantaneously to zero in all cases',
          'The proportionality constant inverts its mathematical sign',
        ],
        correctOptionIndex: 1,
        solutionWalkthrough: `At boundary extremes, foundational assumptions of continuity and linearity break down. Relativistic, quantum, or capacity constraints introduce non-linear saturation regimes.`,
      },
    ];
  }

  /**
   * Generates a 4-question Pre-Assessment to calibrate learning paths.
   */
  getDiagnosticAssessment(subjectName: string): DiagnosticAssessmentQuestion[] {
    return [
      {
        id: 'diag-1',
        question: `Foundational Check: What is the primary definition and role of ${subjectName} in solving real-world challenges?`,
        options: [
          'A purely theoretical taxonomy with no empirical application',
          'A systematic framework for modeling, predicting, and optimizing complex systems',
          'A historical collection of unchangeable dogmatic rules',
          'An ad-hoc trial-and-error heuristic method',
        ],
        correctIndex: 1,
        explanation: `${subjectName} provides rigorous frameworks for empirical modeling, quantitative analysis, and predictive optimization.`,
        conceptTested: 'Foundational Principles',
      },
      {
        id: 'diag-2',
        question: `Methodological Reasoning: When analyzing experimental or empirical data in ${subjectName}, which approach ensures validity?`,
        options: [
          'Discarding outliers without investigation',
          'Formulating hypotheses, isolating independent variables, and validating against control baselines',
          'Relying strictly on intuition over quantitative measurement',
          'Assuming correlation always establishes direct causation',
        ],
        correctIndex: 1,
        explanation: 'Scientific rigor requires controlled variable isolation, hypothesis formulation, and empirical verification.',
        conceptTested: 'Experimental Methodology',
      },
      {
        id: 'diag-3',
        question: `Quantitative Synthesis: How are mathematical equations and models utilized within ${subjectName}?`,
        options: [
          'As decorative notation without practical meaning',
          'To formalize conservation laws, state transitions, and rate dynamics precisely',
          'Only for elementary addition and subtraction',
          'Exclusively in theoretical textbooks but never in real-world application',
        ],
        correctIndex: 1,
        explanation: 'Mathematical formulations capture exact rate dynamics, conservation laws, and systemic equilibrium.',
        conceptTested: 'Quantitative Modeling',
      },
      {
        id: 'diag-4',
        question: `Advanced Problem Solving: When encountering a multi-variable problem in ${subjectName}, what is the best first step?`,
        options: [
          'Guess the final answer immediately to save time',
          'Deconstruct the problem into constituent sub-problems and identify governing conservation principles',
          'Apply an arbitrary formula without checking boundary constraints',
          'Assume all variables are equal to zero',
        ],
        correctIndex: 1,
        explanation: 'Decomposition and first-principles analysis allow complex systems to be solved systematically.',
        conceptTested: 'Analytical Synthesis',
      },
    ];
  }

  /**
   * Generates a Rapid 10-Minute Revision Sheet.
   */
  getRapidRevisionSheet(subjectName: string, topicTitle: string): RapidRevisionSheet {
    return {
      cheatSheetSummary: `High-density rapid review sheet for ${topicTitle} in ${subjectName}. Designed for rapid active recall 24 hours before examination.`,
      coreFormulasOrPrinciples: [
        'Principle of Invariance: Conserved quantities remain constant in isolated systems.',
        'Rate Law: Instantaneous change is proportional to driving potential over resistance.',
        'Boundary Rule: Always verify conditions at t = 0, x = 0, and as limits approach infinity.',
        'Dimensional Consistency: Verify units across every term in additive equations.',
      ],
      activeRecallTriggers: [
        {
          question: `What is the core definition of ${topicTitle}?`,
          answer: `The fundamental framework governing how states transform under specific boundary conditions in ${subjectName}.`,
        },
        {
          question: 'What is the most frequent student misconception on this topic?',
          answer: 'Confusing correlation with causation, or omitting unit conversions in intermediate stages.',
        },
        {
          question: 'How do you check if your answer is physically reasonable?',
          answer: 'Check order of magnitude, verify dimensional homogeneity, and test zero/infinity boundary limits.',
        },
      ],
      mnemonics: [
        '\"K-E-E-P\": Knowns, Equation, Evaluation, Proof check.',
        '\"U-N-I-T\": Units, Numerator, Intermediate steps, Total verification.',
      ],
    };
  }

  /**
   * Analyzes quiz scores and diagnoses weak areas.
   */
  evaluateWeakAreas(score: number, totalQuestions: number, subjectName: string, topicTitle: string): WeakAreaReport {
    const percentage = Math.round((score / totalQuestions) * 100);
    const hasWeakArea = percentage < 75;

    return {
      detected: hasWeakArea,
      scorePercentage: percentage,
      identifiedGaps: hasWeakArea
        ? [
            `Boundary condition analysis under extreme constraints.`,
            `Intermediate step justifications and algebraic isolation.`,
            `Distinguishing between underlying causal drivers vs symptoms.`,
          ]
        : [],
      prescribedActions: hasWeakArea
        ? [
            `Review the \"Step-by-Step\" explanation depth for ${topicTitle}.`,
            `Complete the 2-problem guided practice drill with hints.`,
            `Request an AI Socratic diagnostic session focusing on characteristic edge cases.`,
          ]
        : [
            `Solid mastery demonstrated! Ready to advance to the next curriculum milestone.`,
          ],
      aiRevisionPrompt: `I scored ${percentage}% on ${topicTitle} in ${subjectName}. Can you give me a targeted 1-on-1 Socratic breakdown of where students commonly make mistakes on boundary conditions and give me 2 practice problems?`,
    };
  }
}

export const learningContentService = new LearningContentService();
