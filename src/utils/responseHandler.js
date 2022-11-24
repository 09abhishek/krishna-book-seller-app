const handleResponse = (status, data, message, operation = "") => {
  if (operation !== "") {
    return {
      status,
      data: data || null,
      message,
    };
  }
  if (data && data.length) {
    message = "Data Fetched Successfully";
  } else {
    message = "No Data Found";
  }
  return {
    status,
    data: data || null,
    message,
  };
};

module.exports = {
  handleResponse,
};
