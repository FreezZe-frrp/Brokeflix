const app = require("./app");
const db = require("./src/configs/db.config");

const jwtAuthorization = require("./src/utils/jwtAuthorization");

const animesRoutes = require("./src/routes/animesRoutes");
const filmsRoutes = require("./src/routes/filmsRoutes");
const seriesRoutes = require("./src/routes/seriesRoutes");
const userRoutes = require("./src/routes/usersRoutes");
const authRoutes = require("./src/routes/authRoutes");
const catchRoutes = require("./src/routes/catchRoutes");

const port = process.env.PORT || 3000;

const auth = function (req, res, next) {
  let exceptions = ["/auth/login", "/auth/register"];
  if (exceptions.indexOf(req.url) >= 0) {
    next();
  } else {
    jwtAuthorization.validateToken(
      req.headers.authorization,
      (result, username) => {
        if (result) {
          req.loggedInUser = username;
          next();
        } else {
          res.status(401).send("Invalid Token");
        }
      }
    );
  }
};

app.get("/api/docs", (req, res) => {
  res.status(200).send("GREETINGS !");
});
app.use("/api/animes", animesRoutes);
app.use("/api/films", filmsRoutes);
app.use("/api/series", seriesRoutes);
app.use("/auth", authRoutes);

app.use("*", catchRoutes);
app.use(auth);
app.use("/api/users/", userRoutes);

app.use("*", catchRoutes);

app.listen(port, () => {
  console.log(`App running on port http://localhost:${port} ...`);
});
