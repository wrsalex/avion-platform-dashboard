<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchSkillHubStats } from '$lib/api';

  let stats: any = { published: 0, flagged: 0, deprecated: 0, total: 0 };
  let loading = true;

  onMount(async () => {
    stats = await fetchSkillHubStats();
    loading = false;
  });
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-base font-bold text-white tracking-tight">Skill Hub</h1>
    <p class="text-xs text-[#8A8A96]">Skill marketplace metrics</p>
  </div>

  <!-- Stats -->
  <div class="grid grid-cols-4 gap-4">
    <div class="bg-[#1A1A20] rounded-lg p-4 border border-[#252530] text-center">
      <div class="text-2xl font-bold text-white">{stats.total}</div>
      <div class="text-[10px] text-[#8A8A96] mt-1">Total</div>
    </div>
    <div class="bg-[#1A1A20] rounded-lg p-4 border border-[#252530] text-center">
      <div class="text-2xl font-bold text-[#22C55E]">{stats.published}</div>
      <div class="text-[10px] text-[#8A8A96] mt-1">Published</div>
    </div>
    <div class="bg-[#1A1A20] rounded-lg p-4 border border-[#252530] text-center">
      <div class="text-2xl font-bold text-[#F59E0B]">{stats.flagged}</div>
      <div class="text-[10px] text-[#8A8A96] mt-1">Flagged</div>
    </div>
    <div class="bg-[#1A1A20] rounded-lg p-4 border border-[#252530] text-center">
      <div class="text-2xl font-bold text-[#EF4444]">{stats.deprecated}</div>
      <div class="text-[10px] text-[#8A8A96] mt-1">Deprecated</div>
    </div>
  </div>

  <!-- Pipeline Health -->
  <div class="bg-[#1A1A20] rounded-lg p-4 border border-[#252530]">
    <div class="text-[11px] font-medium text-[#8A8A96] uppercase tracking-wider mb-3">Pipeline Health</div>
    <div class="grid grid-cols-3 gap-4 text-center">
      <div>
        <div class="text-lg font-bold text-[#22C55E]">100%</div>
        <div class="text-[10px] text-[#8A8A96] mt-1">Success Rate</div>
      </div>
      <div>
        <div class="text-lg font-bold text-white">0</div>
        <div class="text-[10px] text-[#8A8A96] mt-1">Submissions Today</div>
      </div>
      <div>
        <div class="text-lg font-bold text-white">10</div>
        <div class="text-[10px] text-[#8A8A96] mt-1">Skills Total</div>
      </div>
    </div>
  </div>

  <!-- Crons -->
  <div class="bg-[#1A1A20] rounded-lg p-4 border border-[#252530]">
    <div class="text-[11px] font-medium text-[#8A8A96] uppercase tracking-wider mb-3">Active Crons</div>
    <div class="space-y-1.5 text-xs">
      <div class="flex items-center gap-2 p-2 bg-[#141419] rounded">
        <div class="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></div>
        <span class="text-white">Drift Detection</span>
        <span class="text-[#555560] ml-auto">Daily 3am</span>
      </div>
      <div class="flex items-center gap-2 p-2 bg-[#141419] rounded">
        <div class="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></div>
        <span class="text-white">Pipeline Health</span>
        <span class="text-[#555560] ml-auto">Daily 8am</span>
      </div>
      <div class="flex items-center gap-2 p-2 bg-[#141419] rounded">
        <div class="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></div>
        <span class="text-white">Maintenance</span>
        <span class="text-[#555560] ml-auto">Sun 4am</span>
      </div>
      <div class="flex items-center gap-2 p-2 bg-[#141419] rounded">
        <div class="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></div>
        <span class="text-white">Skill Scout</span>
        <span class="text-[#555560] ml-auto">Daily 6am</span>
      </div>
      <div class="flex items-center gap-2 p-2 bg-[#141419] rounded">
        <div class="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
        <span class="text-white">Review Queue</span>
        <span class="text-[#F59E0B]">{stats.flagged} flagged</span>
        <span class="text-[#555560] ml-auto">Pending</span>
      </div>
    </div>
  </div>
</div>
