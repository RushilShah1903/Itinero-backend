import Trip from "../models/Trip.js";

// Book a Trip
export const bookTrip = async (req, res) => {
  try {
    const { user, from, to, date, reason, estimatedCost, inclusion } = req.body;

    const trip = new Trip({ user, from, to, date, reason, estimatedCost, inclusion });
    await trip.save();

    res.status(201).json({ message: "Trip booked successfully", trip });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get All Trips (Admin)
export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate("user", "name email");
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get User Trips
export const getUserTrips = async (req, res) => {
  try {
    const { userId } = req.params;
    const trips = await Trip.find({ user: userId });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
