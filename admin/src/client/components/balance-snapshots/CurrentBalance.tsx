import type { BalanceSnapshot } from "@/shared/models/balance-snapshot";

interface CurrentBalanceProps {
  snapshot: BalanceSnapshot | null;
}

export default function CurrentBalance({ snapshot }: CurrentBalanceProps) {
  if (!snapshot) {
    return (
      <div className="bg-primary-card rounded-lg p-6 border border-primary-border max-w-md">
        <h3 className="text-lg font-medium text-white mb-4">現在有効な残高</h3>
        <p className="text-primary-muted">残高スナップショットがありません</p>
      </div>
    );
  }

  return (
    <div className="bg-primary-card rounded-lg p-6 border border-primary-border max-w-md">
      <h3 className="text-lg font-medium text-white mb-4">現在有効な残高</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-primary-muted">残高</span>
          <span className="text-2xl font-bold text-white">
            ¥{snapshot.balance.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-primary-muted">残高日付</span>
          <span className="text-white">
            {new Date(snapshot.snapshot_date).toLocaleDateString("ja-JP")}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-primary-muted">登録日時</span>
          <span className="text-primary-muted text-sm">
            {new Date(snapshot.created_at).toLocaleString("ja-JP")}
          </span>
        </div>
      </div>
    </div>
  );
}
