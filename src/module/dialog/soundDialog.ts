import { SyrinscapeDialogApplication } from "./syrinscapeDialog";

export class SoundDialogApplication extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'modules/syrinscape/templates/dialog/sound-dialog.html',
      classes: ['syrinscape', 'sound-dialog'],

      width: 400,
      height: 250,
      resizable: true,

      background: '#000',

      closeOnSubmit: false,
      submitOnClose: true,
      submitOnChange: true
    });
  }

  sound: any;

  constructor(sound: Object) {
    super(sound);

    this.sound = sound;
  }

  getData() {
    const data = super.getData();

    const { sound } = this;

    mergeObject(data, sound);

    return data;
  }

  async _updateObject(_event, formData) {
    const library: Array<any> = game.settings.get('syrinscape', 'sound-library') ?? [];
    const { sound } = this;

    const libIdx = library.findIndex(snd => snd.id === sound.id);
    const libSound = library[libIdx];

    mergeObject(libSound, formData);

    library[libIdx] = libSound;

    await game.settings.set('syrinscape', 'sound-library', library);

    SyrinscapeDialogApplication.reloadDialog();
  }
}
