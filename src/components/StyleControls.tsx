import React from "react";
import {
  PhotoStyle,
  ImageSize,
  AspectRatio,
  CameraAngle,
  GenModel,
  GenerationSettings,
} from "../types";
import {
  Moon,
  Sun,
  Smartphone,
  SlidersHorizontal,
  Camera,
  Layers,
  Sparkles,
  Info,
  Ratio,
  Maximize2,
} from "lucide-react";

interface StyleControlsProps {
  settings: GenerationSettings;
  onChange: (newSettings: GenerationSettings) => void;
  onBatchShootAll?: () => void;
  isBatchGenerating?: boolean;
  totalPending?: number;
}

export const StyleControls: React.FC<StyleControlsProps> = ({
  settings,
  onChange,
  onBatchShootAll,
  isBatchGenerating = false,
  totalPending = 0,
}) => {
  const stylesList: {
    id: PhotoStyle;
    name: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: "rustic-dark",
      name: "Rustic / Dark",
      subtitle: "Moody Chiaroscuro & Timber",
      description: "Dark slate & hardwood, directional warm side-lighting, organic textures, fine-dining gastropub ambiance.",
      icon: <Moon className="w-4 h-4 text-amber-400" />,
      color: "from-amber-950/60 to-stone-900 border-amber-600/40",
    },
    {
      id: "bright-modern",
      name: "Bright / Modern",
      subtitle: "High-Key Marble & Airiness",
      description: "Clean Carrara marble, crisp morning sunlight, minimalist negative space, Michelin-star Nordic bistro style.",
      icon: <Sun className="w-4 h-4 text-cyan-400" />,
      color: "from-sky-950/50 to-stone-900 border-sky-500/40",
    },
    {
      id: "social-media",
      name: "Social Media",
      subtitle: "Top-Down 90° Flat Lay",
      description: "Overhead bird's-eye view, curated lifestyle tabletop props, vibrant punchy contrast, Instagram foodie viral layout.",
      icon: <Smartphone className="w-4 h-4 text-rose-400" />,
      color: "from-rose-950/50 to-stone-900 border-rose-500/40",
    },
    {
      id: "custom",
      name: "Bespoke / Custom",
      subtitle: "Tailored Restaurant Theme",
      description: "Customize specific ambiance, tabletop materials, and lighting to match your venue's unique branding.",
      icon: <SlidersHorizontal className="w-4 h-4 text-emerald-400" />,
      color: "from-emerald-950/50 to-stone-900 border-emerald-500/40",
    },
  ];

  const imageSizes: { size: ImageSize; label: string; badge: string; desc: string }[] = [
    { size: "1K", label: "1K", badge: "1024px", desc: "Fast & crisp, standard web & mobile" },
    { size: "2K", label: "2K Quad HD", badge: "2048px", desc: "Studio master, menus & tablet screens" },
    { size: "4K", label: "4K Cinema", badge: "4096px", desc: "Max fidelity, print lookbooks & press" },
  ];

  const aspectRatios: { ratio: AspectRatio; label: string; iconLabel: string }[] = [
    { ratio: "1:1", label: "1:1 Square", iconLabel: "Square" },
    { ratio: "4:3", label: "4:3 Culinary", iconLabel: "Plate" },
    { ratio: "16:9", label: "16:9 Wide", iconLabel: "Hero" },
    { ratio: "9:16", label: "9:16 Story", iconLabel: "Reel" },
    { ratio: "3:4", label: "3:4 Portrait", iconLabel: "Portrait" },
  ];

  const angles: { angle: CameraAngle; label: string; hint: string }[] = [
    { angle: "45-degree", label: "45° Hero Angle", hint: "Showcases dish height & depth" },
    { angle: "top-down-flat-lay", label: "90° Flat Lay", hint: "Full plate geometry & styling" },
    { angle: "close-up-macro", label: "Macro Texture", hint: "Juiciness, sear & crust details" },
  ];

  return (
    <div className="bg-[#151922] border border-white/10 rounded-2xl p-5 mb-8 shadow-xl">
      {/* Top row: Section title & quick info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-white/10 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Culinary Studio Direction & Aesthetics
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Choose your signature photographic style, resolution, and framing. Every dish will be styled with these culinary settings.
          </p>
        </div>

        {/* Model info affordance */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 border border-white/10 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-stone-400">Engine:</span>
            <select
              value={settings.model}
              onChange={(e) => onChange({ ...settings, model: e.target.value as GenModel })}
              aria-label="Select AI Engine Model"
              className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="gemini-3-pro-image-preview" className="bg-stone-900 text-stone-200">
                gemini-3-pro-image-preview (High-Fidelity)
              </option>
              <option value="gemini-3.1-flash-image-preview" className="bg-stone-900 text-stone-200">
                gemini-3.1-flash-image-preview (Fast Studio)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Style Toggles Grid */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2.5">
          1. Photographic Aesthetic Style
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stylesList.map((st) => {
            const isSelected = settings.style === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  let defaultAngle = settings.angle;
                  if (st.id === "social-media") {
                    defaultAngle = "top-down-flat-lay";
                  } else if (settings.angle === "top-down-flat-lay") {
                    defaultAngle = "45-degree";
                  }
                  onChange({ ...settings, style: st.id, angle: defaultAngle });
                }}
                className={`relative text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? `bg-gradient-to-br ${st.color} border-amber-400 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10`
                    : "bg-stone-900/60 border-white/10 hover:border-white/20 hover:bg-stone-900/90 text-stone-400"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? "bg-white/10 text-white" : "bg-stone-800 text-stone-400"}`}>
                        {st.icon}
                      </div>
                      <span className={`text-sm font-bold ${isSelected ? "text-white" : "text-stone-300"}`}>
                        {st.name}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="flex h-2 w-2 rounded-full bg-amber-400"></span>
                    )}
                  </div>
                  <div className="text-[11px] font-medium text-amber-300/80 mb-1">
                    {st.subtitle}
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed line-clamp-2">
                    {st.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Style Input (if custom selected) */}
        {settings.style === "custom" && (
          <div className="mt-3 p-3.5 bg-stone-900/90 border border-emerald-500/30 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Describe Your Custom Restaurant Ambiance</span>
            </div>
            <input
              type="text"
              value={settings.customStylePrompt}
              onChange={(e) => onChange({ ...settings, customStylePrompt: e.target.value })}
              placeholder="e.g. Kyoto wooden counter, soft lantern glow, Japanese ceramics, delicate steam, cedar textures..."
              className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
            />
          </div>
        )}
      </div>

      {/* Row 2: Resolution, Aspect Ratio, Camera Angle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-white/10">
        {/* Image Size / Resolution Affordance (1K, 2K, 4K) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Image Size & Resolution</span>
            </label>
            <span className="text-[10px] text-amber-400/90 font-mono font-medium">gemini-3-pro</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {imageSizes.map((item) => {
              const isSelected = settings.imageSize === item.size;
              return (
                <button
                  key={item.size}
                  type="button"
                  onClick={() => onChange({ ...settings, imageSize: item.size })}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "bg-amber-500/20 border-amber-400 text-white shadow-sm ring-1 ring-amber-400/30"
                      : "bg-stone-900/70 border-white/10 text-stone-400 hover:border-white/20 hover:text-stone-300"
                  }`}
                >
                  <span className={`text-sm font-bold ${isSelected ? "text-amber-300" : "text-stone-200"}`}>
                    {item.size}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono mt-0.5">
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-stone-400 mt-1.5 italic">
            {imageSizes.find((s) => s.size === settings.imageSize)?.desc}
          </p>
        </div>

        {/* Aspect Ratio */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Ratio className="w-3.5 h-3.5 text-orange-400" />
            <span>3. Aspect Ratio</span>
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {aspectRatios.map((ar) => {
              const isSelected = settings.aspectRatio === ar.ratio;
              return (
                <button
                  key={ar.ratio}
                  type="button"
                  onClick={() => onChange({ ...settings, aspectRatio: ar.ratio })}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "bg-orange-500/20 border-orange-400 text-white ring-1 ring-orange-400/30"
                      : "bg-stone-900/70 border-white/10 text-stone-400 hover:border-white/20 hover:text-stone-300"
                  }`}
                  title={ar.label}
                >
                  <span className={`text-xs font-bold ${isSelected ? "text-orange-300" : "text-stone-300"}`}>
                    {ar.ratio}
                  </span>
                  <span className="text-[9px] text-stone-400 mt-0.5 truncate max-w-full">
                    {ar.iconLabel}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-stone-400 mt-1.5">
            {settings.aspectRatio === "1:1"
              ? "Standard square for digital menus & Instagram feed"
              : settings.aspectRatio === "4:3"
              ? "Classic dining frame showing plate & table setting"
              : settings.aspectRatio === "16:9"
              ? "Cinematic landscape for website hero headers"
              : settings.aspectRatio === "9:16"
              ? "Vertical format for Instagram stories & TikTok"
              : "Portrait format for printed table cards"}
          </p>
        </div>

        {/* Camera Angle */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>4. Camera Angle</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {angles.map((a) => {
              const isSelected = settings.angle === a.angle;
              return (
                <button
                  key={a.angle}
                  type="button"
                  onClick={() => onChange({ ...settings, angle: a.angle })}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "bg-cyan-500/20 border-cyan-400 text-white ring-1 ring-cyan-400/30"
                      : "bg-stone-900/70 border-white/10 text-stone-400 hover:border-white/20 hover:text-stone-300"
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? "text-cyan-300" : "text-stone-200"}`}>
                    {a.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-stone-400 mt-1.5 italic">
            {angles.find((a) => a.angle === settings.angle)?.hint}
          </p>
        </div>
      </div>

      {/* Batch shoot button if there are pending dishes */}
      {onBatchShootAll && totalPending > 0 && (
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-500/10 -mx-5 -mb-5 p-4 rounded-b-2xl border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Batch Food Studio Shoot
              </div>
              <div className="text-xs text-amber-200/80">
                Shoot all {totalPending} remaining dish{totalPending > 1 ? "es" : ""} in{" "}
                <span className="font-semibold text-amber-300">{stylesList.find(s => s.id === settings.style)?.name}</span> aesthetic ({settings.imageSize})
              </div>
            </div>
          </div>

          <button
            onClick={onBatchShootAll}
            disabled={isBatchGenerating}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg transition-all ${
              isBatchGenerating
                ? "bg-stone-700 cursor-not-allowed opacity-80"
                : "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-orange-500/20 hover:scale-[1.02]"
            }`}
          >
            {isBatchGenerating ? (
              <>
                <Camera className="w-4 h-4 animate-spin" />
                <span>Shooting Studio Dishes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Photograph All {totalPending} Dishes</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
