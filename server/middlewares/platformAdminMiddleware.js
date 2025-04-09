const PlatformAdminPermission = async (req, res, next) => {
  if (req.user) {
    console.log("res.user", req.user);
    try {
      if (req.user.role === "platformAdmin") {
        next();
      } else {
        res
          .status(403)
          .json({ message: "Forbidden, insufficient permissions" });
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Forbidden, insufficient permissions" });
    }
  } else {
    res.status(401).json({ message: "Forbidden, insufficient permissions" });
  }
};

export { PlatformAdminPermission };
