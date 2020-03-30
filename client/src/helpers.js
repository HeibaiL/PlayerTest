const getVideoId = ref => {
  if (!ref) return;
  let strId;
  const startIndex = ref.indexOf("v=") + 2;
  const endIndex = ref.indexOf("&", startIndex);

  if (endIndex === -1) {
    return (strId = ref.slice(startIndex));
  }

  strId = ref.slice(startIndex, endIndex);
  return strId;
};

const fetchData = (url, requestBody) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });
};
module.exports = { getVideoId,fetchData };
