const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const requireAuth = require('../middleware/requireAuth'); // Import the guard

// Apply the guard to ALL routes in this file
router.use(requireAuth);

// --- GET ALL HABITS (for the logged-in user) ---
router.get('/', async (req, res) => {
  try {
    // Only find habits that belong to THIS user
    const habits = await Habit.find({ user_id: req.user.id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- CREATE A NEW HABIT ---
router.post('/', async (req, res) => {
  const { title, identity, cue } = req.body;

  try {
    const newHabit = new Habit({
      user_id: req.user.id, // We get this from the token!
      title,
      identity, // Atomic Habit feature
      cue       // Atomic Habit feature
    });

    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// --- DELETE A HABIT ---
router.delete('/:id', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    // Check if habit exists
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    // Ensure user owns the habit (Security!)
    if (habit.user_id.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await habit.deleteOne();
    res.json({ message: "Habit deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- TOGGLE COMPLETION (CHECK-IN) ---
router.put('/:id/checkin', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    if (habit.user_id.toString() !== req.user.id) return res.status(401).json({ message: "Not authorized" });

    // Get today's date as a string "YYYY-MM-DD"
    // We use .toISOString() and split to ensure consistent format
    const today = new Date().toISOString().split('T')[0];

    // Check if today is already in the list
    const index = habit.completedDates.indexOf(today);

    if (index === -1) {
      // Not done yet -> Add today
      habit.completedDates.push(today);
      // Simple streak logic: If we just checked in, increase streak
      // (For a real production app, you'd verify if yesterday was done too)
      habit.streak += 1;
    } else {
      // Already done -> Remove today (Undo)
      habit.completedDates.splice(index, 1);
      habit.streak = Math.max(0, habit.streak - 1);
    }

    await habit.save();
    res.json(habit);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;