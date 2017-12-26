import * as React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  // static getInitialProps ({ renderPage }) {
  //   const sheet = new ServerStyleSheet()
  //   const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
  //   const styleTags = sheet.getStyleElement()
  //   return { ...page, styleTags }
  // }

  render() {
    return (
      <html lang="en">
        <Head>
          <title>My page</title>
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
