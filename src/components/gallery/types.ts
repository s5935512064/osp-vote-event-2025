export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  description: string;
  gallery: string[];
  votes: {
    likes: number;
    shares: number;
    comments: number;
    votes: number;
  };
  size: "small" | "medium" | "large" | "xlarge";
  rotation: string;
  createdAt: string;
}

export interface Position {
  x: number;
  y: number;
  scale: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export type DeviceType = "mobile" | "tablet" | "desktop";
export type LayoutMode = "scattered" | "grid";

export interface GalleryComponentProps {
  images: GalleryImage[];
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  setSelectedImage: (image: GalleryImage) => void;
}

export interface ScatteredGalleryProps extends GalleryComponentProps {
  positions: Position[];
  zIndexes: number[];
  containerDimensions: Dimensions;
}

export interface GridGalleryProps extends GalleryComponentProps {
  zIndexes: number[];
  containerDimensions: Dimensions;
}

export interface MasonryGalleryProps extends GalleryComponentProps {
  deviceType: DeviceType;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  startDate: string | null;
  endDate: string | null;
  isPermanent: boolean;
  isGlobal: boolean;
  contentData: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  data: {
    shop_name: string;
    title: string;
    description_photo: string;
    main_photo: string;
    gallery: string[];
  };
  votes: {
    likes: number;
    shares: number;
    comments: number;
    votes: number;
  };
  createdAt: string;
}

export interface CampaignDataResponse {
  campaign: {
    id: string;
    name: string;
    description: string;
    status: string;
    startDate: string | null;
    endDate: string | null;
    isPermanent: boolean;
    isGlobal: boolean;
    contentData: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  };
  submissions: Array<{
    id: string;
    data: {
      shop_name: string;
      title: string;
      description_photo: string;
      main_photo: string;
      gallery: string[];
    };
    votes: {
      likes: number;
      shares: number;
      comments: number;
      votes: number;
    };
    createdAt: string;
  }>;
  stats: {
    totalSubmissions: number;
    totalVotes: number;
    totalLikes: number;
    totalShares: number;
  };
}
