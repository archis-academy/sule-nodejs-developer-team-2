function getHealthStatus(req, res) {
    return res.json({ status: "ok" })
}


module.exports = { getHealthStatus }