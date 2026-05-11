import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEFAULT_TC_DIR = path.join(__dirname, "tc_template");
if (!fs.existsSync(DEFAULT_TC_DIR)) {
  fs.mkdirSync(DEFAULT_TC_DIR, { recursive: true });
  console.error(`[qa-agent] Created default TC folder: ${DEFAULT_TC_DIR}`);
}

const server = new McpServer({
  name: "SauceDemoTestGen",
  version: "1.0.0",
});

server.tool(
  "generate_excel_tc",
  `Generate Excel test case file from structured TC data.

IMPORTANT FORMATTING RULES for Claude when generating test cases:
- "preconditions" field: use numbered list format, e.g. "1. User is on login page\n2. Browser is open\n3. Cart is empty"
- "steps" field: use numbered list format, e.g. "1. Navigate to URL\n2. Enter username\n3. Click Login"
- "expected_result" field: use numbered list format, e.g. "1. User is redirected to /inventory.html\n2. Cart badge shows 1"
- "type" must be exactly one of: "Positive", "Negative", "Edge Case" — determined by Claude based on the test case content
- "status" must be exactly one of: "Untested", "Passed", "Failed"
- If save_path is not provided, file will be saved to tc_template/{ticket_key}_Test_Cases.xlsx`,
  {
    ticket_key: z.string().describe("Jira ticket key e.g. KAN-1"),
    save_path: z
      .string()
      .optional()
      .describe(
        "Optional full path to save the Excel file. If not provided, defaults to tc_template/{ticket_key}_Test_Cases.xlsx",
      ),
    test_cases: z
      .array(
        z.object({
          id: z.string().describe("Test case ID e.g. TC-001"),
          type: z
            .enum(["Positive", "Negative", "Edge Case"])
            .describe("Type of test case — determined by Claude"),
          title: z.string().describe("Short descriptive title"),
          preconditions: z.string().describe("Numbered list of preconditions"),
          steps: z.string().describe("Numbered list of test steps"),
          expected_result: z
            .string()
            .describe("Numbered list of expected results"),
          status: z.enum(["Untested", "Passed", "Failed"]).default("Untested"),
        }),
      )
      .describe("List of test cases to write into Excel"),
  },
  async ({ ticket_key, save_path, test_cases }) => {
    try {
      const resolvedPath = save_path
        ? save_path
        : path.join(DEFAULT_TC_DIR, `${ticket_key}_Test_Cases.xlsx`);

      const dir = path.dirname(resolvedPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet(`${ticket_key} Test Cases`);

      ws.columns = [
        { key: "id", width: 15 },
        { key: "type", width: 15 },
        { key: "title", width: 30 },
        { key: "pre", width: 35 },
        { key: "steps", width: 50 },
        { key: "expect", width: 40 },
        { key: "status", width: 15 },
      ];

      // Header row
      const header = ws.addRow([
        "Test Case ID",
        "Type",
        "Title",
        "Preconditions",
        "Steps",
        "Expected Result",
        "Status",
      ]);
      header.height = 25;
      header.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4A4A4A" },
        };
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
      });

      const borderStyle = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };

      const statusColors = {
        Passed: { bg: "FF90EE90", font: "FF1A5C1A" },
        Failed: { bg: "FFFF9999", font: "FF8B0000" },
        Untested: { bg: "FFD3D3D3", font: "FF444444" },
      };

      const typeColors = {
        Positive: { bg: "FFE8F5E9", font: "FF2E7D32" },
        Negative: { bg: "FFFCE4EC", font: "FFC62828" },
        "Edge Case": { bg: "FFFFF8E1", font: "FFF57F17" },
      };

      for (const tc of test_cases) {
        const row = ws.addRow([
          tc.id,
          tc.type,
          tc.title,
          tc.preconditions,
          tc.steps,
          tc.expected_result,
          tc.status,
        ]);

        const statusColor = statusColors[tc.status] || statusColors["Untested"];
        const typeColor = typeColors[tc.type] || {
          bg: "FFFFFFFF",
          font: "FF000000",
        };

        row.eachCell((cell, colNumber) => {
          cell.border = borderStyle;
          cell.alignment = { vertical: "top", wrapText: true };
          cell.font = { size: 11 };

          // Type cell (col 2) — colored, no dropdown
          if (colNumber === 2) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: typeColor.bg },
            };
            cell.font = {
              size: 11,
              bold: true,
              color: { argb: typeColor.font },
            };
            cell.alignment = {
              horizontal: "center",
              vertical: "middle",
              wrapText: true,
            };
          }

          // Status cell (col 7) — colored
          if (colNumber === 7) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: statusColor.bg },
            };
            cell.font = {
              size: 11,
              bold: true,
              color: { argb: statusColor.font },
            };
            cell.alignment = {
              horizontal: "center",
              vertical: "middle",
              wrapText: true,
            };
          }
        });
      }

      // Conditional formatting — status column G only
      ws.addConditionalFormatting({
        ref: `G2:G${test_cases.length + 1}`,
        rules: [
          {
            type: "expression",
            formulae: ['$G2="Passed"'],
            style: {
              fill: {
                type: "pattern",
                pattern: "solid",
                bgColor: { argb: "FF90EE90" },
              },
              font: { bold: true, color: { argb: "FF1A5C1A" } },
            },
            priority: 1,
          },
          {
            type: "expression",
            formulae: ['$G2="Failed"'],
            style: {
              fill: {
                type: "pattern",
                pattern: "solid",
                bgColor: { argb: "FFFF9999" },
              },
              font: { bold: true, color: { argb: "FF8B0000" } },
            },
            priority: 2,
          },
          {
            type: "expression",
            formulae: ['$G2="Untested"'],
            style: {
              fill: {
                type: "pattern",
                pattern: "solid",
                bgColor: { argb: "FFD3D3D3" },
              },
              font: { bold: true, color: { argb: "FF444444" } },
            },
            priority: 3,
          },
        ],
      });

      // Status dropdown — kolom G only
      ws.dataValidations.add("G2:G1000", {
        type: "list",
        allowBlank: false,
        formulae: ['"Passed,Failed,Untested"'],
        showErrorMessage: true,
        errorTitle: "Invalid value",
        error: "Please select Passed, Failed, or Untested",
      });

      await wb.xlsx.writeFile(resolvedPath);

      return {
        content: [
          {
            type: "text",
            text: `✅ Excel saved to: ${resolvedPath}\n📋 Total test cases: ${test_cases.length}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `❌ Error: ${err.message}` }],
        isError: true,
      };
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
