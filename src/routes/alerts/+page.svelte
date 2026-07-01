<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchAlerts } from '$lib/api';

  let alerts: any[] = [];
  let loading = true;
  let filter: string = 'all';

  onMount(async () => {
    alerts = await fetchAlerts(100);
    loading = false;
  });

  $: filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter);
</script>

<div class="space-y-4 sm:space-y-6">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
    <div>
      <h1 class="text-xs sm:text-sm font-bold text-white tracking-tight">Alerts</h1>
      <p class="text-[9px] sm:text-xs text-[#8A8A96]">{filtered.length} entries</p>
    </div>
    <div class="flex gap-1.5 sm:gap-2 overflow-x-auto">
      <button on:click={() => filter = 'all'} class="text-[9px] sm:text-[10px] px-2.5 sm:px-3 py-1 rounded-full shrink-0 {filter === 'all' ? 'bg-[#FF9900] text-black' : 'bg-[#1A1A26] text-[#8A8A96]'}">All</button>
      <button on:click={() => filter = 'critical'} class="text-[9px] sm:text-[10px] px-2.5 sm:px-3 py-1 rounded-full shrink-0 {filter === 'critical' ? 'bg-[#EF4444] text-white' : 'bg-[#1A1A26] text-[#8A8A96]'}">Critical</button>
      <button on:click={() => filter = 'warning'} class="text-[9px] sm:text-[10px] px-2.5 sm:px-3 py-1 rounded-full shrink-0 {filter === 'warning' ? 'bg-[#F59E0B] text-black' : 'bg-[#1A1A26] text-[#8A8A96]'}">Warning</button>
      <button on:click={() => filter = 'info'} class="text-[9px] sm:text-[10px] px-2.5 sm:px-3 py-1 rounded-full shrink-0 {filter === 'info' ? 'bg-[#1A1A26] text-white' : 'bg-[#1A1A26] text-[#8A8A96]'}">Info</button>
    </div>
  </div>

  {#if filtered.length === 0}
    <div class="text-[9px] sm:text-xs text-[#555560] text-center py-8 sm:py-12">No alerts</div>
  {:else}
    <div class="space-y-1.5 sm:space-y-2">
      {#each filtered as a}
        <div class="bg-[#141419] rounded-lg p-2.5 sm:p-3 border border-[#1A1A26]">
          <div class="flex items-start gap-2 sm:gap-3">
            <span class="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 sm:px-2 py-0.5 rounded shrink-0 {a.severity === 'critical' ? 'bg-[#EF4444]/20 text-[#EF4444]' : a.severity === 'warning' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'bg-[#1A1A26] text-[#8A8A96]'}">{a.severity}</span>
            <div class="min-w-0 flex-1">
              <div class="text-[9px] sm:text-xs text-white font-medium">{a.title || 'Untitled'}</div>
              <div class="text-[8px] sm:text-[11px] text-[#8A8A96] mt-0.5 sm:mt-1 line-clamp-2">{a.content}</div>
              <div class="text-[8px] sm:text-[10px] text-[#555560] mt-1">{new Date(a.created_at).toLocaleString('en-HK', { timeZone: 'Asia/Hong_Kong' })}</div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
