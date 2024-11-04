
import {
    TruvityClient,
    LinkedCredential,
    VcContext,
    VcLinkedCredentialClaim,
    VcNotEmptyClaim,
  } from "@truvity/sdk";
  
import "reflect-metadata";
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

