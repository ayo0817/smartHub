import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";
import { TrendingUp, Target, Award, Calendar } from "lucide-react";
import { motion } from "motion/react";

const gradeData = [
  { month: "Jan", grade: 85 },
  { month: "Feb", grade: 88 },
  { month: "Mar", grade: 92 },
  { month: "Apr", grade: 90 },
  { month: "May", grade: 95 },
];

const studyHoursData = [
  { day: "Mon", hours: 4 },
  { day: "Tue", hours: 6 },
  { day: "Wed", hours: 3 },
  { day: "Thu", hours: 8 },
  { day: "Fri", hours: 5 },
  { day: "Sat", hours: 2 },
  { day: "Sun", hours: 4 },
];

export function Performance() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Performance Tracker</h2>
        <p className="text-secondary mt-1">Visualize your academic progress and study habits.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="card">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold">Grade Progress</h3>
                <p className="text-sm text-secondary">Your average grade over the last 5 months.</p>
              </div>
              <div className="flex items-center gap-2 text-green-500 font-bold">
                <TrendingUp size={20} />
                +12%
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gradeData}>
                  <defs>
                    <linearGradient id="colorGrade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9e9e9e' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9e9e9e' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="grade" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGrade)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="card">
            <h3 className="text-xl font-bold mb-8">Study Hours per Day</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyHoursData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9e9e9e' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9e9e9e' }} />
                  <Tooltip 
                    cursor={{ fill: '#f5f5f5' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="hours" fill="#1a1a1a" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card bg-accent text-white">
            <h3 className="text-xl font-bold mb-6">Learning Insights</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="p-3 bg-white/20 rounded-2xl h-fit">
                  <Target size={24} />
                </div>
                <div>
                  <p className="font-bold">Consistency King</p>
                  <p className="text-sm text-white/80">You've studied for 14 days straight! Keep it up.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="p-3 bg-white/20 rounded-2xl h-fit">
                  <Award size={24} />
                </div>
                <div>
                  <p className="font-bold">Peak Performance</p>
                  <p className="text-sm text-white/80">Your best grades are in "Algorithms".</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="p-3 bg-white/20 rounded-2xl h-fit">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="font-bold">Schedule Optimization</p>
                  <p className="text-sm text-white/80">You are 20% more productive on Tuesdays.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <h3 className="text-xl font-bold mb-4">Goals</h3>
            <div className="space-y-4">
              {[
                { label: "Complete Thesis", progress: 65 },
                { label: "Master React", progress: 80 },
                { label: "GPA Target 3.8", progress: 92 },
              ].map((goal) => (
                <div key={goal.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.label}</span>
                    <span className="text-secondary">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-primary h-full" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
