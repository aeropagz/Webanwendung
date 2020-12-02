(function() {
    var _onload = function() {
        var pretag = document.getElementById('d');
        var canvastag = document.getElementById('canvasdonut');

        var intervalASCII = undefined,
            intervalCanvas = undefined;
        var A = 0,
            B = 0;

        // This is copied, pasted, reformatted, and ported directly from my original
        // donut.c code
        var asciiframe = function() {
            var b = [];
            var z = [];
            A += 0.07;
            B += 0.03;
            var cA = Math.cos(A),
                sA = Math.sin(A),
                cB = Math.cos(B),
                sB = Math.sin(B);
            for (var k = 0; k < 1760; k++) {
                b[k] = k % 80 == 79 ? "\n" : " ";
                z[k] = 0;
            }
            for (var j = 0; j < 6.28; j += 0.07) { // j <=> theta
                var ct = Math.cos(j),
                    st = Math.sin(j);
                for (i = 0; i < 6.28; i += 0.02) { // i <=> phi
                    var sp = Math.sin(i),
                        cp = Math.cos(i),
                        h = ct + 2, // R1 + R2*cos(theta)
                        D = 1 / (sp * h * sA + st * cA + 5), // this is 1/z
                        t = sp * h * cA - st * sA; // this is a clever factoring of some of the terms in x' and y'

                    var x = 0 | (40 + 30 * D * (cp * h * cB - t * sB)),
                        y = 0 | (12 + 15 * D * (cp * h * sB + t * cB)),
                        o = x + 80 * y,
                        N = 0 | (8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));
                    if (y < 22 && y >= 0 && x >= 0 && x < 79 && D > z[o]) {
                        z[o] = D;
                        b[o] = ".,-~:;=!*#$@" [N > 0 ? N : 0];
                    }
                }
            }
            pretag.innerHTML = b.join("");
        };

        window.anim1 = function() {
            if (intervalASCII === undefined) {
                intervalASCII = setInterval(asciiframe, 50);
            } else {
                clearInterval(intervalASCII);
                intervalASCII = undefined;
            }
        };

        // This is a reimplementation according to my math derivation on the page
        var R1 = 1;
        var R2 = 2;
        var K1 = 150;
        var K2 = 5;
        var canvasframe = function() {
            var ctx = canvastag.getContext('2d');
            ctx.fillStyle = '#f88282';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            if (intervalASCII === undefined) { // only update A and B if the first animation isn't doing it already
                A += 0.07;
                B += 0.03;
            }
            // precompute cosines and sines of A, B, theta, phi, same as before
            var cosinusA = Math.cos(A),
                sinusA = Math.sin(A),
                cosinusB = Math.cos(B),
                sinusB = Math.sin(B);
            for (var theta = 0; theta < 6.28; theta += 0.3) { // j <=> theta
                var cosinusTheta = Math.cos(theta),
                    sinusTheta = Math.sin(theta); // cosine theta, sine theta
                for (var phi = 0; phi < 6.28; phi += 0.1) { // i <=> phi
                    var sinusPhi = Math.sin(phi),
                        cosinusPhi = Math.cos(phi); // cosine phi, sine phi
                    var objectX = R2 + R1 * cosinusTheta, // object x, y = (R2,0,0) + (R1 cos theta, R1 sin theta, 0)
                        objectY = R1 * sinusTheta;


                    var x = objectX * (cosinusB * cosinusPhi + sinusA * sinusB * sinusPhi) - objectY * cosinusA * sinusB; // final 3D x coordinate
                    var y = objectX * (sinusB * cosinusPhi - sinusA * cosinusB * sinusPhi) + objectY * cosinusA * cosinusB; // final 3D y
                    var zKehrwert = 1 / (K2 + cosinusA * objectX * sinusPhi + sinusA * objectY); // one over z
                    var screenX = (150 + K1 * zKehrwert * x); // x' = screen space coordinate, translated and scaled to fit our 320x240 canvas element
                    var screenY = (120 - K1 * zKehrwert * y); // y' (it's negative here because in our output, positive y goes down but in our 3D space, positive y goes up)
                    // luminance, scaled back to 0 to 1
                    var helligkeit = 0.7 * (cosinusPhi * cosinusTheta * sinusB - cosinusA * cosinusTheta * sinusPhi - sinusA * sinusTheta + cosinusB * (cosinusA * sinusTheta - cosinusTheta * sinusA * sinusPhi));
                    if (helligkeit > 0) {
                        ctx.fillStyle = 'rgba(0,0,0,' + helligkeit + ')';
                        ctx.fillRect(screenX, screenY, 1.5, 1.5);
                    }
                }
            }
        }


        window.anim2 = function() {
            if (intervalCanvas === undefined) {
                intervalCanvas = setInterval(canvasframe, 50);
            } else {
                clearInterval(intervalCanvas);
                intervalCanvas = undefined;
            }
        };

        asciiframe();
        canvasframe();
    }

    if (document.all)
        window.attachEvent('onload', _onload);
    else
        window.addEventListener("load", _onload, false);
})();