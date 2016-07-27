.PHONY: build

build:
	mkdir -p build/
	cat lib/*.js src/acrilic.js src/**/*.js main.js > build/Acrilic.js
	inkscape -e tilesets/default/bg.png -i bg tilesets/default/default.svg
