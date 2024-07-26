import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import OfferForm from "./OfferForm";
import Profile from "./Profile";
import DownloadButton from "./DownloadButton";
import "../styles/DashBoard.css";

const Dashboard = () => {
  const [offers, setOffers] = useState([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const base_url = "https://offerlettergen.onrender.com";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${base_url}/api/offers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOffers(response.data);
      } catch (error) {
        console.error("There was an error fetching the offers!", error);
      }
    };

    fetchOffers();
  }, []);

  // Paginate offers based on currentPage
  const paginatedOffers = offers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSendEmail = async (uniqueId) => {
    try {
      const token = localStorage.getItem("token");
      await axios
        .post(
          `${base_url}/auth/generate-and-send-pdf`,
          { uniqueId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.data === "PDF generated and sent successfully!") {
            toast.success("PDF generated and sent successfully!");
          } else {
            toast.error("Error sending email");
          }
        });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Error sending email");
    }
  };

  const handleToggleForm = () => {
    setShowOfferForm(!showOfferForm);
  };

  const handleUpdateDetails = (uniqueId) => {
    navigate(`/update-details/${uniqueId}`);
  };

  const handleViewOfferLetter = (uniqueId) => {
    navigate(`/view-offer/${uniqueId}`);
  };

  const renderOffers = () =>
    paginatedOffers.map((offer) => (
      <Tr key={offer.uniqueId}>
        <Td>{offer.uniqueId}</Td>
        <Td>{offer.companyName}</Td>
        <Td>{offer.candidateName}</Td>
        <Td>{offer.offerType}</Td>
        <Td>{offer.offerAmount ? offer.offerAmount : "N/A"}</Td>
        <Td>{new Date(offer.offerStartDate).toLocaleDateString()}</Td>
        <Td>{new Date(offer.offerEndDate).toLocaleDateString()}</Td>
        <Td className="actions-button">
          <Button
            className="button-74"
            onClick={() => handleSendEmail(offer.uniqueId)}
          >
            Send Email
          </Button>
          <Button
            className="button-74"
            onClick={() => handleUpdateDetails(offer.uniqueId)}
          >
            Update Details
          </Button>
          <Button
            className="button-74"
            onClick={() => handleViewOfferLetter(offer.uniqueId)}
          >
            View
          </Button>
          <DownloadButton
            name={offer.candidateName}
            position={offer.position}
            startDate={offer.offerStartDate}
            uniqueId={offer.uniqueId}
            offerType={offer.offerType}
            endDate={offer.offerEndDate}
          />
        </Td>
      </Tr>
    ));

  const totalPages = Math.ceil(offers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          className={`pagination-button ${
            i === currentPage ? "current-page" : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pageButtons;
  };

  return (
    <Box className="dashboard-container">
      <Button className="generate-button" onClick={handleToggleForm}>
        Generate Offer Letter
      </Button>
      {showOfferForm && <OfferForm />}
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          className="generate-button"
        >
          My Profile
        </MenuButton>
        <MenuList bg="#0f3460">
          <Box padding="4" bg="#0f3460" color="white">
            <Profile />
          </Box>
          <MenuDivider />
          <div className="xx">
            <MenuItem
              className="generat-button"
              as={Button}
              variant="ghost"
              color="white"
              onClick={() => {
                localStorage.removeItem("token");
                window.location = "/";
              }}
            >
              Log Out
            </MenuItem>
          </div>
        </MenuList>
      </Menu>
      <Table className="offers-table">
        <Thead>
          <Tr>
            <Th>Unique ID</Th>
            <Th>Company Name</Th>
            <Th>Candidate Name</Th>
            <Th>Offer Type</Th>
            <Th>Offer Amount</Th>
            <Th>Start Date</Th>
            <Th>End Date</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>{renderOffers()}</Tbody>
      </Table>
      <div className="pagination">{renderPaginationButtons()}</div>
    </Box>
  );
};

export default Dashboard;
