"use server";

import { Result, ok, err, internalError } from "../../../shared/lib/result";
import { logger } from "../../../shared/lib/logger";
import { validateSchema } from "../../../shared/lib/validators";
import { CircuitBreakerFactory } from "../../../shared/lib/circuit-breaker";
import { getAssetSchema, getLiabilitySchema, getCreditCardSchema } from "../schemas";
import { wealthRepository } from "../data/repository";
import { revalidatePath } from "next/cache";

const dbBreaker = CircuitBreakerFactory.database("wealth-db");

export async function getWealthData(): Promise<Result<{ assets: any[], liabilities: any[], creditCards: any[] }>> {
  try {
    const result = await dbBreaker.execute(async () => {
      const [assets, liabilities, creditCards] = await Promise.all([
        wealthRepository.getAssets(),
        wealthRepository.getLiabilities(),
        wealthRepository.getCreditCards()
      ]);
      return { assets, liabilities, creditCards };
    });
    return ok(result);
  } catch (error: any) {
    logger.error({ msg: "FETCH_WEALTH_ERROR", error: error.message }, "Error fetching wealth data");
    return err(internalError("Error fetching wealth data", { details: error.message }));
  }
}

export async function createAsset(input: unknown): Promise<Result<any>> {
  const validation = await validateSchema(input, getAssetSchema());
  if (!validation.isOk) return err(validation.error);

  try {
    const result = await dbBreaker.execute(async () => {
      return await wealthRepository.createAsset(validation.value);
    });
    revalidatePath("/[lang]", "layout");
    return ok(result);
  } catch (error: any) {
    return err(internalError("Error creating asset", { details: error.message }));
  }
}

export async function createLiability(input: unknown): Promise<Result<any>> {
  const validation = await validateSchema(input, getLiabilitySchema());
  if (!validation.isOk) return err(validation.error);

  try {
    const result = await dbBreaker.execute(async () => {
      return await wealthRepository.createLiability(validation.value);
    });
    revalidatePath("/[lang]", "layout");
    return ok(result);
  } catch (error: any) {
    return err(internalError("Error creating liability", { details: error.message }));
  }
}

export async function createCreditCard(input: unknown): Promise<Result<any>> {
  const validation = await validateSchema(input, getCreditCardSchema());
  if (!validation.isOk) return err(validation.error);

  try {
    const result = await dbBreaker.execute(async () => {
      return await wealthRepository.createCreditCard(validation.value);
    });
    revalidatePath("/[lang]", "layout");
    return ok(result);
  } catch (error: any) {
    return err(internalError("Error creating credit card", { details: error.message }));
  }
}
