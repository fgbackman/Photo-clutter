import React, { useState } from "react";
import { Dish, CameraAngle, PhotoStyle, ImageSize } from "../types";
import {
  Camera,
  Sparkles,
  Wand2,
  Download,
  Maximize2,
  RefreshCw,
  Utensils,
  Eye,
  Sliders,
  AlertCircle,
  Tag,
  Share2,
} from "lucide-react";

interface DishCardProps {
  dish: Dish;
  onGenerate: (dishId: string, customAngle?: CameraAngle) => Promise<void>;
  onOpenEditor: (dish: Dish) => void;
  onOpenLightbox: (dish: Dish) => void;
  onOpenSocialPreview: (dish: Dish) => void;
  currentStyle: PhotoStyle;
  currentImageSize: ImageSize;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  onGenerate,
  onOpenEditor,
  onOpenLightbox,
  onOpenSocialPreview,
  currentStyle,
  currentImageSize,
}) => {
  const [selectedAngle, setSelectedAngle] = useState<CameraAngle>(
    dish.recommendedAngle || "45-degree"
  );
  const [showDetails, setShowDetails] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dish.photoUrl) return;
    const link = document.createElement("a");
    link.href = dish.photoUrl;
    link.download = `${dish.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${dish.photoStyle || "photo"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStyleBadge = (style?: PhotoStyle) => {
    switch (style) {
      case "rustic-dark":
        return { label: "Rustic / Dark", bg: "bg-amber-950/80 text-amber-300 border-amber-500/40" };
      case "bright-modern":
        return { label: "Bright / Modern", bg: "bg-sky-950/80 text-sky-300 border-sky-500/40" };
      case "social-media":
        return { label: "Social Media (Top-Down)", bg: "bg-rose-950/80 text-rose-300 border-rose-500/40" };
      default:
        return { label: "Bespoke Style", bg: "bg-emerald-950/80 text-emerald-300 border-emerald-500/40" };
    }
  };

  return (
    <div className="bg-[#151922] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg hover:border-white/20 transition-all group">
      {/* Photo Showcase Container */}
      <div className="relative aspect-square w-full bg-stone-950 overflow-hidden flex items-center justify-center border-b border-white/10">
        {dish.photoUrl ? (
          <>
            <img
              src={dish.photoUrl}
              alt={dish.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              onClick={() => onOpenLightbox(dish)}
            />
            {/* Overlay Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              {/* Top Badges */}
              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-md ${getStyleBadge(dish.photoStyle).bg}`}>
                  {getStyleBadge(dish.photoStyle).label}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/70 text-amber-300 border border-amber-400/40 backdrop-blur-md">
                  {dish.photoSize || currentImageSize}
                </span>
              </div>

              {/* Bottom Quick Action Bar */}
              <div className="flex items-center justify-between gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenEditor(dish)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition-transform hover:scale-105"
                  title="Retouch & Edit with Gemini 3.1 Flash Image"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Retouch</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenSocialPreview(dish)}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-colors"
                    title="Preview Social Post"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-colors"
                    title="Download Photo"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenLightbox(dish)}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-colors"
                    title="Fullscreen Lightbox"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Permanent Subtle Quality Pill */}
            <div className="absolute bottom-2 left-2 pointer-events-none group-hover:opacity-0 transition-opacity flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-stone-300 border border-white/10">
              <Camera className="w-2.5 h-2.5 text-amber-400" />
              <span>{dish.photoSize || "1K"} • {dish.photoAngle === "top-down-flat-lay" ? "90° Flat Lay" : dish.photoAngle === "close-up-macro" ? "Macro" : "45° Hero"}</span>
            </div>
          </>
        ) : dish.isGenerating ? (
          /* Photography In Progress state */
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 border-r-transparent border-b-orange-500 border-l-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full bg-stone-900 flex items-center justify-center text-amber-400">
                <Camera className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
              Shooting Culinary Photo...
            </span>
            <span className="text-[11px] text-stone-400 max-w-[200px] leading-tight">
              Rendering textures & plating with gemini-3-pro ({currentImageSize})
            </span>
          </div>
        ) : (
          /* Empty / Unshot state */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-900/40 relative">
            {/* Viewfinder rule-of-thirds grid subtle background */}
            <div className="absolute inset-4 border border-dashed border-white/10 pointer-events-none rounded-lg flex items-center justify-center">
              <div className="w-full h-[33%] border-y border-dashed border-white/5 absolute"></div>
              <div className="h-full w-[33%] border-x border-dashed border-white/5 absolute"></div>
            </div>

            <div className="w-12 h-12 rounded-full bg-stone-800/80 border border-white/10 flex items-center justify-center text-stone-400 mb-3 group-hover:text-amber-400 transition-colors z-10">
              <Camera className="w-6 h-6" />
            </div>

            <div className="z-10 mb-3">
              <span className="text-xs font-semibold text-stone-300 block">
                Not Photographed Yet
              </span>
              <span className="text-[11px] text-stone-500">
                Ready for virtual food shoot
              </span>
            </div>

            {/* Shoot Button */}
            <button
              type="button"
              onClick={() => onGenerate(dish.id, selectedAngle)}
              className="z-10 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shoot Photo</span>
            </button>
          </div>
        )}

        {/* Error notice if generation failed */}
        {dish.error && !dish.isGenerating && (
          <div className="absolute inset-x-2 bottom-2 p-2 rounded-lg bg-rose-950/90 border border-rose-500/50 backdrop-blur-md flex items-center gap-2 text-[11px] text-rose-200">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <span className="truncate flex-1">{dish.error}</span>
            <button
              onClick={() => onGenerate(dish.id, selectedAngle)}
              className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-semibold"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Dish Details Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Price Header */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-stone-400 border border-white/10">
              {dish.category}
            </span>
            {dish.price && (
              <span className="text-xs font-bold text-amber-400 font-mono">
                {dish.price}
              </span>
            )}
          </div>

          {/* Dish Name */}
          <h3 className="text-base font-bold text-white font-serif-display tracking-tight mb-1 line-clamp-1">
            {dish.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-3">
            {dish.description}
          </p>

          {/* Key ingredients pills */}
          {dish.keyIngredients && dish.keyIngredients.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {dish.keyIngredients.slice(0, 4).map((ing, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-stone-400 border border-white/5"
                >
                  {ing}
                </span>
              ))}
              {dish.keyIngredients.length > 4 && (
                <span className="text-[10px] text-stone-500 self-center">
                  +{dish.keyIngredients.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Card Bar: Angle selection & Styling notes toggle */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            {/* Angle override selector */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-stone-500 font-medium">Angle:</span>
              <select
                value={selectedAngle}
                onChange={(e) => setSelectedAngle(e.target.value as CameraAngle)}
                aria-label={`Select camera angle for ${dish.name}`}
                className="bg-stone-900 border border-white/10 rounded px-1.5 py-0.5 text-[11px] text-stone-300 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="45-degree">45° Hero</option>
                <option value="top-down-flat-lay">90° Top-Down</option>
                <option value="close-up-macro">Macro Texture</option>
              </select>
            </div>

            {/* Re-shoot or toggle styling info */}
            <div className="flex items-center gap-1.5">
              {dish.photoUrl && (
                <button
                  type="button"
                  onClick={() => onGenerate(dish.id, selectedAngle)}
                  disabled={dish.isGenerating}
                  className="flex items-center gap-1 text-[11px] font-semibold text-stone-400 hover:text-amber-400 transition-colors"
                  title="Reshoot with current style and angle"
                >
                  <RefreshCw className={`w-3 h-3 ${dish.isGenerating ? "animate-spin" : ""}`} />
                  <span>Reshoot</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-[10px] text-stone-500 hover:text-stone-300 underline underline-offset-2 ml-1"
              >
                {showDetails ? "Hide Plating" : "Plating"}
              </button>
            </div>
          </div>

          {/* Collapsible Plating and Styling Notes */}
          {showDetails && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-black/50 border border-white/10 text-[11px] space-y-1.5 animate-fadeIn">
              {dish.suggestedPlating && (
                <div>
                  <span className="font-semibold text-amber-400">Plating: </span>
                  <span className="text-stone-300">{dish.suggestedPlating}</span>
                </div>
              )}
              {dish.visualHighlights && (
                <div>
                  <span className="font-semibold text-orange-400">Visuals: </span>
                  <span className="text-stone-300">{dish.visualHighlights}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
