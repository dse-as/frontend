<script lang="ts">
	import { toggleMode, mode } from 'mode-watcher';
	const iconClasses = 'h-[1.2rem] w-[1.2rem] rotate-0 !transition-all dark:-rotate-90';
</script>

<button
	onclick={toggleMode}
	class="flex h-8 w-8 items-center justify-center rounded-button border-2 p-3 hover:border-light-40 hover:bg-light-10"
>
	{#if mode.current === 'dark'}
		<i class={['fa-solid fa-sun text-xl', iconClasses]}></i>
	{:else if mode.current === 'light'}
		<i class={['fa-solid fa-moon text-xl', iconClasses]}></i>
	{/if}
	<span class="sr-only">Toggle theme</span>
</button>
