'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Post,
  School,
  Comment,
  Report,
  AnonymousSession,
  PostFlair,
  SortFilter,
  Attachment,
  Poll,
} from './types';
import { generateRandomSession } from './pseudonyms';
import { supabase, isSupabaseConfigured } from './supabase/client';

interface SchoolditContextType {
  isMounted: boolean;
  session: AnonymousSession;
  regenerateSession: () => AnonymousSession;
  setSession: (session: AnonymousSession) => void;
  schools: School[];
  addSchool: (school: Omit<School, 'id' | 'postCount' | 'memberCount'>) => School;
  selectedSchool: string;
  setSelectedSchool: (schoolId: string) => void;
  selectedFlair: string;
  setSelectedFlair: (flair: string) => void;
  availableFlairs: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortFilter;
  setSortBy: (sort: SortFilter) => void;
  posts: Post[];
  filteredPosts: Post[];
  trendingTags: { tag: string; count: number }[];
  getPostById: (id: string) => Post | undefined;
  getCommentsForPost: (postId: string) => Comment[];
  addPost: (post: {
    schoolId: string;
    title: string;
    content: string;
    flair: PostFlair;
    type: 'text' | 'image' | 'video' | 'document' | 'link' | 'poll';
    attachments?: Attachment[];
    poll?: { question: string; options: string[] };
    linkUrl?: string;
    tags?: string[];
  }) => Post;
  votePost: (postId: string, direction: 'up' | 'down') => void;
  votePoll: (postId: string, optionId: string) => void;
  addComment: (postId: string, content: string, parentId?: string | null) => Comment;
  voteComment: (postId: string, commentId: string, direction: 'up' | 'down') => void;
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'status'>) => void;
  handleReportAction: (reportId: string, action: 'dismiss' | 'delete') => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  resetAllData: () => void;
  isAdmin: boolean;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
}

const SchoolditContext = createContext<SchoolditContextType | undefined>(undefined);

const STORAGE_VERSION = 'v5_communities_layout';

export function SchoolditProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  // Deterministic initial session to avoid SSR hydration mismatch
  const [session, setSessionState] = useState<AnonymousSession>({
    sessionId: 'session_init',
    pseudonym: 'Anonymous Siswa',
    avatar: '🎓',
    color: '#0284c7',
    createdAt: '',
  });

  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedFlair, setSelectedFlair] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortFilter>('best');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [reports, setReports] = useState<Report[]>([]);
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('dark');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Hydration & Storage initialization
  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== 'undefined') {
      const currentVer = localStorage.getItem('schooldit_version');
      if (currentVer !== STORAGE_VERSION) {
        localStorage.removeItem('schooldit_posts');
        localStorage.removeItem('schooldit_schools');
        localStorage.removeItem('schooldit_comments');
        localStorage.removeItem('schooldit_reports');
        localStorage.setItem('schooldit_version', STORAGE_VERSION);
      }

      // Load session
      const savedSession = localStorage.getItem('schooldit_session');
      if (savedSession) {
        try {
          setSessionState(JSON.parse(savedSession));
        } catch {
          setSessionState(generateRandomSession());
        }
      } else {
        const fresh = generateRandomSession();
        setSessionState(fresh);
        localStorage.setItem('schooldit_session', JSON.stringify(fresh));
      }

      // Load admin state
      const savedAdmin = localStorage.getItem('schooldit_admin');
      if (savedAdmin === 'true') {
        setIsAdmin(true);
      }

      // Load theme
      const savedTheme = localStorage.getItem('schooldit_theme') as 'light' | 'dark' | 'system' | null;
      const initialTheme = savedTheme || 'dark';
      setThemeState(initialTheme);
      applyTheme(initialTheme);

      // If Supabase is configured, fetch from cloud database
      if (isSupabaseConfigured && supabase) {
        // Fetch communities
        supabase
          .from('schools')
          .select('*')
          .order('created_at', { ascending: false })
          .then(({ data, error }) => {
            if (!error && data && data.length > 0) {
              const mapped: School[] = data.map((d: any) => ({
                id: d.id,
                slug: d.slug,
                name: d.name,
                shortName: d.short_name || d.name,
                city: d.city,
                category: d.category || 'Hobi',
                badgeColor: d.badge_color || '#0284c7',
                description: d.description || '',
                memberCount: d.member_count || 1,
                postCount: d.post_count || 0,
              }));
              setSchools(mapped);
            }
          });

        // Fetch posts
        supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .then(({ data, error }) => {
            if (!error && data) {
              const mapped: Post[] = data.map((d: any) => ({
                id: d.id,
                schoolId: d.school_id || 'all',
                schoolName: d.school_name || 's/semua',
                schoolSlug: d.school_slug || 'all',
                title: d.title,
                content: d.content,
                flair: d.flair,
                type: d.post_type || 'text',
                authorPseudonym: d.author_pseudonym,
                authorAvatar: d.author_avatar,
                authorColor: d.author_color,
                createdAt: new Date(d.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                votes: d.votes || 1,
                commentsCount: d.comments_count || 0,
                viewCount: d.view_count || 1,
                tags: d.tags || [],
                linkUrl: d.link_url,
                attachments: Array.isArray(d.attachments) ? d.attachments : [],
              }));
              setPosts(mapped);
            }
          });

        // Setup Realtime Live Sync across all devices
        const channel = supabase
          .channel('realtime_posts_sync')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'posts' },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                const d = payload.new;
                setPosts((prev) => {
                  if (prev.some((p) => p.id === d.id)) return prev;
                  const newP: Post = {
                    id: d.id,
                    schoolId: d.school_id || 'all',
                    schoolName: d.school_name || 's/semua',
                    schoolSlug: d.school_slug || 'all',
                    title: d.title,
                    content: d.content,
                    flair: d.flair,
                    type: d.post_type || 'text',
                    authorPseudonym: d.author_pseudonym,
                    authorAvatar: d.author_avatar,
                    authorColor: d.author_color,
                    createdAt: 'Baru saja',
                    votes: d.votes || 1,
                    commentsCount: d.comments_count || 0,
                    viewCount: d.view_count || 1,
                    tags: d.tags || [],
                    linkUrl: d.link_url,
                    attachments: Array.isArray(d.attachments) ? d.attachments : [],
                  };
                  return [newP, ...prev];
                });
              } else if (payload.eventType === 'UPDATE') {
                const d = payload.new;
                setPosts((prev) =>
                  prev.map((p) =>
                    p.id === d.id
                      ? {
                          ...p,
                          votes: d.votes,
                          commentsCount: d.comments_count,
                          viewCount: d.view_count,
                          title: d.title,
                          content: d.content,
                        }
                      : p
                  )
                );
              } else if (payload.eventType === 'DELETE') {
                const oldId = payload.old.id;
                setPosts((prev) => prev.filter((p) => p.id !== oldId));
              }
            }
          )
          .subscribe();

        return () => {
          if (supabase) supabase.removeChannel(channel);
        };
      } else {
        // Load from local storage
        const savedPosts = localStorage.getItem('schooldit_posts');
        if (savedPosts) {
          try {
            setPosts(JSON.parse(savedPosts));
          } catch {}
        }

        const savedSchools = localStorage.getItem('schooldit_schools');
        if (savedSchools) {
          try {
            setSchools(JSON.parse(savedSchools));
          } catch {}
        }

        const savedComments = localStorage.getItem('schooldit_comments');
        if (savedComments) {
          try {
            setCommentsMap(JSON.parse(savedComments));
          } catch {}
        }

        const savedReports = localStorage.getItem('schooldit_reports');
        if (savedReports) {
          try {
            setReports(JSON.parse(savedReports));
          } catch {}
        }
      }
    }
  }, []);

  const applyTheme = (th: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    if (th === 'dark') {
      root.classList.add('dark');
    } else if (th === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const setTheme = (th: 'light' | 'dark' | 'system') => {
    setThemeState(th);
    localStorage.setItem('schooldit_theme', th);
    applyTheme(th);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Sync state to local storage when not using Supabase
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined' && !isSupabaseConfigured) {
      localStorage.setItem('schooldit_session', JSON.stringify(session));
      localStorage.setItem('schooldit_schools', JSON.stringify(schools));
      localStorage.setItem('schooldit_posts', JSON.stringify(posts));
      localStorage.setItem('schooldit_comments', JSON.stringify(commentsMap));
      localStorage.setItem('schooldit_reports', JSON.stringify(reports));
    }
  }, [session, schools, posts, commentsMap, reports, isMounted]);

  const regenerateSession = () => {
    const newSession = generateRandomSession(session.sessionId);
    setSessionState(newSession);
    return newSession;
  };

  const setSession = (s: AnonymousSession) => {
    setSessionState(s);
  };

  // Admin authentication (Passcode: 'akusayangjane')
  const loginAdmin = (passcode: string): boolean => {
    const validCodes = ['akusayangjane', 'schooldit'];
    if (validCodes.includes(passcode.trim().toLowerCase())) {
      setIsAdmin(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('schooldit_admin', 'true');
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('schooldit_admin');
    }
  };

  const resetAllData = () => {
    setPosts([]);
    setSchools([]);
    setCommentsMap({});
    setReports([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('schooldit_posts');
      localStorage.removeItem('schooldit_schools');
      localStorage.removeItem('schooldit_comments');
      localStorage.removeItem('schooldit_reports');
    }
  };

  const addSchool = (schoolData: Omit<School, 'id' | 'postCount' | 'memberCount'>): School => {
    const newSchool: School = {
      id: `school-${Date.now()}`,
      postCount: 0,
      memberCount: 1,
      ...schoolData,
    };
    setSchools((prev) => [newSchool, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('schools').insert({
        id: newSchool.id,
        slug: newSchool.slug,
        name: newSchool.name,
        short_name: newSchool.shortName,
        city: newSchool.city || 'Indonesia',
        category: newSchool.category || 'Hobi',
        badge_color: newSchool.badgeColor,
        description: newSchool.description,
        member_count: 1,
        post_count: 0,
      }).then();
    }

    return newSchool;
  };

  const getPostById = (id: string) => {
    return posts.find((p) => p.id === id);
  };

  const getCommentsForPost = (postId: string): Comment[] => {
    return commentsMap[postId] || [];
  };

  const votePost = (postId: string, direction: 'up' | 'down') => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id !== postId) return p;

        let delta = 0;
        let nextUserVote: 'up' | 'down' | null = direction;

        if (p.userVote === direction) {
          delta = direction === 'up' ? -1 : 1;
          nextUserVote = null;
        } else if (p.userVote) {
          delta = direction === 'up' ? 2 : -2;
        } else {
          delta = direction === 'up' ? 1 : -1;
        }

        const newVotes = p.votes + delta;

        if (isSupabaseConfigured && supabase) {
          supabase.from('posts').update({ votes: newVotes }).eq('id', postId).then();
        }

        return {
          ...p,
          votes: newVotes,
          userVote: nextUserVote,
        };
      })
    );
  };

  const votePoll = (postId: string, optionId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id !== postId || !p.poll) return p;

        const alreadyVotedOptionId = p.poll.userVotedOptionId;
        if (alreadyVotedOptionId === optionId) return p;

        const updatedOptions = p.poll.options.map((opt) => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          if (opt.id === alreadyVotedOptionId) {
            return { ...opt, votes: Math.max(0, opt.votes - 1) };
          }
          return opt;
        });

        const totalVotes = updatedOptions.reduce((acc, curr) => acc + curr.votes, 0);

        return {
          ...p,
          poll: {
            ...p.poll,
            options: updatedOptions,
            totalVotes,
            userVotedOptionId: optionId,
          },
        };
      })
    );
  };

  const addPost = (postData: {
    schoolId: string;
    title: string;
    content: string;
    flair: PostFlair;
    type: 'text' | 'image' | 'video' | 'document' | 'link' | 'poll';
    attachments?: Attachment[];
    poll?: { question: string; options: string[] };
    linkUrl?: string;
    tags?: string[];
  }): Post => {
    const school = schools.find((s) => s.id === postData.schoolId);
    const schoolName = school ? school.name : 's/semua';
    const schoolSlug = school ? school.slug : 'all';

    let constructedPoll: Poll | undefined = undefined;
    if (postData.poll && postData.poll.options.length > 0) {
      constructedPoll = {
        id: `poll-${Date.now()}`,
        question: postData.poll.question || postData.title,
        options: postData.poll.options.map((optText, index) => ({
          id: `opt-${Date.now()}-${index}`,
          text: optText,
          votes: 0,
        })),
        totalVotes: 0,
      };
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      schoolId: postData.schoolId,
      schoolName,
      schoolSlug,
      title: postData.title,
      content: postData.content,
      flair: postData.flair,
      type: postData.type,
      authorPseudonym: session.pseudonym,
      authorAvatar: session.avatar,
      authorColor: session.color,
      createdAt: 'Baru saja',
      votes: 1,
      userVote: 'up',
      commentsCount: 0,
      viewCount: 1,
      attachments: postData.attachments || [],
      poll: constructedPoll,
      linkUrl: postData.linkUrl,
      tags: postData.tags || [`#${postData.flair.toLowerCase()}`],
    };

    setPosts((prev) => [newPost, ...prev]);

    if (school) {
      setSchools((prev) =>
        prev.map((s) => (s.id === school.id ? { ...s, postCount: s.postCount + 1 } : s))
      );
    }

    if (isSupabaseConfigured && supabase) {
      supabase.from('posts').insert({
        school_id: postData.schoolId === 'all' ? null : postData.schoolId,
        school_name: schoolName,
        school_slug: schoolSlug,
        author_pseudonym: session.pseudonym,
        author_avatar: session.avatar,
        author_color: session.color,
        title: postData.title,
        content: postData.content,
        flair: postData.flair,
        post_type: postData.attachments?.some((a) => a.type === 'video') ? 'video' : postData.type,
        votes: 1,
        comments_count: 0,
        view_count: 1,
        tags: postData.tags || [`#${postData.flair.toLowerCase()}`],
        link_url: postData.linkUrl || null,
        attachments: postData.attachments || [],
      }).then();
    }

    return newPost;
  };

  const addComment = (
    postId: string,
    content: string,
    parentId?: string | null
  ): Comment => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      postId,
      parentId: parentId || null,
      authorPseudonym: session.pseudonym,
      authorAvatar: session.avatar,
      authorColor: session.color,
      content,
      createdAt: 'Baru saja',
      votes: 1,
      userVote: 'up',
      replies: [],
    };

    setCommentsMap((prev) => {
      const currentComments = prev[postId] || [];

      if (!parentId) {
        return {
          ...prev,
          [postId]: [newComment, ...currentComments],
        };
      }

      const insertReply = (list: Comment[]): Comment[] => {
        return list.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              replies: [...(item.replies || []), newComment],
            };
          }
          if (item.replies && item.replies.length > 0) {
            return {
              ...item,
              replies: insertReply(item.replies),
            };
          }
          return item;
        });
      };

      return {
        ...prev,
        [postId]: insertReply(currentComments),
      };
    });

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p
      )
    );

    if (isSupabaseConfigured && supabase) {
      supabase.from('comments').insert({
        post_id: postId,
        parent_id: parentId || null,
        author_pseudonym: session.pseudonym,
        author_avatar: session.avatar,
        author_color: session.color,
        content,
        votes: 1,
      }).then();
    }

    return newComment;
  };

  const voteComment = (
    postId: string,
    commentId: string,
    direction: 'up' | 'down'
  ) => {
    setCommentsMap((prev) => {
      const currentComments = prev[postId] || [];

      const updateVotesRecursively = (list: Comment[]): Comment[] => {
        return list.map((item) => {
          if (item.id === commentId) {
            let delta = 0;
            let nextUserVote: 'up' | 'down' | null = direction;

            if (item.userVote === direction) {
              delta = direction === 'up' ? -1 : 1;
              nextUserVote = null;
            } else if (item.userVote) {
              delta = direction === 'up' ? 2 : -2;
            } else {
              delta = direction === 'up' ? 1 : -1;
            }

            const newVotes = item.votes + delta;
            if (isSupabaseConfigured && supabase) {
              supabase.from('comments').update({ votes: newVotes }).eq('id', commentId).then();
            }

            return {
              ...item,
              votes: newVotes,
              userVote: nextUserVote,
            };
          }

          if (item.replies && item.replies.length > 0) {
            return {
              ...item,
              replies: updateVotesRecursively(item.replies),
            };
          }

          return item;
        });
      };

      return {
        ...prev,
        [postId]: updateVotesRecursively(currentComments),
      };
    });
  };

  const addReport = (reportData: Omit<Report, 'id' | 'createdAt' | 'status'>) => {
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      ...reportData,
      createdAt: 'Baru saja',
      status: 'pending',
    };
    setReports((prev) => [newReport, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('reports').insert({
        target_id: reportData.targetId,
        target_type: reportData.targetType,
        post_title: reportData.postTitle || null,
        target_content: reportData.targetContent,
        reason: reportData.reason,
        details: reportData.details || null,
        status: 'pending',
      }).then();
    }
  };

  const handleReportAction = (reportId: string, action: 'dismiss' | 'delete') => {
    if (!isAdmin) return;

    const targetReport = reports.find((r) => r.id === reportId);
    if (!targetReport) return;

    if (action === 'delete') {
      if (targetReport.targetType === 'post') {
        setPosts((prev) => prev.filter((p) => p.id !== targetReport.targetId));
        if (isSupabaseConfigured && supabase) {
          supabase.from('posts').delete().eq('id', targetReport.targetId).then();
        }
      } else if (targetReport.targetType === 'comment') {
        setCommentsMap((prev) => {
          const newMap = { ...prev };
          for (const pid in newMap) {
            const filterComments = (list: Comment[]): Comment[] =>
              list
                .filter((c) => c.id !== targetReport.targetId)
                .map((c) => ({
                  ...c,
                  replies: c.replies ? filterComments(c.replies) : [],
                }));
            newMap[pid] = filterComments(newMap[pid]);
          }
          return newMap;
        });
        if (isSupabaseConfigured && supabase) {
          supabase.from('comments').delete().eq('id', targetReport.targetId).then();
        }
      }
    }

    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: action === 'delete' ? 'resolved' : 'dismissed' }
          : r
      )
    );
  };

  // Dynamic available flairs/topics from real user posts
  const availableFlairs = Array.from(
    new Set(posts.map((p) => p.flair).filter(Boolean))
  );

  // Dynamic trending tags from real user posts (0 posts = 0 tags)
  const tagCounts: Record<string, number> = {};
  posts.forEach((p) => {
    p.tags?.forEach((t) => {
      const clean = t.startsWith('#') ? t : `#${t}`;
      tagCounts[clean] = (tagCounts[clean] || 0) + 1;
    });
  });
  const trendingTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Filter & sort
  const filteredPosts = posts
    .filter((post) => {
      if (selectedSchool !== 'all' && post.schoolId !== selectedSchool) {
        return false;
      }
      if (selectedFlair !== 'ALL' && post.flair !== selectedFlair) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesContent = post.content.toLowerCase().includes(q);
        const matchesSchool = post.schoolName.toLowerCase().includes(q);
        const matchesTag = post.tags.some((t) => t.toLowerCase().includes(q));
        const matchesAuthor = post.authorPseudonym.toLowerCase().includes(q);
        if (!matchesTitle && !matchesContent && !matchesSchool && !matchesTag && !matchesAuthor) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sortBy === 'best' || sortBy === 'hot') {
        const scoreA = a.votes * 2 + a.commentsCount * 3 + a.viewCount * 0.1;
        const scoreB = b.votes * 2 + b.commentsCount * 3 + b.viewCount * 0.1;
        return scoreB - scoreA;
      }
      if (sortBy === 'top') {
        return b.votes - a.votes;
      }
      return 0;
    });

  return (
    <SchoolditContext.Provider
      value={{
        isMounted,
        session,
        regenerateSession,
        setSession,
        schools,
        addSchool,
        selectedSchool,
        setSelectedSchool,
        selectedFlair,
        setSelectedFlair,
        availableFlairs,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        posts,
        filteredPosts,
        trendingTags,
        getPostById,
        getCommentsForPost,
        addPost,
        votePost,
        votePoll,
        addComment,
        voteComment,
        reports,
        addReport,
        handleReportAction,
        theme,
        setTheme,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        resetAllData,
        isAdmin,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </SchoolditContext.Provider>
  );
}

export function useSchooldit() {
  const context = useContext(SchoolditContext);
  if (!context) {
    throw new Error('useSchooldit must be used within a SchoolditProvider');
  }
  return context;
}
