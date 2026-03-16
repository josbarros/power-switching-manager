EXTENSION_UUID := power-switching-manager@joseruibarros.com
EXTENSION_DIR := $(HOME)/.local/share/gnome-shell/extensions/$(EXTENSION_UUID)
PACKAGE_FILES := extension.js metadata.json prefs.js constants.js LICENSE README.md \
./schemas/org.gnome.shell.extensions.power-switching-manager.gschema.xml 

.PHONY: install uninstall zip 

install: uninstall
	@echo "Installing extension to $(EXTENSION_DIR)"
	@if ! command -v rsync >/dev/null 2>&1; then echo "rsync not found in PATH"; exit 1; fi
	@if ! command -v glib-compile-schemas >/dev/null 2>&1; then echo "glib-compile-schemas not found in PATH"; exit 1; fi
	@rsync -aR $(PACKAGE_FILES) "$(EXTENSION_DIR)/"
	@glib-compile-schemas "$(EXTENSION_DIR)/schemas"
	@echo "Compiled schemas in $(EXTENSION_DIR)/schemas"
	@echo "Installed. Restart GNOME Shell (Alt+F2 -> r) or log out/in to apply changes."

uninstall:
	@echo "Removing extension from $(EXTENSION_DIR)"
	@rm -rf "$(EXTENSION_DIR)"
	@echo "Removed. Restart GNOME Shell (Alt+F2 -> r) or log out/in to apply changes."

zip: 
	@echo "Creating distributable zip"
	@if ! command -v zip >/dev/null 2>&1; then echo "zip not found in PATH"; exit 1; fi
	@rm -f "$(EXTENSION_UUID).zip"
	@zip -r "$(EXTENSION_UUID).zip" $(PACKAGE_FILES)
	@echo "Created $(EXTENSION_UUID).zip"
