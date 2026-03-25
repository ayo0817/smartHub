import React, { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle, Clock, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
  uid: string;
  createdAt: string;
}

export function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(taskList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "tasks");
    });

    return unsubscribe;
  }, [user]);

  const addTask = async () => {
    if (!newTask || !user) return;
    const taskData = {
      title: newTask,
      deadline: newDeadline || new Date().toISOString().split('T')[0],
      priority: newPriority,
      status: "pending",
      uid: user.uid,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "tasks"), taskData);
      setNewTask("");
      setNewDeadline("");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "tasks");
    }
  };

  const toggleTask = async (id: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, "tasks", id), {
        status: currentStatus === "completed" ? "pending" : "completed"
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${id}`);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tasks/${id}`);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Tasks & Assignments</h2>
          <p className="text-secondary mt-1">Manage your academic workload efficiently.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="What needs to be done?"
                className="input-field flex-1"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <button onClick={addTask} className="btn-primary flex items-center gap-2">
                <Plus size={20} />
                Add Task
              </button>
            </div>
            <div className="flex gap-4">
              <input
                type="date"
                className="input-field flex-1"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
              />
              <select
                className="input-field flex-1"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={cn(
                    "card flex items-center justify-between p-4 group transition-all",
                    task.status === "completed" && "opacity-60 grayscale"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleTask(task.id, task.status)} className="text-accent">
                      {task.status === "completed" ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                    <div>
                      <p className={cn("font-semibold", task.status === "completed" && "line-through")}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          task.priority === "high" ? "bg-red-100 text-red-600" :
                          task.priority === "medium" ? "bg-orange-100 text-orange-600" :
                          "bg-blue-100 text-blue-600"
                        )}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-secondary flex items-center gap-1">
                          <Clock size={12} />
                          {task.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-6">
          <section className="card">
            <h3 className="text-xl font-bold mb-4">Task Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-secondary">Completion Rate</span>
                <span className="font-bold">75%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-accent h-full w-3/4" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-gray-50 rounded-2xl text-center">
                  <p className="text-2xl font-bold text-accent">12</p>
                  <p className="text-xs text-secondary font-medium uppercase tracking-wider">Pending</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl text-center">
                  <p className="text-2xl font-bold text-green-500">48</p>
                  <p className="text-xs text-secondary font-medium uppercase tracking-wider">Done</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
