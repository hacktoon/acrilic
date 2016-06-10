.PHONY: build

build:
	mkdir -p build/
	cat lib/*.js src/acrilic.js src/**/*.js main.js > build/Acrilic.js
