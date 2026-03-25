import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  TrendingUp 
} from "lucide-react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, query, where, onSnapshot, limit, orderBy } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

export function Dashboard() {
  const { user } = useAuth();
  const [taskStats, setTaskStats] = useState({ pending: 0, completed: 0 });
  const [noteCount, setNoteCount] = useState(0);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Tasks stats
    const tasksQ = query(collection(db, "tasks"), where("uid", "==", user.uid));
    const unsubscribeTasks = onSnapshot(tasksQ, (snapshot) => {
      const pending = snapshot.docs.filter(d => d.data().status === "pending").length;
      const completed = snapshot.docs.filter(d => d.data().status === "completed").length;
      setTaskStats({ pending, completed });
      
      // Upcoming tasks
      const upcoming = snapshot.docs
        .filter(d => d.data().status === "pending")
        .sort((a, b) => new Date(a.data().deadline).getTime() - new Date(b.data().deadline).getTime())
        .slice(0, 3)
        .map(d => ({ id: d.id, ...d.data() }));
      setUpcomingTasks(upcoming);
    }, (error) => handleFirestoreError(error, OperationType.LIST, "tasks"));

    // Notes count
    const notesQ = query(collection(db, "notes"), where("uid", "==", user.uid));
    const unsubscribeNotes = onSnapshot(notesQ, (snapshot) => {
      setNoteCount(snapshot.size);
    }, (error) => handleFirestoreError(error, OperationType.LIST, "notes"));

    return () => {
      unsubscribeTasks();
      unsubscribeNotes();
    };
  }, [user]);

  const stats = [
    { label: "Tasks Pending", value: taskStats.pending.toString(), icon: Clock, color: "text-orange-500" },
    { label: "Completed", value: taskStats.completed.toString(), icon: CheckCircle2, color: "text-green-500" },
    { label: "Total Notes", value: noteCount.toString(), icon: BookOpen, color: "text-blue-500" },
    { label: "Avg Grade", value: "A-", icon: TrendingUp, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, Student!</h2>
        <p className="text-secondary mt-1">Here's what's happening with your studies today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="card flex items-center gap-4"
          >
            <div className={cn("p-3 rounded-2xl bg-gray-50", stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-secondary font-medium">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="card">
            <h3 className="text-xl font-bold mb-4">Upcoming Deadlines</h3>
            <div className="space-y-4">
              {upcomingTasks.length > 0 ? upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-12 bg-accent rounded-full" />
                    <div>
                      <p className="font-semibold">{task.title}</p>
                      <p className="text-sm text-secondary">Due: {task.deadline} • {task.priority} Priority</p>
                    </div>
                  </div>
                  <button className="text-accent font-medium hover:underline">View</button>
                </div>
              )) : (
                <p className="text-secondary text-center py-8">No upcoming tasks. Great job!</p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card bg-primary text-white">
            <h3 className="text-xl font-bold mb-2">AI Study Tip</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              "Based on your recent performance, you seem to focus best in the evenings. Try scheduling your complex algorithm studies between 6 PM and 8 PM."
            </p>
            <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all">
              Get More Insights
            </button>
          </section>
          
          <section className="card">
            <h3 className="text-xl font-bold mb-4">Recent Notes</h3>
            <div className="space-y-3">
              {["Data Structures", "Operating Systems", "Networking"].map((note) => (
                <div key={note} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-all">
                  <BookOpen size={18} className="text-secondary" />
                  <span className="text-sm font-medium">{note}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
