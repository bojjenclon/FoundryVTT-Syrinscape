export const registerSettings = function() {
	// Register any custom module settings here
	game.settings.register('syrinscape', 'api-key', {
		name: 'SETTINGS.name.apiKey',
		hint: 'SETTINGS.hint.apiKey',
		scope: 'world',
		config: true,
		type: String,
		default: ''
	});

	game.settings.register('syrinscape', 'sound-library', {
		scope: 'world',
		config: false,
		type: Object,
		default: []
	});
}
