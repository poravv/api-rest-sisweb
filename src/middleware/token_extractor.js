
//Authorization: Bearer <token>
module.exports = (req, res, next) => {
    const bearerheader = req.headers['authorization'];
    if (typeof bearerheader !== 'undefined') {
        try {
            const bearertoken = bearerheader.split(" ")[1];
            req.token = bearertoken;
            next();
        } catch (error) {
            return res.status(401).json({
                "error": "true",
                "mensaje": "Acceso denegado"
            });
        }
    } else {
        return res.status(401).json({
            "error": "true",
            "mensaje": "Acceso denegado"
        });
    }
}
