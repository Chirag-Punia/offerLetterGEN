import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/OfferForm.css";
import { toast } from "react-toastify";

const OfferForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    candidateName: "",
    email: "",
    offerType: "",
    offerAmount: "",
    offerStartDate: "",
    offerEndDate: "",
    uniqueId: "",
    position: "",
  });

  useEffect(() => {
    const generateUniqueId = () => {
      return "SMM-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    };

    setFormData((prevState) => ({
      ...prevState,
      uniqueId: generateUniqueId(),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    axios
      .post("https://offerlettergen.onrender.com/api/offers", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.msg === "Created") {
          toast.success("Successfully Generated");
        } else {
          toast.error("ERROR");
        }
        setFormData({
          companyName: "",
          candidateName: "",
          email: "",
          offerType: "",
          offerAmount: "",
          offerStartDate: "",
          offerEndDate: "",
          position: "",
          uniqueId:
            "SMM-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        });
      })
      .catch((error) => {
        console.error("There was an error submitting the form!", error);
      });
  };

  return (
    <div className="offer-form-container">
      <h2 className="offer-form-heading">Generate Offer Letter</h2>
      <form className="offer-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="uniqueId">Unique ID</label>
            <input
              type="text"
              id="uniqueId"
              name="uniqueId"
              value={formData.uniqueId}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="candidateName">Candidate Name</label>
            <input
              type="text"
              id="candidateName"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="offerType">Offer Type</label>
            <select
              id="offerType"
              name="offerType"
              value={formData.offerType}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>
        {formData.offerType === "paid" && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="offerAmount">Offer Amount (₹)</label>
              <input
                type="number"
                id="offerAmount"
                name="offerAmount"
                value={formData.offerAmount}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="offerStartDate">Offer Start Date</label>
            <input
              type="date"
              id="offerStartDate"
              name="offerStartDate"
              value={formData.offerStartDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="offerEndDate">Offer End Date</label>
            <input
              type="date"
              id="offerEndDate"
              name="offerEndDate"
              value={formData.offerEndDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="position">Position</label>
            <select id="position" name="position" required>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Data Science">Data Science</option>
              <option value="Artificial Intelligence">
                Artificial Intelligence
              </option>
              <option value="Web Developer">Web Developer</option>
              <option value="Fundraising Coordinator">
                Fundraising Coordinator
              </option>
              <option value="Volunteer">Volunteer</option>
              <option value="Coding Tutor">Coding Tutor</option>
              <option value="Human Resource Management">
                Human Resource Management
              </option>
              <option value="Social Media Marketing">
                Social Media Marketing
              </option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Business Development Associate">
                Business Development Associate
              </option>
              <option value="Content Writer">Content Writer</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Generate Offer Letter
        </button>
      </form>
    </div>
  );
};

export default OfferForm;
