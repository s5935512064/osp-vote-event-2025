// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Campaign Types
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

// Submission Types (รูปภาพที่ส่งเข้าประกวด)
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

// Gallery Image Interface สำหรับใช้ใน Component
export interface GalleryImage {
  id: string; // เปลี่ยนจาก number เป็น string
  src: string;
  alt: string;
  title: string;
  category: string; // ใช้ shop_name
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

// Campaign Data Response
export interface CampaignDataResponse {
  campaign: Campaign;
  submissions: Submission[];
  stats: {
    totalSubmissions: number;
    totalVotes: number;
    totalLikes: number;
    totalShares: number;
  };
}

// Vote Submission Types
export interface VoteSubmission {
  submissionId: string; // เปลี่ยนจาก imageId
  voterName: string;
  voterPhone: string;
  address: string;
  reason: string;
  customReason?: string;
}

export interface Vote {
  id: string;
  submissionId: string;
  voterName: string;
  voterPhone: string;
  votedAt: string;
}

// Vote Status Types
export interface VoteStatus {
  hasVoted: boolean;
  votedSubmissionId?: string;
  votedAt?: string;
}

// Like/Share Action Types
export interface LikeAction {
  submissionId: string;
  voterPhone: string;
}

export interface ShareAction {
  submissionId: string;
  voterPhone: string;
  platform?: "facebook" | "line" | "twitter" | "copy";
}

// API Response for actions
export interface ActionResponse {
  success: boolean;
  message?: string;
  data?: {
    likes?: number;
    shares?: number;
  };
}

// Local Storage Types
export interface LocalUserActions {
  phone: string;
  votedSubmissionId?: string;
  likedSubmissions: string[];
  sharedSubmissions: string[];
  lastUpdated: string;
}
