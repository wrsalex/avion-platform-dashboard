<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchSecurityFindings } from '$lib/api';

  let findings: any[] = [];
  let loading = true;

  onMount(async () => {
    findings = await fetchSecurityFindings();
    loading = false;
  });

  $: critical = findings.filter(f => f.severity === 'critical').length;
  $: warnings = findings.filter(f => f.severity === 'warning').length;
  $: info = findings.filter(f => f.severity === 'info').length;
</script>

<div class="space-y-4 sm:space-y-6">
  <div>
    <h1 class="text-xs sm:text-sm font-bold text-white tracking-tight">Security</h1>
    <p class="text-[9px] sm:text-xs text-[#8A8A96]">RLS policies, auth, Supabase security</p>
  </div>

  <!-- Severity summary -->
  <div class="grid grid-cols-3 gap-2 sm:gap-3">
    <div class="bg-[#141419] rounded-lg p-3 sm:p-4 border border-[#1A1A26] text-center">
      <div class="text-xl sm:text-2xl font-bold text-[#EF4444] font-mono">{critical}</div>
      <div class="text-[9px] sm:text-[10px] text-[#8A8A96] mt-1">Critical</div>
    </div>
    <div class="bg-[#141419] rounded-lg p-3 sm:p-4 border border-[#1A1A26] text-center">
      <div class="text-xl sm:text-2xl font-bold text-[#F59E0B] font-mono">{warnings}</div>
      <div class="text-[9px] sm:text-[10px] text-[#8A8A96] mt-1">Warnings</div>
    </div>
    <div class="bg-[#141419] rounded-lg p-3 sm:p-4 border border-[#1A1A26] text-center">
      <div class="text-xl sm:text-2xl font-bold text-[#8A8A96] font-mono">{info}</div>
      <div class="text-[9px] sm:text-[10px] text-[#8A8A96] mt-1">Info</div>
    </div>
  </div>

  <!-- Supabase projects -->
  <div class="bg-[#141419] rounded-lg p-3 sm:p-4 border border-[#1A1A26]">
    <div class="text-[9px] sm:text-[10px] font-medium text-[#8A8A96] uppercase tracking-wider mb-2 sm:mb-3">Supabase Projects</div>
    <div class="space-y-1.5 sm:space-y-2">
      {#each ['AvionX', 'AvionHub', 'HKRE'] as proj}
        <div class="flex items-center justify-between py-1.5 sm:py-2">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
            <span class="text-[9px] sm:text-xs text-white">{proj}</span>
          </div>
          <span class="text-[8px] sm:text-[10px] text-[#22C55E]">RLS enabled</span>
        </div>
      {/each}
    </div>
  </div>

  <!-- Findings list -->
  {#if findings.length > 0}
    <div class="bg-[#141419] rounded-lg p-3 sm:p-4 border border-[#1A1A26]">
      <div class="text-[9px] sm:text-[10px] font-medium text-[#8A8A96] uppercase tracking-wider mb-2 sm:mb-3">Findings</div>
      <div class="space-y-1">
        {#each findings as f}
          <div class="flex items-start gap-2 py-1.5 border-b border-[#1A1A26] last:border-0">
            <span class="w-1.5 h-1.5 rounded-full mt-1 shrink-0 {f.severity === 'critical' ? 'bg-[#EF4444]' : f.severity === 'warning' ? 'bg-[#F59E0B]' : 'bg-[#8A8A96]'}"></span>
            <div class="min-w-0">
              <div class="text-[9px] sm:text-[10px] text-white">{f.title}</div>
              <div class="text-[8px] sm:text-[9px] text-[#555560]">{f.zone} · {f.description?.slice(0, 60) || ''}</div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="text-[9px] sm:text-xs text-[#555560] text-center py-8">No security findings</div>
  {/if}
</div>
