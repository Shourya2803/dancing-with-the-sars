"use client";

import React from "react";
import { X, ShieldCheck, AlertOctagon, Orbit, BookOpen, ExternalLink } from "lucide-react";

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MethodologyModal({ isOpen, onClose }: MethodologyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-space-900 border border-slate-700 rounded-2xl shadow-2xl overflow-y-auto p-6 text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-500/50 flex items-center justify-center text-sky-400">
            <Orbit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Scientific Methodology & Provenance
            </h2>
            <p className="text-xs text-sky-400 font-mono">
              Dancing with the SARs • NASA Space Apps Challenge
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs leading-relaxed">
          {/* 1. What is NISAR? */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              1. What is NISAR?
            </h3>
            <p className="text-slate-300">
              The <strong>NASA-ISRO Synthetic Aperture Radar (NISAR)</strong> is a joint
              Earth observation mission by NASA and ISRO utilizing dual-frequency L-band
              (1.26 GHz) and S-band (3.2 GHz) radar to systematically measure changes on
              Earth&apos;s dynamic surface with high spatial and temporal resolution.
            </p>
            <p className="text-slate-300">
              Unlike optical satellites, SAR can penetrate clouds, fog, and darkness,
              making it ideal for the cloud-covered, rugged Himalayan topography of
              Uttarakhand.
            </p>
          </section>

          {/* 2. What does this application do? */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              2. What does the application do?
            </h3>
            <p className="text-slate-300">
              The application queries verified satellite granules from NASA&apos;s CMR
              catalog, matches repeat-pass orbital tracks (e.g. Track 106, Frame 073),
              and computes the radiometrically terrain-corrected log-ratio (&Delta;&gamma;&sup0;)
              using Level-2 GCOV covariance matrices.
            </p>
            <div className="p-3 rounded-xl bg-space-950 border border-slate-800 font-mono text-[11px] text-slate-300">
              Δγ⁰_dB = 10 · log₁₀(γ⁰_t2 / γ⁰_t1)
              <br />
              <span className="text-slate-400">
                Calibrated Threshold: |Δγ⁰| ≥ 3.0 dB (2× power shift, separating real surface change from sensor speckle)
              </span>
            </div>
          </section>

          {/* 3. Absolute Scientific Anti-Hallucination Rule */}
          <section className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/40 space-y-2">
            <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              3. What does it NOT do?
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-[11px]">
              <li>
                <strong>Not a universal disaster detector:</strong> A measurable change in
                radar backscatter indicates altered surface geometry, roughness, or moisture;
                it does not automatically confirm a landslide, flood, or earthquake.
              </li>
              <li>
                <strong>No fake scientific data:</strong> The frontend never invents
                satellite acquisitions, change percentages, or confidence scores. All values
                stem from the scientific backend.
              </li>
              <li>
                <strong>Gemini constraint:</strong> AI is strictly restricted to plain-language
                translation of precalculated statistical moments. AI never evaluates raw binary data.
              </li>
            </ul>
          </section>

          {/* Attribution & Notice */}
          <section className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-mono gap-2">
            <span>Built for NASA Space Apps Challenge</span>
            <span>NASA ASF DAAC & CMR • ISRO Space Applications</span>
          </section>
        </div>
      </div>
    </div>
  );
}
