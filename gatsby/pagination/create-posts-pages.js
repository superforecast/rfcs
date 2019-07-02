'use strict';

const path = require('path');
const siteConfig = require('../../config.js');
const urljoin = require('url-join');

module.exports = async (graphql, actions) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMarkdownRemark(
        filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
      ) { totalCount }
    }
  `);

  const { postsPerPage } = siteConfig;
  const numPages = Math.ceil(result.data.allMarkdownRemark.totalCount / postsPerPage);

  const basePath = '/';

  for (let i = 0; i < numPages; i += 1) {
    createPage({
      path: i === 0 ? basePath : `${basePath}/page/${i}`,
      component: path.resolve('./src/templates/index-template.js'),
      context: {
        currentPage: i,
        postsLimit: postsPerPage,
        postsOffset: i * postsPerPage,
        prevPagePath: i <= 1 ? basePath : `${basePath}/page/${i - 1}`,
        nextPagePath: `${basePath}/page/${i + 1}`,
        hasPrevPage: i !== 0,
        hasNextPage: i !== numPages - 1
      }
    });
  }
};
