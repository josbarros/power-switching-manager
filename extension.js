/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import Gio from 'gi://Gio';
import UPowerGlib from 'gi://UPowerGlib';

export default class PlainExampleExtension extends Extension {
    #gnomeSettingsClient
    #powerClient
    #userSettingsClient

    #powerStatusChangeId
    #batteryThemeChangeId
    #powerThemeChangeId

    static #BATTERY_USER_SETTING = "battery-theme"
    static #POWER_USER_SETTING = "power-theme"
    static #GNOME_THEME_SETTING = "color-scheme"

    enable() {
        this.#gnomeSettingsClient = new Gio.Settings({ schema: 'org.gnome.desktop.interface' })
        this.#powerClient = UPowerGlib.Client.new_full(null);
        // this.#settings = this.Settings()

        // this.#batteryThemeChangeId = this.#settings.connect(`changed::${PlainExampleExtension.#batterySetting}`,
        //     () => if(this.#powerClient.onBattery) this.#applyTheme())
        // this.#powerThemeChangeId = this.#settings.connect(`changed::${PlainExampleExtension.#powerSetting}`,
        //     () => if(!this.#powerCLient.onBattery) this.#applyTheme())
        this.#powerStatusChangeId = this.#powerClient.connect('notify::on-battery',
            () => this.#applyTheme())

        this.#applyTheme()
    }

    #applyTheme() {
        const isOnBattery = this.#powerClient.onBattery
        const desiredThemeSetting = isOnBattery ?
            PlainExampleExtension.#BATTERY_USER_SETTING : PlainExampleExtension.#POWER_USER_SETTING

        const newTheme = isOnBattery ? "default" : "prefer-dark"
        // const newTheme = this.#settings.get_string(desiredThemeSetting)
        if (!newTheme) {
            return
        }
        const currentTheme = this.#gnomeSettingsClient.get_string(PlainExampleExtension.#GNOME_THEME_SETTING)
        if (newTheme === currentTheme) {
            return // avoid rewritting the same string as the consequences are not known
        }
        this.#gnomeSettingsClient.set_string(PlainExampleExtension.#GNOME_THEME_SETTING, newTheme)
    }

    disable() {
        if (this.#batteryThemeChangeId) {
            this.#userSettingsClient.disconnect(this.#batteryThemeChangeId)
            this.#batteryThemeChangeId = null
        }

        if (this.#powerThemeChangeId) {
            this.#userSettingsClient.disconnect(this.#powerThemeChangeId)
            this.#powerThemeChangeId = null
        }

        if (this.#powerStatusChangeId) {
            this.#powerClient.disconnect(this.#powerStatusChangeId)
            this.#powerStatusChangeId = null
        }

        this.#userSettingsClient = null
        this.#gnomeSettingsClient = null
        this.#powerClient = null
    }
}
