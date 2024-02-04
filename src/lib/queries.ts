import { gql } from "@apollo/client";

// Hashnode API
export const GET_ARTICLES = gql`
  query getArticles {
    user(username: "username") {
      publication {
        posts {
          title
          brief
          slug
          coverImage
          cuid
          dateAdded
          dateUpdated
          totalReactions
          totalResponses
          responseCount
        }
      }
    }
  }
`;

export const GET_PUBLICATIONS = gql`
  query {
    me {
      publications(first: 10) {
        edges {
          node {
            title
            url
          }
        }
      }
    }
  }
`;

export const GET_ALL_DRAFTS = gql`
  query ($host: String!, $after: String) {
    publication(host: $host) {
      drafts(first: 20, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            id
            title
            subtitle
            updatedAt
            readTimeInMinutes
            slug
            canonicalUrl
            coverImage {
              url
            }
            settings {
              disableComments
              stickCoverToBottom
              isDelisted
            }
            seo {
              title
              description
            }
            ogMetaData {
              image
            }
            features {
              tableOfContents {
                isEnabled
              }
            }
          }
        }
      }
    }
  }
`;
