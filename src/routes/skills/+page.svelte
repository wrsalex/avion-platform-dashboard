<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchSkillHubStats } from '$lib/api';

  let stats: any = { published: 0, flagged: 0, deprecated: 0, total: 0 };
  let loading = true;
  $: pubPct = stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0;

  onMount(async () => {
    stats = await fetchSkillHubStats();
    loading = false;
  });
</script>

<div class="space-y-4 sm:space-y-6">
  <div>
    <h1 class="text-xs sm:text-sm font-bold text-white tracking-tight">Skill Hub</h1>
    <p class="text-[9px] sm:text-xs text-[#8A8A96]">Live catalog metrics</p>
  </div>

  <!-- Stats grid -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
    <div class="bg-[#141419] rounded-lg p-3 sm:p-4 border border-[#1A1A26] text-center">
      <div class="text-xl sm:text-2xl font-bold text-white font-mono">{stats.total}</div>
      <div class="text-[9px] sm:text-[10px] text-[#8A8A96] mt-1">Total</div>
    </div>
    <div class="bg-[#141419] rounded-lg p-3 sm:p-4 border border-[#1A1A26] text-center">
      <div class="text-xl sm:text-2xl font-bold text-[#22C55E] font-mono">{stats.published}</div>
      <div class="text-[9px] sm:text-[10px] text-[#8A8A96] mt-1">Published</div>
    </div>
    <div class="bg-[#141419] rounded-lg p-3 sm:p-4 border border-[#1A1A26] text-center">
      <div class="text-xl sm:text-2xl font-bold text-[#F59E0B] font-mono">{stats.flagged}</div>
      <div class="text-[9px] sm:text-[10px] text-[#8A8A96] mt-1">Flagged</div>
    </div>
    <div class="bg-[#141419] rounded-lg p-3 sm:p-4 border border-[#1A1A26] text-center">
      <div class="text-xl sm:text-2xl font-bold text-[#555560] font-mono">{stats.deprecated}</div>
      <div class="text-[9px] sm:text-[10px] text-[#8A8A96] mt-1">Deprecated</div>
    </div>
  </div>

  <!-- Publish health bar -->
  <div class="bg-[#141419] rounded-lg p-3 sm:p-4 border border-[#1A1A26]">
    <div class="text-[9px] sm:text-[10px] font-medium text-[#8A8A96] uppercase tracking-wider mb-2 sm:mb-3">Catalog Health</div>
    <div class="h-2 rounded-full bg-[#1A1A26] overflow-hidden flex">
      <div class="h-full bg-[#22C55E]" style="width: {pubPct}%"></div>
    </div>
    <div class="flex justify-between mt-1.5 text-[9px] sm:text-[10px]">
      <span class="text-[#22C55E]">{pubPct}% published</span>
      <span class="text-[#555560]">{stats.total} total skills</span>
    </div>
  </div>
</div>
