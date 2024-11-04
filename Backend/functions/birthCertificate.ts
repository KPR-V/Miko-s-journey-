import express from "express";
import { Express,Request, Response } from "express";  
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

export const TIM_API_KEY="BUIXl5X9PpqsUu7E85znIPhm7MOjVH5AcZMC23RVBF7-wEaGGaYrzWiMbiME6H4UzFBVhLyQalmRsMueMrBY2hF7HH-aafhYBByppZsdS0GEINSBPh_ZZ_s1PZu5esyFU59T6FUw968ZL4jLElrMG2rywL9vlRZh6LbxO378QsUQIcCitxcbtAVe1XYAyxPUBhfZQo3depR2YVs0crDnFjnO2kaPvkW9a_NEDMDymc6JsvYvnvReFZmZ4YjgHhCuH5WUZIJfklB5Vb1YCcIXWgpsPLxRPy01ORephbfGu-Ip8p5lSxFZ6K54hqFJ--WlqZhr6emDl2x6UkbSEL5Enw";
export const AIRLINE_API_KEY="lnSdlnhBrgE2Pavth9DyM5rWugdjvNuIziPbluD24EDlqlu5JYvypCM-Dgokiea8gsT7a3eQ2hXcsC_Doj4GN8fVfNq8ZXqSbtiaAEYmGtxkU2v2utDMV0d8l3It1s0X8MIsJ3apaoGwGTuUIBBaLUxoxli5cZCdJq21dKsbUDgMM5cBNq04FiDKqDn1g4iramRO-giO46vFAENuoDuv_TtcaZkYcaJBjD0t_YjO57Bjyd4pEMom0HOzZEBLsRnA6IFEuZxVV5M2CUbCbsENEEbGPtOfI8ssS0_7lqzDf0pp3lHhJ1J9HsE2DvxuxZ4J7IYBcuLBOCONZ3Z3mxuiVA";
export const miko_client = new TruvityClient({
    apiKey: TIM_API_KEY,
    environment: "https://api.truvity.cloud",
  });
  
export const employer_client = new TruvityClient({
    apiKey: AIRLINE_API_KEY,
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
export  class BirthCertificate {
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
  
export async function miko_to_municipality_to_miko() {
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