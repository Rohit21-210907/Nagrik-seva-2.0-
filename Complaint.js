import React, { useState } from "react";

export default function Complaint({ onComplaintSubmit }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    const response = await fetch("http://127.0.0.1:8000/complaints", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    alert(data.message);

    // Reset form
    setTitle("");
    setDescription("");
    setImage(null);

    if (onComplaintSubmit) {
      onComplaintSubmit();
    }
  };

  return (
    <div className="complaint-box">
      <h2>Register Complaint</h2>

      <form onSubmit={handleSubmit} className="complaint-form">

        <label>Complaint Title</label>
        <input
          type="text"
          placeholder="Enter complaint title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Complaint Description</label>
        <textarea
          placeholder="Enter complaint description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Upload Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <label>Select Department</label>
         <select
          required
        >
            <option value="">-- Select Department --</option>
            <option value="Water">Water Department</option>
            <option value="Electricity">Electricity Department</option>
            <option value="Road">Road & Transport</option>
            <option value="Sanitation">Sanitation</option>
           </select>

        <button type="submit">Submit Complaint</button>

      </form>
    </div>
  );
}