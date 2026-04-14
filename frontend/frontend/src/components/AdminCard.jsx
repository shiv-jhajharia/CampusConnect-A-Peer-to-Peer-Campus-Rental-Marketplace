export default function AdminCard({ title, value, icon }) {
  return (
    <div className="glass-dark p-6 rounded-3xl border border-slate-700/50 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      
      {/* Decorative Blur */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-slate-400 font-bold uppercase tracking-widest text-xs">{title}</h2>
        {icon && <span className="text-2xl opacity-80">{icon}</span>}
      </div>
      
      <p className="text-4xl font-black text-white">{value || 0}</p>
    </div>
  );
}