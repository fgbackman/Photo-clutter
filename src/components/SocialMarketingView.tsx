import React, { useState } from "react";
import { Dish, MenuData } from "../types";
import {
  Instagram,
  Smartphone,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Flame,
  Camera,
} from "lucide-react";

interface SocialMarketingViewProps {
  menuData: MenuData;
  dishes: Dish[];
  onOpenLightbox: (dish: Dish) => void;
  onOpenEditor: (dish: Dish) => void;
}

export const SocialMarketingView: React.FC<SocialMarketingViewProps> = ({
  menuData,
  dishes,
  onOpenLightbox,
  onOpenEditor,
}) => {
  const photographedDishes = dishes.filter((d) => Boolean(d.photoUrl));
  const [selectedDishId, setSelectedDishId] = useState<string>(
    photographedDishes[0]?.id || dishes[0]?.id || ""
  );
  const [socialFormat, setSocialFormat] = useState<"instagram-post" | "story" | "delivery-hero">(
    "instagram-post"
  );
  const [copiedCaption, setCopiedCaption] = useState(false);

  const activeDish =
    photographedDishes.find((d) => d.id === selectedDishId) ||
    dishes.find((d) => d.id === selectedDishId) ||
    photographedDishes[0] ||
    dishes[0];

  const cleanHandle = (menuData.restaurantName || "OurRestaurant")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const hashtags = [
    `#${cleanHandle}`,
    `#${(menuData.cuisineType || "gourmet").toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    "#foodphotography",
    "#foodie",
    "#cheflife",
    "#finedining",
    "#eats",
    "#culinaryart",
    "#michelinguide",
    "#foodlovers",
  ].join(" ");

  const generatedCaption = activeDish
    ? `✨ Tonight at @${cleanHandle}: ${activeDish.name} ${activeDish.price ? `(${activeDish.price})` : ""}.\n\n` +
      `${activeDish.description}\n\n` +
      `Crafted with ${activeDish.keyIngredients?.join(", ") || "fresh seasonal ingredients"}. ${activeDish.visualHighlights || "Pure culinary perfection."}\n\n` +
      `📍 Reserve your table via link in bio.\n\n` +
      `${hashtags}`
    : "";

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleDownloadImage = () => {
    if (!activeDish?.photoUrl) return;
    const a = document.createElement("a");
    a.href = activeDish.photoUrl;
    a.download = `${activeDish.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${socialFormat}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (photographedDishes.length === 0) {
    return (
      <div className="bg-[#151922] border border-white/10 rounded-2xl p-12 text-center max-w-xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
          <Camera className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white font-serif-display mb-2">
          No Photographed Dishes Yet
        </h3>
        <p className="text-sm text-stone-400 mb-6 leading-relaxed">
          Switch to the <strong>Studio & Shoot</strong> tab to generate your first virtual food photo, and preview real-time social posts and marketing templates here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151922] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Instagram className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-white font-serif-display">
              Social Media & Delivery Marketing Studio
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Generate viral social posts, Instagram stories, and food delivery hero banners from your AI food photography.
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex items-center bg-stone-900 border border-white/10 p-1 rounded-xl text-xs">
          <button
            onClick={() => setSocialFormat("instagram-post")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              socialFormat === "instagram-post"
                ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold shadow"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Feed Post (1:1)</span>
          </button>
          <button
            onClick={() => setSocialFormat("story")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              socialFormat === "story"
                ? "bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold shadow"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Story / Reel (9:16)</span>
          </button>
          <button
            onClick={() => setSocialFormat("delivery-hero")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              socialFormat === "delivery-hero"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Delivery Banner</span>
          </button>
        </div>
      </div>

      {/* Dish Picker Strip */}
      <div className="bg-[#151922] border border-white/10 rounded-2xl p-4 shadow-xl">
        <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2.5">
          Select Dish To Feature ({photographedDishes.length} photographed)
        </label>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {photographedDishes.map((dish) => {
            const isSelected = dish.id === activeDish?.id;
            return (
              <button
                key={dish.id}
                onClick={() => setSelectedDishId(dish.id)}
                className={`relative shrink-0 flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40"
                    : "bg-stone-900 border-white/10 hover:border-white/20 text-stone-400"
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-950 shrink-0">
                  <img src={dish.photoUrl} alt={dish.name} className="w-full h-full object-cover" />
                </div>
                <div className="max-w-[130px] pr-2">
                  <span className="text-xs font-bold text-white truncate block">
                    {dish.name}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    {dish.price || dish.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Preview & Generator Layout */}
      {activeDish && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Phone/Feed Mockup */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            {socialFormat === "instagram-post" && (
              /* Instagram Feed Mockup */
              <div className="w-full max-w-md bg-stone-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl">
                {/* Instagram Header */}
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-stone-900/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center text-xs font-bold text-white">
                        {menuData.restaurantName.charAt(0) || "R"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>@{cleanHandle}</span>
                        <span className="w-3 h-3 rounded-full bg-sky-500 flex items-center justify-center text-[8px] text-white">✓</span>
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {menuData.restaurantName} • Original Audio
                      </div>
                    </div>
                  </div>
                  <span className="text-stone-400 font-bold text-sm">•••</span>
                </div>

                {/* Hero Photo */}
                <div className="relative aspect-square w-full bg-black overflow-hidden group">
                  <img
                    src={activeDish.photoUrl}
                    alt={activeDish.name}
                    className="w-full h-full object-cover"
                  />
                  {activeDish.price && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-amber-300 shadow-lg">
                      {activeDish.price}
                    </div>
                  )}
                </div>

                {/* Action Bar */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-rose-500 font-bold text-sm">❤️ 1,842</span>
                      <span className="text-stone-300 font-bold text-sm">💬 128</span>
                      <span className="text-stone-300 font-bold text-sm">✈️ Share</span>
                    </div>
                    <span className="text-stone-400">🔖 Save</span>
                  </div>

                  <div className="text-xs text-stone-200 leading-snug">
                    <span className="font-bold text-white mr-1.5">@{cleanHandle}</span>
                    <span>{activeDish.name} — {activeDish.description}</span>
                  </div>

                  <div className="text-[10px] text-stone-500 font-mono">
                    2 HOURS AGO
                  </div>
                </div>
              </div>
            )}

            {socialFormat === "story" && (
              /* Instagram Story / Vertical Reel Mockup (9:16) */
              <div className="relative w-full max-w-[320px] aspect-[9/16] bg-stone-950 border-2 border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
                {/* Background Image */}
                <img
                  src={activeDish.photoUrl}
                  alt={activeDish.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/70 pointer-events-none" />

                {/* Story Top Progress Bars */}
                <div className="relative z-10 p-3 space-y-2">
                  <div className="flex gap-1">
                    <div className="h-1 flex-1 bg-white rounded-full"></div>
                    <div className="h-1 flex-1 bg-white/40 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs">
                        {menuData.restaurantName.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-white">@{cleanHandle}</span>
                      <span className="text-[10px] text-white/60">3h</span>
                    </div>
                    <span className="text-white text-xs font-bold">✕</span>
                  </div>
                </div>

                {/* Story Center Highlight Badge */}
                <div className="relative z-10 px-4 text-center my-auto">
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500/90 text-black font-bold text-[11px] uppercase tracking-wider mb-2 shadow-lg">
                    Chef's Daily Highlight
                  </div>
                  <h3 className="text-xl font-bold text-white font-serif-display drop-shadow-md">
                    {activeDish.name}
                  </h3>
                  {activeDish.price && (
                    <div className="text-sm font-bold text-amber-300 font-mono mt-1">
                      {activeDish.price}
                    </div>
                  )}
                </div>

                {/* Story Bottom Swipe Up Button */}
                <div className="relative z-10 p-4 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-xs uppercase tracking-wider shadow-lg">
                    <span>Reserve Tonight</span>
                    <span>↑</span>
                  </div>
                </div>
              </div>
            )}

            {socialFormat === "delivery-hero" && (
              /* Delivery Hero Card Mockup (UberEats / DoorDash style) */
              <div className="w-full max-w-lg bg-[#141822] border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
                {/* Hero Header Banner */}
                <div className="relative h-48 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={activeDish.photoUrl}
                    alt={activeDish.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold shadow">
                    Top Rated Item
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white font-serif-display drop-shadow">
                        {activeDish.name}
                      </h3>
                      <p className="text-xs text-amber-300 font-mono font-bold">
                        {activeDish.price || "$24.00"}
                      </p>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-amber-400 text-black text-xs font-bold">
                      ★ 4.9 (500+)
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {activeDish.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="text-[11px] text-stone-400">
                      Ingredients: {activeDish.keyIngredients?.join(", ")}
                    </div>
                    <button
                      onClick={handleDownloadImage}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold"
                    >
                      Export Banner
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Caption Generator & Marketing Tools */}
          <div className="lg:col-span-5 space-y-4">
            {/* Caption Box */}
            <div className="bg-[#151922] border border-white/10 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AI Marketing Caption & Hashtags</span>
                </div>
                <button
                  onClick={handleCopyCaption}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold border border-amber-500/30 transition-colors"
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Caption</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={generatedCaption}
                readOnly
                rows={9}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-stone-300 font-sans leading-relaxed resize-none focus:outline-none"
              />

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-xs">
                <span className="text-stone-400 text-[11px]">
                  Optimized for Instagram, Threads & Facebook
                </span>
                <button
                  onClick={handleDownloadImage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Photo</span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#151922] border border-white/10 rounded-2xl p-4 shadow-xl space-y-2">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">
                Photo Retouching & Fine Tuning
              </span>
              <button
                onClick={() => onOpenEditor(activeDish)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-white/10 text-xs text-stone-200 transition-colors"
              >
                <span className="font-semibold">Need to tweak garnish or lighting for social?</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  Open Retoucher →
                </span>
              </button>
              <button
                onClick={() => onOpenLightbox(activeDish)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-white/10 text-xs text-stone-200 transition-colors"
              >
                <span className="font-semibold">Inspect full-resolution photo in Lightbox</span>
                <span className="text-stone-400 flex items-center gap-1">
                  View Lightbox →
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
