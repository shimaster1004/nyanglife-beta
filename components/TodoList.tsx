import React, { useState } from 'react';
import { useStore } from '../store';
import { Card } from './ui/Card';
import { Check, Plus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const TodoList: React.FC = () => {
  const { todos, currentCatId, addTodo, toggleTodo, deleteTodo } = useStore();
  const [inputValue, setInputValue] = useState('');

  const catTodos = todos.filter(t => t.cat_id === currentCatId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    addTodo(inputValue.trim());
    setInputValue('');
  };

  return (
    <Card className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">오늘의 할 일</h3>
        <span className="text-xs font-medium bg-orange-100 text-primary px-2 py-1 rounded-full">
          {catTodos.filter(t => t.is_completed).length}/{catTodos.length} 완료
        </span>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="relative mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="ex) 모래 주문하기, 사료 소분..."
          className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-1.5 rounded-lg text-primary hover:bg-orange-50 transition-colors shadow-sm"
        >
          <Plus size={16} />
        </button>
      </form>

      {/* List */}
      <div className="space-y-2">
        {catTodos.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">
            <p>할 일이 없네요! 냥이랑 놀아줄까요? 😺</p>
          </div>
        ) : (
          catTodos.map((todo) => (
            <div 
              key={todo.id} 
              className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
            >
              <button 
                onClick={() => toggleTodo(todo.id)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  todo.is_completed ? "bg-primary border-primary" : "border-gray-300"
                )}>
                  {todo.is_completed && <Check size={12} className="text-white" />}
                </div>
                <span className={cn(
                  "text-sm transition-all",
                  todo.is_completed ? "text-gray-400 line-through" : "text-gray-700 font-medium"
                )}>
                  {todo.content}
                </span>
              </button>
              
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all px-2"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
