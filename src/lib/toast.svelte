<script module lang="ts">
	const colors = {
		primary: 'text-primary',
		secondary: 'text-secondary',
		success: 'text-success',
		warning: 'text-warning',
		error: 'text-error'
	} as const;

	let timeout: ReturnType<typeof setTimeout>;

	let toast_message = $state('');
	let toast_color = $state<'primary' | 'secondary' | 'success' | 'warning' | 'error'>('primary');
	let show = $state(false);

	export async function toast(
		message: string,
		color: 'primary' | 'secondary' | 'success' | 'warning' | 'error',
		duration: number
	) {
		clearTimeout(timeout);
		if (show) {
			show = false;
			await new Promise((r) => setTimeout(r, 150));
		}
		show = true;
		toast_message = message;
		toast_color = color;
		if (duration === Number.POSITIVE_INFINITY) return;
		timeout = setTimeout(() => (show = false), duration);
	}
</script>

<div
	class="pointer-events-none fixed m-1 flex w-full items-center justify-center transition-[top] {show
		? 'top-0'
		: '-top-12'}"
>
	<div class="bg-base-100 rounded px-1 text-2xl {colors[toast_color]}">
		{toast_message}
	</div>
</div>
