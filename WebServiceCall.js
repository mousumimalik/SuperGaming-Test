const WebServiceCall = async (options) => {
  const { url, ...otherOptions } = options;
  let response = await fetch(url, otherOptions);
  if (
    response.status === 404 ||
    response.status === 409 ||
    response.status === 202
  ) {
    return { status: response.status };
  }
  let data = await response.json();
  return data;
};

export default WebServiceCall;
