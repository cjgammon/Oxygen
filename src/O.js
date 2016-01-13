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
mat4.rotate = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};


var O = {};
O.SHADERS = {
  vert: "\
    attribute vec3 aVertexPosition;\
    attribute vec2 aTextureCoord;\
\
    uniform mat4 uMVMatrix;\
    uniform mat4 uPMatrix;\
\
    varying vec2 vTextureCoord;\
\
    void main(void) {\
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\
        vTextureCoord = aTextureCoord;\
    }",
  frag: "\
    precision mediump float;\
    varying vec2 vTextureCoord;\
    uniform sampler2D uSampler;\
\
    void main(void) {\
        gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\
    }"
};

O.Canvas = function (w, h, opts) {
  var inst = this,
      gl,
      _contextOptions = opts || {alpha: false};

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
    var _gl;

    try {
      _gl = inst.el.getContext("webgl", _contextOptions) || inst.el.getContext("experimental-webgl", _contextOptions);
      return _gl;
    } catch(e) {
      console.error("problem initializing webgl.");
    }

    return null;
  }

  function setupGL() {
    inst.gl.viewportWidth = inst.el.width;
    inst.gl.viewportHeight = inst.el.height;
    if (_contextOptions.alpha) {
      inst.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    } else {
      inst.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    }
    inst.gl.enable(inst.gl.DEPTH_TEST);
    inst.gl.depthFunc(inst.gl.LEQUAL);
  }

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
    var fragmentShader = getShader('frag', O.SHADERS.frag),
        vertexShader = getShader('vert', O.SHADERS.vert);

    shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error("Could not initialise shaders");
      console.error(gl.getProgramInfoLog(shaderProgram));
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    inst.shaderProgram = shaderProgram;
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

  inst.createTexture = function (img, cb) {
    return new O.Texture(inst.gl, img, cb);
  }

  inst.createSprite = function () {
    //return new O.Sprite();
  }

  inst.render = function () {
    var i;

    inst.gl.viewport(0, 0, inst.gl.viewportWidth, inst.gl.viewportHeight);
    inst.gl.clear(inst.gl.COLOR_BUFFER_BIT | inst.gl.DEPTH_BUFFER_BIT);

    inst.gl.blendFunc(inst.gl.SRC_ALPHA, inst.gl.ONE_MINUS_SRC_ALPHA);
    inst.gl.enable(inst.gl.BLEND);

    for (i = 0; i < inst.children.length; i += 1) {
        inst.children[i].render();
    }
  }

  function init() {
    inst.gl = getGL();
    gl = inst.gl;
    inst.gl.x = Math.random();

    if (!inst.gl) {
      console.error("Unable to initialize WebGL. Your browser may not support it.");
      return;
    }

    setupGL();
    initShaders();

    inst.children = [];
  }

  init();

};

//TODO:: manage sprite sheet cropping
O.Sprite = function (t) {
  var inst = this,
      vertexPositionBuffer,
      mvMatrix = mat4.create(),
      pMatrix = mat4.create(),
      vertexPositionBuffer,
      vertexTextureCoordBuffer,
      vertexIndexBuffer,
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

  function init() {
    initBuffers();
  };

  //TODO:: move this outside of sprite?
  function initBuffers() {

    var vertices,
        textureCoords,
        vertexIndices,
        _w = t.tex.image.width / inst.parent.w,
        _h = t.tex.image.height / inst.parent.h;

    vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    vertices = [
        _w,  _h,  0.0, -_w,  _h,  0.0,
        _w, -_h,  0.0, -_w, -_h,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numItems = 4;

    vertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
    textureCoords = [
        // Front face
        1.0, 0.0,
        0.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    vertexTextureCoordBuffer.itemSize = 2;
    vertexTextureCoordBuffer.numItems = 6;

    vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
    vertexIndices = [
      0, 1, 2, 0, 2, 3,    // Front face
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
    vertexIndexBuffer.itemSize = 1;
    vertexIndexBuffer.numItems = 6;
  }

  inst.setParent = function (p) {
    inst.parent = p;
    shaderProgram = inst.parent.shaderProgram;
    gl = inst.parent.gl;

    init();
  }

  inst.render = function () {
    if (!gl || !shaderProgram) {
      return;
    }

    //position matrices
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, mvMatrix, [inst.x / gl.viewportWidth, inst.y / gl.viewportHeight, 0]);
    mat4.translate(mvMatrix, mvMatrix, [inst.ox / gl.viewportWidth, inst.oy / gl.viewportHeight, 0]);
    mat4.rotate(mvMatrix, mvMatrix, inst.r * Math.PI / 180);
    mat4.scale(mvMatrix, mvMatrix, [inst._sx, inst._sy, 1.0]);
    mat4.translate(mvMatrix, mvMatrix, [-inst.x / gl.viewportWidth, -inst.y / gl.viewportHeight, 0]);
    mat4.translate(mvMatrix, mvMatrix, [-inst.ox / gl.viewportWidth, -inst.oy / gl.viewportHeight, 0]);

    mat4.translate(mvMatrix, mvMatrix, [inst.x / gl.viewportWidth, inst.y / gl.viewportHeight, 0]);

    //draw sprite
    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, t.tex);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);

    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPositionBuffer.numItems);
  }

};


O.Texture = function (gl, img, cb) {
  var inst = this;

  inst.tex = gl.createTexture();

  if (typeof(img) == 'string') {
    inst.tex.image = new Image();
    inst.tex.image.src = img;
  } else {
    inst.tex.image = img;
  }

  inst.tex.image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, inst.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inst.tex.image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, null);

    cb();
  }

}
