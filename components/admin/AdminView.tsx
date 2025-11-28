
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { HealthTipDetail } from '../HealthTipDetail';
import { LayoutDashboard, FileText, Users, ArrowLeft, Plus, Edit2, Trash2, Image as ImageIcon, Save, Eye } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { HealthTip } from '../../types';
import { supabase } from '../../lib/supabase';

interface AdminViewProps {
   onExit: () => void;
}

type AdminTab = 'DASHBOARD' | 'CMS' | 'USERS';

export const AdminView: React.FC<AdminViewProps> = ({ onExit }) => {
   const { cats, logs, healthTips, addHealthTip, updateHealthTip, deleteHealthTip } = useStore();
   const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');

   // CMS State
   const [isEditing, setIsEditing] = useState(false);
   const [showPreview, setShowPreview] = useState(false);
   const [editTipId, setEditTipId] = useState<string | null>(null);
   const [formData, setFormData] = useState<{
      title: string;
      category: HealthTip['category'];
      content: string;
      thumbnail_url: string;
      video_url: string;
   }>({
      title: '',
      category: 'HEALTH',
      content: '',
      thumbnail_url: '',
      video_url: ''
   });

   const fileInputRef = useRef<HTMLInputElement>(null);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         if (file.size > 1024 * 1024 * 5) { // 5MB limit
            alert("이미지 크기는 5MB 이하여야 합니다.");
            return;
         }
         const reader = new FileReader();
         reader.onloadend = () => {
            setFormData({ ...formData, thumbnail_url: reader.result as string });
         };
         reader.readAsDataURL(file);
      }
   };


   // Users State
   const [users, setUsers] = useState<any[]>([]);
   const [isLoadingUsers, setIsLoadingUsers] = useState(false);

   useEffect(() => {
      if (activeTab === 'USERS') {
         fetchUsers();
      }
   }, [activeTab]);

   const fetchUsers = async () => {
      setIsLoadingUsers(true);
      const { data, error } = await supabase
         .from('profiles')
         .select('*')
         .order('created_at', { ascending: false });

      if (data) setUsers(data);
      if (error) console.error('Error fetching users:', error);
      setIsLoadingUsers(false);
   };

   const toggleAdmin = async (userId: string, currentStatus: boolean) => {
      if (!confirm('관리자 권한을 변경하시겠습니까?')) return;

      const { error } = await supabase
         .from('profiles')
         .update({ is_admin: !currentStatus })
         .eq('id', userId);

      if (!error) {
         fetchUsers();
      } else {
         alert('권한 변경 실패: ' + error.message);
      }
   };

   const handleEdit = (tip: HealthTip) => {
      setEditTipId(tip.id);
      setFormData({
         title: tip.title,
         category: tip.category,
         content: tip.content,
         thumbnail_url: tip.thumbnail_url || '',
         video_url: tip.video_url || ''
      });
      setIsEditing(true);
   };

   const handleCreate = () => {
      setEditTipId(null);
      setFormData({
         title: '',
         category: 'HEALTH',
         content: '',
         thumbnail_url: '',
         video_url: ''
      });
      setIsEditing(true);
   };

   const handleSave = () => {
      if (editTipId) {
         updateHealthTip(editTipId, {
            ...formData,
            is_published: true
         });
      } else {
         addHealthTip({
            ...formData,
            is_published: true
         });
      }
      setIsEditing(false);
   };

   // Dashboard State
   const [dashboardStats, setDashboardStats] = useState({
      totalUsers: 0,
      totalCats: 0,
      totalLogs: 0,
      recentActivity: [] as any[]
   });
   const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

   useEffect(() => {
      if (activeTab === 'DASHBOARD') {
         fetchDashboardStats();
      }
   }, [activeTab]);

   const fetchDashboardStats = async () => {
      setIsLoadingDashboard(true);
      try {
         // 1. Get Counts
         const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
         const { count: catCount } = await supabase.from('cats').select('*', { count: 'exact', head: true });
         const { count: logCount } = await supabase.from('health_logs').select('*', { count: 'exact', head: true });

         // 2. Get Recent Activity (New Users)
         const { data: recentUsers } = await supabase
            .from('profiles')
            .select('email, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

         setDashboardStats({
            totalUsers: userCount || 0,
            totalCats: catCount || 0,
            totalLogs: logCount || 0,
            recentActivity: recentUsers || []
         });
      } catch (error) {
         console.error("Failed to fetch dashboard stats:", error);
      } finally {
         setIsLoadingDashboard(false);
      }
   };

   // ... (existing handlers)

   const renderDashboard = () => (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-gray-900">Dashboard</h2>
            <Button
               onClick={fetchDashboardStats}
               isLoading={isLoadingDashboard}
               size="sm"
               variant="secondary"
               className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
               Refresh
            </Button>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white border border-gray-100 p-4">
               <p className="text-sm text-gray-500 mb-1">Total Users</p>
               <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsers}</p>
            </Card>
            <Card className="bg-white border border-gray-100 p-4">
               <p className="text-sm text-gray-500 mb-1">Total Cats</p>
               <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalCats}</p>
            </Card>
            <Card className="bg-white border border-gray-100 p-4">
               <p className="text-sm text-gray-500 mb-1">Health Logs</p>
               <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalLogs}</p>
            </Card>
            <Card className="bg-white border border-gray-100 p-4">
               <p className="text-sm text-gray-500 mb-1">Tips Content</p>
               <p className="text-2xl font-bold text-gray-900">{healthTips.length}</p>
            </Card>
         </div>

         {/* Recent Activity */}
         <Card>
            <h3 className="font-bold text-gray-800 mb-4">Recent Activity (New Users)</h3>
            <div className="space-y-4">
               {dashboardStats.recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                     <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold">U</div>
                     <div>
                        <p className="font-medium text-gray-900">New user joined: {activity.email}</p>
                        <p className="text-xs text-gray-400">{formatDate(activity.created_at)}</p>
                     </div>
                  </div>
               ))}
               {dashboardStats.recentActivity.length === 0 && (
                  <p className="text-gray-400 text-sm">No recent activity.</p>
               )}
            </div>
         </Card>
      </div>
   );

   const renderCMS = () => (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-gray-900">Content Manager</h2>
            <Button onClick={handleCreate} size="sm">
               <Plus size={16} className="mr-1" /> New Post
            </Button>
         </div>

         {isEditing ? (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-300">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">{editTipId ? 'Edit Post' : 'Create New Post'}</h3>
                  <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">Cancel</button>
               </div>

               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                     <input
                        type="text"
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                        <select
                           className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                           value={formData.category}
                           onChange={e => setFormData({ ...formData, category: e.target.value as HealthTip['category'] })}
                        >
                           <option value="HEALTH">Health</option>
                           <option value="BEHAVIOR">Behavior</option>
                           <option value="FOOD">Food</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Thumbnail Image</label>
                        <div className="flex flex-col gap-2">
                           <div className="relative">
                              <input
                                 type="text"
                                 className="w-full p-3 pl-9 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                 value={formData.thumbnail_url}
                                 onChange={e => setFormData({ ...formData, thumbnail_url: e.target.value })}
                                 placeholder="Image URL or Upload"
                              />
                              <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                           </div>
                           <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileChange}
                           />
                           <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                           >
                              <ImageIcon size={14} className="mr-2" />
                              Upload Image File
                           </Button>
                        </div>
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Video URL (YouTube Embed)</label>
                     <input
                        type="text"
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={formData.video_url}
                        onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                        placeholder="https://www.youtube.com/embed/..."
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Content (Markdown)</label>
                     <textarea
                        rows={10}
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                        placeholder="# Write your content here..."
                     />
                     <div className="mt-2 p-4 bg-gray-100 rounded-xl text-xs text-gray-600">
                        <p className="font-bold mb-2 text-gray-800">📝 Markdown 작성 가이드</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono">
                           <div># 큰 제목</div>
                           <div className="text-gray-400">→ h1</div>
                           <div>### 작은 제목</div>
                           <div className="text-gray-400">→ h3</div>
                           <div>**굵게**</div>
                           <div className="text-gray-400">→ Bold</div>
                           <div>- 리스트</div>
                           <div className="text-gray-400">→ Bullet</div>
                           <div>1. 순서</div>
                           <div className="text-gray-400">→ Number</div>
                           <div>줄바꿈</div>
                           <div className="text-gray-400">→ 엔터 2번</div>
                        </div>
                     </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                     <Button onClick={() => setShowPreview(true)} variant="secondary" className="flex-1 h-12 bg-gray-100 text-gray-700 hover:bg-gray-200">
                        <Eye size={18} className="mr-2" />
                        Preview
                     </Button>
                     <Button onClick={handleSave} className="flex-[2] h-12">
                        <Save size={18} className="mr-2" />
                        {editTipId ? 'Update Post' : 'Publish Post'}
                     </Button>
                  </div>
               </div>
            </Card>
         ) : (
            <div className="grid gap-4">
               {healthTips.map(tip => (
                  <div key={tip.id} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-shadow">
                     <img src={tip.thumbnail_url || 'https://via.placeholder.com/150'} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{tip.category}</span>
                           <span className="text-xs text-gray-400">{formatDate(tip.created_at)}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 truncate">{tip.title}</h4>
                     </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(tip)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                           <Edit2 size={18} />
                        </button>
                        <button onClick={() => deleteHealthTip(tip.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                           <Trash2 size={18} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )
         }
      </div >
   );

   const renderUsers = () => (
      <div className="space-y-6">
         <h2 className="text-2xl font-black text-gray-900">User Management</h2>
         <Card className="overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-bold">
                     <tr>
                        <th className="p-4">Email</th>
                        <th className="p-4">Tier</th>
                        <th className="p-4">Joined</th>
                        <th className="p-4">Admin</th>
                        <th className="p-4">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                           <td className="p-4 font-medium text-gray-900">{user.email}</td>
                           <td className="p-4">
                              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                                 {user.subscription_tier}
                              </span>
                           </td>
                           <td className="p-4 text-gray-500">{formatDate(user.created_at)}</td>
                           <td className="p-4">
                              {user.is_admin ? (
                                 <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-bold">Admin</span>
                              ) : (
                                 <span className="text-gray-400">-</span>
                              )}
                           </td>
                           <td className="p-4">
                              <button
                                 onClick={() => toggleAdmin(user.id, user.is_admin)}
                                 className="text-xs font-bold text-gray-500 hover:text-primary underline"
                              >
                                 {user.is_admin ? 'Revoke' : 'Grant Admin'}
                              </button>
                           </td>
                        </tr>
                     ))}
                     {users.length === 0 && !isLoadingUsers && (
                        <tr>
                           <td colSpan={5} className="p-8 text-center text-gray-400">No users found.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </Card>
      </div>
   );

   return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
         {/* Admin Header */}
         <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">A</div>
               <h1 className="font-bold text-lg">Admin Portal</h1>
            </div>
            <button onClick={onExit} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
               <ArrowLeft size={16} /> Exit
            </button>
         </header>

         <div className="flex flex-1">
            {/* Sidebar */}
            <aside className="w-20 md:w-64 bg-white border-r border-gray-200 hidden md:block">
               <nav className="p-4 space-y-2">
                  <button
                     onClick={() => setActiveTab('DASHBOARD')}
                     className={cn("w-full flex items-center gap-3 p-3 rounded-xl transition-colors", activeTab === 'DASHBOARD' ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100")}
                  >
                     <LayoutDashboard size={20} />
                     <span className="font-medium">Dashboard</span>
                  </button>
                  <button
                     onClick={() => setActiveTab('CMS')}
                     className={cn("w-full flex items-center gap-3 p-3 rounded-xl transition-colors", activeTab === 'CMS' ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100")}
                  >
                     <FileText size={20} />
                     <span className="font-medium">Content</span>
                  </button>
                  <button
                     onClick={() => setActiveTab('USERS')}
                     className={cn("w-full flex items-center gap-3 p-3 rounded-xl transition-colors", activeTab === 'USERS' ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100")}
                  >
                     <Users size={20} />
                     <span className="font-medium">Users</span>
                  </button>
               </nav>
            </aside>

            {/* Mobile Bottom Nav (Simulated as Tab Bar for simplicity in this MVP) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-40">
               <button onClick={() => setActiveTab('DASHBOARD')} className={cn("p-2 rounded-lg", activeTab === 'DASHBOARD' ? "text-primary" : "text-gray-400")}>
                  <LayoutDashboard size={24} />
               </button>
               <button onClick={() => setActiveTab('CMS')} className={cn("p-2 rounded-lg", activeTab === 'CMS' ? "text-primary" : "text-gray-400")}>
                  <FileText size={24} />
               </button>
               <button onClick={() => setActiveTab('USERS')} className={cn("p-2 rounded-lg", activeTab === 'USERS' ? "text-primary" : "text-gray-400")}>
                  <Users size={24} />
               </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto pb-24 md:pb-6">
               {activeTab === 'DASHBOARD' && renderDashboard()}
               {activeTab === 'CMS' && renderCMS()}
               {activeTab === 'USERS' && renderUsers()}
            </main>
         </div>

         {showPreview && (
            <HealthTipDetail
               tip={{
                  id: 'preview-temp-id',
                  created_at: new Date().toISOString(),
                  is_published: false,
                  ...formData
               }}
               onClose={() => setShowPreview(false)}
            />
         )}
      </div>
   );
};
