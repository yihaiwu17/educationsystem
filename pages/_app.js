import '../styles/globals.css'
import React from "react";
import App from "next/app";
import "../styles/antd.less";
import { makeServer } from "../mock/mirage"

if (process.env.NODE_ENV === "development") {
  makeServer({ environment: "development" })
}

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return <Component {...pageProps} />;
  }
}

export default MyApp;