<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchCosts } from '$lib/api';

  let data: any = { services: [], total: 0, trend: 0 };
  let loading = true;

  onMount(async () => {
    data = await fetchCosts();
    loading = false;
  });
</script>

<div class="space-y-4 sm:space-y-6">
  <div>
    <h1 class="text-xs sm:text-sm font-bold text-white tracking-tight">Costs</h1>
    <p class="text-[9px] sm:text-xs text-[#8A8A96]">Real-time from usage tables</p>
  </div>

  <!-- Total -->
  <div class="bg-[#141419] rounded-lg p-4 sm:p-5 border border-[#1A1A26] text-center">
    <div class="text-[9px] sm:text-[11px] font-medium text-[#8A8A96] uppercase tracking-wider mb-1 sm:mb-2">This Month</div>
    <div class="text-2xl sm:text-3xl font-bold text-white font-mono">${data.total.toFixed(2)}</div>
    <div class="text-[9px] sm:text-xs {data.trend < 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'} mt-1">
      {data.trend > 0 ? '↑' : '↓'} {Math.abs(data.trend)}% vs last month
    </div>
  </div>

  <!-- Per-service table -->
  <div class="bg-[#141419] rounded-lg border border-[#1A1A26] overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-[9px] sm:text-xs">
        <thead>
          <tr class="border-b border-[#1A1A26] text-[#8A8A96] uppercase tracking-wider">
            <th class="text-left p-2 sm:p-3 font-medium">Service</th>
            <th class="text-right p-2 sm:p-3 font-medium">Current</th>
            <th class="text-right p-2 sm:p-3 font-medium hidden sm:table-cell">Previous</th>
            <th class="text-right p-2 sm:p-3 font-medium">Δ</th>
          </tr>
        </thead>
        <tbody>
          {#each data.services as s}
            <tr class="border-b border-[#1A1A26]/50">
              <td class="p-2 sm:p-3 text-white">{s.service}</td>
              <td class="p-2 sm:p-3 text-right text-white font-mono">${s.current_month.toFixed(2)}</td>
              <td class="p-2 sm:p-3 text-right text-[#8A8A96] font-mono hidden sm:table-cell">${s.previous_month.toFixed(2)}</td>
              <td class="p-2 sm:p-3 text-right font-mono {s.trend_pct < 0 ? 'text-[#22C55E]' : s.trend_pct > 0 ? 'text-[#EF4444]' : 'text-[#8A8A96]'}">
                {s.trend_pct > 0 ? '+' : ''}{s.trend_pct}%
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
