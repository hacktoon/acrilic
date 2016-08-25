.PHONY: build

build:
	mkdir -p build/
	inkscape -e data/tilesets/default/default.png -i tileset data/tilesets/default/default.svg
	cat lib/*.js src/acrilic.js data/**/**/data.js src/**/*.js main.js > build/Acrilic.js
