import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, Folder } from 'lucide-react';
import { QuickStatCard } from '@/components/QuickStatCard';
import { ProjectCard } from '@/components/ProjectCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContracts } from '@/hooks/useContracts';
import { useBalances } from '@/hooks/useBalances';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { getContributionControllerContract } = useContracts();
  const { tokenBalance } = useBalances();
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const chartData = [
    { month: 'Jan', impact: 120 },
    { month: 'Feb', impact: 180 },
    { month: 'Mar', impact: 250 },
    { month: 'Apr', impact: 320 },
    { month: 'May', impact: 410 },
    { month: 'Jun', impact: 520 },
  ];

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
      title: 'Smart Contract Audit Framework',
      description: 'Automated security analysis tool for Ethereum smart contracts.',
      contributor: '0xC45d89012345678901234567890IJK',
      cid: 'QmPqrStuVwx5432109876LmNoPqR',
      rewardStatus: 'Claimable' as const,
      citations: 6,
      rewardAmount: '95.00',
    },
  ];

  const handleClaim = async (id: string) => {
    setClaimingId(id);
    const controller = getContributionControllerContract();
    await controller.claimReward(id);
    setClaimingId(null);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Track your contributions, rewards, and impact
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickStatCard icon={Folder} label="Total Contributions" value={12} />
            <QuickStatCard icon={TrendingUp} label="Impact Score" value={8743} />
            <QuickStatCard
              icon={Award}
              label="Tokens Earned"
              value={parseFloat(tokenBalance)}
              format="currency"
            />
            <QuickStatCard icon={Users} label="Active Projects" value={5} />
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Impact Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="impact" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(var(--teal))" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Contributions</h2>
            <p className="text-muted-foreground">Manage and track your active projects</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <ProjectCard
                  {...project}
                  onClaim={handleClaim}
                  onView={(id) => console.log('View project:', id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Contribution submitted', project: 'Open Data Citation Engine', time: '2 hours ago' },
                  { action: 'Reward claimed', project: 'Smart Contract Audit', time: '5 hours ago' },
                  { action: 'New citation', project: 'Research Archive', time: '1 day ago' },
                  { action: 'Project approved', project: 'AI Peer Review', time: '2 days ago' },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.project}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
