import React, { useState } from "react";
import { Dish, MenuData } from "../types";
import {
  Printer,
  Download,
  BookOpen,
  Sparkles,
  Utensils,
  Maximize2,
  Camera,
  Sun,
  Moon,
} from "lucide-react";

interface LookbookViewProps {
  menuData: MenuData;
  dishes: Dish[];
  onOpenLightbox: (dish: Dish) => void;
  onOpenEditor: (dish: Dish) => void;
  onGenerateDish: (dishId: string) => void;
}

export const LookbookView: React.FC<LookbookViewProps> = ({
  menuData,
  dishes,
  onOpenLightbox,
  onOpenEditor,
  onGenerateDish,
}) => {
  const [theme, setTheme] = useState<"dark-editorial" | "light-luxury">("dark-editorial");

  // Group dishes by category
  const categories = Array.from(new Set(dishes.map((d) => d.category)));

  const handlePrint = () => {
    window.print();
  };

  const photographedCount = dishes.filter((d) => Boolean(d.photoUrl)).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#151922] border border-white/10 rounded-2xl p-4 shadow-xl print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-serif-display">
              Restaurant Menu Lookbook
            </h2>
            <p className="text-xs text-stone-400">
              Editorial dining presentation for guest tablets, website showcase, and printable tasting menus.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme switcher */}
          <div className="flex items-center bg-stone-900 border border-white/10 rounded-xl p-1 text-xs">
            <button
              onClick={() => setTheme("dark-editorial")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                theme === "dark-editorial"
                  ? "bg-amber-500 text-black font-bold shadow"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark Editorial</span>
            </button>
            <button
              onClick={() => setTheme("light-luxury")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                theme === "light-luxury"
                  ? "bg-white text-stone-900 font-bold shadow"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light Luxury</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Lookbook</span>
          </button>
        </div>
      </div>

      {/* Lookbook Magazine Paper Container */}
      <div
        className={`rounded-3xl border p-6 sm:p-12 transition-all shadow-2xl ${
          theme === "dark-editorial"
            ? "bg-[#0f1218] border-white/15 text-stone-100"
            : "bg-[#faf8f5] border-stone-200 text-stone-900 shadow-stone-300/40"
        }`}
      >
        {/* Cover / Lookbook Header */}
        <header className="text-center pb-10 border-b border-dashed border-stone-700/40 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-3 opacity-75">
            <span>The Tasting Collection</span>
          </div>
          <h1
            className={`text-3xl sm:text-5xl font-bold tracking-tight font-serif-display mb-3 ${
              theme === "dark-editorial" ? "text-amber-100" : "text-stone-900"
            }`}
          >
            {menuData.restaurantName || "Artisanal Kitchen"}
          </h1>
          <p
            className={`text-sm sm:text-base font-serif italic max-w-xl mx-auto ${
              theme === "dark-editorial" ? "text-amber-200/70" : "text-stone-600"
            }`}
          >
            {menuData.cuisineType}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs opacity-60">
            <span>Photographed with Virtual Culinary Studio</span>
            <span>•</span>
            <span>{photographedCount} of {dishes.length} Featured Dishes</span>
          </div>
        </header>

        {/* Categorized Dishes Section */}
        <div className="space-y-16">
          {categories.map((category) => {
            const categoryDishes = dishes.filter((d) => d.category === category);
            return (
              <section key={category} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2
                    className={`text-xl sm:text-2xl font-bold font-serif-display uppercase tracking-widest ${
                      theme === "dark-editorial" ? "text-amber-400" : "text-stone-800"
                    }`}
                  >
                    {category}
                  </h2>
                  <div
                    className={`flex-1 h-[1px] ${
                      theme === "dark-editorial" ? "bg-amber-500/20" : "bg-stone-300"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {categoryDishes.map((dish) => (
                    <article
                      key={dish.id}
                      className={`flex flex-col sm:flex-row gap-5 p-4 rounded-2xl border transition-all ${
                        theme === "dark-editorial"
                          ? "bg-stone-900/60 border-white/10 hover:border-amber-500/40"
                          : "bg-white border-stone-200 shadow-sm hover:border-stone-400"
                      }`}
                    >
                      {/* Image Thumbnail / Action */}
                      <div className="relative w-full sm:w-36 aspect-square rounded-xl overflow-hidden bg-stone-950 shrink-0">
                        {dish.photoUrl ? (
                          <>
                            <img
                              src={dish.photoUrl}
                              alt={dish.name}
                              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                              onClick={() => onOpenLightbox(dish)}
                            />
                            <button
                              onClick={() => onOpenLightbox(dish)}
                              className="absolute bottom-1.5 right-1.5 p-1 rounded-md bg-black/60 text-white backdrop-blur-sm print:hidden"
                              title="Expand photo"
                            >
                              <Maximize2 className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-stone-900">
                            <Camera className="w-5 h-5 text-stone-500 mb-1" />
                            <span className="text-[10px] text-stone-500 print:hidden">
                              No photo
                            </span>
                            <button
                              onClick={() => onGenerateDish(dish.id)}
                              className="mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-black print:hidden"
                            >
                              Shoot
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Dish Information */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-baseline justify-between gap-2 mb-1">
                            <h3
                              className={`text-base font-bold font-serif-display ${
                                theme === "dark-editorial" ? "text-white" : "text-stone-900"
                              }`}
                            >
                              {dish.name}
                            </h3>
                            {dish.price && (
                              <span
                                className={`text-sm font-bold font-mono ${
                                  theme === "dark-editorial" ? "text-amber-400" : "text-amber-700"
                                }`}
                              >
                                {dish.price}
                              </span>
                            )}
                          </div>

                          <p
                            className={`text-xs leading-relaxed mb-3 ${
                              theme === "dark-editorial" ? "text-stone-300" : "text-stone-600"
                            }`}
                          >
                            {dish.description}
                          </p>
                        </div>

                        {/* Plating Note / Ingredients */}
                        <div className="pt-2 border-t border-dashed border-stone-700/30 text-[11px]">
                          {dish.suggestedPlating && (
                            <p
                              className={`italic ${
                                theme === "dark-editorial" ? "text-amber-300/80" : "text-stone-500"
                              }`}
                            >
                              <span className="font-semibold not-italic">Plated: </span>
                              {dish.suggestedPlating}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-dashed border-stone-700/40 text-center text-xs opacity-60">
          <p>© {new Date().getFullYear()} {menuData.restaurantName || "Restaurant Group"}. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
