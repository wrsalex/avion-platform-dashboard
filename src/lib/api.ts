const SUPABASE_URL = 'https://jmpiossnslzqpjschgpj.supabase.co';
const ANON_KEY = 'sb_publishable_-4g2MopTjvbhzBCyIHdBQg_Ai47uwuv';

export interface SkillHubStats {
  published: number;
  flagged: number;
  deprecated: number;
  total: number;
}

export interface ServiceCost {
  service: string;
  current_month: number;
  previous_month: number;
  trend_pct: number;
}

export interface Alert {
  id: string;
  severity: string;
  title: string;
  content: string;
  created_at: string;
}

export interface SecurityFinding {
  type: string;
  severity: string;
  table_name: string;
  description: string;
}

async function api(path: string): Promise<any> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ─── Service Status ─────────────────────────────────

export async function fetchServiceStatus() {
  // Try to reach Hermes gateway via nginx
  const services = [
    { name: 'Hermes Gateway', url: 'http://100.73.98.124:8643/health', key: 'gateway' },
    { name: 'AvionX DB', url: `${SUPABASE_URL}/rest/v1/avion_skills?limit=1`, key: 'avionx' },
    { name: 'AvionHub DB', url: 'https://llmabfvxemenjvfqkhdy.supabase.co/rest/v1/avion_skills?limit=1', key: 'avionhub' },
  ];

  const results = [];
  for (const svc of services) {
    try {
      const headers: Record<string, string> = {};
      if (svc.key !== 'gateway') {
        headers.apikey = ANON_KEY;
        headers.Authorization = `Bearer ${ANON_KEY}`;
      }
      const res = await fetch(svc.url, { headers, signal: AbortSignal.timeout(5000) });
      results.push({ name: svc.name, status: res.ok ? 'healthy' : 'degraded', latency: 0 });
    } catch {
      results.push({ name: svc.name, status: 'down', latency: 0 });
    }
  }
  return results;
}

// ─── Costs ───────────────────────────────────────────

export async function fetchCosts(): Promise<{ services: ServiceCost[], total: number, trend: number }> {
  const services: ServiceCost[] = [
    { service: 'DeepSeek', current_month: 18.42, previous_month: 19.80, trend_pct: -7 },
    { service: 'ElevenLabs', current_month: 5.00, previous_month: 5.00, trend_pct: 0 },
    { service: 'Hostinger', current_month: 8.99, previous_month: 8.99, trend_pct: 0 },
    { service: 'Decodo', current_month: 0, previous_month: 0, trend_pct: 0 },
  ];
  const total = services.reduce((s, c) => s + c.current_month, 0);
  const prevTotal = services.reduce((s, c) => s + c.previous_month, 0);
  const trend = prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : 0;
  return { services, total, trend };
}

// ─── Alerts ──────────────────────────────────────────

export async function fetchAlerts(limit = 50): Promise<Alert[]> {
  try {
    return await api(`avion_publisher?select=id,severity,title,content,created_at&order=created_at.desc&limit=${limit}`);
  } catch {
    return [];
  }
}

// ─── Skill Hub Stats ─────────────────────────────────

export async function fetchSkillHubStats(): Promise<SkillHubStats> {
  try {
    const data = await api('avion_skills?select=status');
    const stats: SkillHubStats = { published: 0, flagged: 0, deprecated: 0, total: 0 };
    for (const s of data) {
      stats[s.status] = (stats[s.status] || 0) + 1;
      stats.total++;
    }
    return stats;
  } catch {
    // Fallback: try AvionHub directly
    try {
      const res = await fetch('https://llmabfvxemenjvfqkhdy.supabase.co/rest/v1/avion_skills?select=status', {
        headers: { apikey: 'sb_publishable_qF6j7NyBssY3-2CJjOQT-w_Mgb2MIqE' }
      });
      const data = await res.json();
      const stats: SkillHubStats = { published: 0, flagged: 0, deprecated: 0, total: 0 };
      for (const s of data) {
        stats[s.status] = (stats[s.status] || 0) + 1;
        stats.total++;
      }
      return stats;
    } catch {
      return { published: 0, flagged: 0, deprecated: 0, total: 0 };
    }
  }
}

// ─── Security ────────────────────────────────────────

export async function fetchSecurityFindings(): Promise<SecurityFinding[]> {
  // Try Supabase advisor via RPC or direct table query
  try {
    return await api('avion_security_controls?select=type,severity,table_name,description&order=created_at.desc&limit=20');
  } catch {
    return [];
  }
}
