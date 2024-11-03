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
const TIM_API_KEY="OrYwtDDJnaF3wMieDkdVyBzdXh48LNIJ7hOIazEAgr5rGNUuzD9ibobR9vxq28fabfbGiF565fBivGIXABNNP0YaH_9J3BttvcavUcrGen_ACc_vUTmRBzBtQbJmbL66MbXNqJZvP59D3f_234ixHC6Sh-gEeTRDVAN7Wb79ZBz1pO_Bs-sMZJ-W-I222_AhjepKcSzW7H108VNpOWbspV3-kpz1J6_rTpe5vPPynxxwpg8U-yEHBkJ_dmyk-9MR-MVAGnxZBR0xnz86euvqY9aLtKiVXzSGVcgBPY6-g307XBLPLCtWG6fp2w86bPLiGCjXFOA63ae9Ec-bIVO_9w";
const AIRLINE_API_KEY="jaaKKF3JTulaMs845qqS0NJRR8pR87ULisr4xnEF0283qdFZpHY7sqA1bY3-I2MxBVyirng1EowqTmI4N05UNvB-K_O2pjf2wZoKsM1pZpSnW4v7JZX17aFaxjWuFwbW_ZZhyCvpuvJt8zMtCob9G30HsyU_jEnT1Pl7DKTaybogxcJvTCltGN6dfpVelBd0XuZ_WAMJe0TW3kuDKhqWVC-woLe5zyZf6Ij5PYxqqEGg6Ve2kqGNdNhn3ZqHqLlwSY2uBieUDU832UVjb3tPF3DoE_1GWjFtTsrCXJVXBmYiJa1gICbGJnsu87E0R1jA1HKyuidcq4Rjp5keY930Pw";
const miko_client = new TruvityClient({
  apiKey:TIM_API_KEY,
  environment: "https://api.truvity.cloud",
});
// const key =TIM_API_KEY;
// console.log(key);
// console.log(process.env); // To see all loaded environment variables
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
    console.log(contractVc);
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
    // console.log(
    //   `Employment contract details: ${contractClaims.nameofthecompany} (salary: $${
    //     contractClaims.salary
    //   })`
    // );
    console.log(contractVc);
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
    const proofofidentityrequest = employer_client.createVcDecorator(ProofOfIdentityRequest);
    const proofofidentity = employer_client.createVcDecorator(ProofOfIdentitycontract);
    const proofofidentityresponse = employer_client.createVcDecorator(ProofOfIdentityResponse);

    const employerKey = await employer_client.keys.keyGenerate({
      data: {
        type: "ED25519",
      },
    });
    console.log("Employer key generated:", employerKey.id);

    const proofofidentityResults = await employer_client.credentials.credentialSearch({
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
    console.log("Employment requests found:",proofofidentityResults.items.length);

    const fulfilledRequests =await employer_client.credentials.credentialSearch({
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

        const presentation = await employer_client.createVpDecorator().issue([contractVc, responseVc], employerKey.id);

        const { issuer: requesterDid } = await proofofidentityrequest.map(firstUnfulfilledRequest).getMetaData();
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
        } ],
      
    });
    console.log("Employment responses found:", result.items.length);

    const employmentcontractresponseVc = proofofidentityresponse.map(result.items[0] );
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
@VcContext({
  name: "financialstabilityrequest",
  namespace: "urn:dif:hackathon/MIKO/financial",
})
class FinancialStabilityRequest {
  @VcNotEmptyClaim
  firstName!: string;

  @VcNotEmptyClaim
  lastName!: string;

  @VcNotEmptyClaim
  email!: string;

  @VcNotEmptyClaim
  requested_for_purpose!: string; // e.g., loan application, visa, etc.
}

@VcContext({
  name: "financialstability",
  namespace: "urn:dif:hackathon/MIKO/financial",
})
class FinancialStability {
  @VcNotEmptyClaim
  annual_income!: Number;

  @VcNotEmptyClaim
  credit_score!: Number;

  @VcNotEmptyClaim
  assets_worth!: Number;

  @VcNotEmptyClaim
  outstanding_loans!: Number;

  @VcNotEmptyClaim
  income_source!: string; // e.g., employment, business, etc.
}

@VcContext({
  name: "financialstabilityresponse",
  namespace: "urn:dif:hackathon/MIKO/financial",
})
class FinancialStabilityResponse {
  @VcNotEmptyClaim
  @VcLinkedCredentialClaim(FinancialStabilityRequest)
  request!: LinkedCredential<FinancialStabilityRequest>;

  @VcNotEmptyClaim
  @VcLinkedCredentialClaim(FinancialStability)
  financial_details!: LinkedCredential<FinancialStability>;

  @VcNotEmptyClaim
  issuer_name!: string; // e.g., Municipal Corporation
}


async function miko_to_municipal_corp_to_miko() {
  // Miko's side code to request proof of financial stability

  try {
    const { id: municipalDid } = await employer_client.dids.didDocumentSelfGet();
    const financialRequest = miko_client.createVcDecorator(
      FinancialStabilityRequest
    );
    console.log("Financial stability request VC created");

    const financialRequestDraft = await financialRequest.create({
      claims: {
        firstName: "Miko",
        lastName: "Dif",
        email: "miko@dif.com",
        requested_for_purpose: "Visa application",
      },
    });
    console.log("Financial stability request draft created");

    const mikoKey = await miko_client.keys.keyGenerate({
      data: {
        type: "ED25519",
      },
    });
    console.log("Miko key generated:", mikoKey.id);

    const financialRequestVc = await financialRequestDraft.issue(mikoKey.id);
    console.log("Financial stability request VC issued");

    await financialRequestVc.send(municipalDid, mikoKey.id);
    console.log("Financial stability request VC sent to Municipal Corporation");

  } catch (error) {
    console.error("Error during Miko's request for financial stability", error);
  }

  // Municipal Corporation's side code to handle the request and send response

  try {
    const financialRequest = employer_client.createVcDecorator(
      FinancialStabilityRequest
    );
    const financialDetails = employer_client.createVcDecorator(FinancialStability);
    const financialResponse = employer_client.createVcDecorator(FinancialStabilityResponse);

    const municipalKey = await employer_client.keys.keyGenerate({
      data: {
        type: "ED25519",
      },
    });
    console.log("Municipal key generated:", municipalKey.id);

    const requestResults = await employer_client.credentials.credentialSearch({
      filter: [
        {
          data: {
            type: {
              operator: "IN",
              values: [financialRequest.getCredentialTerm()],
            },
          },
        },
      ],
    });
    console.log("Financial stability requests found:", requestResults.items.length);

    const unfulfilledRequests = requestResults.items; // Assuming no responses yet for simplicity

    // Process the first request
    const financialDraft = await financialDetails.create({
      claims: {
        annual_income: 60000,
        credit_score: 750,
        assets_worth: 150000,
        outstanding_loans: 5000,
        income_source: "Employment",
      },
    });
    console.log("Financial details draft created");

    const financialVc = await financialDraft.issue(municipalKey.id);
    console.log("Financial details VC issued");

    const responseDraft = await financialResponse.create({
      claims: {
        request: financialRequest.map(unfulfilledRequests[0]),
        financial_details: financialVc,
        issuer_name: "Municipal Corporation",
      },
    });
    console.log("Financial stability response draft created");

    const responseVc = await responseDraft.issue(municipalKey.id);
    console.log("Financial stability response VC issued");

    const presentation = await employer_client
      .createVpDecorator()
      .issue([financialVc, responseVc], municipalKey.id);

    const { issuer: requesterDid } = await financialRequest
      .map(unfulfilledRequests[0])
      .getMetaData();
    console.log("Requester DID:", requesterDid);

    await presentation.send(requesterDid, municipalKey.id);
  } catch (error) {
    console.error("Error during Municipal Corporation handling request:", error);
  }

  // Miko's side code to handle the response

  try {
    const financialResponse = miko_client.createVcDecorator(FinancialStabilityResponse);
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
              values: [financialResponse.getCredentialTerm()],
            },
          },
        },
      ],
    });
    console.log("Financial stability responses found:", result.items.length);

    const financialResponseVc = financialResponse.map(result.items[0]);
    const responseClaims = await financialResponseVc.getClaims();
    const financialVc = await responseClaims.financial_details.dereference();
    const financialClaims = await financialVc.getClaims();

    console.log("Financial details:", financialClaims);
  } catch (error) {
    console.error("Error during Miko handling response:", error);
  }
}
miko_to_municipal_corp_to_miko();

const MUNICIPALITY_API_KEY = AIRLINE_API_KEY;
const municipality_client = new TruvityClient({
  apiKey: MUNICIPALITY_API_KEY,
  environment: "https://api.truvity.cloud",
});


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
    const { id: municipalityDid } = await municipality_client.dids.didDocumentSelfGet();
    const birthCertificateRequest = miko_client.createVcDecorator(BirthCertificateRequest);
    const requestDraft = await birthCertificateRequest.create({
      claims: {
        firstName: "Miko",
        lastName: "Dif",
        dateOfBirth: "2000-01-01",
        placeOfBirth: "Amsterdam",
        parentName: "John Dif",
      },
    });
    const mikoKey = await miko_client.keys.keyGenerate({ data: { type: "ED25519" } });
    const requestVc = await requestDraft.issue(mikoKey.id);
    await requestVc.send(municipalityDid, mikoKey.id);
    console.log("Birth certificate request sent to Municipality");
  } catch (error) {
    console.error("Error during birth certificate request from Miko:", error);
  }

  // Municipality handling the request and issuing the birth certificate
  try {
    const birthCertificateRequest = municipality_client.createVcDecorator(BirthCertificateRequest);
    const birthCertificate = municipality_client.createVcDecorator(BirthCertificate);
    const birthCertificateResponse = municipality_client.createVcDecorator(BirthCertificateResponse);
    const municipalityKey = await municipality_client.keys.keyGenerate({ data: { type: "ED25519" } });

    const requestResults = await municipality_client.credentials.credentialSearch({
      filter: [
        {
          data: { type: { operator: "IN", values: [birthCertificateRequest.getCredentialTerm()] } },
        },
      ],
    });

    const unfulfilledRequests = requestResults.items;
    console.log("Unfulfilled birth certificate requests:", unfulfilledRequests.length);

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
    const certificateVc = await certificateDraft.issue(municipalityKey.id);

    const responseDraft = await birthCertificateResponse.create({
      claims: {
        request: birthCertificateRequest.map(unfulfilledRequests[0]),
        certificate: certificateVc,
        issuingAuthority: "Amsterdam Municipality",
      },
    });
    const responseVc = await responseDraft.issue(municipalityKey.id);
    const { issuer: requesterDid } = await birthCertificateRequest.map(unfulfilledRequests[0]).getMetaData();
    await responseVc.send(requesterDid, municipalityKey.id);
    console.log("Birth certificate response sent to Miko");
  } catch (error) {
    console.error("Error during Municipality handling request:", error);
  }

  // Miko handling the response
  try {
    const birthCertificateResponse = miko_client.createVcDecorator(BirthCertificateResponse);
    const result = await miko_client.credentials.credentialSearch({
      sort: [{ field: "DATA_VALID_FROM", order: "DESC" }],
      filter: [
        { data: { type: { operator: "IN", values: [birthCertificateResponse.getCredentialTerm()] } } },
      ],
    });

    const birthCertificateResponseVc = birthCertificateResponse.map(result.items[0]);
    const responseClaims = await birthCertificateResponseVc.getClaims();
    const certificateVc = await responseClaims.certificate.dereference();
    const certificateClaims = await certificateVc.getClaims();

    console.log("Birth Certificate Details:", certificateClaims);
  } catch (error) {
    console.error("Error during Miko handling response:", error);
  }
}
// miko_to_municipality_to_miko();

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