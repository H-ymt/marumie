import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/server/lib/prisma";
import { PrismaPoliticalOrganizationRepository } from "@/server/repositories/prisma-political-organization.repository";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import { PrismaBalanceSnapshotRepository } from "@/server/repositories/prisma-balance-snapshot.repository";
import { GetBalanceSheetUsecase } from "@/server/usecases/get-balance-sheet-usecase";
import { GetMockTransactionPageDataUsecase } from "@/server/usecases/get-mock-transaction-page-data-usecase";
import { GetMonthlyTransactionAggregationUsecase } from "@/server/usecases/get-monthly-transaction-aggregation-usecase";
import { GetSankeyAggregationUsecase } from "@/server/usecases/get-sankey-aggregation-usecase";
import {
  type GetTransactionsBySlugParams,
  GetTransactionsBySlugUsecase,
} from "@/server/usecases/get-transactions-by-slug-usecase";
const CACHE_REVALIDATE_SECONDS = 3600;

export interface TopPageDataParams
  extends Omit<GetTransactionsBySlugParams, "financialYear"> {
  financialYear: number; // 必須項目として設定
}

export const loadTopPageData = unstable_cache(
  async (params: TopPageDataParams) => {
    // モックデータを使用する場合
    if (process.env.USE_MOCK_DATA === "true") {
      const mockUsecase = new GetMockTransactionPageDataUsecase();
      return await mockUsecase.execute(params);
    }

    // 実データを取得する場合
    const transactionRepository = new PrismaTransactionRepository(prisma);
    const politicalOrganizationRepository =
      new PrismaPoliticalOrganizationRepository(prisma);
    const balanceSnapshotRepository = new PrismaBalanceSnapshotRepository(
      prisma,
    );

    // 5つのUsecaseを初期化
    const transactionUsecase = new GetTransactionsBySlugUsecase(
      transactionRepository,
      politicalOrganizationRepository,
    );

    const monthlyUsecase = new GetMonthlyTransactionAggregationUsecase(
      transactionRepository,
      politicalOrganizationRepository,
    );

    const sankeyUsecase = new GetSankeyAggregationUsecase(
      transactionRepository,
      politicalOrganizationRepository,
      balanceSnapshotRepository,
    );

    const balanceSheetUsecase = new GetBalanceSheetUsecase(
      transactionRepository,
      balanceSnapshotRepository,
      politicalOrganizationRepository,
    );

    // データ取得を2段階に分けて実行することで、データベースコネクションプールへの同時接続数を削減
    // 全てを同時実行するとコネクション上限に達する可能性があるため、段階的に実行する

    // 第1段階: transaction、monthly、balanceSheetを並列実行
    const [transactionData, monthlyData, balanceSheetData] = await Promise.all([
      transactionUsecase.execute(params),
      monthlyUsecase.execute({
        slugs: params.slugs,
        financialYear: params.financialYear,
      }),
      balanceSheetUsecase.execute({
        slugs: params.slugs,
        financialYear: params.financialYear,
      }),
    ]);

    // 第2段階: sankeyの2種類を並列実行
    const [sankeyPoliticalCategoryData, sankeyFriendlyCategoryData] =
      await Promise.all([
        sankeyUsecase.execute({
          slugs: params.slugs,
          financialYear: params.financialYear,
          categoryType: "political-category",
        }),
        sankeyUsecase.execute({
          slugs: params.slugs,
          financialYear: params.financialYear,
          categoryType: "friendly-category",
        }),
      ]);

    return {
      transactionData,
      monthlyData: monthlyData.monthlyData,
      political: sankeyPoliticalCategoryData.sankeyData,
      friendly: sankeyFriendlyCategoryData.sankeyData,
      balanceSheetData: balanceSheetData.balanceSheetData,
    };
  },
  ["top-page-data"],
  { revalidate: CACHE_REVALIDATE_SECONDS },
);
