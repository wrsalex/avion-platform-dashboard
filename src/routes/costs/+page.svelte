<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchCosts } from '$lib/api';

  let data: any = { services: [], total: 0, trend: 0 };
  let loading = true;
  let selectedMonth = 'June 2026';

  onMount(async () => {
    data = await fetchCosts();
    loading = false;
  });
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-base font-bold text-white tracking-tight">Costs</h1>
    <p class="text-xs text-[#8A8A96]">Service costs overview</p>
  </div>

  <!-- Summary -->
  <div class="bg-[#1A1A20] rounded-lg p-5 border border-[#252530]">
    <div class="text-center">
      <div class="text-[11px] font-medium text-[#8A8A96] uppercase tracking-wider mb-2">Current Month</div>
      <div class="text-3xl font-bold text-white">${data.total.toFixed(2)}</div>
      <div class="text-xs {data.trend < 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'} mt-1">
        {data.trend > 0 ? '↑' : '↓'} {Math.abs(data.trend)}% vs last month
      </div>
    </div>
  </div>

  <!-- Per-service -->
  <div class="bg-[#1A1A20] rounded-lg border border-[#252530] overflow-hidden">
    <table class="w-full text-xs">
      <thead>
        <tr class="border-b border-[#252530] text-[#8A8A96] uppercase tracking-wider">
          <th class="text-left p-3 font-medium">Service</th>
          <th class="text-right p-3 font-medium">Current</th>
          <th class="text-right p-3 font-medium">Previous</th>
          <th class="text-right p-3 font-medium">Trend</th>
        </tr>
      </thead>
      <tbody>
        {#each data.services as s}
          <tr class="border-b border-[#252530]/50">
            <td class="p-3 text-white">{s.service}</td>
            <td class="p-3 text-right text-white">${s.current_month.toFixed(2)}</td>
            <td class="p-3 text-right text-[#8A8A96]">${s.previous_month.toFixed(2)}</td>
            <td class="p-3 text-right {s.trend_pct < 0 ? 'text-[#22C55E]' : s.trend_pct > 0 ? 'text-[#EF4444]' : 'text-[#8A8A96]'}">
              {s.trend_pct > 0 ? '+' : ''}{s.trend_pct}%
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Burn Rate -->
  <div class="bg-[#1A1A20] rounded-lg p-4 border border-[#252530]">
    <div class="text-[11px] font-medium text-[#8A8A96] uppercase tracking-wider mb-2">Burn Rate</div>
    <div class="text-sm text-white">
      At ${data.total.toFixed(2)}/month, DeepSeek balance covers <span class="text-[#FF9900] font-bold">~12 days</span> of operations at current usage.
    </div>
  </div>
</div>
