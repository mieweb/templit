/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/templit";
exports.ids = ["vendor-chunks/templit"];
exports.modules = {

/***/ "(ssr)/../node_modules/templit/index.js":
/*!****************************************!*\
  !*** ../node_modules/templit/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = (filePath, options, callback) => {\n  var templit = __webpack_require__(/*! ./lib/get-templit */ \"(ssr)/../node_modules/templit/lib/get-templit.js\")(filePath, options)\n  var data = __webpack_require__(/*! ./lib/extract-data */ \"(ssr)/../node_modules/templit/lib/extract-data.js\")(options)\n  var body = __webpack_require__(\"(ssr)/../node_modules/templit sync recursive\")(filePath)(data)\n  var html = templit(body)\n  return callback(null, html)\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzL3RlbXBsaXQvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQSxnQkFBZ0IsbUJBQU8sQ0FBQywyRUFBbUI7QUFDM0MsYUFBYSxtQkFBTyxDQUFDLDZFQUFvQjtBQUN6QyxhQUFhLG9FQUFRLFFBQVEsQ0FBQztBQUM5QjtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIi9Vc2Vycy96Y2F3b29kL3RlbXBsYXRlUmVuZGVyaW5nL3RlbXBsaXQvbm9kZV9tb2R1bGVzL3RlbXBsaXQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSAoZmlsZVBhdGgsIG9wdGlvbnMsIGNhbGxiYWNrKSA9PiB7XG4gIHZhciB0ZW1wbGl0ID0gcmVxdWlyZSgnLi9saWIvZ2V0LXRlbXBsaXQnKShmaWxlUGF0aCwgb3B0aW9ucylcbiAgdmFyIGRhdGEgPSByZXF1aXJlKCcuL2xpYi9leHRyYWN0LWRhdGEnKShvcHRpb25zKVxuICB2YXIgYm9keSA9IHJlcXVpcmUoZmlsZVBhdGgpKGRhdGEpXG4gIHZhciBodG1sID0gdGVtcGxpdChib2R5KVxuICByZXR1cm4gY2FsbGJhY2sobnVsbCwgaHRtbClcbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/templit/index.js\n");

/***/ }),

/***/ "(ssr)/../node_modules/templit/lib/extract-data.js":
/*!***************************************************!*\
  !*** ../node_modules/templit/lib/extract-data.js ***!
  \***************************************************/
/***/ ((module) => {

eval("module.exports = (data) => {\n  delete data.settings\n  delete data._locals\n  delete data.cache\n  return data\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzL3RlbXBsaXQvbGliL2V4dHJhY3QtZGF0YS5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIi9Vc2Vycy96Y2F3b29kL3RlbXBsYXRlUmVuZGVyaW5nL3RlbXBsaXQvbm9kZV9tb2R1bGVzL3RlbXBsaXQvbGliL2V4dHJhY3QtZGF0YS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IChkYXRhKSA9PiB7XG4gIGRlbGV0ZSBkYXRhLnNldHRpbmdzXG4gIGRlbGV0ZSBkYXRhLl9sb2NhbHNcbiAgZGVsZXRlIGRhdGEuY2FjaGVcbiAgcmV0dXJuIGRhdGFcbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/templit/lib/extract-data.js\n");

/***/ }),

/***/ "(ssr)/../node_modules/templit/lib/get-templit.js":
/*!**************************************************!*\
  !*** ../node_modules/templit/lib/get-templit.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = (filePath, options) => {\n  var _opts = options || {}\n  var fileName = _opts.templit || 'default'\n\n  return __webpack_require__(\"(ssr)/../node_modules/templit/lib sync recursive ^.*\\\\/\\\\.\\\\.\\\\/templits\\\\/.*\\\\.js$\")(`${filePath}/../templits/${fileName}.js`)\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzL3RlbXBsaXQvbGliL2dldC10ZW1wbGl0LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTLDJHQUFRLENBQUMsRUFBRSxTQUFTLGVBQWUsU0FBUyxJQUFJLENBQUM7QUFDMUQiLCJzb3VyY2VzIjpbIi9Vc2Vycy96Y2F3b29kL3RlbXBsYXRlUmVuZGVyaW5nL3RlbXBsaXQvbm9kZV9tb2R1bGVzL3RlbXBsaXQvbGliL2dldC10ZW1wbGl0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gKGZpbGVQYXRoLCBvcHRpb25zKSA9PiB7XG4gIHZhciBfb3B0cyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIGZpbGVOYW1lID0gX29wdHMudGVtcGxpdCB8fCAnZGVmYXVsdCdcblxuICByZXR1cm4gcmVxdWlyZShgJHtmaWxlUGF0aH0vLi4vdGVtcGxpdHMvJHtmaWxlTmFtZX0uanNgKVxufVxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/templit/lib/get-templit.js\n");

/***/ })

};
;