import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OfferLetter from "./OfferLetter";
import "../styles/DashBoard.css";

const DownloadButton = ({ name, position, startDate, uniqueId }) => (
  <PDFDownloadLink
    document={
      <OfferLetter
        name={name}
        position={position}
        startDate={startDate}
        uniqueId={uniqueId}
      />
    }
    fileName={`OFFER-LETTER-${uniqueId}.pdf`}
  >
    {({ loading }) => (
      <span className="pdf-link-text">
        {loading ? (
          "Loading document..."
        ) : (
          <button className="button-74">Download</button>
        )}
      </span>
    )}
  </PDFDownloadLink>
);

export default DownloadButton;
