export function generateReferenceNumber() {
  // Get the current date
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2); // Get last 2 digits of the year
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const day = String(now.getDate()).padStart(2, "0");

  // Format the date as YYMMDD
  const formattedDate = `${year}${month}${day}`;

  // Generate a random number between 0 and 999999
  const randomNum = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  // Combine the formatted date and random number to form the reference number
  const referenceNumber = `${formattedDate}-${randomNum}`;

  return referenceNumber;
  // Example output: "240724-482938"
}
