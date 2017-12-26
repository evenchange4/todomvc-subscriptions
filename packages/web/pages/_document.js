import * as React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <title>TodoMVC • Subscriptions</title>
          <meta
            name="description"
            content="Fullstack TodoMVC with GraphQL subscriptions."
          />
          {this.props.styleTags}
          <link
            rel="stylesheet"
            href="https://unpkg.com/todomvc-app-css@2.1.0/index.css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
