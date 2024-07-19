import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/user/useUserStore.js";
import { findDiff_leaderboard } from "../../api/game/FindDiff.js";
import useFDGStore from "../../store/game/findDiffGame/useFDGStore.js";


const Leaderboard = () => {
  const navigate = useNavigate();
  const { username } = useUserStore();
  const [leaderboard, setLeaderboard] = useState([]);
  const { findDiffGameId } = useFDGStore();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await findDiff_leaderboard(findDiffGameId);
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr
              key={index}
              className={user.nickname === username ? "current-user" : ""}
            >
              <td>{index + 1}</td>
              <td>{user.nickname}</td>
              <td>{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate("/game2")}>Back to Game</button>
    </div>
  );
};

export default Leaderboard;
