ac.export("editor", function(env){
    "use strict";

    ac.import("palette", "maps", "board", "tilesets");

    var self = {
        FILE_PREFIX: 'AcrilicMap_',
        FILENAME_STORE: 'AcrilicMapFiles'
    };

    var File = ac.Class({
        init: function(id, tileset, map){
            this.id = id;
            this.tileset = tileset;
            this.map = map;
        },

        toJSON: function(){
            return JSON.stringify({
                id: this.id,
                tileset: this.tileset,
                map: this.map.toJSON()
            });
        }
    });

    var createFileFromJSON = function(json){
        try {
            var fileData = JSON.parse(json);
        } catch (err) {
            alert("Not a valid JSON: " + err);
            return;
        }
        var tileset = ac.tilesets.getTileset(fileData.tileset);
        var mapData = fileData.map;
        mapData.grids = mapData.grids.map(function(grid){
            var tileGrid = ac.utils.build2DArray(mapData.rows, mapData.cols);
            for(var row=0; row<mapData.rows; row++){
                for(var col=0; col<mapData.cols; col++){
                    tileGrid[row][col] = tileset.getTileByID(grid[row][col]);
                }
            }
            return tileGrid;
        });
        var map = ac.maps.createMapFrom(mapData);
        return new File(fileData.id, fileData.tileset, map);
    };

    var saveFile = function(file){
        var filename = self.FILE_PREFIX + file.id,
            files = getFiles();
        if(files.indexOf(filename) == -1){
            files = files.map(function(file){
                return self.FILE_PREFIX + file;
            })
            files.push(filename);
            localStorage.setItem(self.FILENAME_STORE, JSON.stringify(files));
        }
        localStorage.setItem(filename, file.toJSON());
    };

    var loadFile = function(filename){
        var filename = self.FILE_PREFIX + filename,
            fileData = localStorage.getItem(filename);
        if (! fileData){
            alert("File doesn't exist.");
        }
        return createFileFromJSON(fileData);
    };

    var createFile = function(id, rows, cols, tilesetID, map){
        var tileset = ac.tilesets.getTileset(tilesetID);
        var defaultTile = tileset.getDefaultTile();
        var map = ac.maps.createMap(rows, cols, defaultTile);
        return new File(id, tilesetID, map);
    };

    var getFiles = function(){
        var files = JSON.parse(localStorage.getItem(self.FILENAME_STORE)) || [];
        return files.map(function(file){
            return file.replace(self.FILE_PREFIX, "");
        });
    };

    var openFile = function(file){
        var tileset = ac.tilesets.getTileset(file.tileset);
        ac.board.loadMap(file.map, tileset);
        ac.palette.loadTileset(tileset);
        env.set("CURRENT_FILE", file);
    };

    return {
        createFile: createFile,
        createFileFromJSON: createFileFromJSON,
        openFile: openFile,
        saveFile: saveFile,
        loadFile: loadFile,
        getFiles: getFiles
    };
});
