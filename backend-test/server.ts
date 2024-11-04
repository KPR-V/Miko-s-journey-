import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import { Express,Request, Response } from "express";  
import axios from "axios";
import cors from "cors";
const app:Express = express();
app.use(express.json());
app.use(cors());
import {
  TruvityClient,
  LinkedCredential,
  VcContext,
  VcLinkedCredentialClaim,
  VcNotEmptyClaim,
} from "@truvity/sdk";

import "dotenv/config";
const TIM_API_KEY="BUIXl5X9PpqsUu7E85znIPhm7MOjVH5AcZMC23RVBF7-wEaGGaYrzWiMbiME6H4UzFBVhLyQalmRsMueMrBY2hF7HH-aafhYBByppZsdS0GEINSBPh_ZZ_s1PZu5esyFU59T6FUw968ZL4jLElrMG2rywL9vlRZh6LbxO378QsUQIcCitxcbtAVe1XYAyxPUBhfZQo3depR2YVs0crDnFjnO2kaPvkW9a_NEDMDymc6JsvYvnvReFZmZ4YjgHhCuH5WUZIJfklB5Vb1YCcIXWgpsPLxRPy01ORephbfGu-Ip8p5lSxFZ6K54hqFJ--WlqZhr6emDl2x6UkbSEL5Enw";
const AIRLINE_API_KEY="lnSdlnhBrgE2Pavth9DyM5rWugdjvNuIziPbluD24EDlqlu5JYvypCM-Dgokiea8gsT7a3eQ2hXcsC_Doj4GN8fVfNq8ZXqSbtiaAEYmGtxkU2v2utDMV0d8l3It1s0X8MIsJ3apaoGwGTuUIBBaLUxoxli5cZCdJq21dKsbUDgMM5cBNq04FiDKqDn1g4iramRO-giO46vFAENuoDuv_TtcaZkYcaJBjD0t_YjO57Bjyd4pEMom0HOzZEBLsRnA6IFEuZxVV5M2CUbCbsENEEbGPtOfI8ssS0_7lqzDf0pp3lHhJ1J9HsE2DvxuxZ4J7IYBcuLBOCONZ3Z3mxuiVA";
const miko_client = new TruvityClient({
  apiKey: TIM_API_KEY,
  environment: "https://api.truvity.cloud",
});

const employer_client = new TruvityClient({
  apiKey: AIRLINE_API_KEY,
  environment: "https://api.truvity.cloud",
});

@VcContext({
  name: "employmentcontractrequest",
  namespace: "urn:dif:hackathon/MIKO/employment",
})
class EmploymentContractRequest {
  @VcNotEmptyClaim
  firstName!: string;

  @VcNotEmptyClaim
  lastName!: string;

  @VcNotEmptyClaim
  email!: string;

  @VcNotEmptyClaim
  position!: string;

  @VcNotEmptyClaim
  phone_number!: Number;
}

@VcContext({
  name: "employmentcontract",
  namespace: "urn:dif:hackathon/MIKO/employment",
})
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
  name: "employmentcontractresponse",
  namespace: "urn:dif:hackathon/MIKO/employment",
})
class EmploymentContractResponse {
  @VcNotEmptyClaim
  @VcLinkedCredentialClaim(EmploymentContractRequest)
  request!: LinkedCredential<EmploymentContractRequest>;

  @VcNotEmptyClaim
  @VcLinkedCredentialClaim(EmploymentContract)
  contract!: LinkedCredential<EmploymentContract>;
  @VcNotEmptyClaim
  employer_name!: string;
}

async function miko_to_employer_to_miko() {
  // miko's side code to request employment contract below

  try {
    const { id: employerDid } = await employer_client.dids.didDocumentSelfGet();
    const proofofidentity = miko_client.createVcDecorator(
      EmploymentContractRequest
    );
    console.log("Employment request VC created");
    const proofofidentityDraft = await proofofidentity.create({
      claims: {
        firstName: "Miko",
        lastName: "Dif",
        email: "miko@dif.com",
        position: "Software Developer",
        phone_number: 1234567890,
      },
    });
    console.log("Employment request draft created");
    const mikoKey = await miko_client.keys.keyGenerate({
      data: {
        type: "ED25519",
      },
    });
    console.log("Miko key generated:", mikoKey.id);
    const proofofidentityVc = await proofofidentityDraft.issue(mikoKey.id);
    console.log("Employment request VC issued");
    await proofofidentityVc.send(employerDid, mikoKey.id);
    console.log("Employment request VC sent to Employer");
  } catch (error) {
    console.error("Error during miko request employment contract", error);
  }

  // employer's side code to handle the request and send the response below

  try {
    const proofofidentity = employer_client.createVcDecorator(
      EmploymentContractRequest
    );
    const employmentcontract =
      employer_client.createVcDecorator(EmploymentContract);
    const employmentcontractresponse = employer_client.createVcDecorator(
      EmploymentContractResponse
    );
    const employerKey = await employer_client.keys.keyGenerate({
      data: {
        type: "ED25519",
      },
    });
    console.log("Employer key generated:", employerKey.id);
    const proofofidentityResults =
      await employer_client.credentials.credentialSearch({
        filter: [
          {
            data: {
              type: {
                operator: "IN",
                values: [proofofidentity.getCredentialTerm()],
              },
            },
          },
        ],
      });
    console.log(
      "Employment requests found:",
      proofofidentityResults.items.length
    );
    const fulfilledRequests =
      await employer_client.credentials.credentialSearch({
        filter: [
          {
            data: {
              type: {
                operator: "IN",
                values: [employmentcontractresponse.getCredentialTerm()],
              },
            },
          },
        ],
      });
    console.log("Fulfilled requests found:", fulfilledRequests.items.length);
    const unfulfilledRequests = proofofidentityResults.items.filter(
      (request) => {
        const { linkedId: requestLinkedId } =
          LinkedCredential.normalizeLinkedCredentialId(request.id);
        const isLinkedToResponse = fulfilledRequests.items.some((response) =>
          response.data.linkedCredentials?.includes(requestLinkedId)
        );
        return !isLinkedToResponse;
      }
    );
    console.log("Unfulfilled requests:", unfulfilledRequests.length);

    // for (const item of unfulfilledRequests) {
    //   const proofofidentityVc = proofofidentity.map(item);
    //   const { firstName } = await proofofidentityVc.getClaims();
    // }

    // above code can be used to access the request claims and perform some cutom logic based on the request claim and to operate on all the request claims at once
    // below code is to operate on the first claim of the request

    const contractDraft = await employmentcontract.create({
      claims: {
        nameofthecompany: "amsterdam'company",
        nameoftheemployee: "miko",
        position: "software developer",
        date_of_joining: "2022-01-01",
        phone_number: 1234567890,
        email: "miko@dif.com",
        salary: 10000,
        place_of_work: "onsite,amsterdam",
      },
    });
    console.log("contract draft created");
    const contractVc = await contractDraft.issue(employerKey.id);
    console.log("contract VC issued");

    const responseDraft = await employmentcontractresponse.create({
      claims: {
        request: proofofidentity.map(unfulfilledRequests[0]),
        contract: contractVc,
        employer_name: "amsterdam company",
      },
    });
    console.log("response draft created");
    const responseVc = await responseDraft.issue(employerKey.id);
    console.log("response VC issued");
    const presentation = await employer_client
      .createVpDecorator()
      .issue([contractVc, responseVc], employerKey.id);
    const { issuer: requesterDid } = await proofofidentity
      .map(unfulfilledRequests[0])
      .getMetaData();
    console.log("Requester DID:", requesterDid);
    await presentation.send(requesterDid, employerKey.id);
  } catch (error) {
    console.error("Error during Employer handling request:", error);
  }

  // miko's side code to handle the response below

  try {
    const employmentcontractresponse = miko_client.createVcDecorator(
      EmploymentContractResponse
    );
    const result = await miko_client.credentials.credentialSearch({
      sort: [
        {
          field: "DATA_VALID_FROM",
          order: "DESC",
        },
      ],
      filter: [
        {
          data: {
            type: {
              operator: "IN",
              values: [employmentcontractresponse.getCredentialTerm()],
            },
          },
        },
      ],
    });
    console.log("Employment responses found:", result.items.length);
    const employmentcontractresponseVc = employmentcontractresponse.map(
      result.items[0]
    );
    const responseClaims = await employmentcontractresponseVc.getClaims();
    const contractVc = await responseClaims.contract.dereference();
    const contractClaims = await contractVc.getClaims();
    console.log(
      `Employment contract details: ${contractClaims.nameofthecompany} (salary: $${
        contractClaims.salary
      })`
    );
  } catch (error) {
    console.error("Error during miko handles response:", error);
  }
}
// miko_to_employer_to_miko();

@VcContext({
  name: "proofofidentityrequest",
  namespace: "urn:dif:hackathon/MIKO/identity",
})
class ProofOfIdentityRequest {
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
  nationality!: string;

  @VcNotEmptyClaim
  father_name!: string;

  @VcNotEmptyClaim
  mother_name!: string;

  @VcNotEmptyClaim
  phone_number!: Number;
}

@VcContext({
  name: "proofofidentity",
  namespace: "urn:dif:hackathon/MIKO/identity",
})
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

@VcContext({
  name: "proofofidentityresponse",
  namespace: "urn:dif:hackathon/MIKO/identity",
})
class ProofOfIdentityResponse {
  @VcNotEmptyClaim
  @VcLinkedCredentialClaim(ProofOfIdentityRequest)
  request!: LinkedCredential<ProofOfIdentityRequest>;

  @VcNotEmptyClaim
  @VcLinkedCredentialClaim(ProofOfIdentitycontract)
  identity_card!: LinkedCredential<ProofOfIdentitycontract>;

  @VcNotEmptyClaim
  authority_name!: string;
}

async function miko_to_Immigration_Authority_to_miko() {
  // Miko's side code to request Proof of Identity
  try {
    const { id: employerDid } = await employer_client.dids.didDocumentSelfGet();
    const proofofidentityrequest = miko_client.createVcDecorator(
      ProofOfIdentityRequest
    );
    console.log("Employment request VC created");

    const proofofidentityDraft = await proofofidentityrequest.create({
      claims: {
        firstName: "Miko",
        lastName: "Dif",
        date_of_birth: "1990-01-01",
        address: "Amsterdam",
        place_of_birth: "Amsterdam",
        phone_number: 1234567890,
        father_name: "Father",
        mother_name: "Mother",
        nationality: "Dutch",
      },
    });
    console.log("Identity request draft created");

    const mikoKey = await miko_client.keys.keyGenerate({
      data: {
        type: "ED25519",
      },
    });
    console.log("Miko key generated:", mikoKey.id);

    const proofofidentityVc = await proofofidentityDraft.issue(mikoKey.id);
    console.log("Identity request VC issued");

    await proofofidentityVc.send(employerDid, mikoKey.id);
    console.log("Employment request VC sent to Employer");
  } catch (error) {
    console.error("Error during Miko request employment contract:", error);
  }

  // Employer's side code to handle the request and send the response
  try {
    const proofofidentityrequest = employer_client.createVcDecorator(
      ProofOfIdentityRequest
    );
    const proofofidentity = employer_client.createVcDecorator(
      ProofOfIdentitycontract
    );
    const proofofidentityresponse = employer_client.createVcDecorator(
      ProofOfIdentityResponse
    );

    const employerKey = await employer_client.keys.keyGenerate({
      data: {
        type: "ED25519",
      },
    });
    console.log("Employer key generated:", employerKey.id);

    const proofofidentityResults =
      await employer_client.credentials.credentialSearch({
        filter: [
          {
            data: {
              type: {
                operator: "IN",
                values: [proofofidentityrequest.getCredentialTerm()],
              },
            },
          },
        ],
      });
    console.log(
      "Employment requests found:",
      proofofidentityResults.items.length
    );

    const fulfilledRequests =
      await employer_client.credentials.credentialSearch({
        filter: [
          {
            data: {
              type: {
                operator: "IN",
                values: [proofofidentityresponse.getCredentialTerm()],
              },
            },
          },
        ],
      });
    console.log("Fulfilled requests found:", fulfilledRequests.items.length);

    const unfulfilledRequests = proofofidentityResults.items.filter(
      (request) => {
        const { linkedId: requestLinkedId } =
          LinkedCredential.normalizeLinkedCredentialId(request.id);
        const isLinkedToResponse = fulfilledRequests.items.some((response) =>
          response.data.linkedCredentials?.includes(requestLinkedId)
        );
        return !isLinkedToResponse;
      }
    );
    console.log("Unfulfilled requests:", unfulfilledRequests.length);

    if (unfulfilledRequests.length > 0) {
      const firstUnfulfilledRequest = unfulfilledRequests[0];

      try {
        const contractDraft = await proofofidentity.create({
          claims: {
            firstName: "Miko",
            lastName: "Dif",
            date_of_birth: "1990-01-01",
            address: "Amsterdam",
            place_of_birth: "Amsterdam",
            phone_number: 1234567890,
            mother_name: "Mother",
            nationality: "Dutch",
            father_name: "Father",
          },
        });
        console.log("Contract draft created");

        const contractVc = await contractDraft.issue(employerKey.id);
        console.log("Contract VC issued");

        const responseDraft = await proofofidentityresponse.create({
          claims: {
            request: proofofidentityrequest.map(firstUnfulfilledRequest),
            identity_card: contractVc,
            authority_name: "Municipality of Amsterdam",
          },
        });
        console.log("Response draft created");

        const responseVc = await responseDraft.issue(employerKey.id);
        console.log("Response VC issued");

        const presentation = await employer_client
          .createVpDecorator()
          .issue([contractVc, responseVc], employerKey.id);

        const { issuer: requesterDid } = await proofofidentityrequest
          .map(firstUnfulfilledRequest)
          .getMetaData();
        console.log("Requester DID:", requesterDid);

        await presentation.send(requesterDid, employerKey.id);
        console.log("Response sent to:", requesterDid);
      } catch (error) {
        console.error("Error mapping the credential:", error);
      }
    }
  } catch (error) {
    console.error("Error during municipality handling request:", error);
  }

  // Miko's side code to handle the response
  try {
    const proofofidentityresponse = miko_client.createVcDecorator(
      ProofOfIdentityResponse
    );
    const result = await miko_client.credentials.credentialSearch({
      sort: [
        {
          field: "DATA_VALID_FROM",
          order: "DESC",
        },
      ],
      filter: [
        {
          data: {
            type: {
              operator: "IN",
              values: [proofofidentityresponse.getCredentialTerm()],
            },
          },
        },
      ],
    });
    console.log("Employment responses found:", result.items.length);

    const employmentcontractresponseVc = proofofidentityresponse.map(
      result.items[0]
    );
    const responseClaims = await employmentcontractresponseVc.getClaims();
    const contractVc = await responseClaims.identity_card.dereference();
    const contractClaims = await contractVc.getClaims();

    console.log(
      `Employment contract details: ${contractClaims.firstName} (nationality: ${contractClaims.nationality})`
    );
  } catch (error) {
    console.error("Error during Miko handles response:", error);
  }
}

// miko_to_Immigration_Authority_to_miko();

@VcContext({
  name: "birthcertificaterequest",
  namespace: "urn:dif:hackathon/MIKO/birth",
})
class BirthCertificateRequest {
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
}

@VcContext({
  name: "birthcertificate",
  namespace: "urn:dif:hackathon/MIKO/birth",
})
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

@VcContext({
  name: "birthcertificateresponse",
  namespace: "urn:dif:hackathon/MIKO/birth",
})
class BirthCertificateResponse {
  @VcNotEmptyClaim
  @VcLinkedCredentialClaim(BirthCertificateRequest)
  request!: LinkedCredential<BirthCertificateRequest>;

  @VcNotEmptyClaim
  @VcLinkedCredentialClaim(BirthCertificate)
  certificate!: LinkedCredential<BirthCertificate>;

  @VcNotEmptyClaim
  issuingAuthority!: string;
}

async function miko_to_municipality_to_miko() {
  // Miko's request for a birth certificate
  try {
    console.log("=== Starting Miko's birth certificate request process ===");

    const { id: municipalityDid } =
      await employer_client.dids.didDocumentSelfGet();
    console.log("Municipality DID:", municipalityDid);

    const birthCertificateRequest = miko_client.createVcDecorator(
      BirthCertificateRequest
    );
    console.log("Created birth certificate request decorator");

    const requestDraft = await birthCertificateRequest.create({
      claims: {
        firstName: "Miko",
        lastName: "Dif",
        dateOfBirth: "2000-01-01",
        placeOfBirth: "Amsterdam",
        parentName: "John Dif",
      },
    });
    console.log(
      "Created request draft with claims:",
      await requestDraft.getClaims()
    );

    const mikoKey = await miko_client.keys.keyGenerate({
      data: { type: "ED25519" },
    });
    console.log("Generated Miko's key with ID:", mikoKey.id);

    const requestVc = await requestDraft.issue(mikoKey.id);
    console.log("Issued request VC");

    await requestVc.send(municipalityDid, mikoKey.id);
    console.log("Successfully sent birth certificate request to Municipality");
  } catch (error) {
    console.error("Error during birth certificate request from Miko:", error);
  }

  // Municipality handling the request and issuing the birth certificate
  try {
    console.log("\n=== Starting Municipality processing ===");

    const birthCertificateRequest = employer_client.createVcDecorator(
      BirthCertificateRequest
    );
    const birthCertificate =
      employer_client.createVcDecorator(BirthCertificate);
    const birthCertificateResponse = employer_client.createVcDecorator(
      BirthCertificateResponse
    );
    console.log("Created all required decorators");

    const municipalityKey = await employer_client.keys.keyGenerate({
      data: { type: "ED25519" },
    });
    console.log("Generated Municipality key with ID:", municipalityKey.id);

    const requestResults = await employer_client.credentials.credentialSearch({
      filter: [
        {
          data: {
            type: {
              operator: "IN",
              values: [birthCertificateRequest.getCredentialTerm()],
            },
          },
        },
      ],
    });

    const fulfilledRequests =
      await employer_client.credentials.credentialSearch({
        filter: [
          {
            data: {
              type: {
                operator: "IN",
                values: [birthCertificateResponse.getCredentialTerm()],
              },
            },
          },
        ],
      });
    console.log("Fulfilled requests found:", fulfilledRequests.items.length);

    const unfulfilledRequests = requestResults.items.filter((request) => {
      const { linkedId: requestLinkedId } =
        LinkedCredential.normalizeLinkedCredentialId(request.id);
      const isLinkedToResponse = fulfilledRequests.items.some((response) =>
        response.data.linkedCredentials?.includes(requestLinkedId)
      );
      return !isLinkedToResponse;
    });

    console.log("Found unfulfilled requests:", {
      count: unfulfilledRequests.length,
      requests: unfulfilledRequests.map((req) => req.id),
    });

    if (unfulfilledRequests.length > 0) {
      const firstUnfulfilledRequest = unfulfilledRequests[0];

      const certificateDraft = await birthCertificate.create({
        claims: {
          certificateID: "CERT12345",
          firstName: "Miko",
          lastName: "Dif",
          dateOfBirth: "2000-01-01",
          placeOfBirth: "Amsterdam",
          parentName: "John Dif",
          dateOfIssue: "2024-01-01",
        },
      });
      console.log("Created certificate draft");

      const certificateVc = await certificateDraft.issue(municipalityKey.id);
      console.log("Issued certificate VC");

      const responseDraft = await birthCertificateResponse.create({
        claims: {
          request: birthCertificateRequest.map(firstUnfulfilledRequest),
          certificate: certificateVc,
          issuingAuthority: "Amsterdam Municipality",
        },
      });
      console.log("Created response draft");

      const responseVc = await responseDraft.issue(municipalityKey.id);
      console.log("Issued response VC");

      // Create a presentation containing both VCs
      const presentation = await employer_client
        .createVpDecorator()
        .issue([certificateVc, responseVc], municipalityKey.id);

      const { issuer: requesterDid } = await birthCertificateRequest
        .map(firstUnfulfilledRequest)
        .getMetaData();
      console.log("Requester DID:", requesterDid);

      await presentation.send(requesterDid, municipalityKey.id);
      console.log("Successfully sent birth certificate response to requester");
    }
  } catch (error) {
    console.error("Error during Municipality handling request:", error);
  }

  // Miko handling the response
  try {
    console.log("\n=== Starting Miko's response handling ===");

    const birthCertificateResponse = miko_client.createVcDecorator(
      BirthCertificateResponse
    );
    console.log("Created response decorator");

    const result = await miko_client.credentials.credentialSearch({
      sort: [{ field: "DATA_VALID_FROM", order: "DESC" }],
      filter: [
        {
          data: {
            type: {
              operator: "IN",
              values: [birthCertificateResponse.getCredentialTerm()],
            },
          },
        },
      ],
    });
    console.log("Search results:", {
      totalResults: result.items.length,
      firstResultId: result.items[0]?.id,
    });

    const birthCertificateResponseVc = birthCertificateResponse.map(
      result.items[0]
    );
    console.log("Mapped response VC");

    const responseClaims = await birthCertificateResponseVc.getClaims();
    console.log("Response claims:", responseClaims);

    const certificateVc = await responseClaims.certificate.dereference();
    console.log("Dereferenced certificate VC");

    const certificateClaims = await certificateVc.getClaims();
    console.log("Final Birth Certificate Details:", certificateClaims);
  } catch (error) {
    console.error("Error during Miko handling response:", error);
  }
}
miko_to_municipality_to_miko();


@VcContext({
  name: "registeryrequest",
  namespace: "urn:dif:hackathon/MIKO/registery",
})
class Registeryrequest {
  @VcNotEmptyClaim
    @VcLinkedCredentialClaim(BirthCertificate)
  birth_certificate!: LinkedCredential<BirthCertificate>;
  @VcNotEmptyClaim
    @VcLinkedCredentialClaim(ProofOfIdentitycontract)
  proofofidentity_certificate!: LinkedCredential<ProofOfIdentitycontract>;

  @VcNotEmptyClaim
    @VcLinkedCredentialClaim(EmploymentContract)
  employment_contract!: LinkedCredential<EmploymentContract>;
  
}

@VcContext({
  name: "registerycertificate",
  namespace: "urn:dif:hackathon/MIKO/registery",
})
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

@VcContext({
  name: "RegisteryResponse",
  namespace: "urn:dif:hackathon/MIKO/registery",
})
class Registeryresponse {
  @VcNotEmptyClaim
  @VcLinkedCredentialClaim(Registeryrequest)
  request!: LinkedCredential<Registeryrequest>;

  @VcNotEmptyClaim
  @VcLinkedCredentialClaim(Registerycertificate)
  certificate!: LinkedCredential<Registerycertificate>;

  @VcNotEmptyClaim
  authority_name!: string;
}

async function miko_to_registery_to_miko() {
  // Miko's request for a registry certificate
  try {
    console.log("=== Starting Miko's registry request process ===");

    const { id: municipalityDid } =
      await employer_client.dids.didDocumentSelfGet();
    console.log("Municipality DID:", municipalityDid);

    const registeryRequest = miko_client.createVcDecorator(Registeryrequest);
    console.log("Created registry request decorator");

    const requestDraft = await registeryRequest.create({
    //   claims: {
    //     birth_certificate: ,
    //     proofofidentity_certificate: ,
    //     employment_contract: ,
    //   },
    });
    console.log(
      "Created request draft with claims:",
      await requestDraft.getClaims()
    );

    const mikoKey = await miko_client.keys.keyGenerate({
      data: { type: "ED25519" },
    });
    console.log("Generated Miko's key with ID:", mikoKey.id);

    const requestVc = await requestDraft.issue(mikoKey.id);
    console.log("Issued request VC");

    await requestVc.send(municipalityDid, mikoKey.id);
    console.log("Successfully sent registry request to Municipality");
  } catch (error) {
    console.error("Error during registry request from Miko:", error);
  }

  // Municipality handling the request and issuing the registry certificate
  try {
    console.log("\n=== Starting Municipality processing ===");

    const registeryRequest =
      employer_client.createVcDecorator(Registeryrequest);
    const registeryCertificate =
      employer_client.createVcDecorator(Registerycertificate);
    const registeryResponse =
      employer_client.createVcDecorator(Registeryresponse);
    console.log("Created all required decorators");

    const municipalityKey = await employer_client.keys.keyGenerate({
      data: { type: "ED25519" },
    });
    console.log("Generated Municipality key with ID:", municipalityKey.id);

    const requestResults = await employer_client.credentials.credentialSearch({
      filter: [
        {
          data: {
            type: {
              operator: "IN",
              values: [registeryRequest.getCredentialTerm()],
            },
          },
        },
      ],
    });

    const fulfilledRequests =
      await employer_client.credentials.credentialSearch({
        filter: [
          {
            data: {
              type: {
                operator: "IN",
                values: [registeryResponse.getCredentialTerm()],
              },
            },
          },
        ],
      });
    console.log("Fulfilled requests found:", fulfilledRequests.items.length);

    const unfulfilledRequests = requestResults.items.filter((request) => {
      const { linkedId: requestLinkedId } =
        LinkedCredential.normalizeLinkedCredentialId(request.id);
      const isLinkedToResponse = fulfilledRequests.items.some((response) =>
        response.data.linkedCredentials?.includes(requestLinkedId)
      );
      return !isLinkedToResponse;
    });

    console.log("Found unfulfilled requests:", {
      count: unfulfilledRequests.length,
      requests: unfulfilledRequests.map((req) => req.id),
    });

    if (unfulfilledRequests.length > 0) {
      const firstUnfulfilledRequest = unfulfilledRequests[0];

      const certificateDraft = await registeryCertificate.create({
      //   claims: {
      //     birth_certificate: ,
      //     proofofidentity_certificate: ,
      //     employment_contract: ,
      //     date_of_issue: "2024-01-01",
      //   },
      });
      console.log("Created registry certificate draft");

      const certificateVc = await certificateDraft.issue(municipalityKey.id);
      console.log("Issued registry certificate VC");

      const responseDraft = await registeryResponse.create({
        claims: {
          request: registeryRequest.map(firstUnfulfilledRequest),
          certificate: certificateVc,
          authority_name: "Registry Authority",
        },
      });
      console.log("Created registry response draft");

      const responseVc = await responseDraft.issue(municipalityKey.id);
      console.log("Issued registry response VC");

      // Create a presentation containing both VCs
      const presentation = await employer_client
        .createVpDecorator()
        .issue([certificateVc, responseVc], municipalityKey.id);

      const { issuer: requesterDid } = await registeryRequest
        .map(firstUnfulfilledRequest)
        .getMetaData();
      console.log("Requester DID:", requesterDid);

      await presentation.send(requesterDid, municipalityKey.id);
      console.log("Successfully sent registry response to requester");
    }
  } catch (error) {
    console.error("Error during Municipality handling request:", error);
  }

  // Miko handling the response
  try {
    console.log("\n=== Starting Miko's response handling ===");

    const registeryResponse = miko_client.createVcDecorator(Registeryresponse);
    console.log("Created response decorator");

    const result = await miko_client.credentials.credentialSearch({
      sort: [{ field: "DATA_VALID_FROM", order: "DESC" }],
      filter: [
        {
          data: {
            type: {
              operator: "IN",
              values: [registeryResponse.getCredentialTerm()],
            },
          },
        },
      ],
    });
    console.log("Search results:", {
      totalResults: result.items.length,
      firstResultId: result.items[0]?.id,
    });

    const registryResponseVc = registeryResponse.map(result.items[0]);
    console.log("Mapped response VC");

    const responseClaims = await registryResponseVc.getClaims();
    console.log("Response claims:", responseClaims);

    const certificateVc = await responseClaims.certificate.dereference();
    console.log("Dereferenced registry certificate VC");

    const certificateClaims = await certificateVc.getClaims();
    console.log("Final Registry Certificate Details:", certificateClaims);
  } catch (error) {
    console.error("Error during Miko handling response:", error);
  }
}
miko_to_municipality_to_miko();
app.post('/api/employment_offer',async(req,res)=>{
  try{
    await miko_to_employer_to_miko();
    res.status(200).json({ message: 'Employment offer letter processed successfully' });
  }
  catch(error){
    res.send("not working")
  }
})
app.get("/get_employment_letter", (req: Request, res: Response) => {
  miko_to_employer_to_miko();
  res.send("Employment Letter sent by Employer");
});

app.listen(4081, () => {
  console.log("Server is running on port 4081");
});