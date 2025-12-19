import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 Add this
import "../style/ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState({ name: "", email: "", userid: "", profilePic: "" });
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate(); // 👈 For redirecting

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({ name: storedUser.name, email: storedUser.email });
      setImagePreview(storedUser.profilePic || "https://via.placeholder.com/120");
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        const updatedUser = { ...user, profilePic: reader.result };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

const handleSave = async () => {
  try {
    const res = await axios.put("http://localhost:5000/api/auth/update-profile", {
      email: user.email,
      name: formData.name,
      newEmail: formData.email,
      profilePic: imagePreview  // 👈 Send base64 image
    });

    if (res.data.success) {
      alert("Profile updated!");
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        profilePic: imagePreview,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditing(false);
    } else {
      alert(res.data.message || "Update failed.");
    }
  } catch (err) {
    alert("Error updating profile.");
  }
};


  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // 👈 Redirect to home or login
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <p><strong>User ID:</strong> {user.userid}</p>

      <div className="profile-picture">
        <img src={imagePreview} alt="Profile" />
        {editing && (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        )}
      </div>

      {editing ? (
        <>
          <div className="profile-field">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="profile-field">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="profile-buttons">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <div className="profile-buttons">
            <button onClick={() => setEditing(true)}>Edit Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;