"use strict";
var swatches_1 = require("../colors/swatches");
var IOSDesign = (function () {
    function IOSDesign() {
        this.type = 'ios';
        this.primary = swatches_1.swatches.indigo.p500;
        this.primaryForeground = swatches_1.swatches.white;
        this.primaryLight = swatches_1.swatches.indigo.p100;
        this.primaryLightForeground = swatches_1.swatches.grey.p500;
        this.primaryDark = swatches_1.swatches.indigo.p700;
        this.primaryDarkForeground = swatches_1.swatches.white;
        this.accent = swatches_1.swatches.pink.a200;
        this.accentForeground = swatches_1.swatches.white;
        this.accentLight = swatches_1.swatches.pink.a100;
        this.accentLightForeground = swatches_1.swatches.white;
        this.accentDark = swatches_1.swatches.pink.a400;
        this.accentDarkForeground = swatches_1.swatches.white;
    }
    return IOSDesign;
}());
exports.IOSDesign = IOSDesign;
