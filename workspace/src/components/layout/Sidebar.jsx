import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  FileText,
  Folder,
  FolderOpen,
  Settings,
  Plus,
  Search,
} from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const { currentProject, files } = useProjectStore();

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files ?? [];
    const q = searchQuery.toLowerCase();
    return (files ?? []).filter((f) => f.name.toLowerCase().includes(q));
  }, [files, searchQuery]);

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center w-12 bg-gray-900 border-r border-gray-800 py-3">
        <button
          onClick={() => setIsCollapsed(false)}
          aria-label="Expand sidebar"
          className="text-gray-400 hover:text-gray-100 transition-colors p-1"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <aside className="flex flex-col w-60 shrink-0 bg-gray-900 border-r border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
        <span className="text-sm font-medium text-gray-100 truncate">
          {currentProject?.name ?? 'Files'}
        </span>
        <div className="flex items-center gap-1">
          <button 
            aria-label="New file"
            className="p-1 text-gray-400 hover:text-gray-100 transition-colors rounded"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCollapsed(true)}
            aria-label="Collapse sidebar"
            className="p-1 text-gray-400 hover:text-gray-100 transition-colors rounded"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-gray-800">
        <div className="flex items-center gap-2 bg-gray-800 rounded px-2 py-1">
          <Search className="w-3.5 h-3.5 text-gray-600 shrink-0" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent w-full text-sm text-gray-100 placeholder-gray-600 outline-none"
          />
        </div>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {filteredFiles.length === 0 ? (
          <p className="px-4 py-3 text-xs text-gray-600">No files found.</p>
        ) : (
          filteredFiles.map((file) =>
            file.type === 'folder' ? (
              <button
                key={file.id}
                onClick={() => toggleFolder(file.id)}
                className="flex items-center gap-1.5 w-full px-3 py-1 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors"
              >
                {expandedFolders.has(file.id) ? (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                    <FolderOpen className="w-4 h-4 shrink-0 text-violet-500" />
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <Folder className="w-4 h-4 shrink-0 text-violet-500" />
                  </>
                )}
                <span className="truncate">{file.name}</span>
              </button>
            ) : (
              <button
                key={file.id}
                className="flex items-center gap-1.5 w-full px-3 py-1 pl-7 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors"
              >
                <FileText className="w-4 h-4 shrink-0 text-gray-600" />
                <span className="truncate">{file.name}</span>
              </button>
            )
          )
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 px-3 py-2">
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-100 transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}