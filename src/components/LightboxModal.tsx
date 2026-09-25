import React, { useState } from "react";
import { Dish } from "../types";
import {
  X,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Camera,
  Wand2,
  Share2,
} from "lucide-react";

interface LightboxModalProps {
  dish: Dish;
  allDishes: Dish[];
  onClose: () => void;
  onNavigate: (dish: Dish) => void;
  onOpenEditor: (dish: Dish) => void;
  onOpenSocial: (dish: Dish) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  dish,
  allDishes,
  onClose,
  onNavigate,
  onOpenEditor,
  onOpenSocial,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const photographedDishes = allDishes.filter((d) => Boolean(d.photoUrl));
  const currentIndex = photographedDishes.findIndex((d) => d.id === dish.id);

  const handlePrev = () => {
    if (photographedDishes.length <= 1 || currentIndex === -1) return;
    const prevIdx = (currentIndex - 1 + photographedDishes.length) % photographedDishes.length;
    setZoomLevel(1);
    onNavigate(photographedDishes[prevIdx]);
  };

  const handleNext = () => {
    if (photographedDishes.length <= 1 || currentIndex === -1) return;
    const nextIdx = (currentIndex + 1) % photographedDishes.length;
    setZoomLevel(1);
    onNavigate(photographedDishes[nextIdx]);
  };

  const handleCopyPrompt = () => {
    if (!dish.promptUsed) return;
    navigator.clipboard.writeText(dish.promptUsed);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownload = () => {
    if (!dish.photoUrl) return;
    const a = document.createElement("a");
    a.href = dish.photoUrl;
    a.download = `${dish.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-master.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg animate-fadeIn p-2 sm:p-4 select-none">
      {/* Top Bar Controls */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/90 border border-white/15 backdrop-blur-md">
            <Camera className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white font-serif-display truncate max-w-[200px] sm:max-w-xs">
              {dish.name}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-amber-300 border border-amber-400/30">
              {dish.photoSize || "High-Res"}
            </span>
          </div>
          {photographedDishes.length > 1 && (
            <span className="text-xs text-stone-400 hidden sm:inline-block">
              {currentIndex + 1} of {photographedDishes.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-stone-900/90 border border-white/15 rounded-xl p-1 text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-[11px] text-stone-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onOpenEditor(dish)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md transition-transform hover:scale-105"
            title="Retouch with AI"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Retouch</span>
          </button>

          <button
            onClick={() => onOpenSocial(dish)}
            className="p-2 rounded-xl bg-stone-900/90 text-stone-300 hover:text-white border border-white/15 transition-colors"
            title="Social Mockup"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-stone-900/90 text-stone-300 hover:text-white border border-white/15 transition-colors"
            title="Download Master"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900/90 text-stone-300 hover:text-white border border-white/15 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {photographedDishes.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-white/20 transition-all shadow-xl hover:scale-110"
            title="Previous Dish"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-white/20 transition-all shadow-xl hover:scale-110"
            title="Next Dish"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image Viewport */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-6 sm:p-12">
        {dish.photoUrl ? (
          <img
            src={dish.photoUrl}
            alt={dish.name}
            style={{ transform: `scale(${zoomLevel})` }}
            className="max-h-[82vh] max-w-[85vw] object-contain rounded-xl shadow-2xl transition-transform duration-200"
          />
        ) : (
          <div className="text-center text-stone-400">No image available</div>
        )}
      </div>

      {/* Bottom Metadata & Prompt Bar */}
      <div className="absolute bottom-4 inset-x-4 max-w-4xl mx-auto z-20 bg-stone-950/85 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-white text-sm font-serif-display truncate">
                {dish.name}
              </span>
              {dish.price && (
                <span className="text-amber-400 font-bold font-mono">
                  {dish.price}
                </span>
              )}
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-stone-300 uppercase">
                {dish.photoStyle || "rustic-dark"}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {dish.modelUsed || "gemini-3-pro-image-preview"}
              </span>
            </div>
            <p className="text-stone-400 text-[11px] truncate">
              {dish.description}
            </p>
          </div>

          {dish.promptUsed && (
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-white/10 transition-colors text-[11px]"
                title="Copy the culinary photography prompt used to generate this image"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Prompt Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Studio Prompt</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
