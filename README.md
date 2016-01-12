# Oxygen
Intended to be a SUPER Lightweight WebGL 2D Display List for drawing and animating objects in WebGL

File size: **6.5kb**

Below is an example of how to use with a 256 x 256 texture named `nehe.gif`.
```
<html>
    <head>
      <style>
      canvas {
        border: 3px solid red;
      }
      </style>
    </head>
    <body>
        <canvas id="mycanvas" width="300" height="400"></canvas>
        <script src="../src/O.js"></script>
        <script>

            var _o = new O.Canvas('mycanvas');
            var _o2;
            var _s;
            var _s2;
            var _s3;

            _t = new Image();
            _t.src = "nehe.gif";
            _t.onload = function () {

              _o2 = new O.Canvas(500, 500);
              document.body.appendChild(_o2.el);

              _s2 = new O.Sprite(_t);
              _s2.sy = 0.5;
              _s2.ox = 100;
              _s2.oy = 100;
              _o2.addChild(_s2);

              _s3 = new O.Sprite(_t);
              _o.addChild(_s3);

              _s = new O.Sprite(_t);
              _s.s = 0.7;
              _o.addChild(_s);

              requestAnimationFrame(render);

              delta = 0;
            }

            function render() {

                delta += 0.1;

                _o.render();
                _o2.render();

                _s.x = Math.sin(delta) * 100;
                _s.y = Math.cos(delta) * 100;

                _s2.r -= 1;
                _s2.sx = Math.sin(delta);
                requestAnimationFrame(render);

            }
        </script>
    </body>
</html>

```
