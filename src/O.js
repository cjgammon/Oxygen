var mat4 = {
  scalar: {},
  SIMD: {},
};
mat4.create = function() {
    var out = new Float32Array(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

var O = {};
O.SHADERS = {
  vert: "\
      attribute vec3 aVertexPosition;\
  \
      uniform mat4 uMVMatrix;\
      uniform mat4 uPMatrix;\
  \
      void main(void) {\
          gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\
      }",
  frag: "\
      precision mediump float;\
  \
      void main(void) {\
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\
      }"
};

O.Canvas = function (w, h) {
  var inst = this;

  if (typeof(w) == "string") {
      inst.el = document.getElementById(w);
      inst.w = inst.el.width;
      inst.h = inst.el.height;
  } else {
      inst.el = document.createElement('canvas');
      inst.w = w;
      inst.h = h;
      inst.el.width = w;
      inst.el.height = h;
  }

  function getGL() {
    var gl;

    try {
      gl = inst.el.getContext("webgl") || inst.el.getContext("experimental-webgl");
      return gl;
    } catch(e) {
      console.error("problem initializing webgl.");
    }

    return null;
  }

  function setupGL() {
    inst.gl.viewportWidth = inst.el.width;
    inst.gl.viewportHeight = inst.el.height;
    inst.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    inst.gl.enable(inst.gl.DEPTH_TEST);
    inst.gl.depthFunc(inst.gl.LEQUAL);
  }

  inst.addChild = function (c) {
    c.setParent(inst);
    inst.children.push(c);
  };

  inst.addChildAtIndex = function (c, index) {
    inst.children.splice(index, 0, c);
  };

  inst.removeChild = function (c) {
    var i;

    for (i = 0; i < inst.children.length; i += 1) {
      if (inst.children[i] == c) {
        inst.children.splice(i, 1);
      }
    }
  };

  inst.render = function () {
    var i;

    inst.gl.viewport(0, 0, inst.gl.viewportWidth, inst.gl.viewportHeight);
    inst.gl.clear(inst.gl.COLOR_BUFFER_BIT | inst.gl.DEPTH_BUFFER_BIT);

    for (i = 0; i < inst.children.length; i += 1) {
        inst.children[i].render();
    }
  }

  function init() {
    inst.gl = getGL();

    if (!inst.gl) {
      console.error("Unable to initialize WebGL. Your browser may not support it.");
      return;
    }

    setupGL();

    inst.children = [];
  }

  init();

};


O.Sprite = function (t) {
  var inst = this,
      vertexPositionBuffer,
      mvMatrix = mat4.create(),
      pMatrix = mat4.create(),
      shaderProgram,
      gl;

  this.ox = 0;
  this.oy = 0;
  this.x = 0;
  this.y = 0;
  this._sx = 1;
  this._sy = 1;
  this.r = 0;

  Object.defineProperties(inst, {
    "s": {
      "get": function() {
        return inst._sx;
      },
      "set": function(s) {
          inst._sx = s;
          inst._sy = s;
      }
    },
    "sx": {
      "get": function () {
        return inst._sx;
      },
       "set": function (sx) {
          inst._sx = sx;
       }
    },
    "sy": {
      "get": function () {
        return inst._sy;
      },
      "set": function (sy) {
        inst._sy = sy;
      }
    }
  });

  this.tex = t;

  function init() {
    vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    vertices = [
        0.5,  0.5,  0.0,
       -0.5,  0.5,  0.0,
        0.5, -0.5,  0.0,
       -0.5, -0.5,  0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numItems = 4;

    initShaders();
  };

  function getShader(type, str) {

    var shader;

    if (type == 'frag') {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == 'vert') {
      shader = gl.createShader(gl.VERTEX_SHADER);
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  };

  function initShaders() {
    var fragmentShader = getShader('frag', O.SHADERS.frag);
    var vertexShader = getShader('vert', O.SHADERS.vert);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  }

  inst.setParent = function (p) {
    inst.parent = p;
    gl = inst.parent.gl;
    init();
  }

  inst.render = function () {
    if (!gl) {
      return;
    }

    //position matrices
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, mvMatrix, [inst.x / gl.viewportWidth, inst.y / gl.viewportHeight, 0]);
    //mat4.translate(mvMatrix, [inst.ox, inst.oy, 0]);
    //mat4.rotate(mvMatrix, inst.r);
    //mat4.scale(mvMatrix, [inst._sx, inst._sy, 1]);
    //mat4.translate(mvMatrix, [-inst.x, -inst.y, 0]);
    //mat4.translate(mvMatrix, [-inst.ox, -inst.oy, 0]);

    //draw sprite
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPositionBuffer.numItems);

  }

};
