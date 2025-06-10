<script lang="ts">
	import { enhance } from '$app/forms';
	import { untrack } from 'svelte';

	let status = $state<'connecting' | 'connected' | 'disconnected'>('connecting');
	let arduino_connected = $state(false);
	let ac_state = $state('default');

	let is_manual = $state(false);

	let temperature = $state(27);

	let directions = ['Bottom', 'Low', 'Mid', 'High', 'Top', 'Auto'];
	let direction_index = $state(5);

	let speeds = ['Low', 'Mid', 'High', 'Auto'];
	let speed_index = $state(3);

	let command = $state('default');

	let hour = $state(0);
	let minute = $state(0);
	let use_timer = $state(false);

	let showToast = $state(false);
	let toastTimeout: NodeJS.Timeout;
	let sentCommand = $state();

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

<svelte:head>
	<title>Smart AC</title>
</svelte:head>

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
		<div class="text-2xl">Preset</div>
		<select bind:value={ac_state} class="select select-primary">
			<option value="default">Default: 27C, Fan: Auto, Direction: Auto</option>
			<option value="quick_cooling">Quick Cooling: 25C, Fan: Strong, Direction: Auto</option>
			<option value="low_power">Low Power: 28C, Fan: Weak, Direction: Top</option>
			<option value="off">Off</option>
		</select>
	{:else}
		<div class="text-2xl">Manual</div>
		<div class="grid w-full max-w-xs grid-rows-3 gap-5">
			<div class="">
				Temperature
				<input
					type="range"
					bind:value={temperature}
					min="25"
					max="30"
					class="range range-primary"
				/>
				<div class="mt-2 mr-1.5 ml-1.5 flex justify-between px-2.5 text-xs">
					<span>|</span>
					<span>|</span>
					<span>|</span>
					<span>|</span>
					<span>|</span>
					<span>|</span>
				</div>
				<div class="mt-2 flex justify-between px-2.5 text-sm">
					<span>25</span>
					<span>26</span>
					<span>27</span>
					<span>28</span>
					<span>29</span>
					<span>30</span>
				</div>
			</div>
			<div class="flex flex-col gap-5">
				Fan Direction
				<div class="grid grid-cols-6 justify-between">
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

			<div class="flex flex-col gap-5">
				Fan Speed
				<div class="grid grid-cols-4 justify-between">
					{#each speeds as spd, i (i)}
						<label class="flex flex-col items-center gap-2">
							<input
								type="radio"
								name="radio_spd"
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

	<div class="mt-2 flex w-full max-w-xs flex-col items-center gap-2">
		<div class="mb-2 grid grid-cols-2 items-center gap-5">
			<div>Timer</div>
			<input type="checkbox" bind:checked={use_timer} class="toggle toggle-primary" />
		</div>
		<div class="mr-3 ml-3 grid w-full grid-cols-2 gap-5">
			<div class="flex flex-col gap-2">
				<p>Hour</p>
				<input
					bind:value={hour}
					class="input input-primary input-bordered w-full"
					type="number"
					min="0"
				/>
			</div>

			<div class="flex flex-col gap-2">
				<p>Minute</p>
				<input
					bind:value={minute}
					class="input input-primary input-bordered w-full"
					type="number"
					min="0"
					max="59"
				/>
			</div>
		</div>
	</div>

	<button
		class="btn btn-primary btn-soft"
		onclick={async () => {
			if (!is_manual) {
				command = ac_state;
			} else {
				command =
					'_' +
					temperature.toString() +
					'_' +
					directions[direction_index] +
					'_' +
					speeds[speed_index];
			}
			if (use_timer) {
				command = command + '_' + (hour * 60 + minute).toString();
			}
			ws.send(command);

			sentCommand = command;
			showToast = true;
			clearTimeout(toastTimeout);
			toastTimeout = setTimeout(() => {
				showToast = false;
			}, 2000);
		}}
	>
		Send Command
	</button>

	{#if showToast}
		<div class="alert alert-success fixed bottom-5 z-50 flex gap-2">
			<div>Command sent:</div>
			<code class="font-mono">{sentCommand}</code>
		</div>
	{/if}

	<form class="mt-1" method="post" use:enhance>
		<input class="btn btn-error btn-soft" type="submit" value="Log out" />
	</form>
</div>
