<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchServiceStatus, fetchCosts, fetchAlerts, fetchSkillHubStats } from '$lib/api';

  let services: any[] = [];
  let costs: any = { services: [], total: 0, trend: 0 };
  let alerts: any[] = [];
  let skillHub: any = { published: 0, flagged: 0, deprecated: 0, total: 0 };
  let loading = true;
  let now = new Date().toLocaleTimeString('en-HK', { hour12: false, timeZone: 'Asia/Hong_Kong' });

  onMount(async () => {
    [services, costs, alerts, skillHub] = await Promise.all([
      fetchServiceStatus(),
      fetchCosts(),
      fetchAlerts(5),
      fetchSkillHubStats()
    ]);
    loading = false;
  });
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="relative">
        <div class="w-10 h-10 rounded-full bg-[#FF9900]/20 ring-breathe flex items-center justify-center">
          <div class="w-4 h-4 rounded-full bg-[#FF9900] glow-pulse"></div>
        </div>
      </div>
      <div>
        <h1 class="text-base font-bold text-white tracking-tight">Platform Operations</h1>
        <p class="text-xs text-[#8A8A96]">{now} HKT</p>
      </div>
    </div>
    <div class="text-xs text-[#8A8A96]">
      {loading ? 'Loading...' : 'Live'}
    </div>
  </div>

  <!-- Service Status Cards -->
  <div class="grid grid-cols-3 gap-4">
    {#each services as svc}
      <div class="bg-[#1A1A20] rounded-lg p-4 border border-[#252530]">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-2 h-2 rounded-full {svc.status === 'healthy' ? 'bg-[#22C55E]' : svc.status === 'degraded' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}"></div>
          <span class="text-[11px] font-medium text-[#8A8A96] uppercase tracking-wider">{svc.name}</span>
        </div>
        <div class="text-xl font-bold text-white">
          {svc.status === 'healthy' ? 'Online' : svc.status === 'degraded' ? 'Slow' : 'Down'}
        </div>
        {#if svc.latency}
          <div class="text-[10px] text-[#555560] mt-1">{svc.latency}ms</div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Cost + Skills Row -->
  <div class="grid grid-cols-2 gap-4">
    <!-- Cost card -->
    <div class="bg-[#1A1A20] rounded-lg p-4 border border-[#252530]">
      <div class="text-[11px] font-medium text-[#8A8A96] uppercase tracking-wider mb-3">Monthly Costs</div>
      <div class="flex items-end gap-2 mb-2">
        <span class="text-2xl font-bold text-white">${costs.total.toFixed(2)}</span>
        <span class="text-xs {costs.trend < 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}">
          {costs.trend > 0 ? '↑' : '↓'} {Math.abs(costs.trend)}%
        </span>
      </div>
      <div class="space-y-1.5">
        {#each costs.services as s}
          <div class="flex justify-between text-xs">
            <span class="text-[#8A8A96]">{s.service}</span>
            <span class="text-white">${s.current_month.toFixed(2)}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Skill Hub card -->
    <div class="bg-[#1A1A20] rounded-lg p-4 border border-[#252530]">
      <div class="text-[11px] font-medium text-[#8A8A96] uppercase tracking-wider mb-3">Skill Hub</div>
      <div class="text-2xl font-bold text-white mb-2">{skillHub.total} skills</div>
      <div class="flex gap-4 text-xs">
        <div class="flex items-center gap-1">
          <div class="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></div>
          <span class="text-white">{skillHub.published}</span>
          <span class="text-[#555560]">published</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
          <span class="text-white">{skillHub.flagged}</span>
          <span class="text-[#555560]">flagged</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></div>
          <span class="text-white">{skillHub.deprecated}</span>
          <span class="text-[#555560]">deprecated</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Recent Alerts -->
  <div class="bg-[#1A1A20] rounded-lg p-4 border border-[#252530]">
    <div class="flex items-center justify-between mb-3">
      <span class="text-[11px] font-medium text-[#8A8A96] uppercase tracking-wider">Recent Alerts</span>
      <a href="/alerts" class="text-[10px] text-[#FF9900] hover:underline">View all →</a>
    </div>
    {#if alerts.length === 0}
      <div class="text-xs text-[#555560]">No recent alerts</div>
    {:else}
      <div class="space-y-2">
        {#each alerts as a}
          <div class="flex items-start gap-2 p-2 rounded bg-[#141419]">
            <span class="text-[10px] font-bold uppercase {a.severity === 'critical' ? 'text-[#EF4444]' : a.severity === 'warning' ? 'text-[#F59E0B]' : 'text-[#8A8A96]'}">{a.severity}</span>
            <div>
              <div class="text-xs text-white">{a.title || a.content?.slice(0, 80)}</div>
              <div class="text-[10px] text-[#555560] mt-0.5">{new Date(a.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
