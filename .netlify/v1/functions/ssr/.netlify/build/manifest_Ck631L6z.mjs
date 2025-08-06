import '@astrojs/internal-helpers/path';
import 'kleur/colors';
import { o as NOOP_MIDDLEWARE_HEADER, p as decodeKey } from './chunks/astro/server_wfaa8UVt.mjs';
import 'clsx';
import 'cookie';
import 'es-module-lexer';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///E:/osp-vote-event-2025/","cacheDir":"file:///E:/osp-vote-event-2025/node_modules/.astro/","outDir":"file:///E:/osp-vote-event-2025/dist/","srcDir":"file:///E:/osp-vote-event-2025/src/","publicDir":"file:///E:/osp-vote-event-2025/public/","buildClientDir":"file:///E:/osp-vote-event-2025/dist/","buildServerDir":"file:///E:/osp-vote-event-2025/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"mothers-day-card/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/mothers-day-card","isIndex":false,"type":"page","pattern":"^\\/mothers-day-card\\/?$","segments":[[{"content":"mothers-day-card","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/mothers-day-card.astro","pathname":"/mothers-day-card","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"sitemap.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/sitemap.xml","isIndex":false,"type":"endpoint","pattern":"^\\/sitemap\\.xml\\/?$","segments":[[{"content":"sitemap.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sitemap.xml.ts","pathname":"/sitemap.xml","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":"body{font-family:Prompt,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff}.container[data-astro-cid-zetdm5md]{text-align:center;padding:2rem}.spinner[data-astro-cid-zetdm5md]{border:4px solid rgba(255,255,255,.3);border-radius:50%;border-top:4px solid white;width:40px;height:40px;animation:spin 1s linear infinite;margin:0 auto 1rem}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/download","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/download\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"download","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/download.ts","pathname":"/api/download","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/event/_astro/_slug_.D7CtossS.css"}],"routeData":{"route":"/mothers-day-card","isIndex":false,"type":"page","pattern":"^\\/mothers-day-card\\/?$","segments":[[{"content":"mothers-day-card","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/mothers-day-card.astro","pathname":"/mothers-day-card","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/sitemap.xml","isIndex":false,"type":"endpoint","pattern":"^\\/sitemap\\.xml\\/?$","segments":[[{"content":"sitemap.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sitemap.xml.ts","pathname":"/sitemap.xml","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/event/_astro/_slug_.D7CtossS.css"},{"type":"external","src":"/event/_astro/_slug_.Bl8zJ9Jq.css"}],"routeData":{"route":"/[year]/[slug]","isIndex":false,"type":"page","pattern":"^\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"year","dynamic":true,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["year","slug"],"component":"src/pages/[year]/[slug].astro","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/event/_astro/_slug_.D7CtossS.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://theoldsiam.co.th/event","base":"/event","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["E:/osp-vote-event-2025/src/pages/404.astro",{"propagation":"none","containsHead":true}],["E:/osp-vote-event-2025/src/pages/[year]/[slug].astro",{"propagation":"none","containsHead":true}],["E:/osp-vote-event-2025/src/pages/index.astro",{"propagation":"none","containsHead":true}],["E:/osp-vote-event-2025/src/pages/mothers-day-card.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/api/download@_@ts":"pages/api/download.astro.mjs","\u0000@astro-page:src/pages/mothers-day-card@_@astro":"pages/mothers-day-card.astro.mjs","\u0000@astro-page:src/pages/sitemap.xml@_@ts":"pages/sitemap.xml.astro.mjs","\u0000@astro-page:src/pages/[year]/[slug]@_@astro":"pages/_year_/_slug_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_Ck631L6z.mjs","E:/osp-vote-event-2025/node_modules/@astrojs/react/dist/vnode-children.js":"chunks/vnode-children_Gljd-95D.mjs","E:/osp-vote-event-2025/node_modules/unstorage/drivers/netlify-blobs.mjs":"chunks/netlify-blobs_Cc2jag08.mjs","E:/osp-vote-event-2025/src/pages/404.astro?astro&type=script&index=0&lang.ts":"_astro/404.astro_astro_type_script_index_0_lang.37K1w4dV.js","@/components/EventsGrid":"_astro/EventsGrid.eGgDe6NU.js","@/components/FacebookBrowserWarning":"_astro/FacebookBrowserWarning.DC83bVdl.js","@astrojs/react/client.js":"_astro/client.DWEMtbU6.js","E:/osp-vote-event-2025/src/components/MothersDayCard":"_astro/MothersDayCard.CbvsRR3T.js","E:/osp-vote-event-2025/src/components/photo-gallery":"_astro/photo-gallery.Btosc1Kz.js","E:/osp-vote-event-2025/src/components/MothersDayCardCreator":"_astro/MothersDayCardCreator.gVxHZsU5.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["E:/osp-vote-event-2025/src/pages/404.astro?astro&type=script&index=0&lang.ts","(function(){const a=new URLSearchParams(window.location.search);let r=\"/event/2025/pride-month-vote\";const c=[\"utm_source\",\"utm_medium\",\"utm_campaign\",\"ref\",\"source\",\"lang\"],e=new URLSearchParams;c.forEach(t=>{if(a.has(t)){const o=a.get(t);o!==null&&e.set(t,o)}});const n=r+(e.toString()?\"?\"+e.toString():\"\");window.location.replace(n),setTimeout(()=>{window.location.href=n},100)})();"]],"assets":["/event/_astro/logo-title.D0uqoNv4.webp","/event/_astro/letter.BQCUGGu8.webp","/event/_astro/letter-card.BxQM_tw2.webp","/event/_astro/text-rak-mother.C53D2Hhq.webp","/event/_astro/2_0.Bfg3lj0j.webp","/event/_astro/3_0.CaGj0M19.webp","/event/_astro/Happy Mother Day.Cihi4nRK.webp","/event/_astro/5_0.CeZg4c4V.webp","/event/_astro/6_0.CjL2DTka.webp","/event/_astro/4_0.B7k396X_.webp","/event/_astro/4.CpBHkktJ.webp","/event/_astro/OSP-Logo-W.Bk4hT7La.png","/event/_astro/6.BHIJNzM8.webp","/event/_astro/2.DTey0tRi.webp","/event/_astro/9.iAB8SChR.webp","/event/_astro/logo-ssd.bS_vCmSj.webp","/event/_astro/8.PJhEH98F.webp","/event/_astro/5.CA1gPnTB.webp","/event/_astro/permanent-marker-latin-400-normal.BF23djCy.woff2","/event/_astro/prompt-thai-400-normal.BrkKv8cO.woff2","/event/_astro/mothers-day-background.CO061OCV.webp","/event/_astro/pattern.KQ2et_ph.webp","/event/_astro/prompt-latin-400-normal.BQ9zjSN8.woff2","/event/_astro/prompt-vietnamese-400-normal.BCPzsgPT.woff2","/event/_astro/prompt-thai-400-normal.DJypnfr3.woff","/event/_astro/prompt-latin-ext-400-normal.DdSafGZ9.woff2","/event/_astro/permanent-marker-latin-400-normal.BnZj5c41.woff","/event/_astro/prompt-latin-ext-400-normal.1pHbN9uy.woff","/event/_astro/38270.G8AvYHM8.jpg","/event/_astro/prompt-latin-400-normal.CxU4ec_r.woff","/event/_astro/prompt-vietnamese-400-normal.D4pLyeNK.woff","/event/_astro/_slug_.D7CtossS.css","/event/_astro/_slug_.Bl8zJ9Jq.css","/event/5.webp","/event/background.webp","/event/favicon.ico","/event/favicon.svg","/event/robots.txt","/event/card/1.webp","/event/card/10.webp","/event/card/3.webp","/event/card/5.webp","/event/card/7.webp","/event/fonts/fonttintin.ttf","/event/_astro/client.DWEMtbU6.js","/event/_astro/createLucideIcon.H47lsEwJ.js","/event/_astro/EventsGrid.eGgDe6NU.js","/event/_astro/FacebookBrowserWarning.DC83bVdl.js","/event/_astro/index.Bbp-6C1p.js","/event/_astro/index.D4oYnYaY.js","/event/_astro/index.Z3BHPS3u.js","/event/_astro/MothersDayCard.CbvsRR3T.js","/event/_astro/MothersDayCardCreator.DB_56QW4.js","/event/_astro/MothersDayCardCreator.gVxHZsU5.js","/event/_astro/photo-gallery.Btosc1Kz.js","/event/_astro/print.CNUIvI6d.js","/event/_astro/proxy.B2dBh37u.js","/event/_astro/proxy.nV0NTDbY.js","/event/_astro/_slug_.Tk3fnkFD.css","/event/404.html","/event/mothers-day-card/index.html","/event/sitemap.xml","/event/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"u7y59V5RasiuvZRRbd9Supcfjtpga0k2e2tWILTopEI=","sessionConfig":{"driver":"netlify-blobs","options":{"name":"astro-sessions","consistency":"strong"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/netlify-blobs_Cc2jag08.mjs');

export { manifest };
