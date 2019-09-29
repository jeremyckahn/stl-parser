!(function(n, t) {
  for (var e in t) n[e] = t[e];
})(
  exports,
  (function(n) {
    var t = {};
    function e(r) {
      if (t[r]) return t[r].exports;
      var i = (t[r] = { i: r, l: !1, exports: {} });
      return n[r].call(i.exports, i, i.exports, e), (i.l = !0), i.exports;
    }
    return (
      (e.m = n),
      (e.c = t),
      (e.d = function(n, t, r) {
        e.o(n, t) || Object.defineProperty(n, t, { enumerable: !0, get: r });
      }),
      (e.r = function(n) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(n, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(n, '__esModule', { value: !0 });
      }),
      (e.t = function(n, t) {
        if ((1 & t && (n = e(n)), 8 & t)) return n;
        if (4 & t && 'object' == typeof n && n && n.__esModule) return n;
        var r = Object.create(null);
        if (
          (e.r(r),
          Object.defineProperty(r, 'default', { enumerable: !0, value: n }),
          2 & t && 'string' != typeof n)
        )
          for (var i in n)
            e.d(
              r,
              i,
              function(t) {
                return n[t];
              }.bind(null, i)
            );
        return r;
      }),
      (e.n = function(n) {
        var t =
          n && n.__esModule
            ? function() {
                return n.default;
              }
            : function() {
                return n;
              };
        return e.d(t, 'a', t), t;
      }),
      (e.o = function(n, t) {
        return Object.prototype.hasOwnProperty.call(n, t);
      }),
      (e.p = ''),
      e((e.s = 0))
    );
  })([
    function(n, t, e) {
      'use strict';
      function r(n, t) {
        return (
          (function(n) {
            if (Array.isArray(n)) return n;
          })(n) ||
          (function(n, t) {
            if (
              !(
                Symbol.iterator in Object(n) ||
                '[object Arguments]' === Object.prototype.toString.call(n)
              )
            )
              return;
            var e = [],
              r = !0,
              i = !1,
              a = void 0;
            try {
              for (
                var o, u = n[Symbol.iterator]();
                !(r = (o = u.next()).done) &&
                (e.push(o.value), !t || e.length !== t);
                r = !0
              );
            } catch (n) {
              (i = !0), (a = n);
            } finally {
              try {
                r || null == u.return || u.return();
              } finally {
                if (i) throw a;
              }
            }
            return e;
          })(n, t) ||
          (function() {
            throw new TypeError(
              'Invalid attempt to destructure non-iterable instance'
            );
          })()
        );
      }
      function i(n, t) {
        if (!(n instanceof t))
          throw new TypeError('Cannot call a class as a function');
      }
      function a(n, t) {
        for (var e = 0; e < t.length; e++) {
          var r = t[e];
          (r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            'value' in r && (r.writable = !0),
            Object.defineProperty(n, r.key, r);
        }
      }
      function o(n, t, e) {
        return t && a(n.prototype, t), e && a(n, e), n;
      }
      e.r(t),
        e.d(t, 'Triangle', function() {
          return c;
        }),
        e.d(t, 'Solid', function() {
          return l;
        }),
        e.d(t, 'default', function() {
          return f;
        });
      var u = /\s+/,
        s = function(n) {
          return n.split(u).map(Number);
        },
        c = (function() {
          function n(t) {
            var e = t.v1,
              r = t.v2,
              a = t.v3;
            i(this, n), Object.assign(this, { v1: e, v2: r, v3: a });
          }
          return (
            o(n, [
              {
                key: 'area',
                get: function() {
                  var n = this.v1,
                    t = this.v2,
                    e = this.v3,
                    r = t.x - n.x,
                    i = t.y - n.y,
                    a = t.z - n.z,
                    o = e.x - n.x,
                    u = e.y - n.y,
                    s = e.z - n.z,
                    c = i * s - a * u,
                    l = a * o - r * s,
                    f = r * u - i * o;
                  return 0.5 * Math.sqrt(c * c + l * l + f * f);
                },
              },
            ]),
            n
          );
        })(),
        l = (function() {
          function n(t) {
            i(this, n), Object.assign(this, { triangles: t });
          }
          return (
            o(n, [
              {
                key: 'toString',
                value: function() {
                  return 'Number of Triangles: '
                    .concat(this.numberOfTriangles, '\nSurface Area: ')
                    .concat(this.area, '\nBounding Box: ')
                    .concat(
                      this.boundingBox
                        .map(function(n) {
                          return JSON.stringify(n);
                        })
                        .join(', ')
                    );
                },
              },
              {
                key: 'area',
                get: function() {
                  return this.triangles.reduce(function(n, t) {
                    return n + t.area;
                  }, 0);
                },
              },
              {
                key: 'boundingBox',
                get: function() {
                  var n = this.triangles.reduce(
                      function(n, t) {
                        var e = t.v1,
                          r = t.v2,
                          i = t.v3;
                        return (
                          (n.minX = Math.min(n.minX, e.x, r.x, i.x)),
                          (n.maxX = Math.max(n.maxX, e.x, r.x, i.x)),
                          (n.minY = Math.min(n.minY, e.y, r.y, i.y)),
                          (n.maxY = Math.max(n.maxY, e.y, r.y, i.y)),
                          (n.minZ = Math.min(n.minZ, e.z, r.z, i.z)),
                          (n.maxZ = Math.max(n.maxZ, e.z, r.z, i.z)),
                          n
                        );
                      },
                      { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 }
                    ),
                    t = n.minX,
                    e = n.maxX,
                    r = n.minY,
                    i = n.maxY,
                    a = n.minZ,
                    o = n.maxZ;
                  return [
                    { x: t, y: r, z: a },
                    { x: t, y: r, z: o },
                    { x: t, y: i, z: a },
                    { x: t, y: i, z: o },
                    { x: e, y: r, z: a },
                    { x: e, y: r, z: o },
                    { x: e, y: i, z: a },
                    { x: e, y: i, z: o },
                  ];
                },
              },
              {
                key: 'numberOfTriangles',
                get: function() {
                  return this.triangles.length;
                },
              },
            ]),
            n
          );
        })(),
        f = (function() {
          function n(t) {
            i(this, n),
              (this.data = t),
              (this.trimmedLines = this.data.split('\n').reduce(function(n, t) {
                var e = t.trim();
                return e && n.push(e), n;
              }, [])),
              (this.stlData = this.parseStl());
          }
          return (
            o(
              n,
              [
                {
                  key: 'parseStl',
                  value: function() {
                    for (
                      var n = 0, t = this.trimmedLines, e = t.length, i = {};
                      n < e;

                    ) {
                      var a = r(t[n].split(u), 2),
                        o = a[0],
                        s = a[1];
                      if ('solid' !== o) n++;
                      else {
                        var c = this.parseSolid(n),
                          f = c.linesParsed,
                          y = c.triangles;
                        (i[s] = new l(y)), (n += f);
                      }
                    }
                    return { solids: i };
                  },
                },
                {
                  key: 'parseSolid',
                  value: function() {
                    var t =
                        arguments.length > 0 && void 0 !== arguments[0]
                          ? arguments[0]
                          : 0,
                      e = t,
                      i = this.trimmedLines,
                      a = i.length,
                      o = i[e].split(u),
                      s = r(o, 2),
                      c = s[1],
                      l = [];
                    for (e++; e < a; ) {
                      var f = i[e],
                        y = f.split(u);
                      if (y.join(' ') === 'endsolid '.concat(c)) break;
                      'vertex' !== y[0]
                        ? e++
                        : (l.push(n.parseVertices([i[e], i[e + 1], i[e + 2]])),
                          (e += 3));
                    }
                    return { triangles: l, linesParsed: e - t };
                  },
                },
                {
                  key: 'toString',
                  value: function() {
                    var n = this.stlData.solids;
                    return Object.keys(n)
                      .map(function(t) {
                        return ''.concat(t, ':\n\n').concat(n[t], '\n');
                      })
                      .join('\n');
                  },
                },
              ],
              [
                {
                  key: 'parseVertices',
                  value: function(n) {
                    var t = r(s(n[0]), 4),
                      e = t[1],
                      i = t[2],
                      a = t[3],
                      o = r(s(n[1]), 4),
                      u = o[1],
                      l = o[2],
                      f = o[3],
                      y = r(s(n[2]), 4),
                      m = y[1],
                      v = y[2],
                      d = y[3];
                    return new c({
                      v1: { x: e, y: i, z: a },
                      v2: { x: u, y: l, z: f },
                      v3: { x: m, y: v, z: d },
                    });
                  },
                },
              ]
            ),
            n
          );
        })();
    },
  ])
);
