/**
 * 海报主题系统 - Carbon/Poet.so 风格
 * 每个主题包含：背景渐变 + 内容卡片样式
 */

export interface PosterTheme {
  id: string;
  name: string;
  // 外层背景（渐变）
  background: string;
  // 内容卡片样式
  card: {
    bg: string;
    border: string;
    shadow: string;
  };
  // 窗口按钮颜色
  windowButtons: {
    close: string;
    minimize: string;
    maximize: string;
  };
  // 排版颜色
  colors: {
    title: string;
    subtitle: string;
    text: string;
    muted: string;
    accent: string;
    link: string;
  };
}

export const posterThemes: PosterTheme[] = [
  {
    id: 'midnight',
    name: '午夜蓝',
    background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    card: {
      bg: 'bg-slate-800/90 backdrop-blur-sm',
      border: 'border border-slate-700/50',
      shadow: 'shadow-2xl shadow-purple-500/10',
    },
    windowButtons: {
      close: 'bg-red-500',
      minimize: 'bg-yellow-500',
      maximize: 'bg-green-500',
    },
    colors: {
      title: 'text-white',
      subtitle: 'text-purple-300',
      text: 'text-slate-300',
      muted: 'text-slate-500',
      accent: 'text-purple-400',
      link: 'text-blue-400',
    },
  },
  {
    id: 'ocean',
    name: '深海蓝',
    background: 'bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900',
    card: {
      bg: 'bg-slate-900/80 backdrop-blur-sm',
      border: 'border border-cyan-500/20',
      shadow: 'shadow-2xl shadow-cyan-500/10',
    },
    windowButtons: {
      close: 'bg-red-500',
      minimize: 'bg-yellow-500',
      maximize: 'bg-green-500',
    },
    colors: {
      title: 'text-white',
      subtitle: 'text-cyan-300',
      text: 'text-slate-300',
      muted: 'text-slate-500',
      accent: 'text-cyan-400',
      link: 'text-cyan-400',
    },
  },
  {
    id: 'sunset',
    name: '日落橙',
    background: 'bg-gradient-to-br from-orange-500 via-rose-500 to-purple-600',
    card: {
      bg: 'bg-white/95 backdrop-blur-sm',
      border: 'border border-white/50',
      shadow: 'shadow-2xl shadow-rose-500/20',
    },
    windowButtons: {
      close: 'bg-rose-500',
      minimize: 'bg-orange-400',
      maximize: 'bg-amber-400',
    },
    colors: {
      title: 'text-slate-900',
      subtitle: 'text-rose-600',
      text: 'text-slate-700',
      muted: 'text-slate-400',
      accent: 'text-rose-500',
      link: 'text-rose-600',
    },
  },
  {
    id: 'forest',
    name: '森林绿',
    background: 'bg-gradient-to-br from-emerald-800 via-green-900 to-teal-900',
    card: {
      bg: 'bg-slate-900/80 backdrop-blur-sm',
      border: 'border border-emerald-500/20',
      shadow: 'shadow-2xl shadow-emerald-500/10',
    },
    windowButtons: {
      close: 'bg-red-500',
      minimize: 'bg-yellow-500',
      maximize: 'bg-green-500',
    },
    colors: {
      title: 'text-white',
      subtitle: 'text-emerald-300',
      text: 'text-slate-300',
      muted: 'text-slate-500',
      accent: 'text-emerald-400',
      link: 'text-emerald-400',
    },
  },
  {
    id: 'candy',
    name: '糖果粉',
    background: 'bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400',
    card: {
      bg: 'bg-white/95 backdrop-blur-sm',
      border: 'border border-white/50',
      shadow: 'shadow-2xl shadow-purple-500/20',
    },
    windowButtons: {
      close: 'bg-pink-500',
      minimize: 'bg-purple-400',
      maximize: 'bg-indigo-400',
    },
    colors: {
      title: 'text-slate-900',
      subtitle: 'text-purple-600',
      text: 'text-slate-700',
      muted: 'text-slate-400',
      accent: 'text-pink-500',
      link: 'text-purple-600',
    },
  },
  {
    id: 'mono',
    name: '极简黑',
    background: 'bg-gradient-to-br from-neutral-800 via-neutral-900 to-black',
    card: {
      bg: 'bg-neutral-900/90 backdrop-blur-sm',
      border: 'border border-neutral-700/50',
      shadow: 'shadow-2xl shadow-black/30',
    },
    windowButtons: {
      close: 'bg-neutral-600',
      minimize: 'bg-neutral-600',
      maximize: 'bg-neutral-600',
    },
    colors: {
      title: 'text-white',
      subtitle: 'text-neutral-400',
      text: 'text-neutral-300',
      muted: 'text-neutral-600',
      accent: 'text-white',
      link: 'text-neutral-300',
    },
  },
  {
    id: 'light',
    name: '简约白',
    background: 'bg-gradient-to-br from-slate-100 via-white to-slate-100',
    card: {
      bg: 'bg-white',
      border: 'border border-slate-200',
      shadow: 'shadow-xl shadow-slate-200/50',
    },
    windowButtons: {
      close: 'bg-red-500',
      minimize: 'bg-yellow-500',
      maximize: 'bg-green-500',
    },
    colors: {
      title: 'text-slate-900',
      subtitle: 'text-blue-600',
      text: 'text-slate-600',
      muted: 'text-slate-400',
      accent: 'text-blue-500',
      link: 'text-blue-600',
    },
  },
  {
    id: 'neon',
    name: '霓虹夜',
    background: 'bg-gradient-to-br from-violet-950 via-fuchsia-950 to-slate-950',
    card: {
      bg: 'bg-black/60 backdrop-blur-md',
      border: 'border border-fuchsia-500/30',
      shadow: 'shadow-2xl shadow-fuchsia-500/20',
    },
    windowButtons: {
      close: 'bg-fuchsia-500',
      minimize: 'bg-cyan-400',
      maximize: 'bg-lime-400',
    },
    colors: {
      title: 'text-white',
      subtitle: 'text-fuchsia-400',
      text: 'text-slate-300',
      muted: 'text-slate-500',
      accent: 'text-cyan-400',
      link: 'text-fuchsia-400',
    },
  },
];

export function getThemeById(id: string): PosterTheme {
  return posterThemes.find(t => t.id === id) || posterThemes[0];
}
