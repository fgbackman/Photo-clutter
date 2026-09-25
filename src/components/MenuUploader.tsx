import React, { useState, useRef } from "react";
import { Upload, FileText, Sparkles, ChefHat, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { SAMPLE_MENUS, SampleMenu } from "../data/sampleMenus";

interface MenuUploaderProps {
  onParseMenu: (menuText: string) => Promise<void>;
  isParsing: boolean;
  onCancel?: () => void;
  hasExistingMenu?: boolean;
}

export const MenuUploader: React.FC<MenuUploaderProps> = ({
  onParseMenu,
  isParsing,
  onCancel,
  hasExistingMenu = false,
}) => {
  const [menuText, setMenuText] = useState("");
  const [selectedSample, setSelectedSample] = useState<SampleMenu | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectSample = (sample: SampleMenu) => {
    setSelectedSample(sample);
    setMenuText(sample.menuText);
    setErrorMsg(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFile(file);
  };

  const readFile = (file: File) => {
    if (!file.name.match(/\.(txt|md|csv|json)$/i) && file.type && !file.type.includes("text")) {
      setErrorMsg("Please upload a text-based menu file (.txt, .md, .csv, or plain text).");
      return;
    }
    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setMenuText(content);
        setSelectedSample(null);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Could not read file. Please try pasting the text directly.");
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      readFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuText.trim()) {
      setErrorMsg("Please enter or upload your restaurant menu text.");
      return;
    }
    setErrorMsg(null);
    try {
      await onParseMenu(menuText);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to parse menu text. Please check the text format and try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Intro hero card */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <ChefHat className="w-3.5 h-3.5" />
          <span>Virtual Food Photography Studio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-serif-display mb-3">
          Turn Your Written Menu Into Michelin-Grade Photos
        </h2>
        <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
          Upload your restaurant menu text or choose a ready-made tasting menu below.
          Our virtual culinary director extracts each dish and generates hyper-realistic photography in your signature aesthetic.
        </p>
      </div>

      {/* Sample menu cards for instant 1-click test */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Quick Start: Select a Sample Restaurant Menu
          </span>
          <span className="text-xs text-amber-400 font-medium">1-Click Tryout</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_MENUS.map((sample) => {
            const isSelected = selectedSample?.id === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-500/20 border-amber-400 ring-1 ring-amber-400/40 shadow-md"
                    : "bg-stone-900/80 border-white/10 hover:border-white/20 hover:bg-stone-800 text-stone-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{sample.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <div className="text-[11px] text-amber-400/90 font-medium mb-1">
                    {sample.cuisine}
                  </div>
                  <p className="text-[10px] text-stone-400 line-clamp-2">
                    {sample.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main upload & text area form */}
      <form onSubmit={handleSubmit} className="bg-[#151922] border border-white/10 rounded-2xl p-6 shadow-2xl">
        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all mb-4 ${
            dragActive
              ? "border-amber-400 bg-amber-500/10 scale-[1.01]"
              : "border-white/15 bg-black/30 hover:border-amber-400/50 hover:bg-black/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.csv,.json,text/plain"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-amber-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white">
                Upload your menu file
              </span>
              <span className="text-xs text-stone-400"> (drag & drop or browse)</span>
            </div>
            <p className="text-[11px] text-stone-500">
              Accepts .txt, .md, .csv, and plain text formatted menus
            </p>
          </div>
        </div>

        {/* Text Area for manual paste */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              <span>Or Paste Your Menu Text Here</span>
            </label>
            <span className="text-xs text-stone-500">
              {menuText ? `${menuText.length} characters` : "Empty"}
            </span>
          </div>
          <textarea
            value={menuText}
            onChange={(e) => {
              setMenuText(e.target.value);
              setSelectedSample(null);
              setErrorMsg(null);
            }}
            placeholder="Paste dishes, prices, descriptions, and categories here...
Example:
Burrata di Puglia ($18)
Creamy pugliese burrata, heirloom tomatoes, aged balsamic reduction, crispy basil.

Tagliolini al Tartufo ($32)
Handmade pasta, cultured Normandy butter, shaved black winter truffle."
            rows={8}
            className="w-full bg-black/40 border border-white/15 rounded-xl p-3.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono leading-relaxed"
          />
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {hasExistingMenu && onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-medium text-stone-400 hover:text-white bg-white/5 border border-white/10 transition-colors"
            >
              Cancel & Return to Studio
            </button>
          ) : (
            <div className="text-[11px] text-stone-400 italic">
              AI detects categories, ingredients & creates custom food plating prompts.
            </div>
          )}

          <button
            type="submit"
            disabled={isParsing || !menuText.trim()}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-xl transition-all ${
              isParsing || !menuText.trim()
                ? "bg-stone-800 text-stone-500 cursor-not-allowed border border-white/5"
                : "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-orange-500/25 hover:scale-[1.02]"
            }`}
          >
            {isParsing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                <span>Parsing Dishes & Tableware...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Menu & Open Photo Studio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
