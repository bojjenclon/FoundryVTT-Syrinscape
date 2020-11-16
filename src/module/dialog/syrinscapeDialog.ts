import { Syrinscape } from "../config";
import { syrinDelete, syrinFind, syrinSort } from "../util";
import { MoveDialogApplication } from "./moveDialog";
import { SoundDialogApplication } from "./soundDialog";

export class SyrinscapeDialogApplication extends Application {
  static dialog: SyrinscapeDialogApplication;

  static async showDialog() {
    if (!this.dialog) {
      this.dialog = new SyrinscapeDialogApplication();
    }

    const { dialog } = this;
    dialog.render(true);
  }

  static async reloadDialog() {
    if (!this.dialog) {
      return;
    }

    if (this.dialog.rendered) {
      this.dialog.render(true);
    }
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: 'Syrinscape',
      id: Syrinscape.syrinscapeDialogId,

      template: 'modules/syrinscape/templates/dialog/syrinscape/syrinscape-dialog.html',
      classes: ['syrinscape', 'syrinscape-dialog'],

      width: 500,
      height: 500,
      resizable: true,

      background: '#ff0000'
    });
  }

  getData() {
    const data = super.getData();

    const apiKey = game.settings.get('syrinscape', 'api-key');
    const isApiKeyValid = apiKey && apiKey.length > 0;

    const library = game.settings.get('syrinscape', 'sound-library') ?? [];
    data.library = library.map(sound => {
      return {
        ...sound,

        canPlay: isApiKeyValid,
        playURL: `${sound.url}/play/?auth_token=${apiKey}`,
        stopURL: `${sound.url}/stop/?auth_token=${apiKey}`,
      };
    });

    return data;
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html);

    // Folder Actions
    const folders = html.find('.folder');

    folders.find('.folder-header .move').on('click', async (evt) => {
      const el = evt.currentTarget;
      const folderEl = el.closest('.folder') as HTMLElement;

      const folderId = folderEl.dataset.id;
      const folderData = syrinFind(folderId);

      const dialog = new MoveDialogApplication(folderData);
      dialog.render(true);
    });

    folders.find('.folder-header .delete').on('click', async (evt) => {
      const el = evt.currentTarget;
      const folderEl = el.closest('.folder') as HTMLElement;

      const folderId = folderEl.dataset.id;

      await game.settings.set('syrinscape', 'sound-library', syrinDelete(folderId));

      this.render(true);
    });

    // Sound Actions
    const sounds = html.find('.sound');

    sounds.find('.name').on('click', evt => {
      const el = evt.currentTarget;
      const soundEl = el.closest('.sound') as HTMLElement;

      const soundId = soundEl.dataset.id;
      const soundData = syrinFind(soundId);

      const dialog = new SoundDialogApplication(soundData);
      dialog.render(true);
    });

    sounds.find('.button.delete').on('click', async (evt) => {
      const el = evt.currentTarget;
      const soundEl = el.closest('.sound') as HTMLElement;

      const soundId = soundEl.dataset.id;

      await game.settings.set('syrinscape', 'sound-library', syrinDelete(soundId));

      this.render(true);
    });

    sounds.find('.button.move').on('click', async (evt) => {
      const el = evt.currentTarget;
      const soundEl = el.closest('.sound') as HTMLElement;

      const soundId = soundEl.dataset.id;
      const soundData = syrinFind(soundId);

      const dialog = new MoveDialogApplication(soundData);
      dialog.render(true);
    });

    sounds.find('.button.stop').on('click', evt => {
      const el = evt.currentTarget;
      const { url } = el.dataset;

      if (url) {
        fetch(url, { mode: 'no-cors' });
      }
    });

    sounds.find('.button.play').on('click', evt => {
      const el = evt.currentTarget;
      const { url } = el.dataset;

      if (url) {
        fetch(url, { mode: 'no-cors' });
      }
    });

    html.find('.button.add-sound').on('click', async (evt) => {
      const uuid = randomID();
      const soundData = {
        id: uuid,
        type: 'sound',
        name: 'New Sound',
        url: '',
        description: '',
        parent: 'root'
      };

      const library: Array<any> = game.settings.get('syrinscape', 'sound-library') ?? [];
      library.push(soundData);
      await game.settings.set('syrinscape', 'sound-library', syrinSort(library));

      this.render(true);

      const dialog = new SoundDialogApplication(soundData);
      dialog.render(true);
    });

    html.find('.button.add-folder').on('click', async (evt) => {
      const uuid = randomID();
      const folderData = {
        id: uuid,
        type: 'folder',
        name: 'New Folder',
        children: []
      };

      const library: Array<any> = game.settings.get('syrinscape', 'sound-library') ?? [];
      library.push(folderData);
      await game.settings.set('syrinscape', 'sound-library', syrinSort(library));

      this.render(true);
    });
  }
}
