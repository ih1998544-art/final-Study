import React from 'react';

interface OfficialLogoProps {
  appId: string;
  className?: string;
  size?: number;
}

export const OfficialAppLogo: React.FC<OfficialLogoProps> = ({ appId, className = 'w-6 h-6', size = 24 }) => {
  switch (appId) {
    // 1. ChatGPT (OpenAI)
    case 'chatgpt':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#10A37F" />
          <path
            d="M17.8 11.2a3.7 3.7 0 0 0-.3-2.7 3.8 3.8 0 0 0-2.6-1.9 3.8 3.8 0 0 0-3.6-1.3 3.8 3.8 0 0 0-3.1 2.3 3.7 3.7 0 0 0-1.9 1.4 3.8 3.8 0 0 0-.5 2.9 3.7 3.7 0 0 0 .3 2.7 3.8 3.8 0 0 0 2.6 1.9 3.8 3.8 0 0 0 3.6 1.3 3.8 3.8 0 0 0 3.1-2.3 3.7 3.7 0 0 0 1.9-1.4 3.8 3.8 0 0 0 .5-2.9zm-5.8 5.7c-.5 0-1-.1-1.4-.4l.1-.1 2.7-1.6c.1-.1.2-.2.2-.4v-3.7l1.1.7v3.2a2.3 2.3 0 0 1-2.7 2.3zm-4.7-2.2a2.2 2.2 0 0 1-.3-1.4c0-.5.2-1 .5-1.4l.1.1 2.7 1.6c.1.1.3.1.4 0l3.2-1.9v1.3l-2.8 1.6a2.3 2.3 0 0 1-3.8-.9zm-1.1-4.9c.2-.5.5-.8 1-1.1l2.7 1.6c.1.1.3.1.4 0l3.2-1.9-1.1-.7-2.8 1.6a2.3 2.3 0 0 0-3.4.5zm8.9 1.4l-3.2 1.9-1.1-.7 2.8-1.6a2.3 2.3 0 0 1 3.4.5c.3.4.5.9.5 1.4 0 .5-.2 1-.5 1.4l-.1-.1-1.8-1.4zm2.1-1.6c0 .5-.2 1-.5 1.4l-.1-.1-2.7-1.6c-.1-.1-.3-.1-.4 0l-3.2 1.9v-1.3l2.8-1.6a2.3 2.3 0 0 1 3.8.9c.2.4.3.9.3 1.4zm-5-3.8c.5 0 1 .1 1.4.4l-.1.1-2.7 1.6c-.1.1-.2.2-.2.4v3.7l-1.1-.7V7.1a2.3 2.3 0 0 1 2.7-2.3z"
            fill="#FFFFFF"
          />
        </svg>
      );

    // 2. Google Gemini
    case 'gemini':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1BA0F2" />
              <stop offset="45%" stopColor="#7E57C2" />
              <stop offset="100%" stopColor="#D96570" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill="#131314" />
          <path
            d="M12 3C12 7.97 7.97 12 3 12C7.97 12 12 16.03 12 21C12 16.03 16.03 12 21 12C16.03 12 12 7.97 12 3Z"
            fill="url(#geminiGrad)"
          />
        </svg>
      );

    // 3. Claude (Anthropic)
    case 'claude':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#CC785C" />
          <path
            d="M13.2 4.5h-2.4l-.5 4.3-3.6-2.5-1.4 2 3.6 2.6-4.4.7v2.4l4.4.7-3.6 2.6 1.4 2 3.6-2.5.5 4.3h2.4l.5-4.3 3.6 2.5 1.4-2-3.6-2.6 4.4-.7v-2.4l-4.4-.7 3.6-2.6-1.4-2-3.6 2.5-.5-4.3z"
            fill="#FFFFFF"
          />
        </svg>
      );

    // 4. NotebookLM
    case 'notebooklm':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#1A73E8" />
          <path
            d="M6 5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18.5v-13z"
            fill="#FFFFFF"
          />
          <path d="M9 8h6M9 11h6M9 14h4" stroke="#1A73E8" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="15.5" cy="15.5" r="2.5" fill="#34A853" />
        </svg>
      );

    // 5. Mindgrasp
    case 'mindgrasp':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#7C3AED" />
          <path
            d="M12 4a6 6 0 0 0-4 10.45V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.55A6 6 0 0 0 12 4zm-2 15h4v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1z"
            fill="#FFFFFF"
          />
          <circle cx="10" cy="10" r="1" fill="#7C3AED" />
          <circle cx="14" cy="10" r="1" fill="#7C3AED" />
        </svg>
      );

    // 6. Perplexity AI
    case 'perplexity':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#1F2937" />
          <path
            d="M12 4v7m0 0l4.5-4.5M12 11L7.5 6.5M12 11v9m0-9l5 4.5M12 11l-5 4.5M6 8h12M6 16h12"
            stroke="#22D3EE"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    // 7. Elicit
    case 'elicit':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#4F46E5" />
          <path
            d="M12 5l6 3.5v7L12 19l-6-3.5v-7L12 5z"
            stroke="#FFFFFF"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2.5" fill="#FFFFFF" />
        </svg>
      );

    // 8. Consensus
    case 'consensus':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#0D9488" />
          <circle cx="12" cy="12" r="7" stroke="#FFFFFF" strokeWidth="1.75" />
          <path d="M12 5a7 7 0 0 1 7 7M12 19a7 7 0 0 1-7-7" stroke="#99F6E4" strokeWidth="1.75" />
          <circle cx="12" cy="12" r="2.5" fill="#FFFFFF" />
        </svg>
      );

    // 9. Wolfram Alpha
    case 'wolframalpha':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#DD1100" />
          <path
            d="M12 4l1.8 3.5 3.9-.9-1.2 3.8 3.5 1.8-3.5 1.8 1.2 3.8-3.9-.9L12 20l-1.8-3.5-3.9.9 1.2-3.8-3.5-1.8 3.5-1.8-1.2-3.8 3.9.9L12 4z"
            fill="#FFFFFF"
          />
          <circle cx="12" cy="12" r="2" fill="#DD1100" />
        </svg>
      );

    // 10. Photomath
    case 'photomath':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#EA4335" />
          <path
            d="M6 9V6h3M18 9V6h-3M6 15v3h3M18 15v3h-3"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M10 12h4M12 10v4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // 11. Quizlet
    case 'quizlet':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#4257B2" />
          <circle cx="11.5" cy="11.5" r="5.5" stroke="#FFFFFF" strokeWidth="2.5" />
          <path d="M15.5 15.5L19 19" stroke="#3CCCFE" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M11 8l2 3h-3l2 3" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    // 12. Anki
    case 'anki':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#0284C7" />
          <path
            d="M12 6l1.8 3.8 4.2.6-3 3 .7 4.2-3.7-2-3.7 2 .7-4.2-3-3 4.2-.6L12 6z"
            fill="#FFFFFF"
          />
          <path d="M6 18h12" stroke="#BAE6FD" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );

    // 13. Knowt
    case 'knowt':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#6366F1" />
          <path
            d="M13 5L7 13h5l-1 6 6-8h-5l1-6z"
            fill="#FACC15"
            stroke="#FFFFFF"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </svg>
      );

    // 14. Khanmigo (Khan Academy)
    case 'khanmigo':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#14BF96" />
          <path
            d="M12 6c-3 0-5 2-5 5 0 2.5 1.5 4.5 4 4.9V18h2v-2.1c2.5-.4 4-2.4 4-4.9 0-3-2-5-5-5zm-1 7.5a2.5 2.5 0 1 1 0-5v5zm2 0v-5a2.5 2.5 0 1 1 0 5z"
            fill="#FFFFFF"
          />
          <circle cx="12" cy="4" r="1.5" fill="#FFFFFF" />
        </svg>
      );

    // 15. Grammarly
    case 'grammarly':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#15C39A" />
          <circle cx="12" cy="12" r="7" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="32 8" />
          <path d="M12 9v6h3" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // 16. QuillBot
    case 'quillbot':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#44B78B" />
          <path
            d="M18 5c-4 1-7 4-8 8l-2 6 6-2c4-1 7-4 8-8V5h-4z"
            fill="#FFFFFF"
          />
          <circle cx="14" cy="10" r="1.5" fill="#44B78B" />
        </svg>
      );

    // 17. GitHub Copilot
    case 'github_copilot':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#24292F" />
          <path
            d="M12 6a6 6 0 0 0-6 6c0 2.4 1.4 4.5 3.5 5.4.2 0 .3-.1.3-.2v-.9c-1.7.4-2-1-2-1-.3-.7-.7-.9-.7-.9-.5-.4 0-.4 0-.4.6 0 .9.6.9.6.5.9 1.4.6 1.7.5.1-.4.2-.6.4-.8-1.4-.2-2.8-.7-2.8-3.1 0-.7.2-1.3.6-1.7 0-.2-.3-.8 0-1.7 0 0 .5-.2 1.8.7a6.2 6.2 0 0 1 3.2 0c1.3-.9 1.8-.7 1.8-.7.3.9 0 1.5 0 1.7.4.4.6 1 .6 1.7 0 2.4-1.4 2.9-2.8 3.1.2.2.4.6.4 1.2v1.8c0 .1.1.2.3.2A6 6 0 0 0 18 12a6 6 0 0 0-6-6z"
            fill="#FFFFFF"
          />
          <circle cx="9.5" cy="11.5" r="1" fill="#3B82F6" />
          <circle cx="14.5" cy="11.5" r="1" fill="#3B82F6" />
        </svg>
      );

    // 18. Gamma
    case 'gamma':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gammaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill="#18181B" />
          <path
            d="M6 6h12v4H10v8H6V6z"
            fill="url(#gammaGrad)"
          />
          <circle cx="15" cy="15" r="2.5" fill="#EC4899" />
        </svg>
      );

    // 19. Canva
    case 'canva_ai':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="canvaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00C4CC" />
              <stop offset="100%" stopColor="#7D2AE8" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill="url(#canvaGrad)" />
          <path
            d="M15.5 8.5c-.8-.5-2-.6-3 0-2.3 1.3-3.5 4.5-2.8 7 .5 1.8 2.2 2.7 3.8 2 1.4-.6 2.3-2 2.5-3.5h-1.8c-.2.8-.7 1.5-1.5 1.7-.9.3-1.8-.2-2.1-1.1-.5-1.5.2-3.8 1.8-4.7.7-.4 1.4-.4 1.9 0 .4.4.6 1 .7 1.6h1.8c-.1-1.2-.5-2.2-1.3-3z"
            fill="#FFFFFF"
          />
        </svg>
      );

    // 20. Duolingo Max
    case 'duolingo_max':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#58CC02" />
          {/* Duo the owl face */}
          <circle cx="8" cy="11" r="3.5" fill="#FFFFFF" />
          <circle cx="16" cy="11" r="3.5" fill="#FFFFFF" />
          <circle cx="8.5" cy="11" r="2" fill="#4B4B4B" />
          <circle cx="15.5" cy="11" r="2" fill="#4B4B4B" />
          <circle cx="9" cy="10.5" r="0.8" fill="#FFFFFF" />
          <circle cx="16" cy="10.5" r="0.8" fill="#FFFFFF" />
          <polygon points="12,12 10.5,14 13.5,14" fill="#FF9600" />
        </svg>
      );

    // 21. Notion AI
    case 'notion_ai':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#000000" />
          <path
            d="M6 6.5l2.5-.5 7.5 1.5-1 10.5L8 18.5 6 6.5z"
            fill="#FFFFFF"
          />
          <path
            d="M9 8v7l4-6v7"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="17.5" cy="6.5" r="2" fill="#A855F7" />
        </svg>
      );

    // 22. Otter.ai
    case 'otter_ai':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#2563EB" />
          <circle cx="8" cy="12" r="3" fill="#FFFFFF" />
          <circle cx="16" cy="12" r="3" fill="#FFFFFF" />
          <circle cx="8" cy="12" r="1.5" fill="#2563EB" />
          <circle cx="16" cy="12" r="1.5" fill="#2563EB" />
        </svg>
      );

    // 23. Semantic Scholar
    case 'semantic_scholar':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="#1E3A8A" />
          <polygon points="12,5 4,9 12,13 20,9" fill="#60A5FA" />
          <path
            d="M7 11.5v4c0 2 2.5 3.5 5 3.5s5-1.5 5-3.5v-4"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line x1="20" y1="9" x2="20" y2="15" stroke="#FBBF24" strokeWidth="1.5" />
        </svg>
      );

    default:
      return (
        <div className={`rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs ${className}`}>
          AI
        </div>
      );
  }
};
