import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  CheckCircle,
  HelpCircle,
  FileText,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface AIResponseOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
  responseTitle: string;
  content: React.ReactNode;
}

export const InteractiveAgentPreview: React.FC<{
  onStartFree: () => void;
}> = ({ onStartFree }) => {
  const [activeTab, setActiveTab] = useState<'explain' | 'solve' | 'quiz' | 'notes' | 'flashcards'>('explain');
  const [customInput, setCustomInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [flippedCard, setFlippedCard] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 300);
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 400);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-lg overflow-hidden">
      {/* Top Console Bar */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide font-display">
            STUDY ZONE AI AGENT
          </span>
          <span className="text-slate-500 text-xs hidden sm:inline">·</span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Interactive Live Sandbox
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            Cognitive Engine v2
          </span>
        </div>
      </div>

      {/* Quick Action Mode Switcher */}
      <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'explain', label: 'Explain Concept', icon: <Lightbulb className="w-3.5 h-3.5" /> },
          { id: 'solve', label: 'Solve Problem', icon: <Zap className="w-3.5 h-3.5" /> },
          { id: 'quiz', label: 'Create Quiz', icon: <HelpCircle className="w-3.5 h-3.5" /> },
          { id: 'notes', label: 'Cornell Notes', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'flashcards', label: 'Flashcards', icon: <RotateCcw className="w-3.5 h-3.5" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-emerald-800 border border-slate-200 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span className={isActive ? 'text-emerald-600' : 'text-slate-400'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Agent Response Viewport */}
      <div className="p-6 sm:p-8 min-h-[340px] flex flex-col justify-between">
        {isTyping ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Study Zone AI is formulating educational breakdown...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'explain' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-emerald-700">Topic: Photosynthesis & Calvin Cycle</span>
                  <span className="font-mono text-[11px]">Level: High School & AP Biology</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 font-display">
                    Light-Dependent Reactions vs. The Calvin Cycle
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Think of Photosynthesis in two synchronized shifts:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-900 block mb-1">
                        1. The Light Reactions (Thylakoids)
                      </span>
                      <p className="text-slate-500">
                        Photons excite electrons in Chlorophyll P680, splitting H2O into oxygen, producing chemical battery power: <strong>ATP</strong> and <strong>NADPH</strong>.
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-900 block mb-1">
                        2. The Light-Independent Reactions (Stroma)
                      </span>
                      <p className="text-slate-500">
                        The enzyme <strong>RuBisCO</strong> fixes carbon from atmospheric $CO_2$ to assemble glucose using energy from Phase 1.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'solve' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-emerald-700">Calculus II: Integration by Parts</span>
                  <span className="font-mono text-[11px]">Formula: $\int u\,dv = uv - \int v\,du$</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="text-xs font-mono bg-white p-2.5 rounded border border-slate-200 text-slate-800">
                    Evaluate: $\int x \cdot \cos(x) \, dx$
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p><strong>Step 1 (LIATE rule selection):</strong> Let $u = x$ (Algebraic) and $dv = \cos(x)dx$ (Trigonometric).</p>
                    <p><strong>Step 2 (Differentiate & Integrate):</strong> $du = dx$ and $v = \sin(x)$.</p>
                    <p><strong>Step 3 (Substitute):</strong> $\int x\cos(x)dx = x\sin(x) - \int \sin(x)dx$.</p>
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 font-mono rounded border border-emerald-200 font-semibold">
                      Final Solution: $x\sin(x) + \cos(x) + C$
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-emerald-700">Computer Science: Algorithm Complexity</span>
                  <span className="font-mono text-[11px]">Question 1 of 1 (Interactive)</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900">
                    What is the average-case time complexity of searching for an element in a balanced Binary Search Tree (AVL / Red-Black Tree)?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 1, text: 'A) O(1) Constant Time' },
                      { id: 2, text: 'B) O(log n) Logarithmic Time', correct: true },
                      { id: 3, text: 'C) O(n) Linear Time' },
                      { id: 4, text: 'D) O(n²) Quadratic Time' },
                    ].map((opt) => {
                      const isSelected = quizAnswer === opt.id;
                      const isCorrect = opt.correct;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setQuizAnswer(opt.id)}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                            isSelected
                              ? isCorrect
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-medium'
                                : 'bg-rose-100 border-rose-300 text-rose-900'
                              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                  {quizAnswer !== null && (
                    <div className="text-xs text-slate-600 pt-2 border-t border-slate-200">
                      {quizAnswer === 2 ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" /> Correct! Each comparison halves the remaining search subspace.
                        </span>
                      ) : (
                        <span className="text-rose-600 font-medium">
                          Incorrect. Binary tree search depth scales with tree height $\log_2(n)$.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-emerald-700">Economics: Supply & Demand Equilibrium</span>
                  <span className="font-mono text-[11px]">Format: Cornell Method</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px] text-emerald-700">
                      Key Cues
                    </span>
                    <ul className="text-slate-600 space-y-1 list-disc pl-4">
                      <li>Law of Demand</li>
                      <li>Market Clearing Price</li>
                      <li>Deadweight Loss</li>
                    </ul>
                  </div>
                  <div className="md:col-span-2 p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px] text-emerald-700">
                      Lecture Notes
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      Equilibrium occurs where quantity demanded ($Q_d$) equals quantity supplied ($Q_s$). Price ceilings set below equilibrium cause shortages; price floors above cause surpluses.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'flashcards' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-emerald-700">Chemistry: Thermodynamics & Entropy</span>
                  <span className="font-mono text-[11px]">Click Card to Flip</span>
                </div>
                <div
                  onClick={() => setFlippedCard(!flippedCard)}
                  className="cursor-pointer min-h-[140px] p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 flex flex-col items-center justify-center text-center shadow-xs transition-all hover:border-emerald-300"
                >
                  <span className="text-[10px] font-mono text-emerald-700 uppercase tracking-widest mb-2 font-semibold">
                    {flippedCard ? 'Answer / Explanation' : 'Question (Front)'}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 max-w-md">
                    {flippedCard
                      ? 'Gibbs Free Energy Equation: ΔG = ΔH - TΔS. A reaction is thermodynamically spontaneous when ΔG is negative.'
                      : 'State the formula for Gibbs Free Energy and under what condition a reaction is spontaneous.'}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-3">
                    {flippedCard ? 'Tap to see prompt' : 'Tap to reveal answer'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Prompt Trigger Input */}
        <form onSubmit={handlePromptSubmit} className="pt-4 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder={`Ask Study Zone AI about ${activeTab === 'explain' ? 'any concept' : activeTab === 'solve' ? 'a numerical problem' : 'your exam syllabus'}...`}
            className="flex-1 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs rounded-lg border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Ask AI
          </Button>
        </form>
      </div>

      {/* Footer Banner */}
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
        <span>Available 24/7 across 40+ academic disciplines</span>
        <button
          onClick={onStartFree}
          className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          Open Full AI Workspace <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
