<script lang="ts">
	import { enhance } from '$app/forms';
	import { untrack } from 'svelte';

	let status = $state<'connecting' | 'connected' | 'disconnected'>('connecting');
	let arduino_connected = $state(false);
	let ac_state = $state('default');
	// let hour = $state(0);
	// let minute = $state(0);
	// let use_timer = $state(false);

	let is_manual = $state(false);
	let temperature = $state(27);

	let directions = ['bottom', 'low', 'mid', 'high', 'auto'];
	let direction_index = $state(4);

	let speeds = ['low', 'average', 'high', 'auto'];
	let speed_index = $state(4);

	let ws: WebSocket;

	// * Auto connect
	$effect(() => untrack(connect));

	function connect() {
		ws = new WebSocket(`${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/ws`);

		ws.addEventListener('open', () => {
			status = 'connected';
		});

		ws.addEventListener('message', (e) => {
			switch (e.data) {
				case 'arduino connected':
					arduino_connected = true;
					break;
				case 'arduino disconnected':
					arduino_connected = false;
					break;
			}
		});

		ws.addEventListener('close', () => {
			status = 'disconnected';
		});

		ws.addEventListener('error', (e) => {
			console.log(e);
		});
	}
</script>

<div class="flex flex-col items-center gap-4">
	{#if status === 'connecting'}
		<div class="text-warning">Connecting...</div>
	{:else if status === 'connected'}
		<div class="text-success">You are connected!</div>
	{:else if status === 'disconnected'}
		<div class="text-error">
			You have been disconnected due to inactivity. Please reload the page or click the button below
			to reconnect.
		</div>
		<button class="btn btn-primary" onclick={connect}>Reconnect</button>
	{/if}

	{#if arduino_connected}
		<div class="text-success">Arduino is connected!</div>
	{:else}
		<div class="text-error">Arduino is disconnected!</div>
	{/if}

	<div class="grid grid-cols-[1fr_auto_1fr] gap-4">
		<span class="ml-2">Preset Mode</span>
		<input type="checkbox" bind:checked={is_manual} class="toggle toggle-primary" />
		<span class="ml-2">Manual Mode</span>
	</div>

	{#if !is_manual}
		Presets:
		<select bind:value={ac_state} class="select select-primary">
			<option value="default">Default: 27C, Fan: Auto, Direction: Auto</option>
			<!-- <option value="default_top">Default Top: 27C, Fan: Auto, Direction: Top</option>
			<option value="default_low">Default Low: 27C, Fan: Auto, Direction: Low</option>
			<option value="default_down">Default Down: 27C, Fan: Auto, Direction: Bottom</option> -->
			<option value="quick_cooling">Quick Cooling: 25C, Fan: Strong, Direction: Auto</option>
			<option value="low_power">Low Power: 28C, Fan: Weak, Direction: Top</option>
			<option value="off">Off</option>
		</select>
	{:else}
		Manual:
		<div class="w-full max-w-xs">
			<div>
				Temperature:
				<input
					type="range"
					bind:value={temperature}
					min="25"
					max="30"
					class="range range-primary"
				/>
				<div class="mt-2 flex justify-between px-2.5 text-xs">
					<span>|</span>
					<span>|</span>
					<span>|</span>
					<span>|</span>
					<span>|</span>
					<span>|</span>
				</div>
				<div class="mt-2 flex justify-between px-2.5 text-xs">
					<span>25</span>
					<span>26</span>
					<span>27</span>
					<span>28</span>
					<span>29</span>
					<span>30</span>
				</div>
			</div>
			<div class="flex flex-col">
				Fan Direction:
				<div class="grid grid-cols-5 justify-between">
					{#each directions as dir, i (i)}
						<label class="flex flex-col items-center gap-2">
							<input
								type="radio"
								name="radio_dir"
								class="radio radio-primary"
								bind:group={direction_index}
								value={i}
							/>
							<span class="capitalize">{dir}</span>
						</label>
					{/each}
				</div>
			</div>

			<div class="flex flex-col">
				Fan Speed:
				<div class="grid grid-cols-4 justify-between">
					{#each speeds as spd, i (i)}
						<label class="flex flex-col items-center gap-2">
							<input
								type="radio"
								name="radio_dir"
								class="radio radio-primary"
								bind:group={speed_index}
								value={i}
							/>
							<span class="capitalize">{spd}</span>
						</label>
					{/each}
				</div>
			</div>
		</div>
	{/if}

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
