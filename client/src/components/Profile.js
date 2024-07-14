import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Text } from "@chakra-ui/react";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://offerlettergen.onrender.com/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setUserDetails(response.data);
      } catch (error) {
        console.error("There was an error fetching the user details!", error);
      }
    };

    fetchUserDetails();
  }, []);

  if (!userDetails) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box>
      <Text>
        <strong>Name:</strong> {userDetails.name}
      </Text>
      <Text>
        <strong>Email:</strong> {userDetails.email}
      </Text>
    </Box>
  );
};

export default Profile;
