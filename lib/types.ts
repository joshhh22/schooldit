export type PostFlair =
  | 'RAMAI'
  | 'SPILL'
  | 'NGOBROL'
  | 'WKWK'
  | 'CURHAT'
  | 'INFO'
  | 'TANYA'
  | 'EVENT'
  | string;

export type PostType = 'text' | 'image' | 'video' | 'document' | 'link' | 'poll';

export interface School {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category?: 'Hobi' | 'Olahraga' | 'Gaming' | 'Musik' | 'Akademik' | 'Sekolah' | 'Curhat' | 'Lainnya';
  city?: string;
  badgeColor: string;
  bannerImage?: string;
  description: string;
  memberCount: number;
  postCount: number;
  verified?: boolean;
}

export type Community = School;

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
  size: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  expiresAt?: string;
  userVotedOptionId?: string;
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string | null;
  content: string;
  authorPseudonym: string;
  authorAvatar: string;
  authorColor: string;
  createdAt: string;
  votes: number;
  userVote?: 'up' | 'down' | null;
  replies?: Comment[];
}

export interface Post {
  id: string;
  schoolId: string; // or 'all'
  schoolName: string;
  schoolSlug: string;
  title: string;
  content: string;
  flair: PostFlair;
  type: PostType;
  authorPseudonym: string;
  authorAvatar: string;
  authorColor: string;
  createdAt: string;
  votes: number;
  userVote?: 'up' | 'down' | null;
  commentsCount: number;
  viewCount: number;
  attachments?: Attachment[];
  poll?: Poll;
  linkUrl?: string;
  isPinned?: boolean;
  isLocked?: boolean;
  tags: string[];
}

export interface Report {
  id: string;
  targetId: string;
  targetType: 'post' | 'comment';
  postTitle?: string;
  targetContent: string;
  reason: 'Spam' | 'Pelecehan' | 'Data pribadi' | 'Penyamaran' | 'Konten ilegal' | 'Lainnya';
  details?: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface AnonymousSession {
  sessionId: string;
  pseudonym: string;
  avatar: string;
  color: string;
  schoolId?: string;
  createdAt: string;
}

export type SortFilter = 'best' | 'hot' | 'new' | 'top';
