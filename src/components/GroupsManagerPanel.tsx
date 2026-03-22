import { useState } from 'react';
import {
  FolderPlus, Pencil, Trash2, Check, X, Folder,
} from 'lucide-react';
import { useStore } from '../store/useStore';

/** Painel de gerenciamento de grupos (ex.: na tela de cards / grupos). */
export function GroupsManagerPanel() {
  const {
    groups, selectedGroupId, selectGroup, addGroup, renameGroup, deleteGroup,
    viewMode, getCardsForReviewCount,
  } = useStore();

  const [newGroupName, setNewGroupName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setNewGroupName('');
      setIsAdding(false);
    }
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      renameGroup(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Excluir este grupo e todos os seus cards?')) {
      deleteGroup(id);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm overflow-hidden">
      <div className="p-3 border-b border-slate-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">Meus Grupos</span>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors"
          title="Novo grupo"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
      </div>

      {isAdding && (
        <div className="p-3 border-b border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Nome do grupo..."
              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddGroup();
                if (e.key === 'Escape') { setIsAdding(false); setNewGroupName(''); }
              }}
            />
            <button type="button" onClick={handleAddGroup} className="p-1.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => { setIsAdding(false); setNewGroupName(''); }} className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-h-64 overflow-y-auto">
        {groups.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            <Folder className="w-8 h-8 mx-auto mb-1.5 opacity-50" />
            <p className="text-xs">Nenhum grupo criado</p>
          </div>
        ) : (
          groups.map((group) => {
            const reviewCount = getCardsForReviewCount(group.id);
            const isSelected = selectedGroupId === group.id && viewMode === 'cards';

            if (editingId === group.id) {
              return (
                <div key={group.id} className="flex gap-2 px-3 py-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') { setEditingId(null); setEditingName(''); }
                    }}
                  />
                  <button type="button" onClick={handleSaveEdit} className="p-1 bg-emerald-500 text-white rounded-lg">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => { setEditingId(null); setEditingName(''); }} className="p-1 bg-slate-200 text-slate-600 rounded-lg">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={group.id}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectGroup(group.id);
                  }
                }}
                className={`group flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors ${
                  isSelected ? 'bg-cyan-50 text-cyan-700' : 'hover:bg-slate-50 text-slate-700'
                }`}
                onClick={() => selectGroup(group.id)}
              >
                <Folder className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-500' : 'text-slate-400'}`} />
                <span className="flex-1 text-sm font-medium truncate">{group.name}</span>
                {reviewCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full shrink-0">
                    {reviewCount}
                  </span>
                )}
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setEditingId(group.id); setEditingName(group.name); }}
                    className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDelete(group.id); }}
                    className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-2 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 text-center">
          {groups.length} grupo{groups.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
