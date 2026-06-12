<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	const iconClasses = 'h-[1.2rem] w-[1.2rem] rotate-0 !transition-all dark:-rotate-90';
</script>

<button onclick={toggleMode}>
	<i class={['fa-solid fa-sun scale-100 dark:scale-0', iconClasses]}></i>
	<i class={['fa-solid fa-moon scale-0 dark:scale-100', iconClasses]}></i>
	<span class="sr-only">Toggle theme</span>
</button>
