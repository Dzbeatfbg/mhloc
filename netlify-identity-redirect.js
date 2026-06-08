// ── Netlify Identity — redirect invite/recovery tokens vers /admin/ ──
(function() {
  var hash = window.location.hash;
  var tokens = [
    "invite_token=",
    "recovery_token=",
    "confirmation_token=",
    "email_change_token=",
    "access_token="
  ];
  var hasToken = tokens.some(function(t) { return hash.includes(t); });
  if (hasToken && !window.location.pathname.startsWith("/admin")) {
    window.location.replace("/admin/" + hash);
  }
})();
