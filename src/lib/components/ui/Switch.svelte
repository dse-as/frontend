<script lang="ts">
	import { Label, Switch } from 'bits-ui';
	let { checked = $bindable(), type = 'base' }: { checked: boolean | undefined; type: string } =
		$props();
	let clSwitchSize = $state('');
	let clLabelSize = $state('');
	let clThumbSize = $state('');

	$effect(() => {
		switch (type) {
			case 'small':
				clSwitchSize = 'h-[25px] min-h-[25px] w-[40px]';
				clThumbSize = 'size-[19px] data-[state=checked]:translate-x-[15px]';
				clLabelSize = 'text-xs';
				break;
			default:
				clSwitchSize = 'h-[26px] min-h-[26px] w-[40px]';
				clThumbSize = 'size-[20px] data-[state=checked]:translate-x-3';
				clLabelSize = 'text-base';
		}
	});
</script>

<Switch.Root
	id="switch_groups"
	name="toggle groups"
	bind:checked
	class={[
		clSwitchSize,
		'peer inline-flex shrink-0 cursor-pointer items-center rounded-full px-[3px] transition-colors',
		'focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'data-[state=checked]:bg-foreground data-[state=unchecked]:bg-dark-10 data-[state=unchecked]:shadow-mini-inset dark:data-[state=checked]:bg-foreground'
	]}
>
	<Switch.Thumb
		class={[
			clThumbSize,
			'pointer-events-none block shrink-0 rounded-full bg-background transition-transform',
			'data-[state=unchecked]:translate-x-0 data-[state=unchecked]:shadow-mini',
			'dark:border dark:border-background/30 dark:bg-foreground dark:shadow-popover dark:data-[state=unchecked]:border'
		]}
	/>
</Switch.Root>

<Label.Root for="switch_groups" class={clLabelSize}>Nach Kategorien gruppieren</Label.Root>
