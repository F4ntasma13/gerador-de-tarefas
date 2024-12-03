import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Check, Calendar, Clock } from 'lucide-react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  datetime: string;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [newTaskDatetime, setNewTaskDatetime] = useState<string>('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTaskText, setEditTaskText] = useState<string>('');
  const [editTaskDatetime, setEditTaskDatetime] = useState<string>('');

  // Função para formatar data e hora
  const formatDateTime = (datetime: string) => {
    return new Date(datetime).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const addTask = () => {
    if (newTask.trim() && newTaskDatetime) {
      const task: Task = {
        id: Date.now(),
        text: newTask,
        completed: false,
        datetime: newTaskDatetime
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setNewTaskDatetime('');
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTaskText(task.text);
    setEditTaskDatetime(task.datetime);
  };

  const saveEditedTask = () => {
    setTasks(tasks.map(task => 
      task.id === editingTaskId 
        ? { 
            ...task, 
            text: editTaskText, 
            datetime: editTaskDatetime 
          } 
        : task
    ));
    setEditingTaskId(null);
  };

  // Ordena tarefas por data
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Gerenciador de Tarefas</h1>
      
      <div className="space-y-2 mb-4">
        <input 
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Descrição da tarefa"
          className="w-full p-2 border rounded"
        />
        <div className="flex items-center space-x-2">
          <input 
            type="datetime-local"
            value={newTaskDatetime}
            onChange={(e) => setNewTaskDatetime(e.target.value)}
            className="flex-grow p-2 border rounded"
          />
          <button 
            onClick={addTask}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Adicionar
          </button>
        </div>
      </div>

      <ul>
        {sortedTasks.map(task => (
          <li 
            key={task.id} 
            className="flex flex-col p-2 border-b"
          >
            {editingTaskId === task.id ? (
              <div className="space-y-2">
                <input 
                  type="text"
                  value={editTaskText}
                  onChange={(e) => setEditTaskText(e.target.value)}
                  className="w-full p-1 border rounded"
                />
                <div className="flex space-x-2">
                  <input 
                    type="datetime-local"
                    value={editTaskDatetime}
                    onChange={(e) => setEditTaskDatetime(e.target.value)}
                    className="flex-grow p-1 border rounded"
                  />
                  <button 
                    onClick={saveEditedTask}
                    className="text-green-500"
                  >
                    <Check size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div 
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={`flex items-center space-x-2 cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
                >
                  <span>{task.text}</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    {formatDateTime(task.datetime)}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => startEditing(task)}
                    className="text-blue-500"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
