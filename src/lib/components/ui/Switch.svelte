<script lang="ts">
	import { Label, Switch } from 'bits-ui';

	let { checked = $bindable(), type = 'base' }: { checked: boolean | undefined; type: string } =
		$props();

	function getClasses(currentType: string) {
		switch (currentType) {
			case 'compact':
				return {
					switch: 'h-[18px] min-h-[18px] w-[32px]',
					thum: 'size-[14px] data-[state=checked]:translate-x-[14px]',
					label: 'text-[10px]'
				};

			case 'small':
				return {
					switch: 'h-[22px] min-h-[22px] w-[40px]',
					thum: 'size-[18px] data-[state=checked]:translate-x-[18px]',
					label: 'text-xs'
				};

			case 'large':
				return {
					switch: 'h-[30px] min-h-[30px] w-[56px]',
					thum: 'size-[26px] data-[state=checked]:translate-x-[26px]',
					label: 'text-lg'
				};

			case 'base':
			default:
				return {
					switch: 'h-[24px] min-h-[24px] w-[44px]',
					thum: 'size-[20px] data-[state=checked]:translate-x-[20px]',
					label: 'text-base'
				};
		}
	}

	let { switch: clSwitchSize, thum: clThumbSize, label: clLabelSize } = $derived(getClasses(type));
</script>

<Switch.Root
	id="switch_groups"
	name="toggle groups"
	bind:checked
	class={[
		clSwitchSize,
		'inline-flex shrink-0 cursor-pointer items-center rounded-full px-[3px] transition-colors',
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
