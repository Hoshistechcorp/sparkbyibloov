import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import { SparkSubNav } from '@/components/spark/SparkSubNav';
import { SparkHero } from '@/components/spark/SparkHero';
import { SparkMarquee } from '@/components/spark/SparkMarquee';
import { SparkAudience } from '@/components/spark/SparkAudience';
import { SparkDNA } from '@/components/spark/SparkDNA';
import { SparkPartners } from '@/components/spark/SparkPartners';
import { SparkCTA } from '@/components/spark/SparkCTA';
import { SparkFooter } from '@/components/spark/SparkFooter';

const Spark = () => {
  return (
    <>
      <SEOHead
        title="Spark — Learn What Actually Matters"
        description="Spark by iBloov Learning combines world-class education with real-world hospitality, events & tourism skills. Micro-credentials for the next generation of industry leaders."
        keywords="spark, ibloov, learning, hospitality, events, tourism, micro-credentials"
      />
      <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden font-[Nunito]">
        <SparkSubNav activeLink="home" />
        <SparkHero />
        <SparkMarquee />

        <SparkAudience />
        <SparkDNA />
        <SparkPartners />
        <SparkScholarship />
        <SparkCTA />
        <SparkFooter />
      </div>
    </>
  );
};

export default Spark;
