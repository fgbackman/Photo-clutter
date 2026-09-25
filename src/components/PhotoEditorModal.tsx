import React, { useState } from "react";
import { Dish, GenModel } from "../types";
import { editFoodPhotoApi } from "../services/api";
import {
  Wand2,
  X,
  Sparkles,
  Check,
  RefreshCw,
  Download,
  Sliders,
  History,
  ArrowRight,
  Flame,
  Leaf,
  Layers,
  AlertCircle,
  Undo2,
} from "lucide-react";

interface PhotoEditorModalProps {
  dish: Dish;
  onClose: () => void;
  onSaveUpdatedPhoto: (dishId: string, newPhotoUrl: string, prompt: string) => void;
}

export const PhotoEditorModal: React.FC<PhotoEditorModalProps> = ({
  dish,
  onClose,
  onSaveUpdatedPhoto,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editHistory, setEditHistory] = useState<{ url: string; prompt: string }[]>([
    { url: dish.photoUrl || "", prompt: "Initial photo shoot" },
  ]);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"side-by-side" | "single">("side-by-side");

  const quickEditChips = [
    { label: "💨 Add rising steam", prompt: "Add realistic delicate rising steam coming off the hot freshly cooked food" },
    { label: "🌿 Fresh microgreens & herbs", prompt: "Garnish with fresh vibrant green microgreens and delicate edible herb leaves" },
    { label: "🧀 Golden melted cheese stretch", prompt: "Make the melted cheese richer, with bubbly golden-brown patches and an appetizing cheese stretch" },
    { label: "🕯️ Warm candlelight glow", prompt: "Add dramatic warm candlelight glow in the background with soft bokeh" },
    { label: "🧂 Flaky sea salt & pepper", prompt: "Sprinkle coarse Maldon sea salt crystals and cracked black peppercorns over the top" },
    { label: "🪵 Dark rustic wooden table", prompt: "Change the tabletop surface to dark aged rustic farmhouse wood with visible grain" },
    { label: "⚪ Crisp Carrara marble", prompt: "Change the surface to pristine bright white Italian Carrara marble with light grey veining" },
    { label: "🍷 Wine glass in background", prompt: "Add a soft-focus glass of ruby red wine in the blurred background" },
    { label: "🔥 Crispy charred edges", prompt: "Enhance the charred grill marks and crispy caramelized golden-brown edges" },
    { label: "🍯 Glossy balsamic glaze", prompt: "Add an artistic drizzle of rich, dark, glossy aged balsamic glaze reduction" },
  ];

  const handleApplyEdit = async (customPromptToUse?: string) => {
    const editPromptText = customPromptToUse || prompt;
    if (!editPromptText.trim()) {
      setErrorMsg("Please enter an edit instruction or choose a quick retouch tag.");
      return;
    }

    const currentBaseImage = previewUrl || dish.photoUrl;
    if (!currentBaseImage) {
      setErrorMsg("No base photo available to edit.");
      return;
    }

    setIsEditing(true);
    setErrorMsg(null);

    try {
      const response = await editFoodPhotoApi({
        base64Image: currentBaseImage,
        editPrompt: editPromptText,
        dishName: dish.name,
        model: "gemini-3.1-flash-image-preview",
      });

      if (response.success && response.imageUrl) {
        setPreviewUrl(response.imageUrl);
        setEditHistory((prev) => [
          ...prev,
          { url: response.imageUrl, prompt: editPromptText },
        ]);
        setSelectedHistoryIndex(editHistory.length);
        setPrompt("");
      }
    } catch (err: any) {
      console.error("Retouch error:", err);
      setErrorMsg(err?.message || "Failed to retouch photo. Please try a different instruction.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleCommitSave = () => {
    const finalUrl = previewUrl || editHistory[selectedHistoryIndex]?.url;
    if (finalUrl) {
      onSaveUpdatedPhoto(
        dish.id,
        finalUrl,
        editHistory[selectedHistoryIndex]?.prompt || "Retouched with gemini-3.1-flash-image-preview"
      );
      onClose();
    }
  };

  const handleDownloadActive = () => {
    const targetUrl = previewUrl || dish.photoUrl;
    if (!targetUrl) return;
    const a = document.createElement("a");
    a.href = targetUrl;
    a.download = `${dish.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-retouched.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const currentDisplayUrl = previewUrl || editHistory[selectedHistoryIndex]?.url || dish.photoUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#141720] border border-white/15 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#171b26]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-serif-display">
                  Culinary Photo Retoucher: {dish.name}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  gemini-3.1-flash-image-preview
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Use natural language instructions to adjust food textures, lighting, garnishes, and plating.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "side-by-side" ? "single" : "side-by-side")}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 bg-white/5 hover:bg-white/10 border border-white/10"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{viewMode === "side-by-side" ? "Single View" : "Side-by-Side"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Comparison / Preview Viewport */}
          <div className="bg-black/60 rounded-xl p-3 border border-white/10">
            {viewMode === "side-by-side" && previewUrl ? (
              /* Side-by-Side View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-400 mb-2 px-1">
                    <span>Original Photo</span>
                    <span className="text-[10px] text-stone-500">Initial Shoot</span>
                  </div>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-stone-900 border border-white/10">
                    <img
                      src={dish.photoUrl}
                      alt="Original shoot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-400 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Retouched Result</span>
                    </span>
                    <span className="text-[10px] font-mono text-amber-400/80">Active Version</span>
                  </div>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-stone-900 border border-amber-500/40 shadow-lg shadow-amber-500/10">
                    <img
                      src={currentDisplayUrl || ""}
                      alt="Retouched shoot"
                      className="w-full h-full object-cover"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                        <Wand2 className="w-8 h-8 text-amber-400 animate-spin mb-2" />
                        <span className="text-xs font-bold text-amber-300">
                          Applying Culinary Edits...
                        </span>
                        <span className="text-[11px] text-stone-400 mt-1 max-w-[200px]">
                          Refining lighting & food aesthetics with gemini-3.1-flash
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Single Large View */
              <div className="flex flex-col items-center justify-center">
                <div className="relative max-h-[420px] aspect-square rounded-lg overflow-hidden bg-stone-900 border border-white/15">
                  <img
                    src={currentDisplayUrl || ""}
                    alt={dish.name}
                    className="w-full h-full object-contain"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                      <Wand2 className="w-8 h-8 text-amber-400 animate-spin mb-2" />
                      <span className="text-xs font-bold text-amber-300">
                        Applying Culinary Edits...
                      </span>
                    </div>
                  )}
                </div>
                {previewUrl && (
                  <span className="text-xs text-amber-400 mt-2 font-medium">
                    Showing latest retouched version
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick-Edit Retouch Chips */}
          <div>
            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Quick Culinary Enhancements
            </label>
            <div className="flex flex-wrap gap-2">
              {quickEditChips.map((chip, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setPrompt(chip.prompt);
                    handleApplyEdit(chip.prompt);
                  }}
                  disabled={isEditing}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 bg-stone-800/80 hover:bg-stone-700 hover:text-white border border-white/10 hover:border-amber-400/40 transition-all text-left flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Text Prompt Input Bar */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Custom Retouching Prompt (Natural Language)</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isEditing) {
                    e.preventDefault();
                    handleApplyEdit();
                  }
                }}
                placeholder="e.g., 'Add a fresh rosemary sprig and flaked salt', 'Make the crust more deeply golden', 'Replace the background with dark slate'..."
                className="flex-1 bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={() => handleApplyEdit()}
                disabled={isEditing || !prompt.trim()}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isEditing || !prompt.trim()
                    ? "bg-stone-800 text-stone-500 cursor-not-allowed border border-white/5"
                    : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-orange-500/20 active:scale-95"
                }`}
              >
                {isEditing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Retouching...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Apply Retouch</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Edit History Strip */}
          {editHistory.length > 1 && (
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 mb-2">
                <History className="w-3.5 h-3.5" />
                <span>Revision History ({editHistory.length} versions)</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-2">
                {editHistory.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedHistoryIndex(idx);
                      setPreviewUrl(item.url);
                    }}
                    className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedHistoryIndex === idx
                        ? "border-amber-400 ring-2 ring-amber-400/30"
                        : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={item.url} alt={`Version ${idx}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] text-white py-0.5 text-center truncate px-1">
                      {idx === 0 ? "Initial" : `v${idx}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#171b26]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-white bg-white/5 border border-white/10 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadActive}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download This Version</span>
            </button>
            <button
              type="button"
              onClick={handleCommitSave}
              disabled={!previewUrl && selectedHistoryIndex === 0}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all ${
                !previewUrl && selectedHistoryIndex === 0
                  ? "bg-stone-800 text-stone-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/20 active:scale-95"
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Save as Dish Master Photo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
