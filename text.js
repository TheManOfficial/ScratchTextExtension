(function(ext) {

    var font; // Holds the loaded font object

    // Load font file from URL
    ext.loadFont = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
            if (this.status == 200) {
                var fontData = new Uint8Array(xhr.response);
                opentype.load(fontData, function(err, loadedFont) {
                    if (err) {
                        console.log("Error loading font: " + err);
                    } else {
                        font = loadedFont;
                        callback();
                    }
                });
            }
        };
        xhr.send();
    };

    // Spawn text with specified properties
    ext.spawnText = function(text, x, y, fontSize, color) {
        if (!font) {
            console.log("Font not loaded!");
            return;
        }
        var path = font.getPath(text, x, y, fontSize);
        var svg = path.toSVG();
        var element = new Image();
        element.src = 'data:image/svg+xml;base64,' + btoa(svg);
        element.style.color = color;
        document.body.appendChild(element);
    };

    // Cleanup function (optional)
    ext._shutdown = function() {};

    // Status reporting function (optional)
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    // Define block and menus
    var descriptor = {
        blocks: [
            [' ', 'Load font from URL %s', 'loadFont', ''],
            [' ', 'Spawn text %s at x: %n y: %n size: %n color: %s', 'spawnText', 'Hello, World!', 0, 0, 24, 'black']
        ],
        menus: {}
    };

    // Register the extension
    ScratchExtensions.register('TTF Text', descriptor, ext);

})({});