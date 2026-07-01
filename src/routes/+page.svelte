<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchServiceStatus, fetchCosts, fetchAlerts, fetchSkillHubStats, fetchMCPStats, fetchPipelineHealth } from '$lib/api';
  import type { MCPStats, PipelineHealth } from '$lib/api';

  let services: any[] = [];
  let costs: any = { services: [], total: 0, trend: 0 };
  let alerts: any[] = [];
  let skillHub: any = { published: 0, flagged: 0, deprecated: 0, total: 0 };
  let mcp: MCPStats = { connected: 0, tools: 0, prompts: 0, local: 0 };
  let pipeline: any = { published: 0, flagged: 0, deprecated: 0, drifts: 0 };
  let crons: any[] = [];
  let loading = true;
  let time = '';

  function tick() {
    time = new Date().toLocaleTimeString('en-HK', { hour12: false, timeZone: 'Asia/Hong_Kong' });
  }

  onMount(async () => {
    tick();
    setInterval(tick, 1000);
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
    loading = false;
  });

  const health = $derived(
    services.length > 0
      ? services.every((s: any) => s.status === 'healthy')
        ? 'healthy'
        : services.some((s: any) => s.status === 'down')
          ? 'down'
          : 'degraded'
      : 'loading'
  );

  const maxCost = $derived(Math.max(...costs.services.map((s: any) => s.current_month), 1));
  const publishedPct = $derived(skillHub.total > 0 ? Math.round((skillHub.published / skillHub.total) * 100) : 0);
</script>

<div class="space-y-5">
  <!-- Title bar -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-sm font-bold text-white tracking-wide">Overview</h1>
      <p class="text-[10px] text-[#555560] mt-0.5 font-mono">{time} HKT</p>
    </div>
    <div class="flex items-center gap-2 text-[10px] text-[#555560]">
      <span class="w-1.5 h-1.5 rounded-full {health === 'healthy' ? 'bg-[#22C55E] animate-pulse' : health === 'degraded' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}"></span>
      {loading ? 'Connecting' : health === 'healthy' ? 'All systems operational' : health === 'degraded' ? 'Degraded' : 'Outage'}
    </div>
  </div>

  <!-- Status strip -->
  <div class="grid grid-cols-3 gap-3">
    {#each services as svc}
      <button class="bg-[#141419] rounded-lg p-3 border border-[#1A1A26] hover:border-[#252530] transition-all text-left group">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[10px] font-medium text-[#8A8A96] uppercase tracking-wider">{svc.name}</span>
          <span class="w-1.5 h-1.5 rounded-full {svc.status === 'healthy' ? 'bg-[#22C55E]' : svc.status === 'degraded' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'} {svc.status === 'healthy' ? 'animate-pulse' : ''}"></span>
        </div>
        <div class="text-xs font-bold {svc.status === 'healthy' ? 'text-[#22C55E]' : svc.status === 'degraded' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}">
          {svc.status === 'healthy' ? 'Operational' : svc.status === 'degraded' ? 'Degraded' : 'Down'}
        </div>
      </button>
    {/each}
  </div>

  <!-- Main grid: Costs + Skill Hub + Pipeline -->
  <div class="grid grid-cols-3 gap-3">
    <!-- Costs Card -->
    <div class="bg-[#141419] rounded-lg p-4 border border-[#1A1A26] col-span-1">
      <div class="flex items-center justify-between mb-4">
        <span class="text-[10px] font-medium text-[#8A8A96] uppercase tracking-wider">Monthly Costs</span>
        <a href="/costs" class="text-[9px] text-[#555560] hover:text-[#FF9900] transition-colors">Details →</a>
      </div>
      
      <div class="text-3xl font-bold text-white mb-1 font-mono">${costs.total.toFixed(0)}</div>
      <div class="text-[10px] {costs.trend < 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'} mb-4">
        {costs.trend < 0 ? '↓' : '↑'} {Math.abs(costs.trend)}% vs last month
      </div>

      <div class="space-y-2">
        {#each costs.services as s}
          <div class="group">
            <div class="flex justify-between text-[10px] mb-1">
              <span class="text-[#8A8A96]">{s.service}</span>
              <span class="text-white font-mono">${s.current_month.toFixed(2)}</span>
            </div>
            <div class="h-1 rounded-full bg-[#1A1A26] overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-500 bg-[#FF9900]"
                style="width: {Math.min((s.current_month / maxCost) * 100, 100)}%"
              ></div>
            </div>
          </div>
        {/each}
      </div>
      <div class="mt-3 pt-3 border-t border-[#1A1A26] flex justify-between text-[9px] text-[#555560]">
        <span>Total</span>
        <span class="text-white font-mono">${costs.total.toFixed(2)}</span>
      </div>
    </div>

    <!-- Skill Hub Card -->
    <div class="bg-[#141419] rounded-lg p-4 border border-[#1A1A26]">
      <div class="flex items-center justify-between mb-4">
        <span class="text-[10px] font-medium text-[#8A8A96] uppercase tracking-wider">Skill Hub</span>
        <a href="/skills" class="text-[9px] text-[#555560] hover:text-[#FF9900] transition-colors">Details →</a>
      </div>

      <div class="text-3xl font-bold text-white mb-1 font-mono">{skillHub.total}</div>
      <div class="text-[10px] text-[#555560] mb-4">total skills</div>

      <!-- Publish ratio bar -->
      <div class="h-2 rounded-full bg-[#1A1A26] overflow-hidden mb-3 flex">
        {#if publishedPct > 0}
          <div class="h-full bg-[#22C55E]" style="width: {publishedPct}%"></div>
        {/if}
        {#if skillHub.flagged > 0}
          <div class="h-full bg-[#F59E0B]" style="width: {skillHub.total > 0 ? (skillHub.flagged / skillHub.total) * 100 : 0}%"></div>
        {/if}
        {#if skillHub.deprecated > 0}
          <div class="h-full bg-[#1A1A26]" style="width: {skillHub.total > 0 ? (skillHub.deprecated / skillHub.total) * 100 : 0}%"></div>
        {/if}
      </div>

      <div class="grid grid-cols-3 gap-2">
        <div class="text-center">
          <div class="text-sm font-bold text-[#22C55E] font-mono">{skillHub.published}</div>
          <div class="text-[9px] text-[#555560]">Published</div>
        </div>
        <div class="text-center">
          <div class="text-sm font-bold text-[#F59E0B] font-mono">{skillHub.flagged}</div>
          <div class="text-[9px] text-[#555560]">Flagged</div>
        </div>
        <div class="text-center">
          <div class="text-sm font-bold text-[#555560] font-mono">{skillHub.deprecated}</div>
          <div class="text-[9px] text-[#555560]">Deprecated</div>
        </div>
      </div>

      <div class="mt-3 pt-3 border-t border-[#1A1A26]">
        <div class="flex items-center gap-1.5 text-[9px]">
          <span class="text-[#555560]">Health:</span>
          <span class="{publishedPct >= 80 ? 'text-[#22C55E]' : publishedPct >= 50 ? 'text-[#F59E0B]' : 'text-[#EF4444]'} font-medium">{publishedPct}% publish rate</span>
        </div>
      </div>
    </div>

    <!-- Pipeline Health Card -->
    <div class="bg-[#141419] rounded-lg p-4 border border-[#1A1A26]">
      <span class="text-[10px] font-medium text-[#8A8A96] uppercase tracking-wider">Pipeline Health</span>
      
      <div class="mt-4 space-y-3">
        <!-- Pipeline success rate -->
        <div>
          <div class="flex justify-between text-[10px] mb-1">
            <span class="text-[#8A8A96]">Success Rate</span>
            <span class="text-[#22C55E] font-mono">{pipeline.total ? Math.round((pipeline.published / pipeline.total) * 100) : 100}%</span>
          </div>
          <div class="h-1 rounded-full bg-[#1A1A26] overflow-hidden">
            <div class="h-full rounded-full bg-[#22C55E]" style="width: {pipeline.total ? Math.round((pipeline.published / pipeline.total) * 100) : 100}%"></div>
          </div>
        </div>

        <!-- Active Crons -->
        <div class="text-[10px] text-[#8A8A96] mb-2">Active Crons</div>
        {#each crons as cron}
          <div class="flex items-center justify-between py-1.5 border-b border-[#1A1A26] last:border-0">
            <div>
              <div class="text-[10px] text-white">{cron.name}</div>
              <div class="text-[9px] text-[#555560]">{cron.schedule}</div>
            </div>
            <span class="w-1.5 h-1.5 rounded-full {cron.status === 'ok' ? 'bg-[#22C55E]' : cron.status === 'error' ? 'bg-[#EF4444]' : 'bg-[#555560]'}"></span>
          </div>
        {/each}
      </div>

      <div class="mt-3 pt-3 border-t border-[#1A1A26] flex items-center justify-between text-[9px]">
        <span class="text-[#555560]">Review Queue</span>
        <span class="text-white font-mono">{skillHub.flagged} flagged</span>
      </div>
    </div>
  </div>

  <!-- Integrations: MCP + Toolbox -->
  <div class="grid grid-cols-2 gap-3">
    <!-- MCP Servers -->
    <div class="bg-[#141419] rounded-lg p-4 border border-[#1A1A26]">
      <span class="text-[10px] font-medium text-[#8A8A96] uppercase tracking-wider">MCP Servers</span>
      <div class="text-3xl font-bold text-white mb-1 mt-3 font-mono">{mcp.connected}</div>
      <div class="text-[10px] text-[#555560]">connected</div>
      <div class="mt-3 pt-3 border-t border-[#1A1A26] grid grid-cols-2 gap-3">
        <div>
          <div class="text-xs font-bold text-white font-mono">{mcp.tools}</div>
          <div class="text-[9px] text-[#555560]">Total tools</div>
        </div>
        <div>
          <div class="text-xs font-bold text-white font-mono">{mcp.prompts}</div>
          <div class="text-[9px] text-[#555560]">Prompts</div>
        </div>
      </div>
    </div>

    <!-- Toolbox -->
    <div class="bg-[#141419] rounded-lg p-4 border border-[#1A1A26]">
      <span class="text-[10px] font-medium text-[#8A8A96] uppercase tracking-wider">Toolbox</span>
      <div class="mt-3 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[10px] text-[#8A8A96]">Prompt tools</span>
          <span class="text-xs text-white font-mono">{mcp.prompts}</span>
        </div>
        <div class="h-1 rounded-full bg-[#1A1A26] overflow-hidden">
          <div class="h-full rounded-full bg-[#FF9900]" style="width: {mcp.tools > 0 ? (mcp.prompts / mcp.tools) * 100 : 0}%"></div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[10px] text-[#8A8A96]">Local actions</span>
          <span class="text-xs text-white font-mono">{mcp.local}</span>
        </div>
        <div class="h-1 rounded-full bg-[#1A1A26] overflow-hidden">
          <div class="h-full rounded-full bg-[#8A8A96]" style="width: {mcp.tools > 0 ? (mcp.local / mcp.tools) * 100 : 0}%"></div>
        </div>
      </div>
      <div class="mt-3 pt-3 border-t border-[#1A1A26] text-[9px] text-[#555560]">
        <span class="text-white font-mono">{mcp.tools}</span> tools across {mcp.connected} MCP servers
      </div>
    </div>
  </div>

  <!-- Alerts -->
  <div class="bg-[#141419] rounded-lg p-4 border border-[#1A1A26]">
    <div class="flex items-center justify-between mb-3">
      <span class="text-[10px] font-medium text-[#8A8A96] uppercase tracking-wider">Recent Alerts</span>
      <a href="/alerts" class="text-[9px] text-[#555560] hover:text-[#FF9900] transition-colors">All alerts →</a>
    </div>
    {#if alerts.length === 0}
      <div class="text-center py-6 text-[10px] text-[#555560]">
        <div class="text-2xl mb-2 opacity-30">◎</div>
        No recent alerts
      </div>
    {:else}
      <div class="space-y-1">
        {#each alerts as a}
          <div class="flex items-start gap-3 px-2 py-1.5 rounded hover:bg-[#1A1A20] transition-colors group">
            <span class="text-[10px] font-bold uppercase w-14 shrink-0 {a.severity === 'critical' ? 'text-[#EF4444]' : a.severity === 'warning' ? 'text-[#F59E0B]' : 'text-[#8A8A96]'}">{a.severity}</span>
            <div class="min-w-0 flex-1">
              <div class="text-[10px] text-white truncate">{a.title || a.content?.slice(0, 80)}</div>
              <div class="text-[9px] text-[#555560] mt-0.5">{new Date(a.created_at).toLocaleDateString('en-HK', { timeZone: 'Asia/Hong_Kong' })}</div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
