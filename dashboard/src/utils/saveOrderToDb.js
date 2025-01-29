export const saveOrderToDB = async (sortedData) => {
  try {
    const response = await fetch("/api/update-sorting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sortedData),
    });

    if (!response.ok) {
      throw new Error("Failed to update sorting order");
    }

    console.log("Sorting order updated successfully");
  } catch (error) {
    console.error("Error saving sorting order:", error);
  }
};
