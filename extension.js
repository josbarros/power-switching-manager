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
    #gnomeSettings
    #client
    #settings

    #powerStatusChangeId
    #batteryThemeChangeId
    #powerThemeChangeId

    static #batterySetting = "battery-theme"
    static #powerSetting = "power-theme"

    enable() {
        this.#gnomeSettings = new Gio.Settings({ schema: 'org.gnome.desktop.interface' })
        this.#client = UPowerGlib.Client.new_full(null);
        // this.#settings = this.Settings()

        // this.#batteryThemeChangeId = this.#settings.connect(`changed::${PlainExampleExtension.#batterySetting}`,
        //     () => this.#applyBatteryTheme())
        // this.#powerThemeChangeId = this.#settings.connect(`changed::${PlainExampleExtension.#powerSetting}`,
        //     () => this.#applyPowerTheme())
        this.#powerStatusChangeId = this.#client.connect('notify::on-battery',
            () => this.#applyCurrentTheme())

        this.#applyCurrentTheme()
    }

    #applyBatteryTheme() {
        const isOnBattery = this.#client.onBattery
        if (!isOnBattery) {
            return
        }
        this.#applyThemeString(PlainExampleExtension.#batterySetting)
    }

    #applyPowerTheme() {
        const isOnPower = !this.#client.onBattery
        if (!isOnPower) {
            return
        }
        this.#applyThemeString(PlainExampleExtension.#powerSetting)
    }

    #applyCurrentTheme() {
        const themeString = this.#client.onBattery ?
            PlainExampleExtension.#batterySetting : PlainExampleExtension.#powerSetting
        this.#applyThemeString(themeString)
    }


    #applyThemeString(themeString) {
        // const theme = this.#settings.get_string(themeString)
        // if (!theme) {
        //     return
        // }
        const theme = themeString === PlainExampleExtension.#powerSetting ? "prefer-dark" : "default"
        this.#gnomeSettings.set_string('color-scheme', theme)
    }

    disable() {
        if (this.#batteryThemeChangeId) {
            this.#settings.disconnect(this.#batteryThemeChangeId)
            this.#batteryThemeChangeId = null
        }

        if (this.#powerThemeChangeId) {
            this.#settings.disconnect(this.#powerThemeChangeId)
            this.#powerThemeChangeId = null
        }

        if (this.#powerStatusChangeId) {
            this.#client.disconnect(this.#powerStatusChangeId)
            this.#powerStatusChangeId = null
        }

        this.#settings = null
        this.#gnomeSettings = null
        this.#client = null
    }
}
