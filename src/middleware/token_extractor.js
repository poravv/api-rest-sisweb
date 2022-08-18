
//Authorization: Bearer <token>
module.exports=(req, res, next) => {
    const bearerheader = req.headers['authorization'];
    if (typeof bearerheader !== 'undefined') {
        const bearertoken = bearerheader.split(" ")[1];
        req.token = bearertoken;
        next();
    } else {
        return res.send("Error token")
    }
}
