import React, {Component} from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    initialPageProps: PropTypes.any
  };

  render() {
    const {assets, component, initialPageProps} = this.props;
    const head = Helmet.rewind();
    const mainScripts = Object.values(assets.javascript)
      .reverse()
      .filter(assetPath => assetPath.indexOf('chunk') === -1);

    return (
      <html lang="en-us">
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}

          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8"/>
          {mainScripts.map((assetPath) =>
            <link crossOrigin="anonymous" href={assetPath} rel="preload" as="script" charSet="UTF-8"/>
          )}
          {/* styles (will be present only in production with webpack extract text plugin) */}
          {Object.keys(assets.styles).map((style, key) =>
            <link href={assets.styles[style]} key={key} media="screen, projection"
                  rel="stylesheet" type="text/css" charSet="UTF-8"/>
          )}

          {/* (will be present only in development mode) */}
          {/* outputs a <style/> tag with all bootstrap styles + App.scss + it could be CurrentPage.scss. */}
          {/* can smoothen the initial style flash (flicker) on page load in development mode. */}
          {/* ideally one could also include here the style for the current page (Home.scss, About.scss, etc) */}
          <script crossOrigin="anonymous" src={assets.javascript.manifest} charSet="UTF-8"/>
          <script crossOrigin="anonymous" src={assets.javascript.preboot} charSet="UTF-8"/>
          <script crossOrigin="anonymous" src={assets.javascript.prebootInit} charSet="UTF-8"/>
        </head>
        <body>
          <div id="content">
            {component}
          </div>
          {initialPageProps &&
            <script
              crossOrigin="anonymous"
              dangerouslySetInnerHTML={{__html: `window.__INITIAL_PAGE_PROPS__=${serialize(initialPageProps)};`}}
              charSet="UTF-8"/>
          }
          <script crossOrigin="anonymous" src={assets.javascript.vendor} charSet="UTF-8"/>
          <script crossOrigin="anonymous" src={assets.javascript.main} charSet="UTF-8"/>
        </body>
      </html>
    );
  }
}
