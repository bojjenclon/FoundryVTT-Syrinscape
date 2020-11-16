import { Syrinscape } from "../config";
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

      template: 'modules/syrinscape/templates/dialog/syrinscape-dialog.html',
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
    const sounds = html.find('.sound');

    sounds.find('.name').on('click', evt => {
      const el = evt.currentTarget;
      const soundEl = el.closest('.sound') as HTMLElement;

      const library: Array<any> = game.settings.get('syrinscape', 'sound-library') ?? [];
      const soundData = library.find(snd => snd.id === soundEl.dataset.id);

      const dialog = new SoundDialogApplication(soundData);
      dialog.render(true);
    });

    sounds.find('.button.delete').on('click', async (evt) => {
      const el = evt.currentTarget;
      const soundEl = el.closest('.sound') as HTMLElement;

      const soundId = soundEl.dataset.id;

      const library: Array<any> = game.settings.get('syrinscape', 'sound-library') ?? [];
      const libIdx = library.findIndex(snd => snd.id === soundId);

      if (libIdx > -1) {
        library.splice(libIdx, 1);
        await game.settings.set('syrinscape', 'sound-library', library);

        this.render(true);
      }
    });

    sounds.find('.button').on('click', evt => {
      const el = evt.currentTarget;
      const { url } = el.dataset;

      if (url) {
        fetch(url, { mode: 'no-cors' });
      }
    });

    html.find('.button.add').on('click', async (evt) => {
      const uuid = randomID();
      const soundData = {
        id: uuid,
        name: 'New Sound',
        url: '',
        description: ''
      };

      const library: Array<any> = game.settings.get('syrinscape', 'sound-library') ?? [];
      library.push(soundData);
      await game.settings.set('syrinscape', 'sound-library', library);

      this.render(true);

      const dialog = new SoundDialogApplication(soundData);
      dialog.render(true);
    });
  }
}
