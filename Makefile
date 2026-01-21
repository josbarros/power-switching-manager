EXTENSION_UUID := power-switching-manager@joseruibarros.com
EXTENSION_DIR := $(HOME)/.local/share/gnome-shell/extensions/$(EXTENSION_UUID)
SRC := .
SCHEMA_DIR := schemas
SCHEMA_XML := $(SCHEMA_DIR)/org.gnome.shell.extensions.power-switching-manager.gschema.xml
COMPILED_SCHEMAS := $(SCHEMA_DIR)/gschemas.compiled

.PHONY: all install uninstall compile-schemas zip clean dist

all: compile-schemas

install: compile-schemas
	@echo "Installing extension to $(EXTENSION_DIR)"
	@mkdir -p "$(EXTENSION_DIR)"
	@rsync -a --exclude='.git' --exclude='*.zip' --exclude='gschemas.compiled' $(SRC)/ "$(EXTENSION_DIR)/"
	@echo "Installed. Restart GNOME Shell (Alt+F2 -> r) or log out/in to apply changes."

uninstall:
	@echo "Removing extension from $(EXTENSION_DIR)"
	@rm -rf "$(EXTENSION_DIR)"
	@echo "Removed. Restart GNOME Shell (Alt+F2 -> r) or log out/in to apply changes."

compile-schemas:
	@if [ -f "$(SCHEMA_XML)" ]; then \
		if ! command -v glib-compile-schemas >/dev/null 2>&1; then \
			echo "glib-compile-schemas not found in PATH"; exit 1; \
		fi; \
		glib-compile-schemas "$(SCHEMA_DIR)"; \
		echo "Compiled schemas to $(COMPILED_SCHEMAS)"; \
	else \
		echo "No schema XML found at $(SCHEMA_XML) — skipping compile"; \
	fi

clean:
	@rm -f $(EXTENSION_UUID).shell-extension.zip
	@rm -f "$(COMPILED_SCHEMAS)"
	@echo "Cleaned build artifacts"

zip: clean
	@echo "Creating distributable zip"
	@gnome-extensions pack \
	--extra-source="constants.js" \
	--extra-source="LICENSE" \
	--extra-source="README.md" 
	@echo "Created $(EXTENSION_UUID).shell-extension.zip"

dist: zip
