import { syrinUpdate } from "../util";
import { SyrinscapeDialogApplication } from "./syrinscapeDialog";

export class SoundDialogApplication extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: 'Syrinscape - Sound',

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

  constructor(sound: any) {
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
    const { sound } = this;

    await game.settings.set('syrinscape', 'sound-library', syrinUpdate(sound.id, formData));

    SyrinscapeDialogApplication.reloadDialog();
  }
}
