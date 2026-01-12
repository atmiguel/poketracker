import { SpreadsheetManager } from "./impls/spreadsheet-manager";

async function main() {
  const manager = SpreadsheetManager.create({
    spreadsheetId: "1vZGdDiu5JCOpTXwgs-dBzNH51svwcnRkrzpuEqvJlJI",
  });

  // await sheetsApi.spreadsheets.values.append({
  //   spreadsheetId,
  //   range: "Sheet1!A1",
  //   valueInputOption: "USER_ENTERED",
  //   requestBody: {
  //     values: [
  //       ["Name", "Email", "Dat"],
  //       ["Alice", "alice@example.com", new Date().toISOString()],
  //     ],
  //   },
  // });

  const {sheets } = await manager.listSheets({});
  console.log(sheets);
}

main().catch(console.error);
