import "server-only";

import { loadPoliticalOrganizationsData } from "@/server/loaders/load-political-organizations-data";
import { uploadCsv } from "@/server/actions/upload-csv";
import { previewCsv } from "@/server/actions/preview-csv";
import CsvUploadClient from "@/client/components/csv-upload/CsvUploadClient";

export default async function UploadCsvPage() {
  const organizations = await loadPoliticalOrganizationsData();

  return (
    <div className="bg-primary-panel rounded-xl p-4">
      <h1 className="text-2xl font-bold text-white mb-6">CSVアップロード</h1>
      <CsvUploadClient
        organizations={organizations}
        uploadAction={uploadCsv}
        previewAction={previewCsv}
      />
    </div>
  );
}
