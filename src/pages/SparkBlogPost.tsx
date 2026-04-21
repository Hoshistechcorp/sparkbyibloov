import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, User, Pencil, Save, X, Trash2 } from 'lucide-react';
import { SparkSubNav } from '@/components/spark/SparkSubNav';
import { SparkFooter } from '@/components/spark/SparkFooter';
import { toast } from 'sonner';

const SparkBlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' });
        setIsAdmin(!!data);
      }
    })();
  }, []);

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug, isAdmin],
    queryFn: async () => {
      const query = supabase.from('blog_posts').select('*').eq('slug', slug);
      const { data, error } = isAdmin ? await query.maybeSingle() : await query.eq('published', true).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (post && !form) {
      setForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        cover_image_url: post.cover_image_url || '',
        author_name: post.author_name,
        category: post.category,
        published: post.published,
      });
    }
  }, [post, form]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, published_at: form.published ? (post?.published_at || new Date().toISOString()) : null };
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', post!.id);
      if (error) throw error;
      return form.slug;
    },
    onSuccess: (newSlug) => {
      queryClient.invalidateQueries({ queryKey: ['blog-post'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      setEditing(false);
      toast.success('Post updated!');
      if (newSlug && newSlug !== slug) navigate(`/spark/news/${newSlug}`);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', post!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Post deleted');
      navigate('/spark/news');
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen font-[Nunito]">
        <SparkSubNav activeLink="news" />
        <div className="pt-32 flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-4 border-[#ec9f00] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-white min-h-screen font-[Nunito]">
        <SparkSubNav activeLink="news" />
        <div className="pt-32 text-center py-20">
          <h1 className="text-2xl font-bold text-gray-300 mb-2">Post not found</h1>
          <Link to="/spark/news" className="text-[#ec9f00] font-bold hover:underline">← Back to News</Link>
        </div>
        <SparkFooter />
      </div>
    );
  }

  // Simple markdown-like rendering (bold, paragraphs)
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, i) => {
      const html = block
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br/>');
      return <p key={i} className="text-base md:text-lg text-gray-600 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: html }} />;
    });
  };

  return (
    <>
      <SEOHead title={`${post.title} — Spark News`} description={post.excerpt || ''} />
      <div className="bg-white text-gray-900 min-h-screen font-[Nunito]">
        <SparkSubNav activeLink="news" />

        {post.cover_image_url && (
          <div className="w-full h-64 md:h-96 overflow-hidden relative">
            <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>
        )}

        <article className="max-w-3xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-16">
          <Link to="/spark/news" className="inline-flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase font-bold text-[#ec9f00] hover:text-[#c48500] mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block text-[10px] tracking-[0.15em] uppercase font-bold px-3 py-1 rounded-full bg-[#ec9f00]/10 text-[#c48500] border border-[#ec9f00]/20 mb-4">
              {post.category}
            </span>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-10 pb-6 border-b border-gray-100">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author_name}</span>
              {post.published_at && (
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {format(new Date(post.published_at), 'MMMM dd, yyyy')}</span>
              )}
            </div>

            <div className="prose-spark">
              {renderContent(post.content)}
            </div>
          </motion.div>
        </article>

        <section className="py-12 px-4 text-center bg-gray-50">
          <h2 className="text-xl font-extrabold text-gray-900 mb-3">Enjoyed this article?</h2>
          <p className="text-gray-400 mb-6 text-sm">Explore more stories and insights from the Spark ecosystem.</p>
          <Link to="/spark/news" className="inline-block bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-3 rounded-full hover:bg-[#d48e00] transition-all">
            More Stories →
          </Link>
        </section>
        <SparkFooter />
      </div>
    </>
  );
};

export default SparkBlogPost;
