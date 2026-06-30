<script lang="ts">
  let { children } = $props();
  import '../app.css';
</script>

<div class="min-h-screen bg-[#0A0A0F]">
  <nav class="border-b border-[#1A1A26] px-6 py-3 flex items-center justify-between">
    <a href="/" class="flex items-center gap-3">
      <div class="w-7 h-7 rounded-full bg-[#FF9900] flex items-center justify-center">
        <span class="text-black font-bold text-xs">A</span>
      </div>
      <span class="text-sm font-bold tracking-wider text-white">AVION PLATFORM</span>
    </a>
    <div class="flex gap-6 text-xs font-medium">
      <a href="/" class="text-[#FF9900]">Overview</a>
      <a href="/costs" class="text-[#8A8A96] hover:text-white transition">Costs</a>
      <a href="/security" class="text-[#8A8A96] hover:text-white transition">Security</a>
      <a href="/skills" class="text-[#8A8A96] hover:text-white transition">Skill Hub</a>
      <a href="/alerts" class="text-[#8A8A96] hover:text-white transition">Alerts</a>
    </div>
  </nav>
  <main class="p-6">
    {#if children}
      {@render children()}
    {/if}
  </main>
</div>
