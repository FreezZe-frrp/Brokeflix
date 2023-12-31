const AnimeModel = require("../models/anime.model");

exports.getAnimes = async (req, res) => {
  if (req.query.id) {
    const animeId = req.query.id;

    try {
      const anime = await AnimeModel.findById(animeId);

      if (!anime) {
        res.status(404).send("Anime not found");
        return;
      }

      res.json(anime);
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred in Anime by id");
    }
  } else if (req.query.title) {
    const title = req.query.title;

    try {
      const animes = await AnimeModel.find({
        title: { $regex: new RegExp(title, "i") },
      });

      res.json(animes);
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred in anime by title");
    }
  } else {
    try {
      const animes = await AnimeModel.find({});

      res.json(animes);
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred in getting All Animes");
    }
  }
};

exports.postAnime = async (req, res) => {
  let postAnime = {
    title: req.body.title,
    numberOfEpisodes: req.body.numberOfEpisodes
      ? req.body.numberOfEpisodes
      : "?",
    episode: req.body.episode ? req.body.episode : [],
    description: req.body.description,
    status: req.body.status,
    genres: req.body.genres,
    imageUrl: req.body.imageUrl,
    backgroundImgUrl: req.body.backgroundImgUrl,
  };

  const duplicate = await AnimeModel.findOne({ title: postAnime.title });

  if (duplicate) {
    res.status(409).send("Anime already exists");
  } else {
    try {
      const anime = await AnimeModel.create(postAnime);

      res.json(anime);
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred in creating an Anime");
    }
  }
};

exports.putAnime = async (req, res) => {
  let title = req.params.title;

  let anime = await AnimeModel.findOne({ title: title });

  let updateAnime = {
    title: req.body.title,
    numberOfEpisodes: req.body.numberOfEpisodes
      ? req.body.numberOfEpisodes
      : anime.numberOfEpisodes,
    episode: req.body.episode ? req.body.episode : anime.episode,
    description: req.body.description
      ? req.body.description
      : anime.description,
    status: req.body.status ? req.body.status : anime.status,
    genres: req.body.genres ? req.body.genres : anime.genres,
    backgroundImgUrl: req.body.backgroundImgUrl
      ? req.body.backgroundImgUrl
      : anime.backgroundImgUrl,
    imageUrl: req.body.imageUrl ? req.body.imageUrl : anime.imageUrl,
  };

  console.log(updateAnime, title);

  try {
    const anime = await AnimeModel.updateOne({ title: title }, updateAnime);

    res.json(anime);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred in creating an Anime");
  }
};

exports.addEpisode = async (req, res) => {
  let title = req.params.title;
  const episode = req.body.episode;
  const duplicate = await AnimeModel.findOne({ episode: episode.title });
  const anime = await AnimeModel.findOne({ title: title });

  if (duplicate) {
    res.status(409).send("Episode already exists");
    return;
  } else {
    try {
      if (!anime) {
        res.status(404).send("Anime not found");
        return;
      }

      anime.episode.push(episode);

      await anime.save();

      res.json(anime);
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred in adding episode");
    }
  }
};

exports.deleteAnime = async (req, res) => {
  const animeTitle = req.params.title;

  try {
    const anime = await AnimeModel.deleteOne({ title: animeTitle });

    if (!anime) {
      res.status(404).send("Anime not found");
      return;
    }
    res.json(anime);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred in deleting anime by title");
  }
};
