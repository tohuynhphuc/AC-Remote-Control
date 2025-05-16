<script lang="ts">
	let ac_state = $state<string>('default');
	let hour = $state<number>(0);
	let minute = $state<number>(0);
	let use_timer = $state<boolean>(false);
	let ws: WebSocket;

	$effect(() => {
		ws = new WebSocket('...');
	});
</script>

<select bind:value={ac_state} class="select select-primary">
	<option value="default">Default: 27C, Fan: Auto, Direction: Auto</option>
	<option value="quick_cooling">Quick Cooling: 25C, Fan: Strong, Direction: Auto</option>
	<option value="low_power">Low Power: 28C, Fan: Weak, Direction: Top</option>
	<option value="off">Off</option>
</select>

<div class="mt-2 flex items-center gap-2">
	<input type="checkbox" bind:checked={use_timer} class="toggle toggle-primary" />
	<span>Use Timer</span>
</div>

<div class="flex flex-col gap-2">
	<p>Hour:</p>
	<input bind:value={hour} class="input input-bordered w-full" type="number" min="0" />
</div>

<div class="flex flex-col gap-2">
	<p>Minute:</p>
	<input bind:value={minute} class="input input-bordered w-full" type="number" min="0" max="59" />
</div>

<button
	class="btn btn-primary mt-4"
	onclick={async () => {
		ws.send(ac_state);
		// fetch('', {
		// 	method: 'PUT',
		// 	body: JSON.stringify(ac_state),
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	}
		// });
	}}
>
	Send Command
</button>
