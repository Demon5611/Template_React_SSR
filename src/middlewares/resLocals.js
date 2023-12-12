export default function resLocals(req, res, next) {
  if (req.session?.user) res.locals.user = req.session?.user;
  res.locals.path = req.originalUrl;
  return next();
}
