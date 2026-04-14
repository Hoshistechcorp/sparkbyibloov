import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { SparkSubNav } from '@/components/spark/SparkSubNav';
import { SparkFooter } from '@/components/spark/SparkFooter';

const SparkNews = () => {
  const { data: posts = [] } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <SEOHead title="Spark News — Stories, Updates & Insights" description="The latest from Spark — industry news, learner stories, program updates, and more." />
      <div className="bg-white text-gray-900 min-h-screen font-[Nunito]">
        <SparkSubNav activeLink="news" />

        <section className="pt-24 md:pt-32 pb-8 md:pb-12 px-4 md:px-12 max-w-7xl mx-auto">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] tracking-[0.3em] uppercase text-[#c48500] font-bold mb-4 block">News & Blog</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 text-gray-900 leading-[0.95]">
            Stories that<br />
            <span className="text-[#ec9f00]">inspire.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base md:text-lg text-gray-400 max-w-2xl">
            Industry insights, learner spotlights, program updates, and the latest from the Spark ecosystem.
          </motion.p>
        </section>

        <section className="px-4 md:px-12 pb-16 md:pb-24 max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <p className="text-2xl font-bold text-gray-300 mb-2">Coming soon</p>
              <p className="text-gray-400">Our editorial team is cooking up something special. Stay tuned!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {posts.map((post: any, i: number) => (
                <motion.article key={post.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer">
                  {post.cover_image_url && (
                    <div className="h-40 md:h-48 overflow-hidden">
                      <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[9px] tracking-[0.15em] uppercase font-bold px-2.5 py-1 rounded-full bg-[#ec9f00]/10 text-[#c48500] border border-[#ec9f00]/20">{post.category}</span>
                      {post.published_at && <span className="text-[11px] text-gray-300">{format(new Date(post.published_at), 'MMM dd, yyyy')}</span>}
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 group-hover:text-[#c48500] transition-colors">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-gray-400 line-clamp-3 mb-4">{post.excerpt}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">By {post.author_name}</span>
                      <span className="text-[10px] tracking-[0.12em] uppercase font-bold text-[#c48500] flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
        <SparkFooter />
      </div>
    </>
  );
};

export default SparkNews;
