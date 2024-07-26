import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/updateDetails.css";

const UpdateDetails = () => {
  const { uniqueId } = useParams();
  const reactNavigator = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    candidateName: "",
    position: "",
    email: "",
    offerType: "",
    offerAmount: "",
    offerStartDate: "",
    offerEndDate: "",
  });
  const [showSpinner, setShowSpinner] = useState(false);
  const base_url = "https://offerlettergen.onrender.com";

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${base_url}/auth/offers/${uniqueId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLoading(true);
        setFormData({
          companyName: response.data[0].companyName,
          candidateName: response.data[0].candidateName,
          position: response.data[0].position,
          email: response.data[0].email,
          offerType: response.data[0].offerType,
          offerAmount: response.data[0].offerAmount,
          offerStartDate: new Date(response.data[0].offerStartDate)
            .toISOString()
            .slice(0, 10),
          offerEndDate: new Date(response.data[0].offerEndDate)
            .toISOString()
            .slice(0, 10),
        });
      } catch (error) {
        console.error("Error fetching offer details:", error);
      }
    };

    fetchOfferDetails();
  }, [uniqueId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      setShowSpinner(true);
      const updateRequest = axios.put(
        `${base_url}/auth/offers/${uniqueId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const navigationPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(reactNavigator("/dashboard"));
        }, 500);
      });

      await Promise.all([updateRequest, navigationPromise]);
      toast.success("Updated successfully");
    } catch (error) {
      console.error("Error updating offer details:", error);
    } finally {
      setShowSpinner(false);
    }
  };

  if (!loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <button
        className="button-74"
        onClick={() => {
          window.location = "/dashboard";
        }}
      >
        dashboard
      </button>
      {showSpinner && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="update-details-container">
        <h1 className="update-details-heading">
          Update Details for Offer ID: {uniqueId}
        </h1>
        <form className="update-details-form" onSubmit={handleSubmit}>
          <label>
            Company Name:
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
          </label>
          <label>
            Candidate Name:
            <input
              type="text"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="position">Position</label>
        <select
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
        >
          <option value="">Choose Internship Domain</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="Data Science">Data Science</option>
          <option value="Artificial Intelligence">Artificial Intelligence</option>
          <option value="Web Developer">Web Developer</option>
          <option value="Fundraising Coordinator">Fundraising Coordinator</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Coding Tutor">Coding Tutor</option>
          <option value="Human Resource Management">Human Resource Management</option>
          <option value="Social Media Marketing">Social Media Marketing</option>
          <option value="Digital Marketing">Digital Marketing</option>
          <option value="Business Development Associate">Business Development Associate</option>
          <option value="Content Writer">Content Writer</option>
        </select>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Offer Type:
            <select
              name="offerType"
              value={formData.offerType}
              onChange={handleChange}
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </label>
          <label>
            Offer Amount:
            <input
              type="text"
              name="offerAmount"
              value={formData.offerAmount}
              onChange={handleChange}
            />
          </label>
          <label>
            Offer Start Date:
            <input
              type="date"
              name="offerStartDate"
              value={formData.offerStartDate}
              onChange={handleChange}
            />
          </label>
          <label>
            Offer End Date:
            <input
              type="date"
              name="offerEndDate"
              value={formData.offerEndDate}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="button-74">
            Update Details
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateDetails;
