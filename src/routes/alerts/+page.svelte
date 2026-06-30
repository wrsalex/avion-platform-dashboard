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

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-base font-bold text-white tracking-tight">Alerts</h1>
      <p class="text-xs text-[#8A8A96]">{filtered.length} entries</p>
    </div>
    <div class="flex gap-2">
      <button on:click={() => filter = 'all'} class="text-[10px] px-3 py-1 rounded-full {filter === 'all' ? 'bg-[#FF9900] text-black' : 'bg-[#252530] text-[#8A8A96]'}">All</button>
      <button on:click={() => filter = 'critical'} class="text-[10px] px-3 py-1 rounded-full {filter === 'critical' ? 'bg-[#EF4444] text-white' : 'bg-[#252530] text-[#8A8A96]'}">Critical</button>
      <button on:click={() => filter = 'warning'} class="text-[10px] px-3 py-1 rounded-full {filter === 'warning' ? 'bg-[#F59E0B] text-black' : 'bg-[#252530] text-[#8A8A96]'}">Warning</button>
      <button on:click={() => filter = 'info'} class="text-[10px] px-3 py-1 rounded-full {filter === 'info' ? 'bg-[#252530] text-white' : 'bg-[#252530] text-[#8A8A96]'}">Info</button>
    </div>
  </div>

  {#if filtered.length === 0}
    <div class="text-xs text-[#555560] text-center py-12">No alerts matching filter</div>
  {:else}
    <div class="space-y-2">
      {#each filtered as a}
        <div class="bg-[#1A1A20] rounded-lg p-3 border border-[#252530]">
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-2">
              <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded {a.severity === 'critical' ? 'bg-[#EF4444]/20 text-[#EF4444]' : a.severity === 'warning' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'bg-[#252530] text-[#8A8A96]'}">{a.severity}</span>
              <div>
                <div class="text-xs text-white font-medium">{a.title || 'Untitled'}</div>
                <div class="text-[11px] text-[#8A8A96] mt-1">{a.content}</div>
              </div>
            </div>
            <span class="text-[10px] text-[#555560] whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
