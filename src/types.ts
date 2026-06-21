export type Category =
  | "3D Animation"
  | "Motion Graphics"
  | "Technology"
  | "Advertising"
  | "Brands"
  | "Social Media"
  | "Corporate"
  | "Product Animation"
  | "Logo Reveal"
  | "Typography"
  | "Transitions"
  | "Cinematic"
  | "Infographics"
  | "UI Animation"
  | "Gaming"
  | "NFT"
  | "AI Technology"
  | "Futuristic"
  | "Medical"
  | "Education";

export type Format = "MP4" | "MOV" | "WEBM" | "GIF" | "Lottie JSON";
export type Resolution = "720p" | "1080p" | "2K" | "4K" | "8K";
export type LicenseType = "Free License" | "Standard License" | "Commercial License" | "Enterprise License";

export interface MotionVideo {
  id: string;
  title: string;
  description: string;
  category: Category;
  duration: number; // in seconds
  downloads: number;
  rating: number;
  creator: {
    name: string;
    avatarUrl: string;
    verified: boolean;
  };
  fileFormat: Format;
  resolution: Resolution;
  tags: string[];
  publishDate: string;
  proceduralType: "ring" | "particles" | "sine" | "dna" | "matrix" | "quantum" | "gravity" | "hologram";
  color: string; // Tailwind glow color hex
  secondaryColor?: string;
  baseSpeed: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  videoIds: string[];
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  tier: "Free Member" | "Pro Studio" | "Enterprise Partner";
  subscriptionActive: boolean;
  joinedDate: string;
}

export interface ImportVideoTask {
  id: string;
  title: string;
  source: "Local Upload" | "Google Drive" | "Dropbox" | "OneDrive" | "YouTube" | "Vimeo" | "Cloud Storage";
  status: "idle" | "uploading" | "optimizing" | "completed" | "failed";
  progress: number;
  category: Category;
  tags: string[];
}
