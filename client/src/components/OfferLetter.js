import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../images/SuvidhaLogo.png";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  logo: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 10,
    left: 10,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
  boldText: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: "bold",
  },
  signature: {
    marginTop: 30,
    fontSize: 12,
  },
});
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

const OfferLetter = ({ name, position, startDate, uniqueId, endDate }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image style={styles.logo} src={logo} />
      <View style={styles.section}>
        <Text style={styles.header}>INTERNSHIP OFFER LETTER</Text>
        <Text style={styles.text}>
          Date: {formatDate(new Date().toLocaleDateString())}
        </Text>
        <Text style={styles.text}>Ref. No. {uniqueId}</Text>
        <Text style={styles.text}>To,</Text>
        <Text style={styles.text}>{name},</Text>
        <Text style={styles.text}>
          We are pleased to offer you the position of{" "}
          <Text style={styles.boldText}>"{position}"</Text> at Suvidha
          Foundation (Suvidha Mahila Mandal) with the following terms and
          conditions:
        </Text>
        <Text style={styles.boldText}>
          Role: Web Development Services and Fundraising activities
        </Text>
        <Text style={styles.boldText}>
          Internship Period: {formatDate(startDate)} to {formatDate(endDate)}
        </Text>
        <Text style={styles.boldText}>
          Position: Work-from-home, six days a week
        </Text>
        <Text style={styles.boldText}>
          This is an honorary position and does not entail any financial
          remuneration
        </Text>
        <Text style={styles.boldText}>
          Completion Certificate: Issued upon fulfilling internship
          requirements, including daily time commitment
        </Text>
        <Text style={styles.boldText}>Confidentiality and Conduct:</Text>
        <Text style={styles.text}>
          Maintain confidentiality during and after the internship.
        </Text>
        <Text style={styles.text}>
          Misconduct may lead to termination without a completion certificate.
        </Text>
        <Text style={styles.text}>
          All developed materials are the property of Suvidha Mahila Mandal.
        </Text>
        <Text style={styles.text}>
          Return all organisation property upon completion.
        </Text>
        <Text style={styles.text}>
          Legal action will be taken for piracy or information leakage.
        </Text>
        <Text style={styles.signature}>
          Acceptance: I accept the offer and agree to the terms and conditions.
        </Text>
        <Text style={styles.signature}>
          Signature: ____________________________ Date:
          ____________________________
        </Text>
        <Text style={styles.signature}>Mrs. Shobha Motghare</Text>
        <Text style={styles.signature}>Secretary, Suvidha Mahila Mandal</Text>
      </View>
    </Page>
  </Document>
);

export default OfferLetter;
