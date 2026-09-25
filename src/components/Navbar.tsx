import React from "react";
import { Camera, Sparkles, BookOpen, Instagram, UtensilsCrossed, RefreshCw } from "lucide-react";

interface NavbarProps {
  restaurantName: string;
  cuisineType: string;
  activeTab: "studio" | "lookbook" | "social";
  setActiveTab: (tab: "studio" | "lookbook" | "social") => void;
  totalDishes: number;
  completedPhotos: number;
  onNewMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  restaurantName,
  cuisineType,
  activeTab,
  setActiveTab,
  totalDishes,
  completedPhotos,
  onNewMenuClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#12151c]/90 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 shadow-lg shadow-orange-500/20 text-white">
            <Camera className="w-5 h-5 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-bold tracking-tight text-white font-serif-display">
                Virtual Food Photographer
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3 h-3" /> Pro Studio
              </span>
            </div>
            <p className="text-xs text-stone-400 flex items-center gap-1.5">
              <span>{restaurantName || "High-End Culinary Studio"}</span>
              {cuisineType && (
                <>
                  <span className="text-stone-600">•</span>
                  <span className="text-stone-400 font-medium">{cuisineType}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
          <div className="flex items-center bg-stone-900/90 p-1 rounded-xl border border-white/10 text-xs font-medium">
            <button
              onClick={() => setActiveTab("studio")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "studio"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow font-semibold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Studio & Shoot</span>
            </button>
            <button
              onClick={() => setActiveTab("lookbook")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "lookbook"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow font-semibold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Menu Lookbook</span>
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "social"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow font-semibold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Social Marketing</span>
            </button>
          </div>

          {/* Quick Upload / Menu Switcher */}
          <div className="flex items-center gap-2">
            {totalDishes > 0 && (
              <div className="hidden lg:flex flex-col items-end text-right">
                <span className="text-[11px] text-stone-400 font-medium">
                  Studio Progress
                </span>
                <span className="text-xs font-bold text-amber-400">
                  {completedPhotos} / {totalDishes} Photographed
                </span>
              </div>
            )}
            <button
              onClick={onNewMenuClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-colors"
              title="Upload new menu or switch sample"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Change Menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
