import express from "express";
import { Express, Request, Response } from "express";
import cors from "cors";
import {
  TruvityClient,
  LinkedCredential,
  VcContext,
  VcLinkedCredentialClaim,
  VcNotEmptyClaim,
} from "@truvity/sdk";

import "reflect-metadata";
import "dotenv/config";

const TIM_API_KEY =
  "BUIXl5X9PpqsUu7E85znIPhm7MOjVH5AcZMC23RVBF7-wEaGGaYrzWiMbiME6H4UzFBVhLyQalmRsMueMrBY2hF7HH-aafhYBByppZsdS0GEINSBPh_ZZ_s1PZu5esyFU59T6FUw968ZL4jLElrMG2rywL9vlRZh6LbxO378QsUQIcCitxcbtAVe1XYAyxPUBhfZQo3depR2YVs0crDnFjnO2kaPvkW9a_NEDMDymc6JsvYvnvReFZmZ4YjgHhCuH5WUZIJfklB5Vb1YCcIXWgpsPLxRPy01ORephbfGu-Ip8p5lSxFZ6K54hqFJ--WlqZhr6emDl2x6UkbSEL5Enw";
const AIRLINE_API_KEY =
  "lnSdlnhBrgE2Pavth9DyM5rWugdjvNuIziPbluD24EDlqlu5JYvypCM-Dgokiea8gsT7a3eQ2hXcsC_Doj4GN8fVfNq8ZXqSbtiaAEYmGtxkU2v2utDMV0d8l3It1s0X8MIsJ3apaoGwGTuUIBBaLUxoxli5cZCdJq21dKsbUDgMM5cBNq04FiDKqDn1g4iramRO-giO46vFAENuoDuv_TtcaZkYcaJBjD0t_YjO57Bjyd4pEMom0HOzZEBLsRnA6IFEuZxVV5M2CUbCbsENEEbGPtOfI8ssS0_7lqzDf0pp3lHhJ1J9HsE2DvxuxZ4J7IYBcuLBOCONZ3Z3mxuiVA";
const miko_client = new TruvityClient({
  apiKey: TIM_API_KEY,
  environment: "https://api.truvity.cloud",
});

const employer_client = new TruvityClient({
  apiKey: AIRLINE_API_KEY,
  environment: "https://api.truvity.cloud",
});

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
export class ProofOfIdentitycontract {
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

export async function miko_to_Immigration_Authority_to_miko() {
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
