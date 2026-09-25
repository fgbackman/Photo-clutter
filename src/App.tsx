import React, { useState, useEffect, useTransition } from "react";
import {
  MenuData,
  Dish,
  GenerationSettings,
  PhotoStyle,
  ImageSize,
  AspectRatio,
  CameraAngle,
  GenModel,
} from "./types";
import { Navbar } from "./components/Navbar";
import { StyleControls } from "./components/StyleControls";
import { DishCard } from "./components/DishCard";
import { MenuUploader } from "./components/MenuUploader";
import { PhotoEditorModal } from "./components/PhotoEditorModal";
import { LightboxModal } from "./components/LightboxModal";
import { SocialMarketingView } from "./components/SocialMarketingView";
import { LookbookView } from "./components/LookbookView";
import { parseMenuApi, generateFoodPhotoApi } from "./services/api";
import {
  Sparkles,
  Camera,
  Filter,
  Search,
  CheckCircle2,
  RefreshCw,
  Utensils,
  Plus,
  AlertCircle,
} from "lucide-react";

// Default starter menu (Osteria Bellini) so the user has immediate access to rich dishes
const DEFAULT_MENU_DATA: MenuData = {
  restaurantName: "Osteria Bellini",
  cuisineType: "Modern Tuscan & Handmade Pasta",
  dishes: [
    {
      id: "dish-1",
      name: "Burrata di Puglia",
      category: "Antipasti",
      price: "$18",
      description:
        "Creamy pugliese burrata, roasted heirloom cherry tomatoes, cold-pressed Ligurian olive oil, 12-year aged balsamico di Modena, crispy basil leaves, grilled sourdough.",
      keyIngredients: [
        "Pugliese burrata",
        "Heirloom tomatoes",
        "Aged balsamico",
        "Crispy basil",
        "Grilled sourdough",
      ],
      suggestedPlating:
        "Served in a shallow handcrafted charcoal ceramic bowl, glossy olive oil drizzle, vibrant blistered tomatoes clustered on the side.",
      visualHighlights:
        "Creamy white burrata center slightly pierced revealing Stracciatella, glistening balsamic drops, bright red blistered tomatoes.",
      recommendedAngle: "45-degree",
    },
    {
      id: "dish-2",
      name: "Tagliolini al Tartufo Nero",
      category: "Primi Piatti",
      price: "$32",
      description:
        "Handmade egg tagliolini, cultured Normandy butter, freshly shaved Umbrian black winter truffles, aged Parmigiano fonduta.",
      keyIngredients: [
        "Egg tagliolini",
        "Black winter truffles",
        "Normandy butter",
        "Parmigiano fonduta",
      ],
      suggestedPlating:
        "Twirled into a tall elegant nest on a matte slate grey plate, generously showered with paper-thin black truffle shavings.",
      visualHighlights:
        "Glossy buttery pasta strands catching directional light, rich textures of black truffle shavings, delicate steam.",
      recommendedAngle: "45-degree",
    },
    {
      id: "dish-3",
      name: "Bistecca alla Fiorentina",
      category: "Secondi",
      price: "$68",
      description:
        "Oak-charred 32oz dry-aged Porterhouse steak, coarse Maldon sea salt flakes, charred lemon half, rosemary infused olive oil, roasted baby potatoes.",
      keyIngredients: [
        "Dry-aged Porterhouse",
        "Maldon sea salt",
        "Charred lemon",
        "Rosemary oil",
        "Roasted baby potatoes",
      ],
      suggestedPlating:
        "Sliced thick and presented bone-in on a dark weathered cutting board with coarse salt crystals and a sizzling rosemary sprig.",
      visualHighlights:
        "Deep caramelized mahogany sear on the outside, succulent ruby-red center, glistening juices running over the board.",
      recommendedAngle: "45-degree",
    },
    {
      id: "dish-4",
      name: "Branzino al Cartoccio",
      category: "Secondi",
      price: "$36",
      description:
        "Mediterranean sea bass baked in parchment with taggiasca olives, baby capers, heirloom cherry tomatoes, white wine, and fresh fennel fronds.",
      keyIngredients: [
        "Mediterranean sea bass",
        "Taggiasca olives",
        "Baby capers",
        "Fennel fronds",
        "White wine broth",
      ],
      suggestedPlating:
        "Presented with rustic folded parchment paper freshly torn open on an artisanal stoneware platter, releasing aromatic steam.",
      visualHighlights:
        "Delicate pearlescent white fish flakes, glistening herb-infused broth, vibrant green fennel fronds.",
      recommendedAngle: "top-down-flat-lay",
    },
    {
      id: "dish-5",
      name: "Tiramisù Tradizionale",
      category: "Dolci",
      price: "$14",
      description:
        "Espresso-soaked Savoiardi ladyfingers, rich mascarpone mousse, bitter dark Valrhona cocoa powder dusting, chocolate curl garnish.",
      keyIngredients: [
        "Savoiardi ladyfingers",
        "Espresso",
        "Mascarpone mousse",
        "Valrhona cocoa",
        "Dark chocolate curl",
      ],
      suggestedPlating:
        "Cut square or spooned into a heavy crystal coupe glass, velvety uniform layers, matte dark cocoa dusting.",
      visualHighlights:
        "Velvety peaks of mascarpone cream, dark cocoa contrast, delicate chocolate curls.",
      recommendedAngle: "close-up-macro",
    },
    {
      id: "dish-6",
      name: "Smoked Rosemary Negroni",
      category: "Cocktails",
      price: "$16",
      description:
        "London dry gin, Campari, sweet vermouth, smoked with torched fresh rosemary sprig and flamed orange peel over a clear hand-cut ice block.",
      keyIngredients: [
        "London dry gin",
        "Campari",
        "Sweet vermouth",
        "Smoked rosemary",
        "Flamed orange peel",
      ],
      suggestedPlating:
        "Heavy crystal rocks glass with a crystal-clear monolithic ice cube, smoldering rosemary sprig resting across the rim.",
      visualHighlights:
        "Vibrant ruby-red liquid luminosity, glowing ember on the rosemary tip, soft wisps of aromatic smoke in backlight.",
      recommendedAngle: "45-degree",
    },
  ],
};

const STORAGE_KEY = "virtual_food_photographer_menu_v2";

export default function App() {
  // Menu Data State
  const [menuData, setMenuData] = useState<MenuData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.dishes && parsed.dishes.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load saved menu", e);
    }
    return DEFAULT_MENU_DATA;
  });

  // Settings State
  const [settings, setSettings] = useState<GenerationSettings>({
    style: "rustic-dark",
    imageSize: "1K",
    aspectRatio: "1:1",
    angle: "45-degree",
    customStylePrompt: "",
    model: "gemini-3-pro-image-preview",
  });

  // UI States
  const [activeTab, setActiveTab] = useState<"studio" | "lookbook" | "social">("studio");
  const [showUploader, setShowUploader] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal States
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [lightboxDish, setLightboxDish] = useState<Dish | null>(null);

  // Save to localStorage whenever menuData updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(menuData));
    } catch (e) {
      console.error("Failed to persist menu", e);
    }
  }, [menuData]);

  // Handle Menu Parsing from Uploader
  const handleParseMenu = async (menuText: string) => {
    setIsParsing(true);
    try {
      const response = await parseMenuApi(menuText);
      if (response.success && response.data) {
        const newDishes: Dish[] = response.data.dishes.map((item, idx) => ({
          id: `dish-${Date.now()}-${idx}`,
          name: item.name,
          category: item.category || "Main",
          description: item.description,
          price: item.price,
          keyIngredients: item.keyIngredients || [],
          suggestedPlating: item.suggestedPlating || "",
          visualHighlights: item.visualHighlights || "",
          recommendedAngle: (item.recommendedAngle as CameraAngle) || "45-degree",
        }));

        const newMenuData: MenuData = {
          restaurantName: response.data.restaurantName || "Artisanal Kitchen",
          cuisineType: response.data.cuisineType || "Contemporary Dining",
          dishes: newDishes,
        };

        setMenuData(newMenuData);
        setShowUploader(false);
        setSelectedCategory("All");
      }
    } finally {
      setIsParsing(false);
    }
  };

  // Generate Photo for a single dish
  const handleGenerateDish = async (dishId: string, customAngle?: CameraAngle) => {
    const dish = menuData.dishes.find((d) => d.id === dishId);
    if (!dish) return;

    const angleToUse = customAngle || dish.recommendedAngle || settings.angle;

    // Mark dish as generating
    setMenuData((prev) => ({
      ...prev,
      dishes: prev.dishes.map((d) =>
        d.id === dishId ? { ...d, isGenerating: true, error: undefined } : d
      ),
    }));

    try {
      const response = await generateFoodPhotoApi({
        dishName: dish.name,
        description: dish.description,
        category: dish.category,
        keyIngredients: dish.keyIngredients,
        suggestedPlating: dish.suggestedPlating,
        visualHighlights: dish.visualHighlights,
        style: settings.style,
        angle: angleToUse,
        imageSize: settings.imageSize,
        aspectRatio: settings.aspectRatio,
        customStylePrompt: settings.customStylePrompt,
        restaurantCuisine: menuData.cuisineType,
        model: settings.model,
      });

      if (response.success && response.imageUrl) {
        setMenuData((prev) => ({
          ...prev,
          dishes: prev.dishes.map((d) =>
            d.id === dishId
              ? {
                  ...d,
                  photoUrl: response.imageUrl,
                  isGenerating: false,
                  photoSize: response.imageSize,
                  photoAspectRatio: response.aspectRatio,
                  photoStyle: response.style,
                  photoAngle: angleToUse,
                  promptUsed: response.promptUsed,
                  modelUsed: response.modelUsed,
                  editHistory: [
                    {
                      timestamp: Date.now(),
                      prompt: `Studio shoot (${settings.style}, ${settings.imageSize})`,
                      imageUrl: response.imageUrl,
                    },
                  ],
                }
              : d
          ),
        }));
      }
    } catch (err: any) {
      console.error(`Error generating photo for ${dish.name}:`, err);
      setMenuData((prev) => ({
        ...prev,
        dishes: prev.dishes.map((d) =>
          d.id === dishId
            ? {
                ...d,
                isGenerating: false,
                error: err?.message || "Failed to generate photo. Please try again.",
              }
            : d
        ),
      }));
    }
  };

  // Batch shoot all pending (unphotographed) dishes
  const handleBatchShootAll = async () => {
    const pendingDishes = menuData.dishes.filter((d) => !d.photoUrl && !d.isGenerating);
    if (pendingDishes.length === 0) return;

    setIsBatchGenerating(true);

    // Process dishes sequentially to respect API rate limits and deliver clean UX
    for (const dish of pendingDishes) {
      await handleGenerateDish(dish.id);
    }

    setIsBatchGenerating(false);
  };

  // Save retouched photo from PhotoEditorModal
  const handleSaveUpdatedPhoto = (dishId: string, newPhotoUrl: string, prompt: string) => {
    setMenuData((prev) => ({
      ...prev,
      dishes: prev.dishes.map((d) => {
        if (d.id === dishId) {
          const updatedHistory = [
            ...(d.editHistory || []),
            {
              timestamp: Date.now(),
              prompt,
              imageUrl: newPhotoUrl,
            },
          ];
          return {
            ...d,
            photoUrl: newPhotoUrl,
            editHistory: updatedHistory,
          };
        }
        return d;
      }),
    }));
  };

  // Filter dishes by category and search
  const categories = ["All", ...Array.from(new Set(menuData.dishes.map((d) => d.category)))];

  const filteredDishes = menuData.dishes.filter((dish) => {
    const matchesCategory = selectedCategory === "All" || dish.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const completedPhotos = menuData.dishes.filter((d) => Boolean(d.photoUrl)).length;
  const pendingPhotos = menuData.dishes.filter((d) => !d.photoUrl).length;

  return (
    <div className="min-h-screen bg-[#0e1117] text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Navigation Bar */}
      <Navbar
        restaurantName={menuData.restaurantName}
        cuisineType={menuData.cuisineType}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalDishes={menuData.dishes.length}
        completedPhotos={completedPhotos}
        onNewMenuClick={() => setShowUploader(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Conditional Menu Uploader Modal / Section */}
        {showUploader ? (
          <div className="animate-fadeIn">
            <MenuUploader
              onParseMenu={handleParseMenu}
              isParsing={isParsing}
              onCancel={() => setShowUploader(false)}
              hasExistingMenu={menuData.dishes.length > 0}
            />
          </div>
        ) : (
          <>
            {/* View Switcher Routing */}
            {activeTab === "studio" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Style Direction & Studio Controls */}
                <StyleControls
                  settings={settings}
                  onChange={setSettings}
                  onBatchShootAll={handleBatchShootAll}
                  isBatchGenerating={isBatchGenerating}
                  totalPending={pendingPhotos}
                />

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#151922] border border-white/10 rounded-2xl p-4 shadow-lg">
                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    <Filter className="w-3.5 h-3.5 text-stone-500 ml-1 mr-1 shrink-0" />
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          selectedCategory === cat
                            ? "bg-amber-500 text-black shadow-md font-bold"
                            : "bg-stone-900/80 text-stone-400 hover:text-white border border-white/10"
                        }`}
                      >
                        {cat}
                        <span className="ml-1.5 opacity-60 text-[10px]">
                          {cat === "All"
                            ? menuData.dishes.length
                            : menuData.dishes.filter((d) => d.category === cat).length}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative min-w-[200px] sm:w-64">
                    <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search dish or ingredient..."
                      className="w-full bg-black/40 border border-white/15 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* Dishes Grid */}
                {filteredDishes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDishes.map((dish) => (
                      <DishCard
                        key={dish.id}
                        dish={dish}
                        onGenerate={handleGenerateDish}
                        onOpenEditor={(dishToEdit) => setEditingDish(dishToEdit)}
                        onOpenLightbox={(dishToView) => setLightboxDish(dishToView)}
                        onOpenSocialPreview={() => setActiveTab("social")}
                        currentStyle={settings.style}
                        currentImageSize={settings.imageSize}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-[#151922] rounded-2xl border border-white/10">
                    <Utensils className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                    <h3 className="text-base font-bold text-white mb-1">
                      No dishes matched your filter
                    </h3>
                    <p className="text-xs text-stone-400">
                      Try clearing your search query or selecting a different category.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Lookbook View */}
            {activeTab === "lookbook" && (
              <LookbookView
                menuData={menuData}
                dishes={menuData.dishes}
                onOpenLightbox={(dishToView) => setLightboxDish(dishToView)}
                onOpenEditor={(dishToEdit) => setEditingDish(dishToEdit)}
                onGenerateDish={(dishId) => handleGenerateDish(dishId)}
              />
            )}

            {/* Social Media & Marketing View */}
            {activeTab === "social" && (
              <SocialMarketingView
                menuData={menuData}
                dishes={menuData.dishes}
                onOpenLightbox={(dishToView) => setLightboxDish(dishToView)}
                onOpenEditor={(dishToEdit) => setEditingDish(dishToEdit)}
              />
            )}
          </>
        )}
      </main>

      {/* Lightbox Fullscreen Modal */}
      {lightboxDish && (
        <LightboxModal
          dish={lightboxDish}
          allDishes={menuData.dishes}
          onClose={() => setLightboxDish(null)}
          onNavigate={(nextDish) => setLightboxDish(nextDish)}
          onOpenEditor={(dishToEdit) => {
            setLightboxDish(null);
            setEditingDish(dishToEdit);
          }}
          onOpenSocial={() => {
            setLightboxDish(null);
            setActiveTab("social");
          }}
        />
      )}

      {/* AI Retouch & Photo Editor Modal */}
      {editingDish && (
        <PhotoEditorModal
          dish={editingDish}
          onClose={() => setEditingDish(null)}
          onSaveUpdatedPhoto={handleSaveUpdatedPhoto}
        />
      )}
    </div>
  );
}
