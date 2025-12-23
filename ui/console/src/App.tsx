import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Upload,
  Database,
  Sparkles,
  Settings,
  Activity,
  Brain,
  Search,
  Bot,
  BookOpen,
  Shield,
  History,
  Users,
  Sun,
  Moon,
  Wrench,
  GitBranch,
  LogOut,
  User,
  Ticket,
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import ChatPage from './pages/ChatPage';
import DocumentsPage from './pages/DocumentsPage';
import SQLPage from './pages/SQLPage';
import SentimentPage from './pages/SentimentPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import AgentsPage from './pages/AgentsPage';
import PromptsPage from './pages/PromptsPage';
import AuthPage from './pages/AuthPage';
import HistoryPage from './pages/HistoryPage';
import MultiAgentPage from './pages/MultiAgentPage';
import MemoryPage from './pages/MemoryPage';
import ToolsPage from './pages/ToolsPage';
import ValidatorPage from './pages/ValidatorPage';
import SearchPage from './pages/SearchPage';
import WorkflowsPage from './pages/WorkflowsPage';
import EBCTicketsPage from './pages/EBCTicketsPage';
import KYCPage from './pages/KYCPage';
import { ToastProvider } from './components/Toast';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { AuthProvider, useAuth } from './components/AuthContext';
import { healthApi } from './api/client';
import './index.css';

type Page = 'dashboard' | 'chat' | 'documents' | 'sql' | 'sentiment' | 'settings' | 'agents' | 'prompts' | 'auth' | 'history' | 'multi-agent' | 'memory' | 'tools' | 'validator' | 'search' | 'workflows' | 'ebc-tickets' | 'kyc';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isConnected, setIsConnected] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      await healthApi.check();
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    }
  };

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
    { id: 'chat', label: 'RAG Chat', icon: <MessageSquare size={20} /> },
    { id: 'search', label: 'Search', icon: <Search size={20} /> },
    { id: 'history', label: 'History', icon: <History size={20} /> },
    { id: 'memory', label: 'Memory', icon: <Brain size={20} /> },
    { id: 'agents', label: 'AI Agents', icon: <Bot size={20} /> },
    { id: 'tools', label: 'Tools', icon: <Wrench size={20} /> },
    { id: 'multi-agent', label: 'Multi-Agent', icon: <Users size={20} /> },
    { id: 'workflows', label: 'Workflows', icon: <GitBranch size={20} /> },
    { id: 'prompts', label: 'Prompts', icon: <BookOpen size={20} /> },
    { id: 'documents', label: 'Documents', icon: <Upload size={20} /> },
    { id: 'validator', label: 'Validator', icon: <Shield size={20} /> },
    { id: 'sql', label: 'SQL Agent', icon: <Database size={20} /> },
    { id: 'sentiment', label: 'Sentiment', icon: <Sparkles size={20} /> },
    { id: 'ebc-tickets', label: 'EBC Tickets', icon: <Ticket size={20} /> },
    { id: 'kyc', label: 'Customer KYC', icon: <UserCheck size={20} /> },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'chat':
        return <ChatPage />;
      case 'history':
        return <HistoryPage />;
      case 'memory':
        return <MemoryPage />;
      case 'agents':
        return <AgentsPage />;
      case 'multi-agent':
        return <MultiAgentPage />;
      case 'prompts':
        return <PromptsPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'sql':
        return <SQLPage />;
      case 'sentiment':
        return <SentimentPage />;
      case 'settings':
        return <SettingsPage />;
      case 'auth':
        return <AuthPage />;
      case 'tools':
        return <ToolsPage />;
      case 'validator':
        return <ValidatorPage />;
      case 'search':
        return <SearchPage />;
      case 'workflows':
        return <WorkflowsPage />;
      case 'ebc-tickets':
        return <EBCTicketsPage />;
      case 'kyc':
        return <KYCPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <ToastProvider>
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!sidebarCollapsed && (
            <div className="logo-icon">
              <img
                src={theme === 'dark' ? '/white.png' : '/black.png'}
                alt="GoAI"
              />
            </div>
          )}
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <nav className="nav-section">
          {!sidebarCollapsed && <div className="nav-section-title">Main</div>}
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
              title={sidebarCollapsed ? item.label : ''}
            >
              {item.icon}
              {!sidebarCollapsed && <span>{item.label}</span>}
            </div>
          ))}
        </nav>

        <nav className="nav-section">
          {!sidebarCollapsed && <div className="nav-section-title">System</div>}
          <div
            className={`nav-item ${currentPage === 'auth' ? 'active' : ''}`}
            onClick={() => setCurrentPage('auth')}
            title={sidebarCollapsed ? 'Auth' : ''}
          >
            <Shield size={20} />
            {!sidebarCollapsed && <span>Auth</span>}
          </div>
          <div
            className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentPage('settings')}
            title={sidebarCollapsed ? 'Settings' : ''}
          >
            <Settings size={20} />
            {!sidebarCollapsed && <span>Settings</span>}
          </div>
        </nav>

        <div className="sidebar-footer">
          {/* User Info */}
          {isAuthenticated && user ? (
            sidebarCollapsed ? (
              <div
                className="user-avatar-compact"
                onClick={() => setCurrentPage('auth')}
                title={user.username}
              >
                {user.username.slice(0, 2).toUpperCase()}
              </div>
            ) : (
              <div className="user-info-card">
                <div className="user-avatar">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="user-details">
                  <div className="user-name">{user.username}</div>
                  <div className="user-email">{user.email}</div>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="logout-btn"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )
          ) : (
            <button
              onClick={() => setCurrentPage('auth')}
              className="signin-btn"
              title={sidebarCollapsed ? 'Sign In' : ''}
            >
              <User size={16} />
              {!sidebarCollapsed && <span>Sign In</span>}
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={sidebarCollapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {!sidebarCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          <div className="status-indicator">
            <div className={`status-dot ${isConnected ? '' : 'error'}`}
                 style={{ background: isConnected ? '#10b981' : '#ef4444' }} />
            {!sidebarCollapsed && <span>{isConnected ? 'API Connected' : 'Disconnected'}</span>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
    </ToastProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
