export interface ExcelDownloadRequest {
    headers: string[];
    columnWidths: { wch: number }[];
    rows: (string | number | null)[][]
    sheetName?: string;
    fileName?: string;
}

export interface ExcelDownloadResponse {
    success: boolean;
    buffer?: ArrayBuffer;
    name?: string;
    message?: string;
    stack?: string;
}
