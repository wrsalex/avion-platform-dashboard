<script lang="ts">
  let { children } = $props();
  import '../app.css';
</script>

<div class="min-h-screen bg-[#0A0A0F] font-mono">
  <nav class="border-b border-[#14141A] px-6 py-3 flex items-center justify-between">
    <a href="/" class="flex items-center gap-3 group">
      <div class="relative w-7 h-7">
        <div class="absolute inset-0 rounded-full bg-[#FF9900]/20 ring-breathe"></div>
        <div class="absolute inset-0 rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-[10px]">A</span>
        </div>
      </div>
      <span class="text-[11px] font-bold tracking-[0.15em] text-white group-hover:text-[#FF9900] transition-colors">AVION</span>
    </a>
    <div class="flex gap-6 text-[10px] font-medium">
      <a href="/" class="text-[#FF9900]">Overview</a>
      <a href="/costs" class="text-[#555560] hover:text-white transition-colors">Costs</a>
      <a href="/skills" class="text-[#555560] hover:text-white transition-colors">Skill Hub</a>
      <a href="/security" class="text-[#555560] hover:text-white transition-colors">Security</a>
      <a href="/alerts" class="text-[#555560] hover:text-white transition-colors">Alerts</a>
    </div>
  </nav>
  <main class="max-w-5xl mx-auto p-6">
    {#if children}
      {@render children()}
    {/if}
  </main>
</div>
