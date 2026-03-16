EXTENSION_UUID := power-switching-manager@joseruibarros.com
EXTENSION_DIR := $(HOME)/.local/share/gnome-shell/extensions/$(EXTENSION_UUID)
PACKAGE_FILES := constants.js extension.js LICENSE metadata.json prefs.js README.md schemas

.PHONY: install uninstall zip 

install: uninstall
	@echo "Installing extension to $(EXTENSION_DIR)"
	@rsync -a $(PACKAGE_FILES) "$(EXTENSION_DIR)/"
	@glib-compile-schemas "$(EXTENSION_DIR)/schemas"
	@echo "Compiled schemas in $(EXTENSION_DIR)/schemas"
	@echo "Installed. Restart GNOME Shell (Alt+F2 -> r) or log out/in to apply changes."

uninstall:
	@echo "Removing extension from $(EXTENSION_DIR)"
	@rm -rf "$(EXTENSION_DIR)"
	@echo "Removed. Restart GNOME Shell (Alt+F2 -> r) or log out/in to apply changes."

zip: 
	@echo "Creating distributable zip"
	@rm -f "$(EXTENSION_UUID).shell-extension.zip"
	@gnome-extensions pack \
	--extra-source="constants.js" \
	--extra-source="LICENSE" \
	--extra-source="README.md" 
	@echo "Created $(EXTENSION_UUID).shell-extension.zip"
