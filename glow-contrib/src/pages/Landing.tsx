import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Users, Award, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeroScene } from '@/components/HeroScene';
import { QuickStatCard } from '@/components/QuickStatCard';
import { ProjectCard } from '@/components/ProjectCard';
import { useContracts } from '@/hooks/useContracts';
import { useEffect, useState } from 'react';

const Landing = () => {
  const { getContriTokenContract } = useContracts();
  const [totalSupply, setTotalSupply] = useState('0');

  useEffect(() => {
    const fetchData = async () => {
      const contract = getContriTokenContract();
      const supply = await contract.totalSupply();
      setTotalSupply(supply);
    };
    fetchData();
  }, []);

  const mockProjects = [
    {
      id: '1',
      title: 'Open Data Citation Engine',
      description: 'A tool to attribute dataset citations automatically across publications and repos.',
      contributor: '0xA12b45678901234567890123456789CDE',
      cid: 'QmXyzExampleCid1234567890AbCdEf',
      rewardStatus: 'Claimable' as const,
      citations: 8,
      rewardAmount: '125.50',
    },
    {
      id: '2',
      title: 'Decentralized Research Archive',
      description: 'Blockchain-based archival system for scientific research papers and data.',
      contributor: '0xB98c76543210987654321098765432FGH',
      cid: 'QmAbcDefGhi9876543210ZyXwVuTsR',
      rewardStatus: 'Pending' as const,
      citations: 12,
      rewardAmount: '89.25',
    },
    {
      id: '3',
      title: 'AI-Powered Peer Review Assistant',
      description: 'Machine learning tool to assist in academic peer review processes.',
      contributor: '0xC45d89012345678901234567890IJK',
      cid: 'QmPqrStuVwx5432109876LmNoPqR',
      rewardStatus: 'Claimed' as const,
      citations: 15,
      rewardAmount: '200.00',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-block">
                <div className="glass px-4 py-2 rounded-full text-sm font-medium">
                  🚀 Decentralized Contribution Platform
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Build the Future
                <br />
                <span className="gradient-text">Together</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg">
                Contribute, collaborate, and earn rewards on the world's first blockchain-powered
                contribution platform. Your work, your tokens, your impact.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/dashboard">
                  <Button variant="gradient" size="lg" className="gap-2 text-base">
                    Explore Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/submit">
                  <Button variant="hero" size="lg" className="gap-2 text-base">
                    Submit Contribution
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <HeroScene />
            </motion.div>
          </div>
        </div>

        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-glow opacity-30" />
      </section>

      {/* Quick Stats */}
      <section className="py-16 border-t border-primary/20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <QuickStatCard
                icon={Users}
                label="Total Contributions"
                value={1284}
              />
              <QuickStatCard
                icon={Award}
                label="Tokens Distributed"
                value={parseFloat(totalSupply)}
                format="number"
              />
              <QuickStatCard
                icon={TrendingUp}
                label="Total Supply"
                value={parseFloat(totalSupply)}
                format="number"
              />
              <QuickStatCard
                icon={Globe}
                label="Active Contributors"
                value={342}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Contributions */}
      <section className="py-16">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">Recent Contributions</h2>
                <p className="text-muted-foreground mt-2">
                  Discover the latest contributions from our community
                </p>
              </div>
              <Link to="/marketplace">
                <Button variant="outline" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <ProjectCard {...project} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-primary/20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Make an Impact?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of contributors building the future of decentralized collaboration.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/submit">
                  <Button variant="gradient" size="lg" className="text-base">
                    Get Started
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="outline" size="lg" className="text-base">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-primary opacity-5" />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 py-8">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-gradient-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">C</span>
              </div>
              <span>© 2025 ContriBlock. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
