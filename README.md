# Power Switching Manager

A GNOME Shell extension that automatically switches your theme, screen brightness, and keyboard backlight based on whether your device is running on battery power or plugged into AC power.

## Features

- **Automatic Theme Switching**: Seamlessly switch between light and dark themes depending on power state
- **Screen Brightness Control**: Automatically adjust screen brightness when switching between battery and AC power
- **Keyboard Backlight Management**: Control keyboard backlight intensity based on power state
- **Persistent Settings**: Your preferences are saved and applied whenever power state changes

## Installation

### From Source

1. Clone or download this extension to your local GNOME extensions directory:
   ```bash
   git clone https://github.com/yourusername/power-switching-manager ~/.local/share/gnome-shell/extensions/power-switching-manager
   ```

2. Compile the GSettings schema:
   ```bash
   glib-compile-schemas ~/.local/share/gnome-shell/extensions/power-switching-manager/schemas/
   ```

3. Enable the extension:
   - Using GNOME Tweaks or the Extensions app
   - Or via command line: `gnome-extensions enable power-switching-manager@joseruibarros.com`

## Configuration

Access the extension preferences through:
- GNOME Extensions app (search for "Power Switching Manager")
- GNOME Tweaks > Extensions > Power Switching Manager

### Available Settings

- **Theme on Battery**: Choose which color scheme to use when running on battery power
- **Theme when Plugged In**: Choose which color scheme to use when connected to AC power
- **Brightness on Battery**: Set screen brightness level for battery mode
- **Brightness when Plugged In**: Set screen brightness level for AC mode
- **Backlight on Battery**: Set keyboard backlight intensity on battery power
- **Backlight when Plugged In**: Set keyboard backlight intensity on AC power

## Compatibility

- GNOME Shell 45, 46, 47, 48, 49

## License

This project is licensed under the GNU General Public License v2.0 or later. See the [LICENSE](LICENSE) file for details.

## Author

Jose Rui Barros
