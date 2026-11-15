"use client";

import React from "react";
import { Sparkles, ShieldAlert, CheckCircle2, HelpCircle } from "lucide-react";

interface AIExplanationProps {
  explanationText?: string;
  limitations?: string[];
}

export default function AIExplanation({
  explanationText,
  limitations,
}: AIExplanationProps) {
  return (
    <div className="rounded-2xl bg-space-900/90 border border-sky-500/40 p-5 backdrop-blur-xl shadow-xl space-y-4">
      {/* Top AI Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-950 border border-sky-500/50 flex items-center justify-center text-sky-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono font-semibold text-sky-300 uppercase tracking-wider">
              ✦ AI Scientific Interpretation (Gemini Translation Layer)
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Constrained plain-language translation of precomputed radar moments
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
          STRICTLY CONSTRAINED
        </span>
      </div>

      {/* Main Formatted Explanation */}
      <div className="text-sm text-slate-200 leading-relaxed font-sans space-y-3">
        {explanationText ? (
          <div className="whitespace-pre-line text-xs font-mono bg-space-950/80 p-4 rounded-xl border border-slate-800/80 leading-relaxed text-slate-300">
            {explanationText}
          </div>
        ) : (
          <div className="space-y-3 text-xs font-sans">
            <div>
              <h4 className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                What happened?
              </h4>
              <p className="text-slate-300 leading-relaxed">
                The analysis indicates measurable radar backscatter differences
                across localized sections of the selected area during the analyzed
                NISAR repeat-pass cycle.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                What does this mean?
              </h4>
              <p className="text-slate-300 leading-relaxed">
                The result highlights areas where the measured radar response
                changed significantly (|&Delta;&gamma;&sup0;| &ge; 3.0 dB, representing
                a 2&times; power shift) according to the radiometrically terrain-corrected
                log-ratio algorithm.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Scientific Limitation Warning Box */}
      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-amber-500/30 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 text-amber-300 font-mono font-semibold text-[11px]">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Important Scientific Limitations</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          The result indicates measurable radar change. It does not automatically
          confirm a specific event (such as a landslide, flood, or deforestation)
          without auxiliary ground truth or multi-source sensor corroboration. Radar
          observes geometry, roughness, and moisture.
        </p>
      </div>
    </div>
  );
}
