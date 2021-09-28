module.exports.handleLogout = (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<html lang="en"><head><title>Logout</title></head><body>Logout Successful</body></html>');
    res.end();
};
