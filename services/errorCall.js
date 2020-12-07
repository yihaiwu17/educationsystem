export default function errorHandler(err) {
  const msg = err.response.data.msg;
  const code = err.response.status;

  return { msg, code };
}
