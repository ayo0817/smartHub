import React, { useState } from "react";
import { Sparkles, BookOpen, HelpCircle, Lightbulb, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { summarizeText, generateQuiz, explainConcept } from "../lib/gemini";
import { cn } from "../lib/utils";

export function AIStudy() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [mode, setMode] = useState<"summarize" | "quiz" | "explain">("summarize");

  const handleAIAction = async () => {
    if (!input) return;
    setLoading(true);
    try {
      let data;
      if (mode === "summarize") {
        data = await summarizeText(input);
      } else if (mode === "quiz") {
        data = await generateQuiz(input);
      } else {
        data = await explainConcept(input);
      }
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult("Error generating AI response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 text-accent rounded-3xl mb-4">
          <Sparkles size={32} />
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-primary">AI Study Assistant</h2>
        <p className="text-secondary text-lg">Supercharge your learning with Gemini 3.1 Pro.</p>
      </header>

      <div className="card space-y-6">
        <div className="flex p-1 bg-gray-100 rounded-2xl">
          {(["summarize", "quiz", "explain"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setResult(null); }}
              className={cn(
                "flex-1 py-3 rounded-xl text-sm font-bold transition-all capitalize",
                mode === m ? "bg-white text-primary shadow-sm" : "text-secondary hover:text-primary"
              )}
            >
              {m}
            </button>
          ))}
        </div>

        <textarea
          className="input-field min-h-[200px] resize-none text-lg leading-relaxed"
          placeholder={
            mode === "summarize" ? "Paste your lecture notes here..." :
            mode === "quiz" ? "Paste text to generate a quiz from..." :
            "Type a concept you want explained simply..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleAIAction}
          disabled={loading || !input}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
          {mode === "summarize" ? "Summarize Notes" : mode === "quiz" ? "Generate Quiz" : "Explain Concept"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card bg-white border-accent/20"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              {mode === "summarize" ? <BookOpen className="text-accent" /> : 
               mode === "quiz" ? <HelpCircle className="text-accent" /> : 
               <Lightbulb className="text-accent" />}
              <h3 className="text-xl font-bold capitalize">{mode} Result</h3>
            </div>

            <div className="prose prose-slate max-w-none">
              {mode === "quiz" && Array.isArray(result) ? (
                <div className="space-y-8">
                  {result.map((q: any, i: number) => (
                    <div key={i} className="space-y-4">
                      <p className="font-bold text-lg">{i + 1}. {q.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt: string) => (
                          <button key={opt} className="p-4 text-left rounded-xl border border-gray-100 hover:border-accent hover:bg-accent/5 transition-all">
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-lg leading-relaxed text-secondary">
                  {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
