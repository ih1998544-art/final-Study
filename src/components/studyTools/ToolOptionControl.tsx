import React from 'react';
import { ToolOption } from '../../types/studyTools';
import { ChevronDown } from 'lucide-react';

interface ToolOptionControlProps {
  option: ToolOption;
  value: string | number | boolean;
  onChange: (val: string | number | boolean) => void;
}

export const ToolOptionControl: React.FC<ToolOptionControlProps> = ({
  option,
  value,
  onChange,
}) => {
  if (option.type === 'select') {
    return (
      <div className="flex flex-col gap-1.5 min-w-[170px] flex-1 sm:flex-initial">
        <label className="text-xs font-semibold text-slate-700 tracking-tight">
          {option.label}
        </label>
        <div className="relative">
          <select
            value={String(value ?? option.defaultValue)}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 pr-8 text-xs font-medium text-slate-800 shadow-xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors cursor-pointer"
          >
            {option.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    );
  }

  if (option.type === 'toggle') {
    const isChecked = Boolean(value ?? option.defaultValue);
    return (
      <div className="flex items-center justify-between gap-3 pt-4 sm:pt-6">
        <label className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
          {option.label}
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={isChecked}
          onClick={() => onChange(!isChecked)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
            isChecked ? 'bg-emerald-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              isChecked ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    );
  }

  if (option.type === 'number') {
    return (
      <div className="flex flex-col gap-1.5 min-w-[120px]">
        <label className="text-xs font-semibold text-slate-700 tracking-tight">
          {option.label}
        </label>
        <input
          type="number"
          min={option.min}
          max={option.max}
          step={option.step}
          value={Number(value ?? option.defaultValue)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 shadow-xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
        />
      </div>
    );
  }

  return null;
};
