//
//  abcjs-plugin.js
//  Nya
//
//  Created by LunarEclipse on 2018/10/26.
//  Copyright © 2018 LunarEclipse. All rights reserved.
//

var path = require('path');
var ejs = require('ejs');
var fs = require('hexo-fs');

// Add str.format(args...) method.
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ?
                args[number] :
                match;
        });
    };
}

const LAYOUT_EJS = 'layout.ejs';
const FOOTER_EJS = 'footer.ejs';
const BODY_TAG = '</body>';

const PLACEHOLDER = '#@#score#@# id="{0}">#%#score#%#\n#@#div#@# id="{1}" class="abcjs-inline-midi">#%#div#%#\n'
const ABCJS_REBDER = '\
#@#script#@# type=\"text/javascript\"> \n \
ABCJS.renderAbc("{1}", "{0}", { \
    scale: 0.6, \
    staffwidth: 500 \
}); \n \
 \
ABCJS.renderMidi( \
    "{2}", \
    "{0}", \
    { \
        inlineControls: { \
            tempo: true, \
        }, \
    } \
); \
#%#script#%#'

var i = 0;
hexo.extend.tag.register("score", function(args, content){
    ++i;
    var canvasID = "abcjsx-canvas" + i;
    var midiID = "midi-" + i;
    var abc = content.replace(/\n/gim, " \\n\\\n").replace(/\"/gim, "\\\"");
    return PLACEHOLDER.format(canvasID, midiID) + ABCJS_REBDER.format(abc, canvasID,  midiID);
}, { ends: true });


var ejsRenderer = hexo.extend.renderer.get("ejs");
hexo.extend.renderer.register('ejs', 'html', function(data, options, callback) {
    var result;
    ejsRenderer(data, options, function(err, text) {
        result =  text;
    });

    if(result === undefined) 
        result = data.text;
    
    result = result
    .replace(/#@#score#@#/gim, "<score")
    .replace(/#%#score#%#/gim, "</score>")
    .replace(/#@#div#@#/gim, "<div")
    .replace(/#%#div#%#/gim, "</div>")
    .replace(/#@#script#@#/gim, "<script")
    .replace(/#%#script#%#/gim, "</script>");

    callback(null, result);
});


