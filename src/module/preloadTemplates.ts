export const preloadTemplates = async function () {
	const templatePaths = [
		'modules/syrinscape/templates/dialog/syrinscape/syrinscape-dialog.html',
		'modules/syrinscape/templates/dialog/syrinscape/partial/sound.html',
		'modules/syrinscape/templates/dialog/syrinscape/partial/folder.html',
		'modules/syrinscape/templates/dialog/sound-dialog.html',
		'modules/syrinscape/templates/dialog/folder-dialog.html',
		'modules/syrinscape/templates/dialog/move/move-dialog.html',
		'modules/syrinscape/templates/dialog/move/partial/folder.html',
	];

	return loadTemplates(templatePaths);
}
