import "server-only";
import AboutSection from "@/client/components/common/AboutSection";
import ExplanationSection from "@/client/components/common/ExplanationSection";
import TransparencySection from "@/client/components/common/TransparencySection";
import MainColumn from "@/client/components/layout/MainColumn";
import CashFlowSection from "@/client/components/top-page/CashFlowSection";
import DonationSummarySection from "@/client/components/top-page/DonationSummarySection";
import MonthlyTrendsSection from "@/client/components/top-page/MonthlyTrendsSection";
import TransactionsSection from "@/client/components/top-page/TransactionsSection";
import { loadTopPageData } from "@/server/loaders/load-top-page-data";
import { formatUpdatedAt } from "@/server/utils/format-date";

export const revalidate = 300; // 5 minutes

export default async function Home() {
  const slugs = ["team-mirai", "digimin"];

  // 統合アクションで全データを取得
  const data = await loadTopPageData({
    slugs,
    page: 1,
    perPage: 6, // 表示用に7件のみ取得
    financialYear: 2025, // デフォルト値
  }).catch(() => null);

  const updatedAt = formatUpdatedAt(
    data?.transactionData?.lastUpdatedAt ?? null,
  );

  return (
    <MainColumn>
      <CashFlowSection
        political={data?.political ?? null}
        friendly={data?.friendly ?? null}
        updatedAt={updatedAt}
      />
      <MonthlyTrendsSection
        monthlyData={data?.monthlyData}
        updatedAt={updatedAt}
      />
      <DonationSummarySection
        donationSummary={data?.donationSummary}
        updatedAt={updatedAt}
      />
      <TransparencySection title="党首も毎日これを見て、お金をやりくりしています👀" />
      <TransactionsSection
        transactionData={data?.transactionData ?? null}
        updatedAt={updatedAt}
      />
      <AboutSection />
      <ExplanationSection />
    </MainColumn>
  );
}
