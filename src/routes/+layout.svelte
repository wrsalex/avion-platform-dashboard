<script lang="ts">
  let { children } = $props();
  import '../app.css';
</script>

<div class="min-h-screen bg-[#0A0A0F] font-mono">
  <nav class="border-b border-[#14141A] px-4 sm:px-6 py-3 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 sm:gap-3 group shrink-0">
      <div class="relative w-6 h-6 sm:w-7 sm:h-7">
        <div class="absolute inset-0 rounded-full bg-[#FF9900]/20 ring-breathe"></div>
        <div class="absolute inset-0 rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-[9px] sm:text-[10px]">A</span>
        </div>
      </div>
      <span class="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-white group-hover:text-[#FF9900] transition-colors">AVION</span>
    </a>
    <div class="flex gap-3 sm:gap-6 text-[9px] sm:text-[10px] font-medium overflow-x-auto">
      <a href="/" class="text-[#FF9900] shrink-0">Overview</a>
      <a href="/costs" class="text-[#555560] hover:text-white transition-colors shrink-0">Costs</a>
      <a href="/skills" class="text-[#555560] hover:text-white transition-colors shrink-0">Hub</a>
      <a href="/security" class="text-[#555560] hover:text-white transition-colors shrink-0">Security</a>
      <a href="/alerts" class="text-[#555560] hover:text-white transition-colors shrink-0">Alerts</a>
    </div>
  </nav>
  <main class="max-w-5xl mx-auto p-4 sm:p-6">
    {#if children}
      {@render children()}
    {/if}
  </main>
</div>
