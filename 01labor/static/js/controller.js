(function() {
    var _onload = function() {
        var canvastag1 = document.getElementById('canvasdonut1');
        var canvastag2 = document.getElementById('canvasdonut2');

        var intervalCanvas2 = undefined,
            intervalCanvas1 = undefined;
        var AFirst = 0,
            BFirst = 0;
        var FirstR1 = 1;
        var FirstR2 = 2;
        var K1First = 150;
        var K2First = 5;
        var ASecond = 0,
            BSecond = 0;
        var SecondR1 = 1;
        var SecondR2 = 2;
        var K1Second = 150;
        var K2Second = 5;

        var canvasframe1 = function() {
            var ctx = canvastag1.getContext('2d');
            ctx.fillStyle = '#f88282';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            AFirst += 0.07;
            BFirst += 0.03;
            var cosinusA = Math.cos(AFirst),
                sinusA = Math.sin(AFirst),
                cosinusB = Math.cos(BFirst),
                sinusB = Math.sin(BFirst);

            //draw torus
            for (var theta = 0; theta < 6.28; theta += 0.3) {
                var cosinusTheta = Math.cos(theta),
                    sinusTheta = Math.sin(theta);
                for (var phi = 0; phi < 6.28; phi += 0.1) {
                    var sinusPhi = Math.sin(phi),
                        cosinusPhi = Math.cos(phi);
                    var objectX = FirstR2 + FirstR1 * cosinusTheta, // object x, y = (R2,0,0) + (R1 cos theta, R1 sin theta, 0)
                        objectY = FirstR1 * sinusTheta;


                    var x = objectX * (cosinusB * cosinusPhi + sinusA * sinusB * sinusPhi) - objectY * cosinusA * sinusB; // final 3D x coordinate
                    var y = objectX * (sinusB * cosinusPhi - sinusA * cosinusB * sinusPhi) + objectY * cosinusA * cosinusB; // final 3D y
                    var zKehrwert = 1 / (K2First + cosinusA * objectX * sinusPhi + sinusA * objectY); // one over z
                    var screenX = (150 + K1First * zKehrwert * x); // x' = screen space coordinate, translated and scaled to fit our 320x240 canvas element
                    var screenY = (120 - K1First * zKehrwert * y); // y' (it's negative here because in our output, positive y goes down but in our 3D space, positive y goes up)
                    // luminance, scaled back to 0 to 1
                    var helligkeit = 0.7 * (cosinusPhi * cosinusTheta * sinusB - cosinusA * cosinusTheta * sinusPhi - sinusA * sinusTheta + cosinusB * (cosinusA * sinusTheta - cosinusTheta * sinusA * sinusPhi));
                    if (helligkeit > 0) {
                        ctx.fillStyle = 'rgba(0,0,0,' + helligkeit + ')';
                        ctx.fillRect(screenX, screenY, 1.5, 1.5);

                    }
                }
            }


        }

        window.anim1 = function() {
            if (intervalCanvas1 === undefined) {
                intervalCanvas1 = setInterval(canvasframe1, 50);
            } else {
                clearInterval(intervalCanvas1);
                intervalCanvas1 = undefined;
            }
        };

        var canvasframe2 = function() {
            var InputAndTableElements = getInputAndTableElements();
            var rangeXRot = parseInt(InputAndTableElements.XRotation.input.value);
            var rangeYRot = parseInt(InputAndTableElements.YRotation.input.value);
            var tableX = InputAndTableElements.XRotation.table;
            var tableY = InputAndTableElements.YRotation.table;
            var tableDis = InputAndTableElements.Distance.table;
            var tableR1 = InputAndTableElements.R1.table;
            var tableR2 = InputAndTableElements.R2.table;
            var rangeR1 = parseInt(InputAndTableElements.R1.input.value);
            var rangeR2 = parseInt(InputAndTableElements.R2.input.value);
            var rangeDis = parseInt(InputAndTableElements.Distance.input.value);
            var checkX = document.getElementById('x-rotation').checked;
            var checkY = document.getElementById('y-rotation').checked;
            var switchX = checkX ? 1 : 0;
            var switchY = checkY ? 1 : 0;



            K2Second = rangeDis;
            SecondR1 = rangeR1;
            SecondR2 = rangeR2;

            var factorA = (rangeXRot / 100) * switchX;
            var factorB = (rangeYRot / 100) * switchY;

            tableDis.innerHTML = K2Second
            window.XInput = function(newVal) {
                tableX.innerHTML = (Math.ceil(newVal / 100 * 0.07 * 20 * 180 / Math.PI * 10) / 10) + "&#176/s";
            }
            window.YInput = function(newVal) {
                tableY.innerHTML = (Math.ceil(newVal / 100 * 0.07 * 20 * 180 / Math.PI * 10) / 10) + "&#176/s";
            }
            window.DisInput = function(newVal) {
                tableDis.innerHTML = newVal;
            }
            window.R1Input = function(newVal) {
                tableR1.innerHTML = newVal;
            }
            window.R2Input = function(newVal) {
                tableR2.innerHTML = newVal;
            }

            Object.keys(InputAndTableElements).forEach(element => {
                setEventListener(InputAndTableElements[element].input, InputAndTableElements[element].table);

            });

            var ctx = canvastag2.getContext('2d');
            ctx.fillStyle = '#f88282';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            if (checkX) {
                ASecond += 0.07 * factorA;

            }
            if (checkY) {
                BSecond += 0.03 * factorB;
            }

            // precompute cosines and sines of A, B, theta, phi, same as before
            var cosinusA = Math.cos(ASecond),
                sinusA = Math.sin(ASecond),
                cosinusB = Math.cos(BSecond),
                sinusB = Math.sin(BSecond);

            //draw torus 
            for (var theta = 0; theta < 6.28; theta += 0.3) {
                var cosinusTheta = Math.cos(theta),
                    sinusTheta = Math.sin(theta); // cosine theta, sine theta
                for (var phi = 0; phi < 6.28; phi += 0.1) {
                    var sinusPhi = Math.sin(phi),
                        cosinusPhi = Math.cos(phi); // cosine phi, sine phi

                    var objectX = SecondR2 + SecondR1 * cosinusTheta, // object x, y = (R2,0,0) + (R1 cos theta, R1 sin theta, 0)
                        objectY = SecondR1 * sinusTheta;
                    var x = objectX * (cosinusB * cosinusPhi + sinusA * sinusB * sinusPhi) - objectY * cosinusA * sinusB; // final 3D x coordinate
                    var y = objectX * (sinusB * cosinusPhi - sinusA * cosinusB * sinusPhi) + objectY * cosinusA * cosinusB; // final 3D y
                    var zKehrwert = 1 / (K2Second + cosinusA * objectX * sinusPhi + sinusA * objectY); // one over z
                    var screenX = (150 + K1Second * zKehrwert * x); // x' = screen space coordinate, translated and scaled to fit our 320x240 canvas element
                    var screenY = (120 - K1Second * zKehrwert * y); // y' (it's negative here because in our output, positive y goes down but in our 3D space, positive y goes up)
                    // luminance, scaled back to 0 to 1
                    var helligkeit = 0.7 * (cosinusPhi * cosinusTheta * sinusB - cosinusA * cosinusTheta * sinusPhi - sinusA * sinusTheta + cosinusB * (cosinusA * sinusTheta - cosinusTheta * sinusA * sinusPhi));
                    if (helligkeit > 0) {
                        ctx.fillStyle = 'rgba(0,0,0,' + helligkeit + ')';
                        ctx.fillRect(screenX, screenY, 1.5, 1.5);

                    }
                }
            }
            //draw x-y-axies
            for (var i = -30; i < 30; i += 0.08) {
                var x = i * (cosinusB * cosinusPhi + sinusA * sinusB * sinusPhi) - 0 * cosinusA * sinusB;
                var y = i * (sinusB * cosinusPhi - sinusA * cosinusB * sinusPhi) + 0 * cosinusA * cosinusB;
                var helligkeit = 0.7 * (cosinusPhi * cosinusTheta * sinusB - cosinusA * cosinusTheta * sinusPhi - sinusA * sinusTheta + cosinusB * (cosinusA * sinusTheta - cosinusTheta * sinusA * sinusPhi));
                var screenX = (150 + K1Second * x);
                var screenY = (120 - K1Second * y);
                ctx.fillStyle = 'rgba(0,0,0,' + 1 + ')';
                ctx.fillRect(screenX, screenY, 1.5, 1.5)

            }
            for (var i = -30; i < 30; i += 0.08) {
                var x = 0 * (cosinusB * cosinusPhi + sinusA * sinusB * sinusPhi) - i * cosinusA * sinusB;
                var y = 0 * (sinusB * cosinusPhi - sinusA * cosinusB * sinusPhi) + i * cosinusA * cosinusB;

                var screenX = (150 + K1Second * x);
                var screenY = (120 - K1Second * y);
                ctx.fillStyle = 'rgba(0,0,0,' + 1 + ')';
                ctx.fillRect(screenX, screenY, 1.5, 1.5)

            }
        }
        var getInputAndTableElements = function() {
            var rangeXRotObj = document.getElementById('x-rotation-speed');
            var rangeYRotObj = document.getElementById('y-rotation-speed');
            var rangeR1Obj = document.getElementById('R1');
            var rangeR2Obj = document.getElementById('R2');
            var rangeDisObj = document.getElementById('distance');
            var tableX = document.getElementById('tableXRot2');
            var tableY = document.getElementById('tableYRot2');
            var tableR1 = document.getElementById('tableR1');
            var tableR2 = document.getElementById('tableR2');
            var tableDis = document.getElementById('tableDis2');
            return {
                XRotation: {
                    input: rangeXRotObj,
                    table: tableX
                },
                YRotation: {
                    input: rangeYRotObj,
                    table: tableY
                },
                R1: {
                    input: rangeR1Obj,
                    table: tableR1
                },
                R2: {
                    input: rangeR2Obj,
                    table: tableR2
                },
                Distance: {
                    input: rangeDisObj,
                    table: tableDis
                }
            }
        }

        var setEventListener = function(inputObj, tableObj) {
            inputObj.addEventListener("mouseenter", function(event) {
                tableObj.style.backgroundColor = "#E1B9B9";
            });
            inputObj.addEventListener("mouseleave", function(event) {
                tableObj.style.backgroundColor = "white";
            });
        }

        window.anim2 = function() {
            if (intervalCanvas2 === undefined) {
                intervalCanvas2 = setInterval(canvasframe2, 50);
            } else {
                clearInterval(intervalCanvas2);
                intervalCanvas2 = undefined;
            }
        };

        canvasframe1();
        canvasframe2();

        window.anim3 = function() {
            window.anim1();
            window.anim2();
        }
    }

    if (document.all)
        window.attachEvent('onload', _onload);
    else
        window.addEventListener("load", _onload, false);
})();