export type PhotoStyle = 'rustic-dark' | 'bright-modern' | 'social-media' | 'custom';

export type ImageSize = '1K' | '2K' | '4K';

export type AspectRatio = '1:1' | '4:3' | '3:4' | '16:9' | '9:16';

export type CameraAngle = '45-degree' | 'top-down-flat-lay' | 'close-up-macro';

export type GenModel = 'gemini-3-pro-image-preview' | 'gemini-3.1-flash-image-preview';

export interface Dish {
  id: string;
  name: string;
  category: string;
  description: string;
  price?: string;
  keyIngredients: string[];
  suggestedPlating: string;
  visualHighlights: string;
  recommendedAngle?: CameraAngle;
  // Generated photo state
  photoUrl?: string;
  isGenerating?: boolean;
  error?: string;
  modelUsed?: string;
  photoSize?: ImageSize;
  photoAspectRatio?: AspectRatio;
  photoStyle?: PhotoStyle;
  photoAngle?: CameraAngle;
  promptUsed?: string;
  editHistory?: {
    timestamp: number;
    prompt: string;
    imageUrl: string;
  }[];
}

export interface MenuData {
  restaurantName: string;
  cuisineType: string;
  dishes: Dish[];
}

export interface GenerationSettings {
  style: PhotoStyle;
  imageSize: ImageSize;
  aspectRatio: AspectRatio;
  angle: CameraAngle;
  customStylePrompt: string;
  model: GenModel;
}
