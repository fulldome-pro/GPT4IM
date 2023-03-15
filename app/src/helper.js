function getCurrentDateFormatted() {
    // Create a new Date object
    const now = new Date();

    // Get the year, month (0-indexed), and day from the Date object
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    // Pad the month and day with leading zeros if they are single digit
    const formattedMonth = `${month < 10 ? "0" : ""}${month}`;
    const formattedDay = `${day < 10 ? "0" : ""}${day}`;

    // Combine the year, month, and day with hyphens to form the date string
    const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

    // Return the formatted date string
    return formattedDate;
}


module.exports = {
    getCurrentDateFormatted
};
