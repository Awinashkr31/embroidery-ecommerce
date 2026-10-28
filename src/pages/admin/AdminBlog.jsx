import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../../config/supabase';
import { uploadImage } from '../../utils/uploadUtils';
import { useToast } from '../../context/ToastContext';
import ReactMarkdown from 'react-markdown';
import {
  Plus, Edit2, Trash2, X, Search, Save, Eye, EyeOff,
  Image as ImageIcon, FileText, ArrowUpDown, ChevronLeft,
  Upload, AlertCircle, Loader, Check, Calendar, Globe
} from 'lucide-react';
import { blogPosts as staticBlogPosts } from '../Blog/posts.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const slugify = (str) =>
  (str || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');

const STATUS_COLORS = {
  published: 'bg-emerald-100 text-emerald-800',
  draft: 'bg-amber-100 text-amber-800',
};

// ─── Component ───────────────────────────────────────────────────────────────

const AdminBlog = () => {
  const { addToast } = useToast();

  // ── List state ──
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // desc = newest first
  const [dbNotice, setDbNotice] = useState(false);

  // ── Editor state ──
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // ── Delete confirmation ──
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Image upload state ──
  const [uploadingImage, setUploadingImage] = useState(false);

  // ── Form fields ──
  const emptyForm = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    status: 'draft',
    publish_date: new Date().toISOString().split('T')[0],
    meta_title: '',
    meta_description: '',
    keywords: '',
  };
  const [form, setForm] = useState(emptyForm);

  // ── Fetch posts ──
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    let loaded = [];
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('publish_date', { ascending: sortOrder === 'asc' });

      if (error) {
        console.warn('Note: Supabase blog_posts table query returned:', error.message);
        setDbNotice(true);
        // Load the 16 static baseline posts
        loaded = staticBlogPosts.map(p => ({
          id: p.slug,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt || '',
          content: p.content || '',
          image: p.image || '',
          status: 'published',
          publish_date: p.date ? `${p.date}T00:00:00+05:30` : new Date().toISOString(),
          meta_title: p.metaTitle || '',
          meta_description: p.metaDescription || '',
          keywords: p.keywords || '',
          isStatic: true
        }));
      } else {
        setDbNotice(false);
        const dbSlugs = new Set((data || []).map(p => p.slug));
        const missingStatic = staticBlogPosts
          .filter(p => !dbSlugs.has(p.slug))
          .map(p => ({
            id: p.slug,
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt || '',
            content: p.content || '',
            image: p.image || '',
            status: 'published',
            publish_date: p.date ? `${p.date}T00:00:00+05:30` : new Date().toISOString(),
            meta_title: p.metaTitle || '',
            meta_description: p.metaDescription || '',
            keywords: p.keywords || '',
            isStatic: true
          }));
        loaded = [...(data || []), ...missingStatic];
      }
    } catch (err) {
      console.warn('Error fetching posts:', err);
      setDbNotice(true);
      loaded = staticBlogPosts.map(p => ({
        id: p.slug,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || '',
        content: p.content || '',
        image: p.image || '',
        status: 'published',
        publish_date: p.date ? `${p.date}T00:00:00+05:30` : new Date().toISOString(),
        meta_title: p.metaTitle || '',
        meta_description: p.metaDescription || '',
        keywords: p.keywords || '',
        isStatic: true
      }));
    }

    if (sortOrder === 'asc') {
      loaded.sort((a, b) => new Date(a.publish_date) - new Date(b.publish_date));
    } else {
      loaded.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));
    }
    setPosts(loaded);
    setLoading(false);
  }, [sortOrder]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ── Filtered posts ──
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return posts;
    const term = searchTerm.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term)
    );
  }, [posts, searchTerm]);

  // ── Open editor ──
  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setSlugError('');
    setPreviewMode(false);
    setEditorOpen(true);
  };

  const openEdit = (post) => {
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      image: post.image || '',
      status: post.status || 'draft',
      publish_date: post.publish_date
        ? new Date(post.publish_date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      keywords: post.keywords || '',
    });
    setEditingId(post.id);
    setSlugError('');
    setPreviewMode(false);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingId(null);
    setSlugError('');
  };

  // ── Auto-generate slug from title ──
  const handleTitleChange = (val) => {
    const newForm = { ...form, title: val };
    // Only auto-generate slug if the user hasn't manually edited it
    // (i.e., creating new and slug matches previous auto-generated value)
    if (!editingId && (form.slug === '' || form.slug === slugify(form.title))) {
      newForm.slug = slugify(val);
    }
    setForm(newForm);
    setSlugError('');
  };

  // ── Image upload handler ──
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadImage(file, 'images', 'blog');
      setForm((prev) => ({ ...prev, image: url }));
      addToast('Image uploaded', 'success');
    } catch (err) {
      addToast('Image upload failed: ' + err.message, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // ── Save (create / update) ──
  const handleSave = async (overrideStatus) => {
    // Validate required fields
    if (!form.title.trim()) {
      addToast('Title is required', 'error');
      return;
    }
    if (!form.slug.trim()) {
      addToast('Slug is required', 'error');
      return;
    }

    setSaving(true);
    setSlugError('');

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content,
      image: form.image,
      status: overrideStatus || form.status,
      publish_date: form.publish_date
        ? `${form.publish_date}T00:00:00+05:30`
        : new Date().toISOString(),
      meta_title: form.meta_title.trim() || form.title.trim(),
      meta_description: form.meta_description.trim() || form.excerpt.trim(),
      keywords: form.keywords.trim(),
    };

    // Check slug uniqueness in memory across loaded posts
    const slugCollision = posts.find(p => p.slug === payload.slug && p.id !== editingId);
    if (slugCollision) {
      setSlugError(`Slug "${payload.slug}" is already in use by another article.`);
      setSaving(false);
      return;
    }

    try {
      // Check slug uniqueness in Supabase if online
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', payload.slug)
        .maybeSingle();

      if (existing && existing.id !== editingId) {
        setSlugError(`Slug "${payload.slug}" is already in use by another article.`);
        setSaving(false);
        return;
      }

      let error;
      const isUUID = editingId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(editingId);

      if (editingId && isUUID) {
        // Update
        ({ error } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', editingId));
      } else {
        // Create or upsert on slug
        ({ error } = await supabase.from('blog_posts').upsert(payload, { onConflict: 'slug' }));
      }

      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('relation "public.blog_posts" does not exist')) {
          addToast('Database table "blog_posts" not found. Please run database/blog_posts_table.sql in Supabase first.', 'error');
        } else if (error.message?.includes('duplicate key') || error.message?.includes('unique')) {
          setSlugError(`Slug "${payload.slug}" is already taken.`);
        } else {
          addToast('Save failed: ' + error.message, 'error');
        }
      } else {
        addToast(
          editingId ? 'Article updated' : 'Article created',
          'success'
        );
        closeEditor();
        fetchPosts();
      }
    } catch (err) {
      addToast('Unexpected error: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle publish/unpublish from list ──
  const toggleStatus = async (post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    const isUUID = post.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(post.id);

    let error;
    if (isUUID) {
      ({ error } = await supabase
        .from('blog_posts')
        .update({ status: newStatus })
        .eq('id', post.id));
    } else {
      ({ error } = await supabase
        .from('blog_posts')
        .upsert({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          image: post.image,
          status: newStatus,
          publish_date: post.publish_date,
          meta_title: post.meta_title,
          meta_description: post.meta_description,
          keywords: post.keywords
        }, { onConflict: 'slug' }));
    }

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        addToast('Please run database/blog_posts_table.sql in Supabase first.', 'error');
      } else {
        addToast('Failed to update status', 'error');
      }
    } else {
      addToast(
        newStatus === 'published' ? 'Article published' : 'Article unpublished',
        'success'
      );
      fetchPosts();
    }
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    setDeleting(true);
    const isUUID = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let error;
    if (isUUID) {
      ({ error } = await supabase.from('blog_posts').delete().eq('id', id));
    } else {
      ({ error } = await supabase.from('blog_posts').delete().eq('slug', id));
      setPosts(prev => prev.filter(p => p.id !== id && p.slug !== id));
    }

    if (error && error.code !== 'PGRST205') {
      addToast('Delete failed: ' + error.message, 'error');
    } else {
      addToast('Article deleted', 'success');
      fetchPosts();
    }
    setDeleting(false);
    setDeleteConfirmId(null);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER: Blog List View
  // ══════════════════════════════════════════════════════════════════════════
  if (!editorOpen) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-heading font-bold text-stone-900">
              Blog Articles
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              {posts.length} article{posts.length !== 1 && 's'} total
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-rose-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-rose-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
        </div>

        {/* Database Setup Notice if table not created yet */}
        {dbNotice && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Database Setup Notice</p>
              <p className="text-amber-800 text-xs mt-1 leading-relaxed">
                The 16 existing articles are loaded from the repository baseline. To enable creating, editing, and publishing new articles directly in Supabase, execute the SQL script in <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900">database/blog_posts_table.sql</code> via your Supabase SQL Editor, then run <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900">node scripts/seed_blog_posts.js</code>.
              </p>
            </div>
          </div>
        )}

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by title or slug…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 bg-white"
            />
          </div>
          <button
            onClick={() => setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors bg-white"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>

        {/* Post list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-6 h-6 animate-spin text-stone-400" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No articles found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/50">
                    <th className="text-left px-5 py-3 font-bold text-stone-600">Title</th>
                    <th className="text-left px-5 py-3 font-bold text-stone-600 hidden md:table-cell">Slug</th>
                    <th className="text-center px-5 py-3 font-bold text-stone-600">Status</th>
                    <th className="text-left px-5 py-3 font-bold text-stone-600 hidden sm:table-cell">Date</th>
                    <th className="text-right px-5 py-3 font-bold text-stone-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {post.image && (
                            <img
                              src={post.image}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover shrink-0 hidden sm:block"
                            />
                          )}
                          <span className="font-semibold text-stone-900 line-clamp-1">
                            {post.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-stone-500 font-mono text-xs hidden md:table-cell">
                        /{post.slug}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                            STATUS_COLORS[post.status] || STATUS_COLORS.draft
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-stone-500 text-xs hidden sm:table-cell whitespace-nowrap">
                        {post.publish_date
                          ? new Date(post.publish_date).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleStatus(post)}
                            title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                            className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                          >
                            {post.status === 'published' ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => openEdit(post)}
                            title="Edit"
                            className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(post.id)}
                            title="Delete"
                            className="p-2 rounded-lg text-stone-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete confirmation modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-heading font-bold text-lg text-stone-900">
                  Delete Article?
                </h3>
              </div>
              <p className="text-stone-600 text-sm mb-6">
                This action cannot be undone. The article will be permanently
                removed from both the admin panel and the public site.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {deleting ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER: Blog Editor
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-6">
      {/* Editor header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={closeEditor}
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Articles
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
              previewMode
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Eye className="w-4 h-4" /> {previewMode ? 'Editing' : 'Preview'}
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 text-sm font-bold text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-sm"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-heading font-bold text-stone-900">
        {editingId ? 'Edit Article' : 'New Article'}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main content column ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter article title…"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-stone-400 text-sm font-mono">/blog/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setForm({ ...form, slug: slugify(e.target.value) });
                  setSlugError('');
                }}
                placeholder="article-slug"
                className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 ${
                  slugError ? 'border-red-400 bg-red-50' : 'border-stone-200'
                }`}
              />
            </div>
            {slugError && (
              <p className="mt-1.5 text-red-600 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {slugError}
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">
              Excerpt / Short Summary
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="A brief summary for the blog list page…"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 resize-y"
            />
          </div>

          {/* Body Content */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">
              Body Content (Markdown)
            </label>
            {previewMode ? (
              <div className="min-h-[300px] p-6 rounded-xl border border-stone-200 bg-white prose prose-stone prose-rose max-w-none prose-headings:font-heading prose-headings:font-bold prose-h3:text-2xl prose-a:text-rose-700 prose-a:no-underline hover:prose-a:underline">
                <ReactMarkdown>{form.content || '*No content yet*'}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your article in Markdown…"
                rows={18}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 resize-y"
              />
            )}
            <p className="mt-1.5 text-stone-400 text-xs">
              Supports Markdown: **bold**, *italic*, ### headings, [links](/url), tables, etc.
            </p>
          </div>
        </div>

        {/* ── Sidebar column ── */}
        <div className="space-y-5">
          {/* Status & Date */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-stone-900 text-sm">
              Publish Settings
            </h3>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase tracking-wider">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase tracking-wider">
                Publish Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="date"
                  value={form.publish_date}
                  onChange={(e) => setForm({ ...form, publish_date: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-stone-900 text-sm">
              Cover Image
            </h3>
            {form.image ? (
              <div className="relative">
                <img
                  src={form.image}
                  alt="Cover"
                  className="w-full aspect-[16/10] object-cover rounded-xl"
                />
                <button
                  onClick={() => setForm({ ...form, image: '' })}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="aspect-[16/10] rounded-xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-400 bg-stone-50">
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-xs font-medium">No image</span>
              </div>
            )}
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-100 text-stone-700 text-xs font-bold cursor-pointer hover:bg-stone-200 transition-colors w-full justify-center">
              {uploadingImage ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploadingImage ? 'Uploading…' : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
            </label>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">
                Or paste URL
              </label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/promo-images/example.webp"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-stone-900 text-sm">
              SEO Settings
            </h3>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase tracking-wider">
                SEO Title
              </label>
              <input
                type="text"
                value={form.meta_title}
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                placeholder={form.title || 'Defaults to article title'}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
              <p className="mt-1 text-stone-400 text-xs">
                {(form.meta_title || form.title).length}/60 characters
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase tracking-wider">
                Meta Description
              </label>
              <textarea
                value={form.meta_description}
                onChange={(e) =>
                  setForm({ ...form, meta_description: e.target.value })
                }
                placeholder={form.excerpt || 'Defaults to excerpt'}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-200 resize-y"
              />
              <p className="mt-1 text-stone-400 text-xs">
                {(form.meta_description || form.excerpt).length}/160 characters
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase tracking-wider">
                Keywords
              </label>
              <input
                type="text"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                placeholder="keyword1, keyword2, keyword3"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;
