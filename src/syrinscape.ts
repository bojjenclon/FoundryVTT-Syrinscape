/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your module
 */

// Import TypeScript modules
import { registerSettings } from './module/settings.js';
import { preloadTemplates } from './module/preloadTemplates.js';
import { SyrinscapeDialogApplication } from './module/dialog/syrinscapeDialog.js';
import { syrinFind } from './module/util.js';
import registerHandlebars from './module/handlebars.js';

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
	console.log('syrinscape | Initializing syrinscape');

	// Assign custom classes and constants here
	game.syrinscape = {
	};

	// Register custom module settings
	registerSettings();

	registerHandlebars();

	// Preload Handlebars templates
	await preloadTemplates();

	// Register custom sheets (if any)
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function () {
	// Do anything after initialization but before
	// ready
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function () {
	// Do anything once the module is ready
});

// Add any additional hooks if necessary
Hooks.on('chatMessage', (log, text: string, data: object) => {
	if (text !== undefined) {
		if (text.startsWith('/syrin')) {
			SyrinscapeDialogApplication.showDialog();

			return false;
		}
	}

	return true;
});

Hooks.on('hotbarDrop', async (_bar, data, slot) => {
	if (data.type !== 'sound') {
		return;
	}

	const soundData = syrinFind(data.id);

	if (!soundData) {
		ui.notifications.warn(game.i18n.localize('SYRINSCAPE.warning.noDataFound'));
		return;
	}

	const apiKey = game.settings.get('syrinscape', 'api-key');
	const isApiKeyValid = apiKey && apiKey.length > 0;

	if (!isApiKeyValid) {
		ui.notifications.warn(game.i18n.localize('SYRINSCAPE.warning.apiKeyMissing'));
		return;
	}

	const macroName = `Play: ${soundData.name}`;
	const command = `fetch('${soundData.url}/play/?auth_token=${apiKey}', { mode: 'no-cors' });`;

	let macro: Macro =
		game.macros.entities.find(macro => {
			const macroData: any = macro.data;
			return macro.name === macroName && macroData.command === command;
		});

	if (!macro) {
		macro = await Macro.create({
			name: macroName,
			type: 'script',
			img: 'icons/tools/instruments/megaphone.webp',
			command: command
		}, {
			renderSheet: false
		}) as Macro;
	}

	game.user.assignHotbarMacro(macro, slot);

	return false;
});
