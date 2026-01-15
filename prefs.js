import Adw from 'gi://Adw'
import Gtk from 'gi://Gtk'
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import { BATTERY_BRIGHTNESS_SETTING, POWER_BRIGHTNESS_SETTING, BATTERY_THEME_SETTING, POWER_THEME_SETTING } from './constants.js'

export default class PlainExamplePreferences extends ExtensionPreferences {
    #settings

    fillPreferencesWindow(window) {
        this.#settings = this.getSettings();

        const page = new Adw.PreferencesPage({
            title: 'Appearance',
            iconName: 'preferences-desktop-theme',
        });

        const group = new Adw.PreferencesGroup({
            title: 'Automatic Theme Switching',
            description: 'Choose which color scheme to use based on power state.',
        });

        page.add(group);

        // Battery theme
        group.add(this.#createThemeRow(
            'Theme on Battery',
            'Used when the device is running on battery power.',
            BATTERY_THEME_SETTING
        ));

        // Power theme
        group.add(this.#createThemeRow(
            'Theme when Plugged In',
            'Used when the device is connected to AC power.',
            POWER_THEME_SETTING
        ));

        // const screenBrightnessGroup = new Adw.PreferencesGroup({
        //     title: 'Screen Brightness',
        //     description: "CONA CONA CONA"
        // })

        // page.add(screenBrightnessGroup)

        // screenBrightnessGroup.add(this.#createBrightnessRow(
        //     'Breilho em bateria',
        //     'o brilho em bareria kek',
        //     BATTERY_BRIGHTNESS_SETTING
        // ))

        // screenBrightnessGroup.add(this.#createBrightnessRow(
        //     'Breilho em tomada',
        //     'o brilho em tomada kek',
        //     POWER_BRIGHTNESS_SETTING
        // ))

        window.add(page);

    }

    #createThemeRow(title, subtitle, key) {
        const model = new Gtk.StringList()
        model.append('Light')
        model.append('Dark')

        const row = new Adw.ActionRow({ title, subtitle })
        const combo = new Gtk.DropDown({ model })

        // Set initial value
        const current = this.#settings.get_string(key);
        const index = current === 'prefer-dark' ? 1 : 0;
        combo.set_selected(index);

        // Update setting when changed
        combo.connect('notify::selected', () => {
            this.#settings.set_string(key, combo.get_selected() === 1 ? 'prefer-dark' : 'default');
        });

        row.add_suffix(combo);
        row.activatableWidget = combo;

        return row;
    }

    // #createBrightnessRow(title, subtitle, key) {
    //     const brightnessSpinBox = new Gtk.SpinButton({
    //         adjustment: new Gtk.Adjustment({
    //             lower: 0,
    //             upper: 1,
    //             step_increment: 0.1,
    //         }),
    //         valign: Gtk.Align.CENTER,
    //         value: this.#settings.get_double(key),
    //     });
    //     brightnessSpinBox.connect('value-changed', widget => this.#settings.set_double(key, widget.get_value()));
    //     const brightnessRow = new Adw.ActionRow({ title, subtitle });
    //     brightnessRow.add_suffix(brightnessSpinBox)
    //     brightnessRow.activatableWidget = brightnessSpinBox
    //     return brightnessRow
    // }
}
