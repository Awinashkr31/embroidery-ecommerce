(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a2, b) => (typeof require !== "undefined" ? require : a2)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/react-fast-compare/index.js
  var require_react_fast_compare = __commonJS({
    "node_modules/react-fast-compare/index.js"(exports, module) {
      var hasElementType = typeof Element !== "undefined";
      var hasMap = typeof Map === "function";
      var hasSet = typeof Set === "function";
      var hasArrayBuffer = typeof ArrayBuffer === "function" && !!ArrayBuffer.isView;
      function equal(a2, b) {
        if (a2 === b) return true;
        if (a2 && b && typeof a2 == "object" && typeof b == "object") {
          if (a2.constructor !== b.constructor) return false;
          var length, i2, keys;
          if (Array.isArray(a2)) {
            length = a2.length;
            if (length != b.length) return false;
            for (i2 = length; i2-- !== 0; )
              if (!equal(a2[i2], b[i2])) return false;
            return true;
          }
          var it;
          if (hasMap && a2 instanceof Map && b instanceof Map) {
            if (a2.size !== b.size) return false;
            it = a2.entries();
            while (!(i2 = it.next()).done)
              if (!b.has(i2.value[0])) return false;
            it = a2.entries();
            while (!(i2 = it.next()).done)
              if (!equal(i2.value[1], b.get(i2.value[0]))) return false;
            return true;
          }
          if (hasSet && a2 instanceof Set && b instanceof Set) {
            if (a2.size !== b.size) return false;
            it = a2.entries();
            while (!(i2 = it.next()).done)
              if (!b.has(i2.value[0])) return false;
            return true;
          }
          if (hasArrayBuffer && ArrayBuffer.isView(a2) && ArrayBuffer.isView(b)) {
            length = a2.length;
            if (length != b.length) return false;
            for (i2 = length; i2-- !== 0; )
              if (a2[i2] !== b[i2]) return false;
            return true;
          }
          if (a2.constructor === RegExp) return a2.source === b.source && a2.flags === b.flags;
          if (a2.valueOf !== Object.prototype.valueOf && typeof a2.valueOf === "function" && typeof b.valueOf === "function") return a2.valueOf() === b.valueOf();
          if (a2.toString !== Object.prototype.toString && typeof a2.toString === "function" && typeof b.toString === "function") return a2.toString() === b.toString();
          keys = Object.keys(a2);
          length = keys.length;
          if (length !== Object.keys(b).length) return false;
          for (i2 = length; i2-- !== 0; )
            if (!Object.prototype.hasOwnProperty.call(b, keys[i2])) return false;
          if (hasElementType && a2 instanceof Element) return false;
          for (i2 = length; i2-- !== 0; ) {
            if ((keys[i2] === "_owner" || keys[i2] === "__v" || keys[i2] === "__o") && a2.$$typeof) {
              continue;
            }
            if (!equal(a2[keys[i2]], b[keys[i2]])) return false;
          }
          return true;
        }
        return a2 !== a2 && b !== b;
      }
      module.exports = function isEqual(a2, b) {
        try {
          return equal(a2, b);
        } catch (error) {
          if ((error.message || "").match(/stack|recursion/i)) {
            console.warn("react-fast-compare cannot handle circular refs");
            return false;
          }
          throw error;
        }
      };
    }
  });

  // node_modules/invariant/browser.js
  var require_browser = __commonJS({
    "node_modules/invariant/browser.js"(exports, module) {
      "use strict";
      var invariant2 = function(condition, format, a2, b, c2, d, e2, f2) {
        if (true) {
          if (format === void 0) {
            throw new Error("invariant requires an error message argument");
          }
        }
        if (!condition) {
          var error;
          if (format === void 0) {
            error = new Error(
              "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."
            );
          } else {
            var args = [a2, b, c2, d, e2, f2];
            var argIndex = 0;
            error = new Error(
              format.replace(/%s/g, function() {
                return args[argIndex++];
              })
            );
            error.name = "Invariant Violation";
          }
          error.framesToPop = 1;
          throw error;
        }
      };
      module.exports = invariant2;
    }
  });

  // node_modules/shallowequal/index.js
  var require_shallowequal = __commonJS({
    "node_modules/shallowequal/index.js"(exports, module) {
      module.exports = function shallowEqual2(objA, objB, compare, compareContext) {
        var ret = compare ? compare.call(compareContext, objA, objB) : void 0;
        if (ret !== void 0) {
          return !!ret;
        }
        if (objA === objB) {
          return true;
        }
        if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
          return false;
        }
        var keysA = Object.keys(objA);
        var keysB = Object.keys(objB);
        if (keysA.length !== keysB.length) {
          return false;
        }
        var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
        for (var idx = 0; idx < keysA.length; idx++) {
          var key = keysA[idx];
          if (!bHasOwnProperty(key)) {
            return false;
          }
          var valueA = objA[key];
          var valueB = objB[key];
          ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;
          if (ret === false || ret === void 0 && valueA !== valueB) {
            return false;
          }
        }
        return true;
      };
    }
  });

  // src/pages/Home.jsx
  var import_react14 = __toESM(__require("react"), 1);
  var import_react_router_dom = __require("react-router-dom");

  // src/context/ProductContext.jsx
  var import_react = __toESM(__require("react"), 1);

  // node_modules/tslib/tslib.es6.mjs
  function __rest(s2, e2) {
    var t2 = {};
    for (var p in s2) if (Object.prototype.hasOwnProperty.call(s2, p) && e2.indexOf(p) < 0)
      t2[p] = s2[p];
    if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i2 = 0, p = Object.getOwnPropertySymbols(s2); i2 < p.length; i2++) {
        if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i2]))
          t2[p[i2]] = s2[p[i2]];
      }
    return t2;
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e2) {
          reject(e2);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e2) {
          reject(e2);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }

  // node_modules/@supabase/functions-js/dist/module/helper.js
  var resolveFetch = (customFetch) => {
    if (customFetch) {
      return (...args) => customFetch(...args);
    }
    return (...args) => fetch(...args);
  };

  // node_modules/@supabase/functions-js/dist/module/types.js
  var FunctionsError = class extends Error {
    constructor(message, name7 = "FunctionsError", context) {
      super(message);
      this.name = name7;
      this.context = context;
    }
  };
  var FunctionsFetchError = class extends FunctionsError {
    constructor(context) {
      super("Failed to send a request to the Edge Function", "FunctionsFetchError", context);
    }
  };
  var FunctionsRelayError = class extends FunctionsError {
    constructor(context) {
      super("Relay Error invoking the Edge Function", "FunctionsRelayError", context);
    }
  };
  var FunctionsHttpError = class extends FunctionsError {
    constructor(context) {
      super("Edge Function returned a non-2xx status code", "FunctionsHttpError", context);
    }
  };
  var FunctionRegion;
  (function(FunctionRegion2) {
    FunctionRegion2["Any"] = "any";
    FunctionRegion2["ApNortheast1"] = "ap-northeast-1";
    FunctionRegion2["ApNortheast2"] = "ap-northeast-2";
    FunctionRegion2["ApSouth1"] = "ap-south-1";
    FunctionRegion2["ApSoutheast1"] = "ap-southeast-1";
    FunctionRegion2["ApSoutheast2"] = "ap-southeast-2";
    FunctionRegion2["CaCentral1"] = "ca-central-1";
    FunctionRegion2["EuCentral1"] = "eu-central-1";
    FunctionRegion2["EuWest1"] = "eu-west-1";
    FunctionRegion2["EuWest2"] = "eu-west-2";
    FunctionRegion2["EuWest3"] = "eu-west-3";
    FunctionRegion2["SaEast1"] = "sa-east-1";
    FunctionRegion2["UsEast1"] = "us-east-1";
    FunctionRegion2["UsWest1"] = "us-west-1";
    FunctionRegion2["UsWest2"] = "us-west-2";
  })(FunctionRegion || (FunctionRegion = {}));

  // node_modules/@supabase/functions-js/dist/module/FunctionsClient.js
  var FunctionsClient = class {
    /**
     * Creates a new Functions client bound to an Edge Functions URL.
     *
     * @example
     * ```ts
     * import { FunctionsClient, FunctionRegion } from '@supabase/functions-js'
     *
     * const functions = new FunctionsClient('https://xyzcompany.supabase.co/functions/v1', {
     *   headers: { apikey: 'public-anon-key' },
     *   region: FunctionRegion.UsEast1,
     * })
     * ```
     */
    constructor(url, { headers = {}, customFetch, region = FunctionRegion.Any } = {}) {
      this.url = url;
      this.headers = headers;
      this.region = region;
      this.fetch = resolveFetch(customFetch);
    }
    /**
     * Updates the authorization header
     * @param token - the new jwt token sent in the authorisation header
     * @example
     * ```ts
     * functions.setAuth(session.access_token)
     * ```
     */
    setAuth(token) {
      this.headers.Authorization = `Bearer ${token}`;
    }
    /**
     * Invokes a function
     * @param functionName - The name of the Function to invoke.
     * @param options - Options for invoking the Function.
     * @example
     * ```ts
     * const { data, error } = await functions.invoke('hello-world', {
     *   body: { name: 'Ada' },
     * })
     * ```
     */
    invoke(functionName_1) {
      return __awaiter(this, arguments, void 0, function* (functionName, options = {}) {
        var _a;
        let timeoutId;
        let timeoutController;
        try {
          const { headers, method, body: functionArgs, signal, timeout } = options;
          let _headers = {};
          let { region } = options;
          if (!region) {
            region = this.region;
          }
          const url = new URL(`${this.url}/${functionName}`);
          if (region && region !== "any") {
            _headers["x-region"] = region;
            url.searchParams.set("forceFunctionRegion", region);
          }
          let body;
          if (functionArgs && (headers && !Object.prototype.hasOwnProperty.call(headers, "Content-Type") || !headers)) {
            if (typeof Blob !== "undefined" && functionArgs instanceof Blob || functionArgs instanceof ArrayBuffer) {
              _headers["Content-Type"] = "application/octet-stream";
              body = functionArgs;
            } else if (typeof functionArgs === "string") {
              _headers["Content-Type"] = "text/plain";
              body = functionArgs;
            } else if (typeof FormData !== "undefined" && functionArgs instanceof FormData) {
              body = functionArgs;
            } else {
              _headers["Content-Type"] = "application/json";
              body = JSON.stringify(functionArgs);
            }
          } else {
            body = functionArgs;
          }
          let effectiveSignal = signal;
          if (timeout) {
            timeoutController = new AbortController();
            timeoutId = setTimeout(() => timeoutController.abort(), timeout);
            if (signal) {
              effectiveSignal = timeoutController.signal;
              signal.addEventListener("abort", () => timeoutController.abort());
            } else {
              effectiveSignal = timeoutController.signal;
            }
          }
          const response = yield this.fetch(url.toString(), {
            method: method || "POST",
            // headers priority is (high to low):
            // 1. invoke-level headers
            // 2. client-level headers
            // 3. default Content-Type header
            headers: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
            body,
            signal: effectiveSignal
          }).catch((fetchError) => {
            throw new FunctionsFetchError(fetchError);
          });
          const isRelayError = response.headers.get("x-relay-error");
          if (isRelayError && isRelayError === "true") {
            throw new FunctionsRelayError(response);
          }
          if (!response.ok) {
            throw new FunctionsHttpError(response);
          }
          let responseType = ((_a = response.headers.get("Content-Type")) !== null && _a !== void 0 ? _a : "text/plain").split(";")[0].trim();
          let data;
          if (responseType === "application/json") {
            data = yield response.json();
          } else if (responseType === "application/octet-stream" || responseType === "application/pdf") {
            data = yield response.blob();
          } else if (responseType === "text/event-stream") {
            data = response;
          } else if (responseType === "multipart/form-data") {
            data = yield response.formData();
          } else {
            data = yield response.text();
          }
          return { data, error: null, response };
        } catch (error) {
          return {
            data: null,
            error,
            response: error instanceof FunctionsHttpError || error instanceof FunctionsRelayError ? error.context : void 0
          };
        } finally {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        }
      });
    }
  };

  // node_modules/@supabase/postgrest-js/dist/index.mjs
  var PostgrestError = class extends Error {
    /**
    * @example
    * ```ts
    * import PostgrestError from '@supabase/postgrest-js'
    *
    * throw new PostgrestError({
    *   message: 'Row level security prevented the request',
    *   details: 'RLS denied the insert',
    *   hint: 'Check your policies',
    *   code: 'PGRST301',
    * })
    * ```
    */
    constructor(context) {
      super(context.message);
      this.name = "PostgrestError";
      this.details = context.details;
      this.hint = context.hint;
      this.code = context.code;
    }
  };
  var PostgrestBuilder = class {
    /**
    * Creates a builder configured for a specific PostgREST request.
    *
    * @example
    * ```ts
    * import PostgrestQueryBuilder from '@supabase/postgrest-js'
    *
    * const builder = new PostgrestQueryBuilder(
    *   new URL('https://xyzcompany.supabase.co/rest/v1/users'),
    *   { headers: new Headers({ apikey: 'public-anon-key' }) }
    * )
    * ```
    */
    constructor(builder) {
      var _builder$shouldThrowO, _builder$isMaybeSingl;
      this.shouldThrowOnError = false;
      this.method = builder.method;
      this.url = builder.url;
      this.headers = new Headers(builder.headers);
      this.schema = builder.schema;
      this.body = builder.body;
      this.shouldThrowOnError = (_builder$shouldThrowO = builder.shouldThrowOnError) !== null && _builder$shouldThrowO !== void 0 ? _builder$shouldThrowO : false;
      this.signal = builder.signal;
      this.isMaybeSingle = (_builder$isMaybeSingl = builder.isMaybeSingle) !== null && _builder$isMaybeSingl !== void 0 ? _builder$isMaybeSingl : false;
      if (builder.fetch) this.fetch = builder.fetch;
      else this.fetch = fetch;
    }
    /**
    * If there's an error with the query, throwOnError will reject the promise by
    * throwing the error instead of returning it as part of a successful response.
    *
    * {@link https://github.com/supabase/supabase-js/issues/92}
    */
    throwOnError() {
      this.shouldThrowOnError = true;
      return this;
    }
    /**
    * Set an HTTP header for the request.
    */
    setHeader(name7, value) {
      this.headers = new Headers(this.headers);
      this.headers.set(name7, value);
      return this;
    }
    then(onfulfilled, onrejected) {
      var _this = this;
      if (this.schema === void 0) {
      } else if (["GET", "HEAD"].includes(this.method)) this.headers.set("Accept-Profile", this.schema);
      else this.headers.set("Content-Profile", this.schema);
      if (this.method !== "GET" && this.method !== "HEAD") this.headers.set("Content-Type", "application/json");
      const _fetch = this.fetch;
      let res = _fetch(this.url.toString(), {
        method: this.method,
        headers: this.headers,
        body: JSON.stringify(this.body),
        signal: this.signal
      }).then(async (res$1) => {
        let error = null;
        let data = null;
        let count = null;
        let status = res$1.status;
        let statusText = res$1.statusText;
        if (res$1.ok) {
          var _this$headers$get2, _res$headers$get;
          if (_this.method !== "HEAD") {
            var _this$headers$get;
            const body = await res$1.text();
            if (body === "") {
            } else if (_this.headers.get("Accept") === "text/csv") data = body;
            else if (_this.headers.get("Accept") && ((_this$headers$get = _this.headers.get("Accept")) === null || _this$headers$get === void 0 ? void 0 : _this$headers$get.includes("application/vnd.pgrst.plan+text"))) data = body;
            else data = JSON.parse(body);
          }
          const countHeader = (_this$headers$get2 = _this.headers.get("Prefer")) === null || _this$headers$get2 === void 0 ? void 0 : _this$headers$get2.match(/count=(exact|planned|estimated)/);
          const contentRange = (_res$headers$get = res$1.headers.get("content-range")) === null || _res$headers$get === void 0 ? void 0 : _res$headers$get.split("/");
          if (countHeader && contentRange && contentRange.length > 1) count = parseInt(contentRange[1]);
          if (_this.isMaybeSingle && _this.method === "GET" && Array.isArray(data)) if (data.length > 1) {
            error = {
              code: "PGRST116",
              details: `Results contain ${data.length} rows, application/vnd.pgrst.object+json requires 1 row`,
              hint: null,
              message: "JSON object requested, multiple (or no) rows returned"
            };
            data = null;
            count = null;
            status = 406;
            statusText = "Not Acceptable";
          } else if (data.length === 1) data = data[0];
          else data = null;
        } else {
          var _error$details;
          const body = await res$1.text();
          try {
            error = JSON.parse(body);
            if (Array.isArray(error) && res$1.status === 404) {
              data = [];
              error = null;
              status = 200;
              statusText = "OK";
            }
          } catch (_unused) {
            if (res$1.status === 404 && body === "") {
              status = 204;
              statusText = "No Content";
            } else error = { message: body };
          }
          if (error && _this.isMaybeSingle && (error === null || error === void 0 || (_error$details = error.details) === null || _error$details === void 0 ? void 0 : _error$details.includes("0 rows"))) {
            error = null;
            status = 200;
            statusText = "OK";
          }
          if (error && _this.shouldThrowOnError) throw new PostgrestError(error);
        }
        return {
          error,
          data,
          count,
          status,
          statusText
        };
      });
      if (!this.shouldThrowOnError) res = res.catch((fetchError) => {
        var _fetchError$name2;
        let errorDetails = "";
        const cause = fetchError === null || fetchError === void 0 ? void 0 : fetchError.cause;
        if (cause) {
          var _cause$message, _cause$code, _fetchError$name, _cause$name;
          const causeMessage = (_cause$message = cause === null || cause === void 0 ? void 0 : cause.message) !== null && _cause$message !== void 0 ? _cause$message : "";
          const causeCode = (_cause$code = cause === null || cause === void 0 ? void 0 : cause.code) !== null && _cause$code !== void 0 ? _cause$code : "";
          errorDetails = `${(_fetchError$name = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _fetchError$name !== void 0 ? _fetchError$name : "FetchError"}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`;
          errorDetails += `

Caused by: ${(_cause$name = cause === null || cause === void 0 ? void 0 : cause.name) !== null && _cause$name !== void 0 ? _cause$name : "Error"}: ${causeMessage}`;
          if (causeCode) errorDetails += ` (${causeCode})`;
          if (cause === null || cause === void 0 ? void 0 : cause.stack) errorDetails += `
${cause.stack}`;
        } else {
          var _fetchError$stack;
          errorDetails = (_fetchError$stack = fetchError === null || fetchError === void 0 ? void 0 : fetchError.stack) !== null && _fetchError$stack !== void 0 ? _fetchError$stack : "";
        }
        return {
          error: {
            message: `${(_fetchError$name2 = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _fetchError$name2 !== void 0 ? _fetchError$name2 : "FetchError"}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`,
            details: errorDetails,
            hint: "",
            code: ""
          },
          data: null,
          count: null,
          status: 0,
          statusText: ""
        };
      });
      return res.then(onfulfilled, onrejected);
    }
    /**
    * Override the type of the returned `data`.
    *
    * @typeParam NewResult - The new result type to override with
    * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
    */
    returns() {
      return this;
    }
    /**
    * Override the type of the returned `data` field in the response.
    *
    * @typeParam NewResult - The new type to cast the response data to
    * @typeParam Options - Optional type configuration (defaults to { merge: true })
    * @typeParam Options.merge - When true, merges the new type with existing return type. When false, replaces the existing types entirely (defaults to true)
    * @example
    * ```typescript
    * // Merge with existing types (default behavior)
    * const query = supabase
    *   .from('users')
    *   .select()
    *   .overrideTypes<{ custom_field: string }>()
    *
    * // Replace existing types completely
    * const replaceQuery = supabase
    *   .from('users')
    *   .select()
    *   .overrideTypes<{ id: number; name: string }, { merge: false }>()
    * ```
    * @returns A PostgrestBuilder instance with the new type
    */
    overrideTypes() {
      return this;
    }
  };
  var PostgrestTransformBuilder = class extends PostgrestBuilder {
    /**
    * Perform a SELECT on the query result.
    *
    * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
    * return modified rows. By calling this method, modified rows are returned in
    * `data`.
    *
    * @param columns - The columns to retrieve, separated by commas
    */
    select(columns) {
      let quoted = false;
      const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c2) => {
        if (/\s/.test(c2) && !quoted) return "";
        if (c2 === '"') quoted = !quoted;
        return c2;
      }).join("");
      this.url.searchParams.set("select", cleanedColumns);
      this.headers.append("Prefer", "return=representation");
      return this;
    }
    /**
    * Order the query result by `column`.
    *
    * You can call this method multiple times to order by multiple columns.
    *
    * You can order referenced tables, but it only affects the ordering of the
    * parent table if you use `!inner` in the query.
    *
    * @param column - The column to order by
    * @param options - Named parameters
    * @param options.ascending - If `true`, the result will be in ascending order
    * @param options.nullsFirst - If `true`, `null`s appear first. If `false`,
    * `null`s appear last.
    * @param options.referencedTable - Set this to order a referenced table by
    * its columns
    * @param options.foreignTable - Deprecated, use `options.referencedTable`
    * instead
    */
    order(column, { ascending = true, nullsFirst, foreignTable, referencedTable = foreignTable } = {}) {
      const key = referencedTable ? `${referencedTable}.order` : "order";
      const existingOrder = this.url.searchParams.get(key);
      this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ""}${column}.${ascending ? "asc" : "desc"}${nullsFirst === void 0 ? "" : nullsFirst ? ".nullsfirst" : ".nullslast"}`);
      return this;
    }
    /**
    * Limit the query result by `count`.
    *
    * @param count - The maximum number of rows to return
    * @param options - Named parameters
    * @param options.referencedTable - Set this to limit rows of referenced
    * tables instead of the parent table
    * @param options.foreignTable - Deprecated, use `options.referencedTable`
    * instead
    */
    limit(count, { foreignTable, referencedTable = foreignTable } = {}) {
      const key = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
      this.url.searchParams.set(key, `${count}`);
      return this;
    }
    /**
    * Limit the query result by starting at an offset `from` and ending at the offset `to`.
    * Only records within this range are returned.
    * This respects the query order and if there is no order clause the range could behave unexpectedly.
    * The `from` and `to` values are 0-based and inclusive: `range(1, 3)` will include the second, third
    * and fourth rows of the query.
    *
    * @param from - The starting index from which to limit the result
    * @param to - The last index to which to limit the result
    * @param options - Named parameters
    * @param options.referencedTable - Set this to limit rows of referenced
    * tables instead of the parent table
    * @param options.foreignTable - Deprecated, use `options.referencedTable`
    * instead
    */
    range(from, to, { foreignTable, referencedTable = foreignTable } = {}) {
      const keyOffset = typeof referencedTable === "undefined" ? "offset" : `${referencedTable}.offset`;
      const keyLimit = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
      this.url.searchParams.set(keyOffset, `${from}`);
      this.url.searchParams.set(keyLimit, `${to - from + 1}`);
      return this;
    }
    /**
    * Set the AbortSignal for the fetch request.
    *
    * @param signal - The AbortSignal to use for the fetch request
    */
    abortSignal(signal) {
      this.signal = signal;
      return this;
    }
    /**
    * Return `data` as a single object instead of an array of objects.
    *
    * Query result must be one row (e.g. using `.limit(1)`), otherwise this
    * returns an error.
    */
    single() {
      this.headers.set("Accept", "application/vnd.pgrst.object+json");
      return this;
    }
    /**
    * Return `data` as a single object instead of an array of objects.
    *
    * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
    * this returns an error.
    */
    maybeSingle() {
      if (this.method === "GET") this.headers.set("Accept", "application/json");
      else this.headers.set("Accept", "application/vnd.pgrst.object+json");
      this.isMaybeSingle = true;
      return this;
    }
    /**
    * Return `data` as a string in CSV format.
    */
    csv() {
      this.headers.set("Accept", "text/csv");
      return this;
    }
    /**
    * Return `data` as an object in [GeoJSON](https://geojson.org) format.
    */
    geojson() {
      this.headers.set("Accept", "application/geo+json");
      return this;
    }
    /**
    * Return `data` as the EXPLAIN plan for the query.
    *
    * You need to enable the
    * [db_plan_enabled](https://supabase.com/docs/guides/database/debugging-performance#enabling-explain)
    * setting before using this method.
    *
    * @param options - Named parameters
    *
    * @param options.analyze - If `true`, the query will be executed and the
    * actual run time will be returned
    *
    * @param options.verbose - If `true`, the query identifier will be returned
    * and `data` will include the output columns of the query
    *
    * @param options.settings - If `true`, include information on configuration
    * parameters that affect query planning
    *
    * @param options.buffers - If `true`, include information on buffer usage
    *
    * @param options.wal - If `true`, include information on WAL record generation
    *
    * @param options.format - The format of the output, can be `"text"` (default)
    * or `"json"`
    */
    explain({ analyze = false, verbose = false, settings = false, buffers = false, wal = false, format = "text" } = {}) {
      var _this$headers$get;
      const options = [
        analyze ? "analyze" : null,
        verbose ? "verbose" : null,
        settings ? "settings" : null,
        buffers ? "buffers" : null,
        wal ? "wal" : null
      ].filter(Boolean).join("|");
      const forMediatype = (_this$headers$get = this.headers.get("Accept")) !== null && _this$headers$get !== void 0 ? _this$headers$get : "application/json";
      this.headers.set("Accept", `application/vnd.pgrst.plan+${format}; for="${forMediatype}"; options=${options};`);
      if (format === "json") return this;
      else return this;
    }
    /**
    * Rollback the query.
    *
    * `data` will still be returned, but the query is not committed.
    */
    rollback() {
      this.headers.append("Prefer", "tx=rollback");
      return this;
    }
    /**
    * Override the type of the returned `data`.
    *
    * @typeParam NewResult - The new result type to override with
    * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
    */
    returns() {
      return this;
    }
    /**
    * Set the maximum number of rows that can be affected by the query.
    * Only available in PostgREST v13+ and only works with PATCH and DELETE methods.
    *
    * @param value - The maximum number of rows that can be affected
    */
    maxAffected(value) {
      this.headers.append("Prefer", "handling=strict");
      this.headers.append("Prefer", `max-affected=${value}`);
      return this;
    }
  };
  var PostgrestReservedCharsRegexp = /* @__PURE__ */ new RegExp("[,()]");
  var PostgrestFilterBuilder = class extends PostgrestTransformBuilder {
    /**
    * Match only rows where `column` is equal to `value`.
    *
    * To check if the value of `column` is NULL, you should use `.is()` instead.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
    eq(column, value) {
      this.url.searchParams.append(column, `eq.${value}`);
      return this;
    }
    /**
    * Match only rows where `column` is not equal to `value`.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
    neq(column, value) {
      this.url.searchParams.append(column, `neq.${value}`);
      return this;
    }
    /**
    * Match only rows where `column` is greater than `value`.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
    gt(column, value) {
      this.url.searchParams.append(column, `gt.${value}`);
      return this;
    }
    /**
    * Match only rows where `column` is greater than or equal to `value`.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
    gte(column, value) {
      this.url.searchParams.append(column, `gte.${value}`);
      return this;
    }
    /**
    * Match only rows where `column` is less than `value`.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
    lt(column, value) {
      this.url.searchParams.append(column, `lt.${value}`);
      return this;
    }
    /**
    * Match only rows where `column` is less than or equal to `value`.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
    lte(column, value) {
      this.url.searchParams.append(column, `lte.${value}`);
      return this;
    }
    /**
    * Match only rows where `column` matches `pattern` case-sensitively.
    *
    * @param column - The column to filter on
    * @param pattern - The pattern to match with
    */
    like(column, pattern) {
      this.url.searchParams.append(column, `like.${pattern}`);
      return this;
    }
    /**
    * Match only rows where `column` matches all of `patterns` case-sensitively.
    *
    * @param column - The column to filter on
    * @param patterns - The patterns to match with
    */
    likeAllOf(column, patterns) {
      this.url.searchParams.append(column, `like(all).{${patterns.join(",")}}`);
      return this;
    }
    /**
    * Match only rows where `column` matches any of `patterns` case-sensitively.
    *
    * @param column - The column to filter on
    * @param patterns - The patterns to match with
    */
    likeAnyOf(column, patterns) {
      this.url.searchParams.append(column, `like(any).{${patterns.join(",")}}`);
      return this;
    }
    /**
    * Match only rows where `column` matches `pattern` case-insensitively.
    *
    * @param column - The column to filter on
    * @param pattern - The pattern to match with
    */
    ilike(column, pattern) {
      this.url.searchParams.append(column, `ilike.${pattern}`);
      return this;
    }
    /**
    * Match only rows where `column` matches all of `patterns` case-insensitively.
    *
    * @param column - The column to filter on
    * @param patterns - The patterns to match with
    */
    ilikeAllOf(column, patterns) {
      this.url.searchParams.append(column, `ilike(all).{${patterns.join(",")}}`);
      return this;
    }
    /**
    * Match only rows where `column` matches any of `patterns` case-insensitively.
    *
    * @param column - The column to filter on
    * @param patterns - The patterns to match with
    */
    ilikeAnyOf(column, patterns) {
      this.url.searchParams.append(column, `ilike(any).{${patterns.join(",")}}`);
      return this;
    }
    /**
    * Match only rows where `column` matches the PostgreSQL regex `pattern`
    * case-sensitively (using the `~` operator).
    *
    * @param column - The column to filter on
    * @param pattern - The PostgreSQL regular expression pattern to match with
    */
    regexMatch(column, pattern) {
      this.url.searchParams.append(column, `match.${pattern}`);
      return this;
    }
    /**
    * Match only rows where `column` matches the PostgreSQL regex `pattern`
    * case-insensitively (using the `~*` operator).
    *
    * @param column - The column to filter on
    * @param pattern - The PostgreSQL regular expression pattern to match with
    */
    regexIMatch(column, pattern) {
      this.url.searchParams.append(column, `imatch.${pattern}`);
      return this;
    }
    /**
    * Match only rows where `column` IS `value`.
    *
    * For non-boolean columns, this is only relevant for checking if the value of
    * `column` is NULL by setting `value` to `null`.
    *
    * For boolean columns, you can also set `value` to `true` or `false` and it
    * will behave the same way as `.eq()`.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
    is(column, value) {
      this.url.searchParams.append(column, `is.${value}`);
      return this;
    }
    /**
    * Match only rows where `column` IS DISTINCT FROM `value`.
    *
    * Unlike `.neq()`, this treats `NULL` as a comparable value. Two `NULL` values
    * are considered equal (not distinct), and comparing `NULL` with any non-NULL
    * value returns true (distinct).
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
    isDistinct(column, value) {
      this.url.searchParams.append(column, `isdistinct.${value}`);
      return this;
    }
    /**
    * Match only rows where `column` is included in the `values` array.
    *
    * @param column - The column to filter on
    * @param values - The values array to filter with
    */
    in(column, values) {
      const cleanedValues = Array.from(new Set(values)).map((s2) => {
        if (typeof s2 === "string" && PostgrestReservedCharsRegexp.test(s2)) return `"${s2}"`;
        else return `${s2}`;
      }).join(",");
      this.url.searchParams.append(column, `in.(${cleanedValues})`);
      return this;
    }
    /**
    * Match only rows where `column` is NOT included in the `values` array.
    *
    * @param column - The column to filter on
    * @param values - The values array to filter with
    */
    notIn(column, values) {
      const cleanedValues = Array.from(new Set(values)).map((s2) => {
        if (typeof s2 === "string" && PostgrestReservedCharsRegexp.test(s2)) return `"${s2}"`;
        else return `${s2}`;
      }).join(",");
      this.url.searchParams.append(column, `not.in.(${cleanedValues})`);
      return this;
    }
    /**
    * Only relevant for jsonb, array, and range columns. Match only rows where
    * `column` contains every element appearing in `value`.
    *
    * @param column - The jsonb, array, or range column to filter on
    * @param value - The jsonb, array, or range value to filter with
    */
    contains(column, value) {
      if (typeof value === "string") this.url.searchParams.append(column, `cs.${value}`);
      else if (Array.isArray(value)) this.url.searchParams.append(column, `cs.{${value.join(",")}}`);
      else this.url.searchParams.append(column, `cs.${JSON.stringify(value)}`);
      return this;
    }
    /**
    * Only relevant for jsonb, array, and range columns. Match only rows where
    * every element appearing in `column` is contained by `value`.
    *
    * @param column - The jsonb, array, or range column to filter on
    * @param value - The jsonb, array, or range value to filter with
    */
    containedBy(column, value) {
      if (typeof value === "string") this.url.searchParams.append(column, `cd.${value}`);
      else if (Array.isArray(value)) this.url.searchParams.append(column, `cd.{${value.join(",")}}`);
      else this.url.searchParams.append(column, `cd.${JSON.stringify(value)}`);
      return this;
    }
    /**
    * Only relevant for range columns. Match only rows where every element in
    * `column` is greater than any element in `range`.
    *
    * @param column - The range column to filter on
    * @param range - The range to filter with
    */
    rangeGt(column, range) {
      this.url.searchParams.append(column, `sr.${range}`);
      return this;
    }
    /**
    * Only relevant for range columns. Match only rows where every element in
    * `column` is either contained in `range` or greater than any element in
    * `range`.
    *
    * @param column - The range column to filter on
    * @param range - The range to filter with
    */
    rangeGte(column, range) {
      this.url.searchParams.append(column, `nxl.${range}`);
      return this;
    }
    /**
    * Only relevant for range columns. Match only rows where every element in
    * `column` is less than any element in `range`.
    *
    * @param column - The range column to filter on
    * @param range - The range to filter with
    */
    rangeLt(column, range) {
      this.url.searchParams.append(column, `sl.${range}`);
      return this;
    }
    /**
    * Only relevant for range columns. Match only rows where every element in
    * `column` is either contained in `range` or less than any element in
    * `range`.
    *
    * @param column - The range column to filter on
    * @param range - The range to filter with
    */
    rangeLte(column, range) {
      this.url.searchParams.append(column, `nxr.${range}`);
      return this;
    }
    /**
    * Only relevant for range columns. Match only rows where `column` is
    * mutually exclusive to `range` and there can be no element between the two
    * ranges.
    *
    * @param column - The range column to filter on
    * @param range - The range to filter with
    */
    rangeAdjacent(column, range) {
      this.url.searchParams.append(column, `adj.${range}`);
      return this;
    }
    /**
    * Only relevant for array and range columns. Match only rows where
    * `column` and `value` have an element in common.
    *
    * @param column - The array or range column to filter on
    * @param value - The array or range value to filter with
    */
    overlaps(column, value) {
      if (typeof value === "string") this.url.searchParams.append(column, `ov.${value}`);
      else this.url.searchParams.append(column, `ov.{${value.join(",")}}`);
      return this;
    }
    /**
    * Only relevant for text and tsvector columns. Match only rows where
    * `column` matches the query string in `query`.
    *
    * @param column - The text or tsvector column to filter on
    * @param query - The query text to match with
    * @param options - Named parameters
    * @param options.config - The text search configuration to use
    * @param options.type - Change how the `query` text is interpreted
    */
    textSearch(column, query, { config, type } = {}) {
      let typePart = "";
      if (type === "plain") typePart = "pl";
      else if (type === "phrase") typePart = "ph";
      else if (type === "websearch") typePart = "w";
      const configPart = config === void 0 ? "" : `(${config})`;
      this.url.searchParams.append(column, `${typePart}fts${configPart}.${query}`);
      return this;
    }
    /**
    * Match only rows where each column in `query` keys is equal to its
    * associated value. Shorthand for multiple `.eq()`s.
    *
    * @param query - The object to filter with, with column names as keys mapped
    * to their filter values
    */
    match(query) {
      Object.entries(query).forEach(([column, value]) => {
        this.url.searchParams.append(column, `eq.${value}`);
      });
      return this;
    }
    /**
    * Match only rows which doesn't satisfy the filter.
    *
    * Unlike most filters, `opearator` and `value` are used as-is and need to
    * follow [PostgREST
    * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
    * to make sure they are properly sanitized.
    *
    * @param column - The column to filter on
    * @param operator - The operator to be negated to filter with, following
    * PostgREST syntax
    * @param value - The value to filter with, following PostgREST syntax
    */
    not(column, operator, value) {
      this.url.searchParams.append(column, `not.${operator}.${value}`);
      return this;
    }
    /**
    * Match only rows which satisfy at least one of the filters.
    *
    * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
    * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
    * to make sure it's properly sanitized.
    *
    * It's currently not possible to do an `.or()` filter across multiple tables.
    *
    * @param filters - The filters to use, following PostgREST syntax
    * @param options - Named parameters
    * @param options.referencedTable - Set this to filter on referenced tables
    * instead of the parent table
    * @param options.foreignTable - Deprecated, use `referencedTable` instead
    */
    or(filters, { foreignTable, referencedTable = foreignTable } = {}) {
      const key = referencedTable ? `${referencedTable}.or` : "or";
      this.url.searchParams.append(key, `(${filters})`);
      return this;
    }
    /**
    * Match only rows which satisfy the filter. This is an escape hatch - you
    * should use the specific filter methods wherever possible.
    *
    * Unlike most filters, `opearator` and `value` are used as-is and need to
    * follow [PostgREST
    * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
    * to make sure they are properly sanitized.
    *
    * @param column - The column to filter on
    * @param operator - The operator to filter with, following PostgREST syntax
    * @param value - The value to filter with, following PostgREST syntax
    */
    filter(column, operator, value) {
      this.url.searchParams.append(column, `${operator}.${value}`);
      return this;
    }
  };
  var PostgrestQueryBuilder = class {
    /**
    * Creates a query builder scoped to a Postgres table or view.
    *
    * @example
    * ```ts
    * import PostgrestQueryBuilder from '@supabase/postgrest-js'
    *
    * const query = new PostgrestQueryBuilder(
    *   new URL('https://xyzcompany.supabase.co/rest/v1/users'),
    *   { headers: { apikey: 'public-anon-key' } }
    * )
    * ```
    */
    constructor(url, { headers = {}, schema, fetch: fetch$1 }) {
      this.url = url;
      this.headers = new Headers(headers);
      this.schema = schema;
      this.fetch = fetch$1;
    }
    /**
    * Perform a SELECT query on the table or view.
    *
    * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
    *
    * @param options - Named parameters
    *
    * @param options.head - When set to `true`, `data` will not be returned.
    * Useful if you only need the count.
    *
    * @param options.count - Count algorithm to use to count rows in the table or view.
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    */
    select(columns, options) {
      const { head: head2 = false, count } = options !== null && options !== void 0 ? options : {};
      const method = head2 ? "HEAD" : "GET";
      let quoted = false;
      const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c2) => {
        if (/\s/.test(c2) && !quoted) return "";
        if (c2 === '"') quoted = !quoted;
        return c2;
      }).join("");
      this.url.searchParams.set("select", cleanedColumns);
      if (count) this.headers.append("Prefer", `count=${count}`);
      return new PostgrestFilterBuilder({
        method,
        url: this.url,
        headers: this.headers,
        schema: this.schema,
        fetch: this.fetch
      });
    }
    /**
    * Perform an INSERT into the table or view.
    *
    * By default, inserted rows are not returned. To return it, chain the call
    * with `.select()`.
    *
    * @param values - The values to insert. Pass an object to insert a single row
    * or an array to insert multiple rows.
    *
    * @param options - Named parameters
    *
    * @param options.count - Count algorithm to use to count inserted rows.
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    *
    * @param options.defaultToNull - Make missing fields default to `null`.
    * Otherwise, use the default value for the column. Only applies for bulk
    * inserts.
    */
    insert(values, { count, defaultToNull = true } = {}) {
      var _this$fetch;
      const method = "POST";
      if (count) this.headers.append("Prefer", `count=${count}`);
      if (!defaultToNull) this.headers.append("Prefer", `missing=default`);
      if (Array.isArray(values)) {
        const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
        if (columns.length > 0) {
          const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
          this.url.searchParams.set("columns", uniqueColumns.join(","));
        }
      }
      return new PostgrestFilterBuilder({
        method,
        url: this.url,
        headers: this.headers,
        schema: this.schema,
        body: values,
        fetch: (_this$fetch = this.fetch) !== null && _this$fetch !== void 0 ? _this$fetch : fetch
      });
    }
    /**
    * Perform an UPSERT on the table or view. Depending on the column(s) passed
    * to `onConflict`, `.upsert()` allows you to perform the equivalent of
    * `.insert()` if a row with the corresponding `onConflict` columns doesn't
    * exist, or if it does exist, perform an alternative action depending on
    * `ignoreDuplicates`.
    *
    * By default, upserted rows are not returned. To return it, chain the call
    * with `.select()`.
    *
    * @param values - The values to upsert with. Pass an object to upsert a
    * single row or an array to upsert multiple rows.
    *
    * @param options - Named parameters
    *
    * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
    * duplicate rows are determined. Two rows are duplicates if all the
    * `onConflict` columns are equal.
    *
    * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
    * `false`, duplicate rows are merged with existing rows.
    *
    * @param options.count - Count algorithm to use to count upserted rows.
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    *
    * @param options.defaultToNull - Make missing fields default to `null`.
    * Otherwise, use the default value for the column. This only applies when
    * inserting new rows, not when merging with existing rows under
    * `ignoreDuplicates: false`. This also only applies when doing bulk upserts.
    *
    * @example Upsert a single row using a unique key
    * ```ts
    * // Upserting a single row, overwriting based on the 'username' unique column
    * const { data, error } = await supabase
    *   .from('users')
    *   .upsert({ username: 'supabot' }, { onConflict: 'username' })
    *
    * // Example response:
    * // {
    * //   data: [
    * //     { id: 4, message: 'bar', username: 'supabot' }
    * //   ],
    * //   error: null
    * // }
    * ```
    *
    * @example Upsert with conflict resolution and exact row counting
    * ```ts
    * // Upserting and returning exact count
    * const { data, error, count } = await supabase
    *   .from('users')
    *   .upsert(
    *     {
    *       id: 3,
    *       message: 'foo',
    *       username: 'supabot'
    *     },
    *     {
    *       onConflict: 'username',
    *       count: 'exact'
    *     }
    *   )
    *
    * // Example response:
    * // {
    * //   data: [
    * //     {
    * //       id: 42,
    * //       handle: "saoirse",
    * //       display_name: "Saoirse"
    * //     }
    * //   ],
    * //   count: 1,
    * //   error: null
    * // }
    * ```
    */
    upsert(values, { onConflict, ignoreDuplicates = false, count, defaultToNull = true } = {}) {
      var _this$fetch2;
      const method = "POST";
      this.headers.append("Prefer", `resolution=${ignoreDuplicates ? "ignore" : "merge"}-duplicates`);
      if (onConflict !== void 0) this.url.searchParams.set("on_conflict", onConflict);
      if (count) this.headers.append("Prefer", `count=${count}`);
      if (!defaultToNull) this.headers.append("Prefer", "missing=default");
      if (Array.isArray(values)) {
        const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
        if (columns.length > 0) {
          const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
          this.url.searchParams.set("columns", uniqueColumns.join(","));
        }
      }
      return new PostgrestFilterBuilder({
        method,
        url: this.url,
        headers: this.headers,
        schema: this.schema,
        body: values,
        fetch: (_this$fetch2 = this.fetch) !== null && _this$fetch2 !== void 0 ? _this$fetch2 : fetch
      });
    }
    /**
    * Perform an UPDATE on the table or view.
    *
    * By default, updated rows are not returned. To return it, chain the call
    * with `.select()` after filters.
    *
    * @param values - The values to update with
    *
    * @param options - Named parameters
    *
    * @param options.count - Count algorithm to use to count updated rows.
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    */
    update(values, { count } = {}) {
      var _this$fetch3;
      const method = "PATCH";
      if (count) this.headers.append("Prefer", `count=${count}`);
      return new PostgrestFilterBuilder({
        method,
        url: this.url,
        headers: this.headers,
        schema: this.schema,
        body: values,
        fetch: (_this$fetch3 = this.fetch) !== null && _this$fetch3 !== void 0 ? _this$fetch3 : fetch
      });
    }
    /**
    * Perform a DELETE on the table or view.
    *
    * By default, deleted rows are not returned. To return it, chain the call
    * with `.select()` after filters.
    *
    * @param options - Named parameters
    *
    * @param options.count - Count algorithm to use to count deleted rows.
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    */
    delete({ count } = {}) {
      var _this$fetch4;
      const method = "DELETE";
      if (count) this.headers.append("Prefer", `count=${count}`);
      return new PostgrestFilterBuilder({
        method,
        url: this.url,
        headers: this.headers,
        schema: this.schema,
        fetch: (_this$fetch4 = this.fetch) !== null && _this$fetch4 !== void 0 ? _this$fetch4 : fetch
      });
    }
  };
  var PostgrestClient = class PostgrestClient2 {
    /**
    * Creates a PostgREST client.
    *
    * @param url - URL of the PostgREST endpoint
    * @param options - Named parameters
    * @param options.headers - Custom headers
    * @param options.schema - Postgres schema to switch to
    * @param options.fetch - Custom fetch
    * @example
    * ```ts
    * import PostgrestClient from '@supabase/postgrest-js'
    *
    * const postgrest = new PostgrestClient('https://xyzcompany.supabase.co/rest/v1', {
    *   headers: { apikey: 'public-anon-key' },
    *   schema: 'public',
    * })
    * ```
    */
    constructor(url, { headers = {}, schema, fetch: fetch$1 } = {}) {
      this.url = url;
      this.headers = new Headers(headers);
      this.schemaName = schema;
      this.fetch = fetch$1;
    }
    /**
    * Perform a query on a table or a view.
    *
    * @param relation - The table or view name to query
    */
    from(relation) {
      if (!relation || typeof relation !== "string" || relation.trim() === "") throw new Error("Invalid relation name: relation must be a non-empty string.");
      return new PostgrestQueryBuilder(new URL(`${this.url}/${relation}`), {
        headers: new Headers(this.headers),
        schema: this.schemaName,
        fetch: this.fetch
      });
    }
    /**
    * Select a schema to query or perform an function (rpc) call.
    *
    * The schema needs to be on the list of exposed schemas inside Supabase.
    *
    * @param schema - The schema to query
    */
    schema(schema) {
      return new PostgrestClient2(this.url, {
        headers: this.headers,
        schema,
        fetch: this.fetch
      });
    }
    /**
    * Perform a function call.
    *
    * @param fn - The function name to call
    * @param args - The arguments to pass to the function call
    * @param options - Named parameters
    * @param options.head - When set to `true`, `data` will not be returned.
    * Useful if you only need the count.
    * @param options.get - When set to `true`, the function will be called with
    * read-only access mode.
    * @param options.count - Count algorithm to use to count rows returned by the
    * function. Only applicable for [set-returning
    * functions](https://www.postgresql.org/docs/current/functions-srf.html).
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    *
    * @example
    * ```ts
    * // For cross-schema functions where type inference fails, use overrideTypes:
    * const { data } = await supabase
    *   .schema('schema_b')
    *   .rpc('function_a', {})
    *   .overrideTypes<{ id: string; user_id: string }[]>()
    * ```
    */
    rpc(fn, args = {}, { head: head2 = false, get: get2 = false, count } = {}) {
      var _this$fetch;
      let method;
      const url = new URL(`${this.url}/rpc/${fn}`);
      let body;
      if (head2 || get2) {
        method = head2 ? "HEAD" : "GET";
        Object.entries(args).filter(([_, value]) => value !== void 0).map(([name7, value]) => [name7, Array.isArray(value) ? `{${value.join(",")}}` : `${value}`]).forEach(([name7, value]) => {
          url.searchParams.append(name7, value);
        });
      } else {
        method = "POST";
        body = args;
      }
      const headers = new Headers(this.headers);
      if (count) headers.set("Prefer", `count=${count}`);
      return new PostgrestFilterBuilder({
        method,
        url,
        headers,
        schema: this.schemaName,
        body,
        fetch: (_this$fetch = this.fetch) !== null && _this$fetch !== void 0 ? _this$fetch : fetch
      });
    }
  };

  // node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
  var WebSocketFactory = class {
    /**
     * Static-only utility – prevent instantiation.
     */
    constructor() {
    }
    static detectEnvironment() {
      var _a;
      if (typeof WebSocket !== "undefined") {
        return { type: "native", constructor: WebSocket };
      }
      if (typeof globalThis !== "undefined" && typeof globalThis.WebSocket !== "undefined") {
        return { type: "native", constructor: globalThis.WebSocket };
      }
      if (typeof global !== "undefined" && typeof global.WebSocket !== "undefined") {
        return { type: "native", constructor: global.WebSocket };
      }
      if (typeof globalThis !== "undefined" && typeof globalThis.WebSocketPair !== "undefined" && typeof globalThis.WebSocket === "undefined") {
        return {
          type: "cloudflare",
          error: "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",
          workaround: "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."
        };
      }
      if (typeof globalThis !== "undefined" && globalThis.EdgeRuntime || typeof navigator !== "undefined" && ((_a = navigator.userAgent) === null || _a === void 0 ? void 0 : _a.includes("Vercel-Edge"))) {
        return {
          type: "unsupported",
          error: "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",
          workaround: "Use serverless functions or a different deployment target for WebSocket functionality."
        };
      }
      if (typeof process !== "undefined") {
        const processVersions = process["versions"];
        if (processVersions && processVersions["node"]) {
          const versionString = processVersions["node"];
          const nodeVersion = parseInt(versionString.replace(/^v/, "").split(".")[0]);
          if (nodeVersion >= 22) {
            if (typeof globalThis.WebSocket !== "undefined") {
              return { type: "native", constructor: globalThis.WebSocket };
            }
            return {
              type: "unsupported",
              error: `Node.js ${nodeVersion} detected but native WebSocket not found.`,
              workaround: "Provide a WebSocket implementation via the transport option."
            };
          }
          return {
            type: "unsupported",
            error: `Node.js ${nodeVersion} detected without native WebSocket support.`,
            workaround: 'For Node.js < 22, install "ws" package and provide it via the transport option:\nimport ws from "ws"\nnew RealtimeClient(url, { transport: ws })'
          };
        }
      }
      return {
        type: "unsupported",
        error: "Unknown JavaScript runtime without WebSocket support.",
        workaround: "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."
      };
    }
    /**
     * Returns the best available WebSocket constructor for the current runtime.
     *
     * @example
     * ```ts
     * const WS = WebSocketFactory.getWebSocketConstructor()
     * const socket = new WS('wss://realtime.supabase.co/socket')
     * ```
     */
    static getWebSocketConstructor() {
      const env = this.detectEnvironment();
      if (env.constructor) {
        return env.constructor;
      }
      let errorMessage = env.error || "WebSocket not supported in this environment.";
      if (env.workaround) {
        errorMessage += `

Suggested solution: ${env.workaround}`;
      }
      throw new Error(errorMessage);
    }
    /**
     * Creates a WebSocket using the detected constructor.
     *
     * @example
     * ```ts
     * const socket = WebSocketFactory.createWebSocket('wss://realtime.supabase.co/socket')
     * ```
     */
    static createWebSocket(url, protocols) {
      const WS = this.getWebSocketConstructor();
      return new WS(url, protocols);
    }
    /**
     * Detects whether the runtime can establish WebSocket connections.
     *
     * @example
     * ```ts
     * if (!WebSocketFactory.isWebSocketSupported()) {
     *   console.warn('Falling back to long polling')
     * }
     * ```
     */
    static isWebSocketSupported() {
      try {
        const env = this.detectEnvironment();
        return env.type === "native" || env.type === "ws";
      } catch (_a) {
        return false;
      }
    }
  };
  var websocket_factory_default = WebSocketFactory;

  // node_modules/@supabase/realtime-js/dist/module/lib/version.js
  var version = "2.88.0";

  // node_modules/@supabase/realtime-js/dist/module/lib/constants.js
  var DEFAULT_VERSION = `realtime-js/${version}`;
  var VSN_1_0_0 = "1.0.0";
  var VSN_2_0_0 = "2.0.0";
  var DEFAULT_VSN = VSN_1_0_0;
  var DEFAULT_TIMEOUT = 1e4;
  var WS_CLOSE_NORMAL = 1e3;
  var MAX_PUSH_BUFFER_SIZE = 100;
  var SOCKET_STATES;
  (function(SOCKET_STATES2) {
    SOCKET_STATES2[SOCKET_STATES2["connecting"] = 0] = "connecting";
    SOCKET_STATES2[SOCKET_STATES2["open"] = 1] = "open";
    SOCKET_STATES2[SOCKET_STATES2["closing"] = 2] = "closing";
    SOCKET_STATES2[SOCKET_STATES2["closed"] = 3] = "closed";
  })(SOCKET_STATES || (SOCKET_STATES = {}));
  var CHANNEL_STATES;
  (function(CHANNEL_STATES2) {
    CHANNEL_STATES2["closed"] = "closed";
    CHANNEL_STATES2["errored"] = "errored";
    CHANNEL_STATES2["joined"] = "joined";
    CHANNEL_STATES2["joining"] = "joining";
    CHANNEL_STATES2["leaving"] = "leaving";
  })(CHANNEL_STATES || (CHANNEL_STATES = {}));
  var CHANNEL_EVENTS;
  (function(CHANNEL_EVENTS2) {
    CHANNEL_EVENTS2["close"] = "phx_close";
    CHANNEL_EVENTS2["error"] = "phx_error";
    CHANNEL_EVENTS2["join"] = "phx_join";
    CHANNEL_EVENTS2["reply"] = "phx_reply";
    CHANNEL_EVENTS2["leave"] = "phx_leave";
    CHANNEL_EVENTS2["access_token"] = "access_token";
  })(CHANNEL_EVENTS || (CHANNEL_EVENTS = {}));
  var TRANSPORTS;
  (function(TRANSPORTS2) {
    TRANSPORTS2["websocket"] = "websocket";
  })(TRANSPORTS || (TRANSPORTS = {}));
  var CONNECTION_STATE;
  (function(CONNECTION_STATE2) {
    CONNECTION_STATE2["Connecting"] = "connecting";
    CONNECTION_STATE2["Open"] = "open";
    CONNECTION_STATE2["Closing"] = "closing";
    CONNECTION_STATE2["Closed"] = "closed";
  })(CONNECTION_STATE || (CONNECTION_STATE = {}));

  // node_modules/@supabase/realtime-js/dist/module/lib/serializer.js
  var Serializer = class {
    constructor(allowedMetadataKeys) {
      this.HEADER_LENGTH = 1;
      this.USER_BROADCAST_PUSH_META_LENGTH = 6;
      this.KINDS = { userBroadcastPush: 3, userBroadcast: 4 };
      this.BINARY_ENCODING = 0;
      this.JSON_ENCODING = 1;
      this.BROADCAST_EVENT = "broadcast";
      this.allowedMetadataKeys = [];
      this.allowedMetadataKeys = allowedMetadataKeys !== null && allowedMetadataKeys !== void 0 ? allowedMetadataKeys : [];
    }
    encode(msg, callback) {
      if (msg.event === this.BROADCAST_EVENT && !(msg.payload instanceof ArrayBuffer) && typeof msg.payload.event === "string") {
        return callback(this._binaryEncodeUserBroadcastPush(msg));
      }
      let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
      return callback(JSON.stringify(payload));
    }
    _binaryEncodeUserBroadcastPush(message) {
      var _a;
      if (this._isArrayBuffer((_a = message.payload) === null || _a === void 0 ? void 0 : _a.payload)) {
        return this._encodeBinaryUserBroadcastPush(message);
      } else {
        return this._encodeJsonUserBroadcastPush(message);
      }
    }
    _encodeBinaryUserBroadcastPush(message) {
      var _a, _b;
      const userPayload = (_b = (_a = message.payload) === null || _a === void 0 ? void 0 : _a.payload) !== null && _b !== void 0 ? _b : new ArrayBuffer(0);
      return this._encodeUserBroadcastPush(message, this.BINARY_ENCODING, userPayload);
    }
    _encodeJsonUserBroadcastPush(message) {
      var _a, _b;
      const userPayload = (_b = (_a = message.payload) === null || _a === void 0 ? void 0 : _a.payload) !== null && _b !== void 0 ? _b : {};
      const encoder = new TextEncoder();
      const encodedUserPayload = encoder.encode(JSON.stringify(userPayload)).buffer;
      return this._encodeUserBroadcastPush(message, this.JSON_ENCODING, encodedUserPayload);
    }
    _encodeUserBroadcastPush(message, encodingType, encodedPayload) {
      var _a, _b;
      const topic = message.topic;
      const ref = (_a = message.ref) !== null && _a !== void 0 ? _a : "";
      const joinRef = (_b = message.join_ref) !== null && _b !== void 0 ? _b : "";
      const userEvent = message.payload.event;
      const rest = this.allowedMetadataKeys ? this._pick(message.payload, this.allowedMetadataKeys) : {};
      const metadata = Object.keys(rest).length === 0 ? "" : JSON.stringify(rest);
      if (joinRef.length > 255) {
        throw new Error(`joinRef length ${joinRef.length} exceeds maximum of 255`);
      }
      if (ref.length > 255) {
        throw new Error(`ref length ${ref.length} exceeds maximum of 255`);
      }
      if (topic.length > 255) {
        throw new Error(`topic length ${topic.length} exceeds maximum of 255`);
      }
      if (userEvent.length > 255) {
        throw new Error(`userEvent length ${userEvent.length} exceeds maximum of 255`);
      }
      if (metadata.length > 255) {
        throw new Error(`metadata length ${metadata.length} exceeds maximum of 255`);
      }
      const metaLength = this.USER_BROADCAST_PUSH_META_LENGTH + joinRef.length + ref.length + topic.length + userEvent.length + metadata.length;
      const header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
      let view = new DataView(header);
      let offset = 0;
      view.setUint8(offset++, this.KINDS.userBroadcastPush);
      view.setUint8(offset++, joinRef.length);
      view.setUint8(offset++, ref.length);
      view.setUint8(offset++, topic.length);
      view.setUint8(offset++, userEvent.length);
      view.setUint8(offset++, metadata.length);
      view.setUint8(offset++, encodingType);
      Array.from(joinRef, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(userEvent, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(metadata, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      var combined = new Uint8Array(header.byteLength + encodedPayload.byteLength);
      combined.set(new Uint8Array(header), 0);
      combined.set(new Uint8Array(encodedPayload), header.byteLength);
      return combined.buffer;
    }
    decode(rawPayload, callback) {
      if (this._isArrayBuffer(rawPayload)) {
        let result = this._binaryDecode(rawPayload);
        return callback(result);
      }
      if (typeof rawPayload === "string") {
        const jsonPayload = JSON.parse(rawPayload);
        const [join_ref, ref, topic, event, payload] = jsonPayload;
        return callback({ join_ref, ref, topic, event, payload });
      }
      return callback({});
    }
    _binaryDecode(buffer) {
      const view = new DataView(buffer);
      const kind = view.getUint8(0);
      const decoder = new TextDecoder();
      switch (kind) {
        case this.KINDS.userBroadcast:
          return this._decodeUserBroadcast(buffer, view, decoder);
      }
    }
    _decodeUserBroadcast(buffer, view, decoder) {
      const topicSize = view.getUint8(1);
      const userEventSize = view.getUint8(2);
      const metadataSize = view.getUint8(3);
      const payloadEncoding = view.getUint8(4);
      let offset = this.HEADER_LENGTH + 4;
      const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      const userEvent = decoder.decode(buffer.slice(offset, offset + userEventSize));
      offset = offset + userEventSize;
      const metadata = decoder.decode(buffer.slice(offset, offset + metadataSize));
      offset = offset + metadataSize;
      const payload = buffer.slice(offset, buffer.byteLength);
      const parsedPayload = payloadEncoding === this.JSON_ENCODING ? JSON.parse(decoder.decode(payload)) : payload;
      const data = {
        type: this.BROADCAST_EVENT,
        event: userEvent,
        payload: parsedPayload
      };
      if (metadataSize > 0) {
        data["meta"] = JSON.parse(metadata);
      }
      return { join_ref: null, ref: null, topic, event: this.BROADCAST_EVENT, payload: data };
    }
    _isArrayBuffer(buffer) {
      var _a;
      return buffer instanceof ArrayBuffer || ((_a = buffer === null || buffer === void 0 ? void 0 : buffer.constructor) === null || _a === void 0 ? void 0 : _a.name) === "ArrayBuffer";
    }
    _pick(obj, keys) {
      if (!obj || typeof obj !== "object") {
        return {};
      }
      return Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));
    }
  };

  // node_modules/@supabase/realtime-js/dist/module/lib/timer.js
  var Timer = class {
    constructor(callback, timerCalc) {
      this.callback = callback;
      this.timerCalc = timerCalc;
      this.timer = void 0;
      this.tries = 0;
      this.callback = callback;
      this.timerCalc = timerCalc;
    }
    reset() {
      this.tries = 0;
      clearTimeout(this.timer);
      this.timer = void 0;
    }
    // Cancels any previous scheduleTimeout and schedules callback
    scheduleTimeout() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.tries = this.tries + 1;
        this.callback();
      }, this.timerCalc(this.tries + 1));
    }
  };

  // node_modules/@supabase/realtime-js/dist/module/lib/transformers.js
  var PostgresTypes;
  (function(PostgresTypes2) {
    PostgresTypes2["abstime"] = "abstime";
    PostgresTypes2["bool"] = "bool";
    PostgresTypes2["date"] = "date";
    PostgresTypes2["daterange"] = "daterange";
    PostgresTypes2["float4"] = "float4";
    PostgresTypes2["float8"] = "float8";
    PostgresTypes2["int2"] = "int2";
    PostgresTypes2["int4"] = "int4";
    PostgresTypes2["int4range"] = "int4range";
    PostgresTypes2["int8"] = "int8";
    PostgresTypes2["int8range"] = "int8range";
    PostgresTypes2["json"] = "json";
    PostgresTypes2["jsonb"] = "jsonb";
    PostgresTypes2["money"] = "money";
    PostgresTypes2["numeric"] = "numeric";
    PostgresTypes2["oid"] = "oid";
    PostgresTypes2["reltime"] = "reltime";
    PostgresTypes2["text"] = "text";
    PostgresTypes2["time"] = "time";
    PostgresTypes2["timestamp"] = "timestamp";
    PostgresTypes2["timestamptz"] = "timestamptz";
    PostgresTypes2["timetz"] = "timetz";
    PostgresTypes2["tsrange"] = "tsrange";
    PostgresTypes2["tstzrange"] = "tstzrange";
  })(PostgresTypes || (PostgresTypes = {}));
  var convertChangeData = (columns, record, options = {}) => {
    var _a;
    const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
    if (!record) {
      return {};
    }
    return Object.keys(record).reduce((acc, rec_key) => {
      acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
      return acc;
    }, {});
  };
  var convertColumn = (columnName, columns, record, skipTypes) => {
    const column = columns.find((x) => x.name === columnName);
    const colType = column === null || column === void 0 ? void 0 : column.type;
    const value = record[columnName];
    if (colType && !skipTypes.includes(colType)) {
      return convertCell(colType, value);
    }
    return noop(value);
  };
  var convertCell = (type, value) => {
    if (type.charAt(0) === "_") {
      const dataType = type.slice(1, type.length);
      return toArray(value, dataType);
    }
    switch (type) {
      case PostgresTypes.bool:
        return toBoolean(value);
      case PostgresTypes.float4:
      case PostgresTypes.float8:
      case PostgresTypes.int2:
      case PostgresTypes.int4:
      case PostgresTypes.int8:
      case PostgresTypes.numeric:
      case PostgresTypes.oid:
        return toNumber(value);
      case PostgresTypes.json:
      case PostgresTypes.jsonb:
        return toJson(value);
      case PostgresTypes.timestamp:
        return toTimestampString(value);
      // Format to be consistent with PostgREST
      case PostgresTypes.abstime:
      // To allow users to cast it based on Timezone
      case PostgresTypes.date:
      // To allow users to cast it based on Timezone
      case PostgresTypes.daterange:
      case PostgresTypes.int4range:
      case PostgresTypes.int8range:
      case PostgresTypes.money:
      case PostgresTypes.reltime:
      // To allow users to cast it based on Timezone
      case PostgresTypes.text:
      case PostgresTypes.time:
      // To allow users to cast it based on Timezone
      case PostgresTypes.timestamptz:
      // To allow users to cast it based on Timezone
      case PostgresTypes.timetz:
      // To allow users to cast it based on Timezone
      case PostgresTypes.tsrange:
      case PostgresTypes.tstzrange:
        return noop(value);
      default:
        return noop(value);
    }
  };
  var noop = (value) => {
    return value;
  };
  var toBoolean = (value) => {
    switch (value) {
      case "t":
        return true;
      case "f":
        return false;
      default:
        return value;
    }
  };
  var toNumber = (value) => {
    if (typeof value === "string") {
      const parsedValue = parseFloat(value);
      if (!Number.isNaN(parsedValue)) {
        return parsedValue;
      }
    }
    return value;
  };
  var toJson = (value) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch (_a) {
        return value;
      }
    }
    return value;
  };
  var toArray = (value, type) => {
    if (typeof value !== "string") {
      return value;
    }
    const lastIdx = value.length - 1;
    const closeBrace = value[lastIdx];
    const openBrace = value[0];
    if (openBrace === "{" && closeBrace === "}") {
      let arr;
      const valTrim = value.slice(1, lastIdx);
      try {
        arr = JSON.parse("[" + valTrim + "]");
      } catch (_) {
        arr = valTrim ? valTrim.split(",") : [];
      }
      return arr.map((val) => convertCell(type, val));
    }
    return value;
  };
  var toTimestampString = (value) => {
    if (typeof value === "string") {
      return value.replace(" ", "T");
    }
    return value;
  };
  var httpEndpointURL = (socketUrl) => {
    const wsUrl = new URL(socketUrl);
    wsUrl.protocol = wsUrl.protocol.replace(/^ws/i, "http");
    wsUrl.pathname = wsUrl.pathname.replace(/\/+$/, "").replace(/\/socket\/websocket$/i, "").replace(/\/socket$/i, "").replace(/\/websocket$/i, "");
    if (wsUrl.pathname === "" || wsUrl.pathname === "/") {
      wsUrl.pathname = "/api/broadcast";
    } else {
      wsUrl.pathname = wsUrl.pathname + "/api/broadcast";
    }
    return wsUrl.href;
  };

  // node_modules/@supabase/realtime-js/dist/module/lib/push.js
  var Push = class {
    /**
     * Initializes the Push
     *
     * @param channel The Channel
     * @param event The event, for example `"phx_join"`
     * @param payload The payload, for example `{user_id: 123}`
     * @param timeout The push timeout in milliseconds
     */
    constructor(channel, event, payload = {}, timeout = DEFAULT_TIMEOUT) {
      this.channel = channel;
      this.event = event;
      this.payload = payload;
      this.timeout = timeout;
      this.sent = false;
      this.timeoutTimer = void 0;
      this.ref = "";
      this.receivedResp = null;
      this.recHooks = [];
      this.refEvent = null;
    }
    resend(timeout) {
      this.timeout = timeout;
      this._cancelRefEvent();
      this.ref = "";
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
      this.send();
    }
    send() {
      if (this._hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload,
        ref: this.ref,
        join_ref: this.channel._joinRef()
      });
    }
    updatePayload(payload) {
      this.payload = Object.assign(Object.assign({}, this.payload), payload);
    }
    receive(status, callback) {
      var _a;
      if (this._hasReceived(status)) {
        callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
      }
      this.recHooks.push({ status, callback });
      return this;
    }
    startTimeout() {
      if (this.timeoutTimer) {
        return;
      }
      this.ref = this.channel.socket._makeRef();
      this.refEvent = this.channel._replyEventName(this.ref);
      const callback = (payload) => {
        this._cancelRefEvent();
        this._cancelTimeout();
        this.receivedResp = payload;
        this._matchReceive(payload);
      };
      this.channel._on(this.refEvent, {}, callback);
      this.timeoutTimer = setTimeout(() => {
        this.trigger("timeout", {});
      }, this.timeout);
    }
    trigger(status, response) {
      if (this.refEvent)
        this.channel._trigger(this.refEvent, { status, response });
    }
    destroy() {
      this._cancelRefEvent();
      this._cancelTimeout();
    }
    _cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel._off(this.refEvent, {});
    }
    _cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = void 0;
    }
    _matchReceive({ status, response }) {
      this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
    }
    _hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
  };

  // node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js
  var REALTIME_PRESENCE_LISTEN_EVENTS;
  (function(REALTIME_PRESENCE_LISTEN_EVENTS2) {
    REALTIME_PRESENCE_LISTEN_EVENTS2["SYNC"] = "sync";
    REALTIME_PRESENCE_LISTEN_EVENTS2["JOIN"] = "join";
    REALTIME_PRESENCE_LISTEN_EVENTS2["LEAVE"] = "leave";
  })(REALTIME_PRESENCE_LISTEN_EVENTS || (REALTIME_PRESENCE_LISTEN_EVENTS = {}));
  var RealtimePresence = class _RealtimePresence {
    /**
     * Creates a Presence helper that keeps the local presence state in sync with the server.
     *
     * @param channel - The realtime channel to bind to.
     * @param opts - Optional custom event names, e.g. `{ events: { state: 'state', diff: 'diff' } }`.
     *
     * @example
     * ```ts
     * const presence = new RealtimePresence(channel)
     *
     * channel.on('presence', ({ event, key }) => {
     *   console.log(`Presence ${event} on ${key}`)
     * })
     * ```
     */
    constructor(channel, opts) {
      this.channel = channel;
      this.state = {};
      this.pendingDiffs = [];
      this.joinRef = null;
      this.enabled = false;
      this.caller = {
        onJoin: () => {
        },
        onLeave: () => {
        },
        onSync: () => {
        }
      };
      const events = (opts === null || opts === void 0 ? void 0 : opts.events) || {
        state: "presence_state",
        diff: "presence_diff"
      };
      this.channel._on(events.state, {}, (newState) => {
        const { onJoin, onLeave, onSync } = this.caller;
        this.joinRef = this.channel._joinRef();
        this.state = _RealtimePresence.syncState(this.state, newState, onJoin, onLeave);
        this.pendingDiffs.forEach((diff) => {
          this.state = _RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
        });
        this.pendingDiffs = [];
        onSync();
      });
      this.channel._on(events.diff, {}, (diff) => {
        const { onJoin, onLeave, onSync } = this.caller;
        if (this.inPendingSyncState()) {
          this.pendingDiffs.push(diff);
        } else {
          this.state = _RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
          onSync();
        }
      });
      this.onJoin((key, currentPresences, newPresences) => {
        this.channel._trigger("presence", {
          event: "join",
          key,
          currentPresences,
          newPresences
        });
      });
      this.onLeave((key, currentPresences, leftPresences) => {
        this.channel._trigger("presence", {
          event: "leave",
          key,
          currentPresences,
          leftPresences
        });
      });
      this.onSync(() => {
        this.channel._trigger("presence", { event: "sync" });
      });
    }
    /**
     * Used to sync the list of presences on the server with the
     * client's state.
     *
     * An optional `onJoin` and `onLeave` callback can be provided to
     * react to changes in the client's local presences across
     * disconnects and reconnects with the server.
     *
     * @internal
     */
    static syncState(currentState, newState, onJoin, onLeave) {
      const state = this.cloneDeep(currentState);
      const transformedState = this.transformState(newState);
      const joins = {};
      const leaves = {};
      this.map(state, (key, presences) => {
        if (!transformedState[key]) {
          leaves[key] = presences;
        }
      });
      this.map(transformedState, (key, newPresences) => {
        const currentPresences = state[key];
        if (currentPresences) {
          const newPresenceRefs = newPresences.map((m) => m.presence_ref);
          const curPresenceRefs = currentPresences.map((m) => m.presence_ref);
          const joinedPresences = newPresences.filter((m) => curPresenceRefs.indexOf(m.presence_ref) < 0);
          const leftPresences = currentPresences.filter((m) => newPresenceRefs.indexOf(m.presence_ref) < 0);
          if (joinedPresences.length > 0) {
            joins[key] = joinedPresences;
          }
          if (leftPresences.length > 0) {
            leaves[key] = leftPresences;
          }
        } else {
          joins[key] = newPresences;
        }
      });
      return this.syncDiff(state, { joins, leaves }, onJoin, onLeave);
    }
    /**
     * Used to sync a diff of presence join and leave events from the
     * server, as they happen.
     *
     * Like `syncState`, `syncDiff` accepts optional `onJoin` and
     * `onLeave` callbacks to react to a user joining or leaving from a
     * device.
     *
     * @internal
     */
    static syncDiff(state, diff, onJoin, onLeave) {
      const { joins, leaves } = {
        joins: this.transformState(diff.joins),
        leaves: this.transformState(diff.leaves)
      };
      if (!onJoin) {
        onJoin = () => {
        };
      }
      if (!onLeave) {
        onLeave = () => {
        };
      }
      this.map(joins, (key, newPresences) => {
        var _a;
        const currentPresences = (_a = state[key]) !== null && _a !== void 0 ? _a : [];
        state[key] = this.cloneDeep(newPresences);
        if (currentPresences.length > 0) {
          const joinedPresenceRefs = state[key].map((m) => m.presence_ref);
          const curPresences = currentPresences.filter((m) => joinedPresenceRefs.indexOf(m.presence_ref) < 0);
          state[key].unshift(...curPresences);
        }
        onJoin(key, currentPresences, newPresences);
      });
      this.map(leaves, (key, leftPresences) => {
        let currentPresences = state[key];
        if (!currentPresences)
          return;
        const presenceRefsToRemove = leftPresences.map((m) => m.presence_ref);
        currentPresences = currentPresences.filter((m) => presenceRefsToRemove.indexOf(m.presence_ref) < 0);
        state[key] = currentPresences;
        onLeave(key, currentPresences, leftPresences);
        if (currentPresences.length === 0)
          delete state[key];
      });
      return state;
    }
    /** @internal */
    static map(obj, func) {
      return Object.getOwnPropertyNames(obj).map((key) => func(key, obj[key]));
    }
    /**
     * Remove 'metas' key
     * Change 'phx_ref' to 'presence_ref'
     * Remove 'phx_ref' and 'phx_ref_prev'
     *
     * @example
     * // returns {
     *  abc123: [
     *    { presence_ref: '2', user_id: 1 },
     *    { presence_ref: '3', user_id: 2 }
     *  ]
     * }
     * RealtimePresence.transformState({
     *  abc123: {
     *    metas: [
     *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
     *      { phx_ref: '3', user_id: 2 }
     *    ]
     *  }
     * })
     *
     * @internal
     */
    static transformState(state) {
      state = this.cloneDeep(state);
      return Object.getOwnPropertyNames(state).reduce((newState, key) => {
        const presences = state[key];
        if ("metas" in presences) {
          newState[key] = presences.metas.map((presence) => {
            presence["presence_ref"] = presence["phx_ref"];
            delete presence["phx_ref"];
            delete presence["phx_ref_prev"];
            return presence;
          });
        } else {
          newState[key] = presences;
        }
        return newState;
      }, {});
    }
    /** @internal */
    static cloneDeep(obj) {
      return JSON.parse(JSON.stringify(obj));
    }
    /** @internal */
    onJoin(callback) {
      this.caller.onJoin = callback;
    }
    /** @internal */
    onLeave(callback) {
      this.caller.onLeave = callback;
    }
    /** @internal */
    onSync(callback) {
      this.caller.onSync = callback;
    }
    /** @internal */
    inPendingSyncState() {
      return !this.joinRef || this.joinRef !== this.channel._joinRef();
    }
  };

  // node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js
  var REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
  (function(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2) {
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["ALL"] = "*";
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["INSERT"] = "INSERT";
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["UPDATE"] = "UPDATE";
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["DELETE"] = "DELETE";
  })(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT || (REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = {}));
  var REALTIME_LISTEN_TYPES;
  (function(REALTIME_LISTEN_TYPES2) {
    REALTIME_LISTEN_TYPES2["BROADCAST"] = "broadcast";
    REALTIME_LISTEN_TYPES2["PRESENCE"] = "presence";
    REALTIME_LISTEN_TYPES2["POSTGRES_CHANGES"] = "postgres_changes";
    REALTIME_LISTEN_TYPES2["SYSTEM"] = "system";
  })(REALTIME_LISTEN_TYPES || (REALTIME_LISTEN_TYPES = {}));
  var REALTIME_SUBSCRIBE_STATES;
  (function(REALTIME_SUBSCRIBE_STATES2) {
    REALTIME_SUBSCRIBE_STATES2["SUBSCRIBED"] = "SUBSCRIBED";
    REALTIME_SUBSCRIBE_STATES2["TIMED_OUT"] = "TIMED_OUT";
    REALTIME_SUBSCRIBE_STATES2["CLOSED"] = "CLOSED";
    REALTIME_SUBSCRIBE_STATES2["CHANNEL_ERROR"] = "CHANNEL_ERROR";
  })(REALTIME_SUBSCRIBE_STATES || (REALTIME_SUBSCRIBE_STATES = {}));
  var RealtimeChannel = class _RealtimeChannel {
    /**
     * Creates a channel that can broadcast messages, sync presence, and listen to Postgres changes.
     *
     * The topic determines which realtime stream you are subscribing to. Config options let you
     * enable acknowledgement for broadcasts, presence tracking, or private channels.
     *
     * @example
     * ```ts
     * import RealtimeClient from '@supabase/realtime-js'
     *
     * const client = new RealtimeClient('https://xyzcompany.supabase.co/realtime/v1', {
     *   params: { apikey: 'public-anon-key' },
     * })
     * const channel = new RealtimeChannel('realtime:public:messages', { config: {} }, client)
     * ```
     */
    constructor(topic, params = { config: {} }, socket) {
      var _a, _b;
      this.topic = topic;
      this.params = params;
      this.socket = socket;
      this.bindings = {};
      this.state = CHANNEL_STATES.closed;
      this.joinedOnce = false;
      this.pushBuffer = [];
      this.subTopic = topic.replace(/^realtime:/i, "");
      this.params.config = Object.assign({
        broadcast: { ack: false, self: false },
        presence: { key: "", enabled: false },
        private: false
      }, params.config);
      this.timeout = this.socket.timeout;
      this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
      this.rejoinTimer = new Timer(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs);
      this.joinPush.receive("ok", () => {
        this.state = CHANNEL_STATES.joined;
        this.rejoinTimer.reset();
        this.pushBuffer.forEach((pushEvent) => pushEvent.send());
        this.pushBuffer = [];
      });
      this._onClose(() => {
        this.rejoinTimer.reset();
        this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`);
        this.state = CHANNEL_STATES.closed;
        this.socket._remove(this);
      });
      this._onError((reason) => {
        if (this._isLeaving() || this._isClosed()) {
          return;
        }
        this.socket.log("channel", `error ${this.topic}`, reason);
        this.state = CHANNEL_STATES.errored;
        this.rejoinTimer.scheduleTimeout();
      });
      this.joinPush.receive("timeout", () => {
        if (!this._isJoining()) {
          return;
        }
        this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout);
        this.state = CHANNEL_STATES.errored;
        this.rejoinTimer.scheduleTimeout();
      });
      this.joinPush.receive("error", (reason) => {
        if (this._isLeaving() || this._isClosed()) {
          return;
        }
        this.socket.log("channel", `error ${this.topic}`, reason);
        this.state = CHANNEL_STATES.errored;
        this.rejoinTimer.scheduleTimeout();
      });
      this._on(CHANNEL_EVENTS.reply, {}, (payload, ref) => {
        this._trigger(this._replyEventName(ref), payload);
      });
      this.presence = new RealtimePresence(this);
      this.broadcastEndpointURL = httpEndpointURL(this.socket.endPoint);
      this.private = this.params.config.private || false;
      if (!this.private && ((_b = (_a = this.params.config) === null || _a === void 0 ? void 0 : _a.broadcast) === null || _b === void 0 ? void 0 : _b.replay)) {
        throw `tried to use replay on public channel '${this.topic}'. It must be a private channel.`;
      }
    }
    /** Subscribe registers your client with the server */
    subscribe(callback, timeout = this.timeout) {
      var _a, _b, _c;
      if (!this.socket.isConnected()) {
        this.socket.connect();
      }
      if (this.state == CHANNEL_STATES.closed) {
        const { config: { broadcast, presence, private: isPrivate } } = this.params;
        const postgres_changes = (_b = (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.map((r2) => r2.filter)) !== null && _b !== void 0 ? _b : [];
        const presence_enabled = !!this.bindings[REALTIME_LISTEN_TYPES.PRESENCE] && this.bindings[REALTIME_LISTEN_TYPES.PRESENCE].length > 0 || ((_c = this.params.config.presence) === null || _c === void 0 ? void 0 : _c.enabled) === true;
        const accessTokenPayload = {};
        const config = {
          broadcast,
          presence: Object.assign(Object.assign({}, presence), { enabled: presence_enabled }),
          postgres_changes,
          private: isPrivate
        };
        if (this.socket.accessTokenValue) {
          accessTokenPayload.access_token = this.socket.accessTokenValue;
        }
        this._onError((e2) => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, e2));
        this._onClose(() => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CLOSED));
        this.updateJoinPayload(Object.assign({ config }, accessTokenPayload));
        this.joinedOnce = true;
        this._rejoin(timeout);
        this.joinPush.receive("ok", async ({ postgres_changes: postgres_changes2 }) => {
          var _a2;
          if (!this.socket._isManualToken()) {
            this.socket.setAuth();
          }
          if (postgres_changes2 === void 0) {
            callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
            return;
          } else {
            const clientPostgresBindings = this.bindings.postgres_changes;
            const bindingsLen = (_a2 = clientPostgresBindings === null || clientPostgresBindings === void 0 ? void 0 : clientPostgresBindings.length) !== null && _a2 !== void 0 ? _a2 : 0;
            const newPostgresBindings = [];
            for (let i2 = 0; i2 < bindingsLen; i2++) {
              const clientPostgresBinding = clientPostgresBindings[i2];
              const { filter: { event, schema, table, filter } } = clientPostgresBinding;
              const serverPostgresFilter = postgres_changes2 && postgres_changes2[i2];
              if (serverPostgresFilter && serverPostgresFilter.event === event && _RealtimeChannel.isFilterValueEqual(serverPostgresFilter.schema, schema) && _RealtimeChannel.isFilterValueEqual(serverPostgresFilter.table, table) && _RealtimeChannel.isFilterValueEqual(serverPostgresFilter.filter, filter)) {
                newPostgresBindings.push(Object.assign(Object.assign({}, clientPostgresBinding), { id: serverPostgresFilter.id }));
              } else {
                this.unsubscribe();
                this.state = CHANNEL_STATES.errored;
                callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error("mismatch between server and client bindings for postgres changes"));
                return;
              }
            }
            this.bindings.postgres_changes = newPostgresBindings;
            callback && callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
            return;
          }
        }).receive("error", (error) => {
          this.state = CHANNEL_STATES.errored;
          callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error(JSON.stringify(Object.values(error).join(", ") || "error")));
          return;
        }).receive("timeout", () => {
          callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.TIMED_OUT);
          return;
        });
      }
      return this;
    }
    /**
     * Returns the current presence state for this channel.
     *
     * The shape is a map keyed by presence key (for example a user id) where each entry contains the
     * tracked metadata for that user.
     */
    presenceState() {
      return this.presence.state;
    }
    /**
     * Sends the supplied payload to the presence tracker so other subscribers can see that this
     * client is online. Use `untrack` to stop broadcasting presence for the same key.
     */
    async track(payload, opts = {}) {
      return await this.send({
        type: "presence",
        event: "track",
        payload
      }, opts.timeout || this.timeout);
    }
    /**
     * Removes the current presence state for this client.
     */
    async untrack(opts = {}) {
      return await this.send({
        type: "presence",
        event: "untrack"
      }, opts);
    }
    on(type, filter, callback) {
      if (this.state === CHANNEL_STATES.joined && type === REALTIME_LISTEN_TYPES.PRESENCE) {
        this.socket.log("channel", `resubscribe to ${this.topic} due to change in presence callbacks on joined channel`);
        this.unsubscribe().then(async () => await this.subscribe());
      }
      return this._on(type, filter, callback);
    }
    /**
     * Sends a broadcast message explicitly via REST API.
     *
     * This method always uses the REST API endpoint regardless of WebSocket connection state.
     * Useful when you want to guarantee REST delivery or when gradually migrating from implicit REST fallback.
     *
     * @param event The name of the broadcast event
     * @param payload Payload to be sent (required)
     * @param opts Options including timeout
     * @returns Promise resolving to object with success status, and error details if failed
     */
    async httpSend(event, payload, opts = {}) {
      var _a;
      if (payload === void 0 || payload === null) {
        return Promise.reject("Payload is required for httpSend()");
      }
      const headers = {
        apikey: this.socket.apiKey ? this.socket.apiKey : "",
        "Content-Type": "application/json"
      };
      if (this.socket.accessTokenValue) {
        headers["Authorization"] = `Bearer ${this.socket.accessTokenValue}`;
      }
      const options = {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages: [
            {
              topic: this.subTopic,
              event,
              payload,
              private: this.private
            }
          ]
        })
      };
      const response = await this._fetchWithTimeout(this.broadcastEndpointURL, options, (_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout);
      if (response.status === 202) {
        return { success: true };
      }
      let errorMessage = response.statusText;
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.error || errorBody.message || errorMessage;
      } catch (_b) {
      }
      return Promise.reject(new Error(errorMessage));
    }
    /**
     * Sends a message into the channel.
     *
     * @param args Arguments to send to channel
     * @param args.type The type of event to send
     * @param args.event The name of the event being sent
     * @param args.payload Payload to be sent
     * @param opts Options to be used during the send process
     */
    async send(args, opts = {}) {
      var _a, _b;
      if (!this._canPush() && args.type === "broadcast") {
        console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");
        const { event, payload: endpoint_payload } = args;
        const headers = {
          apikey: this.socket.apiKey ? this.socket.apiKey : "",
          "Content-Type": "application/json"
        };
        if (this.socket.accessTokenValue) {
          headers["Authorization"] = `Bearer ${this.socket.accessTokenValue}`;
        }
        const options = {
          method: "POST",
          headers,
          body: JSON.stringify({
            messages: [
              {
                topic: this.subTopic,
                event,
                payload: endpoint_payload,
                private: this.private
              }
            ]
          })
        };
        try {
          const response = await this._fetchWithTimeout(this.broadcastEndpointURL, options, (_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout);
          await ((_b = response.body) === null || _b === void 0 ? void 0 : _b.cancel());
          return response.ok ? "ok" : "error";
        } catch (error) {
          if (error.name === "AbortError") {
            return "timed out";
          } else {
            return "error";
          }
        }
      } else {
        return new Promise((resolve) => {
          var _a2, _b2, _c;
          const push = this._push(args.type, args, opts.timeout || this.timeout);
          if (args.type === "broadcast" && !((_c = (_b2 = (_a2 = this.params) === null || _a2 === void 0 ? void 0 : _a2.config) === null || _b2 === void 0 ? void 0 : _b2.broadcast) === null || _c === void 0 ? void 0 : _c.ack)) {
            resolve("ok");
          }
          push.receive("ok", () => resolve("ok"));
          push.receive("error", () => resolve("error"));
          push.receive("timeout", () => resolve("timed out"));
        });
      }
    }
    /**
     * Updates the payload that will be sent the next time the channel joins (reconnects).
     * Useful for rotating access tokens or updating config without re-creating the channel.
     */
    updateJoinPayload(payload) {
      this.joinPush.updatePayload(payload);
    }
    /**
     * Leaves the channel.
     *
     * Unsubscribes from server events, and instructs channel to terminate on server.
     * Triggers onClose() hooks.
     *
     * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
     * channel.unsubscribe().receive("ok", () => alert("left!") )
     */
    unsubscribe(timeout = this.timeout) {
      this.state = CHANNEL_STATES.leaving;
      const onClose = () => {
        this.socket.log("channel", `leave ${this.topic}`);
        this._trigger(CHANNEL_EVENTS.close, "leave", this._joinRef());
      };
      this.joinPush.destroy();
      let leavePush = null;
      return new Promise((resolve) => {
        leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
        leavePush.receive("ok", () => {
          onClose();
          resolve("ok");
        }).receive("timeout", () => {
          onClose();
          resolve("timed out");
        }).receive("error", () => {
          resolve("error");
        });
        leavePush.send();
        if (!this._canPush()) {
          leavePush.trigger("ok", {});
        }
      }).finally(() => {
        leavePush === null || leavePush === void 0 ? void 0 : leavePush.destroy();
      });
    }
    /**
     * Teardown the channel.
     *
     * Destroys and stops related timers.
     */
    teardown() {
      this.pushBuffer.forEach((push) => push.destroy());
      this.pushBuffer = [];
      this.rejoinTimer.reset();
      this.joinPush.destroy();
      this.state = CHANNEL_STATES.closed;
      this.bindings = {};
    }
    /** @internal */
    async _fetchWithTimeout(url, options, timeout) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const response = await this.socket.fetch(url, Object.assign(Object.assign({}, options), { signal: controller.signal }));
      clearTimeout(id);
      return response;
    }
    /** @internal */
    _push(event, payload, timeout = this.timeout) {
      if (!this.joinedOnce) {
        throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
      }
      let pushEvent = new Push(this, event, payload, timeout);
      if (this._canPush()) {
        pushEvent.send();
      } else {
        this._addToPushBuffer(pushEvent);
      }
      return pushEvent;
    }
    /** @internal */
    _addToPushBuffer(pushEvent) {
      pushEvent.startTimeout();
      this.pushBuffer.push(pushEvent);
      if (this.pushBuffer.length > MAX_PUSH_BUFFER_SIZE) {
        const removedPush = this.pushBuffer.shift();
        if (removedPush) {
          removedPush.destroy();
          this.socket.log("channel", `discarded push due to buffer overflow: ${removedPush.event}`, removedPush.payload);
        }
      }
    }
    /**
     * Overridable message hook
     *
     * Receives all events for specialized message handling before dispatching to the channel callbacks.
     * Must return the payload, modified or unmodified.
     *
     * @internal
     */
    _onMessage(_event, payload, _ref) {
      return payload;
    }
    /** @internal */
    _isMember(topic) {
      return this.topic === topic;
    }
    /** @internal */
    _joinRef() {
      return this.joinPush.ref;
    }
    /** @internal */
    _trigger(type, payload, ref) {
      var _a, _b;
      const typeLower = type.toLocaleLowerCase();
      const { close, error, leave, join } = CHANNEL_EVENTS;
      const events = [close, error, leave, join];
      if (ref && events.indexOf(typeLower) >= 0 && ref !== this._joinRef()) {
        return;
      }
      let handledPayload = this._onMessage(typeLower, payload, ref);
      if (payload && !handledPayload) {
        throw "channel onMessage callbacks must return the payload, modified or unmodified";
      }
      if (["insert", "update", "delete"].includes(typeLower)) {
        (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.filter((bind) => {
          var _a2, _b2, _c;
          return ((_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event) === "*" || ((_c = (_b2 = bind.filter) === null || _b2 === void 0 ? void 0 : _b2.event) === null || _c === void 0 ? void 0 : _c.toLocaleLowerCase()) === typeLower;
        }).map((bind) => bind.callback(handledPayload, ref));
      } else {
        (_b = this.bindings[typeLower]) === null || _b === void 0 ? void 0 : _b.filter((bind) => {
          var _a2, _b2, _c, _d, _e, _f;
          if (["broadcast", "presence", "postgres_changes"].includes(typeLower)) {
            if ("id" in bind) {
              const bindId = bind.id;
              const bindEvent = (_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event;
              return bindId && ((_b2 = payload.ids) === null || _b2 === void 0 ? void 0 : _b2.includes(bindId)) && (bindEvent === "*" || (bindEvent === null || bindEvent === void 0 ? void 0 : bindEvent.toLocaleLowerCase()) === ((_c = payload.data) === null || _c === void 0 ? void 0 : _c.type.toLocaleLowerCase()));
            } else {
              const bindEvent = (_e = (_d = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _d === void 0 ? void 0 : _d.event) === null || _e === void 0 ? void 0 : _e.toLocaleLowerCase();
              return bindEvent === "*" || bindEvent === ((_f = payload === null || payload === void 0 ? void 0 : payload.event) === null || _f === void 0 ? void 0 : _f.toLocaleLowerCase());
            }
          } else {
            return bind.type.toLocaleLowerCase() === typeLower;
          }
        }).map((bind) => {
          if (typeof handledPayload === "object" && "ids" in handledPayload) {
            const postgresChanges = handledPayload.data;
            const { schema, table, commit_timestamp, type: type2, errors } = postgresChanges;
            const enrichedPayload = {
              schema,
              table,
              commit_timestamp,
              eventType: type2,
              new: {},
              old: {},
              errors
            };
            handledPayload = Object.assign(Object.assign({}, enrichedPayload), this._getPayloadRecords(postgresChanges));
          }
          bind.callback(handledPayload, ref);
        });
      }
    }
    /** @internal */
    _isClosed() {
      return this.state === CHANNEL_STATES.closed;
    }
    /** @internal */
    _isJoined() {
      return this.state === CHANNEL_STATES.joined;
    }
    /** @internal */
    _isJoining() {
      return this.state === CHANNEL_STATES.joining;
    }
    /** @internal */
    _isLeaving() {
      return this.state === CHANNEL_STATES.leaving;
    }
    /** @internal */
    _replyEventName(ref) {
      return `chan_reply_${ref}`;
    }
    /** @internal */
    _on(type, filter, callback) {
      const typeLower = type.toLocaleLowerCase();
      const binding = {
        type: typeLower,
        filter,
        callback
      };
      if (this.bindings[typeLower]) {
        this.bindings[typeLower].push(binding);
      } else {
        this.bindings[typeLower] = [binding];
      }
      return this;
    }
    /** @internal */
    _off(type, filter) {
      const typeLower = type.toLocaleLowerCase();
      if (this.bindings[typeLower]) {
        this.bindings[typeLower] = this.bindings[typeLower].filter((bind) => {
          var _a;
          return !(((_a = bind.type) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) === typeLower && _RealtimeChannel.isEqual(bind.filter, filter));
        });
      }
      return this;
    }
    /** @internal */
    static isEqual(obj1, obj2) {
      if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
      }
      for (const k in obj1) {
        if (obj1[k] !== obj2[k]) {
          return false;
        }
      }
      return true;
    }
    /**
     * Compares two optional filter values for equality.
     * Treats undefined, null, and empty string as equivalent empty values.
     * @internal
     */
    static isFilterValueEqual(serverValue, clientValue) {
      const normalizedServer = serverValue !== null && serverValue !== void 0 ? serverValue : void 0;
      const normalizedClient = clientValue !== null && clientValue !== void 0 ? clientValue : void 0;
      return normalizedServer === normalizedClient;
    }
    /** @internal */
    _rejoinUntilConnected() {
      this.rejoinTimer.scheduleTimeout();
      if (this.socket.isConnected()) {
        this._rejoin();
      }
    }
    /**
     * Registers a callback that will be executed when the channel closes.
     *
     * @internal
     */
    _onClose(callback) {
      this._on(CHANNEL_EVENTS.close, {}, callback);
    }
    /**
     * Registers a callback that will be executed when the channel encounteres an error.
     *
     * @internal
     */
    _onError(callback) {
      this._on(CHANNEL_EVENTS.error, {}, (reason) => callback(reason));
    }
    /**
     * Returns `true` if the socket is connected and the channel has been joined.
     *
     * @internal
     */
    _canPush() {
      return this.socket.isConnected() && this._isJoined();
    }
    /** @internal */
    _rejoin(timeout = this.timeout) {
      if (this._isLeaving()) {
        return;
      }
      this.socket._leaveOpenTopic(this.topic);
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
    /** @internal */
    _getPayloadRecords(payload) {
      const records = {
        new: {},
        old: {}
      };
      if (payload.type === "INSERT" || payload.type === "UPDATE") {
        records.new = convertChangeData(payload.columns, payload.record);
      }
      if (payload.type === "UPDATE" || payload.type === "DELETE") {
        records.old = convertChangeData(payload.columns, payload.old_record);
      }
      return records;
    }
  };

  // node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js
  var noop2 = () => {
  };
  var CONNECTION_TIMEOUTS = {
    HEARTBEAT_INTERVAL: 25e3,
    RECONNECT_DELAY: 10,
    HEARTBEAT_TIMEOUT_FALLBACK: 100
  };
  var RECONNECT_INTERVALS = [1e3, 2e3, 5e3, 1e4];
  var DEFAULT_RECONNECT_FALLBACK = 1e4;
  var WORKER_SCRIPT = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
  var RealtimeClient = class {
    /**
     * Initializes the Socket.
     *
     * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
     * @param httpEndpoint The string HTTP endpoint, ie, "https://example.com", "/" (inherited host & protocol)
     * @param options.transport The Websocket Transport, for example WebSocket. This can be a custom implementation
     * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
     * @param options.params The optional params to pass when connecting.
     * @param options.headers Deprecated: headers cannot be set on websocket connections and this option will be removed in the future.
     * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
     * @param options.heartbeatCallback The optional function to handle heartbeat status.
     * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
     * @param options.logLevel Sets the log level for Realtime
     * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
     * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
     * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
     * @param options.worker Use Web Worker to set a side flow. Defaults to false.
     * @param options.workerUrl The URL of the worker script. Defaults to https://realtime.supabase.com/worker.js that includes a heartbeat event call to keep the connection alive.
     * @example
     * ```ts
     * import RealtimeClient from '@supabase/realtime-js'
     *
     * const client = new RealtimeClient('https://xyzcompany.supabase.co/realtime/v1', {
     *   params: { apikey: 'public-anon-key' },
     * })
     * client.connect()
     * ```
     */
    constructor(endPoint, options) {
      var _a;
      this.accessTokenValue = null;
      this.apiKey = null;
      this._manuallySetToken = false;
      this.channels = new Array();
      this.endPoint = "";
      this.httpEndpoint = "";
      this.headers = {};
      this.params = {};
      this.timeout = DEFAULT_TIMEOUT;
      this.transport = null;
      this.heartbeatIntervalMs = CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL;
      this.heartbeatTimer = void 0;
      this.pendingHeartbeatRef = null;
      this.heartbeatCallback = noop2;
      this.ref = 0;
      this.reconnectTimer = null;
      this.vsn = DEFAULT_VSN;
      this.logger = noop2;
      this.conn = null;
      this.sendBuffer = [];
      this.serializer = new Serializer();
      this.stateChangeCallbacks = {
        open: [],
        close: [],
        error: [],
        message: []
      };
      this.accessToken = null;
      this._connectionState = "disconnected";
      this._wasManualDisconnect = false;
      this._authPromise = null;
      this._resolveFetch = (customFetch) => {
        if (customFetch) {
          return (...args) => customFetch(...args);
        }
        return (...args) => fetch(...args);
      };
      if (!((_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.apikey)) {
        throw new Error("API key is required to connect to Realtime");
      }
      this.apiKey = options.params.apikey;
      this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
      this.httpEndpoint = httpEndpointURL(endPoint);
      this._initializeOptions(options);
      this._setupReconnectionTimer();
      this.fetch = this._resolveFetch(options === null || options === void 0 ? void 0 : options.fetch);
    }
    /**
     * Connects the socket, unless already connected.
     */
    connect() {
      if (this.isConnecting() || this.isDisconnecting() || this.conn !== null && this.isConnected()) {
        return;
      }
      this._setConnectionState("connecting");
      if (this.accessToken && !this._authPromise) {
        this._setAuthSafely("connect");
      }
      if (this.transport) {
        this.conn = new this.transport(this.endpointURL());
      } else {
        try {
          this.conn = websocket_factory_default.createWebSocket(this.endpointURL());
        } catch (error) {
          this._setConnectionState("disconnected");
          const errorMessage = error.message;
          if (errorMessage.includes("Node.js")) {
            throw new Error(`${errorMessage}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`);
          }
          throw new Error(`WebSocket not available: ${errorMessage}`);
        }
      }
      this._setupConnectionHandlers();
    }
    /**
     * Returns the URL of the websocket.
     * @returns string The URL of the websocket.
     */
    endpointURL() {
      return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: this.vsn }));
    }
    /**
     * Disconnects the socket.
     *
     * @param code A numeric status code to send on disconnect.
     * @param reason A custom reason for the disconnect.
     */
    disconnect(code, reason) {
      if (this.isDisconnecting()) {
        return;
      }
      this._setConnectionState("disconnecting", true);
      if (this.conn) {
        const fallbackTimer = setTimeout(() => {
          this._setConnectionState("disconnected");
        }, 100);
        this.conn.onclose = () => {
          clearTimeout(fallbackTimer);
          this._setConnectionState("disconnected");
        };
        if (typeof this.conn.close === "function") {
          if (code) {
            this.conn.close(code, reason !== null && reason !== void 0 ? reason : "");
          } else {
            this.conn.close();
          }
        }
        this._teardownConnection();
      } else {
        this._setConnectionState("disconnected");
      }
    }
    /**
     * Returns all created channels
     */
    getChannels() {
      return this.channels;
    }
    /**
     * Unsubscribes and removes a single channel
     * @param channel A RealtimeChannel instance
     */
    async removeChannel(channel) {
      const status = await channel.unsubscribe();
      if (this.channels.length === 0) {
        this.disconnect();
      }
      return status;
    }
    /**
     * Unsubscribes and removes all channels
     */
    async removeAllChannels() {
      const values_1 = await Promise.all(this.channels.map((channel) => channel.unsubscribe()));
      this.channels = [];
      this.disconnect();
      return values_1;
    }
    /**
     * Logs the message.
     *
     * For customized logging, `this.logger` can be overridden.
     */
    log(kind, msg, data) {
      this.logger(kind, msg, data);
    }
    /**
     * Returns the current state of the socket.
     */
    connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return CONNECTION_STATE.Connecting;
        case SOCKET_STATES.open:
          return CONNECTION_STATE.Open;
        case SOCKET_STATES.closing:
          return CONNECTION_STATE.Closing;
        default:
          return CONNECTION_STATE.Closed;
      }
    }
    /**
     * Returns `true` is the connection is open.
     */
    isConnected() {
      return this.connectionState() === CONNECTION_STATE.Open;
    }
    /**
     * Returns `true` if the connection is currently connecting.
     */
    isConnecting() {
      return this._connectionState === "connecting";
    }
    /**
     * Returns `true` if the connection is currently disconnecting.
     */
    isDisconnecting() {
      return this._connectionState === "disconnecting";
    }
    /**
     * Creates (or reuses) a {@link RealtimeChannel} for the provided topic.
     *
     * Topics are automatically prefixed with `realtime:` to match the Realtime service.
     * If a channel with the same topic already exists it will be returned instead of creating
     * a duplicate connection.
     */
    channel(topic, params = { config: {} }) {
      const realtimeTopic = `realtime:${topic}`;
      const exists = this.getChannels().find((c2) => c2.topic === realtimeTopic);
      if (!exists) {
        const chan = new RealtimeChannel(`realtime:${topic}`, params, this);
        this.channels.push(chan);
        return chan;
      } else {
        return exists;
      }
    }
    /**
     * Push out a message if the socket is connected.
     *
     * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
     */
    push(data) {
      const { topic, event, payload, ref } = data;
      const callback = () => {
        this.encode(data, (result) => {
          var _a;
          (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
        });
      };
      this.log("push", `${topic} ${event} (${ref})`, payload);
      if (this.isConnected()) {
        callback();
      } else {
        this.sendBuffer.push(callback);
      }
    }
    /**
     * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
     *
     * If param is null it will use the `accessToken` callback function or the token set on the client.
     *
     * On callback used, it will set the value of the token internal to the client.
     *
     * When a token is explicitly provided, it will be preserved across channel operations
     * (including removeChannel and resubscribe). The `accessToken` callback will not be
     * invoked until `setAuth()` is called without arguments.
     *
     * @param token A JWT string to override the token set on the client.
     *
     * @example
     * // Use a manual token (preserved across resubscribes, ignores accessToken callback)
     * client.realtime.setAuth('my-custom-jwt')
     *
     * // Switch back to using the accessToken callback
     * client.realtime.setAuth()
     */
    async setAuth(token = null) {
      this._authPromise = this._performAuth(token);
      try {
        await this._authPromise;
      } finally {
        this._authPromise = null;
      }
    }
    /**
     * Returns true if the current access token was explicitly set via setAuth(token),
     * false if it was obtained via the accessToken callback.
     * @internal
     */
    _isManualToken() {
      return this._manuallySetToken;
    }
    /**
     * Sends a heartbeat message if the socket is connected.
     */
    async sendHeartbeat() {
      var _a;
      if (!this.isConnected()) {
        try {
          this.heartbeatCallback("disconnected");
        } catch (e2) {
          this.log("error", "error in heartbeat callback", e2);
        }
        return;
      }
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
        this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
        try {
          this.heartbeatCallback("timeout");
        } catch (e2) {
          this.log("error", "error in heartbeat callback", e2);
        }
        this._wasManualDisconnect = false;
        (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(WS_CLOSE_NORMAL, "heartbeat timeout");
        setTimeout(() => {
          var _a2;
          if (!this.isConnected()) {
            (_a2 = this.reconnectTimer) === null || _a2 === void 0 ? void 0 : _a2.scheduleTimeout();
          }
        }, CONNECTION_TIMEOUTS.HEARTBEAT_TIMEOUT_FALLBACK);
        return;
      }
      this.pendingHeartbeatRef = this._makeRef();
      this.push({
        topic: "phoenix",
        event: "heartbeat",
        payload: {},
        ref: this.pendingHeartbeatRef
      });
      try {
        this.heartbeatCallback("sent");
      } catch (e2) {
        this.log("error", "error in heartbeat callback", e2);
      }
      this._setAuthSafely("heartbeat");
    }
    /**
     * Sets a callback that receives lifecycle events for internal heartbeat messages.
     * Useful for instrumenting connection health (e.g. sent/ok/timeout/disconnected).
     */
    onHeartbeat(callback) {
      this.heartbeatCallback = callback;
    }
    /**
     * Flushes send buffer
     */
    flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach((callback) => callback());
        this.sendBuffer = [];
      }
    }
    /**
     * Return the next message ref, accounting for overflows
     *
     * @internal
     */
    _makeRef() {
      let newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }
      return this.ref.toString();
    }
    /**
     * Unsubscribe from channels with the specified topic.
     *
     * @internal
     */
    _leaveOpenTopic(topic) {
      let dupChannel = this.channels.find((c2) => c2.topic === topic && (c2._isJoined() || c2._isJoining()));
      if (dupChannel) {
        this.log("transport", `leaving duplicate topic "${topic}"`);
        dupChannel.unsubscribe();
      }
    }
    /**
     * Removes a subscription from the socket.
     *
     * @param channel An open subscription.
     *
     * @internal
     */
    _remove(channel) {
      this.channels = this.channels.filter((c2) => c2.topic !== channel.topic);
    }
    /** @internal */
    _onConnMessage(rawMessage) {
      this.decode(rawMessage.data, (msg) => {
        if (msg.topic === "phoenix" && msg.event === "phx_reply") {
          try {
            this.heartbeatCallback(msg.payload.status === "ok" ? "ok" : "error");
          } catch (e2) {
            this.log("error", "error in heartbeat callback", e2);
          }
        }
        if (msg.ref && msg.ref === this.pendingHeartbeatRef) {
          this.pendingHeartbeatRef = null;
        }
        const { topic, event, payload, ref } = msg;
        const refString = ref ? `(${ref})` : "";
        const status = payload.status || "";
        this.log("receive", `${status} ${topic} ${event} ${refString}`.trim(), payload);
        this.channels.filter((channel) => channel._isMember(topic)).forEach((channel) => channel._trigger(event, payload, ref));
        this._triggerStateCallbacks("message", msg);
      });
    }
    /**
     * Clear specific timer
     * @internal
     */
    _clearTimer(timer) {
      var _a;
      if (timer === "heartbeat" && this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = void 0;
      } else if (timer === "reconnect") {
        (_a = this.reconnectTimer) === null || _a === void 0 ? void 0 : _a.reset();
      }
    }
    /**
     * Clear all timers
     * @internal
     */
    _clearAllTimers() {
      this._clearTimer("heartbeat");
      this._clearTimer("reconnect");
    }
    /**
     * Setup connection handlers for WebSocket events
     * @internal
     */
    _setupConnectionHandlers() {
      if (!this.conn)
        return;
      if ("binaryType" in this.conn) {
        ;
        this.conn.binaryType = "arraybuffer";
      }
      this.conn.onopen = () => this._onConnOpen();
      this.conn.onerror = (error) => this._onConnError(error);
      this.conn.onmessage = (event) => this._onConnMessage(event);
      this.conn.onclose = (event) => this._onConnClose(event);
      if (this.conn.readyState === SOCKET_STATES.open) {
        this._onConnOpen();
      }
    }
    /**
     * Teardown connection and cleanup resources
     * @internal
     */
    _teardownConnection() {
      if (this.conn) {
        if (this.conn.readyState === SOCKET_STATES.open || this.conn.readyState === SOCKET_STATES.connecting) {
          try {
            this.conn.close();
          } catch (e2) {
            this.log("error", "Error closing connection", e2);
          }
        }
        this.conn.onopen = null;
        this.conn.onerror = null;
        this.conn.onmessage = null;
        this.conn.onclose = null;
        this.conn = null;
      }
      this._clearAllTimers();
      this._terminateWorker();
      this.channels.forEach((channel) => channel.teardown());
    }
    /** @internal */
    _onConnOpen() {
      this._setConnectionState("connected");
      this.log("transport", `connected to ${this.endpointURL()}`);
      const authPromise = this._authPromise || (this.accessToken && !this.accessTokenValue ? this.setAuth() : Promise.resolve());
      authPromise.then(() => {
        this.flushSendBuffer();
      }).catch((e2) => {
        this.log("error", "error waiting for auth on connect", e2);
        this.flushSendBuffer();
      });
      this._clearTimer("reconnect");
      if (!this.worker) {
        this._startHeartbeat();
      } else {
        if (!this.workerRef) {
          this._startWorkerHeartbeat();
        }
      }
      this._triggerStateCallbacks("open");
    }
    /** @internal */
    _startHeartbeat() {
      this.heartbeatTimer && clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }
    /** @internal */
    _startWorkerHeartbeat() {
      if (this.workerUrl) {
        this.log("worker", `starting worker for from ${this.workerUrl}`);
      } else {
        this.log("worker", `starting default worker`);
      }
      const objectUrl = this._workerObjectUrl(this.workerUrl);
      this.workerRef = new Worker(objectUrl);
      this.workerRef.onerror = (error) => {
        this.log("worker", "worker error", error.message);
        this._terminateWorker();
      };
      this.workerRef.onmessage = (event) => {
        if (event.data.event === "keepAlive") {
          this.sendHeartbeat();
        }
      };
      this.workerRef.postMessage({
        event: "start",
        interval: this.heartbeatIntervalMs
      });
    }
    /**
     * Terminate the Web Worker and clear the reference
     * @internal
     */
    _terminateWorker() {
      if (this.workerRef) {
        this.log("worker", "terminating worker");
        this.workerRef.terminate();
        this.workerRef = void 0;
      }
    }
    /** @internal */
    _onConnClose(event) {
      var _a;
      this._setConnectionState("disconnected");
      this.log("transport", "close", event);
      this._triggerChanError();
      this._clearTimer("heartbeat");
      if (!this._wasManualDisconnect) {
        (_a = this.reconnectTimer) === null || _a === void 0 ? void 0 : _a.scheduleTimeout();
      }
      this._triggerStateCallbacks("close", event);
    }
    /** @internal */
    _onConnError(error) {
      this._setConnectionState("disconnected");
      this.log("transport", `${error}`);
      this._triggerChanError();
      this._triggerStateCallbacks("error", error);
    }
    /** @internal */
    _triggerChanError() {
      this.channels.forEach((channel) => channel._trigger(CHANNEL_EVENTS.error));
    }
    /** @internal */
    _appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }
      const prefix = url.match(/\?/) ? "&" : "?";
      const query = new URLSearchParams(params);
      return `${url}${prefix}${query}`;
    }
    _workerObjectUrl(url) {
      let result_url;
      if (url) {
        result_url = url;
      } else {
        const blob = new Blob([WORKER_SCRIPT], { type: "application/javascript" });
        result_url = URL.createObjectURL(blob);
      }
      return result_url;
    }
    /**
     * Set connection state with proper state management
     * @internal
     */
    _setConnectionState(state, manual = false) {
      this._connectionState = state;
      if (state === "connecting") {
        this._wasManualDisconnect = false;
      } else if (state === "disconnecting") {
        this._wasManualDisconnect = manual;
      }
    }
    /**
     * Perform the actual auth operation
     * @internal
     */
    async _performAuth(token = null) {
      let tokenToSend;
      let isManualToken = false;
      if (token) {
        tokenToSend = token;
        isManualToken = true;
      } else if (this.accessToken) {
        try {
          tokenToSend = await this.accessToken();
        } catch (e2) {
          this.log("error", "Error fetching access token from callback", e2);
          tokenToSend = this.accessTokenValue;
        }
      } else {
        tokenToSend = this.accessTokenValue;
      }
      if (isManualToken) {
        this._manuallySetToken = true;
      } else if (this.accessToken) {
        this._manuallySetToken = false;
      }
      if (this.accessTokenValue != tokenToSend) {
        this.accessTokenValue = tokenToSend;
        this.channels.forEach((channel) => {
          const payload = {
            access_token: tokenToSend,
            version: DEFAULT_VERSION
          };
          tokenToSend && channel.updateJoinPayload(payload);
          if (channel.joinedOnce && channel._isJoined()) {
            channel._push(CHANNEL_EVENTS.access_token, {
              access_token: tokenToSend
            });
          }
        });
      }
    }
    /**
     * Wait for any in-flight auth operations to complete
     * @internal
     */
    async _waitForAuthIfNeeded() {
      if (this._authPromise) {
        await this._authPromise;
      }
    }
    /**
     * Safely call setAuth with standardized error handling
     * @internal
     */
    _setAuthSafely(context = "general") {
      if (!this._isManualToken()) {
        this.setAuth().catch((e2) => {
          this.log("error", `Error setting auth in ${context}`, e2);
        });
      }
    }
    /**
     * Trigger state change callbacks with proper error handling
     * @internal
     */
    _triggerStateCallbacks(event, data) {
      try {
        this.stateChangeCallbacks[event].forEach((callback) => {
          try {
            callback(data);
          } catch (e2) {
            this.log("error", `error in ${event} callback`, e2);
          }
        });
      } catch (e2) {
        this.log("error", `error triggering ${event} callbacks`, e2);
      }
    }
    /**
     * Setup reconnection timer with proper configuration
     * @internal
     */
    _setupReconnectionTimer() {
      this.reconnectTimer = new Timer(async () => {
        setTimeout(async () => {
          await this._waitForAuthIfNeeded();
          if (!this.isConnected()) {
            this.connect();
          }
        }, CONNECTION_TIMEOUTS.RECONNECT_DELAY);
      }, this.reconnectAfterMs);
    }
    /**
     * Initialize client options with defaults
     * @internal
     */
    _initializeOptions(options) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
      this.transport = (_a = options === null || options === void 0 ? void 0 : options.transport) !== null && _a !== void 0 ? _a : null;
      this.timeout = (_b = options === null || options === void 0 ? void 0 : options.timeout) !== null && _b !== void 0 ? _b : DEFAULT_TIMEOUT;
      this.heartbeatIntervalMs = (_c = options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs) !== null && _c !== void 0 ? _c : CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL;
      this.worker = (_d = options === null || options === void 0 ? void 0 : options.worker) !== null && _d !== void 0 ? _d : false;
      this.accessToken = (_e = options === null || options === void 0 ? void 0 : options.accessToken) !== null && _e !== void 0 ? _e : null;
      this.heartbeatCallback = (_f = options === null || options === void 0 ? void 0 : options.heartbeatCallback) !== null && _f !== void 0 ? _f : noop2;
      this.vsn = (_g = options === null || options === void 0 ? void 0 : options.vsn) !== null && _g !== void 0 ? _g : DEFAULT_VSN;
      if (options === null || options === void 0 ? void 0 : options.params)
        this.params = options.params;
      if (options === null || options === void 0 ? void 0 : options.logger)
        this.logger = options.logger;
      if ((options === null || options === void 0 ? void 0 : options.logLevel) || (options === null || options === void 0 ? void 0 : options.log_level)) {
        this.logLevel = options.logLevel || options.log_level;
        this.params = Object.assign(Object.assign({}, this.params), { log_level: this.logLevel });
      }
      this.reconnectAfterMs = (_h = options === null || options === void 0 ? void 0 : options.reconnectAfterMs) !== null && _h !== void 0 ? _h : ((tries) => {
        return RECONNECT_INTERVALS[tries - 1] || DEFAULT_RECONNECT_FALLBACK;
      });
      switch (this.vsn) {
        case VSN_1_0_0:
          this.encode = (_j = options === null || options === void 0 ? void 0 : options.encode) !== null && _j !== void 0 ? _j : ((payload, callback) => {
            return callback(JSON.stringify(payload));
          });
          this.decode = (_k = options === null || options === void 0 ? void 0 : options.decode) !== null && _k !== void 0 ? _k : ((payload, callback) => {
            return callback(JSON.parse(payload));
          });
          break;
        case VSN_2_0_0:
          this.encode = (_l = options === null || options === void 0 ? void 0 : options.encode) !== null && _l !== void 0 ? _l : this.serializer.encode.bind(this.serializer);
          this.decode = (_m = options === null || options === void 0 ? void 0 : options.decode) !== null && _m !== void 0 ? _m : this.serializer.decode.bind(this.serializer);
          break;
        default:
          throw new Error(`Unsupported serializer version: ${this.vsn}`);
      }
      if (this.worker) {
        if (typeof window !== "undefined" && !window.Worker) {
          throw new Error("Web Worker is not supported");
        }
        this.workerUrl = options === null || options === void 0 ? void 0 : options.workerUrl;
      }
    }
  };

  // node_modules/iceberg-js/dist/index.mjs
  var IcebergError = class extends Error {
    constructor(message, opts) {
      super(message);
      this.name = "IcebergError";
      this.status = opts.status;
      this.icebergType = opts.icebergType;
      this.icebergCode = opts.icebergCode;
      this.details = opts.details;
      this.isCommitStateUnknown = opts.icebergType === "CommitStateUnknownException" || [500, 502, 504].includes(opts.status) && opts.icebergType?.includes("CommitState") === true;
    }
    /**
     * Returns true if the error is a 404 Not Found error.
     */
    isNotFound() {
      return this.status === 404;
    }
    /**
     * Returns true if the error is a 409 Conflict error.
     */
    isConflict() {
      return this.status === 409;
    }
    /**
     * Returns true if the error is a 419 Authentication Timeout error.
     */
    isAuthenticationTimeout() {
      return this.status === 419;
    }
  };
  function buildUrl(baseUrl, path, query) {
    const url = new URL(path, baseUrl);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== void 0) {
          url.searchParams.set(key, value);
        }
      }
    }
    return url.toString();
  }
  async function buildAuthHeaders(auth2) {
    if (!auth2 || auth2.type === "none") {
      return {};
    }
    if (auth2.type === "bearer") {
      return { Authorization: `Bearer ${auth2.token}` };
    }
    if (auth2.type === "header") {
      return { [auth2.name]: auth2.value };
    }
    if (auth2.type === "custom") {
      return await auth2.getHeaders();
    }
    return {};
  }
  function createFetchClient(options) {
    const fetchFn = options.fetchImpl ?? globalThis.fetch;
    return {
      async request({
        method,
        path,
        query,
        body,
        headers
      }) {
        const url = buildUrl(options.baseUrl, path, query);
        const authHeaders = await buildAuthHeaders(options.auth);
        const res = await fetchFn(url, {
          method,
          headers: {
            ...body ? { "Content-Type": "application/json" } : {},
            ...authHeaders,
            ...headers
          },
          body: body ? JSON.stringify(body) : void 0
        });
        const text = await res.text();
        const isJson = (res.headers.get("content-type") || "").includes("application/json");
        const data = isJson && text ? JSON.parse(text) : text;
        if (!res.ok) {
          const errBody = isJson ? data : void 0;
          const errorDetail = errBody?.error;
          throw new IcebergError(
            errorDetail?.message ?? `Request failed with status ${res.status}`,
            {
              status: res.status,
              icebergType: errorDetail?.type,
              icebergCode: errorDetail?.code,
              details: errBody
            }
          );
        }
        return { status: res.status, headers: res.headers, data };
      }
    };
  }
  function namespaceToPath(namespace) {
    return namespace.join("");
  }
  var NamespaceOperations = class {
    constructor(client, prefix = "") {
      this.client = client;
      this.prefix = prefix;
    }
    async listNamespaces(parent) {
      const query = parent ? { parent: namespaceToPath(parent.namespace) } : void 0;
      const response = await this.client.request({
        method: "GET",
        path: `${this.prefix}/namespaces`,
        query
      });
      return response.data.namespaces.map((ns) => ({ namespace: ns }));
    }
    async createNamespace(id, metadata) {
      const request = {
        namespace: id.namespace,
        properties: metadata?.properties
      };
      const response = await this.client.request({
        method: "POST",
        path: `${this.prefix}/namespaces`,
        body: request
      });
      return response.data;
    }
    async dropNamespace(id) {
      await this.client.request({
        method: "DELETE",
        path: `${this.prefix}/namespaces/${namespaceToPath(id.namespace)}`
      });
    }
    async loadNamespaceMetadata(id) {
      const response = await this.client.request({
        method: "GET",
        path: `${this.prefix}/namespaces/${namespaceToPath(id.namespace)}`
      });
      return {
        properties: response.data.properties
      };
    }
    async namespaceExists(id) {
      try {
        await this.client.request({
          method: "HEAD",
          path: `${this.prefix}/namespaces/${namespaceToPath(id.namespace)}`
        });
        return true;
      } catch (error) {
        if (error instanceof IcebergError && error.status === 404) {
          return false;
        }
        throw error;
      }
    }
    async createNamespaceIfNotExists(id, metadata) {
      try {
        return await this.createNamespace(id, metadata);
      } catch (error) {
        if (error instanceof IcebergError && error.status === 409) {
          return;
        }
        throw error;
      }
    }
  };
  function namespaceToPath2(namespace) {
    return namespace.join("");
  }
  var TableOperations = class {
    constructor(client, prefix = "", accessDelegation) {
      this.client = client;
      this.prefix = prefix;
      this.accessDelegation = accessDelegation;
    }
    async listTables(namespace) {
      const response = await this.client.request({
        method: "GET",
        path: `${this.prefix}/namespaces/${namespaceToPath2(namespace.namespace)}/tables`
      });
      return response.data.identifiers;
    }
    async createTable(namespace, request) {
      const headers = {};
      if (this.accessDelegation) {
        headers["X-Iceberg-Access-Delegation"] = this.accessDelegation;
      }
      const response = await this.client.request({
        method: "POST",
        path: `${this.prefix}/namespaces/${namespaceToPath2(namespace.namespace)}/tables`,
        body: request,
        headers
      });
      return response.data.metadata;
    }
    async updateTable(id, request) {
      const response = await this.client.request({
        method: "POST",
        path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
        body: request
      });
      return {
        "metadata-location": response.data["metadata-location"],
        metadata: response.data.metadata
      };
    }
    async dropTable(id, options) {
      await this.client.request({
        method: "DELETE",
        path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
        query: { purgeRequested: String(options?.purge ?? false) }
      });
    }
    async loadTable(id) {
      const headers = {};
      if (this.accessDelegation) {
        headers["X-Iceberg-Access-Delegation"] = this.accessDelegation;
      }
      const response = await this.client.request({
        method: "GET",
        path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
        headers
      });
      return response.data.metadata;
    }
    async tableExists(id) {
      const headers = {};
      if (this.accessDelegation) {
        headers["X-Iceberg-Access-Delegation"] = this.accessDelegation;
      }
      try {
        await this.client.request({
          method: "HEAD",
          path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
          headers
        });
        return true;
      } catch (error) {
        if (error instanceof IcebergError && error.status === 404) {
          return false;
        }
        throw error;
      }
    }
    async createTableIfNotExists(namespace, request) {
      try {
        return await this.createTable(namespace, request);
      } catch (error) {
        if (error instanceof IcebergError && error.status === 409) {
          return await this.loadTable({ namespace: namespace.namespace, name: request.name });
        }
        throw error;
      }
    }
  };
  var IcebergRestCatalog = class {
    /**
     * Creates a new Iceberg REST Catalog client.
     *
     * @param options - Configuration options for the catalog client
     */
    constructor(options) {
      let prefix = "v1";
      if (options.catalogName) {
        prefix += `/${options.catalogName}`;
      }
      const baseUrl = options.baseUrl.endsWith("/") ? options.baseUrl : `${options.baseUrl}/`;
      this.client = createFetchClient({
        baseUrl,
        auth: options.auth,
        fetchImpl: options.fetch
      });
      this.accessDelegation = options.accessDelegation?.join(",");
      this.namespaceOps = new NamespaceOperations(this.client, prefix);
      this.tableOps = new TableOperations(this.client, prefix, this.accessDelegation);
    }
    /**
     * Lists all namespaces in the catalog.
     *
     * @param parent - Optional parent namespace to list children under
     * @returns Array of namespace identifiers
     *
     * @example
     * ```typescript
     * // List all top-level namespaces
     * const namespaces = await catalog.listNamespaces();
     *
     * // List namespaces under a parent
     * const children = await catalog.listNamespaces({ namespace: ['analytics'] });
     * ```
     */
    async listNamespaces(parent) {
      return this.namespaceOps.listNamespaces(parent);
    }
    /**
     * Creates a new namespace in the catalog.
     *
     * @param id - Namespace identifier to create
     * @param metadata - Optional metadata properties for the namespace
     * @returns Response containing the created namespace and its properties
     *
     * @example
     * ```typescript
     * const response = await catalog.createNamespace(
     *   { namespace: ['analytics'] },
     *   { properties: { owner: 'data-team' } }
     * );
     * console.log(response.namespace); // ['analytics']
     * console.log(response.properties); // { owner: 'data-team', ... }
     * ```
     */
    async createNamespace(id, metadata) {
      return this.namespaceOps.createNamespace(id, metadata);
    }
    /**
     * Drops a namespace from the catalog.
     *
     * The namespace must be empty (contain no tables) before it can be dropped.
     *
     * @param id - Namespace identifier to drop
     *
     * @example
     * ```typescript
     * await catalog.dropNamespace({ namespace: ['analytics'] });
     * ```
     */
    async dropNamespace(id) {
      await this.namespaceOps.dropNamespace(id);
    }
    /**
     * Loads metadata for a namespace.
     *
     * @param id - Namespace identifier to load
     * @returns Namespace metadata including properties
     *
     * @example
     * ```typescript
     * const metadata = await catalog.loadNamespaceMetadata({ namespace: ['analytics'] });
     * console.log(metadata.properties);
     * ```
     */
    async loadNamespaceMetadata(id) {
      return this.namespaceOps.loadNamespaceMetadata(id);
    }
    /**
     * Lists all tables in a namespace.
     *
     * @param namespace - Namespace identifier to list tables from
     * @returns Array of table identifiers
     *
     * @example
     * ```typescript
     * const tables = await catalog.listTables({ namespace: ['analytics'] });
     * console.log(tables); // [{ namespace: ['analytics'], name: 'events' }, ...]
     * ```
     */
    async listTables(namespace) {
      return this.tableOps.listTables(namespace);
    }
    /**
     * Creates a new table in the catalog.
     *
     * @param namespace - Namespace to create the table in
     * @param request - Table creation request including name, schema, partition spec, etc.
     * @returns Table metadata for the created table
     *
     * @example
     * ```typescript
     * const metadata = await catalog.createTable(
     *   { namespace: ['analytics'] },
     *   {
     *     name: 'events',
     *     schema: {
     *       type: 'struct',
     *       fields: [
     *         { id: 1, name: 'id', type: 'long', required: true },
     *         { id: 2, name: 'timestamp', type: 'timestamp', required: true }
     *       ],
     *       'schema-id': 0
     *     },
     *     'partition-spec': {
     *       'spec-id': 0,
     *       fields: [
     *         { source_id: 2, field_id: 1000, name: 'ts_day', transform: 'day' }
     *       ]
     *     }
     *   }
     * );
     * ```
     */
    async createTable(namespace, request) {
      return this.tableOps.createTable(namespace, request);
    }
    /**
     * Updates an existing table's metadata.
     *
     * Can update the schema, partition spec, or properties of a table.
     *
     * @param id - Table identifier to update
     * @param request - Update request with fields to modify
     * @returns Response containing the metadata location and updated table metadata
     *
     * @example
     * ```typescript
     * const response = await catalog.updateTable(
     *   { namespace: ['analytics'], name: 'events' },
     *   {
     *     properties: { 'read.split.target-size': '134217728' }
     *   }
     * );
     * console.log(response['metadata-location']); // s3://...
     * console.log(response.metadata); // TableMetadata object
     * ```
     */
    async updateTable(id, request) {
      return this.tableOps.updateTable(id, request);
    }
    /**
     * Drops a table from the catalog.
     *
     * @param id - Table identifier to drop
     *
     * @example
     * ```typescript
     * await catalog.dropTable({ namespace: ['analytics'], name: 'events' });
     * ```
     */
    async dropTable(id, options) {
      await this.tableOps.dropTable(id, options);
    }
    /**
     * Loads metadata for a table.
     *
     * @param id - Table identifier to load
     * @returns Table metadata including schema, partition spec, location, etc.
     *
     * @example
     * ```typescript
     * const metadata = await catalog.loadTable({ namespace: ['analytics'], name: 'events' });
     * console.log(metadata.schema);
     * console.log(metadata.location);
     * ```
     */
    async loadTable(id) {
      return this.tableOps.loadTable(id);
    }
    /**
     * Checks if a namespace exists in the catalog.
     *
     * @param id - Namespace identifier to check
     * @returns True if the namespace exists, false otherwise
     *
     * @example
     * ```typescript
     * const exists = await catalog.namespaceExists({ namespace: ['analytics'] });
     * console.log(exists); // true or false
     * ```
     */
    async namespaceExists(id) {
      return this.namespaceOps.namespaceExists(id);
    }
    /**
     * Checks if a table exists in the catalog.
     *
     * @param id - Table identifier to check
     * @returns True if the table exists, false otherwise
     *
     * @example
     * ```typescript
     * const exists = await catalog.tableExists({ namespace: ['analytics'], name: 'events' });
     * console.log(exists); // true or false
     * ```
     */
    async tableExists(id) {
      return this.tableOps.tableExists(id);
    }
    /**
     * Creates a namespace if it does not exist.
     *
     * If the namespace already exists, returns void. If created, returns the response.
     *
     * @param id - Namespace identifier to create
     * @param metadata - Optional metadata properties for the namespace
     * @returns Response containing the created namespace and its properties, or void if it already exists
     *
     * @example
     * ```typescript
     * const response = await catalog.createNamespaceIfNotExists(
     *   { namespace: ['analytics'] },
     *   { properties: { owner: 'data-team' } }
     * );
     * if (response) {
     *   console.log('Created:', response.namespace);
     * } else {
     *   console.log('Already exists');
     * }
     * ```
     */
    async createNamespaceIfNotExists(id, metadata) {
      return this.namespaceOps.createNamespaceIfNotExists(id, metadata);
    }
    /**
     * Creates a table if it does not exist.
     *
     * If the table already exists, returns its metadata instead.
     *
     * @param namespace - Namespace to create the table in
     * @param request - Table creation request including name, schema, partition spec, etc.
     * @returns Table metadata for the created or existing table
     *
     * @example
     * ```typescript
     * const metadata = await catalog.createTableIfNotExists(
     *   { namespace: ['analytics'] },
     *   {
     *     name: 'events',
     *     schema: {
     *       type: 'struct',
     *       fields: [
     *         { id: 1, name: 'id', type: 'long', required: true },
     *         { id: 2, name: 'timestamp', type: 'timestamp', required: true }
     *       ],
     *       'schema-id': 0
     *     }
     *   }
     * );
     * ```
     */
    async createTableIfNotExists(namespace, request) {
      return this.tableOps.createTableIfNotExists(namespace, request);
    }
  };

  // node_modules/@supabase/storage-js/dist/index.mjs
  var StorageError = class extends Error {
    constructor(message) {
      super(message);
      this.__isStorageError = true;
      this.name = "StorageError";
    }
  };
  function isStorageError(error) {
    return typeof error === "object" && error !== null && "__isStorageError" in error;
  }
  var StorageApiError = class extends StorageError {
    constructor(message, status, statusCode) {
      super(message);
      this.name = "StorageApiError";
      this.status = status;
      this.statusCode = statusCode;
    }
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        status: this.status,
        statusCode: this.statusCode
      };
    }
  };
  var StorageUnknownError = class extends StorageError {
    constructor(message, originalError) {
      super(message);
      this.name = "StorageUnknownError";
      this.originalError = originalError;
    }
  };
  var resolveFetch$1 = (customFetch) => {
    if (customFetch) return (...args) => customFetch(...args);
    return (...args) => fetch(...args);
  };
  var resolveResponse$1 = () => {
    return Response;
  };
  var recursiveToCamel = (item) => {
    if (Array.isArray(item)) return item.map((el) => recursiveToCamel(el));
    else if (typeof item === "function" || item !== Object(item)) return item;
    const result = {};
    Object.entries(item).forEach(([key, value]) => {
      const newKey = key.replace(/([-_][a-z])/gi, (c2) => c2.toUpperCase().replace(/[-_]/g, ""));
      result[newKey] = recursiveToCamel(value);
    });
    return result;
  };
  var isPlainObject$1 = (value) => {
    if (typeof value !== "object" || value === null) return false;
    const prototype = Object.getPrototypeOf(value);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
  };
  var isValidBucketName = (bucketName) => {
    if (!bucketName || typeof bucketName !== "string") return false;
    if (bucketName.length === 0 || bucketName.length > 100) return false;
    if (bucketName.trim() !== bucketName) return false;
    if (bucketName.includes("/") || bucketName.includes("\\")) return false;
    return /^[\w!.\*'() &$@=;:+,?-]+$/.test(bucketName);
  };
  function _typeof(o2) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
      return typeof o$1;
    } : function(o$1) {
      return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
    }, _typeof(o2);
  }
  function toPrimitive(t2, r2) {
    if ("object" != _typeof(t2) || !t2) return t2;
    var e2 = t2[Symbol.toPrimitive];
    if (void 0 !== e2) {
      var i2 = e2.call(t2, r2 || "default");
      if ("object" != _typeof(i2)) return i2;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t2);
  }
  function toPropertyKey(t2) {
    var i2 = toPrimitive(t2, "string");
    return "symbol" == _typeof(i2) ? i2 : i2 + "";
  }
  function _defineProperty(e2, r2, t2) {
    return (r2 = toPropertyKey(r2)) in e2 ? Object.defineProperty(e2, r2, {
      value: t2,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e2[r2] = t2, e2;
  }
  function ownKeys(e2, r2) {
    var t2 = Object.keys(e2);
    if (Object.getOwnPropertySymbols) {
      var o2 = Object.getOwnPropertySymbols(e2);
      r2 && (o2 = o2.filter(function(r$1) {
        return Object.getOwnPropertyDescriptor(e2, r$1).enumerable;
      })), t2.push.apply(t2, o2);
    }
    return t2;
  }
  function _objectSpread2(e2) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys(Object(t2), true).forEach(function(r$1) {
        _defineProperty(e2, r$1, t2[r$1]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys(Object(t2)).forEach(function(r$1) {
        Object.defineProperty(e2, r$1, Object.getOwnPropertyDescriptor(t2, r$1));
      });
    }
    return e2;
  }
  var _getErrorMessage$1 = (err) => {
    var _err$error;
    return err.msg || err.message || err.error_description || (typeof err.error === "string" ? err.error : (_err$error = err.error) === null || _err$error === void 0 ? void 0 : _err$error.message) || JSON.stringify(err);
  };
  var handleError$1 = async (error, reject, options) => {
    if (error instanceof await resolveResponse$1() && !(options === null || options === void 0 ? void 0 : options.noResolveJson)) error.json().then((err) => {
      const status = error.status || 500;
      const statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || status + "";
      reject(new StorageApiError(_getErrorMessage$1(err), status, statusCode));
    }).catch((err) => {
      reject(new StorageUnknownError(_getErrorMessage$1(err), err));
    });
    else reject(new StorageUnknownError(_getErrorMessage$1(error), error));
  };
  var _getRequestParams$1 = (method, options, parameters, body) => {
    const params = {
      method,
      headers: (options === null || options === void 0 ? void 0 : options.headers) || {}
    };
    if (method === "GET" || !body) return params;
    if (isPlainObject$1(body)) {
      params.headers = _objectSpread2({ "Content-Type": "application/json" }, options === null || options === void 0 ? void 0 : options.headers);
      params.body = JSON.stringify(body);
    } else params.body = body;
    if (options === null || options === void 0 ? void 0 : options.duplex) params.duplex = options.duplex;
    return _objectSpread2(_objectSpread2({}, params), parameters);
  };
  async function _handleRequest$1(fetcher, method, url, options, parameters, body) {
    return new Promise((resolve, reject) => {
      fetcher(url, _getRequestParams$1(method, options, parameters, body)).then((result) => {
        if (!result.ok) throw result;
        if (options === null || options === void 0 ? void 0 : options.noResolveJson) return result;
        return result.json();
      }).then((data) => resolve(data)).catch((error) => handleError$1(error, reject, options));
    });
  }
  async function get(fetcher, url, options, parameters) {
    return _handleRequest$1(fetcher, "GET", url, options, parameters);
  }
  async function post$1(fetcher, url, body, options, parameters) {
    return _handleRequest$1(fetcher, "POST", url, options, parameters, body);
  }
  async function put(fetcher, url, body, options, parameters) {
    return _handleRequest$1(fetcher, "PUT", url, options, parameters, body);
  }
  async function head(fetcher, url, options, parameters) {
    return _handleRequest$1(fetcher, "HEAD", url, _objectSpread2(_objectSpread2({}, options), {}, { noResolveJson: true }), parameters);
  }
  async function remove(fetcher, url, body, options, parameters) {
    return _handleRequest$1(fetcher, "DELETE", url, options, parameters, body);
  }
  var StreamDownloadBuilder = class {
    constructor(downloadFn, shouldThrowOnError) {
      this.downloadFn = downloadFn;
      this.shouldThrowOnError = shouldThrowOnError;
    }
    then(onfulfilled, onrejected) {
      return this.execute().then(onfulfilled, onrejected);
    }
    async execute() {
      var _this = this;
      try {
        return {
          data: (await _this.downloadFn()).body,
          error: null
        };
      } catch (error) {
        if (_this.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
  };
  var _Symbol$toStringTag;
  _Symbol$toStringTag = Symbol.toStringTag;
  var BlobDownloadBuilder = class {
    constructor(downloadFn, shouldThrowOnError) {
      this.downloadFn = downloadFn;
      this.shouldThrowOnError = shouldThrowOnError;
      this[_Symbol$toStringTag] = "BlobDownloadBuilder";
      this.promise = null;
    }
    asStream() {
      return new StreamDownloadBuilder(this.downloadFn, this.shouldThrowOnError);
    }
    then(onfulfilled, onrejected) {
      return this.getPromise().then(onfulfilled, onrejected);
    }
    catch(onrejected) {
      return this.getPromise().catch(onrejected);
    }
    finally(onfinally) {
      return this.getPromise().finally(onfinally);
    }
    getPromise() {
      if (!this.promise) this.promise = this.execute();
      return this.promise;
    }
    async execute() {
      var _this = this;
      try {
        return {
          data: await (await _this.downloadFn()).blob(),
          error: null
        };
      } catch (error) {
        if (_this.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
  };
  var DEFAULT_SEARCH_OPTIONS = {
    limit: 100,
    offset: 0,
    sortBy: {
      column: "name",
      order: "asc"
    }
  };
  var DEFAULT_FILE_OPTIONS = {
    cacheControl: "3600",
    contentType: "text/plain;charset=UTF-8",
    upsert: false
  };
  var StorageFileApi = class {
    constructor(url, headers = {}, bucketId, fetch$1) {
      this.shouldThrowOnError = false;
      this.url = url;
      this.headers = headers;
      this.bucketId = bucketId;
      this.fetch = resolveFetch$1(fetch$1);
    }
    /**
    * Enable throwing errors instead of returning them.
    *
    * @category File Buckets
    */
    throwOnError() {
      this.shouldThrowOnError = true;
      return this;
    }
    /**
    * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
    *
    * @param method HTTP method.
    * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
    * @param fileBody The body of the file to be stored in the bucket.
    */
    async uploadOrUpdate(method, path, fileBody, fileOptions) {
      var _this = this;
      try {
        let body;
        const options = _objectSpread2(_objectSpread2({}, DEFAULT_FILE_OPTIONS), fileOptions);
        let headers = _objectSpread2(_objectSpread2({}, _this.headers), method === "POST" && { "x-upsert": String(options.upsert) });
        const metadata = options.metadata;
        if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
          body = new FormData();
          body.append("cacheControl", options.cacheControl);
          if (metadata) body.append("metadata", _this.encodeMetadata(metadata));
          body.append("", fileBody);
        } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
          body = fileBody;
          if (!body.has("cacheControl")) body.append("cacheControl", options.cacheControl);
          if (metadata && !body.has("metadata")) body.append("metadata", _this.encodeMetadata(metadata));
        } else {
          body = fileBody;
          headers["cache-control"] = `max-age=${options.cacheControl}`;
          headers["content-type"] = options.contentType;
          if (metadata) headers["x-metadata"] = _this.toBase64(_this.encodeMetadata(metadata));
          if ((typeof ReadableStream !== "undefined" && body instanceof ReadableStream || body && typeof body === "object" && "pipe" in body && typeof body.pipe === "function") && !options.duplex) options.duplex = "half";
        }
        if (fileOptions === null || fileOptions === void 0 ? void 0 : fileOptions.headers) headers = _objectSpread2(_objectSpread2({}, headers), fileOptions.headers);
        const cleanPath = _this._removeEmptyFolders(path);
        const _path = _this._getFinalPath(cleanPath);
        const data = await (method == "PUT" ? put : post$1)(_this.fetch, `${_this.url}/object/${_path}`, body, _objectSpread2({ headers }, (options === null || options === void 0 ? void 0 : options.duplex) ? { duplex: options.duplex } : {}));
        return {
          data: {
            path: cleanPath,
            id: data.Id,
            fullPath: data.Key
          },
          error: null
        };
      } catch (error) {
        if (_this.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * Uploads a file to an existing bucket.
    *
    * @category File Buckets
    * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
    * @param fileBody The body of the file to be stored in the bucket.
    * @param fileOptions Optional file upload options including cacheControl, contentType, upsert, and metadata.
    * @returns Promise with response containing file path, id, and fullPath or error
    *
    * @example Upload file
    * ```js
    * const avatarFile = event.target.files[0]
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .upload('public/avatar1.png', avatarFile, {
    *     cacheControl: '3600',
    *     upsert: false
    *   })
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "path": "public/avatar1.png",
    *     "fullPath": "avatars/public/avatar1.png"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @example Upload file using `ArrayBuffer` from base64 file data
    * ```js
    * import { decode } from 'base64-arraybuffer'
    *
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .upload('public/avatar1.png', decode('base64FileData'), {
    *     contentType: 'image/png'
    *   })
    * ```
    */
    async upload(path, fileBody, fileOptions) {
      return this.uploadOrUpdate("POST", path, fileBody, fileOptions);
    }
    /**
    * Upload a file with a token generated from `createSignedUploadUrl`.
    *
    * @category File Buckets
    * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
    * @param token The token generated from `createSignedUploadUrl`
    * @param fileBody The body of the file to be stored in the bucket.
    * @param fileOptions HTTP headers (cacheControl, contentType, etc.).
    * **Note:** The `upsert` option has no effect here. To enable upsert behavior,
    * pass `{ upsert: true }` when calling `createSignedUploadUrl()` instead.
    * @returns Promise with response containing file path and fullPath or error
    *
    * @example Upload to a signed URL
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .uploadToSignedUrl('folder/cat.jpg', 'token-from-createSignedUploadUrl', file)
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "path": "folder/cat.jpg",
    *     "fullPath": "avatars/folder/cat.jpg"
    *   },
    *   "error": null
    * }
    * ```
    */
    async uploadToSignedUrl(path, token, fileBody, fileOptions) {
      var _this3 = this;
      const cleanPath = _this3._removeEmptyFolders(path);
      const _path = _this3._getFinalPath(cleanPath);
      const url = new URL(_this3.url + `/object/upload/sign/${_path}`);
      url.searchParams.set("token", token);
      try {
        let body;
        const options = _objectSpread2({ upsert: DEFAULT_FILE_OPTIONS.upsert }, fileOptions);
        const headers = _objectSpread2(_objectSpread2({}, _this3.headers), { "x-upsert": String(options.upsert) });
        if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
          body = new FormData();
          body.append("cacheControl", options.cacheControl);
          body.append("", fileBody);
        } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
          body = fileBody;
          body.append("cacheControl", options.cacheControl);
        } else {
          body = fileBody;
          headers["cache-control"] = `max-age=${options.cacheControl}`;
          headers["content-type"] = options.contentType;
        }
        return {
          data: {
            path: cleanPath,
            fullPath: (await put(_this3.fetch, url.toString(), body, { headers })).Key
          },
          error: null
        };
      } catch (error) {
        if (_this3.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * Creates a signed upload URL.
    * Signed upload URLs can be used to upload files to the bucket without further authentication.
    * They are valid for 2 hours.
    *
    * @category File Buckets
    * @param path The file path, including the current file name. For example `folder/image.png`.
    * @param options.upsert If set to true, allows the file to be overwritten if it already exists.
    * @returns Promise with response containing signed upload URL, token, and path or error
    *
    * @example Create Signed Upload URL
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .createSignedUploadUrl('folder/cat.jpg')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "signedUrl": "https://example.supabase.co/storage/v1/object/upload/sign/avatars/folder/cat.jpg?token=<TOKEN>",
    *     "path": "folder/cat.jpg",
    *     "token": "<TOKEN>"
    *   },
    *   "error": null
    * }
    * ```
    */
    async createSignedUploadUrl(path, options) {
      var _this4 = this;
      try {
        let _path = _this4._getFinalPath(path);
        const headers = _objectSpread2({}, _this4.headers);
        if (options === null || options === void 0 ? void 0 : options.upsert) headers["x-upsert"] = "true";
        const data = await post$1(_this4.fetch, `${_this4.url}/object/upload/sign/${_path}`, {}, { headers });
        const url = new URL(_this4.url + data.url);
        const token = url.searchParams.get("token");
        if (!token) throw new StorageError("No token returned by API");
        return {
          data: {
            signedUrl: url.toString(),
            path,
            token
          },
          error: null
        };
      } catch (error) {
        if (_this4.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * Replaces an existing file at the specified path with a new one.
    *
    * @category File Buckets
    * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
    * @param fileBody The body of the file to be stored in the bucket.
    * @param fileOptions Optional file upload options including cacheControl, contentType, upsert, and metadata.
    * @returns Promise with response containing file path, id, and fullPath or error
    *
    * @example Update file
    * ```js
    * const avatarFile = event.target.files[0]
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .update('public/avatar1.png', avatarFile, {
    *     cacheControl: '3600',
    *     upsert: true
    *   })
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "path": "public/avatar1.png",
    *     "fullPath": "avatars/public/avatar1.png"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @example Update file using `ArrayBuffer` from base64 file data
    * ```js
    * import {decode} from 'base64-arraybuffer'
    *
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .update('public/avatar1.png', decode('base64FileData'), {
    *     contentType: 'image/png'
    *   })
    * ```
    */
    async update(path, fileBody, fileOptions) {
      return this.uploadOrUpdate("PUT", path, fileBody, fileOptions);
    }
    /**
    * Moves an existing file to a new path in the same bucket.
    *
    * @category File Buckets
    * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
    * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
    * @param options The destination options.
    * @returns Promise with response containing success message or error
    *
    * @example Move file
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .move('public/avatar1.png', 'private/avatar2.png')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "message": "Successfully moved"
    *   },
    *   "error": null
    * }
    * ```
    */
    async move(fromPath, toPath, options) {
      var _this6 = this;
      try {
        return {
          data: await post$1(_this6.fetch, `${_this6.url}/object/move`, {
            bucketId: _this6.bucketId,
            sourceKey: fromPath,
            destinationKey: toPath,
            destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
          }, { headers: _this6.headers }),
          error: null
        };
      } catch (error) {
        if (_this6.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * Copies an existing file to a new path in the same bucket.
    *
    * @category File Buckets
    * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
    * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
    * @param options The destination options.
    * @returns Promise with response containing copied file path or error
    *
    * @example Copy file
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .copy('public/avatar1.png', 'private/avatar2.png')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "path": "avatars/private/avatar2.png"
    *   },
    *   "error": null
    * }
    * ```
    */
    async copy(fromPath, toPath, options) {
      var _this7 = this;
      try {
        return {
          data: { path: (await post$1(_this7.fetch, `${_this7.url}/object/copy`, {
            bucketId: _this7.bucketId,
            sourceKey: fromPath,
            destinationKey: toPath,
            destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
          }, { headers: _this7.headers })).Key },
          error: null
        };
      } catch (error) {
        if (_this7.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
    *
    * @category File Buckets
    * @param path The file path, including the current file name. For example `folder/image.png`.
    * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
    * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
    * @param options.transform Transform the asset before serving it to the client.
    * @returns Promise with response containing signed URL or error
    *
    * @example Create Signed URL
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .createSignedUrl('folder/avatar1.png', 60)
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "signedUrl": "https://example.supabase.co/storage/v1/object/sign/avatars/folder/avatar1.png?token=<TOKEN>"
    *   },
    *   "error": null
    * }
    * ```
    *
    * @example Create a signed URL for an asset with transformations
    * ```js
    * const { data } = await supabase
    *   .storage
    *   .from('avatars')
    *   .createSignedUrl('folder/avatar1.png', 60, {
    *     transform: {
    *       width: 100,
    *       height: 100,
    *     }
    *   })
    * ```
    *
    * @example Create a signed URL which triggers the download of the asset
    * ```js
    * const { data } = await supabase
    *   .storage
    *   .from('avatars')
    *   .createSignedUrl('folder/avatar1.png', 60, {
    *     download: true,
    *   })
    * ```
    */
    async createSignedUrl(path, expiresIn, options) {
      var _this8 = this;
      try {
        let _path = _this8._getFinalPath(path);
        let data = await post$1(_this8.fetch, `${_this8.url}/object/sign/${_path}`, _objectSpread2({ expiresIn }, (options === null || options === void 0 ? void 0 : options.transform) ? { transform: options.transform } : {}), { headers: _this8.headers });
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? "" : options.download}` : "";
        data = { signedUrl: encodeURI(`${_this8.url}${data.signedURL}${downloadQueryParam}`) };
        return {
          data,
          error: null
        };
      } catch (error) {
        if (_this8.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
    *
    * @category File Buckets
    * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
    * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
    * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
    * @returns Promise with response containing array of objects with signedUrl, path, and error or error
    *
    * @example Create Signed URLs
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .createSignedUrls(['folder/avatar1.png', 'folder/avatar2.png'], 60)
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": [
    *     {
    *       "error": null,
    *       "path": "folder/avatar1.png",
    *       "signedURL": "/object/sign/avatars/folder/avatar1.png?token=<TOKEN>",
    *       "signedUrl": "https://example.supabase.co/storage/v1/object/sign/avatars/folder/avatar1.png?token=<TOKEN>"
    *     },
    *     {
    *       "error": null,
    *       "path": "folder/avatar2.png",
    *       "signedURL": "/object/sign/avatars/folder/avatar2.png?token=<TOKEN>",
    *       "signedUrl": "https://example.supabase.co/storage/v1/object/sign/avatars/folder/avatar2.png?token=<TOKEN>"
    *     }
    *   ],
    *   "error": null
    * }
    * ```
    */
    async createSignedUrls(paths, expiresIn, options) {
      var _this9 = this;
      try {
        const data = await post$1(_this9.fetch, `${_this9.url}/object/sign/${_this9.bucketId}`, {
          expiresIn,
          paths
        }, { headers: _this9.headers });
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? "" : options.download}` : "";
        return {
          data: data.map((datum) => _objectSpread2(_objectSpread2({}, datum), {}, { signedUrl: datum.signedURL ? encodeURI(`${_this9.url}${datum.signedURL}${downloadQueryParam}`) : null })),
          error: null
        };
      } catch (error) {
        if (_this9.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
    *
    * @category File Buckets
    * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
    * @param options.transform Transform the asset before serving it to the client.
    * @returns BlobDownloadBuilder instance for downloading the file
    *
    * @example Download file
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .download('folder/avatar1.png')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": <BLOB>,
    *   "error": null
    * }
    * ```
    *
    * @example Download file with transformations
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .download('folder/avatar1.png', {
    *     transform: {
    *       width: 100,
    *       height: 100,
    *       quality: 80
    *     }
    *   })
    * ```
    */
    download(path, options) {
      const renderPath = typeof (options === null || options === void 0 ? void 0 : options.transform) !== "undefined" ? "render/image/authenticated" : "object";
      const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
      const queryString = transformationQuery ? `?${transformationQuery}` : "";
      const _path = this._getFinalPath(path);
      const downloadFn = () => get(this.fetch, `${this.url}/${renderPath}/${_path}${queryString}`, {
        headers: this.headers,
        noResolveJson: true
      });
      return new BlobDownloadBuilder(downloadFn, this.shouldThrowOnError);
    }
    /**
    * Retrieves the details of an existing file.
    *
    * @category File Buckets
    * @param path The file path, including the file name. For example `folder/image.png`.
    * @returns Promise with response containing file metadata or error
    *
    * @example Get file info
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .info('folder/avatar1.png')
    * ```
    */
    async info(path) {
      var _this10 = this;
      const _path = _this10._getFinalPath(path);
      try {
        return {
          data: recursiveToCamel(await get(_this10.fetch, `${_this10.url}/object/info/${_path}`, { headers: _this10.headers })),
          error: null
        };
      } catch (error) {
        if (_this10.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * Checks the existence of a file.
    *
    * @category File Buckets
    * @param path The file path, including the file name. For example `folder/image.png`.
    * @returns Promise with response containing boolean indicating file existence or error
    *
    * @example Check file existence
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .exists('folder/avatar1.png')
    * ```
    */
    async exists(path) {
      var _this11 = this;
      const _path = _this11._getFinalPath(path);
      try {
        await head(_this11.fetch, `${_this11.url}/object/${_path}`, { headers: _this11.headers });
        return {
          data: true,
          error: null
        };
      } catch (error) {
        if (_this11.shouldThrowOnError) throw error;
        if (isStorageError(error) && error instanceof StorageUnknownError) {
          const originalError = error.originalError;
          if ([400, 404].includes(originalError === null || originalError === void 0 ? void 0 : originalError.status)) return {
            data: false,
            error
          };
        }
        throw error;
      }
    }
    /**
    * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
    * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
    *
    * @category File Buckets
    * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
    * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
    * @param options.transform Transform the asset before serving it to the client.
    * @returns Object with public URL
    *
    * @example Returns the URL for an asset in a public bucket
    * ```js
    * const { data } = supabase
    *   .storage
    *   .from('public-bucket')
    *   .getPublicUrl('folder/avatar1.png')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "publicUrl": "https://example.supabase.co/storage/v1/object/public/public-bucket/folder/avatar1.png"
    *   }
    * }
    * ```
    *
    * @example Returns the URL for an asset in a public bucket with transformations
    * ```js
    * const { data } = supabase
    *   .storage
    *   .from('public-bucket')
    *   .getPublicUrl('folder/avatar1.png', {
    *     transform: {
    *       width: 100,
    *       height: 100,
    *     }
    *   })
    * ```
    *
    * @example Returns the URL which triggers the download of an asset in a public bucket
    * ```js
    * const { data } = supabase
    *   .storage
    *   .from('public-bucket')
    *   .getPublicUrl('folder/avatar1.png', {
    *     download: true,
    *   })
    * ```
    */
    getPublicUrl(path, options) {
      const _path = this._getFinalPath(path);
      const _queryString = [];
      const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `download=${options.download === true ? "" : options.download}` : "";
      if (downloadQueryParam !== "") _queryString.push(downloadQueryParam);
      const renderPath = typeof (options === null || options === void 0 ? void 0 : options.transform) !== "undefined" ? "render/image" : "object";
      const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
      if (transformationQuery !== "") _queryString.push(transformationQuery);
      let queryString = _queryString.join("&");
      if (queryString !== "") queryString = `?${queryString}`;
      return { data: { publicUrl: encodeURI(`${this.url}/${renderPath}/public/${_path}${queryString}`) } };
    }
    /**
    * Deletes files within the same bucket
    *
    * @category File Buckets
    * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
    * @returns Promise with response containing array of deleted file objects or error
    *
    * @example Delete file
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .remove(['folder/avatar1.png'])
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": [],
    *   "error": null
    * }
    * ```
    */
    async remove(paths) {
      var _this12 = this;
      try {
        return {
          data: await remove(_this12.fetch, `${_this12.url}/object/${_this12.bucketId}`, { prefixes: paths }, { headers: _this12.headers }),
          error: null
        };
      } catch (error) {
        if (_this12.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * Get file metadata
    * @param id the file id to retrieve metadata
    */
    /**
    * Update file metadata
    * @param id the file id to update metadata
    * @param meta the new file metadata
    */
    /**
    * Lists all the files and folders within a path of the bucket.
    *
    * @category File Buckets
    * @param path The folder path.
    * @param options Search options including limit (defaults to 100), offset, sortBy, and search
    * @param parameters Optional fetch parameters including signal for cancellation
    * @returns Promise with response containing array of files or error
    *
    * @example List files in a bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .list('folder', {
    *     limit: 100,
    *     offset: 0,
    *     sortBy: { column: 'name', order: 'asc' },
    *   })
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "avatar1.png",
    *       "id": "e668cf7f-821b-4a2f-9dce-7dfa5dd1cfd2",
    *       "updated_at": "2024-05-22T23:06:05.580Z",
    *       "created_at": "2024-05-22T23:04:34.443Z",
    *       "last_accessed_at": "2024-05-22T23:04:34.443Z",
    *       "metadata": {
    *         "eTag": "\"c5e8c553235d9af30ef4f6e280790b92\"",
    *         "size": 32175,
    *         "mimetype": "image/png",
    *         "cacheControl": "max-age=3600",
    *         "lastModified": "2024-05-22T23:06:05.574Z",
    *         "contentLength": 32175,
    *         "httpStatusCode": 200
    *       }
    *     }
    *   ],
    *   "error": null
    * }
    * ```
    *
    * @example Search files in a bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .from('avatars')
    *   .list('folder', {
    *     limit: 100,
    *     offset: 0,
    *     sortBy: { column: 'name', order: 'asc' },
    *     search: 'jon'
    *   })
    * ```
    */
    async list(path, options, parameters) {
      var _this13 = this;
      try {
        const body = _objectSpread2(_objectSpread2(_objectSpread2({}, DEFAULT_SEARCH_OPTIONS), options), {}, { prefix: path || "" });
        return {
          data: await post$1(_this13.fetch, `${_this13.url}/object/list/${_this13.bucketId}`, body, { headers: _this13.headers }, parameters),
          error: null
        };
      } catch (error) {
        if (_this13.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * @experimental this method signature might change in the future
    *
    * @category File Buckets
    * @param options search options
    * @param parameters
    */
    async listV2(options, parameters) {
      var _this14 = this;
      try {
        const body = _objectSpread2({}, options);
        return {
          data: await post$1(_this14.fetch, `${_this14.url}/object/list-v2/${_this14.bucketId}`, body, { headers: _this14.headers }, parameters),
          error: null
        };
      } catch (error) {
        if (_this14.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    encodeMetadata(metadata) {
      return JSON.stringify(metadata);
    }
    toBase64(data) {
      if (typeof Buffer !== "undefined") return Buffer.from(data).toString("base64");
      return btoa(data);
    }
    _getFinalPath(path) {
      return `${this.bucketId}/${path.replace(/^\/+/, "")}`;
    }
    _removeEmptyFolders(path) {
      return path.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
    }
    transformOptsToQueryString(transform) {
      const params = [];
      if (transform.width) params.push(`width=${transform.width}`);
      if (transform.height) params.push(`height=${transform.height}`);
      if (transform.resize) params.push(`resize=${transform.resize}`);
      if (transform.format) params.push(`format=${transform.format}`);
      if (transform.quality) params.push(`quality=${transform.quality}`);
      return params.join("&");
    }
  };
  var version2 = "2.88.0";
  var DEFAULT_HEADERS$1 = { "X-Client-Info": `storage-js/${version2}` };
  var StorageBucketApi = class {
    constructor(url, headers = {}, fetch$1, opts) {
      this.shouldThrowOnError = false;
      const baseUrl = new URL(url);
      if (opts === null || opts === void 0 ? void 0 : opts.useNewHostname) {
        if (/supabase\.(co|in|red)$/.test(baseUrl.hostname) && !baseUrl.hostname.includes("storage.supabase.")) baseUrl.hostname = baseUrl.hostname.replace("supabase.", "storage.supabase.");
      }
      this.url = baseUrl.href.replace(/\/$/, "");
      this.headers = _objectSpread2(_objectSpread2({}, DEFAULT_HEADERS$1), headers);
      this.fetch = resolveFetch$1(fetch$1);
    }
    /**
    * Enable throwing errors instead of returning them.
    *
    * @category File Buckets
    */
    throwOnError() {
      this.shouldThrowOnError = true;
      return this;
    }
    /**
    * Retrieves the details of all Storage buckets within an existing project.
    *
    * @category File Buckets
    * @param options Query parameters for listing buckets
    * @param options.limit Maximum number of buckets to return
    * @param options.offset Number of buckets to skip
    * @param options.sortColumn Column to sort by ('id', 'name', 'created_at', 'updated_at')
    * @param options.sortOrder Sort order ('asc' or 'desc')
    * @param options.search Search term to filter bucket names
    * @returns Promise with response containing array of buckets or error
    *
    * @example List buckets
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .listBuckets()
    * ```
    *
    * @example List buckets with options
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .listBuckets({
    *     limit: 10,
    *     offset: 0,
    *     sortColumn: 'created_at',
    *     sortOrder: 'desc',
    *     search: 'prod'
    *   })
    * ```
    */
    async listBuckets(options) {
      var _this = this;
      try {
        const queryString = _this.listBucketOptionsToQueryString(options);
        return {
          data: await get(_this.fetch, `${_this.url}/bucket${queryString}`, { headers: _this.headers }),
          error: null
        };
      } catch (error) {
        if (_this.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * Retrieves the details of an existing Storage bucket.
    *
    * @category File Buckets
    * @param id The unique identifier of the bucket you would like to retrieve.
    * @returns Promise with response containing bucket details or error
    *
    * @example Get bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .getBucket('avatars')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "id": "avatars",
    *     "name": "avatars",
    *     "owner": "",
    *     "public": false,
    *     "file_size_limit": 1024,
    *     "allowed_mime_types": [
    *       "image/png"
    *     ],
    *     "created_at": "2024-05-22T22:26:05.100Z",
    *     "updated_at": "2024-05-22T22:26:05.100Z"
    *   },
    *   "error": null
    * }
    * ```
    */
    async getBucket(id) {
      var _this2 = this;
      try {
        return {
          data: await get(_this2.fetch, `${_this2.url}/bucket/${id}`, { headers: _this2.headers }),
          error: null
        };
      } catch (error) {
        if (_this2.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * Creates a new Storage bucket
    *
    * @category File Buckets
    * @param id A unique identifier for the bucket you are creating.
    * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
    * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
    * The global file size limit takes precedence over this value.
    * The default value is null, which doesn't set a per bucket file size limit.
    * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
    * The default value is null, which allows files with all mime types to be uploaded.
    * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
    * @param options.type (private-beta) specifies the bucket type. see `BucketType` for more details.
    *   - default bucket type is `STANDARD`
    * @returns Promise with response containing newly created bucket name or error
    *
    * @example Create bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .createBucket('avatars', {
    *     public: false,
    *     allowedMimeTypes: ['image/png'],
    *     fileSizeLimit: 1024
    *   })
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "name": "avatars"
    *   },
    *   "error": null
    * }
    * ```
    */
    async createBucket(id, options = { public: false }) {
      var _this3 = this;
      try {
        return {
          data: await post$1(_this3.fetch, `${_this3.url}/bucket`, {
            id,
            name: id,
            type: options.type,
            public: options.public,
            file_size_limit: options.fileSizeLimit,
            allowed_mime_types: options.allowedMimeTypes
          }, { headers: _this3.headers }),
          error: null
        };
      } catch (error) {
        if (_this3.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * Updates a Storage bucket
    *
    * @category File Buckets
    * @param id A unique identifier for the bucket you are updating.
    * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
    * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
    * The global file size limit takes precedence over this value.
    * The default value is null, which doesn't set a per bucket file size limit.
    * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
    * The default value is null, which allows files with all mime types to be uploaded.
    * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
    * @returns Promise with response containing success message or error
    *
    * @example Update bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .updateBucket('avatars', {
    *     public: false,
    *     allowedMimeTypes: ['image/png'],
    *     fileSizeLimit: 1024
    *   })
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "message": "Successfully updated"
    *   },
    *   "error": null
    * }
    * ```
    */
    async updateBucket(id, options) {
      var _this4 = this;
      try {
        return {
          data: await put(_this4.fetch, `${_this4.url}/bucket/${id}`, {
            id,
            name: id,
            public: options.public,
            file_size_limit: options.fileSizeLimit,
            allowed_mime_types: options.allowedMimeTypes
          }, { headers: _this4.headers }),
          error: null
        };
      } catch (error) {
        if (_this4.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * Removes all objects inside a single bucket.
    *
    * @category File Buckets
    * @param id The unique identifier of the bucket you would like to empty.
    * @returns Promise with success message or error
    *
    * @example Empty bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .emptyBucket('avatars')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "message": "Successfully emptied"
    *   },
    *   "error": null
    * }
    * ```
    */
    async emptyBucket(id) {
      var _this5 = this;
      try {
        return {
          data: await post$1(_this5.fetch, `${_this5.url}/bucket/${id}/empty`, {}, { headers: _this5.headers }),
          error: null
        };
      } catch (error) {
        if (_this5.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
    * You must first `empty()` the bucket.
    *
    * @category File Buckets
    * @param id The unique identifier of the bucket you would like to delete.
    * @returns Promise with success message or error
    *
    * @example Delete bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .deleteBucket('avatars')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "message": "Successfully deleted"
    *   },
    *   "error": null
    * }
    * ```
    */
    async deleteBucket(id) {
      var _this6 = this;
      try {
        return {
          data: await remove(_this6.fetch, `${_this6.url}/bucket/${id}`, {}, { headers: _this6.headers }),
          error: null
        };
      } catch (error) {
        if (_this6.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    listBucketOptionsToQueryString(options) {
      const params = {};
      if (options) {
        if ("limit" in options) params.limit = String(options.limit);
        if ("offset" in options) params.offset = String(options.offset);
        if (options.search) params.search = options.search;
        if (options.sortColumn) params.sortColumn = options.sortColumn;
        if (options.sortOrder) params.sortOrder = options.sortOrder;
      }
      return Object.keys(params).length > 0 ? "?" + new URLSearchParams(params).toString() : "";
    }
  };
  var StorageAnalyticsClient = class {
    /**
    * @alpha
    *
    * Creates a new StorageAnalyticsClient instance
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Analytics Buckets
    * @param url - The base URL for the storage API
    * @param headers - HTTP headers to include in requests
    * @param fetch - Optional custom fetch implementation
    *
    * @example
    * ```typescript
    * const client = new StorageAnalyticsClient(url, headers)
    * ```
    */
    constructor(url, headers = {}, fetch$1) {
      this.shouldThrowOnError = false;
      this.url = url.replace(/\/$/, "");
      this.headers = _objectSpread2(_objectSpread2({}, DEFAULT_HEADERS$1), headers);
      this.fetch = resolveFetch$1(fetch$1);
    }
    /**
    * @alpha
    *
    * Enable throwing errors instead of returning them in the response
    * When enabled, failed operations will throw instead of returning { data: null, error }
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Analytics Buckets
    * @returns This instance for method chaining
    */
    throwOnError() {
      this.shouldThrowOnError = true;
      return this;
    }
    /**
    * @alpha
    *
    * Creates a new analytics bucket using Iceberg tables
    * Analytics buckets are optimized for analytical queries and data processing
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Analytics Buckets
    * @param name A unique name for the bucket you are creating
    * @returns Promise with response containing newly created analytics bucket or error
    *
    * @example Create analytics bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .analytics
    *   .createBucket('analytics-data')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "name": "analytics-data",
    *     "type": "ANALYTICS",
    *     "format": "iceberg",
    *     "created_at": "2024-05-22T22:26:05.100Z",
    *     "updated_at": "2024-05-22T22:26:05.100Z"
    *   },
    *   "error": null
    * }
    * ```
    */
    async createBucket(name7) {
      var _this = this;
      try {
        return {
          data: await post$1(_this.fetch, `${_this.url}/bucket`, { name: name7 }, { headers: _this.headers }),
          error: null
        };
      } catch (error) {
        if (_this.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * @alpha
    *
    * Retrieves the details of all Analytics Storage buckets within an existing project
    * Only returns buckets of type 'ANALYTICS'
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Analytics Buckets
    * @param options Query parameters for listing buckets
    * @param options.limit Maximum number of buckets to return
    * @param options.offset Number of buckets to skip
    * @param options.sortColumn Column to sort by ('name', 'created_at', 'updated_at')
    * @param options.sortOrder Sort order ('asc' or 'desc')
    * @param options.search Search term to filter bucket names
    * @returns Promise with response containing array of analytics buckets or error
    *
    * @example List analytics buckets
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .analytics
    *   .listBuckets({
    *     limit: 10,
    *     offset: 0,
    *     sortColumn: 'created_at',
    *     sortOrder: 'desc'
    *   })
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": [
    *     {
    *       "name": "analytics-data",
    *       "type": "ANALYTICS",
    *       "format": "iceberg",
    *       "created_at": "2024-05-22T22:26:05.100Z",
    *       "updated_at": "2024-05-22T22:26:05.100Z"
    *     }
    *   ],
    *   "error": null
    * }
    * ```
    */
    async listBuckets(options) {
      var _this2 = this;
      try {
        const queryParams = new URLSearchParams();
        if ((options === null || options === void 0 ? void 0 : options.limit) !== void 0) queryParams.set("limit", options.limit.toString());
        if ((options === null || options === void 0 ? void 0 : options.offset) !== void 0) queryParams.set("offset", options.offset.toString());
        if (options === null || options === void 0 ? void 0 : options.sortColumn) queryParams.set("sortColumn", options.sortColumn);
        if (options === null || options === void 0 ? void 0 : options.sortOrder) queryParams.set("sortOrder", options.sortOrder);
        if (options === null || options === void 0 ? void 0 : options.search) queryParams.set("search", options.search);
        const queryString = queryParams.toString();
        const url = queryString ? `${_this2.url}/bucket?${queryString}` : `${_this2.url}/bucket`;
        return {
          data: await get(_this2.fetch, url, { headers: _this2.headers }),
          error: null
        };
      } catch (error) {
        if (_this2.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * @alpha
    *
    * Deletes an existing analytics bucket
    * A bucket can't be deleted with existing objects inside it
    * You must first empty the bucket before deletion
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Analytics Buckets
    * @param bucketName The unique identifier of the bucket you would like to delete
    * @returns Promise with response containing success message or error
    *
    * @example Delete analytics bucket
    * ```js
    * const { data, error } = await supabase
    *   .storage
    *   .analytics
    *   .deleteBucket('analytics-data')
    * ```
    *
    * Response:
    * ```json
    * {
    *   "data": {
    *     "message": "Successfully deleted"
    *   },
    *   "error": null
    * }
    * ```
    */
    async deleteBucket(bucketName) {
      var _this3 = this;
      try {
        return {
          data: await remove(_this3.fetch, `${_this3.url}/bucket/${bucketName}`, {}, { headers: _this3.headers }),
          error: null
        };
      } catch (error) {
        if (_this3.shouldThrowOnError) throw error;
        if (isStorageError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /**
    * @alpha
    *
    * Get an Iceberg REST Catalog client configured for a specific analytics bucket
    * Use this to perform advanced table and namespace operations within the bucket
    * The returned client provides full access to the Apache Iceberg REST Catalog API
    * with the Supabase `{ data, error }` pattern for consistent error handling on all operations.
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Analytics Buckets
    * @param bucketName - The name of the analytics bucket (warehouse) to connect to
    * @returns The wrapped Iceberg catalog client
    * @throws {StorageError} If the bucket name is invalid
    *
    * @example Get catalog and create table
    * ```js
    * // First, create an analytics bucket
    * const { data: bucket, error: bucketError } = await supabase
    *   .storage
    *   .analytics
    *   .createBucket('analytics-data')
    *
    * // Get the Iceberg catalog for that bucket
    * const catalog = supabase.storage.analytics.from('analytics-data')
    *
    * // Create a namespace
    * const { error: nsError } = await catalog.createNamespace({ namespace: ['default'] })
    *
    * // Create a table with schema
    * const { data: tableMetadata, error: tableError } = await catalog.createTable(
    *   { namespace: ['default'] },
    *   {
    *     name: 'events',
    *     schema: {
    *       type: 'struct',
    *       fields: [
    *         { id: 1, name: 'id', type: 'long', required: true },
    *         { id: 2, name: 'timestamp', type: 'timestamp', required: true },
    *         { id: 3, name: 'user_id', type: 'string', required: false }
    *       ],
    *       'schema-id': 0,
    *       'identifier-field-ids': [1]
    *     },
    *     'partition-spec': {
    *       'spec-id': 0,
    *       fields: []
    *     },
    *     'write-order': {
    *       'order-id': 0,
    *       fields: []
    *     },
    *     properties: {
    *       'write.format.default': 'parquet'
    *     }
    *   }
    * )
    * ```
    *
    * @example List tables in namespace
    * ```js
    * const catalog = supabase.storage.analytics.from('analytics-data')
    *
    * // List all tables in the default namespace
    * const { data: tables, error: listError } = await catalog.listTables({ namespace: ['default'] })
    * if (listError) {
    *   if (listError.isNotFound()) {
    *     console.log('Namespace not found')
    *   }
    *   return
    * }
    * console.log(tables) // [{ namespace: ['default'], name: 'events' }]
    * ```
    *
    * @example Working with namespaces
    * ```js
    * const catalog = supabase.storage.analytics.from('analytics-data')
    *
    * // List all namespaces
    * const { data: namespaces } = await catalog.listNamespaces()
    *
    * // Create namespace with properties
    * await catalog.createNamespace(
    *   { namespace: ['production'] },
    *   { properties: { owner: 'data-team', env: 'prod' } }
    * )
    * ```
    *
    * @example Cleanup operations
    * ```js
    * const catalog = supabase.storage.analytics.from('analytics-data')
    *
    * // Drop table with purge option (removes all data)
    * const { error: dropError } = await catalog.dropTable(
    *   { namespace: ['default'], name: 'events' },
    *   { purge: true }
    * )
    *
    * if (dropError?.isNotFound()) {
    *   console.log('Table does not exist')
    * }
    *
    * // Drop namespace (must be empty)
    * await catalog.dropNamespace({ namespace: ['default'] })
    * ```
    *
    * @remarks
    * This method provides a bridge between Supabase's bucket management and the standard
    * Apache Iceberg REST Catalog API. The bucket name maps to the Iceberg warehouse parameter.
    * All authentication and configuration is handled automatically using your Supabase credentials.
    *
    * **Error Handling**: Invalid bucket names throw immediately. All catalog
    * operations return `{ data, error }` where errors are `IcebergError` instances from iceberg-js.
    * Use helper methods like `error.isNotFound()` or check `error.status` for specific error handling.
    * Use `.throwOnError()` on the analytics client if you prefer exceptions for catalog operations.
    *
    * **Cleanup Operations**: When using `dropTable`, the `purge: true` option permanently
    * deletes all table data. Without it, the table is marked as deleted but data remains.
    *
    * **Library Dependency**: The returned catalog wraps `IcebergRestCatalog` from iceberg-js.
    * For complete API documentation and advanced usage, refer to the
    * [iceberg-js documentation](https://supabase.github.io/iceberg-js/).
    */
    from(bucketName) {
      var _this4 = this;
      if (!isValidBucketName(bucketName)) throw new StorageError("Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.");
      const catalog = new IcebergRestCatalog({
        baseUrl: this.url,
        catalogName: bucketName,
        auth: {
          type: "custom",
          getHeaders: async () => _this4.headers
        },
        fetch: this.fetch
      });
      const shouldThrowOnError = this.shouldThrowOnError;
      return new Proxy(catalog, { get(target, prop) {
        const value = target[prop];
        if (typeof value !== "function") return value;
        return async (...args) => {
          try {
            return {
              data: await value.apply(target, args),
              error: null
            };
          } catch (error) {
            if (shouldThrowOnError) throw error;
            return {
              data: null,
              error
            };
          }
        };
      } });
    }
  };
  var DEFAULT_HEADERS = {
    "X-Client-Info": `storage-js/${version2}`,
    "Content-Type": "application/json"
  };
  var StorageVectorsError = class extends Error {
    constructor(message) {
      super(message);
      this.__isStorageVectorsError = true;
      this.name = "StorageVectorsError";
    }
  };
  function isStorageVectorsError(error) {
    return typeof error === "object" && error !== null && "__isStorageVectorsError" in error;
  }
  var StorageVectorsApiError = class extends StorageVectorsError {
    constructor(message, status, statusCode) {
      super(message);
      this.name = "StorageVectorsApiError";
      this.status = status;
      this.statusCode = statusCode;
    }
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        status: this.status,
        statusCode: this.statusCode
      };
    }
  };
  var StorageVectorsUnknownError = class extends StorageVectorsError {
    constructor(message, originalError) {
      super(message);
      this.name = "StorageVectorsUnknownError";
      this.originalError = originalError;
    }
  };
  var resolveFetch2 = (customFetch) => {
    if (customFetch) return (...args) => customFetch(...args);
    return (...args) => fetch(...args);
  };
  var isPlainObject = (value) => {
    if (typeof value !== "object" || value === null) return false;
    const prototype = Object.getPrototypeOf(value);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
  };
  var _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
  var handleError = async (error, reject, options) => {
    if (error && typeof error === "object" && "status" in error && "ok" in error && typeof error.status === "number" && !(options === null || options === void 0 ? void 0 : options.noResolveJson)) {
      const status = error.status || 500;
      const responseError = error;
      if (typeof responseError.json === "function") responseError.json().then((err) => {
        const statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || (err === null || err === void 0 ? void 0 : err.code) || status + "";
        reject(new StorageVectorsApiError(_getErrorMessage(err), status, statusCode));
      }).catch(() => {
        const statusCode = status + "";
        reject(new StorageVectorsApiError(responseError.statusText || `HTTP ${status} error`, status, statusCode));
      });
      else {
        const statusCode = status + "";
        reject(new StorageVectorsApiError(responseError.statusText || `HTTP ${status} error`, status, statusCode));
      }
    } else reject(new StorageVectorsUnknownError(_getErrorMessage(error), error));
  };
  var _getRequestParams = (method, options, parameters, body) => {
    const params = {
      method,
      headers: (options === null || options === void 0 ? void 0 : options.headers) || {}
    };
    if (method === "GET" || !body) return params;
    if (isPlainObject(body)) {
      params.headers = _objectSpread2({ "Content-Type": "application/json" }, options === null || options === void 0 ? void 0 : options.headers);
      params.body = JSON.stringify(body);
    } else params.body = body;
    return _objectSpread2(_objectSpread2({}, params), parameters);
  };
  async function _handleRequest(fetcher, method, url, options, parameters, body) {
    return new Promise((resolve, reject) => {
      fetcher(url, _getRequestParams(method, options, parameters, body)).then((result) => {
        if (!result.ok) throw result;
        if (options === null || options === void 0 ? void 0 : options.noResolveJson) return result;
        const contentType = result.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) return {};
        return result.json();
      }).then((data) => resolve(data)).catch((error) => handleError(error, reject, options));
    });
  }
  async function post(fetcher, url, body, options, parameters) {
    return _handleRequest(fetcher, "POST", url, options, parameters, body);
  }
  var VectorIndexApi = class {
    /** Creates a new VectorIndexApi instance */
    constructor(url, headers = {}, fetch$1) {
      this.shouldThrowOnError = false;
      this.url = url.replace(/\/$/, "");
      this.headers = _objectSpread2(_objectSpread2({}, DEFAULT_HEADERS), headers);
      this.fetch = resolveFetch2(fetch$1);
    }
    /** Enable throwing errors instead of returning them in the response */
    throwOnError() {
      this.shouldThrowOnError = true;
      return this;
    }
    /** Creates a new vector index within a bucket */
    async createIndex(options) {
      var _this = this;
      try {
        return {
          data: await post(_this.fetch, `${_this.url}/CreateIndex`, options, { headers: _this.headers }) || {},
          error: null
        };
      } catch (error) {
        if (_this.shouldThrowOnError) throw error;
        if (isStorageVectorsError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /** Retrieves metadata for a specific vector index */
    async getIndex(vectorBucketName, indexName) {
      var _this2 = this;
      try {
        return {
          data: await post(_this2.fetch, `${_this2.url}/GetIndex`, {
            vectorBucketName,
            indexName
          }, { headers: _this2.headers }),
          error: null
        };
      } catch (error) {
        if (_this2.shouldThrowOnError) throw error;
        if (isStorageVectorsError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /** Lists vector indexes within a bucket with optional filtering and pagination */
    async listIndexes(options) {
      var _this3 = this;
      try {
        return {
          data: await post(_this3.fetch, `${_this3.url}/ListIndexes`, options, { headers: _this3.headers }),
          error: null
        };
      } catch (error) {
        if (_this3.shouldThrowOnError) throw error;
        if (isStorageVectorsError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /** Deletes a vector index and all its data */
    async deleteIndex(vectorBucketName, indexName) {
      var _this4 = this;
      try {
        return {
          data: await post(_this4.fetch, `${_this4.url}/DeleteIndex`, {
            vectorBucketName,
            indexName
          }, { headers: _this4.headers }) || {},
          error: null
        };
      } catch (error) {
        if (_this4.shouldThrowOnError) throw error;
        if (isStorageVectorsError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
  };
  var VectorDataApi = class {
    /** Creates a new VectorDataApi instance */
    constructor(url, headers = {}, fetch$1) {
      this.shouldThrowOnError = false;
      this.url = url.replace(/\/$/, "");
      this.headers = _objectSpread2(_objectSpread2({}, DEFAULT_HEADERS), headers);
      this.fetch = resolveFetch2(fetch$1);
    }
    /** Enable throwing errors instead of returning them in the response */
    throwOnError() {
      this.shouldThrowOnError = true;
      return this;
    }
    /** Inserts or updates vectors in batch (1-500 per request) */
    async putVectors(options) {
      var _this = this;
      try {
        if (options.vectors.length < 1 || options.vectors.length > 500) throw new Error("Vector batch size must be between 1 and 500 items");
        return {
          data: await post(_this.fetch, `${_this.url}/PutVectors`, options, { headers: _this.headers }) || {},
          error: null
        };
      } catch (error) {
        if (_this.shouldThrowOnError) throw error;
        if (isStorageVectorsError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /** Retrieves vectors by their keys in batch */
    async getVectors(options) {
      var _this2 = this;
      try {
        return {
          data: await post(_this2.fetch, `${_this2.url}/GetVectors`, options, { headers: _this2.headers }),
          error: null
        };
      } catch (error) {
        if (_this2.shouldThrowOnError) throw error;
        if (isStorageVectorsError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /** Lists vectors in an index with pagination */
    async listVectors(options) {
      var _this3 = this;
      try {
        if (options.segmentCount !== void 0) {
          if (options.segmentCount < 1 || options.segmentCount > 16) throw new Error("segmentCount must be between 1 and 16");
          if (options.segmentIndex !== void 0) {
            if (options.segmentIndex < 0 || options.segmentIndex >= options.segmentCount) throw new Error(`segmentIndex must be between 0 and ${options.segmentCount - 1}`);
          }
        }
        return {
          data: await post(_this3.fetch, `${_this3.url}/ListVectors`, options, { headers: _this3.headers }),
          error: null
        };
      } catch (error) {
        if (_this3.shouldThrowOnError) throw error;
        if (isStorageVectorsError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /** Queries for similar vectors using approximate nearest neighbor search */
    async queryVectors(options) {
      var _this4 = this;
      try {
        return {
          data: await post(_this4.fetch, `${_this4.url}/QueryVectors`, options, { headers: _this4.headers }),
          error: null
        };
      } catch (error) {
        if (_this4.shouldThrowOnError) throw error;
        if (isStorageVectorsError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /** Deletes vectors by their keys in batch (1-500 per request) */
    async deleteVectors(options) {
      var _this5 = this;
      try {
        if (options.keys.length < 1 || options.keys.length > 500) throw new Error("Keys batch size must be between 1 and 500 items");
        return {
          data: await post(_this5.fetch, `${_this5.url}/DeleteVectors`, options, { headers: _this5.headers }) || {},
          error: null
        };
      } catch (error) {
        if (_this5.shouldThrowOnError) throw error;
        if (isStorageVectorsError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
  };
  var VectorBucketApi = class {
    /** Creates a new VectorBucketApi instance */
    constructor(url, headers = {}, fetch$1) {
      this.shouldThrowOnError = false;
      this.url = url.replace(/\/$/, "");
      this.headers = _objectSpread2(_objectSpread2({}, DEFAULT_HEADERS), headers);
      this.fetch = resolveFetch2(fetch$1);
    }
    /** Enable throwing errors instead of returning them in the response */
    throwOnError() {
      this.shouldThrowOnError = true;
      return this;
    }
    /** Creates a new vector bucket */
    async createBucket(vectorBucketName) {
      var _this = this;
      try {
        return {
          data: await post(_this.fetch, `${_this.url}/CreateVectorBucket`, { vectorBucketName }, { headers: _this.headers }) || {},
          error: null
        };
      } catch (error) {
        if (_this.shouldThrowOnError) throw error;
        if (isStorageVectorsError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /** Retrieves metadata for a specific vector bucket */
    async getBucket(vectorBucketName) {
      var _this2 = this;
      try {
        return {
          data: await post(_this2.fetch, `${_this2.url}/GetVectorBucket`, { vectorBucketName }, { headers: _this2.headers }),
          error: null
        };
      } catch (error) {
        if (_this2.shouldThrowOnError) throw error;
        if (isStorageVectorsError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /** Lists vector buckets with optional filtering and pagination */
    async listBuckets(options = {}) {
      var _this3 = this;
      try {
        return {
          data: await post(_this3.fetch, `${_this3.url}/ListVectorBuckets`, options, { headers: _this3.headers }),
          error: null
        };
      } catch (error) {
        if (_this3.shouldThrowOnError) throw error;
        if (isStorageVectorsError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
    /** Deletes a vector bucket (must be empty first) */
    async deleteBucket(vectorBucketName) {
      var _this4 = this;
      try {
        return {
          data: await post(_this4.fetch, `${_this4.url}/DeleteVectorBucket`, { vectorBucketName }, { headers: _this4.headers }) || {},
          error: null
        };
      } catch (error) {
        if (_this4.shouldThrowOnError) throw error;
        if (isStorageVectorsError(error)) return {
          data: null,
          error
        };
        throw error;
      }
    }
  };
  var StorageVectorsClient = class extends VectorBucketApi {
    /**
    * @alpha
    *
    * Creates a StorageVectorsClient that can manage buckets, indexes, and vectors.
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param url - Base URL of the Storage Vectors REST API.
    * @param options.headers - Optional headers (for example `Authorization`) applied to every request.
    * @param options.fetch - Optional custom `fetch` implementation for non-browser runtimes.
    *
    * @example
    * ```typescript
    * const client = new StorageVectorsClient(url, options)
    * ```
    */
    constructor(url, options = {}) {
      super(url, options.headers || {}, options.fetch);
    }
    /**
    *
    * @alpha
    *
    * Access operations for a specific vector bucket
    * Returns a scoped client for index and vector operations within the bucket
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param vectorBucketName - Name of the vector bucket
    * @returns Bucket-scoped client with index and vector operations
    *
    * @example
    * ```typescript
    * const bucket = supabase.storage.vectors.from('embeddings-prod')
    * ```
    */
    from(vectorBucketName) {
      return new VectorBucketScope(this.url, this.headers, vectorBucketName, this.fetch);
    }
    /**
    *
    * @alpha
    *
    * Creates a new vector bucket
    * Vector buckets are containers for vector indexes and their data
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param vectorBucketName - Unique name for the vector bucket
    * @returns Promise with empty response on success or error
    *
    * @example
    * ```typescript
    * const { data, error } = await supabase
    *   .storage
    *   .vectors
    *   .createBucket('embeddings-prod')
    * ```
    */
    async createBucket(vectorBucketName) {
      var _superprop_getCreateBucket = () => super.createBucket, _this = this;
      return _superprop_getCreateBucket().call(_this, vectorBucketName);
    }
    /**
    *
    * @alpha
    *
    * Retrieves metadata for a specific vector bucket
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param vectorBucketName - Name of the vector bucket
    * @returns Promise with bucket metadata or error
    *
    * @example
    * ```typescript
    * const { data, error } = await supabase
    *   .storage
    *   .vectors
    *   .getBucket('embeddings-prod')
    *
    * console.log('Bucket created:', data?.vectorBucket.creationTime)
    * ```
    */
    async getBucket(vectorBucketName) {
      var _superprop_getGetBucket = () => super.getBucket, _this2 = this;
      return _superprop_getGetBucket().call(_this2, vectorBucketName);
    }
    /**
    *
    * @alpha
    *
    * Lists all vector buckets with optional filtering and pagination
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param options - Optional filters (prefix, maxResults, nextToken)
    * @returns Promise with list of buckets or error
    *
    * @example
    * ```typescript
    * const { data, error } = await supabase
    *   .storage
    *   .vectors
    *   .listBuckets({ prefix: 'embeddings-' })
    *
    * data?.vectorBuckets.forEach(bucket => {
    *   console.log(bucket.vectorBucketName)
    * })
    * ```
    */
    async listBuckets(options = {}) {
      var _superprop_getListBuckets = () => super.listBuckets, _this3 = this;
      return _superprop_getListBuckets().call(_this3, options);
    }
    /**
    *
    * @alpha
    *
    * Deletes a vector bucket (bucket must be empty)
    * All indexes must be deleted before deleting the bucket
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param vectorBucketName - Name of the vector bucket to delete
    * @returns Promise with empty response on success or error
    *
    * @example
    * ```typescript
    * const { data, error } = await supabase
    *   .storage
    *   .vectors
    *   .deleteBucket('embeddings-old')
    * ```
    */
    async deleteBucket(vectorBucketName) {
      var _superprop_getDeleteBucket = () => super.deleteBucket, _this4 = this;
      return _superprop_getDeleteBucket().call(_this4, vectorBucketName);
    }
  };
  var VectorBucketScope = class extends VectorIndexApi {
    /**
    * @alpha
    *
    * Creates a helper that automatically scopes all index operations to the provided bucket.
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @example
    * ```typescript
    * const bucket = supabase.storage.vectors.from('embeddings-prod')
    * ```
    */
    constructor(url, headers, vectorBucketName, fetch$1) {
      super(url, headers, fetch$1);
      this.vectorBucketName = vectorBucketName;
    }
    /**
    *
    * @alpha
    *
    * Creates a new vector index in this bucket
    * Convenience method that automatically includes the bucket name
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param options - Index configuration (vectorBucketName is automatically set)
    * @returns Promise with empty response on success or error
    *
    * @example
    * ```typescript
    * const bucket = supabase.storage.vectors.from('embeddings-prod')
    * await bucket.createIndex({
    *   indexName: 'documents-openai',
    *   dataType: 'float32',
    *   dimension: 1536,
    *   distanceMetric: 'cosine',
    *   metadataConfiguration: {
    *     nonFilterableMetadataKeys: ['raw_text']
    *   }
    * })
    * ```
    */
    async createIndex(options) {
      var _superprop_getCreateIndex = () => super.createIndex, _this5 = this;
      return _superprop_getCreateIndex().call(_this5, _objectSpread2(_objectSpread2({}, options), {}, { vectorBucketName: _this5.vectorBucketName }));
    }
    /**
    *
    * @alpha
    *
    * Lists indexes in this bucket
    * Convenience method that automatically includes the bucket name
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param options - Listing options (vectorBucketName is automatically set)
    * @returns Promise with response containing indexes array and pagination token or error
    *
    * @example
    * ```typescript
    * const bucket = supabase.storage.vectors.from('embeddings-prod')
    * const { data } = await bucket.listIndexes({ prefix: 'documents-' })
    * ```
    */
    async listIndexes(options = {}) {
      var _superprop_getListIndexes = () => super.listIndexes, _this6 = this;
      return _superprop_getListIndexes().call(_this6, _objectSpread2(_objectSpread2({}, options), {}, { vectorBucketName: _this6.vectorBucketName }));
    }
    /**
    *
    * @alpha
    *
    * Retrieves metadata for a specific index in this bucket
    * Convenience method that automatically includes the bucket name
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param indexName - Name of the index to retrieve
    * @returns Promise with index metadata or error
    *
    * @example
    * ```typescript
    * const bucket = supabase.storage.vectors.from('embeddings-prod')
    * const { data } = await bucket.getIndex('documents-openai')
    * console.log('Dimension:', data?.index.dimension)
    * ```
    */
    async getIndex(indexName) {
      var _superprop_getGetIndex = () => super.getIndex, _this7 = this;
      return _superprop_getGetIndex().call(_this7, _this7.vectorBucketName, indexName);
    }
    /**
    *
    * @alpha
    *
    * Deletes an index from this bucket
    * Convenience method that automatically includes the bucket name
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param indexName - Name of the index to delete
    * @returns Promise with empty response on success or error
    *
    * @example
    * ```typescript
    * const bucket = supabase.storage.vectors.from('embeddings-prod')
    * await bucket.deleteIndex('old-index')
    * ```
    */
    async deleteIndex(indexName) {
      var _superprop_getDeleteIndex = () => super.deleteIndex, _this8 = this;
      return _superprop_getDeleteIndex().call(_this8, _this8.vectorBucketName, indexName);
    }
    /**
    *
    * @alpha
    *
    * Access operations for a specific index within this bucket
    * Returns a scoped client for vector data operations
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param indexName - Name of the index
    * @returns Index-scoped client with vector data operations
    *
    * @example
    * ```typescript
    * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
    *
    * // Insert vectors
    * await index.putVectors({
    *   vectors: [
    *     { key: 'doc-1', data: { float32: [...] }, metadata: { title: 'Intro' } }
    *   ]
    * })
    *
    * // Query similar vectors
    * const { data } = await index.queryVectors({
    *   queryVector: { float32: [...] },
    *   topK: 5
    * })
    * ```
    */
    index(indexName) {
      return new VectorIndexScope(this.url, this.headers, this.vectorBucketName, indexName, this.fetch);
    }
  };
  var VectorIndexScope = class extends VectorDataApi {
    /**
    *
    * @alpha
    *
    * Creates a helper that automatically scopes all vector operations to the provided bucket/index names.
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @example
    * ```typescript
    * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
    * ```
    */
    constructor(url, headers, vectorBucketName, indexName, fetch$1) {
      super(url, headers, fetch$1);
      this.vectorBucketName = vectorBucketName;
      this.indexName = indexName;
    }
    /**
    *
    * @alpha
    *
    * Inserts or updates vectors in this index
    * Convenience method that automatically includes bucket and index names
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param options - Vector insertion options (bucket and index names automatically set)
    * @returns Promise with empty response on success or error
    *
    * @example
    * ```typescript
    * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
    * await index.putVectors({
    *   vectors: [
    *     {
    *       key: 'doc-1',
    *       data: { float32: [0.1, 0.2, ...] },
    *       metadata: { title: 'Introduction', page: 1 }
    *     }
    *   ]
    * })
    * ```
    */
    async putVectors(options) {
      var _superprop_getPutVectors = () => super.putVectors, _this9 = this;
      return _superprop_getPutVectors().call(_this9, _objectSpread2(_objectSpread2({}, options), {}, {
        vectorBucketName: _this9.vectorBucketName,
        indexName: _this9.indexName
      }));
    }
    /**
    *
    * @alpha
    *
    * Retrieves vectors by keys from this index
    * Convenience method that automatically includes bucket and index names
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param options - Vector retrieval options (bucket and index names automatically set)
    * @returns Promise with response containing vectors array or error
    *
    * @example
    * ```typescript
    * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
    * const { data } = await index.getVectors({
    *   keys: ['doc-1', 'doc-2'],
    *   returnMetadata: true
    * })
    * ```
    */
    async getVectors(options) {
      var _superprop_getGetVectors = () => super.getVectors, _this10 = this;
      return _superprop_getGetVectors().call(_this10, _objectSpread2(_objectSpread2({}, options), {}, {
        vectorBucketName: _this10.vectorBucketName,
        indexName: _this10.indexName
      }));
    }
    /**
    *
    * @alpha
    *
    * Lists vectors in this index with pagination
    * Convenience method that automatically includes bucket and index names
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param options - Listing options (bucket and index names automatically set)
    * @returns Promise with response containing vectors array and pagination token or error
    *
    * @example
    * ```typescript
    * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
    * const { data } = await index.listVectors({
    *   maxResults: 500,
    *   returnMetadata: true
    * })
    * ```
    */
    async listVectors(options = {}) {
      var _superprop_getListVectors = () => super.listVectors, _this11 = this;
      return _superprop_getListVectors().call(_this11, _objectSpread2(_objectSpread2({}, options), {}, {
        vectorBucketName: _this11.vectorBucketName,
        indexName: _this11.indexName
      }));
    }
    /**
    *
    * @alpha
    *
    * Queries for similar vectors in this index
    * Convenience method that automatically includes bucket and index names
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param options - Query options (bucket and index names automatically set)
    * @returns Promise with response containing matches array of similar vectors ordered by distance or error
    *
    * @example
    * ```typescript
    * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
    * const { data } = await index.queryVectors({
    *   queryVector: { float32: [0.1, 0.2, ...] },
    *   topK: 5,
    *   filter: { category: 'technical' },
    *   returnDistance: true,
    *   returnMetadata: true
    * })
    * ```
    */
    async queryVectors(options) {
      var _superprop_getQueryVectors = () => super.queryVectors, _this12 = this;
      return _superprop_getQueryVectors().call(_this12, _objectSpread2(_objectSpread2({}, options), {}, {
        vectorBucketName: _this12.vectorBucketName,
        indexName: _this12.indexName
      }));
    }
    /**
    *
    * @alpha
    *
    * Deletes vectors by keys from this index
    * Convenience method that automatically includes bucket and index names
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @param options - Deletion options (bucket and index names automatically set)
    * @returns Promise with empty response on success or error
    *
    * @example
    * ```typescript
    * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
    * await index.deleteVectors({
    *   keys: ['doc-1', 'doc-2', 'doc-3']
    * })
    * ```
    */
    async deleteVectors(options) {
      var _superprop_getDeleteVectors = () => super.deleteVectors, _this13 = this;
      return _superprop_getDeleteVectors().call(_this13, _objectSpread2(_objectSpread2({}, options), {}, {
        vectorBucketName: _this13.vectorBucketName,
        indexName: _this13.indexName
      }));
    }
  };
  var StorageClient = class extends StorageBucketApi {
    /**
    * Creates a client for Storage buckets, files, analytics, and vectors.
    *
    * @category File Buckets
    * @example
    * ```ts
    * import { StorageClient } from '@supabase/storage-js'
    *
    * const storage = new StorageClient('https://xyzcompany.supabase.co/storage/v1', {
    *   apikey: 'public-anon-key',
    * })
    * const avatars = storage.from('avatars')
    * ```
    */
    constructor(url, headers = {}, fetch$1, opts) {
      super(url, headers, fetch$1, opts);
    }
    /**
    * Perform file operation in a bucket.
    *
    * @category File Buckets
    * @param id The bucket id to operate on.
    *
    * @example
    * ```typescript
    * const avatars = supabase.storage.from('avatars')
    * ```
    */
    from(id) {
      return new StorageFileApi(this.url, this.headers, id, this.fetch);
    }
    /**
    *
    * @alpha
    *
    * Access vector storage operations.
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Vector Buckets
    * @returns A StorageVectorsClient instance configured with the current storage settings.
    */
    get vectors() {
      return new StorageVectorsClient(this.url + "/vector", {
        headers: this.headers,
        fetch: this.fetch
      });
    }
    /**
    *
    * @alpha
    *
    * Access analytics storage operations using Iceberg tables.
    *
    * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
    *
    * @category Analytics Buckets
    * @returns A StorageAnalyticsClient instance configured with the current storage settings.
    */
    get analytics() {
      return new StorageAnalyticsClient(this.url + "/iceberg", this.headers, this.fetch);
    }
  };

  // node_modules/@supabase/auth-js/dist/module/lib/version.js
  var version3 = "2.88.0";

  // node_modules/@supabase/auth-js/dist/module/lib/constants.js
  var AUTO_REFRESH_TICK_DURATION_MS = 30 * 1e3;
  var AUTO_REFRESH_TICK_THRESHOLD = 3;
  var EXPIRY_MARGIN_MS = AUTO_REFRESH_TICK_THRESHOLD * AUTO_REFRESH_TICK_DURATION_MS;
  var GOTRUE_URL = "http://localhost:9999";
  var STORAGE_KEY = "supabase.auth.token";
  var DEFAULT_HEADERS2 = { "X-Client-Info": `gotrue-js/${version3}` };
  var API_VERSION_HEADER_NAME = "X-Supabase-Api-Version";
  var API_VERSIONS = {
    "2024-01-01": {
      timestamp: Date.parse("2024-01-01T00:00:00.0Z"),
      name: "2024-01-01"
    }
  };
  var BASE64URL_REGEX = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
  var JWKS_TTL = 10 * 60 * 1e3;

  // node_modules/@supabase/auth-js/dist/module/lib/errors.js
  var AuthError = class extends Error {
    constructor(message, status, code) {
      super(message);
      this.__isAuthError = true;
      this.name = "AuthError";
      this.status = status;
      this.code = code;
    }
  };
  function isAuthError(error) {
    return typeof error === "object" && error !== null && "__isAuthError" in error;
  }
  var AuthApiError = class extends AuthError {
    constructor(message, status, code) {
      super(message, status, code);
      this.name = "AuthApiError";
      this.status = status;
      this.code = code;
    }
  };
  function isAuthApiError(error) {
    return isAuthError(error) && error.name === "AuthApiError";
  }
  var AuthUnknownError = class extends AuthError {
    constructor(message, originalError) {
      super(message);
      this.name = "AuthUnknownError";
      this.originalError = originalError;
    }
  };
  var CustomAuthError = class extends AuthError {
    constructor(message, name7, status, code) {
      super(message, status, code);
      this.name = name7;
      this.status = status;
    }
  };
  var AuthSessionMissingError = class extends CustomAuthError {
    constructor() {
      super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
    }
  };
  function isAuthSessionMissingError(error) {
    return isAuthError(error) && error.name === "AuthSessionMissingError";
  }
  var AuthInvalidTokenResponseError = class extends CustomAuthError {
    constructor() {
      super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
    }
  };
  var AuthInvalidCredentialsError = class extends CustomAuthError {
    constructor(message) {
      super(message, "AuthInvalidCredentialsError", 400, void 0);
    }
  };
  var AuthImplicitGrantRedirectError = class extends CustomAuthError {
    constructor(message, details = null) {
      super(message, "AuthImplicitGrantRedirectError", 500, void 0);
      this.details = null;
      this.details = details;
    }
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        status: this.status,
        details: this.details
      };
    }
  };
  function isAuthImplicitGrantRedirectError(error) {
    return isAuthError(error) && error.name === "AuthImplicitGrantRedirectError";
  }
  var AuthPKCEGrantCodeExchangeError = class extends CustomAuthError {
    constructor(message, details = null) {
      super(message, "AuthPKCEGrantCodeExchangeError", 500, void 0);
      this.details = null;
      this.details = details;
    }
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        status: this.status,
        details: this.details
      };
    }
  };
  var AuthPKCECodeVerifierMissingError = class extends CustomAuthError {
    constructor() {
      super("PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.", "AuthPKCECodeVerifierMissingError", 400, "pkce_code_verifier_not_found");
    }
  };
  var AuthRetryableFetchError = class extends CustomAuthError {
    constructor(message, status) {
      super(message, "AuthRetryableFetchError", status, void 0);
    }
  };
  function isAuthRetryableFetchError(error) {
    return isAuthError(error) && error.name === "AuthRetryableFetchError";
  }
  var AuthWeakPasswordError = class extends CustomAuthError {
    constructor(message, status, reasons) {
      super(message, "AuthWeakPasswordError", status, "weak_password");
      this.reasons = reasons;
    }
  };
  var AuthInvalidJwtError = class extends CustomAuthError {
    constructor(message) {
      super(message, "AuthInvalidJwtError", 400, "invalid_jwt");
    }
  };

  // node_modules/@supabase/auth-js/dist/module/lib/base64url.js
  var TO_BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split("");
  var IGNORE_BASE64URL = " 	\n\r=".split("");
  var FROM_BASE64URL = (() => {
    const charMap = new Array(128);
    for (let i2 = 0; i2 < charMap.length; i2 += 1) {
      charMap[i2] = -1;
    }
    for (let i2 = 0; i2 < IGNORE_BASE64URL.length; i2 += 1) {
      charMap[IGNORE_BASE64URL[i2].charCodeAt(0)] = -2;
    }
    for (let i2 = 0; i2 < TO_BASE64URL.length; i2 += 1) {
      charMap[TO_BASE64URL[i2].charCodeAt(0)] = i2;
    }
    return charMap;
  })();
  function byteToBase64URL(byte, state, emit) {
    if (byte !== null) {
      state.queue = state.queue << 8 | byte;
      state.queuedBits += 8;
      while (state.queuedBits >= 6) {
        const pos = state.queue >> state.queuedBits - 6 & 63;
        emit(TO_BASE64URL[pos]);
        state.queuedBits -= 6;
      }
    } else if (state.queuedBits > 0) {
      state.queue = state.queue << 6 - state.queuedBits;
      state.queuedBits = 6;
      while (state.queuedBits >= 6) {
        const pos = state.queue >> state.queuedBits - 6 & 63;
        emit(TO_BASE64URL[pos]);
        state.queuedBits -= 6;
      }
    }
  }
  function byteFromBase64URL(charCode, state, emit) {
    const bits = FROM_BASE64URL[charCode];
    if (bits > -1) {
      state.queue = state.queue << 6 | bits;
      state.queuedBits += 6;
      while (state.queuedBits >= 8) {
        emit(state.queue >> state.queuedBits - 8 & 255);
        state.queuedBits -= 8;
      }
    } else if (bits === -2) {
      return;
    } else {
      throw new Error(`Invalid Base64-URL character "${String.fromCharCode(charCode)}"`);
    }
  }
  function stringFromBase64URL(str) {
    const conv = [];
    const utf8Emit = (codepoint) => {
      conv.push(String.fromCodePoint(codepoint));
    };
    const utf8State = {
      utf8seq: 0,
      codepoint: 0
    };
    const b64State = { queue: 0, queuedBits: 0 };
    const byteEmit = (byte) => {
      stringFromUTF8(byte, utf8State, utf8Emit);
    };
    for (let i2 = 0; i2 < str.length; i2 += 1) {
      byteFromBase64URL(str.charCodeAt(i2), b64State, byteEmit);
    }
    return conv.join("");
  }
  function codepointToUTF8(codepoint, emit) {
    if (codepoint <= 127) {
      emit(codepoint);
      return;
    } else if (codepoint <= 2047) {
      emit(192 | codepoint >> 6);
      emit(128 | codepoint & 63);
      return;
    } else if (codepoint <= 65535) {
      emit(224 | codepoint >> 12);
      emit(128 | codepoint >> 6 & 63);
      emit(128 | codepoint & 63);
      return;
    } else if (codepoint <= 1114111) {
      emit(240 | codepoint >> 18);
      emit(128 | codepoint >> 12 & 63);
      emit(128 | codepoint >> 6 & 63);
      emit(128 | codepoint & 63);
      return;
    }
    throw new Error(`Unrecognized Unicode codepoint: ${codepoint.toString(16)}`);
  }
  function stringToUTF8(str, emit) {
    for (let i2 = 0; i2 < str.length; i2 += 1) {
      let codepoint = str.charCodeAt(i2);
      if (codepoint > 55295 && codepoint <= 56319) {
        const highSurrogate = (codepoint - 55296) * 1024 & 65535;
        const lowSurrogate = str.charCodeAt(i2 + 1) - 56320 & 65535;
        codepoint = (lowSurrogate | highSurrogate) + 65536;
        i2 += 1;
      }
      codepointToUTF8(codepoint, emit);
    }
  }
  function stringFromUTF8(byte, state, emit) {
    if (state.utf8seq === 0) {
      if (byte <= 127) {
        emit(byte);
        return;
      }
      for (let leadingBit = 1; leadingBit < 6; leadingBit += 1) {
        if ((byte >> 7 - leadingBit & 1) === 0) {
          state.utf8seq = leadingBit;
          break;
        }
      }
      if (state.utf8seq === 2) {
        state.codepoint = byte & 31;
      } else if (state.utf8seq === 3) {
        state.codepoint = byte & 15;
      } else if (state.utf8seq === 4) {
        state.codepoint = byte & 7;
      } else {
        throw new Error("Invalid UTF-8 sequence");
      }
      state.utf8seq -= 1;
    } else if (state.utf8seq > 0) {
      if (byte <= 127) {
        throw new Error("Invalid UTF-8 sequence");
      }
      state.codepoint = state.codepoint << 6 | byte & 63;
      state.utf8seq -= 1;
      if (state.utf8seq === 0) {
        emit(state.codepoint);
      }
    }
  }
  function base64UrlToUint8Array(str) {
    const result = [];
    const state = { queue: 0, queuedBits: 0 };
    const onByte = (byte) => {
      result.push(byte);
    };
    for (let i2 = 0; i2 < str.length; i2 += 1) {
      byteFromBase64URL(str.charCodeAt(i2), state, onByte);
    }
    return new Uint8Array(result);
  }
  function stringToUint8Array(str) {
    const result = [];
    stringToUTF8(str, (byte) => result.push(byte));
    return new Uint8Array(result);
  }
  function bytesToBase64URL(bytes) {
    const result = [];
    const state = { queue: 0, queuedBits: 0 };
    const onChar = (char) => {
      result.push(char);
    };
    bytes.forEach((byte) => byteToBase64URL(byte, state, onChar));
    byteToBase64URL(null, state, onChar);
    return result.join("");
  }

  // node_modules/@supabase/auth-js/dist/module/lib/helpers.js
  function expiresAt(expiresIn) {
    const timeNow = Math.round(Date.now() / 1e3);
    return timeNow + expiresIn;
  }
  function generateCallbackId() {
    return /* @__PURE__ */ Symbol("auth-callback");
  }
  var isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";
  var localStorageWriteTests = {
    tested: false,
    writable: false
  };
  var supportsLocalStorage = () => {
    if (!isBrowser()) {
      return false;
    }
    try {
      if (typeof globalThis.localStorage !== "object") {
        return false;
      }
    } catch (e2) {
      return false;
    }
    if (localStorageWriteTests.tested) {
      return localStorageWriteTests.writable;
    }
    const randomKey = `lswt-${Math.random()}${Math.random()}`;
    try {
      globalThis.localStorage.setItem(randomKey, randomKey);
      globalThis.localStorage.removeItem(randomKey);
      localStorageWriteTests.tested = true;
      localStorageWriteTests.writable = true;
    } catch (e2) {
      localStorageWriteTests.tested = true;
      localStorageWriteTests.writable = false;
    }
    return localStorageWriteTests.writable;
  };
  function parseParametersFromURL(href) {
    const result = {};
    const url = new URL(href);
    if (url.hash && url.hash[0] === "#") {
      try {
        const hashSearchParams = new URLSearchParams(url.hash.substring(1));
        hashSearchParams.forEach((value, key) => {
          result[key] = value;
        });
      } catch (e2) {
      }
    }
    url.searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  var resolveFetch3 = (customFetch) => {
    if (customFetch) {
      return (...args) => customFetch(...args);
    }
    return (...args) => fetch(...args);
  };
  var looksLikeFetchResponse = (maybeResponse) => {
    return typeof maybeResponse === "object" && maybeResponse !== null && "status" in maybeResponse && "ok" in maybeResponse && "json" in maybeResponse && typeof maybeResponse.json === "function";
  };
  var setItemAsync = async (storage, key, data) => {
    await storage.setItem(key, JSON.stringify(data));
  };
  var getItemAsync = async (storage, key) => {
    const value = await storage.getItem(key);
    if (!value) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (_a) {
      return value;
    }
  };
  var removeItemAsync = async (storage, key) => {
    await storage.removeItem(key);
  };
  var Deferred = class _Deferred {
    constructor() {
      ;
      this.promise = new _Deferred.promiseConstructor((res, rej) => {
        ;
        this.resolve = res;
        this.reject = rej;
      });
    }
  };
  Deferred.promiseConstructor = Promise;
  function decodeJWT(token) {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new AuthInvalidJwtError("Invalid JWT structure");
    }
    for (let i2 = 0; i2 < parts.length; i2++) {
      if (!BASE64URL_REGEX.test(parts[i2])) {
        throw new AuthInvalidJwtError("JWT not in base64url format");
      }
    }
    const data = {
      // using base64url lib
      header: JSON.parse(stringFromBase64URL(parts[0])),
      payload: JSON.parse(stringFromBase64URL(parts[1])),
      signature: base64UrlToUint8Array(parts[2]),
      raw: {
        header: parts[0],
        payload: parts[1]
      }
    };
    return data;
  }
  async function sleep(time) {
    return await new Promise((accept) => {
      setTimeout(() => accept(null), time);
    });
  }
  function retryable(fn, isRetryable) {
    const promise = new Promise((accept, reject) => {
      ;
      (async () => {
        for (let attempt = 0; attempt < Infinity; attempt++) {
          try {
            const result = await fn(attempt);
            if (!isRetryable(attempt, null, result)) {
              accept(result);
              return;
            }
          } catch (e2) {
            if (!isRetryable(attempt, e2)) {
              reject(e2);
              return;
            }
          }
        }
      })();
    });
    return promise;
  }
  function dec2hex(dec) {
    return ("0" + dec.toString(16)).substr(-2);
  }
  function generatePKCEVerifier() {
    const verifierLength = 56;
    const array = new Uint32Array(verifierLength);
    if (typeof crypto === "undefined") {
      const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
      const charSetLen = charSet.length;
      let verifier = "";
      for (let i2 = 0; i2 < verifierLength; i2++) {
        verifier += charSet.charAt(Math.floor(Math.random() * charSetLen));
      }
      return verifier;
    }
    crypto.getRandomValues(array);
    return Array.from(array, dec2hex).join("");
  }
  async function sha256(randomString) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(randomString);
    const hash = await crypto.subtle.digest("SHA-256", encodedData);
    const bytes = new Uint8Array(hash);
    return Array.from(bytes).map((c2) => String.fromCharCode(c2)).join("");
  }
  async function generatePKCEChallenge(verifier) {
    const hasCryptoSupport = typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined" && typeof TextEncoder !== "undefined";
    if (!hasCryptoSupport) {
      console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.");
      return verifier;
    }
    const hashed = await sha256(verifier);
    return btoa(hashed).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  async function getCodeChallengeAndMethod(storage, storageKey, isPasswordRecovery = false) {
    const codeVerifier = generatePKCEVerifier();
    let storedCodeVerifier = codeVerifier;
    if (isPasswordRecovery) {
      storedCodeVerifier += "/PASSWORD_RECOVERY";
    }
    await setItemAsync(storage, `${storageKey}-code-verifier`, storedCodeVerifier);
    const codeChallenge = await generatePKCEChallenge(codeVerifier);
    const codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
    return [codeChallenge, codeChallengeMethod];
  }
  var API_VERSION_REGEX = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
  function parseResponseAPIVersion(response) {
    const apiVersion = response.headers.get(API_VERSION_HEADER_NAME);
    if (!apiVersion) {
      return null;
    }
    if (!apiVersion.match(API_VERSION_REGEX)) {
      return null;
    }
    try {
      const date = /* @__PURE__ */ new Date(`${apiVersion}T00:00:00.0Z`);
      return date;
    } catch (e2) {
      return null;
    }
  }
  function validateExp(exp) {
    if (!exp) {
      throw new Error("Missing exp claim");
    }
    const timeNow = Math.floor(Date.now() / 1e3);
    if (exp <= timeNow) {
      throw new Error("JWT has expired");
    }
  }
  function getAlgorithm(alg) {
    switch (alg) {
      case "RS256":
        return {
          name: "RSASSA-PKCS1-v1_5",
          hash: { name: "SHA-256" }
        };
      case "ES256":
        return {
          name: "ECDSA",
          namedCurve: "P-256",
          hash: { name: "SHA-256" }
        };
      default:
        throw new Error("Invalid alg claim");
    }
  }
  var UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  function validateUUID(str) {
    if (!UUID_REGEX.test(str)) {
      throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not");
    }
  }
  function userNotAvailableProxy() {
    const proxyTarget = {};
    return new Proxy(proxyTarget, {
      get: (target, prop) => {
        if (prop === "__isUserNotAvailableProxy") {
          return true;
        }
        if (typeof prop === "symbol") {
          const sProp = prop.toString();
          if (sProp === "Symbol(Symbol.toPrimitive)" || sProp === "Symbol(Symbol.toStringTag)" || sProp === "Symbol(util.inspect.custom)") {
            return void 0;
          }
        }
        throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${prop}" property of the session object is not supported. Please use getUser() instead.`);
      },
      set: (_target, prop) => {
        throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${prop}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
      },
      deleteProperty: (_target, prop) => {
        throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${prop}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
      }
    });
  }
  function insecureUserWarningProxy(user, suppressWarningRef) {
    return new Proxy(user, {
      get: (target, prop, receiver) => {
        if (prop === "__isInsecureUserWarningProxy") {
          return true;
        }
        if (typeof prop === "symbol") {
          const sProp = prop.toString();
          if (sProp === "Symbol(Symbol.toPrimitive)" || sProp === "Symbol(Symbol.toStringTag)" || sProp === "Symbol(util.inspect.custom)" || sProp === "Symbol(nodejs.util.inspect.custom)") {
            return Reflect.get(target, prop, receiver);
          }
        }
        if (!suppressWarningRef.value && typeof prop === "string") {
          console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.");
          suppressWarningRef.value = true;
        }
        return Reflect.get(target, prop, receiver);
      }
    });
  }
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // node_modules/@supabase/auth-js/dist/module/lib/fetch.js
  var _getErrorMessage2 = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
  var NETWORK_ERROR_CODES = [502, 503, 504];
  async function handleError2(error) {
    var _a;
    if (!looksLikeFetchResponse(error)) {
      throw new AuthRetryableFetchError(_getErrorMessage2(error), 0);
    }
    if (NETWORK_ERROR_CODES.includes(error.status)) {
      throw new AuthRetryableFetchError(_getErrorMessage2(error), error.status);
    }
    let data;
    try {
      data = await error.json();
    } catch (e2) {
      throw new AuthUnknownError(_getErrorMessage2(e2), e2);
    }
    let errorCode = void 0;
    const responseAPIVersion = parseResponseAPIVersion(error);
    if (responseAPIVersion && responseAPIVersion.getTime() >= API_VERSIONS["2024-01-01"].timestamp && typeof data === "object" && data && typeof data.code === "string") {
      errorCode = data.code;
    } else if (typeof data === "object" && data && typeof data.error_code === "string") {
      errorCode = data.error_code;
    }
    if (!errorCode) {
      if (typeof data === "object" && data && typeof data.weak_password === "object" && data.weak_password && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.reasons.reduce((a2, i2) => a2 && typeof i2 === "string", true)) {
        throw new AuthWeakPasswordError(_getErrorMessage2(data), error.status, data.weak_password.reasons);
      }
    } else if (errorCode === "weak_password") {
      throw new AuthWeakPasswordError(_getErrorMessage2(data), error.status, ((_a = data.weak_password) === null || _a === void 0 ? void 0 : _a.reasons) || []);
    } else if (errorCode === "session_not_found") {
      throw new AuthSessionMissingError();
    }
    throw new AuthApiError(_getErrorMessage2(data), error.status || 500, errorCode);
  }
  var _getRequestParams2 = (method, options, parameters, body) => {
    const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
    if (method === "GET") {
      return params;
    }
    params.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, options === null || options === void 0 ? void 0 : options.headers);
    params.body = JSON.stringify(body);
    return Object.assign(Object.assign({}, params), parameters);
  };
  async function _request(fetcher, method, url, options) {
    var _a;
    const headers = Object.assign({}, options === null || options === void 0 ? void 0 : options.headers);
    if (!headers[API_VERSION_HEADER_NAME]) {
      headers[API_VERSION_HEADER_NAME] = API_VERSIONS["2024-01-01"].name;
    }
    if (options === null || options === void 0 ? void 0 : options.jwt) {
      headers["Authorization"] = `Bearer ${options.jwt}`;
    }
    const qs = (_a = options === null || options === void 0 ? void 0 : options.query) !== null && _a !== void 0 ? _a : {};
    if (options === null || options === void 0 ? void 0 : options.redirectTo) {
      qs["redirect_to"] = options.redirectTo;
    }
    const queryString = Object.keys(qs).length ? "?" + new URLSearchParams(qs).toString() : "";
    const data = await _handleRequest2(fetcher, method, url + queryString, {
      headers,
      noResolveJson: options === null || options === void 0 ? void 0 : options.noResolveJson
    }, {}, options === null || options === void 0 ? void 0 : options.body);
    return (options === null || options === void 0 ? void 0 : options.xform) ? options === null || options === void 0 ? void 0 : options.xform(data) : { data: Object.assign({}, data), error: null };
  }
  async function _handleRequest2(fetcher, method, url, options, parameters, body) {
    const requestParams = _getRequestParams2(method, options, parameters, body);
    let result;
    try {
      result = await fetcher(url, Object.assign({}, requestParams));
    } catch (e2) {
      console.error(e2);
      throw new AuthRetryableFetchError(_getErrorMessage2(e2), 0);
    }
    if (!result.ok) {
      await handleError2(result);
    }
    if (options === null || options === void 0 ? void 0 : options.noResolveJson) {
      return result;
    }
    try {
      return await result.json();
    } catch (e2) {
      await handleError2(e2);
    }
  }
  function _sessionResponse(data) {
    var _a;
    let session = null;
    if (hasSession(data)) {
      session = Object.assign({}, data);
      if (!data.expires_at) {
        session.expires_at = expiresAt(data.expires_in);
      }
    }
    const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
    return { data: { session, user }, error: null };
  }
  function _sessionResponsePassword(data) {
    const response = _sessionResponse(data);
    if (!response.error && data.weak_password && typeof data.weak_password === "object" && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.message && typeof data.weak_password.message === "string" && data.weak_password.reasons.reduce((a2, i2) => a2 && typeof i2 === "string", true)) {
      response.data.weak_password = data.weak_password;
    }
    return response;
  }
  function _userResponse(data) {
    var _a;
    const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
    return { data: { user }, error: null };
  }
  function _ssoResponse(data) {
    return { data, error: null };
  }
  function _generateLinkResponse(data) {
    const { action_link, email_otp, hashed_token, redirect_to, verification_type } = data, rest = __rest(data, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]);
    const properties = {
      action_link,
      email_otp,
      hashed_token,
      redirect_to,
      verification_type
    };
    const user = Object.assign({}, rest);
    return {
      data: {
        properties,
        user
      },
      error: null
    };
  }
  function _noResolveJsonResponse(data) {
    return data;
  }
  function hasSession(data) {
    return data.access_token && data.refresh_token && data.expires_in;
  }

  // node_modules/@supabase/auth-js/dist/module/lib/types.js
  var SIGN_OUT_SCOPES = ["global", "local", "others"];

  // node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js
  var GoTrueAdminApi = class {
    /**
     * Creates an admin API client that can be used to manage users and OAuth clients.
     *
     * @example
     * ```ts
     * import { GoTrueAdminApi } from '@supabase/auth-js'
     *
     * const admin = new GoTrueAdminApi({
     *   url: 'https://xyzcompany.supabase.co/auth/v1',
     *   headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` },
     * })
     * ```
     */
    constructor({ url = "", headers = {}, fetch: fetch2 }) {
      this.url = url;
      this.headers = headers;
      this.fetch = resolveFetch3(fetch2);
      this.mfa = {
        listFactors: this._listFactors.bind(this),
        deleteFactor: this._deleteFactor.bind(this)
      };
      this.oauth = {
        listClients: this._listOAuthClients.bind(this),
        createClient: this._createOAuthClient.bind(this),
        getClient: this._getOAuthClient.bind(this),
        updateClient: this._updateOAuthClient.bind(this),
        deleteClient: this._deleteOAuthClient.bind(this),
        regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this)
      };
    }
    /**
     * Removes a logged-in session.
     * @param jwt A valid, logged-in JWT.
     * @param scope The logout sope.
     */
    async signOut(jwt, scope = SIGN_OUT_SCOPES[0]) {
      if (SIGN_OUT_SCOPES.indexOf(scope) < 0) {
        throw new Error(`@supabase/auth-js: Parameter scope must be one of ${SIGN_OUT_SCOPES.join(", ")}`);
      }
      try {
        await _request(this.fetch, "POST", `${this.url}/logout?scope=${scope}`, {
          headers: this.headers,
          jwt,
          noResolveJson: true
        });
        return { data: null, error: null };
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Sends an invite link to an email address.
     * @param email The email address of the user.
     * @param options Additional options to be included when inviting.
     */
    async inviteUserByEmail(email, options = {}) {
      try {
        return await _request(this.fetch, "POST", `${this.url}/invite`, {
          body: { email, data: options.data },
          headers: this.headers,
          redirectTo: options.redirectTo,
          xform: _userResponse
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error };
        }
        throw error;
      }
    }
    /**
     * Generates email links and OTPs to be sent via a custom email provider.
     * @param email The user's email.
     * @param options.password User password. For signup only.
     * @param options.data Optional user metadata. For signup only.
     * @param options.redirectTo The redirect url which should be appended to the generated link
     */
    async generateLink(params) {
      try {
        const { options } = params, rest = __rest(params, ["options"]);
        const body = Object.assign(Object.assign({}, rest), options);
        if ("newEmail" in rest) {
          body.new_email = rest === null || rest === void 0 ? void 0 : rest.newEmail;
          delete body["newEmail"];
        }
        return await _request(this.fetch, "POST", `${this.url}/admin/generate_link`, {
          body,
          headers: this.headers,
          xform: _generateLinkResponse,
          redirectTo: options === null || options === void 0 ? void 0 : options.redirectTo
        });
      } catch (error) {
        if (isAuthError(error)) {
          return {
            data: {
              properties: null,
              user: null
            },
            error
          };
        }
        throw error;
      }
    }
    // User Admin API
    /**
     * Creates a new user.
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async createUser(attributes) {
      try {
        return await _request(this.fetch, "POST", `${this.url}/admin/users`, {
          body: attributes,
          headers: this.headers,
          xform: _userResponse
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error };
        }
        throw error;
      }
    }
    /**
     * Get a list of users.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
     */
    async listUsers(params) {
      var _a, _b, _c, _d, _e, _f, _g;
      try {
        const pagination = { nextPage: null, lastPage: 0, total: 0 };
        const response = await _request(this.fetch, "GET", `${this.url}/admin/users`, {
          headers: this.headers,
          noResolveJson: true,
          query: {
            page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
            per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""
          },
          xform: _noResolveJsonResponse
        });
        if (response.error)
          throw response.error;
        const users = await response.json();
        const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
        const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
        if (links.length > 0) {
          links.forEach((link) => {
            const page = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
            const rel = JSON.parse(link.split(";")[1].split("=")[1]);
            pagination[`${rel}Page`] = page;
          });
          pagination.total = parseInt(total);
        }
        return { data: Object.assign(Object.assign({}, users), pagination), error: null };
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { users: [] }, error };
        }
        throw error;
      }
    }
    /**
     * Get user by id.
     *
     * @param uid The user's unique identifier
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async getUserById(uid) {
      validateUUID(uid);
      try {
        return await _request(this.fetch, "GET", `${this.url}/admin/users/${uid}`, {
          headers: this.headers,
          xform: _userResponse
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error };
        }
        throw error;
      }
    }
    /**
     * Updates the user data.
     *
     * @param attributes The data you want to update.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async updateUserById(uid, attributes) {
      validateUUID(uid);
      try {
        return await _request(this.fetch, "PUT", `${this.url}/admin/users/${uid}`, {
          body: attributes,
          headers: this.headers,
          xform: _userResponse
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error };
        }
        throw error;
      }
    }
    /**
     * Delete a user. Requires a `service_role` key.
     *
     * @param id The user id you want to remove.
     * @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema. Soft deletion allows user identification from the hashed user ID but is not reversible.
     * Defaults to false for backward compatibility.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async deleteUser(id, shouldSoftDelete = false) {
      validateUUID(id);
      try {
        return await _request(this.fetch, "DELETE", `${this.url}/admin/users/${id}`, {
          headers: this.headers,
          body: {
            should_soft_delete: shouldSoftDelete
          },
          xform: _userResponse
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { user: null }, error };
        }
        throw error;
      }
    }
    async _listFactors(params) {
      validateUUID(params.userId);
      try {
        const { data, error } = await _request(this.fetch, "GET", `${this.url}/admin/users/${params.userId}/factors`, {
          headers: this.headers,
          xform: (factors) => {
            return { data: { factors }, error: null };
          }
        });
        return { data, error };
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    async _deleteFactor(params) {
      validateUUID(params.userId);
      validateUUID(params.id);
      try {
        const data = await _request(this.fetch, "DELETE", `${this.url}/admin/users/${params.userId}/factors/${params.id}`, {
          headers: this.headers
        });
        return { data, error: null };
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Lists all OAuth clients with optional pagination.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _listOAuthClients(params) {
      var _a, _b, _c, _d, _e, _f, _g;
      try {
        const pagination = { nextPage: null, lastPage: 0, total: 0 };
        const response = await _request(this.fetch, "GET", `${this.url}/admin/oauth/clients`, {
          headers: this.headers,
          noResolveJson: true,
          query: {
            page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
            per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""
          },
          xform: _noResolveJsonResponse
        });
        if (response.error)
          throw response.error;
        const clients = await response.json();
        const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
        const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
        if (links.length > 0) {
          links.forEach((link) => {
            const page = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
            const rel = JSON.parse(link.split(";")[1].split("=")[1]);
            pagination[`${rel}Page`] = page;
          });
          pagination.total = parseInt(total);
        }
        return { data: Object.assign(Object.assign({}, clients), pagination), error: null };
      } catch (error) {
        if (isAuthError(error)) {
          return { data: { clients: [] }, error };
        }
        throw error;
      }
    }
    /**
     * Creates a new OAuth client.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _createOAuthClient(params) {
      try {
        return await _request(this.fetch, "POST", `${this.url}/admin/oauth/clients`, {
          body: params,
          headers: this.headers,
          xform: (client) => {
            return { data: client, error: null };
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Gets details of a specific OAuth client.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _getOAuthClient(clientId) {
      try {
        return await _request(this.fetch, "GET", `${this.url}/admin/oauth/clients/${clientId}`, {
          headers: this.headers,
          xform: (client) => {
            return { data: client, error: null };
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Updates an existing OAuth client.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _updateOAuthClient(clientId, params) {
      try {
        return await _request(this.fetch, "PUT", `${this.url}/admin/oauth/clients/${clientId}`, {
          body: params,
          headers: this.headers,
          xform: (client) => {
            return { data: client, error: null };
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Deletes an OAuth client.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _deleteOAuthClient(clientId) {
      try {
        await _request(this.fetch, "DELETE", `${this.url}/admin/oauth/clients/${clientId}`, {
          headers: this.headers,
          noResolveJson: true
        });
        return { data: null, error: null };
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
    /**
     * Regenerates the secret for an OAuth client.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async _regenerateOAuthClientSecret(clientId) {
      try {
        return await _request(this.fetch, "POST", `${this.url}/admin/oauth/clients/${clientId}/regenerate_secret`, {
          headers: this.headers,
          xform: (client) => {
            return { data: client, error: null };
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    }
  };

  // node_modules/@supabase/auth-js/dist/module/lib/local-storage.js
  function memoryLocalStorageAdapter(store = {}) {
    return {
      getItem: (key) => {
        return store[key] || null;
      },
      setItem: (key, value) => {
        store[key] = value;
      },
      removeItem: (key) => {
        delete store[key];
      }
    };
  }

  // node_modules/@supabase/auth-js/dist/module/lib/locks.js
  var internals = {
    /**
     * @experimental
     */
    debug: !!(globalThis && supportsLocalStorage() && globalThis.localStorage && globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true")
  };
  var LockAcquireTimeoutError = class extends Error {
    constructor(message) {
      super(message);
      this.isAcquireTimeout = true;
    }
  };
  var NavigatorLockAcquireTimeoutError = class extends LockAcquireTimeoutError {
  };
  async function navigatorLock(name7, acquireTimeout, fn) {
    if (internals.debug) {
      console.log("@supabase/gotrue-js: navigatorLock: acquire lock", name7, acquireTimeout);
    }
    const abortController = new globalThis.AbortController();
    if (acquireTimeout > 0) {
      setTimeout(() => {
        abortController.abort();
        if (internals.debug) {
          console.log("@supabase/gotrue-js: navigatorLock acquire timed out", name7);
        }
      }, acquireTimeout);
    }
    return await Promise.resolve().then(() => globalThis.navigator.locks.request(name7, acquireTimeout === 0 ? {
      mode: "exclusive",
      ifAvailable: true
    } : {
      mode: "exclusive",
      signal: abortController.signal
    }, async (lock) => {
      if (lock) {
        if (internals.debug) {
          console.log("@supabase/gotrue-js: navigatorLock: acquired", name7, lock.name);
        }
        try {
          return await fn();
        } finally {
          if (internals.debug) {
            console.log("@supabase/gotrue-js: navigatorLock: released", name7, lock.name);
          }
        }
      } else {
        if (acquireTimeout === 0) {
          if (internals.debug) {
            console.log("@supabase/gotrue-js: navigatorLock: not immediately available", name7);
          }
          throw new NavigatorLockAcquireTimeoutError(`Acquiring an exclusive Navigator LockManager lock "${name7}" immediately failed`);
        } else {
          if (internals.debug) {
            try {
              const result = await globalThis.navigator.locks.query();
              console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(result, null, "  "));
            } catch (e2) {
              console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", e2);
            }
          }
          console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request");
          return await fn();
        }
      }
    }));
  }

  // node_modules/@supabase/auth-js/dist/module/lib/polyfills.js
  function polyfillGlobalThis() {
    if (typeof globalThis === "object")
      return;
    try {
      Object.defineProperty(Object.prototype, "__magic__", {
        get: function() {
          return this;
        },
        configurable: true
      });
      __magic__.globalThis = __magic__;
      delete Object.prototype.__magic__;
    } catch (e2) {
      if (typeof self !== "undefined") {
        self.globalThis = self;
      }
    }
  }

  // node_modules/@supabase/auth-js/dist/module/lib/web3/ethereum.js
  function getAddress(address) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new Error(`@supabase/auth-js: Address "${address}" is invalid.`);
    }
    return address.toLowerCase();
  }
  function fromHex(hex) {
    return parseInt(hex, 16);
  }
  function toHex(value) {
    const bytes = new TextEncoder().encode(value);
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return "0x" + hex;
  }
  function createSiweMessage(parameters) {
    var _a;
    const { chainId, domain, expirationTime, issuedAt = /* @__PURE__ */ new Date(), nonce, notBefore, requestId, resources, scheme, uri, version: version11 } = parameters;
    {
      if (!Number.isInteger(chainId))
        throw new Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${chainId}`);
      if (!domain)
        throw new Error(`@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.`);
      if (nonce && nonce.length < 8)
        throw new Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${nonce}`);
      if (!uri)
        throw new Error(`@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.`);
      if (version11 !== "1")
        throw new Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${version11}`);
      if ((_a = parameters.statement) === null || _a === void 0 ? void 0 : _a.includes("\n"))
        throw new Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${parameters.statement}`);
    }
    const address = getAddress(parameters.address);
    const origin = scheme ? `${scheme}://${domain}` : domain;
    const statement = parameters.statement ? `${parameters.statement}
` : "";
    const prefix = `${origin} wants you to sign in with your Ethereum account:
${address}

${statement}`;
    let suffix = `URI: ${uri}
Version: ${version11}
Chain ID: ${chainId}${nonce ? `
Nonce: ${nonce}` : ""}
Issued At: ${issuedAt.toISOString()}`;
    if (expirationTime)
      suffix += `
Expiration Time: ${expirationTime.toISOString()}`;
    if (notBefore)
      suffix += `
Not Before: ${notBefore.toISOString()}`;
    if (requestId)
      suffix += `
Request ID: ${requestId}`;
    if (resources) {
      let content = "\nResources:";
      for (const resource of resources) {
        if (!resource || typeof resource !== "string")
          throw new Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${resource}`);
        content += `
- ${resource}`;
      }
      suffix += content;
    }
    return `${prefix}
${suffix}`;
  }

  // node_modules/@supabase/auth-js/dist/module/lib/webauthn.errors.js
  var WebAuthnError = class extends Error {
    constructor({ message, code, cause, name: name7 }) {
      var _a;
      super(message, { cause });
      this.__isWebAuthnError = true;
      this.name = (_a = name7 !== null && name7 !== void 0 ? name7 : cause instanceof Error ? cause.name : void 0) !== null && _a !== void 0 ? _a : "Unknown Error";
      this.code = code;
    }
  };
  var WebAuthnUnknownError = class extends WebAuthnError {
    constructor(message, originalError) {
      super({
        code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
        cause: originalError,
        message
      });
      this.name = "WebAuthnUnknownError";
      this.originalError = originalError;
    }
  };
  function identifyRegistrationError({ error, options }) {
    var _a, _b, _c;
    const { publicKey } = options;
    if (!publicKey) {
      throw Error("options was missing required publicKey property");
    }
    if (error.name === "AbortError") {
      if (options.signal instanceof AbortSignal) {
        return new WebAuthnError({
          message: "Registration ceremony was sent an abort signal",
          code: "ERROR_CEREMONY_ABORTED",
          cause: error
        });
      }
    } else if (error.name === "ConstraintError") {
      if (((_a = publicKey.authenticatorSelection) === null || _a === void 0 ? void 0 : _a.requireResidentKey) === true) {
        return new WebAuthnError({
          message: "Discoverable credentials were required but no available authenticator supported it",
          code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",
          cause: error
        });
      } else if (
        // @ts-ignore: `mediation` doesn't yet exist on CredentialCreationOptions but it's possible as of Sept 2024
        options.mediation === "conditional" && ((_b = publicKey.authenticatorSelection) === null || _b === void 0 ? void 0 : _b.userVerification) === "required"
      ) {
        return new WebAuthnError({
          message: "User verification was required during automatic registration but it could not be performed",
          code: "ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",
          cause: error
        });
      } else if (((_c = publicKey.authenticatorSelection) === null || _c === void 0 ? void 0 : _c.userVerification) === "required") {
        return new WebAuthnError({
          message: "User verification was required but no available authenticator supported it",
          code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",
          cause: error
        });
      }
    } else if (error.name === "InvalidStateError") {
      return new WebAuthnError({
        message: "The authenticator was previously registered",
        code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",
        cause: error
      });
    } else if (error.name === "NotAllowedError") {
      return new WebAuthnError({
        message: error.message,
        code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
        cause: error
      });
    } else if (error.name === "NotSupportedError") {
      const validPubKeyCredParams = publicKey.pubKeyCredParams.filter((param) => param.type === "public-key");
      if (validPubKeyCredParams.length === 0) {
        return new WebAuthnError({
          message: 'No entry in pubKeyCredParams was of type "public-key"',
          code: "ERROR_MALFORMED_PUBKEYCREDPARAMS",
          cause: error
        });
      }
      return new WebAuthnError({
        message: "No available authenticator supported any of the specified pubKeyCredParams algorithms",
        code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",
        cause: error
      });
    } else if (error.name === "SecurityError") {
      const effectiveDomain = window.location.hostname;
      if (!isValidDomain(effectiveDomain)) {
        return new WebAuthnError({
          message: `${window.location.hostname} is an invalid domain`,
          code: "ERROR_INVALID_DOMAIN",
          cause: error
        });
      } else if (publicKey.rp.id !== effectiveDomain) {
        return new WebAuthnError({
          message: `The RP ID "${publicKey.rp.id}" is invalid for this domain`,
          code: "ERROR_INVALID_RP_ID",
          cause: error
        });
      }
    } else if (error.name === "TypeError") {
      if (publicKey.user.id.byteLength < 1 || publicKey.user.id.byteLength > 64) {
        return new WebAuthnError({
          message: "User ID was not between 1 and 64 characters",
          code: "ERROR_INVALID_USER_ID_LENGTH",
          cause: error
        });
      }
    } else if (error.name === "UnknownError") {
      return new WebAuthnError({
        message: "The authenticator was unable to process the specified options, or could not create a new credential",
        code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
        cause: error
      });
    }
    return new WebAuthnError({
      message: "a Non-Webauthn related error has occurred",
      code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
      cause: error
    });
  }
  function identifyAuthenticationError({ error, options }) {
    const { publicKey } = options;
    if (!publicKey) {
      throw Error("options was missing required publicKey property");
    }
    if (error.name === "AbortError") {
      if (options.signal instanceof AbortSignal) {
        return new WebAuthnError({
          message: "Authentication ceremony was sent an abort signal",
          code: "ERROR_CEREMONY_ABORTED",
          cause: error
        });
      }
    } else if (error.name === "NotAllowedError") {
      return new WebAuthnError({
        message: error.message,
        code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
        cause: error
      });
    } else if (error.name === "SecurityError") {
      const effectiveDomain = window.location.hostname;
      if (!isValidDomain(effectiveDomain)) {
        return new WebAuthnError({
          message: `${window.location.hostname} is an invalid domain`,
          code: "ERROR_INVALID_DOMAIN",
          cause: error
        });
      } else if (publicKey.rpId !== effectiveDomain) {
        return new WebAuthnError({
          message: `The RP ID "${publicKey.rpId}" is invalid for this domain`,
          code: "ERROR_INVALID_RP_ID",
          cause: error
        });
      }
    } else if (error.name === "UnknownError") {
      return new WebAuthnError({
        message: "The authenticator was unable to process the specified options, or could not create a new assertion signature",
        code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
        cause: error
      });
    }
    return new WebAuthnError({
      message: "a Non-Webauthn related error has occurred",
      code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
      cause: error
    });
  }

  // node_modules/@supabase/auth-js/dist/module/lib/webauthn.js
  var WebAuthnAbortService = class {
    /**
     * Create an abort signal for a new WebAuthn operation.
     * Automatically cancels any existing operation.
     *
     * @returns {AbortSignal} Signal to pass to navigator.credentials.create() or .get()
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal MDN - AbortSignal}
     */
    createNewAbortSignal() {
      if (this.controller) {
        const abortError = new Error("Cancelling existing WebAuthn API call for new one");
        abortError.name = "AbortError";
        this.controller.abort(abortError);
      }
      const newController = new AbortController();
      this.controller = newController;
      return newController.signal;
    }
    /**
     * Manually cancel the current WebAuthn operation.
     * Useful for cleaning up when user cancels or navigates away.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort MDN - AbortController.abort}
     */
    cancelCeremony() {
      if (this.controller) {
        const abortError = new Error("Manually cancelling existing WebAuthn API call");
        abortError.name = "AbortError";
        this.controller.abort(abortError);
        this.controller = void 0;
      }
    }
  };
  var webAuthnAbortService = new WebAuthnAbortService();
  function deserializeCredentialCreationOptions(options) {
    if (!options) {
      throw new Error("Credential creation options are required");
    }
    if (typeof PublicKeyCredential !== "undefined" && "parseCreationOptionsFromJSON" in PublicKeyCredential && typeof PublicKeyCredential.parseCreationOptionsFromJSON === "function") {
      return PublicKeyCredential.parseCreationOptionsFromJSON(
        /** we assert the options here as typescript still doesn't know about future webauthn types */
        options
      );
    }
    const { challenge: challengeStr, user: userOpts, excludeCredentials } = options, restOptions = __rest(
      options,
      ["challenge", "user", "excludeCredentials"]
    );
    const challenge = base64UrlToUint8Array(challengeStr).buffer;
    const user = Object.assign(Object.assign({}, userOpts), { id: base64UrlToUint8Array(userOpts.id).buffer });
    const result = Object.assign(Object.assign({}, restOptions), {
      challenge,
      user
    });
    if (excludeCredentials && excludeCredentials.length > 0) {
      result.excludeCredentials = new Array(excludeCredentials.length);
      for (let i2 = 0; i2 < excludeCredentials.length; i2++) {
        const cred = excludeCredentials[i2];
        result.excludeCredentials[i2] = Object.assign(Object.assign({}, cred), {
          id: base64UrlToUint8Array(cred.id).buffer,
          type: cred.type || "public-key",
          // Cast transports to handle future transport types like "cable"
          transports: cred.transports
        });
      }
    }
    return result;
  }
  function deserializeCredentialRequestOptions(options) {
    if (!options) {
      throw new Error("Credential request options are required");
    }
    if (typeof PublicKeyCredential !== "undefined" && "parseRequestOptionsFromJSON" in PublicKeyCredential && typeof PublicKeyCredential.parseRequestOptionsFromJSON === "function") {
      return PublicKeyCredential.parseRequestOptionsFromJSON(options);
    }
    const { challenge: challengeStr, allowCredentials } = options, restOptions = __rest(
      options,
      ["challenge", "allowCredentials"]
    );
    const challenge = base64UrlToUint8Array(challengeStr).buffer;
    const result = Object.assign(Object.assign({}, restOptions), { challenge });
    if (allowCredentials && allowCredentials.length > 0) {
      result.allowCredentials = new Array(allowCredentials.length);
      for (let i2 = 0; i2 < allowCredentials.length; i2++) {
        const cred = allowCredentials[i2];
        result.allowCredentials[i2] = Object.assign(Object.assign({}, cred), {
          id: base64UrlToUint8Array(cred.id).buffer,
          type: cred.type || "public-key",
          // Cast transports to handle future transport types like "cable"
          transports: cred.transports
        });
      }
    }
    return result;
  }
  function serializeCredentialCreationResponse(credential) {
    var _a;
    if ("toJSON" in credential && typeof credential.toJSON === "function") {
      return credential.toJSON();
    }
    const credentialWithAttachment = credential;
    return {
      id: credential.id,
      rawId: credential.id,
      response: {
        attestationObject: bytesToBase64URL(new Uint8Array(credential.response.attestationObject)),
        clientDataJSON: bytesToBase64URL(new Uint8Array(credential.response.clientDataJSON))
      },
      type: "public-key",
      clientExtensionResults: credential.getClientExtensionResults(),
      // Convert null to undefined and cast to AuthenticatorAttachment type
      authenticatorAttachment: (_a = credentialWithAttachment.authenticatorAttachment) !== null && _a !== void 0 ? _a : void 0
    };
  }
  function serializeCredentialRequestResponse(credential) {
    var _a;
    if ("toJSON" in credential && typeof credential.toJSON === "function") {
      return credential.toJSON();
    }
    const credentialWithAttachment = credential;
    const clientExtensionResults = credential.getClientExtensionResults();
    const assertionResponse = credential.response;
    return {
      id: credential.id,
      rawId: credential.id,
      // W3C spec expects rawId to match id for JSON format
      response: {
        authenticatorData: bytesToBase64URL(new Uint8Array(assertionResponse.authenticatorData)),
        clientDataJSON: bytesToBase64URL(new Uint8Array(assertionResponse.clientDataJSON)),
        signature: bytesToBase64URL(new Uint8Array(assertionResponse.signature)),
        userHandle: assertionResponse.userHandle ? bytesToBase64URL(new Uint8Array(assertionResponse.userHandle)) : void 0
      },
      type: "public-key",
      clientExtensionResults,
      // Convert null to undefined and cast to AuthenticatorAttachment type
      authenticatorAttachment: (_a = credentialWithAttachment.authenticatorAttachment) !== null && _a !== void 0 ? _a : void 0
    };
  }
  function isValidDomain(hostname) {
    return (
      // Consider localhost valid as well since it's okay wrt Secure Contexts
      hostname === "localhost" || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(hostname)
    );
  }
  function browserSupportsWebAuthn() {
    var _a, _b;
    return !!(isBrowser() && "PublicKeyCredential" in window && window.PublicKeyCredential && "credentials" in navigator && typeof ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.credentials) === null || _a === void 0 ? void 0 : _a.create) === "function" && typeof ((_b = navigator === null || navigator === void 0 ? void 0 : navigator.credentials) === null || _b === void 0 ? void 0 : _b.get) === "function");
  }
  async function createCredential(options) {
    try {
      const response = await navigator.credentials.create(
        /** we assert the type here until typescript types are updated */
        options
      );
      if (!response) {
        return {
          data: null,
          error: new WebAuthnUnknownError("Empty credential response", response)
        };
      }
      if (!(response instanceof PublicKeyCredential)) {
        return {
          data: null,
          error: new WebAuthnUnknownError("Browser returned unexpected credential type", response)
        };
      }
      return { data: response, error: null };
    } catch (err) {
      return {
        data: null,
        error: identifyRegistrationError({
          error: err,
          options
        })
      };
    }
  }
  async function getCredential(options) {
    try {
      const response = await navigator.credentials.get(
        /** we assert the type here until typescript types are updated */
        options
      );
      if (!response) {
        return {
          data: null,
          error: new WebAuthnUnknownError("Empty credential response", response)
        };
      }
      if (!(response instanceof PublicKeyCredential)) {
        return {
          data: null,
          error: new WebAuthnUnknownError("Browser returned unexpected credential type", response)
        };
      }
      return { data: response, error: null };
    } catch (err) {
      return {
        data: null,
        error: identifyAuthenticationError({
          error: err,
          options
        })
      };
    }
  }
  var DEFAULT_CREATION_OPTIONS = {
    hints: ["security-key"],
    authenticatorSelection: {
      authenticatorAttachment: "cross-platform",
      requireResidentKey: false,
      /** set to preferred because older yubikeys don't have PIN/Biometric */
      userVerification: "preferred",
      residentKey: "discouraged"
    },
    attestation: "direct"
  };
  var DEFAULT_REQUEST_OPTIONS = {
    /** set to preferred because older yubikeys don't have PIN/Biometric */
    userVerification: "preferred",
    hints: ["security-key"],
    attestation: "direct"
  };
  function deepMerge(...sources) {
    const isObject2 = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    const isArrayBufferLike = (val) => val instanceof ArrayBuffer || ArrayBuffer.isView(val);
    const result = {};
    for (const source of sources) {
      if (!source)
        continue;
      for (const key in source) {
        const value = source[key];
        if (value === void 0)
          continue;
        if (Array.isArray(value)) {
          result[key] = value;
        } else if (isArrayBufferLike(value)) {
          result[key] = value;
        } else if (isObject2(value)) {
          const existing = result[key];
          if (isObject2(existing)) {
            result[key] = deepMerge(existing, value);
          } else {
            result[key] = deepMerge(value);
          }
        } else {
          result[key] = value;
        }
      }
    }
    return result;
  }
  function mergeCredentialCreationOptions(baseOptions, overrides) {
    return deepMerge(DEFAULT_CREATION_OPTIONS, baseOptions, overrides || {});
  }
  function mergeCredentialRequestOptions(baseOptions, overrides) {
    return deepMerge(DEFAULT_REQUEST_OPTIONS, baseOptions, overrides || {});
  }
  var WebAuthnApi = class {
    constructor(client) {
      this.client = client;
      this.enroll = this._enroll.bind(this);
      this.challenge = this._challenge.bind(this);
      this.verify = this._verify.bind(this);
      this.authenticate = this._authenticate.bind(this);
      this.register = this._register.bind(this);
    }
    /**
     * Enroll a new WebAuthn factor.
     * Creates an unverified WebAuthn factor that must be verified with a credential.
     *
     * @experimental This method is experimental and may change in future releases
     * @param {Omit<MFAEnrollWebauthnParams, 'factorType'>} params - Enrollment parameters (friendlyName required)
     * @returns {Promise<AuthMFAEnrollWebauthnResponse>} Enrolled factor details or error
     * @see {@link https://w3c.github.io/webauthn/#sctn-registering-a-new-credential W3C WebAuthn Spec - Registering a New Credential}
     */
    async _enroll(params) {
      return this.client.mfa.enroll(Object.assign(Object.assign({}, params), { factorType: "webauthn" }));
    }
    /**
     * Challenge for WebAuthn credential creation or authentication.
     * Combines server challenge with browser credential operations.
     * Handles both registration (create) and authentication (request) flows.
     *
     * @experimental This method is experimental and may change in future releases
     * @param {MFAChallengeWebauthnParams & { friendlyName?: string; signal?: AbortSignal }} params - Challenge parameters including factorId
     * @param {Object} overrides - Allows you to override the parameters passed to navigator.credentials
     * @param {PublicKeyCredentialCreationOptionsFuture} overrides.create - Override options for credential creation
     * @param {PublicKeyCredentialRequestOptionsFuture} overrides.request - Override options for credential request
     * @returns {Promise<RequestResult>} Challenge response with credential or error
     * @see {@link https://w3c.github.io/webauthn/#sctn-credential-creation W3C WebAuthn Spec - Credential Creation}
     * @see {@link https://w3c.github.io/webauthn/#sctn-verifying-assertion W3C WebAuthn Spec - Verifying Assertion}
     */
    async _challenge({ factorId, webauthn, friendlyName, signal }, overrides) {
      try {
        const { data: challengeResponse, error: challengeError } = await this.client.mfa.challenge({
          factorId,
          webauthn
        });
        if (!challengeResponse) {
          return { data: null, error: challengeError };
        }
        const abortSignal = signal !== null && signal !== void 0 ? signal : webAuthnAbortService.createNewAbortSignal();
        if (challengeResponse.webauthn.type === "create") {
          const { user } = challengeResponse.webauthn.credential_options.publicKey;
          if (!user.name) {
            user.name = `${user.id}:${friendlyName}`;
          }
          if (!user.displayName) {
            user.displayName = user.name;
          }
        }
        switch (challengeResponse.webauthn.type) {
          case "create": {
            const options = mergeCredentialCreationOptions(challengeResponse.webauthn.credential_options.publicKey, overrides === null || overrides === void 0 ? void 0 : overrides.create);
            const { data, error } = await createCredential({
              publicKey: options,
              signal: abortSignal
            });
            if (data) {
              return {
                data: {
                  factorId,
                  challengeId: challengeResponse.id,
                  webauthn: {
                    type: challengeResponse.webauthn.type,
                    credential_response: data
                  }
                },
                error: null
              };
            }
            return { data: null, error };
          }
          case "request": {
            const options = mergeCredentialRequestOptions(challengeResponse.webauthn.credential_options.publicKey, overrides === null || overrides === void 0 ? void 0 : overrides.request);
            const { data, error } = await getCredential(Object.assign(Object.assign({}, challengeResponse.webauthn.credential_options), { publicKey: options, signal: abortSignal }));
            if (data) {
              return {
                data: {
                  factorId,
                  challengeId: challengeResponse.id,
                  webauthn: {
                    type: challengeResponse.webauthn.type,
                    credential_response: data
                  }
                },
                error: null
              };
            }
            return { data: null, error };
          }
        }
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        return {
          data: null,
          error: new AuthUnknownError("Unexpected error in challenge", error)
        };
      }
    }
    /**
     * Verify a WebAuthn credential with the server.
     * Completes the WebAuthn ceremony by sending the credential to the server for verification.
     *
     * @experimental This method is experimental and may change in future releases
     * @param {Object} params - Verification parameters
     * @param {string} params.challengeId - ID of the challenge being verified
     * @param {string} params.factorId - ID of the WebAuthn factor
     * @param {MFAVerifyWebauthnParams<T>['webauthn']} params.webauthn - WebAuthn credential response
     * @returns {Promise<AuthMFAVerifyResponse>} Verification result with session or error
     * @see {@link https://w3c.github.io/webauthn/#sctn-verifying-assertion W3C WebAuthn Spec - Verifying an Authentication Assertion}
     * */
    async _verify({ challengeId, factorId, webauthn }) {
      return this.client.mfa.verify({
        factorId,
        challengeId,
        webauthn
      });
    }
    /**
     * Complete WebAuthn authentication flow.
     * Performs challenge and verification in a single operation for existing credentials.
     *
     * @experimental This method is experimental and may change in future releases
     * @param {Object} params - Authentication parameters
     * @param {string} params.factorId - ID of the WebAuthn factor to authenticate with
     * @param {Object} params.webauthn - WebAuthn configuration
     * @param {string} params.webauthn.rpId - Relying Party ID (defaults to current hostname)
     * @param {string[]} params.webauthn.rpOrigins - Allowed origins (defaults to current origin)
     * @param {AbortSignal} params.webauthn.signal - Optional abort signal
     * @param {PublicKeyCredentialRequestOptionsFuture} overrides - Override options for navigator.credentials.get
     * @returns {Promise<RequestResult<AuthMFAVerifyResponseData, WebAuthnError | AuthError>>} Authentication result
     * @see {@link https://w3c.github.io/webauthn/#sctn-authentication W3C WebAuthn Spec - Authentication Ceremony}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions MDN - PublicKeyCredentialRequestOptions}
     */
    async _authenticate({ factorId, webauthn: { rpId = typeof window !== "undefined" ? window.location.hostname : void 0, rpOrigins = typeof window !== "undefined" ? [window.location.origin] : void 0, signal } = {} }, overrides) {
      if (!rpId) {
        return {
          data: null,
          error: new AuthError("rpId is required for WebAuthn authentication")
        };
      }
      try {
        if (!browserSupportsWebAuthn()) {
          return {
            data: null,
            error: new AuthUnknownError("Browser does not support WebAuthn", null)
          };
        }
        const { data: challengeResponse, error: challengeError } = await this.challenge({
          factorId,
          webauthn: { rpId, rpOrigins },
          signal
        }, { request: overrides });
        if (!challengeResponse) {
          return { data: null, error: challengeError };
        }
        const { webauthn } = challengeResponse;
        return this._verify({
          factorId,
          challengeId: challengeResponse.challengeId,
          webauthn: {
            type: webauthn.type,
            rpId,
            rpOrigins,
            credential_response: webauthn.credential_response
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        return {
          data: null,
          error: new AuthUnknownError("Unexpected error in authenticate", error)
        };
      }
    }
    /**
     * Complete WebAuthn registration flow.
     * Performs enrollment, challenge, and verification in a single operation for new credentials.
     *
     * @experimental This method is experimental and may change in future releases
     * @param {Object} params - Registration parameters
     * @param {string} params.friendlyName - User-friendly name for the credential
     * @param {string} params.rpId - Relying Party ID (defaults to current hostname)
     * @param {string[]} params.rpOrigins - Allowed origins (defaults to current origin)
     * @param {AbortSignal} params.signal - Optional abort signal
     * @param {PublicKeyCredentialCreationOptionsFuture} overrides - Override options for navigator.credentials.create
     * @returns {Promise<RequestResult<AuthMFAVerifyResponseData, WebAuthnError | AuthError>>} Registration result
     * @see {@link https://w3c.github.io/webauthn/#sctn-registering-a-new-credential W3C WebAuthn Spec - Registration Ceremony}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions MDN - PublicKeyCredentialCreationOptions}
     */
    async _register({ friendlyName, webauthn: { rpId = typeof window !== "undefined" ? window.location.hostname : void 0, rpOrigins = typeof window !== "undefined" ? [window.location.origin] : void 0, signal } = {} }, overrides) {
      if (!rpId) {
        return {
          data: null,
          error: new AuthError("rpId is required for WebAuthn registration")
        };
      }
      try {
        if (!browserSupportsWebAuthn()) {
          return {
            data: null,
            error: new AuthUnknownError("Browser does not support WebAuthn", null)
          };
        }
        const { data: factor, error: enrollError } = await this._enroll({
          friendlyName
        });
        if (!factor) {
          await this.client.mfa.listFactors().then((factors) => {
            var _a;
            return (_a = factors.data) === null || _a === void 0 ? void 0 : _a.all.find((v) => v.factor_type === "webauthn" && v.friendly_name === friendlyName && v.status !== "unverified");
          }).then((factor2) => factor2 ? this.client.mfa.unenroll({ factorId: factor2 === null || factor2 === void 0 ? void 0 : factor2.id }) : void 0);
          return { data: null, error: enrollError };
        }
        const { data: challengeResponse, error: challengeError } = await this._challenge({
          factorId: factor.id,
          friendlyName: factor.friendly_name,
          webauthn: { rpId, rpOrigins },
          signal
        }, {
          create: overrides
        });
        if (!challengeResponse) {
          return { data: null, error: challengeError };
        }
        return this._verify({
          factorId: factor.id,
          challengeId: challengeResponse.challengeId,
          webauthn: {
            rpId,
            rpOrigins,
            type: challengeResponse.webauthn.type,
            credential_response: challengeResponse.webauthn.credential_response
          }
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        return {
          data: null,
          error: new AuthUnknownError("Unexpected error in register", error)
        };
      }
    }
  };

  // node_modules/@supabase/auth-js/dist/module/GoTrueClient.js
  polyfillGlobalThis();
  var DEFAULT_OPTIONS = {
    url: GOTRUE_URL,
    storageKey: STORAGE_KEY,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    headers: DEFAULT_HEADERS2,
    flowType: "implicit",
    debug: false,
    hasCustomAuthorizationHeader: false,
    throwOnError: false
  };
  async function lockNoOp(name7, acquireTimeout, fn) {
    return await fn();
  }
  var GLOBAL_JWKS = {};
  var GoTrueClient = class _GoTrueClient {
    /**
     * The JWKS used for verifying asymmetric JWTs
     */
    get jwks() {
      var _a, _b;
      return (_b = (_a = GLOBAL_JWKS[this.storageKey]) === null || _a === void 0 ? void 0 : _a.jwks) !== null && _b !== void 0 ? _b : { keys: [] };
    }
    set jwks(value) {
      GLOBAL_JWKS[this.storageKey] = Object.assign(Object.assign({}, GLOBAL_JWKS[this.storageKey]), { jwks: value });
    }
    get jwks_cached_at() {
      var _a, _b;
      return (_b = (_a = GLOBAL_JWKS[this.storageKey]) === null || _a === void 0 ? void 0 : _a.cachedAt) !== null && _b !== void 0 ? _b : Number.MIN_SAFE_INTEGER;
    }
    set jwks_cached_at(value) {
      GLOBAL_JWKS[this.storageKey] = Object.assign(Object.assign({}, GLOBAL_JWKS[this.storageKey]), { cachedAt: value });
    }
    /**
     * Create a new client for use in the browser.
     *
     * @example
     * ```ts
     * import { GoTrueClient } from '@supabase/auth-js'
     *
     * const auth = new GoTrueClient({
     *   url: 'https://xyzcompany.supabase.co/auth/v1',
     *   headers: { apikey: 'public-anon-key' },
     *   storageKey: 'supabase-auth',
     * })
     * ```
     */
    constructor(options) {
      var _a, _b, _c;
      this.userStorage = null;
      this.memoryStorage = null;
      this.stateChangeEmitters = /* @__PURE__ */ new Map();
      this.autoRefreshTicker = null;
      this.visibilityChangedCallback = null;
      this.refreshingDeferred = null;
      this.initializePromise = null;
      this.detectSessionInUrl = true;
      this.hasCustomAuthorizationHeader = false;
      this.suppressGetSessionWarning = false;
      this.lockAcquired = false;
      this.pendingInLock = [];
      this.broadcastChannel = null;
      this.logger = console.log;
      const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
      this.storageKey = settings.storageKey;
      this.instanceID = (_a = _GoTrueClient.nextInstanceID[this.storageKey]) !== null && _a !== void 0 ? _a : 0;
      _GoTrueClient.nextInstanceID[this.storageKey] = this.instanceID + 1;
      this.logDebugMessages = !!settings.debug;
      if (typeof settings.debug === "function") {
        this.logger = settings.debug;
      }
      if (this.instanceID > 0 && isBrowser()) {
        const message = `${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;
        console.warn(message);
        if (this.logDebugMessages) {
          console.trace(message);
        }
      }
      this.persistSession = settings.persistSession;
      this.autoRefreshToken = settings.autoRefreshToken;
      this.admin = new GoTrueAdminApi({
        url: settings.url,
        headers: settings.headers,
        fetch: settings.fetch
      });
      this.url = settings.url;
      this.headers = settings.headers;
      this.fetch = resolveFetch3(settings.fetch);
      this.lock = settings.lock || lockNoOp;
      this.detectSessionInUrl = settings.detectSessionInUrl;
      this.flowType = settings.flowType;
      this.hasCustomAuthorizationHeader = settings.hasCustomAuthorizationHeader;
      this.throwOnError = settings.throwOnError;
      if (settings.lock) {
        this.lock = settings.lock;
      } else if (this.persistSession && isBrowser() && ((_b = globalThis === null || globalThis === void 0 ? void 0 : globalThis.navigator) === null || _b === void 0 ? void 0 : _b.locks)) {
        this.lock = navigatorLock;
      } else {
        this.lock = lockNoOp;
      }
      if (!this.jwks) {
        this.jwks = { keys: [] };
        this.jwks_cached_at = Number.MIN_SAFE_INTEGER;
      }
      this.mfa = {
        verify: this._verify.bind(this),
        enroll: this._enroll.bind(this),
        unenroll: this._unenroll.bind(this),
        challenge: this._challenge.bind(this),
        listFactors: this._listFactors.bind(this),
        challengeAndVerify: this._challengeAndVerify.bind(this),
        getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this),
        webauthn: new WebAuthnApi(this)
      };
      this.oauth = {
        getAuthorizationDetails: this._getAuthorizationDetails.bind(this),
        approveAuthorization: this._approveAuthorization.bind(this),
        denyAuthorization: this._denyAuthorization.bind(this),
        listGrants: this._listOAuthGrants.bind(this),
        revokeGrant: this._revokeOAuthGrant.bind(this)
      };
      if (this.persistSession) {
        if (settings.storage) {
          this.storage = settings.storage;
        } else {
          if (supportsLocalStorage()) {
            this.storage = globalThis.localStorage;
          } else {
            this.memoryStorage = {};
            this.storage = memoryLocalStorageAdapter(this.memoryStorage);
          }
        }
        if (settings.userStorage) {
          this.userStorage = settings.userStorage;
        }
      } else {
        this.memoryStorage = {};
        this.storage = memoryLocalStorageAdapter(this.memoryStorage);
      }
      if (isBrowser() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
        try {
          this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
        } catch (e2) {
          console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", e2);
        }
        (_c = this.broadcastChannel) === null || _c === void 0 ? void 0 : _c.addEventListener("message", async (event) => {
          this._debug("received broadcast notification from other tab or client", event);
          await this._notifyAllSubscribers(event.data.event, event.data.session, false);
        });
      }
      this.initialize();
    }
    /**
     * Returns whether error throwing mode is enabled for this client.
     */
    isThrowOnErrorEnabled() {
      return this.throwOnError;
    }
    /**
     * Centralizes return handling with optional error throwing. When `throwOnError` is enabled
     * and the provided result contains a non-nullish error, the error is thrown instead of
     * being returned. This ensures consistent behavior across all public API methods.
     */
    _returnResult(result) {
      if (this.throwOnError && result && result.error) {
        throw result.error;
      }
      return result;
    }
    _logPrefix() {
      return `GoTrueClient@${this.storageKey}:${this.instanceID} (${version3}) ${(/* @__PURE__ */ new Date()).toISOString()}`;
    }
    _debug(...args) {
      if (this.logDebugMessages) {
        this.logger(this._logPrefix(), ...args);
      }
      return this;
    }
    /**
     * Initializes the client session either from the url or from storage.
     * This method is automatically called when instantiating the client, but should also be called
     * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
     */
    async initialize() {
      if (this.initializePromise) {
        return await this.initializePromise;
      }
      this.initializePromise = (async () => {
        return await this._acquireLock(-1, async () => {
          return await this._initialize();
        });
      })();
      return await this.initializePromise;
    }
    /**
     * IMPORTANT:
     * 1. Never throw in this method, as it is called from the constructor
     * 2. Never return a session from this method as it would be cached over
     *    the whole lifetime of the client
     */
    async _initialize() {
      var _a;
      try {
        let params = {};
        let callbackUrlType = "none";
        if (isBrowser()) {
          params = parseParametersFromURL(window.location.href);
          if (this._isImplicitGrantCallback(params)) {
            callbackUrlType = "implicit";
          } else if (await this._isPKCECallback(params)) {
            callbackUrlType = "pkce";
          }
        }
        if (isBrowser() && this.detectSessionInUrl && callbackUrlType !== "none") {
          const { data, error } = await this._getSessionFromURL(params, callbackUrlType);
          if (error) {
            this._debug("#_initialize()", "error detecting session from URL", error);
            if (isAuthImplicitGrantRedirectError(error)) {
              const errorCode = (_a = error.details) === null || _a === void 0 ? void 0 : _a.code;
              if (errorCode === "identity_already_exists" || errorCode === "identity_not_found" || errorCode === "single_identity_not_deletable") {
                return { error };
              }
            }
            await this._removeSession();
            return { error };
          }
          const { session, redirectType } = data;
          this._debug("#_initialize()", "detected session in URL", session, "redirect type", redirectType);
          await this._saveSession(session);
          setTimeout(async () => {
            if (redirectType === "recovery") {
              await this._notifyAllSubscribers("PASSWORD_RECOVERY", session);
            } else {
              await this._notifyAllSubscribers("SIGNED_IN", session);
            }
          }, 0);
          return { error: null };
        }
        await this._recoverAndRefresh();
        return { error: null };
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ error });
        }
        return this._returnResult({
          error: new AuthUnknownError("Unexpected error during initialization", error)
        });
      } finally {
        await this._handleVisibilityChange();
        this._debug("#_initialize()", "end");
      }
    }
    /**
     * Creates a new anonymous user.
     *
     * @returns A session where the is_anonymous claim in the access token JWT set to true
     */
    async signInAnonymously(credentials) {
      var _a, _b, _c;
      try {
        const res = await _request(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          body: {
            data: (_b = (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : {},
            gotrue_meta_security: { captcha_token: (_c = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _c === void 0 ? void 0 : _c.captchaToken }
          },
          xform: _sessionResponse
        });
        const { data, error } = res;
        if (error || !data) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        const session = data.session;
        const user = data.user;
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("SIGNED_IN", session);
        }
        return this._returnResult({ data: { user, session }, error: null });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Creates a new user.
     *
     * Be aware that if a user account exists in the system you may get back an
     * error message that attempts to hide this information from the user.
     * This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.
     *
     * @returns A logged-in session if the server has "autoconfirm" ON
     * @returns A user if the server has "autoconfirm" OFF
     */
    async signUp(credentials) {
      var _a, _b, _c;
      try {
        let res;
        if ("email" in credentials) {
          const { email, password, options } = credentials;
          let codeChallenge = null;
          let codeChallengeMethod = null;
          if (this.flowType === "pkce") {
            ;
            [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
          }
          res = await _request(this.fetch, "POST", `${this.url}/signup`, {
            headers: this.headers,
            redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
            body: {
              email,
              password,
              data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
              code_challenge: codeChallenge,
              code_challenge_method: codeChallengeMethod
            },
            xform: _sessionResponse
          });
        } else if ("phone" in credentials) {
          const { phone, password, options } = credentials;
          res = await _request(this.fetch, "POST", `${this.url}/signup`, {
            headers: this.headers,
            body: {
              phone,
              password,
              data: (_b = options === null || options === void 0 ? void 0 : options.data) !== null && _b !== void 0 ? _b : {},
              channel: (_c = options === null || options === void 0 ? void 0 : options.channel) !== null && _c !== void 0 ? _c : "sms",
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            xform: _sessionResponse
          });
        } else {
          throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
        }
        const { data, error } = res;
        if (error || !data) {
          await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        const session = data.session;
        const user = data.user;
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("SIGNED_IN", session);
        }
        return this._returnResult({ data: { user, session }, error: null });
      } catch (error) {
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Log in an existing user with an email and password or phone and password.
     *
     * Be aware that you may get back an error message that will not distinguish
     * between the cases where the account does not exist or that the
     * email/phone and password combination is wrong or that the account can only
     * be accessed via social login.
     */
    async signInWithPassword(credentials) {
      try {
        let res;
        if ("email" in credentials) {
          const { email, password, options } = credentials;
          res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
            headers: this.headers,
            body: {
              email,
              password,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            xform: _sessionResponsePassword
          });
        } else if ("phone" in credentials) {
          const { phone, password, options } = credentials;
          res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
            headers: this.headers,
            body: {
              phone,
              password,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            xform: _sessionResponsePassword
          });
        } else {
          throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
        }
        const { data, error } = res;
        if (error) {
          return this._returnResult({ data: { user: null, session: null }, error });
        } else if (!data || !data.session || !data.user) {
          const invalidTokenError = new AuthInvalidTokenResponseError();
          return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
        }
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("SIGNED_IN", data.session);
        }
        return this._returnResult({
          data: Object.assign({ user: data.user, session: data.session }, data.weak_password ? { weakPassword: data.weak_password } : null),
          error
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Log in an existing user via a third-party provider.
     * This method supports the PKCE flow.
     */
    async signInWithOAuth(credentials) {
      var _a, _b, _c, _d;
      return await this._handleProviderSignIn(credentials.provider, {
        redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
        scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
        queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
        skipBrowserRedirect: (_d = credentials.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect
      });
    }
    /**
     * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
     */
    async exchangeCodeForSession(authCode) {
      await this.initializePromise;
      return this._acquireLock(-1, async () => {
        return this._exchangeCodeForSession(authCode);
      });
    }
    /**
     * Signs in a user by verifying a message signed by the user's private key.
     * Supports Ethereum (via Sign-In-With-Ethereum) & Solana (Sign-In-With-Solana) standards,
     * both of which derive from the EIP-4361 standard
     * With slight variation on Solana's side.
     * @reference https://eips.ethereum.org/EIPS/eip-4361
     */
    async signInWithWeb3(credentials) {
      const { chain } = credentials;
      switch (chain) {
        case "ethereum":
          return await this.signInWithEthereum(credentials);
        case "solana":
          return await this.signInWithSolana(credentials);
        default:
          throw new Error(`@supabase/auth-js: Unsupported chain "${chain}"`);
      }
    }
    async signInWithEthereum(credentials) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
      let message;
      let signature;
      if ("message" in credentials) {
        message = credentials.message;
        signature = credentials.signature;
      } else {
        const { chain, wallet, statement, options } = credentials;
        let resolvedWallet;
        if (!isBrowser()) {
          if (typeof wallet !== "object" || !(options === null || options === void 0 ? void 0 : options.url)) {
            throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
          }
          resolvedWallet = wallet;
        } else if (typeof wallet === "object") {
          resolvedWallet = wallet;
        } else {
          const windowAny = window;
          if ("ethereum" in windowAny && typeof windowAny.ethereum === "object" && "request" in windowAny.ethereum && typeof windowAny.ethereum.request === "function") {
            resolvedWallet = windowAny.ethereum;
          } else {
            throw new Error(`@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.`);
          }
        }
        const url = new URL((_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : window.location.href);
        const accounts = await resolvedWallet.request({
          method: "eth_requestAccounts"
        }).then((accs) => accs).catch(() => {
          throw new Error(`@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid`);
        });
        if (!accounts || accounts.length === 0) {
          throw new Error(`@supabase/auth-js: No accounts available. Please ensure the wallet is connected.`);
        }
        const address = getAddress(accounts[0]);
        let chainId = (_b = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _b === void 0 ? void 0 : _b.chainId;
        if (!chainId) {
          const chainIdHex = await resolvedWallet.request({
            method: "eth_chainId"
          });
          chainId = fromHex(chainIdHex);
        }
        const siweMessage = {
          domain: url.host,
          address,
          statement,
          uri: url.href,
          version: "1",
          chainId,
          nonce: (_c = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _c === void 0 ? void 0 : _c.nonce,
          issuedAt: (_e = (_d = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _d === void 0 ? void 0 : _d.issuedAt) !== null && _e !== void 0 ? _e : /* @__PURE__ */ new Date(),
          expirationTime: (_f = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _f === void 0 ? void 0 : _f.expirationTime,
          notBefore: (_g = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _g === void 0 ? void 0 : _g.notBefore,
          requestId: (_h = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _h === void 0 ? void 0 : _h.requestId,
          resources: (_j = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _j === void 0 ? void 0 : _j.resources
        };
        message = createSiweMessage(siweMessage);
        signature = await resolvedWallet.request({
          method: "personal_sign",
          params: [toHex(message), address]
        });
      }
      try {
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
          headers: this.headers,
          body: Object.assign({
            chain: "ethereum",
            message,
            signature
          }, ((_k = credentials.options) === null || _k === void 0 ? void 0 : _k.captchaToken) ? { gotrue_meta_security: { captcha_token: (_l = credentials.options) === null || _l === void 0 ? void 0 : _l.captchaToken } } : null),
          xform: _sessionResponse
        });
        if (error) {
          throw error;
        }
        if (!data || !data.session || !data.user) {
          const invalidTokenError = new AuthInvalidTokenResponseError();
          return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
        }
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("SIGNED_IN", data.session);
        }
        return this._returnResult({ data: Object.assign({}, data), error });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    async signInWithSolana(credentials) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
      let message;
      let signature;
      if ("message" in credentials) {
        message = credentials.message;
        signature = credentials.signature;
      } else {
        const { chain, wallet, statement, options } = credentials;
        let resolvedWallet;
        if (!isBrowser()) {
          if (typeof wallet !== "object" || !(options === null || options === void 0 ? void 0 : options.url)) {
            throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
          }
          resolvedWallet = wallet;
        } else if (typeof wallet === "object") {
          resolvedWallet = wallet;
        } else {
          const windowAny = window;
          if ("solana" in windowAny && typeof windowAny.solana === "object" && ("signIn" in windowAny.solana && typeof windowAny.solana.signIn === "function" || "signMessage" in windowAny.solana && typeof windowAny.solana.signMessage === "function")) {
            resolvedWallet = windowAny.solana;
          } else {
            throw new Error(`@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.`);
          }
        }
        const url = new URL((_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : window.location.href);
        if ("signIn" in resolvedWallet && resolvedWallet.signIn) {
          const output = await resolvedWallet.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, options === null || options === void 0 ? void 0 : options.signInWithSolana), {
            // non-overridable properties
            version: "1",
            domain: url.host,
            uri: url.href
          }), statement ? { statement } : null));
          let outputToProcess;
          if (Array.isArray(output) && output[0] && typeof output[0] === "object") {
            outputToProcess = output[0];
          } else if (output && typeof output === "object" && "signedMessage" in output && "signature" in output) {
            outputToProcess = output;
          } else {
            throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
          }
          if ("signedMessage" in outputToProcess && "signature" in outputToProcess && (typeof outputToProcess.signedMessage === "string" || outputToProcess.signedMessage instanceof Uint8Array) && outputToProcess.signature instanceof Uint8Array) {
            message = typeof outputToProcess.signedMessage === "string" ? outputToProcess.signedMessage : new TextDecoder().decode(outputToProcess.signedMessage);
            signature = outputToProcess.signature;
          } else {
            throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
          }
        } else {
          if (!("signMessage" in resolvedWallet) || typeof resolvedWallet.signMessage !== "function" || !("publicKey" in resolvedWallet) || typeof resolvedWallet !== "object" || !resolvedWallet.publicKey || !("toBase58" in resolvedWallet.publicKey) || typeof resolvedWallet.publicKey.toBase58 !== "function") {
            throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
          }
          message = [
            `${url.host} wants you to sign in with your Solana account:`,
            resolvedWallet.publicKey.toBase58(),
            ...statement ? ["", statement, ""] : [""],
            "Version: 1",
            `URI: ${url.href}`,
            `Issued At: ${(_c = (_b = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _b === void 0 ? void 0 : _b.issuedAt) !== null && _c !== void 0 ? _c : (/* @__PURE__ */ new Date()).toISOString()}`,
            ...((_d = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _d === void 0 ? void 0 : _d.notBefore) ? [`Not Before: ${options.signInWithSolana.notBefore}`] : [],
            ...((_e = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _e === void 0 ? void 0 : _e.expirationTime) ? [`Expiration Time: ${options.signInWithSolana.expirationTime}`] : [],
            ...((_f = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _f === void 0 ? void 0 : _f.chainId) ? [`Chain ID: ${options.signInWithSolana.chainId}`] : [],
            ...((_g = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _g === void 0 ? void 0 : _g.nonce) ? [`Nonce: ${options.signInWithSolana.nonce}`] : [],
            ...((_h = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _h === void 0 ? void 0 : _h.requestId) ? [`Request ID: ${options.signInWithSolana.requestId}`] : [],
            ...((_k = (_j = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _j === void 0 ? void 0 : _j.resources) === null || _k === void 0 ? void 0 : _k.length) ? [
              "Resources",
              ...options.signInWithSolana.resources.map((resource) => `- ${resource}`)
            ] : []
          ].join("\n");
          const maybeSignature = await resolvedWallet.signMessage(new TextEncoder().encode(message), "utf8");
          if (!maybeSignature || !(maybeSignature instanceof Uint8Array)) {
            throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
          }
          signature = maybeSignature;
        }
      }
      try {
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
          headers: this.headers,
          body: Object.assign({ chain: "solana", message, signature: bytesToBase64URL(signature) }, ((_l = credentials.options) === null || _l === void 0 ? void 0 : _l.captchaToken) ? { gotrue_meta_security: { captcha_token: (_m = credentials.options) === null || _m === void 0 ? void 0 : _m.captchaToken } } : null),
          xform: _sessionResponse
        });
        if (error) {
          throw error;
        }
        if (!data || !data.session || !data.user) {
          const invalidTokenError = new AuthInvalidTokenResponseError();
          return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
        }
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("SIGNED_IN", data.session);
        }
        return this._returnResult({ data: Object.assign({}, data), error });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    async _exchangeCodeForSession(authCode) {
      const storageItem = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
      const [codeVerifier, redirectType] = (storageItem !== null && storageItem !== void 0 ? storageItem : "").split("/");
      try {
        if (!codeVerifier && this.flowType === "pkce") {
          throw new AuthPKCECodeVerifierMissingError();
        }
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
          headers: this.headers,
          body: {
            auth_code: authCode,
            code_verifier: codeVerifier
          },
          xform: _sessionResponse
        });
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (error) {
          throw error;
        }
        if (!data || !data.session || !data.user) {
          const invalidTokenError = new AuthInvalidTokenResponseError();
          return this._returnResult({
            data: { user: null, session: null, redirectType: null },
            error: invalidTokenError
          });
        }
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("SIGNED_IN", data.session);
        }
        return this._returnResult({ data: Object.assign(Object.assign({}, data), { redirectType: redirectType !== null && redirectType !== void 0 ? redirectType : null }), error });
      } catch (error) {
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (isAuthError(error)) {
          return this._returnResult({
            data: { user: null, session: null, redirectType: null },
            error
          });
        }
        throw error;
      }
    }
    /**
     * Allows signing in with an OIDC ID token. The authentication provider used
     * should be enabled and configured.
     */
    async signInWithIdToken(credentials) {
      try {
        const { options, provider, token, access_token, nonce } = credentials;
        const res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
          headers: this.headers,
          body: {
            provider,
            id_token: token,
            access_token,
            nonce,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponse
        });
        const { data, error } = res;
        if (error) {
          return this._returnResult({ data: { user: null, session: null }, error });
        } else if (!data || !data.session || !data.user) {
          const invalidTokenError = new AuthInvalidTokenResponseError();
          return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
        }
        if (data.session) {
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("SIGNED_IN", data.session);
        }
        return this._returnResult({ data, error });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Log in a user using magiclink or a one-time password (OTP).
     *
     * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
     * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
     * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
     *
     * Be aware that you may get back an error message that will not distinguish
     * between the cases where the account does not exist or, that the account
     * can only be accessed via social login.
     *
     * Do note that you will need to configure a Whatsapp sender on Twilio
     * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
     * channel is not supported on other providers
     * at this time.
     * This method supports PKCE when an email is passed.
     */
    async signInWithOtp(credentials) {
      var _a, _b, _c, _d, _e;
      try {
        if ("email" in credentials) {
          const { email, options } = credentials;
          let codeChallenge = null;
          let codeChallengeMethod = null;
          if (this.flowType === "pkce") {
            ;
            [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
          }
          const { error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
            headers: this.headers,
            body: {
              email,
              data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
              create_user: (_b = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _b !== void 0 ? _b : true,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
              code_challenge: codeChallenge,
              code_challenge_method: codeChallengeMethod
            },
            redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
          });
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        if ("phone" in credentials) {
          const { phone, options } = credentials;
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
            headers: this.headers,
            body: {
              phone,
              data: (_c = options === null || options === void 0 ? void 0 : options.data) !== null && _c !== void 0 ? _c : {},
              create_user: (_d = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _d !== void 0 ? _d : true,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
              channel: (_e = options === null || options === void 0 ? void 0 : options.channel) !== null && _e !== void 0 ? _e : "sms"
            }
          });
          return this._returnResult({
            data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id },
            error
          });
        }
        throw new AuthInvalidCredentialsError("You must provide either an email or phone number.");
      } catch (error) {
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Log in a user given a User supplied OTP or TokenHash received through mobile or email.
     */
    async verifyOtp(params) {
      var _a, _b;
      try {
        let redirectTo = void 0;
        let captchaToken = void 0;
        if ("options" in params) {
          redirectTo = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo;
          captchaToken = (_b = params.options) === null || _b === void 0 ? void 0 : _b.captchaToken;
        }
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/verify`, {
          headers: this.headers,
          body: Object.assign(Object.assign({}, params), { gotrue_meta_security: { captcha_token: captchaToken } }),
          redirectTo,
          xform: _sessionResponse
        });
        if (error) {
          throw error;
        }
        if (!data) {
          const tokenVerificationError = new Error("An error occurred on token verification.");
          throw tokenVerificationError;
        }
        const session = data.session;
        const user = data.user;
        if (session === null || session === void 0 ? void 0 : session.access_token) {
          await this._saveSession(session);
          await this._notifyAllSubscribers(params.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", session);
        }
        return this._returnResult({ data: { user, session }, error: null });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Attempts a single-sign on using an enterprise Identity Provider. A
     * successful SSO attempt will redirect the current page to the identity
     * provider authorization page. The redirect URL is implementation and SSO
     * protocol specific.
     *
     * You can use it by providing a SSO domain. Typically you can extract this
     * domain by asking users for their email address. If this domain is
     * registered on the Auth instance the redirect will use that organization's
     * currently active SSO Identity Provider for the login.
     *
     * If you have built an organization-specific login page, you can use the
     * organization's SSO Identity Provider UUID directly instead.
     */
    async signInWithSSO(params) {
      var _a, _b, _c, _d, _e;
      try {
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          ;
          [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
        }
        const result = await _request(this.fetch, "POST", `${this.url}/sso`, {
          body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in params ? { provider_id: params.providerId } : null), "domain" in params ? { domain: params.domain } : null), { redirect_to: (_b = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo) !== null && _b !== void 0 ? _b : void 0 }), ((_c = params === null || params === void 0 ? void 0 : params.options) === null || _c === void 0 ? void 0 : _c.captchaToken) ? { gotrue_meta_security: { captcha_token: params.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
          headers: this.headers,
          xform: _ssoResponse
        });
        if (((_d = result.data) === null || _d === void 0 ? void 0 : _d.url) && isBrowser() && !((_e = params.options) === null || _e === void 0 ? void 0 : _e.skipBrowserRedirect)) {
          window.location.assign(result.data.url);
        }
        return this._returnResult(result);
      } catch (error) {
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Sends a reauthentication OTP to the user's email or phone number.
     * Requires the user to be signed-in.
     */
    async reauthenticate() {
      await this.initializePromise;
      return await this._acquireLock(-1, async () => {
        return await this._reauthenticate();
      });
    }
    async _reauthenticate() {
      try {
        return await this._useSession(async (result) => {
          const { data: { session }, error: sessionError } = result;
          if (sessionError)
            throw sessionError;
          if (!session)
            throw new AuthSessionMissingError();
          const { error } = await _request(this.fetch, "GET", `${this.url}/reauthenticate`, {
            headers: this.headers,
            jwt: session.access_token
          });
          return this._returnResult({ data: { user: null, session: null }, error });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
     */
    async resend(credentials) {
      try {
        const endpoint = `${this.url}/resend`;
        if ("email" in credentials) {
          const { email, type, options } = credentials;
          const { error } = await _request(this.fetch, "POST", endpoint, {
            headers: this.headers,
            body: {
              email,
              type,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
          });
          return this._returnResult({ data: { user: null, session: null }, error });
        } else if ("phone" in credentials) {
          const { phone, type, options } = credentials;
          const { data, error } = await _request(this.fetch, "POST", endpoint, {
            headers: this.headers,
            body: {
              phone,
              type,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            }
          });
          return this._returnResult({
            data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id },
            error
          });
        }
        throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a type");
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Returns the session, refreshing it if necessary.
     *
     * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
     *
     * **IMPORTANT:** This method loads values directly from the storage attached
     * to the client. If that storage is based on request cookies for example,
     * the values in it may not be authentic and therefore it's strongly advised
     * against using this method and its results in such circumstances. A warning
     * will be emitted if this is detected. Use {@link #getUser()} instead.
     */
    async getSession() {
      await this.initializePromise;
      const result = await this._acquireLock(-1, async () => {
        return this._useSession(async (result2) => {
          return result2;
        });
      });
      return result;
    }
    /**
     * Acquires a global lock based on the storage key.
     */
    async _acquireLock(acquireTimeout, fn) {
      this._debug("#_acquireLock", "begin", acquireTimeout);
      try {
        if (this.lockAcquired) {
          const last = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve();
          const result = (async () => {
            await last;
            return await fn();
          })();
          this.pendingInLock.push((async () => {
            try {
              await result;
            } catch (e2) {
            }
          })());
          return result;
        }
        return await this.lock(`lock:${this.storageKey}`, acquireTimeout, async () => {
          this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
          try {
            this.lockAcquired = true;
            const result = fn();
            this.pendingInLock.push((async () => {
              try {
                await result;
              } catch (e2) {
              }
            })());
            await result;
            while (this.pendingInLock.length) {
              const waitOn = [...this.pendingInLock];
              await Promise.all(waitOn);
              this.pendingInLock.splice(0, waitOn.length);
            }
            return await result;
          } finally {
            this._debug("#_acquireLock", "lock released for storage key", this.storageKey);
            this.lockAcquired = false;
          }
        });
      } finally {
        this._debug("#_acquireLock", "end");
      }
    }
    /**
     * Use instead of {@link #getSession} inside the library. It is
     * semantically usually what you want, as getting a session involves some
     * processing afterwards that requires only one client operating on the
     * session at once across multiple tabs or processes.
     */
    async _useSession(fn) {
      this._debug("#_useSession", "begin");
      try {
        const result = await this.__loadSession();
        return await fn(result);
      } finally {
        this._debug("#_useSession", "end");
      }
    }
    /**
     * NEVER USE DIRECTLY!
     *
     * Always use {@link #_useSession}.
     */
    async __loadSession() {
      this._debug("#__loadSession()", "begin");
      if (!this.lockAcquired) {
        this._debug("#__loadSession()", "used outside of an acquired lock!", new Error().stack);
      }
      try {
        let currentSession = null;
        const maybeSession = await getItemAsync(this.storage, this.storageKey);
        this._debug("#getSession()", "session from storage", maybeSession);
        if (maybeSession !== null) {
          if (this._isValidSession(maybeSession)) {
            currentSession = maybeSession;
          } else {
            this._debug("#getSession()", "session from storage is not valid");
            await this._removeSession();
          }
        }
        if (!currentSession) {
          return { data: { session: null }, error: null };
        }
        const hasExpired = currentSession.expires_at ? currentSession.expires_at * 1e3 - Date.now() < EXPIRY_MARGIN_MS : false;
        this._debug("#__loadSession()", `session has${hasExpired ? "" : " not"} expired`, "expires_at", currentSession.expires_at);
        if (!hasExpired) {
          if (this.userStorage) {
            const maybeUser = await getItemAsync(this.userStorage, this.storageKey + "-user");
            if (maybeUser === null || maybeUser === void 0 ? void 0 : maybeUser.user) {
              currentSession.user = maybeUser.user;
            } else {
              currentSession.user = userNotAvailableProxy();
            }
          }
          if (this.storage.isServer && currentSession.user && !currentSession.user.__isUserNotAvailableProxy) {
            const suppressWarningRef = { value: this.suppressGetSessionWarning };
            currentSession.user = insecureUserWarningProxy(currentSession.user, suppressWarningRef);
            if (suppressWarningRef.value) {
              this.suppressGetSessionWarning = true;
            }
          }
          return { data: { session: currentSession }, error: null };
        }
        const { data: session, error } = await this._callRefreshToken(currentSession.refresh_token);
        if (error) {
          return this._returnResult({ data: { session: null }, error });
        }
        return this._returnResult({ data: { session }, error: null });
      } finally {
        this._debug("#__loadSession()", "end");
      }
    }
    /**
     * Gets the current user details if there is an existing session. This method
     * performs a network request to the Supabase Auth server, so the returned
     * value is authentic and can be used to base authorization rules on.
     *
     * @param jwt Takes in an optional access token JWT. If no JWT is provided, the JWT from the current session is used.
     */
    async getUser(jwt) {
      if (jwt) {
        return await this._getUser(jwt);
      }
      await this.initializePromise;
      const result = await this._acquireLock(-1, async () => {
        return await this._getUser();
      });
      if (result.data.user) {
        this.suppressGetSessionWarning = true;
      }
      return result;
    }
    async _getUser(jwt) {
      try {
        if (jwt) {
          return await _request(this.fetch, "GET", `${this.url}/user`, {
            headers: this.headers,
            jwt,
            xform: _userResponse
          });
        }
        return await this._useSession(async (result) => {
          var _a, _b, _c;
          const { data, error } = result;
          if (error) {
            throw error;
          }
          if (!((_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) && !this.hasCustomAuthorizationHeader) {
            return { data: { user: null }, error: new AuthSessionMissingError() };
          }
          return await _request(this.fetch, "GET", `${this.url}/user`, {
            headers: this.headers,
            jwt: (_c = (_b = data.session) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : void 0,
            xform: _userResponse
          });
        });
      } catch (error) {
        if (isAuthError(error)) {
          if (isAuthSessionMissingError(error)) {
            await this._removeSession();
            await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
          }
          return this._returnResult({ data: { user: null }, error });
        }
        throw error;
      }
    }
    /**
     * Updates user data for a logged in user.
     */
    async updateUser(attributes, options = {}) {
      await this.initializePromise;
      return await this._acquireLock(-1, async () => {
        return await this._updateUser(attributes, options);
      });
    }
    async _updateUser(attributes, options = {}) {
      try {
        return await this._useSession(async (result) => {
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            throw sessionError;
          }
          if (!sessionData.session) {
            throw new AuthSessionMissingError();
          }
          const session = sessionData.session;
          let codeChallenge = null;
          let codeChallengeMethod = null;
          if (this.flowType === "pkce" && attributes.email != null) {
            ;
            [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
          }
          const { data, error: userError } = await _request(this.fetch, "PUT", `${this.url}/user`, {
            headers: this.headers,
            redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
            body: Object.assign(Object.assign({}, attributes), { code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
            jwt: session.access_token,
            xform: _userResponse
          });
          if (userError) {
            throw userError;
          }
          session.user = data.user;
          await this._saveSession(session);
          await this._notifyAllSubscribers("USER_UPDATED", session);
          return this._returnResult({ data: { user: session.user }, error: null });
        });
      } catch (error) {
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null }, error });
        }
        throw error;
      }
    }
    /**
     * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
     * If the refresh token or access token in the current session is invalid, an error will be thrown.
     * @param currentSession The current session that minimally contains an access token and refresh token.
     */
    async setSession(currentSession) {
      await this.initializePromise;
      return await this._acquireLock(-1, async () => {
        return await this._setSession(currentSession);
      });
    }
    async _setSession(currentSession) {
      try {
        if (!currentSession.access_token || !currentSession.refresh_token) {
          throw new AuthSessionMissingError();
        }
        const timeNow = Date.now() / 1e3;
        let expiresAt2 = timeNow;
        let hasExpired = true;
        let session = null;
        const { payload } = decodeJWT(currentSession.access_token);
        if (payload.exp) {
          expiresAt2 = payload.exp;
          hasExpired = expiresAt2 <= timeNow;
        }
        if (hasExpired) {
          const { data: refreshedSession, error } = await this._callRefreshToken(currentSession.refresh_token);
          if (error) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          if (!refreshedSession) {
            return { data: { user: null, session: null }, error: null };
          }
          session = refreshedSession;
        } else {
          const { data, error } = await this._getUser(currentSession.access_token);
          if (error) {
            throw error;
          }
          session = {
            access_token: currentSession.access_token,
            refresh_token: currentSession.refresh_token,
            user: data.user,
            token_type: "bearer",
            expires_in: expiresAt2 - timeNow,
            expires_at: expiresAt2
          };
          await this._saveSession(session);
          await this._notifyAllSubscribers("SIGNED_IN", session);
        }
        return this._returnResult({ data: { user: session.user, session }, error: null });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { session: null, user: null }, error });
        }
        throw error;
      }
    }
    /**
     * Returns a new session, regardless of expiry status.
     * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
     * If the current session's refresh token is invalid, an error will be thrown.
     * @param currentSession The current session. If passed in, it must contain a refresh token.
     */
    async refreshSession(currentSession) {
      await this.initializePromise;
      return await this._acquireLock(-1, async () => {
        return await this._refreshSession(currentSession);
      });
    }
    async _refreshSession(currentSession) {
      try {
        return await this._useSession(async (result) => {
          var _a;
          if (!currentSession) {
            const { data, error: error2 } = result;
            if (error2) {
              throw error2;
            }
            currentSession = (_a = data.session) !== null && _a !== void 0 ? _a : void 0;
          }
          if (!(currentSession === null || currentSession === void 0 ? void 0 : currentSession.refresh_token)) {
            throw new AuthSessionMissingError();
          }
          const { data: session, error } = await this._callRefreshToken(currentSession.refresh_token);
          if (error) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          if (!session) {
            return this._returnResult({ data: { user: null, session: null }, error: null });
          }
          return this._returnResult({ data: { user: session.user, session }, error: null });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { user: null, session: null }, error });
        }
        throw error;
      }
    }
    /**
     * Gets the session data from a URL string
     */
    async _getSessionFromURL(params, callbackUrlType) {
      try {
        if (!isBrowser())
          throw new AuthImplicitGrantRedirectError("No browser detected.");
        if (params.error || params.error_description || params.error_code) {
          throw new AuthImplicitGrantRedirectError(params.error_description || "Error in URL with unspecified error_description", {
            error: params.error || "unspecified_error",
            code: params.error_code || "unspecified_code"
          });
        }
        switch (callbackUrlType) {
          case "implicit":
            if (this.flowType === "pkce") {
              throw new AuthPKCEGrantCodeExchangeError("Not a valid PKCE flow url.");
            }
            break;
          case "pkce":
            if (this.flowType === "implicit") {
              throw new AuthImplicitGrantRedirectError("Not a valid implicit grant flow url.");
            }
            break;
          default:
        }
        if (callbackUrlType === "pkce") {
          this._debug("#_initialize()", "begin", "is PKCE flow", true);
          if (!params.code)
            throw new AuthPKCEGrantCodeExchangeError("No code detected.");
          const { data: data2, error: error2 } = await this._exchangeCodeForSession(params.code);
          if (error2)
            throw error2;
          const url = new URL(window.location.href);
          url.searchParams.delete("code");
          window.history.replaceState(window.history.state, "", url.toString());
          return { data: { session: data2.session, redirectType: null }, error: null };
        }
        const { provider_token, provider_refresh_token, access_token, refresh_token, expires_in, expires_at, token_type } = params;
        if (!access_token || !expires_in || !refresh_token || !token_type) {
          throw new AuthImplicitGrantRedirectError("No session defined in URL");
        }
        const timeNow = Math.round(Date.now() / 1e3);
        const expiresIn = parseInt(expires_in);
        let expiresAt2 = timeNow + expiresIn;
        if (expires_at) {
          expiresAt2 = parseInt(expires_at);
        }
        const actuallyExpiresIn = expiresAt2 - timeNow;
        if (actuallyExpiresIn * 1e3 <= AUTO_REFRESH_TICK_DURATION_MS) {
          console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${actuallyExpiresIn}s, should have been closer to ${expiresIn}s`);
        }
        const issuedAt = expiresAt2 - expiresIn;
        if (timeNow - issuedAt >= 120) {
          console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", issuedAt, expiresAt2, timeNow);
        } else if (timeNow - issuedAt < 0) {
          console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew", issuedAt, expiresAt2, timeNow);
        }
        const { data, error } = await this._getUser(access_token);
        if (error)
          throw error;
        const session = {
          provider_token,
          provider_refresh_token,
          access_token,
          expires_in: expiresIn,
          expires_at: expiresAt2,
          refresh_token,
          token_type,
          user: data.user
        };
        window.location.hash = "";
        this._debug("#_getSessionFromURL()", "clearing window.location.hash");
        return this._returnResult({ data: { session, redirectType: params.type }, error: null });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { session: null, redirectType: null }, error });
        }
        throw error;
      }
    }
    /**
     * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
     *
     * If `detectSessionInUrl` is a function, it will be called with the URL and params to determine
     * if the URL should be processed as a Supabase auth callback. This allows users to exclude
     * URLs from other OAuth providers (e.g., Facebook Login) that also return access_token in the fragment.
     */
    _isImplicitGrantCallback(params) {
      if (typeof this.detectSessionInUrl === "function") {
        return this.detectSessionInUrl(new URL(window.location.href), params);
      }
      return Boolean(params.access_token || params.error_description);
    }
    /**
     * Checks if the current URL and backing storage contain parameters given by a PKCE flow
     */
    async _isPKCECallback(params) {
      const currentStorageContent = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
      return !!(params.code && currentStorageContent);
    }
    /**
     * Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
     *
     * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
     * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
     *
     * If using `others` scope, no `SIGNED_OUT` event is fired!
     */
    async signOut(options = { scope: "global" }) {
      await this.initializePromise;
      return await this._acquireLock(-1, async () => {
        return await this._signOut(options);
      });
    }
    async _signOut({ scope } = { scope: "global" }) {
      return await this._useSession(async (result) => {
        var _a;
        const { data, error: sessionError } = result;
        if (sessionError) {
          return this._returnResult({ error: sessionError });
        }
        const accessToken = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token;
        if (accessToken) {
          const { error } = await this.admin.signOut(accessToken, scope);
          if (error) {
            if (!(isAuthApiError(error) && (error.status === 404 || error.status === 401 || error.status === 403))) {
              return this._returnResult({ error });
            }
          }
        }
        if (scope !== "others") {
          await this._removeSession();
          await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        }
        return this._returnResult({ error: null });
      });
    }
    onAuthStateChange(callback) {
      const id = generateCallbackId();
      const subscription = {
        id,
        callback,
        unsubscribe: () => {
          this._debug("#unsubscribe()", "state change callback with id removed", id);
          this.stateChangeEmitters.delete(id);
        }
      };
      this._debug("#onAuthStateChange()", "registered callback with id", id);
      this.stateChangeEmitters.set(id, subscription);
      (async () => {
        await this.initializePromise;
        await this._acquireLock(-1, async () => {
          this._emitInitialSession(id);
        });
      })();
      return { data: { subscription } };
    }
    async _emitInitialSession(id) {
      return await this._useSession(async (result) => {
        var _a, _b;
        try {
          const { data: { session }, error } = result;
          if (error)
            throw error;
          await ((_a = this.stateChangeEmitters.get(id)) === null || _a === void 0 ? void 0 : _a.callback("INITIAL_SESSION", session));
          this._debug("INITIAL_SESSION", "callback id", id, "session", session);
        } catch (err) {
          await ((_b = this.stateChangeEmitters.get(id)) === null || _b === void 0 ? void 0 : _b.callback("INITIAL_SESSION", null));
          this._debug("INITIAL_SESSION", "callback id", id, "error", err);
          console.error(err);
        }
      });
    }
    /**
     * Sends a password reset request to an email address. This method supports the PKCE flow.
     *
     * @param email The email address of the user.
     * @param options.redirectTo The URL to send the user to after they click the password reset link.
     * @param options.captchaToken Verification token received when the user completes the captcha on the site.
     */
    async resetPasswordForEmail(email, options = {}) {
      let codeChallenge = null;
      let codeChallengeMethod = null;
      if (this.flowType === "pkce") {
        ;
        [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(
          this.storage,
          this.storageKey,
          true
          // isPasswordRecovery
        );
      }
      try {
        return await _request(this.fetch, "POST", `${this.url}/recover`, {
          body: {
            email,
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod,
            gotrue_meta_security: { captcha_token: options.captchaToken }
          },
          headers: this.headers,
          redirectTo: options.redirectTo
        });
      } catch (error) {
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Gets all the identities linked to a user.
     */
    async getUserIdentities() {
      var _a;
      try {
        const { data, error } = await this.getUser();
        if (error)
          throw error;
        return this._returnResult({ data: { identities: (_a = data.user.identities) !== null && _a !== void 0 ? _a : [] }, error: null });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    async linkIdentity(credentials) {
      if ("token" in credentials) {
        return this.linkIdentityIdToken(credentials);
      }
      return this.linkIdentityOAuth(credentials);
    }
    async linkIdentityOAuth(credentials) {
      var _a;
      try {
        const { data, error } = await this._useSession(async (result) => {
          var _a2, _b, _c, _d, _e;
          const { data: data2, error: error2 } = result;
          if (error2)
            throw error2;
          const url = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, credentials.provider, {
            redirectTo: (_a2 = credentials.options) === null || _a2 === void 0 ? void 0 : _a2.redirectTo,
            scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
            queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
            skipBrowserRedirect: true
          });
          return await _request(this.fetch, "GET", url, {
            headers: this.headers,
            jwt: (_e = (_d = data2.session) === null || _d === void 0 ? void 0 : _d.access_token) !== null && _e !== void 0 ? _e : void 0
          });
        });
        if (error)
          throw error;
        if (isBrowser() && !((_a = credentials.options) === null || _a === void 0 ? void 0 : _a.skipBrowserRedirect)) {
          window.location.assign(data === null || data === void 0 ? void 0 : data.url);
        }
        return this._returnResult({
          data: { provider: credentials.provider, url: data === null || data === void 0 ? void 0 : data.url },
          error: null
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: { provider: credentials.provider, url: null }, error });
        }
        throw error;
      }
    }
    async linkIdentityIdToken(credentials) {
      return await this._useSession(async (result) => {
        var _a;
        try {
          const { error: sessionError, data: { session } } = result;
          if (sessionError)
            throw sessionError;
          const { options, provider, token, access_token, nonce } = credentials;
          const res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
            headers: this.headers,
            jwt: (_a = session === null || session === void 0 ? void 0 : session.access_token) !== null && _a !== void 0 ? _a : void 0,
            body: {
              provider,
              id_token: token,
              access_token,
              nonce,
              link_identity: true,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            xform: _sessionResponse
          });
          const { data, error } = res;
          if (error) {
            return this._returnResult({ data: { user: null, session: null }, error });
          } else if (!data || !data.session || !data.user) {
            return this._returnResult({
              data: { user: null, session: null },
              error: new AuthInvalidTokenResponseError()
            });
          }
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("USER_UPDATED", data.session);
          }
          return this._returnResult({ data, error });
        } catch (error) {
          await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
          if (isAuthError(error)) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          throw error;
        }
      });
    }
    /**
     * Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
     */
    async unlinkIdentity(identity) {
      try {
        return await this._useSession(async (result) => {
          var _a, _b;
          const { data, error } = result;
          if (error) {
            throw error;
          }
          return await _request(this.fetch, "DELETE", `${this.url}/user/identities/${identity.identity_id}`, {
            headers: this.headers,
            jwt: (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : void 0
          });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Generates a new JWT.
     * @param refreshToken A valid refresh token that was returned on login.
     */
    async _refreshAccessToken(refreshToken) {
      const debugName = `#_refreshAccessToken(${refreshToken.substring(0, 5)}...)`;
      this._debug(debugName, "begin");
      try {
        const startedAt = Date.now();
        return await retryable(async (attempt) => {
          if (attempt > 0) {
            await sleep(200 * Math.pow(2, attempt - 1));
          }
          this._debug(debugName, "refreshing attempt", attempt);
          return await _request(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
            body: { refresh_token: refreshToken },
            headers: this.headers,
            xform: _sessionResponse
          });
        }, (attempt, error) => {
          const nextBackOffInterval = 200 * Math.pow(2, attempt);
          return error && isAuthRetryableFetchError(error) && // retryable only if the request can be sent before the backoff overflows the tick duration
          Date.now() + nextBackOffInterval - startedAt < AUTO_REFRESH_TICK_DURATION_MS;
        });
      } catch (error) {
        this._debug(debugName, "error", error);
        if (isAuthError(error)) {
          return this._returnResult({ data: { session: null, user: null }, error });
        }
        throw error;
      } finally {
        this._debug(debugName, "end");
      }
    }
    _isValidSession(maybeSession) {
      const isValidSession = typeof maybeSession === "object" && maybeSession !== null && "access_token" in maybeSession && "refresh_token" in maybeSession && "expires_at" in maybeSession;
      return isValidSession;
    }
    async _handleProviderSignIn(provider, options) {
      const url = await this._getUrlForProvider(`${this.url}/authorize`, provider, {
        redirectTo: options.redirectTo,
        scopes: options.scopes,
        queryParams: options.queryParams
      });
      this._debug("#_handleProviderSignIn()", "provider", provider, "options", options, "url", url);
      if (isBrowser() && !options.skipBrowserRedirect) {
        window.location.assign(url);
      }
      return { data: { provider, url }, error: null };
    }
    /**
     * Recovers the session from LocalStorage and refreshes the token
     * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
     */
    async _recoverAndRefresh() {
      var _a, _b;
      const debugName = "#_recoverAndRefresh()";
      this._debug(debugName, "begin");
      try {
        const currentSession = await getItemAsync(this.storage, this.storageKey);
        if (currentSession && this.userStorage) {
          let maybeUser = await getItemAsync(this.userStorage, this.storageKey + "-user");
          if (!this.storage.isServer && Object.is(this.storage, this.userStorage) && !maybeUser) {
            maybeUser = { user: currentSession.user };
            await setItemAsync(this.userStorage, this.storageKey + "-user", maybeUser);
          }
          currentSession.user = (_a = maybeUser === null || maybeUser === void 0 ? void 0 : maybeUser.user) !== null && _a !== void 0 ? _a : userNotAvailableProxy();
        } else if (currentSession && !currentSession.user) {
          if (!currentSession.user) {
            const separateUser = await getItemAsync(this.storage, this.storageKey + "-user");
            if (separateUser && (separateUser === null || separateUser === void 0 ? void 0 : separateUser.user)) {
              currentSession.user = separateUser.user;
              await removeItemAsync(this.storage, this.storageKey + "-user");
              await setItemAsync(this.storage, this.storageKey, currentSession);
            } else {
              currentSession.user = userNotAvailableProxy();
            }
          }
        }
        this._debug(debugName, "session from storage", currentSession);
        if (!this._isValidSession(currentSession)) {
          this._debug(debugName, "session is not valid");
          if (currentSession !== null) {
            await this._removeSession();
          }
          return;
        }
        const expiresWithMargin = ((_b = currentSession.expires_at) !== null && _b !== void 0 ? _b : Infinity) * 1e3 - Date.now() < EXPIRY_MARGIN_MS;
        this._debug(debugName, `session has${expiresWithMargin ? "" : " not"} expired with margin of ${EXPIRY_MARGIN_MS}s`);
        if (expiresWithMargin) {
          if (this.autoRefreshToken && currentSession.refresh_token) {
            const { error } = await this._callRefreshToken(currentSession.refresh_token);
            if (error) {
              console.error(error);
              if (!isAuthRetryableFetchError(error)) {
                this._debug(debugName, "refresh failed with a non-retryable error, removing the session", error);
                await this._removeSession();
              }
            }
          }
        } else if (currentSession.user && currentSession.user.__isUserNotAvailableProxy === true) {
          try {
            const { data, error: userError } = await this._getUser(currentSession.access_token);
            if (!userError && (data === null || data === void 0 ? void 0 : data.user)) {
              currentSession.user = data.user;
              await this._saveSession(currentSession);
              await this._notifyAllSubscribers("SIGNED_IN", currentSession);
            } else {
              this._debug(debugName, "could not get user data, skipping SIGNED_IN notification");
            }
          } catch (getUserError) {
            console.error("Error getting user data:", getUserError);
            this._debug(debugName, "error getting user data, skipping SIGNED_IN notification", getUserError);
          }
        } else {
          await this._notifyAllSubscribers("SIGNED_IN", currentSession);
        }
      } catch (err) {
        this._debug(debugName, "error", err);
        console.error(err);
        return;
      } finally {
        this._debug(debugName, "end");
      }
    }
    async _callRefreshToken(refreshToken) {
      var _a, _b;
      if (!refreshToken) {
        throw new AuthSessionMissingError();
      }
      if (this.refreshingDeferred) {
        return this.refreshingDeferred.promise;
      }
      const debugName = `#_callRefreshToken(${refreshToken.substring(0, 5)}...)`;
      this._debug(debugName, "begin");
      try {
        this.refreshingDeferred = new Deferred();
        const { data, error } = await this._refreshAccessToken(refreshToken);
        if (error)
          throw error;
        if (!data.session)
          throw new AuthSessionMissingError();
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("TOKEN_REFRESHED", data.session);
        const result = { data: data.session, error: null };
        this.refreshingDeferred.resolve(result);
        return result;
      } catch (error) {
        this._debug(debugName, "error", error);
        if (isAuthError(error)) {
          const result = { data: null, error };
          if (!isAuthRetryableFetchError(error)) {
            await this._removeSession();
          }
          (_a = this.refreshingDeferred) === null || _a === void 0 ? void 0 : _a.resolve(result);
          return result;
        }
        (_b = this.refreshingDeferred) === null || _b === void 0 ? void 0 : _b.reject(error);
        throw error;
      } finally {
        this.refreshingDeferred = null;
        this._debug(debugName, "end");
      }
    }
    async _notifyAllSubscribers(event, session, broadcast = true) {
      const debugName = `#_notifyAllSubscribers(${event})`;
      this._debug(debugName, "begin", session, `broadcast = ${broadcast}`);
      try {
        if (this.broadcastChannel && broadcast) {
          this.broadcastChannel.postMessage({ event, session });
        }
        const errors = [];
        const promises = Array.from(this.stateChangeEmitters.values()).map(async (x) => {
          try {
            await x.callback(event, session);
          } catch (e2) {
            errors.push(e2);
          }
        });
        await Promise.all(promises);
        if (errors.length > 0) {
          for (let i2 = 0; i2 < errors.length; i2 += 1) {
            console.error(errors[i2]);
          }
          throw errors[0];
        }
      } finally {
        this._debug(debugName, "end");
      }
    }
    /**
     * set currentSession and currentUser
     * process to _startAutoRefreshToken if possible
     */
    async _saveSession(session) {
      this._debug("#_saveSession()", session);
      this.suppressGetSessionWarning = true;
      await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
      const sessionToProcess = Object.assign({}, session);
      const userIsProxy = sessionToProcess.user && sessionToProcess.user.__isUserNotAvailableProxy === true;
      if (this.userStorage) {
        if (!userIsProxy && sessionToProcess.user) {
          await setItemAsync(this.userStorage, this.storageKey + "-user", {
            user: sessionToProcess.user
          });
        } else if (userIsProxy) {
        }
        const mainSessionData = Object.assign({}, sessionToProcess);
        delete mainSessionData.user;
        const clonedMainSessionData = deepClone(mainSessionData);
        await setItemAsync(this.storage, this.storageKey, clonedMainSessionData);
      } else {
        const clonedSession = deepClone(sessionToProcess);
        await setItemAsync(this.storage, this.storageKey, clonedSession);
      }
    }
    async _removeSession() {
      this._debug("#_removeSession()");
      this.suppressGetSessionWarning = false;
      await removeItemAsync(this.storage, this.storageKey);
      await removeItemAsync(this.storage, this.storageKey + "-code-verifier");
      await removeItemAsync(this.storage, this.storageKey + "-user");
      if (this.userStorage) {
        await removeItemAsync(this.userStorage, this.storageKey + "-user");
      }
      await this._notifyAllSubscribers("SIGNED_OUT", null);
    }
    /**
     * Removes any registered visibilitychange callback.
     *
     * {@see #startAutoRefresh}
     * {@see #stopAutoRefresh}
     */
    _removeVisibilityChangedCallback() {
      this._debug("#_removeVisibilityChangedCallback()");
      const callback = this.visibilityChangedCallback;
      this.visibilityChangedCallback = null;
      try {
        if (callback && isBrowser() && (window === null || window === void 0 ? void 0 : window.removeEventListener)) {
          window.removeEventListener("visibilitychange", callback);
        }
      } catch (e2) {
        console.error("removing visibilitychange callback failed", e2);
      }
    }
    /**
     * This is the private implementation of {@link #startAutoRefresh}. Use this
     * within the library.
     */
    async _startAutoRefresh() {
      await this._stopAutoRefresh();
      this._debug("#_startAutoRefresh()");
      const ticker = setInterval(() => this._autoRefreshTokenTick(), AUTO_REFRESH_TICK_DURATION_MS);
      this.autoRefreshTicker = ticker;
      if (ticker && typeof ticker === "object" && typeof ticker.unref === "function") {
        ticker.unref();
      } else if (typeof Deno !== "undefined" && typeof Deno.unrefTimer === "function") {
        Deno.unrefTimer(ticker);
      }
      setTimeout(async () => {
        await this.initializePromise;
        await this._autoRefreshTokenTick();
      }, 0);
    }
    /**
     * This is the private implementation of {@link #stopAutoRefresh}. Use this
     * within the library.
     */
    async _stopAutoRefresh() {
      this._debug("#_stopAutoRefresh()");
      const ticker = this.autoRefreshTicker;
      this.autoRefreshTicker = null;
      if (ticker) {
        clearInterval(ticker);
      }
    }
    /**
     * Starts an auto-refresh process in the background. The session is checked
     * every few seconds. Close to the time of expiration a process is started to
     * refresh the session. If refreshing fails it will be retried for as long as
     * necessary.
     *
     * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
     * to call this function, it will be called for you.
     *
     * On browsers the refresh process works only when the tab/window is in the
     * foreground to conserve resources as well as prevent race conditions and
     * flooding auth with requests. If you call this method any managed
     * visibility change callback will be removed and you must manage visibility
     * changes on your own.
     *
     * On non-browser platforms the refresh process works *continuously* in the
     * background, which may not be desirable. You should hook into your
     * platform's foreground indication mechanism and call these methods
     * appropriately to conserve resources.
     *
     * {@see #stopAutoRefresh}
     */
    async startAutoRefresh() {
      this._removeVisibilityChangedCallback();
      await this._startAutoRefresh();
    }
    /**
     * Stops an active auto refresh process running in the background (if any).
     *
     * If you call this method any managed visibility change callback will be
     * removed and you must manage visibility changes on your own.
     *
     * See {@link #startAutoRefresh} for more details.
     */
    async stopAutoRefresh() {
      this._removeVisibilityChangedCallback();
      await this._stopAutoRefresh();
    }
    /**
     * Runs the auto refresh token tick.
     */
    async _autoRefreshTokenTick() {
      this._debug("#_autoRefreshTokenTick()", "begin");
      try {
        await this._acquireLock(0, async () => {
          try {
            const now = Date.now();
            try {
              return await this._useSession(async (result) => {
                const { data: { session } } = result;
                if (!session || !session.refresh_token || !session.expires_at) {
                  this._debug("#_autoRefreshTokenTick()", "no session");
                  return;
                }
                const expiresInTicks = Math.floor((session.expires_at * 1e3 - now) / AUTO_REFRESH_TICK_DURATION_MS);
                this._debug("#_autoRefreshTokenTick()", `access token expires in ${expiresInTicks} ticks, a tick lasts ${AUTO_REFRESH_TICK_DURATION_MS}ms, refresh threshold is ${AUTO_REFRESH_TICK_THRESHOLD} ticks`);
                if (expiresInTicks <= AUTO_REFRESH_TICK_THRESHOLD) {
                  await this._callRefreshToken(session.refresh_token);
                }
              });
            } catch (e2) {
              console.error("Auto refresh tick failed with error. This is likely a transient error.", e2);
            }
          } finally {
            this._debug("#_autoRefreshTokenTick()", "end");
          }
        });
      } catch (e2) {
        if (e2.isAcquireTimeout || e2 instanceof LockAcquireTimeoutError) {
          this._debug("auto refresh token tick lock not available");
        } else {
          throw e2;
        }
      }
    }
    /**
     * Registers callbacks on the browser / platform, which in-turn run
     * algorithms when the browser window/tab are in foreground. On non-browser
     * platforms it assumes always foreground.
     */
    async _handleVisibilityChange() {
      this._debug("#_handleVisibilityChange()");
      if (!isBrowser() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
        if (this.autoRefreshToken) {
          this.startAutoRefresh();
        }
        return false;
      }
      try {
        this.visibilityChangedCallback = async () => await this._onVisibilityChanged(false);
        window === null || window === void 0 ? void 0 : window.addEventListener("visibilitychange", this.visibilityChangedCallback);
        await this._onVisibilityChanged(true);
      } catch (error) {
        console.error("_handleVisibilityChange", error);
      }
    }
    /**
     * Callback registered with `window.addEventListener('visibilitychange')`.
     */
    async _onVisibilityChanged(calledFromInitialize) {
      const methodName = `#_onVisibilityChanged(${calledFromInitialize})`;
      this._debug(methodName, "visibilityState", document.visibilityState);
      if (document.visibilityState === "visible") {
        if (this.autoRefreshToken) {
          this._startAutoRefresh();
        }
        if (!calledFromInitialize) {
          await this.initializePromise;
          await this._acquireLock(-1, async () => {
            if (document.visibilityState !== "visible") {
              this._debug(methodName, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
              return;
            }
            await this._recoverAndRefresh();
          });
        }
      } else if (document.visibilityState === "hidden") {
        if (this.autoRefreshToken) {
          this._stopAutoRefresh();
        }
      }
    }
    /**
     * Generates the relevant login URL for a third-party provider.
     * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param options.scopes A space-separated list of scopes granted to the OAuth application.
     * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
     */
    async _getUrlForProvider(url, provider, options) {
      const urlParams = [`provider=${encodeURIComponent(provider)}`];
      if (options === null || options === void 0 ? void 0 : options.redirectTo) {
        urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
      }
      if (options === null || options === void 0 ? void 0 : options.scopes) {
        urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
      }
      if (this.flowType === "pkce") {
        const [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
        const flowParams = new URLSearchParams({
          code_challenge: `${encodeURIComponent(codeChallenge)}`,
          code_challenge_method: `${encodeURIComponent(codeChallengeMethod)}`
        });
        urlParams.push(flowParams.toString());
      }
      if (options === null || options === void 0 ? void 0 : options.queryParams) {
        const query = new URLSearchParams(options.queryParams);
        urlParams.push(query.toString());
      }
      if (options === null || options === void 0 ? void 0 : options.skipBrowserRedirect) {
        urlParams.push(`skip_http_redirect=${options.skipBrowserRedirect}`);
      }
      return `${url}?${urlParams.join("&")}`;
    }
    async _unenroll(params) {
      try {
        return await this._useSession(async (result) => {
          var _a;
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          return await _request(this.fetch, "DELETE", `${this.url}/factors/${params.factorId}`, {
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    async _enroll(params) {
      try {
        return await this._useSession(async (result) => {
          var _a, _b;
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          const body = Object.assign({ friendly_name: params.friendlyName, factor_type: params.factorType }, params.factorType === "phone" ? { phone: params.phone } : params.factorType === "totp" ? { issuer: params.issuer } : {});
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors`, {
            body,
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
          if (error) {
            return this._returnResult({ data: null, error });
          }
          if (params.factorType === "totp" && data.type === "totp" && ((_b = data === null || data === void 0 ? void 0 : data.totp) === null || _b === void 0 ? void 0 : _b.qr_code)) {
            data.totp.qr_code = `data:image/svg+xml;utf-8,${data.totp.qr_code}`;
          }
          return this._returnResult({ data, error: null });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    async _verify(params) {
      return this._acquireLock(-1, async () => {
        try {
          return await this._useSession(async (result) => {
            var _a;
            const { data: sessionData, error: sessionError } = result;
            if (sessionError) {
              return this._returnResult({ data: null, error: sessionError });
            }
            const body = Object.assign({ challenge_id: params.challengeId }, "webauthn" in params ? {
              webauthn: Object.assign(Object.assign({}, params.webauthn), { credential_response: params.webauthn.type === "create" ? serializeCredentialCreationResponse(params.webauthn.credential_response) : serializeCredentialRequestResponse(params.webauthn.credential_response) })
            } : { code: params.code });
            const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/verify`, {
              body,
              headers: this.headers,
              jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
            });
            if (error) {
              return this._returnResult({ data: null, error });
            }
            await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + data.expires_in }, data));
            await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", data);
            return this._returnResult({ data, error });
          });
        } catch (error) {
          if (isAuthError(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      });
    }
    async _challenge(params) {
      return this._acquireLock(-1, async () => {
        try {
          return await this._useSession(async (result) => {
            var _a;
            const { data: sessionData, error: sessionError } = result;
            if (sessionError) {
              return this._returnResult({ data: null, error: sessionError });
            }
            const response = await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/challenge`, {
              body: params,
              headers: this.headers,
              jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
            });
            if (response.error) {
              return response;
            }
            const { data } = response;
            if (data.type !== "webauthn") {
              return { data, error: null };
            }
            switch (data.webauthn.type) {
              case "create":
                return {
                  data: Object.assign(Object.assign({}, data), { webauthn: Object.assign(Object.assign({}, data.webauthn), { credential_options: Object.assign(Object.assign({}, data.webauthn.credential_options), { publicKey: deserializeCredentialCreationOptions(data.webauthn.credential_options.publicKey) }) }) }),
                  error: null
                };
              case "request":
                return {
                  data: Object.assign(Object.assign({}, data), { webauthn: Object.assign(Object.assign({}, data.webauthn), { credential_options: Object.assign(Object.assign({}, data.webauthn.credential_options), { publicKey: deserializeCredentialRequestOptions(data.webauthn.credential_options.publicKey) }) }) }),
                  error: null
                };
            }
          });
        } catch (error) {
          if (isAuthError(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      });
    }
    /**
     * {@see GoTrueMFAApi#challengeAndVerify}
     */
    async _challengeAndVerify(params) {
      const { data: challengeData, error: challengeError } = await this._challenge({
        factorId: params.factorId
      });
      if (challengeError) {
        return this._returnResult({ data: null, error: challengeError });
      }
      return await this._verify({
        factorId: params.factorId,
        challengeId: challengeData.id,
        code: params.code
      });
    }
    /**
     * {@see GoTrueMFAApi#listFactors}
     */
    async _listFactors() {
      var _a;
      const { data: { user }, error: userError } = await this.getUser();
      if (userError) {
        return { data: null, error: userError };
      }
      const data = {
        all: [],
        phone: [],
        totp: [],
        webauthn: []
      };
      for (const factor of (_a = user === null || user === void 0 ? void 0 : user.factors) !== null && _a !== void 0 ? _a : []) {
        data.all.push(factor);
        if (factor.status === "verified") {
          ;
          data[factor.factor_type].push(factor);
        }
      }
      return {
        data,
        error: null
      };
    }
    /**
     * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
     */
    async _getAuthenticatorAssuranceLevel() {
      var _a, _b;
      const { data: { session }, error: sessionError } = await this.getSession();
      if (sessionError) {
        return this._returnResult({ data: null, error: sessionError });
      }
      if (!session) {
        return {
          data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
          error: null
        };
      }
      const { payload } = decodeJWT(session.access_token);
      let currentLevel = null;
      if (payload.aal) {
        currentLevel = payload.aal;
      }
      let nextLevel = currentLevel;
      const verifiedFactors = (_b = (_a = session.user.factors) === null || _a === void 0 ? void 0 : _a.filter((factor) => factor.status === "verified")) !== null && _b !== void 0 ? _b : [];
      if (verifiedFactors.length > 0) {
        nextLevel = "aal2";
      }
      const currentAuthenticationMethods = payload.amr || [];
      return { data: { currentLevel, nextLevel, currentAuthenticationMethods }, error: null };
    }
    /**
     * Retrieves details about an OAuth authorization request.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     *
     * Returns authorization details including client info, scopes, and user information.
     * If the API returns a redirect_uri, it means consent was already given - the caller
     * should handle the redirect manually if needed.
     */
    async _getAuthorizationDetails(authorizationId) {
      try {
        return await this._useSession(async (result) => {
          const { data: { session }, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          if (!session) {
            return this._returnResult({ data: null, error: new AuthSessionMissingError() });
          }
          return await _request(this.fetch, "GET", `${this.url}/oauth/authorizations/${authorizationId}`, {
            headers: this.headers,
            jwt: session.access_token,
            xform: (data) => ({ data, error: null })
          });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Approves an OAuth authorization request.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     */
    async _approveAuthorization(authorizationId, options) {
      try {
        return await this._useSession(async (result) => {
          const { data: { session }, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          if (!session) {
            return this._returnResult({ data: null, error: new AuthSessionMissingError() });
          }
          const response = await _request(this.fetch, "POST", `${this.url}/oauth/authorizations/${authorizationId}/consent`, {
            headers: this.headers,
            jwt: session.access_token,
            body: { action: "approve" },
            xform: (data) => ({ data, error: null })
          });
          if (response.data && response.data.redirect_url) {
            if (isBrowser() && !(options === null || options === void 0 ? void 0 : options.skipBrowserRedirect)) {
              window.location.assign(response.data.redirect_url);
            }
          }
          return response;
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Denies an OAuth authorization request.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     */
    async _denyAuthorization(authorizationId, options) {
      try {
        return await this._useSession(async (result) => {
          const { data: { session }, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          if (!session) {
            return this._returnResult({ data: null, error: new AuthSessionMissingError() });
          }
          const response = await _request(this.fetch, "POST", `${this.url}/oauth/authorizations/${authorizationId}/consent`, {
            headers: this.headers,
            jwt: session.access_token,
            body: { action: "deny" },
            xform: (data) => ({ data, error: null })
          });
          if (response.data && response.data.redirect_url) {
            if (isBrowser() && !(options === null || options === void 0 ? void 0 : options.skipBrowserRedirect)) {
              window.location.assign(response.data.redirect_url);
            }
          }
          return response;
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Lists all OAuth grants that the authenticated user has authorized.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     */
    async _listOAuthGrants() {
      try {
        return await this._useSession(async (result) => {
          const { data: { session }, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          if (!session) {
            return this._returnResult({ data: null, error: new AuthSessionMissingError() });
          }
          return await _request(this.fetch, "GET", `${this.url}/user/oauth/grants`, {
            headers: this.headers,
            jwt: session.access_token,
            xform: (data) => ({ data, error: null })
          });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    /**
     * Revokes a user's OAuth grant for a specific client.
     * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
     */
    async _revokeOAuthGrant(options) {
      try {
        return await this._useSession(async (result) => {
          const { data: { session }, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ data: null, error: sessionError });
          }
          if (!session) {
            return this._returnResult({ data: null, error: new AuthSessionMissingError() });
          }
          await _request(this.fetch, "DELETE", `${this.url}/user/oauth/grants`, {
            headers: this.headers,
            jwt: session.access_token,
            query: { client_id: options.clientId },
            noResolveJson: true
          });
          return { data: {}, error: null };
        });
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
    async fetchJwk(kid, jwks = { keys: [] }) {
      let jwk = jwks.keys.find((key) => key.kid === kid);
      if (jwk) {
        return jwk;
      }
      const now = Date.now();
      jwk = this.jwks.keys.find((key) => key.kid === kid);
      if (jwk && this.jwks_cached_at + JWKS_TTL > now) {
        return jwk;
      }
      const { data, error } = await _request(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, {
        headers: this.headers
      });
      if (error) {
        throw error;
      }
      if (!data.keys || data.keys.length === 0) {
        return null;
      }
      this.jwks = data;
      this.jwks_cached_at = now;
      jwk = data.keys.find((key) => key.kid === kid);
      if (!jwk) {
        return null;
      }
      return jwk;
    }
    /**
     * Extracts the JWT claims present in the access token by first verifying the
     * JWT against the server's JSON Web Key Set endpoint
     * `/.well-known/jwks.json` which is often cached, resulting in significantly
     * faster responses. Prefer this method over {@link #getUser} which always
     * sends a request to the Auth server for each JWT.
     *
     * If the project is not using an asymmetric JWT signing key (like ECC or
     * RSA) it always sends a request to the Auth server (similar to {@link
     * #getUser}) to verify the JWT.
     *
     * @param jwt An optional specific JWT you wish to verify, not the one you
     *            can obtain from {@link #getSession}.
     * @param options Various additional options that allow you to customize the
     *                behavior of this method.
     */
    async getClaims(jwt, options = {}) {
      try {
        let token = jwt;
        if (!token) {
          const { data, error } = await this.getSession();
          if (error || !data.session) {
            return this._returnResult({ data: null, error });
          }
          token = data.session.access_token;
        }
        const { header, payload, signature, raw: { header: rawHeader, payload: rawPayload } } = decodeJWT(token);
        if (!(options === null || options === void 0 ? void 0 : options.allowExpired)) {
          validateExp(payload.exp);
        }
        const signingKey = !header.alg || header.alg.startsWith("HS") || !header.kid || !("crypto" in globalThis && "subtle" in globalThis.crypto) ? null : await this.fetchJwk(header.kid, (options === null || options === void 0 ? void 0 : options.keys) ? { keys: options.keys } : options === null || options === void 0 ? void 0 : options.jwks);
        if (!signingKey) {
          const { error } = await this.getUser(token);
          if (error) {
            throw error;
          }
          return {
            data: {
              claims: payload,
              header,
              signature
            },
            error: null
          };
        }
        const algorithm = getAlgorithm(header.alg);
        const publicKey = await crypto.subtle.importKey("jwk", signingKey, algorithm, true, [
          "verify"
        ]);
        const isValid = await crypto.subtle.verify(algorithm, publicKey, signature, stringToUint8Array(`${rawHeader}.${rawPayload}`));
        if (!isValid) {
          throw new AuthInvalidJwtError("Invalid JWT signature");
        }
        return {
          data: {
            claims: payload,
            header,
            signature
          },
          error: null
        };
      } catch (error) {
        if (isAuthError(error)) {
          return this._returnResult({ data: null, error });
        }
        throw error;
      }
    }
  };
  GoTrueClient.nextInstanceID = {};
  var GoTrueClient_default = GoTrueClient;

  // node_modules/@supabase/auth-js/dist/module/AuthClient.js
  var AuthClient = GoTrueClient_default;
  var AuthClient_default = AuthClient;

  // node_modules/@supabase/supabase-js/dist/index.mjs
  var version4 = "2.88.0";
  var JS_ENV = "";
  if (typeof Deno !== "undefined") JS_ENV = "deno";
  else if (typeof document !== "undefined") JS_ENV = "web";
  else if (typeof navigator !== "undefined" && navigator.product === "ReactNative") JS_ENV = "react-native";
  else JS_ENV = "node";
  var DEFAULT_HEADERS3 = { "X-Client-Info": `supabase-js-${JS_ENV}/${version4}` };
  var DEFAULT_GLOBAL_OPTIONS = { headers: DEFAULT_HEADERS3 };
  var DEFAULT_DB_OPTIONS = { schema: "public" };
  var DEFAULT_AUTH_OPTIONS = {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "implicit"
  };
  var DEFAULT_REALTIME_OPTIONS = {};
  function _typeof2(o2) {
    "@babel/helpers - typeof";
    return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
      return typeof o$1;
    } : function(o$1) {
      return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
    }, _typeof2(o2);
  }
  function toPrimitive2(t2, r2) {
    if ("object" != _typeof2(t2) || !t2) return t2;
    var e2 = t2[Symbol.toPrimitive];
    if (void 0 !== e2) {
      var i2 = e2.call(t2, r2 || "default");
      if ("object" != _typeof2(i2)) return i2;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t2);
  }
  function toPropertyKey2(t2) {
    var i2 = toPrimitive2(t2, "string");
    return "symbol" == _typeof2(i2) ? i2 : i2 + "";
  }
  function _defineProperty2(e2, r2, t2) {
    return (r2 = toPropertyKey2(r2)) in e2 ? Object.defineProperty(e2, r2, {
      value: t2,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e2[r2] = t2, e2;
  }
  function ownKeys2(e2, r2) {
    var t2 = Object.keys(e2);
    if (Object.getOwnPropertySymbols) {
      var o2 = Object.getOwnPropertySymbols(e2);
      r2 && (o2 = o2.filter(function(r$1) {
        return Object.getOwnPropertyDescriptor(e2, r$1).enumerable;
      })), t2.push.apply(t2, o2);
    }
    return t2;
  }
  function _objectSpread22(e2) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys2(Object(t2), true).forEach(function(r$1) {
        _defineProperty2(e2, r$1, t2[r$1]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys2(Object(t2)).forEach(function(r$1) {
        Object.defineProperty(e2, r$1, Object.getOwnPropertyDescriptor(t2, r$1));
      });
    }
    return e2;
  }
  var resolveFetch4 = (customFetch) => {
    if (customFetch) return (...args) => customFetch(...args);
    return (...args) => fetch(...args);
  };
  var resolveHeadersConstructor = () => {
    return Headers;
  };
  var fetchWithAuth = (supabaseKey, getAccessToken, customFetch) => {
    const fetch$1 = resolveFetch4(customFetch);
    const HeadersConstructor = resolveHeadersConstructor();
    return async (input, init) => {
      var _await$getAccessToken;
      const accessToken = (_await$getAccessToken = await getAccessToken()) !== null && _await$getAccessToken !== void 0 ? _await$getAccessToken : supabaseKey;
      let headers = new HeadersConstructor(init === null || init === void 0 ? void 0 : init.headers);
      if (!headers.has("apikey")) headers.set("apikey", supabaseKey);
      if (!headers.has("Authorization")) headers.set("Authorization", `Bearer ${accessToken}`);
      return fetch$1(input, _objectSpread22(_objectSpread22({}, init), {}, { headers }));
    };
  };
  function ensureTrailingSlash(url) {
    return url.endsWith("/") ? url : url + "/";
  }
  function applySettingDefaults(options, defaults) {
    var _DEFAULT_GLOBAL_OPTIO, _globalOptions$header;
    const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions } = options;
    const { db: DEFAULT_DB_OPTIONS$1, auth: DEFAULT_AUTH_OPTIONS$1, realtime: DEFAULT_REALTIME_OPTIONS$1, global: DEFAULT_GLOBAL_OPTIONS$1 } = defaults;
    const result = {
      db: _objectSpread22(_objectSpread22({}, DEFAULT_DB_OPTIONS$1), dbOptions),
      auth: _objectSpread22(_objectSpread22({}, DEFAULT_AUTH_OPTIONS$1), authOptions),
      realtime: _objectSpread22(_objectSpread22({}, DEFAULT_REALTIME_OPTIONS$1), realtimeOptions),
      storage: {},
      global: _objectSpread22(_objectSpread22(_objectSpread22({}, DEFAULT_GLOBAL_OPTIONS$1), globalOptions), {}, { headers: _objectSpread22(_objectSpread22({}, (_DEFAULT_GLOBAL_OPTIO = DEFAULT_GLOBAL_OPTIONS$1 === null || DEFAULT_GLOBAL_OPTIONS$1 === void 0 ? void 0 : DEFAULT_GLOBAL_OPTIONS$1.headers) !== null && _DEFAULT_GLOBAL_OPTIO !== void 0 ? _DEFAULT_GLOBAL_OPTIO : {}), (_globalOptions$header = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.headers) !== null && _globalOptions$header !== void 0 ? _globalOptions$header : {}) }),
      accessToken: async () => ""
    };
    if (options.accessToken) result.accessToken = options.accessToken;
    else delete result.accessToken;
    return result;
  }
  function validateSupabaseUrl(supabaseUrl3) {
    const trimmedUrl = supabaseUrl3 === null || supabaseUrl3 === void 0 ? void 0 : supabaseUrl3.trim();
    if (!trimmedUrl) throw new Error("supabaseUrl is required.");
    if (!trimmedUrl.match(/^https?:\/\//i)) throw new Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");
    try {
      return new URL(ensureTrailingSlash(trimmedUrl));
    } catch (_unused) {
      throw Error("Invalid supabaseUrl: Provided URL is malformed.");
    }
  }
  var SupabaseAuthClient = class extends AuthClient_default {
    constructor(options) {
      super(options);
    }
  };
  var SupabaseClient = class {
    /**
    * Create a new client for use in the browser.
    * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
    * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
    * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
    * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
    * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
    * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
    * @param options.realtime Options passed along to realtime-js constructor.
    * @param options.storage Options passed along to the storage-js constructor.
    * @param options.global.fetch A custom fetch implementation.
    * @param options.global.headers Any additional headers to send with each network request.
    * @example
    * ```ts
    * import { createClient } from '@supabase/supabase-js'
    *
    * const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')
    * const { data } = await supabase.from('profiles').select('*')
    * ```
    */
    constructor(supabaseUrl3, supabaseKey, options) {
      var _settings$auth$storag, _settings$global$head;
      this.supabaseUrl = supabaseUrl3;
      this.supabaseKey = supabaseKey;
      const baseUrl = validateSupabaseUrl(supabaseUrl3);
      if (!supabaseKey) throw new Error("supabaseKey is required.");
      this.realtimeUrl = new URL("realtime/v1", baseUrl);
      this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws");
      this.authUrl = new URL("auth/v1", baseUrl);
      this.storageUrl = new URL("storage/v1", baseUrl);
      this.functionsUrl = new URL("functions/v1", baseUrl);
      const defaultStorageKey = `sb-${baseUrl.hostname.split(".")[0]}-auth-token`;
      const DEFAULTS = {
        db: DEFAULT_DB_OPTIONS,
        realtime: DEFAULT_REALTIME_OPTIONS,
        auth: _objectSpread22(_objectSpread22({}, DEFAULT_AUTH_OPTIONS), {}, { storageKey: defaultStorageKey }),
        global: DEFAULT_GLOBAL_OPTIONS
      };
      const settings = applySettingDefaults(options !== null && options !== void 0 ? options : {}, DEFAULTS);
      this.storageKey = (_settings$auth$storag = settings.auth.storageKey) !== null && _settings$auth$storag !== void 0 ? _settings$auth$storag : "";
      this.headers = (_settings$global$head = settings.global.headers) !== null && _settings$global$head !== void 0 ? _settings$global$head : {};
      if (!settings.accessToken) {
        var _settings$auth;
        this.auth = this._initSupabaseAuthClient((_settings$auth = settings.auth) !== null && _settings$auth !== void 0 ? _settings$auth : {}, this.headers, settings.global.fetch);
      } else {
        this.accessToken = settings.accessToken;
        this.auth = new Proxy({}, { get: (_, prop) => {
          throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(prop)} is not possible`);
        } });
      }
      this.fetch = fetchWithAuth(supabaseKey, this._getAccessToken.bind(this), settings.global.fetch);
      this.realtime = this._initRealtimeClient(_objectSpread22({
        headers: this.headers,
        accessToken: this._getAccessToken.bind(this)
      }, settings.realtime));
      if (this.accessToken) this.accessToken().then((token) => this.realtime.setAuth(token)).catch((e2) => console.warn("Failed to set initial Realtime auth token:", e2));
      this.rest = new PostgrestClient(new URL("rest/v1", baseUrl).href, {
        headers: this.headers,
        schema: settings.db.schema,
        fetch: this.fetch
      });
      this.storage = new StorageClient(this.storageUrl.href, this.headers, this.fetch, options === null || options === void 0 ? void 0 : options.storage);
      if (!settings.accessToken) this._listenForAuthEvents();
    }
    /**
    * Supabase Functions allows you to deploy and invoke edge functions.
    */
    get functions() {
      return new FunctionsClient(this.functionsUrl.href, {
        headers: this.headers,
        customFetch: this.fetch
      });
    }
    /**
    * Perform a query on a table or a view.
    *
    * @param relation - The table or view name to query
    */
    from(relation) {
      return this.rest.from(relation);
    }
    /**
    * Select a schema to query or perform an function (rpc) call.
    *
    * The schema needs to be on the list of exposed schemas inside Supabase.
    *
    * @param schema - The schema to query
    */
    schema(schema) {
      return this.rest.schema(schema);
    }
    /**
    * Perform a function call.
    *
    * @param fn - The function name to call
    * @param args - The arguments to pass to the function call
    * @param options - Named parameters
    * @param options.head - When set to `true`, `data` will not be returned.
    * Useful if you only need the count.
    * @param options.get - When set to `true`, the function will be called with
    * read-only access mode.
    * @param options.count - Count algorithm to use to count rows returned by the
    * function. Only applicable for [set-returning
    * functions](https://www.postgresql.org/docs/current/functions-srf.html).
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    */
    rpc(fn, args = {}, options = {
      head: false,
      get: false,
      count: void 0
    }) {
      return this.rest.rpc(fn, args, options);
    }
    /**
    * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
    *
    * @param {string} name - The name of the Realtime channel.
    * @param {Object} opts - The options to pass to the Realtime channel.
    *
    */
    channel(name7, opts = { config: {} }) {
      return this.realtime.channel(name7, opts);
    }
    /**
    * Returns all Realtime channels.
    */
    getChannels() {
      return this.realtime.getChannels();
    }
    /**
    * Unsubscribes and removes Realtime channel from Realtime client.
    *
    * @param {RealtimeChannel} channel - The name of the Realtime channel.
    *
    */
    removeChannel(channel) {
      return this.realtime.removeChannel(channel);
    }
    /**
    * Unsubscribes and removes all Realtime channels from Realtime client.
    */
    removeAllChannels() {
      return this.realtime.removeAllChannels();
    }
    async _getAccessToken() {
      var _this = this;
      var _data$session$access_, _data$session;
      if (_this.accessToken) return await _this.accessToken();
      const { data } = await _this.auth.getSession();
      return (_data$session$access_ = (_data$session = data.session) === null || _data$session === void 0 ? void 0 : _data$session.access_token) !== null && _data$session$access_ !== void 0 ? _data$session$access_ : _this.supabaseKey;
    }
    _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage, userStorage, storageKey, flowType, lock, debug, throwOnError }, headers, fetch$1) {
      const authHeaders = {
        Authorization: `Bearer ${this.supabaseKey}`,
        apikey: `${this.supabaseKey}`
      };
      return new SupabaseAuthClient({
        url: this.authUrl.href,
        headers: _objectSpread22(_objectSpread22({}, authHeaders), headers),
        storageKey,
        autoRefreshToken,
        persistSession,
        detectSessionInUrl,
        storage,
        userStorage,
        flowType,
        lock,
        debug,
        throwOnError,
        fetch: fetch$1,
        hasCustomAuthorizationHeader: Object.keys(this.headers).some((key) => key.toLowerCase() === "authorization")
      });
    }
    _initRealtimeClient(options) {
      return new RealtimeClient(this.realtimeUrl.href, _objectSpread22(_objectSpread22({}, options), {}, { params: _objectSpread22(_objectSpread22({}, { apikey: this.supabaseKey }), options === null || options === void 0 ? void 0 : options.params) }));
    }
    _listenForAuthEvents() {
      return this.auth.onAuthStateChange((event, session) => {
        this._handleTokenChanged(event, "CLIENT", session === null || session === void 0 ? void 0 : session.access_token);
      });
    }
    _handleTokenChanged(event, source, token) {
      if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && this.changedAccessToken !== token) {
        this.changedAccessToken = token;
        this.realtime.setAuth(token);
      } else if (event === "SIGNED_OUT") {
        this.realtime.setAuth();
        if (source == "STORAGE") this.auth.signOut();
        this.changedAccessToken = void 0;
      }
    }
  };
  var createClient = (supabaseUrl3, supabaseKey, options) => {
    return new SupabaseClient(supabaseUrl3, supabaseKey, options);
  };
  function shouldShowDeprecationWarning() {
    if (typeof window !== "undefined") return false;
    if (typeof process === "undefined") return false;
    const processVersion = process["version"];
    if (processVersion === void 0 || processVersion === null) return false;
    const versionMatch = processVersion.match(/^v(\d+)\./);
    if (!versionMatch) return false;
    return parseInt(versionMatch[1], 10) <= 18;
  }
  if (shouldShowDeprecationWarning()) console.warn("\u26A0\uFE0F  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217");

  // config/supabase.js
  var import_meta = {};
  var supabaseUrl = import_meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
  var supabaseAnonKey = import_meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";
  var supabase = createClient(supabaseUrl, supabaseAnonKey);

  // src/config/supabase.js
  var import_meta2 = {};
  var supabaseUrl2 = import_meta2.env.VITE_SUPABASE_URL;
  var supabaseAnonKey2 = import_meta2.env.VITE_SUPABASE_ANON_KEY;
  var supabase2 = createClient(supabaseUrl2, supabaseAnonKey2, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    db: {
      schema: "public"
    },
    global: {
      headers: { "x-application-name": "enbroidery" }
    },
    realtime: {
      params: {
        eventsPerSecond: 2
      }
    }
  });

  // node_modules/browser-image-compression/dist/browser-image-compression.mjs
  function _mergeNamespaces(e2, t2) {
    return t2.forEach((function(t3) {
      t3 && "string" != typeof t3 && !Array.isArray(t3) && Object.keys(t3).forEach((function(r2) {
        if ("default" !== r2 && !(r2 in e2)) {
          var i2 = Object.getOwnPropertyDescriptor(t3, r2);
          Object.defineProperty(e2, r2, i2.get ? i2 : { enumerable: true, get: function() {
            return t3[r2];
          } });
        }
      }));
    })), Object.freeze(e2);
  }
  function copyExifWithoutOrientation(e2, t2) {
    return new Promise((function(r2, i2) {
      let o2;
      return getApp1Segment(e2).then((function(e3) {
        try {
          return o2 = e3, r2(new Blob([t2.slice(0, 2), o2, t2.slice(2)], { type: "image/jpeg" }));
        } catch (e4) {
          return i2(e4);
        }
      }), i2);
    }));
  }
  var getApp1Segment = (e2) => new Promise(((t2, r2) => {
    const i2 = new FileReader();
    i2.addEventListener("load", (({ target: { result: e3 } }) => {
      const i3 = new DataView(e3);
      let o2 = 0;
      if (65496 !== i3.getUint16(o2)) return r2("not a valid JPEG");
      for (o2 += 2; ; ) {
        const a2 = i3.getUint16(o2);
        if (65498 === a2) break;
        const s2 = i3.getUint16(o2 + 2);
        if (65505 === a2 && 1165519206 === i3.getUint32(o2 + 4)) {
          const a3 = o2 + 10;
          let f2;
          switch (i3.getUint16(a3)) {
            case 18761:
              f2 = true;
              break;
            case 19789:
              f2 = false;
              break;
            default:
              return r2("TIFF header contains invalid endian");
          }
          if (42 !== i3.getUint16(a3 + 2, f2)) return r2("TIFF header contains invalid version");
          const l2 = i3.getUint32(a3 + 4, f2), c2 = a3 + l2 + 2 + 12 * i3.getUint16(a3 + l2, f2);
          for (let e4 = a3 + l2 + 2; e4 < c2; e4 += 12) {
            if (274 == i3.getUint16(e4, f2)) {
              if (3 !== i3.getUint16(e4 + 2, f2)) return r2("Orientation data type is invalid");
              if (1 !== i3.getUint32(e4 + 4, f2)) return r2("Orientation data count is invalid");
              i3.setUint16(e4 + 8, 1, f2);
              break;
            }
          }
          return t2(e3.slice(o2, o2 + 2 + s2));
        }
        o2 += 2 + s2;
      }
      return t2(new Blob());
    })), i2.readAsArrayBuffer(e2);
  }));
  var e = {};
  var t = { get exports() {
    return e;
  }, set exports(t2) {
    e = t2;
  } };
  !(function(e2) {
    var r2, i2, UZIP2 = {};
    t.exports = UZIP2, UZIP2.parse = function(e3, t2) {
      for (var r3 = UZIP2.bin.readUshort, i3 = UZIP2.bin.readUint, o2 = 0, a2 = {}, s2 = new Uint8Array(e3), f2 = s2.length - 4; 101010256 != i3(s2, f2); ) f2--;
      o2 = f2;
      o2 += 4;
      var l2 = r3(s2, o2 += 4);
      r3(s2, o2 += 2);
      var c2 = i3(s2, o2 += 2), u = i3(s2, o2 += 4);
      o2 += 4, o2 = u;
      for (var h = 0; h < l2; h++) {
        i3(s2, o2), o2 += 4, o2 += 4, o2 += 4, i3(s2, o2 += 4);
        c2 = i3(s2, o2 += 4);
        var d = i3(s2, o2 += 4), A = r3(s2, o2 += 4), g = r3(s2, o2 + 2), p = r3(s2, o2 + 4);
        o2 += 6;
        var m = i3(s2, o2 += 8);
        o2 += 4, o2 += A + g + p, UZIP2._readLocal(s2, m, a2, c2, d, t2);
      }
      return a2;
    }, UZIP2._readLocal = function(e3, t2, r3, i3, o2, a2) {
      var s2 = UZIP2.bin.readUshort, f2 = UZIP2.bin.readUint;
      f2(e3, t2), s2(e3, t2 += 4), s2(e3, t2 += 2);
      var l2 = s2(e3, t2 += 2);
      f2(e3, t2 += 2), f2(e3, t2 += 4), t2 += 4;
      var c2 = s2(e3, t2 += 8), u = s2(e3, t2 += 2);
      t2 += 2;
      var h = UZIP2.bin.readUTF8(e3, t2, c2);
      if (t2 += c2, t2 += u, a2) r3[h] = { size: o2, csize: i3 };
      else {
        var d = new Uint8Array(e3.buffer, t2);
        if (0 == l2) r3[h] = new Uint8Array(d.buffer.slice(t2, t2 + i3));
        else {
          if (8 != l2) throw "unknown compression method: " + l2;
          var A = new Uint8Array(o2);
          UZIP2.inflateRaw(d, A), r3[h] = A;
        }
      }
    }, UZIP2.inflateRaw = function(e3, t2) {
      return UZIP2.F.inflate(e3, t2);
    }, UZIP2.inflate = function(e3, t2) {
      return e3[0], e3[1], UZIP2.inflateRaw(new Uint8Array(e3.buffer, e3.byteOffset + 2, e3.length - 6), t2);
    }, UZIP2.deflate = function(e3, t2) {
      null == t2 && (t2 = { level: 6 });
      var r3 = 0, i3 = new Uint8Array(50 + Math.floor(1.1 * e3.length));
      i3[r3] = 120, i3[r3 + 1] = 156, r3 += 2, r3 = UZIP2.F.deflateRaw(e3, i3, r3, t2.level);
      var o2 = UZIP2.adler(e3, 0, e3.length);
      return i3[r3 + 0] = o2 >>> 24 & 255, i3[r3 + 1] = o2 >>> 16 & 255, i3[r3 + 2] = o2 >>> 8 & 255, i3[r3 + 3] = o2 >>> 0 & 255, new Uint8Array(i3.buffer, 0, r3 + 4);
    }, UZIP2.deflateRaw = function(e3, t2) {
      null == t2 && (t2 = { level: 6 });
      var r3 = new Uint8Array(50 + Math.floor(1.1 * e3.length)), i3 = UZIP2.F.deflateRaw(e3, r3, i3, t2.level);
      return new Uint8Array(r3.buffer, 0, i3);
    }, UZIP2.encode = function(e3, t2) {
      null == t2 && (t2 = false);
      var r3 = 0, i3 = UZIP2.bin.writeUint, o2 = UZIP2.bin.writeUshort, a2 = {};
      for (var s2 in e3) {
        var f2 = !UZIP2._noNeed(s2) && !t2, l2 = e3[s2], c2 = UZIP2.crc.crc(l2, 0, l2.length);
        a2[s2] = { cpr: f2, usize: l2.length, crc: c2, file: f2 ? UZIP2.deflateRaw(l2) : l2 };
      }
      for (var s2 in a2) r3 += a2[s2].file.length + 30 + 46 + 2 * UZIP2.bin.sizeUTF8(s2);
      r3 += 22;
      var u = new Uint8Array(r3), h = 0, d = [];
      for (var s2 in a2) {
        var A = a2[s2];
        d.push(h), h = UZIP2._writeHeader(u, h, s2, A, 0);
      }
      var g = 0, p = h;
      for (var s2 in a2) {
        A = a2[s2];
        d.push(h), h = UZIP2._writeHeader(u, h, s2, A, 1, d[g++]);
      }
      var m = h - p;
      return i3(u, h, 101010256), h += 4, o2(u, h += 4, g), o2(u, h += 2, g), i3(u, h += 2, m), i3(u, h += 4, p), h += 4, h += 2, u.buffer;
    }, UZIP2._noNeed = function(e3) {
      var t2 = e3.split(".").pop().toLowerCase();
      return -1 != "png,jpg,jpeg,zip".indexOf(t2);
    }, UZIP2._writeHeader = function(e3, t2, r3, i3, o2, a2) {
      var s2 = UZIP2.bin.writeUint, f2 = UZIP2.bin.writeUshort, l2 = i3.file;
      return s2(e3, t2, 0 == o2 ? 67324752 : 33639248), t2 += 4, 1 == o2 && (t2 += 2), f2(e3, t2, 20), f2(e3, t2 += 2, 0), f2(e3, t2 += 2, i3.cpr ? 8 : 0), s2(e3, t2 += 2, 0), s2(e3, t2 += 4, i3.crc), s2(e3, t2 += 4, l2.length), s2(e3, t2 += 4, i3.usize), f2(e3, t2 += 4, UZIP2.bin.sizeUTF8(r3)), f2(e3, t2 += 2, 0), t2 += 2, 1 == o2 && (t2 += 2, t2 += 2, s2(e3, t2 += 6, a2), t2 += 4), t2 += UZIP2.bin.writeUTF8(e3, t2, r3), 0 == o2 && (e3.set(l2, t2), t2 += l2.length), t2;
    }, UZIP2.crc = { table: (function() {
      for (var e3 = new Uint32Array(256), t2 = 0; t2 < 256; t2++) {
        for (var r3 = t2, i3 = 0; i3 < 8; i3++) 1 & r3 ? r3 = 3988292384 ^ r3 >>> 1 : r3 >>>= 1;
        e3[t2] = r3;
      }
      return e3;
    })(), update: function(e3, t2, r3, i3) {
      for (var o2 = 0; o2 < i3; o2++) e3 = UZIP2.crc.table[255 & (e3 ^ t2[r3 + o2])] ^ e3 >>> 8;
      return e3;
    }, crc: function(e3, t2, r3) {
      return 4294967295 ^ UZIP2.crc.update(4294967295, e3, t2, r3);
    } }, UZIP2.adler = function(e3, t2, r3) {
      for (var i3 = 1, o2 = 0, a2 = t2, s2 = t2 + r3; a2 < s2; ) {
        for (var f2 = Math.min(a2 + 5552, s2); a2 < f2; ) o2 += i3 += e3[a2++];
        i3 %= 65521, o2 %= 65521;
      }
      return o2 << 16 | i3;
    }, UZIP2.bin = { readUshort: function(e3, t2) {
      return e3[t2] | e3[t2 + 1] << 8;
    }, writeUshort: function(e3, t2, r3) {
      e3[t2] = 255 & r3, e3[t2 + 1] = r3 >> 8 & 255;
    }, readUint: function(e3, t2) {
      return 16777216 * e3[t2 + 3] + (e3[t2 + 2] << 16 | e3[t2 + 1] << 8 | e3[t2]);
    }, writeUint: function(e3, t2, r3) {
      e3[t2] = 255 & r3, e3[t2 + 1] = r3 >> 8 & 255, e3[t2 + 2] = r3 >> 16 & 255, e3[t2 + 3] = r3 >> 24 & 255;
    }, readASCII: function(e3, t2, r3) {
      for (var i3 = "", o2 = 0; o2 < r3; o2++) i3 += String.fromCharCode(e3[t2 + o2]);
      return i3;
    }, writeASCII: function(e3, t2, r3) {
      for (var i3 = 0; i3 < r3.length; i3++) e3[t2 + i3] = r3.charCodeAt(i3);
    }, pad: function(e3) {
      return e3.length < 2 ? "0" + e3 : e3;
    }, readUTF8: function(e3, t2, r3) {
      for (var i3, o2 = "", a2 = 0; a2 < r3; a2++) o2 += "%" + UZIP2.bin.pad(e3[t2 + a2].toString(16));
      try {
        i3 = decodeURIComponent(o2);
      } catch (i4) {
        return UZIP2.bin.readASCII(e3, t2, r3);
      }
      return i3;
    }, writeUTF8: function(e3, t2, r3) {
      for (var i3 = r3.length, o2 = 0, a2 = 0; a2 < i3; a2++) {
        var s2 = r3.charCodeAt(a2);
        if (0 == (4294967168 & s2)) e3[t2 + o2] = s2, o2++;
        else if (0 == (4294965248 & s2)) e3[t2 + o2] = 192 | s2 >> 6, e3[t2 + o2 + 1] = 128 | s2 >> 0 & 63, o2 += 2;
        else if (0 == (4294901760 & s2)) e3[t2 + o2] = 224 | s2 >> 12, e3[t2 + o2 + 1] = 128 | s2 >> 6 & 63, e3[t2 + o2 + 2] = 128 | s2 >> 0 & 63, o2 += 3;
        else {
          if (0 != (4292870144 & s2)) throw "e";
          e3[t2 + o2] = 240 | s2 >> 18, e3[t2 + o2 + 1] = 128 | s2 >> 12 & 63, e3[t2 + o2 + 2] = 128 | s2 >> 6 & 63, e3[t2 + o2 + 3] = 128 | s2 >> 0 & 63, o2 += 4;
        }
      }
      return o2;
    }, sizeUTF8: function(e3) {
      for (var t2 = e3.length, r3 = 0, i3 = 0; i3 < t2; i3++) {
        var o2 = e3.charCodeAt(i3);
        if (0 == (4294967168 & o2)) r3++;
        else if (0 == (4294965248 & o2)) r3 += 2;
        else if (0 == (4294901760 & o2)) r3 += 3;
        else {
          if (0 != (4292870144 & o2)) throw "e";
          r3 += 4;
        }
      }
      return r3;
    } }, UZIP2.F = {}, UZIP2.F.deflateRaw = function(e3, t2, r3, i3) {
      var o2 = [[0, 0, 0, 0, 0], [4, 4, 8, 4, 0], [4, 5, 16, 8, 0], [4, 6, 16, 16, 0], [4, 10, 16, 32, 0], [8, 16, 32, 32, 0], [8, 16, 128, 128, 0], [8, 32, 128, 256, 0], [32, 128, 258, 1024, 1], [32, 258, 258, 4096, 1]][i3], a2 = UZIP2.F.U, s2 = UZIP2.F._goodIndex;
      UZIP2.F._hash;
      var f2 = UZIP2.F._putsE, l2 = 0, c2 = r3 << 3, u = 0, h = e3.length;
      if (0 == i3) {
        for (; l2 < h; ) {
          f2(t2, c2, l2 + (_ = Math.min(65535, h - l2)) == h ? 1 : 0), c2 = UZIP2.F._copyExact(e3, l2, _, t2, c2 + 8), l2 += _;
        }
        return c2 >>> 3;
      }
      var d = a2.lits, A = a2.strt, g = a2.prev, p = 0, m = 0, w = 0, v = 0, b = 0, y = 0;
      for (h > 2 && (A[y = UZIP2.F._hash(e3, 0)] = 0), l2 = 0; l2 < h; l2++) {
        if (b = y, l2 + 1 < h - 2) {
          y = UZIP2.F._hash(e3, l2 + 1);
          var E = l2 + 1 & 32767;
          g[E] = A[y], A[y] = E;
        }
        if (u <= l2) {
          (p > 14e3 || m > 26697) && h - l2 > 100 && (u < l2 && (d[p] = l2 - u, p += 2, u = l2), c2 = UZIP2.F._writeBlock(l2 == h - 1 || u == h ? 1 : 0, d, p, v, e3, w, l2 - w, t2, c2), p = m = v = 0, w = l2);
          var F = 0;
          l2 < h - 2 && (F = UZIP2.F._bestMatch(e3, l2, g, b, Math.min(o2[2], h - l2), o2[3]));
          var _ = F >>> 16, B = 65535 & F;
          if (0 != F) {
            B = 65535 & F;
            var U = s2(_ = F >>> 16, a2.of0);
            a2.lhst[257 + U]++;
            var C = s2(B, a2.df0);
            a2.dhst[C]++, v += a2.exb[U] + a2.dxb[C], d[p] = _ << 23 | l2 - u, d[p + 1] = B << 16 | U << 8 | C, p += 2, u = l2 + _;
          } else a2.lhst[e3[l2]]++;
          m++;
        }
      }
      for (w == l2 && 0 != e3.length || (u < l2 && (d[p] = l2 - u, p += 2, u = l2), c2 = UZIP2.F._writeBlock(1, d, p, v, e3, w, l2 - w, t2, c2), p = 0, m = 0, p = m = v = 0, w = l2); 0 != (7 & c2); ) c2++;
      return c2 >>> 3;
    }, UZIP2.F._bestMatch = function(e3, t2, r3, i3, o2, a2) {
      var s2 = 32767 & t2, f2 = r3[s2], l2 = s2 - f2 + 32768 & 32767;
      if (f2 == s2 || i3 != UZIP2.F._hash(e3, t2 - l2)) return 0;
      for (var c2 = 0, u = 0, h = Math.min(32767, t2); l2 <= h && 0 != --a2 && f2 != s2; ) {
        if (0 == c2 || e3[t2 + c2] == e3[t2 + c2 - l2]) {
          var d = UZIP2.F._howLong(e3, t2, l2);
          if (d > c2) {
            if (u = l2, (c2 = d) >= o2) break;
            l2 + 2 < d && (d = l2 + 2);
            for (var A = 0, g = 0; g < d - 2; g++) {
              var p = t2 - l2 + g + 32768 & 32767, m = p - r3[p] + 32768 & 32767;
              m > A && (A = m, f2 = p);
            }
          }
        }
        l2 += (s2 = f2) - (f2 = r3[s2]) + 32768 & 32767;
      }
      return c2 << 16 | u;
    }, UZIP2.F._howLong = function(e3, t2, r3) {
      if (e3[t2] != e3[t2 - r3] || e3[t2 + 1] != e3[t2 + 1 - r3] || e3[t2 + 2] != e3[t2 + 2 - r3]) return 0;
      var i3 = t2, o2 = Math.min(e3.length, t2 + 258);
      for (t2 += 3; t2 < o2 && e3[t2] == e3[t2 - r3]; ) t2++;
      return t2 - i3;
    }, UZIP2.F._hash = function(e3, t2) {
      return (e3[t2] << 8 | e3[t2 + 1]) + (e3[t2 + 2] << 4) & 65535;
    }, UZIP2.saved = 0, UZIP2.F._writeBlock = function(e3, t2, r3, i3, o2, a2, s2, f2, l2) {
      var c2, u, h, d, A, g, p, m, w, v = UZIP2.F.U, b = UZIP2.F._putsF, y = UZIP2.F._putsE;
      v.lhst[256]++, u = (c2 = UZIP2.F.getTrees())[0], h = c2[1], d = c2[2], A = c2[3], g = c2[4], p = c2[5], m = c2[6], w = c2[7];
      var E = 32 + (0 == (l2 + 3 & 7) ? 0 : 8 - (l2 + 3 & 7)) + (s2 << 3), F = i3 + UZIP2.F.contSize(v.fltree, v.lhst) + UZIP2.F.contSize(v.fdtree, v.dhst), _ = i3 + UZIP2.F.contSize(v.ltree, v.lhst) + UZIP2.F.contSize(v.dtree, v.dhst);
      _ += 14 + 3 * p + UZIP2.F.contSize(v.itree, v.ihst) + (2 * v.ihst[16] + 3 * v.ihst[17] + 7 * v.ihst[18]);
      for (var B = 0; B < 286; B++) v.lhst[B] = 0;
      for (B = 0; B < 30; B++) v.dhst[B] = 0;
      for (B = 0; B < 19; B++) v.ihst[B] = 0;
      var U = E < F && E < _ ? 0 : F < _ ? 1 : 2;
      if (b(f2, l2, e3), b(f2, l2 + 1, U), l2 += 3, 0 == U) {
        for (; 0 != (7 & l2); ) l2++;
        l2 = UZIP2.F._copyExact(o2, a2, s2, f2, l2);
      } else {
        var C, I;
        if (1 == U && (C = v.fltree, I = v.fdtree), 2 == U) {
          UZIP2.F.makeCodes(v.ltree, u), UZIP2.F.revCodes(v.ltree, u), UZIP2.F.makeCodes(v.dtree, h), UZIP2.F.revCodes(v.dtree, h), UZIP2.F.makeCodes(v.itree, d), UZIP2.F.revCodes(v.itree, d), C = v.ltree, I = v.dtree, y(f2, l2, A - 257), y(f2, l2 += 5, g - 1), y(f2, l2 += 5, p - 4), l2 += 4;
          for (var Q = 0; Q < p; Q++) y(f2, l2 + 3 * Q, v.itree[1 + (v.ordr[Q] << 1)]);
          l2 += 3 * p, l2 = UZIP2.F._codeTiny(m, v.itree, f2, l2), l2 = UZIP2.F._codeTiny(w, v.itree, f2, l2);
        }
        for (var M = a2, x = 0; x < r3; x += 2) {
          for (var S = t2[x], R = S >>> 23, T = M + (8388607 & S); M < T; ) l2 = UZIP2.F._writeLit(o2[M++], C, f2, l2);
          if (0 != R) {
            var O = t2[x + 1], P = O >> 16, H = O >> 8 & 255, L = 255 & O;
            y(f2, l2 = UZIP2.F._writeLit(257 + H, C, f2, l2), R - v.of0[H]), l2 += v.exb[H], b(f2, l2 = UZIP2.F._writeLit(L, I, f2, l2), P - v.df0[L]), l2 += v.dxb[L], M += R;
          }
        }
        l2 = UZIP2.F._writeLit(256, C, f2, l2);
      }
      return l2;
    }, UZIP2.F._copyExact = function(e3, t2, r3, i3, o2) {
      var a2 = o2 >>> 3;
      return i3[a2] = r3, i3[a2 + 1] = r3 >>> 8, i3[a2 + 2] = 255 - i3[a2], i3[a2 + 3] = 255 - i3[a2 + 1], a2 += 4, i3.set(new Uint8Array(e3.buffer, t2, r3), a2), o2 + (r3 + 4 << 3);
    }, UZIP2.F.getTrees = function() {
      for (var e3 = UZIP2.F.U, t2 = UZIP2.F._hufTree(e3.lhst, e3.ltree, 15), r3 = UZIP2.F._hufTree(e3.dhst, e3.dtree, 15), i3 = [], o2 = UZIP2.F._lenCodes(e3.ltree, i3), a2 = [], s2 = UZIP2.F._lenCodes(e3.dtree, a2), f2 = 0; f2 < i3.length; f2 += 2) e3.ihst[i3[f2]]++;
      for (f2 = 0; f2 < a2.length; f2 += 2) e3.ihst[a2[f2]]++;
      for (var l2 = UZIP2.F._hufTree(e3.ihst, e3.itree, 7), c2 = 19; c2 > 4 && 0 == e3.itree[1 + (e3.ordr[c2 - 1] << 1)]; ) c2--;
      return [t2, r3, l2, o2, s2, c2, i3, a2];
    }, UZIP2.F.getSecond = function(e3) {
      for (var t2 = [], r3 = 0; r3 < e3.length; r3 += 2) t2.push(e3[r3 + 1]);
      return t2;
    }, UZIP2.F.nonZero = function(e3) {
      for (var t2 = "", r3 = 0; r3 < e3.length; r3 += 2) 0 != e3[r3 + 1] && (t2 += (r3 >> 1) + ",");
      return t2;
    }, UZIP2.F.contSize = function(e3, t2) {
      for (var r3 = 0, i3 = 0; i3 < t2.length; i3++) r3 += t2[i3] * e3[1 + (i3 << 1)];
      return r3;
    }, UZIP2.F._codeTiny = function(e3, t2, r3, i3) {
      for (var o2 = 0; o2 < e3.length; o2 += 2) {
        var a2 = e3[o2], s2 = e3[o2 + 1];
        i3 = UZIP2.F._writeLit(a2, t2, r3, i3);
        var f2 = 16 == a2 ? 2 : 17 == a2 ? 3 : 7;
        a2 > 15 && (UZIP2.F._putsE(r3, i3, s2, f2), i3 += f2);
      }
      return i3;
    }, UZIP2.F._lenCodes = function(e3, t2) {
      for (var r3 = e3.length; 2 != r3 && 0 == e3[r3 - 1]; ) r3 -= 2;
      for (var i3 = 0; i3 < r3; i3 += 2) {
        var o2 = e3[i3 + 1], a2 = i3 + 3 < r3 ? e3[i3 + 3] : -1, s2 = i3 + 5 < r3 ? e3[i3 + 5] : -1, f2 = 0 == i3 ? -1 : e3[i3 - 1];
        if (0 == o2 && a2 == o2 && s2 == o2) {
          for (var l2 = i3 + 5; l2 + 2 < r3 && e3[l2 + 2] == o2; ) l2 += 2;
          (c2 = Math.min(l2 + 1 - i3 >>> 1, 138)) < 11 ? t2.push(17, c2 - 3) : t2.push(18, c2 - 11), i3 += 2 * c2 - 2;
        } else if (o2 == f2 && a2 == o2 && s2 == o2) {
          for (l2 = i3 + 5; l2 + 2 < r3 && e3[l2 + 2] == o2; ) l2 += 2;
          var c2 = Math.min(l2 + 1 - i3 >>> 1, 6);
          t2.push(16, c2 - 3), i3 += 2 * c2 - 2;
        } else t2.push(o2, 0);
      }
      return r3 >>> 1;
    }, UZIP2.F._hufTree = function(e3, t2, r3) {
      var i3 = [], o2 = e3.length, a2 = t2.length, s2 = 0;
      for (s2 = 0; s2 < a2; s2 += 2) t2[s2] = 0, t2[s2 + 1] = 0;
      for (s2 = 0; s2 < o2; s2++) 0 != e3[s2] && i3.push({ lit: s2, f: e3[s2] });
      var f2 = i3.length, l2 = i3.slice(0);
      if (0 == f2) return 0;
      if (1 == f2) {
        var c2 = i3[0].lit;
        l2 = 0 == c2 ? 1 : 0;
        return t2[1 + (c2 << 1)] = 1, t2[1 + (l2 << 1)] = 1, 1;
      }
      i3.sort((function(e4, t3) {
        return e4.f - t3.f;
      }));
      var u = i3[0], h = i3[1], d = 0, A = 1, g = 2;
      for (i3[0] = { lit: -1, f: u.f + h.f, l: u, r: h, d: 0 }; A != f2 - 1; ) u = d != A && (g == f2 || i3[d].f < i3[g].f) ? i3[d++] : i3[g++], h = d != A && (g == f2 || i3[d].f < i3[g].f) ? i3[d++] : i3[g++], i3[A++] = { lit: -1, f: u.f + h.f, l: u, r: h };
      var p = UZIP2.F.setDepth(i3[A - 1], 0);
      for (p > r3 && (UZIP2.F.restrictDepth(l2, r3, p), p = r3), s2 = 0; s2 < f2; s2++) t2[1 + (l2[s2].lit << 1)] = l2[s2].d;
      return p;
    }, UZIP2.F.setDepth = function(e3, t2) {
      return -1 != e3.lit ? (e3.d = t2, t2) : Math.max(UZIP2.F.setDepth(e3.l, t2 + 1), UZIP2.F.setDepth(e3.r, t2 + 1));
    }, UZIP2.F.restrictDepth = function(e3, t2, r3) {
      var i3 = 0, o2 = 1 << r3 - t2, a2 = 0;
      for (e3.sort((function(e4, t3) {
        return t3.d == e4.d ? e4.f - t3.f : t3.d - e4.d;
      })), i3 = 0; i3 < e3.length && e3[i3].d > t2; i3++) {
        var s2 = e3[i3].d;
        e3[i3].d = t2, a2 += o2 - (1 << r3 - s2);
      }
      for (a2 >>>= r3 - t2; a2 > 0; ) {
        (s2 = e3[i3].d) < t2 ? (e3[i3].d++, a2 -= 1 << t2 - s2 - 1) : i3++;
      }
      for (; i3 >= 0; i3--) e3[i3].d == t2 && a2 < 0 && (e3[i3].d--, a2++);
      0 != a2 && console.log("debt left");
    }, UZIP2.F._goodIndex = function(e3, t2) {
      var r3 = 0;
      return t2[16 | r3] <= e3 && (r3 |= 16), t2[8 | r3] <= e3 && (r3 |= 8), t2[4 | r3] <= e3 && (r3 |= 4), t2[2 | r3] <= e3 && (r3 |= 2), t2[1 | r3] <= e3 && (r3 |= 1), r3;
    }, UZIP2.F._writeLit = function(e3, t2, r3, i3) {
      return UZIP2.F._putsF(r3, i3, t2[e3 << 1]), i3 + t2[1 + (e3 << 1)];
    }, UZIP2.F.inflate = function(e3, t2) {
      var r3 = Uint8Array;
      if (3 == e3[0] && 0 == e3[1]) return t2 || new r3(0);
      var i3 = UZIP2.F, o2 = i3._bitsF, a2 = i3._bitsE, s2 = i3._decodeTiny, f2 = i3.makeCodes, l2 = i3.codes2map, c2 = i3._get17, u = i3.U, h = null == t2;
      h && (t2 = new r3(e3.length >>> 2 << 3));
      for (var d, A, g = 0, p = 0, m = 0, w = 0, v = 0, b = 0, y = 0, E = 0, F = 0; 0 == g; ) if (g = o2(e3, F, 1), p = o2(e3, F + 1, 2), F += 3, 0 != p) {
        if (h && (t2 = UZIP2.F._check(t2, E + (1 << 17))), 1 == p && (d = u.flmap, A = u.fdmap, b = 511, y = 31), 2 == p) {
          m = a2(e3, F, 5) + 257, w = a2(e3, F + 5, 5) + 1, v = a2(e3, F + 10, 4) + 4, F += 14;
          for (var _ = 0; _ < 38; _ += 2) u.itree[_] = 0, u.itree[_ + 1] = 0;
          var B = 1;
          for (_ = 0; _ < v; _++) {
            var U = a2(e3, F + 3 * _, 3);
            u.itree[1 + (u.ordr[_] << 1)] = U, U > B && (B = U);
          }
          F += 3 * v, f2(u.itree, B), l2(u.itree, B, u.imap), d = u.lmap, A = u.dmap, F = s2(u.imap, (1 << B) - 1, m + w, e3, F, u.ttree);
          var C = i3._copyOut(u.ttree, 0, m, u.ltree);
          b = (1 << C) - 1;
          var I = i3._copyOut(u.ttree, m, w, u.dtree);
          y = (1 << I) - 1, f2(u.ltree, C), l2(u.ltree, C, d), f2(u.dtree, I), l2(u.dtree, I, A);
        }
        for (; ; ) {
          var Q = d[c2(e3, F) & b];
          F += 15 & Q;
          var M = Q >>> 4;
          if (M >>> 8 == 0) t2[E++] = M;
          else {
            if (256 == M) break;
            var x = E + M - 254;
            if (M > 264) {
              var S = u.ldef[M - 257];
              x = E + (S >>> 3) + a2(e3, F, 7 & S), F += 7 & S;
            }
            var R = A[c2(e3, F) & y];
            F += 15 & R;
            var T = R >>> 4, O = u.ddef[T], P = (O >>> 4) + o2(e3, F, 15 & O);
            for (F += 15 & O, h && (t2 = UZIP2.F._check(t2, E + (1 << 17))); E < x; ) t2[E] = t2[E++ - P], t2[E] = t2[E++ - P], t2[E] = t2[E++ - P], t2[E] = t2[E++ - P];
            E = x;
          }
        }
      } else {
        0 != (7 & F) && (F += 8 - (7 & F));
        var H = 4 + (F >>> 3), L = e3[H - 4] | e3[H - 3] << 8;
        h && (t2 = UZIP2.F._check(t2, E + L)), t2.set(new r3(e3.buffer, e3.byteOffset + H, L), E), F = H + L << 3, E += L;
      }
      return t2.length == E ? t2 : t2.slice(0, E);
    }, UZIP2.F._check = function(e3, t2) {
      var r3 = e3.length;
      if (t2 <= r3) return e3;
      var i3 = new Uint8Array(Math.max(r3 << 1, t2));
      return i3.set(e3, 0), i3;
    }, UZIP2.F._decodeTiny = function(e3, t2, r3, i3, o2, a2) {
      for (var s2 = UZIP2.F._bitsE, f2 = UZIP2.F._get17, l2 = 0; l2 < r3; ) {
        var c2 = e3[f2(i3, o2) & t2];
        o2 += 15 & c2;
        var u = c2 >>> 4;
        if (u <= 15) a2[l2] = u, l2++;
        else {
          var h = 0, d = 0;
          16 == u ? (d = 3 + s2(i3, o2, 2), o2 += 2, h = a2[l2 - 1]) : 17 == u ? (d = 3 + s2(i3, o2, 3), o2 += 3) : 18 == u && (d = 11 + s2(i3, o2, 7), o2 += 7);
          for (var A = l2 + d; l2 < A; ) a2[l2] = h, l2++;
        }
      }
      return o2;
    }, UZIP2.F._copyOut = function(e3, t2, r3, i3) {
      for (var o2 = 0, a2 = 0, s2 = i3.length >>> 1; a2 < r3; ) {
        var f2 = e3[a2 + t2];
        i3[a2 << 1] = 0, i3[1 + (a2 << 1)] = f2, f2 > o2 && (o2 = f2), a2++;
      }
      for (; a2 < s2; ) i3[a2 << 1] = 0, i3[1 + (a2 << 1)] = 0, a2++;
      return o2;
    }, UZIP2.F.makeCodes = function(e3, t2) {
      for (var r3, i3, o2, a2, s2 = UZIP2.F.U, f2 = e3.length, l2 = s2.bl_count, c2 = 0; c2 <= t2; c2++) l2[c2] = 0;
      for (c2 = 1; c2 < f2; c2 += 2) l2[e3[c2]]++;
      var u = s2.next_code;
      for (r3 = 0, l2[0] = 0, i3 = 1; i3 <= t2; i3++) r3 = r3 + l2[i3 - 1] << 1, u[i3] = r3;
      for (o2 = 0; o2 < f2; o2 += 2) 0 != (a2 = e3[o2 + 1]) && (e3[o2] = u[a2], u[a2]++);
    }, UZIP2.F.codes2map = function(e3, t2, r3) {
      for (var i3 = e3.length, o2 = UZIP2.F.U.rev15, a2 = 0; a2 < i3; a2 += 2) if (0 != e3[a2 + 1]) for (var s2 = a2 >> 1, f2 = e3[a2 + 1], l2 = s2 << 4 | f2, c2 = t2 - f2, u = e3[a2] << c2, h = u + (1 << c2); u != h; ) {
        r3[o2[u] >>> 15 - t2] = l2, u++;
      }
    }, UZIP2.F.revCodes = function(e3, t2) {
      for (var r3 = UZIP2.F.U.rev15, i3 = 15 - t2, o2 = 0; o2 < e3.length; o2 += 2) {
        var a2 = e3[o2] << t2 - e3[o2 + 1];
        e3[o2] = r3[a2] >>> i3;
      }
    }, UZIP2.F._putsE = function(e3, t2, r3) {
      r3 <<= 7 & t2;
      var i3 = t2 >>> 3;
      e3[i3] |= r3, e3[i3 + 1] |= r3 >>> 8;
    }, UZIP2.F._putsF = function(e3, t2, r3) {
      r3 <<= 7 & t2;
      var i3 = t2 >>> 3;
      e3[i3] |= r3, e3[i3 + 1] |= r3 >>> 8, e3[i3 + 2] |= r3 >>> 16;
    }, UZIP2.F._bitsE = function(e3, t2, r3) {
      return (e3[t2 >>> 3] | e3[1 + (t2 >>> 3)] << 8) >>> (7 & t2) & (1 << r3) - 1;
    }, UZIP2.F._bitsF = function(e3, t2, r3) {
      return (e3[t2 >>> 3] | e3[1 + (t2 >>> 3)] << 8 | e3[2 + (t2 >>> 3)] << 16) >>> (7 & t2) & (1 << r3) - 1;
    }, UZIP2.F._get17 = function(e3, t2) {
      return (e3[t2 >>> 3] | e3[1 + (t2 >>> 3)] << 8 | e3[2 + (t2 >>> 3)] << 16) >>> (7 & t2);
    }, UZIP2.F._get25 = function(e3, t2) {
      return (e3[t2 >>> 3] | e3[1 + (t2 >>> 3)] << 8 | e3[2 + (t2 >>> 3)] << 16 | e3[3 + (t2 >>> 3)] << 24) >>> (7 & t2);
    }, UZIP2.F.U = (r2 = Uint16Array, i2 = Uint32Array, { next_code: new r2(16), bl_count: new r2(16), ordr: [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], of0: [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 999, 999, 999], exb: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0], ldef: new r2(32), df0: [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 65535, 65535], dxb: [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0], ddef: new i2(32), flmap: new r2(512), fltree: [], fdmap: new r2(32), fdtree: [], lmap: new r2(32768), ltree: [], ttree: [], dmap: new r2(32768), dtree: [], imap: new r2(512), itree: [], rev15: new r2(32768), lhst: new i2(286), dhst: new i2(30), ihst: new i2(19), lits: new i2(15e3), strt: new r2(65536), prev: new r2(32768) }), (function() {
      for (var e3 = UZIP2.F.U, t2 = 0; t2 < 32768; t2++) {
        var r3 = t2;
        r3 = (4278255360 & (r3 = (4042322160 & (r3 = (3435973836 & (r3 = (2863311530 & r3) >>> 1 | (1431655765 & r3) << 1)) >>> 2 | (858993459 & r3) << 2)) >>> 4 | (252645135 & r3) << 4)) >>> 8 | (16711935 & r3) << 8, e3.rev15[t2] = (r3 >>> 16 | r3 << 16) >>> 17;
      }
      function pushV(e4, t3, r4) {
        for (; 0 != t3--; ) e4.push(0, r4);
      }
      for (t2 = 0; t2 < 32; t2++) e3.ldef[t2] = e3.of0[t2] << 3 | e3.exb[t2], e3.ddef[t2] = e3.df0[t2] << 4 | e3.dxb[t2];
      pushV(e3.fltree, 144, 8), pushV(e3.fltree, 112, 9), pushV(e3.fltree, 24, 7), pushV(e3.fltree, 8, 8), UZIP2.F.makeCodes(e3.fltree, 9), UZIP2.F.codes2map(e3.fltree, 9, e3.flmap), UZIP2.F.revCodes(e3.fltree, 9), pushV(e3.fdtree, 32, 5), UZIP2.F.makeCodes(e3.fdtree, 5), UZIP2.F.codes2map(e3.fdtree, 5, e3.fdmap), UZIP2.F.revCodes(e3.fdtree, 5), pushV(e3.itree, 19, 0), pushV(e3.ltree, 286, 0), pushV(e3.dtree, 30, 0), pushV(e3.ttree, 320, 0);
    })();
  })();
  var UZIP = _mergeNamespaces({ __proto__: null, default: e }, [e]);
  var UPNG = (function() {
    var e2 = { nextZero(e3, t3) {
      for (; 0 != e3[t3]; ) t3++;
      return t3;
    }, readUshort: (e3, t3) => e3[t3] << 8 | e3[t3 + 1], writeUshort(e3, t3, r2) {
      e3[t3] = r2 >> 8 & 255, e3[t3 + 1] = 255 & r2;
    }, readUint: (e3, t3) => 16777216 * e3[t3] + (e3[t3 + 1] << 16 | e3[t3 + 2] << 8 | e3[t3 + 3]), writeUint(e3, t3, r2) {
      e3[t3] = r2 >> 24 & 255, e3[t3 + 1] = r2 >> 16 & 255, e3[t3 + 2] = r2 >> 8 & 255, e3[t3 + 3] = 255 & r2;
    }, readASCII(e3, t3, r2) {
      let i2 = "";
      for (let o2 = 0; o2 < r2; o2++) i2 += String.fromCharCode(e3[t3 + o2]);
      return i2;
    }, writeASCII(e3, t3, r2) {
      for (let i2 = 0; i2 < r2.length; i2++) e3[t3 + i2] = r2.charCodeAt(i2);
    }, readBytes(e3, t3, r2) {
      const i2 = [];
      for (let o2 = 0; o2 < r2; o2++) i2.push(e3[t3 + o2]);
      return i2;
    }, pad: (e3) => e3.length < 2 ? `0${e3}` : e3, readUTF8(t3, r2, i2) {
      let o2, a2 = "";
      for (let o3 = 0; o3 < i2; o3++) a2 += `%${e2.pad(t3[r2 + o3].toString(16))}`;
      try {
        o2 = decodeURIComponent(a2);
      } catch (o3) {
        return e2.readASCII(t3, r2, i2);
      }
      return o2;
    } };
    function decodeImage(t3, r2, i2, o2) {
      const a2 = r2 * i2, s2 = _getBPP(o2), f2 = Math.ceil(r2 * s2 / 8), l2 = new Uint8Array(4 * a2), c2 = new Uint32Array(l2.buffer), { ctype: u } = o2, { depth: h } = o2, d = e2.readUshort;
      if (6 == u) {
        const e3 = a2 << 2;
        if (8 == h) for (var A = 0; A < e3; A += 4) l2[A] = t3[A], l2[A + 1] = t3[A + 1], l2[A + 2] = t3[A + 2], l2[A + 3] = t3[A + 3];
        if (16 == h) for (A = 0; A < e3; A++) l2[A] = t3[A << 1];
      } else if (2 == u) {
        const e3 = o2.tabs.tRNS;
        if (null == e3) {
          if (8 == h) for (A = 0; A < a2; A++) {
            var g = 3 * A;
            c2[A] = 255 << 24 | t3[g + 2] << 16 | t3[g + 1] << 8 | t3[g];
          }
          if (16 == h) for (A = 0; A < a2; A++) {
            g = 6 * A;
            c2[A] = 255 << 24 | t3[g + 4] << 16 | t3[g + 2] << 8 | t3[g];
          }
        } else {
          var p = e3[0];
          const r3 = e3[1], i3 = e3[2];
          if (8 == h) for (A = 0; A < a2; A++) {
            var m = A << 2;
            g = 3 * A;
            c2[A] = 255 << 24 | t3[g + 2] << 16 | t3[g + 1] << 8 | t3[g], t3[g] == p && t3[g + 1] == r3 && t3[g + 2] == i3 && (l2[m + 3] = 0);
          }
          if (16 == h) for (A = 0; A < a2; A++) {
            m = A << 2, g = 6 * A;
            c2[A] = 255 << 24 | t3[g + 4] << 16 | t3[g + 2] << 8 | t3[g], d(t3, g) == p && d(t3, g + 2) == r3 && d(t3, g + 4) == i3 && (l2[m + 3] = 0);
          }
        }
      } else if (3 == u) {
        const e3 = o2.tabs.PLTE, s3 = o2.tabs.tRNS, c3 = s3 ? s3.length : 0;
        if (1 == h) for (var w = 0; w < i2; w++) {
          var v = w * f2, b = w * r2;
          for (A = 0; A < r2; A++) {
            m = b + A << 2;
            var y = 3 * (E = t3[v + (A >> 3)] >> 7 - ((7 & A) << 0) & 1);
            l2[m] = e3[y], l2[m + 1] = e3[y + 1], l2[m + 2] = e3[y + 2], l2[m + 3] = E < c3 ? s3[E] : 255;
          }
        }
        if (2 == h) for (w = 0; w < i2; w++) for (v = w * f2, b = w * r2, A = 0; A < r2; A++) {
          m = b + A << 2, y = 3 * (E = t3[v + (A >> 2)] >> 6 - ((3 & A) << 1) & 3);
          l2[m] = e3[y], l2[m + 1] = e3[y + 1], l2[m + 2] = e3[y + 2], l2[m + 3] = E < c3 ? s3[E] : 255;
        }
        if (4 == h) for (w = 0; w < i2; w++) for (v = w * f2, b = w * r2, A = 0; A < r2; A++) {
          m = b + A << 2, y = 3 * (E = t3[v + (A >> 1)] >> 4 - ((1 & A) << 2) & 15);
          l2[m] = e3[y], l2[m + 1] = e3[y + 1], l2[m + 2] = e3[y + 2], l2[m + 3] = E < c3 ? s3[E] : 255;
        }
        if (8 == h) for (A = 0; A < a2; A++) {
          var E;
          m = A << 2, y = 3 * (E = t3[A]);
          l2[m] = e3[y], l2[m + 1] = e3[y + 1], l2[m + 2] = e3[y + 2], l2[m + 3] = E < c3 ? s3[E] : 255;
        }
      } else if (4 == u) {
        if (8 == h) for (A = 0; A < a2; A++) {
          m = A << 2;
          var F = t3[_ = A << 1];
          l2[m] = F, l2[m + 1] = F, l2[m + 2] = F, l2[m + 3] = t3[_ + 1];
        }
        if (16 == h) for (A = 0; A < a2; A++) {
          var _;
          m = A << 2, F = t3[_ = A << 2];
          l2[m] = F, l2[m + 1] = F, l2[m + 2] = F, l2[m + 3] = t3[_ + 2];
        }
      } else if (0 == u) for (p = o2.tabs.tRNS ? o2.tabs.tRNS : -1, w = 0; w < i2; w++) {
        const e3 = w * f2, i3 = w * r2;
        if (1 == h) for (var B = 0; B < r2; B++) {
          var U = (F = 255 * (t3[e3 + (B >>> 3)] >>> 7 - (7 & B) & 1)) == 255 * p ? 0 : 255;
          c2[i3 + B] = U << 24 | F << 16 | F << 8 | F;
        }
        else if (2 == h) for (B = 0; B < r2; B++) {
          U = (F = 85 * (t3[e3 + (B >>> 2)] >>> 6 - ((3 & B) << 1) & 3)) == 85 * p ? 0 : 255;
          c2[i3 + B] = U << 24 | F << 16 | F << 8 | F;
        }
        else if (4 == h) for (B = 0; B < r2; B++) {
          U = (F = 17 * (t3[e3 + (B >>> 1)] >>> 4 - ((1 & B) << 2) & 15)) == 17 * p ? 0 : 255;
          c2[i3 + B] = U << 24 | F << 16 | F << 8 | F;
        }
        else if (8 == h) for (B = 0; B < r2; B++) {
          U = (F = t3[e3 + B]) == p ? 0 : 255;
          c2[i3 + B] = U << 24 | F << 16 | F << 8 | F;
        }
        else if (16 == h) for (B = 0; B < r2; B++) {
          F = t3[e3 + (B << 1)], U = d(t3, e3 + (B << 1)) == p ? 0 : 255;
          c2[i3 + B] = U << 24 | F << 16 | F << 8 | F;
        }
      }
      return l2;
    }
    function _decompress(e3, r2, i2, o2) {
      const a2 = _getBPP(e3), s2 = Math.ceil(i2 * a2 / 8), f2 = new Uint8Array((s2 + 1 + e3.interlace) * o2);
      return r2 = e3.tabs.CgBI ? t2(r2, f2) : _inflate(r2, f2), 0 == e3.interlace ? r2 = _filterZero(r2, e3, 0, i2, o2) : 1 == e3.interlace && (r2 = (function _readInterlace(e4, t3) {
        const r3 = t3.width, i3 = t3.height, o3 = _getBPP(t3), a3 = o3 >> 3, s3 = Math.ceil(r3 * o3 / 8), f3 = new Uint8Array(i3 * s3);
        let l2 = 0;
        const c2 = [0, 0, 4, 0, 2, 0, 1], u = [0, 4, 0, 2, 0, 1, 0], h = [8, 8, 8, 4, 4, 2, 2], d = [8, 8, 4, 4, 2, 2, 1];
        let A = 0;
        for (; A < 7; ) {
          const p = h[A], m = d[A];
          let w = 0, v = 0, b = c2[A];
          for (; b < i3; ) b += p, v++;
          let y = u[A];
          for (; y < r3; ) y += m, w++;
          const E = Math.ceil(w * o3 / 8);
          _filterZero(e4, t3, l2, w, v);
          let F = 0, _ = c2[A];
          for (; _ < i3; ) {
            let t4 = u[A], i4 = l2 + F * E << 3;
            for (; t4 < r3; ) {
              var g;
              if (1 == o3) g = (g = e4[i4 >> 3]) >> 7 - (7 & i4) & 1, f3[_ * s3 + (t4 >> 3)] |= g << 7 - ((7 & t4) << 0);
              if (2 == o3) g = (g = e4[i4 >> 3]) >> 6 - (7 & i4) & 3, f3[_ * s3 + (t4 >> 2)] |= g << 6 - ((3 & t4) << 1);
              if (4 == o3) g = (g = e4[i4 >> 3]) >> 4 - (7 & i4) & 15, f3[_ * s3 + (t4 >> 1)] |= g << 4 - ((1 & t4) << 2);
              if (o3 >= 8) {
                const r4 = _ * s3 + t4 * a3;
                for (let t5 = 0; t5 < a3; t5++) f3[r4 + t5] = e4[(i4 >> 3) + t5];
              }
              i4 += o3, t4 += m;
            }
            F++, _ += p;
          }
          w * v != 0 && (l2 += v * (1 + E)), A += 1;
        }
        return f3;
      })(r2, e3)), r2;
    }
    function _inflate(e3, r2) {
      return t2(new Uint8Array(e3.buffer, 2, e3.length - 6), r2);
    }
    var t2 = (function() {
      const e3 = { H: {} };
      return e3.H.N = function(t3, r2) {
        const i2 = Uint8Array;
        let o2, a2, s2 = 0, f2 = 0, l2 = 0, c2 = 0, u = 0, h = 0, d = 0, A = 0, g = 0;
        if (3 == t3[0] && 0 == t3[1]) return r2 || new i2(0);
        const p = e3.H, m = p.b, w = p.e, v = p.R, b = p.n, y = p.A, E = p.Z, F = p.m, _ = null == r2;
        for (_ && (r2 = new i2(t3.length >>> 2 << 5)); 0 == s2; ) if (s2 = m(t3, g, 1), f2 = m(t3, g + 1, 2), g += 3, 0 != f2) {
          if (_ && (r2 = e3.H.W(r2, A + (1 << 17))), 1 == f2 && (o2 = F.J, a2 = F.h, h = 511, d = 31), 2 == f2) {
            l2 = w(t3, g, 5) + 257, c2 = w(t3, g + 5, 5) + 1, u = w(t3, g + 10, 4) + 4, g += 14;
            let e4 = 1;
            for (var B = 0; B < 38; B += 2) F.Q[B] = 0, F.Q[B + 1] = 0;
            for (B = 0; B < u; B++) {
              const r4 = w(t3, g + 3 * B, 3);
              F.Q[1 + (F.X[B] << 1)] = r4, r4 > e4 && (e4 = r4);
            }
            g += 3 * u, b(F.Q, e4), y(F.Q, e4, F.u), o2 = F.w, a2 = F.d, g = v(F.u, (1 << e4) - 1, l2 + c2, t3, g, F.v);
            const r3 = p.V(F.v, 0, l2, F.C);
            h = (1 << r3) - 1;
            const i3 = p.V(F.v, l2, c2, F.D);
            d = (1 << i3) - 1, b(F.C, r3), y(F.C, r3, o2), b(F.D, i3), y(F.D, i3, a2);
          }
          for (; ; ) {
            const e4 = o2[E(t3, g) & h];
            g += 15 & e4;
            const i3 = e4 >>> 4;
            if (i3 >>> 8 == 0) r2[A++] = i3;
            else {
              if (256 == i3) break;
              {
                let e5 = A + i3 - 254;
                if (i3 > 264) {
                  const r3 = F.q[i3 - 257];
                  e5 = A + (r3 >>> 3) + w(t3, g, 7 & r3), g += 7 & r3;
                }
                const o3 = a2[E(t3, g) & d];
                g += 15 & o3;
                const s3 = o3 >>> 4, f3 = F.c[s3], l3 = (f3 >>> 4) + m(t3, g, 15 & f3);
                for (g += 15 & f3; A < e5; ) r2[A] = r2[A++ - l3], r2[A] = r2[A++ - l3], r2[A] = r2[A++ - l3], r2[A] = r2[A++ - l3];
                A = e5;
              }
            }
          }
        } else {
          0 != (7 & g) && (g += 8 - (7 & g));
          const o3 = 4 + (g >>> 3), a3 = t3[o3 - 4] | t3[o3 - 3] << 8;
          _ && (r2 = e3.H.W(r2, A + a3)), r2.set(new i2(t3.buffer, t3.byteOffset + o3, a3), A), g = o3 + a3 << 3, A += a3;
        }
        return r2.length == A ? r2 : r2.slice(0, A);
      }, e3.H.W = function(e4, t3) {
        const r2 = e4.length;
        if (t3 <= r2) return e4;
        const i2 = new Uint8Array(r2 << 1);
        return i2.set(e4, 0), i2;
      }, e3.H.R = function(t3, r2, i2, o2, a2, s2) {
        const f2 = e3.H.e, l2 = e3.H.Z;
        let c2 = 0;
        for (; c2 < i2; ) {
          const e4 = t3[l2(o2, a2) & r2];
          a2 += 15 & e4;
          const i3 = e4 >>> 4;
          if (i3 <= 15) s2[c2] = i3, c2++;
          else {
            let e5 = 0, t4 = 0;
            16 == i3 ? (t4 = 3 + f2(o2, a2, 2), a2 += 2, e5 = s2[c2 - 1]) : 17 == i3 ? (t4 = 3 + f2(o2, a2, 3), a2 += 3) : 18 == i3 && (t4 = 11 + f2(o2, a2, 7), a2 += 7);
            const r3 = c2 + t4;
            for (; c2 < r3; ) s2[c2] = e5, c2++;
          }
        }
        return a2;
      }, e3.H.V = function(e4, t3, r2, i2) {
        let o2 = 0, a2 = 0;
        const s2 = i2.length >>> 1;
        for (; a2 < r2; ) {
          const r3 = e4[a2 + t3];
          i2[a2 << 1] = 0, i2[1 + (a2 << 1)] = r3, r3 > o2 && (o2 = r3), a2++;
        }
        for (; a2 < s2; ) i2[a2 << 1] = 0, i2[1 + (a2 << 1)] = 0, a2++;
        return o2;
      }, e3.H.n = function(t3, r2) {
        const i2 = e3.H.m, o2 = t3.length;
        let a2, s2, f2;
        let l2;
        const c2 = i2.j;
        for (var u = 0; u <= r2; u++) c2[u] = 0;
        for (u = 1; u < o2; u += 2) c2[t3[u]]++;
        const h = i2.K;
        for (a2 = 0, c2[0] = 0, s2 = 1; s2 <= r2; s2++) a2 = a2 + c2[s2 - 1] << 1, h[s2] = a2;
        for (f2 = 0; f2 < o2; f2 += 2) l2 = t3[f2 + 1], 0 != l2 && (t3[f2] = h[l2], h[l2]++);
      }, e3.H.A = function(t3, r2, i2) {
        const o2 = t3.length, a2 = e3.H.m.r;
        for (let e4 = 0; e4 < o2; e4 += 2) if (0 != t3[e4 + 1]) {
          const o3 = e4 >> 1, s2 = t3[e4 + 1], f2 = o3 << 4 | s2, l2 = r2 - s2;
          let c2 = t3[e4] << l2;
          const u = c2 + (1 << l2);
          for (; c2 != u; ) {
            i2[a2[c2] >>> 15 - r2] = f2, c2++;
          }
        }
      }, e3.H.l = function(t3, r2) {
        const i2 = e3.H.m.r, o2 = 15 - r2;
        for (let e4 = 0; e4 < t3.length; e4 += 2) {
          const a2 = t3[e4] << r2 - t3[e4 + 1];
          t3[e4] = i2[a2] >>> o2;
        }
      }, e3.H.M = function(e4, t3, r2) {
        r2 <<= 7 & t3;
        const i2 = t3 >>> 3;
        e4[i2] |= r2, e4[i2 + 1] |= r2 >>> 8;
      }, e3.H.I = function(e4, t3, r2) {
        r2 <<= 7 & t3;
        const i2 = t3 >>> 3;
        e4[i2] |= r2, e4[i2 + 1] |= r2 >>> 8, e4[i2 + 2] |= r2 >>> 16;
      }, e3.H.e = function(e4, t3, r2) {
        return (e4[t3 >>> 3] | e4[1 + (t3 >>> 3)] << 8) >>> (7 & t3) & (1 << r2) - 1;
      }, e3.H.b = function(e4, t3, r2) {
        return (e4[t3 >>> 3] | e4[1 + (t3 >>> 3)] << 8 | e4[2 + (t3 >>> 3)] << 16) >>> (7 & t3) & (1 << r2) - 1;
      }, e3.H.Z = function(e4, t3) {
        return (e4[t3 >>> 3] | e4[1 + (t3 >>> 3)] << 8 | e4[2 + (t3 >>> 3)] << 16) >>> (7 & t3);
      }, e3.H.i = function(e4, t3) {
        return (e4[t3 >>> 3] | e4[1 + (t3 >>> 3)] << 8 | e4[2 + (t3 >>> 3)] << 16 | e4[3 + (t3 >>> 3)] << 24) >>> (7 & t3);
      }, e3.H.m = (function() {
        const e4 = Uint16Array, t3 = Uint32Array;
        return { K: new e4(16), j: new e4(16), X: [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], S: [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 999, 999, 999], T: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0], q: new e4(32), p: [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 65535, 65535], z: [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0], c: new t3(32), J: new e4(512), _: [], h: new e4(32), $: [], w: new e4(32768), C: [], v: [], d: new e4(32768), D: [], u: new e4(512), Q: [], r: new e4(32768), s: new t3(286), Y: new t3(30), a: new t3(19), t: new t3(15e3), k: new e4(65536), g: new e4(32768) };
      })(), (function() {
        const t3 = e3.H.m;
        for (var r2 = 0; r2 < 32768; r2++) {
          let e4 = r2;
          e4 = (2863311530 & e4) >>> 1 | (1431655765 & e4) << 1, e4 = (3435973836 & e4) >>> 2 | (858993459 & e4) << 2, e4 = (4042322160 & e4) >>> 4 | (252645135 & e4) << 4, e4 = (4278255360 & e4) >>> 8 | (16711935 & e4) << 8, t3.r[r2] = (e4 >>> 16 | e4 << 16) >>> 17;
        }
        function n(e4, t4, r3) {
          for (; 0 != t4--; ) e4.push(0, r3);
        }
        for (r2 = 0; r2 < 32; r2++) t3.q[r2] = t3.S[r2] << 3 | t3.T[r2], t3.c[r2] = t3.p[r2] << 4 | t3.z[r2];
        n(t3._, 144, 8), n(t3._, 112, 9), n(t3._, 24, 7), n(t3._, 8, 8), e3.H.n(t3._, 9), e3.H.A(t3._, 9, t3.J), e3.H.l(t3._, 9), n(t3.$, 32, 5), e3.H.n(t3.$, 5), e3.H.A(t3.$, 5, t3.h), e3.H.l(t3.$, 5), n(t3.Q, 19, 0), n(t3.C, 286, 0), n(t3.D, 30, 0), n(t3.v, 320, 0);
      })(), e3.H.N;
    })();
    function _getBPP(e3) {
      return [1, null, 3, 1, 2, null, 4][e3.ctype] * e3.depth;
    }
    function _filterZero(e3, t3, r2, i2, o2) {
      let a2 = _getBPP(t3);
      const s2 = Math.ceil(i2 * a2 / 8);
      let f2, l2;
      a2 = Math.ceil(a2 / 8);
      let c2 = e3[r2], u = 0;
      if (c2 > 1 && (e3[r2] = [0, 0, 1][c2 - 2]), 3 == c2) for (u = a2; u < s2; u++) e3[u + 1] = e3[u + 1] + (e3[u + 1 - a2] >>> 1) & 255;
      for (let t4 = 0; t4 < o2; t4++) if (f2 = r2 + t4 * s2, l2 = f2 + t4 + 1, c2 = e3[l2 - 1], u = 0, 0 == c2) for (; u < s2; u++) e3[f2 + u] = e3[l2 + u];
      else if (1 == c2) {
        for (; u < a2; u++) e3[f2 + u] = e3[l2 + u];
        for (; u < s2; u++) e3[f2 + u] = e3[l2 + u] + e3[f2 + u - a2];
      } else if (2 == c2) for (; u < s2; u++) e3[f2 + u] = e3[l2 + u] + e3[f2 + u - s2];
      else if (3 == c2) {
        for (; u < a2; u++) e3[f2 + u] = e3[l2 + u] + (e3[f2 + u - s2] >>> 1);
        for (; u < s2; u++) e3[f2 + u] = e3[l2 + u] + (e3[f2 + u - s2] + e3[f2 + u - a2] >>> 1);
      } else {
        for (; u < a2; u++) e3[f2 + u] = e3[l2 + u] + _paeth(0, e3[f2 + u - s2], 0);
        for (; u < s2; u++) e3[f2 + u] = e3[l2 + u] + _paeth(e3[f2 + u - a2], e3[f2 + u - s2], e3[f2 + u - a2 - s2]);
      }
      return e3;
    }
    function _paeth(e3, t3, r2) {
      const i2 = e3 + t3 - r2, o2 = i2 - e3, a2 = i2 - t3, s2 = i2 - r2;
      return o2 * o2 <= a2 * a2 && o2 * o2 <= s2 * s2 ? e3 : a2 * a2 <= s2 * s2 ? t3 : r2;
    }
    function _IHDR(t3, r2, i2) {
      i2.width = e2.readUint(t3, r2), r2 += 4, i2.height = e2.readUint(t3, r2), r2 += 4, i2.depth = t3[r2], r2++, i2.ctype = t3[r2], r2++, i2.compress = t3[r2], r2++, i2.filter = t3[r2], r2++, i2.interlace = t3[r2], r2++;
    }
    function _copyTile(e3, t3, r2, i2, o2, a2, s2, f2, l2) {
      const c2 = Math.min(t3, o2), u = Math.min(r2, a2);
      let h = 0, d = 0;
      for (let r3 = 0; r3 < u; r3++) for (let a3 = 0; a3 < c2; a3++) if (s2 >= 0 && f2 >= 0 ? (h = r3 * t3 + a3 << 2, d = (f2 + r3) * o2 + s2 + a3 << 2) : (h = (-f2 + r3) * t3 - s2 + a3 << 2, d = r3 * o2 + a3 << 2), 0 == l2) i2[d] = e3[h], i2[d + 1] = e3[h + 1], i2[d + 2] = e3[h + 2], i2[d + 3] = e3[h + 3];
      else if (1 == l2) {
        var A = e3[h + 3] * (1 / 255), g = e3[h] * A, p = e3[h + 1] * A, m = e3[h + 2] * A, w = i2[d + 3] * (1 / 255), v = i2[d] * w, b = i2[d + 1] * w, y = i2[d + 2] * w;
        const t4 = 1 - A, r4 = A + w * t4, o3 = 0 == r4 ? 0 : 1 / r4;
        i2[d + 3] = 255 * r4, i2[d + 0] = (g + v * t4) * o3, i2[d + 1] = (p + b * t4) * o3, i2[d + 2] = (m + y * t4) * o3;
      } else if (2 == l2) {
        A = e3[h + 3], g = e3[h], p = e3[h + 1], m = e3[h + 2], w = i2[d + 3], v = i2[d], b = i2[d + 1], y = i2[d + 2];
        A == w && g == v && p == b && m == y ? (i2[d] = 0, i2[d + 1] = 0, i2[d + 2] = 0, i2[d + 3] = 0) : (i2[d] = g, i2[d + 1] = p, i2[d + 2] = m, i2[d + 3] = A);
      } else if (3 == l2) {
        A = e3[h + 3], g = e3[h], p = e3[h + 1], m = e3[h + 2], w = i2[d + 3], v = i2[d], b = i2[d + 1], y = i2[d + 2];
        if (A == w && g == v && p == b && m == y) continue;
        if (A < 220 && w > 20) return false;
      }
      return true;
    }
    return { decode: function decode(r2) {
      const i2 = new Uint8Array(r2);
      let o2 = 8;
      const a2 = e2, s2 = a2.readUshort, f2 = a2.readUint, l2 = { tabs: {}, frames: [] }, c2 = new Uint8Array(i2.length);
      let u, h = 0, d = 0;
      const A = [137, 80, 78, 71, 13, 10, 26, 10];
      for (var g = 0; g < 8; g++) if (i2[g] != A[g]) throw "The input is not a PNG file!";
      for (; o2 < i2.length; ) {
        const e3 = a2.readUint(i2, o2);
        o2 += 4;
        const r3 = a2.readASCII(i2, o2, 4);
        if (o2 += 4, "IHDR" == r3) _IHDR(i2, o2, l2);
        else if ("iCCP" == r3) {
          for (var p = o2; 0 != i2[p]; ) p++;
          a2.readASCII(i2, o2, p - o2), i2[p + 1];
          const s3 = i2.slice(p + 2, o2 + e3);
          let f3 = null;
          try {
            f3 = _inflate(s3);
          } catch (e4) {
            f3 = t2(s3);
          }
          l2.tabs[r3] = f3;
        } else if ("CgBI" == r3) l2.tabs[r3] = i2.slice(o2, o2 + 4);
        else if ("IDAT" == r3) {
          for (g = 0; g < e3; g++) c2[h + g] = i2[o2 + g];
          h += e3;
        } else if ("acTL" == r3) l2.tabs[r3] = { num_frames: f2(i2, o2), num_plays: f2(i2, o2 + 4) }, u = new Uint8Array(i2.length);
        else if ("fcTL" == r3) {
          if (0 != d) (E = l2.frames[l2.frames.length - 1]).data = _decompress(l2, u.slice(0, d), E.rect.width, E.rect.height), d = 0;
          const e4 = { x: f2(i2, o2 + 12), y: f2(i2, o2 + 16), width: f2(i2, o2 + 4), height: f2(i2, o2 + 8) };
          let t3 = s2(i2, o2 + 22);
          t3 = s2(i2, o2 + 20) / (0 == t3 ? 100 : t3);
          const r4 = { rect: e4, delay: Math.round(1e3 * t3), dispose: i2[o2 + 24], blend: i2[o2 + 25] };
          l2.frames.push(r4);
        } else if ("fdAT" == r3) {
          for (g = 0; g < e3 - 4; g++) u[d + g] = i2[o2 + g + 4];
          d += e3 - 4;
        } else if ("pHYs" == r3) l2.tabs[r3] = [a2.readUint(i2, o2), a2.readUint(i2, o2 + 4), i2[o2 + 8]];
        else if ("cHRM" == r3) {
          l2.tabs[r3] = [];
          for (g = 0; g < 8; g++) l2.tabs[r3].push(a2.readUint(i2, o2 + 4 * g));
        } else if ("tEXt" == r3 || "zTXt" == r3) {
          null == l2.tabs[r3] && (l2.tabs[r3] = {});
          var m = a2.nextZero(i2, o2), w = a2.readASCII(i2, o2, m - o2), v = o2 + e3 - m - 1;
          if ("tEXt" == r3) y = a2.readASCII(i2, m + 1, v);
          else {
            var b = _inflate(i2.slice(m + 2, m + 2 + v));
            y = a2.readUTF8(b, 0, b.length);
          }
          l2.tabs[r3][w] = y;
        } else if ("iTXt" == r3) {
          null == l2.tabs[r3] && (l2.tabs[r3] = {});
          m = 0, p = o2;
          m = a2.nextZero(i2, p);
          w = a2.readASCII(i2, p, m - p);
          const t3 = i2[p = m + 1];
          var y;
          i2[p + 1], p += 2, m = a2.nextZero(i2, p), a2.readASCII(i2, p, m - p), p = m + 1, m = a2.nextZero(i2, p), a2.readUTF8(i2, p, m - p);
          v = e3 - ((p = m + 1) - o2);
          if (0 == t3) y = a2.readUTF8(i2, p, v);
          else {
            b = _inflate(i2.slice(p, p + v));
            y = a2.readUTF8(b, 0, b.length);
          }
          l2.tabs[r3][w] = y;
        } else if ("PLTE" == r3) l2.tabs[r3] = a2.readBytes(i2, o2, e3);
        else if ("hIST" == r3) {
          const e4 = l2.tabs.PLTE.length / 3;
          l2.tabs[r3] = [];
          for (g = 0; g < e4; g++) l2.tabs[r3].push(s2(i2, o2 + 2 * g));
        } else if ("tRNS" == r3) 3 == l2.ctype ? l2.tabs[r3] = a2.readBytes(i2, o2, e3) : 0 == l2.ctype ? l2.tabs[r3] = s2(i2, o2) : 2 == l2.ctype && (l2.tabs[r3] = [s2(i2, o2), s2(i2, o2 + 2), s2(i2, o2 + 4)]);
        else if ("gAMA" == r3) l2.tabs[r3] = a2.readUint(i2, o2) / 1e5;
        else if ("sRGB" == r3) l2.tabs[r3] = i2[o2];
        else if ("bKGD" == r3) 0 == l2.ctype || 4 == l2.ctype ? l2.tabs[r3] = [s2(i2, o2)] : 2 == l2.ctype || 6 == l2.ctype ? l2.tabs[r3] = [s2(i2, o2), s2(i2, o2 + 2), s2(i2, o2 + 4)] : 3 == l2.ctype && (l2.tabs[r3] = i2[o2]);
        else if ("IEND" == r3) break;
        o2 += e3, a2.readUint(i2, o2), o2 += 4;
      }
      var E;
      return 0 != d && ((E = l2.frames[l2.frames.length - 1]).data = _decompress(l2, u.slice(0, d), E.rect.width, E.rect.height)), l2.data = _decompress(l2, c2, l2.width, l2.height), delete l2.compress, delete l2.interlace, delete l2.filter, l2;
    }, toRGBA8: function toRGBA8(e3) {
      const t3 = e3.width, r2 = e3.height;
      if (null == e3.tabs.acTL) return [decodeImage(e3.data, t3, r2, e3).buffer];
      const i2 = [];
      null == e3.frames[0].data && (e3.frames[0].data = e3.data);
      const o2 = t3 * r2 * 4, a2 = new Uint8Array(o2), s2 = new Uint8Array(o2), f2 = new Uint8Array(o2);
      for (let c2 = 0; c2 < e3.frames.length; c2++) {
        const u = e3.frames[c2], h = u.rect.x, d = u.rect.y, A = u.rect.width, g = u.rect.height, p = decodeImage(u.data, A, g, e3);
        if (0 != c2) for (var l2 = 0; l2 < o2; l2++) f2[l2] = a2[l2];
        if (0 == u.blend ? _copyTile(p, A, g, a2, t3, r2, h, d, 0) : 1 == u.blend && _copyTile(p, A, g, a2, t3, r2, h, d, 1), i2.push(a2.buffer.slice(0)), 0 == u.dispose) ;
        else if (1 == u.dispose) _copyTile(s2, A, g, a2, t3, r2, h, d, 0);
        else if (2 == u.dispose) for (l2 = 0; l2 < o2; l2++) a2[l2] = f2[l2];
      }
      return i2;
    }, _paeth, _copyTile, _bin: e2 };
  })();
  !(function() {
    const { _copyTile: e2 } = UPNG, { _bin: t2 } = UPNG, r2 = UPNG._paeth;
    var i2 = { table: (function() {
      const e3 = new Uint32Array(256);
      for (let t3 = 0; t3 < 256; t3++) {
        let r3 = t3;
        for (let e4 = 0; e4 < 8; e4++) 1 & r3 ? r3 = 3988292384 ^ r3 >>> 1 : r3 >>>= 1;
        e3[t3] = r3;
      }
      return e3;
    })(), update(e3, t3, r3, o3) {
      for (let a2 = 0; a2 < o3; a2++) e3 = i2.table[255 & (e3 ^ t3[r3 + a2])] ^ e3 >>> 8;
      return e3;
    }, crc: (e3, t3, r3) => 4294967295 ^ i2.update(4294967295, e3, t3, r3) };
    function addErr(e3, t3, r3, i3) {
      t3[r3] += e3[0] * i3 >> 4, t3[r3 + 1] += e3[1] * i3 >> 4, t3[r3 + 2] += e3[2] * i3 >> 4, t3[r3 + 3] += e3[3] * i3 >> 4;
    }
    function N(e3) {
      return Math.max(0, Math.min(255, e3));
    }
    function D(e3, t3) {
      const r3 = e3[0] - t3[0], i3 = e3[1] - t3[1], o3 = e3[2] - t3[2], a2 = e3[3] - t3[3];
      return r3 * r3 + i3 * i3 + o3 * o3 + a2 * a2;
    }
    function dither(e3, t3, r3, i3, o3, a2, s2) {
      null == s2 && (s2 = 1);
      const f2 = i3.length, l2 = [];
      for (var c2 = 0; c2 < f2; c2++) {
        const e4 = i3[c2];
        l2.push([e4 >>> 0 & 255, e4 >>> 8 & 255, e4 >>> 16 & 255, e4 >>> 24 & 255]);
      }
      for (c2 = 0; c2 < f2; c2++) {
        let e4 = 4294967295;
        for (var u = 0, h = 0; h < f2; h++) {
          var d = D(l2[c2], l2[h]);
          h != c2 && d < e4 && (e4 = d, u = h);
        }
      }
      const A = new Uint32Array(o3.buffer), g = new Int16Array(t3 * r3 * 4), p = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
      for (c2 = 0; c2 < p.length; c2++) p[c2] = 255 * ((p[c2] + 0.5) / 16 - 0.5);
      for (let o4 = 0; o4 < r3; o4++) for (let w = 0; w < t3; w++) {
        var m;
        c2 = 4 * (o4 * t3 + w);
        if (2 != s2) m = [N(e3[c2] + g[c2]), N(e3[c2 + 1] + g[c2 + 1]), N(e3[c2 + 2] + g[c2 + 2]), N(e3[c2 + 3] + g[c2 + 3])];
        else {
          d = p[4 * (3 & o4) + (3 & w)];
          m = [N(e3[c2] + d), N(e3[c2 + 1] + d), N(e3[c2 + 2] + d), N(e3[c2 + 3] + d)];
        }
        u = 0;
        let v = 16777215;
        for (h = 0; h < f2; h++) {
          const e4 = D(m, l2[h]);
          e4 < v && (v = e4, u = h);
        }
        const b = l2[u], y = [m[0] - b[0], m[1] - b[1], m[2] - b[2], m[3] - b[3]];
        1 == s2 && (w != t3 - 1 && addErr(y, g, c2 + 4, 7), o4 != r3 - 1 && (0 != w && addErr(y, g, c2 + 4 * t3 - 4, 3), addErr(y, g, c2 + 4 * t3, 5), w != t3 - 1 && addErr(y, g, c2 + 4 * t3 + 4, 1))), a2[c2 >> 2] = u, A[c2 >> 2] = i3[u];
      }
    }
    function _main(e3, r3, o3, a2, s2) {
      null == s2 && (s2 = {});
      const { crc: f2 } = i2, l2 = t2.writeUint, c2 = t2.writeUshort, u = t2.writeASCII;
      let h = 8;
      const d = e3.frames.length > 1;
      let A, g = false, p = 33 + (d ? 20 : 0);
      if (null != s2.sRGB && (p += 13), null != s2.pHYs && (p += 21), null != s2.iCCP && (A = pako.deflate(s2.iCCP), p += 21 + A.length + 4), 3 == e3.ctype) {
        for (var m = e3.plte.length, w = 0; w < m; w++) e3.plte[w] >>> 24 != 255 && (g = true);
        p += 8 + 3 * m + 4 + (g ? 8 + 1 * m + 4 : 0);
      }
      for (var v = 0; v < e3.frames.length; v++) {
        d && (p += 38), p += (F = e3.frames[v]).cimg.length + 12, 0 != v && (p += 4);
      }
      p += 12;
      const b = new Uint8Array(p), y = [137, 80, 78, 71, 13, 10, 26, 10];
      for (w = 0; w < 8; w++) b[w] = y[w];
      if (l2(b, h, 13), h += 4, u(b, h, "IHDR"), h += 4, l2(b, h, r3), h += 4, l2(b, h, o3), h += 4, b[h] = e3.depth, h++, b[h] = e3.ctype, h++, b[h] = 0, h++, b[h] = 0, h++, b[h] = 0, h++, l2(b, h, f2(b, h - 17, 17)), h += 4, null != s2.sRGB && (l2(b, h, 1), h += 4, u(b, h, "sRGB"), h += 4, b[h] = s2.sRGB, h++, l2(b, h, f2(b, h - 5, 5)), h += 4), null != s2.iCCP) {
        const e4 = 13 + A.length;
        l2(b, h, e4), h += 4, u(b, h, "iCCP"), h += 4, u(b, h, "ICC profile"), h += 11, h += 2, b.set(A, h), h += A.length, l2(b, h, f2(b, h - (e4 + 4), e4 + 4)), h += 4;
      }
      if (null != s2.pHYs && (l2(b, h, 9), h += 4, u(b, h, "pHYs"), h += 4, l2(b, h, s2.pHYs[0]), h += 4, l2(b, h, s2.pHYs[1]), h += 4, b[h] = s2.pHYs[2], h++, l2(b, h, f2(b, h - 13, 13)), h += 4), d && (l2(b, h, 8), h += 4, u(b, h, "acTL"), h += 4, l2(b, h, e3.frames.length), h += 4, l2(b, h, null != s2.loop ? s2.loop : 0), h += 4, l2(b, h, f2(b, h - 12, 12)), h += 4), 3 == e3.ctype) {
        l2(b, h, 3 * (m = e3.plte.length)), h += 4, u(b, h, "PLTE"), h += 4;
        for (w = 0; w < m; w++) {
          const t3 = 3 * w, r4 = e3.plte[w], i3 = 255 & r4, o4 = r4 >>> 8 & 255, a3 = r4 >>> 16 & 255;
          b[h + t3 + 0] = i3, b[h + t3 + 1] = o4, b[h + t3 + 2] = a3;
        }
        if (h += 3 * m, l2(b, h, f2(b, h - 3 * m - 4, 3 * m + 4)), h += 4, g) {
          l2(b, h, m), h += 4, u(b, h, "tRNS"), h += 4;
          for (w = 0; w < m; w++) b[h + w] = e3.plte[w] >>> 24 & 255;
          h += m, l2(b, h, f2(b, h - m - 4, m + 4)), h += 4;
        }
      }
      let E = 0;
      for (v = 0; v < e3.frames.length; v++) {
        var F = e3.frames[v];
        d && (l2(b, h, 26), h += 4, u(b, h, "fcTL"), h += 4, l2(b, h, E++), h += 4, l2(b, h, F.rect.width), h += 4, l2(b, h, F.rect.height), h += 4, l2(b, h, F.rect.x), h += 4, l2(b, h, F.rect.y), h += 4, c2(b, h, a2[v]), h += 2, c2(b, h, 1e3), h += 2, b[h] = F.dispose, h++, b[h] = F.blend, h++, l2(b, h, f2(b, h - 30, 30)), h += 4);
        const t3 = F.cimg;
        l2(b, h, (m = t3.length) + (0 == v ? 0 : 4)), h += 4;
        const r4 = h;
        u(b, h, 0 == v ? "IDAT" : "fdAT"), h += 4, 0 != v && (l2(b, h, E++), h += 4), b.set(t3, h), h += m, l2(b, h, f2(b, r4, h - r4)), h += 4;
      }
      return l2(b, h, 0), h += 4, u(b, h, "IEND"), h += 4, l2(b, h, f2(b, h - 4, 4)), h += 4, b.buffer;
    }
    function compressPNG(e3, t3, r3) {
      for (let i3 = 0; i3 < e3.frames.length; i3++) {
        const o3 = e3.frames[i3];
        o3.rect.width;
        const a2 = o3.rect.height, s2 = new Uint8Array(a2 * o3.bpl + a2);
        o3.cimg = _filterZero(o3.img, a2, o3.bpp, o3.bpl, s2, t3, r3);
      }
    }
    function compress2(t3, r3, i3, o3, a2) {
      const s2 = a2[0], f2 = a2[1], l2 = a2[2], c2 = a2[3], u = a2[4], h = a2[5];
      let d = 6, A = 8, g = 255;
      for (var p = 0; p < t3.length; p++) {
        const e3 = new Uint8Array(t3[p]);
        for (var m = e3.length, w = 0; w < m; w += 4) g &= e3[w + 3];
      }
      const v = 255 != g, b = (function framize(t4, r4, i4, o4, a3, s3) {
        const f3 = [];
        for (var l3 = 0; l3 < t4.length; l3++) {
          const h3 = new Uint8Array(t4[l3]), A3 = new Uint32Array(h3.buffer);
          var c3;
          let g2 = 0, p2 = 0, m2 = r4, w2 = i4, v2 = o4 ? 1 : 0;
          if (0 != l3) {
            const b2 = s3 || o4 || 1 == l3 || 0 != f3[l3 - 2].dispose ? 1 : 2;
            let y2 = 0, E2 = 1e9;
            for (let e3 = 0; e3 < b2; e3++) {
              var u2 = new Uint8Array(t4[l3 - 1 - e3]);
              const o5 = new Uint32Array(t4[l3 - 1 - e3]);
              let s4 = r4, f4 = i4, c4 = -1, h4 = -1;
              for (let e4 = 0; e4 < i4; e4++) for (let t5 = 0; t5 < r4; t5++) {
                A3[d2 = e4 * r4 + t5] != o5[d2] && (t5 < s4 && (s4 = t5), t5 > c4 && (c4 = t5), e4 < f4 && (f4 = e4), e4 > h4 && (h4 = e4));
              }
              -1 == c4 && (s4 = f4 = c4 = h4 = 0), a3 && (1 == (1 & s4) && s4--, 1 == (1 & f4) && f4--);
              const v3 = (c4 - s4 + 1) * (h4 - f4 + 1);
              v3 < E2 && (E2 = v3, y2 = e3, g2 = s4, p2 = f4, m2 = c4 - s4 + 1, w2 = h4 - f4 + 1);
            }
            u2 = new Uint8Array(t4[l3 - 1 - y2]);
            1 == y2 && (f3[l3 - 1].dispose = 2), c3 = new Uint8Array(m2 * w2 * 4), e2(u2, r4, i4, c3, m2, w2, -g2, -p2, 0), v2 = e2(h3, r4, i4, c3, m2, w2, -g2, -p2, 3) ? 1 : 0, 1 == v2 ? _prepareDiff(h3, r4, i4, c3, { x: g2, y: p2, width: m2, height: w2 }) : e2(h3, r4, i4, c3, m2, w2, -g2, -p2, 0);
          } else c3 = h3.slice(0);
          f3.push({ rect: { x: g2, y: p2, width: m2, height: w2 }, img: c3, blend: v2, dispose: 0 });
        }
        if (o4) for (l3 = 0; l3 < f3.length; l3++) {
          if (1 == (A2 = f3[l3]).blend) continue;
          const e3 = A2.rect, o5 = f3[l3 - 1].rect, s4 = Math.min(e3.x, o5.x), c4 = Math.min(e3.y, o5.y), u3 = { x: s4, y: c4, width: Math.max(e3.x + e3.width, o5.x + o5.width) - s4, height: Math.max(e3.y + e3.height, o5.y + o5.height) - c4 };
          f3[l3 - 1].dispose = 1, l3 - 1 != 0 && _updateFrame(t4, r4, i4, f3, l3 - 1, u3, a3), _updateFrame(t4, r4, i4, f3, l3, u3, a3);
        }
        let h2 = 0;
        if (1 != t4.length) for (var d2 = 0; d2 < f3.length; d2++) {
          var A2;
          h2 += (A2 = f3[d2]).rect.width * A2.rect.height;
        }
        return f3;
      })(t3, r3, i3, s2, f2, l2), y = {}, E = [], F = [];
      if (0 != o3) {
        const e3 = [];
        for (w = 0; w < b.length; w++) e3.push(b[w].img.buffer);
        const t4 = (function concatRGBA(e4) {
          let t5 = 0;
          for (var r5 = 0; r5 < e4.length; r5++) t5 += e4[r5].byteLength;
          const i5 = new Uint8Array(t5);
          let o4 = 0;
          for (r5 = 0; r5 < e4.length; r5++) {
            const t6 = new Uint8Array(e4[r5]), a3 = t6.length;
            for (let e5 = 0; e5 < a3; e5 += 4) {
              let r6 = t6[e5], a4 = t6[e5 + 1], s3 = t6[e5 + 2];
              const f3 = t6[e5 + 3];
              0 == f3 && (r6 = a4 = s3 = 0), i5[o4 + e5] = r6, i5[o4 + e5 + 1] = a4, i5[o4 + e5 + 2] = s3, i5[o4 + e5 + 3] = f3;
            }
            o4 += a3;
          }
          return i5.buffer;
        })(e3), r4 = quantize(t4, o3);
        for (w = 0; w < r4.plte.length; w++) E.push(r4.plte[w].est.rgba);
        let i4 = 0;
        for (w = 0; w < b.length; w++) {
          const e4 = (B = b[w]).img.length;
          var _ = new Uint8Array(r4.inds.buffer, i4 >> 2, e4 >> 2);
          F.push(_);
          const t5 = new Uint8Array(r4.abuf, i4, e4);
          h && dither(B.img, B.rect.width, B.rect.height, E, t5, _), B.img.set(t5), i4 += e4;
        }
      } else for (p = 0; p < b.length; p++) {
        var B = b[p];
        const e3 = new Uint32Array(B.img.buffer);
        var U = B.rect.width;
        m = e3.length, _ = new Uint8Array(m);
        F.push(_);
        for (w = 0; w < m; w++) {
          const t4 = e3[w];
          if (0 != w && t4 == e3[w - 1]) _[w] = _[w - 1];
          else if (w > U && t4 == e3[w - U]) _[w] = _[w - U];
          else {
            let e4 = y[t4];
            if (null == e4 && (y[t4] = e4 = E.length, E.push(t4), E.length >= 300)) break;
            _[w] = e4;
          }
        }
      }
      const C = E.length;
      C <= 256 && 0 == u && (A = C <= 2 ? 1 : C <= 4 ? 2 : C <= 16 ? 4 : 8, A = Math.max(A, c2));
      for (p = 0; p < b.length; p++) {
        (B = b[p]).rect.x, B.rect.y;
        U = B.rect.width;
        const e3 = B.rect.height;
        let t4 = B.img;
        new Uint32Array(t4.buffer);
        let r4 = 4 * U, i4 = 4;
        if (C <= 256 && 0 == u) {
          r4 = Math.ceil(A * U / 8);
          var I = new Uint8Array(r4 * e3);
          const o4 = F[p];
          for (let t5 = 0; t5 < e3; t5++) {
            w = t5 * r4;
            const e4 = t5 * U;
            if (8 == A) for (var Q = 0; Q < U; Q++) I[w + Q] = o4[e4 + Q];
            else if (4 == A) for (Q = 0; Q < U; Q++) I[w + (Q >> 1)] |= o4[e4 + Q] << 4 - 4 * (1 & Q);
            else if (2 == A) for (Q = 0; Q < U; Q++) I[w + (Q >> 2)] |= o4[e4 + Q] << 6 - 2 * (3 & Q);
            else if (1 == A) for (Q = 0; Q < U; Q++) I[w + (Q >> 3)] |= o4[e4 + Q] << 7 - 1 * (7 & Q);
          }
          t4 = I, d = 3, i4 = 1;
        } else if (0 == v && 1 == b.length) {
          I = new Uint8Array(U * e3 * 3);
          const o4 = U * e3;
          for (w = 0; w < o4; w++) {
            const e4 = 3 * w, r5 = 4 * w;
            I[e4] = t4[r5], I[e4 + 1] = t4[r5 + 1], I[e4 + 2] = t4[r5 + 2];
          }
          t4 = I, d = 2, i4 = 3, r4 = 3 * U;
        }
        B.img = t4, B.bpl = r4, B.bpp = i4;
      }
      return { ctype: d, depth: A, plte: E, frames: b };
    }
    function _updateFrame(t3, r3, i3, o3, a2, s2, f2) {
      const l2 = Uint8Array, c2 = Uint32Array, u = new l2(t3[a2 - 1]), h = new c2(t3[a2 - 1]), d = a2 + 1 < t3.length ? new l2(t3[a2 + 1]) : null, A = new l2(t3[a2]), g = new c2(A.buffer);
      let p = r3, m = i3, w = -1, v = -1;
      for (let e3 = 0; e3 < s2.height; e3++) for (let t4 = 0; t4 < s2.width; t4++) {
        const i4 = s2.x + t4, f3 = s2.y + e3, l3 = f3 * r3 + i4, c3 = g[l3];
        0 == c3 || 0 == o3[a2 - 1].dispose && h[l3] == c3 && (null == d || 0 != d[4 * l3 + 3]) || (i4 < p && (p = i4), i4 > w && (w = i4), f3 < m && (m = f3), f3 > v && (v = f3));
      }
      -1 == w && (p = m = w = v = 0), f2 && (1 == (1 & p) && p--, 1 == (1 & m) && m--), s2 = { x: p, y: m, width: w - p + 1, height: v - m + 1 };
      const b = o3[a2];
      b.rect = s2, b.blend = 1, b.img = new Uint8Array(s2.width * s2.height * 4), 0 == o3[a2 - 1].dispose ? (e2(u, r3, i3, b.img, s2.width, s2.height, -s2.x, -s2.y, 0), _prepareDiff(A, r3, i3, b.img, s2)) : e2(A, r3, i3, b.img, s2.width, s2.height, -s2.x, -s2.y, 0);
    }
    function _prepareDiff(t3, r3, i3, o3, a2) {
      e2(t3, r3, i3, o3, a2.width, a2.height, -a2.x, -a2.y, 2);
    }
    function _filterZero(e3, t3, r3, i3, o3, a2, s2) {
      const f2 = [];
      let l2, c2 = [0, 1, 2, 3, 4];
      -1 != a2 ? c2 = [a2] : (t3 * i3 > 5e5 || 1 == r3) && (c2 = [0]), s2 && (l2 = { level: 0 });
      const u = UZIP;
      for (var h = 0; h < c2.length; h++) {
        for (let a3 = 0; a3 < t3; a3++) _filterLine(o3, e3, a3, i3, r3, c2[h]);
        f2.push(u.deflate(o3, l2));
      }
      let d, A = 1e9;
      for (h = 0; h < f2.length; h++) f2[h].length < A && (d = h, A = f2[h].length);
      return f2[d];
    }
    function _filterLine(e3, t3, i3, o3, a2, s2) {
      const f2 = i3 * o3;
      let l2 = f2 + i3;
      if (e3[l2] = s2, l2++, 0 == s2) if (o3 < 500) for (var c2 = 0; c2 < o3; c2++) e3[l2 + c2] = t3[f2 + c2];
      else e3.set(new Uint8Array(t3.buffer, f2, o3), l2);
      else if (1 == s2) {
        for (c2 = 0; c2 < a2; c2++) e3[l2 + c2] = t3[f2 + c2];
        for (c2 = a2; c2 < o3; c2++) e3[l2 + c2] = t3[f2 + c2] - t3[f2 + c2 - a2] + 256 & 255;
      } else if (0 == i3) {
        for (c2 = 0; c2 < a2; c2++) e3[l2 + c2] = t3[f2 + c2];
        if (2 == s2) for (c2 = a2; c2 < o3; c2++) e3[l2 + c2] = t3[f2 + c2];
        if (3 == s2) for (c2 = a2; c2 < o3; c2++) e3[l2 + c2] = t3[f2 + c2] - (t3[f2 + c2 - a2] >> 1) + 256 & 255;
        if (4 == s2) for (c2 = a2; c2 < o3; c2++) e3[l2 + c2] = t3[f2 + c2] - r2(t3[f2 + c2 - a2], 0, 0) + 256 & 255;
      } else {
        if (2 == s2) for (c2 = 0; c2 < o3; c2++) e3[l2 + c2] = t3[f2 + c2] + 256 - t3[f2 + c2 - o3] & 255;
        if (3 == s2) {
          for (c2 = 0; c2 < a2; c2++) e3[l2 + c2] = t3[f2 + c2] + 256 - (t3[f2 + c2 - o3] >> 1) & 255;
          for (c2 = a2; c2 < o3; c2++) e3[l2 + c2] = t3[f2 + c2] + 256 - (t3[f2 + c2 - o3] + t3[f2 + c2 - a2] >> 1) & 255;
        }
        if (4 == s2) {
          for (c2 = 0; c2 < a2; c2++) e3[l2 + c2] = t3[f2 + c2] + 256 - r2(0, t3[f2 + c2 - o3], 0) & 255;
          for (c2 = a2; c2 < o3; c2++) e3[l2 + c2] = t3[f2 + c2] + 256 - r2(t3[f2 + c2 - a2], t3[f2 + c2 - o3], t3[f2 + c2 - a2 - o3]) & 255;
        }
      }
    }
    function quantize(e3, t3) {
      const r3 = new Uint8Array(e3), i3 = r3.slice(0), o3 = new Uint32Array(i3.buffer), a2 = getKDtree(i3, t3), s2 = a2[0], f2 = a2[1], l2 = r3.length, c2 = new Uint8Array(l2 >> 2);
      let u;
      if (r3.length < 2e7) for (var h = 0; h < l2; h += 4) {
        u = getNearest(s2, d = r3[h] * (1 / 255), A = r3[h + 1] * (1 / 255), g = r3[h + 2] * (1 / 255), p = r3[h + 3] * (1 / 255)), c2[h >> 2] = u.ind, o3[h >> 2] = u.est.rgba;
      }
      else for (h = 0; h < l2; h += 4) {
        var d = r3[h] * (1 / 255), A = r3[h + 1] * (1 / 255), g = r3[h + 2] * (1 / 255), p = r3[h + 3] * (1 / 255);
        for (u = s2; u.left; ) u = planeDst(u.est, d, A, g, p) <= 0 ? u.left : u.right;
        c2[h >> 2] = u.ind, o3[h >> 2] = u.est.rgba;
      }
      return { abuf: i3.buffer, inds: c2, plte: f2 };
    }
    function getKDtree(e3, t3, r3) {
      null == r3 && (r3 = 1e-4);
      const i3 = new Uint32Array(e3.buffer), o3 = { i0: 0, i1: e3.length, bst: null, est: null, tdst: 0, left: null, right: null };
      o3.bst = stats(e3, o3.i0, o3.i1), o3.est = estats(o3.bst);
      const a2 = [o3];
      for (; a2.length < t3; ) {
        let t4 = 0, o4 = 0;
        for (var s2 = 0; s2 < a2.length; s2++) a2[s2].est.L > t4 && (t4 = a2[s2].est.L, o4 = s2);
        if (t4 < r3) break;
        const f2 = a2[o4], l2 = splitPixels(e3, i3, f2.i0, f2.i1, f2.est.e, f2.est.eMq255);
        if (f2.i0 >= l2 || f2.i1 <= l2) {
          f2.est.L = 0;
          continue;
        }
        const c2 = { i0: f2.i0, i1: l2, bst: null, est: null, tdst: 0, left: null, right: null };
        c2.bst = stats(e3, c2.i0, c2.i1), c2.est = estats(c2.bst);
        const u = { i0: l2, i1: f2.i1, bst: null, est: null, tdst: 0, left: null, right: null };
        u.bst = { R: [], m: [], N: f2.bst.N - c2.bst.N };
        for (s2 = 0; s2 < 16; s2++) u.bst.R[s2] = f2.bst.R[s2] - c2.bst.R[s2];
        for (s2 = 0; s2 < 4; s2++) u.bst.m[s2] = f2.bst.m[s2] - c2.bst.m[s2];
        u.est = estats(u.bst), f2.left = c2, f2.right = u, a2[o4] = c2, a2.push(u);
      }
      a2.sort(((e4, t4) => t4.bst.N - e4.bst.N));
      for (s2 = 0; s2 < a2.length; s2++) a2[s2].ind = s2;
      return [o3, a2];
    }
    function getNearest(e3, t3, r3, i3, o3) {
      if (null == e3.left) return e3.tdst = (function dist(e4, t4, r4, i4, o4) {
        const a3 = t4 - e4[0], s3 = r4 - e4[1], f3 = i4 - e4[2], l3 = o4 - e4[3];
        return a3 * a3 + s3 * s3 + f3 * f3 + l3 * l3;
      })(e3.est.q, t3, r3, i3, o3), e3;
      const a2 = planeDst(e3.est, t3, r3, i3, o3);
      let s2 = e3.left, f2 = e3.right;
      a2 > 0 && (s2 = e3.right, f2 = e3.left);
      const l2 = getNearest(s2, t3, r3, i3, o3);
      if (l2.tdst <= a2 * a2) return l2;
      const c2 = getNearest(f2, t3, r3, i3, o3);
      return c2.tdst < l2.tdst ? c2 : l2;
    }
    function planeDst(e3, t3, r3, i3, o3) {
      const { e: a2 } = e3;
      return a2[0] * t3 + a2[1] * r3 + a2[2] * i3 + a2[3] * o3 - e3.eMq;
    }
    function splitPixels(e3, t3, r3, i3, o3, a2) {
      for (i3 -= 4; r3 < i3; ) {
        for (; vecDot(e3, r3, o3) <= a2; ) r3 += 4;
        for (; vecDot(e3, i3, o3) > a2; ) i3 -= 4;
        if (r3 >= i3) break;
        const s2 = t3[r3 >> 2];
        t3[r3 >> 2] = t3[i3 >> 2], t3[i3 >> 2] = s2, r3 += 4, i3 -= 4;
      }
      for (; vecDot(e3, r3, o3) > a2; ) r3 -= 4;
      return r3 + 4;
    }
    function vecDot(e3, t3, r3) {
      return e3[t3] * r3[0] + e3[t3 + 1] * r3[1] + e3[t3 + 2] * r3[2] + e3[t3 + 3] * r3[3];
    }
    function stats(e3, t3, r3) {
      const i3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], o3 = [0, 0, 0, 0], a2 = r3 - t3 >> 2;
      for (let a3 = t3; a3 < r3; a3 += 4) {
        const t4 = e3[a3] * (1 / 255), r4 = e3[a3 + 1] * (1 / 255), s2 = e3[a3 + 2] * (1 / 255), f2 = e3[a3 + 3] * (1 / 255);
        o3[0] += t4, o3[1] += r4, o3[2] += s2, o3[3] += f2, i3[0] += t4 * t4, i3[1] += t4 * r4, i3[2] += t4 * s2, i3[3] += t4 * f2, i3[5] += r4 * r4, i3[6] += r4 * s2, i3[7] += r4 * f2, i3[10] += s2 * s2, i3[11] += s2 * f2, i3[15] += f2 * f2;
      }
      return i3[4] = i3[1], i3[8] = i3[2], i3[9] = i3[6], i3[12] = i3[3], i3[13] = i3[7], i3[14] = i3[11], { R: i3, m: o3, N: a2 };
    }
    function estats(e3) {
      const { R: t3 } = e3, { m: r3 } = e3, { N: i3 } = e3, a2 = r3[0], s2 = r3[1], f2 = r3[2], l2 = r3[3], c2 = 0 == i3 ? 0 : 1 / i3, u = [t3[0] - a2 * a2 * c2, t3[1] - a2 * s2 * c2, t3[2] - a2 * f2 * c2, t3[3] - a2 * l2 * c2, t3[4] - s2 * a2 * c2, t3[5] - s2 * s2 * c2, t3[6] - s2 * f2 * c2, t3[7] - s2 * l2 * c2, t3[8] - f2 * a2 * c2, t3[9] - f2 * s2 * c2, t3[10] - f2 * f2 * c2, t3[11] - f2 * l2 * c2, t3[12] - l2 * a2 * c2, t3[13] - l2 * s2 * c2, t3[14] - l2 * f2 * c2, t3[15] - l2 * l2 * c2], h = u, d = o2;
      let A = [Math.random(), Math.random(), Math.random(), Math.random()], g = 0, p = 0;
      if (0 != i3) for (let e4 = 0; e4 < 16 && (A = d.multVec(h, A), p = Math.sqrt(d.dot(A, A)), A = d.sml(1 / p, A), !(0 != e4 && Math.abs(p - g) < 1e-9)); e4++) g = p;
      const m = [a2 * c2, s2 * c2, f2 * c2, l2 * c2];
      return { Cov: u, q: m, e: A, L: g, eMq255: d.dot(d.sml(255, m), A), eMq: d.dot(A, m), rgba: (Math.round(255 * m[3]) << 24 | Math.round(255 * m[2]) << 16 | Math.round(255 * m[1]) << 8 | Math.round(255 * m[0]) << 0) >>> 0 };
    }
    var o2 = { multVec: (e3, t3) => [e3[0] * t3[0] + e3[1] * t3[1] + e3[2] * t3[2] + e3[3] * t3[3], e3[4] * t3[0] + e3[5] * t3[1] + e3[6] * t3[2] + e3[7] * t3[3], e3[8] * t3[0] + e3[9] * t3[1] + e3[10] * t3[2] + e3[11] * t3[3], e3[12] * t3[0] + e3[13] * t3[1] + e3[14] * t3[2] + e3[15] * t3[3]], dot: (e3, t3) => e3[0] * t3[0] + e3[1] * t3[1] + e3[2] * t3[2] + e3[3] * t3[3], sml: (e3, t3) => [e3 * t3[0], e3 * t3[1], e3 * t3[2], e3 * t3[3]] };
    UPNG.encode = function encode2(e3, t3, r3, i3, o3, a2, s2) {
      null == i3 && (i3 = 0), null == s2 && (s2 = false);
      const f2 = compress2(e3, t3, r3, i3, [false, false, false, 0, s2, false]);
      return compressPNG(f2, -1), _main(f2, t3, r3, o3, a2);
    }, UPNG.encodeLL = function encodeLL(e3, t3, r3, i3, o3, a2, s2, f2) {
      const l2 = { ctype: 0 + (1 == i3 ? 0 : 2) + (0 == o3 ? 0 : 4), depth: a2, frames: [] }, c2 = (i3 + o3) * a2, u = c2 * t3;
      for (let i4 = 0; i4 < e3.length; i4++) l2.frames.push({ rect: { x: 0, y: 0, width: t3, height: r3 }, img: new Uint8Array(e3[i4]), blend: 0, dispose: 1, bpp: Math.ceil(c2 / 8), bpl: Math.ceil(u / 8) });
      return compressPNG(l2, 0, true), _main(l2, t3, r3, s2, f2);
    }, UPNG.encode.compress = compress2, UPNG.encode.dither = dither, UPNG.quantize = quantize, UPNG.quantize.getKDtree = getKDtree, UPNG.quantize.getNearest = getNearest;
  })();
  var r = { toArrayBuffer(e2, t2) {
    const i2 = e2.width, o2 = e2.height, a2 = i2 << 2, s2 = e2.getContext("2d").getImageData(0, 0, i2, o2), f2 = new Uint32Array(s2.data.buffer), l2 = (32 * i2 + 31) / 32 << 2, c2 = l2 * o2, u = 122 + c2, h = new ArrayBuffer(u), d = new DataView(h), A = 1 << 20;
    let g, p, m, w, v = A, b = 0, y = 0, E = 0;
    function set16(e3) {
      d.setUint16(y, e3, true), y += 2;
    }
    function set32(e3) {
      d.setUint32(y, e3, true), y += 4;
    }
    function seek(e3) {
      y += e3;
    }
    set16(19778), set32(u), seek(4), set32(122), set32(108), set32(i2), set32(-o2 >>> 0), set16(1), set16(32), set32(3), set32(c2), set32(2835), set32(2835), seek(8), set32(16711680), set32(65280), set32(255), set32(4278190080), set32(1466527264), (function convert() {
      for (; b < o2 && v > 0; ) {
        for (w = 122 + b * l2, g = 0; g < a2; ) v--, p = f2[E++], m = p >>> 24, d.setUint32(w + g, p << 8 | m), g += 4;
        b++;
      }
      E < f2.length ? (v = A, setTimeout(convert, r._dly)) : t2(h);
    })();
  }, toBlob(e2, t2) {
    this.toArrayBuffer(e2, ((e3) => {
      t2(new Blob([e3], { type: "image/bmp" }));
    }));
  }, _dly: 9 };
  var i = { CHROME: "CHROME", FIREFOX: "FIREFOX", DESKTOP_SAFARI: "DESKTOP_SAFARI", IE: "IE", IOS: "IOS", ETC: "ETC" };
  var o = { [i.CHROME]: 16384, [i.FIREFOX]: 11180, [i.DESKTOP_SAFARI]: 16384, [i.IE]: 8192, [i.IOS]: 4096, [i.ETC]: 8192 };
  var a = "undefined" != typeof window;
  var s = "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope;
  var f = a && window.cordova && window.cordova.require && window.cordova.require("cordova/modulemapper");
  var CustomFile = (a || s) && (f && f.getOriginalSymbol(window, "File") || "undefined" != typeof File && File);
  var CustomFileReader = (a || s) && (f && f.getOriginalSymbol(window, "FileReader") || "undefined" != typeof FileReader && FileReader);
  function getFilefromDataUrl(e2, t2, r2 = Date.now()) {
    return new Promise(((i2) => {
      const o2 = e2.split(","), a2 = o2[0].match(/:(.*?);/)[1], s2 = globalThis.atob(o2[1]);
      let f2 = s2.length;
      const l2 = new Uint8Array(f2);
      for (; f2--; ) l2[f2] = s2.charCodeAt(f2);
      const c2 = new Blob([l2], { type: a2 });
      c2.name = t2, c2.lastModified = r2, i2(c2);
    }));
  }
  function getDataUrlFromFile(e2) {
    return new Promise(((t2, r2) => {
      const i2 = new CustomFileReader();
      i2.onload = () => t2(i2.result), i2.onerror = (e3) => r2(e3), i2.readAsDataURL(e2);
    }));
  }
  function loadImage(e2) {
    return new Promise(((t2, r2) => {
      const i2 = new Image();
      i2.onload = () => t2(i2), i2.onerror = (e3) => r2(e3), i2.src = e2;
    }));
  }
  function getBrowserName() {
    if (void 0 !== getBrowserName.cachedResult) return getBrowserName.cachedResult;
    let e2 = i.ETC;
    const { userAgent: t2 } = navigator;
    return /Chrom(e|ium)/i.test(t2) ? e2 = i.CHROME : /iP(ad|od|hone)/i.test(t2) && /WebKit/i.test(t2) ? e2 = i.IOS : /Safari/i.test(t2) ? e2 = i.DESKTOP_SAFARI : /Firefox/i.test(t2) ? e2 = i.FIREFOX : (/MSIE/i.test(t2) || true == !!document.documentMode) && (e2 = i.IE), getBrowserName.cachedResult = e2, getBrowserName.cachedResult;
  }
  function approximateBelowMaximumCanvasSizeOfBrowser(e2, t2) {
    const r2 = getBrowserName(), i2 = o[r2];
    let a2 = e2, s2 = t2, f2 = a2 * s2;
    const l2 = a2 > s2 ? s2 / a2 : a2 / s2;
    for (; f2 > i2 * i2; ) {
      const e3 = (i2 + a2) / 2, t3 = (i2 + s2) / 2;
      e3 < t3 ? (s2 = t3, a2 = t3 * l2) : (s2 = e3 * l2, a2 = e3), f2 = a2 * s2;
    }
    return { width: a2, height: s2 };
  }
  function getNewCanvasAndCtx(e2, t2) {
    let r2, i2;
    try {
      if (r2 = new OffscreenCanvas(e2, t2), i2 = r2.getContext("2d"), null === i2) throw new Error("getContext of OffscreenCanvas returns null");
    } catch (e3) {
      r2 = document.createElement("canvas"), i2 = r2.getContext("2d");
    }
    return r2.width = e2, r2.height = t2, [r2, i2];
  }
  function drawImageInCanvas(e2, t2) {
    const { width: r2, height: i2 } = approximateBelowMaximumCanvasSizeOfBrowser(e2.width, e2.height), [o2, a2] = getNewCanvasAndCtx(r2, i2);
    return t2 && /jpe?g/.test(t2) && (a2.fillStyle = "white", a2.fillRect(0, 0, o2.width, o2.height)), a2.drawImage(e2, 0, 0, o2.width, o2.height), o2;
  }
  function isIOS() {
    return void 0 !== isIOS.cachedResult || (isIOS.cachedResult = ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "undefined" != typeof document && "ontouchend" in document), isIOS.cachedResult;
  }
  function drawFileInCanvas(e2, t2 = {}) {
    return new Promise((function(r2, o2) {
      let a2, s2;
      var $Try_2_Post = function() {
        try {
          return s2 = drawImageInCanvas(a2, t2.fileType || e2.type), r2([a2, s2]);
        } catch (e3) {
          return o2(e3);
        }
      }, $Try_2_Catch = function(t3) {
        try {
          0;
          var $Try_3_Catch = function(e3) {
            try {
              throw e3;
            } catch (e4) {
              return o2(e4);
            }
          };
          try {
            let t4;
            return getDataUrlFromFile(e2).then((function(e3) {
              try {
                return t4 = e3, loadImage(t4).then((function(e4) {
                  try {
                    return a2 = e4, (function() {
                      try {
                        return $Try_2_Post();
                      } catch (e5) {
                        return o2(e5);
                      }
                    })();
                  } catch (e5) {
                    return $Try_3_Catch(e5);
                  }
                }), $Try_3_Catch);
              } catch (e4) {
                return $Try_3_Catch(e4);
              }
            }), $Try_3_Catch);
          } catch (e3) {
            $Try_3_Catch(e3);
          }
        } catch (e3) {
          return o2(e3);
        }
      };
      try {
        if (isIOS() || [i.DESKTOP_SAFARI, i.MOBILE_SAFARI].includes(getBrowserName())) throw new Error("Skip createImageBitmap on IOS and Safari");
        return createImageBitmap(e2).then((function(e3) {
          try {
            return a2 = e3, $Try_2_Post();
          } catch (e4) {
            return $Try_2_Catch();
          }
        }), $Try_2_Catch);
      } catch (e3) {
        $Try_2_Catch();
      }
    }));
  }
  function canvasToFile(e2, t2, i2, o2, a2 = 1) {
    return new Promise((function(s2, f2) {
      let l2;
      if ("image/png" === t2) {
        let c2, u, h;
        return c2 = e2.getContext("2d"), { data: u } = c2.getImageData(0, 0, e2.width, e2.height), h = UPNG.encode([u.buffer], e2.width, e2.height, 4096 * a2), l2 = new Blob([h], { type: t2 }), l2.name = i2, l2.lastModified = o2, $If_4.call(this);
      }
      {
        let $If_5 = function() {
          return $If_4.call(this);
        };
        if ("image/bmp" === t2) return new Promise(((t3) => r.toBlob(e2, t3))).then(function(e3) {
          try {
            return l2 = e3, l2.name = i2, l2.lastModified = o2, $If_5.call(this);
          } catch (e4) {
            return f2(e4);
          }
        }.bind(this), f2);
        {
          let $If_6 = function() {
            return $If_5.call(this);
          };
          if ("function" == typeof OffscreenCanvas && e2 instanceof OffscreenCanvas) return e2.convertToBlob({ type: t2, quality: a2 }).then(function(e3) {
            try {
              return l2 = e3, l2.name = i2, l2.lastModified = o2, $If_6.call(this);
            } catch (e4) {
              return f2(e4);
            }
          }.bind(this), f2);
          {
            let d;
            return d = e2.toDataURL(t2, a2), getFilefromDataUrl(d, i2, o2).then(function(e3) {
              try {
                return l2 = e3, $If_6.call(this);
              } catch (e4) {
                return f2(e4);
              }
            }.bind(this), f2);
          }
        }
      }
      function $If_4() {
        return s2(l2);
      }
    }));
  }
  function cleanupCanvasMemory(e2) {
    e2.width = 0, e2.height = 0;
  }
  function isAutoOrientationInBrowser() {
    return new Promise((function(e2, t2) {
      let r2, i2, o2, a2, s2;
      return void 0 !== isAutoOrientationInBrowser.cachedResult ? e2(isAutoOrientationInBrowser.cachedResult) : (r2 = "data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/xABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==", getFilefromDataUrl("data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/xABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==", "test.jpg", Date.now()).then((function(r3) {
        try {
          return i2 = r3, drawFileInCanvas(i2).then((function(r4) {
            try {
              return o2 = r4[1], canvasToFile(o2, i2.type, i2.name, i2.lastModified).then((function(r5) {
                try {
                  return a2 = r5, cleanupCanvasMemory(o2), drawFileInCanvas(a2).then((function(r6) {
                    try {
                      return s2 = r6[0], isAutoOrientationInBrowser.cachedResult = 1 === s2.width && 2 === s2.height, e2(isAutoOrientationInBrowser.cachedResult);
                    } catch (e3) {
                      return t2(e3);
                    }
                  }), t2);
                } catch (e3) {
                  return t2(e3);
                }
              }), t2);
            } catch (e3) {
              return t2(e3);
            }
          }), t2);
        } catch (e3) {
          return t2(e3);
        }
      }), t2));
    }));
  }
  function getExifOrientation(e2) {
    return new Promise(((t2, r2) => {
      const i2 = new CustomFileReader();
      i2.onload = (e3) => {
        const r3 = new DataView(e3.target.result);
        if (65496 != r3.getUint16(0, false)) return t2(-2);
        const i3 = r3.byteLength;
        let o2 = 2;
        for (; o2 < i3; ) {
          if (r3.getUint16(o2 + 2, false) <= 8) return t2(-1);
          const e4 = r3.getUint16(o2, false);
          if (o2 += 2, 65505 == e4) {
            if (1165519206 != r3.getUint32(o2 += 2, false)) return t2(-1);
            const e5 = 18761 == r3.getUint16(o2 += 6, false);
            o2 += r3.getUint32(o2 + 4, e5);
            const i4 = r3.getUint16(o2, e5);
            o2 += 2;
            for (let a2 = 0; a2 < i4; a2++) if (274 == r3.getUint16(o2 + 12 * a2, e5)) return t2(r3.getUint16(o2 + 12 * a2 + 8, e5));
          } else {
            if (65280 != (65280 & e4)) break;
            o2 += r3.getUint16(o2, false);
          }
        }
        return t2(-1);
      }, i2.onerror = (e3) => r2(e3), i2.readAsArrayBuffer(e2);
    }));
  }
  function handleMaxWidthOrHeight(e2, t2) {
    const { width: r2 } = e2, { height: i2 } = e2, { maxWidthOrHeight: o2 } = t2;
    let a2, s2 = e2;
    return isFinite(o2) && (r2 > o2 || i2 > o2) && ([s2, a2] = getNewCanvasAndCtx(r2, i2), r2 > i2 ? (s2.width = o2, s2.height = i2 / r2 * o2) : (s2.width = r2 / i2 * o2, s2.height = o2), a2.drawImage(e2, 0, 0, s2.width, s2.height), cleanupCanvasMemory(e2)), s2;
  }
  function followExifOrientation(e2, t2) {
    const { width: r2 } = e2, { height: i2 } = e2, [o2, a2] = getNewCanvasAndCtx(r2, i2);
    switch (t2 > 4 && t2 < 9 ? (o2.width = i2, o2.height = r2) : (o2.width = r2, o2.height = i2), t2) {
      case 2:
        a2.transform(-1, 0, 0, 1, r2, 0);
        break;
      case 3:
        a2.transform(-1, 0, 0, -1, r2, i2);
        break;
      case 4:
        a2.transform(1, 0, 0, -1, 0, i2);
        break;
      case 5:
        a2.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6:
        a2.transform(0, 1, -1, 0, i2, 0);
        break;
      case 7:
        a2.transform(0, -1, -1, 0, i2, r2);
        break;
      case 8:
        a2.transform(0, -1, 1, 0, 0, r2);
    }
    return a2.drawImage(e2, 0, 0, r2, i2), cleanupCanvasMemory(e2), o2;
  }
  function compress(e2, t2, r2 = 0) {
    return new Promise((function(i2, o2) {
      let a2, s2, f2, l2, c2, u, h, d, A, g, p, m, w, v, b, y, E, F, _, B;
      function incProgress(e3 = 5) {
        if (t2.signal && t2.signal.aborted) throw t2.signal.reason;
        a2 += e3, t2.onProgress(Math.min(a2, 100));
      }
      function setProgress(e3) {
        if (t2.signal && t2.signal.aborted) throw t2.signal.reason;
        a2 = Math.min(Math.max(e3, a2), 100), t2.onProgress(a2);
      }
      return a2 = r2, s2 = t2.maxIteration || 10, f2 = 1024 * t2.maxSizeMB * 1024, incProgress(), drawFileInCanvas(e2, t2).then(function(r3) {
        try {
          return [, l2] = r3, incProgress(), c2 = handleMaxWidthOrHeight(l2, t2), incProgress(), new Promise((function(r4, i3) {
            var o3;
            if (!(o3 = t2.exifOrientation)) return getExifOrientation(e2).then(function(e3) {
              try {
                return o3 = e3, $If_2.call(this);
              } catch (e4) {
                return i3(e4);
              }
            }.bind(this), i3);
            function $If_2() {
              return r4(o3);
            }
            return $If_2.call(this);
          })).then(function(r4) {
            try {
              return u = r4, incProgress(), isAutoOrientationInBrowser().then(function(r5) {
                try {
                  return h = r5 ? c2 : followExifOrientation(c2, u), incProgress(), d = t2.initialQuality || 1, A = t2.fileType || e2.type, canvasToFile(h, A, e2.name, e2.lastModified, d).then(function(r6) {
                    try {
                      {
                        let $Loop_3 = function() {
                          if (s2-- && (b > f2 || b > w)) {
                            let t3, r7;
                            return t3 = B ? 0.95 * _.width : _.width, r7 = B ? 0.95 * _.height : _.height, [E, F] = getNewCanvasAndCtx(t3, r7), F.drawImage(_, 0, 0, t3, r7), d *= "image/png" === A ? 0.85 : 0.95, canvasToFile(E, A, e2.name, e2.lastModified, d).then((function(e3) {
                              try {
                                return y = e3, cleanupCanvasMemory(_), _ = E, b = y.size, setProgress(Math.min(99, Math.floor((v - b) / (v - f2) * 100))), $Loop_3;
                              } catch (e4) {
                                return o2(e4);
                              }
                            }), o2);
                          }
                          return [1];
                        }, $Loop_3_exit = function() {
                          return cleanupCanvasMemory(_), cleanupCanvasMemory(E), cleanupCanvasMemory(c2), cleanupCanvasMemory(h), cleanupCanvasMemory(l2), setProgress(100), i2(y);
                        };
                        if (g = r6, incProgress(), p = g.size > f2, m = g.size > e2.size, !p && !m) return setProgress(100), i2(g);
                        var a3;
                        return w = e2.size, v = g.size, b = v, _ = h, B = !t2.alwaysKeepResolution && p, (a3 = function(e3) {
                          for (; e3; ) {
                            if (e3.then) return void e3.then(a3, o2);
                            try {
                              if (e3.pop) {
                                if (e3.length) return e3.pop() ? $Loop_3_exit.call(this) : e3;
                                e3 = $Loop_3;
                              } else e3 = e3.call(this);
                            } catch (e4) {
                              return o2(e4);
                            }
                          }
                        }.bind(this))($Loop_3);
                      }
                    } catch (u2) {
                      return o2(u2);
                    }
                  }.bind(this), o2);
                } catch (e3) {
                  return o2(e3);
                }
              }.bind(this), o2);
            } catch (e3) {
              return o2(e3);
            }
          }.bind(this), o2);
        } catch (e3) {
          return o2(e3);
        }
      }.bind(this), o2);
    }));
  }
  var l = "\nlet scriptImported = false\nself.addEventListener('message', async (e) => {\n  const { file, id, imageCompressionLibUrl, options } = e.data\n  options.onProgress = (progress) => self.postMessage({ progress, id })\n  try {\n    if (!scriptImported) {\n      // console.log('[worker] importScripts', imageCompressionLibUrl)\n      self.importScripts(imageCompressionLibUrl)\n      scriptImported = true\n    }\n    // console.log('[worker] self', self)\n    const compressedFile = await imageCompression(file, options)\n    self.postMessage({ file: compressedFile, id })\n  } catch (e) {\n    // console.error('[worker] error', e)\n    self.postMessage({ error: e.message + '\\n' + e.stack, id })\n  }\n})\n";
  var c;
  function compressOnWebWorker(e2, t2) {
    return new Promise(((r2, i2) => {
      c || (c = (function createWorkerScriptURL(e3) {
        const t3 = [];
        return "function" == typeof e3 ? t3.push(`(${e3})()`) : t3.push(e3), URL.createObjectURL(new Blob(t3));
      })(l));
      const o2 = new Worker(c);
      o2.addEventListener("message", (function handler(e3) {
        if (t2.signal && t2.signal.aborted) o2.terminate();
        else if (void 0 === e3.data.progress) {
          if (e3.data.error) return i2(new Error(e3.data.error)), void o2.terminate();
          r2(e3.data.file), o2.terminate();
        } else t2.onProgress(e3.data.progress);
      })), o2.addEventListener("error", i2), t2.signal && t2.signal.addEventListener("abort", (() => {
        i2(t2.signal.reason), o2.terminate();
      })), o2.postMessage({ file: e2, imageCompressionLibUrl: t2.libURL, options: { ...t2, onProgress: void 0, signal: void 0 } });
    }));
  }
  function imageCompression(e2, t2) {
    return new Promise((function(r2, i2) {
      let o2, a2, s2, f2, l2, c2;
      if (o2 = { ...t2 }, s2 = 0, { onProgress: f2 } = o2, o2.maxSizeMB = o2.maxSizeMB || Number.POSITIVE_INFINITY, l2 = "boolean" != typeof o2.useWebWorker || o2.useWebWorker, delete o2.useWebWorker, o2.onProgress = (e3) => {
        s2 = e3, "function" == typeof f2 && f2(s2);
      }, !(e2 instanceof Blob || e2 instanceof CustomFile)) return i2(new Error("The file given is not an instance of Blob or File"));
      if (!/^image/.test(e2.type)) return i2(new Error("The file given is not an image"));
      if (c2 = "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope, !l2 || "function" != typeof Worker || c2) return compress(e2, o2).then(function(e3) {
        try {
          return a2 = e3, $If_4.call(this);
        } catch (e4) {
          return i2(e4);
        }
      }.bind(this), i2);
      var u = function() {
        try {
          return $If_4.call(this);
        } catch (e3) {
          return i2(e3);
        }
      }.bind(this), $Try_1_Catch = function(t3) {
        try {
          return compress(e2, o2).then((function(e3) {
            try {
              return a2 = e3, u();
            } catch (e4) {
              return i2(e4);
            }
          }), i2);
        } catch (e3) {
          return i2(e3);
        }
      };
      try {
        return o2.libURL = o2.libURL || "https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.2/dist/browser-image-compression.js", compressOnWebWorker(e2, o2).then((function(e3) {
          try {
            return a2 = e3, u();
          } catch (e4) {
            return $Try_1_Catch();
          }
        }), $Try_1_Catch);
      } catch (e3) {
        $Try_1_Catch();
      }
      function $If_4() {
        try {
          a2.name = e2.name, a2.lastModified = e2.lastModified;
        } catch (e3) {
        }
        try {
          o2.preserveExif && "image/jpeg" === e2.type && (!o2.fileType || o2.fileType && o2.fileType === e2.type) && (a2 = copyExifWithoutOrientation(e2, a2));
        } catch (e3) {
        }
        return r2(a2);
      }
    }));
  }
  imageCompression.getDataUrlFromFile = getDataUrlFromFile, imageCompression.getFilefromDataUrl = getFilefromDataUrl, imageCompression.loadImage = loadImage, imageCompression.drawImageInCanvas = drawImageInCanvas, imageCompression.drawFileInCanvas = drawFileInCanvas, imageCompression.canvasToFile = canvasToFile, imageCompression.getExifOrientation = getExifOrientation, imageCompression.handleMaxWidthOrHeight = handleMaxWidthOrHeight, imageCompression.followExifOrientation = followExifOrientation, imageCompression.cleanupCanvasMemory = cleanupCanvasMemory, imageCompression.isAutoOrientationInBrowser = isAutoOrientationInBrowser, imageCompression.approximateBelowMaximumCanvasSizeOfBrowser = approximateBelowMaximumCanvasSizeOfBrowser, imageCompression.copyExifWithoutOrientation = copyExifWithoutOrientation, imageCompression.getBrowserName = getBrowserName, imageCompression.version = "2.0.2";

  // src/context/ProductContext.jsx
  var ProductContext = (0, import_react.createContext)();
  var CACHE_DURATION_MS = 5 * 60 * 1e3;
  var useProducts = () => (0, import_react.useContext)(ProductContext);

  // src/context/CategoryContext.jsx
  var import_react4 = __toESM(__require("react"), 1);

  // src/context/ToastContext.jsx
  var import_react3 = __toESM(__require("react"), 1);

  // src/components/Toast.jsx
  var import_react2 = __toESM(__require("react"), 1);
  var import_lucide_react = __require("lucide-react");

  // src/context/ToastContext.jsx
  var ToastContext = (0, import_react3.createContext)();

  // src/context/CategoryContext.jsx
  var CategoryContext = (0, import_react4.createContext)();
  var useCategories = () => (0, import_react4.useContext)(CategoryContext);

  // src/context/CartContext.jsx
  var import_react7 = __toESM(__require("react"), 1);

  // src/context/AuthContext.jsx
  var import_react5 = __toESM(__require("react"), 1);

  // node_modules/@firebase/util/dist/postinstall.mjs
  var getDefaultsFromPostinstall = () => void 0;

  // node_modules/@firebase/util/dist/index.esm.js
  var stringToByteArray$1 = function(str) {
    const out = [];
    let p = 0;
    for (let i2 = 0; i2 < str.length; i2++) {
      let c2 = str.charCodeAt(i2);
      if (c2 < 128) {
        out[p++] = c2;
      } else if (c2 < 2048) {
        out[p++] = c2 >> 6 | 192;
        out[p++] = c2 & 63 | 128;
      } else if ((c2 & 64512) === 55296 && i2 + 1 < str.length && (str.charCodeAt(i2 + 1) & 64512) === 56320) {
        c2 = 65536 + ((c2 & 1023) << 10) + (str.charCodeAt(++i2) & 1023);
        out[p++] = c2 >> 18 | 240;
        out[p++] = c2 >> 12 & 63 | 128;
        out[p++] = c2 >> 6 & 63 | 128;
        out[p++] = c2 & 63 | 128;
      } else {
        out[p++] = c2 >> 12 | 224;
        out[p++] = c2 >> 6 & 63 | 128;
        out[p++] = c2 & 63 | 128;
      }
    }
    return out;
  };
  var byteArrayToString = function(bytes) {
    const out = [];
    let pos = 0, c2 = 0;
    while (pos < bytes.length) {
      const c1 = bytes[pos++];
      if (c1 < 128) {
        out[c2++] = String.fromCharCode(c1);
      } else if (c1 > 191 && c1 < 224) {
        const c22 = bytes[pos++];
        out[c2++] = String.fromCharCode((c1 & 31) << 6 | c22 & 63);
      } else if (c1 > 239 && c1 < 365) {
        const c22 = bytes[pos++];
        const c3 = bytes[pos++];
        const c4 = bytes[pos++];
        const u = ((c1 & 7) << 18 | (c22 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
        out[c2++] = String.fromCharCode(55296 + (u >> 10));
        out[c2++] = String.fromCharCode(56320 + (u & 1023));
      } else {
        const c22 = bytes[pos++];
        const c3 = bytes[pos++];
        out[c2++] = String.fromCharCode((c1 & 15) << 12 | (c22 & 63) << 6 | c3 & 63);
      }
    }
    return out.join("");
  };
  var base64 = {
    /**
     * Maps bytes to characters.
     */
    byteToCharMap_: null,
    /**
     * Maps characters to bytes.
     */
    charToByteMap_: null,
    /**
     * Maps bytes to websafe characters.
     * @private
     */
    byteToCharMapWebSafe_: null,
    /**
     * Maps websafe characters to bytes.
     * @private
     */
    charToByteMapWebSafe_: null,
    /**
     * Our default alphabet, shared between
     * ENCODED_VALS and ENCODED_VALS_WEBSAFE
     */
    ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    /**
     * Our default alphabet. Value 64 (=) is special; it means "nothing."
     */
    get ENCODED_VALS() {
      return this.ENCODED_VALS_BASE + "+/=";
    },
    /**
     * Our websafe alphabet.
     */
    get ENCODED_VALS_WEBSAFE() {
      return this.ENCODED_VALS_BASE + "-_.";
    },
    /**
     * Whether this browser supports the atob and btoa functions. This extension
     * started at Mozilla but is now implemented by many browsers. We use the
     * ASSUME_* variables to avoid pulling in the full useragent detection library
     * but still allowing the standard per-browser compilations.
     *
     */
    HAS_NATIVE_SUPPORT: typeof atob === "function",
    /**
     * Base64-encode an array of bytes.
     *
     * @param input An array of bytes (numbers with
     *     value in [0, 255]) to encode.
     * @param webSafe Boolean indicating we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
    encodeByteArray(input, webSafe) {
      if (!Array.isArray(input)) {
        throw Error("encodeByteArray takes an array as a parameter");
      }
      this.init_();
      const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
      const output = [];
      for (let i2 = 0; i2 < input.length; i2 += 3) {
        const byte1 = input[i2];
        const haveByte2 = i2 + 1 < input.length;
        const byte2 = haveByte2 ? input[i2 + 1] : 0;
        const haveByte3 = i2 + 2 < input.length;
        const byte3 = haveByte3 ? input[i2 + 2] : 0;
        const outByte1 = byte1 >> 2;
        const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
        let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
        let outByte4 = byte3 & 63;
        if (!haveByte3) {
          outByte4 = 64;
          if (!haveByte2) {
            outByte3 = 64;
          }
        }
        output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
      }
      return output.join("");
    },
    /**
     * Base64-encode a string.
     *
     * @param input A string to encode.
     * @param webSafe If true, we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
    encodeString(input, webSafe) {
      if (this.HAS_NATIVE_SUPPORT && !webSafe) {
        return btoa(input);
      }
      return this.encodeByteArray(stringToByteArray$1(input), webSafe);
    },
    /**
     * Base64-decode a string.
     *
     * @param input to decode.
     * @param webSafe True if we should use the
     *     alternative alphabet.
     * @return string representing the decoded value.
     */
    decodeString(input, webSafe) {
      if (this.HAS_NATIVE_SUPPORT && !webSafe) {
        return atob(input);
      }
      return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
    },
    /**
     * Base64-decode a string.
     *
     * In base-64 decoding, groups of four characters are converted into three
     * bytes.  If the encoder did not apply padding, the input length may not
     * be a multiple of 4.
     *
     * In this case, the last group will have fewer than 4 characters, and
     * padding will be inferred.  If the group has one or two characters, it decodes
     * to one byte.  If the group has three characters, it decodes to two bytes.
     *
     * @param input Input to decode.
     * @param webSafe True if we should use the web-safe alphabet.
     * @return bytes representing the decoded value.
     */
    decodeStringToByteArray(input, webSafe) {
      this.init_();
      const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
      const output = [];
      for (let i2 = 0; i2 < input.length; ) {
        const byte1 = charToByteMap[input.charAt(i2++)];
        const haveByte2 = i2 < input.length;
        const byte2 = haveByte2 ? charToByteMap[input.charAt(i2)] : 0;
        ++i2;
        const haveByte3 = i2 < input.length;
        const byte3 = haveByte3 ? charToByteMap[input.charAt(i2)] : 64;
        ++i2;
        const haveByte4 = i2 < input.length;
        const byte4 = haveByte4 ? charToByteMap[input.charAt(i2)] : 64;
        ++i2;
        if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
          throw new DecodeBase64StringError();
        }
        const outByte1 = byte1 << 2 | byte2 >> 4;
        output.push(outByte1);
        if (byte3 !== 64) {
          const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
          output.push(outByte2);
          if (byte4 !== 64) {
            const outByte3 = byte3 << 6 & 192 | byte4;
            output.push(outByte3);
          }
        }
      }
      return output;
    },
    /**
     * Lazy static initialization function. Called before
     * accessing any of the static map variables.
     * @private
     */
    init_() {
      if (!this.byteToCharMap_) {
        this.byteToCharMap_ = {};
        this.charToByteMap_ = {};
        this.byteToCharMapWebSafe_ = {};
        this.charToByteMapWebSafe_ = {};
        for (let i2 = 0; i2 < this.ENCODED_VALS.length; i2++) {
          this.byteToCharMap_[i2] = this.ENCODED_VALS.charAt(i2);
          this.charToByteMap_[this.byteToCharMap_[i2]] = i2;
          this.byteToCharMapWebSafe_[i2] = this.ENCODED_VALS_WEBSAFE.charAt(i2);
          this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i2]] = i2;
          if (i2 >= this.ENCODED_VALS_BASE.length) {
            this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i2)] = i2;
            this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i2)] = i2;
          }
        }
      }
    }
  };
  var DecodeBase64StringError = class extends Error {
    constructor() {
      super(...arguments);
      this.name = "DecodeBase64StringError";
    }
  };
  var base64Encode = function(str) {
    const utf8Bytes = stringToByteArray$1(str);
    return base64.encodeByteArray(utf8Bytes, true);
  };
  var base64urlEncodeWithoutPadding = function(str) {
    return base64Encode(str).replace(/\./g, "");
  };
  var base64Decode = function(str) {
    try {
      return base64.decodeString(str, true);
    } catch (e2) {
      console.error("base64Decode failed: ", e2);
    }
    return null;
  };
  function getGlobal() {
    if (typeof self !== "undefined") {
      return self;
    }
    if (typeof window !== "undefined") {
      return window;
    }
    if (typeof global !== "undefined") {
      return global;
    }
    throw new Error("Unable to locate global object.");
  }
  var getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
  var getDefaultsFromEnvVariable = () => {
    if (typeof process === "undefined" || typeof process.env === "undefined") {
      return;
    }
    const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
    if (defaultsJsonString) {
      return JSON.parse(defaultsJsonString);
    }
  };
  var getDefaultsFromCookie = () => {
    if (typeof document === "undefined") {
      return;
    }
    let match;
    try {
      match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
    } catch (e2) {
      return;
    }
    const decoded = match && base64Decode(match[1]);
    return decoded && JSON.parse(decoded);
  };
  var getDefaults = () => {
    try {
      return getDefaultsFromPostinstall() || getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
    } catch (e2) {
      console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e2}`);
      return;
    }
  };
  var getDefaultEmulatorHost = (productName) => getDefaults()?.emulatorHosts?.[productName];
  var getDefaultAppConfig = () => getDefaults()?.config;
  var getExperimentalSetting = (name7) => getDefaults()?.[`_${name7}`];
  var Deferred2 = class {
    constructor() {
      this.reject = () => {
      };
      this.resolve = () => {
      };
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    }
    /**
     * Our API internals are not promisified and cannot because our callback APIs have subtle expectations around
     * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
     * and returns a node-style callback which will resolve or reject the Deferred's promise.
     */
    wrapCallback(callback) {
      return (error, value) => {
        if (error) {
          this.reject(error);
        } else {
          this.resolve(value);
        }
        if (typeof callback === "function") {
          this.promise.catch(() => {
          });
          if (callback.length === 1) {
            callback(error);
          } else {
            callback(error, value);
          }
        }
      };
    }
  };
  function isCloudWorkstation(url) {
    try {
      const host = url.startsWith("http://") || url.startsWith("https://") ? new URL(url).hostname : url;
      return host.endsWith(".cloudworkstations.dev");
    } catch {
      return false;
    }
  }
  async function pingServer(endpoint) {
    const result = await fetch(endpoint, {
      credentials: "include"
    });
    return result.ok;
  }
  var emulatorStatus = {};
  function getEmulatorSummary() {
    const summary = {
      prod: [],
      emulator: []
    };
    for (const key of Object.keys(emulatorStatus)) {
      if (emulatorStatus[key]) {
        summary.emulator.push(key);
      } else {
        summary.prod.push(key);
      }
    }
    return summary;
  }
  function getOrCreateEl(id) {
    let parentDiv = document.getElementById(id);
    let created = false;
    if (!parentDiv) {
      parentDiv = document.createElement("div");
      parentDiv.setAttribute("id", id);
      created = true;
    }
    return { created, element: parentDiv };
  }
  var previouslyDismissed = false;
  function updateEmulatorBanner(name7, isRunningEmulator) {
    if (typeof window === "undefined" || typeof document === "undefined" || !isCloudWorkstation(window.location.host) || emulatorStatus[name7] === isRunningEmulator || emulatorStatus[name7] || // If already set to use emulator, can't go back to prod.
    previouslyDismissed) {
      return;
    }
    emulatorStatus[name7] = isRunningEmulator;
    function prefixedId(id) {
      return `__firebase__banner__${id}`;
    }
    const bannerId = "__firebase__banner";
    const summary = getEmulatorSummary();
    const showError = summary.prod.length > 0;
    function tearDown() {
      const element = document.getElementById(bannerId);
      if (element) {
        element.remove();
      }
    }
    function setupBannerStyles(bannerEl) {
      bannerEl.style.display = "flex";
      bannerEl.style.background = "#7faaf0";
      bannerEl.style.position = "fixed";
      bannerEl.style.bottom = "5px";
      bannerEl.style.left = "5px";
      bannerEl.style.padding = ".5em";
      bannerEl.style.borderRadius = "5px";
      bannerEl.style.alignItems = "center";
    }
    function setupIconStyles(prependIcon, iconId) {
      prependIcon.setAttribute("width", "24");
      prependIcon.setAttribute("id", iconId);
      prependIcon.setAttribute("height", "24");
      prependIcon.setAttribute("viewBox", "0 0 24 24");
      prependIcon.setAttribute("fill", "none");
      prependIcon.style.marginLeft = "-6px";
    }
    function setupCloseBtn() {
      const closeBtn = document.createElement("span");
      closeBtn.style.cursor = "pointer";
      closeBtn.style.marginLeft = "16px";
      closeBtn.style.fontSize = "24px";
      closeBtn.innerHTML = " &times;";
      closeBtn.onclick = () => {
        previouslyDismissed = true;
        tearDown();
      };
      return closeBtn;
    }
    function setupLinkStyles(learnMoreLink, learnMoreId) {
      learnMoreLink.setAttribute("id", learnMoreId);
      learnMoreLink.innerText = "Learn more";
      learnMoreLink.href = "https://firebase.google.com/docs/studio/preview-apps#preview-backend";
      learnMoreLink.setAttribute("target", "__blank");
      learnMoreLink.style.paddingLeft = "5px";
      learnMoreLink.style.textDecoration = "underline";
    }
    function setupDom() {
      const banner = getOrCreateEl(bannerId);
      const firebaseTextId = prefixedId("text");
      const firebaseText = document.getElementById(firebaseTextId) || document.createElement("span");
      const learnMoreId = prefixedId("learnmore");
      const learnMoreLink = document.getElementById(learnMoreId) || document.createElement("a");
      const prependIconId = prefixedId("preprendIcon");
      const prependIcon = document.getElementById(prependIconId) || document.createElementNS("http://www.w3.org/2000/svg", "svg");
      if (banner.created) {
        const bannerEl = banner.element;
        setupBannerStyles(bannerEl);
        setupLinkStyles(learnMoreLink, learnMoreId);
        const closeBtn = setupCloseBtn();
        setupIconStyles(prependIcon, prependIconId);
        bannerEl.append(prependIcon, firebaseText, learnMoreLink, closeBtn);
        document.body.appendChild(bannerEl);
      }
      if (showError) {
        firebaseText.innerText = `Preview backend disconnected.`;
        prependIcon.innerHTML = `<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`;
      } else {
        prependIcon.innerHTML = `<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`;
        firebaseText.innerText = "Preview backend running in this workspace.";
      }
      firebaseText.setAttribute("id", firebaseTextId);
    }
    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", setupDom);
    } else {
      setupDom();
    }
  }
  function getUA() {
    if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") {
      return navigator["userAgent"];
    } else {
      return "";
    }
  }
  function isMobileCordova() {
    return typeof window !== "undefined" && // @ts-ignore Setting up an broadly applicable index signature for Window
    // just to deal with this case would probably be a bad idea.
    !!(window["cordova"] || window["phonegap"] || window["PhoneGap"]) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA());
  }
  function isCloudflareWorker() {
    return typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
  }
  function isBrowserExtension() {
    const runtime = typeof chrome === "object" ? chrome.runtime : typeof browser === "object" ? browser.runtime : void 0;
    return typeof runtime === "object" && runtime.id !== void 0;
  }
  function isReactNative() {
    return typeof navigator === "object" && navigator["product"] === "ReactNative";
  }
  function isIE() {
    const ua = getUA();
    return ua.indexOf("MSIE ") >= 0 || ua.indexOf("Trident/") >= 0;
  }
  function isIndexedDBAvailable() {
    try {
      return typeof indexedDB === "object";
    } catch (e2) {
      return false;
    }
  }
  function validateIndexedDBOpenable() {
    return new Promise((resolve, reject) => {
      try {
        let preExist = true;
        const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
        const request = self.indexedDB.open(DB_CHECK_NAME);
        request.onsuccess = () => {
          request.result.close();
          if (!preExist) {
            self.indexedDB.deleteDatabase(DB_CHECK_NAME);
          }
          resolve(true);
        };
        request.onupgradeneeded = () => {
          preExist = false;
        };
        request.onerror = () => {
          reject(request.error?.message || "");
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  function areCookiesEnabled() {
    if (typeof navigator === "undefined" || !navigator.cookieEnabled) {
      return false;
    }
    return true;
  }
  var ERROR_NAME = "FirebaseError";
  var FirebaseError = class _FirebaseError extends Error {
    constructor(code, message, customData) {
      super(message);
      this.code = code;
      this.customData = customData;
      this.name = ERROR_NAME;
      Object.setPrototypeOf(this, _FirebaseError.prototype);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ErrorFactory.prototype.create);
      }
    }
  };
  var ErrorFactory = class {
    constructor(service, serviceName, errors) {
      this.service = service;
      this.serviceName = serviceName;
      this.errors = errors;
    }
    create(code, ...data) {
      const customData = data[0] || {};
      const fullCode = `${this.service}/${code}`;
      const template = this.errors[code];
      const message = template ? replaceTemplate(template, customData) : "Error";
      const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
      const error = new FirebaseError(fullCode, fullMessage, customData);
      return error;
    }
  };
  function replaceTemplate(template, data) {
    return template.replace(PATTERN, (_, key) => {
      const value = data[key];
      return value != null ? String(value) : `<${key}?>`;
    });
  }
  var PATTERN = /\{\$([^}]+)}/g;
  function isEmpty(obj) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }
  function deepEqual(a2, b) {
    if (a2 === b) {
      return true;
    }
    const aKeys = Object.keys(a2);
    const bKeys = Object.keys(b);
    for (const k of aKeys) {
      if (!bKeys.includes(k)) {
        return false;
      }
      const aProp = a2[k];
      const bProp = b[k];
      if (isObject(aProp) && isObject(bProp)) {
        if (!deepEqual(aProp, bProp)) {
          return false;
        }
      } else if (aProp !== bProp) {
        return false;
      }
    }
    for (const k of bKeys) {
      if (!aKeys.includes(k)) {
        return false;
      }
    }
    return true;
  }
  function isObject(thing) {
    return thing !== null && typeof thing === "object";
  }
  function querystring(querystringParams) {
    const params = [];
    for (const [key, value] of Object.entries(querystringParams)) {
      if (Array.isArray(value)) {
        value.forEach((arrayVal) => {
          params.push(encodeURIComponent(key) + "=" + encodeURIComponent(arrayVal));
        });
      } else {
        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
      }
    }
    return params.length ? "&" + params.join("&") : "";
  }
  function querystringDecode(querystring2) {
    const obj = {};
    const tokens = querystring2.replace(/^\?/, "").split("&");
    tokens.forEach((token) => {
      if (token) {
        const [key, value] = token.split("=");
        obj[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
    return obj;
  }
  function extractQuerystring(url) {
    const queryStart = url.indexOf("?");
    if (!queryStart) {
      return "";
    }
    const fragmentStart = url.indexOf("#", queryStart);
    return url.substring(queryStart, fragmentStart > 0 ? fragmentStart : void 0);
  }
  function createSubscribe(executor, onNoObservers) {
    const proxy = new ObserverProxy(executor, onNoObservers);
    return proxy.subscribe.bind(proxy);
  }
  var ObserverProxy = class {
    /**
     * @param executor Function which can make calls to a single Observer
     *     as a proxy.
     * @param onNoObservers Callback when count of Observers goes to zero.
     */
    constructor(executor, onNoObservers) {
      this.observers = [];
      this.unsubscribes = [];
      this.observerCount = 0;
      this.task = Promise.resolve();
      this.finalized = false;
      this.onNoObservers = onNoObservers;
      this.task.then(() => {
        executor(this);
      }).catch((e2) => {
        this.error(e2);
      });
    }
    next(value) {
      this.forEachObserver((observer) => {
        observer.next(value);
      });
    }
    error(error) {
      this.forEachObserver((observer) => {
        observer.error(error);
      });
      this.close(error);
    }
    complete() {
      this.forEachObserver((observer) => {
        observer.complete();
      });
      this.close();
    }
    /**
     * Subscribe function that can be used to add an Observer to the fan-out list.
     *
     * - We require that no event is sent to a subscriber synchronously to their
     *   call to subscribe().
     */
    subscribe(nextOrObserver, error, complete) {
      let observer;
      if (nextOrObserver === void 0 && error === void 0 && complete === void 0) {
        throw new Error("Missing Observer.");
      }
      if (implementsAnyMethods(nextOrObserver, [
        "next",
        "error",
        "complete"
      ])) {
        observer = nextOrObserver;
      } else {
        observer = {
          next: nextOrObserver,
          error,
          complete
        };
      }
      if (observer.next === void 0) {
        observer.next = noop3;
      }
      if (observer.error === void 0) {
        observer.error = noop3;
      }
      if (observer.complete === void 0) {
        observer.complete = noop3;
      }
      const unsub = this.unsubscribeOne.bind(this, this.observers.length);
      if (this.finalized) {
        this.task.then(() => {
          try {
            if (this.finalError) {
              observer.error(this.finalError);
            } else {
              observer.complete();
            }
          } catch (e2) {
          }
          return;
        });
      }
      this.observers.push(observer);
      return unsub;
    }
    // Unsubscribe is synchronous - we guarantee that no events are sent to
    // any unsubscribed Observer.
    unsubscribeOne(i2) {
      if (this.observers === void 0 || this.observers[i2] === void 0) {
        return;
      }
      delete this.observers[i2];
      this.observerCount -= 1;
      if (this.observerCount === 0 && this.onNoObservers !== void 0) {
        this.onNoObservers(this);
      }
    }
    forEachObserver(fn) {
      if (this.finalized) {
        return;
      }
      for (let i2 = 0; i2 < this.observers.length; i2++) {
        this.sendOne(i2, fn);
      }
    }
    // Call the Observer via one of it's callback function. We are careful to
    // confirm that the observe has not been unsubscribed since this asynchronous
    // function had been queued.
    sendOne(i2, fn) {
      this.task.then(() => {
        if (this.observers !== void 0 && this.observers[i2] !== void 0) {
          try {
            fn(this.observers[i2]);
          } catch (e2) {
            if (typeof console !== "undefined" && console.error) {
              console.error(e2);
            }
          }
        }
      });
    }
    close(err) {
      if (this.finalized) {
        return;
      }
      this.finalized = true;
      if (err !== void 0) {
        this.finalError = err;
      }
      this.task.then(() => {
        this.observers = void 0;
        this.onNoObservers = void 0;
      });
    }
  };
  function implementsAnyMethods(obj, methods) {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    for (const method of methods) {
      if (method in obj && typeof obj[method] === "function") {
        return true;
      }
    }
    return false;
  }
  function noop3() {
  }
  var DEFAULT_INTERVAL_MILLIS = 1e3;
  var DEFAULT_BACKOFF_FACTOR = 2;
  var MAX_VALUE_MILLIS = 4 * 60 * 60 * 1e3;
  var RANDOM_FACTOR = 0.5;
  function calculateBackoffMillis(backoffCount, intervalMillis = DEFAULT_INTERVAL_MILLIS, backoffFactor = DEFAULT_BACKOFF_FACTOR) {
    const currBaseValue = intervalMillis * Math.pow(backoffFactor, backoffCount);
    const randomWait = Math.round(
      // A fraction of the backoff value to add/subtract.
      // Deviation: changes multiplication order to improve readability.
      RANDOM_FACTOR * currBaseValue * // A random float (rounded to int by Math.round above) in the range [-1, 1]. Determines
      // if we add or subtract.
      (Math.random() - 0.5) * 2
    );
    return Math.min(MAX_VALUE_MILLIS, currBaseValue + randomWait);
  }
  function getModularInstance(service) {
    if (service && service._delegate) {
      return service._delegate;
    } else {
      return service;
    }
  }

  // node_modules/@firebase/component/dist/esm/index.esm.js
  var Component = class {
    /**
     *
     * @param name The public service name, e.g. app, auth, firestore, database
     * @param instanceFactory Service factory responsible for creating the public interface
     * @param type whether the service provided by the component is public or private
     */
    constructor(name7, instanceFactory, type) {
      this.name = name7;
      this.instanceFactory = instanceFactory;
      this.type = type;
      this.multipleInstances = false;
      this.serviceProps = {};
      this.instantiationMode = "LAZY";
      this.onInstanceCreated = null;
    }
    setInstantiationMode(mode) {
      this.instantiationMode = mode;
      return this;
    }
    setMultipleInstances(multipleInstances) {
      this.multipleInstances = multipleInstances;
      return this;
    }
    setServiceProps(props) {
      this.serviceProps = props;
      return this;
    }
    setInstanceCreatedCallback(callback) {
      this.onInstanceCreated = callback;
      return this;
    }
  };
  var DEFAULT_ENTRY_NAME = "[DEFAULT]";
  var Provider = class {
    constructor(name7, container) {
      this.name = name7;
      this.container = container;
      this.component = null;
      this.instances = /* @__PURE__ */ new Map();
      this.instancesDeferred = /* @__PURE__ */ new Map();
      this.instancesOptions = /* @__PURE__ */ new Map();
      this.onInitCallbacks = /* @__PURE__ */ new Map();
    }
    /**
     * @param identifier A provider can provide multiple instances of a service
     * if this.component.multipleInstances is true.
     */
    get(identifier) {
      const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
      if (!this.instancesDeferred.has(normalizedIdentifier)) {
        const deferred = new Deferred2();
        this.instancesDeferred.set(normalizedIdentifier, deferred);
        if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
          try {
            const instance = this.getOrInitializeService({
              instanceIdentifier: normalizedIdentifier
            });
            if (instance) {
              deferred.resolve(instance);
            }
          } catch (e2) {
          }
        }
      }
      return this.instancesDeferred.get(normalizedIdentifier).promise;
    }
    getImmediate(options) {
      const normalizedIdentifier = this.normalizeInstanceIdentifier(options?.identifier);
      const optional = options?.optional ?? false;
      if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
        try {
          return this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
        } catch (e2) {
          if (optional) {
            return null;
          } else {
            throw e2;
          }
        }
      } else {
        if (optional) {
          return null;
        } else {
          throw Error(`Service ${this.name} is not available`);
        }
      }
    }
    getComponent() {
      return this.component;
    }
    setComponent(component) {
      if (component.name !== this.name) {
        throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
      }
      if (this.component) {
        throw Error(`Component for ${this.name} has already been provided`);
      }
      this.component = component;
      if (!this.shouldAutoInitialize()) {
        return;
      }
      if (isComponentEager(component)) {
        try {
          this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
        } catch (e2) {
        }
      }
      for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
        const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
        try {
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
          instanceDeferred.resolve(instance);
        } catch (e2) {
        }
      }
    }
    clearInstance(identifier = DEFAULT_ENTRY_NAME) {
      this.instancesDeferred.delete(identifier);
      this.instancesOptions.delete(identifier);
      this.instances.delete(identifier);
    }
    // app.delete() will call this method on every provider to delete the services
    // TODO: should we mark the provider as deleted?
    async delete() {
      const services = Array.from(this.instances.values());
      await Promise.all([
        ...services.filter((service) => "INTERNAL" in service).map((service) => service.INTERNAL.delete()),
        ...services.filter((service) => "_delete" in service).map((service) => service._delete())
      ]);
    }
    isComponentSet() {
      return this.component != null;
    }
    isInitialized(identifier = DEFAULT_ENTRY_NAME) {
      return this.instances.has(identifier);
    }
    getOptions(identifier = DEFAULT_ENTRY_NAME) {
      return this.instancesOptions.get(identifier) || {};
    }
    initialize(opts = {}) {
      const { options = {} } = opts;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
      if (this.isInitialized(normalizedIdentifier)) {
        throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
      }
      if (!this.isComponentSet()) {
        throw Error(`Component ${this.name} has not been registered yet`);
      }
      const instance = this.getOrInitializeService({
        instanceIdentifier: normalizedIdentifier,
        options
      });
      for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
        const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
        if (normalizedIdentifier === normalizedDeferredIdentifier) {
          instanceDeferred.resolve(instance);
        }
      }
      return instance;
    }
    /**
     *
     * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
     * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
     *
     * @param identifier An optional instance identifier
     * @returns a function to unregister the callback
     */
    onInit(callback, identifier) {
      const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
      const existingCallbacks = this.onInitCallbacks.get(normalizedIdentifier) ?? /* @__PURE__ */ new Set();
      existingCallbacks.add(callback);
      this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
      const existingInstance = this.instances.get(normalizedIdentifier);
      if (existingInstance) {
        callback(existingInstance, normalizedIdentifier);
      }
      return () => {
        existingCallbacks.delete(callback);
      };
    }
    /**
     * Invoke onInit callbacks synchronously
     * @param instance the service instance`
     */
    invokeOnInitCallbacks(instance, identifier) {
      const callbacks = this.onInitCallbacks.get(identifier);
      if (!callbacks) {
        return;
      }
      for (const callback of callbacks) {
        try {
          callback(instance, identifier);
        } catch {
        }
      }
    }
    getOrInitializeService({ instanceIdentifier, options = {} }) {
      let instance = this.instances.get(instanceIdentifier);
      if (!instance && this.component) {
        instance = this.component.instanceFactory(this.container, {
          instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
          options
        });
        this.instances.set(instanceIdentifier, instance);
        this.instancesOptions.set(instanceIdentifier, options);
        this.invokeOnInitCallbacks(instance, instanceIdentifier);
        if (this.component.onInstanceCreated) {
          try {
            this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
          } catch {
          }
        }
      }
      return instance || null;
    }
    normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
      if (this.component) {
        return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
      } else {
        return identifier;
      }
    }
    shouldAutoInitialize() {
      return !!this.component && this.component.instantiationMode !== "EXPLICIT";
    }
  };
  function normalizeIdentifierForFactory(identifier) {
    return identifier === DEFAULT_ENTRY_NAME ? void 0 : identifier;
  }
  function isComponentEager(component) {
    return component.instantiationMode === "EAGER";
  }
  var ComponentContainer = class {
    constructor(name7) {
      this.name = name7;
      this.providers = /* @__PURE__ */ new Map();
    }
    /**
     *
     * @param component Component being added
     * @param overwrite When a component with the same name has already been registered,
     * if overwrite is true: overwrite the existing component with the new component and create a new
     * provider with the new component. It can be useful in tests where you want to use different mocks
     * for different tests.
     * if overwrite is false: throw an exception
     */
    addComponent(component) {
      const provider = this.getProvider(component.name);
      if (provider.isComponentSet()) {
        throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
      }
      provider.setComponent(component);
    }
    addOrOverwriteComponent(component) {
      const provider = this.getProvider(component.name);
      if (provider.isComponentSet()) {
        this.providers.delete(component.name);
      }
      this.addComponent(component);
    }
    /**
     * getProvider provides a type safe interface where it can only be called with a field name
     * present in NameServiceMapping interface.
     *
     * Firebase SDKs providing services should extend NameServiceMapping interface to register
     * themselves.
     */
    getProvider(name7) {
      if (this.providers.has(name7)) {
        return this.providers.get(name7);
      }
      const provider = new Provider(name7, this);
      this.providers.set(name7, provider);
      return provider;
    }
    getProviders() {
      return Array.from(this.providers.values());
    }
  };

  // node_modules/@firebase/logger/dist/esm/index.esm.js
  var instances = [];
  var LogLevel;
  (function(LogLevel2) {
    LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
    LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
    LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
    LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
    LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
    LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
  })(LogLevel || (LogLevel = {}));
  var levelStringToEnum = {
    "debug": LogLevel.DEBUG,
    "verbose": LogLevel.VERBOSE,
    "info": LogLevel.INFO,
    "warn": LogLevel.WARN,
    "error": LogLevel.ERROR,
    "silent": LogLevel.SILENT
  };
  var defaultLogLevel = LogLevel.INFO;
  var ConsoleMethod = {
    [LogLevel.DEBUG]: "log",
    [LogLevel.VERBOSE]: "log",
    [LogLevel.INFO]: "info",
    [LogLevel.WARN]: "warn",
    [LogLevel.ERROR]: "error"
  };
  var defaultLogHandler = (instance, logType, ...args) => {
    if (logType < instance.logLevel) {
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const method = ConsoleMethod[logType];
    if (method) {
      console[method](`[${now}]  ${instance.name}:`, ...args);
    } else {
      throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
    }
  };
  var Logger = class {
    /**
     * Gives you an instance of a Logger to capture messages according to
     * Firebase's logging scheme.
     *
     * @param name The name that the logs will be associated with
     */
    constructor(name7) {
      this.name = name7;
      this._logLevel = defaultLogLevel;
      this._logHandler = defaultLogHandler;
      this._userLogHandler = null;
      instances.push(this);
    }
    get logLevel() {
      return this._logLevel;
    }
    set logLevel(val) {
      if (!(val in LogLevel)) {
        throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
      }
      this._logLevel = val;
    }
    // Workaround for setter/getter having to be the same type.
    setLogLevel(val) {
      this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
    }
    get logHandler() {
      return this._logHandler;
    }
    set logHandler(val) {
      if (typeof val !== "function") {
        throw new TypeError("Value assigned to `logHandler` must be a function");
      }
      this._logHandler = val;
    }
    get userLogHandler() {
      return this._userLogHandler;
    }
    set userLogHandler(val) {
      this._userLogHandler = val;
    }
    /**
     * The functions below are all based on the `console` interface
     */
    debug(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
      this._logHandler(this, LogLevel.DEBUG, ...args);
    }
    log(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
      this._logHandler(this, LogLevel.VERBOSE, ...args);
    }
    info(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
      this._logHandler(this, LogLevel.INFO, ...args);
    }
    warn(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
      this._logHandler(this, LogLevel.WARN, ...args);
    }
    error(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
      this._logHandler(this, LogLevel.ERROR, ...args);
    }
  };

  // node_modules/idb/build/wrap-idb-value.js
  var instanceOfAny = (object, constructors) => constructors.some((c2) => object instanceof c2);
  var idbProxyableTypes;
  var cursorAdvanceMethods;
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  var cursorRequestMap = /* @__PURE__ */ new WeakMap();
  var transactionDoneMap = /* @__PURE__ */ new WeakMap();
  var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
  var transformCache = /* @__PURE__ */ new WeakMap();
  var reverseTransformCache = /* @__PURE__ */ new WeakMap();
  function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
      const unlisten = () => {
        request.removeEventListener("success", success);
        request.removeEventListener("error", error);
      };
      const success = () => {
        resolve(wrap(request.result));
        unlisten();
      };
      const error = () => {
        reject(request.error);
        unlisten();
      };
      request.addEventListener("success", success);
      request.addEventListener("error", error);
    });
    promise.then((value) => {
      if (value instanceof IDBCursor) {
        cursorRequestMap.set(value, request);
      }
    }).catch(() => {
    });
    reverseTransformCache.set(promise, request);
    return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
    if (transactionDoneMap.has(tx))
      return;
    const done = new Promise((resolve, reject) => {
      const unlisten = () => {
        tx.removeEventListener("complete", complete);
        tx.removeEventListener("error", error);
        tx.removeEventListener("abort", error);
      };
      const complete = () => {
        resolve();
        unlisten();
      };
      const error = () => {
        reject(tx.error || new DOMException("AbortError", "AbortError"));
        unlisten();
      };
      tx.addEventListener("complete", complete);
      tx.addEventListener("error", error);
      tx.addEventListener("abort", error);
    });
    transactionDoneMap.set(tx, done);
  }
  var idbProxyTraps = {
    get(target, prop, receiver) {
      if (target instanceof IDBTransaction) {
        if (prop === "done")
          return transactionDoneMap.get(target);
        if (prop === "objectStoreNames") {
          return target.objectStoreNames || transactionStoreNamesMap.get(target);
        }
        if (prop === "store") {
          return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
        }
      }
      return wrap(target[prop]);
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
    has(target, prop) {
      if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
        return true;
      }
      return prop in target;
    }
  };
  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
    if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
      return function(storeNames, ...args) {
        const tx = func.call(unwrap(this), storeNames, ...args);
        transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
        return wrap(tx);
      };
    }
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap(this), args);
        return wrap(cursorRequestMap.get(this));
      };
    }
    return function(...args) {
      return wrap(func.apply(unwrap(this), args));
    };
  }
  function transformCachableValue(value) {
    if (typeof value === "function")
      return wrapFunction(value);
    if (value instanceof IDBTransaction)
      cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
      return new Proxy(value, idbProxyTraps);
    return value;
  }
  function wrap(value) {
    if (value instanceof IDBRequest)
      return promisifyRequest(value);
    if (transformCache.has(value))
      return transformCache.get(value);
    const newValue = transformCachableValue(value);
    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }
    return newValue;
  }
  var unwrap = (value) => reverseTransformCache.get(value);

  // node_modules/idb/build/index.js
  function openDB(name7, version11, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name7, version11);
    const openPromise = wrap(request);
    if (upgrade) {
      request.addEventListener("upgradeneeded", (event) => {
        upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
      });
    }
    if (blocked) {
      request.addEventListener("blocked", (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion,
        event.newVersion,
        event
      ));
    }
    openPromise.then((db) => {
      if (terminated)
        db.addEventListener("close", () => terminated());
      if (blocking) {
        db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
      }
    }).catch(() => {
    });
    return openPromise;
  }
  function deleteDB(name7, { blocked } = {}) {
    const request = indexedDB.deleteDatabase(name7);
    if (blocked) {
      request.addEventListener("blocked", (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion,
        event
      ));
    }
    return wrap(request).then(() => void 0);
  }
  var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
  var writeMethods = ["put", "add", "delete", "clear"];
  var cachedMethods = /* @__PURE__ */ new Map();
  function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
      return;
    }
    if (cachedMethods.get(prop))
      return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
      // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
      !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
    ) {
      return;
    }
    const method = async function(storeName, ...args) {
      const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
      let target2 = tx.store;
      if (useIndex)
        target2 = target2.index(args.shift());
      return (await Promise.all([
        target2[targetFuncName](...args),
        isWrite && tx.done
      ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
  }
  replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
  }));

  // node_modules/@firebase/app/dist/esm/index.esm.js
  var PlatformLoggerServiceImpl = class {
    constructor(container) {
      this.container = container;
    }
    // In initial implementation, this will be called by installations on
    // auth token refresh, and installations will send this string.
    getPlatformInfoString() {
      const providers = this.container.getProviders();
      return providers.map((provider) => {
        if (isVersionServiceProvider(provider)) {
          const service = provider.getImmediate();
          return `${service.library}/${service.version}`;
        } else {
          return null;
        }
      }).filter((logString) => logString).join(" ");
    }
  };
  function isVersionServiceProvider(provider) {
    const component = provider.getComponent();
    return component?.type === "VERSION";
  }
  var name$q = "@firebase/app";
  var version$1 = "0.14.8";
  var logger = new Logger("@firebase/app");
  var name$p = "@firebase/app-compat";
  var name$o = "@firebase/analytics-compat";
  var name$n = "@firebase/analytics";
  var name$m = "@firebase/app-check-compat";
  var name$l = "@firebase/app-check";
  var name$k = "@firebase/auth";
  var name$j = "@firebase/auth-compat";
  var name$i = "@firebase/database";
  var name$h = "@firebase/data-connect";
  var name$g = "@firebase/database-compat";
  var name$f = "@firebase/functions";
  var name$e = "@firebase/functions-compat";
  var name$d = "@firebase/installations";
  var name$c = "@firebase/installations-compat";
  var name$b = "@firebase/messaging";
  var name$a = "@firebase/messaging-compat";
  var name$9 = "@firebase/performance";
  var name$8 = "@firebase/performance-compat";
  var name$7 = "@firebase/remote-config";
  var name$6 = "@firebase/remote-config-compat";
  var name$5 = "@firebase/storage";
  var name$4 = "@firebase/storage-compat";
  var name$3 = "@firebase/firestore";
  var name$2 = "@firebase/ai";
  var name$1 = "@firebase/firestore-compat";
  var name = "firebase";
  var version5 = "12.9.0";
  var DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
  var PLATFORM_LOG_STRING = {
    [name$q]: "fire-core",
    [name$p]: "fire-core-compat",
    [name$n]: "fire-analytics",
    [name$o]: "fire-analytics-compat",
    [name$l]: "fire-app-check",
    [name$m]: "fire-app-check-compat",
    [name$k]: "fire-auth",
    [name$j]: "fire-auth-compat",
    [name$i]: "fire-rtdb",
    [name$h]: "fire-data-connect",
    [name$g]: "fire-rtdb-compat",
    [name$f]: "fire-fn",
    [name$e]: "fire-fn-compat",
    [name$d]: "fire-iid",
    [name$c]: "fire-iid-compat",
    [name$b]: "fire-fcm",
    [name$a]: "fire-fcm-compat",
    [name$9]: "fire-perf",
    [name$8]: "fire-perf-compat",
    [name$7]: "fire-rc",
    [name$6]: "fire-rc-compat",
    [name$5]: "fire-gcs",
    [name$4]: "fire-gcs-compat",
    [name$3]: "fire-fst",
    [name$1]: "fire-fst-compat",
    [name$2]: "fire-vertex",
    "fire-js": "fire-js",
    // Platform identifier for JS SDK.
    [name]: "fire-js-all"
  };
  var _apps = /* @__PURE__ */ new Map();
  var _serverApps = /* @__PURE__ */ new Map();
  var _components = /* @__PURE__ */ new Map();
  function _addComponent(app2, component) {
    try {
      app2.container.addComponent(component);
    } catch (e2) {
      logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app2.name}`, e2);
    }
  }
  function _registerComponent(component) {
    const componentName = component.name;
    if (_components.has(componentName)) {
      logger.debug(`There were multiple attempts to register component ${componentName}.`);
      return false;
    }
    _components.set(componentName, component);
    for (const app2 of _apps.values()) {
      _addComponent(app2, component);
    }
    for (const serverApp of _serverApps.values()) {
      _addComponent(serverApp, component);
    }
    return true;
  }
  function _getProvider(app2, name7) {
    const heartbeatController = app2.container.getProvider("heartbeat").getImmediate({ optional: true });
    if (heartbeatController) {
      void heartbeatController.triggerHeartbeat();
    }
    return app2.container.getProvider(name7);
  }
  function _isFirebaseServerApp(obj) {
    if (obj === null || obj === void 0) {
      return false;
    }
    return obj.settings !== void 0;
  }
  var ERRORS = {
    [
      "no-app"
      /* AppError.NO_APP */
    ]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
    [
      "bad-app-name"
      /* AppError.BAD_APP_NAME */
    ]: "Illegal App name: '{$appName}'",
    [
      "duplicate-app"
      /* AppError.DUPLICATE_APP */
    ]: "Firebase App named '{$appName}' already exists with different options or config",
    [
      "app-deleted"
      /* AppError.APP_DELETED */
    ]: "Firebase App named '{$appName}' already deleted",
    [
      "server-app-deleted"
      /* AppError.SERVER_APP_DELETED */
    ]: "Firebase Server App has been deleted",
    [
      "no-options"
      /* AppError.NO_OPTIONS */
    ]: "Need to provide options, when not being deployed to hosting via source.",
    [
      "invalid-app-argument"
      /* AppError.INVALID_APP_ARGUMENT */
    ]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
    [
      "invalid-log-argument"
      /* AppError.INVALID_LOG_ARGUMENT */
    ]: "First argument to `onLog` must be null or a function.",
    [
      "idb-open"
      /* AppError.IDB_OPEN */
    ]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "idb-get"
      /* AppError.IDB_GET */
    ]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "idb-set"
      /* AppError.IDB_WRITE */
    ]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "idb-delete"
      /* AppError.IDB_DELETE */
    ]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "finalization-registry-not-supported"
      /* AppError.FINALIZATION_REGISTRY_NOT_SUPPORTED */
    ]: "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
    [
      "invalid-server-app-environment"
      /* AppError.INVALID_SERVER_APP_ENVIRONMENT */
    ]: "FirebaseServerApp is not for use in browser environments."
  };
  var ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);
  var FirebaseAppImpl = class {
    constructor(options, config, container) {
      this._isDeleted = false;
      this._options = { ...options };
      this._config = { ...config };
      this._name = config.name;
      this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
      this._container = container;
      this.container.addComponent(new Component(
        "app",
        () => this,
        "PUBLIC"
        /* ComponentType.PUBLIC */
      ));
    }
    get automaticDataCollectionEnabled() {
      this.checkDestroyed();
      return this._automaticDataCollectionEnabled;
    }
    set automaticDataCollectionEnabled(val) {
      this.checkDestroyed();
      this._automaticDataCollectionEnabled = val;
    }
    get name() {
      this.checkDestroyed();
      return this._name;
    }
    get options() {
      this.checkDestroyed();
      return this._options;
    }
    get config() {
      this.checkDestroyed();
      return this._config;
    }
    get container() {
      return this._container;
    }
    get isDeleted() {
      return this._isDeleted;
    }
    set isDeleted(val) {
      this._isDeleted = val;
    }
    /**
     * This function will throw an Error if the App has already been deleted -
     * use before performing API actions on the App.
     */
    checkDestroyed() {
      if (this.isDeleted) {
        throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
      }
    }
  };
  var SDK_VERSION = version5;
  function initializeApp(_options, rawConfig = {}) {
    let options = _options;
    if (typeof rawConfig !== "object") {
      const name8 = rawConfig;
      rawConfig = { name: name8 };
    }
    const config = {
      name: DEFAULT_ENTRY_NAME2,
      automaticDataCollectionEnabled: true,
      ...rawConfig
    };
    const name7 = config.name;
    if (typeof name7 !== "string" || !name7) {
      throw ERROR_FACTORY.create("bad-app-name", {
        appName: String(name7)
      });
    }
    options || (options = getDefaultAppConfig());
    if (!options) {
      throw ERROR_FACTORY.create(
        "no-options"
        /* AppError.NO_OPTIONS */
      );
    }
    const existingApp = _apps.get(name7);
    if (existingApp) {
      if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
        return existingApp;
      } else {
        throw ERROR_FACTORY.create("duplicate-app", { appName: name7 });
      }
    }
    const container = new ComponentContainer(name7);
    for (const component of _components.values()) {
      container.addComponent(component);
    }
    const newApp = new FirebaseAppImpl(options, config, container);
    _apps.set(name7, newApp);
    return newApp;
  }
  function getApp(name7 = DEFAULT_ENTRY_NAME2) {
    const app2 = _apps.get(name7);
    if (!app2 && name7 === DEFAULT_ENTRY_NAME2 && getDefaultAppConfig()) {
      return initializeApp();
    }
    if (!app2) {
      throw ERROR_FACTORY.create("no-app", { appName: name7 });
    }
    return app2;
  }
  function registerVersion(libraryKeyOrName, version11, variant) {
    let library = PLATFORM_LOG_STRING[libraryKeyOrName] ?? libraryKeyOrName;
    if (variant) {
      library += `-${variant}`;
    }
    const libraryMismatch = library.match(/\s|\//);
    const versionMismatch = version11.match(/\s|\//);
    if (libraryMismatch || versionMismatch) {
      const warning = [
        `Unable to register library "${library}" with version "${version11}":`
      ];
      if (libraryMismatch) {
        warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
      }
      if (libraryMismatch && versionMismatch) {
        warning.push("and");
      }
      if (versionMismatch) {
        warning.push(`version name "${version11}" contains illegal characters (whitespace or "/")`);
      }
      logger.warn(warning.join(" "));
      return;
    }
    _registerComponent(new Component(
      `${library}-version`,
      () => ({ library, version: version11 }),
      "VERSION"
      /* ComponentType.VERSION */
    ));
  }
  var DB_NAME = "firebase-heartbeat-database";
  var DB_VERSION = 1;
  var STORE_NAME = "firebase-heartbeat-store";
  var dbPromise = null;
  function getDbPromise() {
    if (!dbPromise) {
      dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade: (db, oldVersion) => {
          switch (oldVersion) {
            case 0:
              try {
                db.createObjectStore(STORE_NAME);
              } catch (e2) {
                console.warn(e2);
              }
          }
        }
      }).catch((e2) => {
        throw ERROR_FACTORY.create("idb-open", {
          originalErrorMessage: e2.message
        });
      });
    }
    return dbPromise;
  }
  async function readHeartbeatsFromIndexedDB(app2) {
    try {
      const db = await getDbPromise();
      const tx = db.transaction(STORE_NAME);
      const result = await tx.objectStore(STORE_NAME).get(computeKey(app2));
      await tx.done;
      return result;
    } catch (e2) {
      if (e2 instanceof FirebaseError) {
        logger.warn(e2.message);
      } else {
        const idbGetError = ERROR_FACTORY.create("idb-get", {
          originalErrorMessage: e2?.message
        });
        logger.warn(idbGetError.message);
      }
    }
  }
  async function writeHeartbeatsToIndexedDB(app2, heartbeatObject) {
    try {
      const db = await getDbPromise();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const objectStore = tx.objectStore(STORE_NAME);
      await objectStore.put(heartbeatObject, computeKey(app2));
      await tx.done;
    } catch (e2) {
      if (e2 instanceof FirebaseError) {
        logger.warn(e2.message);
      } else {
        const idbGetError = ERROR_FACTORY.create("idb-set", {
          originalErrorMessage: e2?.message
        });
        logger.warn(idbGetError.message);
      }
    }
  }
  function computeKey(app2) {
    return `${app2.name}!${app2.options.appId}`;
  }
  var MAX_HEADER_BYTES = 1024;
  var MAX_NUM_STORED_HEARTBEATS = 30;
  var HeartbeatServiceImpl = class {
    constructor(container) {
      this.container = container;
      this._heartbeatsCache = null;
      const app2 = this.container.getProvider("app").getImmediate();
      this._storage = new HeartbeatStorageImpl(app2);
      this._heartbeatsCachePromise = this._storage.read().then((result) => {
        this._heartbeatsCache = result;
        return result;
      });
    }
    /**
     * Called to report a heartbeat. The function will generate
     * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
     * to IndexedDB.
     * Note that we only store one heartbeat per day. So if a heartbeat for today is
     * already logged, subsequent calls to this function in the same day will be ignored.
     */
    async triggerHeartbeat() {
      try {
        const platformLogger = this.container.getProvider("platform-logger").getImmediate();
        const agent = platformLogger.getPlatformInfoString();
        const date = getUTCDateString();
        if (this._heartbeatsCache?.heartbeats == null) {
          this._heartbeatsCache = await this._heartbeatsCachePromise;
          if (this._heartbeatsCache?.heartbeats == null) {
            return;
          }
        }
        if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
          return;
        } else {
          this._heartbeatsCache.heartbeats.push({ date, agent });
          if (this._heartbeatsCache.heartbeats.length > MAX_NUM_STORED_HEARTBEATS) {
            const earliestHeartbeatIdx = getEarliestHeartbeatIdx(this._heartbeatsCache.heartbeats);
            this._heartbeatsCache.heartbeats.splice(earliestHeartbeatIdx, 1);
          }
        }
        return this._storage.overwrite(this._heartbeatsCache);
      } catch (e2) {
        logger.warn(e2);
      }
    }
    /**
     * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
     * It also clears all heartbeats from memory as well as in IndexedDB.
     *
     * NOTE: Consuming product SDKs should not send the header if this method
     * returns an empty string.
     */
    async getHeartbeatsHeader() {
      try {
        if (this._heartbeatsCache === null) {
          await this._heartbeatsCachePromise;
        }
        if (this._heartbeatsCache?.heartbeats == null || this._heartbeatsCache.heartbeats.length === 0) {
          return "";
        }
        const date = getUTCDateString();
        const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
        const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
        this._heartbeatsCache.lastSentHeartbeatDate = date;
        if (unsentEntries.length > 0) {
          this._heartbeatsCache.heartbeats = unsentEntries;
          await this._storage.overwrite(this._heartbeatsCache);
        } else {
          this._heartbeatsCache.heartbeats = [];
          void this._storage.overwrite(this._heartbeatsCache);
        }
        return headerString;
      } catch (e2) {
        logger.warn(e2);
        return "";
      }
    }
  };
  function getUTCDateString() {
    const today = /* @__PURE__ */ new Date();
    return today.toISOString().substring(0, 10);
  }
  function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
    const heartbeatsToSend = [];
    let unsentEntries = heartbeatsCache.slice();
    for (const singleDateHeartbeat of heartbeatsCache) {
      const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
      if (!heartbeatEntry) {
        heartbeatsToSend.push({
          agent: singleDateHeartbeat.agent,
          dates: [singleDateHeartbeat.date]
        });
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatsToSend.pop();
          break;
        }
      } else {
        heartbeatEntry.dates.push(singleDateHeartbeat.date);
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatEntry.dates.pop();
          break;
        }
      }
      unsentEntries = unsentEntries.slice(1);
    }
    return {
      heartbeatsToSend,
      unsentEntries
    };
  }
  var HeartbeatStorageImpl = class {
    constructor(app2) {
      this.app = app2;
      this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
    }
    async runIndexedDBEnvironmentCheck() {
      if (!isIndexedDBAvailable()) {
        return false;
      } else {
        return validateIndexedDBOpenable().then(() => true).catch(() => false);
      }
    }
    /**
     * Read all heartbeats.
     */
    async read() {
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return { heartbeats: [] };
      } else {
        const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
        if (idbHeartbeatObject?.heartbeats) {
          return idbHeartbeatObject;
        } else {
          return { heartbeats: [] };
        }
      }
    }
    // overwrite the storage with the provided heartbeats
    async overwrite(heartbeatsObject) {
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return;
      } else {
        const existingHeartbeatsObject = await this.read();
        return writeHeartbeatsToIndexedDB(this.app, {
          lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
          heartbeats: heartbeatsObject.heartbeats
        });
      }
    }
    // add heartbeats
    async add(heartbeatsObject) {
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return;
      } else {
        const existingHeartbeatsObject = await this.read();
        return writeHeartbeatsToIndexedDB(this.app, {
          lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
          heartbeats: [
            ...existingHeartbeatsObject.heartbeats,
            ...heartbeatsObject.heartbeats
          ]
        });
      }
    }
  };
  function countBytes(heartbeatsCache) {
    return base64urlEncodeWithoutPadding(
      // heartbeatsCache wrapper properties
      JSON.stringify({ version: 2, heartbeats: heartbeatsCache })
    ).length;
  }
  function getEarliestHeartbeatIdx(heartbeats) {
    if (heartbeats.length === 0) {
      return -1;
    }
    let earliestHeartbeatIdx = 0;
    let earliestHeartbeatDate = heartbeats[0].date;
    for (let i2 = 1; i2 < heartbeats.length; i2++) {
      if (heartbeats[i2].date < earliestHeartbeatDate) {
        earliestHeartbeatDate = heartbeats[i2].date;
        earliestHeartbeatIdx = i2;
      }
    }
    return earliestHeartbeatIdx;
  }
  function registerCoreComponents(variant) {
    _registerComponent(new Component(
      "platform-logger",
      (container) => new PlatformLoggerServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    _registerComponent(new Component(
      "heartbeat",
      (container) => new HeartbeatServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    registerVersion(name$q, version$1, variant);
    registerVersion(name$q, version$1, "esm2020");
    registerVersion("fire-js", "");
  }
  registerCoreComponents("");

  // node_modules/firebase/app/dist/esm/index.esm.js
  var name2 = "firebase";
  var version6 = "12.9.0";
  registerVersion(name2, version6, "app");

  // node_modules/@firebase/auth/dist/esm/index-36fcbc82.js
  function _prodErrorMap() {
    return {
      [
        "dependent-sdk-initialized-before-auth"
        /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
      ]: "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."
    };
  }
  var prodErrorMap = _prodErrorMap;
  var _DEFAULT_AUTH_ERROR_FACTORY = new ErrorFactory("auth", "Firebase", _prodErrorMap());
  var logClient = new Logger("@firebase/auth");
  function _logWarn(msg, ...args) {
    if (logClient.logLevel <= LogLevel.WARN) {
      logClient.warn(`Auth (${SDK_VERSION}): ${msg}`, ...args);
    }
  }
  function _logError(msg, ...args) {
    if (logClient.logLevel <= LogLevel.ERROR) {
      logClient.error(`Auth (${SDK_VERSION}): ${msg}`, ...args);
    }
  }
  function _fail(authOrCode, ...rest) {
    throw createErrorInternal(authOrCode, ...rest);
  }
  function _createError(authOrCode, ...rest) {
    return createErrorInternal(authOrCode, ...rest);
  }
  function _errorWithCustomMessage(auth2, code, message) {
    const errorMap = {
      ...prodErrorMap(),
      [code]: message
    };
    const factory2 = new ErrorFactory("auth", "Firebase", errorMap);
    return factory2.create(code, {
      appName: auth2.name
    });
  }
  function _serverAppCurrentUserOperationNotSupportedError(auth2) {
    return _errorWithCustomMessage(auth2, "operation-not-supported-in-this-environment", "Operations that alter the current user are not supported in conjunction with FirebaseServerApp");
  }
  function createErrorInternal(authOrCode, ...rest) {
    if (typeof authOrCode !== "string") {
      const code = rest[0];
      const fullParams = [...rest.slice(1)];
      if (fullParams[0]) {
        fullParams[0].appName = authOrCode.name;
      }
      return authOrCode._errorFactory.create(code, ...fullParams);
    }
    return _DEFAULT_AUTH_ERROR_FACTORY.create(authOrCode, ...rest);
  }
  function _assert(assertion, authOrCode, ...rest) {
    if (!assertion) {
      throw createErrorInternal(authOrCode, ...rest);
    }
  }
  function debugFail(failure) {
    const message = `INTERNAL ASSERTION FAILED: ` + failure;
    _logError(message);
    throw new Error(message);
  }
  function debugAssert(assertion, message) {
    if (!assertion) {
      debugFail(message);
    }
  }
  function _getCurrentUrl() {
    return typeof self !== "undefined" && self.location?.href || "";
  }
  function _isHttpOrHttps() {
    return _getCurrentScheme() === "http:" || _getCurrentScheme() === "https:";
  }
  function _getCurrentScheme() {
    return typeof self !== "undefined" && self.location?.protocol || null;
  }
  function _isOnline() {
    if (typeof navigator !== "undefined" && navigator && "onLine" in navigator && typeof navigator.onLine === "boolean" && // Apply only for traditional web apps and Chrome extensions.
    // This is especially true for Cordova apps which have unreliable
    // navigator.onLine behavior unless cordova-plugin-network-information is
    // installed which overwrites the native navigator.onLine value and
    // defines navigator.connection.
    (_isHttpOrHttps() || isBrowserExtension() || "connection" in navigator)) {
      return navigator.onLine;
    }
    return true;
  }
  function _getUserLanguage() {
    if (typeof navigator === "undefined") {
      return null;
    }
    const navigatorLanguage = navigator;
    return (
      // Most reliable, but only supported in Chrome/Firefox.
      navigatorLanguage.languages && navigatorLanguage.languages[0] || // Supported in most browsers, but returns the language of the browser
      // UI, not the language set in browser settings.
      navigatorLanguage.language || // Couldn't determine language.
      null
    );
  }
  var Delay = class {
    constructor(shortDelay, longDelay) {
      this.shortDelay = shortDelay;
      this.longDelay = longDelay;
      debugAssert(longDelay > shortDelay, "Short delay should be less than long delay!");
      this.isMobile = isMobileCordova() || isReactNative();
    }
    get() {
      if (!_isOnline()) {
        return Math.min(5e3, this.shortDelay);
      }
      return this.isMobile ? this.longDelay : this.shortDelay;
    }
  };
  function _emulatorUrl(config, path) {
    debugAssert(config.emulator, "Emulator should always be set here");
    const { url } = config.emulator;
    if (!path) {
      return url;
    }
    return `${url}${path.startsWith("/") ? path.slice(1) : path}`;
  }
  var FetchProvider = class {
    static initialize(fetchImpl, headersImpl, responseImpl) {
      this.fetchImpl = fetchImpl;
      if (headersImpl) {
        this.headersImpl = headersImpl;
      }
      if (responseImpl) {
        this.responseImpl = responseImpl;
      }
    }
    static fetch() {
      if (this.fetchImpl) {
        return this.fetchImpl;
      }
      if (typeof self !== "undefined" && "fetch" in self) {
        return self.fetch;
      }
      if (typeof globalThis !== "undefined" && globalThis.fetch) {
        return globalThis.fetch;
      }
      if (typeof fetch !== "undefined") {
        return fetch;
      }
      debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
    }
    static headers() {
      if (this.headersImpl) {
        return this.headersImpl;
      }
      if (typeof self !== "undefined" && "Headers" in self) {
        return self.Headers;
      }
      if (typeof globalThis !== "undefined" && globalThis.Headers) {
        return globalThis.Headers;
      }
      if (typeof Headers !== "undefined") {
        return Headers;
      }
      debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
    }
    static response() {
      if (this.responseImpl) {
        return this.responseImpl;
      }
      if (typeof self !== "undefined" && "Response" in self) {
        return self.Response;
      }
      if (typeof globalThis !== "undefined" && globalThis.Response) {
        return globalThis.Response;
      }
      if (typeof Response !== "undefined") {
        return Response;
      }
      debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
    }
  };
  var SERVER_ERROR_MAP = {
    // Custom token errors.
    [
      "CREDENTIAL_MISMATCH"
      /* ServerError.CREDENTIAL_MISMATCH */
    ]: "custom-token-mismatch",
    // This can only happen if the SDK sends a bad request.
    [
      "MISSING_CUSTOM_TOKEN"
      /* ServerError.MISSING_CUSTOM_TOKEN */
    ]: "internal-error",
    // Create Auth URI errors.
    [
      "INVALID_IDENTIFIER"
      /* ServerError.INVALID_IDENTIFIER */
    ]: "invalid-email",
    // This can only happen if the SDK sends a bad request.
    [
      "MISSING_CONTINUE_URI"
      /* ServerError.MISSING_CONTINUE_URI */
    ]: "internal-error",
    // Sign in with email and password errors (some apply to sign up too).
    [
      "INVALID_PASSWORD"
      /* ServerError.INVALID_PASSWORD */
    ]: "wrong-password",
    // This can only happen if the SDK sends a bad request.
    [
      "MISSING_PASSWORD"
      /* ServerError.MISSING_PASSWORD */
    ]: "missing-password",
    // Thrown if Email Enumeration Protection is enabled in the project and the email or password is
    // invalid.
    [
      "INVALID_LOGIN_CREDENTIALS"
      /* ServerError.INVALID_LOGIN_CREDENTIALS */
    ]: "invalid-credential",
    // Sign up with email and password errors.
    [
      "EMAIL_EXISTS"
      /* ServerError.EMAIL_EXISTS */
    ]: "email-already-in-use",
    [
      "PASSWORD_LOGIN_DISABLED"
      /* ServerError.PASSWORD_LOGIN_DISABLED */
    ]: "operation-not-allowed",
    // Verify assertion for sign in with credential errors:
    [
      "INVALID_IDP_RESPONSE"
      /* ServerError.INVALID_IDP_RESPONSE */
    ]: "invalid-credential",
    [
      "INVALID_PENDING_TOKEN"
      /* ServerError.INVALID_PENDING_TOKEN */
    ]: "invalid-credential",
    [
      "FEDERATED_USER_ID_ALREADY_LINKED"
      /* ServerError.FEDERATED_USER_ID_ALREADY_LINKED */
    ]: "credential-already-in-use",
    // This can only happen if the SDK sends a bad request.
    [
      "MISSING_REQ_TYPE"
      /* ServerError.MISSING_REQ_TYPE */
    ]: "internal-error",
    // Send Password reset email errors:
    [
      "EMAIL_NOT_FOUND"
      /* ServerError.EMAIL_NOT_FOUND */
    ]: "user-not-found",
    [
      "RESET_PASSWORD_EXCEED_LIMIT"
      /* ServerError.RESET_PASSWORD_EXCEED_LIMIT */
    ]: "too-many-requests",
    [
      "EXPIRED_OOB_CODE"
      /* ServerError.EXPIRED_OOB_CODE */
    ]: "expired-action-code",
    [
      "INVALID_OOB_CODE"
      /* ServerError.INVALID_OOB_CODE */
    ]: "invalid-action-code",
    // This can only happen if the SDK sends a bad request.
    [
      "MISSING_OOB_CODE"
      /* ServerError.MISSING_OOB_CODE */
    ]: "internal-error",
    // Operations that require ID token in request:
    [
      "CREDENTIAL_TOO_OLD_LOGIN_AGAIN"
      /* ServerError.CREDENTIAL_TOO_OLD_LOGIN_AGAIN */
    ]: "requires-recent-login",
    [
      "INVALID_ID_TOKEN"
      /* ServerError.INVALID_ID_TOKEN */
    ]: "invalid-user-token",
    [
      "TOKEN_EXPIRED"
      /* ServerError.TOKEN_EXPIRED */
    ]: "user-token-expired",
    [
      "USER_NOT_FOUND"
      /* ServerError.USER_NOT_FOUND */
    ]: "user-token-expired",
    // Other errors.
    [
      "TOO_MANY_ATTEMPTS_TRY_LATER"
      /* ServerError.TOO_MANY_ATTEMPTS_TRY_LATER */
    ]: "too-many-requests",
    [
      "PASSWORD_DOES_NOT_MEET_REQUIREMENTS"
      /* ServerError.PASSWORD_DOES_NOT_MEET_REQUIREMENTS */
    ]: "password-does-not-meet-requirements",
    // Phone Auth related errors.
    [
      "INVALID_CODE"
      /* ServerError.INVALID_CODE */
    ]: "invalid-verification-code",
    [
      "INVALID_SESSION_INFO"
      /* ServerError.INVALID_SESSION_INFO */
    ]: "invalid-verification-id",
    [
      "INVALID_TEMPORARY_PROOF"
      /* ServerError.INVALID_TEMPORARY_PROOF */
    ]: "invalid-credential",
    [
      "MISSING_SESSION_INFO"
      /* ServerError.MISSING_SESSION_INFO */
    ]: "missing-verification-id",
    [
      "SESSION_EXPIRED"
      /* ServerError.SESSION_EXPIRED */
    ]: "code-expired",
    // Other action code errors when additional settings passed.
    // MISSING_CONTINUE_URI is getting mapped to INTERNAL_ERROR above.
    // This is OK as this error will be caught by client side validation.
    [
      "MISSING_ANDROID_PACKAGE_NAME"
      /* ServerError.MISSING_ANDROID_PACKAGE_NAME */
    ]: "missing-android-pkg-name",
    [
      "UNAUTHORIZED_DOMAIN"
      /* ServerError.UNAUTHORIZED_DOMAIN */
    ]: "unauthorized-continue-uri",
    // getProjectConfig errors when clientId is passed.
    [
      "INVALID_OAUTH_CLIENT_ID"
      /* ServerError.INVALID_OAUTH_CLIENT_ID */
    ]: "invalid-oauth-client-id",
    // User actions (sign-up or deletion) disabled errors.
    [
      "ADMIN_ONLY_OPERATION"
      /* ServerError.ADMIN_ONLY_OPERATION */
    ]: "admin-restricted-operation",
    // Multi factor related errors.
    [
      "INVALID_MFA_PENDING_CREDENTIAL"
      /* ServerError.INVALID_MFA_PENDING_CREDENTIAL */
    ]: "invalid-multi-factor-session",
    [
      "MFA_ENROLLMENT_NOT_FOUND"
      /* ServerError.MFA_ENROLLMENT_NOT_FOUND */
    ]: "multi-factor-info-not-found",
    [
      "MISSING_MFA_ENROLLMENT_ID"
      /* ServerError.MISSING_MFA_ENROLLMENT_ID */
    ]: "missing-multi-factor-info",
    [
      "MISSING_MFA_PENDING_CREDENTIAL"
      /* ServerError.MISSING_MFA_PENDING_CREDENTIAL */
    ]: "missing-multi-factor-session",
    [
      "SECOND_FACTOR_EXISTS"
      /* ServerError.SECOND_FACTOR_EXISTS */
    ]: "second-factor-already-in-use",
    [
      "SECOND_FACTOR_LIMIT_EXCEEDED"
      /* ServerError.SECOND_FACTOR_LIMIT_EXCEEDED */
    ]: "maximum-second-factor-count-exceeded",
    // Blocking functions related errors.
    [
      "BLOCKING_FUNCTION_ERROR_RESPONSE"
      /* ServerError.BLOCKING_FUNCTION_ERROR_RESPONSE */
    ]: "internal-error",
    // Recaptcha related errors.
    [
      "RECAPTCHA_NOT_ENABLED"
      /* ServerError.RECAPTCHA_NOT_ENABLED */
    ]: "recaptcha-not-enabled",
    [
      "MISSING_RECAPTCHA_TOKEN"
      /* ServerError.MISSING_RECAPTCHA_TOKEN */
    ]: "missing-recaptcha-token",
    [
      "INVALID_RECAPTCHA_TOKEN"
      /* ServerError.INVALID_RECAPTCHA_TOKEN */
    ]: "invalid-recaptcha-token",
    [
      "INVALID_RECAPTCHA_ACTION"
      /* ServerError.INVALID_RECAPTCHA_ACTION */
    ]: "invalid-recaptcha-action",
    [
      "MISSING_CLIENT_TYPE"
      /* ServerError.MISSING_CLIENT_TYPE */
    ]: "missing-client-type",
    [
      "MISSING_RECAPTCHA_VERSION"
      /* ServerError.MISSING_RECAPTCHA_VERSION */
    ]: "missing-recaptcha-version",
    [
      "INVALID_RECAPTCHA_VERSION"
      /* ServerError.INVALID_RECAPTCHA_VERSION */
    ]: "invalid-recaptcha-version",
    [
      "INVALID_REQ_TYPE"
      /* ServerError.INVALID_REQ_TYPE */
    ]: "invalid-req-type"
    /* AuthErrorCode.INVALID_REQ_TYPE */
  };
  var CookieAuthProxiedEndpoints = [
    "/v1/accounts:signInWithCustomToken",
    "/v1/accounts:signInWithEmailLink",
    "/v1/accounts:signInWithIdp",
    "/v1/accounts:signInWithPassword",
    "/v1/accounts:signInWithPhoneNumber",
    "/v1/token"
    /* Endpoint.TOKEN */
  ];
  var DEFAULT_API_TIMEOUT_MS = new Delay(3e4, 6e4);
  function _addTidIfNecessary(auth2, request) {
    if (auth2.tenantId && !request.tenantId) {
      return {
        ...request,
        tenantId: auth2.tenantId
      };
    }
    return request;
  }
  async function _performApiRequest(auth2, method, path, request, customErrorMap = {}) {
    return _performFetchWithErrorHandling(auth2, customErrorMap, async () => {
      let body = {};
      let params = {};
      if (request) {
        if (method === "GET") {
          params = request;
        } else {
          body = {
            body: JSON.stringify(request)
          };
        }
      }
      const query = querystring({
        key: auth2.config.apiKey,
        ...params
      }).slice(1);
      const headers = await auth2._getAdditionalHeaders();
      headers[
        "Content-Type"
        /* HttpHeader.CONTENT_TYPE */
      ] = "application/json";
      if (auth2.languageCode) {
        headers[
          "X-Firebase-Locale"
          /* HttpHeader.X_FIREBASE_LOCALE */
        ] = auth2.languageCode;
      }
      const fetchArgs = {
        method,
        headers,
        ...body
      };
      if (!isCloudflareWorker()) {
        fetchArgs.referrerPolicy = "no-referrer";
      }
      if (auth2.emulatorConfig && isCloudWorkstation(auth2.emulatorConfig.host)) {
        fetchArgs.credentials = "include";
      }
      return FetchProvider.fetch()(await _getFinalTarget(auth2, auth2.config.apiHost, path, query), fetchArgs);
    });
  }
  async function _performFetchWithErrorHandling(auth2, customErrorMap, fetchFn) {
    auth2._canInitEmulator = false;
    const errorMap = { ...SERVER_ERROR_MAP, ...customErrorMap };
    try {
      const networkTimeout = new NetworkTimeout(auth2);
      const response = await Promise.race([
        fetchFn(),
        networkTimeout.promise
      ]);
      networkTimeout.clearNetworkTimeout();
      const json = await response.json();
      if ("needConfirmation" in json) {
        throw _makeTaggedError(auth2, "account-exists-with-different-credential", json);
      }
      if (response.ok && !("errorMessage" in json)) {
        return json;
      } else {
        const errorMessage = response.ok ? json.errorMessage : json.error.message;
        const [serverErrorCode, serverErrorMessage] = errorMessage.split(" : ");
        if (serverErrorCode === "FEDERATED_USER_ID_ALREADY_LINKED") {
          throw _makeTaggedError(auth2, "credential-already-in-use", json);
        } else if (serverErrorCode === "EMAIL_EXISTS") {
          throw _makeTaggedError(auth2, "email-already-in-use", json);
        } else if (serverErrorCode === "USER_DISABLED") {
          throw _makeTaggedError(auth2, "user-disabled", json);
        }
        const authError = errorMap[serverErrorCode] || serverErrorCode.toLowerCase().replace(/[_\s]+/g, "-");
        if (serverErrorMessage) {
          throw _errorWithCustomMessage(auth2, authError, serverErrorMessage);
        } else {
          _fail(auth2, authError);
        }
      }
    } catch (e2) {
      if (e2 instanceof FirebaseError) {
        throw e2;
      }
      _fail(auth2, "network-request-failed", { "message": String(e2) });
    }
  }
  async function _performSignInRequest(auth2, method, path, request, customErrorMap = {}) {
    const serverResponse = await _performApiRequest(auth2, method, path, request, customErrorMap);
    if ("mfaPendingCredential" in serverResponse) {
      _fail(auth2, "multi-factor-auth-required", {
        _serverResponse: serverResponse
      });
    }
    return serverResponse;
  }
  async function _getFinalTarget(auth2, host, path, query) {
    const base = `${host}${path}?${query}`;
    const authInternal = auth2;
    const finalTarget = authInternal.config.emulator ? _emulatorUrl(auth2.config, base) : `${auth2.config.apiScheme}://${base}`;
    if (CookieAuthProxiedEndpoints.includes(path)) {
      await authInternal._persistenceManagerAvailable;
      if (authInternal._getPersistenceType() === "COOKIE") {
        const cookiePersistence = authInternal._getPersistence();
        return cookiePersistence._getFinalTarget(finalTarget).toString();
      }
    }
    return finalTarget;
  }
  function _parseEnforcementState(enforcementStateStr) {
    switch (enforcementStateStr) {
      case "ENFORCE":
        return "ENFORCE";
      case "AUDIT":
        return "AUDIT";
      case "OFF":
        return "OFF";
      default:
        return "ENFORCEMENT_STATE_UNSPECIFIED";
    }
  }
  var NetworkTimeout = class {
    clearNetworkTimeout() {
      clearTimeout(this.timer);
    }
    constructor(auth2) {
      this.auth = auth2;
      this.timer = null;
      this.promise = new Promise((_, reject) => {
        this.timer = setTimeout(() => {
          return reject(_createError(
            this.auth,
            "network-request-failed"
            /* AuthErrorCode.NETWORK_REQUEST_FAILED */
          ));
        }, DEFAULT_API_TIMEOUT_MS.get());
      });
    }
  };
  function _makeTaggedError(auth2, code, response) {
    const errorParams = {
      appName: auth2.name
    };
    if (response.email) {
      errorParams.email = response.email;
    }
    if (response.phoneNumber) {
      errorParams.phoneNumber = response.phoneNumber;
    }
    const error = _createError(auth2, code, errorParams);
    error.customData._tokenResponse = response;
    return error;
  }
  function isEnterprise(grecaptcha) {
    return grecaptcha !== void 0 && grecaptcha.enterprise !== void 0;
  }
  var RecaptchaConfig = class {
    constructor(response) {
      this.siteKey = "";
      this.recaptchaEnforcementState = [];
      if (response.recaptchaKey === void 0) {
        throw new Error("recaptchaKey undefined");
      }
      this.siteKey = response.recaptchaKey.split("/")[3];
      this.recaptchaEnforcementState = response.recaptchaEnforcementState;
    }
    /**
     * Returns the reCAPTCHA Enterprise enforcement state for the given provider.
     *
     * @param providerStr - The provider whose enforcement state is to be returned.
     * @returns The reCAPTCHA Enterprise enforcement state for the given provider.
     */
    getProviderEnforcementState(providerStr) {
      if (!this.recaptchaEnforcementState || this.recaptchaEnforcementState.length === 0) {
        return null;
      }
      for (const recaptchaEnforcementState of this.recaptchaEnforcementState) {
        if (recaptchaEnforcementState.provider && recaptchaEnforcementState.provider === providerStr) {
          return _parseEnforcementState(recaptchaEnforcementState.enforcementState);
        }
      }
      return null;
    }
    /**
     * Returns true if the reCAPTCHA Enterprise enforcement state for the provider is set to ENFORCE or AUDIT.
     *
     * @param providerStr - The provider whose enablement state is to be returned.
     * @returns Whether or not reCAPTCHA Enterprise protection is enabled for the given provider.
     */
    isProviderEnabled(providerStr) {
      return this.getProviderEnforcementState(providerStr) === "ENFORCE" || this.getProviderEnforcementState(providerStr) === "AUDIT";
    }
    /**
     * Returns true if reCAPTCHA Enterprise protection is enabled in at least one provider, otherwise
     * returns false.
     *
     * @returns Whether or not reCAPTCHA Enterprise protection is enabled for at least one provider.
     */
    isAnyProviderEnabled() {
      return this.isProviderEnabled(
        "EMAIL_PASSWORD_PROVIDER"
        /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
      ) || this.isProviderEnabled(
        "PHONE_PROVIDER"
        /* RecaptchaAuthProvider.PHONE_PROVIDER */
      );
    }
  };
  async function getRecaptchaConfig(auth2, request) {
    return _performApiRequest(auth2, "GET", "/v2/recaptchaConfig", _addTidIfNecessary(auth2, request));
  }
  async function deleteAccount(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v1/accounts:delete", request);
  }
  async function getAccountInfo(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v1/accounts:lookup", request);
  }
  function utcTimestampToDateString(utcTimestamp) {
    if (!utcTimestamp) {
      return void 0;
    }
    try {
      const date = new Date(Number(utcTimestamp));
      if (!isNaN(date.getTime())) {
        return date.toUTCString();
      }
    } catch (e2) {
    }
    return void 0;
  }
  async function getIdTokenResult(user, forceRefresh = false) {
    const userInternal = getModularInstance(user);
    const token = await userInternal.getIdToken(forceRefresh);
    const claims = _parseToken(token);
    _assert(
      claims && claims.exp && claims.auth_time && claims.iat,
      userInternal.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const firebase = typeof claims.firebase === "object" ? claims.firebase : void 0;
    const signInProvider = firebase?.["sign_in_provider"];
    return {
      claims,
      token,
      authTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.auth_time)),
      issuedAtTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.iat)),
      expirationTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.exp)),
      signInProvider: signInProvider || null,
      signInSecondFactor: firebase?.["sign_in_second_factor"] || null
    };
  }
  function secondsStringToMilliseconds(seconds) {
    return Number(seconds) * 1e3;
  }
  function _parseToken(token) {
    const [algorithm, payload, signature] = token.split(".");
    if (algorithm === void 0 || payload === void 0 || signature === void 0) {
      _logError("JWT malformed, contained fewer than 3 sections");
      return null;
    }
    try {
      const decoded = base64Decode(payload);
      if (!decoded) {
        _logError("Failed to decode base64 JWT payload");
        return null;
      }
      return JSON.parse(decoded);
    } catch (e2) {
      _logError("Caught error parsing JWT payload as JSON", e2?.toString());
      return null;
    }
  }
  function _tokenExpiresIn(token) {
    const parsedToken = _parseToken(token);
    _assert(
      parsedToken,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    _assert(
      typeof parsedToken.exp !== "undefined",
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    _assert(
      typeof parsedToken.iat !== "undefined",
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return Number(parsedToken.exp) - Number(parsedToken.iat);
  }
  async function _logoutIfInvalidated(user, promise, bypassAuthState = false) {
    if (bypassAuthState) {
      return promise;
    }
    try {
      return await promise;
    } catch (e2) {
      if (e2 instanceof FirebaseError && isUserInvalidated(e2)) {
        if (user.auth.currentUser === user) {
          await user.auth.signOut();
        }
      }
      throw e2;
    }
  }
  function isUserInvalidated({ code }) {
    return code === `auth/${"user-disabled"}` || code === `auth/${"user-token-expired"}`;
  }
  var ProactiveRefresh = class {
    constructor(user) {
      this.user = user;
      this.isRunning = false;
      this.timerId = null;
      this.errorBackoff = 3e4;
    }
    _start() {
      if (this.isRunning) {
        return;
      }
      this.isRunning = true;
      this.schedule();
    }
    _stop() {
      if (!this.isRunning) {
        return;
      }
      this.isRunning = false;
      if (this.timerId !== null) {
        clearTimeout(this.timerId);
      }
    }
    getInterval(wasError) {
      if (wasError) {
        const interval = this.errorBackoff;
        this.errorBackoff = Math.min(
          this.errorBackoff * 2,
          96e4
          /* Duration.RETRY_BACKOFF_MAX */
        );
        return interval;
      } else {
        this.errorBackoff = 3e4;
        const expTime = this.user.stsTokenManager.expirationTime ?? 0;
        const interval = expTime - Date.now() - 3e5;
        return Math.max(0, interval);
      }
    }
    schedule(wasError = false) {
      if (!this.isRunning) {
        return;
      }
      const interval = this.getInterval(wasError);
      this.timerId = setTimeout(async () => {
        await this.iteration();
      }, interval);
    }
    async iteration() {
      try {
        await this.user.getIdToken(true);
      } catch (e2) {
        if (e2?.code === `auth/${"network-request-failed"}`) {
          this.schedule(
            /* wasError */
            true
          );
        }
        return;
      }
      this.schedule();
    }
  };
  var UserMetadata = class {
    constructor(createdAt, lastLoginAt) {
      this.createdAt = createdAt;
      this.lastLoginAt = lastLoginAt;
      this._initializeTime();
    }
    _initializeTime() {
      this.lastSignInTime = utcTimestampToDateString(this.lastLoginAt);
      this.creationTime = utcTimestampToDateString(this.createdAt);
    }
    _copy(metadata) {
      this.createdAt = metadata.createdAt;
      this.lastLoginAt = metadata.lastLoginAt;
      this._initializeTime();
    }
    toJSON() {
      return {
        createdAt: this.createdAt,
        lastLoginAt: this.lastLoginAt
      };
    }
  };
  async function _reloadWithoutSaving(user) {
    const auth2 = user.auth;
    const idToken = await user.getIdToken();
    const response = await _logoutIfInvalidated(user, getAccountInfo(auth2, { idToken }));
    _assert(
      response?.users.length,
      auth2,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const coreAccount = response.users[0];
    user._notifyReloadListener(coreAccount);
    const newProviderData = coreAccount.providerUserInfo?.length ? extractProviderData(coreAccount.providerUserInfo) : [];
    const providerData = mergeProviderData(user.providerData, newProviderData);
    const oldIsAnonymous = user.isAnonymous;
    const newIsAnonymous = !(user.email && coreAccount.passwordHash) && !providerData?.length;
    const isAnonymous = !oldIsAnonymous ? false : newIsAnonymous;
    const updates = {
      uid: coreAccount.localId,
      displayName: coreAccount.displayName || null,
      photoURL: coreAccount.photoUrl || null,
      email: coreAccount.email || null,
      emailVerified: coreAccount.emailVerified || false,
      phoneNumber: coreAccount.phoneNumber || null,
      tenantId: coreAccount.tenantId || null,
      providerData,
      metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
      isAnonymous
    };
    Object.assign(user, updates);
  }
  async function reload(user) {
    const userInternal = getModularInstance(user);
    await _reloadWithoutSaving(userInternal);
    await userInternal.auth._persistUserIfCurrent(userInternal);
    userInternal.auth._notifyListenersIfCurrent(userInternal);
  }
  function mergeProviderData(original, newData) {
    const deduped = original.filter((o2) => !newData.some((n) => n.providerId === o2.providerId));
    return [...deduped, ...newData];
  }
  function extractProviderData(providers) {
    return providers.map(({ providerId, ...provider }) => {
      return {
        providerId,
        uid: provider.rawId || "",
        displayName: provider.displayName || null,
        email: provider.email || null,
        phoneNumber: provider.phoneNumber || null,
        photoURL: provider.photoUrl || null
      };
    });
  }
  async function requestStsToken(auth2, refreshToken) {
    const response = await _performFetchWithErrorHandling(auth2, {}, async () => {
      const body = querystring({
        "grant_type": "refresh_token",
        "refresh_token": refreshToken
      }).slice(1);
      const { tokenApiHost, apiKey } = auth2.config;
      const url = await _getFinalTarget(auth2, tokenApiHost, "/v1/token", `key=${apiKey}`);
      const headers = await auth2._getAdditionalHeaders();
      headers[
        "Content-Type"
        /* HttpHeader.CONTENT_TYPE */
      ] = "application/x-www-form-urlencoded";
      const options = {
        method: "POST",
        headers,
        body
      };
      if (auth2.emulatorConfig && isCloudWorkstation(auth2.emulatorConfig.host)) {
        options.credentials = "include";
      }
      return FetchProvider.fetch()(url, options);
    });
    return {
      accessToken: response.access_token,
      expiresIn: response.expires_in,
      refreshToken: response.refresh_token
    };
  }
  async function revokeToken(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts:revokeToken", _addTidIfNecessary(auth2, request));
  }
  var StsTokenManager = class _StsTokenManager {
    constructor() {
      this.refreshToken = null;
      this.accessToken = null;
      this.expirationTime = null;
    }
    get isExpired() {
      return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
    }
    updateFromServerResponse(response) {
      _assert(
        response.idToken,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      _assert(
        typeof response.idToken !== "undefined",
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      _assert(
        typeof response.refreshToken !== "undefined",
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const expiresIn = "expiresIn" in response && typeof response.expiresIn !== "undefined" ? Number(response.expiresIn) : _tokenExpiresIn(response.idToken);
      this.updateTokensAndExpiration(response.idToken, response.refreshToken, expiresIn);
    }
    updateFromIdToken(idToken) {
      _assert(
        idToken.length !== 0,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const expiresIn = _tokenExpiresIn(idToken);
      this.updateTokensAndExpiration(idToken, null, expiresIn);
    }
    async getToken(auth2, forceRefresh = false) {
      if (!forceRefresh && this.accessToken && !this.isExpired) {
        return this.accessToken;
      }
      _assert(
        this.refreshToken,
        auth2,
        "user-token-expired"
        /* AuthErrorCode.TOKEN_EXPIRED */
      );
      if (this.refreshToken) {
        await this.refresh(auth2, this.refreshToken);
        return this.accessToken;
      }
      return null;
    }
    clearRefreshToken() {
      this.refreshToken = null;
    }
    async refresh(auth2, oldToken) {
      const { accessToken, refreshToken, expiresIn } = await requestStsToken(auth2, oldToken);
      this.updateTokensAndExpiration(accessToken, refreshToken, Number(expiresIn));
    }
    updateTokensAndExpiration(accessToken, refreshToken, expiresInSec) {
      this.refreshToken = refreshToken || null;
      this.accessToken = accessToken || null;
      this.expirationTime = Date.now() + expiresInSec * 1e3;
    }
    static fromJSON(appName, object) {
      const { refreshToken, accessToken, expirationTime } = object;
      const manager = new _StsTokenManager();
      if (refreshToken) {
        _assert(typeof refreshToken === "string", "internal-error", {
          appName
        });
        manager.refreshToken = refreshToken;
      }
      if (accessToken) {
        _assert(typeof accessToken === "string", "internal-error", {
          appName
        });
        manager.accessToken = accessToken;
      }
      if (expirationTime) {
        _assert(typeof expirationTime === "number", "internal-error", {
          appName
        });
        manager.expirationTime = expirationTime;
      }
      return manager;
    }
    toJSON() {
      return {
        refreshToken: this.refreshToken,
        accessToken: this.accessToken,
        expirationTime: this.expirationTime
      };
    }
    _assign(stsTokenManager) {
      this.accessToken = stsTokenManager.accessToken;
      this.refreshToken = stsTokenManager.refreshToken;
      this.expirationTime = stsTokenManager.expirationTime;
    }
    _clone() {
      return Object.assign(new _StsTokenManager(), this.toJSON());
    }
    _performRefresh() {
      return debugFail("not implemented");
    }
  };
  function assertStringOrUndefined(assertion, appName) {
    _assert(typeof assertion === "string" || typeof assertion === "undefined", "internal-error", { appName });
  }
  var UserImpl = class _UserImpl {
    constructor({ uid, auth: auth2, stsTokenManager, ...opt }) {
      this.providerId = "firebase";
      this.proactiveRefresh = new ProactiveRefresh(this);
      this.reloadUserInfo = null;
      this.reloadListener = null;
      this.uid = uid;
      this.auth = auth2;
      this.stsTokenManager = stsTokenManager;
      this.accessToken = stsTokenManager.accessToken;
      this.displayName = opt.displayName || null;
      this.email = opt.email || null;
      this.emailVerified = opt.emailVerified || false;
      this.phoneNumber = opt.phoneNumber || null;
      this.photoURL = opt.photoURL || null;
      this.isAnonymous = opt.isAnonymous || false;
      this.tenantId = opt.tenantId || null;
      this.providerData = opt.providerData ? [...opt.providerData] : [];
      this.metadata = new UserMetadata(opt.createdAt || void 0, opt.lastLoginAt || void 0);
    }
    async getIdToken(forceRefresh) {
      const accessToken = await _logoutIfInvalidated(this, this.stsTokenManager.getToken(this.auth, forceRefresh));
      _assert(
        accessToken,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      if (this.accessToken !== accessToken) {
        this.accessToken = accessToken;
        await this.auth._persistUserIfCurrent(this);
        this.auth._notifyListenersIfCurrent(this);
      }
      return accessToken;
    }
    getIdTokenResult(forceRefresh) {
      return getIdTokenResult(this, forceRefresh);
    }
    reload() {
      return reload(this);
    }
    _assign(user) {
      if (this === user) {
        return;
      }
      _assert(
        this.uid === user.uid,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      this.displayName = user.displayName;
      this.photoURL = user.photoURL;
      this.email = user.email;
      this.emailVerified = user.emailVerified;
      this.phoneNumber = user.phoneNumber;
      this.isAnonymous = user.isAnonymous;
      this.tenantId = user.tenantId;
      this.providerData = user.providerData.map((userInfo) => ({ ...userInfo }));
      this.metadata._copy(user.metadata);
      this.stsTokenManager._assign(user.stsTokenManager);
    }
    _clone(auth2) {
      const newUser = new _UserImpl({
        ...this,
        auth: auth2,
        stsTokenManager: this.stsTokenManager._clone()
      });
      newUser.metadata._copy(this.metadata);
      return newUser;
    }
    _onReload(callback) {
      _assert(
        !this.reloadListener,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      this.reloadListener = callback;
      if (this.reloadUserInfo) {
        this._notifyReloadListener(this.reloadUserInfo);
        this.reloadUserInfo = null;
      }
    }
    _notifyReloadListener(userInfo) {
      if (this.reloadListener) {
        this.reloadListener(userInfo);
      } else {
        this.reloadUserInfo = userInfo;
      }
    }
    _startProactiveRefresh() {
      this.proactiveRefresh._start();
    }
    _stopProactiveRefresh() {
      this.proactiveRefresh._stop();
    }
    async _updateTokensIfNecessary(response, reload2 = false) {
      let tokensRefreshed = false;
      if (response.idToken && response.idToken !== this.stsTokenManager.accessToken) {
        this.stsTokenManager.updateFromServerResponse(response);
        tokensRefreshed = true;
      }
      if (reload2) {
        await _reloadWithoutSaving(this);
      }
      await this.auth._persistUserIfCurrent(this);
      if (tokensRefreshed) {
        this.auth._notifyListenersIfCurrent(this);
      }
    }
    async delete() {
      if (_isFirebaseServerApp(this.auth.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this.auth));
      }
      const idToken = await this.getIdToken();
      await _logoutIfInvalidated(this, deleteAccount(this.auth, { idToken }));
      this.stsTokenManager.clearRefreshToken();
      return this.auth.signOut();
    }
    toJSON() {
      return {
        uid: this.uid,
        email: this.email || void 0,
        emailVerified: this.emailVerified,
        displayName: this.displayName || void 0,
        isAnonymous: this.isAnonymous,
        photoURL: this.photoURL || void 0,
        phoneNumber: this.phoneNumber || void 0,
        tenantId: this.tenantId || void 0,
        providerData: this.providerData.map((userInfo) => ({ ...userInfo })),
        stsTokenManager: this.stsTokenManager.toJSON(),
        // Redirect event ID must be maintained in case there is a pending
        // redirect event.
        _redirectEventId: this._redirectEventId,
        ...this.metadata.toJSON(),
        // Required for compatibility with the legacy SDK (go/firebase-auth-sdk-persistence-parsing):
        apiKey: this.auth.config.apiKey,
        appName: this.auth.name
        // Missing authDomain will be tolerated by the legacy SDK.
        // stsTokenManager.apiKey isn't actually required (despite the legacy SDK persisting it).
      };
    }
    get refreshToken() {
      return this.stsTokenManager.refreshToken || "";
    }
    static _fromJSON(auth2, object) {
      const displayName = object.displayName ?? void 0;
      const email = object.email ?? void 0;
      const phoneNumber = object.phoneNumber ?? void 0;
      const photoURL = object.photoURL ?? void 0;
      const tenantId = object.tenantId ?? void 0;
      const _redirectEventId = object._redirectEventId ?? void 0;
      const createdAt = object.createdAt ?? void 0;
      const lastLoginAt = object.lastLoginAt ?? void 0;
      const { uid, emailVerified, isAnonymous, providerData, stsTokenManager: plainObjectTokenManager } = object;
      _assert(
        uid && plainObjectTokenManager,
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const stsTokenManager = StsTokenManager.fromJSON(this.name, plainObjectTokenManager);
      _assert(
        typeof uid === "string",
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      assertStringOrUndefined(displayName, auth2.name);
      assertStringOrUndefined(email, auth2.name);
      _assert(
        typeof emailVerified === "boolean",
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      _assert(
        typeof isAnonymous === "boolean",
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      assertStringOrUndefined(phoneNumber, auth2.name);
      assertStringOrUndefined(photoURL, auth2.name);
      assertStringOrUndefined(tenantId, auth2.name);
      assertStringOrUndefined(_redirectEventId, auth2.name);
      assertStringOrUndefined(createdAt, auth2.name);
      assertStringOrUndefined(lastLoginAt, auth2.name);
      const user = new _UserImpl({
        uid,
        auth: auth2,
        email,
        emailVerified,
        displayName,
        isAnonymous,
        photoURL,
        phoneNumber,
        tenantId,
        stsTokenManager,
        createdAt,
        lastLoginAt
      });
      if (providerData && Array.isArray(providerData)) {
        user.providerData = providerData.map((userInfo) => ({ ...userInfo }));
      }
      if (_redirectEventId) {
        user._redirectEventId = _redirectEventId;
      }
      return user;
    }
    /**
     * Initialize a User from an idToken server response
     * @param auth
     * @param idTokenResponse
     */
    static async _fromIdTokenResponse(auth2, idTokenResponse, isAnonymous = false) {
      const stsTokenManager = new StsTokenManager();
      stsTokenManager.updateFromServerResponse(idTokenResponse);
      const user = new _UserImpl({
        uid: idTokenResponse.localId,
        auth: auth2,
        stsTokenManager,
        isAnonymous
      });
      await _reloadWithoutSaving(user);
      return user;
    }
    /**
     * Initialize a User from an idToken server response
     * @param auth
     * @param idTokenResponse
     */
    static async _fromGetAccountInfoResponse(auth2, response, idToken) {
      const coreAccount = response.users[0];
      _assert(
        coreAccount.localId !== void 0,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const providerData = coreAccount.providerUserInfo !== void 0 ? extractProviderData(coreAccount.providerUserInfo) : [];
      const isAnonymous = !(coreAccount.email && coreAccount.passwordHash) && !providerData?.length;
      const stsTokenManager = new StsTokenManager();
      stsTokenManager.updateFromIdToken(idToken);
      const user = new _UserImpl({
        uid: coreAccount.localId,
        auth: auth2,
        stsTokenManager,
        isAnonymous
      });
      const updates = {
        uid: coreAccount.localId,
        displayName: coreAccount.displayName || null,
        photoURL: coreAccount.photoUrl || null,
        email: coreAccount.email || null,
        emailVerified: coreAccount.emailVerified || false,
        phoneNumber: coreAccount.phoneNumber || null,
        tenantId: coreAccount.tenantId || null,
        providerData,
        metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
        isAnonymous: !(coreAccount.email && coreAccount.passwordHash) && !providerData?.length
      };
      Object.assign(user, updates);
      return user;
    }
  };
  var instanceCache = /* @__PURE__ */ new Map();
  function _getInstance(cls) {
    debugAssert(cls instanceof Function, "Expected a class definition");
    let instance = instanceCache.get(cls);
    if (instance) {
      debugAssert(instance instanceof cls, "Instance stored in cache mismatched with class");
      return instance;
    }
    instance = new cls();
    instanceCache.set(cls, instance);
    return instance;
  }
  var InMemoryPersistence = class {
    constructor() {
      this.type = "NONE";
      this.storage = {};
    }
    async _isAvailable() {
      return true;
    }
    async _set(key, value) {
      this.storage[key] = value;
    }
    async _get(key) {
      const value = this.storage[key];
      return value === void 0 ? null : value;
    }
    async _remove(key) {
      delete this.storage[key];
    }
    _addListener(_key, _listener) {
      return;
    }
    _removeListener(_key, _listener) {
      return;
    }
  };
  InMemoryPersistence.type = "NONE";
  var inMemoryPersistence = InMemoryPersistence;
  function _persistenceKeyName(key, apiKey, appName) {
    return `${"firebase"}:${key}:${apiKey}:${appName}`;
  }
  var PersistenceUserManager = class _PersistenceUserManager {
    constructor(persistence, auth2, userKey) {
      this.persistence = persistence;
      this.auth = auth2;
      this.userKey = userKey;
      const { config, name: name7 } = this.auth;
      this.fullUserKey = _persistenceKeyName(this.userKey, config.apiKey, name7);
      this.fullPersistenceKey = _persistenceKeyName("persistence", config.apiKey, name7);
      this.boundEventHandler = auth2._onStorageEvent.bind(auth2);
      this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
    }
    setCurrentUser(user) {
      return this.persistence._set(this.fullUserKey, user.toJSON());
    }
    async getCurrentUser() {
      const blob = await this.persistence._get(this.fullUserKey);
      if (!blob) {
        return null;
      }
      if (typeof blob === "string") {
        const response = await getAccountInfo(this.auth, { idToken: blob }).catch(() => void 0);
        if (!response) {
          return null;
        }
        return UserImpl._fromGetAccountInfoResponse(this.auth, response, blob);
      }
      return UserImpl._fromJSON(this.auth, blob);
    }
    removeCurrentUser() {
      return this.persistence._remove(this.fullUserKey);
    }
    savePersistenceForRedirect() {
      return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
    }
    async setPersistence(newPersistence) {
      if (this.persistence === newPersistence) {
        return;
      }
      const currentUser = await this.getCurrentUser();
      await this.removeCurrentUser();
      this.persistence = newPersistence;
      if (currentUser) {
        return this.setCurrentUser(currentUser);
      }
    }
    delete() {
      this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
    }
    static async create(auth2, persistenceHierarchy, userKey = "authUser") {
      if (!persistenceHierarchy.length) {
        return new _PersistenceUserManager(_getInstance(inMemoryPersistence), auth2, userKey);
      }
      const availablePersistences = (await Promise.all(persistenceHierarchy.map(async (persistence) => {
        if (await persistence._isAvailable()) {
          return persistence;
        }
        return void 0;
      }))).filter((persistence) => persistence);
      let selectedPersistence = availablePersistences[0] || _getInstance(inMemoryPersistence);
      const key = _persistenceKeyName(userKey, auth2.config.apiKey, auth2.name);
      let userToMigrate = null;
      for (const persistence of persistenceHierarchy) {
        try {
          const blob = await persistence._get(key);
          if (blob) {
            let user;
            if (typeof blob === "string") {
              const response = await getAccountInfo(auth2, {
                idToken: blob
              }).catch(() => void 0);
              if (!response) {
                break;
              }
              user = await UserImpl._fromGetAccountInfoResponse(auth2, response, blob);
            } else {
              user = UserImpl._fromJSON(auth2, blob);
            }
            if (persistence !== selectedPersistence) {
              userToMigrate = user;
            }
            selectedPersistence = persistence;
            break;
          }
        } catch {
        }
      }
      const migrationHierarchy = availablePersistences.filter((p) => p._shouldAllowMigration);
      if (!selectedPersistence._shouldAllowMigration || !migrationHierarchy.length) {
        return new _PersistenceUserManager(selectedPersistence, auth2, userKey);
      }
      selectedPersistence = migrationHierarchy[0];
      if (userToMigrate) {
        await selectedPersistence._set(key, userToMigrate.toJSON());
      }
      await Promise.all(persistenceHierarchy.map(async (persistence) => {
        if (persistence !== selectedPersistence) {
          try {
            await persistence._remove(key);
          } catch {
          }
        }
      }));
      return new _PersistenceUserManager(selectedPersistence, auth2, userKey);
    }
  };
  function _getBrowserName(userAgent) {
    const ua = userAgent.toLowerCase();
    if (ua.includes("opera/") || ua.includes("opr/") || ua.includes("opios/")) {
      return "Opera";
    } else if (_isIEMobile(ua)) {
      return "IEMobile";
    } else if (ua.includes("msie") || ua.includes("trident/")) {
      return "IE";
    } else if (ua.includes("edge/")) {
      return "Edge";
    } else if (_isFirefox(ua)) {
      return "Firefox";
    } else if (ua.includes("silk/")) {
      return "Silk";
    } else if (_isBlackBerry(ua)) {
      return "Blackberry";
    } else if (_isWebOS(ua)) {
      return "Webos";
    } else if (_isSafari(ua)) {
      return "Safari";
    } else if ((ua.includes("chrome/") || _isChromeIOS(ua)) && !ua.includes("edge/")) {
      return "Chrome";
    } else if (_isAndroid(ua)) {
      return "Android";
    } else {
      const re = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/;
      const matches = userAgent.match(re);
      if (matches?.length === 2) {
        return matches[1];
      }
    }
    return "Other";
  }
  function _isFirefox(ua = getUA()) {
    return /firefox\//i.test(ua);
  }
  function _isSafari(userAgent = getUA()) {
    const ua = userAgent.toLowerCase();
    return ua.includes("safari/") && !ua.includes("chrome/") && !ua.includes("crios/") && !ua.includes("android");
  }
  function _isChromeIOS(ua = getUA()) {
    return /crios\//i.test(ua);
  }
  function _isIEMobile(ua = getUA()) {
    return /iemobile/i.test(ua);
  }
  function _isAndroid(ua = getUA()) {
    return /android/i.test(ua);
  }
  function _isBlackBerry(ua = getUA()) {
    return /blackberry/i.test(ua);
  }
  function _isWebOS(ua = getUA()) {
    return /webos/i.test(ua);
  }
  function _isIOS(ua = getUA()) {
    return /iphone|ipad|ipod/i.test(ua) || /macintosh/i.test(ua) && /mobile/i.test(ua);
  }
  function _isIOSStandalone(ua = getUA()) {
    return _isIOS(ua) && !!window.navigator?.standalone;
  }
  function _isIE10() {
    return isIE() && document.documentMode === 10;
  }
  function _isMobileBrowser(ua = getUA()) {
    return _isIOS(ua) || _isAndroid(ua) || _isWebOS(ua) || _isBlackBerry(ua) || /windows phone/i.test(ua) || _isIEMobile(ua);
  }
  function _getClientVersion(clientPlatform, frameworks = []) {
    let reportedPlatform;
    switch (clientPlatform) {
      case "Browser":
        reportedPlatform = _getBrowserName(getUA());
        break;
      case "Worker":
        reportedPlatform = `${_getBrowserName(getUA())}-${clientPlatform}`;
        break;
      default:
        reportedPlatform = clientPlatform;
    }
    const reportedFrameworks = frameworks.length ? frameworks.join(",") : "FirebaseCore-web";
    return `${reportedPlatform}/${"JsCore"}/${SDK_VERSION}/${reportedFrameworks}`;
  }
  var AuthMiddlewareQueue = class {
    constructor(auth2) {
      this.auth = auth2;
      this.queue = [];
    }
    pushCallback(callback, onAbort) {
      const wrappedCallback = (user) => new Promise((resolve, reject) => {
        try {
          const result = callback(user);
          resolve(result);
        } catch (e2) {
          reject(e2);
        }
      });
      wrappedCallback.onAbort = onAbort;
      this.queue.push(wrappedCallback);
      const index = this.queue.length - 1;
      return () => {
        this.queue[index] = () => Promise.resolve();
      };
    }
    async runMiddleware(nextUser) {
      if (this.auth.currentUser === nextUser) {
        return;
      }
      const onAbortStack = [];
      try {
        for (const beforeStateCallback of this.queue) {
          await beforeStateCallback(nextUser);
          if (beforeStateCallback.onAbort) {
            onAbortStack.push(beforeStateCallback.onAbort);
          }
        }
      } catch (e2) {
        onAbortStack.reverse();
        for (const onAbort of onAbortStack) {
          try {
            onAbort();
          } catch (_) {
          }
        }
        throw this.auth._errorFactory.create("login-blocked", {
          originalMessage: e2?.message
        });
      }
    }
  };
  async function _getPasswordPolicy(auth2, request = {}) {
    return _performApiRequest(auth2, "GET", "/v2/passwordPolicy", _addTidIfNecessary(auth2, request));
  }
  var MINIMUM_MIN_PASSWORD_LENGTH = 6;
  var PasswordPolicyImpl = class {
    constructor(response) {
      const responseOptions = response.customStrengthOptions;
      this.customStrengthOptions = {};
      this.customStrengthOptions.minPasswordLength = responseOptions.minPasswordLength ?? MINIMUM_MIN_PASSWORD_LENGTH;
      if (responseOptions.maxPasswordLength) {
        this.customStrengthOptions.maxPasswordLength = responseOptions.maxPasswordLength;
      }
      if (responseOptions.containsLowercaseCharacter !== void 0) {
        this.customStrengthOptions.containsLowercaseLetter = responseOptions.containsLowercaseCharacter;
      }
      if (responseOptions.containsUppercaseCharacter !== void 0) {
        this.customStrengthOptions.containsUppercaseLetter = responseOptions.containsUppercaseCharacter;
      }
      if (responseOptions.containsNumericCharacter !== void 0) {
        this.customStrengthOptions.containsNumericCharacter = responseOptions.containsNumericCharacter;
      }
      if (responseOptions.containsNonAlphanumericCharacter !== void 0) {
        this.customStrengthOptions.containsNonAlphanumericCharacter = responseOptions.containsNonAlphanumericCharacter;
      }
      this.enforcementState = response.enforcementState;
      if (this.enforcementState === "ENFORCEMENT_STATE_UNSPECIFIED") {
        this.enforcementState = "OFF";
      }
      this.allowedNonAlphanumericCharacters = response.allowedNonAlphanumericCharacters?.join("") ?? "";
      this.forceUpgradeOnSignin = response.forceUpgradeOnSignin ?? false;
      this.schemaVersion = response.schemaVersion;
    }
    validatePassword(password) {
      const status = {
        isValid: true,
        passwordPolicy: this
      };
      this.validatePasswordLengthOptions(password, status);
      this.validatePasswordCharacterOptions(password, status);
      status.isValid && (status.isValid = status.meetsMinPasswordLength ?? true);
      status.isValid && (status.isValid = status.meetsMaxPasswordLength ?? true);
      status.isValid && (status.isValid = status.containsLowercaseLetter ?? true);
      status.isValid && (status.isValid = status.containsUppercaseLetter ?? true);
      status.isValid && (status.isValid = status.containsNumericCharacter ?? true);
      status.isValid && (status.isValid = status.containsNonAlphanumericCharacter ?? true);
      return status;
    }
    /**
     * Validates that the password meets the length options for the policy.
     *
     * @param password Password to validate.
     * @param status Validation status.
     */
    validatePasswordLengthOptions(password, status) {
      const minPasswordLength = this.customStrengthOptions.minPasswordLength;
      const maxPasswordLength = this.customStrengthOptions.maxPasswordLength;
      if (minPasswordLength) {
        status.meetsMinPasswordLength = password.length >= minPasswordLength;
      }
      if (maxPasswordLength) {
        status.meetsMaxPasswordLength = password.length <= maxPasswordLength;
      }
    }
    /**
     * Validates that the password meets the character options for the policy.
     *
     * @param password Password to validate.
     * @param status Validation status.
     */
    validatePasswordCharacterOptions(password, status) {
      this.updatePasswordCharacterOptionsStatuses(
        status,
        /* containsLowercaseCharacter= */
        false,
        /* containsUppercaseCharacter= */
        false,
        /* containsNumericCharacter= */
        false,
        /* containsNonAlphanumericCharacter= */
        false
      );
      let passwordChar;
      for (let i2 = 0; i2 < password.length; i2++) {
        passwordChar = password.charAt(i2);
        this.updatePasswordCharacterOptionsStatuses(
          status,
          /* containsLowercaseCharacter= */
          passwordChar >= "a" && passwordChar <= "z",
          /* containsUppercaseCharacter= */
          passwordChar >= "A" && passwordChar <= "Z",
          /* containsNumericCharacter= */
          passwordChar >= "0" && passwordChar <= "9",
          /* containsNonAlphanumericCharacter= */
          this.allowedNonAlphanumericCharacters.includes(passwordChar)
        );
      }
    }
    /**
     * Updates the running validation status with the statuses for the character options.
     * Expected to be called each time a character is processed to update each option status
     * based on the current character.
     *
     * @param status Validation status.
     * @param containsLowercaseCharacter Whether the character is a lowercase letter.
     * @param containsUppercaseCharacter Whether the character is an uppercase letter.
     * @param containsNumericCharacter Whether the character is a numeric character.
     * @param containsNonAlphanumericCharacter Whether the character is a non-alphanumeric character.
     */
    updatePasswordCharacterOptionsStatuses(status, containsLowercaseCharacter, containsUppercaseCharacter, containsNumericCharacter, containsNonAlphanumericCharacter) {
      if (this.customStrengthOptions.containsLowercaseLetter) {
        status.containsLowercaseLetter || (status.containsLowercaseLetter = containsLowercaseCharacter);
      }
      if (this.customStrengthOptions.containsUppercaseLetter) {
        status.containsUppercaseLetter || (status.containsUppercaseLetter = containsUppercaseCharacter);
      }
      if (this.customStrengthOptions.containsNumericCharacter) {
        status.containsNumericCharacter || (status.containsNumericCharacter = containsNumericCharacter);
      }
      if (this.customStrengthOptions.containsNonAlphanumericCharacter) {
        status.containsNonAlphanumericCharacter || (status.containsNonAlphanumericCharacter = containsNonAlphanumericCharacter);
      }
    }
  };
  var AuthImpl = class {
    constructor(app2, heartbeatServiceProvider, appCheckServiceProvider, config) {
      this.app = app2;
      this.heartbeatServiceProvider = heartbeatServiceProvider;
      this.appCheckServiceProvider = appCheckServiceProvider;
      this.config = config;
      this.currentUser = null;
      this.emulatorConfig = null;
      this.operations = Promise.resolve();
      this.authStateSubscription = new Subscription(this);
      this.idTokenSubscription = new Subscription(this);
      this.beforeStateQueue = new AuthMiddlewareQueue(this);
      this.redirectUser = null;
      this.isProactiveRefreshEnabled = false;
      this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1;
      this._canInitEmulator = true;
      this._isInitialized = false;
      this._deleted = false;
      this._initializationPromise = null;
      this._popupRedirectResolver = null;
      this._errorFactory = _DEFAULT_AUTH_ERROR_FACTORY;
      this._agentRecaptchaConfig = null;
      this._tenantRecaptchaConfigs = {};
      this._projectPasswordPolicy = null;
      this._tenantPasswordPolicies = {};
      this._resolvePersistenceManagerAvailable = void 0;
      this.lastNotifiedUid = void 0;
      this.languageCode = null;
      this.tenantId = null;
      this.settings = { appVerificationDisabledForTesting: false };
      this.frameworks = [];
      this.name = app2.name;
      this.clientVersion = config.sdkClientVersion;
      this._persistenceManagerAvailable = new Promise((resolve) => this._resolvePersistenceManagerAvailable = resolve);
    }
    _initializeWithPersistence(persistenceHierarchy, popupRedirectResolver) {
      if (popupRedirectResolver) {
        this._popupRedirectResolver = _getInstance(popupRedirectResolver);
      }
      this._initializationPromise = this.queue(async () => {
        if (this._deleted) {
          return;
        }
        this.persistenceManager = await PersistenceUserManager.create(this, persistenceHierarchy);
        this._resolvePersistenceManagerAvailable?.();
        if (this._deleted) {
          return;
        }
        if (this._popupRedirectResolver?._shouldInitProactively) {
          try {
            await this._popupRedirectResolver._initialize(this);
          } catch (e2) {
          }
        }
        await this.initializeCurrentUser(popupRedirectResolver);
        this.lastNotifiedUid = this.currentUser?.uid || null;
        if (this._deleted) {
          return;
        }
        this._isInitialized = true;
      });
      return this._initializationPromise;
    }
    /**
     * If the persistence is changed in another window, the user manager will let us know
     */
    async _onStorageEvent() {
      if (this._deleted) {
        return;
      }
      const user = await this.assertedPersistence.getCurrentUser();
      if (!this.currentUser && !user) {
        return;
      }
      if (this.currentUser && user && this.currentUser.uid === user.uid) {
        this._currentUser._assign(user);
        await this.currentUser.getIdToken();
        return;
      }
      await this._updateCurrentUser(
        user,
        /* skipBeforeStateCallbacks */
        true
      );
    }
    async initializeCurrentUserFromIdToken(idToken) {
      try {
        const response = await getAccountInfo(this, { idToken });
        const user = await UserImpl._fromGetAccountInfoResponse(this, response, idToken);
        await this.directlySetCurrentUser(user);
      } catch (err) {
        console.warn("FirebaseServerApp could not login user with provided authIdToken: ", err);
        await this.directlySetCurrentUser(null);
      }
    }
    async initializeCurrentUser(popupRedirectResolver) {
      if (_isFirebaseServerApp(this.app)) {
        const idToken = this.app.settings.authIdToken;
        if (idToken) {
          return new Promise((resolve) => {
            setTimeout(() => this.initializeCurrentUserFromIdToken(idToken).then(resolve, resolve));
          });
        } else {
          return this.directlySetCurrentUser(null);
        }
      }
      const previouslyStoredUser = await this.assertedPersistence.getCurrentUser();
      let futureCurrentUser = previouslyStoredUser;
      let needsTocheckMiddleware = false;
      if (popupRedirectResolver && this.config.authDomain) {
        await this.getOrInitRedirectPersistenceManager();
        const redirectUserEventId = this.redirectUser?._redirectEventId;
        const storedUserEventId = futureCurrentUser?._redirectEventId;
        const result = await this.tryRedirectSignIn(popupRedirectResolver);
        if ((!redirectUserEventId || redirectUserEventId === storedUserEventId) && result?.user) {
          futureCurrentUser = result.user;
          needsTocheckMiddleware = true;
        }
      }
      if (!futureCurrentUser) {
        return this.directlySetCurrentUser(null);
      }
      if (!futureCurrentUser._redirectEventId) {
        if (needsTocheckMiddleware) {
          try {
            await this.beforeStateQueue.runMiddleware(futureCurrentUser);
          } catch (e2) {
            futureCurrentUser = previouslyStoredUser;
            this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(e2));
          }
        }
        if (futureCurrentUser) {
          return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
        } else {
          return this.directlySetCurrentUser(null);
        }
      }
      _assert(
        this._popupRedirectResolver,
        this,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      await this.getOrInitRedirectPersistenceManager();
      if (this.redirectUser && this.redirectUser._redirectEventId === futureCurrentUser._redirectEventId) {
        return this.directlySetCurrentUser(futureCurrentUser);
      }
      return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
    }
    async tryRedirectSignIn(redirectResolver) {
      let result = null;
      try {
        result = await this._popupRedirectResolver._completeRedirectFn(this, redirectResolver, true);
      } catch (e2) {
        await this._setRedirectUser(null);
      }
      return result;
    }
    async reloadAndSetCurrentUserOrClear(user) {
      try {
        await _reloadWithoutSaving(user);
      } catch (e2) {
        if (e2?.code !== `auth/${"network-request-failed"}`) {
          return this.directlySetCurrentUser(null);
        }
      }
      return this.directlySetCurrentUser(user);
    }
    useDeviceLanguage() {
      this.languageCode = _getUserLanguage();
    }
    async _delete() {
      this._deleted = true;
    }
    async updateCurrentUser(userExtern) {
      if (_isFirebaseServerApp(this.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
      }
      const user = userExtern ? getModularInstance(userExtern) : null;
      if (user) {
        _assert(
          user.auth.config.apiKey === this.config.apiKey,
          this,
          "invalid-user-token"
          /* AuthErrorCode.INVALID_AUTH */
        );
      }
      return this._updateCurrentUser(user && user._clone(this));
    }
    async _updateCurrentUser(user, skipBeforeStateCallbacks = false) {
      if (this._deleted) {
        return;
      }
      if (user) {
        _assert(
          this.tenantId === user.tenantId,
          this,
          "tenant-id-mismatch"
          /* AuthErrorCode.TENANT_ID_MISMATCH */
        );
      }
      if (!skipBeforeStateCallbacks) {
        await this.beforeStateQueue.runMiddleware(user);
      }
      return this.queue(async () => {
        await this.directlySetCurrentUser(user);
        this.notifyAuthListeners();
      });
    }
    async signOut() {
      if (_isFirebaseServerApp(this.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
      }
      await this.beforeStateQueue.runMiddleware(null);
      if (this.redirectPersistenceManager || this._popupRedirectResolver) {
        await this._setRedirectUser(null);
      }
      return this._updateCurrentUser(
        null,
        /* skipBeforeStateCallbacks */
        true
      );
    }
    setPersistence(persistence) {
      if (_isFirebaseServerApp(this.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
      }
      return this.queue(async () => {
        await this.assertedPersistence.setPersistence(_getInstance(persistence));
      });
    }
    _getRecaptchaConfig() {
      if (this.tenantId == null) {
        return this._agentRecaptchaConfig;
      } else {
        return this._tenantRecaptchaConfigs[this.tenantId];
      }
    }
    async validatePassword(password) {
      if (!this._getPasswordPolicyInternal()) {
        await this._updatePasswordPolicy();
      }
      const passwordPolicy = this._getPasswordPolicyInternal();
      if (passwordPolicy.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION) {
        return Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version", {}));
      }
      return passwordPolicy.validatePassword(password);
    }
    _getPasswordPolicyInternal() {
      if (this.tenantId === null) {
        return this._projectPasswordPolicy;
      } else {
        return this._tenantPasswordPolicies[this.tenantId];
      }
    }
    async _updatePasswordPolicy() {
      const response = await _getPasswordPolicy(this);
      const passwordPolicy = new PasswordPolicyImpl(response);
      if (this.tenantId === null) {
        this._projectPasswordPolicy = passwordPolicy;
      } else {
        this._tenantPasswordPolicies[this.tenantId] = passwordPolicy;
      }
    }
    _getPersistenceType() {
      return this.assertedPersistence.persistence.type;
    }
    _getPersistence() {
      return this.assertedPersistence.persistence;
    }
    _updateErrorMap(errorMap) {
      this._errorFactory = new ErrorFactory("auth", "Firebase", errorMap());
    }
    onAuthStateChanged(nextOrObserver, error, completed) {
      return this.registerStateListener(this.authStateSubscription, nextOrObserver, error, completed);
    }
    beforeAuthStateChanged(callback, onAbort) {
      return this.beforeStateQueue.pushCallback(callback, onAbort);
    }
    onIdTokenChanged(nextOrObserver, error, completed) {
      return this.registerStateListener(this.idTokenSubscription, nextOrObserver, error, completed);
    }
    authStateReady() {
      return new Promise((resolve, reject) => {
        if (this.currentUser) {
          resolve();
        } else {
          const unsubscribe = this.onAuthStateChanged(() => {
            unsubscribe();
            resolve();
          }, reject);
        }
      });
    }
    /**
     * Revokes the given access token. Currently only supports Apple OAuth access tokens.
     */
    async revokeAccessToken(token) {
      if (this.currentUser) {
        const idToken = await this.currentUser.getIdToken();
        const request = {
          providerId: "apple.com",
          tokenType: "ACCESS_TOKEN",
          token,
          idToken
        };
        if (this.tenantId != null) {
          request.tenantId = this.tenantId;
        }
        await revokeToken(this, request);
      }
    }
    toJSON() {
      return {
        apiKey: this.config.apiKey,
        authDomain: this.config.authDomain,
        appName: this.name,
        currentUser: this._currentUser?.toJSON()
      };
    }
    async _setRedirectUser(user, popupRedirectResolver) {
      const redirectManager = await this.getOrInitRedirectPersistenceManager(popupRedirectResolver);
      return user === null ? redirectManager.removeCurrentUser() : redirectManager.setCurrentUser(user);
    }
    async getOrInitRedirectPersistenceManager(popupRedirectResolver) {
      if (!this.redirectPersistenceManager) {
        const resolver = popupRedirectResolver && _getInstance(popupRedirectResolver) || this._popupRedirectResolver;
        _assert(
          resolver,
          this,
          "argument-error"
          /* AuthErrorCode.ARGUMENT_ERROR */
        );
        this.redirectPersistenceManager = await PersistenceUserManager.create(
          this,
          [_getInstance(resolver._redirectPersistence)],
          "redirectUser"
          /* KeyName.REDIRECT_USER */
        );
        this.redirectUser = await this.redirectPersistenceManager.getCurrentUser();
      }
      return this.redirectPersistenceManager;
    }
    async _redirectUserForId(id) {
      if (this._isInitialized) {
        await this.queue(async () => {
        });
      }
      if (this._currentUser?._redirectEventId === id) {
        return this._currentUser;
      }
      if (this.redirectUser?._redirectEventId === id) {
        return this.redirectUser;
      }
      return null;
    }
    async _persistUserIfCurrent(user) {
      if (user === this.currentUser) {
        return this.queue(async () => this.directlySetCurrentUser(user));
      }
    }
    /** Notifies listeners only if the user is current */
    _notifyListenersIfCurrent(user) {
      if (user === this.currentUser) {
        this.notifyAuthListeners();
      }
    }
    _key() {
      return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
    }
    _startProactiveRefresh() {
      this.isProactiveRefreshEnabled = true;
      if (this.currentUser) {
        this._currentUser._startProactiveRefresh();
      }
    }
    _stopProactiveRefresh() {
      this.isProactiveRefreshEnabled = false;
      if (this.currentUser) {
        this._currentUser._stopProactiveRefresh();
      }
    }
    /** Returns the current user cast as the internal type */
    get _currentUser() {
      return this.currentUser;
    }
    notifyAuthListeners() {
      if (!this._isInitialized) {
        return;
      }
      this.idTokenSubscription.next(this.currentUser);
      const currentUid = this.currentUser?.uid ?? null;
      if (this.lastNotifiedUid !== currentUid) {
        this.lastNotifiedUid = currentUid;
        this.authStateSubscription.next(this.currentUser);
      }
    }
    registerStateListener(subscription, nextOrObserver, error, completed) {
      if (this._deleted) {
        return () => {
        };
      }
      const cb = typeof nextOrObserver === "function" ? nextOrObserver : nextOrObserver.next.bind(nextOrObserver);
      let isUnsubscribed = false;
      const promise = this._isInitialized ? Promise.resolve() : this._initializationPromise;
      _assert(
        promise,
        this,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      promise.then(() => {
        if (isUnsubscribed) {
          return;
        }
        cb(this.currentUser);
      });
      if (typeof nextOrObserver === "function") {
        const unsubscribe = subscription.addObserver(nextOrObserver, error, completed);
        return () => {
          isUnsubscribed = true;
          unsubscribe();
        };
      } else {
        const unsubscribe = subscription.addObserver(nextOrObserver);
        return () => {
          isUnsubscribed = true;
          unsubscribe();
        };
      }
    }
    /**
     * Unprotected (from race conditions) method to set the current user. This
     * should only be called from within a queued callback. This is necessary
     * because the queue shouldn't rely on another queued callback.
     */
    async directlySetCurrentUser(user) {
      if (this.currentUser && this.currentUser !== user) {
        this._currentUser._stopProactiveRefresh();
      }
      if (user && this.isProactiveRefreshEnabled) {
        user._startProactiveRefresh();
      }
      this.currentUser = user;
      if (user) {
        await this.assertedPersistence.setCurrentUser(user);
      } else {
        await this.assertedPersistence.removeCurrentUser();
      }
    }
    queue(action) {
      this.operations = this.operations.then(action, action);
      return this.operations;
    }
    get assertedPersistence() {
      _assert(
        this.persistenceManager,
        this,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      return this.persistenceManager;
    }
    _logFramework(framework) {
      if (!framework || this.frameworks.includes(framework)) {
        return;
      }
      this.frameworks.push(framework);
      this.frameworks.sort();
      this.clientVersion = _getClientVersion(this.config.clientPlatform, this._getFrameworks());
    }
    _getFrameworks() {
      return this.frameworks;
    }
    async _getAdditionalHeaders() {
      const headers = {
        [
          "X-Client-Version"
          /* HttpHeader.X_CLIENT_VERSION */
        ]: this.clientVersion
      };
      if (this.app.options.appId) {
        headers[
          "X-Firebase-gmpid"
          /* HttpHeader.X_FIREBASE_GMPID */
        ] = this.app.options.appId;
      }
      const heartbeatsHeader = await this.heartbeatServiceProvider.getImmediate({
        optional: true
      })?.getHeartbeatsHeader();
      if (heartbeatsHeader) {
        headers[
          "X-Firebase-Client"
          /* HttpHeader.X_FIREBASE_CLIENT */
        ] = heartbeatsHeader;
      }
      const appCheckToken = await this._getAppCheckToken();
      if (appCheckToken) {
        headers[
          "X-Firebase-AppCheck"
          /* HttpHeader.X_FIREBASE_APP_CHECK */
        ] = appCheckToken;
      }
      return headers;
    }
    async _getAppCheckToken() {
      if (_isFirebaseServerApp(this.app) && this.app.settings.appCheckToken) {
        return this.app.settings.appCheckToken;
      }
      const appCheckTokenResult = await this.appCheckServiceProvider.getImmediate({ optional: true })?.getToken();
      if (appCheckTokenResult?.error) {
        _logWarn(`Error while retrieving App Check token: ${appCheckTokenResult.error}`);
      }
      return appCheckTokenResult?.token;
    }
  };
  function _castAuth(auth2) {
    return getModularInstance(auth2);
  }
  var Subscription = class {
    constructor(auth2) {
      this.auth = auth2;
      this.observer = null;
      this.addObserver = createSubscribe((observer) => this.observer = observer);
    }
    get next() {
      _assert(
        this.observer,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      return this.observer.next.bind(this.observer);
    }
  };
  var externalJSProvider = {
    async loadJS() {
      throw new Error("Unable to load external scripts");
    },
    recaptchaV2Script: "",
    recaptchaEnterpriseScript: "",
    gapiScript: ""
  };
  function _setExternalJSProvider(p) {
    externalJSProvider = p;
  }
  function _loadJS(url) {
    return externalJSProvider.loadJS(url);
  }
  function _recaptchaEnterpriseScriptUrl() {
    return externalJSProvider.recaptchaEnterpriseScript;
  }
  function _gapiScriptUrl() {
    return externalJSProvider.gapiScript;
  }
  function _generateCallbackName(prefix) {
    return `__${prefix}${Math.floor(Math.random() * 1e6)}`;
  }
  var MockGreCAPTCHATopLevel = class {
    constructor() {
      this.enterprise = new MockGreCAPTCHA();
    }
    ready(callback) {
      callback();
    }
    execute(_siteKey, _options) {
      return Promise.resolve("token");
    }
    render(_container, _parameters) {
      return "";
    }
  };
  var MockGreCAPTCHA = class {
    ready(callback) {
      callback();
    }
    execute(_siteKey, _options) {
      return Promise.resolve("token");
    }
    render(_container, _parameters) {
      return "";
    }
  };
  var RECAPTCHA_ENTERPRISE_VERIFIER_TYPE = "recaptcha-enterprise";
  var FAKE_TOKEN = "NO_RECAPTCHA";
  var RecaptchaEnterpriseVerifier = class {
    /**
     *
     * @param authExtern - The corresponding Firebase {@link Auth} instance.
     *
     */
    constructor(authExtern) {
      this.type = RECAPTCHA_ENTERPRISE_VERIFIER_TYPE;
      this.auth = _castAuth(authExtern);
    }
    /**
     * Executes the verification process.
     *
     * @returns A Promise for a token that can be used to assert the validity of a request.
     */
    async verify(action = "verify", forceRefresh = false) {
      async function retrieveSiteKey(auth2) {
        if (!forceRefresh) {
          if (auth2.tenantId == null && auth2._agentRecaptchaConfig != null) {
            return auth2._agentRecaptchaConfig.siteKey;
          }
          if (auth2.tenantId != null && auth2._tenantRecaptchaConfigs[auth2.tenantId] !== void 0) {
            return auth2._tenantRecaptchaConfigs[auth2.tenantId].siteKey;
          }
        }
        return new Promise(async (resolve, reject) => {
          getRecaptchaConfig(auth2, {
            clientType: "CLIENT_TYPE_WEB",
            version: "RECAPTCHA_ENTERPRISE"
            /* RecaptchaVersion.ENTERPRISE */
          }).then((response) => {
            if (response.recaptchaKey === void 0) {
              reject(new Error("recaptcha Enterprise site key undefined"));
            } else {
              const config = new RecaptchaConfig(response);
              if (auth2.tenantId == null) {
                auth2._agentRecaptchaConfig = config;
              } else {
                auth2._tenantRecaptchaConfigs[auth2.tenantId] = config;
              }
              return resolve(config.siteKey);
            }
          }).catch((error) => {
            reject(error);
          });
        });
      }
      function retrieveRecaptchaToken(siteKey, resolve, reject) {
        const grecaptcha = window.grecaptcha;
        if (isEnterprise(grecaptcha)) {
          grecaptcha.enterprise.ready(() => {
            grecaptcha.enterprise.execute(siteKey, { action }).then((token) => {
              resolve(token);
            }).catch(() => {
              resolve(FAKE_TOKEN);
            });
          });
        } else {
          reject(Error("No reCAPTCHA enterprise script loaded."));
        }
      }
      if (this.auth.settings.appVerificationDisabledForTesting) {
        const mockRecaptcha = new MockGreCAPTCHATopLevel();
        return mockRecaptcha.execute("siteKey", { action: "verify" });
      }
      return new Promise((resolve, reject) => {
        retrieveSiteKey(this.auth).then((siteKey) => {
          if (!forceRefresh && isEnterprise(window.grecaptcha)) {
            retrieveRecaptchaToken(siteKey, resolve, reject);
          } else {
            if (typeof window === "undefined") {
              reject(new Error("RecaptchaVerifier is only supported in browser"));
              return;
            }
            let url = _recaptchaEnterpriseScriptUrl();
            if (url.length !== 0) {
              url += siteKey;
            }
            _loadJS(url).then(() => {
              retrieveRecaptchaToken(siteKey, resolve, reject);
            }).catch((error) => {
              reject(error);
            });
          }
        }).catch((error) => {
          reject(error);
        });
      });
    }
  };
  async function injectRecaptchaFields(auth2, request, action, isCaptchaResp = false, isFakeToken = false) {
    const verifier = new RecaptchaEnterpriseVerifier(auth2);
    let captchaResponse;
    if (isFakeToken) {
      captchaResponse = FAKE_TOKEN;
    } else {
      try {
        captchaResponse = await verifier.verify(action);
      } catch (error) {
        captchaResponse = await verifier.verify(action, true);
      }
    }
    const newRequest = { ...request };
    if (action === "mfaSmsEnrollment" || action === "mfaSmsSignIn") {
      if ("phoneEnrollmentInfo" in newRequest) {
        const phoneNumber = newRequest.phoneEnrollmentInfo.phoneNumber;
        const recaptchaToken = newRequest.phoneEnrollmentInfo.recaptchaToken;
        Object.assign(newRequest, {
          "phoneEnrollmentInfo": {
            phoneNumber,
            recaptchaToken,
            captchaResponse,
            "clientType": "CLIENT_TYPE_WEB",
            "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
            /* RecaptchaVersion.ENTERPRISE */
          }
        });
      } else if ("phoneSignInInfo" in newRequest) {
        const recaptchaToken = newRequest.phoneSignInInfo.recaptchaToken;
        Object.assign(newRequest, {
          "phoneSignInInfo": {
            recaptchaToken,
            captchaResponse,
            "clientType": "CLIENT_TYPE_WEB",
            "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
            /* RecaptchaVersion.ENTERPRISE */
          }
        });
      }
      return newRequest;
    }
    if (!isCaptchaResp) {
      Object.assign(newRequest, { captchaResponse });
    } else {
      Object.assign(newRequest, { "captchaResp": captchaResponse });
    }
    Object.assign(newRequest, {
      "clientType": "CLIENT_TYPE_WEB"
      /* RecaptchaClientType.WEB */
    });
    Object.assign(newRequest, {
      "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
      /* RecaptchaVersion.ENTERPRISE */
    });
    return newRequest;
  }
  async function handleRecaptchaFlow(authInstance, request, actionName, actionMethod, recaptchaAuthProvider) {
    if (recaptchaAuthProvider === "EMAIL_PASSWORD_PROVIDER") {
      if (authInstance._getRecaptchaConfig()?.isProviderEnabled(
        "EMAIL_PASSWORD_PROVIDER"
        /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
      )) {
        const requestWithRecaptcha = await injectRecaptchaFields(
          authInstance,
          request,
          actionName,
          actionName === "getOobCode"
          /* RecaptchaActionName.GET_OOB_CODE */
        );
        return actionMethod(authInstance, requestWithRecaptcha);
      } else {
        return actionMethod(authInstance, request).catch(async (error) => {
          if (error.code === `auth/${"missing-recaptcha-token"}`) {
            console.log(`${actionName} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);
            const requestWithRecaptcha = await injectRecaptchaFields(
              authInstance,
              request,
              actionName,
              actionName === "getOobCode"
              /* RecaptchaActionName.GET_OOB_CODE */
            );
            return actionMethod(authInstance, requestWithRecaptcha);
          } else {
            return Promise.reject(error);
          }
        });
      }
    } else if (recaptchaAuthProvider === "PHONE_PROVIDER") {
      if (authInstance._getRecaptchaConfig()?.isProviderEnabled(
        "PHONE_PROVIDER"
        /* RecaptchaAuthProvider.PHONE_PROVIDER */
      )) {
        const requestWithRecaptcha = await injectRecaptchaFields(authInstance, request, actionName);
        return actionMethod(authInstance, requestWithRecaptcha).catch(async (error) => {
          if (authInstance._getRecaptchaConfig()?.getProviderEnforcementState(
            "PHONE_PROVIDER"
            /* RecaptchaAuthProvider.PHONE_PROVIDER */
          ) === "AUDIT") {
            if (error.code === `auth/${"missing-recaptcha-token"}` || error.code === `auth/${"invalid-app-credential"}`) {
              console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${actionName} flow.`);
              const requestWithRecaptchaFields = await injectRecaptchaFields(
                authInstance,
                request,
                actionName,
                false,
                // isCaptchaResp
                true
                // isFakeToken
              );
              return actionMethod(authInstance, requestWithRecaptchaFields);
            }
          }
          return Promise.reject(error);
        });
      } else {
        const requestWithRecaptchaFields = await injectRecaptchaFields(
          authInstance,
          request,
          actionName,
          false,
          // isCaptchaResp
          true
          // isFakeToken
        );
        return actionMethod(authInstance, requestWithRecaptchaFields);
      }
    } else {
      return Promise.reject(recaptchaAuthProvider + " provider is not supported.");
    }
  }
  async function _initializeRecaptchaConfig(auth2) {
    const authInternal = _castAuth(auth2);
    const response = await getRecaptchaConfig(authInternal, {
      clientType: "CLIENT_TYPE_WEB",
      version: "RECAPTCHA_ENTERPRISE"
      /* RecaptchaVersion.ENTERPRISE */
    });
    const config = new RecaptchaConfig(response);
    if (authInternal.tenantId == null) {
      authInternal._agentRecaptchaConfig = config;
    } else {
      authInternal._tenantRecaptchaConfigs[authInternal.tenantId] = config;
    }
    if (config.isAnyProviderEnabled()) {
      const verifier = new RecaptchaEnterpriseVerifier(authInternal);
      void verifier.verify();
    }
  }
  function initializeAuth(app2, deps) {
    const provider = _getProvider(app2, "auth");
    if (provider.isInitialized()) {
      const auth3 = provider.getImmediate();
      const initialOptions = provider.getOptions();
      if (deepEqual(initialOptions, deps ?? {})) {
        return auth3;
      } else {
        _fail(
          auth3,
          "already-initialized"
          /* AuthErrorCode.ALREADY_INITIALIZED */
        );
      }
    }
    const auth2 = provider.initialize({ options: deps });
    return auth2;
  }
  function _initializeAuthInstance(auth2, deps) {
    const persistence = deps?.persistence || [];
    const hierarchy = (Array.isArray(persistence) ? persistence : [persistence]).map(_getInstance);
    if (deps?.errorMap) {
      auth2._updateErrorMap(deps.errorMap);
    }
    auth2._initializeWithPersistence(hierarchy, deps?.popupRedirectResolver);
  }
  function connectAuthEmulator(auth2, url, options) {
    const authInternal = _castAuth(auth2);
    _assert(
      /^https?:\/\//.test(url),
      authInternal,
      "invalid-emulator-scheme"
      /* AuthErrorCode.INVALID_EMULATOR_SCHEME */
    );
    const disableWarnings = !!options?.disableWarnings;
    const protocol = extractProtocol(url);
    const { host, port } = extractHostAndPort(url);
    const portStr = port === null ? "" : `:${port}`;
    const emulator = { url: `${protocol}//${host}${portStr}/` };
    const emulatorConfig = Object.freeze({
      host,
      port,
      protocol: protocol.replace(":", ""),
      options: Object.freeze({ disableWarnings })
    });
    if (!authInternal._canInitEmulator) {
      _assert(
        authInternal.config.emulator && authInternal.emulatorConfig,
        authInternal,
        "emulator-config-failed"
        /* AuthErrorCode.EMULATOR_CONFIG_FAILED */
      );
      _assert(
        deepEqual(emulator, authInternal.config.emulator) && deepEqual(emulatorConfig, authInternal.emulatorConfig),
        authInternal,
        "emulator-config-failed"
        /* AuthErrorCode.EMULATOR_CONFIG_FAILED */
      );
      return;
    }
    authInternal.config.emulator = emulator;
    authInternal.emulatorConfig = emulatorConfig;
    authInternal.settings.appVerificationDisabledForTesting = true;
    if (isCloudWorkstation(host)) {
      void pingServer(`${protocol}//${host}${portStr}`);
      updateEmulatorBanner("Auth", true);
    } else if (!disableWarnings) {
      emitEmulatorWarning();
    }
  }
  function extractProtocol(url) {
    const protocolEnd = url.indexOf(":");
    return protocolEnd < 0 ? "" : url.substr(0, protocolEnd + 1);
  }
  function extractHostAndPort(url) {
    const protocol = extractProtocol(url);
    const authority = /(\/\/)?([^?#/]+)/.exec(url.substr(protocol.length));
    if (!authority) {
      return { host: "", port: null };
    }
    const hostAndPort = authority[2].split("@").pop() || "";
    const bracketedIPv6 = /^(\[[^\]]+\])(:|$)/.exec(hostAndPort);
    if (bracketedIPv6) {
      const host = bracketedIPv6[1];
      return { host, port: parsePort(hostAndPort.substr(host.length + 1)) };
    } else {
      const [host, port] = hostAndPort.split(":");
      return { host, port: parsePort(port) };
    }
  }
  function parsePort(portStr) {
    if (!portStr) {
      return null;
    }
    const port = Number(portStr);
    if (isNaN(port)) {
      return null;
    }
    return port;
  }
  function emitEmulatorWarning() {
    function attachBanner() {
      const el = document.createElement("p");
      const sty = el.style;
      el.innerText = "Running in emulator mode. Do not use with production credentials.";
      sty.position = "fixed";
      sty.width = "100%";
      sty.backgroundColor = "#ffffff";
      sty.border = ".1em solid #000000";
      sty.color = "#b50000";
      sty.bottom = "0px";
      sty.left = "0px";
      sty.margin = "0px";
      sty.zIndex = "10000";
      sty.textAlign = "center";
      el.classList.add("firebase-emulator-warning");
      document.body.appendChild(el);
    }
    if (typeof console !== "undefined" && typeof console.info === "function") {
      console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.");
    }
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", attachBanner);
      } else {
        attachBanner();
      }
    }
  }
  var AuthCredential = class {
    /** @internal */
    constructor(providerId, signInMethod) {
      this.providerId = providerId;
      this.signInMethod = signInMethod;
    }
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns a JSON-serializable representation of this object.
     */
    toJSON() {
      return debugFail("not implemented");
    }
    /** @internal */
    _getIdTokenResponse(_auth) {
      return debugFail("not implemented");
    }
    /** @internal */
    _linkToIdToken(_auth, _idToken) {
      return debugFail("not implemented");
    }
    /** @internal */
    _getReauthenticationResolver(_auth) {
      return debugFail("not implemented");
    }
  };
  async function linkEmailPassword(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v1/accounts:signUp", request);
  }
  async function signInWithPassword(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithPassword", _addTidIfNecessary(auth2, request));
  }
  async function signInWithEmailLink$1(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth2, request));
  }
  async function signInWithEmailLinkForLinking(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth2, request));
  }
  var EmailAuthCredential = class _EmailAuthCredential extends AuthCredential {
    /** @internal */
    constructor(_email, _password, signInMethod, _tenantId = null) {
      super("password", signInMethod);
      this._email = _email;
      this._password = _password;
      this._tenantId = _tenantId;
    }
    /** @internal */
    static _fromEmailAndPassword(email, password) {
      return new _EmailAuthCredential(
        email,
        password,
        "password"
        /* SignInMethod.EMAIL_PASSWORD */
      );
    }
    /** @internal */
    static _fromEmailAndCode(email, oobCode, tenantId = null) {
      return new _EmailAuthCredential(email, oobCode, "emailLink", tenantId);
    }
    /** {@inheritdoc AuthCredential.toJSON} */
    toJSON() {
      return {
        email: this._email,
        password: this._password,
        signInMethod: this.signInMethod,
        tenantId: this._tenantId
      };
    }
    /**
     * Static method to deserialize a JSON representation of an object into an {@link  AuthCredential}.
     *
     * @param json - Either `object` or the stringified representation of the object. When string is
     * provided, `JSON.parse` would be called first.
     *
     * @returns If the JSON input does not represent an {@link AuthCredential}, null is returned.
     */
    static fromJSON(json) {
      const obj = typeof json === "string" ? JSON.parse(json) : json;
      if (obj?.email && obj?.password) {
        if (obj.signInMethod === "password") {
          return this._fromEmailAndPassword(obj.email, obj.password);
        } else if (obj.signInMethod === "emailLink") {
          return this._fromEmailAndCode(obj.email, obj.password, obj.tenantId);
        }
      }
      return null;
    }
    /** @internal */
    async _getIdTokenResponse(auth2) {
      switch (this.signInMethod) {
        case "password":
          const request = {
            returnSecureToken: true,
            email: this._email,
            password: this._password,
            clientType: "CLIENT_TYPE_WEB"
            /* RecaptchaClientType.WEB */
          };
          return handleRecaptchaFlow(
            auth2,
            request,
            "signInWithPassword",
            signInWithPassword,
            "EMAIL_PASSWORD_PROVIDER"
            /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
          );
        case "emailLink":
          return signInWithEmailLink$1(auth2, {
            email: this._email,
            oobCode: this._password
          });
        default:
          _fail(
            auth2,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
      }
    }
    /** @internal */
    async _linkToIdToken(auth2, idToken) {
      switch (this.signInMethod) {
        case "password":
          const request = {
            idToken,
            returnSecureToken: true,
            email: this._email,
            password: this._password,
            clientType: "CLIENT_TYPE_WEB"
            /* RecaptchaClientType.WEB */
          };
          return handleRecaptchaFlow(
            auth2,
            request,
            "signUpPassword",
            linkEmailPassword,
            "EMAIL_PASSWORD_PROVIDER"
            /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
          );
        case "emailLink":
          return signInWithEmailLinkForLinking(auth2, {
            idToken,
            email: this._email,
            oobCode: this._password
          });
        default:
          _fail(
            auth2,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
      }
    }
    /** @internal */
    _getReauthenticationResolver(auth2) {
      return this._getIdTokenResponse(auth2);
    }
  };
  async function signInWithIdp(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithIdp", _addTidIfNecessary(auth2, request));
  }
  var IDP_REQUEST_URI$1 = "http://localhost";
  var OAuthCredential = class _OAuthCredential extends AuthCredential {
    constructor() {
      super(...arguments);
      this.pendingToken = null;
    }
    /** @internal */
    static _fromParams(params) {
      const cred = new _OAuthCredential(params.providerId, params.signInMethod);
      if (params.idToken || params.accessToken) {
        if (params.idToken) {
          cred.idToken = params.idToken;
        }
        if (params.accessToken) {
          cred.accessToken = params.accessToken;
        }
        if (params.nonce && !params.pendingToken) {
          cred.nonce = params.nonce;
        }
        if (params.pendingToken) {
          cred.pendingToken = params.pendingToken;
        }
      } else if (params.oauthToken && params.oauthTokenSecret) {
        cred.accessToken = params.oauthToken;
        cred.secret = params.oauthTokenSecret;
      } else {
        _fail(
          "argument-error"
          /* AuthErrorCode.ARGUMENT_ERROR */
        );
      }
      return cred;
    }
    /** {@inheritdoc AuthCredential.toJSON}  */
    toJSON() {
      return {
        idToken: this.idToken,
        accessToken: this.accessToken,
        secret: this.secret,
        nonce: this.nonce,
        pendingToken: this.pendingToken,
        providerId: this.providerId,
        signInMethod: this.signInMethod
      };
    }
    /**
     * Static method to deserialize a JSON representation of an object into an
     * {@link  AuthCredential}.
     *
     * @param json - Input can be either Object or the stringified representation of the object.
     * When string is provided, JSON.parse would be called first.
     *
     * @returns If the JSON input does not represent an {@link  AuthCredential}, null is returned.
     */
    static fromJSON(json) {
      const obj = typeof json === "string" ? JSON.parse(json) : json;
      const { providerId, signInMethod, ...rest } = obj;
      if (!providerId || !signInMethod) {
        return null;
      }
      const cred = new _OAuthCredential(providerId, signInMethod);
      cred.idToken = rest.idToken || void 0;
      cred.accessToken = rest.accessToken || void 0;
      cred.secret = rest.secret;
      cred.nonce = rest.nonce;
      cred.pendingToken = rest.pendingToken || null;
      return cred;
    }
    /** @internal */
    _getIdTokenResponse(auth2) {
      const request = this.buildRequest();
      return signInWithIdp(auth2, request);
    }
    /** @internal */
    _linkToIdToken(auth2, idToken) {
      const request = this.buildRequest();
      request.idToken = idToken;
      return signInWithIdp(auth2, request);
    }
    /** @internal */
    _getReauthenticationResolver(auth2) {
      const request = this.buildRequest();
      request.autoCreate = false;
      return signInWithIdp(auth2, request);
    }
    buildRequest() {
      const request = {
        requestUri: IDP_REQUEST_URI$1,
        returnSecureToken: true
      };
      if (this.pendingToken) {
        request.pendingToken = this.pendingToken;
      } else {
        const postBody = {};
        if (this.idToken) {
          postBody["id_token"] = this.idToken;
        }
        if (this.accessToken) {
          postBody["access_token"] = this.accessToken;
        }
        if (this.secret) {
          postBody["oauth_token_secret"] = this.secret;
        }
        postBody["providerId"] = this.providerId;
        if (this.nonce && !this.pendingToken) {
          postBody["nonce"] = this.nonce;
        }
        request.postBody = querystring(postBody);
      }
      return request;
    }
  };
  async function sendPhoneVerificationCode(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v1/accounts:sendVerificationCode", _addTidIfNecessary(auth2, request));
  }
  async function signInWithPhoneNumber$1(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth2, request));
  }
  async function linkWithPhoneNumber$1(auth2, request) {
    const response = await _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth2, request));
    if (response.temporaryProof) {
      throw _makeTaggedError(auth2, "account-exists-with-different-credential", response);
    }
    return response;
  }
  var VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_ = {
    [
      "USER_NOT_FOUND"
      /* ServerError.USER_NOT_FOUND */
    ]: "user-not-found"
    /* AuthErrorCode.USER_DELETED */
  };
  async function verifyPhoneNumberForExisting(auth2, request) {
    const apiRequest = {
      ...request,
      operation: "REAUTH"
    };
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth2, apiRequest), VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_);
  }
  var PhoneAuthCredential = class _PhoneAuthCredential extends AuthCredential {
    constructor(params) {
      super(
        "phone",
        "phone"
        /* SignInMethod.PHONE */
      );
      this.params = params;
    }
    /** @internal */
    static _fromVerification(verificationId, verificationCode) {
      return new _PhoneAuthCredential({ verificationId, verificationCode });
    }
    /** @internal */
    static _fromTokenResponse(phoneNumber, temporaryProof) {
      return new _PhoneAuthCredential({ phoneNumber, temporaryProof });
    }
    /** @internal */
    _getIdTokenResponse(auth2) {
      return signInWithPhoneNumber$1(auth2, this._makeVerificationRequest());
    }
    /** @internal */
    _linkToIdToken(auth2, idToken) {
      return linkWithPhoneNumber$1(auth2, {
        idToken,
        ...this._makeVerificationRequest()
      });
    }
    /** @internal */
    _getReauthenticationResolver(auth2) {
      return verifyPhoneNumberForExisting(auth2, this._makeVerificationRequest());
    }
    /** @internal */
    _makeVerificationRequest() {
      const { temporaryProof, phoneNumber, verificationId, verificationCode } = this.params;
      if (temporaryProof && phoneNumber) {
        return { temporaryProof, phoneNumber };
      }
      return {
        sessionInfo: verificationId,
        code: verificationCode
      };
    }
    /** {@inheritdoc AuthCredential.toJSON} */
    toJSON() {
      const obj = {
        providerId: this.providerId
      };
      if (this.params.phoneNumber) {
        obj.phoneNumber = this.params.phoneNumber;
      }
      if (this.params.temporaryProof) {
        obj.temporaryProof = this.params.temporaryProof;
      }
      if (this.params.verificationCode) {
        obj.verificationCode = this.params.verificationCode;
      }
      if (this.params.verificationId) {
        obj.verificationId = this.params.verificationId;
      }
      return obj;
    }
    /** Generates a phone credential based on a plain object or a JSON string. */
    static fromJSON(json) {
      if (typeof json === "string") {
        json = JSON.parse(json);
      }
      const { verificationId, verificationCode, phoneNumber, temporaryProof } = json;
      if (!verificationCode && !verificationId && !phoneNumber && !temporaryProof) {
        return null;
      }
      return new _PhoneAuthCredential({
        verificationId,
        verificationCode,
        phoneNumber,
        temporaryProof
      });
    }
  };
  function parseMode(mode) {
    switch (mode) {
      case "recoverEmail":
        return "RECOVER_EMAIL";
      case "resetPassword":
        return "PASSWORD_RESET";
      case "signIn":
        return "EMAIL_SIGNIN";
      case "verifyEmail":
        return "VERIFY_EMAIL";
      case "verifyAndChangeEmail":
        return "VERIFY_AND_CHANGE_EMAIL";
      case "revertSecondFactorAddition":
        return "REVERT_SECOND_FACTOR_ADDITION";
      default:
        return null;
    }
  }
  function parseDeepLink(url) {
    const link = querystringDecode(extractQuerystring(url))["link"];
    const doubleDeepLink = link ? querystringDecode(extractQuerystring(link))["deep_link_id"] : null;
    const iOSDeepLink = querystringDecode(extractQuerystring(url))["deep_link_id"];
    const iOSDoubleDeepLink = iOSDeepLink ? querystringDecode(extractQuerystring(iOSDeepLink))["link"] : null;
    return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
  }
  var ActionCodeURL = class _ActionCodeURL {
    /**
     * @param actionLink - The link from which to extract the URL.
     * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
     *
     * @internal
     */
    constructor(actionLink) {
      const searchParams = querystringDecode(extractQuerystring(actionLink));
      const apiKey = searchParams[
        "apiKey"
        /* QueryField.API_KEY */
      ] ?? null;
      const code = searchParams[
        "oobCode"
        /* QueryField.CODE */
      ] ?? null;
      const operation = parseMode(searchParams[
        "mode"
        /* QueryField.MODE */
      ] ?? null);
      _assert(
        apiKey && code && operation,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      this.apiKey = apiKey;
      this.operation = operation;
      this.code = code;
      this.continueUrl = searchParams[
        "continueUrl"
        /* QueryField.CONTINUE_URL */
      ] ?? null;
      this.languageCode = searchParams[
        "lang"
        /* QueryField.LANGUAGE_CODE */
      ] ?? null;
      this.tenantId = searchParams[
        "tenantId"
        /* QueryField.TENANT_ID */
      ] ?? null;
    }
    /**
     * Parses the email action link string and returns an {@link ActionCodeURL} if the link is valid,
     * otherwise returns null.
     *
     * @param link  - The email action link string.
     * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
     *
     * @public
     */
    static parseLink(link) {
      const actionLink = parseDeepLink(link);
      try {
        return new _ActionCodeURL(actionLink);
      } catch {
        return null;
      }
    }
  };
  var EmailAuthProvider = class _EmailAuthProvider {
    constructor() {
      this.providerId = _EmailAuthProvider.PROVIDER_ID;
    }
    /**
     * Initialize an {@link AuthCredential} using an email and password.
     *
     * @example
     * ```javascript
     * const authCredential = EmailAuthProvider.credential(email, password);
     * const userCredential = await signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * ```javascript
     * const userCredential = await signInWithEmailAndPassword(auth, email, password);
     * ```
     *
     * @param email - Email address.
     * @param password - User account password.
     * @returns The auth provider credential.
     */
    static credential(email, password) {
      return EmailAuthCredential._fromEmailAndPassword(email, password);
    }
    /**
     * Initialize an {@link AuthCredential} using an email and an email link after a sign in with
     * email link operation.
     *
     * @example
     * ```javascript
     * const authCredential = EmailAuthProvider.credentialWithLink(auth, email, emailLink);
     * const userCredential = await signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * ```javascript
     * await sendSignInLinkToEmail(auth, email);
     * // Obtain emailLink from user.
     * const userCredential = await signInWithEmailLink(auth, email, emailLink);
     * ```
     *
     * @param auth - The {@link Auth} instance used to verify the link.
     * @param email - Email address.
     * @param emailLink - Sign-in email link.
     * @returns - The auth provider credential.
     */
    static credentialWithLink(email, emailLink) {
      const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
      _assert(
        actionCodeUrl,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      return EmailAuthCredential._fromEmailAndCode(email, actionCodeUrl.code, actionCodeUrl.tenantId);
    }
  };
  EmailAuthProvider.PROVIDER_ID = "password";
  EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD = "password";
  EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";
  var FederatedAuthProvider = class {
    /**
     * Constructor for generic OAuth providers.
     *
     * @param providerId - Provider for which credentials should be generated.
     */
    constructor(providerId) {
      this.providerId = providerId;
      this.defaultLanguageCode = null;
      this.customParameters = {};
    }
    /**
     * Set the language gode.
     *
     * @param languageCode - language code
     */
    setDefaultLanguage(languageCode) {
      this.defaultLanguageCode = languageCode;
    }
    /**
     * Sets the OAuth custom parameters to pass in an OAuth request for popup and redirect sign-in
     * operations.
     *
     * @remarks
     * For a detailed list, check the reserved required OAuth 2.0 parameters such as `client_id`,
     * `redirect_uri`, `scope`, `response_type`, and `state` are not allowed and will be ignored.
     *
     * @param customOAuthParameters - The custom OAuth parameters to pass in the OAuth request.
     */
    setCustomParameters(customOAuthParameters) {
      this.customParameters = customOAuthParameters;
      return this;
    }
    /**
     * Retrieve the current list of {@link CustomParameters}.
     */
    getCustomParameters() {
      return this.customParameters;
    }
  };
  var BaseOAuthProvider = class extends FederatedAuthProvider {
    constructor() {
      super(...arguments);
      this.scopes = [];
    }
    /**
     * Add an OAuth scope to the credential.
     *
     * @param scope - Provider OAuth scope to add.
     */
    addScope(scope) {
      if (!this.scopes.includes(scope)) {
        this.scopes.push(scope);
      }
      return this;
    }
    /**
     * Retrieve the current list of OAuth scopes.
     */
    getScopes() {
      return [...this.scopes];
    }
  };
  var FacebookAuthProvider = class _FacebookAuthProvider extends BaseOAuthProvider {
    constructor() {
      super(
        "facebook.com"
        /* ProviderId.FACEBOOK */
      );
    }
    /**
     * Creates a credential for Facebook.
     *
     * @example
     * ```javascript
     * // `event` from the Facebook auth.authResponseChange callback.
     * const credential = FacebookAuthProvider.credential(event.authResponse.accessToken);
     * const result = await signInWithCredential(credential);
     * ```
     *
     * @param accessToken - Facebook access token.
     */
    static credential(accessToken) {
      return OAuthCredential._fromParams({
        providerId: _FacebookAuthProvider.PROVIDER_ID,
        signInMethod: _FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
        accessToken
      });
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
      return _FacebookAuthProvider.credentialFromTaggedObject(userCredential);
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error) {
      return _FacebookAuthProvider.credentialFromTaggedObject(error.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
      if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
        return null;
      }
      if (!tokenResponse.oauthAccessToken) {
        return null;
      }
      try {
        return _FacebookAuthProvider.credential(tokenResponse.oauthAccessToken);
      } catch {
        return null;
      }
    }
  };
  FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
  FacebookAuthProvider.PROVIDER_ID = "facebook.com";
  var GoogleAuthProvider = class _GoogleAuthProvider extends BaseOAuthProvider {
    constructor() {
      super(
        "google.com"
        /* ProviderId.GOOGLE */
      );
      this.addScope("profile");
    }
    /**
     * Creates a credential for Google. At least one of ID token and access token is required.
     *
     * @example
     * ```javascript
     * // \`googleUser\` from the onsuccess Google Sign In callback.
     * const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
     * const result = await signInWithCredential(credential);
     * ```
     *
     * @param idToken - Google ID token.
     * @param accessToken - Google access token.
     */
    static credential(idToken, accessToken) {
      return OAuthCredential._fromParams({
        providerId: _GoogleAuthProvider.PROVIDER_ID,
        signInMethod: _GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
        idToken,
        accessToken
      });
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
      return _GoogleAuthProvider.credentialFromTaggedObject(userCredential);
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error) {
      return _GoogleAuthProvider.credentialFromTaggedObject(error.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
      if (!tokenResponse) {
        return null;
      }
      const { oauthIdToken, oauthAccessToken } = tokenResponse;
      if (!oauthIdToken && !oauthAccessToken) {
        return null;
      }
      try {
        return _GoogleAuthProvider.credential(oauthIdToken, oauthAccessToken);
      } catch {
        return null;
      }
    }
  };
  GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD = "google.com";
  GoogleAuthProvider.PROVIDER_ID = "google.com";
  var GithubAuthProvider = class _GithubAuthProvider extends BaseOAuthProvider {
    constructor() {
      super(
        "github.com"
        /* ProviderId.GITHUB */
      );
    }
    /**
     * Creates a credential for GitHub.
     *
     * @param accessToken - GitHub access token.
     */
    static credential(accessToken) {
      return OAuthCredential._fromParams({
        providerId: _GithubAuthProvider.PROVIDER_ID,
        signInMethod: _GithubAuthProvider.GITHUB_SIGN_IN_METHOD,
        accessToken
      });
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
      return _GithubAuthProvider.credentialFromTaggedObject(userCredential);
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error) {
      return _GithubAuthProvider.credentialFromTaggedObject(error.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
      if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
        return null;
      }
      if (!tokenResponse.oauthAccessToken) {
        return null;
      }
      try {
        return _GithubAuthProvider.credential(tokenResponse.oauthAccessToken);
      } catch {
        return null;
      }
    }
  };
  GithubAuthProvider.GITHUB_SIGN_IN_METHOD = "github.com";
  GithubAuthProvider.PROVIDER_ID = "github.com";
  var TwitterAuthProvider = class _TwitterAuthProvider extends BaseOAuthProvider {
    constructor() {
      super(
        "twitter.com"
        /* ProviderId.TWITTER */
      );
    }
    /**
     * Creates a credential for Twitter.
     *
     * @param token - Twitter access token.
     * @param secret - Twitter secret.
     */
    static credential(token, secret) {
      return OAuthCredential._fromParams({
        providerId: _TwitterAuthProvider.PROVIDER_ID,
        signInMethod: _TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,
        oauthToken: token,
        oauthTokenSecret: secret
      });
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
      return _TwitterAuthProvider.credentialFromTaggedObject(userCredential);
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error) {
      return _TwitterAuthProvider.credentialFromTaggedObject(error.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
      if (!tokenResponse) {
        return null;
      }
      const { oauthAccessToken, oauthTokenSecret } = tokenResponse;
      if (!oauthAccessToken || !oauthTokenSecret) {
        return null;
      }
      try {
        return _TwitterAuthProvider.credential(oauthAccessToken, oauthTokenSecret);
      } catch {
        return null;
      }
    }
  };
  TwitterAuthProvider.TWITTER_SIGN_IN_METHOD = "twitter.com";
  TwitterAuthProvider.PROVIDER_ID = "twitter.com";
  var UserCredentialImpl = class _UserCredentialImpl {
    constructor(params) {
      this.user = params.user;
      this.providerId = params.providerId;
      this._tokenResponse = params._tokenResponse;
      this.operationType = params.operationType;
    }
    static async _fromIdTokenResponse(auth2, operationType, idTokenResponse, isAnonymous = false) {
      const user = await UserImpl._fromIdTokenResponse(auth2, idTokenResponse, isAnonymous);
      const providerId = providerIdForResponse(idTokenResponse);
      const userCred = new _UserCredentialImpl({
        user,
        providerId,
        _tokenResponse: idTokenResponse,
        operationType
      });
      return userCred;
    }
    static async _forOperation(user, operationType, response) {
      await user._updateTokensIfNecessary(
        response,
        /* reload */
        true
      );
      const providerId = providerIdForResponse(response);
      return new _UserCredentialImpl({
        user,
        providerId,
        _tokenResponse: response,
        operationType
      });
    }
  };
  function providerIdForResponse(response) {
    if (response.providerId) {
      return response.providerId;
    }
    if ("phoneNumber" in response) {
      return "phone";
    }
    return null;
  }
  var MultiFactorError = class _MultiFactorError extends FirebaseError {
    constructor(auth2, error, operationType, user) {
      super(error.code, error.message);
      this.operationType = operationType;
      this.user = user;
      Object.setPrototypeOf(this, _MultiFactorError.prototype);
      this.customData = {
        appName: auth2.name,
        tenantId: auth2.tenantId ?? void 0,
        _serverResponse: error.customData._serverResponse,
        operationType
      };
    }
    static _fromErrorAndOperation(auth2, error, operationType, user) {
      return new _MultiFactorError(auth2, error, operationType, user);
    }
  };
  function _processCredentialSavingMfaContextIfNecessary(auth2, operationType, credential, user) {
    const idTokenProvider = operationType === "reauthenticate" ? credential._getReauthenticationResolver(auth2) : credential._getIdTokenResponse(auth2);
    return idTokenProvider.catch((error) => {
      if (error.code === `auth/${"multi-factor-auth-required"}`) {
        throw MultiFactorError._fromErrorAndOperation(auth2, error, operationType, user);
      }
      throw error;
    });
  }
  async function _link$1(user, credential, bypassAuthState = false) {
    const response = await _logoutIfInvalidated(user, credential._linkToIdToken(user.auth, await user.getIdToken()), bypassAuthState);
    return UserCredentialImpl._forOperation(user, "link", response);
  }
  async function _reauthenticate(user, credential, bypassAuthState = false) {
    const { auth: auth2 } = user;
    if (_isFirebaseServerApp(auth2.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
    }
    const operationType = "reauthenticate";
    try {
      const response = await _logoutIfInvalidated(user, _processCredentialSavingMfaContextIfNecessary(auth2, operationType, credential, user), bypassAuthState);
      _assert(
        response.idToken,
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const parsed = _parseToken(response.idToken);
      _assert(
        parsed,
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const { sub: localId } = parsed;
      _assert(
        user.uid === localId,
        auth2,
        "user-mismatch"
        /* AuthErrorCode.USER_MISMATCH */
      );
      return UserCredentialImpl._forOperation(user, operationType, response);
    } catch (e2) {
      if (e2?.code === `auth/${"user-not-found"}`) {
        _fail(
          auth2,
          "user-mismatch"
          /* AuthErrorCode.USER_MISMATCH */
        );
      }
      throw e2;
    }
  }
  async function _signInWithCredential(auth2, credential, bypassAuthState = false) {
    if (_isFirebaseServerApp(auth2.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
    }
    const operationType = "signIn";
    const response = await _processCredentialSavingMfaContextIfNecessary(auth2, operationType, credential);
    const userCredential = await UserCredentialImpl._fromIdTokenResponse(auth2, operationType, response);
    if (!bypassAuthState) {
      await auth2._updateCurrentUser(userCredential.user);
    }
    return userCredential;
  }
  function onIdTokenChanged(auth2, nextOrObserver, error, completed) {
    return getModularInstance(auth2).onIdTokenChanged(nextOrObserver, error, completed);
  }
  function beforeAuthStateChanged(auth2, callback, onAbort) {
    return getModularInstance(auth2).beforeAuthStateChanged(callback, onAbort);
  }
  function startEnrollPhoneMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth2, request));
  }
  function finalizeEnrollPhoneMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth2, request));
  }
  function startEnrollTotpMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth2, request));
  }
  function finalizeEnrollTotpMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth2, request));
  }
  var STORAGE_AVAILABLE_KEY = "__sak";
  var BrowserPersistenceClass = class {
    constructor(storageRetriever, type) {
      this.storageRetriever = storageRetriever;
      this.type = type;
    }
    _isAvailable() {
      try {
        if (!this.storage) {
          return Promise.resolve(false);
        }
        this.storage.setItem(STORAGE_AVAILABLE_KEY, "1");
        this.storage.removeItem(STORAGE_AVAILABLE_KEY);
        return Promise.resolve(true);
      } catch {
        return Promise.resolve(false);
      }
    }
    _set(key, value) {
      this.storage.setItem(key, JSON.stringify(value));
      return Promise.resolve();
    }
    _get(key) {
      const json = this.storage.getItem(key);
      return Promise.resolve(json ? JSON.parse(json) : null);
    }
    _remove(key) {
      this.storage.removeItem(key);
      return Promise.resolve();
    }
    get storage() {
      return this.storageRetriever();
    }
  };
  var _POLLING_INTERVAL_MS$1 = 1e3;
  var IE10_LOCAL_STORAGE_SYNC_DELAY = 10;
  var BrowserLocalPersistence = class extends BrowserPersistenceClass {
    constructor() {
      super(
        () => window.localStorage,
        "LOCAL"
        /* PersistenceType.LOCAL */
      );
      this.boundEventHandler = (event, poll) => this.onStorageEvent(event, poll);
      this.listeners = {};
      this.localCache = {};
      this.pollTimer = null;
      this.fallbackToPolling = _isMobileBrowser();
      this._shouldAllowMigration = true;
    }
    forAllChangedKeys(cb) {
      for (const key of Object.keys(this.listeners)) {
        const newValue = this.storage.getItem(key);
        const oldValue = this.localCache[key];
        if (newValue !== oldValue) {
          cb(key, oldValue, newValue);
        }
      }
    }
    onStorageEvent(event, poll = false) {
      if (!event.key) {
        this.forAllChangedKeys((key2, _oldValue, newValue) => {
          this.notifyListeners(key2, newValue);
        });
        return;
      }
      const key = event.key;
      if (poll) {
        this.detachListener();
      } else {
        this.stopPolling();
      }
      const triggerListeners = () => {
        const storedValue2 = this.storage.getItem(key);
        if (!poll && this.localCache[key] === storedValue2) {
          return;
        }
        this.notifyListeners(key, storedValue2);
      };
      const storedValue = this.storage.getItem(key);
      if (_isIE10() && storedValue !== event.newValue && event.newValue !== event.oldValue) {
        setTimeout(triggerListeners, IE10_LOCAL_STORAGE_SYNC_DELAY);
      } else {
        triggerListeners();
      }
    }
    notifyListeners(key, value) {
      this.localCache[key] = value;
      const listeners = this.listeners[key];
      if (listeners) {
        for (const listener of Array.from(listeners)) {
          listener(value ? JSON.parse(value) : value);
        }
      }
    }
    startPolling() {
      this.stopPolling();
      this.pollTimer = setInterval(() => {
        this.forAllChangedKeys((key, oldValue, newValue) => {
          this.onStorageEvent(
            new StorageEvent("storage", {
              key,
              oldValue,
              newValue
            }),
            /* poll */
            true
          );
        });
      }, _POLLING_INTERVAL_MS$1);
    }
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    }
    attachListener() {
      window.addEventListener("storage", this.boundEventHandler);
    }
    detachListener() {
      window.removeEventListener("storage", this.boundEventHandler);
    }
    _addListener(key, listener) {
      if (Object.keys(this.listeners).length === 0) {
        if (this.fallbackToPolling) {
          this.startPolling();
        } else {
          this.attachListener();
        }
      }
      if (!this.listeners[key]) {
        this.listeners[key] = /* @__PURE__ */ new Set();
        this.localCache[key] = this.storage.getItem(key);
      }
      this.listeners[key].add(listener);
    }
    _removeListener(key, listener) {
      if (this.listeners[key]) {
        this.listeners[key].delete(listener);
        if (this.listeners[key].size === 0) {
          delete this.listeners[key];
        }
      }
      if (Object.keys(this.listeners).length === 0) {
        this.detachListener();
        this.stopPolling();
      }
    }
    // Update local cache on base operations:
    async _set(key, value) {
      await super._set(key, value);
      this.localCache[key] = JSON.stringify(value);
    }
    async _get(key) {
      const value = await super._get(key);
      this.localCache[key] = JSON.stringify(value);
      return value;
    }
    async _remove(key) {
      await super._remove(key);
      delete this.localCache[key];
    }
  };
  BrowserLocalPersistence.type = "LOCAL";
  var browserLocalPersistence = BrowserLocalPersistence;
  var POLLING_INTERVAL_MS = 1e3;
  function getDocumentCookie(name7) {
    const escapedName = name7.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
    const matcher = RegExp(`${escapedName}=([^;]+)`);
    return document.cookie.match(matcher)?.[1] ?? null;
  }
  function getCookieName(key) {
    const isDevMode = window.location.protocol === "http:";
    return `${isDevMode ? "__dev_" : "__HOST-"}FIREBASE_${key.split(":")[3]}`;
  }
  var CookiePersistence = class {
    constructor() {
      this.type = "COOKIE";
      this.listenerUnsubscribes = /* @__PURE__ */ new Map();
    }
    // used to get the URL to the backend to proxy to
    _getFinalTarget(originalUrl) {
      if (typeof window === void 0) {
        return originalUrl;
      }
      const url = new URL(`${window.location.origin}/__cookies__`);
      url.searchParams.set("finalTarget", originalUrl);
      return url;
    }
    // To be a usable persistence method in a chain browserCookiePersistence ensures that
    // prerequisites have been met, namely that we're in a secureContext, navigator and document are
    // available and cookies are enabled. Not all UAs support these method, so fallback accordingly.
    async _isAvailable() {
      if (typeof isSecureContext === "boolean" && !isSecureContext) {
        return false;
      }
      if (typeof navigator === "undefined" || typeof document === "undefined") {
        return false;
      }
      return navigator.cookieEnabled ?? true;
    }
    // Set should be a noop as we expect middleware to handle this
    async _set(_key, _value) {
      return;
    }
    // Attempt to get the cookie from cookieStore, fallback to document.cookie
    async _get(key) {
      if (!this._isAvailable()) {
        return null;
      }
      const name7 = getCookieName(key);
      if (window.cookieStore) {
        const cookie = await window.cookieStore.get(name7);
        return cookie?.value;
      }
      return getDocumentCookie(name7);
    }
    // Log out by overriding the idToken with a sentinel value of ""
    async _remove(key) {
      if (!this._isAvailable()) {
        return;
      }
      const existingValue = await this._get(key);
      if (!existingValue) {
        return;
      }
      const name7 = getCookieName(key);
      document.cookie = `${name7}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`;
      await fetch(`/__cookies__`, { method: "DELETE" }).catch(() => void 0);
    }
    // Listen for cookie changes, both cookieStore and fallback to polling document.cookie
    _addListener(key, listener) {
      if (!this._isAvailable()) {
        return;
      }
      const name7 = getCookieName(key);
      if (window.cookieStore) {
        const cb = ((event) => {
          const changedCookie = event.changed.find((change) => change.name === name7);
          if (changedCookie) {
            listener(changedCookie.value);
          }
          const deletedCookie = event.deleted.find((change) => change.name === name7);
          if (deletedCookie) {
            listener(null);
          }
        });
        const unsubscribe2 = () => window.cookieStore.removeEventListener("change", cb);
        this.listenerUnsubscribes.set(listener, unsubscribe2);
        return window.cookieStore.addEventListener("change", cb);
      }
      let lastValue = getDocumentCookie(name7);
      const interval = setInterval(() => {
        const currentValue = getDocumentCookie(name7);
        if (currentValue !== lastValue) {
          listener(currentValue);
          lastValue = currentValue;
        }
      }, POLLING_INTERVAL_MS);
      const unsubscribe = () => clearInterval(interval);
      this.listenerUnsubscribes.set(listener, unsubscribe);
    }
    _removeListener(_key, listener) {
      const unsubscribe = this.listenerUnsubscribes.get(listener);
      if (!unsubscribe) {
        return;
      }
      unsubscribe();
      this.listenerUnsubscribes.delete(listener);
    }
  };
  CookiePersistence.type = "COOKIE";
  var BrowserSessionPersistence = class extends BrowserPersistenceClass {
    constructor() {
      super(
        () => window.sessionStorage,
        "SESSION"
        /* PersistenceType.SESSION */
      );
    }
    _addListener(_key, _listener) {
      return;
    }
    _removeListener(_key, _listener) {
      return;
    }
  };
  BrowserSessionPersistence.type = "SESSION";
  var browserSessionPersistence = BrowserSessionPersistence;
  function _allSettled(promises) {
    return Promise.all(promises.map(async (promise) => {
      try {
        const value = await promise;
        return {
          fulfilled: true,
          value
        };
      } catch (reason) {
        return {
          fulfilled: false,
          reason
        };
      }
    }));
  }
  var Receiver = class _Receiver {
    constructor(eventTarget) {
      this.eventTarget = eventTarget;
      this.handlersMap = {};
      this.boundEventHandler = this.handleEvent.bind(this);
    }
    /**
     * Obtain an instance of a Receiver for a given event target, if none exists it will be created.
     *
     * @param eventTarget - An event target (such as window or self) through which the underlying
     * messages will be received.
     */
    static _getInstance(eventTarget) {
      const existingInstance = this.receivers.find((receiver) => receiver.isListeningto(eventTarget));
      if (existingInstance) {
        return existingInstance;
      }
      const newInstance = new _Receiver(eventTarget);
      this.receivers.push(newInstance);
      return newInstance;
    }
    isListeningto(eventTarget) {
      return this.eventTarget === eventTarget;
    }
    /**
     * Fans out a MessageEvent to the appropriate listeners.
     *
     * @remarks
     * Sends an {@link Status.ACK} upon receipt and a {@link Status.DONE} once all handlers have
     * finished processing.
     *
     * @param event - The MessageEvent.
     *
     */
    async handleEvent(event) {
      const messageEvent = event;
      const { eventId, eventType, data } = messageEvent.data;
      const handlers = this.handlersMap[eventType];
      if (!handlers?.size) {
        return;
      }
      messageEvent.ports[0].postMessage({
        status: "ack",
        eventId,
        eventType
      });
      const promises = Array.from(handlers).map(async (handler) => handler(messageEvent.origin, data));
      const response = await _allSettled(promises);
      messageEvent.ports[0].postMessage({
        status: "done",
        eventId,
        eventType,
        response
      });
    }
    /**
     * Subscribe an event handler for a particular event.
     *
     * @param eventType - Event name to subscribe to.
     * @param eventHandler - The event handler which should receive the events.
     *
     */
    _subscribe(eventType, eventHandler) {
      if (Object.keys(this.handlersMap).length === 0) {
        this.eventTarget.addEventListener("message", this.boundEventHandler);
      }
      if (!this.handlersMap[eventType]) {
        this.handlersMap[eventType] = /* @__PURE__ */ new Set();
      }
      this.handlersMap[eventType].add(eventHandler);
    }
    /**
     * Unsubscribe an event handler from a particular event.
     *
     * @param eventType - Event name to unsubscribe from.
     * @param eventHandler - Optional event handler, if none provided, unsubscribe all handlers on this event.
     *
     */
    _unsubscribe(eventType, eventHandler) {
      if (this.handlersMap[eventType] && eventHandler) {
        this.handlersMap[eventType].delete(eventHandler);
      }
      if (!eventHandler || this.handlersMap[eventType].size === 0) {
        delete this.handlersMap[eventType];
      }
      if (Object.keys(this.handlersMap).length === 0) {
        this.eventTarget.removeEventListener("message", this.boundEventHandler);
      }
    }
  };
  Receiver.receivers = [];
  function _generateEventId(prefix = "", digits = 10) {
    let random = "";
    for (let i2 = 0; i2 < digits; i2++) {
      random += Math.floor(Math.random() * 10);
    }
    return prefix + random;
  }
  var Sender = class {
    constructor(target) {
      this.target = target;
      this.handlers = /* @__PURE__ */ new Set();
    }
    /**
     * Unsubscribe the handler and remove it from our tracking Set.
     *
     * @param handler - The handler to unsubscribe.
     */
    removeMessageHandler(handler) {
      if (handler.messageChannel) {
        handler.messageChannel.port1.removeEventListener("message", handler.onMessage);
        handler.messageChannel.port1.close();
      }
      this.handlers.delete(handler);
    }
    /**
     * Send a message to the Receiver located at {@link target}.
     *
     * @remarks
     * We'll first wait a bit for an ACK , if we get one we will wait significantly longer until the
     * receiver has had a chance to fully process the event.
     *
     * @param eventType - Type of event to send.
     * @param data - The payload of the event.
     * @param timeout - Timeout for waiting on an ACK from the receiver.
     *
     * @returns An array of settled promises from all the handlers that were listening on the receiver.
     */
    async _send(eventType, data, timeout = 50) {
      const messageChannel = typeof MessageChannel !== "undefined" ? new MessageChannel() : null;
      if (!messageChannel) {
        throw new Error(
          "connection_unavailable"
          /* _MessageError.CONNECTION_UNAVAILABLE */
        );
      }
      let completionTimer;
      let handler;
      return new Promise((resolve, reject) => {
        const eventId = _generateEventId("", 20);
        messageChannel.port1.start();
        const ackTimer = setTimeout(() => {
          reject(new Error(
            "unsupported_event"
            /* _MessageError.UNSUPPORTED_EVENT */
          ));
        }, timeout);
        handler = {
          messageChannel,
          onMessage(event) {
            const messageEvent = event;
            if (messageEvent.data.eventId !== eventId) {
              return;
            }
            switch (messageEvent.data.status) {
              case "ack":
                clearTimeout(ackTimer);
                completionTimer = setTimeout(
                  () => {
                    reject(new Error(
                      "timeout"
                      /* _MessageError.TIMEOUT */
                    ));
                  },
                  3e3
                  /* _TimeoutDuration.COMPLETION */
                );
                break;
              case "done":
                clearTimeout(completionTimer);
                resolve(messageEvent.data.response);
                break;
              default:
                clearTimeout(ackTimer);
                clearTimeout(completionTimer);
                reject(new Error(
                  "invalid_response"
                  /* _MessageError.INVALID_RESPONSE */
                ));
                break;
            }
          }
        };
        this.handlers.add(handler);
        messageChannel.port1.addEventListener("message", handler.onMessage);
        this.target.postMessage({
          eventType,
          eventId,
          data
        }, [messageChannel.port2]);
      }).finally(() => {
        if (handler) {
          this.removeMessageHandler(handler);
        }
      });
    }
  };
  function _window() {
    return window;
  }
  function _setWindowLocation(url) {
    _window().location.href = url;
  }
  function _isWorker() {
    return typeof _window()["WorkerGlobalScope"] !== "undefined" && typeof _window()["importScripts"] === "function";
  }
  async function _getActiveServiceWorker() {
    if (!navigator?.serviceWorker) {
      return null;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      return registration.active;
    } catch {
      return null;
    }
  }
  function _getServiceWorkerController() {
    return navigator?.serviceWorker?.controller || null;
  }
  function _getWorkerGlobalScope() {
    return _isWorker() ? self : null;
  }
  var DB_NAME2 = "firebaseLocalStorageDb";
  var DB_VERSION2 = 1;
  var DB_OBJECTSTORE_NAME = "firebaseLocalStorage";
  var DB_DATA_KEYPATH = "fbase_key";
  var DBPromise = class {
    constructor(request) {
      this.request = request;
    }
    toPromise() {
      return new Promise((resolve, reject) => {
        this.request.addEventListener("success", () => {
          resolve(this.request.result);
        });
        this.request.addEventListener("error", () => {
          reject(this.request.error);
        });
      });
    }
  };
  function getObjectStore(db, isReadWrite) {
    return db.transaction([DB_OBJECTSTORE_NAME], isReadWrite ? "readwrite" : "readonly").objectStore(DB_OBJECTSTORE_NAME);
  }
  function _deleteDatabase() {
    const request = indexedDB.deleteDatabase(DB_NAME2);
    return new DBPromise(request).toPromise();
  }
  function _openDatabase() {
    const request = indexedDB.open(DB_NAME2, DB_VERSION2);
    return new Promise((resolve, reject) => {
      request.addEventListener("error", () => {
        reject(request.error);
      });
      request.addEventListener("upgradeneeded", () => {
        const db = request.result;
        try {
          db.createObjectStore(DB_OBJECTSTORE_NAME, { keyPath: DB_DATA_KEYPATH });
        } catch (e2) {
          reject(e2);
        }
      });
      request.addEventListener("success", async () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(DB_OBJECTSTORE_NAME)) {
          db.close();
          await _deleteDatabase();
          resolve(await _openDatabase());
        } else {
          resolve(db);
        }
      });
    });
  }
  async function _putObject(db, key, value) {
    const request = getObjectStore(db, true).put({
      [DB_DATA_KEYPATH]: key,
      value
    });
    return new DBPromise(request).toPromise();
  }
  async function getObject(db, key) {
    const request = getObjectStore(db, false).get(key);
    const data = await new DBPromise(request).toPromise();
    return data === void 0 ? null : data.value;
  }
  function _deleteObject(db, key) {
    const request = getObjectStore(db, true).delete(key);
    return new DBPromise(request).toPromise();
  }
  var _POLLING_INTERVAL_MS = 800;
  var _TRANSACTION_RETRY_COUNT = 3;
  var IndexedDBLocalPersistence = class {
    constructor() {
      this.type = "LOCAL";
      this._shouldAllowMigration = true;
      this.listeners = {};
      this.localCache = {};
      this.pollTimer = null;
      this.pendingWrites = 0;
      this.receiver = null;
      this.sender = null;
      this.serviceWorkerReceiverAvailable = false;
      this.activeServiceWorker = null;
      this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(() => {
      }, () => {
      });
    }
    async _openDb() {
      if (this.db) {
        return this.db;
      }
      this.db = await _openDatabase();
      return this.db;
    }
    async _withRetries(op) {
      let numAttempts = 0;
      while (true) {
        try {
          const db = await this._openDb();
          return await op(db);
        } catch (e2) {
          if (numAttempts++ > _TRANSACTION_RETRY_COUNT) {
            throw e2;
          }
          if (this.db) {
            this.db.close();
            this.db = void 0;
          }
        }
      }
    }
    /**
     * IndexedDB events do not propagate from the main window to the worker context.  We rely on a
     * postMessage interface to send these events to the worker ourselves.
     */
    async initializeServiceWorkerMessaging() {
      return _isWorker() ? this.initializeReceiver() : this.initializeSender();
    }
    /**
     * As the worker we should listen to events from the main window.
     */
    async initializeReceiver() {
      this.receiver = Receiver._getInstance(_getWorkerGlobalScope());
      this.receiver._subscribe("keyChanged", async (_origin, data) => {
        const keys = await this._poll();
        return {
          keyProcessed: keys.includes(data.key)
        };
      });
      this.receiver._subscribe("ping", async (_origin, _data) => {
        return [
          "keyChanged"
          /* _EventType.KEY_CHANGED */
        ];
      });
    }
    /**
     * As the main window, we should let the worker know when keys change (set and remove).
     *
     * @remarks
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready | ServiceWorkerContainer.ready}
     * may not resolve.
     */
    async initializeSender() {
      this.activeServiceWorker = await _getActiveServiceWorker();
      if (!this.activeServiceWorker) {
        return;
      }
      this.sender = new Sender(this.activeServiceWorker);
      const results = await this.sender._send(
        "ping",
        {},
        800
        /* _TimeoutDuration.LONG_ACK */
      );
      if (!results) {
        return;
      }
      if (results[0]?.fulfilled && results[0]?.value.includes(
        "keyChanged"
        /* _EventType.KEY_CHANGED */
      )) {
        this.serviceWorkerReceiverAvailable = true;
      }
    }
    /**
     * Let the worker know about a changed key, the exact key doesn't technically matter since the
     * worker will just trigger a full sync anyway.
     *
     * @remarks
     * For now, we only support one service worker per page.
     *
     * @param key - Storage key which changed.
     */
    async notifyServiceWorker(key) {
      if (!this.sender || !this.activeServiceWorker || _getServiceWorkerController() !== this.activeServiceWorker) {
        return;
      }
      try {
        await this.sender._send(
          "keyChanged",
          { key },
          // Use long timeout if receiver has previously responded to a ping from us.
          this.serviceWorkerReceiverAvailable ? 800 : 50
          /* _TimeoutDuration.ACK */
        );
      } catch {
      }
    }
    async _isAvailable() {
      try {
        if (!indexedDB) {
          return false;
        }
        const db = await _openDatabase();
        await _putObject(db, STORAGE_AVAILABLE_KEY, "1");
        await _deleteObject(db, STORAGE_AVAILABLE_KEY);
        return true;
      } catch {
      }
      return false;
    }
    async _withPendingWrite(write) {
      this.pendingWrites++;
      try {
        await write();
      } finally {
        this.pendingWrites--;
      }
    }
    async _set(key, value) {
      return this._withPendingWrite(async () => {
        await this._withRetries((db) => _putObject(db, key, value));
        this.localCache[key] = value;
        return this.notifyServiceWorker(key);
      });
    }
    async _get(key) {
      const obj = await this._withRetries((db) => getObject(db, key));
      this.localCache[key] = obj;
      return obj;
    }
    async _remove(key) {
      return this._withPendingWrite(async () => {
        await this._withRetries((db) => _deleteObject(db, key));
        delete this.localCache[key];
        return this.notifyServiceWorker(key);
      });
    }
    async _poll() {
      const result = await this._withRetries((db) => {
        const getAllRequest = getObjectStore(db, false).getAll();
        return new DBPromise(getAllRequest).toPromise();
      });
      if (!result) {
        return [];
      }
      if (this.pendingWrites !== 0) {
        return [];
      }
      const keys = [];
      const keysInResult = /* @__PURE__ */ new Set();
      if (result.length !== 0) {
        for (const { fbase_key: key, value } of result) {
          keysInResult.add(key);
          if (JSON.stringify(this.localCache[key]) !== JSON.stringify(value)) {
            this.notifyListeners(key, value);
            keys.push(key);
          }
        }
      }
      for (const localKey of Object.keys(this.localCache)) {
        if (this.localCache[localKey] && !keysInResult.has(localKey)) {
          this.notifyListeners(localKey, null);
          keys.push(localKey);
        }
      }
      return keys;
    }
    notifyListeners(key, newValue) {
      this.localCache[key] = newValue;
      const listeners = this.listeners[key];
      if (listeners) {
        for (const listener of Array.from(listeners)) {
          listener(newValue);
        }
      }
    }
    startPolling() {
      this.stopPolling();
      this.pollTimer = setInterval(async () => this._poll(), _POLLING_INTERVAL_MS);
    }
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    }
    _addListener(key, listener) {
      if (Object.keys(this.listeners).length === 0) {
        this.startPolling();
      }
      if (!this.listeners[key]) {
        this.listeners[key] = /* @__PURE__ */ new Set();
        void this._get(key);
      }
      this.listeners[key].add(listener);
    }
    _removeListener(key, listener) {
      if (this.listeners[key]) {
        this.listeners[key].delete(listener);
        if (this.listeners[key].size === 0) {
          delete this.listeners[key];
        }
      }
      if (Object.keys(this.listeners).length === 0) {
        this.stopPolling();
      }
    }
  };
  IndexedDBLocalPersistence.type = "LOCAL";
  var indexedDBLocalPersistence = IndexedDBLocalPersistence;
  function startSignInPhoneMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaSignIn:start", _addTidIfNecessary(auth2, request));
  }
  function finalizeSignInPhoneMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth2, request));
  }
  function finalizeSignInTotpMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth2, request));
  }
  var _JSLOAD_CALLBACK = _generateCallbackName("rcb");
  var NETWORK_TIMEOUT_DELAY = new Delay(3e4, 6e4);
  var RECAPTCHA_VERIFIER_TYPE = "recaptcha";
  async function _verifyPhoneNumber(auth2, options, verifier) {
    if (!auth2._getRecaptchaConfig()) {
      try {
        await _initializeRecaptchaConfig(auth2);
      } catch (error) {
        console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.");
      }
    }
    try {
      let phoneInfoOptions;
      if (typeof options === "string") {
        phoneInfoOptions = {
          phoneNumber: options
        };
      } else {
        phoneInfoOptions = options;
      }
      if ("session" in phoneInfoOptions) {
        const session = phoneInfoOptions.session;
        if ("phoneNumber" in phoneInfoOptions) {
          _assert(
            session.type === "enroll",
            auth2,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          const startPhoneMfaEnrollmentRequest = {
            idToken: session.credential,
            phoneEnrollmentInfo: {
              phoneNumber: phoneInfoOptions.phoneNumber,
              clientType: "CLIENT_TYPE_WEB"
              /* RecaptchaClientType.WEB */
            }
          };
          const startEnrollPhoneMfaActionCallback = async (authInstance, request) => {
            if (request.phoneEnrollmentInfo.captchaResponse === FAKE_TOKEN) {
              _assert(
                verifier?.type === RECAPTCHA_VERIFIER_TYPE,
                authInstance,
                "argument-error"
                /* AuthErrorCode.ARGUMENT_ERROR */
              );
              const requestWithRecaptchaV2 = await injectRecaptchaV2Token(authInstance, request, verifier);
              return startEnrollPhoneMfa(authInstance, requestWithRecaptchaV2);
            }
            return startEnrollPhoneMfa(authInstance, request);
          };
          const startPhoneMfaEnrollmentResponse = handleRecaptchaFlow(
            auth2,
            startPhoneMfaEnrollmentRequest,
            "mfaSmsEnrollment",
            startEnrollPhoneMfaActionCallback,
            "PHONE_PROVIDER"
            /* RecaptchaAuthProvider.PHONE_PROVIDER */
          );
          const response = await startPhoneMfaEnrollmentResponse.catch((error) => {
            return Promise.reject(error);
          });
          return response.phoneSessionInfo.sessionInfo;
        } else {
          _assert(
            session.type === "signin",
            auth2,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          const mfaEnrollmentId = phoneInfoOptions.multiFactorHint?.uid || phoneInfoOptions.multiFactorUid;
          _assert(
            mfaEnrollmentId,
            auth2,
            "missing-multi-factor-info"
            /* AuthErrorCode.MISSING_MFA_INFO */
          );
          const startPhoneMfaSignInRequest = {
            mfaPendingCredential: session.credential,
            mfaEnrollmentId,
            phoneSignInInfo: {
              clientType: "CLIENT_TYPE_WEB"
              /* RecaptchaClientType.WEB */
            }
          };
          const startSignInPhoneMfaActionCallback = async (authInstance, request) => {
            if (request.phoneSignInInfo.captchaResponse === FAKE_TOKEN) {
              _assert(
                verifier?.type === RECAPTCHA_VERIFIER_TYPE,
                authInstance,
                "argument-error"
                /* AuthErrorCode.ARGUMENT_ERROR */
              );
              const requestWithRecaptchaV2 = await injectRecaptchaV2Token(authInstance, request, verifier);
              return startSignInPhoneMfa(authInstance, requestWithRecaptchaV2);
            }
            return startSignInPhoneMfa(authInstance, request);
          };
          const startPhoneMfaSignInResponse = handleRecaptchaFlow(
            auth2,
            startPhoneMfaSignInRequest,
            "mfaSmsSignIn",
            startSignInPhoneMfaActionCallback,
            "PHONE_PROVIDER"
            /* RecaptchaAuthProvider.PHONE_PROVIDER */
          );
          const response = await startPhoneMfaSignInResponse.catch((error) => {
            return Promise.reject(error);
          });
          return response.phoneResponseInfo.sessionInfo;
        }
      } else {
        const sendPhoneVerificationCodeRequest = {
          phoneNumber: phoneInfoOptions.phoneNumber,
          clientType: "CLIENT_TYPE_WEB"
          /* RecaptchaClientType.WEB */
        };
        const sendPhoneVerificationCodeActionCallback = async (authInstance, request) => {
          if (request.captchaResponse === FAKE_TOKEN) {
            _assert(
              verifier?.type === RECAPTCHA_VERIFIER_TYPE,
              authInstance,
              "argument-error"
              /* AuthErrorCode.ARGUMENT_ERROR */
            );
            const requestWithRecaptchaV2 = await injectRecaptchaV2Token(authInstance, request, verifier);
            return sendPhoneVerificationCode(authInstance, requestWithRecaptchaV2);
          }
          return sendPhoneVerificationCode(authInstance, request);
        };
        const sendPhoneVerificationCodeResponse = handleRecaptchaFlow(
          auth2,
          sendPhoneVerificationCodeRequest,
          "sendVerificationCode",
          sendPhoneVerificationCodeActionCallback,
          "PHONE_PROVIDER"
          /* RecaptchaAuthProvider.PHONE_PROVIDER */
        );
        const response = await sendPhoneVerificationCodeResponse.catch((error) => {
          return Promise.reject(error);
        });
        return response.sessionInfo;
      }
    } finally {
      verifier?._reset();
    }
  }
  async function injectRecaptchaV2Token(auth2, request, recaptchaV2Verifier) {
    _assert(
      recaptchaV2Verifier.type === RECAPTCHA_VERIFIER_TYPE,
      auth2,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    );
    const recaptchaV2Token = await recaptchaV2Verifier.verify();
    _assert(
      typeof recaptchaV2Token === "string",
      auth2,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    );
    const newRequest = { ...request };
    if ("phoneEnrollmentInfo" in newRequest) {
      const phoneNumber = newRequest.phoneEnrollmentInfo.phoneNumber;
      const captchaResponse = newRequest.phoneEnrollmentInfo.captchaResponse;
      const clientType = newRequest.phoneEnrollmentInfo.clientType;
      const recaptchaVersion = newRequest.phoneEnrollmentInfo.recaptchaVersion;
      Object.assign(newRequest, {
        "phoneEnrollmentInfo": {
          phoneNumber,
          recaptchaToken: recaptchaV2Token,
          captchaResponse,
          clientType,
          recaptchaVersion
        }
      });
      return newRequest;
    } else if ("phoneSignInInfo" in newRequest) {
      const captchaResponse = newRequest.phoneSignInInfo.captchaResponse;
      const clientType = newRequest.phoneSignInInfo.clientType;
      const recaptchaVersion = newRequest.phoneSignInInfo.recaptchaVersion;
      Object.assign(newRequest, {
        "phoneSignInInfo": {
          recaptchaToken: recaptchaV2Token,
          captchaResponse,
          clientType,
          recaptchaVersion
        }
      });
      return newRequest;
    } else {
      Object.assign(newRequest, { "recaptchaToken": recaptchaV2Token });
      return newRequest;
    }
  }
  var PhoneAuthProvider = class _PhoneAuthProvider {
    /**
     * @param auth - The Firebase {@link Auth} instance in which sign-ins should occur.
     *
     */
    constructor(auth2) {
      this.providerId = _PhoneAuthProvider.PROVIDER_ID;
      this.auth = _castAuth(auth2);
    }
    /**
     *
     * Starts a phone number authentication flow by sending a verification code to the given phone
     * number.
     *
     * @example
     * ```javascript
     * const provider = new PhoneAuthProvider(auth);
     * const verificationId = await provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const authCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
     * const userCredential = await signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * An alternative flow is provided using the `signInWithPhoneNumber` method.
     * ```javascript
     * const confirmationResult = signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const userCredential = confirmationResult.confirm(verificationCode);
     * ```
     *
     * @param phoneInfoOptions - The user's {@link PhoneInfoOptions}. The phone number should be in
     * E.164 format (e.g. +16505550101).
     * @param applicationVerifier - An {@link ApplicationVerifier}, which prevents
     * requests from unauthorized clients. This SDK includes an implementation
     * based on reCAPTCHA v2, {@link RecaptchaVerifier}. If you've enabled
     * reCAPTCHA Enterprise bot protection in Enforce mode, this parameter is
     * optional; in all other configurations, the parameter is required.
     *
     * @returns A Promise for a verification ID that can be passed to
     * {@link PhoneAuthProvider.credential} to identify this flow.
     */
    verifyPhoneNumber(phoneOptions, applicationVerifier) {
      return _verifyPhoneNumber(this.auth, phoneOptions, getModularInstance(applicationVerifier));
    }
    /**
     * Creates a phone auth credential, given the verification ID from
     * {@link PhoneAuthProvider.verifyPhoneNumber} and the code that was sent to the user's
     * mobile device.
     *
     * @example
     * ```javascript
     * const provider = new PhoneAuthProvider(auth);
     * const verificationId = provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const authCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
     * const userCredential = signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * An alternative flow is provided using the `signInWithPhoneNumber` method.
     * ```javascript
     * const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const userCredential = await confirmationResult.confirm(verificationCode);
     * ```
     *
     * @param verificationId - The verification ID returned from {@link PhoneAuthProvider.verifyPhoneNumber}.
     * @param verificationCode - The verification code sent to the user's mobile device.
     *
     * @returns The auth provider credential.
     */
    static credential(verificationId, verificationCode) {
      return PhoneAuthCredential._fromVerification(verificationId, verificationCode);
    }
    /**
     * Generates an {@link AuthCredential} from a {@link UserCredential}.
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
      const credential = userCredential;
      return _PhoneAuthProvider.credentialFromTaggedObject(credential);
    }
    /**
     * Returns an {@link AuthCredential} when passed an error.
     *
     * @remarks
     *
     * This method works for errors like
     * `auth/account-exists-with-different-credentials`. This is useful for
     * recovering when attempting to set a user's phone number but the number
     * in question is already tied to another account. For example, the following
     * code tries to update the current user's phone number, and if that
     * fails, links the user with the account associated with that number:
     *
     * ```js
     * const provider = new PhoneAuthProvider(auth);
     * const verificationId = await provider.verifyPhoneNumber(number, verifier);
     * try {
     *   const code = ''; // Prompt the user for the verification code
     *   await updatePhoneNumber(
     *       auth.currentUser,
     *       PhoneAuthProvider.credential(verificationId, code));
     * } catch (e) {
     *   if ((e as FirebaseError)?.code === 'auth/account-exists-with-different-credential') {
     *     const cred = PhoneAuthProvider.credentialFromError(e);
     *     await linkWithCredential(auth.currentUser, cred);
     *   }
     * }
     *
     * // At this point, auth.currentUser.phoneNumber === number.
     * ```
     *
     * @param error - The error to generate a credential from.
     */
    static credentialFromError(error) {
      return _PhoneAuthProvider.credentialFromTaggedObject(error.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
      if (!tokenResponse) {
        return null;
      }
      const { phoneNumber, temporaryProof } = tokenResponse;
      if (phoneNumber && temporaryProof) {
        return PhoneAuthCredential._fromTokenResponse(phoneNumber, temporaryProof);
      }
      return null;
    }
  };
  PhoneAuthProvider.PROVIDER_ID = "phone";
  PhoneAuthProvider.PHONE_SIGN_IN_METHOD = "phone";
  function _withDefaultResolver(auth2, resolverOverride) {
    if (resolverOverride) {
      return _getInstance(resolverOverride);
    }
    _assert(
      auth2._popupRedirectResolver,
      auth2,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    );
    return auth2._popupRedirectResolver;
  }
  var IdpCredential = class extends AuthCredential {
    constructor(params) {
      super(
        "custom",
        "custom"
        /* ProviderId.CUSTOM */
      );
      this.params = params;
    }
    _getIdTokenResponse(auth2) {
      return signInWithIdp(auth2, this._buildIdpRequest());
    }
    _linkToIdToken(auth2, idToken) {
      return signInWithIdp(auth2, this._buildIdpRequest(idToken));
    }
    _getReauthenticationResolver(auth2) {
      return signInWithIdp(auth2, this._buildIdpRequest());
    }
    _buildIdpRequest(idToken) {
      const request = {
        requestUri: this.params.requestUri,
        sessionId: this.params.sessionId,
        postBody: this.params.postBody,
        tenantId: this.params.tenantId,
        pendingToken: this.params.pendingToken,
        returnSecureToken: true,
        returnIdpCredential: true
      };
      if (idToken) {
        request.idToken = idToken;
      }
      return request;
    }
  };
  function _signIn(params) {
    return _signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
  }
  function _reauth(params) {
    const { auth: auth2, user } = params;
    _assert(
      user,
      auth2,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return _reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
  }
  async function _link(params) {
    const { auth: auth2, user } = params;
    _assert(
      user,
      auth2,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return _link$1(user, new IdpCredential(params), params.bypassAuthState);
  }
  var AbstractPopupRedirectOperation = class {
    constructor(auth2, filter, resolver, user, bypassAuthState = false) {
      this.auth = auth2;
      this.resolver = resolver;
      this.user = user;
      this.bypassAuthState = bypassAuthState;
      this.pendingPromise = null;
      this.eventManager = null;
      this.filter = Array.isArray(filter) ? filter : [filter];
    }
    execute() {
      return new Promise(async (resolve, reject) => {
        this.pendingPromise = { resolve, reject };
        try {
          this.eventManager = await this.resolver._initialize(this.auth);
          await this.onExecution();
          this.eventManager.registerConsumer(this);
        } catch (e2) {
          this.reject(e2);
        }
      });
    }
    async onAuthEvent(event) {
      const { urlResponse, sessionId, postBody, tenantId, error, type } = event;
      if (error) {
        this.reject(error);
        return;
      }
      const params = {
        auth: this.auth,
        requestUri: urlResponse,
        sessionId,
        tenantId: tenantId || void 0,
        postBody: postBody || void 0,
        user: this.user,
        bypassAuthState: this.bypassAuthState
      };
      try {
        this.resolve(await this.getIdpTask(type)(params));
      } catch (e2) {
        this.reject(e2);
      }
    }
    onError(error) {
      this.reject(error);
    }
    getIdpTask(type) {
      switch (type) {
        case "signInViaPopup":
        case "signInViaRedirect":
          return _signIn;
        case "linkViaPopup":
        case "linkViaRedirect":
          return _link;
        case "reauthViaPopup":
        case "reauthViaRedirect":
          return _reauth;
        default:
          _fail(
            this.auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
      }
    }
    resolve(cred) {
      debugAssert(this.pendingPromise, "Pending promise was never set");
      this.pendingPromise.resolve(cred);
      this.unregisterAndCleanUp();
    }
    reject(error) {
      debugAssert(this.pendingPromise, "Pending promise was never set");
      this.pendingPromise.reject(error);
      this.unregisterAndCleanUp();
    }
    unregisterAndCleanUp() {
      if (this.eventManager) {
        this.eventManager.unregisterConsumer(this);
      }
      this.pendingPromise = null;
      this.cleanUp();
    }
  };
  var _POLL_WINDOW_CLOSE_TIMEOUT = new Delay(2e3, 1e4);
  var PopupOperation = class _PopupOperation extends AbstractPopupRedirectOperation {
    constructor(auth2, filter, provider, resolver, user) {
      super(auth2, filter, resolver, user);
      this.provider = provider;
      this.authWindow = null;
      this.pollId = null;
      if (_PopupOperation.currentPopupAction) {
        _PopupOperation.currentPopupAction.cancel();
      }
      _PopupOperation.currentPopupAction = this;
    }
    async executeNotNull() {
      const result = await this.execute();
      _assert(
        result,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      return result;
    }
    async onExecution() {
      debugAssert(this.filter.length === 1, "Popup operations only handle one event");
      const eventId = _generateEventId();
      this.authWindow = await this.resolver._openPopup(
        this.auth,
        this.provider,
        this.filter[0],
        // There's always one, see constructor
        eventId
      );
      this.authWindow.associatedEvent = eventId;
      this.resolver._originValidation(this.auth).catch((e2) => {
        this.reject(e2);
      });
      this.resolver._isIframeWebStorageSupported(this.auth, (isSupported2) => {
        if (!isSupported2) {
          this.reject(_createError(
            this.auth,
            "web-storage-unsupported"
            /* AuthErrorCode.WEB_STORAGE_UNSUPPORTED */
          ));
        }
      });
      this.pollUserCancellation();
    }
    get eventId() {
      return this.authWindow?.associatedEvent || null;
    }
    cancel() {
      this.reject(_createError(
        this.auth,
        "cancelled-popup-request"
        /* AuthErrorCode.EXPIRED_POPUP_REQUEST */
      ));
    }
    cleanUp() {
      if (this.authWindow) {
        this.authWindow.close();
      }
      if (this.pollId) {
        window.clearTimeout(this.pollId);
      }
      this.authWindow = null;
      this.pollId = null;
      _PopupOperation.currentPopupAction = null;
    }
    pollUserCancellation() {
      const poll = () => {
        if (this.authWindow?.window?.closed) {
          this.pollId = window.setTimeout(
            () => {
              this.pollId = null;
              this.reject(_createError(
                this.auth,
                "popup-closed-by-user"
                /* AuthErrorCode.POPUP_CLOSED_BY_USER */
              ));
            },
            8e3
            /* _Timeout.AUTH_EVENT */
          );
          return;
        }
        this.pollId = window.setTimeout(poll, _POLL_WINDOW_CLOSE_TIMEOUT.get());
      };
      poll();
    }
  };
  PopupOperation.currentPopupAction = null;
  var PENDING_REDIRECT_KEY = "pendingRedirect";
  var redirectOutcomeMap = /* @__PURE__ */ new Map();
  var RedirectAction = class extends AbstractPopupRedirectOperation {
    constructor(auth2, resolver, bypassAuthState = false) {
      super(auth2, [
        "signInViaRedirect",
        "linkViaRedirect",
        "reauthViaRedirect",
        "unknown"
        /* AuthEventType.UNKNOWN */
      ], resolver, void 0, bypassAuthState);
      this.eventId = null;
    }
    /**
     * Override the execute function; if we already have a redirect result, then
     * just return it.
     */
    async execute() {
      let readyOutcome = redirectOutcomeMap.get(this.auth._key());
      if (!readyOutcome) {
        try {
          const hasPendingRedirect = await _getAndClearPendingRedirectStatus(this.resolver, this.auth);
          const result = hasPendingRedirect ? await super.execute() : null;
          readyOutcome = () => Promise.resolve(result);
        } catch (e2) {
          readyOutcome = () => Promise.reject(e2);
        }
        redirectOutcomeMap.set(this.auth._key(), readyOutcome);
      }
      if (!this.bypassAuthState) {
        redirectOutcomeMap.set(this.auth._key(), () => Promise.resolve(null));
      }
      return readyOutcome();
    }
    async onAuthEvent(event) {
      if (event.type === "signInViaRedirect") {
        return super.onAuthEvent(event);
      } else if (event.type === "unknown") {
        this.resolve(null);
        return;
      }
      if (event.eventId) {
        const user = await this.auth._redirectUserForId(event.eventId);
        if (user) {
          this.user = user;
          return super.onAuthEvent(event);
        } else {
          this.resolve(null);
        }
      }
    }
    async onExecution() {
    }
    cleanUp() {
    }
  };
  async function _getAndClearPendingRedirectStatus(resolver, auth2) {
    const key = pendingRedirectKey(auth2);
    const persistence = resolverPersistence(resolver);
    if (!await persistence._isAvailable()) {
      return false;
    }
    const hasPendingRedirect = await persistence._get(key) === "true";
    await persistence._remove(key);
    return hasPendingRedirect;
  }
  function _overrideRedirectResult(auth2, result) {
    redirectOutcomeMap.set(auth2._key(), result);
  }
  function resolverPersistence(resolver) {
    return _getInstance(resolver._redirectPersistence);
  }
  function pendingRedirectKey(auth2) {
    return _persistenceKeyName(PENDING_REDIRECT_KEY, auth2.config.apiKey, auth2.name);
  }
  async function _getRedirectResult(auth2, resolverExtern, bypassAuthState = false) {
    if (_isFirebaseServerApp(auth2.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
    }
    const authInternal = _castAuth(auth2);
    const resolver = _withDefaultResolver(authInternal, resolverExtern);
    const action = new RedirectAction(authInternal, resolver, bypassAuthState);
    const result = await action.execute();
    if (result && !bypassAuthState) {
      delete result.user._redirectEventId;
      await authInternal._persistUserIfCurrent(result.user);
      await authInternal._setRedirectUser(null, resolverExtern);
    }
    return result;
  }
  var EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1e3;
  var AuthEventManager = class {
    constructor(auth2) {
      this.auth = auth2;
      this.cachedEventUids = /* @__PURE__ */ new Set();
      this.consumers = /* @__PURE__ */ new Set();
      this.queuedRedirectEvent = null;
      this.hasHandledPotentialRedirect = false;
      this.lastProcessedEventTime = Date.now();
    }
    registerConsumer(authEventConsumer) {
      this.consumers.add(authEventConsumer);
      if (this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
        this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
        this.saveEventToCache(this.queuedRedirectEvent);
        this.queuedRedirectEvent = null;
      }
    }
    unregisterConsumer(authEventConsumer) {
      this.consumers.delete(authEventConsumer);
    }
    onEvent(event) {
      if (this.hasEventBeenHandled(event)) {
        return false;
      }
      let handled = false;
      this.consumers.forEach((consumer) => {
        if (this.isEventForConsumer(event, consumer)) {
          handled = true;
          this.sendToConsumer(event, consumer);
          this.saveEventToCache(event);
        }
      });
      if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) {
        return handled;
      }
      this.hasHandledPotentialRedirect = true;
      if (!handled) {
        this.queuedRedirectEvent = event;
        handled = true;
      }
      return handled;
    }
    sendToConsumer(event, consumer) {
      if (event.error && !isNullRedirectEvent(event)) {
        const code = event.error.code?.split("auth/")[1] || "internal-error";
        consumer.onError(_createError(this.auth, code));
      } else {
        consumer.onAuthEvent(event);
      }
    }
    isEventForConsumer(event, consumer) {
      const eventIdMatches = consumer.eventId === null || !!event.eventId && event.eventId === consumer.eventId;
      return consumer.filter.includes(event.type) && eventIdMatches;
    }
    hasEventBeenHandled(event) {
      if (Date.now() - this.lastProcessedEventTime >= EVENT_DUPLICATION_CACHE_DURATION_MS) {
        this.cachedEventUids.clear();
      }
      return this.cachedEventUids.has(eventUid(event));
    }
    saveEventToCache(event) {
      this.cachedEventUids.add(eventUid(event));
      this.lastProcessedEventTime = Date.now();
    }
  };
  function eventUid(e2) {
    return [e2.type, e2.eventId, e2.sessionId, e2.tenantId].filter((v) => v).join("-");
  }
  function isNullRedirectEvent({ type, error }) {
    return type === "unknown" && error?.code === `auth/${"no-auth-event"}`;
  }
  function isRedirectEvent(event) {
    switch (event.type) {
      case "signInViaRedirect":
      case "linkViaRedirect":
      case "reauthViaRedirect":
        return true;
      case "unknown":
        return isNullRedirectEvent(event);
      default:
        return false;
    }
  }
  async function _getProjectConfig(auth2, request = {}) {
    return _performApiRequest(auth2, "GET", "/v1/projects", request);
  }
  var IP_ADDRESS_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  var HTTP_REGEX = /^https?/;
  async function _validateOrigin(auth2) {
    if (auth2.config.emulator) {
      return;
    }
    const { authorizedDomains } = await _getProjectConfig(auth2);
    for (const domain of authorizedDomains) {
      try {
        if (matchDomain(domain)) {
          return;
        }
      } catch {
      }
    }
    _fail(
      auth2,
      "unauthorized-domain"
      /* AuthErrorCode.INVALID_ORIGIN */
    );
  }
  function matchDomain(expected) {
    const currentUrl = _getCurrentUrl();
    const { protocol, hostname } = new URL(currentUrl);
    if (expected.startsWith("chrome-extension://")) {
      const ceUrl = new URL(expected);
      if (ceUrl.hostname === "" && hostname === "") {
        return protocol === "chrome-extension:" && expected.replace("chrome-extension://", "") === currentUrl.replace("chrome-extension://", "");
      }
      return protocol === "chrome-extension:" && ceUrl.hostname === hostname;
    }
    if (!HTTP_REGEX.test(protocol)) {
      return false;
    }
    if (IP_ADDRESS_REGEX.test(expected)) {
      return hostname === expected;
    }
    const escapedDomainPattern = expected.replace(/\./g, "\\.");
    const re = new RegExp("^(.+\\." + escapedDomainPattern + "|" + escapedDomainPattern + ")$", "i");
    return re.test(hostname);
  }
  var NETWORK_TIMEOUT = new Delay(3e4, 6e4);
  function resetUnloadedGapiModules() {
    const beacon = _window().___jsl;
    if (beacon?.H) {
      for (const hint of Object.keys(beacon.H)) {
        beacon.H[hint].r = beacon.H[hint].r || [];
        beacon.H[hint].L = beacon.H[hint].L || [];
        beacon.H[hint].r = [...beacon.H[hint].L];
        if (beacon.CP) {
          for (let i2 = 0; i2 < beacon.CP.length; i2++) {
            beacon.CP[i2] = null;
          }
        }
      }
    }
  }
  function loadGapi(auth2) {
    return new Promise((resolve, reject) => {
      function loadGapiIframe() {
        resetUnloadedGapiModules();
        gapi.load("gapi.iframes", {
          callback: () => {
            resolve(gapi.iframes.getContext());
          },
          ontimeout: () => {
            resetUnloadedGapiModules();
            reject(_createError(
              auth2,
              "network-request-failed"
              /* AuthErrorCode.NETWORK_REQUEST_FAILED */
            ));
          },
          timeout: NETWORK_TIMEOUT.get()
        });
      }
      if (_window().gapi?.iframes?.Iframe) {
        resolve(gapi.iframes.getContext());
      } else if (!!_window().gapi?.load) {
        loadGapiIframe();
      } else {
        const cbName = _generateCallbackName("iframefcb");
        _window()[cbName] = () => {
          if (!!gapi.load) {
            loadGapiIframe();
          } else {
            reject(_createError(
              auth2,
              "network-request-failed"
              /* AuthErrorCode.NETWORK_REQUEST_FAILED */
            ));
          }
        };
        return _loadJS(`${_gapiScriptUrl()}?onload=${cbName}`).catch((e2) => reject(e2));
      }
    }).catch((error) => {
      cachedGApiLoader = null;
      throw error;
    });
  }
  var cachedGApiLoader = null;
  function _loadGapi(auth2) {
    cachedGApiLoader = cachedGApiLoader || loadGapi(auth2);
    return cachedGApiLoader;
  }
  var PING_TIMEOUT = new Delay(5e3, 15e3);
  var IFRAME_PATH = "__/auth/iframe";
  var EMULATED_IFRAME_PATH = "emulator/auth/iframe";
  var IFRAME_ATTRIBUTES = {
    style: {
      position: "absolute",
      top: "-100px",
      width: "1px",
      height: "1px"
    },
    "aria-hidden": "true",
    tabindex: "-1"
  };
  var EID_FROM_APIHOST = /* @__PURE__ */ new Map([
    ["identitytoolkit.googleapis.com", "p"],
    // production
    ["staging-identitytoolkit.sandbox.googleapis.com", "s"],
    // staging
    ["test-identitytoolkit.sandbox.googleapis.com", "t"]
    // test
  ]);
  function getIframeUrl(auth2) {
    const config = auth2.config;
    _assert(
      config.authDomain,
      auth2,
      "auth-domain-config-required"
      /* AuthErrorCode.MISSING_AUTH_DOMAIN */
    );
    const url = config.emulator ? _emulatorUrl(config, EMULATED_IFRAME_PATH) : `https://${auth2.config.authDomain}/${IFRAME_PATH}`;
    const params = {
      apiKey: config.apiKey,
      appName: auth2.name,
      v: SDK_VERSION
    };
    const eid = EID_FROM_APIHOST.get(auth2.config.apiHost);
    if (eid) {
      params.eid = eid;
    }
    const frameworks = auth2._getFrameworks();
    if (frameworks.length) {
      params.fw = frameworks.join(",");
    }
    return `${url}?${querystring(params).slice(1)}`;
  }
  async function _openIframe(auth2) {
    const context = await _loadGapi(auth2);
    const gapi2 = _window().gapi;
    _assert(
      gapi2,
      auth2,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return context.open({
      where: document.body,
      url: getIframeUrl(auth2),
      messageHandlersFilter: gapi2.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
      attributes: IFRAME_ATTRIBUTES,
      dontclear: true
    }, (iframe) => new Promise(async (resolve, reject) => {
      await iframe.restyle({
        // Prevent iframe from closing on mouse out.
        setHideOnLeave: false
      });
      const networkError = _createError(
        auth2,
        "network-request-failed"
        /* AuthErrorCode.NETWORK_REQUEST_FAILED */
      );
      const networkErrorTimer = _window().setTimeout(() => {
        reject(networkError);
      }, PING_TIMEOUT.get());
      function clearTimerAndResolve() {
        _window().clearTimeout(networkErrorTimer);
        resolve(iframe);
      }
      iframe.ping(clearTimerAndResolve).then(clearTimerAndResolve, () => {
        reject(networkError);
      });
    }));
  }
  var BASE_POPUP_OPTIONS = {
    location: "yes",
    resizable: "yes",
    statusbar: "yes",
    toolbar: "no"
  };
  var DEFAULT_WIDTH = 500;
  var DEFAULT_HEIGHT = 600;
  var TARGET_BLANK = "_blank";
  var FIREFOX_EMPTY_URL = "http://localhost";
  var AuthPopup = class {
    constructor(window2) {
      this.window = window2;
      this.associatedEvent = null;
    }
    close() {
      if (this.window) {
        try {
          this.window.close();
        } catch (e2) {
        }
      }
    }
  };
  function _open(auth2, url, name7, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
    const top = Math.max((window.screen.availHeight - height) / 2, 0).toString();
    const left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
    let target = "";
    const options = {
      ...BASE_POPUP_OPTIONS,
      width: width.toString(),
      height: height.toString(),
      top,
      left
    };
    const ua = getUA().toLowerCase();
    if (name7) {
      target = _isChromeIOS(ua) ? TARGET_BLANK : name7;
    }
    if (_isFirefox(ua)) {
      url = url || FIREFOX_EMPTY_URL;
      options.scrollbars = "yes";
    }
    const optionsString = Object.entries(options).reduce((accum, [key, value]) => `${accum}${key}=${value},`, "");
    if (_isIOSStandalone(ua) && target !== "_self") {
      openAsNewWindowIOS(url || "", target);
      return new AuthPopup(null);
    }
    const newWin = window.open(url || "", target, optionsString);
    _assert(
      newWin,
      auth2,
      "popup-blocked"
      /* AuthErrorCode.POPUP_BLOCKED */
    );
    try {
      newWin.focus();
    } catch (e2) {
    }
    return new AuthPopup(newWin);
  }
  function openAsNewWindowIOS(url, target) {
    const el = document.createElement("a");
    el.href = url;
    el.target = target;
    const click = document.createEvent("MouseEvent");
    click.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 1, null);
    el.dispatchEvent(click);
  }
  var WIDGET_PATH = "__/auth/handler";
  var EMULATOR_WIDGET_PATH = "emulator/auth/handler";
  var FIREBASE_APP_CHECK_FRAGMENT_ID = encodeURIComponent("fac");
  async function _getRedirectUrl(auth2, provider, authType, redirectUrl, eventId, additionalParams) {
    _assert(
      auth2.config.authDomain,
      auth2,
      "auth-domain-config-required"
      /* AuthErrorCode.MISSING_AUTH_DOMAIN */
    );
    _assert(
      auth2.config.apiKey,
      auth2,
      "invalid-api-key"
      /* AuthErrorCode.INVALID_API_KEY */
    );
    const params = {
      apiKey: auth2.config.apiKey,
      appName: auth2.name,
      authType,
      redirectUrl,
      v: SDK_VERSION,
      eventId
    };
    if (provider instanceof FederatedAuthProvider) {
      provider.setDefaultLanguage(auth2.languageCode);
      params.providerId = provider.providerId || "";
      if (!isEmpty(provider.getCustomParameters())) {
        params.customParameters = JSON.stringify(provider.getCustomParameters());
      }
      for (const [key, value] of Object.entries(additionalParams || {})) {
        params[key] = value;
      }
    }
    if (provider instanceof BaseOAuthProvider) {
      const scopes = provider.getScopes().filter((scope) => scope !== "");
      if (scopes.length > 0) {
        params.scopes = scopes.join(",");
      }
    }
    if (auth2.tenantId) {
      params.tid = auth2.tenantId;
    }
    const paramsDict = params;
    for (const key of Object.keys(paramsDict)) {
      if (paramsDict[key] === void 0) {
        delete paramsDict[key];
      }
    }
    const appCheckToken = await auth2._getAppCheckToken();
    const appCheckTokenFragment = appCheckToken ? `#${FIREBASE_APP_CHECK_FRAGMENT_ID}=${encodeURIComponent(appCheckToken)}` : "";
    return `${getHandlerBase(auth2)}?${querystring(paramsDict).slice(1)}${appCheckTokenFragment}`;
  }
  function getHandlerBase({ config }) {
    if (!config.emulator) {
      return `https://${config.authDomain}/${WIDGET_PATH}`;
    }
    return _emulatorUrl(config, EMULATOR_WIDGET_PATH);
  }
  var WEB_STORAGE_SUPPORT_KEY = "webStorageSupport";
  var BrowserPopupRedirectResolver = class {
    constructor() {
      this.eventManagers = {};
      this.iframes = {};
      this.originValidationPromises = {};
      this._redirectPersistence = browserSessionPersistence;
      this._completeRedirectFn = _getRedirectResult;
      this._overrideRedirectResult = _overrideRedirectResult;
    }
    // Wrapping in async even though we don't await anywhere in order
    // to make sure errors are raised as promise rejections
    async _openPopup(auth2, provider, authType, eventId) {
      debugAssert(this.eventManagers[auth2._key()]?.manager, "_initialize() not called before _openPopup()");
      const url = await _getRedirectUrl(auth2, provider, authType, _getCurrentUrl(), eventId);
      return _open(auth2, url, _generateEventId());
    }
    async _openRedirect(auth2, provider, authType, eventId) {
      await this._originValidation(auth2);
      const url = await _getRedirectUrl(auth2, provider, authType, _getCurrentUrl(), eventId);
      _setWindowLocation(url);
      return new Promise(() => {
      });
    }
    _initialize(auth2) {
      const key = auth2._key();
      if (this.eventManagers[key]) {
        const { manager, promise: promise2 } = this.eventManagers[key];
        if (manager) {
          return Promise.resolve(manager);
        } else {
          debugAssert(promise2, "If manager is not set, promise should be");
          return promise2;
        }
      }
      const promise = this.initAndGetManager(auth2);
      this.eventManagers[key] = { promise };
      promise.catch(() => {
        delete this.eventManagers[key];
      });
      return promise;
    }
    async initAndGetManager(auth2) {
      const iframe = await _openIframe(auth2);
      const manager = new AuthEventManager(auth2);
      iframe.register("authEvent", (iframeEvent) => {
        _assert(
          iframeEvent?.authEvent,
          auth2,
          "invalid-auth-event"
          /* AuthErrorCode.INVALID_AUTH_EVENT */
        );
        const handled = manager.onEvent(iframeEvent.authEvent);
        return {
          status: handled ? "ACK" : "ERROR"
          /* GapiOutcome.ERROR */
        };
      }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
      this.eventManagers[auth2._key()] = { manager };
      this.iframes[auth2._key()] = iframe;
      return manager;
    }
    _isIframeWebStorageSupported(auth2, cb) {
      const iframe = this.iframes[auth2._key()];
      iframe.send(WEB_STORAGE_SUPPORT_KEY, { type: WEB_STORAGE_SUPPORT_KEY }, (result) => {
        const isSupported2 = result?.[0]?.[WEB_STORAGE_SUPPORT_KEY];
        if (isSupported2 !== void 0) {
          cb(!!isSupported2);
        }
        _fail(
          auth2,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
      }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
    }
    _originValidation(auth2) {
      const key = auth2._key();
      if (!this.originValidationPromises[key]) {
        this.originValidationPromises[key] = _validateOrigin(auth2);
      }
      return this.originValidationPromises[key];
    }
    get _shouldInitProactively() {
      return _isMobileBrowser() || _isSafari() || _isIOS();
    }
  };
  var browserPopupRedirectResolver = BrowserPopupRedirectResolver;
  var MultiFactorAssertionImpl = class {
    constructor(factorId) {
      this.factorId = factorId;
    }
    _process(auth2, session, displayName) {
      switch (session.type) {
        case "enroll":
          return this._finalizeEnroll(auth2, session.credential, displayName);
        case "signin":
          return this._finalizeSignIn(auth2, session.credential);
        default:
          return debugFail("unexpected MultiFactorSessionType");
      }
    }
  };
  var PhoneMultiFactorAssertionImpl = class _PhoneMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
    constructor(credential) {
      super(
        "phone"
        /* FactorId.PHONE */
      );
      this.credential = credential;
    }
    /** @internal */
    static _fromCredential(credential) {
      return new _PhoneMultiFactorAssertionImpl(credential);
    }
    /** @internal */
    _finalizeEnroll(auth2, idToken, displayName) {
      return finalizeEnrollPhoneMfa(auth2, {
        idToken,
        displayName,
        phoneVerificationInfo: this.credential._makeVerificationRequest()
      });
    }
    /** @internal */
    _finalizeSignIn(auth2, mfaPendingCredential) {
      return finalizeSignInPhoneMfa(auth2, {
        mfaPendingCredential,
        phoneVerificationInfo: this.credential._makeVerificationRequest()
      });
    }
  };
  var PhoneMultiFactorGenerator = class {
    constructor() {
    }
    /**
     * Provides a {@link PhoneMultiFactorAssertion} to confirm ownership of the phone second factor.
     *
     * @remarks
     * This method does not work in a Node.js environment.
     *
     * @param phoneAuthCredential - A credential provided by {@link PhoneAuthProvider.credential}.
     * @returns A {@link PhoneMultiFactorAssertion} which can be used with
     * {@link MultiFactorResolver.resolveSignIn}
     */
    static assertion(credential) {
      return PhoneMultiFactorAssertionImpl._fromCredential(credential);
    }
  };
  PhoneMultiFactorGenerator.FACTOR_ID = "phone";
  var TotpMultiFactorGenerator = class {
    /**
     * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of
     * the TOTP (time-based one-time password) second factor.
     * This assertion is used to complete enrollment in TOTP second factor.
     *
     * @param secret A {@link TotpSecret} containing the shared secret key and other TOTP parameters.
     * @param oneTimePassword One-time password from TOTP App.
     * @returns A {@link TotpMultiFactorAssertion} which can be used with
     * {@link MultiFactorUser.enroll}.
     */
    static assertionForEnrollment(secret, oneTimePassword) {
      return TotpMultiFactorAssertionImpl._fromSecret(secret, oneTimePassword);
    }
    /**
     * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of the TOTP second factor.
     * This assertion is used to complete signIn with TOTP as the second factor.
     *
     * @param enrollmentId identifies the enrolled TOTP second factor.
     * @param oneTimePassword One-time password from TOTP App.
     * @returns A {@link TotpMultiFactorAssertion} which can be used with
     * {@link MultiFactorResolver.resolveSignIn}.
     */
    static assertionForSignIn(enrollmentId, oneTimePassword) {
      return TotpMultiFactorAssertionImpl._fromEnrollmentId(enrollmentId, oneTimePassword);
    }
    /**
     * Returns a promise to {@link TotpSecret} which contains the TOTP shared secret key and other parameters.
     * Creates a TOTP secret as part of enrolling a TOTP second factor.
     * Used for generating a QR code URL or inputting into a TOTP app.
     * This method uses the auth instance corresponding to the user in the multiFactorSession.
     *
     * @param session The {@link MultiFactorSession} that the user is part of.
     * @returns A promise to {@link TotpSecret}.
     */
    static async generateSecret(session) {
      const mfaSession = session;
      _assert(
        typeof mfaSession.user?.auth !== "undefined",
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const response = await startEnrollTotpMfa(mfaSession.user.auth, {
        idToken: mfaSession.credential,
        totpEnrollmentInfo: {}
      });
      return TotpSecret._fromStartTotpMfaEnrollmentResponse(response, mfaSession.user.auth);
    }
  };
  TotpMultiFactorGenerator.FACTOR_ID = "totp";
  var TotpMultiFactorAssertionImpl = class _TotpMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
    constructor(otp, enrollmentId, secret) {
      super(
        "totp"
        /* FactorId.TOTP */
      );
      this.otp = otp;
      this.enrollmentId = enrollmentId;
      this.secret = secret;
    }
    /** @internal */
    static _fromSecret(secret, otp) {
      return new _TotpMultiFactorAssertionImpl(otp, void 0, secret);
    }
    /** @internal */
    static _fromEnrollmentId(enrollmentId, otp) {
      return new _TotpMultiFactorAssertionImpl(otp, enrollmentId);
    }
    /** @internal */
    async _finalizeEnroll(auth2, idToken, displayName) {
      _assert(
        typeof this.secret !== "undefined",
        auth2,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      return finalizeEnrollTotpMfa(auth2, {
        idToken,
        displayName,
        totpVerificationInfo: this.secret._makeTotpVerificationInfo(this.otp)
      });
    }
    /** @internal */
    async _finalizeSignIn(auth2, mfaPendingCredential) {
      _assert(
        this.enrollmentId !== void 0 && this.otp !== void 0,
        auth2,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      const totpVerificationInfo = { verificationCode: this.otp };
      return finalizeSignInTotpMfa(auth2, {
        mfaPendingCredential,
        mfaEnrollmentId: this.enrollmentId,
        totpVerificationInfo
      });
    }
  };
  var TotpSecret = class _TotpSecret {
    // The public members are declared outside the constructor so the docs can be generated.
    constructor(secretKey, hashingAlgorithm, codeLength, codeIntervalSeconds, enrollmentCompletionDeadline, sessionInfo, auth2) {
      this.sessionInfo = sessionInfo;
      this.auth = auth2;
      this.secretKey = secretKey;
      this.hashingAlgorithm = hashingAlgorithm;
      this.codeLength = codeLength;
      this.codeIntervalSeconds = codeIntervalSeconds;
      this.enrollmentCompletionDeadline = enrollmentCompletionDeadline;
    }
    /** @internal */
    static _fromStartTotpMfaEnrollmentResponse(response, auth2) {
      return new _TotpSecret(response.totpSessionInfo.sharedSecretKey, response.totpSessionInfo.hashingAlgorithm, response.totpSessionInfo.verificationCodeLength, response.totpSessionInfo.periodSec, new Date(response.totpSessionInfo.finalizeEnrollmentTime).toUTCString(), response.totpSessionInfo.sessionInfo, auth2);
    }
    /** @internal */
    _makeTotpVerificationInfo(otp) {
      return { sessionInfo: this.sessionInfo, verificationCode: otp };
    }
    /**
     * Returns a QR code URL as described in
     * https://github.com/google/google-authenticator/wiki/Key-Uri-Format
     * This can be displayed to the user as a QR code to be scanned into a TOTP app like Google Authenticator.
     * If the optional parameters are unspecified, an accountName of <userEmail> and issuer of <firebaseAppName> are used.
     *
     * @param accountName the name of the account/app along with a user identifier.
     * @param issuer issuer of the TOTP (likely the app name).
     * @returns A QR code URL string.
     */
    generateQrCodeUrl(accountName, issuer) {
      let useDefaults = false;
      if (_isEmptyString(accountName) || _isEmptyString(issuer)) {
        useDefaults = true;
      }
      if (useDefaults) {
        if (_isEmptyString(accountName)) {
          accountName = this.auth.currentUser?.email || "unknownuser";
        }
        if (_isEmptyString(issuer)) {
          issuer = this.auth.name;
        }
      }
      return `otpauth://totp/${issuer}:${accountName}?secret=${this.secretKey}&issuer=${issuer}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`;
    }
  };
  function _isEmptyString(input) {
    return typeof input === "undefined" || input?.length === 0;
  }
  var name3 = "@firebase/auth";
  var version7 = "1.12.0";
  var AuthInterop = class {
    constructor(auth2) {
      this.auth = auth2;
      this.internalListeners = /* @__PURE__ */ new Map();
    }
    getUid() {
      this.assertAuthConfigured();
      return this.auth.currentUser?.uid || null;
    }
    async getToken(forceRefresh) {
      this.assertAuthConfigured();
      await this.auth._initializationPromise;
      if (!this.auth.currentUser) {
        return null;
      }
      const accessToken = await this.auth.currentUser.getIdToken(forceRefresh);
      return { accessToken };
    }
    addAuthTokenListener(listener) {
      this.assertAuthConfigured();
      if (this.internalListeners.has(listener)) {
        return;
      }
      const unsubscribe = this.auth.onIdTokenChanged((user) => {
        listener(user?.stsTokenManager.accessToken || null);
      });
      this.internalListeners.set(listener, unsubscribe);
      this.updateProactiveRefresh();
    }
    removeAuthTokenListener(listener) {
      this.assertAuthConfigured();
      const unsubscribe = this.internalListeners.get(listener);
      if (!unsubscribe) {
        return;
      }
      this.internalListeners.delete(listener);
      unsubscribe();
      this.updateProactiveRefresh();
    }
    assertAuthConfigured() {
      _assert(
        this.auth._initializationPromise,
        "dependent-sdk-initialized-before-auth"
        /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
      );
    }
    updateProactiveRefresh() {
      if (this.internalListeners.size > 0) {
        this.auth._startProactiveRefresh();
      } else {
        this.auth._stopProactiveRefresh();
      }
    }
  };
  function getVersionForPlatform(clientPlatform) {
    switch (clientPlatform) {
      case "Node":
        return "node";
      case "ReactNative":
        return "rn";
      case "Worker":
        return "webworker";
      case "Cordova":
        return "cordova";
      case "WebExtension":
        return "web-extension";
      default:
        return void 0;
    }
  }
  function registerAuth(clientPlatform) {
    _registerComponent(new Component(
      "auth",
      (container, { options: deps }) => {
        const app2 = container.getProvider("app").getImmediate();
        const heartbeatServiceProvider = container.getProvider("heartbeat");
        const appCheckServiceProvider = container.getProvider("app-check-internal");
        const { apiKey, authDomain } = app2.options;
        _assert(apiKey && !apiKey.includes(":"), "invalid-api-key", { appName: app2.name });
        const config = {
          apiKey,
          authDomain,
          clientPlatform,
          apiHost: "identitytoolkit.googleapis.com",
          tokenApiHost: "securetoken.googleapis.com",
          apiScheme: "https",
          sdkClientVersion: _getClientVersion(clientPlatform)
        };
        const authInstance = new AuthImpl(app2, heartbeatServiceProvider, appCheckServiceProvider, config);
        _initializeAuthInstance(authInstance, deps);
        return authInstance;
      },
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ).setInstantiationMode(
      "EXPLICIT"
      /* InstantiationMode.EXPLICIT */
    ).setInstanceCreatedCallback((container, _instanceIdentifier, _instance) => {
      const authInternalProvider = container.getProvider(
        "auth-internal"
        /* _ComponentName.AUTH_INTERNAL */
      );
      authInternalProvider.initialize();
    }));
    _registerComponent(new Component(
      "auth-internal",
      (container) => {
        const auth2 = _castAuth(container.getProvider(
          "auth"
          /* _ComponentName.AUTH */
        ).getImmediate());
        return ((auth3) => new AuthInterop(auth3))(auth2);
      },
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ).setInstantiationMode(
      "EXPLICIT"
      /* InstantiationMode.EXPLICIT */
    ));
    registerVersion(name3, version7, getVersionForPlatform(clientPlatform));
    registerVersion(name3, version7, "esm2020");
  }
  var DEFAULT_ID_TOKEN_MAX_AGE = 5 * 60;
  var authIdTokenMaxAge = getExperimentalSetting("authIdTokenMaxAge") || DEFAULT_ID_TOKEN_MAX_AGE;
  var lastPostedIdToken = null;
  var mintCookieFactory = (url) => async (user) => {
    const idTokenResult = user && await user.getIdTokenResult();
    const idTokenAge = idTokenResult && ((/* @__PURE__ */ new Date()).getTime() - Date.parse(idTokenResult.issuedAtTime)) / 1e3;
    if (idTokenAge && idTokenAge > authIdTokenMaxAge) {
      return;
    }
    const idToken = idTokenResult?.token;
    if (lastPostedIdToken === idToken) {
      return;
    }
    lastPostedIdToken = idToken;
    await fetch(url, {
      method: idToken ? "POST" : "DELETE",
      headers: idToken ? {
        "Authorization": `Bearer ${idToken}`
      } : {}
    });
  };
  function getAuth(app2 = getApp()) {
    const provider = _getProvider(app2, "auth");
    if (provider.isInitialized()) {
      return provider.getImmediate();
    }
    const auth2 = initializeAuth(app2, {
      popupRedirectResolver: browserPopupRedirectResolver,
      persistence: [
        indexedDBLocalPersistence,
        browserLocalPersistence,
        browserSessionPersistence
      ]
    });
    const authTokenSyncPath = getExperimentalSetting("authTokenSyncURL");
    if (authTokenSyncPath && typeof isSecureContext === "boolean" && isSecureContext) {
      const authTokenSyncUrl = new URL(authTokenSyncPath, location.origin);
      if (location.origin === authTokenSyncUrl.origin) {
        const mintCookie = mintCookieFactory(authTokenSyncUrl.toString());
        beforeAuthStateChanged(auth2, mintCookie, () => mintCookie(auth2.currentUser));
        onIdTokenChanged(auth2, (user) => mintCookie(user));
      }
    }
    const authEmulatorHost = getDefaultEmulatorHost("auth");
    if (authEmulatorHost) {
      connectAuthEmulator(auth2, `http://${authEmulatorHost}`);
    }
    return auth2;
  }
  function getScriptParentElement() {
    return document.getElementsByTagName("head")?.[0] ?? document;
  }
  _setExternalJSProvider({
    loadJS(url) {
      return new Promise((resolve, reject) => {
        const el = document.createElement("script");
        el.setAttribute("src", url);
        el.onload = resolve;
        el.onerror = (e2) => {
          const error = _createError(
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          error.customData = e2;
          reject(error);
        };
        el.type = "text/javascript";
        el.charset = "UTF-8";
        getScriptParentElement().appendChild(el);
      });
    },
    gapiScript: "https://apis.google.com/js/api.js",
    recaptchaV2Script: "https://www.google.com/recaptcha/api.js",
    recaptchaEnterpriseScript: "https://www.google.com/recaptcha/enterprise.js?render="
  });
  registerAuth(
    "Browser"
    /* ClientPlatform.BROWSER */
  );

  // node_modules/@firebase/installations/dist/esm/index.esm.js
  var name4 = "@firebase/installations";
  var version8 = "0.6.19";
  var PENDING_TIMEOUT_MS = 1e4;
  var PACKAGE_VERSION = `w:${version8}`;
  var INTERNAL_AUTH_VERSION = "FIS_v2";
  var INSTALLATIONS_API_URL = "https://firebaseinstallations.googleapis.com/v1";
  var TOKEN_EXPIRATION_BUFFER = 60 * 60 * 1e3;
  var SERVICE = "installations";
  var SERVICE_NAME = "Installations";
  var ERROR_DESCRIPTION_MAP = {
    [
      "missing-app-config-values"
      /* ErrorCode.MISSING_APP_CONFIG_VALUES */
    ]: 'Missing App configuration value: "{$valueName}"',
    [
      "not-registered"
      /* ErrorCode.NOT_REGISTERED */
    ]: "Firebase Installation is not registered.",
    [
      "installation-not-found"
      /* ErrorCode.INSTALLATION_NOT_FOUND */
    ]: "Firebase Installation not found.",
    [
      "request-failed"
      /* ErrorCode.REQUEST_FAILED */
    ]: '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
    [
      "app-offline"
      /* ErrorCode.APP_OFFLINE */
    ]: "Could not process request. Application offline.",
    [
      "delete-pending-registration"
      /* ErrorCode.DELETE_PENDING_REGISTRATION */
    ]: "Can't delete installation while there is a pending registration request."
  };
  var ERROR_FACTORY2 = new ErrorFactory(SERVICE, SERVICE_NAME, ERROR_DESCRIPTION_MAP);
  function isServerError(error) {
    return error instanceof FirebaseError && error.code.includes(
      "request-failed"
      /* ErrorCode.REQUEST_FAILED */
    );
  }
  function getInstallationsEndpoint({ projectId }) {
    return `${INSTALLATIONS_API_URL}/projects/${projectId}/installations`;
  }
  function extractAuthTokenInfoFromResponse(response) {
    return {
      token: response.token,
      requestStatus: 2,
      expiresIn: getExpiresInFromResponseExpiresIn(response.expiresIn),
      creationTime: Date.now()
    };
  }
  async function getErrorFromResponse(requestName, response) {
    const responseJson = await response.json();
    const errorData = responseJson.error;
    return ERROR_FACTORY2.create("request-failed", {
      requestName,
      serverCode: errorData.code,
      serverMessage: errorData.message,
      serverStatus: errorData.status
    });
  }
  function getHeaders({ apiKey }) {
    return new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-goog-api-key": apiKey
    });
  }
  function getHeadersWithAuth(appConfig, { refreshToken }) {
    const headers = getHeaders(appConfig);
    headers.append("Authorization", getAuthorizationHeader(refreshToken));
    return headers;
  }
  async function retryIfServerError(fn) {
    const result = await fn();
    if (result.status >= 500 && result.status < 600) {
      return fn();
    }
    return result;
  }
  function getExpiresInFromResponseExpiresIn(responseExpiresIn) {
    return Number(responseExpiresIn.replace("s", "000"));
  }
  function getAuthorizationHeader(refreshToken) {
    return `${INTERNAL_AUTH_VERSION} ${refreshToken}`;
  }
  async function createInstallationRequest({ appConfig, heartbeatServiceProvider }, { fid }) {
    const endpoint = getInstallationsEndpoint(appConfig);
    const headers = getHeaders(appConfig);
    const heartbeatService = heartbeatServiceProvider.getImmediate({
      optional: true
    });
    if (heartbeatService) {
      const heartbeatsHeader = await heartbeatService.getHeartbeatsHeader();
      if (heartbeatsHeader) {
        headers.append("x-firebase-client", heartbeatsHeader);
      }
    }
    const body = {
      fid,
      authVersion: INTERNAL_AUTH_VERSION,
      appId: appConfig.appId,
      sdkVersion: PACKAGE_VERSION
    };
    const request = {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    };
    const response = await retryIfServerError(() => fetch(endpoint, request));
    if (response.ok) {
      const responseValue = await response.json();
      const registeredInstallationEntry = {
        fid: responseValue.fid || fid,
        registrationStatus: 2,
        refreshToken: responseValue.refreshToken,
        authToken: extractAuthTokenInfoFromResponse(responseValue.authToken)
      };
      return registeredInstallationEntry;
    } else {
      throw await getErrorFromResponse("Create Installation", response);
    }
  }
  function sleep2(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  function bufferToBase64UrlSafe(array) {
    const b64 = btoa(String.fromCharCode(...array));
    return b64.replace(/\+/g, "-").replace(/\//g, "_");
  }
  var VALID_FID_PATTERN = /^[cdef][\w-]{21}$/;
  var INVALID_FID = "";
  function generateFid() {
    try {
      const fidByteArray = new Uint8Array(17);
      const crypto2 = self.crypto || self.msCrypto;
      crypto2.getRandomValues(fidByteArray);
      fidByteArray[0] = 112 + fidByteArray[0] % 16;
      const fid = encode(fidByteArray);
      return VALID_FID_PATTERN.test(fid) ? fid : INVALID_FID;
    } catch {
      return INVALID_FID;
    }
  }
  function encode(fidByteArray) {
    const b64String = bufferToBase64UrlSafe(fidByteArray);
    return b64String.substr(0, 22);
  }
  function getKey(appConfig) {
    return `${appConfig.appName}!${appConfig.appId}`;
  }
  var fidChangeCallbacks = /* @__PURE__ */ new Map();
  function fidChanged(appConfig, fid) {
    const key = getKey(appConfig);
    callFidChangeCallbacks(key, fid);
    broadcastFidChange(key, fid);
  }
  function callFidChangeCallbacks(key, fid) {
    const callbacks = fidChangeCallbacks.get(key);
    if (!callbacks) {
      return;
    }
    for (const callback of callbacks) {
      callback(fid);
    }
  }
  function broadcastFidChange(key, fid) {
    const channel = getBroadcastChannel();
    if (channel) {
      channel.postMessage({ key, fid });
    }
    closeBroadcastChannel();
  }
  var broadcastChannel = null;
  function getBroadcastChannel() {
    if (!broadcastChannel && "BroadcastChannel" in self) {
      broadcastChannel = new BroadcastChannel("[Firebase] FID Change");
      broadcastChannel.onmessage = (e2) => {
        callFidChangeCallbacks(e2.data.key, e2.data.fid);
      };
    }
    return broadcastChannel;
  }
  function closeBroadcastChannel() {
    if (fidChangeCallbacks.size === 0 && broadcastChannel) {
      broadcastChannel.close();
      broadcastChannel = null;
    }
  }
  var DATABASE_NAME = "firebase-installations-database";
  var DATABASE_VERSION = 1;
  var OBJECT_STORE_NAME = "firebase-installations-store";
  var dbPromise2 = null;
  function getDbPromise2() {
    if (!dbPromise2) {
      dbPromise2 = openDB(DATABASE_NAME, DATABASE_VERSION, {
        upgrade: (db, oldVersion) => {
          switch (oldVersion) {
            case 0:
              db.createObjectStore(OBJECT_STORE_NAME);
          }
        }
      });
    }
    return dbPromise2;
  }
  async function set(appConfig, value) {
    const key = getKey(appConfig);
    const db = await getDbPromise2();
    const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
    const objectStore = tx.objectStore(OBJECT_STORE_NAME);
    const oldValue = await objectStore.get(key);
    await objectStore.put(value, key);
    await tx.done;
    if (!oldValue || oldValue.fid !== value.fid) {
      fidChanged(appConfig, value.fid);
    }
    return value;
  }
  async function remove2(appConfig) {
    const key = getKey(appConfig);
    const db = await getDbPromise2();
    const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
    await tx.objectStore(OBJECT_STORE_NAME).delete(key);
    await tx.done;
  }
  async function update(appConfig, updateFn) {
    const key = getKey(appConfig);
    const db = await getDbPromise2();
    const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
    const store = tx.objectStore(OBJECT_STORE_NAME);
    const oldValue = await store.get(key);
    const newValue = updateFn(oldValue);
    if (newValue === void 0) {
      await store.delete(key);
    } else {
      await store.put(newValue, key);
    }
    await tx.done;
    if (newValue && (!oldValue || oldValue.fid !== newValue.fid)) {
      fidChanged(appConfig, newValue.fid);
    }
    return newValue;
  }
  async function getInstallationEntry(installations) {
    let registrationPromise;
    const installationEntry = await update(installations.appConfig, (oldEntry) => {
      const installationEntry2 = updateOrCreateInstallationEntry(oldEntry);
      const entryWithPromise = triggerRegistrationIfNecessary(installations, installationEntry2);
      registrationPromise = entryWithPromise.registrationPromise;
      return entryWithPromise.installationEntry;
    });
    if (installationEntry.fid === INVALID_FID) {
      return { installationEntry: await registrationPromise };
    }
    return {
      installationEntry,
      registrationPromise
    };
  }
  function updateOrCreateInstallationEntry(oldEntry) {
    const entry = oldEntry || {
      fid: generateFid(),
      registrationStatus: 0
      /* RequestStatus.NOT_STARTED */
    };
    return clearTimedOutRequest(entry);
  }
  function triggerRegistrationIfNecessary(installations, installationEntry) {
    if (installationEntry.registrationStatus === 0) {
      if (!navigator.onLine) {
        const registrationPromiseWithError = Promise.reject(ERROR_FACTORY2.create(
          "app-offline"
          /* ErrorCode.APP_OFFLINE */
        ));
        return {
          installationEntry,
          registrationPromise: registrationPromiseWithError
        };
      }
      const inProgressEntry = {
        fid: installationEntry.fid,
        registrationStatus: 1,
        registrationTime: Date.now()
      };
      const registrationPromise = registerInstallation(installations, inProgressEntry);
      return { installationEntry: inProgressEntry, registrationPromise };
    } else if (installationEntry.registrationStatus === 1) {
      return {
        installationEntry,
        registrationPromise: waitUntilFidRegistration(installations)
      };
    } else {
      return { installationEntry };
    }
  }
  async function registerInstallation(installations, installationEntry) {
    try {
      const registeredInstallationEntry = await createInstallationRequest(installations, installationEntry);
      return set(installations.appConfig, registeredInstallationEntry);
    } catch (e2) {
      if (isServerError(e2) && e2.customData.serverCode === 409) {
        await remove2(installations.appConfig);
      } else {
        await set(installations.appConfig, {
          fid: installationEntry.fid,
          registrationStatus: 0
          /* RequestStatus.NOT_STARTED */
        });
      }
      throw e2;
    }
  }
  async function waitUntilFidRegistration(installations) {
    let entry = await updateInstallationRequest(installations.appConfig);
    while (entry.registrationStatus === 1) {
      await sleep2(100);
      entry = await updateInstallationRequest(installations.appConfig);
    }
    if (entry.registrationStatus === 0) {
      const { installationEntry, registrationPromise } = await getInstallationEntry(installations);
      if (registrationPromise) {
        return registrationPromise;
      } else {
        return installationEntry;
      }
    }
    return entry;
  }
  function updateInstallationRequest(appConfig) {
    return update(appConfig, (oldEntry) => {
      if (!oldEntry) {
        throw ERROR_FACTORY2.create(
          "installation-not-found"
          /* ErrorCode.INSTALLATION_NOT_FOUND */
        );
      }
      return clearTimedOutRequest(oldEntry);
    });
  }
  function clearTimedOutRequest(entry) {
    if (hasInstallationRequestTimedOut(entry)) {
      return {
        fid: entry.fid,
        registrationStatus: 0
        /* RequestStatus.NOT_STARTED */
      };
    }
    return entry;
  }
  function hasInstallationRequestTimedOut(installationEntry) {
    return installationEntry.registrationStatus === 1 && installationEntry.registrationTime + PENDING_TIMEOUT_MS < Date.now();
  }
  async function generateAuthTokenRequest({ appConfig, heartbeatServiceProvider }, installationEntry) {
    const endpoint = getGenerateAuthTokenEndpoint(appConfig, installationEntry);
    const headers = getHeadersWithAuth(appConfig, installationEntry);
    const heartbeatService = heartbeatServiceProvider.getImmediate({
      optional: true
    });
    if (heartbeatService) {
      const heartbeatsHeader = await heartbeatService.getHeartbeatsHeader();
      if (heartbeatsHeader) {
        headers.append("x-firebase-client", heartbeatsHeader);
      }
    }
    const body = {
      installation: {
        sdkVersion: PACKAGE_VERSION,
        appId: appConfig.appId
      }
    };
    const request = {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    };
    const response = await retryIfServerError(() => fetch(endpoint, request));
    if (response.ok) {
      const responseValue = await response.json();
      const completedAuthToken = extractAuthTokenInfoFromResponse(responseValue);
      return completedAuthToken;
    } else {
      throw await getErrorFromResponse("Generate Auth Token", response);
    }
  }
  function getGenerateAuthTokenEndpoint(appConfig, { fid }) {
    return `${getInstallationsEndpoint(appConfig)}/${fid}/authTokens:generate`;
  }
  async function refreshAuthToken(installations, forceRefresh = false) {
    let tokenPromise;
    const entry = await update(installations.appConfig, (oldEntry) => {
      if (!isEntryRegistered(oldEntry)) {
        throw ERROR_FACTORY2.create(
          "not-registered"
          /* ErrorCode.NOT_REGISTERED */
        );
      }
      const oldAuthToken = oldEntry.authToken;
      if (!forceRefresh && isAuthTokenValid(oldAuthToken)) {
        return oldEntry;
      } else if (oldAuthToken.requestStatus === 1) {
        tokenPromise = waitUntilAuthTokenRequest(installations, forceRefresh);
        return oldEntry;
      } else {
        if (!navigator.onLine) {
          throw ERROR_FACTORY2.create(
            "app-offline"
            /* ErrorCode.APP_OFFLINE */
          );
        }
        const inProgressEntry = makeAuthTokenRequestInProgressEntry(oldEntry);
        tokenPromise = fetchAuthTokenFromServer(installations, inProgressEntry);
        return inProgressEntry;
      }
    });
    const authToken = tokenPromise ? await tokenPromise : entry.authToken;
    return authToken;
  }
  async function waitUntilAuthTokenRequest(installations, forceRefresh) {
    let entry = await updateAuthTokenRequest(installations.appConfig);
    while (entry.authToken.requestStatus === 1) {
      await sleep2(100);
      entry = await updateAuthTokenRequest(installations.appConfig);
    }
    const authToken = entry.authToken;
    if (authToken.requestStatus === 0) {
      return refreshAuthToken(installations, forceRefresh);
    } else {
      return authToken;
    }
  }
  function updateAuthTokenRequest(appConfig) {
    return update(appConfig, (oldEntry) => {
      if (!isEntryRegistered(oldEntry)) {
        throw ERROR_FACTORY2.create(
          "not-registered"
          /* ErrorCode.NOT_REGISTERED */
        );
      }
      const oldAuthToken = oldEntry.authToken;
      if (hasAuthTokenRequestTimedOut(oldAuthToken)) {
        return {
          ...oldEntry,
          authToken: {
            requestStatus: 0
            /* RequestStatus.NOT_STARTED */
          }
        };
      }
      return oldEntry;
    });
  }
  async function fetchAuthTokenFromServer(installations, installationEntry) {
    try {
      const authToken = await generateAuthTokenRequest(installations, installationEntry);
      const updatedInstallationEntry = {
        ...installationEntry,
        authToken
      };
      await set(installations.appConfig, updatedInstallationEntry);
      return authToken;
    } catch (e2) {
      if (isServerError(e2) && (e2.customData.serverCode === 401 || e2.customData.serverCode === 404)) {
        await remove2(installations.appConfig);
      } else {
        const updatedInstallationEntry = {
          ...installationEntry,
          authToken: {
            requestStatus: 0
            /* RequestStatus.NOT_STARTED */
          }
        };
        await set(installations.appConfig, updatedInstallationEntry);
      }
      throw e2;
    }
  }
  function isEntryRegistered(installationEntry) {
    return installationEntry !== void 0 && installationEntry.registrationStatus === 2;
  }
  function isAuthTokenValid(authToken) {
    return authToken.requestStatus === 2 && !isAuthTokenExpired(authToken);
  }
  function isAuthTokenExpired(authToken) {
    const now = Date.now();
    return now < authToken.creationTime || authToken.creationTime + authToken.expiresIn < now + TOKEN_EXPIRATION_BUFFER;
  }
  function makeAuthTokenRequestInProgressEntry(oldEntry) {
    const inProgressAuthToken = {
      requestStatus: 1,
      requestTime: Date.now()
    };
    return {
      ...oldEntry,
      authToken: inProgressAuthToken
    };
  }
  function hasAuthTokenRequestTimedOut(authToken) {
    return authToken.requestStatus === 1 && authToken.requestTime + PENDING_TIMEOUT_MS < Date.now();
  }
  async function getId(installations) {
    const installationsImpl = installations;
    const { installationEntry, registrationPromise } = await getInstallationEntry(installationsImpl);
    if (registrationPromise) {
      registrationPromise.catch(console.error);
    } else {
      refreshAuthToken(installationsImpl).catch(console.error);
    }
    return installationEntry.fid;
  }
  async function getToken(installations, forceRefresh = false) {
    const installationsImpl = installations;
    await completeInstallationRegistration(installationsImpl);
    const authToken = await refreshAuthToken(installationsImpl, forceRefresh);
    return authToken.token;
  }
  async function completeInstallationRegistration(installations) {
    const { registrationPromise } = await getInstallationEntry(installations);
    if (registrationPromise) {
      await registrationPromise;
    }
  }
  function extractAppConfig(app2) {
    if (!app2 || !app2.options) {
      throw getMissingValueError("App Configuration");
    }
    if (!app2.name) {
      throw getMissingValueError("App Name");
    }
    const configKeys = [
      "projectId",
      "apiKey",
      "appId"
    ];
    for (const keyName of configKeys) {
      if (!app2.options[keyName]) {
        throw getMissingValueError(keyName);
      }
    }
    return {
      appName: app2.name,
      projectId: app2.options.projectId,
      apiKey: app2.options.apiKey,
      appId: app2.options.appId
    };
  }
  function getMissingValueError(valueName) {
    return ERROR_FACTORY2.create("missing-app-config-values", {
      valueName
    });
  }
  var INSTALLATIONS_NAME = "installations";
  var INSTALLATIONS_NAME_INTERNAL = "installations-internal";
  var publicFactory = (container) => {
    const app2 = container.getProvider("app").getImmediate();
    const appConfig = extractAppConfig(app2);
    const heartbeatServiceProvider = _getProvider(app2, "heartbeat");
    const installationsImpl = {
      app: app2,
      appConfig,
      heartbeatServiceProvider,
      _delete: () => Promise.resolve()
    };
    return installationsImpl;
  };
  var internalFactory = (container) => {
    const app2 = container.getProvider("app").getImmediate();
    const installations = _getProvider(app2, INSTALLATIONS_NAME).getImmediate();
    const installationsInternal = {
      getId: () => getId(installations),
      getToken: (forceRefresh) => getToken(installations, forceRefresh)
    };
    return installationsInternal;
  };
  function registerInstallations() {
    _registerComponent(new Component(
      INSTALLATIONS_NAME,
      publicFactory,
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ));
    _registerComponent(new Component(
      INSTALLATIONS_NAME_INTERNAL,
      internalFactory,
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
  }
  registerInstallations();
  registerVersion(name4, version8);
  registerVersion(name4, version8, "esm2020");

  // node_modules/@firebase/analytics/dist/esm/index.esm.js
  var ANALYTICS_TYPE = "analytics";
  var GA_FID_KEY = "firebase_id";
  var ORIGIN_KEY = "origin";
  var FETCH_TIMEOUT_MILLIS = 60 * 1e3;
  var DYNAMIC_CONFIG_URL = "https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig";
  var GTAG_URL = "https://www.googletagmanager.com/gtag/js";
  var logger2 = new Logger("@firebase/analytics");
  var ERRORS2 = {
    [
      "already-exists"
      /* AnalyticsError.ALREADY_EXISTS */
    ]: "A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.",
    [
      "already-initialized"
      /* AnalyticsError.ALREADY_INITIALIZED */
    ]: "initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.",
    [
      "already-initialized-settings"
      /* AnalyticsError.ALREADY_INITIALIZED_SETTINGS */
    ]: "Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.",
    [
      "interop-component-reg-failed"
      /* AnalyticsError.INTEROP_COMPONENT_REG_FAILED */
    ]: "Firebase Analytics Interop Component failed to instantiate: {$reason}",
    [
      "invalid-analytics-context"
      /* AnalyticsError.INVALID_ANALYTICS_CONTEXT */
    ]: "Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",
    [
      "indexeddb-unavailable"
      /* AnalyticsError.INDEXEDDB_UNAVAILABLE */
    ]: "IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",
    [
      "fetch-throttle"
      /* AnalyticsError.FETCH_THROTTLE */
    ]: "The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.",
    [
      "config-fetch-failed"
      /* AnalyticsError.CONFIG_FETCH_FAILED */
    ]: "Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}",
    [
      "no-api-key"
      /* AnalyticsError.NO_API_KEY */
    ]: 'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',
    [
      "no-app-id"
      /* AnalyticsError.NO_APP_ID */
    ]: 'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',
    [
      "no-client-id"
      /* AnalyticsError.NO_CLIENT_ID */
    ]: 'The "client_id" field is empty.',
    [
      "invalid-gtag-resource"
      /* AnalyticsError.INVALID_GTAG_RESOURCE */
    ]: "Trusted Types detected an invalid gtag resource: {$gtagURL}."
  };
  var ERROR_FACTORY3 = new ErrorFactory("analytics", "Analytics", ERRORS2);
  function createGtagTrustedTypesScriptURL(url) {
    if (!url.startsWith(GTAG_URL)) {
      const err = ERROR_FACTORY3.create("invalid-gtag-resource", {
        gtagURL: url
      });
      logger2.warn(err.message);
      return "";
    }
    return url;
  }
  function promiseAllSettled(promises) {
    return Promise.all(promises.map((promise) => promise.catch((e2) => e2)));
  }
  function createTrustedTypesPolicy(policyName, policyOptions) {
    let trustedTypesPolicy;
    if (window.trustedTypes) {
      trustedTypesPolicy = window.trustedTypes.createPolicy(policyName, policyOptions);
    }
    return trustedTypesPolicy;
  }
  function insertScriptTag(dataLayerName2, measurementId) {
    const trustedTypesPolicy = createTrustedTypesPolicy("firebase-js-sdk-policy", {
      createScriptURL: createGtagTrustedTypesScriptURL
    });
    const script = document.createElement("script");
    const gtagScriptURL = `${GTAG_URL}?l=${dataLayerName2}&id=${measurementId}`;
    script.src = trustedTypesPolicy ? trustedTypesPolicy?.createScriptURL(gtagScriptURL) : gtagScriptURL;
    script.async = true;
    document.head.appendChild(script);
  }
  function getOrCreateDataLayer(dataLayerName2) {
    let dataLayer = [];
    if (Array.isArray(window[dataLayerName2])) {
      dataLayer = window[dataLayerName2];
    } else {
      window[dataLayerName2] = dataLayer;
    }
    return dataLayer;
  }
  async function gtagOnConfig(gtagCore, initializationPromisesMap2, dynamicConfigPromisesList2, measurementIdToAppId2, measurementId, gtagParams) {
    const correspondingAppId = measurementIdToAppId2[measurementId];
    try {
      if (correspondingAppId) {
        await initializationPromisesMap2[correspondingAppId];
      } else {
        const dynamicConfigResults = await promiseAllSettled(dynamicConfigPromisesList2);
        const foundConfig = dynamicConfigResults.find((config) => config.measurementId === measurementId);
        if (foundConfig) {
          await initializationPromisesMap2[foundConfig.appId];
        }
      }
    } catch (e2) {
      logger2.error(e2);
    }
    gtagCore("config", measurementId, gtagParams);
  }
  async function gtagOnEvent(gtagCore, initializationPromisesMap2, dynamicConfigPromisesList2, measurementId, gtagParams) {
    try {
      let initializationPromisesToWaitFor = [];
      if (gtagParams && gtagParams["send_to"]) {
        let gaSendToList = gtagParams["send_to"];
        if (!Array.isArray(gaSendToList)) {
          gaSendToList = [gaSendToList];
        }
        const dynamicConfigResults = await promiseAllSettled(dynamicConfigPromisesList2);
        for (const sendToId of gaSendToList) {
          const foundConfig = dynamicConfigResults.find((config) => config.measurementId === sendToId);
          const initializationPromise = foundConfig && initializationPromisesMap2[foundConfig.appId];
          if (initializationPromise) {
            initializationPromisesToWaitFor.push(initializationPromise);
          } else {
            initializationPromisesToWaitFor = [];
            break;
          }
        }
      }
      if (initializationPromisesToWaitFor.length === 0) {
        initializationPromisesToWaitFor = Object.values(initializationPromisesMap2);
      }
      await Promise.all(initializationPromisesToWaitFor);
      gtagCore("event", measurementId, gtagParams || {});
    } catch (e2) {
      logger2.error(e2);
    }
  }
  function wrapGtag(gtagCore, initializationPromisesMap2, dynamicConfigPromisesList2, measurementIdToAppId2) {
    async function gtagWrapper(command, ...args) {
      try {
        if (command === "event") {
          const [measurementId, gtagParams] = args;
          await gtagOnEvent(gtagCore, initializationPromisesMap2, dynamicConfigPromisesList2, measurementId, gtagParams);
        } else if (command === "config") {
          const [measurementId, gtagParams] = args;
          await gtagOnConfig(gtagCore, initializationPromisesMap2, dynamicConfigPromisesList2, measurementIdToAppId2, measurementId, gtagParams);
        } else if (command === "consent") {
          const [consentAction, gtagParams] = args;
          gtagCore("consent", consentAction, gtagParams);
        } else if (command === "get") {
          const [measurementId, fieldName, callback] = args;
          gtagCore("get", measurementId, fieldName, callback);
        } else if (command === "set") {
          const [customParams] = args;
          gtagCore("set", customParams);
        } else {
          gtagCore(command, ...args);
        }
      } catch (e2) {
        logger2.error(e2);
      }
    }
    return gtagWrapper;
  }
  function wrapOrCreateGtag(initializationPromisesMap2, dynamicConfigPromisesList2, measurementIdToAppId2, dataLayerName2, gtagFunctionName) {
    let gtagCore = function(..._args) {
      window[dataLayerName2].push(arguments);
    };
    if (window[gtagFunctionName] && typeof window[gtagFunctionName] === "function") {
      gtagCore = window[gtagFunctionName];
    }
    window[gtagFunctionName] = wrapGtag(gtagCore, initializationPromisesMap2, dynamicConfigPromisesList2, measurementIdToAppId2);
    return {
      gtagCore,
      wrappedGtag: window[gtagFunctionName]
    };
  }
  function findGtagScriptOnPage(dataLayerName2) {
    const scriptTags = window.document.getElementsByTagName("script");
    for (const tag of Object.values(scriptTags)) {
      if (tag.src && tag.src.includes(GTAG_URL) && tag.src.includes(dataLayerName2)) {
        return tag;
      }
    }
    return null;
  }
  var LONG_RETRY_FACTOR = 30;
  var BASE_INTERVAL_MILLIS = 1e3;
  var RetryData = class {
    constructor(throttleMetadata = {}, intervalMillis = BASE_INTERVAL_MILLIS) {
      this.throttleMetadata = throttleMetadata;
      this.intervalMillis = intervalMillis;
    }
    getThrottleMetadata(appId) {
      return this.throttleMetadata[appId];
    }
    setThrottleMetadata(appId, metadata) {
      this.throttleMetadata[appId] = metadata;
    }
    deleteThrottleMetadata(appId) {
      delete this.throttleMetadata[appId];
    }
  };
  var defaultRetryData = new RetryData();
  function getHeaders2(apiKey) {
    return new Headers({
      Accept: "application/json",
      "x-goog-api-key": apiKey
    });
  }
  async function fetchDynamicConfig(appFields) {
    const { appId, apiKey } = appFields;
    const request = {
      method: "GET",
      headers: getHeaders2(apiKey)
    };
    const appUrl = DYNAMIC_CONFIG_URL.replace("{app-id}", appId);
    const response = await fetch(appUrl, request);
    if (response.status !== 200 && response.status !== 304) {
      let errorMessage = "";
      try {
        const jsonResponse = await response.json();
        if (jsonResponse.error?.message) {
          errorMessage = jsonResponse.error.message;
        }
      } catch (_ignored) {
      }
      throw ERROR_FACTORY3.create("config-fetch-failed", {
        httpStatus: response.status,
        responseMessage: errorMessage
      });
    }
    return response.json();
  }
  async function fetchDynamicConfigWithRetry(app2, retryData = defaultRetryData, timeoutMillis) {
    const { appId, apiKey, measurementId } = app2.options;
    if (!appId) {
      throw ERROR_FACTORY3.create(
        "no-app-id"
        /* AnalyticsError.NO_APP_ID */
      );
    }
    if (!apiKey) {
      if (measurementId) {
        return {
          measurementId,
          appId
        };
      }
      throw ERROR_FACTORY3.create(
        "no-api-key"
        /* AnalyticsError.NO_API_KEY */
      );
    }
    const throttleMetadata = retryData.getThrottleMetadata(appId) || {
      backoffCount: 0,
      throttleEndTimeMillis: Date.now()
    };
    const signal = new AnalyticsAbortSignal();
    setTimeout(async () => {
      signal.abort();
    }, timeoutMillis !== void 0 ? timeoutMillis : FETCH_TIMEOUT_MILLIS);
    return attemptFetchDynamicConfigWithRetry({ appId, apiKey, measurementId }, throttleMetadata, signal, retryData);
  }
  async function attemptFetchDynamicConfigWithRetry(appFields, { throttleEndTimeMillis, backoffCount }, signal, retryData = defaultRetryData) {
    const { appId, measurementId } = appFields;
    try {
      await setAbortableTimeout(signal, throttleEndTimeMillis);
    } catch (e2) {
      if (measurementId) {
        logger2.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${measurementId} provided in the "measurementId" field in the local Firebase config. [${e2?.message}]`);
        return { appId, measurementId };
      }
      throw e2;
    }
    try {
      const response = await fetchDynamicConfig(appFields);
      retryData.deleteThrottleMetadata(appId);
      return response;
    } catch (e2) {
      const error = e2;
      if (!isRetriableError(error)) {
        retryData.deleteThrottleMetadata(appId);
        if (measurementId) {
          logger2.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${measurementId} provided in the "measurementId" field in the local Firebase config. [${error?.message}]`);
          return { appId, measurementId };
        } else {
          throw e2;
        }
      }
      const backoffMillis = Number(error?.customData?.httpStatus) === 503 ? calculateBackoffMillis(backoffCount, retryData.intervalMillis, LONG_RETRY_FACTOR) : calculateBackoffMillis(backoffCount, retryData.intervalMillis);
      const throttleMetadata = {
        throttleEndTimeMillis: Date.now() + backoffMillis,
        backoffCount: backoffCount + 1
      };
      retryData.setThrottleMetadata(appId, throttleMetadata);
      logger2.debug(`Calling attemptFetch again in ${backoffMillis} millis`);
      return attemptFetchDynamicConfigWithRetry(appFields, throttleMetadata, signal, retryData);
    }
  }
  function setAbortableTimeout(signal, throttleEndTimeMillis) {
    return new Promise((resolve, reject) => {
      const backoffMillis = Math.max(throttleEndTimeMillis - Date.now(), 0);
      const timeout = setTimeout(resolve, backoffMillis);
      signal.addEventListener(() => {
        clearTimeout(timeout);
        reject(ERROR_FACTORY3.create("fetch-throttle", {
          throttleEndTimeMillis
        }));
      });
    });
  }
  function isRetriableError(e2) {
    if (!(e2 instanceof FirebaseError) || !e2.customData) {
      return false;
    }
    const httpStatus = Number(e2.customData["httpStatus"]);
    return httpStatus === 429 || httpStatus === 500 || httpStatus === 503 || httpStatus === 504;
  }
  var AnalyticsAbortSignal = class {
    constructor() {
      this.listeners = [];
    }
    addEventListener(listener) {
      this.listeners.push(listener);
    }
    abort() {
      this.listeners.forEach((listener) => listener());
    }
  };
  var defaultEventParametersForInit;
  async function logEvent$1(gtagFunction, initializationPromise, eventName, eventParams, options) {
    if (options && options.global) {
      gtagFunction("event", eventName, eventParams);
      return;
    } else {
      const measurementId = await initializationPromise;
      const params = {
        ...eventParams,
        "send_to": measurementId
      };
      gtagFunction("event", eventName, params);
    }
  }
  async function setUserProperties$1(gtagFunction, initializationPromise, properties, options) {
    if (options && options.global) {
      const flatProperties = {};
      for (const key of Object.keys(properties)) {
        flatProperties[`user_properties.${key}`] = properties[key];
      }
      gtagFunction("set", flatProperties);
      return Promise.resolve();
    } else {
      const measurementId = await initializationPromise;
      gtagFunction("config", measurementId, {
        update: true,
        "user_properties": properties
      });
    }
  }
  var defaultConsentSettingsForInit;
  function _setConsentDefaultForInit(consentSettings) {
    defaultConsentSettingsForInit = consentSettings;
  }
  function _setDefaultEventParametersForInit(customParams) {
    defaultEventParametersForInit = customParams;
  }
  async function validateIndexedDB() {
    if (!isIndexedDBAvailable()) {
      logger2.warn(ERROR_FACTORY3.create("indexeddb-unavailable", {
        errorInfo: "IndexedDB is not available in this environment."
      }).message);
      return false;
    } else {
      try {
        await validateIndexedDBOpenable();
      } catch (e2) {
        logger2.warn(ERROR_FACTORY3.create("indexeddb-unavailable", {
          errorInfo: e2?.toString()
        }).message);
        return false;
      }
    }
    return true;
  }
  async function _initializeAnalytics(app2, dynamicConfigPromisesList2, measurementIdToAppId2, installations, gtagCore, dataLayerName2, options) {
    const dynamicConfigPromise = fetchDynamicConfigWithRetry(app2);
    dynamicConfigPromise.then((config) => {
      measurementIdToAppId2[config.measurementId] = config.appId;
      if (app2.options.measurementId && config.measurementId !== app2.options.measurementId) {
        logger2.warn(`The measurement ID in the local Firebase config (${app2.options.measurementId}) does not match the measurement ID fetched from the server (${config.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`);
      }
    }).catch((e2) => logger2.error(e2));
    dynamicConfigPromisesList2.push(dynamicConfigPromise);
    const fidPromise = validateIndexedDB().then((envIsValid) => {
      if (envIsValid) {
        return installations.getId();
      } else {
        return void 0;
      }
    });
    const [dynamicConfig, fid] = await Promise.all([
      dynamicConfigPromise,
      fidPromise
    ]);
    if (!findGtagScriptOnPage(dataLayerName2)) {
      insertScriptTag(dataLayerName2, dynamicConfig.measurementId);
    }
    if (defaultConsentSettingsForInit) {
      gtagCore("consent", "default", defaultConsentSettingsForInit);
      _setConsentDefaultForInit(void 0);
    }
    gtagCore("js", /* @__PURE__ */ new Date());
    const configProperties = options?.config ?? {};
    configProperties[ORIGIN_KEY] = "firebase";
    configProperties.update = true;
    if (fid != null) {
      configProperties[GA_FID_KEY] = fid;
    }
    gtagCore("config", dynamicConfig.measurementId, configProperties);
    if (defaultEventParametersForInit) {
      gtagCore("set", defaultEventParametersForInit);
      _setDefaultEventParametersForInit(void 0);
    }
    return dynamicConfig.measurementId;
  }
  var AnalyticsService = class {
    constructor(app2) {
      this.app = app2;
    }
    _delete() {
      delete initializationPromisesMap[this.app.options.appId];
      return Promise.resolve();
    }
  };
  var initializationPromisesMap = {};
  var dynamicConfigPromisesList = [];
  var measurementIdToAppId = {};
  var dataLayerName = "dataLayer";
  var gtagName = "gtag";
  var gtagCoreFunction;
  var wrappedGtagFunction;
  var globalInitDone = false;
  function warnOnBrowserContextMismatch() {
    const mismatchedEnvMessages = [];
    if (isBrowserExtension()) {
      mismatchedEnvMessages.push("This is a browser extension environment.");
    }
    if (!areCookiesEnabled()) {
      mismatchedEnvMessages.push("Cookies are not available.");
    }
    if (mismatchedEnvMessages.length > 0) {
      const details = mismatchedEnvMessages.map((message, index) => `(${index + 1}) ${message}`).join(" ");
      const err = ERROR_FACTORY3.create("invalid-analytics-context", {
        errorInfo: details
      });
      logger2.warn(err.message);
    }
  }
  function factory(app2, installations, options) {
    warnOnBrowserContextMismatch();
    const appId = app2.options.appId;
    if (!appId) {
      throw ERROR_FACTORY3.create(
        "no-app-id"
        /* AnalyticsError.NO_APP_ID */
      );
    }
    if (!app2.options.apiKey) {
      if (app2.options.measurementId) {
        logger2.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${app2.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);
      } else {
        throw ERROR_FACTORY3.create(
          "no-api-key"
          /* AnalyticsError.NO_API_KEY */
        );
      }
    }
    if (initializationPromisesMap[appId] != null) {
      throw ERROR_FACTORY3.create("already-exists", {
        id: appId
      });
    }
    if (!globalInitDone) {
      getOrCreateDataLayer(dataLayerName);
      const { wrappedGtag, gtagCore } = wrapOrCreateGtag(initializationPromisesMap, dynamicConfigPromisesList, measurementIdToAppId, dataLayerName, gtagName);
      wrappedGtagFunction = wrappedGtag;
      gtagCoreFunction = gtagCore;
      globalInitDone = true;
    }
    initializationPromisesMap[appId] = _initializeAnalytics(app2, dynamicConfigPromisesList, measurementIdToAppId, installations, gtagCoreFunction, dataLayerName, options);
    const analyticsInstance = new AnalyticsService(app2);
    return analyticsInstance;
  }
  function getAnalytics(app2 = getApp()) {
    app2 = getModularInstance(app2);
    const analyticsProvider = _getProvider(app2, ANALYTICS_TYPE);
    if (analyticsProvider.isInitialized()) {
      return analyticsProvider.getImmediate();
    }
    return initializeAnalytics(app2);
  }
  function initializeAnalytics(app2, options = {}) {
    const analyticsProvider = _getProvider(app2, ANALYTICS_TYPE);
    if (analyticsProvider.isInitialized()) {
      const existingInstance = analyticsProvider.getImmediate();
      if (deepEqual(options, analyticsProvider.getOptions())) {
        return existingInstance;
      } else {
        throw ERROR_FACTORY3.create(
          "already-initialized"
          /* AnalyticsError.ALREADY_INITIALIZED */
        );
      }
    }
    const analyticsInstance = analyticsProvider.initialize({ options });
    return analyticsInstance;
  }
  async function isSupported() {
    if (isBrowserExtension()) {
      return false;
    }
    if (!areCookiesEnabled()) {
      return false;
    }
    if (!isIndexedDBAvailable()) {
      return false;
    }
    try {
      const isDBOpenable = await validateIndexedDBOpenable();
      return isDBOpenable;
    } catch (error) {
      return false;
    }
  }
  function setUserProperties(analyticsInstance, properties, options) {
    analyticsInstance = getModularInstance(analyticsInstance);
    setUserProperties$1(wrappedGtagFunction, initializationPromisesMap[analyticsInstance.app.options.appId], properties, options).catch((e2) => logger2.error(e2));
  }
  function logEvent(analyticsInstance, eventName, eventParams, options) {
    analyticsInstance = getModularInstance(analyticsInstance);
    logEvent$1(wrappedGtagFunction, initializationPromisesMap[analyticsInstance.app.options.appId], eventName, eventParams, options).catch((e2) => logger2.error(e2));
  }
  var name5 = "@firebase/analytics";
  var version9 = "0.10.19";
  function registerAnalytics() {
    _registerComponent(new Component(
      ANALYTICS_TYPE,
      (container, { options: analyticsOptions }) => {
        const app2 = container.getProvider("app").getImmediate();
        const installations = container.getProvider("installations-internal").getImmediate();
        return factory(app2, installations, analyticsOptions);
      },
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ));
    _registerComponent(new Component(
      "analytics-internal",
      internalFactory2,
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    registerVersion(name5, version9);
    registerVersion(name5, version9, "esm2020");
    function internalFactory2(container) {
      try {
        const analytics2 = container.getProvider(ANALYTICS_TYPE).getImmediate();
        return {
          logEvent: (eventName, eventParams, options) => logEvent(analytics2, eventName, eventParams, options),
          setUserProperties: (properties, options) => setUserProperties(analytics2, properties, options)
        };
      } catch (e2) {
        throw ERROR_FACTORY3.create("interop-component-reg-failed", {
          reason: e2
        });
      }
    }
  }
  registerAnalytics();

  // node_modules/@firebase/messaging/dist/esm/index.esm.js
  var DEFAULT_SW_PATH = "/firebase-messaging-sw.js";
  var DEFAULT_SW_SCOPE = "/firebase-cloud-messaging-push-scope";
  var DEFAULT_VAPID_KEY = "BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4";
  var ENDPOINT = "https://fcmregistrations.googleapis.com/v1";
  var CONSOLE_CAMPAIGN_ID = "google.c.a.c_id";
  var CONSOLE_CAMPAIGN_NAME = "google.c.a.c_l";
  var CONSOLE_CAMPAIGN_TIME = "google.c.a.ts";
  var CONSOLE_CAMPAIGN_ANALYTICS_ENABLED = "google.c.a.e";
  var DEFAULT_REGISTRATION_TIMEOUT = 1e4;
  var MessageType$1;
  (function(MessageType2) {
    MessageType2[MessageType2["DATA_MESSAGE"] = 1] = "DATA_MESSAGE";
    MessageType2[MessageType2["DISPLAY_NOTIFICATION"] = 3] = "DISPLAY_NOTIFICATION";
  })(MessageType$1 || (MessageType$1 = {}));
  var MessageType;
  (function(MessageType2) {
    MessageType2["PUSH_RECEIVED"] = "push-received";
    MessageType2["NOTIFICATION_CLICKED"] = "notification-clicked";
  })(MessageType || (MessageType = {}));
  function arrayToBase64(array) {
    const uint8Array = new Uint8Array(array);
    const base64String = btoa(String.fromCharCode(...uint8Array));
    return base64String.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  function base64ToArray(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base642 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = atob(base642);
    const outputArray = new Uint8Array(rawData.length);
    for (let i2 = 0; i2 < rawData.length; ++i2) {
      outputArray[i2] = rawData.charCodeAt(i2);
    }
    return outputArray;
  }
  var OLD_DB_NAME = "fcm_token_details_db";
  var OLD_DB_VERSION = 5;
  var OLD_OBJECT_STORE_NAME = "fcm_token_object_Store";
  async function migrateOldDatabase(senderId) {
    if ("databases" in indexedDB) {
      const databases = await indexedDB.databases();
      const dbNames = databases.map((db2) => db2.name);
      if (!dbNames.includes(OLD_DB_NAME)) {
        return null;
      }
    }
    let tokenDetails = null;
    const db = await openDB(OLD_DB_NAME, OLD_DB_VERSION, {
      upgrade: async (db2, oldVersion, newVersion, upgradeTransaction) => {
        if (oldVersion < 2) {
          return;
        }
        if (!db2.objectStoreNames.contains(OLD_OBJECT_STORE_NAME)) {
          return;
        }
        const objectStore = upgradeTransaction.objectStore(OLD_OBJECT_STORE_NAME);
        const value = await objectStore.index("fcmSenderId").get(senderId);
        await objectStore.clear();
        if (!value) {
          return;
        }
        if (oldVersion === 2) {
          const oldDetails = value;
          if (!oldDetails.auth || !oldDetails.p256dh || !oldDetails.endpoint) {
            return;
          }
          tokenDetails = {
            token: oldDetails.fcmToken,
            createTime: oldDetails.createTime ?? Date.now(),
            subscriptionOptions: {
              auth: oldDetails.auth,
              p256dh: oldDetails.p256dh,
              endpoint: oldDetails.endpoint,
              swScope: oldDetails.swScope,
              vapidKey: typeof oldDetails.vapidKey === "string" ? oldDetails.vapidKey : arrayToBase64(oldDetails.vapidKey)
            }
          };
        } else if (oldVersion === 3) {
          const oldDetails = value;
          tokenDetails = {
            token: oldDetails.fcmToken,
            createTime: oldDetails.createTime,
            subscriptionOptions: {
              auth: arrayToBase64(oldDetails.auth),
              p256dh: arrayToBase64(oldDetails.p256dh),
              endpoint: oldDetails.endpoint,
              swScope: oldDetails.swScope,
              vapidKey: arrayToBase64(oldDetails.vapidKey)
            }
          };
        } else if (oldVersion === 4) {
          const oldDetails = value;
          tokenDetails = {
            token: oldDetails.fcmToken,
            createTime: oldDetails.createTime,
            subscriptionOptions: {
              auth: arrayToBase64(oldDetails.auth),
              p256dh: arrayToBase64(oldDetails.p256dh),
              endpoint: oldDetails.endpoint,
              swScope: oldDetails.swScope,
              vapidKey: arrayToBase64(oldDetails.vapidKey)
            }
          };
        }
      }
    });
    db.close();
    await deleteDB(OLD_DB_NAME);
    await deleteDB("fcm_vapid_details_db");
    await deleteDB("undefined");
    return checkTokenDetails(tokenDetails) ? tokenDetails : null;
  }
  function checkTokenDetails(tokenDetails) {
    if (!tokenDetails || !tokenDetails.subscriptionOptions) {
      return false;
    }
    const { subscriptionOptions } = tokenDetails;
    return typeof tokenDetails.createTime === "number" && tokenDetails.createTime > 0 && typeof tokenDetails.token === "string" && tokenDetails.token.length > 0 && typeof subscriptionOptions.auth === "string" && subscriptionOptions.auth.length > 0 && typeof subscriptionOptions.p256dh === "string" && subscriptionOptions.p256dh.length > 0 && typeof subscriptionOptions.endpoint === "string" && subscriptionOptions.endpoint.length > 0 && typeof subscriptionOptions.swScope === "string" && subscriptionOptions.swScope.length > 0 && typeof subscriptionOptions.vapidKey === "string" && subscriptionOptions.vapidKey.length > 0;
  }
  var DATABASE_NAME2 = "firebase-messaging-database";
  var DATABASE_VERSION2 = 1;
  var OBJECT_STORE_NAME2 = "firebase-messaging-store";
  var dbPromise3 = null;
  function getDbPromise3() {
    if (!dbPromise3) {
      dbPromise3 = openDB(DATABASE_NAME2, DATABASE_VERSION2, {
        upgrade: (upgradeDb, oldVersion) => {
          switch (oldVersion) {
            case 0:
              upgradeDb.createObjectStore(OBJECT_STORE_NAME2);
          }
        }
      });
    }
    return dbPromise3;
  }
  async function dbGet(firebaseDependencies) {
    const key = getKey2(firebaseDependencies);
    const db = await getDbPromise3();
    const tokenDetails = await db.transaction(OBJECT_STORE_NAME2).objectStore(OBJECT_STORE_NAME2).get(key);
    if (tokenDetails) {
      return tokenDetails;
    } else {
      const oldTokenDetails = await migrateOldDatabase(firebaseDependencies.appConfig.senderId);
      if (oldTokenDetails) {
        await dbSet(firebaseDependencies, oldTokenDetails);
        return oldTokenDetails;
      }
    }
  }
  async function dbSet(firebaseDependencies, tokenDetails) {
    const key = getKey2(firebaseDependencies);
    const db = await getDbPromise3();
    const tx = db.transaction(OBJECT_STORE_NAME2, "readwrite");
    await tx.objectStore(OBJECT_STORE_NAME2).put(tokenDetails, key);
    await tx.done;
    return tokenDetails;
  }
  function getKey2({ appConfig }) {
    return appConfig.appId;
  }
  var ERROR_MAP = {
    [
      "missing-app-config-values"
      /* ErrorCode.MISSING_APP_CONFIG_VALUES */
    ]: 'Missing App configuration value: "{$valueName}"',
    [
      "only-available-in-window"
      /* ErrorCode.AVAILABLE_IN_WINDOW */
    ]: "This method is available in a Window context.",
    [
      "only-available-in-sw"
      /* ErrorCode.AVAILABLE_IN_SW */
    ]: "This method is available in a service worker context.",
    [
      "permission-default"
      /* ErrorCode.PERMISSION_DEFAULT */
    ]: "The notification permission was not granted and dismissed instead.",
    [
      "permission-blocked"
      /* ErrorCode.PERMISSION_BLOCKED */
    ]: "The notification permission was not granted and blocked instead.",
    [
      "unsupported-browser"
      /* ErrorCode.UNSUPPORTED_BROWSER */
    ]: "This browser doesn't support the API's required to use the Firebase SDK.",
    [
      "indexed-db-unsupported"
      /* ErrorCode.INDEXED_DB_UNSUPPORTED */
    ]: "This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",
    [
      "failed-service-worker-registration"
      /* ErrorCode.FAILED_DEFAULT_REGISTRATION */
    ]: "We are unable to register the default service worker. {$browserErrorMessage}",
    [
      "token-subscribe-failed"
      /* ErrorCode.TOKEN_SUBSCRIBE_FAILED */
    ]: "A problem occurred while subscribing the user to FCM: {$errorInfo}",
    [
      "token-subscribe-no-token"
      /* ErrorCode.TOKEN_SUBSCRIBE_NO_TOKEN */
    ]: "FCM returned no token when subscribing the user to push.",
    [
      "token-unsubscribe-failed"
      /* ErrorCode.TOKEN_UNSUBSCRIBE_FAILED */
    ]: "A problem occurred while unsubscribing the user from FCM: {$errorInfo}",
    [
      "token-update-failed"
      /* ErrorCode.TOKEN_UPDATE_FAILED */
    ]: "A problem occurred while updating the user from FCM: {$errorInfo}",
    [
      "token-update-no-token"
      /* ErrorCode.TOKEN_UPDATE_NO_TOKEN */
    ]: "FCM returned no token when updating the user to push.",
    [
      "use-sw-after-get-token"
      /* ErrorCode.USE_SW_AFTER_GET_TOKEN */
    ]: "The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.",
    [
      "invalid-sw-registration"
      /* ErrorCode.INVALID_SW_REGISTRATION */
    ]: "The input to useServiceWorker() must be a ServiceWorkerRegistration.",
    [
      "invalid-bg-handler"
      /* ErrorCode.INVALID_BG_HANDLER */
    ]: "The input to setBackgroundMessageHandler() must be a function.",
    [
      "invalid-vapid-key"
      /* ErrorCode.INVALID_VAPID_KEY */
    ]: "The public VAPID key must be a string.",
    [
      "use-vapid-key-after-get-token"
      /* ErrorCode.USE_VAPID_KEY_AFTER_GET_TOKEN */
    ]: "The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."
  };
  var ERROR_FACTORY4 = new ErrorFactory("messaging", "Messaging", ERROR_MAP);
  async function requestGetToken(firebaseDependencies, subscriptionOptions) {
    const headers = await getHeaders3(firebaseDependencies);
    const body = getBody(subscriptionOptions);
    const subscribeOptions = {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    };
    let responseData;
    try {
      const response = await fetch(getEndpoint(firebaseDependencies.appConfig), subscribeOptions);
      responseData = await response.json();
    } catch (err) {
      throw ERROR_FACTORY4.create("token-subscribe-failed", {
        errorInfo: err?.toString()
      });
    }
    if (responseData.error) {
      const message = responseData.error.message;
      throw ERROR_FACTORY4.create("token-subscribe-failed", {
        errorInfo: message
      });
    }
    if (!responseData.token) {
      throw ERROR_FACTORY4.create(
        "token-subscribe-no-token"
        /* ErrorCode.TOKEN_SUBSCRIBE_NO_TOKEN */
      );
    }
    return responseData.token;
  }
  async function requestUpdateToken(firebaseDependencies, tokenDetails) {
    const headers = await getHeaders3(firebaseDependencies);
    const body = getBody(tokenDetails.subscriptionOptions);
    const updateOptions = {
      method: "PATCH",
      headers,
      body: JSON.stringify(body)
    };
    let responseData;
    try {
      const response = await fetch(`${getEndpoint(firebaseDependencies.appConfig)}/${tokenDetails.token}`, updateOptions);
      responseData = await response.json();
    } catch (err) {
      throw ERROR_FACTORY4.create("token-update-failed", {
        errorInfo: err?.toString()
      });
    }
    if (responseData.error) {
      const message = responseData.error.message;
      throw ERROR_FACTORY4.create("token-update-failed", {
        errorInfo: message
      });
    }
    if (!responseData.token) {
      throw ERROR_FACTORY4.create(
        "token-update-no-token"
        /* ErrorCode.TOKEN_UPDATE_NO_TOKEN */
      );
    }
    return responseData.token;
  }
  async function requestDeleteToken(firebaseDependencies, token) {
    const headers = await getHeaders3(firebaseDependencies);
    const unsubscribeOptions = {
      method: "DELETE",
      headers
    };
    try {
      const response = await fetch(`${getEndpoint(firebaseDependencies.appConfig)}/${token}`, unsubscribeOptions);
      const responseData = await response.json();
      if (responseData.error) {
        const message = responseData.error.message;
        throw ERROR_FACTORY4.create("token-unsubscribe-failed", {
          errorInfo: message
        });
      }
    } catch (err) {
      throw ERROR_FACTORY4.create("token-unsubscribe-failed", {
        errorInfo: err?.toString()
      });
    }
  }
  function getEndpoint({ projectId }) {
    return `${ENDPOINT}/projects/${projectId}/registrations`;
  }
  async function getHeaders3({ appConfig, installations }) {
    const authToken = await installations.getToken();
    return new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-goog-api-key": appConfig.apiKey,
      "x-goog-firebase-installations-auth": `FIS ${authToken}`
    });
  }
  function getBody({ p256dh, auth: auth2, endpoint, vapidKey }) {
    const body = {
      web: {
        endpoint,
        auth: auth2,
        p256dh
      }
    };
    if (vapidKey !== DEFAULT_VAPID_KEY) {
      body.web.applicationPubKey = vapidKey;
    }
    return body;
  }
  var TOKEN_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1e3;
  async function getTokenInternal(messaging2) {
    const pushSubscription = await getPushSubscription(messaging2.swRegistration, messaging2.vapidKey);
    const subscriptionOptions = {
      vapidKey: messaging2.vapidKey,
      swScope: messaging2.swRegistration.scope,
      endpoint: pushSubscription.endpoint,
      auth: arrayToBase64(pushSubscription.getKey("auth")),
      p256dh: arrayToBase64(pushSubscription.getKey("p256dh"))
    };
    const tokenDetails = await dbGet(messaging2.firebaseDependencies);
    if (!tokenDetails) {
      return getNewToken(messaging2.firebaseDependencies, subscriptionOptions);
    } else if (!isTokenValid(tokenDetails.subscriptionOptions, subscriptionOptions)) {
      try {
        await requestDeleteToken(messaging2.firebaseDependencies, tokenDetails.token);
      } catch (e2) {
        console.warn(e2);
      }
      return getNewToken(messaging2.firebaseDependencies, subscriptionOptions);
    } else if (Date.now() >= tokenDetails.createTime + TOKEN_EXPIRATION_MS) {
      return updateToken(messaging2, {
        token: tokenDetails.token,
        createTime: Date.now(),
        subscriptionOptions
      });
    } else {
      return tokenDetails.token;
    }
  }
  async function updateToken(messaging2, tokenDetails) {
    try {
      const updatedToken = await requestUpdateToken(messaging2.firebaseDependencies, tokenDetails);
      const updatedTokenDetails = {
        ...tokenDetails,
        token: updatedToken,
        createTime: Date.now()
      };
      await dbSet(messaging2.firebaseDependencies, updatedTokenDetails);
      return updatedToken;
    } catch (e2) {
      throw e2;
    }
  }
  async function getNewToken(firebaseDependencies, subscriptionOptions) {
    const token = await requestGetToken(firebaseDependencies, subscriptionOptions);
    const tokenDetails = {
      token,
      createTime: Date.now(),
      subscriptionOptions
    };
    await dbSet(firebaseDependencies, tokenDetails);
    return tokenDetails.token;
  }
  async function getPushSubscription(swRegistration, vapidKey) {
    const subscription = await swRegistration.pushManager.getSubscription();
    if (subscription) {
      return subscription;
    }
    return swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      // Chrome <= 75 doesn't support base64-encoded VAPID key. For backward compatibility, VAPID key
      // submitted to pushManager#subscribe must be of type Uint8Array.
      applicationServerKey: base64ToArray(vapidKey)
    });
  }
  function isTokenValid(dbOptions, currentOptions) {
    const isVapidKeyEqual = currentOptions.vapidKey === dbOptions.vapidKey;
    const isEndpointEqual = currentOptions.endpoint === dbOptions.endpoint;
    const isAuthEqual = currentOptions.auth === dbOptions.auth;
    const isP256dhEqual = currentOptions.p256dh === dbOptions.p256dh;
    return isVapidKeyEqual && isEndpointEqual && isAuthEqual && isP256dhEqual;
  }
  function externalizePayload(internalPayload) {
    const payload = {
      from: internalPayload.from,
      // eslint-disable-next-line camelcase
      collapseKey: internalPayload.collapse_key,
      // eslint-disable-next-line camelcase
      messageId: internalPayload.fcmMessageId
    };
    propagateNotificationPayload(payload, internalPayload);
    propagateDataPayload(payload, internalPayload);
    propagateFcmOptions(payload, internalPayload);
    return payload;
  }
  function propagateNotificationPayload(payload, messagePayloadInternal) {
    if (!messagePayloadInternal.notification) {
      return;
    }
    payload.notification = {};
    const title = messagePayloadInternal.notification.title;
    if (!!title) {
      payload.notification.title = title;
    }
    const body = messagePayloadInternal.notification.body;
    if (!!body) {
      payload.notification.body = body;
    }
    const image = messagePayloadInternal.notification.image;
    if (!!image) {
      payload.notification.image = image;
    }
    const icon = messagePayloadInternal.notification.icon;
    if (!!icon) {
      payload.notification.icon = icon;
    }
  }
  function propagateDataPayload(payload, messagePayloadInternal) {
    if (!messagePayloadInternal.data) {
      return;
    }
    payload.data = messagePayloadInternal.data;
  }
  function propagateFcmOptions(payload, messagePayloadInternal) {
    if (!messagePayloadInternal.fcmOptions && !messagePayloadInternal.notification?.click_action) {
      return;
    }
    payload.fcmOptions = {};
    const link = messagePayloadInternal.fcmOptions?.link ?? messagePayloadInternal.notification?.click_action;
    if (!!link) {
      payload.fcmOptions.link = link;
    }
    const analyticsLabel = messagePayloadInternal.fcmOptions?.analytics_label;
    if (!!analyticsLabel) {
      payload.fcmOptions.analyticsLabel = analyticsLabel;
    }
  }
  function isConsoleMessage(data) {
    return typeof data === "object" && !!data && CONSOLE_CAMPAIGN_ID in data;
  }
  _mergeStrings("AzSCbw63g1R0nCw85jG8", "Iaya3yLKwmgvh7cF0q4");
  function _mergeStrings(s1, s2) {
    const resultArray = [];
    for (let i2 = 0; i2 < s1.length; i2++) {
      resultArray.push(s1.charAt(i2));
      if (i2 < s2.length) {
        resultArray.push(s2.charAt(i2));
      }
    }
    return resultArray.join("");
  }
  function extractAppConfig2(app2) {
    if (!app2 || !app2.options) {
      throw getMissingValueError2("App Configuration Object");
    }
    if (!app2.name) {
      throw getMissingValueError2("App Name");
    }
    const configKeys = [
      "projectId",
      "apiKey",
      "appId",
      "messagingSenderId"
    ];
    const { options } = app2;
    for (const keyName of configKeys) {
      if (!options[keyName]) {
        throw getMissingValueError2(keyName);
      }
    }
    return {
      appName: app2.name,
      projectId: options.projectId,
      apiKey: options.apiKey,
      appId: options.appId,
      senderId: options.messagingSenderId
    };
  }
  function getMissingValueError2(valueName) {
    return ERROR_FACTORY4.create("missing-app-config-values", {
      valueName
    });
  }
  var MessagingService = class {
    constructor(app2, installations, analyticsProvider) {
      this.deliveryMetricsExportedToBigQueryEnabled = false;
      this.onBackgroundMessageHandler = null;
      this.onMessageHandler = null;
      this.logEvents = [];
      this.isLogServiceStarted = false;
      const appConfig = extractAppConfig2(app2);
      this.firebaseDependencies = {
        app: app2,
        appConfig,
        installations,
        analyticsProvider
      };
    }
    _delete() {
      return Promise.resolve();
    }
  };
  async function registerDefaultSw(messaging2) {
    try {
      messaging2.swRegistration = await navigator.serviceWorker.register(DEFAULT_SW_PATH, {
        scope: DEFAULT_SW_SCOPE
      });
      messaging2.swRegistration.update().catch(() => {
      });
      await waitForRegistrationActive(messaging2.swRegistration);
    } catch (e2) {
      throw ERROR_FACTORY4.create("failed-service-worker-registration", {
        browserErrorMessage: e2?.message
      });
    }
  }
  async function waitForRegistrationActive(registration) {
    return new Promise((resolve, reject) => {
      const rejectTimeout = setTimeout(() => reject(new Error(`Service worker not registered after ${DEFAULT_REGISTRATION_TIMEOUT} ms`)), DEFAULT_REGISTRATION_TIMEOUT);
      const incomingSw = registration.installing || registration.waiting;
      if (registration.active) {
        clearTimeout(rejectTimeout);
        resolve();
      } else if (incomingSw) {
        incomingSw.onstatechange = (ev) => {
          if (ev.target?.state === "activated") {
            incomingSw.onstatechange = null;
            clearTimeout(rejectTimeout);
            resolve();
          }
        };
      } else {
        clearTimeout(rejectTimeout);
        reject(new Error("No incoming service worker found."));
      }
    });
  }
  async function updateSwReg(messaging2, swRegistration) {
    if (!swRegistration && !messaging2.swRegistration) {
      await registerDefaultSw(messaging2);
    }
    if (!swRegistration && !!messaging2.swRegistration) {
      return;
    }
    if (!(swRegistration instanceof ServiceWorkerRegistration)) {
      throw ERROR_FACTORY4.create(
        "invalid-sw-registration"
        /* ErrorCode.INVALID_SW_REGISTRATION */
      );
    }
    messaging2.swRegistration = swRegistration;
  }
  async function updateVapidKey(messaging2, vapidKey) {
    if (!!vapidKey) {
      messaging2.vapidKey = vapidKey;
    } else if (!messaging2.vapidKey) {
      messaging2.vapidKey = DEFAULT_VAPID_KEY;
    }
  }
  async function getToken$1(messaging2, options) {
    if (!navigator) {
      throw ERROR_FACTORY4.create(
        "only-available-in-window"
        /* ErrorCode.AVAILABLE_IN_WINDOW */
      );
    }
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
    if (Notification.permission !== "granted") {
      throw ERROR_FACTORY4.create(
        "permission-blocked"
        /* ErrorCode.PERMISSION_BLOCKED */
      );
    }
    await updateVapidKey(messaging2, options?.vapidKey);
    await updateSwReg(messaging2, options?.serviceWorkerRegistration);
    return getTokenInternal(messaging2);
  }
  async function logToScion(messaging2, messageType, data) {
    const eventType = getEventType(messageType);
    const analytics2 = await messaging2.firebaseDependencies.analyticsProvider.get();
    analytics2.logEvent(eventType, {
      /* eslint-disable camelcase */
      message_id: data[CONSOLE_CAMPAIGN_ID],
      message_name: data[CONSOLE_CAMPAIGN_NAME],
      message_time: data[CONSOLE_CAMPAIGN_TIME],
      message_device_time: Math.floor(Date.now() / 1e3)
      /* eslint-enable camelcase */
    });
  }
  function getEventType(messageType) {
    switch (messageType) {
      case MessageType.NOTIFICATION_CLICKED:
        return "notification_open";
      case MessageType.PUSH_RECEIVED:
        return "notification_foreground";
      default:
        throw new Error();
    }
  }
  async function messageEventListener(messaging2, event) {
    const internalPayload = event.data;
    if (!internalPayload.isFirebaseMessaging) {
      return;
    }
    if (messaging2.onMessageHandler && internalPayload.messageType === MessageType.PUSH_RECEIVED) {
      if (typeof messaging2.onMessageHandler === "function") {
        messaging2.onMessageHandler(externalizePayload(internalPayload));
      } else {
        messaging2.onMessageHandler.next(externalizePayload(internalPayload));
      }
    }
    const dataPayload = internalPayload.data;
    if (isConsoleMessage(dataPayload) && dataPayload[CONSOLE_CAMPAIGN_ANALYTICS_ENABLED] === "1") {
      await logToScion(messaging2, internalPayload.messageType, dataPayload);
    }
  }
  var name6 = "@firebase/messaging";
  var version10 = "0.12.23";
  var WindowMessagingFactory = (container) => {
    const messaging2 = new MessagingService(container.getProvider("app").getImmediate(), container.getProvider("installations-internal").getImmediate(), container.getProvider("analytics-internal"));
    navigator.serviceWorker.addEventListener("message", (e2) => messageEventListener(messaging2, e2));
    return messaging2;
  };
  var WindowMessagingInternalFactory = (container) => {
    const messaging2 = container.getProvider("messaging").getImmediate();
    const messagingInternal = {
      getToken: (options) => getToken$1(messaging2, options)
    };
    return messagingInternal;
  };
  function registerMessagingInWindow() {
    _registerComponent(new Component(
      "messaging",
      WindowMessagingFactory,
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ));
    _registerComponent(new Component(
      "messaging-internal",
      WindowMessagingInternalFactory,
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    registerVersion(name6, version10);
    registerVersion(name6, version10, "esm2020");
  }
  async function isWindowSupported() {
    try {
      await validateIndexedDBOpenable();
    } catch (e2) {
      return false;
    }
    return typeof window !== "undefined" && isIndexedDBAvailable() && areCookiesEnabled() && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window && "fetch" in window && ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification") && PushSubscription.prototype.hasOwnProperty("getKey");
  }
  function getMessagingInWindow(app2 = getApp()) {
    isWindowSupported().then((isSupported2) => {
      if (!isSupported2) {
        throw ERROR_FACTORY4.create(
          "unsupported-browser"
          /* ErrorCode.UNSUPPORTED_BROWSER */
        );
      }
    }, (_) => {
      throw ERROR_FACTORY4.create(
        "indexed-db-unsupported"
        /* ErrorCode.INDEXED_DB_UNSUPPORTED */
      );
    });
    return _getProvider(getModularInstance(app2), "messaging").getImmediate();
  }
  registerMessagingInWindow();

  // src/config/firebase.js
  var import_meta3 = {};
  var firebaseConfig = {
    apiKey: import_meta3.env.VITE_FIREBASE_API_KEY,
    authDomain: import_meta3.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import_meta3.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import_meta3.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import_meta3.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import_meta3.env.VITE_FIREBASE_APP_ID,
    measurementId: import_meta3.env.VITE_FIREBASE_MEASUREMENT_ID
  };
  var app = initializeApp(firebaseConfig);
  var auth = getAuth(app);
  var googleProvider = new GoogleAuthProvider();
  var analytics = null;
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
  var messaging = null;
  isWindowSupported().then((supported) => {
    if (supported) {
      messaging = getMessagingInWindow(app);
    }
  });

  // src/context/AuthContext.jsx
  var AuthContext = (0, import_react5.createContext)();

  // src/context/SettingsContext.jsx
  var import_react6 = __toESM(__require("react"), 1);
  var SettingsContext = (0, import_react6.createContext)();
  var SETTINGS_CACHE_MS = 10 * 60 * 1e3;
  var useSettings = () => (0, import_react6.useContext)(SettingsContext);

  // src/context/CartContext.jsx
  var CartContext = (0, import_react7.createContext)();
  var useCart = () => (0, import_react7.useContext)(CartContext);

  // src/utils/imageUtils.js
  var getOptimizedImageUrl = (url, { format = "origin" } = {}) => {
    if (!url) return "";
    if (!url.includes("supabase.co")) return url;
    try {
      const urlObj = new URL(url);
      if (format !== "origin") {
        urlObj.searchParams.set("format", format);
      }
      return urlObj.toString();
    } catch {
      return url;
    }
  };

  // src/pages/Home.jsx
  var import_lucide_react2 = __require("lucide-react");

  // src/components/SEO.jsx
  var import_react12 = __toESM(__require("react"), 1);

  // node_modules/react-helmet-async/lib/index.esm.js
  var import_react8 = __toESM(__require("react"));
  var import_react_fast_compare = __toESM(require_react_fast_compare());
  var import_invariant = __toESM(require_browser());
  var import_react9 = __toESM(__require("react"));
  var import_react10 = __toESM(__require("react"));
  var import_react11 = __require("react");
  var import_shallowequal = __toESM(require_shallowequal());
  var TAG_NAMES = /* @__PURE__ */ ((TAG_NAMES2) => {
    TAG_NAMES2["BASE"] = "base";
    TAG_NAMES2["BODY"] = "body";
    TAG_NAMES2["HEAD"] = "head";
    TAG_NAMES2["HTML"] = "html";
    TAG_NAMES2["LINK"] = "link";
    TAG_NAMES2["META"] = "meta";
    TAG_NAMES2["NOSCRIPT"] = "noscript";
    TAG_NAMES2["SCRIPT"] = "script";
    TAG_NAMES2["STYLE"] = "style";
    TAG_NAMES2["TITLE"] = "title";
    TAG_NAMES2["FRAGMENT"] = "Symbol(react.fragment)";
    return TAG_NAMES2;
  })(TAG_NAMES || {});
  var SEO_PRIORITY_TAGS = {
    link: { rel: ["amphtml", "canonical", "alternate"] },
    script: { type: ["application/ld+json"] },
    meta: {
      charset: "",
      name: ["generator", "robots", "description"],
      property: [
        "og:type",
        "og:title",
        "og:url",
        "og:image",
        "og:image:alt",
        "og:description",
        "twitter:url",
        "twitter:title",
        "twitter:description",
        "twitter:image",
        "twitter:image:alt",
        "twitter:card",
        "twitter:site"
      ]
    }
  };
  var VALID_TAG_NAMES = Object.values(TAG_NAMES);
  var REACT_TAG_MAP = {
    accesskey: "accessKey",
    charset: "charSet",
    class: "className",
    contenteditable: "contentEditable",
    contextmenu: "contextMenu",
    "http-equiv": "httpEquiv",
    itemprop: "itemProp",
    tabindex: "tabIndex"
  };
  var HTML_TAG_MAP = Object.entries(REACT_TAG_MAP).reduce(
    (carry, [key, value]) => {
      carry[value] = key;
      return carry;
    },
    {}
  );
  var HELMET_ATTRIBUTE = "data-rh";
  var HELMET_PROPS = {
    DEFAULT_TITLE: "defaultTitle",
    DEFER: "defer",
    ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
    ON_CHANGE_CLIENT_STATE: "onChangeClientState",
    TITLE_TEMPLATE: "titleTemplate",
    PRIORITIZE_SEO_TAGS: "prioritizeSeoTags"
  };
  var getInnermostProperty = (propsList, property) => {
    for (let i2 = propsList.length - 1; i2 >= 0; i2 -= 1) {
      const props = propsList[i2];
      if (Object.prototype.hasOwnProperty.call(props, property)) {
        return props[property];
      }
    }
    return null;
  };
  var getTitleFromPropsList = (propsList) => {
    let innermostTitle = getInnermostProperty(
      propsList,
      "title"
      /* TITLE */
    );
    const innermostTemplate = getInnermostProperty(propsList, HELMET_PROPS.TITLE_TEMPLATE);
    if (Array.isArray(innermostTitle)) {
      innermostTitle = innermostTitle.join("");
    }
    if (innermostTemplate && innermostTitle) {
      return innermostTemplate.replace(/%s/g, () => innermostTitle);
    }
    const innermostDefaultTitle = getInnermostProperty(propsList, HELMET_PROPS.DEFAULT_TITLE);
    return innermostTitle || innermostDefaultTitle || void 0;
  };
  var getOnChangeClientState = (propsList) => getInnermostProperty(propsList, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || (() => {
  });
  var getAttributesFromPropsList = (tagType, propsList) => propsList.filter((props) => typeof props[tagType] !== "undefined").map((props) => props[tagType]).reduce((tagAttrs, current) => ({ ...tagAttrs, ...current }), {});
  var getBaseTagFromPropsList = (primaryAttributes, propsList) => propsList.filter((props) => typeof props[
    "base"
    /* BASE */
  ] !== "undefined").map((props) => props[
    "base"
    /* BASE */
  ]).reverse().reduce((innermostBaseTag, tag) => {
    if (!innermostBaseTag.length) {
      const keys = Object.keys(tag);
      for (let i2 = 0; i2 < keys.length; i2 += 1) {
        const attributeKey = keys[i2];
        const lowerCaseAttributeKey = attributeKey.toLowerCase();
        if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && tag[lowerCaseAttributeKey]) {
          return innermostBaseTag.concat(tag);
        }
      }
    }
    return innermostBaseTag;
  }, []);
  var warn = (msg) => console && typeof console.warn === "function" && console.warn(msg);
  var getTagsFromPropsList = (tagName, primaryAttributes, propsList) => {
    const approvedSeenTags = {};
    return propsList.filter((props) => {
      if (Array.isArray(props[tagName])) {
        return true;
      }
      if (typeof props[tagName] !== "undefined") {
        warn(
          `Helmet: ${tagName} should be of type "Array". Instead found type "${typeof props[tagName]}"`
        );
      }
      return false;
    }).map((props) => props[tagName]).reverse().reduce((approvedTags, instanceTags) => {
      const instanceSeenTags = {};
      instanceTags.filter((tag) => {
        let primaryAttributeKey;
        const keys2 = Object.keys(tag);
        for (let i2 = 0; i2 < keys2.length; i2 += 1) {
          const attributeKey = keys2[i2];
          const lowerCaseAttributeKey = attributeKey.toLowerCase();
          if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && !(primaryAttributeKey === "rel" && tag[primaryAttributeKey].toLowerCase() === "canonical") && !(lowerCaseAttributeKey === "rel" && tag[lowerCaseAttributeKey].toLowerCase() === "stylesheet")) {
            primaryAttributeKey = lowerCaseAttributeKey;
          }
          if (primaryAttributes.indexOf(attributeKey) !== -1 && (attributeKey === "innerHTML" || attributeKey === "cssText" || attributeKey === "itemprop")) {
            primaryAttributeKey = attributeKey;
          }
        }
        if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
          return false;
        }
        const value = tag[primaryAttributeKey].toLowerCase();
        if (!approvedSeenTags[primaryAttributeKey]) {
          approvedSeenTags[primaryAttributeKey] = {};
        }
        if (!instanceSeenTags[primaryAttributeKey]) {
          instanceSeenTags[primaryAttributeKey] = {};
        }
        if (!approvedSeenTags[primaryAttributeKey][value]) {
          instanceSeenTags[primaryAttributeKey][value] = true;
          return true;
        }
        return false;
      }).reverse().forEach((tag) => approvedTags.push(tag));
      const keys = Object.keys(instanceSeenTags);
      for (let i2 = 0; i2 < keys.length; i2 += 1) {
        const attributeKey = keys[i2];
        const tagUnion = {
          ...approvedSeenTags[attributeKey],
          ...instanceSeenTags[attributeKey]
        };
        approvedSeenTags[attributeKey] = tagUnion;
      }
      return approvedTags;
    }, []).reverse();
  };
  var getAnyTrueFromPropsList = (propsList, checkedTag) => {
    if (Array.isArray(propsList) && propsList.length) {
      for (let index = 0; index < propsList.length; index += 1) {
        const prop = propsList[index];
        if (prop[checkedTag]) {
          return true;
        }
      }
    }
    return false;
  };
  var reducePropsToState = (propsList) => ({
    baseTag: getBaseTagFromPropsList([
      "href"
      /* HREF */
    ], propsList),
    bodyAttributes: getAttributesFromPropsList("bodyAttributes", propsList),
    defer: getInnermostProperty(propsList, HELMET_PROPS.DEFER),
    encode: getInnermostProperty(propsList, HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
    htmlAttributes: getAttributesFromPropsList("htmlAttributes", propsList),
    linkTags: getTagsFromPropsList(
      "link",
      [
        "rel",
        "href"
        /* HREF */
      ],
      propsList
    ),
    metaTags: getTagsFromPropsList(
      "meta",
      [
        "name",
        "charset",
        "http-equiv",
        "property",
        "itemprop"
        /* ITEM_PROP */
      ],
      propsList
    ),
    noscriptTags: getTagsFromPropsList("noscript", [
      "innerHTML"
      /* INNER_HTML */
    ], propsList),
    onChangeClientState: getOnChangeClientState(propsList),
    scriptTags: getTagsFromPropsList(
      "script",
      [
        "src",
        "innerHTML"
        /* INNER_HTML */
      ],
      propsList
    ),
    styleTags: getTagsFromPropsList("style", [
      "cssText"
      /* CSS_TEXT */
    ], propsList),
    title: getTitleFromPropsList(propsList),
    titleAttributes: getAttributesFromPropsList("titleAttributes", propsList),
    prioritizeSeoTags: getAnyTrueFromPropsList(propsList, HELMET_PROPS.PRIORITIZE_SEO_TAGS)
  });
  var flattenArray = (possibleArray) => Array.isArray(possibleArray) ? possibleArray.join("") : possibleArray;
  var checkIfPropsMatch = (props, toMatch) => {
    const keys = Object.keys(props);
    for (let i2 = 0; i2 < keys.length; i2 += 1) {
      if (toMatch[keys[i2]] && toMatch[keys[i2]].includes(props[keys[i2]])) {
        return true;
      }
    }
    return false;
  };
  var prioritizer = (elementsList, propsToMatch) => {
    if (Array.isArray(elementsList)) {
      return elementsList.reduce(
        (acc, elementAttrs) => {
          if (checkIfPropsMatch(elementAttrs, propsToMatch)) {
            acc.priority.push(elementAttrs);
          } else {
            acc.default.push(elementAttrs);
          }
          return acc;
        },
        { priority: [], default: [] }
      );
    }
    return { default: elementsList, priority: [] };
  };
  var without = (obj, key) => {
    return {
      ...obj,
      [key]: void 0
    };
  };
  var SELF_CLOSING_TAGS = [
    "noscript",
    "script",
    "style"
    /* STYLE */
  ];
  var encodeSpecialCharacters = (str, encode2 = true) => {
    if (encode2 === false) {
      return String(str);
    }
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  };
  var generateElementAttributesAsString = (attributes) => Object.keys(attributes).reduce((str, key) => {
    const attr = typeof attributes[key] !== "undefined" ? `${key}="${attributes[key]}"` : `${key}`;
    return str ? `${str} ${attr}` : attr;
  }, "");
  var generateTitleAsString = (type, title, attributes, encode2) => {
    const attributeString = generateElementAttributesAsString(attributes);
    const flattenedTitle = flattenArray(title);
    return attributeString ? `<${type} ${HELMET_ATTRIBUTE}="true" ${attributeString}>${encodeSpecialCharacters(
      flattenedTitle,
      encode2
    )}</${type}>` : `<${type} ${HELMET_ATTRIBUTE}="true">${encodeSpecialCharacters(
      flattenedTitle,
      encode2
    )}</${type}>`;
  };
  var generateTagsAsString = (type, tags, encode2 = true) => tags.reduce((str, t2) => {
    const tag = t2;
    const attributeHtml = Object.keys(tag).filter(
      (attribute) => !(attribute === "innerHTML" || attribute === "cssText")
    ).reduce((string, attribute) => {
      const attr = typeof tag[attribute] === "undefined" ? attribute : `${attribute}="${encodeSpecialCharacters(tag[attribute], encode2)}"`;
      return string ? `${string} ${attr}` : attr;
    }, "");
    const tagContent = tag.innerHTML || tag.cssText || "";
    const isSelfClosing = SELF_CLOSING_TAGS.indexOf(type) === -1;
    return `${str}<${type} ${HELMET_ATTRIBUTE}="true" ${attributeHtml}${isSelfClosing ? `/>` : `>${tagContent}</${type}>`}`;
  }, "");
  var convertElementAttributesToReactProps = (attributes, initProps = {}) => Object.keys(attributes).reduce((obj, key) => {
    const mapped = REACT_TAG_MAP[key];
    obj[mapped || key] = attributes[key];
    return obj;
  }, initProps);
  var generateTitleAsReactComponent = (_type, title, attributes) => {
    const initProps = {
      key: title,
      [HELMET_ATTRIBUTE]: true
    };
    const props = convertElementAttributesToReactProps(attributes, initProps);
    return [import_react10.default.createElement("title", props, title)];
  };
  var generateTagsAsReactComponent = (type, tags) => tags.map((tag, i2) => {
    const mappedTag = {
      key: i2,
      [HELMET_ATTRIBUTE]: true
    };
    Object.keys(tag).forEach((attribute) => {
      const mapped = REACT_TAG_MAP[attribute];
      const mappedAttribute = mapped || attribute;
      if (mappedAttribute === "innerHTML" || mappedAttribute === "cssText") {
        const content = tag.innerHTML || tag.cssText;
        mappedTag.dangerouslySetInnerHTML = { __html: content };
      } else {
        mappedTag[mappedAttribute] = tag[attribute];
      }
    });
    return import_react10.default.createElement(type, mappedTag);
  });
  var getMethodsForTag = (type, tags, encode2 = true) => {
    switch (type) {
      case "title":
        return {
          toComponent: () => generateTitleAsReactComponent(type, tags.title, tags.titleAttributes),
          toString: () => generateTitleAsString(type, tags.title, tags.titleAttributes, encode2)
        };
      case "bodyAttributes":
      case "htmlAttributes":
        return {
          toComponent: () => convertElementAttributesToReactProps(tags),
          toString: () => generateElementAttributesAsString(tags)
        };
      default:
        return {
          toComponent: () => generateTagsAsReactComponent(type, tags),
          toString: () => generateTagsAsString(type, tags, encode2)
        };
    }
  };
  var getPriorityMethods = ({ metaTags, linkTags, scriptTags, encode: encode2 }) => {
    const meta = prioritizer(metaTags, SEO_PRIORITY_TAGS.meta);
    const link = prioritizer(linkTags, SEO_PRIORITY_TAGS.link);
    const script = prioritizer(scriptTags, SEO_PRIORITY_TAGS.script);
    const priorityMethods = {
      toComponent: () => [
        ...generateTagsAsReactComponent("meta", meta.priority),
        ...generateTagsAsReactComponent("link", link.priority),
        ...generateTagsAsReactComponent("script", script.priority)
      ],
      toString: () => (
        // generate all the tags as strings and concatenate them
        `${getMethodsForTag("meta", meta.priority, encode2)} ${getMethodsForTag(
          "link",
          link.priority,
          encode2
        )} ${getMethodsForTag("script", script.priority, encode2)}`
      )
    };
    return {
      priorityMethods,
      metaTags: meta.default,
      linkTags: link.default,
      scriptTags: script.default
    };
  };
  var mapStateOnServer = (props) => {
    const {
      baseTag,
      bodyAttributes,
      encode: encode2 = true,
      htmlAttributes,
      noscriptTags,
      styleTags,
      title = "",
      titleAttributes,
      prioritizeSeoTags
    } = props;
    let { linkTags, metaTags, scriptTags } = props;
    let priorityMethods = {
      toComponent: () => {
      },
      toString: () => ""
    };
    if (prioritizeSeoTags) {
      ({ priorityMethods, linkTags, metaTags, scriptTags } = getPriorityMethods(props));
    }
    return {
      priority: priorityMethods,
      base: getMethodsForTag("base", baseTag, encode2),
      bodyAttributes: getMethodsForTag("bodyAttributes", bodyAttributes, encode2),
      htmlAttributes: getMethodsForTag("htmlAttributes", htmlAttributes, encode2),
      link: getMethodsForTag("link", linkTags, encode2),
      meta: getMethodsForTag("meta", metaTags, encode2),
      noscript: getMethodsForTag("noscript", noscriptTags, encode2),
      script: getMethodsForTag("script", scriptTags, encode2),
      style: getMethodsForTag("style", styleTags, encode2),
      title: getMethodsForTag("title", { title, titleAttributes }, encode2)
    };
  };
  var server_default = mapStateOnServer;
  var instances2 = [];
  var isDocument = !!(typeof window !== "undefined" && window.document && window.document.createElement);
  var HelmetData = class {
    instances = [];
    canUseDOM = isDocument;
    context;
    value = {
      setHelmet: (serverState) => {
        this.context.helmet = serverState;
      },
      helmetInstances: {
        get: () => this.canUseDOM ? instances2 : this.instances,
        add: (instance) => {
          (this.canUseDOM ? instances2 : this.instances).push(instance);
        },
        remove: (instance) => {
          const index = (this.canUseDOM ? instances2 : this.instances).indexOf(instance);
          (this.canUseDOM ? instances2 : this.instances).splice(index, 1);
        }
      }
    };
    constructor(context, canUseDOM) {
      this.context = context;
      this.canUseDOM = canUseDOM || false;
      if (!canUseDOM) {
        context.helmet = server_default({
          baseTag: [],
          bodyAttributes: {},
          encodeSpecialCharacters: true,
          htmlAttributes: {},
          linkTags: [],
          metaTags: [],
          noscriptTags: [],
          scriptTags: [],
          styleTags: [],
          title: "",
          titleAttributes: {}
        });
      }
    }
  };
  var defaultValue = {};
  var Context = import_react9.default.createContext(defaultValue);
  var HelmetProvider = class _HelmetProvider extends import_react9.Component {
    static canUseDOM = isDocument;
    helmetData;
    constructor(props) {
      super(props);
      this.helmetData = new HelmetData(this.props.context || {}, _HelmetProvider.canUseDOM);
    }
    render() {
      return /* @__PURE__ */ import_react9.default.createElement(Context.Provider, { value: this.helmetData.value }, this.props.children);
    }
  };
  var updateTags = (type, tags) => {
    const headElement = document.head || document.querySelector(
      "head"
      /* HEAD */
    );
    const tagNodes = headElement.querySelectorAll(`${type}[${HELMET_ATTRIBUTE}]`);
    const oldTags = [].slice.call(tagNodes);
    const newTags = [];
    let indexToDelete;
    if (tags && tags.length) {
      tags.forEach((tag) => {
        const newElement = document.createElement(type);
        for (const attribute in tag) {
          if (Object.prototype.hasOwnProperty.call(tag, attribute)) {
            if (attribute === "innerHTML") {
              newElement.innerHTML = tag.innerHTML;
            } else if (attribute === "cssText") {
              if (newElement.styleSheet) {
                newElement.styleSheet.cssText = tag.cssText;
              } else {
                newElement.appendChild(document.createTextNode(tag.cssText));
              }
            } else {
              const attr = attribute;
              const value = typeof tag[attr] === "undefined" ? "" : tag[attr];
              newElement.setAttribute(attribute, value);
            }
          }
        }
        newElement.setAttribute(HELMET_ATTRIBUTE, "true");
        if (oldTags.some((existingTag, index) => {
          indexToDelete = index;
          return newElement.isEqualNode(existingTag);
        })) {
          oldTags.splice(indexToDelete, 1);
        } else {
          newTags.push(newElement);
        }
      });
    }
    oldTags.forEach((tag) => tag.parentNode?.removeChild(tag));
    newTags.forEach((tag) => headElement.appendChild(tag));
    return {
      oldTags,
      newTags
    };
  };
  var updateAttributes = (tagName, attributes) => {
    const elementTag = document.getElementsByTagName(tagName)[0];
    if (!elementTag) {
      return;
    }
    const helmetAttributeString = elementTag.getAttribute(HELMET_ATTRIBUTE);
    const helmetAttributes = helmetAttributeString ? helmetAttributeString.split(",") : [];
    const attributesToRemove = [...helmetAttributes];
    const attributeKeys = Object.keys(attributes);
    for (const attribute of attributeKeys) {
      const value = attributes[attribute] || "";
      if (elementTag.getAttribute(attribute) !== value) {
        elementTag.setAttribute(attribute, value);
      }
      if (helmetAttributes.indexOf(attribute) === -1) {
        helmetAttributes.push(attribute);
      }
      const indexToSave = attributesToRemove.indexOf(attribute);
      if (indexToSave !== -1) {
        attributesToRemove.splice(indexToSave, 1);
      }
    }
    for (let i2 = attributesToRemove.length - 1; i2 >= 0; i2 -= 1) {
      elementTag.removeAttribute(attributesToRemove[i2]);
    }
    if (helmetAttributes.length === attributesToRemove.length) {
      elementTag.removeAttribute(HELMET_ATTRIBUTE);
    } else if (elementTag.getAttribute(HELMET_ATTRIBUTE) !== attributeKeys.join(",")) {
      elementTag.setAttribute(HELMET_ATTRIBUTE, attributeKeys.join(","));
    }
  };
  var updateTitle = (title, attributes) => {
    if (typeof title !== "undefined" && document.title !== title) {
      document.title = flattenArray(title);
    }
    updateAttributes("title", attributes);
  };
  var commitTagChanges = (newState, cb) => {
    const {
      baseTag,
      bodyAttributes,
      htmlAttributes,
      linkTags,
      metaTags,
      noscriptTags,
      onChangeClientState,
      scriptTags,
      styleTags,
      title,
      titleAttributes
    } = newState;
    updateAttributes("body", bodyAttributes);
    updateAttributes("html", htmlAttributes);
    updateTitle(title, titleAttributes);
    const tagUpdates = {
      baseTag: updateTags("base", baseTag),
      linkTags: updateTags("link", linkTags),
      metaTags: updateTags("meta", metaTags),
      noscriptTags: updateTags("noscript", noscriptTags),
      scriptTags: updateTags("script", scriptTags),
      styleTags: updateTags("style", styleTags)
    };
    const addedTags = {};
    const removedTags = {};
    Object.keys(tagUpdates).forEach((tagType) => {
      const { newTags, oldTags } = tagUpdates[tagType];
      if (newTags.length) {
        addedTags[tagType] = newTags;
      }
      if (oldTags.length) {
        removedTags[tagType] = tagUpdates[tagType].oldTags;
      }
    });
    if (cb) {
      cb();
    }
    onChangeClientState(newState, addedTags, removedTags);
  };
  var _helmetCallback = null;
  var handleStateChangeOnClient = (newState) => {
    if (_helmetCallback) {
      cancelAnimationFrame(_helmetCallback);
    }
    if (newState.defer) {
      _helmetCallback = requestAnimationFrame(() => {
        commitTagChanges(newState, () => {
          _helmetCallback = null;
        });
      });
    } else {
      commitTagChanges(newState);
      _helmetCallback = null;
    }
  };
  var client_default = handleStateChangeOnClient;
  var HelmetDispatcher = class extends import_react11.Component {
    rendered = false;
    shouldComponentUpdate(nextProps) {
      return !(0, import_shallowequal.default)(nextProps, this.props);
    }
    componentDidUpdate() {
      this.emitChange();
    }
    componentWillUnmount() {
      const { helmetInstances } = this.props.context;
      helmetInstances.remove(this);
      this.emitChange();
    }
    emitChange() {
      const { helmetInstances, setHelmet } = this.props.context;
      let serverState = null;
      const state = reducePropsToState(
        helmetInstances.get().map((instance) => {
          const props = { ...instance.props };
          delete props.context;
          return props;
        })
      );
      if (HelmetProvider.canUseDOM) {
        client_default(state);
      } else if (server_default) {
        serverState = server_default(state);
      }
      setHelmet(serverState);
    }
    // componentWillMount will be deprecated
    // for SSR, initialize on first render
    // constructor is also unsafe in StrictMode
    init() {
      if (this.rendered) {
        return;
      }
      this.rendered = true;
      const { helmetInstances } = this.props.context;
      helmetInstances.add(this);
      this.emitChange();
    }
    render() {
      this.init();
      return null;
    }
  };
  var Helmet = class extends import_react8.Component {
    static defaultProps = {
      defer: true,
      encodeSpecialCharacters: true,
      prioritizeSeoTags: false
    };
    shouldComponentUpdate(nextProps) {
      return !(0, import_react_fast_compare.default)(without(this.props, "helmetData"), without(nextProps, "helmetData"));
    }
    mapNestedChildrenToProps(child, nestedChildren) {
      if (!nestedChildren) {
        return null;
      }
      switch (child.type) {
        case "script":
        case "noscript":
          return {
            innerHTML: nestedChildren
          };
        case "style":
          return {
            cssText: nestedChildren
          };
        default:
          throw new Error(
            `<${child.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
          );
      }
    }
    flattenArrayTypeChildren(child, arrayTypeChildren, newChildProps, nestedChildren) {
      return {
        ...arrayTypeChildren,
        [child.type]: [
          ...arrayTypeChildren[child.type] || [],
          {
            ...newChildProps,
            ...this.mapNestedChildrenToProps(child, nestedChildren)
          }
        ]
      };
    }
    mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren) {
      switch (child.type) {
        case "title":
          return {
            ...newProps,
            [child.type]: nestedChildren,
            titleAttributes: { ...newChildProps }
          };
        case "body":
          return {
            ...newProps,
            bodyAttributes: { ...newChildProps }
          };
        case "html":
          return {
            ...newProps,
            htmlAttributes: { ...newChildProps }
          };
        default:
          return {
            ...newProps,
            [child.type]: { ...newChildProps }
          };
      }
    }
    mapArrayTypeChildrenToProps(arrayTypeChildren, newProps) {
      let newFlattenedProps = { ...newProps };
      Object.keys(arrayTypeChildren).forEach((arrayChildName) => {
        newFlattenedProps = {
          ...newFlattenedProps,
          [arrayChildName]: arrayTypeChildren[arrayChildName]
        };
      });
      return newFlattenedProps;
    }
    warnOnInvalidChildren(child, nestedChildren) {
      (0, import_invariant.default)(
        VALID_TAG_NAMES.some((name7) => child.type === name7),
        typeof child.type === "function" ? `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.` : `Only elements types ${VALID_TAG_NAMES.join(
          ", "
        )} are allowed. Helmet does not support rendering <${child.type}> elements. Refer to our API for more information.`
      );
      (0, import_invariant.default)(
        !nestedChildren || typeof nestedChildren === "string" || Array.isArray(nestedChildren) && !nestedChildren.some((nestedChild) => typeof nestedChild !== "string"),
        `Helmet expects a string as a child of <${child.type}>. Did you forget to wrap your children in braces? ( <${child.type}>{\`\`}</${child.type}> ) Refer to our API for more information.`
      );
      return true;
    }
    mapChildrenToProps(children, newProps) {
      let arrayTypeChildren = {};
      import_react8.default.Children.forEach(children, (child) => {
        if (!child || !child.props) {
          return;
        }
        const { children: nestedChildren, ...childProps } = child.props;
        const newChildProps = Object.keys(childProps).reduce((obj, key) => {
          obj[HTML_TAG_MAP[key] || key] = childProps[key];
          return obj;
        }, {});
        let { type } = child;
        if (typeof type === "symbol") {
          type = type.toString();
        } else {
          this.warnOnInvalidChildren(child, nestedChildren);
        }
        switch (type) {
          case "Symbol(react.fragment)":
            newProps = this.mapChildrenToProps(nestedChildren, newProps);
            break;
          case "link":
          case "meta":
          case "noscript":
          case "script":
          case "style":
            arrayTypeChildren = this.flattenArrayTypeChildren(
              child,
              arrayTypeChildren,
              newChildProps,
              nestedChildren
            );
            break;
          default:
            newProps = this.mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren);
            break;
        }
      });
      return this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
    }
    render() {
      const { children, ...props } = this.props;
      let newProps = { ...props };
      let { helmetData } = props;
      if (children) {
        newProps = this.mapChildrenToProps(children, newProps);
      }
      if (helmetData && !(helmetData instanceof HelmetData)) {
        const data = helmetData;
        helmetData = new HelmetData(data.context, true);
        delete newProps.helmetData;
      }
      return helmetData ? /* @__PURE__ */ import_react8.default.createElement(HelmetDispatcher, { ...newProps, context: helmetData.value }) : /* @__PURE__ */ import_react8.default.createElement(Context.Consumer, null, (context) => /* @__PURE__ */ import_react8.default.createElement(HelmetDispatcher, { ...newProps, context }));
    }
  };

  // src/components/SEO.jsx
  var SEO = ({ title, description, keywords }) => {
    const siteTitle = "Enbroidery | Handcrafted Threads";
    const fullTitle = title ? `${title} | Enbroidery` : siteTitle;
    return /* @__PURE__ */ import_react12.default.createElement(Helmet, null, /* @__PURE__ */ import_react12.default.createElement("title", null, fullTitle), /* @__PURE__ */ import_react12.default.createElement("meta", { name: "description", content: description || "Discover handcrafted embroidery and bespoke mehndi designs tailored for your special occasions." }), keywords && /* @__PURE__ */ import_react12.default.createElement("meta", { name: "keywords", content: keywords }), /* @__PURE__ */ import_react12.default.createElement("meta", { property: "og:type", content: "website" }), /* @__PURE__ */ import_react12.default.createElement("meta", { property: "og:title", content: fullTitle }), /* @__PURE__ */ import_react12.default.createElement("meta", { property: "og:description", content: description || "Handcrafted embroidery and henna art." }), /* @__PURE__ */ import_react12.default.createElement("meta", { name: "twitter:card", content: "summary_large_image" }), /* @__PURE__ */ import_react12.default.createElement("meta", { name: "twitter:title", content: fullTitle }), /* @__PURE__ */ import_react12.default.createElement("meta", { name: "twitter:description", content: description }));
  };
  var SEO_default = SEO;

  // src/components/AutoSlideImage.jsx
  var import_react13 = __toESM(__require("react"), 1);
  var AutoSlideImage = ({ product, className = "" }) => {
    const [currentIndex, setCurrentIndex] = (0, import_react13.useState)(0);
    const [isHovering, setIsHovering] = (0, import_react13.useState)(false);
    const [isVisible, setIsVisible] = (0, import_react13.useState)(false);
    const containerRef = (0, import_react13.useRef)(null);
    const timerRef = (0, import_react13.useRef)(null);
    const touchStartX = (0, import_react13.useRef)(0);
    const touchEndX = (0, import_react13.useRef)(0);
    const allImages = (0, import_react13.useMemo)(() => {
      const imgs = [];
      if (product.images && product.images.length > 0) {
        imgs.push(...product.images.filter(Boolean));
      } else if (product.image) {
        imgs.push(product.image);
      }
      return imgs;
    }, [product.images, product.image]);
    const hasMultiple = allImages.length > 1;
    (0, import_react13.useEffect)(() => {
      if (!hasMultiple || !containerRef.current) return;
      const observer = new IntersectionObserver(
        ([entry]) => setIsVisible(entry.isIntersecting),
        { threshold: 0.5 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, [hasMultiple]);
    (0, import_react13.useEffect)(() => {
      if (!hasMultiple) return;
      if (isHovering || isVisible) {
        timerRef.current = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % allImages.length);
        }, isHovering ? 1500 : 2500);
      }
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, [isHovering, isVisible, hasMultiple, allImages.length]);
    const onTouchStart = (e2) => {
      touchStartX.current = e2.touches[0].clientX;
    };
    const onTouchMove = (e2) => {
      touchEndX.current = e2.touches[0].clientX;
    };
    const onTouchEnd = () => {
      if (!hasMultiple) return;
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 40) {
        setCurrentIndex(
          (prev) => diff > 0 ? (prev + 1) % allImages.length : (prev - 1 + allImages.length) % allImages.length
        );
      }
    };
    return /* @__PURE__ */ import_react13.default.createElement(
      "div",
      {
        ref: containerRef,
        className,
        onMouseEnter: () => setIsHovering(true),
        onMouseLeave: () => {
          setIsHovering(false);
          setCurrentIndex(0);
        },
        onTouchStart,
        onTouchMove,
        onTouchEnd
      },
      allImages.map((img, idx) => /* @__PURE__ */ import_react13.default.createElement(
        "img",
        {
          key: idx,
          src: getOptimizedImageUrl(img, { width: 400, quality: 80 }),
          alt: `${product.name} ${idx + 1}`,
          loading: idx === 0 ? "eager" : "lazy",
          decoding: "async",
          style: {
            transition: "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: idx === currentIndex ? 1 : 0,
            transform: idx === currentIndex ? "scale(1)" : "scale(1.06)",
            zIndex: idx === currentIndex ? 2 : 1
          },
          className: "absolute inset-0 w-full h-full object-cover"
        }
      )),
      hasMultiple && /* @__PURE__ */ import_react13.default.createElement("div", { className: "absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20" }, allImages.map((_, idx) => /* @__PURE__ */ import_react13.default.createElement(
        "button",
        {
          key: idx,
          onClick: (e2) => {
            e2.preventDefault();
            e2.stopPropagation();
            setCurrentIndex(idx);
          },
          className: `rounded-full transition-all duration-300 ${idx === currentIndex ? "w-4 h-1.5 bg-white shadow-md" : "w-1.5 h-1.5 bg-white/50"}`,
          "aria-label": `Image ${idx + 1}`
        }
      )))
    );
  };
  var AutoSlideImage_default = AutoSlideImage;

  // src/pages/Home.jsx
  var import_framer_motion = __require("framer-motion");
  var containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  var itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  var ScrollRevealSection = ({ children, className }) => {
    return /* @__PURE__ */ import_react14.default.createElement(
      import_framer_motion.motion.section,
      {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.15 },
        variants: containerVariants,
        className
      },
      children
    );
  };
  var Home = () => {
    const { products } = useProducts();
    const { categories } = useCategories();
    const { FREE_DELIVERY_THRESHOLD } = useCart();
    const { settings } = useSettings();
    const sliderImages = [
      settings.home_slider_image_1,
      settings.home_slider_image_2,
      settings.home_slider_image_3
    ];
    const storyImage1 = settings.home_brand_story_image_1;
    const storyImage2 = settings.home_brand_story_image_2;
    const [currentSlide, setCurrentSlide] = (0, import_react14.useState)(0);
    const [touchStart, setTouchStart] = (0, import_react14.useState)(null);
    const [touchEnd, setTouchEnd] = (0, import_react14.useState)(null);
    const minSwipeDistance = 50;
    const onTouchStart = (e2) => {
      setTouchEnd(null);
      setTouchStart(e2.targetTouches[0].clientX);
    };
    const onTouchMove = (e2) => setTouchEnd(e2.targetTouches[0].clientX);
    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      if (isLeftSwipe) {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }
      if (isRightSwipe) {
        setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
      }
    };
    (0, import_react14.useEffect)(() => {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 5e3);
      return () => clearInterval(timer);
    }, [sliderImages.length]);
    const featuredProducts = (0, import_react14.useMemo)(() => {
      return products.slice(0, 8);
    }, [products]);
    const dynamicCategories = (0, import_react14.useMemo)(() => {
      return categories.map((cat) => {
        const normalize = (str) => (str || "").toLowerCase().trim();
        const product = products.find((p) => normalize(p.category) === normalize(cat.label) && (p.image || p.images?.length > 0));
        return {
          id: cat.id,
          label: cat.label,
          image: product ? product.image || product.images[0] : "https://images.unsplash.com/photo-1616627561839-074385245eb6?q=80&w=600&auto=format&fit=crop"
        };
      });
    }, [categories, products]);
    return /* @__PURE__ */ import_react14.default.createElement("div", { className: "font-body selection:bg-rose-100 selection:text-rose-900" }, /* @__PURE__ */ import_react14.default.createElement(
      SEO_default,
      {
        title: "Home",
        description: "Welcome to Sana's Hand Embroidery. Explore handcrafted embroidery art, clothing, and custom designs."
      }
    ), /* @__PURE__ */ import_react14.default.createElement(
      "section",
      {
        className: "relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-stone-900",
        onTouchStart,
        onTouchMove,
        onTouchEnd
      },
      sliderImages.map((img, idx) => /* @__PURE__ */ import_react14.default.createElement(
        "div",
        {
          key: idx,
          className: `absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"}`
        },
        /* @__PURE__ */ import_react14.default.createElement(
          "img",
          {
            src: getOptimizedImageUrl(img, { width: 1200, quality: 80 }),
            alt: `Slide ${idx + 1}`,
            className: "w-full h-full object-cover opacity-40",
            loading: idx === 0 ? "eager" : "lazy",
            fetchPriority: idx === 0 ? "high" : "low",
            decoding: idx === 0 ? "sync" : "async"
          }
        ),
        /* @__PURE__ */ import_react14.default.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" })
      )),
      /* @__PURE__ */ import_react14.default.createElement("div", { className: "absolute inset-0 flex items-end justify-center pb-16 md:pb-24 z-10 px-4" }, /* @__PURE__ */ import_react14.default.createElement(
        import_framer_motion.motion.div,
        {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay: 0.5, ease: "easeOut" },
          className: "text-center text-white"
        },
        /* @__PURE__ */ import_react14.default.createElement("h1", { className: "text-4xl md:text-7xl font-heading mb-3 md:mb-4 drop-shadow-md leading-tight" }, settings.home_hero_title),
        /* @__PURE__ */ import_react14.default.createElement("p", { className: "text-base md:text-2xl font-light tracking-wide drop-shadow-sm mb-6 md:mb-8 text-white/90" }, settings.home_hero_subtitle),
        /* @__PURE__ */ import_react14.default.createElement("div", { className: "flex items-center justify-center gap-3 flex-wrap" }, /* @__PURE__ */ import_react14.default.createElement(
          import_react_router_dom.Link,
          {
            to: "/shop",
            className: "px-7 py-3 bg-white text-stone-900 rounded-full font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-rose-50 transition-all shadow-lg hover:-translate-y-1 active:scale-95 duration-300"
          },
          "Shop Now"
        ), /* @__PURE__ */ import_react14.default.createElement(
          import_react_router_dom.Link,
          {
            to: "/custom-design",
            className: "px-7 py-3 bg-transparent border-2 border-white/70 text-white rounded-full font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-white/10 transition-all hover:-translate-y-1 active:scale-95 duration-300"
          },
          "Custom Design"
        ))
      )),
      /* @__PURE__ */ import_react14.default.createElement(
        "button",
        {
          onClick: () => setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length),
          className: "absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all z-10 hidden md:block",
          "aria-label": "Previous slide"
        },
        /* @__PURE__ */ import_react14.default.createElement(import_lucide_react2.ChevronLeft, { className: "w-6 h-6" })
      ),
      /* @__PURE__ */ import_react14.default.createElement(
        "button",
        {
          onClick: () => setCurrentSlide((prev) => (prev + 1) % sliderImages.length),
          className: "absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all z-10 hidden md:block",
          "aria-label": "Next slide"
        },
        /* @__PURE__ */ import_react14.default.createElement(import_lucide_react2.ChevronRight, { className: "w-6 h-6" })
      ),
      /* @__PURE__ */ import_react14.default.createElement("div", { className: "absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10" }, sliderImages.map((_, idx) => /* @__PURE__ */ import_react14.default.createElement(
        "button",
        {
          key: idx,
          onClick: () => setCurrentSlide(idx),
          className: `h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-white w-8" : "bg-white/40 w-2.5"}`
        }
      )))
    ), /* @__PURE__ */ import_react14.default.createElement("section", { className: "bg-stone-50 border-b border-stone-100 overflow-hidden" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "hidden md:block container-custom py-6" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "grid grid-cols-3 gap-6 text-center divide-x divide-stone-200" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "flex flex-col items-center gap-2" }, /* @__PURE__ */ import_react14.default.createElement(import_lucide_react2.Truck, { className: "w-6 h-6 text-rose-900" }), /* @__PURE__ */ import_react14.default.createElement("h4", { className: "font-bold text-stone-900 text-sm" }, "Free Shipping"), /* @__PURE__ */ import_react14.default.createElement("p", { className: "text-xs text-stone-500" }, "On all orders above \u20B9", FREE_DELIVERY_THRESHOLD)), /* @__PURE__ */ import_react14.default.createElement("div", { className: "flex flex-col items-center gap-2" }, /* @__PURE__ */ import_react14.default.createElement(import_lucide_react2.Shield, { className: "w-6 h-6 text-rose-900" }), /* @__PURE__ */ import_react14.default.createElement("h4", { className: "font-bold text-stone-900 text-sm" }, "Secure Checkout"), /* @__PURE__ */ import_react14.default.createElement("p", { className: "text-xs text-stone-500" }, "100% encrypted payment")), /* @__PURE__ */ import_react14.default.createElement("div", { className: "flex flex-col items-center gap-2" }, /* @__PURE__ */ import_react14.default.createElement(import_lucide_react2.Award, { className: "w-6 h-6 text-rose-900" }), /* @__PURE__ */ import_react14.default.createElement("h4", { className: "font-bold text-stone-900 text-sm" }, "Premium Quality"), /* @__PURE__ */ import_react14.default.createElement("p", { className: "text-xs text-stone-500" }, "Handcrafted with perfection")))), /* @__PURE__ */ import_react14.default.createElement("div", { className: "md:hidden py-4 px-4" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "grid grid-cols-3 gap-2" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "flex flex-col items-center gap-1.5 py-2.5 px-1 bg-white rounded-xl border border-stone-100 shadow-sm" }, /* @__PURE__ */ import_react14.default.createElement(import_lucide_react2.Truck, { className: "w-5 h-5 text-rose-900" }), /* @__PURE__ */ import_react14.default.createElement("span", { className: "text-[10px] font-bold text-stone-800 text-center leading-tight" }, "Free Delivery"), /* @__PURE__ */ import_react14.default.createElement("span", { className: "text-[8px] text-stone-400" }, "\u20B9", FREE_DELIVERY_THRESHOLD, "+")), /* @__PURE__ */ import_react14.default.createElement("div", { className: "flex flex-col items-center gap-1.5 py-2.5 px-1 bg-white rounded-xl border border-stone-100 shadow-sm" }, /* @__PURE__ */ import_react14.default.createElement(import_lucide_react2.Shield, { className: "w-5 h-5 text-rose-900" }), /* @__PURE__ */ import_react14.default.createElement("span", { className: "text-[10px] font-bold text-stone-800 text-center leading-tight" }, "Secure Pay"), /* @__PURE__ */ import_react14.default.createElement("span", { className: "text-[8px] text-stone-400" }, "Encrypted")), /* @__PURE__ */ import_react14.default.createElement("div", { className: "flex flex-col items-center gap-1.5 py-2.5 px-1 bg-white rounded-xl border border-stone-100 shadow-sm" }, /* @__PURE__ */ import_react14.default.createElement(import_lucide_react2.Award, { className: "w-5 h-5 text-rose-900" }), /* @__PURE__ */ import_react14.default.createElement("span", { className: "text-[10px] font-bold text-stone-800 text-center leading-tight" }, "Premium"), /* @__PURE__ */ import_react14.default.createElement("span", { className: "text-[8px] text-stone-400" }, "Handcrafted"))))), /* @__PURE__ */ import_react14.default.createElement("section", { className: "py-12 md:py-20 bg-white" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "container-custom" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "max-w-xl text-center md:text-left w-full md:w-auto" }, /* @__PURE__ */ import_react14.default.createElement("span", { className: "text-rose-900 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-2 block" }, "Collections"), /* @__PURE__ */ import_react14.default.createElement("h2", { className: "text-3xl md:text-4xl font-heading text-stone-900" }, "Shop by Category")), /* @__PURE__ */ import_react14.default.createElement(import_react_router_dom.Link, { to: "/shop", className: "hidden md:flex group items-center gap-2 text-sm font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors" }, "View Full Catalog", /* @__PURE__ */ import_react14.default.createElement(import_lucide_react2.ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" }))), /* @__PURE__ */ import_react14.default.createElement(
      import_framer_motion.motion.div,
      {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.1 },
        variants: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
          }
        },
        className: "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-8"
      },
      dynamicCategories.map((category) => /* @__PURE__ */ import_react14.default.createElement(import_framer_motion.motion.div, { key: category.id, variants: itemVariants }, /* @__PURE__ */ import_react14.default.createElement(
        import_react_router_dom.Link,
        {
          to: `/shop?category=${encodeURIComponent(category.label)}`,
          className: "group flex flex-col items-center gap-2 md:gap-4"
        },
        /* @__PURE__ */ import_react14.default.createElement("div", { className: "relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-2 border-transparent group-hover:border-rose-200 transition-all duration-300 shadow-sm group-hover:shadow-lg" }, /* @__PURE__ */ import_react14.default.createElement(
          "img",
          {
            src: getOptimizedImageUrl(category.image, { width: 300, quality: 80 }),
            alt: category.label,
            loading: "lazy",
            decoding: "async",
            className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          }
        ), /* @__PURE__ */ import_react14.default.createElement("div", { className: "absolute inset-0 bg-rose-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" }, /* @__PURE__ */ import_react14.default.createElement("span", { className: "text-white text-[10px] md:text-xs font-bold uppercase tracking-wider text-center px-2" }, category.label))),
        /* @__PURE__ */ import_react14.default.createElement("div", { className: "flex items-center gap-1 md:gap-2 text-stone-800 group-hover:text-rose-900 transition-colors" }, /* @__PURE__ */ import_react14.default.createElement("span", { className: "font-heading font-medium text-[11px] md:text-lg text-center leading-tight" }, category.label), /* @__PURE__ */ import_react14.default.createElement(import_lucide_react2.ArrowRight, { className: "w-3 h-3 md:w-4 md:h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden md:block" }))
      )))
    ), /* @__PURE__ */ import_react14.default.createElement("div", { className: "text-center mt-8 md:hidden" }, /* @__PURE__ */ import_react14.default.createElement(import_react_router_dom.Link, { to: "/shop", className: "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors border-b border-stone-300 pb-1" }, "View Full Catalog", /* @__PURE__ */ import_react14.default.createElement(import_lucide_react2.ArrowRight, { className: "w-3 h-3" }))))), /* @__PURE__ */ import_react14.default.createElement(ScrollRevealSection, { className: "py-12 md:py-24 bg-[#fdfbf7]" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "container-custom" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "text-center max-w-2xl mx-auto mb-12" }, /* @__PURE__ */ import_react14.default.createElement("span", { className: "text-rose-500 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-3 block" }, "Fresh from the studio"), /* @__PURE__ */ import_react14.default.createElement("h2", { className: "text-3xl md:text-5xl font-heading text-stone-900 leading-tight" }, "New Arrivals")), /* @__PURE__ */ import_react14.default.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8" }, featuredProducts.map((product) => /* @__PURE__ */ import_react14.default.createElement(import_framer_motion.motion.div, { key: product.id, variants: itemVariants }, /* @__PURE__ */ import_react14.default.createElement(import_react_router_dom.Link, { to: `/product/${product.id}`, className: "group relative block" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "relative aspect-[2/3] bg-white rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2" }, /* @__PURE__ */ import_react14.default.createElement(
      AutoSlideImage_default,
      {
        product,
        className: "absolute inset-0 w-full h-full"
      }
    )), /* @__PURE__ */ import_react14.default.createElement("div", null, /* @__PURE__ */ import_react14.default.createElement("div", { className: "flex justify-between items-start" }, /* @__PURE__ */ import_react14.default.createElement("div", null, /* @__PURE__ */ import_react14.default.createElement("h3", { className: "font-heading font-bold text-stone-900 text-base md:text-lg group-hover:text-rose-900 transition-colors line-clamp-1" }, product.name), /* @__PURE__ */ import_react14.default.createElement("p", { className: "text-stone-500 text-xs md:text-sm mt-1 capitalize" }, product.category)), /* @__PURE__ */ import_react14.default.createElement("div", { className: "text-right pl-2" }, /* @__PURE__ */ import_react14.default.createElement("p", { className: "font-bold text-stone-900 text-sm md:text-base" }, "\u20B9", product.price.toLocaleString()), product.originalPrice > product.price && /* @__PURE__ */ import_react14.default.createElement("p", { className: "text-[10px] md:text-xs text-stone-400 line-through" }, "\u20B9", product.originalPrice.toLocaleString())))))))), /* @__PURE__ */ import_react14.default.createElement("div", { className: "text-center mt-10 md:mt-16" }, /* @__PURE__ */ import_react14.default.createElement(import_react_router_dom.Link, { to: "/shop", className: "inline-flex items-center gap-2 px-8 py-3 bg-rose-900 text-white rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-rose-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5" }, "View All Products")))), categories.map((category) => {
      const normalize = (str) => (str || "").toLowerCase().trim();
      const categoryProducts = products.filter((p) => normalize(p.category) === normalize(category.label)).slice(0, 8);
      if (categoryProducts.length === 0) return null;
      return /* @__PURE__ */ import_react14.default.createElement(ScrollRevealSection, { key: category.id, className: "py-12 md:py-24 bg-white even:bg-[#fdfbf7]" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "container-custom" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "text-center max-w-2xl mx-auto mb-12" }, /* @__PURE__ */ import_react14.default.createElement("h2", { className: "text-3xl md:text-5xl font-heading text-stone-900 leading-tight" }, category.label)), /* @__PURE__ */ import_react14.default.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8" }, categoryProducts.map((product) => /* @__PURE__ */ import_react14.default.createElement(import_react_router_dom.Link, { key: product.id, to: `/product/${product.id}`, className: "group relative" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "relative aspect-[2/3] bg-white rounded-2xl overflow-hidden mb-4 shadow-sm border border-stone-100" }, /* @__PURE__ */ import_react14.default.createElement(
        AutoSlideImage_default,
        {
          product,
          className: "absolute inset-0 w-full h-full"
        }
      )), /* @__PURE__ */ import_react14.default.createElement("div", null, /* @__PURE__ */ import_react14.default.createElement("div", { className: "flex justify-between items-start" }, /* @__PURE__ */ import_react14.default.createElement("div", null, /* @__PURE__ */ import_react14.default.createElement("h3", { className: "font-heading font-bold text-stone-900 text-base md:text-lg group-hover:text-rose-900 transition-colors line-clamp-1" }, product.name), /* @__PURE__ */ import_react14.default.createElement("p", { className: "text-stone-500 text-xs md:text-sm mt-1 capitalize" }, product.category)), /* @__PURE__ */ import_react14.default.createElement("div", { className: "text-right pl-2" }, /* @__PURE__ */ import_react14.default.createElement("p", { className: "font-bold text-stone-900 text-sm md:text-base" }, "\u20B9", product.price.toLocaleString()), product.originalPrice > product.price && /* @__PURE__ */ import_react14.default.createElement("p", { className: "text-[10px] md:text-xs text-stone-400 line-through" }, "\u20B9", product.originalPrice.toLocaleString()))))))), /* @__PURE__ */ import_react14.default.createElement("div", { className: "text-center mt-10 md:mt-16" }, /* @__PURE__ */ import_react14.default.createElement(import_react_router_dom.Link, { to: `/shop?category=${encodeURIComponent(category.label)}`, className: "inline-flex items-center gap-2 px-8 py-3 bg-rose-900 text-white rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-rose-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5" }, "View All ", category.label))));
    }), /* @__PURE__ */ import_react14.default.createElement("section", { className: "py-10 md:py-24 bg-stone-900 text-white overflow-hidden relative" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "absolute top-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-rose-900/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" }), /* @__PURE__ */ import_react14.default.createElement("div", { className: "container-custom grid lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "space-y-6 md:space-y-8 text-center lg:text-left" }, /* @__PURE__ */ import_react14.default.createElement("div", null, /* @__PURE__ */ import_react14.default.createElement("span", { className: "text-rose-400 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-2 md:mb-4 block" }, "Our Process"), /* @__PURE__ */ import_react14.default.createElement("h2", { className: "text-3xl md:text-4xl lg:text-5xl font-heading mb-4 md:mb-6 leading-tight" }, "Every Stitch Tells a ", /* @__PURE__ */ import_react14.default.createElement("br", null), /* @__PURE__ */ import_react14.default.createElement("span", { className: "text-rose-400 font-serif italic" }, "Beautiful Story")), /* @__PURE__ */ import_react14.default.createElement("p", { className: "text-stone-400 text-base md:text-lg leading-relaxed" }, "We believe in the power of handmade. In a world of fast fashion, we slow down to create meaningful pieces that last a lifetime. Each hoop, each dress, and each design is crafted with patience and precision.")), /* @__PURE__ */ import_react14.default.createElement("div", { className: "grid sm:grid-cols-2 gap-6 md:gap-8 pt-6 md:pt-8 border-t border-stone-800 text-left" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "flex gap-4" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "w-10 h-10 md:w-12 md:h-12 rounded-full bg-stone-800 flex items-center justify-center shrink-0" }, /* @__PURE__ */ import_react14.default.createElement(import_lucide_react2.Scissors, { className: "w-5 h-5 md:w-6 md:h-6 text-white" })), /* @__PURE__ */ import_react14.default.createElement("div", null, /* @__PURE__ */ import_react14.default.createElement("h4", { className: "font-bold text-base md:text-lg mb-1" }, "Custom Fit"), /* @__PURE__ */ import_react14.default.createElement("p", { className: "text-stone-400 text-xs md:text-sm" }, "Tailored specifically to your measurements and style preferences."))), /* @__PURE__ */ import_react14.default.createElement("div", { className: "flex gap-4" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "w-10 h-10 md:w-12 md:h-12 rounded-full bg-stone-800 flex items-center justify-center shrink-0" }, /* @__PURE__ */ import_react14.default.createElement(import_lucide_react2.Heart, { className: "w-5 h-5 md:w-6 md:h-6 text-white" })), /* @__PURE__ */ import_react14.default.createElement("div", null, /* @__PURE__ */ import_react14.default.createElement("h4", { className: "font-bold text-base md:text-lg mb-1" }, "Handmade Love"), /* @__PURE__ */ import_react14.default.createElement("p", { className: "text-stone-400 text-xs md:text-sm" }, "Crafted by skilled artisans who pour their heart into every stitch."))))), /* @__PURE__ */ import_react14.default.createElement("div", { className: "relative mt-8 lg:mt-0" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "flex gap-4 lg:hidden" }, /* @__PURE__ */ import_react14.default.createElement(
      "img",
      {
        src: getOptimizedImageUrl(storyImage1, { width: 400, quality: 80 }),
        alt: "Artisan working",
        loading: "lazy",
        decoding: "async",
        className: "w-1/2 rounded-2xl shadow-lg border-2 border-stone-800"
      }
    ), /* @__PURE__ */ import_react14.default.createElement(
      "img",
      {
        src: getOptimizedImageUrl(storyImage2, { width: 400, quality: 80 }),
        alt: "Finished embroidery",
        loading: "lazy",
        decoding: "async",
        className: "w-1/2 rounded-2xl shadow-lg border-2 border-stone-800 self-end"
      }
    )), /* @__PURE__ */ import_react14.default.createElement("div", { className: "aspect-square relative z-10 hidden lg:block" }, /* @__PURE__ */ import_react14.default.createElement(
      "img",
      {
        src: getOptimizedImageUrl(storyImage1, { width: 600, quality: 80 }),
        alt: "Artisan working",
        loading: "lazy",
        decoding: "async",
        className: "w-1/2 absolute top-0 left-0 rounded-2xl shadow-2xl border-4 border-stone-800 hover:scale-105 transition-transform duration-500 z-20"
      }
    ), /* @__PURE__ */ import_react14.default.createElement(
      "img",
      {
        src: getOptimizedImageUrl(storyImage2, { width: 600, quality: 80 }),
        alt: "Finished embroidery",
        loading: "lazy",
        decoding: "async",
        className: "w-2/3 absolute bottom-0 right-0 rounded-2xl shadow-2xl border-4 border-stone-800 hover:scale-105 transition-transform duration-500 z-10"
      }
    )), /* @__PURE__ */ import_react14.default.createElement("div", { className: "hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-stone-700/50 rounded-full animate-spin-slow pointer-events-none" })))), /* @__PURE__ */ import_react14.default.createElement("section", { className: "py-16 md:py-24 bg-stone-50 border-t border-stone-100" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "container-custom" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "text-center max-w-2xl mx-auto mb-12 flex flex-col items-center" }, /* @__PURE__ */ import_react14.default.createElement(import_lucide_react2.MessageSquare, { className: "w-8 h-8 text-rose-300 mb-4" }), /* @__PURE__ */ import_react14.default.createElement("h2", { className: "text-3xl md:text-5xl font-heading text-stone-900 leading-tight" }, "Happy Customers")), /* @__PURE__ */ import_react14.default.createElement("div", { className: "grid md:grid-cols-3 gap-8" }, [
      { name: "Priya S.", text: "The embroidery detail on my hoop was absolutely phenomenal. I could see the love and care put into every stitch. Highly recommend Sana's work!" },
      { name: "Anjali K.", text: "Ordered a custom tailored suit with floral embroidery. It fits perfectly and the design is just so unique. Worth every penny." },
      { name: "Roshni M.", text: "Fast shipping, brilliant secure packaging, and the quality of the tote bag exceeded my expectations. Will definitely order again." }
    ].map((review, i2) => /* @__PURE__ */ import_react14.default.createElement("div", { key: i2, className: "bg-white p-8 rounded-2xl shadow-sm border border-stone-100 relative group transition-transform hover:-translate-y-1" }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "flex text-amber-400 mb-4" }, [...Array(5)].map((_, j) => /* @__PURE__ */ import_react14.default.createElement(import_lucide_react2.Star, { key: j, className: "w-4 h-4 fill-current" }))), /* @__PURE__ */ import_react14.default.createElement("p", { className: "text-stone-600 text-sm md:text-base italic mb-6 leading-relaxed" }, '"', review.text, '"'), /* @__PURE__ */ import_react14.default.createElement("p", { className: "font-bold text-stone-900 font-heading" }, review.name)))))));
  };
  var Home_default = Home;
})();
/*! Bundled license information:

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/logger/dist/esm/index.esm.js:
@firebase/messaging/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/installations/dist/esm/index.esm.js:
@firebase/analytics/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/installations/dist/esm/index.esm.js:
@firebase/installations/dist/esm/index.esm.js:
@firebase/installations/dist/esm/index.esm.js:
@firebase/installations/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/installations/dist/esm/index.esm.js:
@firebase/messaging/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/auth/dist/esm/index-36fcbc82.js:
@firebase/analytics/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-36fcbc82.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-36fcbc82.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-36fcbc82.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-36fcbc82.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-36fcbc82.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
   * in compliance with the License. You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under the License
   * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
   * or implied. See the License for the specific language governing permissions and limitations under
   * the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
