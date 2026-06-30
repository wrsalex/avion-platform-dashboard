<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchSecurityFindings } from '$lib/api';

  let findings: any[] = [];
  let loading = true;

  onMount(async () => {
    findings = await fetchSecurityFindings();
    loading = false;
  });
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-base font-bold text-white tracking-tight">Security</h1>
    <p class="text-xs text-[#8A8A96]">RLS policies, auth patterns, storage permissions</p>
  </div>

  <!-- Summary -->
  <div class="grid grid-cols-3 gap-4">
    <div class="bg-[#1A1A20] rounded-lg p-4 border border-[#252530] text-center">
      <div class="text-2xl font-bold text-[#22C55E]">{findings.filter(f => f.severity === 'critical').length}</div>
      <div class="text-[10px] text-[#8A8A96] mt-1">Critical</div>
    </div>
    <div class="bg-[#1A1A20] rounded-lg p-4 border border-[#252530] text-center">
      <div class="text-2xl font-bold text-[#F59E0B]">{findings.filter(f => f.severity === 'warning').length}</div>
      <div class="text-[10px] text-[#8A8A96] mt-1">Warnings</div>
    </div>
    <div class="bg-[#1A1A20] rounded-lg p-4 border border-[#252530] text-center">
      <div class="text-2xl font-bold text-[#8A8A96]">{findings.filter(f => f.severity === 'info').length}</div>
      <div class="text-[10px] text-[#8A8A96] mt-1">Info</div>
    </div>
  </div>

  <!-- Per-project -->
  <div>
    <h2 class="text-xs font-medium text-[#8A8A96] uppercase tracking-wider mb-3">Projects</h2>
    <div class="space-y-2">
      {#each ['AvionX', 'AvionHub', 'HKRE'] as proj}
        <div class="bg-[#1A1A20] rounded-lg p-3 border border-[#252530] flex items-center justify-between">
          <div>
            <div class="text-xs font-medium text-white">{proj}</div>
            <div class="text-[10px] text-[#555560]">Supabase project</div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-[#22C55E]"></div>
            <span class="text-[10px] text-[#22C55E]">RLS enabled</span>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Storage -->
  <div class="bg-[#1A1A20] rounded-lg p-4 border border-[#252530]">
    <div class="text-[11px] font-medium text-[#8A8A96] uppercase tracking-wider mb-2">Storage Buckets</div>
    <div class="grid grid-cols-2 gap-2 text-xs">
      <div class="flex items-center gap-2 p-2 bg-[#141419] rounded">
        <div class="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></div>
        <span class="text-white">skill-sources</span>
        <span class="text-[#555560] ml-auto">public</span>
      </div>
      <div class="flex items-center gap-2 p-2 bg-[#141419] rounded">
        <div class="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
        <span class="text-white">backups</span>
        <span class="text-[#555560] ml-auto">private</span>
      </div>
    </div>
  </div>
</div>
