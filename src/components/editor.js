ac.export("editor", function(env){
    "use strict";

    ac.import("palette", "maps", "board", "tilesets");

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

    var saveFile = function(file){

    };

    var createFile = function(id, rows, cols, tilesetID, map){
        var tileset = ac.tilesets.getTileset(tilesetID);
        var defaultTile = tileset.getDefaultTile();
        var map = ac.maps.createMap(rows, cols, defaultTile);
        return new File(id, tilesetID, map);
    };

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

    var openFile = function(file){
        var tileset = ac.tilesets.getTileset(file.tileset);
        ac.board.loadFile(file.map, tileset);
        ac.palette.loadTileset(tileset);
        env.set("CURRENT_FILE", file);
    };

    return {
        createFile: createFile,
        createFileFromJSON: createFileFromJSON,
        openFile: openFile,
        saveFile: saveFile
    };
});
