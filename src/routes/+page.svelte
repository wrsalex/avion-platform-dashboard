<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createClient } from '@supabase/supabase-js';
  import { fetchServiceStatus, fetchCosts, fetchAlerts, fetchSkillHubStats, fetchMCPStats, fetchPipelineHealth } from '$lib/api';
  import type { MCPStats, PipelineHealth } from '$lib/api';

  const supabase = createClient('https://jmpiossnslzqpjschgpj.supabase.co', 'sb_publishable_-4g2MopTjvbhzBCyIHdBQg_Ai47uwuv');

  let services: any[] = [];
  let costs: any = { services: [], total: 0, trend: 0 };
  let alerts: any[] = [];
  let skillHub: any = { published: 0, flagged: 0, deprecated: 0, total: 0 };
  let mcp: MCPStats = { connected: 0, tools: 0, prompts: 0, local: 0 };
  let pipeline: PipelineHealth = { published: 0, flagged: 0, deprecated: 0, drifts: 0, total: 0 };
  let crons: any[] = [];
  let loading = true;
  let time = '';
  let live = false;
  let channel: any = null;

  function tick() {
    time = new Date().toLocaleTimeString('en-HK', { hour12: false, timeZone: 'Asia/Hong_Kong' });
  }

  onMount(async () => {
    tick();
    setInterval(tick, 1000);
    const refresh = async () => {
      [services, costs, alerts, skillHub, mcp] = await Promise.all([
        fetchServiceStatus(),
        fetchCosts(),
        fetchAlerts(5),
        fetchSkillHubStats(),
        fetchMCPStats()
      ]);
      const ph = await fetchPipelineHealth();
      pipeline = ph.health;
      crons = ph.crons;
    };
    await refresh();
    loading = false;
    setInterval(refresh, 60000);

    // Subscribe to live alerts via Supabase Realtime
    channel = supabase
      .channel('avion_publisher_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'avion_publisher' }, (payload: any) => {
        live = true;
        alerts = [payload.new, ...alerts].slice(0, 20);
        setTimeout(() => live = false, 3000);
      })
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') live = true;
      });
  });

  onDestroy(() => {
    if (channel) supabase.removeChannel(channel);
  });

  const health = $derived(
    services.length > 0
      ? services.every((s: any) => s.status === 'healthy') ? 'operational'
        : services.some((s: any) => s.status === 'down') ? 'down' : 'degraded'
      : 'connecting'
  );

  const maxCost = $derived(Math.max(...costs.services.map((s: any) => s.current_month), 1));
  const pubPct = $derived(skillHub.total > 0 ? Math.round((skillHub.published / skillHub.total) * 100) : 0);
</script>

<div class="w-full space-y-4 md:space-y-5">
  <!-- Title Bar -->
  <div class="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1">
    <h1 class="text-sm font-bold text-white tracking-wide">Overview</h1>
    <p class="text-[10px] text-[#555560] font-mono">{time} HKT · <span class="{live ? 'text-[#22C55E]' : health === 'operational' ? 'text-[#22C55E]' : health === 'degraded' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}">{live ? 'Live' : health}</span></p>
  </div>

  <!-- Status Strip -->
  <div class="grid grid-cols-1 xs:grid-cols-3 gap-2 md:gap-3">
    {#each services as svc}
      <div class="bg-[#141419] rounded-lg px-3 py-2.5 md:p-3 border border-[#1A1A26]">
        <div class="flex items-center justify-between">
          <span class="text-[10px] md:text-[11px] text-[#8A8A96] uppercase tracking-wider">{svc.name}</span>
          <span class="block w-1.5 h-1.5 md:w-2 md:h-2 rounded-full {svc.status === 'healthy' ? 'bg-[#22C55E]' : svc.status === 'degraded' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'} {svc.status === 'healthy' ? 'animate-pulse' : ''}"></span>
        </div>
        <div class="text-xs md:text-sm font-bold mt-0.5 {svc.status === 'healthy' ? 'text-[#22C55E]' : svc.status === 'degraded' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}">
          {svc.status === 'healthy' ? 'Operational' : svc.status === 'degraded' ? 'Degraded' : 'Down'}
        </div>
      </div>
    {/each}
  </div>

  <!-- Main Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
    <!-- Costs -->
    <div class="bg-[#141419] rounded-lg p-4 md:p-5 border border-[#1A1A26]">
      <div class="flex items-center justify-between mb-4">
        <span class="text-[10px] md:text-[11px] text-[#8A8A96] uppercase tracking-wider">Monthly Costs</span>
        <a href="/costs" class="text-[9px] text-[#555560] hover:text-[#FF9900]">→</a>
      </div>
      <div class="text-2xl md:text-3xl font-bold text-white font-mono">${costs.total.toFixed(0)}</div>
      <div class="text-[10px] md:text-xs {costs.trend < 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'} mb-4">
        {costs.trend < 0 ? '↓' : '↑'} {Math.abs(costs.trend)}% vs last
      </div>
      <div class="space-y-2">
        {#each costs.services as s}
          <div>
            <div class="flex justify-between text-[10px] mb-1">
              <span class="text-[#8A8A96]">{s.service}</span>
              <span class="text-white font-mono">${s.current_month.toFixed(2)}</span>
            </div>
            <div class="h-1 rounded-full bg-[#1A1A26]">
              <div class="h-full rounded-full bg-[#FF9900] transition-all duration-500" style="width: {Math.min((s.current_month / maxCost) * 100, 100)}%"></div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Skill Hub -->
    <div class="bg-[#141419] rounded-lg p-4 md:p-5 border border-[#1A1A26]">
      <div class="flex items-center justify-between mb-4">
        <span class="text-[10px] md:text-[11px] text-[#8A8A96] uppercase tracking-wider">Skill Hub</span>
        <a href="/skills" class="text-[9px] text-[#555560] hover:text-[#FF9900]">→</a>
      </div>
      <div class="text-2xl md:text-3xl font-bold text-white font-mono">{skillHub.total}</div>
      <div class="text-[10px] md:text-xs text-[#555560] mb-4">total skills</div>
      <div class="h-2 rounded-full bg-[#1A1A26] overflow-hidden flex mb-3">
        <div class="h-full bg-[#22C55E]" style="width: {pubPct}%"></div>
      </div>
      <div class="flex justify-between text-[10px] md:text-xs">
        <span class="text-[#22C55E]">{skillHub.published} pub</span>
        <span class="text-[#F59E0B]">{skillHub.flagged} flagged</span>
        <span class="text-[#555560]">{skillHub.deprecated} dep</span>
      </div>
      <div class="mt-3 pt-3 border-t border-[#1A1A26] text-[9px] md:text-[10px]">
        <span class="text-[#555560]">Health: </span>
        <span class="{pubPct >= 80 ? 'text-[#22C55E]' : pubPct >= 50 ? 'text-[#F59E0B]' : 'text-[#EF4444]'} font-medium">{pubPct}% publish rate</span>
      </div>
    </div>

    <!-- Pipeline Health -->
    <div class="bg-[#141419] rounded-lg p-4 md:p-5 border border-[#1A1A26]">
      <span class="text-[10px] md:text-[11px] text-[#8A8A96] uppercase tracking-wider">Pipeline</span>
      <div class="mt-4 space-y-3">
        <div>
          <div class="flex justify-between text-[10px] mb-1">
            <span class="text-[#8A8A96]">Success</span>
            <span class="text-[#22C55E] font-mono">{pipeline.total ? Math.round((pipeline.published / pipeline.total) * 100) : 100}%</span>
          </div>
          <div class="h-1 rounded-full bg-[#1A1A26]">
            <div class="h-full rounded-full bg-[#22C55E]" style="width: {pipeline.total ? Math.round((pipeline.published / pipeline.total) * 100) : 100}%"></div>
          </div>
        </div>
        <div class="text-[10px] text-[#8A8A96] pt-1">Active Crons</div>
        {#each crons.slice(0, 4) as cron}
          <div class="flex items-center justify-between py-1 border-b border-[#1A1A26] last:border-0">
            <div class="min-w-0 flex-1 mr-2">
              <div class="text-[10px] md:text-xs text-white truncate">{cron.name}</div>
              <div class="text-[8px] md:text-[9px] text-[#555560]">{cron.schedule}</div>
            </div>
            <span class="w-1.5 h-1.5 rounded-full shrink-0 {cron.status === 'ok' ? 'bg-[#22C55E]' : cron.status === 'error' ? 'bg-[#EF4444]' : 'bg-[#555560]'}"></span>
          </div>
        {/each}
      </div>
      <div class="mt-3 pt-3 border-t border-[#1A1A26] text-[9px] md:text-[10px] text-[#555560]">
        Review: <span class="text-white">{skillHub.flagged} flagged</span>
      </div>
    </div>
  </div>

  <!-- Integrations -->
  <div class="grid grid-cols-1 xs:grid-cols-2 gap-3 md:gap-4">
    <div class="bg-[#141419] rounded-lg p-4 border border-[#1A1A26]">
      <span class="text-[10px] md:text-[11px] text-[#8A8A96] uppercase tracking-wider">MCP Servers</span>
      <div class="text-2xl font-bold text-white mt-2 font-mono">{mcp.connected}</div>
      <div class="text-[10px] text-[#555560]">connected</div>
      <div class="mt-3 pt-3 border-t border-[#1A1A26] flex justify-between text-[10px]">
        <span class="text-white font-mono">{mcp.tools} tools</span>
        <span class="text-[#555560]">{mcp.prompts} prompts · {mcp.local} local</span>
      </div>
    </div>
    <div class="bg-[#141419] rounded-lg p-4 border border-[#1A1A26]">
      <span class="text-[10px] md:text-[11px] text-[#8A8A96] uppercase tracking-wider">Toolbox</span>
      <div class="mt-3 space-y-2">
        <div class="flex justify-between text-[10px]">
          <span class="text-[#8A8A96]">Prompts</span>
          <span class="text-white font-mono">{mcp.prompts}</span>
        </div>
        <div class="h-1 rounded-full bg-[#1A1A26]"><div class="h-full rounded-full bg-[#FF9900]" style="width: {mcp.tools ? (mcp.prompts / mcp.tools) * 100 : 0}%"></div></div>
        <div class="flex justify-between text-[10px]">
          <span class="text-[#8A8A96]">Local</span>
          <span class="text-white font-mono">{mcp.local}</span>
        </div>
        <div class="h-1 rounded-full bg-[#1A1A26]"><div class="h-full rounded-full bg-[#8A8A96]" style="width: {mcp.tools ? (mcp.local / mcp.tools) * 100 : 0}%"></div></div>
      </div>
    </div>
  </div>

  <!-- Alerts -->
  <div class="bg-[#141419] rounded-lg p-4 border border-[#1A1A26]">
    <div class="flex items-center justify-between mb-3">
      <span class="text-[10px] md:text-[11px] text-[#8A8A96] uppercase tracking-wider">Recent Alerts</span>
      <a href="/alerts" class="text-[9px] text-[#555560] hover:text-[#FF9900]">All →</a>
    </div>
    {#if alerts.length === 0}
      <div class="text-center py-4 text-[10px] text-[#555560]">No recent alerts</div>
    {:else}
      <div class="space-y-1">
        {#each alerts as a}
          <div class="flex items-start gap-2 px-1 py-1">
            <span class="text-[9px] font-bold uppercase w-12 shrink-0 {a.severity === 'critical' ? 'text-[#EF4444]' : a.severity === 'warning' ? 'text-[#F59E0B]' : 'text-[#8A8A96]'}">{a.severity}</span>
            <div class="min-w-0 flex-1">
              <div class="text-[10px] text-white truncate">{a.title || a.content?.slice(0, 80)}</div>
              <div class="text-[8px] text-[#555560]">{new Date(a.created_at).toLocaleDateString('en-HK', { timeZone: 'Asia/Hong_Kong' })}</div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
