<script lang="ts">
	import { enhance } from '$app/forms';

	let status = $state<'connecting' | 'connected' | 'disconnected'>('connecting');
	let ac_state = $state('default');
	// let hour = $state(0);
	// let minute = $state(0);
	// let use_timer = $state(false);

	let ws: WebSocket;

	$effect(() => {
		ws = new WebSocket(`${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/ws`);

		ws.addEventListener('open', () => {
			status = 'connected';
		});

		ws.addEventListener('close', () => {
			status = 'disconnected';
		});

		ws.addEventListener('error', (e) => {
			console.log(e);
		});
	});
</script>

<div class="flex flex-col items-center gap-4">
	{#if status === 'connecting'}
		<div class="text-warning">Connecting...</div>
	{:else if status === 'connected'}
		<div class="text-success">Connected!</div>
	{:else if status === 'disconnected'}
		<div class="text-error">
			Disconnected due to inactivity. Please reload the page to reconnect.
		</div>
	{/if}

	<select disabled={status !== 'connected'} bind:value={ac_state} class="select select-primary">
		<option value="default">Default: 27C, Fan: Auto, Direction: Auto</option>
		<option value="default_top">Default Top: 27C, Fan: Auto, Direction: Top</option>
		<option value="default_low">Default Low: 27C, Fan: Auto, Direction: Low</option>
		<option value="default_down">Default Down: 27C, Fan: Auto, Direction: Bottom</option>
		<option value="quick_cooling">Quick Cooling: 25C, Fan: Strong, Direction: Auto</option>
		<option value="low_power">Low Power: 28C, Fan: Weak, Direction: Top</option>
		<option value="off">Off</option>
	</select>

	<!-- <div class="mt-2 flex items-center gap-2">
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
	</div> -->

	<button
		disabled={status !== 'connected'}
		class="btn btn-primary"
		onclick={async () => {
			ws.send(ac_state);
		}}
	>
		Send Command
	</button>

	<form class="mt-4" method="post" use:enhance>
		<input class="btn btn-error" type="submit" value="Log out" />
	</form>
</div>
