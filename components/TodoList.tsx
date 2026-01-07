import React, { useState } from 'react';
import { Task } from '../types';
import { generateSubtasks } from '../services/geminiService';
import { playSound } from '../services/soundService';
import { Plus, Trash2, Check, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface TodoListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
}

const TodoList: React.FC<TodoListProps> = ({ tasks, setTasks, activeTaskId, setActiveTaskId }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [subtaskInputVisibleFor, setSubtaskInputVisibleFor] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const addSubtask = (parentId: string) => {
    if (!newSubtaskTitle.trim()) return;
    playSound('add');
    const newSubtask: Task = {
      id: crypto.randomUUID(),
      title: newSubtaskTitle,
      completed: false,
    };
    setTasks(tasks.map(t =>
      t.id === parentId
        ? { ...t, subtasks: [...(t.subtasks || []), newSubtask] }
        : t
    ));
    setNewSubtaskTitle('');
    setSubtaskInputVisibleFor(null);
  };

  const deleteSubtask = (parentId: string, subtaskId: string) => {
    playSound('delete');
    setTasks(tasks.map(t =>
      t.id === parentId
        ? { ...t, subtasks: t.subtasks?.filter(st => st.id !== subtaskId) }
        : t
    ));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    playSound('add');
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        if (!t.completed) playSound('complete');
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    playSound('delete');
    setTasks(tasks.filter(t => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  };

  const handleAiBreakdown = async (task: Task) => {
    if (isGenerating) return;
    playSound('ai');
    setIsGenerating(task.id);
    
    const subtasks = await generateSubtasks(task.title);
    
    if (subtasks.length > 0) {
      playSound('complete'); // Success sound for AI generation
      const subtaskObjects: Task[] = subtasks.map(st => ({
        id: crypto.randomUUID(),
        title: st,
        completed: false
      }));
      
      setTasks(prev => prev.map(t => {
        if (t.id === task.id) {
          return { ...t, subtasks: subtaskObjects };
        }
        return t;
      }));
    }
    setIsGenerating(null);
  };

  return (
    <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col h-[500px] overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white tracking-wide">Tasks</h2>
        <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/70">
          {tasks.filter(t => !t.completed).length} Remaining
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tasks.length === 0 && (
          <div className="text-center text-white/30 mt-10 italic">
            No tasks yet. Add one to start flowing.
          </div>
        )}

        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`group rounded-xl p-3 border transition-all duration-300 ${
              activeTaskId === task.id 
                ? 'bg-white/10 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                : 'bg-white/5 border-transparent hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.completed ? 'bg-green-500 border-green-500' : 'border-white/30 hover:border-white'
                }`}
              >
                {task.completed && <Check size={14} className="text-black" />}
              </button>
              
              <span 
                onClick={() => setActiveTaskId(task.id)}
                className={`flex-1 cursor-pointer truncate ${task.completed ? 'line-through text-white/30' : 'text-white'}`}
              >
                {task.title}
              </span>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleAiBreakdown(task)}
                  disabled={!!isGenerating}
                  className="p-2 text-purple-300 hover:text-purple-100 transition-colors"
                  title="Break down with AI"
                >
                  {isGenerating === task.id ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                </button>
                <button
                  onClick={() => setSubtaskInputVisibleFor(subtaskInputVisibleFor === task.id ? null : task.id)}
                  className="p-2 text-blue-300 hover:text-blue-100 transition-colors"
                  title="Add subtask"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-red-300 hover:text-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Subtasks */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="ml-9 mt-2 space-y-2 pl-2 border-l border-white/10">
                {task.subtasks.map(st => (
                  <div key={st.id} className="group flex items-center justify-between gap-2 text-sm text-white/70 pr-2">
                    <div className="flex items-center gap-2">
                      <button
                          onClick={() => {
                            const updatedSubtasks = task.subtasks?.map(s => s.id === st.id ? { ...s, completed: !s.completed } : s);
                            setTasks(tasks.map(t => t.id === task.id ? { ...t, subtasks: updatedSubtasks } : t));
                            if (!st.completed) playSound('complete');
                          }}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                            st.completed ? 'bg-white/50 border-transparent' : 'border-white/20 hover:border-white/50'
                          }`}
                        >
                          {st.completed && <Check size={10} className="text-black" />}
                        </button>
                        <span className={`truncate ${st.completed ? 'line-through opacity-50' : ''}`}>{st.title}</span>
                    </div>
                    <button
                      onClick={() => deleteSubtask(task.id, st.id)}
                      className="p-1 text-red-300 hover:text-red-100 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete subtask"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {subtaskInputVisibleFor === task.id && (
              <div className="ml-9 mt-2 pl-2">
                <form onSubmit={(e) => { e.preventDefault(); addSubtask(task.id); }} className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add subtask..."
                    className="flex-1 bg-white/5 border-none outline-none text-white placeholder-white/30 focus:ring-0 rounded-md text-sm px-2 py-1"
                    autoFocus
                  />
                  <button type="submit" className="p-1 bg-white/10 hover:bg-white/20 rounded-md text-white" aria-label="Add subtask">
                    <Plus size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={addTask} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 focus:ring-0"
        />
        <button 
          type="submit" 
          disabled={!newTaskTitle.trim()}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white disabled:opacity-30 transition-colors"
          aria-label="Add task"
        >
          <Plus size={20} />
        </button>
      </form>
    </div>
  );
};

export default TodoList;