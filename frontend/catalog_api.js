/**
 * When pages are opened as file://, /api/... and /search would hit the wrong origin.
 * Set BEAUTYNEST_API_ORIGIN to your running Express server (default port 4900).
 */
(function () {
  var isFile = window.location.protocol === "file:";
  window.BEAUTYNEST_API_ORIGIN = isFile ? "http://127.0.0.1:4900" : "";

  window.beautynestAssetUrl = function (path) {
    if (!path) return "";
    var s = String(path);
    if (/^https?:\/\//i.test(s)) return s;
    var p = s.replace(/^\//, "");
    return window.BEAUTYNEST_API_ORIGIN ? window.BEAUTYNEST_API_ORIGIN + "/" + p : s;
  };

  window.beautynestDetailUrl = function (id) {
    return (window.BEAUTYNEST_API_ORIGIN || "") + "/detailed_page.html?id=" + encodeURIComponent(id);
  };

  window.beautynestEscapeHtml = function (s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  if (isFile) {
    window.addEventListener("DOMContentLoaded", function () {
      var name =
        window.location.pathname && window.location.pathname.split(/[/\\]/).pop();
      var suggested = name
        ? window.BEAUTYNEST_API_ORIGIN + "/" + encodeURI(name)
        : window.BEAUTYNEST_API_ORIGIN + "/";
      var m = document.createElement("div");
      m.setAttribute("role", "status");
      m.style.cssText =
        "background:#1e40af;color:#fff;padding:10px 14px;text-align:center;font-family:system-ui,sans-serif;font-size:13px;line-height:1.5;";
      m.innerHTML =
        "This page was opened from your computer as a file. Start the backend (<code>node src/app.js</code> in the <code>backend</code> folder), then open the site from the server: " +
        '<a href="' +
        suggested +
        '" style="color:#fff;font-weight:600;">' +
        suggested +
        "</a>";
      document.body.insertBefore(m, document.body.firstChild);
    });
  }
})();
