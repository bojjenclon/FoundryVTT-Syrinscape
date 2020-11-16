import { syrinDelete, syrinReparent, syrinUpdate } from "../util";
import { SyrinscapeDialogApplication } from "./syrinscapeDialog";

export class MoveDialogApplication extends Application {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: 'Syrinscape - Move',

      template: 'modules/syrinscape/templates/dialog/move/move-dialog.html',
      classes: ['syrinscape', 'move-dialog'],

      width: 300,
      height: 300,
      resizable: true,

      background: '#ff0000'
    });
  }

  source: any;

  constructor(source: any) {
    super(source);

    this.source = source;
  }

  getData() {
    const data = super.getData();

    const { source } = this;

    data.sourceId = source.id;
    data.activeId = source.parent;
    data.library = game.settings.get('syrinscape', 'sound-library') ?? [];

    return data;
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html);

    const folders = html.find('.folder');

    folders.find('.folder-header .name').on('click', async (evt) => {
      evt.preventDefault();

      const el = evt.currentTarget;
      const folderEl = el.closest('.folder') as HTMLElement;

      if (folderEl.classList.contains('active') || folderEl.classList.contains('disabled')) {
        return;
      }

      const folderId = folderEl.dataset.id;

      const { source } = this;
      await game.settings.set('syrinscape', 'sound-library', syrinReparent(source.id, folderId));

      SyrinscapeDialogApplication.reloadDialog();
      this.close();
    });
  }
}
