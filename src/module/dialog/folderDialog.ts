import { syrinUpdate } from "../util";
import { SyrinscapeDialogApplication } from "./syrinscapeDialog";

export class FolderDialogApplication extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: 'Syrinscape - Folder',

      template: 'modules/syrinscape/templates/dialog/folder-dialog.html',
      classes: ['syrinscape', 'folder-dialog'],

      width: 400,
      height: 75,
      resizable: true,

      background: '#000',

      closeOnSubmit: false,
      submitOnClose: true,
      submitOnChange: true
    });
  }

  folder: any;

  constructor(folder: any) {
    super(folder);

    this.folder = folder;
  }

  getData() {
    const data = super.getData();

    const { folder } = this;

    mergeObject(data, folder);

    return data;
  }

  async _updateObject(_event, formData) {
    const { folder } = this;

    await game.settings.set('syrinscape', 'sound-library', syrinUpdate(folder.id, formData));

    SyrinscapeDialogApplication.reloadDialog();
  }
}
