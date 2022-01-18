
document.getElementById("btnLogout").addEventListener("click", function() {
    doLogout();
});

function doLogout() {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.location = '<%= idpUrl %>' + '/logout?client_id=' + '<%= clientId %>' + '&logout_uri=' + window.location.origin + '/logout';
}