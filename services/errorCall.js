import { message } from "antd";

export default function errorHandler(err) {
  const msg = err.response.data.msg;
  const code = err.response.status;
    message.error(msg)
  return { msg, code };
}
