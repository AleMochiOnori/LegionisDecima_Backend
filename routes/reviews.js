import express from "express";
import Review from "../models/Review.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// CREA RECENSIONE (solo utenti loggati)
router.post("/", authMiddleware, async (req, res) => {
  const { text, rating } = req.body;
  console.log("BODY RICEVUTO:", req.body); // 👈 aggiungi questo


  try {
    // 1️⃣ Salva la recensione con solo userId
    const review = new Review({
      userId: req.user.id,
      text: text,
      rating: rating,
      data: new Date(),
    });
    await review.save();

    // 2️⃣ Popola subito l'username per ritornarlo al frontend
    const reviewPopulated = await Review.findById(review._id).populate("userId", "username");

    res.status(201).json(reviewPopulated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// OTTIENI TUTTE LE RECENSIONI  
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "username") // <- fondamentale per avere username
      .sort({ data: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ELIMINA RECENSIONE (solo proprietario)


router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Recensione non trovata" });

    // Controlla se l'utente loggato è il proprietario della recensione
    if (review.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Azione non autorizzata" });

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Recensione eliminata con successo" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.patch("/:id", authMiddleware, async (req, res) => {
  const { text, rating } = req.body;
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Recensione non trovata" });

    // Controlla se l'utente loggato è il proprietario della recensione
    if (review.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Azione non autorizzata" });
    
    // Aggiorna i campi della recensione
    if (text) review.testo = text;
    if (rating) review.voto = rating;
    await review.save();
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
  }
});

export default router;
