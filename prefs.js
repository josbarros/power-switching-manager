/* SPDX-License-Identifier: GPL-2.0-or-later */

import Adw from 'gi://Adw'
import Gtk from 'gi://Gtk'
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js'
import { BATTERY_BRIGHTNESS_SETTING, POWER_BRIGHTNESS_SETTING, BATTERY_THEME_SETTING, POWER_THEME_SETTING, BATTERY_KEYBOARD_SETTING, POWER_KEYBOARD_SETTING } from './constants.js'

export default class PowerSwitchingManagerPreferences extends ExtensionPreferences {
    #settings

    fillPreferencesWindow(window) {
        this.#settings = this.getSettings()

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

        const screenBrightnessGroup = new Adw.PreferencesGroup({
            title: 'Screen Brightness',
            description: 'Automatically adjust screen brightness based on power state.'
        })

        page.add(screenBrightnessGroup)

        screenBrightnessGroup.add(this.#createBrightnessRow(
            'Brightness on Battery',
            'Used when the device is running on battery power.',
            BATTERY_BRIGHTNESS_SETTING
        ))

        screenBrightnessGroup.add(this.#createBrightnessRow(
            'Brightness when Plugged In',
            'Used when the device is connected to AC power.',
            POWER_BRIGHTNESS_SETTING
        ))

        const keyboardBacklightGroup = new Adw.PreferencesGroup({
            title: 'Keyboard Backlight',
            description: 'Automatically adjust keyboard backlight based on power state.'
        })

        page.add(keyboardBacklightGroup)

        keyboardBacklightGroup.add(this.#createKeyboardRow(
            'Backlight on Battery',
            'Used when the device is running on battery power.',
            BATTERY_KEYBOARD_SETTING
        ))

        keyboardBacklightGroup.add(this.#createKeyboardRow(
            'Backlight when Plugged In',
            'Used when the device is connected to AC power.',
            POWER_KEYBOARD_SETTING
        ))

        window.add(page);
    }

    #createThemeRow(title, subtitle, key) {
        const model = new Gtk.StringList()
        model.append('Light')
        model.append('Dark')

        const row = new Adw.ActionRow({ title, subtitle })
        const combo = new Gtk.DropDown({ model })

        // Set initial value
        const current = this.#settings.get_string(key)
        const index = current === 'prefer-dark' ? 1 : 0
        combo.set_selected(index)

        // Update setting when changed
        combo.connect('notify::selected', () =>
            this.#settings.set_string(key, combo.get_selected() === 1 ? 'prefer-dark' : 'default')
        )

        row.add_suffix(combo)
        row.activatableWidget = combo

        return row
    }

    #createBrightnessRow(title, subtitle, key) {
        const adjustment = new Gtk.Adjustment({
            lower: 0,
            upper: 100,
            step_increment: 10
        })

        const brightnessSpinBox = new Gtk.SpinButton({
            adjustment,
            valign: Gtk.Align.CENTER
        });

        brightnessSpinBox.set_value(this.#settings.get_double(key) * 100)
        brightnessSpinBox.connect('value-changed', () =>
            this.#settings.set_double(key, brightnessSpinBox.get_value() / 100)
        )

        const brightnessRow = new Adw.ActionRow({ title, subtitle })
        brightnessRow.add_suffix(brightnessSpinBox)
        brightnessRow.activatableWidget = brightnessSpinBox
        return brightnessRow
    }

    #createKeyboardRow(title, subtitle, key) {
        const model = new Gtk.StringList()
        model.append('Off')
        model.append('Max Light')

        const row = new Adw.ActionRow({ title, subtitle })
        const combo = new Gtk.DropDown({ model })

        // Set initial value
        const current = this.#settings.get_int(key)
        const index = current === 100 ? 1 : 0
        combo.set_selected(index)

        // Update setting when changed
        combo.connect('notify::selected', () =>
            this.#settings.set_int(key, combo.get_selected() === 1 ? 100 : 0)
        )

        row.add_suffix(combo)
        row.activatableWidget = combo

        return row
    }
}
