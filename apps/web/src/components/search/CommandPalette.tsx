import React, { useState, useEffect, useRef, useMemo } from 'react';
import { apiClient } from '../../lib/api';
import {
  Search,
  BookOpen,
  Code,
  MapPin,
  X,
  CornerDownLeft,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export interface SearchResults {
  topics: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    categoryTitle?: string;
  }>;
  lessons: Array<{
    id: string;
    slug: string;
    title: string;
    topicSlug?: string;
    topicTitle?: string;
  }>;
  problems: Array<{
    id: string;
    slug: string;
    title: string;
    difficulty: string;
    topicTitle?: string;
  }>;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (slug: string) => void;
  onSelectTopic: (slug: string) => void;
  onSelectProblem: (slug: string) => void;
}

interface FlattenedItem {
  id: string;
  type: 'topic' | 'lesson' | 'problem' | 'quick-action';
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
  onSelectTopic,
  onSelectProblem,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Focus input when opened and reset state
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults(null);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keyboard shortcut Cmd+K or Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setSelectedIndex(0);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await apiClient.get<SearchResults>(`/search?q=${encodeURIComponent(query)}`);
        if (res.data) {
          setResults(res.data);
          setSelectedIndex(0);
        }
      } catch {
        // Handle search error silently
      } finally {
        setIsSearching(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  // Flattened items for seamless keyboard navigation
  const flattenedItems = useMemo<FlattenedItem[]>(() => {
    if (!query.trim() || !results) {
      // Default quick actions when query is empty
      return [
        {
          id: 'action-binary-search',
          type: 'lesson',
          title: 'Binary Search: Intuition, Invariants & Implementation',
          subtitle: 'Core algorithmic foundational lesson',
          badge: 'Featured Lesson',
          badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
          action: () => {
            onSelectLesson('binary-search-foundations');
            onClose();
          },
        },
        {
          id: 'action-topic-binary-search',
          type: 'topic',
          title: 'Binary Search Algorithm',
          subtitle: 'Prerequisites, variations, and lower/upper bound templates',
          badge: 'Topic',
          badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
          action: () => {
            onSelectTopic('binary-search');
            onClose();
          },
        },
        {
          id: 'action-problem-sorted-array',
          type: 'problem',
          title: 'Search in Rotated Sorted Array',
          subtitle: 'Classic interview challenge on array partitioning',
          badge: 'MEDIUM',
          badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
          action: () => {
            onSelectProblem('search-rotated-sorted-array');
            onClose();
          },
        },
      ];
    }

    const items: FlattenedItem[] = [];

    // 1. Topics
    if (results.topics) {
      results.topics.forEach((t) => {
        items.push({
          id: `topic-${t.id}`,
          type: 'topic',
          title: t.title,
          subtitle: t.description,
          badge: t.categoryTitle || 'Topic',
          badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
          action: () => {
            onSelectTopic(t.slug);
            onClose();
          },
        });
      });
    }

    // 2. Lessons
    if (results.lessons) {
      results.lessons.forEach((l) => {
        items.push({
          id: `lesson-${l.id}`,
          type: 'lesson',
          title: l.title,
          subtitle: l.topicTitle ? `In ${l.topicTitle}` : undefined,
          badge: 'Lesson',
          badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
          action: () => {
            onSelectLesson(l.slug);
            onClose();
          },
        });
      });
    }

    // 3. Problems
    if (results.problems) {
      results.problems.forEach((p) => {
        const isEasy = p.difficulty.toUpperCase() === 'EASY';
        const isHard = p.difficulty.toUpperCase() === 'HARD';
        const color = isEasy
          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
          : isHard
          ? 'border-rose-500/30 text-rose-400 bg-rose-500/10'
          : 'border-amber-500/30 text-amber-400 bg-amber-500/10';

        items.push({
          id: `problem-${p.id}`,
          type: 'problem',
          title: p.title,
          subtitle: p.topicTitle ? `${p.difficulty} • ${p.topicTitle}` : p.difficulty,
          badge: p.difficulty,
          badgeColor: color,
          action: () => {
            onSelectProblem(p.slug);
            onClose();
          },
        });
      });
    }

    return items;
  }, [query, results, onSelectLesson, onSelectTopic, onSelectProblem, onClose]);

  // Handle keyboard navigation: ArrowUp, ArrowDown, Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (flattenedItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flattenedItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flattenedItems.length) % flattenedItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = flattenedItems[selectedIndex];
      if (current) {
        current.action();
      }
    }
  };

  // Ensure active element is scrolled into view
  useEffect(() => {
    const activeEl = resultsContainerRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const totalResults =
    (results?.topics.length || 0) +
    (results?.lessons.length || 0) +
    (results?.problems.length || 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[14vh] px-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl sm:max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[75vh] ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar (Raycast / Linear typography) */}
        <div className="flex items-center px-4 py-3.5 border-b border-border bg-surface-muted/30">
          <Search className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search topics, lessons, problems, or algorithms..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-slate-500 focus:outline-none font-normal"
          />
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2 shrink-0" />
          ) : (
            query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-500 hover:text-slate-300 mr-2 p-1 rounded-md transition-colors"
                aria-label="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )
          )}
          <kbd className="text-[10px] font-mono text-slate-400 bg-surface-elevated border border-border px-1.5 py-0.5 rounded shadow-2xs shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-4 divide-y divide-border/40"
        >
          {/* Empty state when user hasn't typed */}
          {!query.trim() && (
            <div className="pt-2">
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center justify-between">
                <span>Quick Navigation</span>
                <span className="text-[9px] text-slate-600">Press ↵ to select</span>
              </div>
              <div className="space-y-1">
                {flattenedItems.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  const Icon = item.type === 'lesson' ? BookOpen : item.type === 'topic' ? MapPin : Code;
                  return (
                    <button
                      key={item.id}
                      data-index={idx}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-primary/15 border-l-2 border-primary text-white shadow-2xs'
                          : 'hover:bg-surface-elevated/60 text-slate-300 border-l-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                            item.type === 'lesson'
                              ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                              : item.type === 'topic'
                              ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-semibold truncate group-hover:text-white">
                            {item.title}
                          </div>
                          {item.subtitle && (
                            <div className="text-[11px] text-slate-400 truncate mt-0.5">
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.badge && (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                              item.badgeColor || 'border-border text-slate-400 bg-surface-elevated'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isSelected ? (
                          <span className="flex items-center text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                            <CornerDownLeft className="w-3 h-3 mr-1" />
                            Open
                          </span>
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* No results message */}
          {query.trim() && results && totalResults === 0 && !isSearching && (
            <div className="py-12 text-center space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-medium text-slate-300">
                No matching curriculum resources found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Try searching for broader terms like &ldquo;binary search&rdquo;, &ldquo;graph&rdquo;, or &ldquo;trees&rdquo;.
              </p>
            </div>
          )}

          {/* Group 1: Topics */}
          {results && results.topics.length > 0 && (
            <div className="pt-2 first:pt-0">
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-indigo-400" />
                  Topics ({results.topics.length})
                </span>
              </div>
              <div className="space-y-1">
                {results.topics.map((t) => {
                  const itemIndex = flattenedItems.findIndex((it) => it.id === `topic-${t.id}`);
                  const isSelected = selectedIndex === itemIndex;
                  return (
                    <button
                      key={t.id}
                      data-index={itemIndex}
                      onClick={() => {
                        onSelectTopic(t.slug);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-primary/15 border-l-2 border-primary text-white shadow-2xs'
                          : 'hover:bg-surface-elevated/60 text-slate-300 border-l-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <div className="truncate">
                          <div className="text-xs font-semibold truncate group-hover:text-white">
                            {t.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {t.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {t.categoryTitle && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono border border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
                            {t.categoryTitle}
                          </span>
                        )}
                        {isSelected && (
                          <span className="flex items-center text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                            <CornerDownLeft className="w-3 h-3 mr-1" />
                            Open
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Group 2: Lessons */}
          {results && results.lessons.length > 0 && (
            <div className="pt-3">
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-cyan-400" />
                  Lessons ({results.lessons.length})
                </span>
              </div>
              <div className="space-y-1">
                {results.lessons.map((l) => {
                  const itemIndex = flattenedItems.findIndex((it) => it.id === `lesson-${l.id}`);
                  const isSelected = selectedIndex === itemIndex;
                  return (
                    <button
                      key={l.id}
                      data-index={itemIndex}
                      onClick={() => {
                        onSelectLesson(l.slug);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-primary/15 border-l-2 border-primary text-white shadow-2xs'
                          : 'hover:bg-surface-elevated/60 text-slate-300 border-l-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <div className="truncate">
                          <div className="text-xs font-semibold truncate group-hover:text-white">
                            {l.title}
                          </div>
                          {l.topicTitle && (
                            <div className="text-[11px] text-slate-400 truncate mt-0.5">
                              In {l.topicTitle}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono border border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                          Lesson
                        </span>
                        {isSelected && (
                          <span className="flex items-center text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                            <CornerDownLeft className="w-3 h-3 mr-1" />
                            Open
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Group 3: Problems */}
          {results && results.problems.length > 0 && (
            <div className="pt-3">
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Code className="w-3 h-3 text-emerald-400" />
                  Practice Problems ({results.problems.length})
                </span>
              </div>
              <div className="space-y-1">
                {results.problems.map((p) => {
                  const itemIndex = flattenedItems.findIndex((it) => it.id === `problem-${p.id}`);
                  const isSelected = selectedIndex === itemIndex;
                  const isEasy = p.difficulty.toUpperCase() === 'EASY';
                  const isHard = p.difficulty.toUpperCase() === 'HARD';
                  const badgeColor = isEasy
                    ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                    : isHard
                    ? 'border-rose-500/30 text-rose-400 bg-rose-500/10'
                    : 'border-amber-500/30 text-amber-400 bg-amber-500/10';

                  return (
                    <button
                      key={p.id}
                      data-index={itemIndex}
                      onClick={() => {
                        onSelectProblem(p.slug);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-primary/15 border-l-2 border-primary text-white shadow-2xs'
                          : 'hover:bg-surface-elevated/60 text-slate-300 border-l-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <Code className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <div className="truncate">
                          <div className="text-xs font-semibold truncate group-hover:text-white">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {p.difficulty} {p.topicTitle && `• ${p.topicTitle}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${badgeColor}`}>
                          {p.difficulty}
                        </span>
                        {isSelected && (
                          <span className="flex items-center text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                            <CornerDownLeft className="w-3 h-3 mr-1" />
                            Open
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts (Linear / Raycast Cues) */}
        <div className="px-4 py-2.5 bg-surface-muted/30 border-t border-border text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-surface-elevated border border-border rounded text-slate-300 font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-surface-elevated border border-border rounded text-slate-300 font-mono text-[10px]">
                ↓
              </kbd>
              <span className="ml-0.5">Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-surface-elevated border border-border rounded text-slate-300 font-mono text-[10px]">
                ↵
              </kbd>
              <span className="ml-0.5">Select</span>
            </span>
            <span className="flex items-center gap-1 hidden sm:inline-flex">
              <kbd className="px-1.5 py-0.5 bg-surface-elevated border border-border rounded text-slate-300 font-mono text-[10px]">
                ESC
              </kbd>
              <span className="ml-0.5">Close</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>AkayTheory Search</span>
          </div>
        </div>
      </div>
    </div>
  );
};
