export const preloadTemplates = async function() {
	const templatePaths = [
		'modules/syrinscape/templates/dialog/syrinscape-dialog.html',
		'modules/syrinscape/templates/dialog/sound-dialog.html'
	];

	return loadTemplates(templatePaths);
}
