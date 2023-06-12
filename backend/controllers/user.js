import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import { uploadImage, uploads3Image } from "../utils/utils.js";

export const getUserFriends = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT a.*,  u.id AS userId, name, profilePic
    FROM active_users AS a LEFT JOIN users AS u on u.id = a.userId WHERE active = 1`;

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  });
};

export const getFriends = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT * FROM users WHERE username = ? OR email = ?`;
    const d = [req.params.item, req.params.item];
    db.query(q, d, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  });
};

export const getUserActivity = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT a.*,  u.id AS userId, name, profilePic
    FROM activities AS a LEFT JOIN users AS u on a.userId = u.id ORDER BY createdAt DESC LIMIT 5`;

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  });
};

export const getUsers = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT *
    FROM users
    WHERE id NOT IN (SELECT followedUserId FROM relationships WHERE followerUserId = ${userInfo.id})
    and id <>  ${userInfo.id}`;

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  });
};

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    try {
      const profileData =
        req.body.profilePic !== ""
          ? await uploads3Image(req.body.profilePic)
          : "";
      const profilePic = profileData.Location;
      const coverData =
        req.body.coverPic !== "" ? await uploads3Image(req.body.coverPic) : "";
      const coverPic = coverData.Location;
      const q =
        "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";
      db.query(
        q,
        [
          req.body.name,
          req.body.city,
          req.body.website,
          profilePic,
          coverPic,
          userInfo.id,
        ],
        (err, data) => {
          if (err) res.status(500).json(err);
          if (data.affectedRows > 0) return res.json("Updated!");
          return res.status(403).json("You can update only your post!");
        }
      );
    } catch (error) {
      console.log(error);
    }
  });
};
