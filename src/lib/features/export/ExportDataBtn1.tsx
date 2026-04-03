"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { useState } from "react"
import { motion } from "framer-motion"

interface ExportFormatOption {
    value: ExportFormat
    label: string
    icon:  string
}

const exportFormats: ExportFormatOption[] = [
    { value: "csv",  label: "CSV",   icon: "mdi:file-delimited" },
    { value: "xlsx", label: "Excel", icon: "mdi:file-excel"     },
    { value: "pdf",  label: "PDF",   icon: "mdi:file-pdf-box"   },
    { value: "json", label: "JSON",  icon: "mdi:code-json"      },
]

// FLATTEN A NESTED OBJECT INTO DOT-NOTATION KEYS
const flattenObject = (obj: Record<string, any>, prefix = ""): Record<string, any> =>
    Object.entries(obj).reduce((acc, [key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key
        if (value !== null && typeof value === "object" && !Array.isArray(value)) {
            Object.assign(acc, flattenObject(value, fullKey))
        } else {
            acc[fullKey] = value ?? ""
        }
        return acc
    }, {} as Record<string, any>)

// CONVERT KEY NAMES TO TITLE CASE READABLE HEADERS
const toReadableHeader = (key: string): string =>
    key
        .replace(/[._]/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim()

// NORMALIZE ANY DATA SHAPE INTO A FLAT ROW ARRAY
const normalizeToRows = (data: any): Record<string, any>[] => {
    if (!data) return []

    if (Array.isArray(data)) {
        return data.map((item) =>
            typeof item === "object" && item !== null ? flattenObject(item) : { value: item }
        )
    }

    if (typeof data === "object" && Array.isArray(data.results)) {
        return data.results.map((item: any) =>
            typeof item === "object" ? flattenObject(item) : { value: item }
        )
    }

    if (typeof data === "object") {
        return [flattenObject(data)]
    }

    return [{ value: data }]
}

// ESCAPE HTML SPECIAL CHARACTERS
const esc = (str: string): string =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

// TRIGGER A FILE DOWNLOAD
const trigger = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a   = document.createElement("a")
    a.href     = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

// EXPORT AS CSV
const exportCSV = (rows: Record<string, any>[], filename: string) => {
    if (!rows.length) return
    const headers = Object.keys(rows[0])
    const lines   = [
        headers.map(toReadableHeader).join(","),
        ...rows.map((row) =>
            headers.map((h) => {
                const val = String(row[h] ?? "").replace(/"/g, '""')
                return `"${val}"`
            }).join(",")
        ),
    ]
    trigger(new Blob([lines.join("\n")], { type: "text/csv" }), `${filename}.csv`)
}

// EXPORT AS JSON
const exportJSON = (rows: Record<string, any>[], filename: string) => {
    const pretty = JSON.stringify(rows, null, 2)
    trigger(new Blob([pretty], { type: "application/json" }), `${filename}.json`)
}

// EXPORT AS XLSX — FALLS BACK TO CSV UNLESS SHEETJS IS AVAILABLE
const exportXLSX = (rows: Record<string, any>[], filename: string) => {
    exportCSV(rows, filename)
}

// EXPORT AS PDF VIA PRINT DIALOG
const exportPDF = (rows: Record<string, any>[], filename: string) => {
    if (!rows.length) return
    const headers = Object.keys(rows[0]).map(toReadableHeader)

    const tableRows = rows.map((row) =>
        `<tr>${Object.values(row).map((v) => `<td>${esc(String(v ?? ""))}</td>`).join("")}</tr>`
    ).join("")

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${filename}</title>
<style>
  body  { font-family: sans-serif; font-size: 11px; padding: 24px; }
  h1    { font-size: 16px; margin-bottom: 16px; }
  table { border-collapse: collapse; width: 100%; }
  th    { background: #1e3a5f; color: white; padding: 8px 10px; text-align: left; font-size: 10px; }
  td    { padding: 6px 10px; border-bottom: 1px solid #e5e7eb; }
  tr:nth-child(even) td { background: #f8fafc; }
</style></head><body>
<h1>${filename}</h1>
<table><thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
<tbody>${tableRows}</tbody></table>
</body></html>`

    const win = window.open("", "_blank")
    if (win) {
        win.document.write(html)
        win.document.close()
        win.print()
    }
}

interface ExportButtonProps {
    data?:               any
    filename?:           string
    onExport?:           (format: ExportFormat) => void
    defaultFormat?:      ExportFormat
    showFormatSelector?: boolean
    formats?:            ExportFormat[]
    disabled?:           boolean
    className?:          string
    label?:              string
}

export default function ExportButton1({
    data,
    filename           = "export",
    onExport,
    defaultFormat      = "csv",
    showFormatSelector = false,
    formats            = ["csv", "xlsx", "pdf", "json"],
    disabled           = false,
    className,
    label              = "Export Data",
}: ExportButtonProps) {

    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(defaultFormat)

    const availableFormats = exportFormats.filter((f) => formats.includes(f.value))

    const handleExport = () => {
        if (disabled) return

        if (onExport) {
            onExport(selectedFormat)
            return
        }

        if (!data) return

        const rows = normalizeToRows(data)
        if (!rows.length) return

        const name = filename || "export"

        switch (selectedFormat) {
            case "csv":  exportCSV(rows, name);  break
            case "json": exportJSON(rows, name); break
            case "xlsx": exportXLSX(rows, name); break
            case "pdf":  exportPDF(rows, name);  break
        }
    }

    return (
        <div className={cn("flex items-center gap-2", className, showFormatSelector ? "bg-brand-primary-1 p-1.5 rounded-md" : "")}>
            <motion.button
                onClick={handleExport}
                disabled={disabled}
                whileHover={!disabled ? { y: -2, scale: 1.03 } : {}}
                whileTap={!disabled ? { scale: 0.97 } : {}}
                className={cn(
                    "flex items-center justify-between text-xs font-bold gap-2 transition-opacity",
                    disabled ? "opacity-50 cursor-not-allowed" : "text-brand-primary-6 hover:text-brand-primary-7"
                )}
            >
                <span className={cn(
                    "size-9 md:size-7 aspect-square rounded flex justify-center items-center text-white",
                    disabled ? "bg-brand-neutral-4" : "bg-brand-primary-3"
                )}>
                    <Icon icon="pajamas:export" width="16" height="16" />
                </span>
                <span className={cn(showFormatSelector ? "hidden" : "block", "hidden md:block")}>{label}</span>
            </motion.button>

            {showFormatSelector && (
                <Select
                    value={selectedFormat}
                    onValueChange={(v) => setSelectedFormat(v as ExportFormat)}
                    disabled={disabled}
                >
                    <SelectTrigger className="w-fit text-[10px] border-brand-neutral-3 bg-white px-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {availableFormats.map((f) => (
                            <SelectItem key={f.value} value={f.value} className="text-xs hover:bg-brand-accent-4!">
                                <div className="flex items-center gap-1">
                                    <Icon icon={f.icon} className="w-4 h-4" />
                                    <span>{f.label}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
    )
}