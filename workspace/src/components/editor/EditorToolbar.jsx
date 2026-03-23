import { Play, Code2, Settings, Share2, GitFork, Save, MoreVertical, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useEditorStore from '../../store/editorStore';

export default function EditorToolbar() {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentFile = useEditorStore(state => state.currentFile);
  const isDirty = useEditorStore(state => state.isDirty);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2500);
  };

  const handleSave = async () => {
    if (!isDirty) return;
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleFormat = () => {
    // Format code via Monaco editor command
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleShare = () => {
    // Open share dialog
  };

  const handleFork = () => {
    navigate('/fork');
  };

  return (
    <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 gap-4 sticky top-0 z-40">
      {/* Left: File/Project Info */}
      <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
        <div className={`w-2 h-2 rounded-full transition-colors ${isRunning ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
        <span className="text-sm font-medium text-gray-100 truncate hidden sm:inline">
          {currentFile?.name || 'Untitled'}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: Toolbar Buttons */}
      <div className="flex items-center gap-1">
        {/* Run Button - Primary Action */}
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          title="Run project (Ctrl+Enter)"
        >
          {isRunning ? (
            <>
              <Zap size={16} className="animate-spin" />
              <span className="hidden sm:inline">Building...</span>
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              <span className="hidden sm:inline">Run</span>
            </>
          )}
        </button>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          aria-label="Save file (Ctrl+S)"
          className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Save file (Ctrl+S)"
        >
          <Save size={18} />
        </button>

        {/* Format Button */}
        <button
          onClick={handleFormat}
          aria-label="Format code (Shift+Alt+F)"
          className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-gray-100 transition-colors"
          title="Format code (Shift+Alt+F)"
        >
          <Code2 size={18} />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-800 mx-1" />

        {/* Settings Button */}
        <button
          onClick={handleSettings}
          aria-label="Settings"
          className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-gray-100 transition-colors"
          title="Settings"
        >
          <Settings size={18} />
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          aria-label="Share project"
          className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-gray-100 transition-colors"
          title="Share project"
        >
          <Share2 size={18} />
        </button>

        {/* Fork Button */}
        <button
          onClick={handleFork}
          aria-label="Fork project"
          className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-gray-100 transition-colors"
          title="Fork project"
        >
          <GitFork size={18} />
        </button>

        {/* More Button */}
        <button
          aria-label="More options"
          className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-gray-100 transition-colors"
          title="More options"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}