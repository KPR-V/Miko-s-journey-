import {
    TruvityClient,
    LinkedCredential,
    VcContext,
    VcLinkedCredentialClaim,
    VcNotEmptyClaim,
  } from "@truvity/sdk";
  import cors from "cors";
  import express from "express";
  import "dotenv/config";
  
  const miko_client = new TruvityClient({
    apiKey: process.env.TIM_API_KEY,
    environment: "https://api.truvity.cloud",
  });
  
  const employer_client = new TruvityClient({
    apiKey: process.env.AIRLINE_API_KEY,
    environment: "https://api.truvity.cloud",
  });
  class Registerycertificate {
    @VcNotEmptyClaim
    birth_certificate!: LinkedCredential<BirthCertificate>;
    @VcNotEmptyClaim
    proofofidentity_certificate!: LinkedCredential<ProofOfIdentitycontract>;
    @VcNotEmptyClaim
    employment_contract!: LinkedCredential<EmploymentContract>;
    @VcNotEmptyClaim
    date_of_issue!: string;
  }
  class ProofOfIdentitycontract {
    @VcNotEmptyClaim
    firstName!: string;
  
    @VcNotEmptyClaim
    lastName!: string;
  
    @VcNotEmptyClaim
    date_of_birth!: string;
  
    @VcNotEmptyClaim
    address!: string;
  
    @VcNotEmptyClaim
    place_of_birth!: string;
  
    @VcNotEmptyClaim
    father_name!: string;
  
    @VcNotEmptyClaim
    nationality!: string;
  
    @VcNotEmptyClaim
    phone_number!: Number;
  
    @VcNotEmptyClaim
    mother_name!: string;
  }
  class BirthCertificate {
    @VcNotEmptyClaim
    certificateID!: string;
  
    @VcNotEmptyClaim
    firstName!: string;
  
    @VcNotEmptyClaim
    lastName!: string;
  
    @VcNotEmptyClaim
    dateOfBirth!: string;
  
    @VcNotEmptyClaim
    placeOfBirth!: string;
  
    @VcNotEmptyClaim
    parentName!: string;
  
    @VcNotEmptyClaim
    dateOfIssue!: string;
  }
  class EmploymentContract {
    @VcNotEmptyClaim
    nameofthecompany!: string;
    @VcNotEmptyClaim
    nameoftheemployee!: string;
    @VcNotEmptyClaim
    position!: string;
    @VcNotEmptyClaim
    date_of_joining!: string;
    @VcNotEmptyClaim
    phone_number!: Number;
    @VcNotEmptyClaim
    email!: string;
    @VcNotEmptyClaim
    salary!: Number;
    @VcNotEmptyClaim
    place_of_work!: string;
  }
  @VcContext({
    name: "bankaccountrequest",
    namespace: "urn:dif:hackathon/MIKO/bank",
  })
  class BankaccountRequest {
    @VcNotEmptyClaim
    @VcLinkedCredentialClaim(Registerycertificate)
    Registery_certificate!: LinkedCredential<Registerycertificate>;
    @VcNotEmptyClaim
    @VcLinkedCredentialClaim(ProofOfIdentitycontract)
    proofofidentity_certificate!: LinkedCredential<ProofOfIdentitycontract>;
  
    @VcNotEmptyClaim
    @VcLinkedCredentialClaim(EmploymentContract)
    employment_contract!: LinkedCredential<EmploymentContract>;
  }
  
  
  @VcContext({
    name: "bankaccountdetails",
    namespace: "urn:dif:hackathon/MIKO/bank",
  })
  class Bankaccountdetails {
    @VcNotEmptyClaim
    name!: string;
    @VcNotEmptyClaim
    account_number!: string;
    @VcNotEmptyClaim
    bank_name!: string;
    @VcNotEmptyClaim
    branch_name!: string;
    @VcNotEmptyClaim
    ifsc_code!: string;
    @VcLinkedCredentialClaim(EmploymentContract)
    employment_contract!: LinkedCredential<EmploymentContract>;
    @VcLinkedCredentialClaim(ProofOfIdentitycontract)
    proofofidentity_certificate!: LinkedCredential<ProofOfIdentitycontract>;
    @VcLinkedCredentialClaim(Registerycertificate)
    Registery_certificate!: LinkedCredential<Registerycertificate>;
  }
  @VcContext({
    name: "bankaccountresponse",
    namespace: "urn:dif:hackathon/MIKO/bank",
  })
  class BankaccountResponse {
    @VcNotEmptyClaim
    @VcLinkedCredentialClaim(BankaccountRequest)
    request!: LinkedCredential<BankaccountRequest>;
    @VcNotEmptyClaim
    @VcLinkedCredentialClaim(Bankaccountdetails)
    bankaccountdetails!: LinkedCredential<Bankaccountdetails>;
  
    @VcNotEmptyClaim
    issuingAuthority!: string;
    @VcNotEmptyClaim
    date_of_issue!: string;
  }
  
  
  // Approve a specific request by ID
  async function approveRequest(requestId) {
    try {
      // Retrieve the specific request based on ID
      const requestVc = await employer_client.credentials.credentialLatest({ id: requestId });
  
      // Perform the approval process (e.g., issue a positive response VC)
      const bankResponse = employer_client.createVcDecorator(BankaccountResponse);
      const responseDraft = await bankResponse.create({
        claims: {
          request: requestVc,
          approvalStatus: "approved",
          date_of_issue: new Date().toISOString(),
        },
      });
  
      const bankKey = await employer_client.keys.keyGenerate({
        data: { type: "ED25519" },
      });
      const responseVc = await responseDraft.issue(bankKey.id);
      await responseVc.send(, bankKey.id);
  
      return true;
    } catch (error) {
      console.error("Error approving request:", error);
      return false;
    }
  }
  
  // Reject a specific request by ID
  async function rejectRequest(requestId) {
    try {
      // Retrieve the specific request based on ID
      const requestVc = await employer_client.credentials.credentialLatest({ id: requestId });
  
      // Perform the rejection process (e.g., issue a negative response VC)
      const bankResponse = employer_client.createVcDecorator(BankaccountResponse);
      const responseDraft = await bankResponse.create({
        claims: {
          request: requestVc,
          approvalStatus: "rejected",
          date_of_issue: new Date().toISOString(),
        },
      });
  
      const bankKey = await employer_client.keys.keyGenerate({
        data: { type: "ED25519" },
      });
      const responseVc = await responseDraft.issue(bankKey.id);
      await responseVc.send(requestVc, bankKey.id);
  
      return true;
    } catch (error) {
      console.error("Error rejecting request:", error);
      return false;
    }
  }
  
  
  
  
  const app = express();
  const PORT = process.env.PORT || 3000;
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  
  
  // Route to approve a bank account request
  app.post('/api/approve-request', async (req, res) => {
    const { requestId } = req.body;
  
    try {
      const result = await approveRequest(requestId);
      if (result) {
        res.status(200).json({ message: "Request approved successfully." });
      } else {
        res.status(500).json({ message: "Error approving request." });
      }
    } catch (error) {
     
    }
  });
  
  // Route to reject a bank account request
  app.post('/api/reject-request', async (req, res) => {
    const { requestId } = req.body;
  
    try {
      const result = await rejectRequest(requestId);
      if (result) {
        res.status(200).json({ message: "Request rejected successfully." });
      } else {
        res.status(500).json({ message: "Error rejecting request." });
      }
    } catch (error) {
   
    }
  });
  
  // Your existing approveRequest and rejectRequest functions go here...
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });