import { OAuthStrategy, createClient } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import { orders } from "@wix/ecom";
import { cookies } from "next/headers";
import { members } from '@wix/members';

export const wixClientServer = async () => {
  let refreshToken = null;

  try {
    // Retrieve cookies from the request
    const cookieStore = await cookies();  
    const refreshTokenCookie = cookieStore.get("refreshToken");

    // Log to ensure we are accessing the cookies correctly
    console.log("refreshTokenCookie:", refreshTokenCookie);  
    
    if (refreshTokenCookie) {
      refreshToken = JSON.parse(refreshTokenCookie.value || "{}");
      console.log("Parsed refreshToken:", refreshToken);  
    } else {
      console.log("No refresh token found in cookies");
    }
  } catch (e) {
    console.error("Error retrieving refresh token:", e);
  }

  // If no refresh token is found, handle the error gracefully
  if (!refreshToken) {
    console.error("No valid refresh token available. Unable to proceed with the Wix client authentication.");
    // Handle the scenario where no refresh token is available (e.g., redirect to login or show error)
    // throw new Error("Missing refresh token");
  }

  // Create Wix client with OAuth strategy
  const wixClient = createClient({
    modules: {
      products,
      collections,
      orders,
      members,
    },
    auth: OAuthStrategy({
      clientId: "0e5285ce-5d6e-4640-96e2-54a6ad35b067",  // Ensure this environment variable is set correctly
      tokens: {
        refreshToken,  // If no refresh token, this will be null
        accessToken: { value: "", expiresAt: 0 },  // Adjust this logic to handle actual access token when available
      },
    }),
  });

  return wixClient;
};
