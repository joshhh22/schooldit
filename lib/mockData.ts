import { School, Post, Comment, Report } from './types';

// Clean Initial State: No dummy beta posts, schools, or fake trending data.
// All content will be populated dynamically by real users.

export const INITIAL_SCHOOLS: School[] = [];

export const INITIAL_POSTS: Post[] = [];

export const INITIAL_COMMENTS: Record<string, Comment[]> = {};

export const INITIAL_REPORTS: Report[] = [];

export const INITIAL_TRENDING_TAGS: { tag: string; count: number; growth: string }[] = [];
