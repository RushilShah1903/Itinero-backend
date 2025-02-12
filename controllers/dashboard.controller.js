import TravelRequest from '../models/travelRequest.model.js';

// Get Dashboard Data (Admin Only)
export const getDashboardData = async (req, res) => {
  try {
    // Aggregate total expenses for approved requests
    const totalExpenseResult = await TravelRequest.aggregate([
      { $match: { status: 'Approved' } },
      { $group: { _id: null, total: { $sum: '$expense' } } },
    ]);
    const totalExpense = totalExpenseResult.length > 0 ? totalExpenseResult[0].total : 0;

    // Use indexed queries for counting documents
    const [totalRequests, totalAcceptedRequests, totalPendingRequests] = await Promise.all([
      TravelRequest.countDocuments(),
      TravelRequest.countDocuments({ status: 'Approved' }),
      TravelRequest.countDocuments({ status: 'Pending' }),
    ]);

    res.json({
      totalExpense,
      totalRequests,
      totalAcceptedRequests,
      totalPendingRequests,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Travel Requests (Admin Only)
export const getAllTravelRequests = async (req, res) => {
  try {
    // Fetch all travel requests with projections to optimize query
    const requests = await TravelRequest.find({}, 'user userName destination startDate endDate status expenseType expense')
      .sort({ createdAt: -1 });

    if (!requests.length) {
      return res.status(404).json({ message: 'No travel requests found' });
    }

    res.json(requests);
  } catch (error) {
    console.error('Error fetching travel requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};