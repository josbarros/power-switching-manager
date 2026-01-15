/* SPDX-License-Identifier: GPL-2.0-or-later */

import {
    BATTERY_BRIGHTNESS_SETTING, POWER_BRIGHTNESS_SETTING,
    BATTERY_THEME_SETTING, POWER_THEME_SETTING,
    BATTERY_KEYBOARD_SETTING, POWER_KEYBOARD_SETTING
} from './constants.js'
const GNOME_THEME_SETTING = "color-scheme"

import Gio from 'gi://Gio'
import UPowerGlib from 'gi://UPowerGlib'

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js'
import * as Main from 'resource:///org/gnome/shell/ui/main.js'

import { loadInterfaceXML } from 'resource:///org/gnome/shell/misc/fileUtils.js'
const BrightnessInterface = loadInterfaceXML('org.gnome.SettingsDaemon.Power.Keyboard');
const BrightnessProxy = Gio.DBusProxy.makeProxyWrapper(BrightnessInterface);

export default class PowerSwitchingManagerExtension extends Extension {
    #gnomeSettingsClient
    #powerClient
    #userSettingsClient
    #keyboardClient

    enable() {
        this.#gnomeSettingsClient = new Gio.Settings({ schema_id: 'org.gnome.desktop.interface' })
        this.#powerClient = UPowerGlib.Client.new();
        this.#userSettingsClient = this.getSettings()
        this.#keyboardClient = new BrightnessProxy(Gio.DBus.session, 'org.gnome.SettingsDaemon.Power', '/org/gnome/SettingsDaemon/Power')

        const themeHandler = x => { if (this.#powerClient.onBattery === x) this.#applyTheme(x) }
        const brightnessHandler = x => { if (this.#powerClient.onBattery === x) this.#applyBrightness(x) }
        const backlightHandler = x => { if (this.#powerClient.onBattery === x) this.#applyBacklight(x) }

        this.#userSettingsClient.connectObject(`changed::${BATTERY_THEME_SETTING}`, () => themeHandler(true), this)
        this.#userSettingsClient.connectObject(`changed::${POWER_THEME_SETTING}`, () => themeHandler(false), this)
        this.#userSettingsClient.connectObject(`changed::${BATTERY_BRIGHTNESS_SETTING}`, () => brightnessHandler(true), this)
        this.#userSettingsClient.connectObject(`changed::${POWER_BRIGHTNESS_SETTING}`, () => brightnessHandler(false), this)
        this.#userSettingsClient.connectObject(`changed::${BATTERY_KEYBOARD_SETTING}`, () => backlightHandler(true), this)
        this.#userSettingsClient.connectObject(`changed::${POWER_KEYBOARD_SETTING}`, () => backlightHandler(false), this)

        this.#powerClient.connectObject('notify::on-battery', () => this.#doAll(), this)

        this.#doAll()
    }

    #doAll() {
        const isOnBattery = this.#powerClient.onBattery
        this.#applyBrightness(isOnBattery)
        this.#applyTheme(isOnBattery)
        this.#applyBacklight(isOnBattery)
    }

    #applyBrightness(isOnBattery) {
        if (!Main.brightnessManager?.globalScale) {
            return
        }
        const desiredBrightnessSetting = isOnBattery ? BATTERY_BRIGHTNESS_SETTING : POWER_BRIGHTNESS_SETTING
        const newValue = this.#userSettingsClient.get_double(desiredBrightnessSetting)
        const currentValue = Main.brightnessManager.globalScale.value
        if (newValue === currentValue) {
            return // avoid rewritting the same value as the consequences are not known
        }
        Main.brightnessManager.globalScale.value = newValue
    }

    #applyTheme(isOnBattery) {
        const desiredThemeSetting = isOnBattery ? BATTERY_THEME_SETTING : POWER_THEME_SETTING
        const newTheme = this.#userSettingsClient.get_string(desiredThemeSetting)
        const currentTheme = this.#gnomeSettingsClient.get_string(GNOME_THEME_SETTING)
        if (newTheme === currentTheme) {
            return // avoid rewritting the same string as the consequences are not known
        }
        this.#gnomeSettingsClient.set_string(GNOME_THEME_SETTING, newTheme)
    }

    #applyBacklight(isOnBattery) {
        const desiredKeyboardSetting = isOnBattery ? BATTERY_KEYBOARD_SETTING : POWER_KEYBOARD_SETTING
        const newValue = this.#userSettingsClient.get_int(desiredKeyboardSetting)
        const currentValue = this.#keyboardClient.Brightness
        if (currentValue === newValue) {
            return
        }
        this.#keyboardClient.Brightness = newValue
    }

    disable() {
        this.#userSettingsClient?.disconnectObject(this)
        this.#powerClient?.disconnectObject(this)

        this.#userSettingsClient = null
        this.#gnomeSettingsClient = null
        this.#powerClient = null
        this.#keyboardClient = null
    }
}
